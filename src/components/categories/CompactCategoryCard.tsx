/**
 * CompactCategoryCard — Compact 4-to-a-row category card.
 *
 * Shows SVG line-art symbol, title, tool count, optional PRO badge.
 * Hover: card rises + left border highlight.
 *
 * ECMI / ISO 9001 — TÜV-certifiable industrial UX.
 */

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  CATALOG_GRID_VARIANT_STYLES,
  type CatalogGridVariant,
} from "@/lib/catalog/catalog-grid-variant-styles";

export type CompactCategoryCardProps = {
  readonly href: string;
  readonly title: string;
  readonly countLabel: string;
  readonly premiumCount: number;
  readonly svgSymbol: string;
  readonly variant: CatalogGridVariant;
};

export function CompactCategoryCard({
  href,
  title,
  countLabel,
  premiumCount,
  svgSymbol,
  variant,
}: CompactCategoryCardProps) {
  const tone = CATALOG_GRID_VARIANT_STYLES[variant];
  const hasPro = premiumCount > 0;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[120px] flex-col items-center justify-center rounded-lg border bg-white px-3 py-4 text-center transition-all duration-200",
        "shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "border-slate-200",
        // Left border highlight on hover
        "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r before:bg-transparent before:transition-all before:duration-200",
        "hover:before:bg-[var(--sc-left-border)]",
        tone.hoverBorder,
        tone.focusRing,
      )}
      style={
        {
          "--sc-left-border":
            variant === "free"
              ? "#2563eb"
              : variant === "premium"
                ? "var(--sc-premium-bordo)"
                : "var(--sc-navy)",
        } as React.CSSProperties
      }
    >
      {/* SVG line-art symbol */}
      <div
        className={cn(
          "mb-2.5 h-11 w-11 transition-colors duration-200",
          tone.icon,
          tone.iconHover,
        )}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgSymbol }}
      />

      {/* Title */}
      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-800">
        {title}
      </h3>

      {/* Count + PRO badge */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs font-medium text-slate-500">
          {countLabel}
        </span>
        {hasPro ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              variant === "premium"
                ? "bg-red-50 text-[var(--sc-premium-bordo)]"
                : "bg-orange-50 text-orange-700",
            )}
          >
            PRO
          </span>
        ) : null}
      </div>
    </Link>
  );
}
