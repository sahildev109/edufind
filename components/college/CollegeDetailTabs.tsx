"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesTable, { type CourseItem } from "@/components/college/CoursesTable";
import PlacementChart, {
  type PlacementItem,
} from "@/components/college/PlacementChart";
import ReviewCard, { type ReviewItem } from "@/components/college/ReviewCard";

export type OverviewInfo = {
  description: string | null;
  establishedYear: number | null;
  type: string;
  facilities: string[];
  websiteUrl: string | null;
  city: string;
  state: string;
  category: string;
};

type CollegeDetailTabsProps = {
  overview: OverviewInfo;
  courses: CourseItem[];
  placements: (PlacementItem & { topRecruiters: string[] })[];
  reviews: ReviewItem[];
};

const PAGE_SIZE = 4;

export default function CollegeDetailTabs({
  overview,
  courses,
  placements,
  reviews,
}: CollegeDetailTabsProps) {
  const [page, setPage] = useState(1);

  const ratingSummary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, counts: [0, 0, 0, 0, 0] };
    }
    const counts = [0, 0, 0, 0, 0];
    const total = reviews.reduce((sum, review) => {
      counts[review.rating - 1] += 1;
      return sum + review.rating;
    }, 0);
    return { average: total / reviews.length, counts };
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const pagedReviews = reviews.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const latestRecruiters = useMemo(() => {
    const sorted = [...placements].sort((a, b) => b.year - a.year);
    return sorted[0]?.topRecruiters ?? [];
  }, [placements]);

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
        {[
          { value: "overview", label: "Overview" },
          { value: "courses", label: "Courses" },
          { value: "placements", label: "Placements" },
          { value: "reviews", label: "Reviews" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Overview</h3>
            <p className="mt-3 text-sm text-slate-700">
              {overview.description ||
                "This college does not have a detailed description yet."}
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Quick facts
              </p>
              <div className="mt-3 space-y-2">
                <p>
                  <span className="font-semibold text-slate-900">Established:</span>{" "}
                  {overview.establishedYear ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Type:</span> {overview.type}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Category:</span>{" "}
                  {overview.category}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Location:</span>{" "}
                  {overview.city}, {overview.state}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Website:</span>{" "}
                  {overview.websiteUrl ? (
                    <a
                      className="text-blue-600 underline"
                      href={overview.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Facilities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {overview.facilities.length === 0 && (
                  <p className="text-sm text-slate-600">
                    No facility data available.
                  </p>
                )}
                {overview.facilities.map((facility) => (
                  <Badge
                    key={facility}
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        <CoursesTable courses={courses} />
      </TabsContent>

      <TabsContent value="placements" className="space-y-5">
        <PlacementChart placements={placements} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Top recruiters
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {latestRecruiters.length === 0 && (
              <p className="text-sm text-slate-600">No recruiter data.</p>
            )}
            {latestRecruiters.map((recruiter) => (
              <Badge key={recruiter} variant="secondary">
                {recruiter}
              </Badge>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Rating breakdown
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {ratingSummary.average.toFixed(1)}
            </p>
            <p className="text-sm text-slate-600">Based on {reviews.length} reviews</p>
            <div className="mt-4 space-y-2">
              {ratingSummary.counts
                .map((count, index) => ({
                  stars: 5 - index,
                  count: ratingSummary.counts[4 - index],
                }))
                .map((item) => (
                  <div key={item.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-slate-600">{item.stars}★</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-900"
                        style={{
                          width: reviews.length
                            ? `${(item.count / reviews.length) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="w-6 text-right text-slate-600">{item.count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            {pagedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {reviews.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-600">
                No reviews available yet.
              </div>
            )}
            {reviews.length > PAGE_SIZE && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <p className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
