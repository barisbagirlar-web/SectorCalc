import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { MainLandmark } from "@/components/layout/MainLandmark";
import { AppProviders } from "@/components/providers/AppProviders";
import { TraceFloatingButton } from "@/components/trace/TraceFloatingButton";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <AppProviders>
      <SiteHeader />
      <MainLandmark>{children}</MainLandmark>
      <EnterpriseFooter />
      <TraceFloatingButton />
    </AppProviders>
  );
}
