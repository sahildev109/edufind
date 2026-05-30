import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
	title: "Sign up | EduFind",
	description: "Create an account to start shortlisting colleges.",
};

export default function SignupPage() {
	return <SignupForm />;
}
