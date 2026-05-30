"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
};

type CollegeCardData = {
	name?: string;
	city?: string;
	state?: string;
	nirfRank?: string;
	feesPerYear?: string;
	avgPackageLpa?: string;
	jeeMainCutoff?: string;
	jeeAdvCutoff?: string;
	naacGrade?: string;
	safety?: string;
	reason?: string;
	slug?: string;
};

const toArray = (value: string) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

const createId = () =>
	globalThis.crypto?.randomUUID?.() ?? `msg_${Date.now()}_${Math.random()}`;

const safetyStyles: Record<string, string> = {
	safe: "bg-emerald-100 text-emerald-700",
	borderline: "bg-amber-100 text-amber-700",
	risky: "bg-rose-100 text-rose-700",
};

const toKey = (value: string) => value.toLowerCase().replace(/\s+/g, "");

const parseCollegeBlocks = (content: string) => {
	const blocks = content.match(/<college>[\s\S]*?<\/college>/gi) ?? [];
	if (!blocks.length) {
		return { cards: [], markdown: content };
	}

	const cards = blocks
		.map((block) => {
			const raw = block.replace(/<\/?college>/gi, "").trim();
			const lines = raw.split(/\r?\n/);
			const data: CollegeCardData = {};

			for (const line of lines) {
				const trimmed = line.trim().replace(/^[-*]\s+/, "");
				if (!trimmed) {
					continue;
				}
				const separatorIndex = trimmed.indexOf(":");
				if (separatorIndex === -1) {
					continue;
				}
				const key = toKey(trimmed.slice(0, separatorIndex));
				const value = trimmed.slice(separatorIndex + 1).trim();
				if (!value) {
					continue;
				}

				switch (key) {
					case "name":
						data.name = value;
						break;
					case "city":
						data.city = value;
						break;
					case "state":
						data.state = value;
						break;
					case "nirfrank":
					case "nirf":
						data.nirfRank = value;
						break;
					case "feesperyear":
					case "fees":
						data.feesPerYear = value;
						break;
					case "avgpackagelpa":
					case "averagepackagelpa":
						data.avgPackageLpa = value;
						break;
					case "jeemaincutoff":
						data.jeeMainCutoff = value;
						break;
					case "jeeadvcutoff":
					case "jeeadvancedcutoff":
						data.jeeAdvCutoff = value;
						break;
					case "naacgrade":
						data.naacGrade = value;
						break;
					case "safety":
						data.safety = value;
						break;
					case "reason":
					case "why":
						data.reason = value;
						break;
					case "slug":
						data.slug = value;
						break;
					default:
						break;
				}
			}

			return data;
		})
		.filter((card) => card.name);

	let markdown = content;
	for (const block of blocks) {
		markdown = markdown.replace(block, "");
	}

	return { cards, markdown: markdown.trim() };
};

const formatNumber = (value?: string) => {
	if (!value) {
		return undefined;
	}
	const cleaned = value.replace(/[^0-9.]/g, "");
	const numberValue = Number(cleaned);
	if (!Number.isFinite(numberValue)) {
		return value;
	}
	return new Intl.NumberFormat("en-IN").format(numberValue);
};

