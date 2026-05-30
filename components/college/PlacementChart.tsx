"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type PlacementItem = {
  year: number;
  avgPackageLpa: number;
  medianPackageLpa: number | null;
  maxPackageLpa: number;
};

const formatLpa = (value: number) => `${value} LPA`;

export default function PlacementChart({ placements }: { placements: PlacementItem[] }) {
  const data = [...placements]
    .sort((a, b) => a.year - b.year)
    .map((item) => ({
      year: item.year,
      avg: item.avgPackageLpa,
      median: item.medianPackageLpa ?? null,
      max: item.maxPackageLpa,
    }));

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" />
          <YAxis stroke="#64748b" tickFormatter={(value) => `${value}L`} />
          <Tooltip
            formatter={(value) => formatLpa(Number(value))}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="median"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
