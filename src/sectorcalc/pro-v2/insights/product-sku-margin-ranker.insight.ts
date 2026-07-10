// SectorCalc PRO V2 — Product SKU Margin Ranker Insight

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function pct(val: number, decimals = 1): string { return `${fmt(val, decimals)}%`; }
function currency(val: number): string { return val < 0 ? `-$${fmt(Math.abs(val), 2)}` : `$${fmt(val, 2)}`; }

export function buildSkuMarginRankerReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const O = params.outputs;
  const displayInputs = params.displayInputs;
  const engineInputs = params.engineInputs;

  const skuRevenue             = O.out_sku_revenue ?? 0;
  const variableCost           = O.out_variable_cost ?? 0;
  const contributionAmount     = O.out_contribution_amount ?? 0;
  const contributionMarginPct  = O.out_contribution_margin_percent ?? 0;
  const fullyLoadedProfit      = O.out_fully_loaded_profit ?? 0;
  const fullyLoadedMargin      = O.out_fully_loaded_margin ?? 0;
  const unitCost               = O.out_unit_cost ?? 0;
  const revenueSharePct        = O.out_revenue_share_percent ?? 0;
  const profitSharePct         = O.out_profit_share_percent ?? 0;
  const marginClass            = O.out_margin_classification ?? 0;
  const repriority             = O.out_repricing_priority ?? 0;
  const concentrationRisk      = O.out_concentration_risk ?? 0;
  const decisionScore          = O.out_final_decision_state ?? 0;

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";

  if (marginClass === 2) {
    kpiLabel = "Loss-Making SKU — Immediate Action Required";
    kpiSeverity = "CRITICAL";
  } else if (marginClass === 1) {
    kpiLabel = "Below Target Margin — Review Pricing";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Healthy Contribution Margin";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: pct(contributionMarginPct, 1),
    unit: "%",
    severity: kpiSeverity,
    explanation: `Contribution margin of ${pct(contributionMarginPct, 1)} with fully loaded margin of ${pct(fullyLoadedMargin, 1)}. Unit cost ${currency(unitCost)} at selling price ${currency(engineInputs.n_unit_price ?? 0)}.`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Profitable SKU", summary: `SKU generates ${currency(skuRevenue)} in revenue with contribution margin of ${pct(contributionMarginPct, 1)}. Margin classification confirms healthy performance above target.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "Margin Under Review", summary: `Contribution margin of ${pct(contributionMarginPct, 1)} is below target. Fully loaded profit of ${currency(fullyLoadedProfit)} requires pricing or cost review.` };
  } else {
    decisionState = { state: "LOSS", label: "Loss-Making SKU", summary: `Negative contribution of ${currency(contributionAmount)}. SKU is destroying value — immediate repricing or discontinuation recommended.` };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  const unitPrice = engineInputs.n_unit_price ?? 0;
  const materialCost = engineInputs.n_material_cost_per_unit ?? 0;
  const laborCost = engineInputs.n_labor_cost_per_unit ?? 0;
  const overhead = engineInputs.n_overhead_per_unit ?? 0;
  const logistics = engineInputs.n_logistics_cost_per_unit ?? 0;
  const annualVolume = engineInputs.n_annual_volume_units ?? 0;
  const targetMargin = engineInputs.n_target_margin_percent ?? 0;

  const execInterpretation =
    `This SKU margin analysis examines a product priced at ${currency(unitPrice)} per unit with ` +
    `annual volume of ${fmt(annualVolume, 0)} units, generating total revenue of ${currency(skuRevenue)}. ` +
    `Variable costs total ${currency(variableCost)} (material ${currency(materialCost)}/u, labor ${currency(laborCost)}/u, ` +
    `logistics ${currency(logistics)}/u). Allocated overhead adds ${currency(overhead)}/u for a total unit cost of ${currency(unitCost)}. ` +
    `The contribution margin is ${pct(contributionMarginPct, 1)} against a target of ${pct(targetMargin, 1)}, ` +
    `resulting in a fully loaded profit of ${currency(fullyLoadedProfit)} (${pct(fullyLoadedMargin, 1)} margin). ` +
    `This SKU represents ${pct(revenueSharePct, 1)} of portfolio revenue and ${pct(profitSharePct, 1)} of portfolio profit.`;

  // ── Cost Distribution ─────────────────────────────────────────────
  const total = skuRevenue > 0 ? skuRevenue : 1;
  const materialTotal = materialCost * annualVolume;
  const laborTotal = laborCost * annualVolume;
  const overheadTotal = overhead * annualVolume;
  const logisticsTotal = logistics * annualVolume;

  const costDistribution: CostDistributionItem[] = [
    { category: "Material Costs", amount: materialTotal, percentage: parseFloat(((materialTotal / total) * 100).toFixed(1)) },
    { category: "Labor Costs", amount: laborTotal, percentage: parseFloat(((laborTotal / total) * 100).toFixed(1)) },
    { category: "Overhead", amount: overheadTotal, percentage: parseFloat(((overheadTotal / total) * 100).toFixed(1)) },
    { category: "Logistics", amount: logisticsTotal, percentage: parseFloat(((logisticsTotal / total) * 100).toFixed(1)) },
    { category: "Profit Contribution", amount: contributionAmount > 0 ? contributionAmount : 0, percentage: contributionAmount > 0 ? parseFloat(((contributionAmount / total) * 100).toFixed(1)) : 0 },
  ];
  if (contributionAmount < 0) {
    costDistribution.push({ category: "Operating Loss", amount: Math.abs(contributionAmount), percentage: parseFloat(((Math.abs(contributionAmount) / total) * 100).toFixed(1)) });
  }

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Contribution Margin", value: pct(contributionMarginPct, 1), unit: "%" },
    { label: "Fully Loaded Margin", value: pct(fullyLoadedMargin, 1), unit: "%" },
    { label: "Unit Cost", value: currency(unitCost), unit: "per unit" },
    { label: "Revenue Share", value: pct(revenueSharePct, 1), unit: "%" },
    { label: "Profit Share", value: pct(profitSharePct, 1), unit: "%" },
  ];

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Unallocated Overhead Absorption",
      description: "Overhead allocation may not reflect actual consumption; volume changes can distort per-unit burden",
      potential_impact: `${currency(overhead * annualVolume * 0.1)}/yr potential misallocation`,
      severity: overhead > unitPrice * 0.2 ? "HIGH" : "MEDIUM",
    },
    {
      title: "Underpriced SKU Cross-Subsidy",
      description: "Low-margin SKUs may be subsidized by profitable ones, masking true portfolio profitability",
      potential_impact: `Up to ${pct(Math.abs(profitSharePct - revenueSharePct), 1)} margin distortion`,
      severity: marginClass === 2 ? "HIGH" : "MEDIUM",
    },
    {
      title: "Portfolio Concentration Risk",
      description: "High revenue concentration increases vulnerability to demand shifts in a single SKU",
      potential_impact: concentrationRisk ? `Single SKU exceeds 40% of portfolio — critical dependency` : `Moderate diversification`,
      severity: concentrationRisk ? "HIGH" : "LOW",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Cost Stability",
      description: "Assumes material, labor, and logistics costs remain constant at all volume levels",
      impact_on_result: "Commodity price increases could erode margin by 5-15%",
    },
    {
      title: "Volume Consistency",
      description: "Annual volume figure assumes steady demand throughout the year without seasonal variation",
      impact_on_result: `A 20% volume drop reduces contribution by ${currency(contributionAmount * 0.2)}`,
    },
    {
      title: "Overhead Allocation Accuracy",
      description: "Overhead per unit is an allocation; actual overhead may behave differently at scale",
      impact_on_result: `${currency(overhead * annualVolume * 0.15)} potential overhead variance`,
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (marginClass === 2) {
    riskWarnings.push({ title: "Negative Contribution Margin", description: `Contribution margin of ${pct(contributionMarginPct, 1)} means each sale destroys value`, severity: "CRITICAL", mitigation: "Immediate repricing or discontinuation required" });
  }
  if (marginClass === 1) {
    riskWarnings.push({ title: "Below Target Margin", description: `Margin of ${pct(contributionMarginPct, 1)} is below the ${pct(targetMargin, 1)} target`, severity: "WARNING", mitigation: "Review pricing, reduce costs, or renegotiate supply terms" });
  }
  if (concentrationRisk) {
    riskWarnings.push({ title: "Portfolio Concentration", description: `This SKU represents ${pct(revenueSharePct, 1)} of portfolio revenue — exceeds 40% threshold`, severity: "WARNING", mitigation: "Diversify revenue across multiple SKUs" });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({ title: "Price Sensitivity", description: "Customers may resist price increases needed to close margin gap", severity: "INFO", mitigation: "Consider value-add features or bundle pricing" });
  }
  if (riskWarnings.length < 3 && fullyLoadedMargin < 15) {
    riskWarnings.push({ title: "Thin Fully Loaded Margin", description: `${pct(fullyLoadedMargin, 1)} fully loaded margin leaves little room for cost overruns`, severity: "INFO", mitigation: "Build cost buffers and monitor overhead carefully" });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Price Increase (+5%)", change: "+5%", impact: `New contribution margin would be approximately ${pct((contributionMarginPct + 5), 1)}`, severity: marginClass === 0 ? "LOW" : "HIGH" },
    { parameter: "Material Cost Increase (+10%)", change: "+10%", impact: `Contribution reduced by ${currency(materialCost * annualVolume * 0.1)}`, severity: materialCost > unitPrice * 0.4 ? "HIGH" : "MEDIUM" },
    { parameter: "Volume Decrease (-10%)", change: "-10%", impact: `Contribution reduced by ${currency(Math.abs(contributionAmount) * 0.1)}`, severity: marginClass === 2 ? "HIGH" : "MEDIUM" },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Cost structure validated against actual bill of materials", status: "ASSUMED", details: "Based on provided per-unit cost inputs" },
    { item: "Portfolio profitability cross-checked with financial statements", status: "REVIEW", details: "Verify portfolio totals against actual P&L" },
    { item: "Margin target reviewed against industry benchmarks", status: "ASSUMED", details: "Target margin should reflect competitive dynamics" },
    { item: "Concentration risk assessed across full product portfolio", status: "REVIEW", details: "Consider multi-SKU concentration beyond single SKU check" },
    { item: "Overhead allocation methodology confirmed with accounting", status: "NOT CHECKED", details: "Overhead absorption method not validated" },
    { item: "Volume forecast consistency checked with historical data", status: "ASSUMED", details: "Annual volume assumed stable throughout year" },
    { item: "Tax and duty impact on landed cost considered", status: "NOT CHECKED", details: "Import duties, taxes not included in this analysis" },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (marginClass === 2) {
    recommendedAction = { action: `Immediate discontinuation review required. Increase price to ${currency(unitCost)}/u (breakeven) or reduce variable costs by ${currency(unitPrice - materialCost - laborCost - logistics)}/u.`, priority: "HIGH", expected_benefit: "Stops value destruction and recovers portfolio profitability." };
  } else if (marginClass === 1) {
    const priceIncrease = targetMargin - contributionMarginPct;
    recommendedAction = { action: `Review pricing — a ${pct(priceIncrease, 1)} price increase or equivalent cost reduction is needed to meet the ${pct(targetMargin, 1)} target.`, priority: "MEDIUM", expected_benefit: `Brings margin in line with target and improves portfolio profit contribution.` };
  } else {
    recommendedAction = { action: `Maintain current pricing. Monitor costs quarterly and re-run margin analysis if material or labor costs change by more than 5%.`, priority: "LOW", expected_benefit: "Sustains healthy margin position within portfolio." };
  }

  // ── Assumptions Used ──────────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName: params.toolName,
    generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId: params.traceId,
  };
}
