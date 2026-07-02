"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/infrastructure/analytics/revenue-events";
import { saveVerdictReport } from "@/lib/features/reports/report-storage";
import type {
 PremiumToolInputValues,
 PremiumToolResult,
} from "@/lib/features/tools/premium-tool-results";
import type { RevenueTool } from "@/lib/features/tools/revenue-tools";

const buttonClass =
 "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60";

interface SaveVerdictReportButtonProps {
 uid: string;
 tool: RevenueTool;
 values: PremiumToolInputValues;
 result: PremiumToolResult;
}

export function SaveVerdictReportButton({
  uid,
  tool,
  values,
  result,
}: SaveVerdictReportButtonProps) {
  const t = useTranslations("saveVerdictReportButton");
  const [pending, setPending] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSave = async () => {
 if (pending || success) {
 return;
 }

 setPending(true);
 setError(null);

 const saveResult = await saveVerdictReport({ uid, tool, values, result });

 if (saveResult.ok) {
 setSuccess(true);
 setPending(false);
 trackRevenueEvent(REVENUE_EVENTS.verdict_report_saved, {
 toolSlug: tool.paidSlug,
 });
 return;
 }

 setError(saveResult.error);
 setPending(false);
 };

 return (
 <div className="inline-flex flex-col gap-2">
 <button
 type="button"
 onClick={() => void handleSave()}
 disabled={pending || success}
 className={buttonClass}
 >
        {pending ? t("saving") : success ? t("saved") : t("saveToReports")}
 </button>
 {error ? (
 <p className="text-sm text-amber" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
}
