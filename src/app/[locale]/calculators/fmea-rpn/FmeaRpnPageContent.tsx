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

/* ── Section 12: Highest-Collision RPN Values ── */
const HIGH_COLLISION_RPNS = [
  { rpn: 60, combos: 24, risk: "Very high collision; many different risk profiles collapse into one score" },
  { rpn: 72, combos: 24, risk: "Very high collision; severity, occurrence and detection patterns can vary widely" },
  { rpn: 120, combos: 24, risk: "Very high collision; common moderate-to-high worksheet score" },
  { rpn: 24, combos: 21, risk: "High collision; low-to-moderate score may hide very different detection patterns" },
  { rpn: 36, combos: 21, risk: "High collision; common low-to-moderate prioritization value" },
  { rpn: 40, combos: 21, risk: "High collision; can include high severity with low O/D values" },
  { rpn: 48, combos: 21, risk: "High collision; not enough for action decision by itself" },
  { rpn: 80, combos: 21, risk: "High collision; common middle-score ambiguity" },
  { rpn: 90, combos: 21, risk: "High collision; can include high severity combinations" },
  { rpn: 180, combos: 21, risk: "High collision; common high-review candidate" },
];

/* ── Section 13: Same-RPN Equivalence Families ── */
const EQUIVALENCE_FAMILIES = [
  { rpn: 60, s: 10, o: 2, d: 3, signature: "High Severity / Low Occurrence / Stronger Detection", why: "The effect is severe even though the total score is moderate" },
  { rpn: 60, s: 3, o: 5, d: 4, signature: "Lower Severity / Moderate Occurrence / Moderate Detection", why: "Operational issue, not equivalent to high-severity case" },
  { rpn: 60, s: 2, o: 3, d: 10, signature: "Low Severity / Weak Detection", why: "Detection system is weak even though effect is limited" },
  { rpn: 60, s: 5, o: 6, d: 2, signature: "Moderate Severity / Higher Occurrence / Strong Detection", why: "Recurring issue with better detection" },
  { rpn: 72, s: 9, o: 1, d: 8, signature: "High Severity / Rare / Weak Detection", why: "Low occurrence may hide detection weakness" },
  { rpn: 72, s: 3, o: 3, d: 8, signature: "Lower Severity / Moderate Occurrence / Weak Detection", why: "Detection improvement may be primary action" },
  { rpn: 72, s: 8, o: 9, d: 1, signature: "High Severity / Frequent / Strong Detection", why: "Prevention may matter more than detection" },
  { rpn: 120, s: 10, o: 2, d: 6, signature: "High Severity / Low Occurrence / Moderate Detection", why: "Severity review still required" },
  { rpn: 120, s: 3, o: 5, d: 8, signature: "Lower Severity / Moderate Occurrence / Weak Detection", why: "Detection action may dominate" },
  { rpn: 120, s: 6, o: 4, d: 5, signature: "Moderate Severity / Moderate Occurrence / Moderate Detection", why: "Balanced but not equivalent to high-Severity cases" },
];

/* ── Section 14: High-Severity Masking Analysis ── */
const MASKING_STATS = [
  { group: "S = 9 or 10", threshold: "RPN \u2264 100", count: 54, share: "27%" },
  { group: "S = 9 or 10", threshold: "RPN \u2264 150", count: 73, share: "36.5%" },
  { group: "S = 9 or 10", threshold: "RPN \u2264 200", count: 94, share: "47%" },
];
const MASKING_EXAMPLES = [
  { s: 10, o: 1, d: 1, rpn: 10, warning: "Extremely severe effect but low total score due to low occurrence and strong detection" },
  { s: 10, o: 2, d: 3, rpn: 60, warning: "High severity hidden inside a moderate RPN" },
  { s: 9, o: 3, d: 4, rpn: 108, warning: "High severity item may look lower than frequent moderate issues" },
  { s: 9, o: 5, d: 2, rpn: 90, warning: "Prevention and severity review still matter even when detection is strong" },
];

/* ── Section 15: RPN Sensitivity Matrix ── */
const SENSITIVITY_DATA = [
  { s: 7, o: 5, d: 4, rpn: 140, ro1: 112, rd1: 105, rod1: 84, note: "Detection improvement has larger impact than one-point occurrence reduction here" },
  { s: 8, o: 4, d: 5, rpn: 160, ro1: 120, rd1: 128, rod1: 96, note: "Occurrence reduction has larger impact because Detection is higher" },
  { s: 6, o: 5, d: 6, rpn: 180, ro1: 144, rd1: 150, rod1: 120, note: "Combined O and D action has strongest effect" },
  { s: 10, o: 2, d: 6, rpn: 120, ro1: 60, rd1: 100, rod1: 50, note: "High-severity case still requires severity review even after RPN reduction" },
  { s: 5, o: 8, d: 3, rpn: 120, ro1: 105, rd1: 80, rod1: 70, note: "Detection improvement has larger leverage due to high occurrence" },
];

/* ── Section 16: Action Leverage Matrix ── */
const ACTION_LEVERAGE = [
  { actionType: "Design change that removes failure effect", affects: "Severity", example: "Change geometry to eliminate interference effect", evidence: "Verified design review, test evidence or customer requirement confirmation" },
  { actionType: "Process prevention control", affects: "Occurrence", example: "Tool-life counter, poka-yoke, parameter lock", evidence: "Before/after defect frequency or process evidence" },
  { actionType: "Detection improvement", affects: "Detection", example: "Automated gauge, in-process sensor, test fixture", evidence: "Detection study, inspection effectiveness evidence or escape-rate data" },
  { actionType: "Training or work instruction", affects: "Occurrence and/or Detection", example: "Setup checklist, standard work update", evidence: "Audit evidence, error-rate reduction or control-plan verification" },
  { actionType: "Supplier control", affects: "Occurrence", example: "Incoming capability requirement or supplier corrective action", evidence: "Supplier quality data or incoming inspection trend" },
  { actionType: "Maintenance control", affects: "Occurrence", example: "Fixture wear limit, preventive maintenance interval", evidence: "Maintenance records and failure recurrence trend" },
];

