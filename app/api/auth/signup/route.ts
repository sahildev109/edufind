import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
	ACCESS_TOKEN_COOKIE,
	ACCESS_TOKEN_TTL_SECONDS,
	REFRESH_TOKEN_COOKIE,
	REFRESH_TOKEN_TTL_DAYS,
	signAccessToken,
} from "@/lib/auth";

const prisma = new PrismaClient();

const signupSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
});

export async function POST(req: Request) {
	const body = await req.json().catch(() => null);
	const parsed = signupSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}

	const { name, email, password } = parsed.data;
	const existing = await prisma.user.findUnique({ where: { email } });

	if (existing) {
		return NextResponse.json({ error: "Email already in use" }, { status: 409 });
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: { name, email, passwordHash },
	});

	const accessToken = await signAccessToken({
		userId: user.id,
		email: user.email,
		role: user.role,
	});

	const refreshToken = crypto.randomUUID();
	const refreshExpiresAt = new Date(
		Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
	);

	await prisma.refreshToken.create({
		data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiresAt },
	});

	const response = NextResponse.json({
		accessToken,
		user: { id: user.id, email: user.email, name: user.name, role: user.role },
	});

	const secure = process.env.NODE_ENV === "production";
	response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
		httpOnly: true,
		sameSite: "lax",
		secure,
		path: "/",
		expires: refreshExpiresAt,
	});

	response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
		httpOnly: true,
		sameSite: "lax",
		secure,
		path: "/",
		maxAge: ACCESS_TOKEN_TTL_SECONDS,
	});

	return response;
}
