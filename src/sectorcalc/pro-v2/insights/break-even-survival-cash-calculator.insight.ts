// SectorCalc PRO V2 — Break-Even Survival Cash Calculator Insight

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function pct(val: number, decimals = 1): string { return `${fmt(val, decimals)}%`; }
function currency(val: number): string { return val < 0 ? `-$${fmt(Math.abs(val), 2)}` : `$${fmt(val, 2)}`; }

export function buildBreakEvenReport(params: {
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

  const revenue              = O.out_revenue ?? 0;
  const variableCost         = O.out_variable_cost ?? 0;
  const contributionAmount   = O.out_contribution_margin_amount ?? 0;
  const contributionRatio    = O.out_contribution_margin_ratio ?? 0;
  const fixedCost            = O.out_fixed_operating_cost ?? 0;
  const operatingProfit      = O.out_operating_profit_or_loss ?? 0;
  const breRevenue           = O.out_break_even_revenue ?? 0;
  const breUnits             = O.out_break_even_units ?? 0;
  const revenueGap           = O.out_revenue_gap ?? 0;
  const monthlyCashBurn      = O.out_monthly_cash_burn ?? 0;
  const availableCash        = O.out_available_liquidity ?? 0;
  const cashRunwayMonths     = O.out_cash_runway_months ?? 0;
  const mosAmount            = O.out_margin_of_safety_amount ?? 0;
  const mosPercent           = O.out_margin_of_safety_percent ?? 0;
  const primaryDriverIdx     = O.out_primary_survival_driver ?? 0;
  const decisionScore        = O.out_final_decision_state ?? 0;

  const hasBreUnits = breUnits > 0;
  const isLossMaking = operatingProfit < 0;
  const isCashShort = cashRunwayMonths < 6;

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (isLossMaking && isCashShort) {
    kpiLabel = "Cash-Negative with Critical Runway";
    kpiSeverity = "CRITICAL";
  } else if (isLossMaking) {
    kpiLabel = "Operating at a Loss";
    kpiSeverity = "CRITICAL";
  } else if (mosPercent < 10 || cashRunwayMonths < 6) {
    kpiLabel = "Thin Margin — Review Required";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Break-Even Position Achieved";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: `${currency(operatingProfit)} / ${fmt(cashRunwayMonths, 1)}mo`,
    unit: "USD / months",
    severity: kpiSeverity,
    explanation: `Operating profit ${currency(operatingProfit)} with cash runway ${fmt(cashRunwayMonths, 1)} months. Break-even revenue ${currency(breRevenue)}.`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Financially Stable", summary: `Revenue ${currency(revenue)} exceeds break-even ${currency(breRevenue)} with margin of safety ${pct(mosPercent)} and ${fmt(cashRunwayMonths,1)} months cash runway.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "Breakeven at Risk", summary: `Operating profit ${currency(operatingProfit)} with cash runway ${fmt(cashRunwayMonths,1)} months. Consider cost reduction or price adjustments.` };
  } else {
    decisionState = { state: "LOSS", label: "Below Break-Even", summary: `Revenue ${currency(revenue)} does not cover costs. Operating loss ${currency(Math.abs(operatingProfit))}. Immediate action required.` };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  const driverLabels = ["Insufficient Revenue Volume", "High Fixed Cost Base", "Low Contribution Margin"];
  const driverLabel = primaryDriverIdx >= 0 && primaryDriverIdx < driverLabels.length ? driverLabels[primaryDriverIdx] : "Unknown";
  const execInterpretation =
    `This analysis shows a business generating ${currency(revenue)} in annual revenue with variable costs of ${currency(variableCost)} ` +
    `(${pct(variableCost / revenue * 100)} of revenue) and fixed operating costs of ${currency(fixedCost)}. ` +
    `The contribution margin is ${pct(contributionRatio * 100)} resulting in an operating profit of ${currency(operatingProfit)}. ` +
    `Break-even revenue is ${currency(breRevenue)}${hasBreUnits ? ` (or ${fmt(breUnits,0)} units)` : ""}. ` +
    `Available liquidity of ${currency(availableCash)} provides approximately ${fmt(cashRunwayMonths,1)} months of cash runway. ` +
    `The margin of safety is ${pct(mosPercent)} (${currency(mosAmount)}). ` +
    `The primary survival concern is: ${driverLabel}.`;

  // ── Cost Distribution ─────────────────────────────────────────────
  const total = revenue > 0 ? revenue : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Variable Costs", amount: variableCost, percentage: parseFloat(((variableCost / total) * 100).toFixed(1)) },
    { category: "Fixed Operating Costs", amount: fixedCost, percentage: parseFloat(((fixedCost / total) * 100).toFixed(1)) },
    { category: "Operating Profit", amount: operatingProfit > 0 ? operatingProfit : 0, percentage: operatingProfit > 0 ? parseFloat(((operatingProfit / total) * 100).toFixed(1)) : 0 },
  ];
  if (operatingProfit < 0) {
    costDistribution.push({ category: "Operating Loss", amount: Math.abs(operatingProfit), percentage: parseFloat(((Math.abs(operatingProfit) / total) * 100).toFixed(1)) });
  }

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Break-Even Revenue", value: currency(breRevenue), unit: "per year" },
    { label: "Contribution Margin Ratio", value: pct(contributionRatio * 100), unit: "%" },
    { label: "Margin of Safety", value: pct(mosPercent), unit: "%" },
    { label: "Cash Runway", value: `${fmt(cashRunwayMonths, 1)} months`, unit: "months" },
    { label: "Revenue Gap", value: currency(revenueGap), unit: "per year" },
    { label: "Monthly Cash Burn", value: currency(monthlyCashBurn), unit: "per month" },
  ];
  if (hasBreUnits) {
    calculatedValues.push({ label: "Break-Even Units", value: fmt(breUnits, 0), unit: "units/year" });
  }

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Unallocated Fixed Costs",
      description: "Some fixed costs may be hidden in COGS or absorbed by other product lines",
      potential_impact: `${currency(fixedCost * 0.1)}/yr`,
      severity: fixedCost > revenue * 0.3 ? "HIGH" : "MEDIUM",
    },
    {
      title: "Working Capital Strain",
      description: "Cash conversion cycle may extend beyond break-even point",
      potential_impact: `Up to ${fmt(cashRunwayMonths * 0.3, 1)} months additional runway pressure`,
      severity: cashRunwayMonths < 12 ? "HIGH" : "MEDIUM",
    },
    {
      title: "Unpriced Customer Discounts",
      description: "Volume discounts and payment terms may erode effective selling price below break-even",
      potential_impact: `${currency(revenue * 0.03)}/yr potential erosion`,
      severity: "MEDIUM",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Variable Cost Stability",
      description: "Assumes variable cost percentage remains constant at all volume levels",
      impact_on_result: "Actual costs may increase at lower volumes (loss of purchasing power)",
    },
    {
      title: "Fixed Cost Step Changes",
      description: "Significant revenue growth may require step changes in fixed costs (hiring, space)",
      impact_on_result: `${currency(fixedCost * 0.2)} potential incremental fixed costs at scale`,
    },
    {
      title: "Seasonal Cash Flow Patterns",
      description: "Annual averages mask seasonal peaks and troughs in cash position",
      impact_on_result: `Actual cash runway may be ${fmt(cashRunwayMonths * 0.5, 1)} months or less during low seasons`,
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (mosPercent < 10) {
    riskWarnings.push({ title: "Low Margin of Safety", description: `A ${pct(mosPercent)} margin of safety means a small revenue drop makes the business unprofitable`, severity: "CRITICAL", mitigation: "Build cost buffers or diversify revenue" });
  }
  if (cashRunwayMonths < 6) {
    riskWarnings.push({ title: "Critical Cash Runway", description: `Only ${fmt(cashRunwayMonths,1)} months of cash reserves available`, severity: "CRITICAL", mitigation: "Secure additional liquidity or reduce fixed costs immediately" });
  }
  if (contributionRatio < 0.15) {
    riskWarnings.push({ title: "Low Contribution Margin", description: `${pct(contributionRatio*100)} contribution margin leaves little room for fixed costs`, severity: "WARNING", mitigation: "Review pricing and variable cost structure" });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({ title: "Price Sensitivity", description: "Customers may resist price increases needed to improve break-even position", severity: "INFO", mitigation: "Consider value-add differentiation" });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Revenue Drop (-10%)", change: "-10%", impact: `Profit changes by ${currency(operatingProfit - (revenue * 0.9 - variableCost * 0.9 - fixedCost))}`, severity: contributionRatio > 0.2 ? "LOW" : "HIGH" },
    { parameter: "Fixed Cost Increase (+15%)", change: "+15%", impact: `Profit reduced by ${currency(fixedCost * 0.15)}`, severity: fixedCost > revenue * 0.3 ? "HIGH" : "MEDIUM" },
    { parameter: "Variable Cost Increase (+5pp)", change: "+5pp", impact: `Contribution reduced by ${currency(revenue * 0.05)}`, severity: "MEDIUM" },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Revenue projections validated against historical data", status: "ASSUMED", details: "Based on provided annual revenue figure" },
    { item: "Variable cost breakdown reviewed by category", status: "REVIEW", details: "Single percentage used — recommend detailed cost audit" },
    { item: "Fixed costs verified as truly fixed (not semi-variable)", status: "ASSUMED", details: "Step-cost behavior not modeled" },
    { item: "Liquidity position confirmed with current bank/cash statements", status: "ASSUMED", details: "Based on provided available cash figure" },
    { item: "Seasonal cash flow patterns identified", status: "REVIEW", details: "Annual average used — monthly analysis recommended" },
    { item: "Debt service and lease obligations included in fixed costs", status: "REVIEW", details: "Verify all financial obligations are captured" },
    { item: "Tax impact considered", status: "NOT CHECKED", details: "Tax effects not modeled in this analysis" },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (isLossMaking && isCashShort) {
    recommendedAction = { action: `Immediate cost restructuring required. Reduce fixed costs by ${currency(fixedCost * 0.2)} and secure additional liquidity of ${currency(monthlyCashBurn * 6)} to extend runway.`, priority: "HIGH", expected_benefit: "Restores positive cash flow and extends survival horizon." };
  } else if (isLossMaking) {
    recommendedAction = { action: `Increase revenue to ${currency(breRevenue)} (gap of ${currency(revenueGap)}) or reduce fixed costs by ${currency(Math.abs(operatingProfit))}.`, priority: "HIGH", expected_benefit: "Achieves break-even operating position." };
  } else if (mosPercent < 15) {
    recommendedAction = { action: `Build margin of safety. Target revenue increase of ${pct(15 - mosPercent)} or fixed cost reduction of ${currency(fixedCost * 0.1)}.`, priority: "MEDIUM", expected_benefit: `Strengthens margin of safety to 15%+.` };
  } else {
    recommendedAction = { action: `Maintain current position. Monitor costs monthly and review break-even quarterly.`, priority: "LOW", expected_benefit: "Sustains financial stability." };
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
