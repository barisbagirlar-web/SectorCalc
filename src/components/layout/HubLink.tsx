import type { ReactNode } from "react";
import Link from "next/link";

export interface HubLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

/** Hub navigation link - prefetch off to avoid RSC stream pressure. */
export function HubLink({
  href,
  children,
  className = "transition-colors hover:text-amber",
  prefetch = false,
}: HubLinkProps) {
  return (
    <Link href={href} prefetch={prefetch} className={className}>
      {children}
    </Link>
  );
}
