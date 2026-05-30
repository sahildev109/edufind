"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompare } from "@/hooks/useCompare";
import { COMPARE_MAX } from "@/store/compareStore";
import { cn } from "@/lib/utils";

const formatInr = (value: number) =>
	new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

const formatLpa = (value: number | null) =>
	value ? `${value} LPA` : "-";

const metricColor = (value: number | null) => {
	if (!value) {
		return "text-slate-500";
	}
	if (value >= 18) {
		return "text-emerald-600";
	}
	if (value >= 10) {
		return "text-amber-600";
	}
	return "text-rose-600";
};

export default function ComparePanel() {
	const {
		selectedIds,
		data,
		isLoading,
		isError,
		removeCollege,
		clearAll,
	} = useCompare();

	if (selectedIds.length === 0) {
		return (
			<div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center">
				<h2 className="text-xl font-semibold text-slate-900">Compare colleges</h2>
				<p className="mt-2 text-sm text-slate-600">
					Select up to {COMPARE_MAX} colleges to see a side-by-side comparison.
				</p>
				<Link href="/colleges" className={cn(buttonVariants({ variant: "default" }), "mt-6")}> 
					Browse colleges
				</Link>
			</div>
		);
	}

	const columns = data.length || selectedIds.length;
	const gridTemplate = `180px repeat(${columns}, minmax(0, 1fr))`;

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
						Compare
					</p>
					<h1 className="text-2xl font-semibold text-slate-900">
						Side-by-side comparison
					</h1>
				</div>
				<Button variant="outline" className="rounded-full" onClick={clearAll}>
					Clear all
				</Button>
			</header>

			{isError && (
				<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					Unable to load comparison data.
				</div>
			)}

			{isLoading && (
				<div className="grid gap-4" style={{ gridTemplateColumns: gridTemplate }}>
					{Array.from({ length: (columns + 1) * 3 }, (_, index) => (
						<Skeleton key={index} className="h-20 w-full" />
					))}
				</div>
			)}

			{!isLoading && data.length > 0 && (
				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
					<div className="grid gap-px bg-slate-200" style={{ gridTemplateColumns: gridTemplate }}>
						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Basic info
						</div>
						{data.map((college) => (
							<div key={college.id} className="bg-white px-4 py-4">
								<p className="text-sm font-semibold text-slate-900">{college.name}</p>
								<p className="text-xs text-slate-600">
									{college.city}, {college.state}
								</p>
								<div className="mt-2 flex flex-wrap gap-1">
									<Badge variant="secondary" className="bg-slate-100 text-slate-700">
										{college.type}
									</Badge>
									{college.naacGrade && (
										<Badge variant="outline" className="border-slate-200 text-slate-600">
											NAAC {college.naacGrade}
										</Badge>
									)}
								</div>
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Fees (annual)
						</div>
						{data.map((college) => (
							<div key={`${college.id}-fees`} className="bg-white px-4 py-4 text-sm">
								Rs {formatInr(college.feesMin)} - {formatInr(college.feesMax)}
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Placement avg
						</div>
						{data.map((college) => (
							<div
								key={`${college.id}-avg`}
								className={cn("bg-white px-4 py-4 text-sm font-semibold", metricColor(college.avgPackageLpa))}
							>
								{formatLpa(college.avgPackageLpa)}
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Placement max
						</div>
						{data.map((college) => (
							<div key={`${college.id}-max`} className="bg-white px-4 py-4 text-sm">
								{formatLpa(college.maxPackageLpa)}
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Placement rate
						</div>
						{data.map((college) => (
							<div key={`${college.id}-rate`} className="bg-white px-4 py-4 text-sm">
								{college.placementRate ? `${Math.round(college.placementRate)}%` : "-"}
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Rating
						</div>
						{data.map((college) => (
							<div key={`${college.id}-rating`} className="bg-white px-4 py-4 text-sm">
								{college.overallRating.toFixed(1)} ({college.reviewCount})
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Top recruiters
						</div>
						{data.map((college) => (
							<div key={`${college.id}-recruiters`} className="bg-white px-4 py-4">
								<div className="flex flex-wrap gap-2">
									{college.topRecruiters.length === 0 && (
										<span className="text-sm text-slate-500">No data</span>
									)}
									{college.topRecruiters.map((recruiter) => (
										<Badge key={recruiter} variant="secondary">
											{recruiter}
										</Badge>
									))}
								</div>
							</div>
						))}

						<div className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
							Action
						</div>
						{data.map((college) => (
							<div key={`${college.id}-actions`} className="bg-white px-4 py-4">
								<div className="flex flex-col gap-2">
									<Link
										href={`/colleges/${encodeURIComponent(college.slug)}`}
										className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
									>
										View full page
									</Link>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeCollege(college.id)}
									>
										Remove
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
