import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";

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
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
