"use client";

import { useState, useCallback } from "react";
import { useScrollToResults } from "@/hooks/useScrollToResults";
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

export const fmeaReferenceLinks = {
  aiagVdaFmeaHandbookAiag: "https://www.aiag.org/training-and-resources/manuals/details/FMEAAV-1",
  aiagVdaFmeaHandbookVda: "https://webshop.vda.de/QMC/en/aiag-vda-fmea-handbook_eng",
  iec60812: "https://webstore.iec.ch/en/publication/26359",
  iso12100: "https://www.iso.org/standard/51528.html",
  asqFmea: "https://asq.org/quality-resources/fmea",
  wheelerRpn: "https://spcpress.com/pdf/DJW230.pdf",
  sheblFranklinBarber: "https://doi.org/10.1186/1472-6963-12-150",
  pubMedSheblFranklinBarber: "https://pubmed.ncbi.nlm.nih.gov/22682433/"
} as const;

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


const PFMEA_DATASET_D = [
  { processStep: "Weld post-weld heat treatment", failureMode: "Inadequate PWHT cycle", effect: "NDT rejection, delayed field installation, rework or pressure-boundary integrity concern", cause: "Incorrect soak time, uneven furnace temperature, wrong thermocouple placement or uncontrolled cooling", prevention: "Approved WPS/PQR, heat-treatment procedure, calibrated thermocouples, furnace qualification", detection: "Furnace chart review, NDT hold point, hardness verification where required", s: 10, o: 3, d: 5, initialRpn: 150, action: "Add thermocouple placement verification, require furnace chart sign-off and define cooling-rate acceptance check", rs: 10, ro: 2, rd: 3, revisedRpn: 60 },
  { processStep: "Composite autoclave cure", failureMode: "Insufficient cure degree or Tg margin", effect: "Part rejection, delamination risk, mechanical property loss or critical part release delay", cause: "Wrong cure recipe, vacuum leak, thermal lag, resin batch variation or sensor error", prevention: "Locked cure recipe, material batch control, vacuum integrity check, equipment calibration", detection: "Cure chart review, thermocouple monitoring, post-cure inspection, material test evidence", s: 10, o: 3, d: 6, initialRpn: 180, action: "Add recipe-lock control, require vacuum trend alarm and add mapped thermocouple verification for critical part runs", rs: 10, ro: 2, rd: 3, revisedRpn: 60 },
  { processStep: "Heat treatment quench", failureMode: "Incorrect quench severity or cooling profile", effect: "Hardness out of specification, distortion, cracking, microstructure mismatch or batch scrap", cause: "Quench media degradation, wrong transfer time, poor agitation, load geometry or temperature drift", prevention: "Furnace temperature control, transfer-time standard, quench media maintenance plan", detection: "Hardness testing, dimensional inspection, metallographic sampling where required", s: 8, o: 5, d: 5, initialRpn: 200, action: "Add quench media monitoring, transfer-time verification, agitation check and documented load configuration control", rs: 8, ro: 3, rd: 3, revisedRpn: 72 },
  { processStep: "Metal additive manufacturing powder reuse", failureMode: "Reused powder outside acceptable quality range", effect: "Porosity, poor mechanical properties, failed inspection or part rejection", cause: "Oxygen pickup, particle-size distribution drift, contamination or excessive reuse cycles", prevention: "Powder lot traceability, reuse-count limit, sieving procedure, storage control", detection: "Oxygen analysis, particle-size test, coupon testing, build inspection", s: 8, o: 4, d: 6, initialRpn: 192, action: "Add powder genealogy record, define reuse downgrade rule and require quality test before critical builds", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Concrete maturity and formwork release", failureMode: "Premature formwork stripping or early loading", effect: "Cracking, deflection, repair work, schedule delay or structural safety concern", cause: "Wrong maturity assumption, temperature variation, inadequate curing or insufficient field strength evidence", prevention: "Approved curing plan, maturity method setup, placement and curing records", detection: "Maturity sensor review, cylinder tests, engineer release hold point", s: 9, o: 3, d: 5, initialRpn: 135, action: "Require release checklist, link maturity data to acceptance criteria and document engineer approval before stripping or loading", rs: 9, ro: 2, rd: 3, revisedRpn: 54 },
  { processStep: "Grain silo storage", failureMode: "Undetected self-heating", effect: "Product loss, fire, ignition, insurance event or operational shutdown", cause: "Moisture variation, poor aeration, biological activity, delayed unloading or sensor blind spots", prevention: "Moisture control, aeration plan, storage rotation rule, housekeeping procedure", detection: "Temperature probes, inspection route, aeration log, alarm review", s: 10, o: 2, d: 7, initialRpn: 140, action: "Add temperature trend review, define aeration trigger and increase inspection frequency during high-risk storage conditions", rs: 10, ro: 1, rd: 4, revisedRpn: 40 },
];

const PFMEA_MAINTENANCE = [
  { processStep: "Lubrication task", failureMode: "Lubrication missed", effect: "Bearing wear or unplanned downtime", cause: "Manual schedule missed", prevention: "PM checklist", detection: "Operator noise/temperature observation", s: 7, o: 5, d: 6, initialRpn: 210, action: "Add CMMS reminder and lubrication confirmation record", rs: 7, ro: 3, rd: 4, revisedRpn: 84 },
  { processStep: "Filter replacement", failureMode: "Wrong filter installed", effect: "Reduced flow or equipment damage", cause: "Similar filter part numbers", prevention: "Parts list and maintenance instruction", detection: "Post-maintenance pressure check", s: 8, o: 3, d: 5, initialRpn: 120, action: "Add barcode verification and kitting control", rs: 8, ro: 2, rd: 3, revisedRpn: 48 },
  { processStep: "Belt tension check", failureMode: "Belt tension too low", effect: "Slip, heat, speed loss or stoppage", cause: "Subjective manual adjustment", prevention: "Maintenance standard", detection: "Visual inspection", s: 6, o: 5, d: 5, initialRpn: 150, action: "Add tension gauge and acceptance range", rs: 6, ro: 3, rd: 3, revisedRpn: 54 },
  { processStep: "Sensor cleaning", failureMode: "Sensor remains dirty", effect: "False readings or machine stop", cause: "Access difficulty or skipped task", prevention: "PM checklist", detection: "Alarm review", s: 5, o: 6, d: 5, initialRpn: 150, action: "Add access tool and photo confirmation", rs: 5, ro: 3, rd: 3, revisedRpn: 45 },
];

const FAQS = [
  { q: "Can this page be cited in an engineering report?", a: "Yes. This page can be cited in engineering reports when the citation target is educational RPN calculation, RPN behavior, RPN limitations, PFMEA training examples or downloadable datasets. It should not be cited as a standards-body method, regulatory approval rule or customer-specific FMEA procedure." },
  { q: "Does this page replace AIAG-VDA, IEC 60812, ISO 12100 or SAE J1739?", a: "No. This page does not replace AIAG-VDA, IEC 60812, ISO 12100, SAE J1739, customer-specific requirements or organization-approved FMEA procedures. It provides educational calculation examples, RPN behavior analysis and training datasets." },
  { q: "Why are external references listed if the calculator is original?", a: "The calculator, examples and datasets are original educational material. External references are listed to show the standards, industry, educational and academic context behind FMEA, FMECA, risk assessment and RPN limitation awareness." },
  { q: "Can the downloadable datasets be used for formal PFMEA submission?", a: "No. The downloadable datasets are training datasets. They can support learning, internal workshops and calculator reproducibility. Formal PFMEA submissions require organization-approved templates, actual process data, customer-specific requirements and authorized review." },

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
  version: "1.5", date: "2026-07-02",
  notes: [
    "Upgraded readability, accessibility and design preference based on engineering-grade aesthetic system.",
    "Added High-Consequence Industrial Process PFMEA Examples (Dataset D).",
    "Restructured calculator component to provide more prominent feedback for high-severity inputs.",
    "Replaced compressed reference list with individual Source Cards for citation transparency.",
  ],
}, {
  version: "1.4", date: "2026-07-02",
  notes: [
    "Upgraded the References and Standards Context section with full bibliographic metadata.",
    "Added source-type labels for standards, industry handbooks, educational resources, technical critiques and peer-reviewed literature.",
    "Added citation scope and limitation rules to clarify acceptable and non-acceptable citation use.",
    "Added dataset provenance and reproducibility notes for downloadable PFMEA training datasets.",
    "Added source-use policy to prevent confusion between educational calculator content and formal standards authority.",
    "Added FAQ items covering engineering report citation, standards replacement limits, external reference purpose and PFMEA dataset limitations."
  ],
}, {
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
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-reachability` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-prime` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-impossible` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-collision` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-equivalence` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-masking` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-sensitivity` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-assembly` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-maintenance` },
          { "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-d` },
        ] },
      { "@type": "SoftwareApplication", "@id": `${siteUrl}/calculators/fmea-rpn#softwareapplication`, name: "FMEA RPN Calculator", applicationCategory: "EngineeringApplication", operatingSystem: "Web", url: `${siteUrl}/calculators/fmea-rpn`, description: "Educational calculator for traditional FMEA Risk Priority Number scoring using Severity, Occurrence and Detection.", publisher: { "@id": `${siteUrl}/#organization` }, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "TechArticle", "@id": `${siteUrl}/calculators/fmea-rpn#techarticle`, headline: "FMEA RPN Calculator Methodology", about: ["Failure Mode and Effects Analysis", "Risk Priority Number", "Severity", "Occurrence", "Detection", "PFMEA", "Severity Masking", "RPN Collision"], publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "LearningResource", "@id": `${siteUrl}/calculators/fmea-rpn#learningresource`, name: "FMEA RPN Calculator and PFMEA Dataset Library", learningResourceType: "calculator", educationalUse: "engineering education", publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset`, name: "CNC PFMEA Example Dataset", description: "Illustrative PFMEA example table for CNC machining process with Severity, Occurrence, Detection and RPN values.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-reachability`, name: "RPN Reachability Dataset", description: "List of reachable and unreachable RPN scores between 1 and 1000.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-prime`, name: "Prime RPN Reachability Table", description: "Reachability analysis of prime numbers as FMEA RPN scores.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-impossible`, name: "Impossible RPN Values Dataset", description: "Summary counts of impossible RPN values categorized by range.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-collision`, name: "RPN Collision Atlas", description: "Complete enumeration of RPN collision counts for all 120 unique RPN values in a 1-10 S/O/D scoring system.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-equivalence`, name: "Same-RPN Equivalence Families", description: "Same-RPN equivalence families showing different S/O/D signatures producing identical RPN scores.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-masking`, name: "High-Severity Masking Cases", description: "Analysis of how many high-severity combinations produce low-to-moderate RPN scores.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-sensitivity`, name: "RPN Sensitivity Matrix", description: "Marginal RPN sensitivity table showing effect of changing O, D or both ratings.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-assembly`, name: "Assembly PFMEA Example Dataset", description: "Illustrative PFMEA example table for assembly process with four failure modes.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "Dataset", "@id": `${siteUrl}/calculators/fmea-rpn#dataset-pfmea-d`, name: "High-Consequence Industrial Process PFMEA Examples", description: "Illustrative PFMEA example table for high consequence industrial processes.", license: `${siteUrl}/terms`, publisher: { "@id": `${siteUrl}/#organization` } },
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
    <span className="inline-block rounded-none border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--sc-accent)]">{children}</span>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`border-b border-[var(--sc-border)] py-8 sm:py-10 sc-section ${className}`}>
      <Container size="narrow">{children}</Container>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 sc-h2 heading-serif">{children}</h2>;
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 sc-body-muted">{children}</p>;
}

