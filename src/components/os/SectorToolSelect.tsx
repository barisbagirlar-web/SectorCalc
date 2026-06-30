"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { revenueTools } from "@/lib/features/tools/revenue-tools";

interface SectorToolSelectProps {
  tier: "free" | "premium";
  currentSlug: string;
}

export function SectorToolSelect({ tier, currentSlug }: SectorToolSelectProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("pilotCnc");
  const slugKey = tier === "free" ? "freeSlug" : "paidSlug";
  const titleKey = tier === "free" ? "freeTitle" : "paidTitle";
  const hrefPrefix = tier === "free" ? "/tools/free/" : "/tools/premium/";

  return (
    <select
      aria-label={t("selectToolAria")}
      className="sc-input mb-4 max-w-md font-mono text-sm"
      value={currentSlug}
      onChange={(event) => router.push(`${hrefPrefix}${event.target.value}`)}
    >
      {revenueTools.map((tool) => {
        const slug = tool[slugKey];
        const registryTitle = tool[titleKey];
        const title = getLocalizedRevenueToolTitle(
          slug,
          tier === "premium" ? "paid" : "free",
          locale,
          registryTitle,
        );
        return (
          <option key={slug} value={slug}>
            {title}
          </option>
        );
      })}
    </select>
  );
}
