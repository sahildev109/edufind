"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SaveCollegeButtonProps = {
  collegeId: string;
  isLoggedIn: boolean;
  initialSaved: boolean;
};

export default function SaveCollegeButton({
  collegeId,
  isLoggedIn,
  initialSaved,
}: SaveCollegeButtonProps) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const syncStatus = async () => {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!isMounted) {
        return;
      }
      if (!response.ok) {
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
      const savedResponse = await fetch(`/api/colleges/${collegeId}/save`, {
        credentials: "include",
      });
      if (!isMounted) {
        return;
      }
      if (savedResponse.ok) {
        const data = (await savedResponse.json().catch(() => null)) as
          | { saved?: boolean }
          | null;
        if (data && typeof data.saved === "boolean") {
          setIsSaved(data.saved);
        }
      }
    };
    syncStatus();
    return () => {
      isMounted = false;
    };
  }, [collegeId]);

  if (!loggedIn) {
    return null;
  }

  const handleToggle = async () => {
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
      className="rounded-full"
      variant={isSaved ? "secondary" : "default"}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "Updating..." : isSaved ? "Saved" : "Save college"}
    </Button>
  );
}