function SkipLink() {
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-[var(--sc-accent)] focus:text-white focus-visible">
      Skip to main content
    </a>
  );
}

function PageToc() {
  return (
    <nav className="hidden lg:block lg:w-[280px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto border-r border-[var(--sc-border)] pr-6" aria-label="Table of Contents">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sc-text)] mb-4">Contents</h3>
      <ul className="space-y-3 text-sm text-[var(--sc-muted)]">
        <li><a href="#hero" className="hover:text-[var(--sc-accent)]">FMEA RPN Calculator</a></li>
        <li><a href="#quick-decision" className="hover:text-[var(--sc-accent)]">Quick Decision Summary</a></li>
        <li><a href="#choose-path" className="hover:text-[var(--sc-accent)]">Choose Your Path</a></li>
        <li><a href="#what-this-is" className="hover:text-[var(--sc-accent)]">What This Page Is</a></li>
        <li><a href="#citable" className="hover:text-[var(--sc-accent)]">Citation Authority</a></li>
        <li><a href="#methodology" className="hover:text-[var(--sc-accent)]">Calculation Methodology</a></li>
        <li><a href="#behavior" className="hover:text-[var(--sc-accent)]">RPN Behavior Intelligence</a></li>
        <li><a href="#datasets" className="hover:text-[var(--sc-accent)]">PFMEA Dataset Library</a></li>
        <li><a href="#source-integrity" className="hover:text-[var(--sc-accent)]">Source Integrity Layer</a></li>
        <li><a href="#faq" className="hover:text-[var(--sc-accent)]">FAQ</a></li>
        <li><a href="#related" className="hover:text-[var(--sc-accent)]">Related Calculators</a></li>
      </ul>
    </nav>
  );
}

