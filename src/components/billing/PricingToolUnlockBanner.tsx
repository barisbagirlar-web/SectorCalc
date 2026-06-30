"use client";

import { useClientSearchParam } from "@/lib/ui-shared/navigation/use-client-search-params";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

const PRICING_UNLOCK_SUBTITLES: Partial<Record<string, string>> = {
 "cnc-quote-risk-analyzer":
 "Get the minimum safe price and quote verdict for setup-heavy jobs.",
};

export function PricingToolUnlockBanner() {
 const toolParam = useClientSearchParam("tool");
 const tool = toolParam ? getRevenueToolByPaidSlug(toolParam) : null;

 if (!tool) {
 return null;
 }

 const subtitle =
 PRICING_UNLOCK_SUBTITLES[tool.paidSlug] ?? tool.paidValue;

 return (
 <div className="border-b border-accent-teal/20 bg-accent-teal/10" role="status">
 <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
 <p className="text-sm font-medium text-text-primary">
 You are unlocking:{" "}
 <span className="font-semibold text-deep-navy">{tool.paidTitle}</span>
 </p>
 <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
 </div>
 </div>
 );
}
