// SectorCalc PRO V2 — Job Quote Builder Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val, 2)}`; }

const DRIVER_NAMES: Record<number, string> = {
  0: "Material", 1: "Machine", 2: "Labor", 3: "Overhead",
  4: "Tooling", 5: "External Processing", 6: "Packaging", 7: "Freight", 8: "Other",
};

export function buildQuoteBuilderReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;
  const O = outputs;

  const totalCost = O.out_total_job_cost_per_batch ?? 0;
  const costPerUnit = O.out_cost_per_good_unit ?? 0;
  const targetPriceBatch = O.out_target_sell_price_per_batch ?? 0;
  const targetPriceUnit = O.out_target_sell_price_per_unit ?? 0;
  const profitBatch = O.out_profit_per_batch ?? 0;
  const profitUnit = O.out_profit_per_unit ?? 0;
  const annualRevenue = O.out_annual_revenue_at_target ?? 0;
  const annualProfit = O.out_annual_profit_at_target ?? 0;
  const driverCode = O.out_primary_cost_driver ?? 0;
  const decisionScore = O.out_final_decision_state ?? 0;

  const curQuotePerBatch = O.out_current_quote_per_batch ?? 0;
  const curProfitPerBatch = O.out_current_profit_per_batch ?? 0;
  const curMarginPct = O.out_achieved_margin_percent ?? 0;
  const priceGapPerUnit = O.out_price_gap_per_unit ?? 0;
  const underpricingRisk = O.out_annual_underpricing_risk ?? 0;
  const beQty = O.out_break_even_batch_quantity ?? 0;
  const beStatus = O.out_break_even_status ?? 0;

  const tm = engineInputs.target_revenue_margin_percent ?? 30;
  const hasQuote = (engineInputs.current_quote_per_unit ?? 0) > 0;
  const marginPct = targetPriceBatch > 0 ? (profitBatch / targetPriceBatch) * 100 : 0;
  const achievedMargin = hasQuote && curQuotePerBatch > 0 ? curMarginPct : marginPct;

  // ── Primary KPI ─────────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Total Job Cost per Batch",
    value: currency(totalCost),
    unit: "USD",
    severity: decisionScore === 0 ? "OK" : decisionScore === 1 ? "WARNING" : "CRITICAL",
    explanation: `Cost per good unit: ${currency(costPerUnit)}. Target sell price: ${currency(targetPriceUnit)} per unit.`,
  };

  // ── Decision State ──────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = {
      state: "PROFITABLE",
      label: "Target Margin Achievable",
      summary: `Job cost ${currency(costPerUnit)} per unit, target price ${currency(targetPriceUnit)} yields ${fmt(marginPct)}% revenue margin.${hasQuote ? ` Current quote ${currency(engineInputs.current_quote_per_unit ?? 0)} per unit.` : ""}`,
    };
  } else if (decisionScore === 1) {
    decisionState = {
      state: "AT_RISK",
      label: "Margin Below Target",
      summary: `Achieved margin ${fmt(achievedMargin)}% is below target ${fmt(tm)}%. Review cost components and pricing.`,
    };
  } else {
    decisionState = {
      state: "REVIEW",
      label: "Calculation Review",
      summary: "Invalid input combination requires review. Correct inputs to unblock calculation.",
    };
  }

  // ── Executive Interpretation ────────────────────────────────────────
  const execInterpretation = `Total job cost is ${currency(totalCost)} for batch of ${fmt(engineInputs.batch_quantity ?? 0)} units, yielding ${currency(costPerUnit)} per good unit. ` +
    `Target sell price of ${currency(targetPriceUnit)} per unit produces ${fmt(marginPct)}% revenue margin (target: ${fmt(tm)}%). ` +
    `${hasQuote ? `Current market quote of ${fmt(engineInputs.current_quote_per_unit ?? 0)} per unit results in ${fmt(curMarginPct)}% achieved margin with annual underpricing risk of ${currency(underpricingRisk)}. ` : ""}` +
    `Primary cost driver: ${DRIVER_NAMES[driverCode] ?? "Unknown"}.`;

  // ── Cost Distribution ───────────────────────────────────────────────
  const costComponents = [
    { cat: "Material", val: O.out_material_cost_before_scrap ?? 0 },
    { cat: "Machine", val: O.out_machine_cost_per_batch ?? 0 },
    { cat: "Labor", val: O.out_labor_cost_per_batch ?? 0 },
    { cat: "Overhead", val: O.out_overhead_cost_per_batch ?? 0 },
    { cat: "Tooling", val: O.out_tooling_consumables_cost_per_batch ?? 0 },
    { cat: "External Proc.", val: O.out_external_processing_cost_per_batch ?? 0 },
    { cat: "Packaging", val: O.out_packaging_cost_per_batch ?? 0 },
    { cat: "Freight", val: O.out_freight_cost_per_batch ?? 0 },
    { cat: "Other", val: O.out_other_job_cost_per_batch ?? 0 },
    { cat: "Scrap Allow.", val: O.out_scrap_rework_allowance ?? 0 },
    { cat: "Contingency", val: O.out_contingency_allowance ?? 0 },
  ].filter(c => c.val > 0);
  const totalForPct = costComponents.reduce((s, c) => s + c.val, 0) || 1;
  const costDistribution: CostDistributionItem[] = costComponents.map(c => ({
    category: c.cat,
    amount: c.val,
    percentage: (c.val / totalForPct) * 100,
  }));

  // ── Calculated Values ───────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Total Job Cost per Batch", value: currency(totalCost), unit: "USD", formula_ref: "Sum of all cost components" },
    { label: "Cost per Good Unit", value: currency(costPerUnit), unit: "USD", formula_ref: "Total job cost / batch quantity" },
    { label: "Target Sell Price per Unit", value: currency(targetPriceUnit), unit: "USD", formula_ref: "Total job cost / (1 - target margin)" },
    { label: "Profit per Batch", value: currency(profitBatch), unit: "USD", formula_ref: "Target price - total cost" },
    { label: "Achieved Margin", value: `${fmt(achievedMargin)}%`, unit: "%", formula_ref: "Profit / revenue" },
    { label: "Annual Revenue at Target", value: currency(annualRevenue), unit: "USD", formula_ref: "Target price × annual batches" },
    { label: "Annual Profit at Target", value: currency(annualProfit), unit: "USD", formula_ref: "Profit per batch × annual batches" },
  ];

  // ── Hidden Losses ───────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Scrap Not Fully Costed", description: "Scrap allowance only covers the yield loss. Re-inspection and rework routing costs may be additional.", potential_impact: currency(totalCost * 0.03), severity: "MEDIUM" },
    { title: "Setup Cost per Unit", description: "Setup hours are allocated across the batch. Small batches carry higher per-unit setup cost.", potential_impact: currency(totalCost * 0.02), severity: "LOW" },
    { title: "Tooling Wear Not Tracked", description: "Consumable tooling cost may vary with batch complexity.", potential_impact: currency(totalCost * 0.01), severity: "LOW" },
  ];

  // ── Missed Assumptions ──────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Overhead Allocation Method", description: "Overhead is allocated evenly per batch. Actual overhead consumption may vary.", impact_on_result: `Could shift cost by ${currency(totalCost * 0.05)}.` },
    { title: "Material Price Stability", description: "Material cost assumed constant for the quote period.", impact_on_result: "Price fluctuations affect margin directly." },
    { title: "Scrap Rate Accuracy", description: "Scrap rate is based on average. Actual rate may vary per batch.", impact_on_result: `1% scrap change shifts cost by ${currency(totalCost * 0.01)}.` },
  ];

  // ── Risk Warnings ───────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [
    { title: "Margin Risk", description: marginPct < tm ? `Current margin ${fmt(marginPct)}% is below target ${fmt(tm)}%.` : "Margin meets target.", severity: marginPct < tm ? "WARNING" : "INFO" },
    { title: "Volume Dependency", description: `Overhead recovery depends on ${fmt(engineInputs.annual_volume_units ?? 0)} annual units. A volume drop reduces recovery.`, severity: "WARNING", mitigation: "Verify volume commitment before final pricing." },
    { title: "Price Competitiveness", description: hasQuote ? `Current quote ${fmt(engineInputs.current_quote_per_unit ?? 0)} per unit is ${priceGapPerUnit >= 0 ? "above" : "below"} target price.` : "No market comparison provided.", severity: hasQuote && priceGapPerUnit < 0 ? "WARNING" : "INFO" },
  ];

  if (hasQuote && priceGapPerUnit < 0) {
    riskWarnings.push({ title: "Underpricing Risk", description: `Annual underpricing risk of ${currency(underpricingRisk)} if current quote is accepted.`, severity: "WARNING", mitigation: "Adjust quote to target sell price." });
  }

  // ── Sensitivity ─────────────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Material Cost", change: "+10%", impact: `${currency(totalCost * 0.04)} increase`, severity: "MEDIUM" },
    { parameter: "Cycle Time", change: "+10%", impact: `${currency(totalCost * 0.03)} increase`, severity: "MEDIUM" },
    { parameter: "Labor Rate", change: "+10%", impact: `${currency(totalCost * 0.02)} increase`, severity: "LOW" },
    { parameter: "Scrap Rate", change: "+5pp", impact: `${currency(totalCost * 0.03)} increase`, severity: "LOW" },
  ];

  // ── Checklist ───────────────────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Material cost verified with latest supplier quote", status: "REVIEW", details: "Confirm pricing validity period." },
    { item: "Cycle time confirmed by production study", status: "REVIEW", details: "Use actual measured cycle time." },
    { item: "Machine rate reconciled with cost records", status: "REVIEW", details: "Verify depreciation, energy, maintenance components." },
    { item: "Labor rate includes all payroll burdens", status: "REVIEW", details: "Verify fully loaded rate with HR." },
    { item: "Overhead allocation method reviewed", status: "REVIEW", details: "Confirm basis and avoid double-counting." },
    { item: "Scrap rate based on historical data", status: "REVIEW", details: "Use actual quality cost records." },
  ];
  if (hasQuote) {
    checklist.push({ item: "Current quote confirmed as market benchmark", status: "REVIEW", details: "Verify source and validity of comparison price." });
  }

  // ── Recommended Action ──────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionScore === 2) {
    recommendedAction = { action: "Review input warnings and correct blocked inputs before re-quoting.", priority: "HIGH", expected_benefit: "Enables valid quote calculation." };
  } else if (hasQuote && marginPct < tm) {
    recommendedAction = { action: `Increase quote from ${fmt(engineInputs.current_quote_per_unit ?? 0)} to ${currency(targetPriceUnit)} per unit to achieve ${fmt(tm)}% target margin.`, priority: "HIGH", expected_benefit: `Bridges ${fmt(tm - marginPct)}pp margin gap.` };
  } else if (marginPct < tm) {
    recommendedAction = { action: "Review cost components and adjust target margin or reduce costs.", priority: "HIGH", expected_benefit: `Bridges ${fmt(tm - marginPct)}pp margin gap.` };
  } else {
    recommendedAction = { action: "Proceed with quotation after verifying all input assumptions.", priority: "HIGH", expected_benefit: `Quotes at ${fmt(marginPct)}% revenue margin.` };
  }

  // ── Assumptions Used ────────────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed, traceId,
    totalCost: currency(totalCost), marginPercent: `${fmt(marginPct)}%`,
  };
}
