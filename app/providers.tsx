"use client";

import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
