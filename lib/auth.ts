import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const accessTokenTtlSeconds = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);
const refreshTokenTtlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7);

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const ACCESS_TOKEN_TTL_SECONDS = accessTokenTtlSeconds;
export const REFRESH_TOKEN_TTL_DAYS = refreshTokenTtlDays;

const getAccessSecret = () => {
	const secret = process.env.JWT_ACCESS_SECRET;
	if (!secret) {
		throw new Error("JWT_ACCESS_SECRET is not set");
	}
	return new TextEncoder().encode(secret);
};

export type AccessTokenPayload = JWTPayload & {
	role?: string;
	email?: string;
};

export const signAccessToken = async (payload: {
	userId: string;
	email: string;
	role: string;
}) =>
	new SignJWT({ email: payload.email, role: payload.role })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.userId)
		.setIssuedAt()
		.setExpirationTime(`${accessTokenTtlSeconds}s`)
		.sign(getAccessSecret());

export const verifyAccessToken = async (token: string) => {
	try {
		const { payload } = await jwtVerify(token, getAccessSecret());
		return payload as AccessTokenPayload;
	} catch {
		return null;
	}
};
