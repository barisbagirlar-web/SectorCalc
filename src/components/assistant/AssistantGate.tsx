"use client";

import { usePathname } from "@/i18n/routing";
import { TraceFloatingButton } from "@/components/trace/TraceFloatingButton";

export function AssistantGate() {
  const pathname = usePathname();

  if (pathname.includes("/print") || pathname.includes("/admin")) {
    return null;
  }

  return <TraceFloatingButton />;
}
