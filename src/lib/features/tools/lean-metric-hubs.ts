/**
 * Lean Metric Authority Hubs — SSOT for RM-LEAN-001
 *
 * Five canonical hubs under /calculators/{metric}.
 * Legacy /lean/{framework}/{metric} spokes 301 here (see next.config.ts).
 */

export const LEAN_METRIC_HUB_SLUGS = [
  "takt-time",
  "oee",
  "scrap-rate",
  "cycle-time",
  "capacity-utilization",
] as const;

export type LeanMetricHubSlug = (typeof LEAN_METRIC_HUB_SLUGS)[number];

export type QuickDecisionRow = { question: string; answer: string };
export type BehaviorCard = { title: string; body: string };
export type ScenarioRow = {
  id: string;
  title: string;
  summary: string;
  inputRows: Array<{ label: string; value: string }>;
  outputLabel: string;
  outputValue: string;
  interpretation: string;
};
export type FaqItem = { q: string; a: string };
export type FrameworkContextNote = {
  framework: "PDCA" | "Gemba" | "A3" | "Muda";
  body: string;
};

export interface LeanMetricHubDefinition {
  slug: LeanMetricHubSlug;
  path: string;
  h1: string;
  eyebrow: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  definedTerm: string;
  definedTermDescription: string;
  formulaDisplay: string;
  formulaCaption: string;
  unit: string;
  worldClassTarget: string;
  freeToolPath: string | null;
  freeToolLabel: string | null;
  evidence: {
    sourceVerification: string;
    reference: string;
    declaredSpan: string;
  };
  quickDecision: QuickDecisionRow[];
  methodAssumptions: string[];
  behavior: BehaviorCard[];
  scenarios: ScenarioRow[];
  frameworkContext: FrameworkContextNote[];
  faqs: FaqItem[];
  howToSteps: Array<{ name: string; text: string }>;
  citations: {
    apa: string;
    mla: string;
    chicago: string;
    bibtex: string;
    ris: string;
  };
  isIsNot: Array<{ is: string; isNot: string }>;
}

function citationsFor(slug: LeanMetricHubSlug, title: string) {
  const url = `https://sectorcalc.com/calculators/${slug}`;
  return {
    apa: `SectorCalc. (2026). ${title}. SectorCalc. ${url}`,
    mla: `SectorCalc. "${title}." SectorCalc, 2026, ${url}.`,
    chicago: `SectorCalc. 2026. "${title}." SectorCalc. ${url}.`,
    bibtex: `@misc{sectorcalc_${slug.replace(/-/g, "_")}_2026,
  title = {${title}},
  author = {{SectorCalc}},
  year = {2026},
  publisher = {SectorCalc},
  url = {${url}},
  note = {Educational Lean manufacturing KPI reference}
}`,
    ris: `TY  - ELEC
TI  - ${title}
AU  - SectorCalc
PY  - 2026
PB  - SectorCalc
UR  - ${url}
ER  -`,
  };
}

