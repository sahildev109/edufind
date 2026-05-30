import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
	ACCESS_TOKEN_COOKIE,
	ACCESS_TOKEN_TTL_SECONDS,
	REFRESH_TOKEN_COOKIE,
	REFRESH_TOKEN_TTL_DAYS,
	signAccessToken,
} from "@/lib/auth";

const prisma = new PrismaClient();

const clearAuthCookies = (response: NextResponse) => {
	response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: new Date(0),
	});
	response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: new Date(0),
	});
};

export async function POST(req: NextRequest) {
	const token = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

	if (!token) {
		const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		clearAuthCookies(response);
		return response;
	}

	const storedToken = await prisma.refreshToken.findUnique({
		where: { token },
	});

	if (!storedToken || storedToken.expiresAt < new Date()) {
		if (storedToken) {
			await prisma.refreshToken.delete({ where: { token } });
		}
		const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		clearAuthCookies(response);
		return response;
	}

	const user = await prisma.user.findUnique({ where: { id: storedToken.userId } });
	if (!user) {
		const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		clearAuthCookies(response);
		return response;
	}

	const accessToken = await signAccessToken({
		userId: user.id,
		email: user.email,
		role: user.role,
	});
	const newRefreshToken = crypto.randomUUID();
	const refreshExpiresAt = new Date(
		Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
	);

	await prisma.$transaction([
		prisma.refreshToken.delete({ where: { token } }),
		prisma.refreshToken.create({
			data: {
				token: newRefreshToken,
				userId: user.id,
				expiresAt: refreshExpiresAt,
			},
		}),
	]);

	const response = NextResponse.json({
		accessToken,
		user: { id: user.id, email: user.email, name: user.name, role: user.role },
	});

	const secure = process.env.NODE_ENV === "production";
	response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
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
