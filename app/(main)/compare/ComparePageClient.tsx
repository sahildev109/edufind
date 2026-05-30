"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ComparePanel from "@/components/college/ComparePanel";

export default function ComparePageClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ComparePanel />
    </QueryClientProvider>
  );
}
