import Link from "next/link";
import { REPORT_EXPORT_FORMATS } from "@/data/reports";

const PREVIEW_KPIS = [
  { label: "Minimum safe quote", value: "$14,280" },
  { label: "Target margin", value: "22%" },
  { label: "Risk level", value: "Elevated" },
  { label: "Recommendation", value: "Hold floor" },
] as const;

const REPORT_SECTIONS = [
  { num: 1, title: "Executive Summary", preview: "Quote sits below safe floor at current utilization." },
  { num: 2, title: "Key Findings", preview: "Setup and scrap assumptions drive margin sensitivity." },
  { num: 3, title: "Scenario Analysis", preview: "Conservative, base and aggressive margin paths." },
  { num: 4, title: "Risk Assessment", preview: "Structured risk signal for bid approval." },
  { num: 5, title: "Recommendation", preview: "Actionable guidance for quote and capacity." },
] as const;

export function ReportPreviewCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate/15 bg-white shadow-card">
      <div className="border-b border-slate/15 bg-deep-navy px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
              Decision report
            </p>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              Minimum Safe Quote — packaged output
            </h3>
          </div>
          <span className="rounded-md border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber">
            Risk: Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-slate/15 bg-slate/10 sm:grid-cols-4">
        {PREVIEW_KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white px-4 py-4 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate">
              {kpi.label}
            </p>
            <p className="mt-1 text-lg font-bold text-deep-navy">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8">
        <ol className="space-y-3">
          {REPORT_SECTIONS.map((section) => (
            <li
              key={section.title}
              className="flex gap-4 rounded-lg border border-slate/10 bg-off-white px-4 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-deep-navy text-sm font-bold text-white">
                {section.num}
              </span>
              <div className="min-w-0">
                <h4 className="font-semibold text-deep-navy">{section.title}</h4>
                <p className="mt-1 text-sm text-slate">{section.preview}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-professional-blue/20 bg-professional-blue/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
            Recommendation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-deep-navy">
            Raise quote to the minimum safe level or reduce setup and scrap exposure before
            committing capacity — structured for client or internal sign-off.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">
              Export package
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REPORT_EXPORT_FORMATS.map((format) => (
                <span
                  key={format}
                  className="rounded-md border border-slate/20 bg-white px-3 py-1.5 text-xs font-medium text-deep-navy"
                >
                  {format}
                  <span className="ml-1.5 text-slate">(preview)</span>
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/reports/sample-decision-report"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
          >
            View full sample report
          </Link>
        </div>
      </div>
    </div>
  );
}
