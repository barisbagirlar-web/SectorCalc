"use client";

import { useSearchParams } from "next/navigation";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

export function PricingToolUnlockBanner() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool");
  const tool = toolParam ? getRevenueToolByPaidSlug(toolParam) : null;

  if (!tool) {
    return null;
  }

  return (
    <div className="border-b border-professional-blue/20 bg-cyan/10" role="status">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-deep-navy">
          You are unlocking:{" "}
          <span className="font-semibold text-professional-blue">{tool.paidTitle}</span>
        </p>
        <p className="mt-1 text-sm text-slate">{tool.paidValue}</p>
      </div>
    </div>
  );
}
