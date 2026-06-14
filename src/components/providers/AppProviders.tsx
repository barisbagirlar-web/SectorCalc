"use client";

import type { ReactNode } from "react";
import { AssistantGate } from "@/components/assistant/AssistantGate";
import { LeadIntentProvider } from "@/components/leads/LeadIntentContext";
import { LeadIntentModal } from "@/components/leads/LeadIntentModal";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LeadIntentProvider>
      {children}
      <LeadIntentModal />
      <AssistantGate />
    </LeadIntentProvider>
  );
}
