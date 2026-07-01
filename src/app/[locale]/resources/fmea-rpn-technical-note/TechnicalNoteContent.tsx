import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const SECTIONS = [
  {
    id: "abstract",
    title: "Abstract",
    content: <p className="text-sm leading-relaxed text-body-charcoal">This technical note documents the traditional Risk Priority Number calculation used in Failure Mode and Effects Analysis. It defines Severity, Occurrence and Detection inputs, validates expected RPN outputs, provides an illustrative PFMEA dataset, explains RPN collision behavior and summarizes the limitations of RPN-based prioritization.</p>,
  },
  {
    id: "formula",
    title: "Formula",
    content: <div><p className="mb-2 font-mono text-base font-semibold text-premium-velvet">RPN = S \u00d7 O \u00d7 D</p><p className="text-sm">Output range: 1 (minimum) to 1000 (maximum).</p></div>,
  },
  {
    id: "input-definitions",
    title: "Input Definitions",
    content: <div className="space-y-4 text-sm"><div><h4 className="font-semibold">Severity (S)</h4><p>Measures the seriousness of the failure effect on the customer, operator, equipment or regulatory compliance.</p></div><div><h4 className="font-semibold">Occurrence (O)</h4><p>Estimates the likelihood or frequency of the failure cause or failure mode occurring.</p></div><div><h4 className="font-semibold">Detection (D)</h4><p>Estimates the effectiveness of current detection controls in identifying the failure mode or its cause before the product reaches the customer.</p></div></div>,
  },
  {
    id: "validations",
    title: "Calculation Validation Cases",
    content: <div className="overflow-x-auto border"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">S</th><th className="px-3 py-1.5 font-mono font-semibold">O</th><th className="px-3 py-1.5 font-mono font-semibold">D</th><th className="px-3 py-1.5 font-mono font-semibold">Expected RPN</th><th className="px-3 py-1.5 font-mono font-semibold">Result</th></tr></thead><tbody>{[[1,1,1,1],[5,5,5,125],[7,5,4,140],[8,4,5,160],[10,10,10,1000]].map((r,i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono">{r[0]}</td><td className="px-3 py-2 font-mono">{r[1]}</td><td className="px-3 py-2 font-mono">{r[2]}</td><td className="px-3 py-2 font-mono">{r[3]}</td><td className="px-3 py-2 font-mono font-semibold text-green-600">Pass</td></tr>))}</tbody></table></div>,
  },
  {
    id: "limitations",
    title: "Limitations of RPN",
    content: <ul className="list-disc list-inside space-y-2 text-sm"><li>Ordinal multiplication produces a ranking index, not a physical measurement.</li><li>RPN values from different organizations or rating tables are not comparable.</li><li>Two different failure modes can produce the same RPN despite different risk profiles.</li><li>RPN does not incorporate cost, warranty or regulatory priority.</li><li>RPN should not be used as an absolute safety threshold.</li></ul>,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: <div className="border bg-industrial-matte p-3 text-xs italic">This technical note is an educational engineering reference. It does not replace official standards, customer-specific requirements, or your organization\u2019s approved FMEA procedure.</div>,
  },
];

export function TechnicalNoteContent() {
  return (
    <PageLayout>
      <main>
        <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-14">
          <Container size="narrow">
            <span className="inline-block border border-border-subtle bg-industrial-matte px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-premium-velvet">Technical Note</span>
            <h1 className="mt-3 text-balance sc-h2">FMEA RPN Calculator Technical Note</h1>
            <p className="mt-4 max-w-2xl sc-body-muted sm:text-lg">Traditional Risk Priority Number calculation in Failure Mode and Effects Analysis: formula, validation, collision analysis, limitations and citation reference.</p>
            <div className="mt-6"><Button href="https://sectorcalc.com/calculators/fmea-rpn" variant="outline" size="cta">\u2190 Back to Calculator</Button></div>
          </Container>
        </section>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="border-b border-border-subtle py-8 sm:py-10">
            <Container size="narrow"><h2 className="mb-4 sc-h2">{s.title}</h2>{s.content}</Container>
          </section>
        ))}
      </main>
    </PageLayout>
  );
}
