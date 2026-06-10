import Link from "@/lib/navigation/next-link";
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
 <div className="overflow-hidden rounded-lg border border-border-subtle bg-white shadow-card">
 <div className="border-b border-border-subtle bg-bg-primary px-6 py-5 sm:px-8">
 <div className="flex flex-wrap items-start justify-between gap-4">
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-deep-navy">
 Decision report
 </p>
 <h3 className="mt-2 text-xl font-bold text-premium-velvet sm:text-2xl">
 Minimum Safe Quote — packaged output
 </h3>
 </div>
 <span className="rounded-md border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber">
 Risk: Review
 </span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-px border-b border-border-subtle bg-slate/10 sm:grid-cols-4">
 {PREVIEW_KPIS.map((kpi) => (
 <div key={kpi.label} className="bg-white px-4 py-4 sm:px-5">
 <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
 {kpi.label}
 </p>
 <p className="mt-1 text-lg font-bold text-text-primary">{kpi.value}</p>
 </div>
 ))}
 </div>

 <div className="p-6 md:p-8">
 <ol className="space-y-3">
 {REPORT_SECTIONS.map((section) => (
 <li
 key={section.title}
 className="flex gap-4 rounded-lg border border-border-subtle bg-bg-subtle px-4 py-4"
 >
 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-deep-navy text-sm font-bold text-white">
 {section.num}
 </span>
 <div className="min-w-0">
 <h4 className="font-semibold text-text-primary">{section.title}</h4>
 <p className="mt-1 text-sm text-text-secondary">{section.preview}</p>
 </div>
 </li>
 ))}
 </ol>

 <div className="mt-6 rounded-sm border border-deep-navy/15 bg-bg-subtle p-5">
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 Recommendation
 </p>
 <p className="mt-2 text-sm leading-relaxed text-text-primary">
 Raise quote to the minimum safe level or reduce setup and scrap exposure before
 committing capacity — structured for client or internal sign-off.
 </p>
 </div>

 <div className="mt-6 flex flex-col gap-4 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
 Export package
 </p>
 <div className="mt-3 flex flex-wrap gap-2">
 {REPORT_EXPORT_FORMATS.map((format) => (
 <span
 key={format}
 className="rounded-md border border-border-subtle bg-white px-3 py-1.5 text-xs font-medium text-text-primary"
 >
 {format}
 <span className="ml-1.5 text-text-secondary">(preview)</span>
 </span>
 ))}
 </div>
 </div>
 <Link
 href="/reports/sample-decision-report"
 className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto"
 >
 View full sample report
 </Link>
 </div>
 </div>
 </div>
 );
}
