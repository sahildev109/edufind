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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

type AuthResponse = {
  accessToken: string;
  user: { id: string; email: string; name: string; role: string };
};

const loginRequest = async (values: LoginValues): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = (await response.json().catch(() => null)) as
    | AuthResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    const message = data && "error" in data && data.error ? data.error : "Login failed";
    throw new Error(message);
  }

  if (!data || !("accessToken" in data)) {
    throw new Error("Login failed");
  }

  return data;
};

const LoginFormContent = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation<AuthResponse, Error, LoginValues>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setAuth(data);
      router.push("/colleges");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const onSubmit = (values: LoginValues) => {
    setErrorMessage(null);
    mutation.mutate(values);
  };

  return (
    <Card className="border-slate-200/80 shadow-xl shadow-slate-900/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage saved colleges and comparisons.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New to EduFind?{" "}
          <Link className="font-semibold text-slate-900 underline" href="/signup">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default function LoginForm() {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <LoginFormContent />
    </QueryClientProvider>
  );
}