const MarkdownComponents: Components = {
	p: ({ children }) => (
		<p className="text-sm leading-6 text-slate-700">{children}</p>
	),
	ul: ({ children }) => (
		<ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="leading-6">{children}</li>,
	h3: ({ children }) => (
		<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
			{children}
		</h3>
	),
	a: ({ children, href }) => (
		<a
			href={href}
			className="text-slate-900 underline decoration-slate-300 underline-offset-4"
		>
			{children}
		</a>
	),
	strong: ({ children }) => (
		<strong className="font-semibold text-slate-900">{children}</strong>
	),
};

const CollegeCard = ({ college }: { college: CollegeCardData }) => {
	const safety = college.safety?.toLowerCase();
	const safetyClass = safety ? safetyStyles[safety] : undefined;
	const fees = formatNumber(college.feesPerYear);
	const avgPackage = formatNumber(college.avgPackageLpa);
	const nirfRank = formatNumber(college.nirfRank);
	const mainCutoff = formatNumber(college.jeeMainCutoff);
	const advCutoff = formatNumber(college.jeeAdvCutoff);

	return (
		<Card className="border border-slate-200 bg-white">
			<CardHeader className="pb-2">
				<CardTitle>{college.name}</CardTitle>
				{(college.city || college.state) && (
					<CardDescription>
						{[college.city, college.state].filter(Boolean).join(", ")}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					{nirfRank && (
						<Badge variant="secondary">NIRF #{nirfRank}</Badge>
					)}
					{college.naacGrade && (
						<Badge variant="outline">NAAC {college.naacGrade}</Badge>
					)}
					{college.safety && (
						<Badge className={safetyClass}>
							{college.safety}
						</Badge>
					)}
				</div>
				<div className="space-y-1 text-xs text-slate-600">
					{fees && <p>Fees per year: Rs {fees}</p>}
					{avgPackage && <p>Avg package: {avgPackage} LPA</p>}
					{mainCutoff && <p>JEE Main cutoff: {mainCutoff}</p>}
					{advCutoff && <p>JEE Adv cutoff: {advCutoff}</p>}
				</div>
				{college.reason && (
					<p className="text-sm text-slate-700">{college.reason}</p>
				)}
			</CardContent>
			{college.slug && (
				<CardFooter className="bg-slate-50">
					<Button
						size="sm"
						render={<Link href={`/colleges/${college.slug}`} />}
					>
						View details
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};

export default function CounselorChat() {
	const [examType, setExamType] = useState("JEE Main");
	const [examRank, setExamRank] = useState("");
	const [budget, setBudget] = useState("");
	const [states, setStates] = useState("");
	const [branches, setBranches] = useState("");

	const profile = useMemo(
		() => ({
			examType,
			examRank: examRank ? Number(examRank) : undefined,
			budgetLpa: budget ? Number(budget) : undefined,
			preferredStates: toArray(states),
			preferredBranches: toArray(branches),
		}),
		[examType, examRank, budget, states, branches],
	);

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		const loadHistory = async () => {
			try {
				const response = await fetch("/api/ai/counsel/history", {
					signal: controller.signal,
				});

				if (response.status === 401) {
					setIsAuthenticated(false);
					return;
				}

				if (!response.ok) {
					return;
				}

				setIsAuthenticated(true);

				const data = (await response.json()) as {
					messages?: ChatMessage[];
				};

				if (data.messages?.length) {
					setMessages(data.messages);
				}
			} catch (err) {
				if ((err as Error).name !== "AbortError") {
					return;
				}
			}
		};

		loadHistory();
		return () => controller.abort();
	}, []);

	const saveHistory = async (newMessages: Array<Omit<ChatMessage, "id">>) => {
		try {
			await fetch("/api/ai/counsel/history", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: newMessages }),
			});
		} catch {
			// Swallow errors to avoid blocking the chat UI.
		}
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const text = input.trim();
		if (!text || isLoading) {
			return;
		}

		const userMessage: ChatMessage = {
			id: createId(),
			role: "user",
			content: text,
		};
		const assistantId = createId();

		setMessages((prev) => [
			...prev,
			userMessage,
			{ id: assistantId, role: "assistant", content: "" },
		]);
		setInput("");
		setError(null);
		setIsLoading(true);

		try {
			const response = await fetch("/api/ai/counsel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					profile,
					messages: [...messages, userMessage].map((message) => ({
						role: message.role,
						content: message.content,
					})),
				}),
			});

			if (!response.ok || !response.body) {
				throw new Error("Unable to reach the counselor right now.");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let content = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					break;
				}
				content += decoder.decode(value, { stream: true });
				setMessages((prev) =>
					prev.map((message) =>
						message.id === assistantId
							? { ...message, content }
							: message,
					),
				);
			}

			if (content.trim()) {
				await saveHistory([
					{ role: "user", content: userMessage.content },
					{ role: "assistant", content },
				]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setMessages((prev) => prev.filter((message) => message.id !== assistantId));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
			<div className="hidden lg:block">
				<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						Student profile
					</p>
					<div className="mt-4 space-y-4 text-sm">
						<div>
							<label className="text-xs font-semibold text-slate-500">Exam</label>
							<Input value={examType} onChange={(e) => setExamType(e.target.value)} />
						</div>
						<div>
							<label className="text-xs font-semibold text-slate-500">Rank</label>
							<Input
								value={examRank}
								onChange={(e) => setExamRank(e.target.value)}
								placeholder="e.g. 12450"
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-slate-500">
								Budget (LPA)
							</label>
							<Input
								value={budget}
								onChange={(e) => setBudget(e.target.value)}
								placeholder="e.g. 2.5"
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-slate-500">
								Preferred states
							</label>
							<Input
								value={states}
								onChange={(e) => setStates(e.target.value)}
								placeholder="Maharashtra, Delhi"
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-slate-500">
								Preferred branches
							</label>
							<Input
								value={branches}
								onChange={(e) => setBranches(e.target.value)}
								placeholder="CSE, ECE"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
							AI counselor
						</p>
						<h1 className="text-2xl font-semibold text-slate-900">
							Personalized college guidance
						</h1>
					</div>
					<Sheet>
						<SheetTrigger
							render={<Button variant="outline" className="lg:hidden" />}
						>
							Edit profile
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Student profile</SheetTitle>
							</SheetHeader>
							<div className="mt-6 space-y-4 text-sm">
								<div>
									<label className="text-xs font-semibold text-slate-500">Exam</label>
									<Input value={examType} onChange={(e) => setExamType(e.target.value)} />
								</div>
								<div>
									<label className="text-xs font-semibold text-slate-500">Rank</label>
									<Input
										value={examRank}
										onChange={(e) => setExamRank(e.target.value)}
										placeholder="e.g. 12450"
									/>
								</div>
								<div>
									<label className="text-xs font-semibold text-slate-500">
										Budget (LPA)
									</label>
									<Input
										value={budget}
										onChange={(e) => setBudget(e.target.value)}
										placeholder="e.g. 2.5"
									/>
								</div>
								<div>
									<label className="text-xs font-semibold text-slate-500">
										Preferred states
									</label>
									<Input
										value={states}
										onChange={(e) => setStates(e.target.value)}
										placeholder="Maharashtra, Delhi"
									/>
								</div>
								<div>
									<label className="text-xs font-semibold text-slate-500">
										Preferred branches
									</label>
									<Input
										value={branches}
										onChange={(e) => setBranches(e.target.value)}
										placeholder="CSE, ECE"
									/>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>

				<div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex flex-wrap gap-2 text-xs text-slate-500">
						{profile.preferredStates?.map((state) => (
							<Badge key={state} variant="secondary">
								{state}
							</Badge>
						))}
						{profile.preferredBranches?.map((branch) => (
							<Badge key={branch} variant="outline">
								{branch}
							</Badge>
						))}
					</div>

					<div className="max-h-105 space-y-4 overflow-y-auto pr-1">
						{messages.map((message) => {
							const isUser = message.role === "user";
							const { cards, markdown } = isUser
								? { cards: [], markdown: message.content }
								: parseCollegeBlocks(message.content);

							return (
								<div
									key={message.id}
									className={
										isUser
											? "ml-auto w-fit max-w-[80%] rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white"
											: "mr-auto w-full max-w-[80%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800"
									}
								>
									{isUser ? (
										message.content
									) : (
										<div className="space-y-4">
											{cards.length > 0 && (
												<div className="grid gap-3 sm:grid-cols-2">
													{cards.map((college, index) => (
														<CollegeCard
															key={`${college.slug ?? "college"}-${index}`}
															college={college}
														/>
													))}
												</div>
											)}
											{markdown && (
												<ReactMarkdown
													remarkPlugins={[remarkGfm]}
													skipHtml
													components={MarkdownComponents}
												>
													{markdown}
												</ReactMarkdown>
											)}
										</div>
									)}
								</div>
							);
						})}
						{isLoading && (
							<div className="w-fit rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800">
								Typing...
							</div>
						)}
					</div>

					{error && (
						<p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</p>
					)}

					<form onSubmit={onSubmit} className="space-y-3">
						<Textarea
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder="Ask about colleges, cutoffs, or placements..."
							rows={3}
						/>
						<Button type="submit" disabled={isLoading || !input.trim()}>
							Send
						</Button>
					</form>

					{isAuthenticated === false && (
						<div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
							History is saved only for authenticated users. {" "}
							<Link href="/login" className="font-semibold underline">
								Log in
							</Link>{" "}
							to keep your chats.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
