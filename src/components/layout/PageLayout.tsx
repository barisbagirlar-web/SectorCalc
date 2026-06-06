import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AppProviders } from "@/components/providers/AppProviders";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({
  children,
}: PageLayoutProps) {
  return (
    <AppProviders>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </AppProviders>
  );
}