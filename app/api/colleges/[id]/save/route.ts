import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";

const paramsSchema = z.object({
	id: z.string().min(1),
});

const getUserId = async (req: NextRequest) => {
	const authHeader = req.headers.get("authorization");
	const bearerToken = authHeader?.toLowerCase().startsWith("bearer ")
		? authHeader.slice(7)
		: null;
	const cookieToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
	const token = bearerToken ?? cookieToken;

	if (!token) {
		return null;
	}

	const payload = await verifyAccessToken(token);
	return payload?.sub ?? null;
};

const resolveCollegeId = async (
	req: NextRequest,
	params: { id?: string } | Promise<{ id?: string }>,
) => {
	const resolvedParams = await Promise.resolve(params);
	const idFromParams = resolvedParams?.id;
	if (idFromParams) {
		return idFromParams;
	}
	const segments = req.nextUrl.pathname.split("/").filter(Boolean);
	const idFromPath = segments.length >= 3 ? segments[segments.length - 2] : null;
	return idFromPath ?? null;
};

export async function POST(
	req: NextRequest,
	{ params }: { params: { id?: string } | Promise<{ id?: string }> },
) {
	const id = await resolveCollegeId(req, params);
	const parsed = paramsSchema.safeParse({ id });
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid college" }, { status: 400 });
	}

	const userId = await getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const college = await prisma.college.findUnique({
		where: { id: parsed.data.id },
		select: { id: true },
	});

	if (!college) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await prisma.savedItem.upsert({
		where: { userId_collegeId: { userId, collegeId: parsed.data.id } },
		update: {},
		create: { userId, collegeId: parsed.data.id },
	});

	return NextResponse.json({ saved: true });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id?: string } | Promise<{ id?: string }> },
) {
	const id = await resolveCollegeId(req, params);
	const parsed = paramsSchema.safeParse({ id });
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid college" }, { status: 400 });
	}

	const userId = await getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await prisma.savedItem.deleteMany({
		where: { userId, collegeId: parsed.data.id },
	});

	return NextResponse.json({ saved: false });
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id?: string } | Promise<{ id?: string }> },
) {
	const id = await resolveCollegeId(req, params);
	const parsed = paramsSchema.safeParse({ id });
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid college" }, { status: 400 });
	}

	const userId = await getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const savedItem = await prisma.savedItem.findUnique({
		where: { userId_collegeId: { userId, collegeId: parsed.data.id } },
		select: { id: true },
	});

	return NextResponse.json({ saved: Boolean(savedItem) });
}
