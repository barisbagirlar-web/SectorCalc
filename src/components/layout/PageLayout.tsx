import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AppProviders } from "@/components/providers/AppProviders";

type HeaderTheme = "light" | "dark";

interface PageLayoutProps {
  children: ReactNode;
  headerTheme?: HeaderTheme;
}

export function PageLayout({
  children,
  headerTheme = "light",
}: PageLayoutProps) {
  return (
    <AppProviders>
      <SiteHeader theme={headerTheme} />
      <main>{children}</main>
      <SiteFooter />
    </AppProviders>
  );
}
