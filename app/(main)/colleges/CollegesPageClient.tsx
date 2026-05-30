"use client";

import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CollegeCard from "@/components/college/CollegeCard";
import CollegeFilters from "@/components/college/CollegeFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useColleges } from "@/hooks/useColleges";

const SkeletonCard = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <div className="space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="mt-5 h-10 w-full" />
  </div>
);

const CollegesListing = () => {
  const {
    items,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status,
  } = useColleges();
  const { ref, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadingCards = useMemo(
    () => Array.from({ length: 12 }, (_, index) => <SkeletonCard key={index} />),
    [],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          College discovery
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            Explore verified colleges
          </h1>
          <p className="text-sm text-slate-600">
            {totalCount ? `Showing ${items.length} of ${totalCount}` : ""}
          </p>
        </div>
      </div>

      <CollegeFilters />

      {status === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          We could not load colleges right now. Please try again.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && loadingCards}
        {!isLoading &&
          items.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
      </div>

      {!isLoading && items.length === 0 && status !== "error" && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
          No colleges match these filters yet.
        </div>
      )}

      <div ref={ref} className="flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={`next-${index}`} />
            ))}
          </div>
        )}
        {!hasNextPage && items.length > 0 && (
          <p className="text-sm text-slate-500">You have reached the end.</p>
        )}
      </div>
    </div>
  );
};

export default function CollegesPageClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CollegesListing />
    </QueryClientProvider>
  );
}
