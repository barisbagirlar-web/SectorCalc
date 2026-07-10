// SectorCalc PRO V2 — True Employee Cost Statement Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

export function buildEmployeeCostReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  const agw = outputs.out_normalized_demand ?? 0;
  const tec = outputs.out_capacity_metric ?? 0;
  const br = outputs.out_utilization_margin ?? 0;
  const hec = outputs.out_demand_metric ?? 0;
  const additionalCost = outputs.out_money_at_risk ?? 0;
  const decisionScore = outputs.out_final_decision_state ?? 0;

  // Derived
  const burdenPct = agw > 0 ? ((tec - agw) / agw) * 100 : 0;
  const productiveHrs = 2080 * 0.8; // standard assumption
  const excessBurden = br > 1.5 ? (br - 1.5) * 100 : 0;

  const primaryKpi: InsightKpi = {
    label: "Total Employment Cost", value: currency(tec), unit: "USD/year",
    severity: br > 2.0 ? "CRITICAL" : br > 1.5 ? "WARNING" : "OK",
    explanation: `Gross pay: ${currency(agw)}. Total cost: ${currency(tec)}. Burden ratio: ${fmt(br, 2)}x. Effective hourly: ${currency(hec)}.`,
  };

  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "INFO", label: "Within Range", summary: `Burden ratio ${fmt(br, 2)}x is within normal range (1.25-1.5x).` };
  } else {
    decisionState = { state: "REVIEW", label: "Elevated Burden", summary: `Burden ratio ${fmt(br, 2)}x exceeds 1.5x threshold. Review non-wage costs.` };
  }

  const execInterpretation =
    `Total employment cost for this role is ${currency(tec)}/year, compared to gross pay of ${currency(agw)}. ` +
    `The burden ratio is ${fmt(br, 2)}x (${fmt(burdenPct)}% on top of base salary). ` +
    `Effective hourly cost: ${currency(hec)}/productive hour. ` +
    `Additional costs beyond salary: ${currency(additionalCost)}.`;

  // Cost breakdown
  const et = agw * 0.225;
  const hi = 5000;
  const rc = agw * 0.05;
  const plc = agw * 0.08;
  const otb = agw * 0.03;
  const tc = 2000;
  const totalForPct = tec || 1;

  const costDistribution: CostDistributionItem[] = [
    { category: "Base Salary/Wages", amount: agw, percentage: (agw / totalForPct) * 100 },
    { category: "Employer Taxes (22.5%)", amount: et, percentage: (et / totalForPct) * 100 },
    { category: "Health Insurance", amount: hi, percentage: (hi / totalForPct) * 100 },
    { category: "Retirement Contributions (5%)", amount: rc, percentage: (rc / totalForPct) * 100 },
    { category: "Paid Leave (8%)", amount: plc, percentage: (plc / totalForPct) * 100 },
    { category: "Other Benefits & Training", amount: otb + tc, percentage: ((otb + tc) / totalForPct) * 100 },
  ];

  const calculatedValues: CalculatedValue[] = [
    { label: "Gross Annual Pay", value: currency(agw), unit: "USD", formula_ref: "User input (annualized if hourly)" },
    { label: "Total Employment Cost", value: currency(tec), unit: "USD", formula_ref: "Sum of all cost components" },
    { label: "Burden Ratio", value: `${fmt(br, 2)}x`, unit: "x", formula_ref: "Total cost ÷ Base salary" },
    { label: "Effective Hourly Cost", value: currency(hec), unit: "USD/h", formula_ref: "Total cost ÷ Productive hours" },
    { label: "Additional Costs Beyond Salary", value: currency(additionalCost), unit: "USD", formula_ref: "Total cost − Gross pay" },
    { label: "Burden Percentage", value: `${fmt(burdenPct)}%`, unit: "%", formula_ref: "Additional cost ÷ Base salary × 100" },
  ];

  const hiddenLosses: HiddenLossItem[] = [
    { title: "Unproductive Time", description: "Non-billable time (training, meetings, admin) reduces effective hourly value.", potential_impact: currency(hec * 200), severity: "MEDIUM" },
    { title: "Turnover Cost", description: "Employee replacement cost (recruitment, training) is not included in this estimate.", potential_impact: currency(agw * 0.2), severity: "MEDIUM" },
    { title: "Facility & Equipment", description: "Desk, IT equipment, and facility cost per employee not included.", potential_impact: currency(tec * 0.05), severity: "LOW" },
    { title: "Overtime Premium", description: "Overtime pay at 1.5x rate increases effective hourly cost significantly.", potential_impact: currency(hec * 0.15), severity: "HIGH" },
  ];

  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Benefits May Vary", description: "Health insurance cost of $5,000 is an estimate. Actual varies by plan and location.", impact_on_result: `Could differ by ${currency(hi * 0.5)}.` },
    { title: "Productive Hours Assumption", description: "1,664 productive hours (80% of 2,080) is a standard estimate. Actual utilization varies.", impact_on_result: `Effective hourly cost varies by ±${currency(hec * 0.1)}.` },
    { title: "Tax Rate Assumption", description: "22.5% effective tax rate is an estimate. Actual employer tax rate depends on jurisdiction.", impact_on_result: "Tax cost could vary by 2-5 percentage points." },
  ];

  const riskWarnings: RiskWarning[] = [
    { title: "Burden Ratio", description: br > 1.5 ? `Ratio of ${fmt(br, 2)}x exceeds typical 1.25-1.5x range. Review non-wage costs.` : `Ratio of ${fmt(br, 2)}x is within range.`, severity: br > 1.5 ? "WARNING" : "INFO" },
    { title: "Hourly Cost Competitiveness", description: `Effective hourly cost of ${currency(hec)} should be benchmarked against market.`, severity: "INFO", mitigation: "Compare with industry benchmarks." },
    { title: "Benefits Cost Escalation", description: "Health insurance and benefits costs typically increase 5-10% annually.", severity: "WARNING", mitigation: "Include escalation in multi-year planning." },
  ];

  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Salary Increase", change: "+10%", impact: agw > 0 ? `${currency(agw * 0.1)} increase to total cost` : "N/A", severity: "MEDIUM" },
    { parameter: "Health Insurance", change: "+20%", impact: `${currency(hi * 0.2)} increase`, severity: "LOW" },
    { parameter: "Productive Hours", change: "-10%", impact: hec > 0 ? `${currency(hec * 0.11)}/h increase` : "N/A", severity: "LOW" },
  ];

  const checklist: ChecklistItem[] = [
    { item: "Gross salary verified against employment contract", status: "REVIEW", details: "Confirm base pay or hourly rate." },
    { item: "Employer tax rate confirmed for jurisdiction", status: "REVIEW", details: "Verify with payroll or tax advisor." },
    { item: "Benefits costs from actual plan documents", status: "REVIEW", details: "Review health, retirement, and other benefits." },
    { item: "Productive hours estimate based on role", status: "REVIEW", details: "Field vs. office roles have different utilization." },
    { item: "Overtime policy and expected premium reviewed", status: "REVIEW", details: "Factor in expected overtime hours." },
    { item: "Benchmark against industry data", status: "REVIEW", details: "Compare burden ratio with sector peers." },
  ];

  let recommendedAction: RecommendedAction;
  if (br <= 1.5) {
    recommendedAction = { action: "Cost structure is within normal range. Use for budgeting and quoting labor.", priority: "MEDIUM", expected_benefit: "Accurate labor costing for pricing decisions." };
  } else {
    recommendedAction = { action: `Review non-wage cost components. Target burden ratio reduction from ${fmt(br, 2)}x to 1.5x.`, priority: "HIGH", expected_benefit: `Potential savings of ${currency(tec - agw * 1.5)} per employee.` };
  }

  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed, traceId,
    totalCost: currency(tec), marginPercent: `${fmt(burdenPct)}%`, keyCostDriver: agw > et ? "Base Salary" : "Employer Taxes",
  };
}