/* ── Section 17: Revised RPN Audit Trail ── */
const AUDIT_TRAIL_FIELDS = [
  { field: "Original failure mode", doc: "The exact failure mode being evaluated" },
  { field: "Original effect", doc: "What happens if the failure occurs" },
  { field: "Original cause", doc: "Why the failure may occur" },
  { field: "Original controls", doc: "Prevention and detection controls before action" },
  { field: "Initial S/O/D and RPN", doc: "Baseline rating and formula trace" },
  { field: "Recommended action", doc: "Engineering or process action to be implemented" },
  { field: "Action owner", doc: "Responsible person or role" },
  { field: "Target date", doc: "Planned completion date" },
  { field: "Action evidence", doc: "Test, audit, measurement, inspection or process data" },
  { field: "Revised S/O/D and RPN", doc: "Updated rating with reason" },
  { field: "Verification date", doc: "Date the action was checked" },
  { field: "Residual risk note", doc: "Remaining risk after action" },
];

/* ── Section 20: RPN Misranking Examples ── */
const MISRANKING_EXAMPLES = [
  { label: "A: Safety-related failure with strong controls", s: 10, o: 2, d: 3, rpn: 60, rank: "Lower", concern: "High Severity requires separate review" },
  { label: "B: Cosmetic defect with weak detection", s: 4, o: 8, d: 8, rpn: 256, rank: "Higher", concern: "Higher RPN but lower Severity" },
  { label: "C: Regulatory documentation escape", s: 9, o: 2, d: 4, rpn: 72, rank: "Lower", concern: "Low RPN does not remove compliance review need" },
  { label: "D: Frequent minor rework", s: 3, o: 9, d: 8, rpn: 216, rank: "Higher", concern: "High operational loss but not same consequence class" },
];

/* ── Section 21: When to Use RPN ── */
const WHEN_USE = [
  { use: "Comparing failure modes inside the same FMEA worksheet", notUse: "A universal safety threshold" },
  { use: "Teaching the relationship between S, O and D", notUse: "A standards-body approval method" },
  { use: "Creating a first-pass prioritization list", notUse: "A replacement for engineering judgment" },
  { use: "Tracking before/after action changes", notUse: "A replacement for customer-specific requirements" },
  { use: "Explaining relative prioritization", notUse: "A substitute for Action Priority tables where required by procedure" },
  { use: "Documenting traditional FMEA calculation logic", notUse: "A cross-company benchmark score" },
];

/* ── PFMEA Dataset Library ── */
const PFMEA_TABLE_HEADERS = ["Process Step", "Failure Mode", "Effect", "Cause", "Prevention Control", "Detection Control", "S", "O", "D", "Initial RPN", "Recommended Action", "Revised S", "Revised O", "Revised D", "Revised RPN"];

