import { Skeleton } from "@/components/ui/skeleton";

export default function CollegeDetailLoading() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={`stat-${index}`}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-6 w-24" />
              </div>
            ))}
          </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={`tab-${index}`} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-3 w-24" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={`fact-${index}`} className="h-4 w-40" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <Skeleton className="h-3 w-20" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={`facility-${index}`} className="h-6 w-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
