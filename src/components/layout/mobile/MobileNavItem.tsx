"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface MobileNavItemProps {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
  badge?: string | number | null;
  onClick?: () => void;
  showArrow?: boolean;
  prefetch?: boolean;
}

export function MobileNavItem({
  href,
  icon,
  title,
  description,
  badge,
  onClick,
  showArrow = false,
  prefetch = true,
}: MobileNavItemProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className="sc-mnav-item"
      onClick={onClick}
    >
      <span className="sc-mnav-item-icon">{icon}</span>
      <span className="sc-mnav-item-text">
        <span className="sc-mnav-item-title">{title}</span>
        {description && <span className="sc-mnav-item-desc">{description}</span>}
      </span>
      {badge != null && (
        <span className="sc-mnav-item-badge">{badge}</span>
      )}
      {showArrow && (
        <svg className="sc-mnav-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </Link>
  );
}
