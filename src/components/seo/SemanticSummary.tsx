export interface SemanticSummaryProps {
  title: string;
  answer: string;
  bullets?: readonly string[];
}

/**
 * AI Overviews / featured snippet optimized summary block (TOC anchor).
 */
export function SemanticSummary({ title, answer, bullets = [] }: SemanticSummaryProps) {
  return (
    <aside
      id="semantic-summary"
      className="ind-os-panel mb-6 font-sans text-sm text-body-charcoal"
    >
      <p className="label-badge mb-2 text-body-charcoal">Direct Answer</p>
      <h2 className="font-display text-base font-semibold text-premium-velvet">{title}</h2>
      <p className="mt-2 leading-relaxed">{answer}</p>
      {bullets.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-body-charcoal">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