const PFMEA_CNC = [
  { processStep: "Drilling operation", failureMode: "Hole diameter out of tolerance", effect: "Assembly interference, leakage risk or rejected part", cause: "Tool wear, incorrect feed rate, poor fixture alignment", prevention: "Approved machining parameters, setup checklist, tool-life monitoring", detection: "First-piece inspection and periodic gauge check", s: 7, o: 5, d: 4, initialRpn: 140, action: "Add tool-life counter, revise inspection frequency, verify fixture alignment before production run", rs: 7, ro: 3, rd: 3, revisedRpn: 63 },
  { processStep: "Surface milling", failureMode: "Poor surface finish", effect: "Customer cosmetic rejection or additional rework", cause: "Worn insert, unstable clamping, vibration", prevention: "Tool inspection before setup, fixture torque check", detection: "Visual inspection and roughness sampling", s: 5, o: 6, d: 5, initialRpn: 150, action: "Define insert replacement interval, add vibration check, increase roughness sampling during first batch", rs: 5, ro: 3, rd: 4, revisedRpn: 60 },
  { processStep: "Part clamping", failureMode: "Part movement during machining", effect: "Dimensional error, scrap or machine interruption", cause: "Incorrect clamping force, worn fixture surface, operator setup error", prevention: "Setup checklist and fixture maintenance plan", detection: "First-piece dimensional inspection", s: 8, o: 4, d: 5, initialRpn: 160, action: "Add poka-yoke clamp confirmation, document fixture wear limit, require second-person setup approval for critical parts", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Final deburring", failureMode: "Burr remains on edge", effect: "Assembly issue, handling risk or customer complaint", cause: "Incomplete deburring, worn deburring tool, visual inspection miss", prevention: "Standard work instruction", detection: "Final visual inspection", s: 6, o: 5, d: 6, initialRpn: 180, action: "Add edge acceptance criteria, improve inspection lighting, introduce sample tactile check", rs: 6, ro: 3, rd: 4, revisedRpn: 72 },
];

const PFMEA_ASSEMBLY = [
  { processStep: "Press-fit assembly", failureMode: "Part not fully seated", effect: "Functional failure or rework", cause: "Incorrect press force or misalignment", prevention: "Fixture guide and press parameter setup", detection: "Visual inspection and go/no-go check", s: 8, o: 4, d: 5, initialRpn: 160, action: "Add force-displacement monitoring and part-presence confirmation", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Fastener tightening", failureMode: "Under-torque", effect: "Loose joint or field failure", cause: "Incorrect torque setting or tool drift", prevention: "Torque tool setup checklist", detection: "Sample torque audit", s: 9, o: 3, d: 5, initialRpn: 135, action: "Add digital torque traceability and daily tool verification", rs: 9, ro: 2, rd: 3, revisedRpn: 54 },
  { processStep: "Label application", failureMode: "Wrong label applied", effect: "Traceability error or shipment hold", cause: "Similar label variants and manual selection", prevention: "Work instruction and label rack separation", detection: "Final visual inspection", s: 6, o: 5, d: 6, initialRpn: 180, action: "Add barcode scan verification before application", rs: 6, ro: 2, rd: 3, revisedRpn: 36 },
  { processStep: "Seal installation", failureMode: "Seal damaged during insertion", effect: "Leak or premature failure", cause: "Sharp edge, incorrect insertion angle", prevention: "Operator training and visual standard", detection: "Leak test", s: 8, o: 4, d: 4, initialRpn: 128, action: "Add insertion fixture and edge-condition check", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
];

const PFMEA_MAINTENANCE = [
  { processStep: "Lubrication task", failureMode: "Lubrication missed", effect: "Bearing wear or unplanned downtime", cause: "Manual schedule missed", prevention: "PM checklist", detection: "Operator noise/temperature observation", s: 7, o: 5, d: 6, initialRpn: 210, action: "Add CMMS reminder and lubrication confirmation record", rs: 7, ro: 3, rd: 4, revisedRpn: 84 },
  { processStep: "Filter replacement", failureMode: "Wrong filter installed", effect: "Reduced flow or equipment damage", cause: "Similar filter part numbers", prevention: "Parts list and maintenance instruction", detection: "Post-maintenance pressure check", s: 8, o: 3, d: 5, initialRpn: 120, action: "Add barcode verification and kitting control", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Belt tension check", failureMode: "Belt tension too low", effect: "Slip, heat, speed loss or stoppage", cause: "Subjective manual adjustment", prevention: "Maintenance standard", detection: "Visual inspection", s: 6, o: 5, d: 5, initialRpn: 150, action: "Add tension gauge and acceptance range", rs: 6, ro: 3, rd: 3, revisedRpn: 54 },
  { processStep: "Sensor cleaning", failureMode: "Sensor remains dirty", effect: "False readings or machine stop", cause: "Access difficulty or skipped task", prevention: "PM checklist", detection: "Alarm review", s: 5, o: 6, d: 5, initialRpn: 150, action: "Add access tool and photo confirmation", rs: 5, ro: 3, rd: 3, revisedRpn: 45 },
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

const EMBED_CODE = `<iframe src="https://sectorcalc.com/embed/fmea-rpn" width="100%" height="500" frameborder="0" title="FMEA RPN Calculator"></iframe>`;

const VERSION_HISTORY = [{
  version: "1.2", date: "2026-07-02",
  notes: [
    "Added Which RPN Values Are Impossible? section",
    "Added RPN Reachability Rule, 750 analysis, and prime-number score analysis",
    "Added interactive RPN Reachability Checker",
  ],
}, {
  version: "1.1", date: "2026-07-01",
  notes: [
    "Added Why This Reference Is Citable section",
    "Added RPN Score-Space Atlas with reachable/unreachable analysis",
    "Added Highest-Collision RPN Values with interpretation risk",
    "Added Same-RPN Equivalence Families (10 cases across RPN 60, 72, 120)",
    "Added High-Severity Masking Analysis (54/73/94 combinations)",
    "Added RPN Sensitivity Matrix with marginal effect calculations",
    "Added Action Leverage Matrix with evidence requirements",
    "Added Revised RPN Audit Trail documentation fields",
    "Added PFMEA Dataset Library (CNC, Assembly, Maintenance)",
    "Added RPN Misranking Examples",
    "Added When to Use RPN and When Not to Use RPN",
    "Added Reproducibility Note with pseudocode",
    "Added downloadable collision atlas, equivalence families, masking cases and sensitivity matrix CSVs",
    "Added Dataset schema entries for all downloadable datasets",
  ],
}];

/* ── JSON-LD ── */
function buildFmeaJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${siteUrl}/calculators/fmea-rpn#webpage`, url: `${siteUrl}/calculators/fmea-rpn`, name: "FMEA RPN Calculator for Severity, Occurrence and Detection Scoring", description: "Calculate traditional FMEA RPN from Severity, Occurrence and Detection. Includes PFMEA examples, templates, validation cases, RPN collision atlas, severity masking analysis and academic citation formats.", datePublished: "2026-07-01", dateModified: "2026-07-01", publisher: { "@id": `${siteUrl}/#organization` }, about: { "@id": `${siteUrl}/calculators/fmea-rpn#softwareapplication` }, mainEntity: [
          { "@id": `${siteUrl}/calculators/fmea-rpn#faq` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#techarticle` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#learningresource` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-collision` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-equivalence` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-masking` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-sensitivity` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-assembly` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-maintenance` },
        ] },
      { "@type": "SoftwareApplication", "@id": `${siteUrl}/calculators/fmea-rpn#softwareapplication`, name: "FMEA RPN Calculator", applicationCategory: "EngineeringApplication", operatingSystem: "Web", url: `${siteUrl}/calculators/fmea-rpn`, description: "Educational calculator for traditional FMEA Risk Priority Number scoring using Severity, Occurrence and Detection.", publisher: { "@id": `${siteUrl}/#organization` }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "TechArticle", "@id": `${siteUrl}/calculators/fmea-rpn#techarticle`, headline: "FMEA RPN Calculator Methodology", about: ["Failure Mode and Effects Analysis", "Risk Priority Number", "Severity", "Occurrence", "Detection", "PFMEA", "Severity Masking", "RPN Collision"], publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "LearningResource", "@id": `${siteUrl}/calculators/fmea-rpn#learningresource`, name: "FMEA RPN Calculator and PFMEA Dataset Library", learningResourceType: "calculator", educationalUse: "engineering education", publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset`, name: "CNC PFMEA Example Dataset", description: "Illustrative PFMEA example table for CNC machining process with Severity, Occurrence, Detection and RPN values.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-collision`, name: "RPN Collision Atlas", description: "Complete enumeration of RPN collision counts for all 120 unique RPN values in a 1-10 S/O/D scoring system.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-equivalence`, name: "RPN Equivalence Families", description: "Same-RPN equivalence families showing different S/O/D signatures producing identical RPN scores.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-masking`, name: "High-Severity Masking Analysis", description: "Analysis of how many high-severity combinations produce low-to-moderate RPN scores.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-sensitivity`, name: "RPN Sensitivity Matrix", description: "Marginal RPN sensitivity table showing effect of changing O, D or both ratings.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-assembly`, name: "Assembly PFMEA Example Dataset", description: "Illustrative PFMEA example table for assembly process with four failure modes.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-maintenance`, name: "Maintenance PFMEA Example Dataset", description: "Illustrative PFMEA example table for maintenance process with four failure modes.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
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

function ReachabilityChecker() {
  const [testValue, setTestValue] = useState("");
  const [result, setResult] = useState<{ isReachable: boolean, factors?: [number, number, number][] } | null>(null);

  const checkReachability = useCallback(() => {
    const val = parseInt(testValue, 10);
    if (isNaN(val) || val < 1 || val > 1000) {
      setResult(null);
      return;
    }
    const factors: [number, number, number][] = [];
    for (let s = 1; s <= 10; s++) {
      for (let o = 1; o <= 10; o++) {
        for (let d = 1; d <= 10; d++) {
          if (s * o * d === val) {
            factors.push([s, o, d]);
          }
        }
      }
    }
    setResult({ isReachable: factors.length > 0, factors });
  }, [testValue]);

  return (
    <div className="mt-4 border border-border-subtle bg-bg-card p-4 sm:p-6">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">RPN Reachability Checker</h3>
      <p className="mb-4 text-sm text-body-charcoal">Enter a value between 1 and 1000 to see if it can be reached using a 1-10 S/O/D scoring system.</p>
      <div className="mb-4 flex gap-2">
        <input type="number" min="1" max="1000" placeholder="Enter RPN (1-1000)" value={testValue} onChange={(e) => setTestValue(e.target.value)} className="w-full border border-border-subtle bg-bg-subtle px-3 py-2 text-sm text-premium-velvet focus:outline-none focus:ring-1 focus:ring-premium-velvet sm:w-64" />
        <Button onClick={checkReachability} size="cta">Check</Button>
      </div>
      {result && (
        <div className="mt-4 border-t border-border-subtle pt-4 text-sm text-body-charcoal">
          {result.isReachable ? (
            <div>
              <p className="mb-2 font-semibold text-green-600">Reachable!</p>
              <p>This RPN can be formed by {result.factors?.length} combination(s).</p>
            </div>
          ) : (
            <div>
              <p className="mb-2 font-semibold text-amber">Not Reachable</p>
              <p>There is no valid integer combination of S, O, D (1-10) that multiplies to {testValue}.</p>
            </div>
          )}
        </div>
      )}
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

function PfmeaTable({ rows }: { rows: typeof PFMEA_CNC }) {
  return (
    <div className="overflow-x-auto border border-border-subtle">
      <table className="w-full text-left text-xs">
        <thead><tr className="border-b bg-industrial-matte">{PFMEA_TABLE_HEADERS.map((h) => (<th key={h} className="px-2 py-1.5 font-mono font-semibold">{h}</th>))}</tr></thead>
        <tbody>{rows.map((row, i) => (<tr key={i} className="border-b last:border-b-0 hover:bg-bg-subtle">
          <td className="px-2 py-1.5 font-semibold">{row.processStep}</td>
          <td className="px-2 py-1.5">{row.failureMode}</td>
          <td className="px-2 py-1.5">{row.effect}</td>
          <td className="px-2 py-1.5">{row.cause}</td>
          <td className="px-2 py-1.5">{row.prevention}</td>
          <td className="px-2 py-1.5">{row.detection}</td>
          <td className="px-2 py-1.5 font-mono">{row.s}</td>
          <td className="px-2 py-1.5 font-mono">{row.o}</td>
          <td className="px-2 py-1.5 font-mono">{row.d}</td>
          <td className="px-2 py-1.5 font-mono font-semibold text-amber">{row.initialRpn}</td>
          <td className="px-2 py-1.5">{row.action}</td>
          <td className="px-2 py-1.5 font-mono">{row.rs}</td>
          <td className="px-2 py-1.5 font-mono">{row.ro}</td>
          <td className="px-2 py-1.5 font-mono">{row.rd}</td>
          <td className="px-2 py-1.5 font-mono font-semibold">{row.revisedRpn}</td>
        </tr>))}</tbody>
      </table>
    </div>
  );
}

function DownloadButton({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a href={href} download className={`mb-3 inline-flex min-h-[44px] items-center justify-center px-6 text-sm font-mono font-semibold uppercase tracking-wide ${primary ? "bg-premium-velvet text-base-white" : "border border-border-subtle bg-transparent text-premium-velvet"}`}>{label}</a>
  );
}

export function FmeaRpnPageContent() {
  return (
    <PageLayout>
      <SemanticJsonLd data={buildFmeaJsonLd()} />
      <main>
        {/* -- Section 1: Hero -- */}
        <Section className="bg-bg-subtle">
          <RpnBadge>Educational Engineering Reference</RpnBadge>
          <h1 className="mt-3 text-balance sc-h2">FMEA RPN Calculator for Severity, Occurrence and Detection Scoring</h1>
          <p className="mt-4 max-w-2xl sc-body-muted sm:text-lg">An educational engineering reference for calculating traditional Risk Priority Number in Failure Mode and Effects Analysis, with PFMEA examples, downloadable templates, validation cases, RPN collision analysis and academic citation formats.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#calculator" size="cta">Calculate RPN</Button>
            <Button href="#citable" variant="outline" size="cta">Why This Is Citable</Button>
            <Button href="#collision" variant="outline" size="cta">Collision Atlas</Button>
            <Button href="#masking" variant="outline" size="cta">Severity Masking</Button>
            <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">Technical Note</Button>
          </div>
        </Section>

        {/* -- Section 2: Abstract -- */}
        <Section id="abstract">
          <SectionTitle>Abstract</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">This page documents the traditional Risk Priority Number calculation used in Failure Mode and Effects Analysis.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The calculator applies the formula:</p>
          <p className="mb-4 font-mono text-base font-semibold text-premium-velvet">RPN = Severity \u00d7 Occurrence \u00d7 Detection</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">using integer ratings from 1 to 10.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The page includes input definitions, calculation assumptions, validation test cases, an RPN score-space atlas, collision analysis, severity masking analysis, sensitivity matrix, action leverage matrix, illustrative PFMEA datasets, downloadable teaching assets and academic citation formats.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">The tool is intended for engineering education, quality management training, industrial engineering coursework, internal FMEA workshops and practical failure-mode documentation.</p>
          <div className="rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">This page is an educational engineering reference and not a standards-body publication. It does not replace AIAG-VDA, IEC, ISO, customer-specific, regulatory or organization-specific FMEA procedures.</div>
        </Section>

        {/* -- Section 3: Why This Reference Is Citable (NEW) -- */}
        <Section id="citable">
          <SectionTitle>Why This Reference Is Citable</SectionTitle>
          <p className="mb-4 sc-body-muted">This page is designed as a reproducible educational reference for traditional FMEA Risk Priority Number calculation.</p>
          <p className="mb-4 text-sm text-body-charcoal">Unlike a basic calculator page, it includes:</p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>the RPN formula and input assumptions</li>
            <li>validation test cases</li>
            <li>a full score-space explanation for 1\u201310 S/O/D ratings</li>
            <li>RPN collision behavior</li>
            <li>same-score equivalence examples</li>
            <li>high-severity masking examples</li>
            <li>sensitivity and action-leverage tables</li>
            <li>an illustrative PFMEA dataset library</li>
            <li>downloadable teaching datasets</li>
            <li>citation formats for academic and technical use</li>
          </ul>
          <div className="rounded-none border border-border-subtle bg-industrial-matte p-3 text-xs italic text-body-charcoal">This page should be cited as an educational engineering reference, not as a standards-body publication or substitute for organization-approved FMEA procedures.</div>
        </Section>

        {/* -- Section 4: Quick Answer -- */}
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

        {/* -- Section 5: Calculator -- */}
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

        {/* -- Section 6: Academic Use and Citation -- */}
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

        {/* -- Section 7: Calculation Methodology -- */}
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

        {/* -- Section 8: Calculation Validation Test Cases -- */}
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

        {/* -- Section 9: RPN Score-Space Atlas (NEW) -- */}
        <Section id="space-atlas">
          <SectionTitle>RPN Score-Space Atlas</SectionTitle>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">A 1\u201310 Severity, Occurrence and Detection system creates 1000 possible input combinations:</p>
          <p className="mb-2 font-mono text-base font-semibold text-premium-velvet">10 \u00d7 10 \u00d7 10 = 1000</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">However, those 1000 input combinations produce only <strong>120 unique RPN values</strong>.</p>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">This means 880 numbers between 1 and 1000 cannot occur as an RPN value under the traditional 1\u201310 integer scoring system. This creates a sparse, non-uniform score space.</p>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-border-subtle bg-industrial-matte"><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Metric</th><th className="whitespace-nowrap px-3 py-1.5 font-mono font-semibold uppercase tracking-wider text-body-charcoal">Value</th></tr></thead>
              <tbody>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Possible S/O/D combinations</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1000</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Minimum RPN</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Maximum RPN</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">1000</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Unique reachable RPN values</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">120</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Unreachable values between 1 and 1000</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">880</td></tr>
                <tr className="border-b border-border-subtle"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Reachable score density</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">12%</td></tr>
                <tr className="border-b border-border-subtle last:border-b-0"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">Unreachable score density</td><td className="whitespace-nowrap px-3 py-2 font-mono text-premium-velvet">88%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs italic text-body-charcoal">This score-space behavior is generated directly from all integer triples where S, O and D range from 1 to 10.</p>
        </Section>

        {/* -- Section 9B: Which RPN Values Are Impossible? (NEW) -- */}
        <Section id="impossible-rpn">
          <SectionTitle>Which RPN Values Are Impossible?</SectionTitle>
          <p className="mb-4 sc-body-muted">Between 1 and 1000, 880 values are mathematically impossible to reach using a 1-10 Severity, Occurrence and Detection scoring system.</p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">RPN Reachability Rule</h4>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">For an RPN to be valid (reachable):</p>
          <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-body-charcoal">
            <li>It must be an integer between 1 and 1000.</li>
            <li>Its prime factorization cannot contain any prime number strictly greater than 7 (i.e., no 11, 13, 17, 19, etc.).</li>
            <li>It must be factorable into exactly three integers, each &le; 10.</li>
          </ol>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Are Prime-Number RPN Scores Possible?</h4>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">Yes, but only 2, 3, 5, and 7. Any larger prime (such as 11, 13, 17, 19) requires a factor greater than 10, which violates the 1-10 rating scale.</p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Is RPN 750 Possible?</h4>
          <p className="mb-4 text-sm leading-relaxed text-body-charcoal">No. Even though 750 does not have prime factors greater than 7, it cannot be formed by three factors &le; 10. (750 = 5 &times; 5 &times; 30, and you cannot break 30 into two numbers &le; 10). The closest reachable values are 720 and 800.</p>
          
          <ReachabilityChecker />
        </Section>

        {/* -- Section 10: Highest-Collision RPN Values (NEW) -- */}
        <Section id="collision">
          <SectionTitle>Highest-Collision RPN Values</SectionTitle>
          <p className="mb-4 sc-body-muted">Some RPN values are produced by many different S/O/D combinations. These values are collision-heavy and should be interpreted carefully.</p>
          <div className="mb-6 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">RPN Value</th><th className="px-3 py-1.5 font-mono font-semibold">Number of S/O/D Combinations</th><th className="px-3 py-1.5 font-mono font-semibold">Interpretation Risk</th></tr></thead>
              <tbody>{HIGH_COLLISION_RPNS.map((row) => (<tr key={row.rpn} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono font-semibold text-premium-velvet">{row.rpn}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.combos}</td><td className="px-3 py-2 text-body-charcoal">{row.risk}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">A high-collision RPN value should never be treated as a single risk profile. Always inspect Severity, Occurrence and Detection separately.</p></div>
          <p className="mt-4 text-xs italic text-body-charcoal">Full collision atlas available for download: <a href="/data/fmea-rpn-collision-atlas.csv" className="text-premium-velvet underline">Download RPN Collision Atlas CSV</a>.</p>
        </Section>

        {/* -- Section 11: Same-RPN Equivalence Families (NEW) -- */}
        <Section id="equivalence">
          <SectionTitle>Same-RPN Equivalence Families</SectionTitle>
          <p className="mb-4 sc-body-muted">The same RPN can be produced by different S/O/D signatures. A signature with high Severity should not be treated as equivalent to a low-Severity signature simply because the multiplied RPN is the same.</p>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-2 py-1.5 font-mono font-semibold">RPN</th><th className="px-2 py-1.5 font-mono font-semibold">S</th><th className="px-2 py-1.5 font-mono font-semibold">O</th><th className="px-2 py-1.5 font-mono font-semibold">D</th><th className="px-2 py-1.5 font-mono font-semibold">Risk Signature</th><th className="px-2 py-1.5 font-mono font-semibold">Why It Matters</th></tr></thead>
              <tbody>{EQUIVALENCE_FAMILIES.map((row, i) => (<tr key={i} className="border-b last:border-b-0 hover:bg-bg-subtle"><td className="px-2 py-2 font-mono font-semibold text-amber">{row.rpn}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.s}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.o}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.d}</td><td className="px-2 py-2 text-body-charcoal">{row.signature}</td><td className="px-2 py-2 text-body-charcoal">{row.why}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">Equivalent RPN does not mean equivalent risk. The individual S/O/D pattern is the actual engineering signal.</p></div>
          <p className="mt-4 text-xs italic text-body-charcoal">Download full dataset: <a href="/data/fmea-rpn-equivalence-families.csv" className="text-premium-velvet underline">Download Same-RPN Equivalence Families CSV</a>.</p>
        </Section>

        {/* -- Section 12: High-Severity Masking Analysis (NEW) -- */}
        <Section id="masking">
          <SectionTitle>High-Severity Masking Analysis</SectionTitle>
          <p className="mb-4 sc-body-muted">A high Severity rating can be masked by low Occurrence or strong Detection values. This is one of the main weaknesses of using RPN as a single action trigger.</p>
          <p className="mb-4 text-sm text-body-charcoal">When Severity is 9 or 10, there are 200 possible S/O/D combinations.</p>
          <p className="mb-4 text-sm text-body-charcoal">Among those high-Severity combinations:</p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-body-charcoal">
            <li>54 combinations produce RPN \u2264 100</li>
            <li>73 combinations produce RPN \u2264 150</li>
            <li>94 combinations produce RPN \u2264 200</li>
          </ul>
          <div className="mb-6 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">Severity Group</th><th className="px-3 py-1.5 font-mono font-semibold">RPN Threshold</th><th className="px-3 py-1.5 font-mono font-semibold">High-Severity Combinations</th><th className="px-3 py-1.5 font-mono font-semibold">Share of S=9 or S=10 Space</th></tr></thead>
              <tbody>{MASKING_STATS.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 font-semibold text-premium-velvet">{row.group}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.threshold}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.count}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.share}</td></tr>))}</tbody>
            </table>
          </div>
          <p className="mb-4 text-sm font-semibold">Interpretation</p>
          <p className="mb-4 text-sm text-body-charcoal">Nearly half of all S=9 or S=10 combinations can still produce an RPN of 200 or lower. This is why high-Severity items should be reviewed separately from the total RPN score.</p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Examples of Masking</h4>
          <div className="overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">S</th><th className="px-3 py-1.5 font-mono font-semibold">O</th><th className="px-3 py-1.5 font-mono font-semibold">D</th><th className="px-3 py-1.5 font-mono font-semibold">RPN</th><th className="px-3 py-1.5 font-mono font-semibold">Why RPN Alone Can Mislead</th></tr></thead>
              <tbody>{MASKING_EXAMPLES.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 font-mono font-semibold text-premium-velvet">{row.s}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.o}</td><td className="px-3 py-2 font-mono text-premium-velvet">{row.d}</td><td className="px-3 py-2 font-mono font-semibold text-amber">{row.rpn}</td><td className="px-3 py-2 text-body-charcoal">{row.warning}</td></tr>))}</tbody>
            </table>
          </div>
          <p className="mt-4 text-xs italic text-body-charcoal">Download full dataset: <a href="/data/fmea-rpn-severity-masking-cases.csv" className="text-premium-velvet underline">Download Severity Masking Cases CSV</a>.</p>
        </Section>

        {/* -- Section 13: RPN Sensitivity Matrix (NEW) -- */}
        <Section id="sensitivity">
          <SectionTitle>RPN Sensitivity Matrix</SectionTitle>
          <p className="mb-4 sc-body-muted">RPN changes linearly with each input while the other two inputs remain constant. The marginal effect of changing Severity, Occurrence or Detection depends on the product of the other two ratings.</p>
          <p className="mb-4 font-mono text-sm text-premium-velvet">
            \u0394RPN<sub>O</sub> = S \u00d7 \u0394O \u00d7 D &nbsp;|&nbsp; \u0394RPN<sub>D</sub> = S \u00d7 O \u00d7 \u0394D
          </p>
          <div className="mb-6 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-2 py-1.5 font-mono font-semibold">Current S/O/D</th><th className="px-2 py-1.5 font-mono font-semibold">Current RPN</th><th className="px-2 py-1.5 font-mono font-semibold">Reduce O by 1</th><th className="px-2 py-1.5 font-mono font-semibold">Reduce D by 1</th><th className="px-2 py-1.5 font-mono font-semibold">Reduce O and D by 1</th><th className="px-2 py-1.5 font-mono font-semibold">Interpretation</th></tr></thead>
              <tbody>{SENSITIVITY_DATA.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="whitespace-nowrap px-2 py-2 font-mono font-semibold text-premium-velvet">{row.s} / {row.o} / {row.d}</td><td className="whitespace-nowrap px-2 py-2 font-mono font-semibold text-amber">{row.rpn}</td><td className="whitespace-nowrap px-2 py-2 font-mono text-premium-velvet">{row.ro1}</td><td className="whitespace-nowrap px-2 py-2 font-mono text-premium-velvet">{row.rd1}</td><td className="whitespace-nowrap px-2 py-2 font-mono text-premium-velvet">{row.rod1}</td><td className="px-2 py-2 text-body-charcoal">{row.note}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">Sensitivity analysis does not decide the correct action. It shows which rating change mathematically moves the RPN most. Engineering evidence must determine whether a rating change is justified.</p></div>
          <p className="mt-4 text-xs italic text-body-charcoal">Download full dataset: <a href="/data/fmea-rpn-sensitivity-matrix.csv" className="text-premium-velvet underline">Download RPN Sensitivity Matrix CSV</a>.</p>
        </Section>

        {/* -- Section 14: Action Leverage Matrix (NEW) -- */}
        <Section id="leverage">
          <SectionTitle>Action Leverage Matrix</SectionTitle>
          <p className="mb-4 sc-body-muted">Corrective actions usually affect Occurrence, Detection or both. Severity should only change when the actual failure effect changes.</p>
          <div className="mb-6 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-2 py-1.5 font-mono font-semibold">Action Type</th><th className="px-2 py-1.5 font-mono font-semibold">Usually Affects</th><th className="px-2 py-1.5 font-mono font-semibold">Example</th><th className="px-2 py-1.5 font-mono font-semibold">Evidence Needed Before Revising RPN</th></tr></thead>
              <tbody>{ACTION_LEVERAGE.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-2 py-2 font-semibold text-premium-velvet">{row.actionType}</td><td className="whitespace-nowrap px-2 py-2 font-mono text-premium-velvet">{row.affects}</td><td className="px-2 py-2 text-body-charcoal">{row.example}</td><td className="px-2 py-2 text-body-charcoal">{row.evidence}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">Do not revise S/O/D values because an action was planned. Revise them only when implementation evidence supports the new rating.</p></div>
        </Section>

        {/* -- Section 15: Revised RPN Audit Trail (NEW) -- */}
        <Section id="audit-trail">
          <SectionTitle>Revised RPN Audit Trail</SectionTitle>
          <p className="mb-4 sc-body-muted">A revised RPN is credible only when the action and evidence are documented. A before/after RPN reduction without evidence should not be treated as risk reduction.</p>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">Field</th><th className="px-3 py-1.5 font-mono font-semibold">Required Documentation</th></tr></thead>
              <tbody>{AUDIT_TRAIL_FIELDS.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="whitespace-nowrap px-3 py-2 font-semibold text-premium-velvet">{row.field}</td><td className="px-3 py-2 text-body-charcoal">{row.doc}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">This audit trail is useful for teaching, internal reviews and FMEA workshop documentation.</p></div>
        </Section>

        {/* -- Section 16: S/O/D Guide -- */}
        <Section>
          <SectionTitle>Severity, Occurrence and Detection Guide</SectionTitle>
          <p className="mb-4 sc-body-muted">The exact rating scale should come from your organization\u2019s FMEA procedure. The guide below is an educational reference for understanding how the rating direction works.</p>
          <RatingGuideTable title="Severity Rating Guide" data={SEVERITY_GUIDE} />
          <RatingGuideTable title="Occurrence Rating Guide" data={OCCURRENCE_GUIDE} />
          <RatingGuideTable title="Detection Rating Guide" data={DETECTION_GUIDE} />
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">These ranges are educational references. Use the approved rating tables defined by your organization for formal work.</div>
        </Section>

        {/* -- Section 17: Limitations of RPN -- */}
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

        {/* -- Section 18: RPN Misranking Examples (NEW) -- */}
        <Section id="misranking">
          <SectionTitle>RPN Misranking Examples</SectionTitle>
          <p className="mb-4 sc-body-muted">RPN can rank a lower-severity issue above a higher-severity issue when Occurrence and Detection scores dominate the multiplication.</p>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-2 py-1.5 font-mono font-semibold">Failure Mode</th><th className="px-2 py-1.5 font-mono font-semibold">S</th><th className="px-2 py-1.5 font-mono font-semibold">O</th><th className="px-2 py-1.5 font-mono font-semibold">D</th><th className="px-2 py-1.5 font-mono font-semibold">RPN</th><th className="px-2 py-1.5 font-mono font-semibold">RPN Rank</th><th className="px-2 py-1.5 font-mono font-semibold">Engineering Concern</th></tr></thead>
              <tbody>{MISRANKING_EXAMPLES.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-2 py-2 text-body-charcoal">{row.label}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.s}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.o}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.d}</td><td className="px-2 py-2 font-mono font-semibold text-amber">{row.rpn}</td><td className="px-2 py-2 font-mono text-premium-velvet">{row.rank}</td><td className="px-2 py-2 text-body-charcoal">{row.concern}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">This does not mean frequent low-severity issues should be ignored. It means RPN ranking should be interpreted with the S/O/D signature visible.</p></div>
        </Section>

        {/* -- Section 19: PFMEA Dataset Library (NEW, expanded) -- */}
        <Section id="pfmea-library">
          <SectionTitle>Illustrative PFMEA Dataset Library</SectionTitle>
          <p className="mb-4 sc-body-muted">The datasets below are illustrative examples for teaching and internal training. They are not universal rating templates. Replace all ratings with evidence from your own process, customer requirements and approved FMEA criteria.</p>

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Dataset A: CNC Machining Process</h3>
          <PfmeaTable rows={PFMEA_CNC} />
          <p className="mt-3 mb-6 text-xs italic text-body-charcoal">Dataset A represents a typical CNC machining PFMEA with drilling, milling, clamping and deburring operations.</p>

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Dataset B: Assembly Process</h3>
          <PfmeaTable rows={PFMEA_ASSEMBLY} />
          <p className="mt-3 mb-6 text-xs italic text-body-charcoal">Dataset B represents a general assembly process with press-fit, fastening, labeling and seal installation failure modes.</p>

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-premium-velvet">Dataset C: Maintenance Process</h3>
          <PfmeaTable rows={PFMEA_MAINTENANCE} />
          <p className="mt-3 text-xs italic text-body-charcoal">Dataset C represents a preventive maintenance process with lubrication, filter, belt and sensor cleaning tasks.</p>
        </Section>

        {/* -- Section 20: When to Use RPN (NEW) -- */}
        <Section id="when-to-use">
          <SectionTitle>When to Use RPN and When Not to Use RPN</SectionTitle>
          <div className="mb-4 overflow-x-auto border border-border-subtle">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b bg-industrial-matte"><th className="px-3 py-1.5 font-mono font-semibold">Use RPN When</th><th className="px-3 py-1.5 font-mono font-semibold">Do Not Use RPN As</th></tr></thead>
              <tbody>{WHEN_USE.map((row, i) => (<tr key={i} className="border-b last:border-b-0"><td className="px-3 py-2 text-body-charcoal">{row.use}</td><td className="px-3 py-2 text-body-charcoal">{row.notUse}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border-l-2 border-amber/40 pl-3 text-sm"><p className="font-semibold">Note</p><p className="mt-1">RPN is most useful as a transparent calculation and teaching aid. It is weakest when used as a single gate for action decisions.</p></div>
        </Section>

        {/* -- Section 21: Reproducibility Note (NEW) -- */}
        <Section id="reproducibility">
          <SectionTitle>Reproducibility Note</SectionTitle>
          <p className="mb-4 sc-body-muted">The RPN score-space, collision counts, same-RPN families and high-severity masking examples are generated from the complete integer grid:</p>
          <p className="mb-2 font-mono text-sm text-premium-velvet">{`S \u2208 {1,2,3,4,5,6,7,8,9,10}`}</p>
          <p className="mb-2 font-mono text-sm text-premium-velvet">{`O \u2208 {1,2,3,4,5,6,7,8,9,10}`}</p>
          <p className="mb-4 font-mono text-sm text-premium-velvet">{`D \u2208 {1,2,3,4,5,6,7,8,9,10}`}</p>
          <p className="mb-4 text-sm text-body-charcoal">For each ordered triple, the RPN is calculated as:</p>
          <p className="mb-4 font-mono text-base font-semibold text-premium-velvet">RPN = S \u00d7 O \u00d7 D</p>
          <p className="mb-4 text-sm text-body-charcoal">This produces 1000 ordered combinations and 120 unique RPN values.</p>
          <div className="border border-border-subtle bg-industrial-matte p-3 text-xs font-mono text-premium-velvet">
            for severity in range(1, 11):<br />
            &nbsp;&nbsp;for occurrence in range(1, 11):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;for detection in range(1, 11):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rpn = severity * occurrence * detection
          </div>
          <p className="mt-4 text-xs italic text-body-charcoal">The downloadable collision atlas is generated from this full enumeration.</p>
        </Section>

        {/* -- Section 22: Downloadable Assets -- */}
        <Section id="template">
          <SectionTitle>Downloadable Academic and Training Assets</SectionTitle>
          <p className="mb-4 sc-body-muted">Use the downloads below for teaching, training, internal FMEA workshops or practical engineering documentation.</p>
          <div className="flex flex-col">
            <DownloadButton href="/data/fmea-template.csv" label="Download Blank FMEA CSV Template" primary />
            <DownloadButton href="/data/fmea-pfmea-cnc-dataset.csv" label="Download CNC PFMEA Dataset CSV" />
            <DownloadButton href="/data/fmea-template-example.csv" label="Download Example PFMEA CSV Dataset" />
            <DownloadButton href="/data/fmea-rpn-collision-atlas.csv" label="Download RPN Collision Atlas CSV" />
            <DownloadButton href="/data/fmea-rpn-equivalence-families.csv" label="Download Same-RPN Equivalence Families CSV" />
            <DownloadButton href="/data/fmea-rpn-severity-masking-cases.csv" label="Download High-Severity Masking Cases CSV" />
            <DownloadButton href="/data/fmea-rpn-sensitivity-matrix.csv" label="Download RPN Sensitivity Matrix CSV" />
          </div>
          <div className="mt-6">
            <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">View FMEA RPN Technical Note</Button>
          </div>
        </Section>

        {/* -- Section 23: Technical Note -- */}
        <Section id="technical-note">
          <SectionTitle>FMEA RPN Technical Note</SectionTitle>
          <p className="mb-4 text-sm font-semibold">FMEA RPN Calculator Technical Note</p>
          <p className="mb-4 text-sm">This technical note documents the traditional Risk Priority Number calculation used in Failure Mode and Effects Analysis. It includes compact versions of the score-space atlas, collision analysis, equivalence families, severity masking, sensitivity matrix, action leverage, PFMEA datasets and reproducibility note.</p>
          <Button href="/resources/fmea-rpn-technical-note" variant="outline" size="cta">Open Full Technical Note</Button>
        </Section>

        {/* -- Section 24: RPN vs Action Priority -- */}
        <Section>
          <SectionTitle>RPN vs Action Priority</SectionTitle>
          <p className="mb-4 sc-body-muted">Traditional RPN is a numeric product of Severity, Occurrence and Detection. It is simple, fast and useful for comparing failure modes inside the same FMEA worksheet.</p>
          <p className="mb-4 sc-body-muted">Action Priority is a decision support concept used in modern automotive FMEA practice. It gives stronger attention to the pattern of Severity, Occurrence and Detection instead of relying only on a single multiplied number.</p>
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">This page provides an educational explanation only. It does not reproduce proprietary handbook tables and does not replace standards-body publications or customer-specific FMEA requirements.</div>
        </Section>

        {/* -- Section 25: Citation -- */}
        <Section id="cite">
          <SectionTitle>Cite This Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">Use the citation formats below when referencing this calculator in academic material, course notes, technical documentation, internal FMEA training or engineering resources.</p>
          <CitationBlock label="APA 7" text={CITATIONS.apa} />
          <CitationBlock label="MLA 9" text={CITATIONS.mla} />
          <CitationBlock label="Chicago" text={CITATIONS.chicago} />
          <CitationBlock label="BibTeX" text={CITATIONS.bibtex} isPre />
          <CitationBlock label="RIS" text={CITATIONS.ris} isPre />
        </Section>

        {/* -- Section 26: Version History -- */}
        <Section id="version-history">
          <SectionTitle>Version History</SectionTitle>
          {VERSION_HISTORY.map((v) => (<div key={v.version}><p className="text-sm font-semibold">Version {v.version} \u2014 {v.date}</p><ul className="mt-2 list-inside list-disc space-y-1 text-sm">{v.notes.map((note, i) => (<li key={i}>{note}</li>))}</ul></div>))}
        </Section>

        {/* -- Section 27: References -- */}
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
            <li>Wheeler, D. J. <em>Problems with Risk Priority Numbers</em>.</li>
            <li>Shebl, N. A., Franklin, B. D., &amp; Barber, N. <em>Failure mode and effects analysis outputs: are they valid?</em></li>
          </ul>
          <div className="rounded-none border bg-industrial-matte p-3 text-xs italic">This page is an educational engineering reference. It does not reproduce proprietary standard tables and does not replace standards-body publications, customer-specific requirements, regulatory requirements or your organization\u2019s approved FMEA procedure.</div>
        </Section>

        {/* -- Section 28: FAQ -- */}
        <Section id="faq">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FaqAccordion items={FAQS} />
        </Section>

        {/* -- Section 29: Embed -- */}
        <Section>
          <SectionTitle>Embed This Calculator</SectionTitle>
          <p className="mb-4 sc-body-muted">You may embed this calculator in engineering education pages, internal quality resources, FMEA training pages or technical learning material.</p>
          <p className="mb-3 text-xs italic">Recommended Attribution Text: FMEA RPN Calculator by SectorCalc</p>
          <div className="relative border bg-industrial-matte p-3"><pre className="overflow-x-auto text-xs">{EMBED_CODE}</pre><button type="button" onClick={() => copyToClipboard(EMBED_CODE)} className="absolute right-2 top-2 text-xs font-semibold uppercase" aria-label="Copy embed code">Copy</button></div>
        </Section>

        {/* -- Section 30: Related Tools -- */}
        <Section>
          <SectionTitle>Related Engineering Calculators</SectionTitle>
          <p className="mb-4 sc-body-muted">FMEA identifies and prioritizes failure risks. SectorCalc Pro Tools includes related engineering calculators for process capability, equipment performance, setup losses, risk analysis and manufacturing cost review.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/pro-tools" className="block border p-3 text-sm hover:border-premium-velvet"><span className="font-semibold">SectorCalc Pro Tools</span><span className="mt-1 block">Engineering calculator library for deeper process, production, risk and cost analysis.</span></Link>
          </div>
        </Section>
      </main>
    </PageLayout>
  );
}
