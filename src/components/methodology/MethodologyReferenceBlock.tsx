import type { StandardReferenceEntry } from "@/lib/content/methodology/standard-reference-types";

type MethodologyReferenceBlockProps = {
  readonly references: readonly StandardReferenceEntry[];
  readonly title?: string;
};

export function MethodologyReferenceBlock({
  references,
  title = "Methodology references",
}: MethodologyReferenceBlockProps) {
  if (references.length === 0) {
    return (
      <aside className="sc-industrial-panel p-4 text-sm text-body-charcoal">
        <p className="font-medium text-navy">{title}</p>
        <p className="mt-2">No additional methodology reference is cataloged for this context yet.</p>
      </aside>
    );
  }

  return (
    <aside className="sc-industrial-panel min-w-0 space-y-4 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <ul className="space-y-4">
        {references.map((ref) => (
          <li key={ref.id} className="border-t border-border/60 pt-4 first:border-t-0 first:pt-0">
            <p className="text-sm font-medium text-navy">{ref.standardName}</p>
            <p className="mt-1 text-xs text-body-charcoal">{ref.referenceNote}</p>
            <p className="mt-2 text-xs text-body-charcoal">
              Confidence: {ref.confidenceLevel} · Reviewed: {ref.lastReviewedAt}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-body-charcoal">{ref.disclaimer}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
