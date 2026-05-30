import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";
import { buildCounselorContext, buildCounselorPrompt } from "@/lib/gemini";

export const runtime = "nodejs";

const messageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string().min(1),
});

const profileSchema = z.object({
	examType: z.string().trim().optional(),
	examRank: z.number().int().nonnegative().optional(),
	budgetLpa: z.number().nonnegative().optional(),
	preferredStates: z.array(z.string().trim().min(1)).optional(),
	preferredBranches: z.array(z.string().trim().min(1)).optional(),
});

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1),
	profile: profileSchema.optional(),
});

const getRateLimitId = async (req: NextRequest) => {
	const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
	const payload = token ? await verifyAccessToken(token) : null;
	const userId = payload?.sub;
	if (userId) {
		return `user:${userId}`;
	}
	const forwarded = req.headers.get("x-forwarded-for");
	const ip = forwarded?.split(",")[0]?.trim();
	return `anon:${ip ?? "unknown"}`;
};

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(10, "1 h"),
	analytics: true,
});

export async function POST(req: NextRequest) {
	const id = await getRateLimitId(req);
	const { success } = await ratelimit.limit(id);

	if (!success) {
		return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
	}

	const body = await req.json().catch(() => null);
	const parsed = bodySchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const profile = parsed.data.profile ?? {};
	const context = await buildCounselorContext(profile);
	const systemPrompt = buildCounselorPrompt(profile, context);

	const result = await streamText({
		model: google("gemini-2.5-flash"),
		system: systemPrompt,
		messages: parsed.data.messages.map((message) => ({
			role: message.role,
			content: message.content,
		})),
	});

	return result.toTextStreamResponse({
		headers: {
			"Cache-Control": "no-cache",
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}
