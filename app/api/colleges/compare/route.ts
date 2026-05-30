import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const idsSchema = z.array(z.string().min(1)).min(1).max(3);

const normalizeList = (values: string[]) => {
	const flattened = values
		.flatMap((value) => value.split(","))
		.map((value) => value.trim())
		.filter(Boolean);
	return Array.from(new Set(flattened));
};

export async function GET(req: NextRequest) {
	const rawIds = normalizeList(req.nextUrl.searchParams.getAll("ids"));
	const parsed = idsSchema.safeParse(rawIds);

	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
	}

	const ids = parsed.data;

	const colleges = await prisma.college.findMany({
		where: { id: { in: ids } },
		include: {
			placements: { orderBy: { year: "desc" }, take: 1 },
		},
	});

	const byId = new Map(colleges.map((college) => [college.id, college]));

	const data = ids
		.map((id) => byId.get(id))
		.filter(Boolean)
		.map((college) => {
			const placement = college!.placements[0];
			return {
				id: college!.id,
				slug: college!.slug,
				name: college!.name,
				city: college!.city,
				state: college!.state,
				type: college!.type,
				category: college!.category,
				naacGrade: college!.naacGrade,
				nirfRank: college!.nirfRank,
				feesMin: college!.feesMin,
				feesMax: college!.feesMax,
				avgPackageLpa: college!.avgPackageLpa,
				maxPackageLpa: college!.maxPackageLpa,
				placementRate: college!.placementRate,
				overallRating: college!.overallRating,
				reviewCount: college!.reviewCount,
				topRecruiters: placement?.topRecruiters?.slice(0, 5) ?? [],
			};
		});

	return NextResponse.json({ data });
}
