import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";

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

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
