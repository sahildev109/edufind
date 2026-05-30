"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CourseItem = {
  id: string;
  name: string;
  degree: string;
  branch: string;
  durationYrs: number;
  feesPerYear: number;
  seats: number | null;
  cutoffJeeMain: number | null;
  cutoffJeeAdv: number | null;
};

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default function CoursesTable({ courses }: { courses: CourseItem[] }) {
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState("all");

  const degrees = useMemo(() => {
    const unique = Array.from(new Set(courses.map((course) => course.degree)));
    return ["all", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesDegree = degree === "all" || course.degree === degree;
      if (!matchesDegree) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        course.name.toLowerCase().includes(query) ||
        course.degree.toLowerCase().includes(query) ||
        course.branch.toLowerCase().includes(query)
      );
    });
  }, [courses, degree, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search degree, branch, or course"
          className="min-w-[240px] flex-1"
        />
        <Select value={degree} onValueChange={setDegree}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by degree" />
          </SelectTrigger>
          <SelectContent>
            {degrees.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "all" ? "All degrees" : item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Fees</th>
              <th className="px-4 py-3">JEE Main</th>
              <th className="px-4 py-3">JEE Adv</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {course.name}
                </td>
                <td className="px-4 py-3 text-slate-700">{course.branch}</td>
                <td className="px-4 py-3 text-slate-700">
                  {course.durationYrs} yrs
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {course.seats ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Rs {formatInr(course.feesPerYear)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {course.cutoffJeeMain ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {course.cutoffJeeAdv ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          No courses match this filter.
        </div>
      )}
    </div>
  );
}
