"use client";

import { PremiumInputGuide } from "@/components/tool-guides/PremiumInputGuide";

/** @deprecated Use PremiumInputGuide via ToolGuidanceLayout. Kept for backward-compatible imports. */
export function ShapeDimensionGuide({
  slug,
  locale,
  className,
}: {
  slug: string;
  locale: string;
  className?: string;
}) {
  return <PremiumInputGuide slug={slug} locale={locale} className={className} />;
}
