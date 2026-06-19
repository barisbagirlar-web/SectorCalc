"use client";

import { Lock } from "lucide-react";
import { Link } from "@/i18n/routing";

export type CalculatorCardAccent = "blue" | "orange" | "green";

export type CalculatorCardProps = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly categoryLabel: string;
  readonly tier?: "free" | "premium";
  readonly variant?: "calculator" | "industry";
  readonly inputCount?: number;
  readonly freeToolCount?: number;
  readonly premiumToolCount?: number;
  readonly accent?: CalculatorCardAccent;
  readonly badgeFreeLabel: string;
  readonly badgePremiumLabel: string;
  readonly ctaLabel: string;
  readonly inputCountLabel?: (count: number) => string;
  readonly sectorCountLabel?: (free: number, premium: number) => string;
};

/** Text-based tool or industry item — name + description, no box. */
export function CalculatorCard({
  title,
  description,
  href,
  categoryLabel,
  tier = "free",
  variant = "calculator",
  inputCount,
  freeToolCount,
  premiumToolCount,
  badgeFreeLabel,
  badgePremiumLabel,
  ctaLabel,
  inputCountLabel,
  sectorCountLabel,
}: CalculatorCardProps) {
  const isIndustry = variant === "industry";
  const isPremium = tier === "premium";

  const metric =
    isIndustry && freeToolCount != null && premiumToolCount != null && sectorCountLabel
      ? sectorCountLabel(freeToolCount, premiumToolCount)
      : typeof inputCount === "number" && inputCountLabel
        ? inputCountLabel(inputCount)
        : null;

  return (
    <article>
      <Link href={href} prefetch={false} className="group block text-premium-velvet hover:text-deep-navy">
        <div className="flex items-center gap-1.5">
          {isIndustry ? (
            <span className="flex items-center gap-1">
              {metric ? (
                <span className="text-[10px] font-medium uppercase tracking-wider text-body-charcoal">
                  {metric}
                </span>
              ) : null}
              <span className="text-xs leading-tight text-body-charcoal">{categoryLabel}</span>
            </span>
          ) : (
            <>
              <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
                {title}
              </span>
              {isPremium ? (
                <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                  <Lock className="h-2.5 w-2.5" aria-hidden />
                  PRO
                </span>
              ) : null}
            </>
          )}
        </div>
        {isIndustry ? (
          <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
            {title}
          </span>
        ) : description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal line-clamp-2">
            {description}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
