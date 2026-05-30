import type { Metadata } from "next";
import ComparePageClient from "./ComparePageClient";

export const metadata: Metadata = {
	title: "Compare colleges | EduFind",
	description: "Compare up to three colleges side by side.",
};

export default function ComparePage() {
	return <ComparePageClient />;
}
