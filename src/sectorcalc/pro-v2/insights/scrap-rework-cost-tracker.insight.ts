// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Insight Report
// Tool-specific insight builder for scrap and rework cost analysis.

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

const INTERNAL_DIAG_IDS = [
  "schema_hash_mismatch", "client_schema_hash", "derating_config", "derating_",
  "trigger_inputs", "missing_trigger_inputs", "bounds_", "refrange_",
  "sens_warn", "formula_module", "formula_engine", "warn_blocked",
];

export function buildScrapReworkReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const scrapQuantity = outputs.out_scrap_quantity ?? 0;
  const scrapRatePct = outputs.out_scrap_rate_pct ?? 0;
  const materialLoss = outputs.out_material_loss ?? 0;
  const machineLoss = outputs.out_machine_loss ?? 0;
  const laborLoss = outputs.out_labor_loss ?? 0;
  const reworkCost = outputs.out_rework_cost ?? 0;
  const inspectionCost = outputs.out_inspection_cost ?? 0;
  const disposalCost = outputs.out_disposal_cost ?? 0;
  const replacementProdCost = outputs.out_replacement_production_cost ?? 0;
  const totalLoss = outputs.out_total_loss ?? 0;
  const annualizedLoss = outputs.out_annualized_loss ?? 0;
  const costPerRejectedUnit = outputs.out_cost_per_rejected_unit ?? 0;
  const primaryDriver = outputs.out_primary_defect_cost_driver ?? 0;
  const decisionStateCode = outputs.out_final_decision_state ?? 0;

  // ── Engine inputs ────────────────────────────────────────────────────
  const defectRateTarget = engineInputs.defect_rate_target_pct ?? 0;

  // ── Driver labels ────────────────────────────────────────────────────
  const driverLabels = ["Material Loss", "Machine Loss", "Labor Loss", "Rework Cost"];
  const primaryDriverLabel = driverLabels[primaryDriver] ?? "Unknown";

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Total Cost of Defects (Scrap + Rework)",
    value: currency(totalLoss),
    unit: "USD",
    severity: decisionStateCode === 2 ? "CRITICAL" : decisionStateCode === 1 ? "WARNING" : "OK",
    explanation: `Total defect-related loss of ${currency(totalLoss)} at ${fmt(scrapRatePct)}% scrap rate. Annualized: ${currency(annualizedLoss)}.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = { state: "PROFITABLE", label: "Within Target Defect Rate", summary: `Scrap rate of ${fmt(scrapRatePct)}% is at or below the target of ${fmt(defectRateTarget)}%. Quality performance is acceptable.` };
  } else if (decisionStateCode === 1) {
    decisionState = { state: "AT_RISK", label: "Above Target — Review Required", summary: `Scrap rate of ${fmt(scrapRatePct)}% exceeds the target of ${fmt(defectRateTarget)}% but is within 2x threshold. Improvement action recommended.` };
  } else {
    decisionState = { state: "LOSS", label: "Critical Quality Issue — Immediate Action", summary: `Scrap rate of ${fmt(scrapRatePct)}% significantly exceeds target. Immediate containment and corrective action required.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation =
    `This scrap and rework cost analysis identifies total defect-related losses of ${currency(totalLoss)} ` +
    `(${currency(materialLoss)} material + ${currency(machineLoss)} machine + ${currency(laborLoss)} labor + ` +
    `${currency(reworkCost)} rework + ${currency(inspectionCost)} inspection + ${currency(disposalCost)} disposal + ` +
    `${currency(replacementProdCost)} replacement). ` +
    `At a scrap rate of ${fmt(scrapRatePct)}% (target: ${fmt(defectRateTarget)}%), the annualized loss is ${currency(annualizedLoss)}. ` +
    `Cost per rejected unit: ${currency(costPerRejectedUnit)}. ` +
    `The primary defect cost driver is "${primaryDriverLabel}".`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = totalLoss > 0 ? totalLoss : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Material Loss (Scrap)", amount: materialLoss, percentage: (materialLoss / totalForPct) * 100 },
    { category: "Machine Loss (Scrap)", amount: machineLoss, percentage: (machineLoss / totalForPct) * 100 },
    { category: "Labor Loss (Scrap)", amount: laborLoss, percentage: (laborLoss / totalForPct) * 100 },
    { category: "Rework Cost", amount: reworkCost, percentage: (reworkCost / totalForPct) * 100 },
    { category: "Inspection Cost", amount: inspectionCost, percentage: (inspectionCost / totalForPct) * 100 },
    { category: "Disposal Cost", amount: disposalCost, percentage: (disposalCost / totalForPct) * 100 },
    { category: "Replacement Production Cost", amount: replacementProdCost, percentage: (replacementProdCost / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Scrap Quantity", value: `${fmt(scrapQuantity, 0)}`, unit: "units", formula_ref: "Direct input" },
    { label: "Scrap Rate", value: `${fmt(scrapRatePct)}%`, unit: "%", formula_ref: "Scrap quantity / Total produced" },
    { label: "Material Loss", value: currency(materialLoss), unit: "USD", formula_ref: "Scrap × Unit material cost" },
    { label: "Machine Loss", value: currency(machineLoss), unit: "USD", formula_ref: "Scrap × Unit labor cost × 50%" },
    { label: "Labor Loss", value: currency(laborLoss), unit: "USD", formula_ref: "Scrap × Unit labor cost" },
    { label: "Rework Cost", value: currency(reworkCost), unit: "USD", formula_ref: "Rework units × Time × Rework rate" },
    { label: "Inspection Cost", value: currency(inspectionCost), unit: "USD", formula_ref: "8% of material loss (estimated)" },
    { label: "Disposal Cost", value: currency(disposalCost), unit: "USD", formula_ref: "$2/unit estimated disposal" },
    { label: "Replacement Production Cost", value: currency(replacementProdCost), unit: "USD", formula_ref: "Scrap × (Material + Labor cost)" },
    { label: "Total Loss", value: currency(totalLoss), unit: "USD", formula_ref: "Sum of all defect cost components" },
    { label: "Annualized Loss", value: currency(annualizedLoss), unit: "USD/year", formula_ref: "Total loss × Annualization factor" },
    { label: "Cost per Rejected Unit", value: currency(costPerRejectedUnit), unit: "USD/unit", formula_ref: "Total loss / Total defect units" },
    { label: "Primary Defect Cost Driver", value: primaryDriverLabel, unit: "", formula_ref: "Largest cost component" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Expedited Material Orders", description: "Replacement of scrapped material often requires expedited purchasing at premium prices not captured here.", potential_impact: currency(totalLoss * 0.1), severity: "MEDIUM" },
    { title: "Customer Returns & Warranty Claims", description: "Defects that reach customers trigger return logistics, inspection, replacement, and warranty administration costs.", potential_impact: currency(totalLoss * 0.15), severity: "HIGH" },
    { title: "Production Schedule Disruption", description: "Scrap and rework disrupt production flow, causing downstream delays and missed delivery dates.", potential_impact: currency(machineLoss * 2), severity: "HIGH" },
    { title: "Supplier Claim Processing", description: "If material defects are supplier-caused, claim processing and negotiation costs add administrative overhead.", potential_impact: currency(totalLoss * 0.03), severity: "LOW" },
    { title: "Brand & Customer Relationship Impact", description: "Quality issues erode customer trust and may result in lost future business not reflected in current costs.", potential_impact: currency(annualizedLoss * 0.5), severity: "MEDIUM" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Inspection Cost Estimate", description: "Inspection cost is estimated at 8% of material loss. Actual inspection cost depends on process and frequency.", impact_on_result: `Actual inspection could range from 3-15% of material loss.` },
    { title: "Disposal Cost Estimate", description: "Disposal cost is assumed at $2/unit. Special waste handling or recycling may change this significantly.", impact_on_result: `Special disposal could increase cost to ${currency(disposalCost * 3)}.` },
    { title: "Monthly Volume Represents Annual Average", description: "Annualized loss assumes consistent monthly volume. Seasonal variation changes actual annual exposure.", impact_on_result: `25% volume variation changes annual loss by ${currency(annualizedLoss * 0.25)}.` },
    { title: "Machine Loss Is Estimated", description: "Machine loss is estimated at 50% of scrap labor content. Actual machine overhead varies significantly.", impact_on_result: `Machine rate variance of 20% changes total loss by ${currency(machineLoss * 0.2)}.` },
  ];

  // ── 8. Risk warnings ───────────────────────────────────────────────
  const userWarnings = warnings.filter((w) => !INTERNAL_DIAG_IDS.some((prefix) => w.id.startsWith(prefix)));
  const riskWarnings: RiskWarning[] = userWarnings.length > 0
    ? userWarnings.map((w) => ({
        title: w.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: w.message,
        severity: (w.severity as "INFO" | "WARNING" | "CRITICAL") ?? "WARNING",
      }))
    : [
        { title: scrapRatePct <= defectRateTarget ? "Scrap Rate Within Target" : "Scrap Rate Exceeds Target", description: `Current scrap rate of ${fmt(scrapRatePct)}% vs target of ${fmt(defectRateTarget)}%.`, severity: scrapRatePct <= defectRateTarget ? "INFO" : (scrapRatePct <= defectRateTarget * 2 ? "WARNING" : "CRITICAL") },
        { title: "Primary Driver Requires Attention", description: `"${primaryDriverLabel}" is the largest cost component.`, severity: primaryDriver === 0 || primaryDriver === 3 ? "WARNING" : "INFO", mitigation: "Investigate root cause of the primary defect cost driver." },
        { title: "Annualized Loss Exposure", description: `Annualized loss of ${currency(annualizedLoss)} represents significant financial exposure.`, severity: annualizedLoss > 100000 ? "CRITICAL" : annualizedLoss > 50000 ? "WARNING" : "INFO" },
        { title: "Replacement Production Cost Burden", description: `Replacement production cost of ${currency(replacementProdCost)} reduces effective capacity.`, severity: "WARNING", mitigation: "Evaluate capacity impact and consider preventive measures." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Scrap Rate", change: "+1 pp", impact: scrapQuantity > 0 ? `Approximately ${currency(totalLoss * 0.15)} additional loss` : "N/A", severity: "HIGH" },
    { parameter: "Material Cost per Unit", change: "+10%", impact: materialLoss > 0 ? `${currency(materialLoss * 0.1)} additional material loss` : "N/A", severity: "HIGH" },
    { parameter: "Rework Rate (hours)", change: "+20%", impact: reworkCost > 0 ? `${currency(reworkCost * 0.2)} additional rework cost` : "N/A", severity: "MEDIUM" },
    { parameter: "Rework Labor Rate", change: "+15%", impact: reworkCost > 0 ? `${currency(reworkCost * 0.15)} additional rework cost` : "N/A", severity: "MEDIUM" },
    { parameter: "Monthly Volume", change: "+10%", impact: `${currency(annualizedLoss * 0.1)} additional annualized loss`, severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Scrap root cause analysis completed", status: "REVIEW", details: "Verify root cause for top defect types." },
    { item: "Rework process documented and standardized", status: "REVIEW", details: "Ensure rework procedures are defined." },
    { item: "Inspection method and sampling rate verified", status: "REVIEW", details: "Confirm inspection captures true defect rate." },
    { item: "Defect data collection system validated", status: "REVIEW", details: "Check accuracy of scrap and rework counts." },
    { item: "Cost allocation method for machine loss reviewed", status: "REVIEW", details: "Verify machine cost allocation rate." },
    { item: "Supplier quality issues escalated if applicable", status: "REVIEW", details: "Ensure supplier corrective actions are requested." },
    { item: "Quality improvement project initiated with target date", status: "REVIEW", details: "Set improvement targets and timeline." },
    { item: "Monthly quality review process established", status: "REVIEW", details: "Create recurring quality cost review." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 2) {
    recommendedAction = { action: `Immediate quality intervention: Investigate root cause of high scrap rate. Implement containment actions within 2 weeks.`, priority: "HIGH", expected_benefit: `Reducing scrap to target saves ${currency(totalLoss * 0.4)} per period.` };
  } else if (decisionStateCode === 1) {
    recommendedAction = { action: `Quality improvement: Focus on "${primaryDriverLabel}" driver. Implement corrective actions and track scrap rate monthly.`, priority: "HIGH", expected_benefit: `25% defect reduction saves ${currency(totalLoss * 0.25)} per period.` };
  } else {
    recommendedAction = { action: `Continue monitoring: Maintain current quality levels. Review defect data quarterly for adverse trends.`, priority: "MEDIUM", expected_benefit: `Early detection prevents cost escalation.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const labelMap: Record<string, string> = {
    total_produced: "Total Produced",
    scrap_quantity: "Scrap Quantity",
    rework_quantity: "Rework Quantity",
    unit_material_cost: "Unit Material Cost",
    unit_labor_cost: "Unit Labor Cost",
    rework_labor_rate: "Rework Labor Rate",
    rework_time_per_unit: "Rework Time per Unit",
    defect_rate_target_pct: "Defect Rate Target",
    monthly_volume: "Monthly Volume",
  };

  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: labelMap[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId,
    totalCost: currency(totalLoss),
    keyCostDriver: primaryDriverLabel,
  };
}
