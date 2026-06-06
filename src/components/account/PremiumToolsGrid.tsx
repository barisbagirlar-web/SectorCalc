"use client";

import Link from "next/link";
import { revenueTools } from "@/lib/tools/revenue-tools";
import type { RevenueSector } from "@/lib/tools/revenue-tools";

const SECTOR_LABELS: Record<RevenueSector, string> = {
  "cnc-manufacturing": "CNC Manufacturing",
  construction: "Construction",
  cleaning: "Cleaning",
  restaurant: "Restaurant",
  ecommerce: "E-commerce",
};

interface PremiumToolsGridProps {
  isActive: boolean;
}

export function PremiumToolsGrid({ isActive }: PremiumToolsGridProps) {
  return (
    <section className="min-w-0">
      <h2 className="text-lg font-bold text-deep-navy">Premium decision tools</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">
        Sector-specific analyzers for pricing, bid and margin decisions.
      </p>
      <ul className="mt-5 grid min-w-0 gap-4">
        {revenueTools.map((tool) => {
          const href = isActive
            ? `/tools/premium/${tool.paidSlug}`
            : `/pricing?tool=${encodeURIComponent(tool.paidSlug)}`;
          const ctaLabel = isActive ? "Open analyzer" : "Unlock Pro";

          return (
            <li key={tool.paidSlug}>
              <article className="rounded-xl border border-slate/15 bg-white p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
                  {SECTOR_LABELS[tool.sector]}
                </p>
                <h3 className="mt-2 text-base font-bold text-deep-navy">{tool.paidTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{tool.painStatement}</p>
                <p className="mt-2 text-sm text-deep-navy">{tool.paidValue}</p>
                <Link
                  href={href}
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
                >
                  {ctaLabel}
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