function MobileJumpNav() {
  return (
    <nav className="lg:hidden flex overflow-x-auto gap-4 py-4 border-b border-[var(--sc-border)] mb-8" aria-label="Jump Navigation">
      <a href="#hero" className="shrink-0 text-sm font-semibold text-[var(--sc-muted)] hover:text-[var(--sc-accent)] focus-visible px-2 py-1 rounded">Calculator</a>
      <a href="#behavior" className="shrink-0 text-sm font-semibold text-[var(--sc-muted)] hover:text-[var(--sc-accent)] focus-visible px-2 py-1 rounded">Behavior</a>
      <a href="#datasets" className="shrink-0 text-sm font-semibold text-[var(--sc-muted)] hover:text-[var(--sc-accent)] focus-visible px-2 py-1 rounded">Datasets</a>
      <a href="#citation" className="shrink-0 text-sm font-semibold text-[var(--sc-muted)] hover:text-[var(--sc-accent)] focus-visible px-2 py-1 rounded">Citation</a>
      <a href="#faq" className="shrink-0 text-sm font-semibold text-[var(--sc-muted)] hover:text-[var(--sc-accent)] focus-visible px-2 py-1 rounded">FAQ</a>
    </nav>
  );
}

function SectionCard({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 lg:mb-24">
      {title && <h2 className="mb-8 text-2xl lg:text-3xl font-semibold text-[var(--sc-text)] font-heading heading-serif">{title}</h2>}
      {children}
    </section>
  );
}

function InsightStatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm mb-4">
      <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-2 font-heading heading-serif">{title}</h3>
      <p className="text-[var(--sc-muted)] text-sm md:text-base leading-relaxed">{children}</p>
    </div>
  );
}

