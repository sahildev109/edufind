"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetchAuthStatus = async () => {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  return response.ok;
};

const fetchSavedStatus = async (collegeId: string) => {
  const response = await fetch(`/api/colleges/${collegeId}/save`, {
    credentials: "include",
  });
  if (!response.ok) {
    return false;
  }
  const data = (await response.json().catch(() => null)) as { saved?: boolean } | null;
  return Boolean(data?.saved);
};

export default function SaveCollegeIconButton({ collegeId }: { collegeId: string }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<"unknown" | "in" | "out">(
    "unknown",
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      const loggedIn = await fetchAuthStatus();
      if (!isMounted) {
        return;
      }
      setAuthStatus(loggedIn ? "in" : "out");
      if (loggedIn) {
        const saved = await fetchSavedStatus(collegeId);
        if (isMounted) {
          setIsSaved(saved);
        }
      }
    };
    sync();
    return () => {
      isMounted = false;
    };
  }, [collegeId]);

  const handleToggle = async () => {
    if (authStatus !== "in") {
      const loggedIn = await fetchAuthStatus();
      setAuthStatus(loggedIn ? "in" : "out");
      if (!loggedIn) {
        router.push("/login");
        return;
      }
      const saved = await fetchSavedStatus(collegeId);
      setIsSaved(saved);
    }

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setIsPending(true);

    try {
      const response = await fetch(`/api/colleges/${collegeId}/save`, {
        method: nextSaved ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update saved state");
      }

      const data = (await response.json().catch(() => null)) as
        | { saved?: boolean }
        | null;

      if (data && typeof data.saved === "boolean") {
        setIsSaved(data.saved);
      }
    } catch {
      setIsSaved(!nextSaved);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant={isSaved ? "secondary" : "ghost"}
      size="icon"
      onClick={handleToggle}
      disabled={isPending || authStatus === "unknown"}
      aria-label={isSaved ? "Remove from saved" : "Save college"}
    >
      <Bookmark
        className={
          authStatus === "unknown"
            ? "text-slate-300"
            : isSaved
              ? "fill-slate-900 text-slate-900"
              : "text-slate-600"
        }
      />
    </Button>
  );
}
