import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CollegeType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const sortSchema = z.enum([
	"nirf_rank",
	"rating",
	"fees_asc",
	"fees_desc",
	"package",
]);

const querySchema = z.object({
	q: z.string().trim().min(1).optional(),
	state: z.array(z.string().min(1)).optional(),
	type: z.array(z.nativeEnum(CollegeType)).optional(),
	category: z.array(z.string().min(1)).optional(),
	feesMin: z.coerce.number().int().min(0).optional(),
	feesMax: z.coerce.number().int().min(0).optional(),
	naac: z.array(z.string().min(1)).optional(),
	sort: sortSchema.optional(),
	cursor: z.string().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(48).default(12),
});

const normalizeList = (values: string[]) => {
	const flattened = values
		.flatMap((value) => value.split(","))
		.map((value) => value.trim())
		.filter(Boolean);
	return flattened.length ? flattened : undefined;
};

const buildWhere = (filters: z.infer<typeof querySchema>) => {
	const where: Prisma.CollegeWhereInput = {};

	if (filters.q) {
		where.OR = [
			{ name: { search: filters.q } },
			{ city: { search: filters.q } },
			{ state: { search: filters.q } },
		];
	}

	if (filters.state?.length) {
		where.state = { in: filters.state };
	}

	if (filters.type?.length) {
		where.type = { in: filters.type };
	}

	if (filters.category?.length) {
		where.category = { in: filters.category };
	}

	if (filters.naac?.length) {
		where.naacGrade = { in: filters.naac };
	}

	if (filters.feesMin !== undefined) {
		where.feesMin = { gte: filters.feesMin };
	}

	if (filters.feesMax !== undefined) {
		where.feesMax = { lte: filters.feesMax };
	}

	return where;
};

const buildOrderBy = (sort?: z.infer<typeof sortSchema>) => {
	switch (sort) {
		case "rating":
			return { overallRating: "desc" } as const;
		case "fees_asc":
			return { feesMin: "asc" } as const;
		case "fees_desc":
			return { feesMax: "desc" } as const;
		case "package":
			return { avgPackageLpa: "desc" } as const;
		case "nirf_rank":
		default:
			return { nirfRank: "asc" } as const;
	}
};

export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;

	const rawInput = {
		q: params.get("q") ?? undefined,
		state: normalizeList(params.getAll("state")),
		type: normalizeList(params.getAll("type")) as CollegeType[] | undefined,
		category: normalizeList(params.getAll("category")),
		feesMin: params.get("feesMin") ?? undefined,
		feesMax: params.get("feesMax") ?? undefined,
		naac: normalizeList(params.getAll("naac")),
		sort: params.get("sort") ?? undefined,
		cursor: params.get("cursor") ?? undefined,
		limit: params.get("limit") ?? undefined,
	};

	const parsed = querySchema.safeParse(rawInput);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid query" }, { status: 400 });
	}

	const filters = parsed.data;
	const where = buildWhere(filters);
	const orderBy = buildOrderBy(filters.sort);

	const limit = filters.limit;
	const take = limit + 1;
	const cursor = filters.cursor ? { id: filters.cursor } : undefined;
	const skip = filters.cursor ? 1 : 0;

	const [items, totalCount] = await Promise.all([
		prisma.college.findMany({
			where,
			orderBy,
			take,
			skip,
			cursor,
			select: {
				id: true,
				slug: true,
				name: true,
				shortName: true,
				state: true,
				city: true,
				type: true,
				category: true,
				naacGrade: true,
				nirfRank: true,
				feesMin: true,
				feesMax: true,
				avgPackageLpa: true,
				maxPackageLpa: true,
				placementRate: true,
				overallRating: true,
				reviewCount: true,
				imageUrl: true,
			},
		}),
		prisma.college.count({ where }),
	]);

	const hasMore = items.length > limit;
	const data = hasMore ? items.slice(0, limit) : items;
	const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null;

	return NextResponse.json({
		data,
		nextCursor,
		totalCount,
		hasMore,
	});
}