function SourceReferenceCard({ title, detail, type, matters, usage, limit, tier, accessed }: any) {
  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 mb-4 rounded-sm shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--sc-text)] mb-4 font-heading heading-serif">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div><strong className="text-[var(--sc-text)]">Bibliographic detail:</strong> <span className="text-[var(--sc-muted)]">{detail}</span></div>
          <div><strong className="text-[var(--sc-text)]">Source type:</strong> <span className="text-[var(--sc-muted)]">{type}</span></div>
          <div><strong className="text-[var(--sc-text)]">Source tier:</strong> <span className="text-[var(--sc-muted)]">{tier}</span></div>
          <div><strong className="text-[var(--sc-text)]">Accessed date:</strong> <span className="text-[var(--sc-muted)]">{accessed}</span></div>
        </div>
        <div className="space-y-3">
          <div><strong className="text-[var(--sc-text)]">Why it matters:</strong> <span className="text-[var(--sc-muted)]">{matters}</span></div>
          <div><strong className="text-[var(--sc-text)]">Use on this page:</strong> <span className="text-[var(--sc-muted)]">{usage}</span></div>
          <div className="bg-[var(--sc-warning-bg)] border border-[var(--sc-warning)]/20 p-2 mt-2">
            <strong className="text-[var(--sc-warning)] block mb-1">Use limitation:</strong>
            <span className="text-[var(--sc-warning)]/80">{limit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessibleAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[var(--sc-border)] border-y border-[var(--sc-border)]">
      {items.map((faq, i) => (
        <div key={i}>
          <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-start justify-between gap-4 py-4 text-left font-semibold text-[var(--sc-text)] hover:text-[var(--sc-accent)] focus-visible min-h-[44px]" aria-expanded={openIndex === i} aria-controls={`faq-panel-${i}`}>
            <span>{faq.q}</span>
            <span className="shrink-0 font-mono text-sm text-[var(--sc-muted)]">{openIndex === i ? "\u2212" : "+"}</span>
          </button>
          <div id={`faq-panel-${i}`} role="region" className={`pb-4 text-[var(--sc-muted)] leading-relaxed ${openIndex === i ? 'block' : 'hidden'}`}>
            {faq.a}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResponsiveDataTable({ headers, rows, caption, instructions }: { headers: string[], rows: any[], caption: string, instructions?: string }) {
  return (
    <div className="mb-8">
      {instructions && <p className="mb-2 text-sm text-[var(--sc-muted)]">{instructions}</p>}
      <div className="table-scroll border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] shadow-sm">
        <table className="w-full text-left text-sm" aria-label={caption}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-[var(--sc-border)] bg-[var(--sc-surface)]">
              {headers.map((h, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-semibold text-[var(--sc-text)] whitespace-nowrap ${i === 0 ? 'lg:sticky lg:left-0 lg:bg-[var(--sc-surface)] lg:z-10' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sc-border)]">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--sc-surface)]/50 transition-colors">
                {Object.values(row).map((val: any, j: number) => (
                  <td key={j} className={`px-4 py-3 text-[var(--sc-muted)] ${typeof val === 'number' ? 'numeric' : ''} ${j === 0 ? 'lg:sticky lg:left-0 lg:bg-[var(--sc-surface-strong)] lg:z-10 font-medium text-[var(--sc-text)]' : ''}`}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="mt-4 border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-4 sm:p-6 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">RPN Reachability Checker</h3>
      <p className="mb-4 text-sm text-[var(--sc-muted)]">Enter a value between 1 and 1000 to see if it can be reached using a 1-10 S/O/D scoring system.</p>
      <div className="mb-4 flex gap-2">
        <input type="number" min="1" max="1000" placeholder="Enter RPN (1-1000)" value={testValue} onChange={(e) => setTestValue(e.target.value)} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-3 py-2 text-sm text-[var(--sc-text)] focus:outline-none focus:ring-1 focus:ring-[var(--sc-accent)] sm:w-64 min-h-[44px]" />
        <Button onClick={checkReachability} size="cta">Check</Button>
      </div>
      <div aria-live="polite">
        {result && (
          <div className="mt-4 border-t border-[var(--sc-border)] pt-4 text-sm text-[var(--sc-muted)]">
            {result.isReachable ? (
              <div>
                <p className="mb-2 font-semibold text-[var(--sc-success)]">Reachable!</p>
                <p>This RPN can be formed by {result.factors?.length} combination(s).</p>
              </div>
            ) : (
              <div>
                <p className="mb-2 font-semibold text-[var(--sc-warning)]">Not Reachable</p>
                <p>There is no valid integer combination of S, O, D (1-10) that multiplies to {testValue}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RpnCalculatorPanel() {
  const [severity, setSeverity] = useState(7);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(4);
  const [result, setResult] = useState<RpnResult | null>(null);
  useScrollToResults(result !== null, "fmea-results");
  
  const handleCalculate = useCallback(() => {
    setResult(calculateRpn(severity, occurrence, detection));
  }, [severity, occurrence, detection]);

  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm rounded-sm">
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="fmea-severity" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Severity (S)</label>
          <select id="fmea-severity" value={severity} onChange={(e) => setSeverity(Number(e.target.value))} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="fmea-occurrence" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Occurrence (O)</label>
          <select id="fmea-occurrence" value={occurrence} onChange={(e) => setOccurrence(Number(e.target.value))} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="fmea-detection" className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)]">Detection (D)</label>
          <select id="fmea-detection" value={detection} onChange={(e) => setDetection(Number(e.target.value))} className="w-full border border-[var(--sc-border)] bg-[var(--sc-surface)] px-4 py-3 text-base text-[var(--sc-text)] focus-visible min-h-[44px]">
            {ratingOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
      </div>
      <button type="button" onClick={handleCalculate} className="w-full sm:w-auto bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-8 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors focus-visible" aria-label="Calculate RPN">
        Calculate RPN
      </button>

      <div id="fmea-results" aria-live="polite" aria-atomic="true">
        {result && (
          <div className="mt-8 border-t border-[var(--sc-border)] pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2" id="rpn-result-label">Calculated RPN</p>
                <p className={`text-5xl lg:text-6xl font-bold mb-4 font-mono ${result.band === "high" ? "text-[var(--sc-warning)]" : "text-[var(--sc-text)]"}`} aria-labelledby="rpn-result-label">{result.rpn}</p>
                
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-1">Formula Trace</p>
                <p className="font-mono text-sm bg-[var(--sc-surface)] p-2 inline-block border border-[var(--sc-border)]">S &times; O &times; D = {result.severity} &times; {result.occurrence} &times; {result.detection} = {result.rpn}</p>
              </div>
              <div className="space-y-4 text-[var(--sc-muted)]">
                <div>
                  <strong className="text-[var(--sc-text)] block">Risk Signature</strong>
                  Severity {result.severity} / Occurrence {result.occurrence} / Detection {result.detection}
                </div>
                <div>
                  <strong className="text-[var(--sc-text)] block">Interpretation</strong>
                  Use this RPN to compare failure modes inside the same FMEA worksheet. Review Severity, Occurrence and Detection separately before assigning actions.
                </div>
                {result.severity >= 9 && (
                  <div className="bg-[var(--sc-warning-bg)] border-l-4 border-[var(--sc-warning)] p-3 text-[var(--sc-warning)] font-medium">
                    High-severity warning: This failure mode has high Severity. Review it separately even if the total RPN is not the highest value in the worksheet.
                  </div>
                )}
                {HIGH_COLLISION_RPNS.find(c => c.rpn === result.rpn) && (
                  <div className="bg-[var(--sc-danger-bg)] border-l-4 border-[var(--sc-danger)] p-3 text-[var(--sc-danger)] font-medium">
                    Collision warning: This RPN belongs to a high-collision family. ({HIGH_COLLISION_RPNS.find(c => c.rpn === result.rpn)?.risk})
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[var(--sc-border)]">
              <strong className="text-[var(--sc-text)] block mb-3 font-heading heading-serif text-lg">Documentation checklist</strong>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-[var(--sc-muted)] list-disc list-inside">
                <li>Failure mode</li><li>Failure effect</li><li>Failure cause</li>
                <li>Current prevention control</li><li>Current detection control</li><li>Initial S/O/D and RPN</li>
                <li>Recommended action</li><li>Action owner</li><li>Target date</li>
                <li>Verification evidence</li><li>Revised S/O/D and RPN</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyCitationButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mb-6">
      <p className="text-sm font-semibold text-[var(--sc-text)] mb-2 uppercase tracking-wider">{label}</p>
      <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-4 relative group">
        <pre className="text-sm font-mono text-[var(--sc-muted)] whitespace-pre-wrap">{text}</pre>
        <button type="button" onClick={handleCopy} className="absolute top-2 right-2 bg-[var(--sc-surface)] border border-[var(--sc-border)] px-3 py-1 text-xs font-semibold uppercase hover:bg-[var(--sc-accent-soft)] hover:text-[var(--sc-accent)] transition-colors focus-visible min-h-[44px] min-w-[44px]" aria-label={`Copy ${label} citation`}>
          {copied ? "Copied!" : "Copy"}
        </button>
        <div aria-live="polite" className="sr-only">{copied ? "Citation copied to clipboard" : ""}</div>
      </div>
    </div>
  );
}

function FormulaCard() {
  return (
    <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--sc-muted)] mb-2">Traditional RPN Formula</h3>
      <p className="text-2xl font-mono font-bold text-[var(--sc-text)] mb-6">RPN = Severity &times; Occurrence &times; Detection</p>
      <div className="text-sm text-[var(--sc-muted)] space-y-4">
        <p><strong>Note:</strong> Use the same approved rating criteria across all compared failure modes. Do not compare RPN values across different rating tables, products, organizations or customer-specific procedures.</p>
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--sc-success-bg)] p-3 border-l-4 border-[var(--sc-success)]">
            <strong className="text-[var(--sc-success)] block uppercase text-xs">Use</strong>
            <span className="text-[var(--sc-success)]/90">Compare failure modes inside the same FMEA worksheet.</span>
          </div>
          <div className="bg-[var(--sc-warning-bg)] p-3 border-l-4 border-[var(--sc-warning)]">
            <strong className="text-[var(--sc-warning)] block uppercase text-xs">Do not use</strong>
            <span className="text-[var(--sc-warning)]/90">As a universal safety threshold, regulatory approval rule or product release criterion.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export function FmeaRpnPageContent() {
  return (
    <PageLayout>
      <SemanticJsonLd data={buildFmeaJsonLd()} />
      <SkipLink />
      <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        <PageToc />
        
        <div className="flex-1 min-w-0">
          <MobileJumpNav />

          {/* 01. Hero + Trust Strip */}
          <section id="hero" className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <span className="inline-block bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] text-[var(--sc-text)] px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
                  Educational Engineering Reference
                </span>
                <h1 className="text-4xl lg:text-5xl font-heading heading-serif font-semibold text-[var(--sc-text)] leading-tight mb-6 max-w-[920px]">
                  FMEA RPN Calculator for Severity, Occurrence and Detection Scoring
                </h1>
                <p className="text-lg text-[var(--sc-muted)] mb-8 max-w-[760px] leading-relaxed">
                  Calculate traditional FMEA Risk Priority Number using Severity, Occurrence and Detection ratings from 1 to 10. This reference also explains RPN score-space behavior, unreachable RPN values, same-score collisions, high-severity masking and PFMEA training datasets.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <a href="#calculator" className="bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-muted)] transition-colors inline-flex items-center justify-center focus-visible">Calculate RPN</a>
                  <a href="#behavior" className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">View RPN Limitations</a>
                  <a href="#datasets" className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[44px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible">Download Datasets</a>
                </div>
                <div className="text-xs text-[var(--sc-muted)] flex flex-wrap gap-x-4 gap-y-2 uppercase tracking-wider font-semibold border-t border-[var(--sc-border)] pt-4">
                  <span>&bull; Formula traceable</span>
                  <span>&bull; Datasets downloadable</span>
                  <span>&bull; Citation-ready</span>
                  <span>&bull; Standards-context aware</span>
                  <span>&bull; Not a standards replacement</span>
                </div>
              </div>
              <div className="lg:sticky lg:top-24">
                <FormulaCard />
              </div>
            </div>
          </section>

          {/* 02. Calculator Workspace */}
          <SectionCard id="calculator">
            <RpnCalculatorPanel />
          </SectionCard>

          {/* 03. Quick Decision Summary */}
          <SectionCard id="quick-decision" title="Quick Decision Summary">
            <ResponsiveDataTable 
              caption="Quick decision summary for RPN"
              instructions="How to read this table: Summary of basic RPN concepts and their direct answers."
              headers={["Question", "Short Answer"]}
              rows={[
                { q: "What does RPN calculate?", a: "It multiplies Severity, Occurrence and Detection." },
                { q: "What is the formula?", a: "RPN = S × O × D" },
                { q: "What is the rating range?", a: "Each input normally uses an integer rating from 1 to 10." },
                { q: "What is the minimum RPN?", a: 1 },
                { q: "What is the maximum RPN?", a: 1000 },
                { q: "Can every number from 1 to 1000 occur?", a: "No. Only 120 unique RPN values are reachable under a 1–10 integer S/O/D system." },
                { q: "Can the same RPN hide different risks?", a: "Yes. Different S/O/D signatures can produce the same RPN." },
                { q: "Can a low RPN still contain high Severity?", a: "Yes. High Severity can be masked by low Occurrence or strong Detection." },
                { q: "Should RPN decide release or safety approval?", a: "No. Use approved engineering, customer-specific and regulatory criteria." },
              ]}
            />
          </SectionCard>

          {/* Choose Your Path */}
          <SectionCard id="choose-path" title="Choose Your Path">
            <ResponsiveDataTable 
              caption="Navigation guide for RPN topics"
              instructions="How to read this table: Find the task you need to complete and click the suggested section."
              headers={["If you need to...", "Start here"]}
              rows={[
                { if: "Calculate a single RPN value", then: <a href="#calculator" className="text-[var(--sc-accent)] underline focus-visible">Use the calculator</a> },
                { if: "Understand the formula", then: <a href="#methodology" className="text-[var(--sc-accent)] underline focus-visible">Read Calculation Methodology</a> },
                { if: "Check whether an RPN value is possible", then: <a href="#reachability-checker" className="text-[var(--sc-accent)] underline focus-visible">Use RPN Reachability Checker</a> },
                { if: "Understand why equal RPN values can differ", then: <a href="#behavior" className="text-[var(--sc-accent)] underline focus-visible">Read Same-RPN Equivalence Families</a> },
                { if: "Explain high-Severity masking", then: <a href="#behavior" className="text-[var(--sc-accent)] underline focus-visible">Read High-Severity Masking Analysis</a> },
                { if: "Teach PFMEA examples", then: <a href="#datasets" className="text-[var(--sc-accent)] underline focus-visible">Use PFMEA Dataset Library</a> },
                { if: "Cite the page in training or technical material", then: <a href="#citable" className="text-[var(--sc-accent)] underline focus-visible">Use Cite This Calculator</a> },
                { if: "Check source boundaries", then: <a href="#source-integrity" className="text-[var(--sc-accent)] underline focus-visible">Read References and Standards Context</a> },
              ]}
            />
          </SectionCard>

          {/* What This Page Is and Is Not */}
          <SectionCard id="what-this-is" title="What This Page Is and Is Not">
            <ResponsiveDataTable 
              caption="Page scope boundaries"
              instructions="How to read this table: Clarification of this page's educational scope versus formal authority."
              headers={["This page is", "This page is not"]}
              rows={[
                { is: "An educational RPN calculator", isNot: "A standards-body publication" },
                { is: "A reproducible RPN reference", isNot: "A regulatory approval method" },
                { is: "A PFMEA training dataset source", isNot: "A customer-specific FMEA procedure" },
                { is: "A citation-ready technical resource", isNot: "A product release rule" },
                { is: "A guide to RPN limitations", isNot: "A substitute for engineering judgment" },
              ]}
            />
          </SectionCard>
          
          {/* Why This Reference Is Citable */}
          <SectionCard id="citable" title="Why This Reference Is Citable">
            <p className="text-[var(--sc-muted)] mb-4 max-w-[760px]">
              This page is designed as a reproducible educational reference for traditional FMEA Risk Priority Number calculation.
              Unlike a basic calculator page, it includes:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-[var(--sc-muted)]">
              <li>the RPN formula and input assumptions</li>
              <li>a full score-space explanation for 1–10 S/O/D ratings</li>
              <li>RPN collision behavior</li>
              <li>same-score equivalence examples</li>
              <li>high-severity masking examples</li>
              <li>an illustrative PFMEA dataset library</li>
              <li>citation formats for academic and technical use</li>
            </ul>
            <div className="bg-[var(--sc-warning-bg)] border-l-4 border-[var(--sc-warning)] p-3 mt-4 text-sm text-[var(--sc-warning)]/90">
              <strong className="block uppercase text-xs text-[var(--sc-warning)] mb-1">Citation limitation</strong>
              This page should be cited as an educational engineering reference, not as a standards-body publication or substitute for organization-approved FMEA procedures.
            </div>
          </SectionCard>

          {/* 05. Calculation Methodology */}
          <SectionCard id="methodology" title="Calculation Methodology">
            <div className="space-y-4 text-[var(--sc-muted)] leading-relaxed max-w-[760px] mb-8">
              <p>The calculator applies direct multiplication of three validated integer inputs:</p>
              <p className="font-mono font-bold text-lg text-[var(--sc-text)]">RPN = S &times; O &times; D</p>
              <ul className="list-disc pl-5">
                <li><strong className="text-[var(--sc-text)]">S</strong> = Severity (1-10)</li>
                <li><strong className="text-[var(--sc-text)]">O</strong> = Occurrence (1-10)</li>
                <li><strong className="text-[var(--sc-text)]">D</strong> = Detection (1-10)</li>
              </ul>
              <p>Output Range: Minimum RPN is 1. Maximum RPN is 1000.</p>
              <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mt-8 mb-4">Method Assumptions</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Each input is an integer from 1 to 10.</li>
                <li>All compared failure modes use the same rating definitions.</li>
                <li>RPN is used as a relative prioritization score inside the same FMEA context.</li>
                <li>Revised RPN is calculated only after a defined engineering, design or process action changes Occurrence or Detection evidence.</li>
                <li>Severity should only be reduced when the actual effect of the failure has changed.</li>
                <li>RPN values from different organizations, products, processes or rating tables are not directly comparable.</li>
                <li>The method does not convert ordinal ratings into a physically measured risk value.</li>
              </ol>
            </div>
          </SectionCard>

          {/* 06. RPN Behavior Intelligence */}
          <SectionCard id="behavior" title="RPN Behavior Intelligence">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InsightStatCard title="Only 120 unique RPN values are reachable.">
                The 1–10 S/O/D grid creates 1000 input combinations, but only 120 unique RPN values. This makes RPN a sparse and non-uniform prioritization index.
              </InsightStatCard>
              <InsightStatCard title="880 numbers cannot occur.">
                Most numbers between 1 and 1000 are impossible RPN values under a traditional integer 1–10 rating system.
              </InsightStatCard>
              <InsightStatCard title="Same RPN does not mean same risk.">
                A high-Severity / low-Occurrence signature can produce the same RPN as a low-Severity / high-Detection-weakness signature.
              </InsightStatCard>
              <InsightStatCard title="High Severity can be masked.">
                Nearly half of S=9 or S=10 combinations can produce an RPN of 200 or lower.
              </InsightStatCard>
            </div>
            
            <div id="reachability-checker" className="mb-12">
              <ReachabilityChecker />
            </div>

            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4 mt-12">Same-RPN Equivalence Families</h3>
            <ResponsiveDataTable
              caption="Same-RPN Equivalence Families"
              instructions="How to read this table: Shows how different S/O/D ratings can produce the same RPN."
              headers={["RPN", "S", "O", "D", "Signature", "Why it matters"]}
              rows={EQUIVALENCE_FAMILIES.map(row => ({ rpn: row.rpn, s: row.s, o: row.o, d: row.d, sig: row.signature, why: row.why }))}
            />

            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4 mt-12">High-Severity Masking Analysis</h3>
            <ResponsiveDataTable
              caption="High-Severity Masking Analysis"
              instructions="How to read this table: Shows percentage of high-severity inputs that result in surprisingly low total RPNs."
              headers={["Severity Group", "Threshold", "Combination Count", "Share of Total S=9/10"]}
              rows={MASKING_STATS.map(row => ({ group: row.group, t: row.threshold, c: row.count, s: row.share }))}
            />
          </SectionCard>

          {/* 07. PFMEA Dataset Library */}
          <SectionCard id="datasets" title="PFMEA Dataset Library">
            <p className="text-[var(--sc-muted)] mb-8 max-w-[760px]">
              The examples below show how traditional FMEA RPN scoring can be applied to industrial processes. They are training examples only. They are not universal rating templates, release criteria, regulatory acceptance rules or substitutes for approved FMEA procedures.
            </p>

            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4">Dataset A: CNC Machining</h3>
            <ResponsiveDataTable
              caption="CNC Machining PFMEA Dataset"
              instructions="How to read this table: Illustrative PFMEA for CNC processes."
              headers={PFMEA_TABLE_HEADERS}
              rows={PFMEA_CNC}
            />
            
            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4">Dataset B: Assembly</h3>
            <ResponsiveDataTable
              caption="Assembly PFMEA Dataset"
              instructions="How to read this table: Illustrative PFMEA for assembly processes."
              headers={PFMEA_TABLE_HEADERS}
              rows={PFMEA_ASSEMBLY}
            />

            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4 mt-12">Dataset C: Maintenance</h3>
            <ResponsiveDataTable
              caption="Maintenance PFMEA Dataset"
              instructions="How to read this table: Illustrative PFMEA for maintenance processes."
              headers={PFMEA_TABLE_HEADERS}
              rows={PFMEA_MAINTENANCE}
            />

            <h3 className="text-xl font-heading heading-serif text-[var(--sc-text)] mb-4 mt-12">Dataset D: High-Consequence Industrial Process PFMEA Examples</h3>
            <p className="text-[var(--sc-muted)] mb-4 max-w-[760px]">
              Use these examples to understand how severe process consequences can be documented without treating total RPN as a standalone release decision.
            </p>
            <ResponsiveDataTable
              caption="High-Consequence PFMEA Dataset"
              instructions="How to read this table: Illustrative PFMEA for high consequence processes (weld, composite, quench, AM, concrete, silo)."
              headers={PFMEA_TABLE_HEADERS}
              rows={PFMEA_DATASET_D}
            />

            <div className="bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] p-6 shadow-sm mt-8">
              <h3 className="text-lg font-heading heading-serif text-[var(--sc-text)] mb-2">Dataset D Interpretation</h3>
              <div className="text-[var(--sc-muted)] text-sm space-y-3 leading-relaxed">
                <p>Dataset D shows why the individual S/O/D signature must remain visible.</p>
                <p>A moderate RPN can still contain a severe effect when Occurrence is low or Detection is strong. A high RPN can also represent recurring operational loss rather than a safety, regulatory or mission-critical consequence.</p>
                <p>The engineering meaning is not contained in the RPN value alone. It is contained in the full failure chain:<br/>
                <code className="bg-[var(--sc-surface)] border border-[var(--sc-border)] px-2 py-1 mt-2 mb-2 inline-block font-mono font-semibold">Failure mode &rarr; Effect &rarr; Cause &rarr; Current controls &rarr; S/O/D signature &rarr; Recommended action &rarr; Evidence &rarr; Revised S/O/D</code></p>
                <p>Do not reduce Severity unless the actual failure effect has changed. Most process actions reduce Occurrence, Detection or both. Revised RPN should be accepted only when implementation evidence supports the revised rating.</p>
              </div>
            </div>
          </SectionCard>

          {/* 08. Citation Authority Layer */}
          <SectionCard id="citation" title="Cite This Calculator">
            <p className="text-[var(--sc-muted)] mb-6 max-w-[760px]">
              This page can be cited in engineering reports when the citation target is educational RPN calculation, RPN behavior, RPN limitations, PFMEA training examples or downloadable datasets.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <CopyCitationButton label="APA" text={CITATIONS.apa} />
                <CopyCitationButton label="MLA" text={CITATIONS.mla} />
                <CopyCitationButton label="Chicago" text={CITATIONS.chicago} />
              </div>
              <div>
                <CopyCitationButton label="BibTeX" text={CITATIONS.bibtex} />
                <CopyCitationButton label="RIS" text={CITATIONS.ris} />
              </div>
            </div>
          </SectionCard>

          {/* 09. Source Integrity Layer */}
          <SectionCard id="source-integrity" title="References and Standards Context">
            <p className="text-[var(--sc-muted)] mb-8 max-w-[760px]">
              The following sources provide the standards, handbook, educational, technical and academic context for FMEA, FMECA, risk assessment and RPN limitations. This page does not reproduce proprietary tables, replace original standards or define formal compliance requirements.
            </p>
            
            <div className="space-y-6">
              <SourceReferenceCard 
                title="AIAG & VDA FMEA Handbook"
                detail="AIAG & VDA. Failure Mode and Effects Analysis FMEA Handbook. First Edition. Automotive Industry Action Group and Verband der Automobilindustrie, June 2019. ISBN: 978-1-60534-367-9."
                type="Industry handbook"
                tier="Industry authority"
                accessed="2026-07-02"
                matters="Provides modern automotive FMEA context for Design FMEA, Process FMEA and Supplemental FMEA for Monitoring and System Response."
                usage="Industry context only."
                limit="Proprietary rating tables, Action Priority tables and handbook content are not reproduced."
              />
              <SourceReferenceCard 
                title="IEC 60812:2018"
                detail="International Electrotechnical Commission. IEC 60812:2018 - Failure Modes and Effects Analysis: FMEA and FMECA. Edition 3.0. Published 2018-08-10."
                type="International standard"
                tier="Standards body"
                accessed="2026-07-02"
                matters="Provides methodology context for planning, performing, documenting and maintaining FMEA and FMECA."
                usage="Standards context only."
                limit="Users must consult the official IEC standard for formal work."
              />
              <SourceReferenceCard 
                title="ISO 12100:2010"
                detail="International Organization for Standardization. ISO 12100:2010 - Safety of Machinery - General Principles for Design - Risk Assessment and Risk Reduction. Edition 1. Published 2010-11. Reviewed and confirmed in 2022."
                type="International standard"
                tier="Standards body"
                accessed="2026-07-02"
                matters="Provides machinery risk assessment and risk reduction context."
                usage="Risk-assessment context only."
                limit="This calculator does not replace ISO 12100 risk assessment or risk reduction requirements."
              />
              <SourceReferenceCard 
                title="ASQ FMEA Educational Resources"
                detail="American Society for Quality. Failure Mode and Effects Analysis resources."
                type="Educational quality resource"
                tier="Professional association"
                accessed="2026-07-02"
                matters="Provides general FMEA education, terminology and preventive quality context."
                usage="Educational context for readers learning FMEA fundamentals."
                limit="Not a replacement for standards, handbooks, customer-specific requirements or internal procedures."
              />
              <SourceReferenceCard 
                title="Wheeler, Donald J."
                detail="Wheeler, D. J. Problems with Risk Priority Numbers: Avoiding More Numerical Jabberwocky. Quality Digest / SPC Press, July 2011."
                type="Technical critique"
                tier="Technical critique"
                accessed="2026-07-02"
                matters="Explains mathematical and interpretive weaknesses of using RPN values as simple ranking numbers."
                usage="RPN limitation context."
                limit="Used to support the caution against total-RPN-only decision rules."
              />
              <SourceReferenceCard 
                title="Shebl, Franklin and Barber"
                detail="Shebl, N. A., Franklin, B. D., & Barber, N. Failure Mode and Effects Analysis Outputs: Are They Valid? BMC Health Services Research, 12, Article 150, 2012. DOI: 10.1186/1472-6963-12-150."
                type="Peer-reviewed article"
                tier="Peer-reviewed"
                accessed="2026-07-02"
                matters="Examines the validity of FMEA outputs and highlights limitations in FMEA team outputs."
                usage="Academic critique context."
                limit="Used to support cautious interpretation of FMEA outputs, not to define manufacturing-specific rating criteria."
              />
            </div>
          </SectionCard>

          {/* 10. FAQ */}
          <SectionCard id="faq" title="Frequently Asked Questions">
            <AccessibleAccordion items={FAQS} />
          </SectionCard>

          {/* 12. Related Engineering Calculators */}
          <SectionCard id="related" title="Related Engineering Calculators">
            <p className="text-[var(--sc-muted)] mb-4 max-w-[760px]">
              FMEA identifies and prioritizes failure modes. For operational decisions where the next action is costly, difficult or impossible to reverse, use a decision-specific engineering calculator.
            </p>
            <p className="text-[var(--sc-muted)] mb-4 font-semibold max-w-[760px]">
              Traditional RPN helps answer: Which failure modes should be reviewed first inside this FMEA worksheet?
            </p>
            <p className="text-[var(--sc-muted)] mb-8 font-semibold max-w-[760px]">
              Advanced decision calculators help answer: Should we release, rework, scrap, ship, defer, replace, lock the process or commit capacity now?
            </p>
            <ResponsiveDataTable 
              caption="Related decision calculators"
              instructions="How to read this table: Matches FMEA decision areas to more specific engineering calculators."
              headers={["Decision Area", "Example Decision", "Related Calculator Direction"]}
              rows={[
                { area: "Weld fabrication", decision: "Approve PWHT / rework / hold", calc: "PWHT adequacy margin" },
                { area: "Composite manufacturing", decision: "Release cured part / hold / scrap", calc: "Cure degree and Tg margin" },
                { area: "Heat treatment", decision: "Release batch / reprocess / scrap", calc: "Quench hardness and microstructure risk" },
                { area: "Additive manufacturing", decision: "Reuse / downgrade / scrap powder", calc: "Metal AM powder reuse risk" },
                { area: "Concrete construction", decision: "Strip formwork / wait / load", calc: "Concrete maturity and strength margin" },
                { area: "Grain storage", decision: "Aerate / unload / wait", calc: "Silo self-heating and ignition risk" },
                { area: "LNG storage", decision: "Vent / hold / ship", calc: "Boil-off and tank pressure margin" },
                { area: "Battery manufacturing", decision: "Ramp capacity / hold / investigate", calc: "Formation yield and scrap ramp" },
              ]}
            />
          </SectionCard>
          
        </div>
      </main>
    </PageLayout>
  );
}
