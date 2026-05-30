import type { Metadata } from "next";
import CollegesPageClient from "./CollegesPageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Colleges | EduFind",
	description: "Browse Indian colleges with filters and live comparisons.",
};

export default function CollegesPage() {
	  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollegesPageClient />
    </Suspense>
  );
}
