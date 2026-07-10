// SectorCalc PRO V2 — Loss Making Job Detector Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

export function buildLossDetectorReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  const price = outputs.out_normalized_demand ?? 0;
  const gm = outputs.out_demand_metric ?? 0;
  const map = outputs.out_capacity_metric ?? 0;
  const cm = outputs.out_utilization_margin ?? 0;
  const loss = Math.abs(outputs.out_money_at_risk ?? 0);
  const decisionScore = outputs.out_final_decision_state ?? 0;
  const tm = engineInputs.target_margin ?? 25;

  const marginPct = cm * 100;
  const isLossMaking = gm < 0;

  const primaryKpi: InsightKpi = {
    label: isLossMaking ? "Loss per Batch" : "Gross Margin per Batch",
    value: isLossMaking ? currency(Math.abs(gm)) : currency(gm), unit: "USD",
    severity: isLossMaking ? "CRITICAL" : marginPct >= tm ? "OK" : "WARNING",
    explanation: isLossMaking
      ? `This job loses ${currency(Math.abs(gm))} per batch. Total annual loss risk: ${currency(loss)}.`
      : `Gross margin ${currency(gm)} (${fmt(marginPct)}%) per batch. Annual loss risk: ${currency(loss)}.`,
  };

  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Profitable", summary: `Margin ${fmt(marginPct)}% meets or exceeds target.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "At Risk", summary: `Margin ${fmt(marginPct)}% is below target. Review pricing or costs.` };
  } else {
    decisionState = { state: "LOSS", label: "Loss Position", summary: `Job is loss-making. Total cost ${currency(map)} exceeds price ${currency(price)}.` };
  }

  const execInterpretation = isLossMaking
    ? `This job is currently loss-making. Batch price ${currency(price)} is below the cost floor of ${currency(map)}. ` +
      `The loss per batch is ${currency(Math.abs(gm))}. Over ${fmt(engineInputs.annual_volume ?? 0)} units/year, the potential loss is ${currency(loss)}. ` +
      `A revised price of ${currency(map * 1.15)} is needed for a 15% margin.`
    : `This job is profitable. Batch price ${currency(price)} exceeds cost floor ${currency(map)}. ` +
      `Current margin ${fmt(marginPct)}% vs target ${fmt(tm)}%.`;

  const mr = engineInputs.machine_rate ?? 0;
  const mc = engineInputs.material_cost ?? 0;
  const lr = engineInputs.labor_rate ?? 0;
  const oh = engineInputs.overhead_rate ?? 0;
  const dc = engineInputs.defect_or_loss_cost ?? 0;
  const totalCost = mr + mc + lr + oh + dc;
  const totalForPct = totalCost || 1;

  const costDistribution: CostDistributionItem[] = [
    { category: "Machine Cost", amount: mr, percentage: (mr / totalForPct) * 100 },
    { category: "Material Cost", amount: mc, percentage: (mc / totalForPct) * 100 },
    { category: "Labor Cost", amount: lr, percentage: (lr / totalForPct) * 100 },
    { category: "Overhead Cost", amount: oh, percentage: (oh / totalForPct) * 100 },
    { category: "Defect/Loss Cost", amount: dc, percentage: (dc / totalForPct) * 100 },
  ];

  const calculatedValues: CalculatedValue[] = [
    { label: "Total Cost per Batch", value: currency(map), unit: "USD", formula_ref: "Sum of all cost components" },
    { label: "Batch Price", value: currency(price), unit: "USD", formula_ref: "Machine rate × batch quantity" },
    { label: "Gross Margin per Batch", value: currency(gm), unit: "USD", formula_ref: "Price − Total Cost" },
    { label: "Margin Percentage", value: `${fmt(marginPct)}%`, unit: "%", formula_ref: "Gross margin ÷ Price" },
    { label: "Annual Loss at Risk", value: currency(loss), unit: "USD", formula_ref: "Loss per unit × annual volume" },
    { label: "Break-Even Price", value: currency(map), unit: "USD", formula_ref: "Total cost at zero margin" },
  ];

  const hiddenLosses: HiddenLossItem[] = [
    { title: "Hidden Setup Cost", description: "Setup time cost may not be fully captured in machine rate.", potential_impact: currency(mr * 0.1), severity: "MEDIUM" },
    { title: "Quality Rework", description: "Defect cost may underestimate actual rework and inspection costs.", potential_impact: currency(dc * 0.5), severity: "MEDIUM" },
    { title: "Material Waste", description: "Scrap and material waste beyond defect allowance increase actual cost.", potential_impact: currency(mc * 0.05), severity: "LOW" },
  ];

  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Batch Price Based on Machine Rate Only", description: "Pricing formula uses machine rate × batch quantity. Other costs may not be recovered.", impact_on_result: `Actual margin may be ${fmt(marginPct * 0.8)}% of calculated.` },
    { title: "Defect Cost May Be Understated", description: "Only direct defect cost captured. Lost customer goodwill excluded.", impact_on_result: `True loss cost is higher by factor of 2-3x.` },
    { title: "Overhead Allocation", description: "Overhead per unit assumes even distribution across all jobs.", impact_on_result: "Complex jobs may absorb more overhead." },
  ];

  const riskWarnings: RiskWarning[] = [
    { title: isLossMaking ? "Loss-Making Job Detected" : "Margin Below Target", description: isLossMaking ? `Immediate action required. Loss of ${currency(Math.abs(gm))} per batch.` : `Current margin ${fmt(marginPct)}% is below ${fmt(tm)}% target.`, severity: isLossMaking ? "CRITICAL" : "WARNING" },
    { title: "Volume Risk", description: `At ${fmt(engineInputs.annual_volume ?? 0)} units, annual loss risk of ${currency(loss)}.`, severity: loss > 0 ? "WARNING" : "INFO" },
    { title: "Price Competitiveness", description: `Required price for ${fmt(tm)}% margin: ${currency(map * (1 + tm / 100))}. Benchmark against market.`, severity: "INFO" },
  ];

  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Machine Rate", change: "-10%", impact: mr > 0 ? `${currency(mr * 0.1)} cost reduction` : "N/A", severity: marginPct < tm ? "HIGH" : "MEDIUM" },
    { parameter: "Material Cost", change: "+10%", impact: mc > 0 ? `${currency(mc * 0.1)} increase` : "N/A", severity: "MEDIUM" },
    { parameter: "Selling Price", change: "+5%", impact: price > 0 ? `${currency(price * 0.05)} additional margin` : "N/A", severity: "HIGH" },
  ];

  const checklist: ChecklistItem[] = [
    { item: "Machine rate verified against cost records", status: "REVIEW", details: "Verify depreciation, energy, maintenance components." },
    { item: "Material cost confirmed with purchasing", status: "REVIEW", details: "Use latest supplier pricing." },
    { item: "Labor rate includes all employment costs", status: "REVIEW", details: "Verify with payroll records." },
    { item: "Defect cost based on quality data", status: "REVIEW", details: "Review scrap and rework records." },
    { item: "Target margin aligned with strategy", status: "REVIEW", details: "Confirm with management." },
    { item: "Volume assumption supported by forecast", status: "REVIEW", details: "Use committed orders not pipeline." },
  ];

  let recommendedAction: RecommendedAction;
  if (decisionScore === 0) {
    recommendedAction = { action: "Maintain pricing. Monitor costs for changes.", priority: "LOW", expected_benefit: "Sustains margin." };
  } else if (decisionScore === 1) {
    recommendedAction = { action: `Review cost drivers. Target cost reduction of ${currency(totalCost * 0.08)} per batch.`, priority: "HIGH", expected_benefit: `Improves margin to ${fmt(tm)}%.` };
  } else {
    recommendedAction = { action: `Revise job price to ${currency(map * 1.15)} or reject unprofitable work.`, priority: "HIGH", expected_benefit: "Eliminates loss position." };
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
    totalCost: currency(map), marginPercent: `${fmt(marginPct)}%`, marginAmount: currency(gm),
  };
}
