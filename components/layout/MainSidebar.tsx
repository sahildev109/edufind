import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Explore colleges", href: "/colleges" },
  { label: "AI Counselor", href: "/counselor", highlight: true },
  { label: "Compare", href: "/compare" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function MainSidebar() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          EduFind
        </p>
        <h2 className="text-xl font-semibold text-slate-900">Navigation</h2>
      </div>

      <div className="mt-6 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 ${
              item.highlight ? "ai-counselor-glow" : ""
            }`}
          >
            {item.label}
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              Go
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Compare colleges, track favorites, and jump back into your shortlist.
      </div>
    </aside>
  );
}
