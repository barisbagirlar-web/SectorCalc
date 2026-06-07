import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";

export interface HubLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

/**
 * Hub navigation link — prefetch enabled for crawl budget & UX signals.
 */
export function HubLink({
  href,
  children,
  className = "transition-colors hover:text-amber",
  prefetch = true,
}: HubLinkProps) {
  return (
    <Link href={href} prefetch={prefetch} className={className}>
      {children}
    </Link>
  );
}
