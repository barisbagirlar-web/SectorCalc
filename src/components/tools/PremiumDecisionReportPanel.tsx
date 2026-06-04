"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";
import { Badge } from "@/components/ui/Badge";
import { REPORT_EXPORT_FORMATS } from "@/data/reports";
import { EXPORT_MOCK_MESSAGE } from "@/config/export-messages";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";
import type { PremiumDecisionReport } from "@/lib/calculators/premium-types";
import type { ResultTone } from "@/data/tool-schema";

interface PremiumDecisionReportPanelProps {
  report: PremiumDecisionReport;
  riskLevel: ResultTone;
  scenariosSummary: string;
  toolSlug?: string;
  toolTitle: string;
  industryLeadValue?: string;
}

const riskBadgeVariant: Record<
  ResultTone,
  "free" | "premium" | "muted" | "default"
> = {
  success: "free",
  warning: "premium",
  danger: "muted",
  neutral: "default",
};

const EXPORT_ACTIONS = [...REPORT_EXPORT_FORMATS, "Save"] as const;

export function PremiumDecisionReportPanel({
  report,
  riskLevel,
  scenariosSummary,
  toolSlug,
  toolTitle,
  industryLeadValue,
}: PremiumDecisionReportPanelProps) {
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.premium_preview_viewed, { toolSlug });
  }, [toolSlug]);

  const handleExportClick = (format: string) => {
    trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format });
    setExportMessage(EXPORT_MOCK_MESSAGE);
  };

  const handleUnlockClick = () => {
    trackEvent(ANALYTICS_EVENTS.unlock_clicked, { toolSlug, source: "report_panel" });
  };

  const handlePricingClick = () => {
    trackEvent(ANALYTICS_EVENTS.pricing_clicked, { toolSlug, source: "report_panel" });
  };

  const sections: {
    title: string;
    content: ReactNode;
  }[] = [
    { title: "Executive Summary", content: report.executiveSummary },
    {
      title: "Key Findings",
      content: (
        <ul className="list-disc space-y-2.5 pl-5 marker:text-cyan">
          {report.keyFindings.map((finding) => (
            <li key={finding}>{finding}</li>
          ))}
        </ul>
      ),
    },
    { title: "Scenario Analysis", content: scenariosSummary },
    {
      title: "Risk Level",
      content: (
        <Badge variant={riskBadgeVariant[riskLevel]} className="text-sm">
          {report.riskLevelLabel}
        </Badge>
      ),
    },
    { title: "Recommendation", content: report.recommendation },
    {
      title: "Assumptions",
      content: (
        <p className="text-slate-400 italic">{report.assumptions}</p>
      ),
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-amber/25 bg-gradient-to-b from-deep-navy via-deep-navy to-dark-navy shadow-card-dark">
      <div className="relative border-b border-white/10 px-5 py-6 sm:px-8 sm:py-7">
        <div
          className="pointer-events-none absolute right-4 top-4 rounded-md border border-amber/20 bg-amber/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber/80 sm:right-6 sm:top-6"
          aria-hidden
        >
          Paid deliverable
        </div>
        <Badge variant="premium" className="mb-3">
          Premium report preview
        </Badge>
        <h2 className="max-w-xl pr-20 text-xl font-bold text-white sm:pr-0 sm:text-2xl">
          Decision Report
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          The premium product is this packaged report — executive summary, scenarios,
          risk verdict, and recommendation you can share. Calculator numbers above
          are live; checkout and file export are not enabled in this MVP.
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
          Based on your inputs only — not industry benchmarks. Review assumptions
          in section 6 before acting.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LeadIntentTrigger
            source="premium_unlock"
            toolRequested={toolTitle}
            industry={industryLeadValue}
            onBeforeOpen={handleUnlockClick}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-amber px-6 text-sm font-semibold text-deep-navy transition-colors hover:bg-amber/90 sm:w-auto"
          >
            Request decision report
          </LeadIntentTrigger>
          <Link
            href="/pricing"
            onClick={handlePricingClick}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            View pricing
          </Link>
        </div>
      </div>

      <div className="space-y-4 px-4 py-6 sm:space-y-5 sm:px-6 sm:py-8">
        {sections.map((section, index) => (
          <article
            key={section.title}
            className="relative rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-professional-blue/20 text-sm font-bold text-cyan">
                {index + 1}
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan">
                {section.title}
              </h3>
            </div>
            <div className="text-sm leading-relaxed text-slate-200 sm:text-[15px]">
              {section.content}
            </div>
          </article>
        ))}

        <article className="rounded-xl border border-dashed border-amber/30 bg-amber/[0.06] p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber">
            Export package
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            PDF, Excel, and Word exports ship with the paid report — preview buttons
            below do not download files in the MVP.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {EXPORT_ACTIONS.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => handleExportClick(format)}
                className="min-h-[44px] w-full rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-amber/30 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                {format}
                <span className="ml-2 text-xs text-slate-500">(preview)</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Preview only — no file is generated in the MVP.
          </p>
        </article>
      </div>

      {exportMessage && (
        <div className="space-y-4 border-t border-white/10 bg-professional-blue/10 px-5 py-4 sm:px-8">
          <p className="text-sm leading-relaxed text-slate-200" role="status">
            {exportMessage}
          </p>
          <LeadIntentTrigger
            source="export"
            toolRequested={toolTitle}
            industry={industryLeadValue}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-amber/40 bg-amber/10 px-4 text-sm font-semibold text-amber transition-colors hover:bg-amber/20 sm:w-auto"
          >
            Request premium report access
          </LeadIntentTrigger>
        </div>
      )}

      <div className="border-t border-white/10 bg-dark-navy/80 px-5 py-5 sm:px-8">
        <p className="text-xs leading-relaxed text-slate-500">
          Calculator results above are live. The structured decision report is what
          you are requesting access to — export and payment unlock in a later release.
        </p>
      </div>
    </section>
  );
}
