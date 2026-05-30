"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function LogoutButton() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      clearAuth();
      router.push("/login");
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-full"
    >
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}
