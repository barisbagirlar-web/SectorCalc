import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EnterpriseFooter } from "@/components/layout/EnterpriseFooter";
import { AppProviders } from "@/components/providers/AppProviders";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <AppProviders>
      <SiteHeader />
      <main className={`sc-app-main min-w-0 ${className}`.trim()}>{children}</main>
      <EnterpriseFooter />
    </AppProviders>
  );
}
