import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const header = req.headers.get("authorization");
  const bearerToken = header?.toLowerCase().startsWith("bearer ")
    ? header.slice(7)
    : null;
  const cookieToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const token = bearerToken ?? cookieToken;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyAccessToken(token);
  if (!payload?.sub) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
