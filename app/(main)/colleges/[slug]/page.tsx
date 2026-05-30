import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CollegeDetailTabs from "@/components/college/CollegeDetailTabs";
import CompareToggleButton from "@/components/college/CompareToggleButton";
import SaveCollegeButton from "@/components/college/SaveCollegeButton";
import type { CourseItem } from "@/components/college/CoursesTable";
import type { PlacementItem } from "@/components/college/PlacementChart";
import type { ReviewItem } from "@/components/college/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ACCESS_TOKEN_COOKIE, verifyAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "College detail | EduFind",
	description: "Explore courses, placements, and reviews for top colleges.",
};

const formatInr = (value: number) =>
	new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const colleges = await prisma.college.findMany({
      where: { nirfRank: { not: null } },
      orderBy: { nirfRank: "asc" },
      take: 100,
      select: { slug: true },
    });
    return colleges.map((college) => ({ slug: college.slug }));
  } catch {
    return [];
  }
}

export default async function CollegeDetailPage({
	params,
}: {
	params: { slug?: string } | Promise<{ slug?: string }>;
}) {
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	if (!slug) {
		notFound();
	}

	const college = await prisma.college.findUnique({
		where: { slug },
		include: {
			courses: { orderBy: [{ degree: "asc" }, { branch: "asc" }] },
			placements: { orderBy: { year: "asc" } },
			facilities: { orderBy: { name: "asc" } },
			reviews: {
				orderBy: { createdAt: "desc" },
				include: { user: { select: { name: true } } },
			},
		},
	}).catch(() => null);

	if (!college) {
		notFound();
	}

	const cookieStore = await cookies();
	const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
	const authPayload = token ? await verifyAccessToken(token) : null;
	const userId = authPayload?.sub ?? null;
	const isLoggedIn = Boolean(userId);
	const savedItem = userId
		? await prisma.savedItem.findUnique({
				where: { userId_collegeId: { userId, collegeId: college.id } },
				select: { id: true },
			})
		: null;
	const isSaved = Boolean(savedItem);

	const courses: CourseItem[] = college.courses.map((course) => ({
		id: course.id,
		name: course.name,
		degree: course.degree,
		branch: course.branch,
		durationYrs: course.durationYrs,
		feesPerYear: course.feesPerYear,
		seats: course.seats,
		cutoffJeeMain: course.cutoffJeeMain ?? null,
		cutoffJeeAdv: course.cutoffJeeAdv ?? null,
	}));

	const placements: (PlacementItem & { topRecruiters: string[] })[] =
		college.placements.map((placement) => ({
			year: placement.year,
			avgPackageLpa: placement.avgPackageLpa,
			medianPackageLpa: placement.medianPackageLpa ?? null,
			maxPackageLpa: placement.maxPackageLpa,
			topRecruiters: placement.topRecruiters,
		}));

	const reviews: ReviewItem[] = college.reviews.map((review) => ({
		id: review.id,
		title: review.title,
		body: review.body,
		pros: review.pros,
		cons: review.cons,
		rating: review.rating,
		batch: review.batch,
		isVerified: review.isVerified,
		createdAt: review.createdAt.toISOString(),
		userName: review.user?.name ?? null,
	}));

	const overview = {
		description: college.description,
		establishedYear: college.establishedYear,
		type: college.type,
		facilities: college.facilities.map((facility) => facility.name),
		websiteUrl: college.websiteUrl,
		city: college.city,
		state: college.state,
		category: college.category,
	};

	return (
		<div className="space-y-10">
			<section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
					<div className="flex flex-wrap items-start justify-between gap-6">
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary" className="bg-slate-100 text-slate-700">
									{college.category}
								</Badge>
								<Badge variant="outline" className="border-slate-200 text-slate-600">
									{college.type}
								</Badge>
								{college.naacGrade && (
									<Badge variant="outline" className="border-slate-200 text-slate-600">
										NAAC {college.naacGrade}
									</Badge>
								)}
							</div>
							<div>
								<h1 className="text-3xl font-semibold text-slate-900">
									{college.name}
								</h1>
								<p className="text-sm text-slate-600">
									{college.city}, {college.state}
								</p>
								{college.nirfRank && (
									<p className="text-xs text-slate-500">
										NIRF Rank #{college.nirfRank}
									</p>
								)}
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							{college.websiteUrl && (
								<Link
									href={college.websiteUrl}
									target="_blank"
									rel="noreferrer"
									className={cn(
										buttonVariants({ variant: "outline" }),
										"rounded-full",
									)}
								>
									Visit website
								</Link>
							)}
							<CompareToggleButton collegeId={college.id} />
							<SaveCollegeButton
								collegeId={college.id}
								isLoggedIn={isLoggedIn}
								initialSaved={isSaved}
							/>
						</div>
					</div>

					<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-slate-500">
								Fees (per year)
							</p>
							<p className="text-lg font-semibold text-slate-900">
								Rs {formatInr(college.feesMin)} - {formatInr(college.feesMax)}
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-slate-500">
								Avg package
							</p>
							<p className="text-lg font-semibold text-slate-900">
								{college.avgPackageLpa ? `${college.avgPackageLpa} LPA` : "-"}
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-slate-500">
								Placement rate
							</p>
							<p className="text-lg font-semibold text-slate-900">
								{college.placementRate ? `${Math.round(college.placementRate)}%` : "-"}
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-slate-500">Rating</p>
							<p className="text-lg font-semibold text-slate-900">
								{college.overallRating.toFixed(1)} ({college.reviewCount})
							</p>
						</div>
					</div>
			</section>

			<CollegeDetailTabs
				overview={overview}
				courses={courses}
				placements={placements}
				reviews={reviews}
			/>
		</div>
	);
}
