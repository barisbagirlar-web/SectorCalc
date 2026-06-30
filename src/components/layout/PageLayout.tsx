import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { MainLandmark } from "@/components/layout/MainLandmark";
import { AppProviders } from "@/components/providers/AppProviders";
import { TraceAI } from "@/components/trace/TraceAI";
import { getFreeToolCount, getPremiumToolCount } from "@/lib/features/tools/tool-counts";

interface PageLayoutProps {
  children: ReactNode;
  hideFooterCta?: boolean;
}

export function PageLayout({ children, hideFooterCta }: PageLayoutProps) {
  const freeToolsCount = getFreeToolCount();
  const proToolsCount = getPremiumToolCount();

  return (
    <AppProviders>
      <SiteHeader freeToolsCount={freeToolsCount} proToolsCount={proToolsCount} />
      <MainLandmark>{children}</MainLandmark>
      <EnterpriseFooter hideCta={hideFooterCta} />
      <TraceAI demoMode defaultOpen={false} title="Trace AI" />
    </AppProviders>
  );
}
