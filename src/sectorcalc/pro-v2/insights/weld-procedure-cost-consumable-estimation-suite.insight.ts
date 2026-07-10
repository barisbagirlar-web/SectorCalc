// SectorCalc PRO V2 — Weld Insight Report
// Tool-specific insight builder for weld cost estimation.
// COMPUTED: server outputs, RULE_DERIVED: documented thresholds, ASSUMPTION: declared assumptions.

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

const MATERIAL_LABELS: Record<string, string> = {
  carbon_steel: "Carbon steel", stainless_steel: "Stainless steel", aluminum: "Aluminum",
};

function resolvedDisplayValue(key: string, val: { value: string; unit: string }): string {
  if (key === "material" && val.value in MATERIAL_LABELS) return MATERIAL_LABELS[val.value];
  return val.value;
}

const INTERNAL_DIAG_IDS = [
  "schema_hash_mismatch", "client_schema_hash", "derating_config", "derating_",
  "trigger_inputs", "missing_trigger_inputs", "bounds_", "refrange_",
  "sens_warn", "formula_module", "formula_engine", "warn_blocked",
];

export function buildWeldReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const wireCostVal = outputs.out_demand_metric ?? 0;
  const wireMassGrams = outputs.out_capacity_metric ?? 0;
  const wireMassKg = wireMassGrams / 1000;
  const serverTotalVal = outputs.out_utilization_margin ?? outputs.out_money_at_risk ?? 0;

  // ── Cost components from engine inputs ──────────────────────────────
  const gasCostVal = (engineInputs.gas_cost ?? 0) * (engineInputs.arc_time ?? 0);
  const jobTimeH = (engineInputs.total_job_time ?? 0) / 60;
  const laborCostVal = jobTimeH > 0 ? (engineInputs.labor_rate ?? 0) * jobTimeH : 0;
  const overheadVal = jobTimeH > 0 ? (engineInputs.shop_overhead_rate ?? 0) * jobTimeH : 0;
  const depEff = engineInputs.deposition_efficiency ?? 85;
  const contingencyPct = engineInputs.contingency ?? 0;
  const plannedQuoteVal = engineInputs.planned_quote ?? 0;

  const baseCostVal = wireCostVal + gasCostVal + laborCostVal + overheadVal;
  const contingencyAmt = contingencyPct > 0 ? baseCostVal * (contingencyPct / 100) : 0;
  const displayTotalCost = baseCostVal + contingencyAmt;

  // ── Cost per meter ──────────────────────────────────────────────────
  const weldLenM = (engineInputs.weld_length ?? 0) / 1000;
  const baseCostPerMeter = weldLenM > 0 ? baseCostVal / weldLenM : 0;
  const totalFloorPerMeter = weldLenM > 0 ? displayTotalCost / weldLenM : 0;

  // ── Margin ──────────────────────────────────────────────────────────
  const marginAmt = plannedQuoteVal > 0 ? plannedQuoteVal - displayTotalCost : 0;
  const marginPct = plannedQuoteVal > 0 ? (marginAmt / plannedQuoteVal) * 100 : 0;

  // ── Key cost driver ─────────────────────────────────────────────────
  const costComponents: Array<{ label: string; val: number }> = [
    { label: "Wire", val: wireCostVal }, { label: "Gas", val: gasCostVal },
    { label: "Labor", val: laborCostVal }, { label: "Overhead", val: overheadVal },
  ];
  const sorted = [...costComponents].sort((a, b) => b.val - a.val);
  const keyCostDriver = sorted.length > 0 && sorted[0].val > 0 ? sorted[0].label : "N/A";

  // ── Wire cost sanity guard ──────────────────────────────────────────
  const weldLengthVal = engineInputs.weld_length ?? 0;
  const weldThroatVal = engineInputs.weld_throat ?? 0;
  const wireCostInputVal = engineInputs.wire_cost ?? 0;
  const wireNearZero = wireCostVal <= 0.05 && weldLengthVal > 1000 && weldThroatVal >= 1 && wireCostInputVal > 0;
  const wireSanityWarning = wireNearZero
    ? [{ id: "wire_cost_sanity", severity: "WARNING" as const, message: "Wire cost appears too low for the provided weld geometry. Check output mapping." }]
    : [];

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Total Cost Floor (with contingency)",
    value: currency(displayTotalCost), unit: "USD",
    severity: marginPct >= 20 ? "OK" : marginPct >= 5 ? "WARNING" : "CRITICAL",
    explanation: `Base production cost ${currency(baseCostVal)} + contingency ${currency(contingencyAmt)}. Based on ${Object.keys(displayInputs).length} input parameters.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (marginPct >= 20) {
    decisionState = { state: "PROFITABLE", label: "Profitable", summary: `Margin ${fmt(marginPct)}% indicates a healthy profit on this quote (total cost floor ${currency(displayTotalCost)}).` };
  } else if (marginPct >= 5) {
    decisionState = { state: "AT_RISK", label: "At Risk", summary: `Thin margin of ${fmt(marginPct)}% (total cost floor ${currency(displayTotalCost)}). Review costs and consider optimization.` };
  } else if (marginPct > 0) {
    decisionState = { state: "REVIEW", label: "Review Required", summary: `Very low margin (${fmt(marginPct)}%). Risk of loss after unforeseen costs.` };
  } else {
    decisionState = { state: "LOSS", label: "Loss Position", summary: `Estimated cost floor ${currency(displayTotalCost)} exceeds planned quote by ${currency(Math.abs(marginAmt))}. Do not proceed without revision.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation = `This weld procedure has a total cost floor of ${currency(displayTotalCost)} (base production ${currency(baseCostVal)} + contingency ${currency(contingencyAmt)}). The total cost floor per meter is ${currency(totalFloorPerMeter)} (base cost per meter ${currency(baseCostPerMeter)}). ${plannedQuoteVal > 0 ? `With a planned quote of ${currency(plannedQuoteVal)}, the projected margin is ${fmt(marginPct)}% (${currency(marginAmt)}).` : "No planned quote entered — cost estimate is informational only."} The primary cost driver is ${keyCostDriver}.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = displayTotalCost > 0 ? displayTotalCost : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Wire / Electrode", amount: wireCostVal, percentage: (wireCostVal / totalForPct) * 100 },
    { category: "Shielding Gas", amount: gasCostVal, percentage: (gasCostVal / totalForPct) * 100 },
    { category: "Labor", amount: laborCostVal, percentage: (laborCostVal / totalForPct) * 100 },
    { category: "Shop Overhead", amount: overheadVal, percentage: (overheadVal / totalForPct) * 100 },
    { category: "Contingency Allowance", amount: contingencyAmt, percentage: (contingencyAmt / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Base Production Cost", value: currency(baseCostVal), unit: "USD", formula_ref: "Sum of all cost components" },
    { label: "Contingency Amount", value: currency(contingencyAmt), unit: "USD", formula_ref: `${fmt(contingencyPct)}% of base cost` },
    { label: "Base Cost per Meter", value: currency(baseCostPerMeter), unit: "USD/m", formula_ref: "Base Production Cost ÷ Weld Length" },
    { label: "Total Cost Floor per Meter", value: currency(totalFloorPerMeter), unit: "USD/m", formula_ref: "Total Cost Floor ÷ Weld Length" },
    { label: "Wire Mass Required", value: `${fmt(wireMassKg)} kg`, unit: "kg", formula_ref: "Weld Volume × Density" },
    { label: "Labor Cost", value: currency(laborCostVal), unit: "USD", formula_ref: "Labor Rate × Job Time" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Setup & Fit-Up Time", description: "Time spent on joint preparation, clamping, and positioning is often excluded from arc time estimates.", potential_impact: currency(displayTotalCost * 0.08), severity: "MEDIUM" },
    { title: "Post-Weld Inspection", description: "NDT inspection, visual check, and dimensional verification costs are frequently omitted.", potential_impact: currency(displayTotalCost * 0.05), severity: "LOW" },
    { title: "Rework Allowance", description: "Industry average rework rate is 2-5% of weld cost. Grinding, re-welding, and re-inspection add significant cost.", potential_impact: currency(displayTotalCost * 0.04), severity: "MEDIUM" },
    { title: "Gas Waste", description: "Shielding gas waste from purge, pre-flow, post-flow, and leaks can add 10-20% to gas consumption.", potential_impact: currency(gasCostVal * 0.15), severity: "HIGH" },
    { title: "Wire Stub Loss", description: "Unusable electrode stubs and wire offcuts typically add 5-10% to wire consumption.", potential_impact: currency(wireCostVal * 0.07), severity: "LOW" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Setup/Fit-Up Not Included", description: "Setup time is a real cost that may not be captured in arc time or total job time estimates.", impact_on_result: `Could add ${currency(displayTotalCost * 0.10)} to total cost.` },
    { title: "Inspection Cost Not Included", description: "Welding inspection (visual, NDT) costs are often excluded from weld cost estimates.", impact_on_result: `Could add ${currency(displayTotalCost * 0.05)} to total cost.` },
    { title: "Rework Not Factored", description: "Industry standard rework rates (3-5%) are not reflected in this estimate.", impact_on_result: `Could add ${currency(displayTotalCost * 0.04)} to total cost.` },
    { title: "Gas Waste Not Accounted", description: "Shielding gas waste from purge and pre/post-flow increases effective gas consumption.", impact_on_result: `Could add ${currency(gasCostVal * 0.15)} to total cost.` },
  ];

  // ── 8. Risk warnings (internal diagnostics filtered) ───────────────
  const userWarnings = warnings.filter((w) => !INTERNAL_DIAG_IDS.some((prefix) => w.id.startsWith(prefix)));
  const allUserWarningItems = [...wireSanityWarning, ...userWarnings];
  const riskWarnings: RiskWarning[] = allUserWarningItems.length > 0
    ? allUserWarningItems.map((w) => ({
        title: w.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: w.message,
        severity: (w.severity as "INFO" | "WARNING" | "CRITICAL") ?? "WARNING",
      }))
    : [
        { title: "Deposition Efficiency Variance", description: `At ${depEff}%, efficiency directly impacts wire consumption and total cost.`, severity: "WARNING", mitigation: "Verify actual deposition efficiency for your process and operator skill level." },
        { title: "Arc Time Sensitivity", description: "Arc time has a direct multiplier effect on gas consumption and labor cost.", severity: "WARNING", mitigation: "Use time studies to confirm arc time estimate." },
        { title: "Material Density Assumption", description: "Using carbon steel density of 7.85 g/cm³. Verify exact material specification.", severity: "INFO", mitigation: "Confirm material grade and density with supplier data sheet." },
        { title: "Price Volatility", description: "Wire and gas prices are subject to market fluctuations not reflected in this estimate.", severity: "WARNING", mitigation: "Consider price escalation clauses for long-duration projects." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Total Job Time", change: "+10%", impact: jobTimeH > 0 ? `${currency((laborCostVal + overheadVal) * 0.10)} increase` : "N/A (zero job time)", severity: "HIGH" },
    { parameter: "Deposition Efficiency", change: `Drop from ${depEff}% to ${Math.max(depEff - 10, 1)}%`, impact: wireCostVal > 0 ? `${currency(wireCostVal * 0.13)} increase in wire cost` : "N/A (wire cost is zero)", severity: wireCostVal > 0.05 ? "MEDIUM" : "LOW" },
    { parameter: "Wire Price", change: "+15%", impact: wireCostVal > 0 ? `${currency(wireCostVal * 0.15)} increase` : "N/A (wire cost is zero)", severity: wireCostVal > 0.05 ? "MEDIUM" : "LOW" },
    { parameter: "Gas Price", change: "+10%", impact: gasCostVal > 0 ? `${currency(gasCostVal * 0.10)} increase` : "N/A (gas cost is zero)", severity: "LOW" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Weld procedure specification (WPS) verified", status: "REVIEW", details: "Verify WPS matches input parameters." },
    { item: "Material specification to be confirmed", status: "REVIEW", details: "Material spec not independently verified." },
    { item: "Welder qualification matches procedure", status: "REVIEW", details: "Verify welder has current qualification." },
    { item: "Consumable storage conditions verified", status: "REVIEW", details: "Check electrode/wire storage and conditioning." },
    { item: "Gas flow rate and purity to be verified", status: "REVIEW", details: "Shielding gas assumed within specification." },
    { item: "Joint preparation and fit-up inspected", status: "REVIEW", details: "Verify root gap, bevel angle, and fit-up." },
    { item: "Preheat / interpass requirements to be checked against WPS", status: "REVIEW", details: "Per WPS requirements." },
    { item: "NDE inspection method and acceptance criteria defined", status: "REVIEW", details: "Confirm inspection scope." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (marginPct >= 20) {
    recommendedAction = { action: "Proceed to quotation review after verifying WPS, material, total job time, and shop assumptions.", priority: "HIGH", expected_benefit: "Informed bid with verified cost assumptions." };
  } else if (marginPct >= 5) {
    recommendedAction = { action: "Review labor efficiency and deposition parameters. Target 10% time reduction.", priority: "HIGH", expected_benefit: `Potential savings of ${currency(displayTotalCost * 0.08)}.` };
  } else {
    recommendedAction = { action: `Revise quote to minimum ${currency(displayTotalCost * 1.15)} to achieve 15% margin.`, priority: "HIGH", expected_benefit: `Ensures ${currency(displayTotalCost * 0.15)} minimum margin.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${resolvedDisplayValue(key, val)} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId,
    baseCostPerMeter: currency(baseCostPerMeter), totalFloorPerMeter: currency(totalFloorPerMeter),
    wireMass: `${fmt(wireMassKg)} kg`, wireCostTotal: currency(wireCostVal),
    gasCostTotal: currency(gasCostVal), laborCostTotal: currency(laborCostVal),
    overheadCostTotal: currency(overheadVal), contingencyAmount: currency(contingencyAmt),
    totalCost: currency(displayTotalCost),
    marginAmount: plannedQuoteVal > 0 ? currency(marginAmt) : "N/A",
    marginPercent: plannedQuoteVal > 0 ? `${fmt(marginPct)}%` : "N/A",
    keyCostDriver,
  };
}
