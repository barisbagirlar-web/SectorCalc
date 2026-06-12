"use client";

import { Link } from "@/i18n/routing";
import { CalculatorCardIcon } from "@/components/catalog/CalculatorCardIcon";

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

function CardArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

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
  accent = "blue",
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
    <article className="sc-calc-card" data-calculator-card="true">
      <div className="sc-card-badges">
        {!isIndustry ? (
          <span className={isPremium ? "sc-badge-premium" : "sc-badge-free"}>
            {isPremium ? badgePremiumLabel : badgeFreeLabel}
          </span>
        ) : (
          <span className="sc-badge-free">{badgeFreeLabel}</span>
        )}
        <span className="sc-badge-cat">{categoryLabel}</span>
      </div>

      <div className={`sc-card-icon-wrap sc-icon-${accent}`}>
        <CalculatorCardIcon accent={accent} />
      </div>

      <h3 className="sc-card-title">{title}</h3>
      <p className="sc-card-desc">{description}</p>

      <div className="sc-card-cta">
        <Link href={href} prefetch={false} className="sc-card-link">
          {ctaLabel}
          <CardArrowIcon />
        </Link>
        {metric ? <span className="sc-card-metric">{metric}</span> : null}
      </div>
    </article>
  );
}
