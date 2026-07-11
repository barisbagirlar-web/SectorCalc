// SectorCalc PRO V2 — Outsource vs In-House Analyzer Insight Report
// Tool-specific insight builder for make-or-buy decision analysis.

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

export function buildOutsourceReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const inHouseVariableCost = outputs.out_in_house_variable_cost ?? 0;
  const inHouseAllocatedFixed = outputs.out_in_house_allocated_fixed ?? 0;
  const inHouseTotalCost = outputs.out_in_house_total_cost ?? 0;
  const supplierUnitPrice = outputs.out_supplier_unit_price ?? 0;
  const logisticsImportCost = outputs.out_logistics_import_cost ?? 0;
  const qualityDefectAllowance = outputs.out_quality_defect_allowance ?? 0;
  const inventoryLeadTimeCost = outputs.out_inventory_lead_time_cost ?? 0;
  const capacityOpportunityCost = outputs.out_capacity_opportunity_cost ?? 0;
  const outsourceTotalLandedCost = outputs.out_outsource_total_landed_cost ?? 0;
  const costDifference = outputs.out_cost_difference ?? 0;
  const breakEvenVolume = outputs.out_break_even_volume ?? 0;
  const makeBuyDecision = outputs.out_make_buy_decision ?? 0;
  const primaryDecisionDriver = outputs.out_primary_decision_driver ?? 0;
  const decisionStateCode = outputs.out_final_decision_state ?? 0;

  // ── Engine inputs ────────────────────────────────────────────────────
  const annualVolume = engineInputs.n_annual_volume ?? 0;

  // ── Driver labels ────────────────────────────────────────────────────
  const driverLabels = ["Material Cost", "Labor Cost", "Overhead & Setup", "Supplier Price", "Logistics Cost"];
  const primaryDriverLabel = driverLabels[primaryDecisionDriver] ?? "Unknown";

  const decisionLabel = makeBuyDecision === 0 ? "MAKE (In-House)" : "BUY (Outsource)";

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Total Cost Comparison",
    value: currency(Math.abs(costDifference)),
    unit: "USD",
    severity: decisionStateCode === 2 ? "CRITICAL" : decisionStateCode === 1 ? "WARNING" : "OK",
    explanation: `In-house total: ${currency(inHouseTotalCost)} vs Outsource landed: ${currency(outsourceTotalLandedCost)}. Recommendation: ${decisionLabel}.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = { state: "PROFITABLE", label: `Clear Decision: ${decisionLabel}`, summary: `Cost difference of ${currency(Math.abs(costDifference))} (${fmt(Math.abs(costDifference) / Math.max(inHouseTotalCost, outsourceTotalLandedCost) * 100)}%) provides a clear make-or-buy direction.` };
  } else if (decisionStateCode === 1) {
    decisionState = { state: "AT_RISK", label: "Borderline — Qualitative Factors Needed", summary: `Cost difference of ${currency(Math.abs(costDifference))} is within 3-10% threshold. Consider qualitative factors: supplier reliability, core competency, IP protection.` };
  } else {
    decisionState = { state: "REVIEW", label: "Costs Too Close — Insufficient Data", summary: `Cost difference of ${currency(Math.abs(costDifference))} is less than 3%. Review input accuracy and consider strategic factors.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation =
    `This make-or-buy analysis compares in-house production (${currency(inHouseTotalCost)}) ` +
    `against outsourcing (${currency(outsourceTotalLandedCost)}) for an annual volume of ${fmt(annualVolume, 0)} units. ` +
    `In-house variable unit cost: ${currency(inHouseVariableCost)}/unit. ` +
    `Supplier landed unit cost: ${currency(supplierUnitPrice + (logisticsImportCost / Math.max(annualVolume, 1)))}/unit (incl. logistics). ` +
    `The net cost difference is ${currency(Math.abs(costDifference))} in favor of ${costDifference >= 0 ? "outsourcing" : "in-house production"}. ` +
    `Break-even volume: ${fmt(breakEvenVolume, 0)} units. ` +
    `Primary decision driver: "${primaryDriverLabel}". ` +
    `Recommended action: ${decisionLabel}.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalInHouseForPct = inHouseTotalCost > 0 ? inHouseTotalCost : 1;
  const totalOutsourceForPct = outsourceTotalLandedCost > 0 ? outsourceTotalLandedCost : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "In-House: Variable Unit Cost (Material + Labor + Overhead)", amount: inHouseVariableCost * annualVolume, percentage: ((inHouseVariableCost * annualVolume) / totalInHouseForPct) * 100 },
    { category: "In-House: Allocated Setup/Fixed Cost", amount: inHouseAllocatedFixed, percentage: (inHouseAllocatedFixed / totalInHouseForPct) * 100 },
    { category: "Outsource: Supplier Unit Price", amount: supplierUnitPrice * annualVolume, percentage: ((supplierUnitPrice * annualVolume) / totalOutsourceForPct) * 100 },
    { category: "Outsource: Logistics Cost", amount: logisticsImportCost, percentage: (logisticsImportCost / totalOutsourceForPct) * 100 },
    { category: "Outsource: Quality Defect Allowance", amount: qualityDefectAllowance, percentage: (qualityDefectAllowance / totalOutsourceForPct) * 100 },
    { category: "Outsource: Inventory & Lead Time Cost", amount: inventoryLeadTimeCost, percentage: (inventoryLeadTimeCost / totalOutsourceForPct) * 100 },
    { category: "Outsource: Capacity Opportunity Cost", amount: capacityOpportunityCost, percentage: (capacityOpportunityCost / totalOutsourceForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "In-House Variable Cost per Unit", value: currency(inHouseVariableCost), unit: "USD/unit", formula_ref: "Material + Labor + Overhead" },
    { label: "In-House Allocated Setup Cost", value: currency(inHouseAllocatedFixed), unit: "USD", formula_ref: "Setup cost per batch × Batch count" },
    { label: "In-House Total Cost", value: currency(inHouseTotalCost), unit: "USD", formula_ref: "Variable cost × Volume + Setup allocation" },
    { label: "Supplier Unit Price", value: currency(supplierUnitPrice), unit: "USD/unit", formula_ref: "Direct input" },
    { label: "Logistics & Import Cost", value: currency(logisticsImportCost), unit: "USD", formula_ref: "Logistics per unit × Annual volume" },
    { label: "Quality Defect Allowance", value: currency(qualityDefectAllowance), unit: "USD", formula_ref: "Supplier price × Volume × Defect rate" },
    { label: "Inventory & Lead Time Cost", value: currency(inventoryLeadTimeCost), unit: "USD", formula_ref: "Landed cost × Lead time cost %" },
    { label: "Capacity Opportunity Cost", value: currency(capacityOpportunityCost), unit: "USD", formula_ref: "In-house total × Opportunity cost %" },
    { label: "Outsource Total Landed Cost", value: currency(outsourceTotalLandedCost), unit: "USD", formula_ref: "Sum of all outsource cost components" },
    { label: "Cost Difference (In-House − Outsource)", value: currency(costDifference), unit: "USD", formula_ref: "In-house total − Outsource landed cost" },
    { label: "Break-Even Volume", value: `${fmt(breakEvenVolume, 0)}`, unit: "units", formula_ref: "Setup cost / (Supplier landed/unit − In-house variable/unit)" },
    { label: "Recommendation", value: decisionLabel, unit: "", formula_ref: "Based on effective cost comparison" },
    { label: "Primary Decision Driver", value: primaryDriverLabel, unit: "", formula_ref: "Largest cost component" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Supplier Quality Escalation Costs", description: "Defective outsourced parts may cause production line stops, emergency rework, and expedited replacement costs far beyond the defect allowance.", potential_impact: currency(outsourceTotalLandedCost * 0.1), severity: "HIGH" },
    { title: "IP & Engineering Support Costs", description: "Outsourcing may require ongoing engineering support, travel, and technology transfer costs not captured in unit price.", potential_impact: currency(outsourceTotalLandedCost * 0.05), severity: "MEDIUM" },
    { title: "Inventory Buffer & Safety Stock", description: "Longer supply chains require higher safety stock levels, increasing working capital requirements.", potential_impact: currency(inHouseVariableCost * annualVolume * 0.05), severity: "MEDIUM" },
    { title: "Supplier Relationship Management", description: "Ongoing supplier management, audits, and qualification require dedicated resources.", potential_impact: currency(outsourceTotalLandedCost * 0.02), severity: "LOW" },
    { title: "Transition & Qualification Costs", description: "Initial qualification, first-article inspection, and production ramp-up costs for new suppliers are not captured.", potential_impact: currency(inHouseTotalCost * 0.08), severity: "MEDIUM" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Supplier Price Stability", description: "Supplier pricing is assumed constant. Price escalation clauses, currency fluctuations, and renegotiation cycles are not included.", impact_on_result: `10% supplier price increase adds ${currency(supplierUnitPrice * annualVolume * 0.1)} to landed cost.` },
    { title: "Volume Stability", description: "Annual volume is assumed fixed. Volume changes affect break-even analysis and scale economies.", impact_on_result: `A 20% volume drop increases in-house unit cost by ~${currency(inHouseAllocatedFixed * 0.2)}.` },
    { title: "Logistics Cost Assumption", description: "Logistics cost is assumed per unit. Actual freight costs vary with shipment consolidation, fuel surcharges, and route changes.", impact_on_result: `25% logistics increase adds ${currency(logisticsImportCost * 0.25)} to landed cost.` },
    { title: "Capacity Can Be Freed", description: "Insourcing assumes existing capacity is fully utilized and can be redeployed. If not, opportunity cost is overstated.", impact_on_result: `If only 50% of capacity is freed, actual opportunity cost is ${currency(capacityOpportunityCost * 0.5)}.` },
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
        { title: `Recommendation: ${decisionLabel}`, description: `Cost analysis favors ${decisionLabel} by ${currency(Math.abs(costDifference))}.`, severity: decisionStateCode === 2 ? "WARNING" : decisionStateCode === 1 ? "WARNING" : "INFO" },
        { title: "Break-Even Volume Risk", description: `Break-even volume is ${fmt(breakEvenVolume, 0)} units vs actual volume of ${fmt(annualVolume, 0)} units.`, severity: breakEvenVolume > annualVolume * 0.8 ? "WARNING" : "INFO", mitigation: "Review volume forecasts and cost structure at different volume levels." },
        { title: "Supplier Dependency Risk", description: "Outsourcing creates supply chain dependency. Single-source suppliers increase risk exposure.", severity: "WARNING", mitigation: "Assess supplier diversification and contingency plans." },
        { title: "Quality Risk", description: "Supplier quality defect allowance of covers visible defects but not systemic quality issues.", severity: "WARNING", mitigation: "Implement supplier quality monitoring program." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Annual Volume", change: "-20%", impact: `In-house cost changes by ${currency(inHouseTotalCost * 0.2)}`, severity: "HIGH" },
    { parameter: "Supplier Price", change: "+10%", impact: supplierUnitPrice > 0 ? `Outsource cost increases by ${currency(supplierUnitPrice * annualVolume * 0.1)}` : "N/A", severity: "HIGH" },
    { parameter: "Logistics Cost", change: "+25%", impact: logisticsImportCost > 0 ? `Outsource cost increases by ${currency(logisticsImportCost * 0.25)}` : "N/A", severity: "MEDIUM" },
    { parameter: "In-House Labor Cost", change: "+15%", impact: `In-house cost increases by ${currency(inHouseVariableCost * annualVolume * 0.15)}`, severity: "MEDIUM" },
    { parameter: "Quality Defect Rate", change: "+2 pp", impact: qualityDefectAllowance > 0 ? `Outsource cost increases by ${currency(qualityDefectAllowance * 0.67)}` : "N/A", severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "In-house cost structure verified with cost accounting", status: "REVIEW", details: "Verify material, labor, overhead rates." },
    { item: "Supplier quotes confirmed as valid (validity period, terms)", status: "REVIEW", details: "Ensure quotes are current and binding." },
    { item: "Supplier quality history and certifications reviewed", status: "REVIEW", details: "Check ISO/AS9100/IATF certifications." },
    { item: "Logistics cost includes all fees (freight, customs, duties, insurance)", status: "REVIEW", details: "Verify total landed cost completeness." },
    { item: "Intellectual property protection strategy defined", status: "REVIEW", details: "Assess IP risk for outsourced production." },
    { item: "Capacity utilization and opportunity cost validated", status: "REVIEW", details: "Confirm internal capacity can be redeployed." },
    { item: "Break-even analysis reviewed at different volume scenarios", status: "REVIEW", details: "Run sensitivity at ±20% volume." },
    { item: "Strategic alignment with core competency strategy confirmed", status: "REVIEW", details: "Ensure decision aligns with long-term strategy." },
    { item: "Supplier exit strategy and re-shoring plan documented", status: "REVIEW", details: "Plan for supplier transition if needed." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 0) {
    const actionText = makeBuyDecision === 0
      ? `Proceed with in-house production. Validate cost structure and monitor actual costs against estimates quarterly.`
      : `Proceed with outsourcing. Negotiate contract terms including price escalation limits and quality SLAs.`;
    recommendedAction = { action: actionText, priority: "HIGH", expected_benefit: `Clear cost advantage of ${currency(Math.abs(costDifference))} supports the decision.` };
  } else if (decisionStateCode === 1) {
    recommendedAction = { action: `Conduct qualitative assessment: supplier reliability, core competency, IP protection, and risk tolerance. Re-run analysis with refined inputs.`, priority: "HIGH", expected_benefit: `Qualitative assessment ensures non-cost factors are weighted appropriately.` };
  } else {
    recommendedAction = { action: `Review input accuracy. Verify all cost components. Consider strategic factors and run sensitivity at different volume scenarios.`, priority: "MEDIUM", expected_benefit: `Improved data quality clarifies the optimal decision.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const labelMap: Record<string, string> = {
    in_house_material_cost_per_unit: "In-House Material Cost per Unit",
    in_house_labor_cost_per_unit: "In-House Labor Cost per Unit",
    in_house_overhead_per_unit: "In-House Overhead per Unit",
    in_house_setup_cost_per_batch: "In-House Setup Cost per Batch",
    outsource_unit_price: "Outsource Unit Price",
    outsource_logistics_per_unit: "Outsource Logistics per Unit",
    quality_defect_allowance_pct: "Quality Defect Allowance",
    inventory_lead_time_cost_pct: "Inventory & Lead Time Cost",
    capacity_opportunity_cost_pct: "Capacity Opportunity Cost",
    annual_volume: "Annual Volume",
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
    totalCost: currency(inHouseTotalCost),
    keyCostDriver: primaryDriverLabel,
  };
}
