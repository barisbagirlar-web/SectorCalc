"use client";

import Link from "@/lib/navigation/next-link";
import { revenueTools } from "@/lib/tools/revenue-tools";
import { getIndustryDisplayName } from "@/lib/tools/industry-registry";
import {
 getPremiumToolHref,
 getPricingHref,
} from "@/lib/tools/tool-links";

interface PremiumToolsGridProps {
 isActive: boolean;
}

export function PremiumToolsGrid({ isActive }: PremiumToolsGridProps) {
 return (
 <section className="min-w-0">
 <h2 className="text-lg font-bold text-text-primary">Premium decision tools</h2>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Sector-specific analyzers for pricing, bid and margin decisions.
 </p>
 <ul className="mt-5 grid min-w-0 gap-4">
 {revenueTools.map((tool) => {
 const href = isActive ? getPremiumToolHref(tool) : getPricingHref(tool);
 const ctaLabel = isActive ? "Open calculator" : "Unlock Pro";

 return (
 <li key={tool.paidSlug}>
 <article className="rounded-sm border border-border-subtle bg-white p-5 shadow-card">
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 {getIndustryDisplayName(tool.sector)}
 </p>
 <h3 className="mt-2 text-base font-bold text-text-primary">{tool.paidTitle}</h3>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">{tool.painStatement}</p>
 <p className="mt-2 text-sm text-text-primary">{tool.paidValue}</p>
 <Link
 href={href}
 className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border-subtle px-4 text-sm font-semibold text-text-primary transition-colors hover:border-deep-navy hover:text-deep-navy"
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
