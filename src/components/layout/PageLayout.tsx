import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { MainLandmark } from "@/components/layout/MainLandmark";
import { AppProviders } from "@/components/providers/AppProviders";
import { TraceFloatingButton } from "@/components/trace/TraceFloatingButton";
import { getFreeToolCount, getPremiumToolCount } from "@/lib/features/tools/tool-counts";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const freeToolsCount = getFreeToolCount();
  const proToolsCount = getPremiumToolCount();

  return (
    <AppProviders>
      <SiteHeader freeToolsCount={freeToolsCount} proToolsCount={proToolsCount} />
      <MainLandmark>{children}</MainLandmark>
      <EnterpriseFooter />
      <TraceFloatingButton />
    </AppProviders>
  );
}
