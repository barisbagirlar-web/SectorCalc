import { REPORT_DISCLAIMER } from "@/lib/content/legal/report-disclaimer";

type ReportDisclaimerBlockProps = {
  readonly compact?: boolean;
};

export function ReportDisclaimerBlock({ compact = false }: ReportDisclaimerBlockProps) {
  return (
    <aside
      className={`sc-industrial-panel min-w-0 border border-border/60 ${compact ? "p-3" : "p-4 sm:p-5"}`}
    >
      <h2 className={`font-semibold text-navy ${compact ? "text-sm" : "text-base"}`}>
        {REPORT_DISCLAIMER.title}
      </h2>
      <ul className={`mt-3 list-disc space-y-2 pl-5 text-body-charcoal ${compact ? "text-xs" : "text-sm"}`}>
        {REPORT_DISCLAIMER.paragraphs.map((paragraph) => (
          <li key={paragraph}>{paragraph}</li>
        ))}
      </ul>
      <p className={`mt-3 text-body-charcoal ${compact ? "text-xs" : "text-sm"}`}>
        {REPORT_DISCLAIMER.professionalReviewNote}
      </p>
    </aside>
  );
}
