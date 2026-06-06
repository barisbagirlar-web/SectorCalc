"use client";

import { useEffect, useState, type ReactNode } from "react";
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
}: PremiumDecisionReportPanelProps) {
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.premium_preview_viewed, { toolSlug });
  }, [toolSlug]);

  const handleExportClick = (format: string) => {
    trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format });
    setExportMessage(EXPORT_MOCK_MESSAGE);
  };

  const sections: {
    title: string;
    content: ReactNode;
  }[] = [
    { title: "Executive Summary", content: report.executiveSummary },
    {
      title: "Key Findings",
      content: (
        <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-teal">
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
    { title: "Suggested Action", content: report.recommendation },
    {
      title: "Assumptions",
      content: (
        <p className="text-text-muted italic">{report.assumptions}</p>
      ),
    },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-amber/25 bg-gradient-to-b from-deep-navy via-deep-navy to-dark-navy shadow-card-dark">
      <div className="relative border-b border-border-subtle px-5 py-6 sm:px-8 sm:py-7">
        <Badge variant="premium" className="mb-3">
          Decision summary
        </Badge>
        <h2 className="max-w-xl text-xl font-bold text-white sm:text-2xl">
          {toolTitle} — structured output
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          This summary is the export-ready view of your paid analyzer result — verdict,
          key drivers and suggested action. PDF download ships in a later release.
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-text-muted">
          Based on your inputs only — not industry benchmarks. Review assumptions before
          acting.
        </p>
      </div>

      <div className="space-y-4 px-4 py-6 sm:space-y-5 sm:px-6 sm:py-8">
        {sections.map((section, index) => (
          <article
            key={section.title}
            className="relative rounded-xl border border-border-subtle bg-white/[0.04] p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-teal/20 text-sm font-bold text-accent-teal">
                {index + 1}
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-teal">
                {section.title}
              </h3>
            </div>
            <div className="text-sm leading-relaxed text-text-secondary sm:text-[15px]">
              {section.content}
            </div>
          </article>
        ))}

        <article className="rounded-xl border border-dashed border-amber/30 bg-amber/[0.06] p-5 sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-amber">
            Export (PDF preview)
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            PDF export is the paid tool result in shareable form — preview only until the
            export release ships.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {EXPORT_ACTIONS.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => handleExportClick(format)}
                className="min-h-[44px] w-full rounded-lg border border-border-subtle bg-white/5 px-4 text-sm font-medium text-text-secondary transition-colors hover:border-amber/30 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                {format}
                <span className="ml-2 text-xs text-slate-500">(preview)</span>
              </button>
            ))}
          </div>
          {exportMessage ? (
            <p className="mt-4 text-sm text-text-muted" role="status">
              {exportMessage}
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
