import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featureCards = [
	{
		title: "College listing + search",
		description:
			"Multi-dimensional filters, full-text search, and cursor pagination for O(1) scroll performance.",
		badge: "SSR + cursor",
	},
	{
		title: "College detail pages",
		description:
			"ISR with 60s revalidation, tabbed sections, placements, reviews, and course-level cutoffs.",
		badge: "ISR 60s",
	},
	{
		title: "Compare up to 3 colleges",
		description:
			"Side-by-side metrics powered by a persisted compare store and a single batched API fetch.",
		badge: "Zustand + CSR",
	},
	{
		title: "Authentication + saved items",
		description:
			"JWT access tokens with refresh rotation, protected dashboard, and optimistic save/unsave.",
		badge: "JWT rotation",
	},
];

const counselorSteps = [
	{
		title: "Profile-based shortlisting",
		description:
			"Rank, budget, state, and branch preferences shape a grounded shortlist from the real database.",
	},
	{
		title: "Cutoff safety analysis",
		description:
			"Every recommendation includes safe/borderline/risky guidance based on historical cutoffs.",
	},
	{
		title: "Tradeoff explanations",
		description:
			"Clear pros/cons: placements vs fees, location vs campus life, brand vs flexibility.",
	},
	{
		title: "Follow-up conversations",
		description:
			"Multi-turn context lets students ask real questions and refine the shortlist fast.",
	},
];

const architectureHighlights = [
	{
		title: "Next.js 14 App Router",
		copy:
			"Server Components by default, client components only for interactivity, and streaming where it matters.",
	},
	{
		title: "Prisma + Neon Postgres",
		copy:
			"Normalized schema with indexes on every filterable column for fast listing queries.",
	},
	{
		title: "RAG-lite context injection",
		copy:
			"Gemini 2.5 Flash is grounded with top 20 matching colleges as structured JSON.",
	},
	{
		title: "Security + validation",
		copy:
			"Zod validation, rate limiting via Upstash, and httpOnly cookies for refresh tokens.",
	},
];

