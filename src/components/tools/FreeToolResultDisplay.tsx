"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { RiskGauge } from "@/components/tools/RiskGauge";
import { useLeadIntent } from "@/components/leads/LeadIntentContext";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getIndustryNameBySlug } from "@/data/lead-options";
import type { RevenueSector } from "@/lib/tools/revenue-tools";

interface FreeToolResultDisplayProps {
 riskScore: number;
 riskLabel: string;
 explanation: string;
 /** Premium tool slug for checkout routing */
 paidSlug: string;
 paidTitle: string;
 sector: RevenueSector;
}

const LOCKED_VERDICT_ITEMS = [
 "P90 safe price",
 "Margin leak breakdown",
 "Recommended action",
 "Sensitivity matrix",
] as const;

export function FreeToolResultDisplay({
 riskScore,
 riskLabel,
 explanation,
 paidSlug,
 paidTitle,
 sector,
}: FreeToolResultDisplayProps) {
 const t = useTranslations("freeTool");
 const pathname = usePathname();
 const { openLeadModal } = useLeadIntent();
 const { user, loading: authLoading } = useUserSubscription();

 const handleUnlock = () => {
 if (authLoading) return;

 const industryName = getIndustryNameBySlug(sector);

 openLeadModal({
 source: "premium_unlock",
 flow: user ? "paywall" : "verdict_unlock",
 toolSlug: paidSlug,
 toolRequested: paidTitle,
 industry: industryName,
 plan: "single_report",
 pagePath: pathname,
 });
 };

 return (
 <div className="space-y-6">
 <RiskGauge score={riskScore} label={riskLabel} />

 <div className="rounded-sm border border-border-subtle bg-bg-subtle p-6">
 <h3 className="mb-2 text-lg font-bold text-text-primary">
 {t("whatItMeans")}
 </h3>
 <p className="text-sm leading-relaxed text-text-secondary">{explanation}</p>
 </div>

 <div className="overflow-hidden rounded-sm border border-amber/25 bg-ink-black p-6">
 <p className="text-xs font-semibold uppercase tracking-wider text-amber">
 Withheld from free tier
 </p>
 <ul className="mt-4 space-y-2.5">
 {LOCKED_VERDICT_ITEMS.map((item) => (
 <li
 key={item}
 className="flex items-center justify-between gap-3 text-sm text-white/75"
 >
 <span>{item}</span>
 <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-amber/80">
 Pro
 </span>
 </li>
 ))}
 </ul>

 <div className="mt-6 border-t border-border-subtle/40 pt-6">
 <h3 className="text-lg font-bold text-white">{t("unlockVerdictTitle")}</h3>
 <p className="mt-2 text-sm leading-relaxed text-white/75">
 {t("unlockVerdictBody")}
 </p>
 <button
 type="button"
 onClick={handleUnlock}
 disabled={authLoading}
 className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-amber/40 bg-amber px-6 text-sm font-semibold text-ink-black transition-colors hover:bg-amber/90 disabled:opacity-60 sm:w-auto"
 >
 {authLoading ? t("unlockVerdictLoading") : t("unlockVerdictCta")}
 </button>
 </div>
 </div>
 </div>
 );
}
