"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "@/lib/ui-shared/navigation/next-link";
import { revenueTools } from "@/lib/features/tools/revenue-tools";
import { getIndustryDisplayName } from "@/lib/features/tools/industry-registry";
import {
  getPremiumToolHref,
  getPricingHref,
} from "@/lib/features/tools/tool-links";

interface PremiumToolsGridProps {
  isActive: boolean;
}

/** Text-based premium tool list — no boxes, no shadows. */
export function PremiumToolsGrid({ isActive }: PremiumToolsGridProps) {
  const t = useTranslations("premiumTools");
  return (
    <section className="min-w-0">
      <h2 className="text-lg font-bold text-text-primary">{t("title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {t("subtitle")}
      </p>
      <ul className="mt-5 grid min-w-0 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {revenueTools.map((tool) => {
          const href = isActive ? getPremiumToolHref(tool) : getPricingHref(tool);
          const ctaLabel = isActive ? t("openAnalyzer") : "Unlock Pro";

          return (
            <li key={tool.paidSlug} className="min-w-0">
              <Link
                href={href}
                className="group block text-premium-velvet hover:text-deep-navy"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-body-charcoal">
                  {getIndustryDisplayName(tool.sector)}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
                    {tool.paidTitle}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                    <Lock className="h-2.5 w-2.5" aria-hidden />
                    PRO
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal line-clamp-2">
                  {tool.painStatement}
                </p>
                <p className="mt-0.5 text-xs text-body-charcoal">
                  {tool.paidValue}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
