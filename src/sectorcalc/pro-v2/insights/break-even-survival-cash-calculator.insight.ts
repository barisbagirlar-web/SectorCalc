// SectorCalc PRO V2 — Break-Even Survival Cash Insight Report
// Expected sections per Phase 3B (Investment Tools): NPV, IRR, payback, decision state, hurdle-rate, scenarios.

import type {
  ProInsightReport, InsightKpi, DecisionState,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

export function buildBreakEvenReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  const monthlyBre = outputs.out_demand_metric ?? 0;
  const cf = outputs.out_capacity_metric ?? 0;
  const cmRatio = outputs.out_utilization_margin ?? 0;
  const moneyAtRisk = outputs.out_money_at_risk ?? 0;
  const survGap = Math.max(0, outputs.out_scenario_delta ?? 0);
  const stress = outputs.out_derating_factor ?? 0.8;
  const decisionScore = outputs.out_final_decision_state ?? 0;

  const ci = engineInputs.initial_investment ?? 0;
  const oh = engineInputs.overhead_rate ?? 0;
  const vol = engineInputs.annual_volume ?? 0;
  const dr = engineInputs.discount_rate ?? 10;
  const yrs = engineInputs.analysis_years ?? 5;
  const stressVal = engineInputs.stress_downside_factor ?? 0.8;

  const cashRunway = oh > 0 ? ci / oh : 0;
  const annualNpv = moneyAtRisk; // using negative risk as proxy

  const primaryKpi: InsightKpi = {
    label: "Monthly Break-Even Revenue",
    value: currency(monthlyBre), unit: "USD/month",
    severity: survGap <= 0 ? "OK" : survGap > ci * 0.1 ? "CRITICAL" : "WARNING",
    explanation: `Monthly break-even revenue target: ${currency(monthlyBre)}. Survival gap: ${currency(survGap)}. Cash runway: ${fmt(cashRunway, 1)} months.`,
  };

  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Stable", summary: `NPV positive. Survival gap closed. Cash runway: ${fmt(cashRunway, 1)} months.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "REVIEW", label: "Review Required", summary: `Cash flow stressed. Gap of ${currency(survGap)} needs attention.` };
  } else {
    decisionState = { state: "LOSS", label: "At Risk", summary: `Survival gap of ${currency(survGap)}. Investment may not be sustainable.` };
  }

  const execInterpretation =
    `Monthly break-even revenue: ${currency(monthlyBre)}. Survival gap: ${currency(survGap)}. ` +
    `Cash runway: ${fmt(cashRunway, 1)} months at current overhead. ` +
    `Contribution margin ratio: ${fmt(cmRatio * 100)}%. Money at risk under ${fmt(stress * 100)}% stress: ${currency(moneyAtRisk)}.`;

  const calculatedValues: CalculatedValue[] = [
    { label: "Monthly Break-Even Revenue", value: currency(monthlyBre), unit: "USD/month", formula_ref: "Fixed costs ÷ Contribution margin ratio" },
    { label: "Cash Runway", value: `${fmt(cashRunway, 1)} months`, unit: "months", formula_ref: "Cash reserves ÷ Monthly burn" },
    { label: "Survival Gap", value: currency(Math.max(0, survGap)), unit: "USD", formula_ref: "Required revenue − Actual volume" },
    { label: "Contribution Margin Ratio", value: `${fmt(cmRatio * 100)}%`, unit: "%", formula_ref: "Cash flow − Variable costs ÷ Cash flow" },
    { label: "Money at Risk (Stress)", value: currency(moneyAtRisk), unit: "USD", formula_ref: "Gap × Stress factor" },
    { label: "Annual Net Cash Flow", value: currency(cf), unit: "USD", formula_ref: "User input" },
  ];

  const hiddenLosses: HiddenLossItem[] = [
    { title: "Revenue Concentration Risk", description: "If revenue depends on few customers, a single loss could widen the gap.", potential_impact: currency(survGap * 0.5), severity: "MEDIUM" },
    { title: "Delayed Receivables", description: "Cash flow assumes timely payment. 30-60 day delays increase working capital needs.", potential_impact: currency(cf * 0.08), severity: "MEDIUM" },
    { title: "Unplanned Maintenance", description: "Equipment downtime reduces throughput and revenue capacity.", potential_impact: currency(monthlyBre * 0.1), severity: "LOW" },
  ];

  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Cash Flow Timing", description: "Annual net cash flow is averaged. Seasonal or quarterly variations may create short-term gaps.", impact_on_result: `Short-term gap could be ${currency(cf * 0.2)} larger.` },
    { title: "Fixed Costs May Not Be Fixed", description: "Some overhead costs may scale with revenue, affecting break-even calculation.", impact_on_result: "Break-even point could shift by 10-15%." },
    { title: "Stress Factor May Not Capture Extreme Scenarios", description: "Downside factor of ${fmt(stressVal)} may not cover worst-case revenue drop.", impact_on_result: "Survival gap could double in extreme scenario." },
  ];

  const riskWarnings: RiskWarning[] = [
    { title: survGap > 0 ? "Survival Gap Detected" : "Cash Flow Positive", description: survGap > 0 ? `Revenue shortfall of ${currency(survGap)}.` : "Current revenue covers costs.", severity: survGap > 0 ? "CRITICAL" : "INFO" },
    { title: "Cash Runway", description: `Cash reserves cover ${fmt(cashRunway, 1)} months of overhead.`, severity: cashRunway < 6 ? "WARNING" : cashRunway < 12 ? "INFO" : "INFO", mitigation: cashRunway < 6 ? "Target minimum 6 months runway." : "" },
    { title: "Contribution Margin", description: cmRatio < 0.2 ? `Low margin ratio of ${fmt(cmRatio * 100)}%. Small revenue drops cause losses.` : `Healthy margin ratio of ${fmt(cmRatio * 100)}%.`, severity: cmRatio < 0.2 ? "WARNING" : "INFO" },
  ];

  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Revenue Drop", change: `-${fmt((1 - stressVal) * 100)}%`, impact: `${currency(moneyAtRisk)} loss risk`, severity: moneyAtRisk > 0 ? "HIGH" : "LOW" },
    { parameter: "Overhead Increase", change: "+10%", impact: `${currency(monthlyBre * 0.10)} higher break-even`, severity: "MEDIUM" },
    { parameter: "Volume Decline", change: "-20%", impact: vol > 0 ? `${currency(survGap * 0.2)} wider gap` : "N/A", severity: "MEDIUM" },
  ];

  const checklist: ChecklistItem[] = [
    { item: "Revenue forecast supported by order book or contracts", status: "REVIEW", details: "Confirm committed vs. pipeline revenue." },
    { item: "Cost structure verified (fixed vs. variable split)", status: "REVIEW", details: "Review actual cost behavior." },
    { item: "Cash reserves confirmed by bank records", status: "REVIEW", details: "Verify available liquid reserves." },
    { item: "Stress scenario tested against historical downturns", status: "REVIEW", details: "Compare with past revenue drops." },
    { item: "Overhead allocation basis reviewed", status: "REVIEW", details: "Confirm which costs are truly fixed." },
    { item: "Receivables collection period reviewed", status: "REVIEW", details: "Average days outstanding impacts cash flow." },
  ];

  let recommendedAction: RecommendedAction;
  if (survGap <= 0 && cashRunway >= 6) {
    recommendedAction = { action: "Financial position appears sustainable. Monitor quarterly.", priority: "LOW", expected_benefit: "Maintains financial health." };
  } else if (survGap <= 0) {
    recommendedAction = { action: `Build cash reserves to extend runway beyond ${fmt(cashRunway, 1)} months.`, priority: "MEDIUM", expected_benefit: `Reduces risk from ${fmt(cashRunway, 1)}-month runway.` };
  } else {
    recommendedAction = { action: `Immediate action required: Close survival gap of ${currency(survGap)} through cost reduction or revenue increase.`, priority: "HIGH", expected_benefit: "Eliminates financial stress." };
  }

  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution: [], calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed, traceId,
    totalCost: currency(moneyAtRisk),
    keyCostDriver: oh > ci ? "Overhead" : "Investment",
  };
}
