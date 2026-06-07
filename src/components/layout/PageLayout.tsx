import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { AppProviders } from "@/components/providers/AppProviders";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <AppProviders>
      <SiteHeader />
      <main className="sc-app-main min-w-0">{children}</main>
      <EnterpriseFooter />
    </AppProviders>
  );
}
