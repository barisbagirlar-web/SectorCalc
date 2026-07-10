// SectorCalc PRO V2 — Job Quote Builder Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

export function buildQuoteBuilderReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  const tjc = outputs.out_demand_metric ?? 0;
  const rp = outputs.out_capacity_metric ?? 0;
  const mp = outputs.out_utilization_margin ?? 0;
  const moneyAtRisk = outputs.out_money_at_risk ?? 0;
  const decisionScore = outputs.out_final_decision_state ?? 0;
  const tm = engineInputs.target_margin ?? 30;
  const vol = engineInputs.annual_volume ?? 0;

  const marginPct = mp * 100;
  const annualRevenue = vol > 0 ? rp * vol : 0;
  const annualProfit = vol > 0 ? (rp - tjc) * vol : 0;

  const primaryKpi: InsightKpi = {
    label: "Total Job Cost", value: currency(tjc), unit: "USD",
    severity: marginPct >= tm ? "OK" : marginPct > 0 ? "WARNING" : "CRITICAL",
    explanation: `Cost per batch: ${currency(tjc)}. Required price: ${currency(rp)}.`,
  };

  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Profitable", summary: `Margin ${fmt(marginPct)}% meets or exceeds target of ${fmt(tm)}%.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "At Risk", summary: `Margin ${fmt(marginPct)}% is below target. Review cost components.` };
  } else {
    decisionState = { state: "LOSS", label: "Loss Position", summary: `Job is loss-making. Required price ${currency(rp)} exceeds feasible range.` };
  }

  const execInterpretation = `Total job cost is ${currency(tjc)} with required price ${currency(rp)}. ` +
    `Margin: ${fmt(marginPct)}% (target: ${fmt(tm)}%). Money at risk: ${currency(moneyAtRisk)}. ` +
    `Annual profit projection: ${currency(annualProfit)}.`;

  const machinePerUnit = engineInputs.machine_rate ?? 0;
  const laborPerUnit = engineInputs.labor_rate ?? 0;
  const overheadPerUnit = engineInputs.overhead_rate ?? 0;
  const matPerUnit = engineInputs.material_cost ?? 0;
  const defectCost = engineInputs.defect_or_loss_cost ?? 0;
  const totalForPct = (machinePerUnit + laborPerUnit + matPerUnit + overheadPerUnit + defectCost * 0.1) || 1;

  const costDistribution: CostDistributionItem[] = [
    { category: "Machine Cost", amount: machinePerUnit, percentage: (machinePerUnit / totalForPct) * 100 },
    { category: "Labor Cost", amount: laborPerUnit, percentage: (laborPerUnit / totalForPct) * 100 },
    { category: "Material Cost", amount: matPerUnit, percentage: (matPerUnit / totalForPct) * 100 },
    { category: "Overhead per Batch", amount: overheadPerUnit, percentage: (overheadPerUnit / totalForPct) * 100 },
    { category: "Defect Allowance", amount: defectCost * 0.1, percentage: (defectCost * 0.1 / totalForPct) * 100 },
  ];

  const calculatedValues: CalculatedValue[] = [
    { label: "Total Job Cost", value: currency(tjc), unit: "USD", formula_ref: "Sum of all job cost components" },
    { label: "Required Price", value: currency(rp), unit: "USD", formula_ref: "Total cost × (1 + margin multiplier)" },
    { label: "Achieved Margin", value: `${fmt(marginPct)}%`, unit: "%", formula_ref: "Margin ÷ Revenue" },
    { label: "Annual Revenue Potential", value: currency(annualRevenue), unit: "USD", formula_ref: "Required price × annual volume" },
    { label: "Money at Risk", value: currency(moneyAtRisk), unit: "USD", formula_ref: "Loss per batch × volume" },
  ];

  const hiddenLosses: HiddenLossItem[] = [
    { title: "Setup Time Not Captured", description: "Setup cost may be understated if batch absorbs it over few units.", potential_impact: currency(tjc * 0.05), severity: "MEDIUM" },
    { title: "Scrap Not Factored", description: "Defect allowance only covers 10% of defect cost. Full scrap cost is higher.", potential_impact: currency(defectCost * 0.9), severity: "HIGH" },
    { title: "Tooling Wear", description: "Consumable tooling cost not reflected in machine rate.", potential_impact: currency(machinePerUnit * 0.03), severity: "LOW" },
    { title: "Inspection Cost", description: "Quality inspection and testing add cost not in this estimate.", potential_impact: currency(tjc * 0.02), severity: "LOW" },
  ];

  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Overhead Allocation May Be Inaccurate", description: "Overhead allocated per unit assumes even distribution.", impact_on_result: `Could shift cost by ${currency(overheadPerUnit * 0.2)} per unit.` },
    { title: "Material Price Volatility", description: "Material cost assumed stable for quote period.", impact_on_result: "Price fluctuations affect margin directly." },
    { title: "Uncertainty Multiplier May Not Cover All Risks", description: "The uncertainty multiplier adds a flat buffer.", impact_on_result: "Extreme scenarios may exceed buffer." },
  ];

  const riskWarnings: RiskWarning[] = [
    { title: "Margin Below Target", description: marginPct < tm ? `Current margin ${fmt(marginPct)}% is below target ${fmt(tm)}%.` : "Margin meets target.", severity: marginPct < tm ? "WARNING" : "INFO" },
    { title: "Volume Dependency", description: `At ${fmt(vol)} units, a volume drop directly reduces overhead recovery.`, severity: "WARNING", mitigation: "Verify volume commitment." },
    { title: "Price Competitiveness", description: `Required price of ${currency(rp)} must be benchmarked.`, severity: "INFO", mitigation: "Check market benchmark before quoting." },
  ];

  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Cycle Time", change: "+10%", impact: `${currency(tjc * 0.06)} increase`, severity: "MEDIUM" },
    { parameter: "Material Cost", change: "+10%", impact: machinePerUnit > 0 ? `${currency(matPerUnit * 0.10)} increase` : "N/A", severity: "MEDIUM" },
    { parameter: "Target Margin", change: "+5pp", impact: `${currency(tjc * 0.05)} increase in required price`, severity: "LOW" },
  ];

  const checklist: ChecklistItem[] = [
    { item: "Machine rate verified with actual cost records", status: "REVIEW", details: "Verify depreciation, energy, maintenance components." },
    { item: "Cycle time confirmed by production study", status: "REVIEW", details: "Use actual measured cycle time." },
    { item: "Material cost from latest supplier quote", status: "REVIEW", details: "Confirm pricing validity period." },
    { item: "Labor rate includes benefits and payroll taxes", status: "REVIEW", details: "Verify fully loaded rate with HR." },
    { item: "Overhead allocation method reviewed", status: "REVIEW", details: "Confirm basis and period." },
    { item: "Defect cost based on historical data", status: "REVIEW", details: "Use actual quality cost records." },
  ];

  let recommendedAction: RecommendedAction;
  if (marginPct >= tm) {
    recommendedAction = { action: "Proceed with quote after verifying all input assumptions.", priority: "HIGH", expected_benefit: `Quotes at ${fmt(marginPct)}% margin.` };
  } else if (marginPct > 0) {
    recommendedAction = { action: `Review cost components. Target ${fmt(tm)}% margin.`, priority: "HIGH", expected_benefit: `Bridges ${fmt(tm - marginPct)}pp margin gap.` };
  } else {
    recommendedAction = { action: `Revise quote to minimum ${currency(rp * 1.1)} to achieve positive margin.`, priority: "HIGH", expected_benefit: "Avoids loss-making job." };
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
    totalCost: currency(tjc), marginPercent: `${fmt(marginPct)}%`,
  };
}
