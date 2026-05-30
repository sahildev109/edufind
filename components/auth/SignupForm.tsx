"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupValues = z.infer<typeof signupSchema>;

type AuthResponse = {
  accessToken: string;
  user: { id: string; email: string; name: string; role: string };
};

const signupRequest = async (values: SignupValues): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: values.name,
      email: values.email,
      password: values.password,
    }),
  });
  const data = (await response.json().catch(() => null)) as
    | AuthResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    const message = data && "error" in data && data.error ? data.error : "Signup failed";
    throw new Error(message);
  }

  if (!data || !("accessToken" in data)) {
    throw new Error("Signup failed");
  }

  return data;
};

const SignupFormContent = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation<AuthResponse, Error, SignupValues>({
    mutationFn: signupRequest,
    onSuccess: (data) => {
      setAuth(data);
      router.push("/colleges");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const onSubmit = (values: SignupValues) => {
    setErrorMessage(null);
    mutation.mutate(values);
  };

  return (
    <Card className="border-slate-200/80 shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start shortlisting colleges and build your comparison list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Full name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Aarav Mehta"
              autoComplete="name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-slate-900 underline" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default function SignupForm() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <SignupFormContent />
    </QueryClientProvider>
  );
}
