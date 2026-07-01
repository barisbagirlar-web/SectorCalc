"use client";

import { useState, useCallback } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { SITE, siteUrl } from "@/config/site";

type RpnResult = {
  rpn: number;
  severity: number;
  occurrence: number;
  detection: number;
  band: "low" | "moderate" | "high";
};

const ratingOptions = Array.from({ length: 10 }, (_, i) => i + 1);

const CITATIONS = {
  apa: 'SectorCalc. (2026). FMEA RPN calculator: Severity, occurrence and detection risk priority number tool. SectorCalc. https://sectorcalc.com/calculators/fmea-rpn',
  mla: 'SectorCalc. "FMEA RPN Calculator: Severity, Occurrence and Detection Risk Priority Number Tool." SectorCalc, 2026, https://sectorcalc.com/calculators/fmea-rpn.',
  chicago: 'SectorCalc. 2026. "FMEA RPN Calculator: Severity, Occurrence and Detection Risk Priority Number Tool." SectorCalc. https://sectorcalc.com/calculators/fmea-rpn.',
  bibtex: `@misc{sectorcalc_fmea_rpn_2026,
  title = {FMEA RPN Calculator: Severity, Occurrence and Detection Risk Priority Number Tool},
  author = {{SectorCalc}},
  year = {2026},
  publisher = {SectorCalc},
  url = {https://sectorcalc.com/calculators/fmea-rpn},
  note = {Educational calculator for traditional FMEA Risk Priority Number scoring}
}`,
  ris: `TY  - ELEC
TI  - FMEA RPN Calculator: Severity, Occurrence and Detection Risk Priority Number Tool
AU  - SectorCalc
PY  - 2026
PB  - SectorCalc
UR  - https://sectorcalc.com/calculators/fmea-rpn
N1  - Educational calculator for traditional FMEA Risk Priority Number scoring
ER  -`,
} as const;

const VALIDATION_CASES = [
  { s: 1, o: 1, d: 1, expected: 1 },
  { s: 5, o: 5, d: 5, expected: 125 },
  { s: 7, o: 5, d: 4, expected: 140 },
  { s: 8, o: 4, d: 5, expected: 160 },
  { s: 10, o: 10, d: 10, expected: 1000 },
];

const HIGH_COLLISION_RPNS = [
  { rpn: 60, combos: 24 },
  { rpn: 72, combos: 24 },
  { rpn: 120, combos: 24 },
  { rpn: 24, combos: 21 },
  { rpn: 36, combos: 21 },
  { rpn: 40, combos: 21 },
  { rpn: 48, combos: 21 },
  { rpn: 80, combos: 21 },
  { rpn: 90, combos: 21 },
  { rpn: 180, combos: 21 },
];

const SAME_RPN_EXAMPLES = [
  { s: 10, o: 2, d: 3, rpn: 60, interpretation: "High-severity item with lower occurrence and stronger detection" },
  { s: 3, o: 5, d: 4, rpn: 60, interpretation: "Lower-severity item with moderate occurrence and detection" },
  { s: 2, o: 3, d: 10, rpn: 60, interpretation: "Low-severity item with very weak detection" },
  { s: 5, o: 6, d: 2, rpn: 60, interpretation: "Moderate-severity item with higher occurrence and stronger detection" },
];

const FAQS = [
  { q: "What is RPN in FMEA?", a: "RPN means Risk Priority Number. It is a traditional FMEA score calculated by multiplying Severity, Occurrence and Detection ratings. It helps teams compare and prioritize failure modes inside the same FMEA worksheet." },
  { q: "How do you calculate RPN?", a: "RPN is calculated as Severity \u00d7 Occurrence \u00d7 Detection. For example, if Severity is 7, Occurrence is 5 and Detection is 4: 7 \u00d7 5 \u00d7 4 = 140." },
  { q: "What is the maximum RPN value?", a: "When Severity, Occurrence and Detection are each rated from 1 to 10, the maximum RPN is 10 \u00d7 10 \u00d7 10 = 1000. The minimum RPN is 1 \u00d7 1 \u00d7 1 = 1." },
  { q: "Is there a universal good RPN score?", a: "No. There is no universal good RPN score. RPN should be interpreted within the same FMEA, using consistent rating tables and organization-defined action rules." },
  { q: "Can two failure modes have the same RPN but different risk?", a: "Yes. Different Severity, Occurrence and Detection combinations can produce the same RPN. A high-Severity item may require stronger attention even if its total RPN equals a lower-Severity item." },
  { q: "How many unique RPN values are possible?", a: "A 1\u201310 Severity, Occurrence and Detection system creates 1000 possible input combinations. However, those combinations produce only 120 unique RPN values. This duplicate-score behavior is one reason RPN should not be used as the only action decision rule." },
  { q: "Should Severity be reduced after corrective action?", a: "Severity should only be reduced if the design or process change truly reduces the effect of the failure. Many corrective actions reduce Occurrence or improve Detection while Severity remains unchanged." },
  { q: "Is RPN still used in FMEA?", a: "RPN is still useful as a quick prioritization score in traditional FMEA workflows. Modern FMEA practice also considers Action Priority and the individual pattern of Severity, Occurrence and Detection." },
  { q: "What is the difference between RPN and Action Priority?", a: "RPN is a numeric score. Action Priority is a decision support concept that considers the pattern of Severity, Occurrence and Detection instead of relying only on a multiplied number." },
  { q: "Can this calculator replace a standards-body FMEA procedure?", a: "No. This calculator is an educational and practical calculation aid. It should be used with your organization\u2019s approved FMEA procedure, rating tables and customer-specific requirements." },
  { q: "How should I cite this calculator in academic material?", a: "Use the citation formats provided in the \u201cCite This Calculator\u201d section. Recommended APA citation: SectorCalc. (2026). FMEA RPN calculator: Severity, occurrence and detection risk priority number tool. SectorCalc." },
];

function buildFmeaJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${siteUrl}/calculators/fmea-rpn#webpage`, url: `${siteUrl}/calculators/fmea-rpn`, name: "FMEA RPN Calculator for Severity, Occurrence and Detection Scoring", description: "Calculate traditional FMEA RPN from Severity, Occurrence and Detection. Includes PFMEA example, template, validation cases and academic citation formats.", datePublished: "2026-07-01", dateModified: "2026-07-01", publisher: { "@id": `${siteUrl}/#organization` }, about: { "@id": `${siteUrl}/calculators/fmea-rpn#softwareapplication` }, mainEntity: [
          { "@id": `${siteUrl}/calculators/fmea-rpn#faq` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#techarticle` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#learningresource` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset` },
        ] },
      { "@type": "SoftwareApplication", "@id": `${siteUrl}/calculators/fmea-rpn#softwareapplication`, name: "FMEA RPN Calculator", applicationCategory: "EngineeringApplication", operatingSystem: "Web", url: `${siteUrl}/calculators/fmea-rpn`, description: "Educational calculator for traditional FMEA Risk Priority Number scoring using Severity, Occurrence and Detection.", publisher: { "@id": `${siteUrl}/#organization` }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "TechArticle", "@id": `${siteUrl}/calculators/fmea-rpn#techarticle`, headline: "FMEA RPN Calculator Methodology", about: ["Failure Mode and Effects Analysis", "Risk Priority Number", "Severity", "Occurrence", "Detection", "PFMEA"], publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "LearningResource", "@id": `${siteUrl}/calculators/fmea-rpn#learningresource`, name: "FMEA RPN Calculator and PFMEA Example", learningResourceType: "calculator", educationalUse: "engineering education", publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset`, name: "Example PFMEA Table for CNC Machining", description: "Illustrative PFMEA example table with Severity, Occurrence, Detection and RPN values.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "FAQPage", "@id": `${siteUrl}/calculators/fmea-rpn#faq`, mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) },
      { "@type": "BreadcrumbList", "@id": `${siteUrl}/calculators/fmea-rpn#breadcrumb`, itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteUrl}/calculators` },
          { "@type": "ListItem", position: 3, name: "FMEA RPN Calculator", item: `${siteUrl}/calculators/fmea-rpn` },
        ] },
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE.siteName, url: siteUrl },
    ],
  };
}

function calculateRpn(s: number, o: number, d: number): RpnResult {
  const rpn = s * o * d;
  let band: RpnResult["band"] = "low";
  if (rpn >= 200) band = "high";
  else if (rpn >= 100) band = "moderate";
  return { rpn, severity: s, occurrence: o, detection: d, band };
}

function bandColor(band: RpnResult["band"]) {
  switch (band) {
    case "high": return "text-amber font-semibold";
    case "moderate": return "text-premium-velvet";
    case "low": return "text-body-charcoal";
  }
}

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

function RpnBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-border-subtle bg-industrial-matte px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-premium-velvet">{children}</span>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`border-b border-border-subtle py-8 sm:py-10 sc-section ${className}`}>
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
        <div>
          <label htmlFor="fmea-severity" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">Severity (S)</label>
          <select id="fmea-severity" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="fmea-occurrence" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">Occurrence (O)</label>
          <select id="fmea-occurrence" value={occurrence} onChange={(e) => setOccurrence(Number(e.target.value))} className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="fmea-detection" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-body-charcoal">Detection (D)</label>
          <select id="fmea-detection" value={detection} onChange={(e) => setDetection(Number(e.target.value))} className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
      </div>
      <Button onClick={handleCalculate} size="cta">Calculate RPN</Button>
      {result && (
        <div className="mt-6 border-t border-border-subtle pt-6">
          <div className="mb-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-body-charcoal">RPN = {result.severity} \u00d7 {result.occurrence} \u00d7 {result.detection}</p>
            <p className={`mt-1 text-3xl font-bold ${bandColor(result.band)}`}>{result.rpn}</p>
            <RpnBadge>{result.band === "high" ? "High RPN" : result.band === "moderate" ? "Moderate RPN" : "Low RPN"}</RpnBadge>
          </div>
          <div className="mt-4 space-y-2 text-sm text-body-charcoal">
            {result.band === "low" && <p>The failure mode appears lower priority compared with other listed risks. Keep it documented and review it when process conditions change.</p>}
            {result.band === "moderate" && <p>The failure mode deserves review. Check whether prevention controls, detection controls or process capability can be improved.</p>}
            {result.band === "high" && <p>The failure mode should be reviewed for corrective action. Focus first on prevention, then detection. Do not reduce Severity unless the design or process change actually reduces the effect of failure.</p>}
            <p className="text-xs italic">A lower RPN does not always mean a lower business or safety risk. A high Severity rating can require action even when Occurrence or Detection values keep the total RPN moderate.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CitationBlock({ label, text, isPre }: { label: string; text: string; isPre?: boolean }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-body-charcoal">{label}</p>
      <div className="relative border border-border-subtle bg-industrial-matte p-3">
        {isPre ? <pre className="overflow-x-auto text-xs leading-relaxed text-premium-velvet">{text}</pre> : <p className="text-xs leading-relaxed text-premium-velvet">{text}</p>}
        <button type="button" onClick={() => copyToClipboard(text)} className="absolute right-2 top-2 text-xs font-semibold uppercase tracking-wider text-amber hover:text-premium-velvet" aria-label={`Copy ${label} citation`}>Copy</button>
      </div>
    </div>
  );
}

function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="divide-y divide-border-subtle border-t border-border-subtle">
      {items.map((faq, i) => (
        <div key={i}>
          <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-start justify-between gap-4 px-0 py-3 text-left text-sm font-semibold text-premium-velvet hover:text-amber" aria-expanded={openIndex === i} aria-controls={`faq-answer-${i}`}>
            <span>{faq.q}</span>
            <span className="mt-0.5 shrink-0 font-mono text-xs text-body-charcoal">{openIndex === i ? "[\u2013]" : "[+]"}</span>
          </button>
          {openIndex === i && <div id={`faq-answer-${i}`} className="pb-4 text-sm leading-relaxed text-body-charcoal">{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}

const SEVERITY_GUIDE = [
  { range: "1\u20133", category: "Low", desc: "Minor effect, limited inconvenience, low disruption or no major functional loss" },
  { range: "4\u20136", category: "Moderate", desc: "Degraded function, rework, delay, customer dissatisfaction or measurable process impact" },
  { range: "7\u20138", category: "High", desc: "Significant reliability, production, performance, quality or customer impact" },
  { range: "9\u201310", category: "Very High", desc: "Safety, regulatory, mission-critical, severe customer or severe system-level impact" },
];
const OCCURRENCE_GUIDE = [
  { range: "1\u20133", category: "Low", desc: "Rare or unlikely based on history, robust prevention or stable process evidence" },
  { range: "4\u20136", category: "Moderate", desc: "Occasional; the cause may appear under certain design, process or operating conditions" },
  { range: "7\u20138", category: "High", desc: "Frequent; the cause is expected to repeat unless prevention is improved" },
  { range: "9\u201310", category: "Very High", desc: "Very frequent; the process or design is likely to generate the failure repeatedly" },
];
const DETECTION_GUIDE = [
  { range: "1\u20133", category: "Strong Detection", desc: "Controls are likely to detect the issue early and consistently" },
  { range: "4\u20136", category: "Moderate Detection", desc: "Controls may detect the issue, but gaps, sampling limits or timing limits exist" },
  { range: "7\u20138", category: "Weak Detection", desc: "The issue may escape because detection is late, manual or inconsistent" },
  { range: "9\u201310", category: "Very Weak Detection", desc: "The current system is unlikely to detect the issue before impact" },
];

function RatingGuideTable({ title, data }: { title: string; data: { range: string; category: string; desc: string }[] }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">{title}</h4>
      <div className="overflow-x-auto border border-border-subtle">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border-subtle bg-industrial-matte">
              <th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Rating Range</th>
              <th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Category</th>
              <th className="px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Educational Meaning</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.range} className="border-b border-border-subtle last:border-b-0">
                <td className="whitespace-nowrap px-3 py-2 font-mono font-semibold text-premium-velvet">{row.range}</td>
                <td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">{row.category}</td>
                <td className="px-3 py-2 text-body-charcoal">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PFMEA_TABLE_HEADERS = ["Process Step", "Failure Mode", "Effect", "Cause", "Prevention Control", "Detection Control", "S", "O", "D", "Initial RPN", "Recommended Action", "Revised S", "Revised O", "Revised D", "Revised RPN"];

const PFMEA_ROWS = [
  { processStep: "Drilling operation", failureMode: "Hole diameter out of tolerance", effect: "Assembly interference, leakage risk or rejected part", cause: "Tool wear, incorrect feed rate, poor fixture alignment", prevention: "Approved machining parameters, setup checklist, tool-life monitoring", detection: "First-piece inspection and periodic gauge check", s: 7, o: 5, d: 4, initialRpn: 140, action: "Add tool-life counter, revise inspection frequency, verify fixture alignment before production run", rs: 7, ro: 3, rd: 3, revisedRpn: 63 },
  { processStep: "Surface milling", failureMode: "Poor surface finish", effect: "Customer cosmetic rejection or additional rework", cause: "Worn insert, unstable clamping, vibration", prevention: "Tool inspection before setup, fixture torque check", detection: "Visual inspection and roughness sampling", s: 5, o: 6, d: 5, initialRpn: 150, action: "Define insert replacement interval, add vibration check, increase roughness sampling during first batch", rs: 5, ro: 3, rd: 4, revisedRpn: 60 },
  { processStep: "Part clamping", failureMode: "Part movement during machining", effect: "Dimensional error, scrap or machine interruption", cause: "Incorrect clamping force, worn fixture surface, operator setup error", prevention: "Setup checklist and fixture maintenance plan", detection: "First-piece dimensional inspection", s: 8, o: 4, d: 5, initialRpn: 160, action: "Add poka-yoke clamp confirmation, document fixture wear limit, require second-person setup approval for critical parts", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Final deburring", failureMode: "Burr remains on edge", effect: "Assembly issue, handling risk or customer complaint", cause: "Incomplete deburring, worn deburring tool, visual inspection miss", prevention: "Standard work instruction", detection: "Final visual inspection", s: 6, o: 5, d: 6, initialRpn: 180, action: "Add edge acceptance criteria, improve inspection lighting, introduce sample tactile check", rs: 6, ro: 3, rd: 4, revisedRpn: 72 },
];

const EMBED_CODE = `<iframe src="https://sectorcalc.com/embed/fmea-rpn" width="100%" height="500" frameborder="0" title="FMEA RPN Calculator"></iframe>`;

const VERSION_HISTORY = [{
  version: "1.0", date: "2026-07-01",
  notes: [
    "Initial academic citation version",
    "Added downloadable FMEA template",
    "Added illustrative PFMEA dataset",
    "Added RPN vs Action Priority educational note",
    "Added APA, MLA, Chicago, BibTeX and RIS citation formats",
    "Added calculation validation test cases",
    "Added RPN score-space and collision analysis",
    "Added technical note reference",
    "Added standards-context disclaimer",
  ],
}];

export function FmeaRpnPageContent() {
  return (
    <PageLayout>
      <SemanticJsonLd data={buildFmeaJsonLd()} />
      <main>
        <Section className="bg-bg-subtle">
          <RpnBadge>Educational Engineering Reference</RpnBadge>
          <h1 className="mt-3 text-balance sc-h2">FMEA RPN Calculator for Severity, Occurrence and Detection Scoring</h1>
          <p className="mt-4 max-w-2xl sc-body-muted sm:text-lg">An educational engineering reference for calculating traditional Risk Priority Number in Failure Mode and Effects Analysis, with PFMEA examples, downloadable templates, validation cases, RPN collision analysis and academic citation formats.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#abstract" variant="outline" size="cta">Abstract</Button>
            <Button href="#calculator" size="cta">Calculate RPN</Button>
            <Button href="#academic-use" variant="outline" size="cta">Academic Citation</Button>
            <Button href="#collision" variant="outline" size="cta">RPN Collision Analysis</Button>
            <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">Technical Note</Button>
          </div>
        </Section>

        <Section id="abstract">
          <SectionTitle>Abstract</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">This page documents the traditional Risk Priority Number calculation used in Failure Mode and Effects Analysis.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The calculator applies the formula:</p>
          <p className="mb-4 font-mono text-base font-semibold text-premium-velvet">RPN = Severity \u00d7 Occurrence \u00d7 Detection</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">using integer ratings from 1 to 10.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The page includes input definitions, calculation assumptions, validation test cases, an illustrative PFMEA dataset, RPN collision analysis, limitations of RPN-based prioritization, downloadable FMEA templates and academic citation formats.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The tool is intended for engineering education, quality management training, industrial engineering coursework, internal FMEA workshops and practical failure-mode documentation.</p>
          <div className="rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">This page is an educational engineering reference and not a standards-body publication. It does not replace AIAG-VDA, IEC, ISO, customer-specific, regulatory or organization-specific FMEA procedures.</div>
        </Section>

        <Section>
          <SectionTitle>Quick Answer</SectionTitle>
          <p className="mb-4 text-sm text-body-charcoal">Risk Priority Number, or RPN, is a traditional FMEA score calculated by multiplying Severity, Occurrence and Detection ratings.</p>
          <p className="mb-2 font-mono text-base font-semibold text-premium-velvet">RPN = S \u00d7 O \u00d7 D</p>
          <dl className="mb-4 space-y-1 text-sm">
            <div><dt className="font-semibold text-premium-velvet">S</dt><dd className="text-body-charcoal">= Severity</dd></div>
            <div><dt className="font-semibold text-premium-velvet">O</dt><dd className="text-body-charcoal">= Occurrence</dd></div>
            <div><dt className="font-semibold text-premium-velvet">D</dt><dd className="text-body-charcoal">= Detection</dd></div>
          </dl>
          <p className="mb-2 text-sm text-body-charcoal">Each factor is usually rated from 1 to 10.</p>
          <div className="mb-4 border border-border-subtle p-3 text-sm">
            <p className="text-body-charcoal">The lowest possible RPN is:<br /><span className="font-mono font-semibold text-premium-velvet">1 \u00d7 1 \u00d7 1 = 1</span></p>
            <p className="mt-2 text-body-charcoal">The highest possible RPN is:<br /><span className="font-mono font-semibold text-premium-velvet">10 \u00d7 10 \u00d7 10 = 1000</span></p>
          </div>
          <p className="text-sm text-body-charcoal">RPN helps compare failure modes within the same FMEA worksheet. It should be treated as a relative prioritization aid, not as an absolute safety threshold, approval rule or substitute for an approved FMEA procedure.</p>
        </Section>

        <Section id="calculator">
          <SectionTitle>Calculate FMEA Risk Priority Number</SectionTitle>
          <SectionSubtitle>Use the calculator below to compute traditional FMEA Risk Priority Number. Enter Severity, Occurrence and Detection values from 1 to 10. Use your organization\u2019s approved rating criteria when available.</SectionSubtitle>
          <RpnCalculator />
          <div className="mt-6 border-t border-border-subtle pt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Result Interpretation</h3>
            <h4 className="mb-2 text-sm font-semibold text-premium-velvet">Calculated RPN</h4>
            <p className="mb-4 text-sm text-body-charcoal">The calculator returns:<br /><span className="font-mono">RPN = Severity \u00d7 Occurrence \u00d7 Detection</span></p>
            <h4 className="mb-2 text-sm font-semibold text-premium-velvet">Formula Trace</h4>
            <p className="mb-4 text-sm text-body-charcoal">Each result should be documented as a traceable calculation:<br /><span className="font-mono">S \u00d7 O \u00d7 D = [Severity] \u00d7 [Occurrence] \u00d7 [Detection] = [RPN]</span></p>
            <h4 className="mb-2 text-sm font-semibold text-premium-velvet">Interpretation Note</h4>
            <p className="mb-4 text-sm text-body-charcoal">The RPN score can be used to compare one failure mode against other items in the same FMEA worksheet. It should not be used alone to decide whether a risk is acceptable. High-Severity items should be reviewed separately even when their RPN is not the highest value in the worksheet.</p>
            <h4 className="mb-2 text-sm font-semibold text-premium-velvet">Documentation Note</h4>
            <p className="text-sm text-body-charcoal">After calculating RPN, document:</p>
            <ul className="mt-1 mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
              <li>Failure mode, Failure effect, Failure cause</li>
              <li>Current prevention control, Current detection control</li>
              <li>Initial S/O/D ratings, Initial RPN</li>
              <li>Recommended action, Action owner, Target date, Action taken</li>
              <li>Revised S/O/D ratings, Revised RPN, Verification evidence</li>
            </ul>
          </div>
        </Section>

        <Section>
          <SectionTitle>Input Definitions</SectionTitle>
          <div className="space-y-4 text-sm">
            <div className="border-l-2 border-border-subtle pl-3"><h4 className="font-semibold text-premium-velvet">Severity</h4><p className="mt-1 text-body-charcoal">Severity measures the seriousness of the failure effect if the failure occurs. A high Severity rating means the effect may create significant safety, regulatory, functional, production, customer or business impact.</p></div>
            <div className="border-l-2 border-border-subtle pl-3"><h4 className="font-semibold text-premium-velvet">Occurrence</h4><p className="mt-1 text-body-charcoal">Occurrence estimates how likely the failure cause is to happen. A high Occurrence rating means the failure cause is expected to repeat unless prevention controls are improved.</p></div>
            <div className="border-l-2 border-border-subtle pl-3"><h4 className="font-semibold text-premium-velvet">Detection</h4><p className="mt-1 text-body-charcoal">Detection estimates how likely current controls are to detect the failure cause or failure mode before the effect reaches the next process, user or customer. A high Detection rating usually means weak detection. The issue may escape because the detection method is late, manual, inconsistent, indirect or absent.</p></div>
          </div>
        </Section>

        <Section id="academic-use">
          <SectionTitle>Academic Use and Citation</SectionTitle>
          <p className="mb-4 sc-body-muted">This page is designed as an educational engineering reference for Risk Priority Number calculation in Failure Mode and Effects Analysis.</p>
          <p className="mb-4 text-sm text-body-charcoal">It may be cited when referencing:</p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>The traditional RPN formula: Severity \u00d7 Occurrence \u00d7 Detection</li>
            <li>Educational examples of PFMEA scoring</li>
            <li>Practical limitations of RPN-based prioritization</li>
            <li>RPN collision and duplicate-score behavior</li>
            <li>Use of downloadable FMEA templates in teaching or internal training</li>
            <li>Comparison between traditional RPN and modern Action Priority thinking</li>
          </ul>
          <div className="rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">This calculator should not be cited as a standards-body method, regulatory approval tool or substitute for AIAG-VDA, IEC, ISO, customer-specific or organization-specific FMEA procedures.</div>
        </Section>

        <Section id="methodology">
          <SectionTitle>Calculation Methodology</SectionTitle>
          <p className="mb-4 sc-body-muted">The calculator applies direct multiplication of three validated integer inputs:</p>
          <p className="mb-4 font-mono text-base font-semibold text-premium-velvet">RPN = S \u00d7 O \u00d7 D</p>
          <dl className="mb-6 space-y-1 text-sm">
            <div><dt className="font-semibold text-premium-velvet">S</dt><dd className="text-body-charcoal">= Severity</dd></div>
            <div><dt className="font-semibold text-premium-velvet">O</dt><dd className="text-body-charcoal">= Occurrence</dd></div>
            <div><dt className="font-semibold text-premium-velvet">D</dt><dd className="text-body-charcoal">= Detection</dd></div>
          </dl>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Input Range</h4>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-border-subtle bg-industrial-matte"><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Input</th><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Minimum</th><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Maximum</th><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Type</th></tr></thead>
              <tbody>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Severity</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">10</td><td className="whitespace-nowrap px-3 py-2 text-body-charcoal">Integer</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Occurrence</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">10</td><td className="whitespace-nowrap px-3 py-2 text-body-charcoal">Integer</td></tr>
                <tr className="border-b border-border-subtle last:border-b-0"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Detection</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">10</td><td className="whitespace-nowrap px-3 py-2 text-body-charcoal">Integer</td></tr>
              </tbody>
            </table>
          </div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Output Range</h4>
          <div className="mb-6 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-border-subtle bg-industrial-matte"><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Output</th><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Value</th></tr></thead>
              <tbody>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Minimum RPN</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1</td></tr>
                <tr className="border-b border-border-subtle last:border-b-0"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Maximum RPN</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1000</td></tr>
              </tbody>
            </table>
          </div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Method Assumptions</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-body-charcoal">
            <li>Each input is an integer from 1 to 10.</li>
            <li>All compared failure modes use the same rating definitions.</li>
            <li>RPN is used as a relative prioritization score inside the same FMEA context.</li>
            <li>Revised RPN is calculated only after a defined engineering, design or process action changes Occurrence or Detection evidence.</li>
            <li>Severity should only be reduced when the actual effect of the failure has changed.</li>
            <li>RPN values from different organizations, products, processes or rating tables are not directly comparable.</li>
            <li>The method does not convert ordinal ratings into a physically measured risk value.</li>
          </ol>
        </Section>

        <Section id="validation">
          <SectionTitle>Calculation Validation Test Cases</SectionTitle>
          <p className="mb-4 text-sm text-body-charcoal">The table below provides expected outputs for direct multiplication of validated integer inputs from 1 to 10.</p>
          <div className="overflow-x-auto border border-border-subtle" role="region" aria-label="RPN validation test cases">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-border-subtle bg-industrial-matte"><th>Severity</th><th>Occurrence</th><th>Detection</th><th>Expected RPN</th><th>Result</th></tr></thead>
              <tbody>{VALIDATION_CASES.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono">{row.s}</td><td className="px-3 py-2 font-mono">{row.o}</td><td className="px-3 py-2 font-mono">{row.d}</td><td className="px-3 py-2 font-mono font-semibold">{row.expected}</td><td className="px-3 py-2 font-mono font-semibold text-green-600">Pass</td></tr>))}</tbody>
            </table>
          </div>
          <p className="mt-3 text-xs italic text-body-charcoal">The calculator performs direct multiplication of validated integer inputs from 1 to 10. Inputs outside this range must be rejected or corrected before calculation.</p>
        </Section>

        <Section id="collision">
          <SectionTitle>RPN Score Space and Collision Analysis</SectionTitle>
          <p className="mb-4 text-sm text-body-charcoal">A 1\u201310 FMEA scoring system creates:</p>
          <p className="mb-2 font-mono text-base font-semibold text-premium-velvet">10 \u00d7 10 \u00d7 10 = 1000 possible S/O/D input combinations</p>
          <p className="mb-4 text-sm text-body-charcoal">However, those 1000 combinations do not create 1000 unique RPN values. They create only:</p>
          <p className="mb-4 font-mono text-2xl font-bold text-amber">120 unique RPN values</p>
          <p className="mb-4 text-sm text-body-charcoal">This means many different Severity, Occurrence and Detection patterns produce the same RPN. This is one of the main reasons RPN should not be used as the only action-decision criterion.</p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Highest-Collision RPN Values</h4>
          <div className="mb-6 overflow-x-auto border border-border-subtle"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">RPN Value</th><th className="px-3 py-1.5 font-mono font-semibold">Number of S/O/D Combinations</th></tr></thead><tbody>{HIGH_COLLISION_RPNS.map((row) => (<tr key={row.rpn} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono font-semibold">{row.rpn}</td><td className="px-3 py-2 font-mono">{row.combos}</td></tr>))}</tbody></table></div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Example: Same RPN, Different Risk Profile</h4>
          <p className="mb-3 text-sm text-body-charcoal">All four combinations below produce the same RPN. They should not be treated as equivalent engineering risks without reviewing the individual S/O/D pattern.</p>
          <div className="overflow-x-auto border border-border-subtle"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-industrial-matte"><th>Severity</th><th>Occurrence</th><th>Detection</th><th>RPN</th><th>Interpretation</th></tr></thead><tbody>{SAME_RPN_EXAMPLES.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono font-semibold">{row.s}</td><td className="px-3 py-2 font-mono">{row.o}</td><td className="px-3 py-2 font-mono">{row.d}</td><td className="px-3 py-2 font-mono font-semibold text-amber">{row.rpn}</td><td className="px-3 py-2">{row.interpretation}</td></tr>))}</tbody></table></div>
          <div className="mt-6 border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Practical Interpretation</p><p className="mt-1">RPN is useful for sorting, but weak for deciding. A failure mode with high Severity may require action even when its RPN is lower than another item. A failure mode with weak Detection may indicate escape risk even when Severity is not extreme.</p></div>
        </Section>

        <Section>
          <SectionTitle>Severity, Occurrence and Detection Guide</SectionTitle>
          <p className="mb-4 sc-body-muted">The exact rating scale should come from your organization\u2019s FMEA procedure. The guide below is an educational reference for understanding how the rating direction works.</p>
          <RatingGuideTable title="Severity Rating Guide" data={SEVERITY_GUIDE} />
          <RatingGuideTable title="Occurrence Rating Guide" data={OCCURRENCE_GUIDE} />
          <RatingGuideTable title="Detection Rating Guide" data={DETECTION_GUIDE} />
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">These ranges are educational references. Use the approved rating tables defined by your organization for formal work.</div>
        </Section>

        <Section>
          <SectionTitle>Limitations of RPN</SectionTitle>
          <p className="mb-4 sc-body-muted">RPN is useful because it is simple, fast and easy to compare inside the same FMEA worksheet. However, it has important limitations.</p>
          <div className="space-y-4 text-sm">
            <div className="border-l-2 pl-3"><p className="font-semibold">1. Different S/O/D Combinations Can Produce the Same RPN</p><p className="mt-1">Example: S=10,O=2,D=3 yields RPN=60, while S=3,O=5,D=4 also yields RPN=60. The first case has much higher Severity.</p></div>
            <div className="border-l-2 pl-3"><p className="font-semibold">2. High-Severity Risks Can Be Hidden</p><p className="mt-1">A high-Severity item can receive a moderate RPN if Occurrence and Detection scores are low.</p></div>
            <div className="border-l-2 pl-3"><p className="font-semibold">3. RPN Depends on Rating Consistency</p><p className="mt-1">If different teams use different rating definitions, their RPN values are not comparable.</p></div>
            <div className="border-l-2 pl-3"><p className="font-semibold">4. RPN Is Not a Physical Measurement</p><p className="mt-1">Multiplying ordinal ratings creates a prioritization index, not a measured risk value.</p></div>
            <div className="border-l-2 pl-3"><p className="font-semibold">5. RPN Does Not Replace Engineering Judgment</p><p className="mt-1">FMEA is not complete when an RPN is calculated. The score must be connected to the full failure chain.</p></div>
          </div>
        </Section>

        <Section>
          <SectionTitle>Illustrative PFMEA Dataset: CNC Machining Process</SectionTitle>
          <p className="mb-4 sc-body-muted">The dataset below is illustrative and intended for teaching, training and internal FMEA practice. Replace all ratings with evidence from your own process.</p>
          <div className="overflow-x-auto border border-border-subtle"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-industrial-matte">{PFMEA_TABLE_HEADERS.map((h) => (<th key={h} className="px-2 py-1.5 font-mono font-semibold">{h}</th>))}</tr></thead><tbody>{PFMEA_ROWS.map((row, i) => (<tr key={i} className="border-b last:border-b-0 hover:bg-bg-subtle"><td className="px-2 py-1.5 font-semibold">{row.processStep}</td><td className="px-2 py-1.5">{row.failureMode}</td><td className="px-2 py-1.5">{row.effect}</td><td className="px-2 py-1.5">{row.cause}</td><td className="px-2 py-1.5">{row.prevention}</td><td className="px-2 py-1.5">{row.detection}</td><td className="px-2 py-1.5 font-mono">{row.s}</td><td className="px-2 py-1.5 font-mono">{row.o}</td><td className="px-2 py-1.5 font-mono">{row.d}</td><td className="px-2 py-1.5 font-mono font-semibold text-amber">{row.initialRpn}</td><td className="px-2 py-1.5">{row.action}</td><td className="px-2 py-1.5 font-mono">{row.rs}</td><td className="px-2 py-1.5 font-mono">{row.ro}</td><td className="px-2 py-1.5 font-mono">{row.rd}</td><td className="px-2 py-1.5 font-mono font-semibold">{row.revisedRpn}</td></tr>))}</tbody></table></div>
          <div className="mt-4 rounded-none border bg-industrial-matte p-3 text-xs italic">Severity should remain unchanged unless the engineering change reduces the actual effect of the failure. Most corrective actions reduce Occurrence, improve Detection or both.</div>
        </Section>

        <Section id="template">
          <SectionTitle>Downloadable Academic and Training Assets</SectionTitle>
          <p className="mb-4 sc-body-muted">Use the downloads below for teaching, training, internal FMEA workshops or practical engineering documentation.</p>
          <a href="/data/fmea-template.csv" download className="mb-4 inline-flex min-h-[44px] items-center justify-center bg-premium-velvet px-6 text-sm font-mono font-semibold uppercase tracking-wide text-base-white">Download Blank CSV Template</a>
          <br />
          <a href="/data/fmea-template-example.csv" download className="mb-4 inline-flex min-h-[44px] items-center justify-center border border-border-subtle bg-transparent px-6 text-sm font-mono font-semibold uppercase tracking-wide text-premium-velvet">Download Example CSV Dataset</a>
          <br />
          <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">View FMEA RPN Technical Note</Button>
        </Section>

        <Section id="technical-note">
          <SectionTitle>FMEA RPN Technical Note</SectionTitle>
          <p className="mb-4 text-sm font-semibold">FMEA RPN Calculator Technical Note</p>
          <p className="mb-4 text-sm">This technical note documents the traditional Risk Priority Number calculation used in Failure Mode and Effects Analysis.</p>
          <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">Open Full Technical Note</Button>
        </Section>

        <Section>
          <SectionTitle>RPN vs Action Priority</SectionTitle>
          <p className="mb-4 sc-body-muted">Traditional RPN is a numeric product of Severity, Occurrence and Detection. It is simple, fast and useful for comparing failure modes inside the same FMEA worksheet.</p>
          <p className="mb-4 sc-body-muted">Action Priority is a decision support concept used in modern automotive FMEA practice. It gives stronger attention to the pattern of Severity, Occurrence and Detection instead of relying only on a single multiplied number.</p>
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">This page provides an educational explanation only. It does not reproduce proprietary handbook tables and does not replace standards-body publications or customer-specific FMEA requirements.</div>
        </Section>

        <Section id="cite">
          <SectionTitle>Cite This Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">Use the citation formats below when referencing this calculator in academic material, course notes, technical documentation, internal FMEA training or engineering resources.</p>
          <CitationBlock label="APA 7" text={CITATIONS.apa} />
          <CitationBlock label="MLA 9" text={CITATIONS.mla} />
          <CitationBlock label="Chicago" text={CITATIONS.chicago} />
          <CitationBlock label="BibTeX" text={CITATIONS.bibtex} isPre />
          <CitationBlock label="RIS" text={CITATIONS.ris} isPre />
        </Section>

        <Section id="version-history">
          <SectionTitle>Version History</SectionTitle>
          {VERSION_HISTORY.map((v) => (<div key={v.version}><p className="text-sm font-semibold">Version {v.version} \u2014 {v.date}</p><ul className="mt-2 list-inside list-disc space-y-1 text-sm">{v.notes.map((note, i) => (<li key={i}>{note}</li>))}</ul></div>))}
        </Section>

        <Section>
          <SectionTitle>References and Standards Context</SectionTitle>
          <p className="mb-4 sc-body-muted">FMEA methods are widely used in quality engineering, reliability engineering, automotive product development, process design and manufacturing risk analysis.</p>
          <p className="mb-4 sc-body-muted">This page provides an educational calculator for the traditional RPN formula and contextual notes related to modern FMEA practice.</p>
          <p className="mb-2 text-sm font-semibold text-premium-velvet">Reference context:</p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>AIAG &amp; VDA. <em>Failure Mode and Effects Analysis FMEA Handbook</em>.</li>
            <li>IEC 60812. <em>Failure modes and effects analysis FMEA and FMECA</em>.</li>
            <li>ISO 12100. <em>Safety of machinery \u2014 General principles for design \u2014 Risk assessment and risk reduction</em>.</li>
            <li>ASQ. <em>Failure Mode and Effects Analysis educational resources</em>.</li>
          </ul>
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">This page is an educational engineering reference. It does not reproduce proprietary standard tables and does not replace standards-body publications, customer-specific requirements, regulatory requirements or your organization\u2019s approved FMEA procedure.</div>
        </Section>

        <Section id="faq">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FaqAccordion items={FAQS} />
        </Section>

        <Section>
          <SectionTitle>Embed This Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">You may embed this calculator in engineering education pages, internal quality resources, FMEA training pages or technical learning material.</p>
          <p className="mb-3 text-xs italic">Recommended Attribution Text: FMEA RPN Calculator by SectorCalc</p>
          <div className="relative border bg-industrial-matte p-3"><pre className="overflow-x-auto text-xs">{EMBED_CODE}</pre><button type="button" onClick={() => copyToClipboard(EMBED_CODE)} className="absolute right-2 top-2 text-xs font-semibold uppercase" aria-label="Copy embed code">Copy</button></div>
        </Section>

        <Section>
          <SectionTitle>Related Engineering Calculators</SectionTitle>
          <p className="mb-4 sc-body-muted">FMEA identifies and prioritizes failure risks. The tools below help evaluate process capability, equipment performance, setup losses and manufacturing cost after risk areas are identified.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/pro-tools" className="block border p-3 text-sm hover:border-premium-velvet"><span className="font-semibold">SectorCalc Pro Tools</span><span className="mt-1 block">Engineering calculator library for deeper process, production, risk and cost analysis.</span></Link>
          </div>
        </Section>
      </main>
    </PageLayout>
  );
}
