"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { LeadIntentProvider } from "@/components/leads/LeadIntentContext";
import { LeadIntentModal } from "@/components/leads/LeadIntentModal";

const AssistantGate = dynamic(
  () => import("@/components/assistant/AssistantGate").then((mod) => mod.AssistantGate),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LeadIntentProvider>
      {children}
      <LeadIntentModal />
      <AssistantGate />
    </LeadIntentProvider>
  );
}
