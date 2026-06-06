import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SingleVerdictUpsellButton } from "@/components/pricing/PlanCheckoutAction";
import {
  SAMPLE_REPORT_DISCLAIMER,
  SAMPLE_REPORT_EXECUTIVE_VERDICT,
  SAMPLE_REPORT_INPUT_SUMMARY,
  SAMPLE_REPORT_MARGIN_LEAKS,
  SAMPLE_REPORT_MARGIN_RISK,
  SAMPLE_REPORT_MINIMUM_SAFE_PRICE,
  SAMPLE_REPORT_SCENARIOS,
  SAMPLE_REPORT_SUGGESTED_ACTION,
  SAMPLE_REPORT_TITLE,
  SAMPLE_REPORT_VERDICT,
  SAMPLE_REPORT_MAIN_LEAK,
} from "@/data/sample-report-content";
import { getFreeToolsHref, getPremiumToolsHref, getPricingHref } from "@/lib/tools/tool-links";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";

const toneClasses = {
  danger: "border-soft-red/30 bg-soft-red/5 text-soft-red",
  warning: "border-amber/30 bg-amber/5 text-amber",
  success: "border-emerald/30 bg-emerald/5 text-emerald",
};

export function SampleDecisionReportLayout() {
  return (
    <section className="bg-off-white py-12 md:py-16 sc-section">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-slate/20 bg-white shadow-card">
          <header className="border-b border-slate/15 bg-deep-navy px-6 py-8 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan">
              Premium verdict report · Illustrative sample
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {SAMPLE_REPORT_TITLE}
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Decision-ready output — not a calculator dump.
            </p>
          </header>

          <div className="space-y-10 p-6 sm:p-10">
            <article className="sc-card border-soft-red/35 bg-soft-red/[0.04]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-soft-red">
                Executive verdict
              </h3>
              <p className="mt-4 text-2xl font-bold text-soft-red sm:text-3xl">
                {SAMPLE_REPORT_VERDICT}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-deep-navy sm:text-base">
                {SAMPLE_REPORT_EXECUTIVE_VERDICT}
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate">
                    Margin risk
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-soft-red">
                    {SAMPLE_REPORT_MARGIN_RISK} RISK
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate">
                    Main leak
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-deep-navy">
                    {SAMPLE_REPORT_MAIN_LEAK}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate">
                    Suggested action
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-deep-navy">
                    {SAMPLE_REPORT_SUGGESTED_ACTION}
                  </dd>
                </div>
              </dl>
            </article>

            <article>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                Input summary
              </h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {SAMPLE_REPORT_INPUT_SUMMARY.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-slate/15 bg-off-white px-4 py-3"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-deep-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="sc-card border-emerald/30 bg-emerald/[0.04]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald">
                Minimum safe price
              </h3>
              <p className="mt-3 text-3xl font-bold text-deep-navy">
                {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.amount}
              </p>
              <p className="mt-1 text-sm font-medium text-slate">
                {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.perUnit}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.note}
              </p>
            </article>

            <article>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                Margin leak diagnosis
              </h3>
              <ul className="mt-4 space-y-3">
                {SAMPLE_REPORT_MARGIN_LEAKS.map((leak) => (
                  <li
                    key={leak.driver}
                    className="sc-card flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-deep-navy">{leak.driver}</p>
                      <p className="mt-1 text-sm text-slate">{leak.impact}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-bold uppercase tracking-wider ${
                        leak.severity === "high" ? "text-soft-red" : "text-amber"
                      }`}
                    >
                      {leak.severity} exposure
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                Scenario comparison
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate/20 text-xs font-semibold uppercase tracking-wider text-slate">
                      <th className="pb-3 pr-4">Scenario</th>
                      <th className="pb-3 pr-4">Quote</th>
                      <th className="pb-3 pr-4">Margin</th>
                      <th className="pb-3">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_REPORT_SCENARIOS.map((row) => (
                      <tr key={row.label} className="border-b border-slate/10 last:border-0">
                        <td className="py-3 pr-4 font-medium text-deep-navy">{row.label}</td>
                        <td className="py-3 pr-4 text-deep-navy">{row.quote}</td>
                        <td className="py-3 pr-4 text-slate">{row.margin}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[row.tone]}`}
                          >
                            {row.verdict}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="sc-card border-professional-blue/25 bg-professional-blue/[0.04]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-professional-blue">
                Suggested action
              </h3>
              <p className="mt-3 text-base font-semibold text-deep-navy">
                {SAMPLE_REPORT_SUGGESTED_ACTION}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                Confirm material price stability, tooling availability and first-piece approval
                time before sending a revised quote. If scope cannot be reduced, hold the line at
                the minimum safe price floor.
              </p>
            </article>

            <article className="rounded-xl border border-dashed border-slate/25 bg-off-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate">
                Disclaimer
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {SAMPLE_REPORT_DISCLAIMER}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate">{revenueLegalDisclaimer}</p>
            </article>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <SingleVerdictUpsellButton
              toolTitle={SAMPLE_REPORT_TITLE}
              pagePath="/reports/sample-decision-report"
              className="sc-btn-primary inline-flex w-full justify-center sm:w-auto"
            />
            <Button href={getPricingHref()} variant="outline" size="cta">
              View all plans
            </Button>
          </div>
          <p className="text-sm text-slate">
            <Link href={getFreeToolsHref()} className="font-semibold text-professional-blue hover:underline">
              Run a free margin check
            </Link>
            {" · "}
            <Link href={getPremiumToolsHref()} className="font-semibold text-professional-blue hover:underline">
              Browse premium analyzers
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
