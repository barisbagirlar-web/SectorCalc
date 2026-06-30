"use client";

import { useState, useCallback } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type RpnResult = {
  rpn: number;
  severity: number;
  occurrence: number;
  detection: number;
  band: "low" | "moderate" | "high";
};

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const ratingOptions = Array.from({ length: 10 }, (_, i) => i + 1);

const CITATIONS = {
  apa: 'SectorCalc. (2026). FMEA RPN calculator. SectorCalc. https://sectorcalc.com/calculators/fmea-rpn',
  mla: 'SectorCalc. "FMEA RPN Calculator." SectorCalc, 2026, https://sectorcalc.com/calculators/fmea-rpn.',
  bibtex: `@misc{sectorcalc_fmea_rpn_2026,
  title = {FMEA RPN Calculator},
  author = {SectorCalc},
  year = {2026},
  url = {https://sectorcalc.com/calculators/fmea-rpn},
  note = {Free calculator for Risk Priority Number using Severity, Occurrence and Detection}
}`,
} as const;

const FAQS = [
  {
    q: "What is RPN in FMEA?",
    a: "RPN means Risk Priority Number. It is a traditional FMEA score calculated by multiplying Severity, Occurrence and Detection ratings. It helps teams compare and prioritize failure modes inside the same FMEA.",
  },
  {
    q: "How do you calculate RPN?",
    a: "RPN is calculated as Severity × Occurrence × Detection. For example, if Severity is 7, Occurrence is 5 and Detection is 4, the RPN is 7 × 5 × 4 = 140.",
  },
  {
    q: "What is a good RPN score?",
    a: "There is no universal good RPN score. RPN should be interpreted within the same FMEA, using consistent rating tables and company-defined action rules. A lower score is usually better, but high-severity items still require separate review.",
  },
  {
    q: "What is the maximum RPN value?",
    a: "When Severity, Occurrence and Detection are each rated from 1 to 10, the maximum RPN is 1000. The minimum RPN is 1.",
  },
  {
    q: "Can two failure modes have the same RPN but different risk?",
    a: "Yes. For example, S=10, O=2, D=3 gives RPN 60. S=3, O=5, D=4 also gives RPN 60. The first case has much higher Severity and may require stronger attention even though the RPN is the same.",
  },
  {
    q: "Should Severity be reduced after corrective action?",
    a: "Severity should only be reduced if the design or process change truly reduces the effect of the failure. Many corrective actions reduce Occurrence or improve Detection, while Severity remains unchanged.",
  },
  {
    q: "Is RPN still used in FMEA?",
    a: "RPN is still useful as a quick prioritization score, especially in traditional FMEA workflows. However, modern FMEA practice also considers Action Priority and the individual pattern of Severity, Occurrence and Detection.",
  },
  {
    q: "What is the difference between RPN and Action Priority?",
    a: "RPN is a numeric score. Action Priority is a decision support method that gives stronger attention to the combination of Severity, Occurrence and Detection, especially when Severity is high.",
  },
  {
    q: "Can this calculator replace an official FMEA procedure?",
    a: "No. This calculator is an educational and practical calculation aid. It should be used with your organization's approved FMEA procedure, rating tables and customer-specific requirements.",
  },
  {
    q: "What should be documented after calculating RPN?",
    a: "You should document the failure mode, effect, cause, prevention control, detection control, S/O/D ratings, initial RPN, recommended action, action owner, due date and revised RPN after action.",
  },
];

