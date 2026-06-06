"use client";

import type { ReactNode } from "react";
import { LeadIntentProvider } from "@/components/leads/LeadIntentContext";
import { LeadIntentModal } from "@/components/leads/LeadIntentModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LeadIntentProvider>
        {children}
        <LeadIntentModal />
      </LeadIntentProvider>
    </ThemeProvider>
  );
}
