"use client";

import { useCallback, useMemo, useState } from "react";
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
  investment: number;
  discountRatePct: number;
  horizonYears: number;
  cashFlows: number[];
  npv: number;
  irrPct: number | null;
  simplePaybackYears: number | null;
  discountedPaybackYears: number | null;
  decision: "PASS" | "REVIEW" | "REJECT";
};

const TOOL_KEY = "net-present-value-calculator";
const FREE_TOOL_ROUTE = "/tools/free/net-present-value-calculator";

const CITATIONS = {
  apa: "SectorCalc. (2026). Net present value calculator and capital budgeting reference. SectorCalc. https://sectorcalc.com/calculators/npv",
  mla: 'SectorCalc. "Net Present Value Calculator and Capital Budgeting Reference." SectorCalc, 2026, https://sectorcalc.com/calculators/npv.',
  chicago:
    'SectorCalc. 2026. "Net Present Value Calculator and Capital Budgeting Reference." SectorCalc. https://sectorcalc.com/calculators/npv.',
  bibtex: `@misc{sectorcalc_npv_2026,
  title = {Net Present Value Calculator and Capital Budgeting Reference},
  author = {{SectorCalc}},
  year = {2026},
  publisher = {SectorCalc},
  url = {https://sectorcalc.com/calculators/npv},
  note = {Educational capital-budgeting screening reference}
}`,
} as const;

const SCENARIO_LIBRARY: ScenarioRow[] = [
  {
    id: "cnc-machine",
    title: "CNC Machine Replacement",
    summary: "Mid-size machining center with labor savings and scrap reduction over five years.",
    investment: 250000,
    discountRatePct: 12,
    horizonYears: 5,
    cashFlows: [65000, 72000, 78000, 80000, 85000],
    npv: 20025.261807301275,
    irrPct: 15.040426827700678,
    simplePaybackYears: 3.4375,
    discountedPaybackYears: 4.584807604705882,
    decision: "PASS",
  },
  {
    id: "hvac-retrofit",
    title: "Plant HVAC Retrofit",
    summary: "Energy-efficiency retrofit with staged utility savings over seven years.",
    investment: 120000,
    discountRatePct: 8,
    horizonYears: 7,
    cashFlows: [22000, 24000, 26000, 28000, 29000, 30000, 31000],
    npv: 18897.179976036416,
    irrPct: 12.185852041073618,
    simplePaybackYears: 4.689655172413793,
    discountedPaybackYears: 5.957208467456,
    decision: "PASS",
  },
  {
    id: "line-automation",
    title: "Production Line Automation",
    summary: "Automation capex with throughput and labor productivity gains over eight years.",
    investment: 480000,
    discountRatePct: 10,
    horizonYears: 8,
    cashFlows: [90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000],
    npv: 80286.71562247985,
    irrPct: 14.175795659098332,
    simplePaybackYears: 4.818181818181818,
    discountedPaybackYears: 6.6431689,
    decision: "PASS",
  },
  {
    id: "reject-case",
    title: "Low-Return Packaging Upgrade",
    summary: "Cosmetic packaging upgrade with weak cash recovery under a 14 percent hurdle rate.",
    investment: 90000,
    discountRatePct: 14,
    horizonYears: 4,
    cashFlows: [12000, 13000, 13500, 14000],
    npv: -52069.36698850256,
    irrPct: -18.18964715617186,
    simplePaybackYears: null,
    discountedPaybackYears: null,
    decision: "REJECT",
  },
];

const FAQS = [
  {
    q: "What does a positive NPV mean?",
    a: "A positive NPV means the discounted value of expected cash inflows exceeds the initial investment at the stated discount rate. It is a screening signal to proceed, not an approval by itself.",
  },
  {
    q: "How is IRR used with NPV?",
    a: "IRR is the discount rate that would make NPV equal to zero. Compare IRR to your hurdle rate when it is bracketed. If IRR cannot be computed, rely on NPV and payback evidence instead of forcing a return metric.",
  },
  {
    q: "Why can discounted payback exceed simple payback?",
    a: "Discounted payback uses present-value inflows, so recovery takes longer whenever the discount rate is positive. A project can have positive NPV while discounted payback still exceeds management timing limits.",
  },
  {
    q: "Does this free tool include tax shields or terminal value?",
    a: "No. The free screening model uses discrete annual cash flows, a constant discount rate, and no depreciation tax shield, inflation layer, or terminal-value module.",
  },
  {
    q: "Where should I run the live calculator?",
    a: "Use the embedded panel on this page or the dedicated free tool route for full input execution through the protected server-side formula kernel.",
  },
] as const;

