import type { Metadata } from "next";
import CollegesPageClient from "./CollegesPageClient";

export const metadata: Metadata = {
	title: "Colleges | EduFind",
	description: "Browse Indian colleges with filters and live comparisons.",
};

export default function CollegesPage() {
	return <CollegesPageClient />;
}
