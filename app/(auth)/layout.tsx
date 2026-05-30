import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sora.className} min-h-screen bg-[#f7f2ea] text-slate-900`}>
      <div className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden lg:flex flex-col justify-between px-14 py-12 overflow-hidden">
          <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,200,87,0.75),transparent_70%)] blur-2xl" />
          <div className="absolute bottom-10 left-6 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(97,165,250,0.45),transparent_70%)] blur-2xl" />

          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600">
              EduFind platform
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Find the right college with data, not guesswork.
            </h1>
            <p className="max-w-md text-base text-slate-700">
              Compare institutions, evaluate placements, and keep your shortlist
              synced with your profile in one place.
            </p>
          </div>

          <div className="relative grid gap-4 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                AI counselor
              </p>
              <p className="text-lg font-semibold text-slate-900">Personalized guidance</p>
              <p className="mt-2 text-sm">
                Get recommendations matched to your budget, branch, and goals.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Compare</p>
              <p className="text-lg font-semibold text-slate-900">Side by side clarity</p>
              <p className="mt-2 text-sm">
                Align fees, placements, and rankings in one quick view.
              </p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center bg-white/70 px-6 py-12 backdrop-blur">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
