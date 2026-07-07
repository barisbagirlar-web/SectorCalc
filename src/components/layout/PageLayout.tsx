import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  /** @deprecated Footer CTA is now managed by RootShell in root layout. */
  hideFooterCta?: boolean;
}

/**
 * PageLayout — thin content wrapper (legacy interface preserved).
 * The persistent app shell (SiteHeader, EnterpriseFooter, AppProviders)
 * is now rendered at root layout level in RootShell.
 * This component is kept as a pass-through to avoid modifying every page file.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return <>{children}</>;
}