export const LEAN_METRIC_HUBS: Record<LeanMetricHubSlug, LeanMetricHubDefinition> = {
  "takt-time": {
    slug: "takt-time",
    path: "/calculators/takt-time",
    h1: "Takt Time Calculator and Lean Line-Pacing Reference",
    eyebrow: "Lean Manufacturing KPI · ISO 22400-2 Context",
    lead:
      "Compute the customer-demand heartbeat of a production line: available production time divided by demand. Use takt time to expose under/over-capacity before you redesign work content or headcount.",
    metaTitle: "Takt Time Calculator and Lean Line-Pacing Reference",
    metaDescription:
      "Calculate takt time for Lean manufacturing lines. Includes methodology, behavior intelligence, industrial scenarios, ISO 22400-2 context, and citation formats.",
    definedTerm: "Takt Time",
    definedTermDescription:
      "The available production time divided by customer demand rate — the pace at which a process must complete units to meet demand.",
    formulaDisplay: "Takt Time = Available Production Time / Customer Demand",
    formulaCaption:
      "Available time is net production time for the study window (shift or day). Demand is the customer requirement for the same window. Result unit is time per unit.",
    unit: "min/unit",
    worldClassTarget: "Cycle time ≤ takt time with controlled buffer (typically 10–15% float)",
    freeToolPath: "/tools/free/takt-time-cycle-time",
    freeToolLabel: "Open Takt / Cycle Free Tool",
    evidence: {
      sourceVerification: "User-entered verified values only. Plant clocks and demand orders must be validated before use.",
      reference: "ISO 22400-2 manufacturing operations management KPIs; Lean Enterprise Institute takt pacing practice.",
      declaredSpan: "Available time > 0 min; demand ≥ 1 unit; takt time reported in minutes per unit.",
    },
    quickDecision: [
      { question: "What is takt time?", answer: "Net available production time divided by customer demand for the same period." },
      { question: "Primary formula", answer: "Takt = Available Production Time / Customer Demand" },
      { question: "Unit", answer: "Time per unit (typically minutes/unit or seconds/unit)" },
      { question: "When to use", answer: "Line balancing, demand-paced scheduling, and before adding capacity or overtime." },
      { question: "World-class signal", answer: "Sustainable cycle time at or below takt with explicit float — not chronic overtime." },
    ],
    methodAssumptions: [
      "Available time excludes unpaid breaks unless the plant clock already nets them.",
      "Demand is the firm customer requirement for the window — not theoretical maximum sales.",
      "No automatic changeover or scrap inflation is applied in the free screening model.",
      "Comparison to cycle time is interpretive; this calculator returns takt alone.",
    ],
    behavior: [
      {
        title: "Demand exceeds capacity",
        body: "If observed cycle time is persistently above takt, backlog grows. First response is work-content reduction or parallelization — not silent overtime as a permanent plan.",
      },
      {
        title: "Takt falls when demand rises",
        body: "Higher demand shortens takt. A line that looked balanced at 480 min / 200 units (2.4 min) becomes stressed at 240 units (2.0 min) without process change.",
      },
      {
        title: "Float is intentional",
        body: "World-class cells keep small float under takt to absorb variation. Zero float looks efficient until the first defect or material delay cascades.",
      },
      {
        title: "Wrong denominator hides the problem",
        body: "Using theoretical max capacity instead of customer demand produces a fake takt that never matches shipping reality.",
      },
    ],
    scenarios: [
      {
        id: "auto-assembly",
        title: "Automotive final assembly — day shift",
        summary: "Two-shift plant pacing a mixed-model line to firm daily orders.",
        inputRows: [
          { label: "Available production time", value: "450 min/day" },
          { label: "Customer demand", value: "225 units/day" },
        ],
        outputLabel: "Takt time",
        outputValue: "2.00 min/unit",
        interpretation: "Stations must complete work content within 2.00 minutes. Any station above 2.00 creates a bottleneck relative to demand.",
      },
      {
        id: "food-pack",
        title: "Food packaging — high-SKU day",
        summary: "Packaging cell with frequent changeovers; net available time already reduced.",
        inputRows: [
          { label: "Available production time", value: "360 min/day" },
          { label: "Customer demand", value: "1 800 packs/day" },
        ],
        outputLabel: "Takt time",
        outputValue: "0.20 min/pack (12 s)",
        interpretation: "At 12 seconds per pack, changeover losses dominate. Reduce SKU churn or batch intelligently before buying faster equipment.",
      },
      {
        id: "cnc-cell",
        title: "CNC cell — prototype + production mix",
        summary: "Shared machining cell serving production demand and rush prototypes.",
        inputRows: [
          { label: "Available production time", value: "480 min/shift" },
          { label: "Customer demand", value: "96 units/shift" },
        ],
        outputLabel: "Takt time",
        outputValue: "5.00 min/unit",
        interpretation: "If average cycle is 6.2 minutes, the cell cannot meet demand without overtime or offloading prototypes.",
      },
      {
        id: "low-demand",
        title: "Low-demand spare-parts cell",
        summary: "High available time relative to sparse firm orders.",
        inputRows: [
          { label: "Available production time", value: "480 min/day" },
          { label: "Customer demand", value: "40 units/day" },
        ],
        outputLabel: "Takt time",
        outputValue: "12.00 min/unit",
        interpretation: "Long takt does not justify inventing work. Pull scheduling and level-loading prevent overproduction muda.",
      },
    ],
    frameworkContext: [
      { framework: "PDCA", body: "Plan demand and available time; Do a timed run; Check takt vs cycle; Act by rebalancing work content." },
      { framework: "Gemba", body: "Confirm available time and demand at the line — do not trust office averages that ignore micro-stops." },
      { framework: "A3", body: "Use takt as the target condition on the A3 when the problem statement is missed shipments or chronic overtime." },
      { framework: "Muda", body: "Takt exposes overproduction and waiting: producing faster than takt builds inventory; slower than takt creates waiting." },
    ],
    faqs: [
      {
        q: "Is takt time the same as cycle time?",
        a: "No. Takt is demand pace. Cycle time is process pace. Lean balancing compares them; this hub calculates takt.",
      },
      {
        q: "Should breaks be included in available time?",
        a: "Use the same definition your plant clock uses. If breaks are unpaid and already excluded from available minutes, do not subtract them again.",
      },
      {
        q: "What if demand is seasonal?",
        a: "Recalculate takt per planning window. A single annual average takt hides peak-season capacity risk.",
      },
      {
        q: "Where is the live calculator?",
        a: "Use the embedded panel on this page or the combined free tool for takt and cycle time comparison.",
      },
    ],
    howToSteps: [
      { name: "Enter available production time", text: "Record net minutes available in the study window." },
      { name: "Enter customer demand", text: "Enter firm units required in the same window." },
      { name: "Calculate takt", text: "Divide available time by demand to obtain time per unit." },
      { name: "Compare to cycle time", text: "If cycle exceeds takt, prioritize work-content reduction before overtime." },
    ],
    citations: citationsFor("takt-time", "Takt Time Calculator and Lean Line-Pacing Reference"),
    isIsNot: [
      { is: "An educational demand-pacing reference for operations teams", isNot: "A regulatory certification method or ISO audit deliverable" },
      { is: "Aligned with ISO 22400-2 KPI thinking for manufacturing operations", isNot: "A substitute for plant-specific industrial engineering time studies" },
      { is: "A deterministic screening calculator with stated assumptions", isNot: "Financial, legal, or engineering advice" },
    ],
  },

  oee: {
    slug: "oee",
    path: "/calculators/oee",
    h1: "OEE Calculator and Overall Equipment Effectiveness Reference",
    eyebrow: "Lean Manufacturing KPI · ISO 22400-2 Context",
    lead:
      "Compute Overall Equipment Effectiveness as Availability × Performance × Quality. Use OEE to locate which loss pillar dominates before you spend on capacity, staffing, or quality programs.",
    metaTitle: "OEE Calculator and Overall Equipment Effectiveness Reference",
    metaDescription:
      "Calculate OEE from availability, performance, and quality. Includes loss-pillar intelligence, industrial scenarios, ISO 22400-2 context, and citation formats.",
    definedTerm: "Overall Equipment Effectiveness",
    definedTermDescription:
      "A manufacturing productivity KPI equal to Availability × Performance × Quality, expressing the fraction of planned production time that is truly productive.",
    formulaDisplay: "OEE = Availability × Performance × Quality",
    formulaCaption:
      "Each factor is entered as a percentage (0–100). The product is divided by 10 000 so OEE is reported as a percentage.",
    unit: "%",
    worldClassTarget: "World-class OEE ≈ 85% (Availability ~90%, Performance ~95%, Quality ~99%)",
    freeToolPath: "/tools/free/oee",
    freeToolLabel: "Open Full Free OEE Tool",
    evidence: {
      sourceVerification: "User-entered verified values only. Reference benchmarks are advisory and must not autofill plant data.",
      reference: "ISO 22400-2 manufacturing KPI definitions for equipment effectiveness; Lean Enterprise Institute flow/waste framing.",
      declaredSpan: "Availability, Performance, Quality each 0–100%; OEE result 0–100%; world-class target ≥ 85%.",
    },
    quickDecision: [
      { question: "What is OEE?", answer: "Availability × Performance × Quality — fraction of planned time that is fully productive." },
      { question: "Primary formula", answer: "OEE = A × P × Q (each as %; product scaled to %)" },
      { question: "Unit", answer: "Percent (%)" },
      { question: "When to use", answer: "Equipment loss diagnosis, shift reviews, and capital justification screening." },
      { question: "World-class target", answer: "Approximately 85% OEE with balanced A/P/Q — not one heroic factor." },
    ],
    methodAssumptions: [
      "Availability, Performance, and Quality are independently measured percentages for the same window.",
      "No automatic translation from raw downtime minutes is performed in this hub panel.",
      "World-class 85% is an industry benchmark signal, not a plant-specific pass/fail regulation.",
      "Hidden factory cost of each OEE point is interpretive and requires local contribution-margin data.",
    ],
    behavior: [
      {
        title: "Which pillar dominates the loss?",
        body: "Multiply pairwise: if Availability is 70% while P and Q are near 95%+, downtime is the bottleneck. Fixing quality first will barely move OEE.",
      },
      {
        title: "Each point below 85% has a cost shadow",
        body: "On a line with $10 000/hour planned productive value, each OEE point can imply roughly $100/hour of unrealized output — quantify with your own margin, never invent plant dollars.",
      },
      {
        title: "Quality collapses OEE last but hurts customers first",
        body: "A 90×95×80 OEE (~68%) looks like a quality crisis even when availability looks healthy. Scrap also consumes the capacity you thought you had.",
      },
      {
        title: "Performance without standards is fiction",
        body: "If ideal cycle time is padded, Performance > 100% appears. That inflation hides true loss and breaks ISO 22400-2 comparability.",
      },
    ],
    scenarios: [
      {
        id: "auto-press",
        title: "Automotive stamping press",
        summary: "High-volume press with die changes and scrap on first pieces.",
        inputRows: [
          { label: "Availability", value: "88%" },
          { label: "Performance", value: "92%" },
          { label: "Quality", value: "97%" },
        ],
        outputLabel: "OEE",
        outputValue: "78.5%",
        interpretation: "Below world-class 85%. Largest lever is Availability (changeover + micro-stops), then Performance.",
      },
      {
        id: "food-filler",
        title: "Food filling line",
        summary: "Hygienic filler with frequent CIP and occasional underfills.",
        inputRows: [
          { label: "Availability", value: "75%" },
          { label: "Performance", value: "96%" },
          { label: "Quality", value: "99%" },
        ],
        outputLabel: "OEE",
        outputValue: "71.3%",
        interpretation: "CIP and changeover dominate. SMED on sanitation windows beats buying a faster filler.",
      },
      {
        id: "cnc-cell-oee",
        title: "CNC machining cell",
        summary: "Mixed jobs with tool wear scrap and idle waiting for fixtures.",
        inputRows: [
          { label: "Availability", value: "82%" },
          { label: "Performance", value: "85%" },
          { label: "Quality", value: "94%" },
        ],
        outputLabel: "OEE",
        outputValue: "65.5%",
        interpretation: "All three pillars are soft. Sequence: fixture wait (A), feeds/speeds vs standard (P), tool-life scrap (Q).",
      },
      {
        id: "world-class",
        title: "World-class packaging cell",
        summary: "Stabilized cell used as an internal benchmark.",
        inputRows: [
          { label: "Availability", value: "90%" },
          { label: "Performance", value: "95%" },
          { label: "Quality", value: "99.5%" },
        ],
        outputLabel: "OEE",
        outputValue: "85.1%",
        interpretation: "Meets the classical world-class band. Protect standards; do not chase vanity OEE above sustainable process control.",
      },
    ],
    frameworkContext: [
      { framework: "PDCA", body: "Plan loss targets by pillar; Do a timed observation; Check OEE decomposition; Act on the dominant loss first." },
      { framework: "Gemba", body: "Walk the equipment to classify stops — office OEE without Gemba mislabels waiting as performance loss." },
      { framework: "A3", body: "Put OEE and the dominant pillar in the current-condition block of the A3 countermeasure sheet." },
      { framework: "Muda", body: "OEE losses map to muda: downtime → waiting; speed loss → overprocessing/underutilization; scrap → defects." },
    ],
    faqs: [
      {
        q: "What is a good OEE score?",
        a: "Many plants treat ~85% as world-class. Sector baselines often sit lower. Always decompose A/P/Q before celebrating a single number.",
      },
      {
        q: "Can Performance exceed 100%?",
        a: "Only if the ideal cycle standard is wrong. Treat >100% as a measurement defect, not a productivity win.",
      },
      {
        q: "How does this relate to the free OEE tool?",
        a: "This hub is the Lean authority reference. The free OEE tool provides the full input surface for the protected formula kernel.",
      },
      {
        q: "Does OEE replace financial ROI?",
        a: "No. OEE diagnoses operational loss. Monetize separately with contribution margin and capital tools such as NPV/ROI hubs.",
      },
    ],
    howToSteps: [
      { name: "Enter Availability", text: "Percent of planned production time the equipment was available to run." },
      { name: "Enter Performance", text: "Percent of ideal speed actually achieved while running." },
      { name: "Enter Quality", text: "Percent of units produced that meet specification first pass." },
      { name: "Review OEE and dominant loss", text: "Identify which factor pulls OEE below target and attack that pillar first." },
    ],
    citations: citationsFor("oee", "OEE Calculator and Overall Equipment Effectiveness Reference"),
    isIsNot: [
      { is: "An educational OEE screening and loss-diagnosis reference", isNot: "A certified OEE audit under a registrar scheme" },
      { is: "Consistent with ISO 22400-2 KPI framing for manufacturing operations", isNot: "A claim that SectorCalc operates as an accredited calibration laboratory" },
      { is: "A deterministic calculator with explicit method assumptions", isNot: "Financial or regulatory approval for capital projects" },
    ],
  },

  "scrap-rate": {
    slug: "scrap-rate",
    path: "/calculators/scrap-rate",
    h1: "Scrap Rate Calculator and Defect-Waste Reference",
    eyebrow: "Lean Manufacturing KPI · Muda / Quality Loss",
    lead:
      "Compute scrap rate as scrap units divided by total units produced. Use it to quantify defect muda before you monetize scrap cost or redesign process controls.",
    metaTitle: "Scrap Rate Calculator and Defect-Waste Reference",
    metaDescription:
      "Calculate scrap rate for Lean quality loss analysis. Includes methodology, industrial scenarios, standards context, and citation formats.",
    definedTerm: "Scrap Rate",
    definedTermDescription:
      "The percentage of produced units discarded as scrap — a direct measure of defect waste in manufacturing operations.",
    formulaDisplay: "Scrap Rate = (Scrap Units / Total Units) × 100",
    formulaCaption: "Both counts must cover the same production window and definition of a unit.",
    unit: "%",
    worldClassTarget: "Context-dependent; many precision cells target ≤ 1–2% while commodity lines may run higher with active reduction plans",
    freeToolPath: "/tools/free/scrap-cost",
    freeToolLabel: "Open Scrap Cost Free Tool",
    evidence: {
      sourceVerification: "User-entered verified production counts only. Do not substitute ERP estimates for counted scrap.",
      reference: "ISO 22400-2 quality-related KPI thinking; Lean Enterprise Institute defect-waste (muda) framing.",
      declaredSpan: "Scrap units ≥ 0; total units ≥ 1; scrap units ≤ total units; result 0–100%.",
    },
    quickDecision: [
      { question: "What is scrap rate?", answer: "Percentage of units produced that are discarded as scrap." },
      { question: "Primary formula", answer: "Scrap Rate = (Scrap Units / Total Units) × 100" },
      { question: "Unit", answer: "Percent (%)" },
      { question: "When to use", answer: "Quality huddles, supplier scorecards, and before scrap-cost monetization." },
      { question: "World-class signal", answer: "Stable low scrap with assignable-cause control — not a one-shift miracle." },
    ],
    methodAssumptions: [
      "Rework that returns to good stock is not counted as scrap unless your plant definition says otherwise.",
      "Total units is throughput in the window, not theoretical capacity.",
      "This hub reports rate only; dollar impact belongs to scrap-cost tooling.",
      "Mixed part numbers require either separate rates or a clearly weighted aggregate.",
    ],
    behavior: [
      {
        title: "Rate vs cost",
        body: "A 2% scrap rate on a high-value aerospace part can exceed a 8% rate on low-value packaging film. Always pair rate with unit cost before ranking projects.",
      },
      {
        title: "Hidden scrap in rework loops",
        body: "If scrap is counted only at final audit, in-process discards never appear. Gemba the scrap bins, not only the ERP scrap code.",
      },
      {
        title: "Denominator games",
        body: "Excluding start-up units from total production artificially lowers scrap rate. Declare the window rules in the audit log.",
      },
      {
        title: "Supplier vs process scrap",
        body: "Incoming material scrap and process-induced scrap need separate Pareto lanes or countermeasures will target the wrong owner.",
      },
    ],
    scenarios: [
      {
        id: "auto-weld",
        title: "Automotive weld cell",
        summary: "Robotic weld with porosity scrap on a high-runner SKU.",
        inputRows: [
          { label: "Scrap units", value: "48" },
          { label: "Total units", value: "2 400" },
        ],
        outputLabel: "Scrap rate",
        outputValue: "2.00%",
        interpretation: "Two percent is actionable. Split porosity vs fit-up causes before changing weld parameters globally.",
      },
      {
        id: "food-seal",
        title: "Food pouch sealing",
        summary: "Seal integrity rejects after a film lot change.",
        inputRows: [
          { label: "Scrap units", value: "320" },
          { label: "Total units", value: "10 000" },
        ],
        outputLabel: "Scrap rate",
        outputValue: "3.20%",
        interpretation: "Spike correlates with film lot. Quarantine lot and verify seal-jaw temperature before blaming operators.",
      },
      {
        id: "cnc-scrap",
        title: "CNC precision cell",
        summary: "Tight-tolerance machining with tool-wear scrap near end of life.",
        inputRows: [
          { label: "Scrap units", value: "12" },
          { label: "Total units", value: "800" },
        ],
        outputLabel: "Scrap rate",
        outputValue: "1.50%",
        interpretation: "Moderate rate but high unit cost. Tool-life policy and in-process gauging beat end-of-line scrap discovery.",
      },
      {
        id: "startup",
        title: "Line start-up after changeover",
        summary: "First-hour scrap dominates daily rate if averaged blindly.",
        inputRows: [
          { label: "Scrap units", value: "90" },
          { label: "Total units", value: "1 500" },
        ],
        outputLabel: "Scrap rate",
        outputValue: "6.00%",
        interpretation: "Separate start-up scrap from steady-state. SMED and first-article checks attack the 6% more than process capability tweaks.",
      },
    ],
    frameworkContext: [
      { framework: "PDCA", body: "Plan scrap targets by SKU; Do containment; Check rate trend; Act on root cause, not average." },
      { framework: "Gemba", body: "Observe scrap classification at the point of discard — codes entered later often lie." },
      { framework: "A3", body: "Place scrap rate in the gap statement when defect muda is the problem theme." },
      { framework: "Muda", body: "Scrap is the defects waste. It also creates waiting, motion, and excess processing downstream." },
    ],
    faqs: [
      {
        q: "Is scrap rate the same as scrap cost?",
        a: "No. Scrap rate is a percentage of units. Scrap cost monetizes those units. Use the scrap-cost free tool for dollars.",
      },
      {
        q: "Should rework count as scrap?",
        a: "Only if your quality system defines it as scrap. Otherwise track rework rate separately to avoid double-counting.",
      },
      {
        q: "What sample size is enough?",
        a: "Use a full shift or production order window. Tiny samples produce noisy rates that mislead PDCA.",
      },
      {
        q: "How does this relate to OEE Quality?",
        a: "OEE Quality is first-pass yield of good units. Scrap rate is the complementary defect fraction under a consistent unit definition.",
      },
    ],
    howToSteps: [
      { name: "Count scrap units", text: "Tally units discarded as scrap in the study window." },
      { name: "Count total units produced", text: "Use the same window and unit definition." },
      { name: "Calculate scrap rate", text: "Divide scrap by total and multiply by 100." },
      { name: "Pareto causes", text: "Split by defect mode before launching a single countermeasure." },
    ],
    citations: citationsFor("scrap-rate", "Scrap Rate Calculator and Defect-Waste Reference"),
    isIsNot: [
      { is: "An educational defect-waste rate reference for Lean quality work", isNot: "A product-safety certification or regulatory release method" },
      { is: "Complementary to scrap-cost monetization tools", isNot: "A full cost-accounting system" },
      { is: "A deterministic percentage calculator with declared assumptions", isNot: "Legal or warranty advice" },
    ],
  },

  "cycle-time": {
    slug: "cycle-time",
    path: "/calculators/cycle-time",
    h1: "Cycle Time Calculator and Process-Pace Reference",
    eyebrow: "Lean Manufacturing KPI · Flow / Kaizen",
    lead:
      "Compute average cycle time as total production time divided by units produced. Use it with takt time to see whether the process can meet demand without overtime or inventory buffers.",
    metaTitle: "Cycle Time Calculator and Process-Pace Reference",
    metaDescription:
      "Calculate manufacturing cycle time for Lean flow analysis. Includes methodology, takt comparison intelligence, scenarios, and citation formats.",
    definedTerm: "Cycle Time",
    definedTermDescription:
      "The average elapsed time to complete one unit through an operation or cell — total production time divided by units produced.",
    formulaDisplay: "Cycle Time = Total Production Time / Units Produced",
    formulaCaption: "Total production time is the observed run window for the counted units. Result is time per unit.",
    unit: "min/unit",
    worldClassTarget: "Cycle time ≤ takt time with stable variation (controlled sigma around the mean)",
    freeToolPath: "/tools/free/takt-time-cycle-time",
    freeToolLabel: "Open Takt / Cycle Free Tool",
    evidence: {
      sourceVerification: "User-entered timed observations only. Do not use scheduled standards as if they were measured cycle times.",
      reference: "ISO 22400-2 time-related KPI context; Lean Enterprise Institute flow and kaizen practice.",
      declaredSpan: "Total production time > 0; units produced ≥ 1; cycle time in minutes per unit.",
    },
    quickDecision: [
      { question: "What is cycle time?", answer: "Average time to produce one unit in the observed window." },
      { question: "Primary formula", answer: "Cycle Time = Total Production Time / Units Produced" },
      { question: "Unit", answer: "Time per unit (minutes/unit)" },
      { question: "When to use", answer: "Kaizen baselines, line balance, and takt comparison." },
      { question: "World-class signal", answer: "Mean cycle at or under takt with controlled variation — not heroic peaks." },
    ],
    methodAssumptions: [
      "Units counted are completed units, not partial WIP.",
      "Total time includes only the observed run window for those units.",
      "Batch processes require clear unit definition (piece vs batch).",
      "This hub returns average cycle; percentile analysis needs time-study tooling.",
    ],
    behavior: [
      {
        title: "Cycle vs takt",
        body: "If cycle > takt, demand is not met on average. If cycle ≪ takt, overproduction risk rises unless pull control is active.",
      },
      {
        title: "Average hides spikes",
        body: "A 4.0 min average with 9 min outliers still starves the downstream station. Pair averages with range or percentile checks at Gemba.",
      },
      {
        title: "Batch illusion",
        body: "Dividing batch process time by batch size can understate the customer wait for the first good unit. Declare whether you measure process cycle or customer lead.",
      },
      {
        title: "Improvement without demand",
        body: "Reducing cycle without adjusting staffing or pull rules can create local efficiency and global inventory muda.",
      },
    ],
    scenarios: [
      {
        id: "auto-station",
        title: "Automotive station balance",
        summary: "Manual station timed across a full hour of mixed models.",
        inputRows: [
          { label: "Total production time", value: "60 min" },
          { label: "Units produced", value: "24" },
        ],
        outputLabel: "Cycle time",
        outputValue: "2.50 min/unit",
        interpretation: "If takt is 2.00 min, this station is the bottleneck. Split work content or add parallel capacity.",
      },
      {
        id: "food-pack-ct",
        title: "Food packaging cell",
        summary: "End-of-line pack-out after a SKU change.",
        inputRows: [
          { label: "Total production time", value: "120 min" },
          { label: "Units produced", value: "900" },
        ],
        outputLabel: "Cycle time",
        outputValue: "0.133 min/unit (8 s)",
        interpretation: "Fast mean cycle; verify that changeover minutes were excluded from the 120 min run window.",
      },
      {
        id: "cnc-ct",
        title: "CNC operation",
        summary: "Single-machine cycle including load/unload.",
        inputRows: [
          { label: "Total production time", value: "480 min" },
          { label: "Units produced", value: "64" },
        ],
        outputLabel: "Cycle time",
        outputValue: "7.50 min/unit",
        interpretation: "Compare to programmed cut time. Large gap implies load/unload or waiting — classic Gemba targets.",
      },
      {
        id: "assembly-team",
        title: "Team assembly cell",
        summary: "Four-person cell producing assemblies as a unit.",
        inputRows: [
          { label: "Total production time", value: "240 min" },
          { label: "Units produced", value: "80" },
        ],
        outputLabel: "Cycle time",
        outputValue: "3.00 min/unit",
        interpretation: "Cell cycle is 3.00 min. Balance chart each person; the slowest person sets effective cycle under single-piece flow.",
      },
    ],
    frameworkContext: [
      { framework: "PDCA", body: "Plan a timed study; Do the observation; Check cycle vs takt; Act with standardized work updates." },
      { framework: "Gemba", body: "Time the real work at the station — engineered standards drift without observation." },
      { framework: "A3", body: "Use cycle time in the current-condition block when flow or balance is the problem theme." },
      { framework: "Muda", body: "Excess cycle often encodes waiting, motion, and overprocessing — map the time elements before buying automation." },
    ],
    faqs: [
      {
        q: "How is cycle time different from lead time?",
        a: "Cycle time is process pace per unit. Lead time is customer wait end-to-end, including queues and transports.",
      },
      {
        q: "Should I include changeover?",
        a: "For run-cycle studies, usually no. For customer lead-time studies, yes. Declare which definition you use.",
      },
      {
        q: "How do I compare to takt?",
        a: "Compute both for the same demand window. Cycle ≤ takt is the first-order capacity signal.",
      },
      {
        q: "Where can I run takt and cycle together?",
        a: "Use the combined free tool linked from this hub for side-by-side screening.",
      },
    ],
    howToSteps: [
      { name: "Measure total production time", text: "Record the observed run minutes for the study window." },
      { name: "Count units produced", text: "Count completed units in that same window." },
      { name: "Calculate cycle time", text: "Divide total time by units to get average time per unit." },
      { name: "Compare to takt", text: "If cycle exceeds takt, rebalance or reduce work content." },
    ],
    citations: citationsFor("cycle-time", "Cycle Time Calculator and Process-Pace Reference"),
    isIsNot: [
      { is: "An educational process-pace reference for Lean flow work", isNot: "A full MOST/MTM time-study certification package" },
      { is: "Designed to be compared with takt time on the same window", isNot: "A guarantee of on-time delivery by itself" },
      { is: "A deterministic average-cycle calculator", isNot: "Statistical process control software" },
    ],
  },

  "capacity-utilization": {
    slug: "capacity-utilization",
    path: "/calculators/capacity-utilization",
    h1: "Capacity Utilization Calculator and Hidden-Capacity Reference",
    eyebrow: "Lean Manufacturing KPI · Resource Effectiveness",
    lead:
      "Compute capacity utilization as actual output divided by maximum possible output. Use it to reveal hidden capacity before approving overtime, outsourcing, or capital expansion.",
    metaTitle: "Capacity Utilization Calculator and Hidden-Capacity Reference",
    metaDescription:
      "Calculate capacity utilization for Lean capacity decisions. Includes methodology, behavior intelligence, industrial scenarios, and citation formats.",
    definedTerm: "Capacity Utilization",
    definedTermDescription:
      "Actual output divided by maximum possible output for a resource in a stated window, expressed as a percentage.",
    formulaDisplay: "Capacity Utilization = (Actual Output / Maximum Output) × 100",
    formulaCaption: "Maximum output must use a declared standard (nameplate, demonstrated, or constrained). Actual output uses the same unit.",
    unit: "%",
    worldClassTarget: "Typically 75–85% sustainable utilization; chronically >90% often hides fragility and queues",
    freeToolPath: null,
    freeToolLabel: null,
    evidence: {
      sourceVerification: "User-entered verified output counts only. Declare whether maximum is nameplate, demonstrated, or bottleneck-constrained.",
      reference: "ISO 22400-2 resource utilization KPI thinking; Lean Enterprise Institute capacity and flow practice.",
      declaredSpan: "Actual output ≥ 0; maximum output ≥ 1; actual ≤ maximum for declared standard; result 0–100%.",
    },
    quickDecision: [
      { question: "What is capacity utilization?", answer: "Actual output as a percentage of declared maximum output." },
      { question: "Primary formula", answer: "Utilization = (Actual / Maximum) × 100" },
      { question: "Unit", answer: "Percent (%)" },
      { question: "When to use", answer: "Before overtime, outsourcing, or capex; after major mix changes." },
      { question: "World-class signal", answer: "Sustainable mid-high utilization with flow — not 100% that creates queues." },
    ],
    methodAssumptions: [
      "Maximum output definition is declared (nameplate vs demonstrated vs constrained).",
      "Actual and maximum use the same unit and window.",
      "No automatic OEE conversion is applied.",
      "Utilization alone does not prove profitability or on-time delivery.",
    ],
    behavior: [
      {
        title: "High utilization can be a trap",
        body: "Utilization above ~90% often correlates with long queues and missed takt. Lean prefers protective capacity on the constraint.",
      },
      {
        title: "Low utilization is not always waste",
        body: "A strategic spare cell at 40% may be correct if changeover risk or surge demand justifies it. Ask why capacity exists.",
      },
      {
        title: "Wrong maximum falsifies the metric",
        body: "Using nameplate when the true constraint is upstream material flow overstates available capacity and understates utilization.",
      },
      {
        title: "Mix shifts change maximum",
        body: "A harder mix lowers demonstrated maximum. Rebaseline before concluding the plant suddenly lost discipline.",
      },
    ],
    scenarios: [
      {
        id: "auto-paint",
        title: "Automotive paint shop",
        summary: "Booth limited by cure time and color changeovers.",
        inputRows: [
          { label: "Actual output", value: "180 units/shift" },
          { label: "Maximum output", value: "220 units/shift" },
        ],
        outputLabel: "Utilization",
        outputValue: "81.8%",
        interpretation: "Healthy band. Investigate whether maximum already nets color-change loss; if not, true utilization is higher.",
      },
      {
        id: "food-cook",
        title: "Food cook-kettle bank",
        summary: "Batch cook capacity with CIP between allergens.",
        inputRows: [
          { label: "Actual output", value: "12 batches/day" },
          { label: "Maximum output", value: "20 batches/day" },
        ],
        outputLabel: "Utilization",
        outputValue: "60.0%",
        interpretation: "Low utilization may be allergen sequencing, not demand. Schedule families before adding kettles.",
      },
      {
        id: "cnc-util",
        title: "CNC machine group",
        summary: "Five machines treated as a pooled resource.",
        inputRows: [
          { label: "Actual output", value: "410 units/day" },
          { label: "Maximum output", value: "500 units/day" },
        ],
        outputLabel: "Utilization",
        outputValue: "82.0%",
        interpretation: "Group looks fine; check the constraint machine alone — pooled averages hide a 98% hotspot.",
      },
      {
        id: "fragile",
        title: "Fragile high-utilization line",
        summary: "Chronic overtime with near-max demonstrated rates.",
        inputRows: [
          { label: "Actual output", value: "475 units/shift" },
          { label: "Maximum output", value: "480 units/shift" },
        ],
        outputLabel: "Utilization",
        outputValue: "99.0%",
        interpretation: "Fragile. Any quality escape or absenteeism misses demand. Create protective capacity or reduce demand peaks.",
      },
    ],
    frameworkContext: [
      { framework: "PDCA", body: "Plan the maximum definition; Do a measured window; Check utilization vs service level; Act on constraint policy." },
      { framework: "Gemba", body: "Confirm the real bottleneck — utilization on a non-constraint misguides investment." },
      { framework: "A3", body: "Use utilization in the current condition when the proposal is overtime or capex." },
      { framework: "Muda", body: "Both underutilization and overburden (muri) matter — Lean seeks flow, not 100% busyness." },
    ],
    faqs: [
      {
        q: "Is 100% utilization the goal?",
        a: "No. Near-100% utilization usually creates queues and fragility. Protect the constraint with intentional spare capacity.",
      },
      {
        q: "How is this different from OEE?",
        a: "OEE decomposes availability, performance, and quality losses on equipment. Utilization compares actual output to a declared maximum capacity.",
      },
      {
        q: "Nameplate or demonstrated maximum?",
        a: "Prefer demonstrated constrained maximum for decision-making. Nameplate is a ceiling, not a schedule promise.",
      },
      {
        q: "Is there a free tool twin?",
        a: "This hub is the canonical public calculator for capacity utilization. Related Lean metrics live under the /lean methodology hub.",
      },
    ],
    howToSteps: [
      { name: "Declare maximum output", text: "State whether maximum is nameplate, demonstrated, or constrained." },
      { name: "Enter actual output", text: "Count actual units (or batches) in the same window." },
      { name: "Calculate utilization", text: "Divide actual by maximum and multiply by 100." },
      { name: "Interpret with flow", text: "High utilization with missed takt means the system is fragile — add protective capacity or reduce demand peaks." },
    ],
    citations: citationsFor("capacity-utilization", "Capacity Utilization Calculator and Hidden-Capacity Reference"),
    isIsNot: [
      { is: "An educational capacity-screening reference for Lean operations", isNot: "A finite-capacity scheduling system" },
      { is: "Aligned with ISO 22400-2 resource utilization thinking", isNot: "Proof that overtime or capex is financially justified" },
      { is: "A deterministic percentage calculator with declared maximum rules", isNot: "Engineering or investment advice" },
    ],
  },
};

export function getLeanMetricHub(slug: string): LeanMetricHubDefinition | undefined {
  if ((LEAN_METRIC_HUB_SLUGS as readonly string[]).includes(slug)) {
    return LEAN_METRIC_HUBS[slug as LeanMetricHubSlug];
  }
  return undefined;
}

export function getLeanMetricCanonicalPath(metricSlug: string): string {
  return `/calculators/${metricSlug}`;
}

/** Next.js redirect rules: /lean/:concept/{metric} → /calculators/{metric} */
export function getLeanSpokeRedirectRules(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  return LEAN_METRIC_HUB_SLUGS.map((metric) => ({
    source: `/lean/:concept/${metric}`,
    destination: `/calculators/${metric}`,
    permanent: true,
  }));
}
