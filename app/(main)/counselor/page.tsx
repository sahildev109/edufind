import type { Metadata } from "next";
import CounselorChat from "@/components/ai/CounselorChat";

export const metadata: Metadata = {
	title: "AI Counselor | EduFind",
	description: "Get personalized college guidance from the EduFind AI counselor.",
};

export default function CounselorPage() {
	return <CounselorChat />;
}