const PFMEA_EXAMPLES = [
  {
    title: "Drilling Operation",
    processStep: "Drilling operation",
    failureMode: "Hole diameter out of tolerance",
    effect: "Assembly interference, leakage risk or rejected part",
    cause: "Tool wear, incorrect feed rate, poor fixture alignment",
    prevention: "Approved machining parameters, operator setup checklist, tool-life monitoring",
    detection: "First-piece inspection and periodic gauge check",
    severity: 7,
    occurrence: 5,
    detection_rating: 4,
    initialRpn: 140,
    action: "Add tool-life counter, revise inspection frequency, verify fixture alignment before production run.",
    revisedSeverity: 7,
    revisedOccurrence: 3,
    revisedDetection: 3,
    revisedRpn: 63,
    interpretation:
      "The recommended action reduces the likelihood of recurrence and improves detection. Severity remains unchanged because the effect of an out-of-tolerance hole has not changed.",
  },
  {
    title: "Surface Milling",
    processStep: "Surface milling",
    failureMode: "Poor surface finish",
    effect: "Customer cosmetic rejection or additional rework",
    cause: "Worn insert, unstable clamping, vibration",
    prevention: "Tool inspection before setup, fixture torque check",
    detection: "Visual inspection and roughness sampling",
    severity: 5,
    occurrence: 6,
    detection_rating: 5,
    initialRpn: 150,
    action: "Define insert replacement interval, add vibration check, increase roughness sampling during first batch.",
    revisedSeverity: 5,
    revisedOccurrence: 3,
    revisedDetection: 4,
    revisedRpn: 60,
  },
  {
    title: "Part Clamping",
    processStep: "Part clamping",
    failureMode: "Part movement during machining",
    effect: "Dimensional error, scrap or machine interruption",
    cause: "Incorrect clamping force, worn fixture surface, operator setup error",
    prevention: "Setup checklist and fixture maintenance plan",
    detection: "First-piece dimensional inspection",
    severity: 8,
    occurrence: 4,
    detection_rating: 5,
    initialRpn: 160,
    action: "Add poka-yoke clamp confirmation, document fixture wear limit, require second-person setup approval for critical parts.",
    revisedSeverity: 8,
    revisedOccurrence: 2,
    revisedDetection: 3,
    revisedRpn: 48,
  },
  {
    title: "Final Deburring",
    processStep: "Final deburring",
    failureMode: "Burr remains on edge",
    effect: "Assembly issue, handling risk or customer complaint",
    cause: "Incomplete deburring, worn deburring tool, visual inspection miss",
    prevention: "Standard work instruction",
    detection: "Final visual inspection",
    severity: 6,
    occurrence: 5,
    detection_rating: 6,
    initialRpn: 180,
    action: "Add defined edge acceptance criteria, improve lighting at inspection station, introduce sample tactile check.",
    revisedSeverity: 6,
    revisedOccurrence: 3,
    revisedDetection: 4,
    revisedRpn: 72,
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function calculateRpn(s: number, o: number, d: number): RpnResult {
  const rpn = s * o * d;
  let band: RpnResult["band"] = "low";
  if (rpn >= 200) band = "high";
  else if (rpn >= 100) band = "moderate";
  return { rpn, severity: s, occurrence: o, detection: d, band };
}

function bandColor(band: RpnResult["band"]) {
  switch (band) {
    case "high":
      return "text-amber font-semibold";
    case "moderate":
      return "text-premium-velvet";
    case "low":
      return "text-body-charcoal";
  }
}

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

function RpnBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-border-subtle bg-industrial-matte px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-premium-velvet">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section wrapper                                                           */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`border-b border-border-subtle py-8 sm:py-10 sc-section ${className}`}
    >
      <Container size="narrow">{children}</Container>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 sc-h2">{children}</h2>;
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 sc-body-muted">{children}</p>;
}

/* -------------------------------------------------------------------------- */
/*  Calculator component                                                      */
/* -------------------------------------------------------------------------- */

function RpnCalculator() {
  const [severity, setSeverity] = useState(7);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(4);
  const [result, setResult] = useState<RpnResult | null>(null);

  const handleCalculate = useCallback(() => {
    setResult(calculateRpn(severity, occurrence, detection));
  }, [severity, occurrence, detection]);

  return (
    <div className="border border-border-subtle bg-bg-card p-4 sm:p-6">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {/* Severity */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">
            Severity (S)
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet"
          >
            {ratingOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {/* Occurrence */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">
            Occurrence (O)
          </label>
          <select
            value={occurrence}
            onChange={(e) => setOccurrence(Number(e.target.value))}
            className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet"
          >
            {ratingOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {/* Detection */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">
            Detection (D)
          </label>
          <select
            value={detection}
            onChange={(e) => setDetection(Number(e.target.value))}
            className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet"
          >
            {ratingOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button onClick={handleCalculate} size="cta">
        Calculate RPN
      </Button>

      {result && (
        <div className="mt-6 border-t border-border-subtle pt-6">
          <div className="mb-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-body-charcoal">
              RPN = {result.severity} × {result.occurrence} × {result.detection}
            </p>
            <p className={`mt-1 text-3xl font-bold ${bandColor(result.band)}`}>
              {result.rpn}
            </p>
            <RpnBadge>{result.band === "high" ? "High RPN" : result.band === "moderate" ? "Moderate RPN" : "Low RPN"}</RpnBadge>
          </div>

          <div className="mt-4 space-y-2 text-sm text-body-charcoal">
            {result.band === "low" && (
              <p>
                The failure mode appears lower priority compared with other listed risks. Keep it
                documented and review it when process conditions change.
              </p>
            )}
            {result.band === "moderate" && (
              <p>
                The failure mode deserves review. Check whether prevention controls, detection
                controls or process capability can be improved.
              </p>
            )}
            {result.band === "high" && (
              <p>
                The failure mode should be reviewed for corrective action. Focus first on
                prevention, then detection. Do not reduce Severity unless the design or process
                change actually reduces the effect of failure.
              </p>
            )}
            <p className="text-xs italic">
              A lower RPN does not always mean a lower business or safety risk. A high Severity
              rating can require action even when Occurrence or Detection values keep the total RPN
              moderate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Template Download Section                                                 */
/* -------------------------------------------------------------------------- */

function TemplateTablePreview() {
  const headers = [
    "Process step / function",
    "Potential failure mode",
    "Potential failure effect",
    "Potential failure cause",
    "Current prevention control",
    "Current detection control",
    "Severity",
    "Occurrence",
    "Detection",
    "Initial RPN",
    "Recommended action",
    "Action owner",
    "Target date",
    "Revised Severity",
    "Revised Occurrence",
    "Revised Detection",
    "Revised RPN",
    "Status",
  ];

  return (
    <div className="overflow-x-auto border border-border-subtle">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border-subtle bg-industrial-matte">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-2 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border-subtle">
            <td className="px-2 py-1.5 text-body-charcoal" colSpan={headers.length}>
              <span className="italic">Enter your FMEA data here</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  S/O/D Rating Guide                                                        */
/* -------------------------------------------------------------------------- */

const SEVERITY_GUIDE = [
  { range: "1–3", label: "Minor effect", desc: "Limited inconvenience, low disruption, usually no major functional loss." },
  { range: "4–6", label: "Moderate effect", desc: "Function may be degraded, rework may be needed, customer dissatisfaction may occur." },
  { range: "7–8", label: "High effect", desc: "Significant performance, reliability, production or customer impact." },
  { range: "9–10", label: "Very high effect", desc: "Safety, regulatory, mission-critical or severe customer impact may exist." },
];

const OCCURRENCE_GUIDE = [
  { range: "1–3", label: "Rare or unlikely", desc: "Based on history, controls or stable process evidence." },
  { range: "4–6", label: "Occasional", desc: "The failure cause may appear under certain operating or process conditions." },
  { range: "7–8", label: "Frequent", desc: "The cause is expected to repeat unless prevention is improved." },
  { range: "9–10", label: "Very frequent", desc: "The process or design is likely to generate the failure mode repeatedly." },
];

const DETECTION_GUIDE = [
  { range: "1–3", label: "Strong detection", desc: "Controls are likely to detect the issue early and consistently." },
  { range: "4–6", label: "Moderate detection", desc: "Controls may detect the issue, but gaps or sampling limits exist." },
  { range: "7–8", label: "Weak detection", desc: "The issue may escape because detection is late, manual or inconsistent." },
  { range: "9–10", label: "Very weak detection", desc: "The current system is unlikely to detect the issue before impact." },
];

function RatingGuideTable({ title, data }: { title: string; data: { range: string; label: string; desc: string }[] }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">
        {title}
      </h4>
      <div className="overflow-x-auto border border-border-subtle">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border-subtle bg-industrial-matte">
              <th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Rating</th>
              <th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Category</th>
              <th className="px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.range} className="border-b border-border-subtle last:border-b-0">
                <td className="whitespace-nowrap px-3 py-2 font-mono font-semibold text-premium-velvet">{row.range}</td>
                <td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">{row.label}</td>
                <td className="px-3 py-2 text-body-charcoal">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PFMEA Example Card                                                        */
/* -------------------------------------------------------------------------- */

function PfmeaExampleCard({
  example,
}: {
  example: (typeof PFMEA_EXAMPLES)[number];
}) {
  return (
    <div className="border border-border-subtle bg-bg-card p-4 sm:p-5">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-premium-velvet">
        {example.title}
      </h4>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Process Step</dt>
          <dd className="text-premium-velvet">{example.processStep}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Potential Failure Mode</dt>
          <dd className="text-premium-velvet">{example.failureMode}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Potential Effect</dt>
          <dd className="text-premium-velvet">{example.effect}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Potential Cause</dt>
          <dd className="text-premium-velvet">{example.cause}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Current Prevention Control</dt>
          <dd className="text-premium-velvet">{example.prevention}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Current Detection Control</dt>
          <dd className="text-premium-velvet">{example.detection}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">S</dt>
          <dd className="font-mono text-premium-velvet">{example.severity}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">O</dt>
          <dd className="font-mono text-premium-velvet">{example.occurrence}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">D</dt>
          <dd className="font-mono text-premium-velvet">{example.detection_rating}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Initial RPN</dt>
          <dd className="font-mono font-semibold text-amber">{example.initialRpn}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Recommended Action</dt>
          <dd className="text-premium-velvet">{example.action}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Revised S</dt>
          <dd className="font-mono text-premium-velvet">{example.revisedSeverity}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Revised O</dt>
          <dd className="font-mono text-premium-velvet">{example.revisedOccurrence}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Revised D</dt>
          <dd className="font-mono text-premium-velvet">{example.revisedDetection}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-body-charcoal">Revised RPN</dt>
          <dd className="font-mono font-semibold text-premium-velvet">{example.revisedRpn}</dd>
        </div>
      </dl>
      {"interpretation" in example && example.interpretation && (
        <div className="mt-3 border-t border-border-subtle pt-3 text-xs italic text-body-charcoal">
          {example.interpretation}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Citation block                                                            */
/* -------------------------------------------------------------------------- */

function CitationBlock({
  label,
  text,
  isPre,
}: {
  label: string;
  text: string;
  isPre?: boolean;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-body-charcoal">
        {label}
      </p>
      <div className="relative border border-border-subtle bg-industrial-matte p-3">
        {isPre ? (
          <pre className="overflow-x-auto text-xs leading-relaxed text-premium-velvet">{text}</pre>
        ) : (
          <p className="text-xs leading-relaxed text-premium-velvet">{text}</p>
        )}
        <button
          type="button"
          onClick={() => copyToClipboard(text)}
          className="absolute right-2 top-2 text-xs font-semibold uppercase tracking-wider text-amber hover:text-premium-velvet"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ Accordion                                                             */
/* -------------------------------------------------------------------------- */

function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border-subtle border-t border-border-subtle">
      {items.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-start justify-between gap-4 px-0 py-3 text-left text-sm font-semibold text-premium-velvet hover:text-amber"
          >
            <span>{faq.q}</span>
            <span className="mt-0.5 shrink-0 font-mono text-xs text-body-charcoal">
              {openIndex === i ? "[–]" : "[+]"}
            </span>
          </button>
          {openIndex === i && (
            <div className="pb-4 text-sm leading-relaxed text-body-charcoal">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Embed Code block                                                          */
/* -------------------------------------------------------------------------- */

const EMBED_CODE = `<iframe src="https://sectorcalc.com/calculators/fmea-rpn" width="100%" height="500" frameborder="0" title="FMEA RPN Calculator"></iframe>`;

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function FmeaRpnPageContent() {
  return (
    <PageLayout>
      <main>
        {/* ===== Hero ===== */}
        <Section className="bg-bg-subtle">
          <RpnBadge>Professional Engineering Reference</RpnBadge>
          <h1 className="mt-3 text-balance sc-h2">FMEA RPN Calculator</h1>
          <p className="mt-4 max-w-2xl sc-body-muted sm:text-lg">
            Calculate Risk Priority Number from Severity, Occurrence and Detection. Use the result
            with a structured FMEA table, corrective actions, and modern Action Priority thinking.
          </p>

          <div className="mt-6 text-sm leading-relaxed text-body-charcoal">
            <p>
              Risk Priority Number, or RPN, is calculated by multiplying Severity, Occurrence and
              Detection ratings:
            </p>
            <p className="mt-2 font-mono text-base font-semibold text-premium-velvet">
              RPN = Severity × Occurrence × Detection
            </p>
            <p className="mt-2">
              The result helps teams prioritize failure modes during FMEA work. RPN is useful for
              comparison inside the same FMEA, but it should not be used as the only decision rule.
              High-severity risks require separate review even when the total RPN is not the highest
              item in the table.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#calculator" size="cta">
              Calculate RPN
            </Button>
            <Button href="#template" variant="outline" size="cta">
              Download FMEA Template
            </Button>
          </div>
        </Section>

        {/* ===== Calculator ===== */}
        <Section id="calculator">
          <SectionTitle>Calculate FMEA Risk Priority Number</SectionTitle>
          <SectionSubtitle>
            Enter Severity, Occurrence and Detection ratings from 1 to 10. The calculator multiplies
            the three ratings and returns the RPN score with a practical interpretation note.
          </SectionSubtitle>

          <p className="mb-4 text-xs italic text-body-charcoal">
            Use your organization&apos;s approved FMEA rating tables when available. If no internal table
            exists, use the quick guide below as an educational reference.
          </p>

          <RpnCalculator />

          <div className="mt-4 border-l-2 border-border-subtle pl-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-body-charcoal">
              RPN = S × O × D
            </p>
            <p className="mt-1 text-xs leading-relaxed text-body-charcoal">
              S represents Severity, O represents Occurrence, and D represents Detection. Each value
              is usually rated from 1 to 10. The lowest possible RPN is 1 and the highest possible
              RPN is 1000.
            </p>
          </div>
        </Section>

        {/* ===== Result Interpretation ===== */}
        <Section>
          <SectionTitle>How to Interpret the RPN Result</SectionTitle>
          <p className="mb-4 sc-body-muted">
            RPN is a relative prioritization score. It helps compare failure modes inside the same
            FMEA, but it does not automatically define acceptability, safety, compliance or release
            approval.
          </p>

          <div className="space-y-4 text-sm">
            <div className="border-l-2 border-border-subtle pl-3">
              <p className="font-semibold text-premium-velvet">Low RPN</p>
              <p className="mt-1 text-body-charcoal">
                The failure mode appears lower priority compared with other listed risks. Keep it
                documented and review it when process conditions change.
              </p>
            </div>
            <div className="border-l-2 border-amber/40 pl-3">
              <p className="font-semibold text-premium-velvet">Moderate RPN</p>
              <p className="mt-1 text-body-charcoal">
                The failure mode deserves review. Check whether prevention controls, detection
                controls or process capability can be improved.
              </p>
            </div>
            <div className="border-l-2 border-amber pl-3">
              <p className="font-semibold text-premium-velvet">High RPN</p>
              <p className="mt-1 text-body-charcoal">
                The failure mode should be reviewed for corrective action. Focus first on prevention,
                then detection. Do not reduce Severity unless the design or process change actually
                reduces the effect of failure.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">
            A lower RPN does not always mean a lower business or safety risk. A high Severity rating
            can require action even when Occurrence or Detection values keep the total RPN moderate.
          </div>
        </Section>

        {/* ===== Resource Pack CTA ===== */}
        <Section>
          <SectionTitle>Free FMEA Resource Pack</SectionTitle>
          <p className="mb-4 sc-body-muted">
            Use this page as a practical FMEA working reference. It combines the calculator, editable
            template, PFMEA example, rating guidance, Action Priority notes and citation formats in one
            place.
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>Web-based RPN calculator</li>
            <li>Editable FMEA CSV template</li>
            <li>Example PFMEA table</li>
            <li>Severity / Occurrence / Detection guide</li>
            <li>RPN vs Action Priority explanation</li>
            <li>Embed code for training pages</li>
            <li>APA / MLA / BibTeX citation formats</li>
          </ul>
          <Button href="#template" size="cta">
            Download the FMEA Template
          </Button>
        </Section>

        {/* ===== Template Section ===== */}
        <Section id="template">
          <SectionTitle>Download Free FMEA Template</SectionTitle>
          <SectionSubtitle>
            Download an editable FMEA template to document failure modes, effects, causes, controls,
            ratings, recommended actions and revised RPN values.
          </SectionSubtitle>

          <TemplateTablePreview />

          <p className="mt-3 text-xs text-body-charcoal">
            <span className="font-semibold">Template Fields:</span> Process step or function,
            Potential failure mode, Potential failure effect, Potential failure cause, Current
            prevention control, Current detection control, Severity rating, Occurrence rating,
            Detection rating, Initial RPN, Recommended action, Action owner, Target date, Revised
            Severity, Revised Occurrence, Revised Detection, Revised RPN, Status.
          </p>

          <p className="mt-2 text-xs italic text-body-charcoal">
            Use the blank template for your own FMEA session or open the example version to
            understand how a completed PFMEA line can be structured.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="/data/fmea-template.csv"
              download
              className="inline-flex min-h-[40px] items-center justify-center bg-premium-velvet px-6 text-sm font-mono font-semibold uppercase tracking-wide text-base-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-premium-velvet disabled:pointer-events-none disabled:opacity-50"
            >
              Download Blank CSV Template
            </a>
            <a
              href="/data/fmea-template-example.csv"
              download
              className="inline-flex min-h-[40px] items-center justify-center border border-border-subtle bg-transparent px-6 text-sm font-mono font-semibold uppercase tracking-wide text-premium-velvet focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-premium-velvet disabled:pointer-events-none disabled:opacity-50"
            >
              Download Example CSV Template
            </a>
          </div>
        </Section>

        {/* ===== S/O/D Rating Guide ===== */}
        <Section>
          <SectionTitle>Severity, Occurrence and Detection Quick Guide</SectionTitle>
          <p className="mb-4 sc-body-muted">
            The exact rating scale should come from your organization&apos;s FMEA procedure. The guide
            below gives a practical educational reference for understanding the direction of each
            rating.
          </p>

          <RatingGuideTable title="Severity" data={SEVERITY_GUIDE} />
          <RatingGuideTable title="Occurrence" data={OCCURRENCE_GUIDE} />
          <RatingGuideTable title="Detection" data={DETECTION_GUIDE} />
        </Section>

        {/* ===== PFMEA Example ===== */}
        <Section>
          <SectionTitle>PFMEA Example: CNC Machining Process</SectionTitle>
          <p className="mb-6 sc-body-muted">
            The example below shows how a process FMEA line can be documented for a CNC machining
            operation. The ratings are illustrative and should be replaced with your own process
            evidence, customer requirements and internal FMEA criteria.
          </p>

          <div className="grid gap-4">
            {PFMEA_EXAMPLES.map((ex) => (
              <PfmeaExampleCard key={ex.title} example={ex} />
            ))}
          </div>
        </Section>

        {/* ===== RPN vs AP ===== */}
        <Section>
          <SectionTitle>RPN vs Action Priority</SectionTitle>
          <p className="mb-4 sc-body-muted">
            Traditional FMEA uses RPN as a fast way to rank failure modes. Modern automotive FMEA
            practice gives stronger attention to Action Priority because the same RPN can be produced
            by very different Severity, Occurrence and Detection combinations.
          </p>

          <div className="mb-4 border-l-2 border-amber/40 pl-3 text-sm font-semibold text-premium-velvet">
            RPN is a calculation. Action Priority is a decision support logic.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border-subtle p-4">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">
                Traditional RPN
              </h4>
              <p className="text-sm text-body-charcoal">
                RPN multiplies Severity, Occurrence and Detection into one number. It is simple,
                fast and useful for comparison inside the same FMEA table.
              </p>
            </div>
            <div className="border border-border-subtle p-4">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">
                Action Priority
              </h4>
              <p className="text-sm text-body-charcoal">
                Action Priority gives stronger emphasis to the pattern of Severity, Occurrence and
                Detection. A high-severity item may require attention even when the total RPN is
                lower than another item.
              </p>
            </div>
          </div>

          <div className="mt-4 border-l-2 border-border-subtle pl-3 text-sm text-body-charcoal">
            <p className="font-semibold text-premium-velvet">Practical Rule</p>
            <p className="mt-1">
              Use RPN to sort and compare. Use Severity and Action Priority thinking to decide where
              engineering action is truly required.
            </p>
          </div>

          <div className="mt-4 rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">
            This page provides an educational calculation and interpretation aid. It does not
            reproduce proprietary FMEA handbook tables and does not replace your organization&apos;s
            approved FMEA procedure.
          </div>
        </Section>

        {/* ===== Methodology ===== */}
        <Section>
          <SectionTitle>Calculation Methodology</SectionTitle>

          <div className="mb-4 font-mono text-sm font-semibold text-premium-velvet">
            RPN = Severity × Occurrence × Detection
          </div>

          <dl className="mb-4 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-premium-velvet">Severity</dt>
              <dd className="text-body-charcoal">measures the seriousness of the failure effect.</dd>
            </div>
            <div>
              <dt className="font-semibold text-premium-velvet">Occurrence</dt>
              <dd className="text-body-charcoal">estimates how often the cause or failure may happen.</dd>
            </div>
            <div>
              <dt className="font-semibold text-premium-velvet">Detection</dt>
              <dd className="text-body-charcoal">estimates how likely current controls are to detect the issue before impact.</dd>
            </div>
          </dl>

          <div className="mb-4 border border-border-subtle p-3 text-sm">
            <p className="font-semibold text-premium-velvet">Calculation Range</p>
            <p className="mt-1 text-body-charcoal">
              Minimum RPN = 1 × 1 × 1 = <span className="font-mono">1</span>
              <br />
              Maximum RPN = 10 × 10 × 10 = <span className="font-mono">1000</span>
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">
              Method Assumptions
            </h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-body-charcoal">
              <li>Ratings use a 1 to 10 scale.</li>
              <li>All three ratings are entered consistently.</li>
              <li>The same internal rating table is used across the compared failure modes.</li>
              <li>RPN is used for relative prioritization, not as an absolute safety threshold.</li>
              <li>
                Revised RPN should be calculated only after a defined action changes Occurrence or
                Detection evidence.
              </li>
            </ol>
          </div>

          <div className="space-y-2 text-sm">
            <div className="border-l-2 border-border-subtle pl-3">
              <p className="font-semibold text-premium-velvet">Technical Limitation</p>
              <p className="text-body-charcoal">
                Severity, Occurrence and Detection ratings are ordinal scores. Multiplying them
                creates a useful prioritization index, but it does not produce a physically measured
                risk value.
              </p>
            </div>
            <div className="border-l-2 border-border-subtle pl-3">
              <p className="font-semibold text-premium-velvet">Engineering Limitation</p>
              <p className="text-body-charcoal">
                RPN can hide high-severity risks when Occurrence or Detection values are low. Always
                review high Severity ratings separately.
              </p>
            </div>
            <div className="border-l-2 border-border-subtle pl-3">
              <p className="font-semibold text-premium-velvet">Documentation Limitation</p>
              <p className="text-body-charcoal">
                An RPN value without the failure mode, effect, cause, control and recommended action
                is incomplete. FMEA should be treated as a structured engineering record, not only a
                score.
              </p>
            </div>
          </div>
        </Section>

        {/* ===== Embed ===== */}
        <Section>
          <SectionTitle>Embed This FMEA RPN Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">
            You can embed the calculator in training pages, internal quality resources or educational
            material. The embedded version displays the calculator without the full SectorCalc page
            layout.
          </p>
          <p className="mb-3 text-xs italic text-body-charcoal">
            Please keep the attribution link when embedding the tool so users can access the full
            methodology, template, PFMEA example and citation information.
          </p>

          <div className="relative border border-border-subtle bg-industrial-matte p-3">
            <pre className="overflow-x-auto text-xs leading-relaxed text-premium-velvet">
              {EMBED_CODE}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(EMBED_CODE)}
              className="absolute right-2 top-2 text-xs font-semibold uppercase tracking-wider text-amber hover:text-premium-velvet"
            >
              Copy
            </button>
          </div>

          <p className="mt-2 text-xs text-body-charcoal">
            <span className="font-semibold">Attribution:</span> FMEA RPN Calculator by SectorCalc
          </p>
        </Section>

        {/* ===== Cite ===== */}
        <Section>
          <SectionTitle>Cite This Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">
            Use the citation formats below when referencing this calculator in training material,
            internal documentation, course notes or technical resources.
          </p>

          <CitationBlock label="APA" text={CITATIONS.apa} />
          <CitationBlock label="MLA" text={CITATIONS.mla} />
          <CitationBlock label="BibTeX" text={CITATIONS.bibtex} isPre />
        </Section>

        {/* ===== FAQ ===== */}
        <Section id="faq">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FaqAccordion items={FAQS} />
        </Section>

        {/* ===== References ===== */}
        <Section>
          <SectionTitle>References and Standards Context</SectionTitle>
          <p className="mb-4 sc-body-muted">
            FMEA methods are widely used in quality engineering, reliability engineering, automotive
            product development, process design and manufacturing risk analysis. This calculator uses
            the traditional RPN formula and provides educational notes related to modern FMEA
            prioritization practice.
          </p>

          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>Failure Mode and Effects Analysis methodology</li>
            <li>Risk Priority Number calculation</li>
            <li>Severity, Occurrence and Detection rating logic</li>
            <li>Process FMEA and Design FMEA workflows</li>
            <li>Action Priority interpretation in modern automotive FMEA practice</li>
          </ul>

          <div className="rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">
            This page is an educational engineering reference. It does not reproduce proprietary
            standard tables and does not replace official standards, customer-specific requirements
            or your organization&apos;s approved FMEA procedure.
          </div>
        </Section>

        {/* ===== Related Tools ===== */}
        <Section>
          <SectionTitle>Related Engineering Calculators</SectionTitle>
          <p className="mb-4 sc-body-muted">
            FMEA identifies and prioritizes failure risks. The tools below help analyze process
            capability, equipment performance, setup losses and manufacturing cost after risk areas
            are identified.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/tools/generated/process-capability-cpk-calculator"
              className="block border border-border-subtle p-3 text-sm hover:border-premium-velvet"
            >
              <span className="font-semibold text-premium-velvet">Cp / Cpk Calculator</span>
              <span className="mt-1 block text-body-charcoal">
                Evaluate process capability after a high-risk dimensional failure mode is identified.
              </span>
            </Link>

            <Link
              href="/tools/generated/oee-calculator"
              className="block border border-border-subtle p-3 text-sm hover:border-premium-velvet"
            >
              <span className="font-semibold text-premium-velvet">OEE Calculator</span>
              <span className="mt-1 block text-body-charcoal">
                Quantify availability, performance and quality losses in production systems.
              </span>
            </Link>

            <Link
              href="/tools/generated/smed-calculator"
              className="block border border-border-subtle p-3 text-sm hover:border-premium-velvet"
            >
              <span className="font-semibold text-premium-velvet">SMED Calculator</span>
              <span className="mt-1 block text-body-charcoal">
                Analyze setup-time reduction opportunities linked to process instability or
                changeover risk.
              </span>
            </Link>

            <Link
              href="/cnc-quote-risk"
              className="block border border-border-subtle p-3 text-sm hover:border-premium-velvet"
            >
              <span className="font-semibold text-premium-velvet">CNC True Unit Cost Calculator</span>
              <span className="mt-1 block text-body-charcoal">
                Connect machining risk, scrap, cycle time and setup loss to unit cost.
              </span>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Button href="/pro-tools" variant="outline" size="cta">
              Explore SectorCalc Pro Tools
            </Button>
          </div>
        </Section>
      </main>
    </PageLayout>
  );
}