function formatMoney(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatYears(value: number | null): string {
  return value === null ? "Not within horizon" : value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function buildNpvJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/calculators/npv#webpage`,
        url: `${siteUrl}/calculators/npv`,
        name: "Net Present Value Calculator and Capital Budgeting Reference",
        description:
          "Calculate NPV, IRR, and payback metrics for industrial investment screening with methodology, scenario library, and finance references.",
        datePublished: "2026-07-01",
        dateModified: "2026-07-01",
        publisher: { "@id": `${siteUrl}/#organization` },
        about: { "@id": `${siteUrl}/calculators/npv#softwareapplication` },
        mainEntity: [
          { "@id": `${siteUrl}/calculators/npv#faq` },
          { "@id": `${siteUrl}/calculators/npv#howto` },
          { "@id": `${siteUrl}/calculators/npv#softwareapplication` },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/calculators/npv#softwareapplication`,
        name: "Net Present Value Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/calculators/npv`,
        description: "Educational NPV, IRR, and payback screening calculator for industrial capital projects.",
        publisher: { "@id": `${siteUrl}/#organization` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "HowTo",
        "@id": `${siteUrl}/calculators/npv#howto`,
        name: "How to screen an industrial investment with NPV",
        step: [
          { "@type": "HowToStep", name: "Enter initial investment", text: "Record the up-front capital outlay at time zero in project currency." },
          { "@type": "HowToStep", name: "Set discount rate and horizon", text: "Use the hurdle rate as a percentage and select a whole-year study horizon up to 10 years." },
          { "@type": "HowToStep", name: "Enter annual cash flows", text: "Provide net inflows for each year within the horizon. Years beyond the horizon are ignored." },
          { "@type": "HowToStep", name: "Review NPV decision state", text: "Positive NPV supports proceeding, zero NPV requires review, and negative NPV rejects the base case at the stated rate." },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/calculators/npv#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/calculators/npv#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteUrl}/calculators` },
          { "@type": "ListItem", position: 3, name: "Net Present Value Calculator", item: `${siteUrl}/calculators/npv` },
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

function NpvCalculatorPanel() {
  const [initialInvestment, setInitialInvestment] = useState("250000");
  const [discountRatePct, setDiscountRatePct] = useState("12");
  const [horizonYears, setHorizonYears] = useState("5");
  const [cashFlows, setCashFlows] = useState(["65000", "72000", "78000", "80000", "85000", "", "", "", "", ""]);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useScrollToResults(result !== null || error !== null, "npv-results");

  const horizon = useMemo(() => Math.min(10, Math.max(1, Number.parseInt(horizonYears, 10) || 1)), [horizonYears]);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const rawInputs: Record<string, number> = {
      initial_investment: Number(initialInvestment),
      discount_rate_pct: Number(discountRatePct),
      horizon_years: horizon,
    };
    for (let year = 1; year <= horizon; year += 1) {
      rawInputs[`cf_y${year}`] = Number(cashFlows[year - 1] ?? 0);
    }
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
  }, [cashFlows, discountRatePct, horizon, initialInvestment]);

  const outputValue = (id: string) => result?.outputs.find((output) => output.id === id)?.value ?? null;

  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm">
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="npv-investment" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Initial Investment</label>
          <input id="npv-investment" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="npv-rate" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Discount Rate (%)</label>
          <input id="npv-rate" value={discountRatePct} onChange={(e) => setDiscountRatePct(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="npv-horizon" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Horizon (Years)</label>
          <input id="npv-horizon" value={horizonYears} onChange={(e) => setHorizonYears(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="numeric" />
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: horizon }, (_, index) => (
          <div key={`cf-${index + 1}`}>
            <label htmlFor={`npv-cf-${index + 1}`} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--sc-text)]">{`CF Year ${index + 1}`}</label>
            <input id={`npv-cf-${index + 1}`} value={cashFlows[index] ?? ""} onChange={(e) => {
              const next = [...cashFlows];
              next[index] = e.target.value;
              setCashFlows(next);
            }} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-3 py-2 text-sm text-[var(--sc-text)] focus-visible min-h-[44px]" inputMode="decimal" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={() => void handleCalculate()} disabled={loading} className="w-full sm:w-auto bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-8 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors focus-visible disabled:opacity-60" aria-label="Calculate NPV">
          {loading ? "Calculating..." : "Calculate NPV"}
        </button>
        <Link href={FREE_TOOL_ROUTE} className="inline-flex items-center justify-center border border-[var(--sc-border)] px-6 py-3 min-h-[44px] font-semibold uppercase tracking-wider text-[var(--sc-text)] hover:bg-[var(--sc-surface)] focus-visible">
          Open Full Free Tool
        </Link>
      </div>
      <div id="npv-results" aria-live="polite" aria-atomic="true" className="mt-8">
        {error ? <p className="text-[var(--sc-warning)] font-medium">{error}</p> : null}
        {result ? (
          <div className="border-t border-[var(--sc-border)] pt-8 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">Decision State</p>
              <p className="text-4xl font-bold font-mono text-[var(--sc-text)] mb-4">{result.status}</p>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">Net Present Value</p>
              <p className="text-3xl font-bold font-mono text-[var(--sc-text)]">{formatMoney(outputValue("npv") ?? 0)}</p>
            </div>
            <div className="space-y-3 text-sm text-[var(--sc-muted)]">
              <p><strong className="text-[var(--sc-text)]">IRR:</strong> {outputValue("irr_pct") === null ? "Not bracketed" : `${formatMoney(outputValue("irr_pct") ?? 0)}%`}</p>
              <p><strong className="text-[var(--sc-text)]">Simple payback:</strong> {formatYears(outputValue("simple_payback_years"))} years</p>
              <p><strong className="text-[var(--sc-text)]">Discounted payback:</strong> {formatYears(outputValue("discounted_payback_years"))} years</p>
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

export function NpvPageContent() {
  return (
    <PageLayout>
      <SemanticJsonLd data={buildNpvJsonLd()} />
      <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <section id="hero" className="mb-16">
          <span className="inline-block bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] text-[var(--sc-text)] px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
            Capital Budgeting Reference
          </span>
          <h1 className="text-4xl lg:text-5xl font-heading heading-serif font-semibold text-[var(--sc-text)] leading-tight mb-6 max-w-[920px]">
            Net Present Value Calculator and Capital Budgeting Reference
          </h1>
          <p className="text-lg text-[var(--sc-muted)] mb-8 max-w-[760px] leading-relaxed">
            Screen industrial investments with NPV, IRR, and payback metrics using discrete annual cash flows and a stated discount rate. This reference explains decision rules, method assumptions, and worked industrial scenarios.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="#calculator" className="bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors inline-flex items-center justify-center focus-visible">Calculate NPV</a>
            <a href="#scenarios" className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">View Scenarios</a>
            <Link href={FREE_TOOL_ROUTE} className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">Full Free Tool</Link>
          </div>
        </section>

        <SectionCard id="calculator">
          <NpvCalculatorPanel />
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
                <tr><td className="p-3 border-b border-[var(--sc-border)]">Primary metric</td><td className="p-3 border-b border-[var(--sc-border)]">NPV at the stated discount rate</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">PASS condition</td><td className="p-3 border-b border-[var(--sc-border)]">NPV greater than zero</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">REVIEW condition</td><td className="p-3 border-b border-[var(--sc-border)]">NPV equal to zero</td></tr>
                <tr><td className="p-3 border-b border-[var(--sc-border)]">REJECT condition</td><td className="p-3 border-b border-[var(--sc-border)]">NPV less than zero</td></tr>
                <tr><td className="p-3">What IRR adds</td><td className="p-3">Return-rate cross-check when a valid bracket exists</td></tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard id="methodology" title="Calculation Methodology">
          <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">NPV Screening Formula</h3>
            <p className="text-2xl font-mono font-bold text-[var(--sc-text)] mb-4">NPV = Σ CF<sub>t</sub> / (1 + r)<sup>t</sup> − Initial Investment</p>
            <p className="text-sm text-[var(--sc-muted)]">Where r is the discount rate expressed as a decimal converted from the entered percentage, t is the year index, and cash flows beyond the selected horizon are ignored.</p>
          </div>
          <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-3 font-heading heading-serif">Method Assumptions</h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--sc-muted)] mb-6">
            <li>Annual end-of-period cash flows in a single project currency.</li>
            <li>Constant discount rate across the selected horizon.</li>
            <li>No depreciation tax shield, inflation adjustment, or terminal-value layer in the free screening model.</li>
            <li>IRR is reported only when a bracketed root exists within the search range.</li>
          </ul>
        </SectionCard>

        <SectionCard id="behavior" title="NPV Behavior Intelligence">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Discount-rate sensitivity</h3>
              <p className="text-sm text-[var(--sc-muted)]">NPV decreases as the discount rate rises. A project that passes at 8 percent may fail at 12 percent without any change to nominal cash flows.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Payback versus NPV</h3>
              <p className="text-sm text-[var(--sc-muted)]">Simple payback ignores time value. Discounted payback aligns better with NPV but can still fail timing tests while NPV remains positive.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">IRR bracket limits</h3>
              <p className="text-sm text-[var(--sc-muted)]">Non-conventional cash-flow patterns may not yield a usable IRR bracket. Treat missing IRR as a review signal, not a hidden approval.</p>
            </div>
            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 rounded-sm">
              <h3 className="font-semibold text-[var(--sc-text)] mb-2">Horizon truncation</h3>
              <p className="text-sm text-[var(--sc-muted)]">Cash flows after the selected horizon are ignored. Extend the horizon or move to PRO scenario tooling when tail cash flows matter.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard id="scenarios" title="Scenario Library">
          <p className="text-[var(--sc-muted)] mb-6">Static industrial scenarios computed offline with the protected server-side NPV kernel. Display values match formula execution for the stated inputs.</p>
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
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Initial investment</td><td className="p-2 border-b border-[var(--sc-border)]">{formatMoney(scenario.investment)}</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Discount rate</td><td className="p-2 border-b border-[var(--sc-border)]">{scenario.discountRatePct}%</td></tr>
                      <tr><td className="p-2 border-b border-[var(--sc-border)]">Horizon</td><td className="p-2 border-b border-[var(--sc-border)]">{scenario.horizonYears} years</td></tr>
                      {scenario.cashFlows.map((cashFlow, index) => (
                        <tr key={`${scenario.id}-cf-${index}`}><td className="p-2 border-b border-[var(--sc-border)]">{`Cash flow year ${index + 1}`}</td><td className="p-2 border-b border-[var(--sc-border)]">{formatMoney(cashFlow)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <p><strong className="text-[var(--sc-text)]">NPV:</strong> {formatMoney(scenario.npv)}</p>
                  <p><strong className="text-[var(--sc-text)]">IRR:</strong> {scenario.irrPct === null ? "Not bracketed" : `${formatMoney(scenario.irrPct)}%`}</p>
                  <p><strong className="text-[var(--sc-text)]">Simple payback:</strong> {formatYears(scenario.simplePaybackYears)}</p>
                  <p><strong className="text-[var(--sc-text)]">Discounted payback:</strong> {formatYears(scenario.discountedPaybackYears)}</p>
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
            <li><strong className="text-[var(--sc-text)]">Brealey, Myers &amp; Allen — Principles of Corporate Finance:</strong> NPV rule, hurdle-rate framing, and capital-budgeting decision hierarchy.</li>
            <li><strong className="text-[var(--sc-text)]">Ross, Westerfield &amp; Jordan — Fundamentals of Corporate Finance:</strong> Discounted cash-flow valuation, IRR interpretation, and payback limitations.</li>
            <li><strong className="text-[var(--sc-text)]">CFA Program Curriculum — Corporate Finance:</strong> Screening workflow for NPV, IRR, and discounted payback in project appraisal.</li>
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
