"use client";

import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { MainLandmark } from "@/components/layout/MainLandmark";
import { TraceAI } from "@/components/trace/TraceAI";

interface RootShellProps {
  children: ReactNode;
  freeToolsCount: number;
  proToolsCount: number;
}

/**
 * Persistent app shell rendered at root layout level.
 * SiteHeader and EnterpriseFooter remain mounted across route transitions.
 * Only the MainLandmark content area swaps — no blank screen, no remount flash.
 */
export function RootShell({ children, freeToolsCount, proToolsCount }: RootShellProps) {
  return (
    <AppProviders>
      <SiteHeader freeToolsCount={freeToolsCount} proToolsCount={proToolsCount} />
      <MainLandmark>{children}</MainLandmark>
      <EnterpriseFooter />
      <TraceAI demoMode defaultOpen={false} title="Trace AI" />
    </AppProviders>
  );
}
