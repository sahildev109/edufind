import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";

const MAX_MESSAGES = 30;

const messageSchema = z.object({
	role: z.enum(["user", "assistant"]),
	content: z.string().min(1),
});

const bodySchema = z.object({
	messages: z.array(messageSchema).min(1),
});

const getUserId = async (req: NextRequest) => {
	const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
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

	const thread = await prisma.counselorThread.findUnique({
		where: { userId },
		include: {
			messages: {
				orderBy: { createdAt: "desc" },
				take: MAX_MESSAGES,
			},
		},
	});

	if (!thread) {
		return NextResponse.json({ messages: [] });
	}

	const messages = thread.messages
		.slice()
		.reverse()
		.map((message) => ({
			id: message.id,
			role: message.role,
			content: message.content,
		}));

	return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
	const userId = await getUserId(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json().catch(() => null);
	const parsed = bodySchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const messages = parsed.data.messages;

	await prisma.$transaction(async (tx) => {
		const thread = await tx.counselorThread.upsert({
			where: { userId },
			create: { userId },
			update: { updatedAt: new Date() },
		});

		await tx.counselorMessage.createMany({
			data: messages.map((message) => ({
				threadId: thread.id,
				role: message.role,
				content: message.content,
			})),
		});

		const totalCount = await tx.counselorMessage.count({
			where: { threadId: thread.id },
		});

		if (totalCount > MAX_MESSAGES) {
			const excess = totalCount - MAX_MESSAGES;
			const oldest = await tx.counselorMessage.findMany({
				where: { threadId: thread.id },
				orderBy: { createdAt: "asc" },
				take: excess,
				select: { id: true },
			});

			await tx.counselorMessage.deleteMany({
				where: { id: { in: oldest.map((message) => message.id) } },
			});
		}
	});

	return NextResponse.json({ ok: true });
}
