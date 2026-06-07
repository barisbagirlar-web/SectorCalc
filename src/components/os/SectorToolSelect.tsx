"use client";

import { useRouter } from "@/i18n/routing";
import { revenueTools } from "@/lib/tools/revenue-tools";

interface SectorToolSelectProps {
  tier: "free" | "premium";
  currentSlug: string;
}

export function SectorToolSelect({ tier, currentSlug }: SectorToolSelectProps) {
  const router = useRouter();
  const slugKey = tier === "free" ? "freeSlug" : "paidSlug";
  const titleKey = tier === "free" ? "freeTitle" : "paidTitle";
  const hrefPrefix = tier === "free" ? "/tools/free/" : "/tools/premium/";

  return (
    <select
      aria-label="Select sector tool"
      className="sc-input mb-4 max-w-md font-mono text-sm"
      value={currentSlug}
      onChange={(event) => router.push(`${hrefPrefix}${event.target.value}`)}
    >
      {revenueTools.map((tool) => (
        <option key={tool[slugKey]} value={tool[slugKey]}>
          {tool[titleKey]}
        </option>
      ))}
    </select>
  );
}
