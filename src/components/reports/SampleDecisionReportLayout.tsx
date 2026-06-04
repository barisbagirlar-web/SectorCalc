import Link from "next/link";
import { RequestPremiumReportLeadButton } from "@/components/leads/RequestPremiumReportLeadButton";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { REPORT_EXPORT_FORMATS } from "@/data/reports";
import {
  SAMPLE_REPORT_KPIS,
  SAMPLE_REPORT_EXECUTIVE_SUMMARY,
  SAMPLE_REPORT_KEY_FINDINGS,
  SAMPLE_REPORT_SCENARIOS,
  SAMPLE_REPORT_RISK,
  SAMPLE_REPORT_RECOMMENDATION,
  SAMPLE_REPORT_ASSUMPTIONS,
  SAMPLE_REPORT_INCLUDES,
} from "@/data/sample-report-content";

const kpiToneClasses = {
  neutral: "border-slate/20 bg-white",
  success: "border-emerald/30 bg-emerald/5",
  warning: "border-amber/30 bg-amber/5",
  danger: "border-soft-red/30 bg-soft-red/5",
};

export function SampleDecisionReportLayout() {
  return (
    <>
      <section className="border-b border-slate/10 bg-white py-12 md:py-16">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-professional-blue">
            Report structure
          </p>
          <h2 className="mt-3 text-2xl font-bold text-deep-navy sm:text-3xl">
            What a packaged decision report includes
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate">
            Premium sector tools turn validated inputs into a stakeholder-ready
            report — executive summary, scenario evaluation, risk signals and a
            clear recommendation.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {SAMPLE_REPORT_INCLUDES.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-slate/10 bg-off-white px-4 py-3 text-sm text-deep-navy"
              >
                <span className="font-semibold text-professional-blue" aria-hidden>
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-slate/10 bg-off-white py-14 md:py-20">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-slate/20 bg-white shadow-card">
            <div className="border-b border-slate/15 bg-deep-navy px-6 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan">
                Illustrative CNC job · Premium report layout
              </p>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Minimum Safe Quote — Decision Report
              </h2>
            </div>

            <div className="grid gap-4 border-b border-slate/15 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
              {SAMPLE_REPORT_KPIS.map((kpi) => (
                <div
                  key={kpi.id}
                  className={`rounded-xl border p-4 ${kpiToneClasses[kpi.tone]}`}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate">
                    {kpi.label}
                  </p>
                  <p className="mt-2 text-xl font-bold text-deep-navy">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <article>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                  Executive Summary
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate sm:text-base">
                  {SAMPLE_REPORT_EXECUTIVE_SUMMARY}
                </p>
              </article>

              <article>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                  Key Findings
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate sm:text-base">
                  {SAMPLE_REPORT_KEY_FINDINGS.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              </article>

              <article>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                  Scenario Analysis
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate/20 text-xs font-semibold uppercase tracking-wider text-slate">
                        <th className="pb-3 pr-4">Scenario</th>
                        <th className="pb-3 pr-4">Margin</th>
                        <th className="pb-3 pr-4">Quote</th>
                        <th className="pb-3 pr-4">Unit</th>
                        <th className="pb-3">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_REPORT_SCENARIOS.map((row) => (
                        <tr
                          key={row.label}
                          className="border-b border-slate/10 last:border-0"
                        >
                          <td className="py-3 pr-4 font-medium text-deep-navy">
                            {row.label}
                          </td>
                          <td className="py-3 pr-4 text-slate">{row.margin}</td>
                          <td className="py-3 pr-4 font-medium text-deep-navy">
                            {row.quote}
                          </td>
                          <td className="py-3 pr-4 text-slate">{row.unit}</td>
                          <td className="py-3 text-emerald font-medium">
                            {row.profit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-xl border border-amber/25 bg-amber/5 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber">
                  Risk Assessment
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-deep-navy sm:text-base">
                  {SAMPLE_REPORT_RISK}
                </p>
              </article>

              <article className="rounded-xl border border-professional-blue/20 bg-professional-blue/5 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                  Recommendation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-deep-navy sm:text-base">
                  {SAMPLE_REPORT_RECOMMENDATION}
                </p>
              </article>

              <article>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate">
                  Assumptions
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate italic">
                  {SAMPLE_REPORT_ASSUMPTIONS}
                </p>
              </article>

              <article className="rounded-xl border border-dashed border-slate/25 bg-off-white p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate">
                  Export Preview
                </h3>
                <p className="mt-2 text-sm text-slate">
                  Paid reports will export to:
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {REPORT_EXPORT_FORMATS.map((format) => (
                    <span
                      key={format}
                      className="min-h-[44px] inline-flex items-center rounded-lg border border-slate/20 bg-white px-4 text-sm font-medium text-deep-navy"
                    >
                      {format}
                      <span className="ml-2 text-xs text-slate">(coming soon)</span>
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-center">
            <RequestPremiumReportLeadButton />
            <Button href="/industries" variant="outline" size="lg">
              Explore Premium Sector Tools
            </Button>
            <p className="mt-4 text-sm text-slate">
              <Link href="/pricing" className="font-semibold text-professional-blue hover:underline">
                Compare plans
              </Link>
              {" · "}
              <Link href="/free-tools" className="font-semibold text-professional-blue hover:underline">
                Start with free tools
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
