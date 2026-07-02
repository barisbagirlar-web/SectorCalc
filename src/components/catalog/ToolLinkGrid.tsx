"use client";

import Link from "next/link";

export type ToolLinkItem = {
  readonly title: string;
  readonly href: string;
  readonly badge?: "free" | "premium";
  readonly badgeLabel?: string;
};

type ToolLinkGridProps = {
  readonly items: readonly ToolLinkItem[];
  readonly className?: string;
};

/**
 * 3-column terracotta link list for tool catalogs.
 * Replaces card-based grids with a clean, fast, minimal link layout.
 */
export function ToolLinkGrid({ items, className }: ToolLinkGridProps) {
  if (items.length === 0) return null;

  return (
    <ul
      className={`sc-tool-link-grid${className ? ` ${className}` : ""}`}
      role="list"
    >
      {items.map((item) => (
        <li key={item.href} className="sc-tool-link-item">
          <span className="sc-tool-link-item__arrow" aria-hidden="true">
            →
          </span>
          <Link
            href={item.href}
            prefetch={false}
            className="sc-tool-link-item__link"
          >
            {item.title}
          </Link>
          {item.badge && item.badgeLabel ? (
            <span
              className={`sc-tool-link-item__badge sc-tool-link-item__badge--${item.badge}`}
            >
              {item.badgeLabel}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
