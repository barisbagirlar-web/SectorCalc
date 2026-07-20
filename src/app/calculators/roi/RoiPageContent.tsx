"use client";

import { useCallback, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useScrollToResults } from "@/hooks/useScrollToResults";
import { PageLayout } from "@/components/layout/PageLayout";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { SITE, siteUrl } from "@/config/site";

type ExecuteOutput = {
  id: string;
  value: number | null;
  unit: string | null;
  status: string;
};

type ExecuteResponse = {
  status: string;
  outputs: ExecuteOutput[];
  warnings?: Array<{ severity: string; message: string; suggestedAction: string }>;
  blockedReason?: string;
};

type ScenarioRow = {
  id: string;
  title: string;
  summary: string;
  investmentCost: number;
  totalReturn: number;
  annualNetBenefit: number;
  horizonYears: number;
  hurdleRatePct: number;
  roiPct: number;
  netGain: number;
  paybackPeriodYears: number | null;
  annualizedRoiPct: number;
  decision: "PASS" | "REVIEW" | "REJECT";
};

const TOOL_KEY = "return-on-investment-calculator";
const FREE_TOOL_ROUTE = "/tools/free/return-on-investment-calculator";

const CITATIONS = {
  apa: "SectorCalc. (2026). Return on investment calculator and capital screening reference. SectorCalc. https://sectorcalc.com/calculators/roi",
  mla: 'SectorCalc. "Return on Investment Calculator and Capital Screening Reference." SectorCalc, 2026, https://sectorcalc.com/calculators/roi.',
  chicago:
    'SectorCalc. 2026. "Return on Investment Calculator and Capital Screening Reference." SectorCalc. https://sectorcalc.com/calculators/roi.',
  bibtex: `@misc{sectorcalc_roi_2026,
  title = {Return on Investment Calculator and Capital Screening Reference},
  author = {{SectorCalc}},
  year = {2026},
  publisher = {SectorCalc},
  url = {https://sectorcalc.com/calculators/roi},
  note = {Educational ROI screening reference}
}`,
} as const;

const SCENARIO_LIBRARY: ScenarioRow[] = [
  {
    id: "cnc-automation",
    title: "CNC Automation Upgrade",
    summary: "Mid-size machining automation with labor productivity and scrap reduction benefits over four years.",
    investmentCost: 80000,
    totalReturn: 128000,
    annualNetBenefit: 16000,
    horizonYears: 4,
    hurdleRatePct: 15,
    roiPct: 60,
    netGain: 48000,
    paybackPeriodYears: 5,
    annualizedRoiPct: 12.468265038069815,
    decision: "PASS",
  },
  {
    id: "energy-efficiency",
    title: "Plant Energy Efficiency Retrofit",
    summary: "Utility savings project with staged efficiency gains over three years.",
    investmentCost: 45000,
    totalReturn: 58500,
    annualNetBenefit: 9000,
    horizonYears: 3,
    hurdleRatePct: 10,
    roiPct: 30,
    netGain: 13500,
    paybackPeriodYears: 5,
    annualizedRoiPct: 9.139288306110593,
    decision: "PASS",
  },
  {
    id: "warehouse-wms",
    title: "Warehouse WMS Deployment",
    summary: "Warehouse management system with inventory accuracy and labor efficiency gains over five years.",
    investmentCost: 120000,
    totalReturn: 156000,
    annualNetBenefit: 22000,
    horizonYears: 5,
    hurdleRatePct: 12,
    roiPct: 30,
    netGain: 36000,
    paybackPeriodYears: 5.454545454545454,
    annualizedRoiPct: 5.387395206178347,
    decision: "PASS",
  },
  {
    id: "reject-case",
    title: "Low-Return Packaging Line Upgrade",
    summary: "Packaging line upgrade with weak total return under a 15 percent hurdle rate.",
    investmentCost: 60000,
    totalReturn: 66000,
    annualNetBenefit: 8000,
    horizonYears: 3,
    hurdleRatePct: 15,
    roiPct: 10,
    netGain: 6000,
    paybackPeriodYears: 7.5,
    annualizedRoiPct: 3.228011545636722,
    decision: "REJECT",
  },
];

