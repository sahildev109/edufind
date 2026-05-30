import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
	title: "Login | EduFind",
	description: "Sign in to save colleges and compare options.",
};

export default function LoginPage() {
	return <LoginForm />;
}
