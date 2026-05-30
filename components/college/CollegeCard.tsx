"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CompareToggleButton from "@/components/college/CompareToggleButton";
import SaveCollegeIconButton from "@/components/college/SaveCollegeIconButton";
import type { CollegeListItem } from "@/hooks/useColleges";
import { cn } from "@/lib/utils";

const formatInr = (value: number) =>
	new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

type CollegeCardProps = {
	college: CollegeListItem;
};

export default function CollegeCard({ college }: CollegeCardProps) {
	const detailHref = `/colleges/${encodeURIComponent(college.slug)}`;

	return (
		<Card className="flex h-full flex-col overflow-hidden border-slate-200/80 shadow-sm">
			<CardHeader className="space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap gap-2">
					<Badge variant="secondary" className="bg-slate-100 text-slate-700">
						{college.category}
					</Badge>
					<Badge variant="outline" className="border-slate-200 text-slate-600">
						{college.type.toLowerCase()}
					</Badge>
					{college.naacGrade && (
						<Badge variant="outline" className="border-slate-200 text-slate-600">
							NAAC {college.naacGrade}
						</Badge>
					)}
					</div>
					<SaveCollegeIconButton collegeId={college.id} />
				</div>

				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-slate-900">
						{college.name}
					</h3>
					<p className="text-sm text-slate-600">
						{college.city}, {college.state}
					</p>
					{college.nirfRank && (
						<p className="text-xs font-medium text-slate-500">
							NIRF Rank #{college.nirfRank}
						</p>
					)}
				</div>
			</CardHeader>

			<CardContent className="mt-auto space-y-4">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">Fees</p>
						<p className="font-semibold text-slate-900">
							Rs {formatInr(college.feesMin)} - {formatInr(college.feesMax)}
						</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">Avg package</p>
						<p className="font-semibold text-slate-900">
							{college.avgPackageLpa ? `${college.avgPackageLpa} LPA` : "-"}
						</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">Placement rate</p>
						<p className="font-semibold text-slate-900">
							{college.placementRate ? `${Math.round(college.placementRate)}%` : "-"}
						</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide text-slate-500">Rating</p>
						<p className="font-semibold text-slate-900">
							{college.overallRating.toFixed(1)} ({college.reviewCount})
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<Link
						prefetch
						href={detailHref}
						className={cn(buttonVariants({ variant: "default" }), "w-full")}
					>
						View details
					</Link>
					<CompareToggleButton collegeId={college.id} />
				</div>
			</CardContent>
		</Card>
	);
}
