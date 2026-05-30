import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import LogoutButton from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";
import { cn } from "@/lib/utils";

const formatInr = (value: number) =>
	new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default async function DashboardPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
	if (!token) {
		redirect("/login");
	}

	const payload = await verifyAccessToken(token);
	if (!payload?.sub) {
		redirect("/login");
	}

	const user = await prisma.user.findUnique({
		where: { id: payload.sub },
		select: {
			name: true,
			email: true,
			savedItems: {
				orderBy: { savedAt: "desc" },
				include: { college: true },
			},
		},
	});

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="space-y-8">
			<header className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
					Dashboard
				</p>
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-semibold text-slate-900">
							Welcome back, {user.name}
						</h1>
						<p className="text-sm text-slate-600">{user.email}</p>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Link
							href="/colleges"
							className={cn(buttonVariants({ variant: "outline" }))}
						>
							Browse colleges
						</Link>
						<LogoutButton />
					</div>
				</div>
			</header>

			<section className="space-y-4">
				<h2 className="text-lg font-semibold text-slate-900">Saved colleges</h2>
				{user.savedItems.length === 0 && (
					<div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
						You have not saved any colleges yet.
					</div>
				)}

				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{user.savedItems.map((item) => (
						<Card key={item.id} className="border-slate-200/80 shadow-sm">
							<CardHeader className="space-y-2">
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary" className="bg-slate-100 text-slate-700">
										{item.college.category}
									</Badge>
									<Badge variant="outline" className="border-slate-200 text-slate-600">
										{item.college.type}
									</Badge>
								</div>
								<div>
									<h3 className="text-base font-semibold text-slate-900">
										{item.college.name}
									</h3>
									<p className="text-sm text-slate-600">
										{item.college.city}, {item.college.state}
									</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
									<div>
										<p className="text-xs uppercase tracking-wide text-slate-500">Fees</p>
										<p className="font-semibold text-slate-900">
											Rs {formatInr(item.college.feesMin)} -
											{" "}{formatInr(item.college.feesMax)}
										</p>
									</div>
									<div>
										<p className="text-xs uppercase tracking-wide text-slate-500">Saved</p>
										<p className="font-semibold text-slate-900">
											{format(item.savedAt, "MMM d, yyyy")}
										</p>
									</div>
								</div>
								<Link
									href={`/colleges/${encodeURIComponent(item.college.slug)}`}
									className={cn(buttonVariants({ variant: "default" }), "w-full")}
								>
									View details
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