const METRIC_COMPARISON = [
  {
    metric: "Primary question",
    roi: "How much gain relative to cost?",
    npv: "What is the present value of future cash flows?",
    irr: "What discount rate makes NPV equal to zero?",
  },
  {
    metric: "Time value of money",
    roi: "Not included in basic ROI",
    npv: "Included via discount rate",
    irr: "Included implicitly",
  },
  {
    metric: "Best screening use",
    roi: "Quick relative return versus hurdle rate",
    npv: "Absolute value creation at a stated rate",
    irr: "Return-rate cross-check when bracketed",
  },
  {
    metric: "Cash-flow detail required",
    roi: "Total return and optional annual benefit",
    npv: "Annual cash-flow stream by year",
    irr: "Same cash-flow stream as NPV",
  },
  {
    metric: "Typical decision rule",
    roi: "PASS when ROI exceeds hurdle rate",
    npv: "PASS when NPV is positive",
    irr: "Compare IRR to hurdle rate when valid",
  },
  {
    metric: "Main limitation",
    roi: "Ignores timing and discounting in basic form",
    npv: "Sensitive to discount-rate estimate",
    irr: "May be undefined or misleading for non-conventional flows",
  },
] as const;

const FAQS = [
  {
    q: "What does a positive ROI mean?",
    a: "A positive ROI means total return exceeds investment cost. Compare ROI to your hurdle rate for screening. It is a decision signal, not an approval by itself.",
  },
  {
    q: "How is ROI different from NPV?",
    a: "ROI measures relative gain over cost without discounting future cash flows. NPV converts each future cash flow to present value using a discount rate. Use ROI for quick relative screening and NPV when timing and discounting matter.",
  },
  {
    q: "When should I use IRR instead of ROI?",
    a: "Use IRR when you have a full annual cash-flow stream and need the implied discount rate that clears NPV to zero. ROI is simpler when you only have total return and cost for a single screening boundary.",
  },
  {
    q: "What is compound annualized ROI?",
    a: "Compound annualized ROI converts total ROI over a horizon into an equivalent annual rate using a geometric mean: ((1 + ROI_decimal)^(1/horizon) − 1) × 100. It differs from simple linear annualization (ROI_pct / horizon).",
  },
  {
    q: "Where should I run the live calculator?",
    a: "Use the embedded panel on this page or the dedicated free tool route for full input execution through the protected server-side formula kernel.",
  },
] as const;

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatPercent(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatYears(value: number | null): string {
  return value === null ? "Not computable" : value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function buildRoiJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/calculators/roi#webpage`,
        url: `${siteUrl}/calculators/roi`,
        name: "Return on Investment Calculator and Capital Screening Reference",
        description:
          "Calculate ROI, payback period, and annualized return for industrial investment screening with methodology, scenario library, and finance references.",
        datePublished: "2026-07-01",
        dateModified: "2026-07-20",
        publisher: { "@id": `${siteUrl}/#organization` },
        about: { "@id": `${siteUrl}/calculators/roi#softwareapplication` },
        mainEntity: [
          { "@id": `${siteUrl}/calculators/roi#faq` },
          { "@id": `${siteUrl}/calculators/roi#howto` },
          { "@id": `${siteUrl}/calculators/roi#softwareapplication` },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/calculators/roi#softwareapplication`,
        name: "Return on Investment Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/calculators/roi`,
        description: "Educational ROI, payback, and annualized return screening calculator for industrial capital projects.",
        publisher: { "@id": `${siteUrl}/#organization` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "HowTo",
        "@id": `${siteUrl}/calculators/roi#howto`,
        name: "How to screen an industrial investment with ROI",
        step: [
          { "@type": "HowToStep", name: "Enter investment cost", text: "Record the total capital outlay for the project in project currency." },
          { "@type": "HowToStep", name: "Enter total return", text: "Provide the expected total return including recovered capital and net gain." },
          { "@type": "HowToStep", name: "Set annual net benefit and horizon", text: "Enter annual net benefit for payback and a whole-year horizon from 1 to 30 for annualized ROI." },
          { "@type": "HowToStep", name: "Review ROI decision state", text: "PASS when ROI exceeds the hurdle rate, REVIEW when equal, REJECT when below." },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/calculators/roi#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/calculators/roi#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteUrl}/calculators` },
          { "@type": "ListItem", position: 3, name: "Return on Investment Calculator", item: `${siteUrl}/calculators/roi` },
        ],
      },
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE.siteName, url: siteUrl },
    ],
  };
}

function SectionCard({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 lg:mb-24">
      {title ? <h2 className="mb-8 text-2xl lg:text-3xl font-semibold text-[var(--sc-text)] font-heading heading-serif">{title}</h2> : null}
      {children}
    </section>
  );
}

function CopyCitationButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative mb-6">
      <p className="text-sm font-semibold text-[var(--sc-text)] mb-2 uppercase tracking-wider">{label}</p>
      <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-4 relative">
        <pre className="text-sm font-mono text-[var(--sc-muted)] whitespace-pre-wrap">{text}</pre>
        <button type="button" onClick={handleCopy} className="absolute top-2 right-2 bg-[var(--sc-surface)] border border-[var(--sc-border)] px-3 py-1 text-xs font-semibold uppercase hover:bg-[var(--sc-accent-soft)] hover:text-[var(--sc-accent)] transition-colors focus-visible min-h-[44px] min-w-[44px]" aria-label={`Copy ${label} citation`}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function RoiCalculatorPanel() {
  const [investmentCost, setInvestmentCost] = useState("100000");
  const [totalReturn, setTotalReturn] = useState("150000");
  const [annualNetBenefit, setAnnualNetBenefit] = useState("25000");
  const [horizonYears, setHorizonYears] = useState("5");
  const [hurdleRatePct, setHurdleRatePct] = useState("0");
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useScrollToResults(result !== null || error !== null, "roi-results");

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const rawInputs: Record<string, number> = {
      investment_cost: Number(investmentCost),
      total_return: Number(totalReturn),
      annual_net_benefit: Number(annualNetBenefit),
      horizon_years: Number(horizonYears),
      hurdle_rate_pct: Number(hurdleRatePct),
    };
    try {
      const response = await fetch("/api/tool-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolKey: TOOL_KEY, rawInputs }),
      });
      const payload = (await response.json()) as ExecuteResponse & { blockedReason?: string; message?: string };
      if (!response.ok || payload.blockedReason) {
        setError(payload.blockedReason ?? payload.message ?? "Calculation blocked.");
        return;
      }
      setResult(payload);
    } catch {
      setError("Network error while calling the calculator API.");
    } finally {
      setLoading(false);
    }
  }, [annualNetBenefit, horizonYears, hurdleRatePct, investmentCost, totalReturn]);

  const outputValue = (id: string) => result?.outputs.find((output) => output.id === id)?.value ?? null;

  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm">
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="roi-investment" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Investment Cost</label>
          <input id="roi-investment" value={investmentCost} onChange={(e) => setInvestmentCost(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" data-testid="roi-investment-cost" />
        </div>
        <div>
          <label htmlFor="roi-return" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Total Return</label>
          <input id="roi-return" value={totalReturn} onChange={(e) => setTotalReturn(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" data-testid="roi-total-return" />
        </div>
        <div>
          <label htmlFor="roi-benefit" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Annual Net Benefit</label>
          <input id="roi-benefit" value={annualNetBenefit} onChange={(e) => setAnnualNetBenefit(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" data-testid="roi-annual-net-benefit" />
        </div>
        <div>
          <label htmlFor="roi-horizon" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Horizon (Years)</label>
          <input id="roi-horizon" value={horizonYears} onChange={(e) => setHorizonYears(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="numeric" data-testid="roi-horizon-years" />
        </div>
        <div>
          <label htmlFor="roi-hurdle" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Hurdle Rate (%)</label>
          <input id="roi-hurdle" value={hurdleRatePct} onChange={(e) => setHurdleRatePct(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" data-testid="roi-hurdle-rate" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={() => void handleCalculate()} disabled={loading} className="w-full sm:w-auto bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-8 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors focus-visible disabled:opacity-60" aria-label="Calculate ROI" data-testid="roi-calculate-button">
          {loading ? "Calculating..." : "Calculate ROI"}
        </button>
        <Link href={FREE_TOOL_ROUTE} className="inline-flex items-center justify-center border border-[var(--sc-border)] px-6 py-3 min-h-[44px] font-semibold uppercase tracking-wider text-[var(--sc-text)] hover:bg-[var(--sc-surface)] focus-visible" data-testid="roi-open-free-tool">
          Open Full Free Tool
        </Link>
      </div>
      <div id="roi-results" aria-live="polite" aria-atomic="true" className="mt-8">
        {error ? <p className="text-[var(--sc-warning)] font-medium">{error}</p> : null}
        {result ? (
          <div className="border-t border-[var(--sc-border)] pt-8 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">Decision State</p>
              <p className="text-4xl font-bold font-mono text-[var(--sc-text)] mb-4">{result.status}</p>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">Return on Investment</p>
              <p className="text-3xl font-bold font-mono text-[var(--sc-text)]">{formatPercent(outputValue("roi_pct") ?? 0)}%</p>
            </div>
            <div className="space-y-3 text-sm text-[var(--sc-muted)]">
              <p><strong className="text-[var(--sc-text)]">Net gain:</strong> {formatMoney(outputValue("net_gain") ?? 0)}</p>
              <p><strong className="text-[var(--sc-text)]">Payback period:</strong> {formatYears(outputValue("payback_period_years"))} years</p>
              <p><strong className="text-[var(--sc-text)]">Annualized ROI:</strong> {formatPercent(outputValue("annualized_roi_pct") ?? 0)}%</p>
              {result.warnings?.slice(0, 2).map((warning) => (
                <p key={warning.message} className="border-l-4 border-[var(--sc-border)] pl-3">{warning.message}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RoiPageContent() {
  return (
    <PageLayout>
      <SemanticJsonLd data={buildRoiJsonLd()} />
      <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <section id="hero" className="mb-16">
          <span className="inline-block bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] text-[var(--sc-text)] px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
            Capital Screening Reference
          </span>
          <h1 className="text-4xl lg:text-5xl font-heading heading-serif font-semibold text-[var(--sc-text)] leading-tight mb-6 max-w-[920px]">
            Return on Investment Calculator and Capital Screening Reference
          </h1>
          <p className="text-lg text-[var(--sc-muted)] mb-8 max-w-[760px] leading-relaxed">
            Screen industrial investments with ROI, payback period, and compound annualized return metrics. This reference explains decision rules, ROI versus NPV versus IRR trade-offs, method assumptions, and worked industrial scenarios.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="#calculator" className="bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors inline-flex items-center justify-center focus-visible">Calculate ROI</a>
            <a href="#scenarios" className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">View Scenarios</a>
            <Link href={FREE_TOOL_ROUTE} className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">Full Free Tool</Link>
          </div>
        </section>

        <SectionCard id="calculator">
          <RoiCalculatorPanel />
        </SectionCard>

        <SectionCard id="quick-decision" title="Quick Decision Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[var(--sc-border)] text-sm">
              <thead className="bg-[var(--sc-surface-strong)] text-left">
                <tr>
                  <th className="p-3 border-b border-[var(--sc-border)]">Question</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">Short Answer</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">Primary metric</td><td className="p-3 border-b border-[var(--sc-border)]">ROI percent versus stated hurdle rate</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">PASS condition</td><td className="p-3 border-b border-[var(--sc-border)]">ROI greater than hurdle rate</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">REVIEW condition</td><td className="p-3 border-b border-[var(--sc-border)]">ROI equal to hurdle rate</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">REJECT condition</td><td className="p-3 border-b border-[var(--sc-border)]">ROI less than hurdle rate</td></tr>
                <tr><td className="p-3">What payback adds</td><td className="p-3">Liquidity recovery timing without discounting</td></tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard id="methodology" title="Calculation Methodology">
          <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">ROI Screening Formula</h3>
            <p className="text-2xl font-mono font-bold text-[var(--sc-text)] mb-4">ROI (%) = (Net Gain / Investment Cost) × 100</p>
            <p className="text-sm text-[var(--sc-muted)] mb-4">Where Net Gain = Total Return − Investment Cost.</p>
            <p className="text-sm font-mono text-[var(--sc-text)] mb-2">Payback (years) = Investment Cost / Annual Net Benefit</p>
            <p className="text-sm font-mono text-[var(--sc-text)]">Annualized ROI (%) = ((1 + ROI_decimal)<sup>1/horizon</sup> − 1) × 100</p>
          </div>
          <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-3 font-heading heading-serif">Method Assumptions</h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--sc-muted)] mb-6">
            <li>Single-period total return versus investment cost in one project currency.</li>
            <li>Simple payback uses constant annual net benefit and ignores time value of money.</li>
            <li>Compound annualized ROI uses geometric mean annualization over the stated horizon.</li>
            <li>No discount-rate adjustment, tax shield, or inflation layer in the free screening model.</li>
          </ul>
        </SectionCard>

        <SectionCard id="behavior" title="ROI Behavior Intelligence">
          <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-4 font-heading heading-serif">ROI vs NPV vs IRR</h3>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-[var(--sc-border)] text-sm">
              <thead className="bg-[var(--sc-surface-strong)] text-left">
                <tr>
                  <th className="p-3 border-b border-[var(--sc-border)]">Dimension</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">ROI</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">NPV</th>
                  <th className="p-3 border-b border-[var(--sc-border)]">IRR</th>
                </tr>
              </thead>
              <tbody>
                {METRIC_COMPARISON.map((row) => (
                  <tr key={row.metric}>
                    <td className="p-3 border-b border-[var(--sc-border)] font-semibold text-[var(--sc-text)]">{row.metric}</td>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.roi}</td>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.npv}</td>
                    <td className="p-3 border-b border-[var(--sc-border)]">{row.irr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Hurdle-rate sensitivity</h3>
              <p className="text-sm text-[var(--sc-muted)]">A project that passes at a 10 percent hurdle may fail at 15 percent without any change to total return or investment cost.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Payback versus ROI</h3>
              <p className="text-sm text-[var(--sc-muted)]">High ROI with long payback signals strong relative return but slower liquidity recovery. Review both metrics before approval.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">When to escalate to NPV</h3>
              <p className="text-sm text-[var(--sc-muted)]">Use the <Link href="/calculators/npv" className="underline text-[var(--sc-text)]">NPV reference hub</Link> when annual cash-flow timing and discount-rate effects materially affect the decision.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Annualization disclosure</h3>
              <p className="text-sm text-[var(--sc-muted)]">Compound annualized ROI differs from simple linear annualization (ROI_pct / horizon). The calculator discloses both assumptions in warnings.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard id="scenarios" title="Scenario Library">
          <p className="text-[var(--sc-muted)] mb-6">Static industrial scenarios computed offline with the protected server-side ROI kernel. Display values match formula execution for the stated inputs.</p>
          <div className="space-y-8">
            {SCENARIO_LIBRARY.map((scenario) => (
              <article key={scenario.id} className="border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-6 rounded-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-xl font-semibold text-[var(--sc-text)] font-heading heading-serif">{scenario.title}</h3>
                  <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 border border-[var(--sc-border)]">{scenario.decision}</span>
                </div>
                <p className="text-sm text-[var(--sc-muted)] mb-4">{scenario.summary}</p>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-[var(--sc-border)] text-sm">
                    <thead className="bg-[var(--sc-surface)]">
                      <tr>
                        <th className="p-2 border-b border-[var(--sc-border)] text-left">Input</th>
                        <th className="p-2 border-b border-[var(--sc-border)] text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Investment cost</td><td className="p-2 border-b border-[var(--sc-border)]">{formatMoney(scenario.investmentCost)}</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Total return</td><td className="p-2 border-b border-[var(--sc-border)]">{formatMoney(scenario.totalReturn)}</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Annual net benefit</td><td className="p-2 border-b border-[var(--sc-border)]">{formatMoney(scenario.annualNetBenefit)}</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Horizon</td><td className="p-2 border-b border-[var(--sc-border)]">{scenario.horizonYears} years</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Hurdle rate</td><td className="p-2 border-b border-[var(--sc-border)]">{scenario.hurdleRatePct}%</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <p><strong className="text-[var(--sc-text)]">ROI:</strong> {formatPercent(scenario.roiPct)}%</p>
                  <p><strong className="text-[var(--sc-text)]">Net gain:</strong> {formatMoney(scenario.netGain)}</p>
                  <p><strong className="text-[var(--sc-text)]">Payback:</strong> {formatYears(scenario.paybackPeriodYears)} years</p>
                  <p><strong className="text-[var(--sc-text)]">Annualized ROI:</strong> {formatPercent(scenario.annualizedRoiPct)}%</p>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="citation" title="Cite This Calculator">
          <CopyCitationButton label="APA" text={CITATIONS.apa} />
          <CopyCitationButton label="MLA" text={CITATIONS.mla} />
          <CopyCitationButton label="Chicago" text={CITATIONS.chicago} />
          <CopyCitationButton label="BibTeX" text={CITATIONS.bibtex} />
        </SectionCard>

        <SectionCard id="references" title="References and Standards Context">
          <ul className="space-y-4 text-[var(--sc-muted)]">
            <li><strong className="text-[var(--sc-text)]">Brealey, Myers &amp; Allen — Principles of Corporate Finance:</strong> ROI framing, hurdle-rate policy, and capital-budgeting decision hierarchy.</li>
            <li><strong className="text-[var(--sc-text)]">Ross, Westerfield &amp; Jordan — Fundamentals of Corporate Finance:</strong> Return metrics, payback limitations, and comparison with discounted cash-flow methods.</li>
            <li><strong className="text-[var(--sc-text)]">CFA Program Curriculum — Corporate Finance:</strong> Screening workflow for ROI, NPV, IRR, and payback in project appraisal.</li>
          </ul>
          <p className="mt-6 text-sm text-[var(--sc-muted)]">This page provides finance-method context only. It is not a substitute for audited financial advice, tax analysis, or board-approved investment policy.</p>
        </SectionCard>

        <SectionCard id="faq" title="FAQ">
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-[var(--sc-text)] mb-2">{faq.q}</h3>
                <p className="text-[var(--sc-muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </PageLayout>
  );
}
