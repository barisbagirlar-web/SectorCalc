"use client";

import { useTranslations } from "next-intl";
import { CalculatorCard } from "@/components/catalog/CalculatorCard";
import { CalculatorCardGrid } from "@/components/catalog/CalculatorCardGrid";
import type { ResolvedIndustryTool } from "@/lib/features/industries/resolve-industry-tools";

type IndustryCalculatorCardListProps = {
  readonly tools: readonly ResolvedIndustryTool[];
  readonly tier: "free" | "premium";
};

export function IndustryCalculatorCardList({ tools, tier }: IndustryCalculatorCardListProps) {
  const tCards = useTranslations("calculatorCards");
  const tIndustries = useTranslations("industries");
  const tCatalog = useTranslations("catalogExplorer");

  const badgeFree = tCatalog("search.badgeFree");
  const badgePremium = tCatalog("search.badgePremium");
  const ctaOpen = tIndustries("openCalculator");

  return (
    <CalculatorCardGrid className="mt-6">
      {tools.map((tool) => (
        <li key={tool.href} className="min-w-0">
          <CalculatorCard
            title={tool.title}
            description={tool.description}
            href={tool.href}
            categoryLabel={tool.categoryLabel}
            tier={tier}
            inputCount={tool.inputCount}
            accent={tool.accent ?? (tier === "premium" ? "orange" : "blue")}
            badgeFreeLabel={badgeFree}
            badgePremiumLabel={badgePremium}
            ctaLabel={ctaOpen}
            inputCountLabel={(count) => tCards("inputCount", { count })}
          />
        </li>
      ))}
    </CalculatorCardGrid>
  );
}
