"use client";

import { EnhancedBreakdownChart } from "@/components/tools/EnhancedBreakdownChart";
import type { GeneratedToolBreakdown } from "@/lib/features/generated-tools/types";

type BreakdownBarChartProps = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly labelMap?: Readonly<Record<string, string>>;
  readonly locale: string;
  readonly currency?: string;
  readonly isPro?: boolean;
};

/** @deprecated Prefer EnhancedBreakdownChart directly */
export function BreakdownBarChart({
  breakdown,
  labelMap,
  locale,
  currency = "TRY",
  isPro = false,
}: BreakdownBarChartProps) {
  return (
    <EnhancedBreakdownChart
      breakdown={breakdown}
      labelMap={labelMap}
      locale={locale}
      currency={currency}
      isPro={isPro}
    />
  );
}

export { EnhancedBreakdownChart };