export default function HomePage() {
	return (
		<div className="space-y-10">
			<section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
				<div className="absolute -top-20 right-[-6rem] h-64 w-64 rounded-full bg-gradient-to-br from-amber-200/40 via-white/60 to-slate-100 blur-3xl" />
				<div className="absolute bottom-[-5rem] left-[-3rem] h-64 w-64 rounded-full bg-gradient-to-br from-emerald-100/60 via-white/70 to-slate-100 blur-3xl" />
				<div className="relative space-y-6">
					<div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						<span>EduFind</span>
						<span className="h-1 w-1 rounded-full bg-slate-300" />
						<span>College discovery platform</span>
					</div>
					<h1 className="text-3xl font-semibold text-slate-900 md:text-4xl lg:text-5xl">
						Find the right college with data, not guesswork.
					</h1>
					<p className="max-w-2xl text-base text-slate-600 md:text-lg">
						EduFind blends fast search, deep college profiles, and a Gemini-powered AI
						counselor that explains cutoffs, tradeoffs, and fit - all grounded in real
						college data.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button size="lg" nativeButton={false} render={<Link href="/colleges" />}>
							Explore colleges
						</Button>
						<Button
							variant="outline"
							size="lg"
							nativeButton={false}
							render={<Link href="/counselor" />}
						>
							Try the AI counselor
						</Button>
					</div>
					<div className="grid gap-3 md:grid-cols-3">
						{[
							{
								label: "Cursor pagination",
								value: "O(1) infinite scroll",
							},
							{
								label: "ISR detail pages",
								value: "Revalidate every 60s",
							},
							{
								label: "AI counselor",
								value: "Gemini 2.5 Flash",
							},
						].map((item) => (
							<div
								key={item.label}
								className="rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
									{item.label}
								</p>
								<p className="mt-2 text-sm font-medium text-slate-900">
									{item.value}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						Core features
					</p>
					<h2 className="mt-3 text-2xl font-semibold text-slate-900">
						Everything a student needs to decide faster.
					</h2>
					<p className="mt-3 text-sm text-slate-600">
						The four production-grade pillars from the architecture document - plus the
						AI counselor that makes EduFind genuinely different.
					</p>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{featureCards.map((feature) => (
							<div
								key={feature.title}
								className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4"
							>
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-semibold text-slate-900">
										{feature.title}
									</h3>
									<Badge variant="secondary" className="bg-white text-slate-600">
										{feature.badge}
									</Badge>
								</div>
								<p className="mt-2 text-xs leading-5 text-slate-600">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-white shadow-sm md:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
						Why EduFind
					</p>
					<h3 className="mt-3 text-2xl font-semibold">
						No more filter fatigue.
					</h3>
					<p className="mt-3 text-sm text-slate-200">
						Most platforms force students to juggle 8-10 filters, scattered cutoffs, and
						manual comparisons. EduFind collapses that into a single, grounded
						conversation with real data.
					</p>
					<div className="mt-6 space-y-4">
						{[
							"Ranked recommendations with cutoff safety",
							"Tradeoff-aware guidance in plain language",
							"One shortlist that flows into compare and saved items",
						].map((item) => (
							<div
								key={item}
								className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
							>
								{item}
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
							AI counselor workflow
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-900">
							Gemini 2.5 Flash, grounded on real data.
						</h2>
					</div>
					<Badge className="bg-emerald-100 text-emerald-700">
						RAG-lite context injection
					</Badge>
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-2">
					{counselorSteps.map((step, index) => (
						<div
							key={step.title}
							className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-4"
						>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
								Step {index + 1}
							</p>
							<h3 className="mt-2 text-sm font-semibold text-slate-900">
								{step.title}
							</h3>
							<p className="mt-2 text-xs leading-5 text-slate-600">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						Architecture at a glance
					</p>
					<h2 className="mt-2 text-2xl font-semibold text-slate-900">
						Built for speed, clarity, and scale.
					</h2>
					<p className="mt-3 text-sm text-slate-600">
						The architecture splits concerns cleanly across SSR, ISR, CSR, and streaming
						API routes - keeping the UI fast and the data grounded.
					</p>
					<div className="mt-6 space-y-3">
						{architectureHighlights.map((item) => (
							<div
								key={item.title}
								className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3"
							>
								<p className="text-sm font-semibold text-slate-900">
									{item.title}
								</p>
								<p className="mt-1 text-xs leading-5 text-slate-600">
									{item.copy}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-amber-50 to-emerald-50 p-6 shadow-sm md:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						Rendering strategy
					</p>
					<h3 className="mt-2 text-2xl font-semibold text-slate-900">
						Right technique for every route.
					</h3>
					<div className="mt-6 grid gap-3">
						{[
							{
								label: "/colleges",
								value: "SSR for fresh search filters",
							},
							{
								label: "/colleges/[slug]",
								value: "ISR (60s) for fast, cached details",
							},
							{
								label: "/compare",
								value: "CSR for interactive comparisons",
							},
							{
								label: "/counselor",
								value: "Streaming AI responses",
							},
						].map((route) => (
							<div
								key={route.label}
								className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm"
							>
								<span className="font-semibold text-slate-900">
									{route.label}
								</span>
								<span className="text-xs text-slate-600">
									{route.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
							Safety + quality
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-900">
							Production-ready, not just pretty.
						</h2>
					</div>
					<Badge variant="secondary" className="bg-slate-100 text-slate-600">
						Zod + Upstash + JWT
					</Badge>
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{[
						"Zod validation on every API route",
						"Rate limiting: 10 AI req/hr, 100 API req/min",
						"httpOnly refresh tokens + JWT rotation",
						"React Server Components for data-heavy views",
						"Next/image with WebP + lazy loading",
						"TanStack Query staleTime tuned for UX",
					].map((item) => (
						<div
							key={item}
							className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-xs text-slate-600"
						>
							{item}
						</div>
					))}
				</div>
			</section>

			<section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 text-white shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
							Ready to shortlist smarter?
						</p>
						<h2 className="mt-2 text-3xl font-semibold">
							Start with the counselor or jump into search.
						</h2>
						<p className="mt-2 text-sm text-slate-200">
							Every answer is grounded in real data - no hallucinated cutoffs.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							variant="secondary"
							size="lg"
							nativeButton={false}
							render={<Link href="/counselor" />}
						>
							Talk to the counselor
						</Button>
						<Button size="lg" nativeButton={false} render={<Link href="/colleges" />}>
							Browse colleges
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
