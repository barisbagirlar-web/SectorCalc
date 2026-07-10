// SectorCalc PRO V2 — Loss Making Job Detector Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { if (val < 0) return `-${symbol}${fmt(Math.abs(val))}`; return `${symbol}${fmt(val)}`; }
function pct(val: number): string { return `${fmt(val)}%`; }

const DRIVER_LABELS: Record<number, string> = {
  0: "Material",
  1: "Machine",
  2: "Labor",
  3: "External Processing",
  4: "Packaging / Freight",
  5: "Other Job Costs",
  6: "Overhead",
  7: "Scrap / Rework",
};

export function buildLossDetectorReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  const revenue            = outputs.out_job_revenue ?? 0;
  const materialCost       = outputs.out_direct_material_cost ?? 0;
  const machineCost        = outputs.out_machine_cost ?? 0;
  const laborCost          = outputs.out_labor_cost ?? 0;
  const externalCost       = outputs.out_external_processing_cost ?? 0;
  const packagingFreight   = outputs.out_packaging_freight_cost ?? 0;
  const otherCost          = outputs.out_other_job_cost ?? 0;
  const overhead           = outputs.out_allocated_overhead ?? 0;
  const scrapCost          = outputs.out_scrap_rework_cost ?? 0;
  const fullyLoaded        = outputs.out_fully_loaded_job_cost ?? 0;
  const contributionProfit = outputs.out_contribution_profit ?? 0;
  const operatingProfit    = outputs.out_operating_profit ?? 0;
  const marginPct          = outputs.out_revenue_margin_percent ?? 0;
  const profitLossPU       = outputs.out_profit_loss_per_unit ?? 0;
  const minSustainPricePU  = outputs.out_minimum_sustainable_price ?? 0;
  const targetPricePU      = outputs.out_target_price ?? 0;
  const repricingGapPU     = outputs.out_repricing_gap ?? 0;
  const beQty              = outputs.out_break_even_quantity ?? 0;
  const annualRisk         = outputs.out_annualized_money_at_risk ?? 0;
  const primaryDriverIdx   = outputs.out_primary_loss_driver ?? 0;
  const decisionScore      = outputs.out_final_decision_state ?? 0;

  const batchQty = engineInputs.n_batch_quantity ?? 1;
  const targetPct = engineInputs.n_target_revenue_margin_percent ?? 30;
  const annualVol = engineInputs.n_annual_volume_units ?? 0;

  const isLossMaking = operatingProfit < 0;
  const isBelowVariable = contributionProfit < 0;

  // ── Primary KPI ───────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (isBelowVariable) {
    kpiLabel = "Cash-Negative (Below Variable Cost)";
    kpiSeverity = "CRITICAL";
  } else if (isLossMaking) {
    kpiLabel = "Loss-Making Job";
    kpiSeverity = "CRITICAL";
  } else if (marginPct >= targetPct) {
    kpiLabel = "Profitable — Target Margin Achieved";
    kpiSeverity = "OK";
  } else {
    kpiLabel = "Below Target Margin";
    kpiSeverity = "WARNING";
  }

  const primaryKpi: InsightKpi = {
    label: `Job Profit: ${currency(operatingProfit)}`,
    value: isLossMaking ? currency(Math.abs(operatingProfit)) : currency(operatingProfit),
    unit: "USD",
    severity: kpiSeverity,
    explanation: `Revenue ${currency(revenue)}, fully loaded cost ${currency(fullyLoaded)}. ` +
      `Operating profit ${currency(operatingProfit)} (${pct(marginPct)} margin vs target ${pct(targetPct)}).`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Profitable", summary: `Revenue margin ${pct(marginPct)} meets or exceeds target ${pct(targetPct)}. Job is commercially viable.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "At Risk — Below Target", summary: `Margin ${pct(marginPct)} is below target ${pct(targetPct)}. Review pricing structure or cost base.` };
  } else {
    decisionState = { state: "LOSS", label: isBelowVariable ? "Cash-Negative" : "Loss Position", summary: isBelowVariable
      ? `Selling price does not cover variable costs. Contribution loss ${currency(Math.abs(contributionProfit))}.`
      : `Job is loss-making. Fully loaded cost ${currency(fullyLoaded)} exceeds revenue ${currency(revenue)} by ${currency(Math.abs(operatingProfit))}.` };
  }

  // ── Executive Interpretation ───────────────────────────────────────
  let execInterpretation: string;
  if (isBelowVariable) {
    execInterpretation = `This job is cash-negative. The selling price of ${currency(revenue / batchQty)} per unit ` +
      `does not cover the variable cost of ${currency((revenue - contributionProfit) / batchQty)} per unit. ` +
      `Every unit produced destroys value. Immediate reprice or rejection is recommended.`;
  } else if (isLossMaking) {
    execInterpretation = `This job is loss-making. Revenue ${currency(revenue)} falls short of the fully loaded cost ` +
      `${currency(fullyLoaded)} by ${currency(Math.abs(operatingProfit))}. The primary cost driver is ` +
      `${DRIVER_LABELS[primaryDriverIdx] ?? "Unknown"}. ` +
      `A minimum sustainable price of ${currency(minSustainPricePU)} per unit is required to break even, ` +
      `and ${currency(targetPricePU)} per unit to achieve the ${pct(targetPct)} target margin.` +
      (annualVol > 0 ? ` Annualized money at risk: ${currency(annualRisk)}.` : "");
  } else if (marginPct >= targetPct) {
    execInterpretation = `This job is profitable. Revenue ${currency(revenue)} exceeds fully loaded cost ` +
      `${currency(fullyLoaded)} by ${currency(operatingProfit)} (${pct(marginPct)} margin). ` +
      `The target margin of ${pct(targetPct)} is achieved. Current pricing is commercially sound.`;
  } else {
    execInterpretation = `This job covers fully loaded costs but misses the target margin. ` +
      `Revenue ${currency(revenue)}, cost ${currency(fullyLoaded)}, profit ${currency(operatingProfit)} (${pct(marginPct)}). ` +
      `Target margin ${pct(targetPct)} requires a selling price of ${currency(targetPricePU)} per unit, ` +
      `representing a gap of ${currency(repricingGapPU)} per unit.`;
  }

  // ── Revenue-to-Cost Bridge ─────────────────────────────────────────
  const costComponents: CostDistributionItem[] = [
    { category: "Direct Material", amount: materialCost, percentage: fullyLoaded > 0 ? (materialCost / fullyLoaded) * 100 : 0 },
    { category: "Machine Cost", amount: machineCost, percentage: fullyLoaded > 0 ? (machineCost / fullyLoaded) * 100 : 0 },
    { category: "Labor Cost", amount: laborCost, percentage: fullyLoaded > 0 ? (laborCost / fullyLoaded) * 100 : 0 },
    { category: "External Processing", amount: externalCost, percentage: fullyLoaded > 0 ? (externalCost / fullyLoaded) * 100 : 0 },
    { category: "Packaging / Freight", amount: packagingFreight, percentage: fullyLoaded > 0 ? (packagingFreight / fullyLoaded) * 100 : 0 },
    { category: "Other Job Costs", amount: otherCost, percentage: fullyLoaded > 0 ? (otherCost / fullyLoaded) * 100 : 0 },
    { category: "Allocated Overhead", amount: overhead, percentage: fullyLoaded > 0 ? (overhead / fullyLoaded) * 100 : 0 },
    { category: "Scrap / Rework Allowance", amount: scrapCost, percentage: fullyLoaded > 0 ? (scrapCost / fullyLoaded) * 100 : 0 },
  ];

  // ── Calculated Values ──────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Total Job Revenue", value: currency(revenue), unit: "USD", formula_ref: "Selling price × batch quantity" },
    { label: "Fully Loaded Job Cost", value: currency(fullyLoaded), unit: "USD", formula_ref: "Sum of all cost components" },
    { label: "Contribution Profit", value: currency(contributionProfit), unit: "USD", formula_ref: "Revenue − variable costs (material, machine, labor, external, packaging, other)" },
    { label: "Operating Profit", value: currency(operatingProfit), unit: "USD", formula_ref: "Revenue − fully loaded cost" },
    { label: "Revenue Margin", value: pct(marginPct), unit: "%", formula_ref: "Operating profit ÷ revenue × 100" },
    { label: "Profit / Loss per Unit", value: currency(profitLossPU), unit: "USD", formula_ref: "Operating profit ÷ batch quantity" },
    { label: "Minimum Sustainable Price", value: currency(minSustainPricePU), unit: "USD/unit", formula_ref: "Fully loaded cost ÷ batch quantity" },
    { label: "Target Price (Revenue Margin)", value: currency(targetPricePU), unit: "USD/unit", formula_ref: "Min sustainable price ÷ (1 − target margin / 100)" },
    { label: "Repricing Gap", value: currency(repricingGapPU), unit: "USD/unit", formula_ref: "Target price − current selling price" },
    { label: "Break-Even Quantity", value: fmt(beQty), unit: "units", formula_ref: "Fixed costs ÷ (selling price − variable cost per unit)" },
    ...(annualVol > 0 ? [{ label: "Annualized Money at Risk", value: currency(annualRisk), unit: "USD/year", formula_ref: "Loss per batch × (annual volume ÷ batch quantity)" }] : []),
    { label: "Primary Cost Driver", value: DRIVER_LABELS[primaryDriverIdx] ?? "Unknown", unit: "", formula_ref: "Largest cost component by value" },
  ];

  // ── Sensitivity Checks ─────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Selling Price", change: "+5%", impact: revenue > 0 ? `${currency(revenue * 0.05)} additional revenue` : "N/A", severity: marginPct < targetPct ? "HIGH" : "MEDIUM" },
    { parameter: "Material Cost", change: "+10%", impact: materialCost > 0 ? `${currency(materialCost * 0.1)} cost increase` : "N/A", severity: "MEDIUM" },
    { parameter: "Machine Rate", change: "-10%", impact: machineCost > 0 ? `${currency(machineCost * 0.1)} cost reduction` : "N/A", severity: "MEDIUM" },
    { parameter: "Batch Quantity", change: "+20%", impact: "Dilutes setup cost per unit", severity: "LOW" },
    { parameter: "Scrap Rate", change: "+50%", impact: scrapCost > 0 ? `${currency(scrapCost * 0.5)} additional scrap cost` : "N/A", severity: "LOW" },
  ];

  // ── Hidden Cost Diagnosis ──────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Expedited Delivery", description: "Rush orders may incur premium freight or overtime not reflected in standard rates.", potential_impact: currency(revenue * 0.03), severity: "MEDIUM" },
    { title: "Inspection / QA Costs", description: "First-article inspection, dimensional reporting, or NDT may add cost not included in overhead.", potential_impact: currency(fullyLoaded * 0.02), severity: "LOW" },
    { title: "Tooling Wear", description: "Consumable tooling and insert costs may be understated if estimated rather than measured.", potential_impact: currency(machineCost * 0.08), severity: "LOW" },
  ];

  // ── Missed Assumptions ─────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Overhead Allocation Method", description: "Overhead is allocated per batch. Complex jobs may absorb more overhead than simple jobs.", impact_on_result: `True margin may be ${pct(marginPct * 0.85)} after refined allocation.` },
    { title: "Setup Time Variation", description: "Setup time is an average. First-time or changeover-heavy jobs may exceed budget.", impact_on_result: `Machine and labor cost could increase by 10-15% on complex changeovers.` },
    { title: "Scrap Rate Stability", description: "Scrap rates vary by batch. Early production runs typically have higher scrap.", impact_on_result: `First-batch scrap may be 2-3x the long-term average.` },
  ];

  // ── Risk Warnings ──────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [
    { title: isBelowVariable ? "Cash-Negative Job — Immediate Action Required" : isLossMaking ? "Loss-Making Job Detected" : "Margin Below Target",
      description: isBelowVariable ? `Selling price ${currency(revenue / batchQty)}/unit is below variable cost ${currency((revenue - contributionProfit) / batchQty)}/unit.` :
        isLossMaking ? `Loss of ${currency(Math.abs(operatingProfit))} per batch.` :
        `Current margin ${pct(marginPct)} is below target ${pct(targetPct)}.`,
      severity: isLossMaking ? "CRITICAL" as const : "WARNING" as const },
    ...(annualVol > 0 && annualRisk > 0 ? [{ title: "Annualized Loss Exposure", description: `At ${fmt(annualVol)} units/year, estimated annual loss: ${currency(annualRisk)}.`, severity: "CRITICAL" as const }] : []),
    { title: "Price Competitiveness", description: `Target price ${currency(targetPricePU)}/unit vs current ${currency(revenue / batchQty)}/unit. Gap: ${currency(Math.abs(repricingGapPU))}/unit.`, severity: repricingGapPU > 0 ? "WARNING" as const : "INFO" as const },
    { title: "Break-Even Risk", description: beQty > 0 && beQty < batchQty ? `Break-even at ${fmt(beQty)} units. Current batch of ${fmt(batchQty)} units is above break-even.` : `Break-even quantity ${fmt(beQty)} units exceeds batch of ${fmt(batchQty)}. Risk of loss at lower volumes.`, severity: beQty > 0 && beQty <= batchQty ? "INFO" as const : "WARNING" as const },
  ];

  // ── Professional Checklist ─────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Selling price confirmed with customer or contract", status: "REVIEW", details: "Verify latest agreed price." },
    { item: "Material cost verified with purchasing", status: "REVIEW", details: "Use current supplier pricing." },
    { item: "Machine rate validated against cost records", status: "REVIEW", details: "Include depreciation, energy, maintenance." },
    { item: "Labor rate includes all employment costs", status: "REVIEW", details: "Verify with payroll records." },
    { item: "Cycle time confirmed by time study or CAM", status: "REVIEW", details: "Use measured not estimated values." },
    { item: "Scrap rate based on quality data", status: "REVIEW", details: "Review scrap and rework records." },
    { item: "Overhead allocation method documented", status: "REVIEW", details: "Confirm allocation basis." },
    { item: "Target margin aligned with business strategy", status: "REVIEW", details: "Confirm with management." },
    { item: "Annual volume assumption realistic", status: "REVIEW", details: "Use committed orders not pipeline." },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (isBelowVariable) {
    recommendedAction = {
      action: `Immediately reprice or reject. Current price ${currency(revenue / batchQty)}/unit is below variable cost ${currency((revenue - contributionProfit) / batchQty)}/unit. Minimum price: ${currency(minSustainPricePU)}/unit. Target price: ${currency(targetPricePU)}/unit.`,
      priority: "HIGH", expected_benefit: `Eliminates cash-negative position.` };
  } else if (isLossMaking) {
    recommendedAction = {
      action: `Revise price to ${currency(targetPricePU)}/unit (from ${currency(revenue / batchQty)}/unit) or reject unprofitable work. If strategic, confirm cross-subsidy.`,
      priority: "HIGH", expected_benefit: `Eliminates loss of ${currency(Math.abs(operatingProfit))} per batch.` };
  } else if (marginPct < targetPct) {
    recommendedAction = {
      action: `Target cost reduction or price increase. Raise price to ${currency(targetPricePU)}/unit (gap ${currency(repricingGapPU)}/unit) or reduce costs by ${currency(Math.abs(operatingProfit - fullyLoaded * (targetPct / 100)))} per batch.`,
      priority: "HIGH", expected_benefit: `Improves margin from ${pct(marginPct)} to ${pct(targetPct)}.` };
  } else {
    recommendedAction = {
      action: `Maintain pricing. Monitor costs for changes. Consider volume incentives if capacity allows.`,
      priority: "LOW", expected_benefit: "Sustains current margin level." };
  }

  // ── Assumptions ────────────────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution: costComponents, calculatedValues,
    hiddenLosses, missedAssumptions, riskWarnings,
    sensitivityChecks, checklist, recommendedAction, assumptionsUsed, traceId,
    totalCost: currency(fullyLoaded),
    marginPercent: pct(marginPct),
    marginAmount: currency(operatingProfit),
  };
}
