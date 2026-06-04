import { Container } from "@/components/ui/Container";

export function SplitFeatureSection() {
  return (
    <section className="border-y border-slate/10 bg-white py-20 md:py-28 lg:py-32">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-deep-navy sm:text-4xl lg:text-[2.75rem]">
              Complete clarity
              <br />
              for decision outputs
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate sm:text-lg">
              Premium sector tools turn validated inputs into stakeholder-ready packages — executive
              summary, scenario evaluation, risk signals and recommendations. One structured engine
              powers every industry pack so operators and advisors work from the same decision
              language.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
              Free tools deliver fast estimates; decision tools add the report layer when the cost of
              being wrong is real — without changing routes, formulas or validation behavior in the
              MVP.
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-slate/15 bg-off-white p-8 shadow-card md:p-10"
            aria-hidden
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Executive summary", tone: "bg-deep-navy" },
                { label: "Scenario paths", tone: "bg-professional-blue" },
                { label: "Risk assessment", tone: "bg-cyan/80" },
                { label: "Recommendation", tone: "bg-deep-navy/80" },
              ].map((block) => (
                <div
                  key={block.label}
                  className="rounded-xl border border-slate/10 bg-white p-5"
                >
                  <div className={`mb-4 h-2 w-12 rounded-full ${block.tone}`} />
                  <p className="text-sm font-semibold text-deep-navy">{block.label}</p>
                  <div className="mt-3 space-y-2">
                    <span className="block h-1.5 w-full rounded bg-slate/15" />
                    <span className="block h-1.5 w-[80%] rounded bg-slate/10" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate">
              Illustrative report modules — not live customer data
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
