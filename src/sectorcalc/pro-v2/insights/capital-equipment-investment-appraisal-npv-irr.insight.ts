// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Insight Report
// COMPUTED: server outputs, RULE_DERIVED: documented thresholds, ASSUMPTION: declared assumptions.

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

export function buildNpvIrrReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const npv = outputs.out_npv ?? 0;
  const irrPct = outputs.out_irr_percent ?? 0;
  const simplePayback = outputs.out_simple_payback_years ?? 0;
  const discountedPayback = outputs.out_discounted_payback_years ?? 0;
  const pi = outputs.out_profitability_index ?? 0;
  const totalInitialCash = outputs.out_total_initial_cash ?? 0;
  const terminalValue = outputs.out_terminal_value ?? 0;
  const downsideNpv = outputs.out_scenario_downside_npv ?? 0;
  const baseNpv = outputs.out_scenario_base_npv ?? 0;
  const upsideNpv = outputs.out_scenario_upside_npv ?? 0;
  const discountRate = outputs.out_discount_rate ?? 0;
  const annualCfSum = outputs.out_annual_cash_flows_sum ?? 0;
  const driverIdx = outputs.out_primary_value_driver ?? 0;
  const decisionStateVal = outputs.out_final_decision_state ?? 2;

  // ── Derived values from engine inputs ───────────────────────────────
  const initialInvestment = engineInputs.initial_investment ?? 0;
  const workingCapital = engineInputs.working_capital ?? 0;
  const cf1 = engineInputs.annual_cash_inflow_1 ?? 0;
  const cf2 = engineInputs.annual_cash_inflow_2 ?? 0;
  const cf3 = engineInputs.annual_cash_inflow_3 ?? 0;
  const cf4 = engineInputs.annual_cash_inflow_4 ?? 0;
  const cf5 = engineInputs.annual_cash_inflow_5 ?? 0;

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  let primaryKpiSeverity: "OK" | "WARNING" | "CRITICAL" | "INFO" = "INFO";
  if (decisionStateVal === 0) primaryKpiSeverity = "OK";
  else if (decisionStateVal === 1) primaryKpiSeverity = "WARNING";
  else primaryKpiSeverity = "CRITICAL";

  const primaryKpi: InsightKpi = {
    label: "Net Present Value (NPV)",
    value: currency(npv), unit: "USD",
    severity: primaryKpiSeverity,
    explanation: `IRR ${fmt(irrPct)}% vs discount rate ${fmt(discountRate)}%. Payback: ${fmt(simplePayback)} years (simple) / ${fmt(discountedPayback)} years (discounted).`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateVal === 0) {
    decisionState = { state: "PROFITABLE", label: "GOOD — Invest", summary: `NPV ${currency(npv)} is positive with IRR ${fmt(irrPct)}% exceeding the ${fmt(discountRate)}% discount rate. Payback within projection period.` };
  } else if (decisionStateVal === 1) {
    decisionState = { state: "REVIEW", label: "Review Required", summary: `Marginal case: NPV ${currency(npv)} or IRR ${fmt(irrPct)}% is positive but below threshold. Review assumptions.` };
  } else {
    decisionState = { state: "LOSS", label: "BLOCKED — Do Not Invest", summary: `Negative NPV ${currency(npv)} with IRR ${fmt(irrPct)}% below ${fmt(discountRate)}% cost of capital.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const driverLabels = ["Year 1 Cash Flow", "Year 2 Cash Flow", "Terminal Value", "Working Capital Recovery"];
  const driverLabel = driverLabels[driverIdx] ?? "N/A";
  const execInterpretation = `This capital investment of ${currency(totalInitialCash)} (initial investment ${currency(initialInvestment)} + working capital ${currency(workingCapital)}) generates a total NPV of ${currency(npv)} with an IRR of ${fmt(irrPct)}% over 5 years. The profitability index is ${fmt(pi, 4)}. Simple payback is ${fmt(simplePayback)} years (discounted: ${fmt(discountedPayback)} years). Under the downside scenario NPV falls to ${currency(downsideNpv)}; upside scenario reaches ${currency(upsideNpv)}. The primary value driver is ${driverLabel}.`;

  // ── 4. Cost / Value distribution ───────────────────────────────────
  const totalForPct = Math.abs(npv) + Math.abs(totalInitialCash) > 0 ? Math.abs(npv) + Math.abs(totalInitialCash) : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Initial Investment", amount: initialInvestment, percentage: (initialInvestment / totalForPct) * 100 },
    { category: "Working Capital", amount: workingCapital, percentage: (workingCapital / totalForPct) * 100 },
    { category: "NPV Generated", amount: npv, percentage: npv > 0 ? (npv / totalForPct) * 100 : 0 },
    { category: "Terminal Value", amount: terminalValue, percentage: (terminalValue / totalForPct) * 100 },
    { category: "Total 5-Year Cash Flows", amount: annualCfSum, percentage: (annualCfSum / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Total Initial Cash Outlay", value: currency(totalInitialCash), unit: "USD", formula_ref: "Initial Investment + Working Capital" },
    { label: "Internal Rate of Return (IRR)", value: `${fmt(irrPct)}%`, unit: "%", formula_ref: "Newton-Raphson iteration on NPV = 0" },
    { label: "Profitability Index (PI)", value: fmt(pi, 4), unit: "ratio", formula_ref: "PV of Future Cash Flows / Initial Investment" },
    { label: "Simple Payback Period", value: `${fmt(simplePayback)} years`, unit: "years", formula_ref: "Time to recover initial outlay from undiscounted cash flows" },
    { label: "Discounted Payback Period", value: `${fmt(discountedPayback)} years`, unit: "years", formula_ref: "Time to recover initial outlay from discounted cash flows" },
    { label: "Downside Scenario NPV", value: currency(downsideNpv), unit: "USD", formula_ref: "NPV with cash flows reduced by downside factor" },
  ];

  // ── 6. Hidden losses ───────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Installation & Commissioning", description: "Site preparation, installation labor, and commissioning costs are often excluded from initial investment estimates.", potential_impact: currency(totalInitialCash * 0.05), severity: "MEDIUM" },
    { title: "Training & Ramp-Up", description: "Operator training and production ramp-up period costs can erode year 1 cash flows significantly.", potential_impact: currency(totalInitialCash * 0.03), severity: "HIGH" },
    { title: "Changeover & Integration", description: "Integration with existing systems, changeover downtime, and process re-validation costs are frequently underestimated.", potential_impact: currency(totalInitialCash * 0.04), severity: "MEDIUM" },
    { title: "Insurance & Compliance", description: "Higher insurance premiums and regulatory compliance costs for new equipment may not be captured.", potential_impact: currency(totalInitialCash * 0.02), severity: "LOW" },
    { title: "Working Capital Lock-Up", description: "Working capital may not be fully recovered at the end of the projection period.", potential_impact: currency(workingCapital * 0.3), severity: "MEDIUM" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Cash Flow Stability Assumed", description: "Projected cash flows are assumed to be deterministic. In reality, revenues and costs vary.", impact_on_result: `Could swing NPV by ${currency(Math.abs(npv) * 0.3)}.` },
    { title: "Terminal Value Recovery", description: "Residual value and working capital recovery at end of year 5 is assumed at full value.", impact_on_result: `Overstatement of terminal value by ${currency(terminalValue * 0.2)} is possible.` },
    { title: "Constant Discount Rate", description: "A single discount rate is applied across all 5 years, ignoring term structure of interest rates.", impact_on_result: `NPV sensitivity of ${currency(Math.abs(npv) * 0.1)} per 1% rate change.` },
    { title: "No Mid-Life Capital Reinvestment", description: "Major maintenance or mid-life overhauls requiring significant capital are not modeled.", impact_on_result: `Could add ${currency(totalInitialCash * 0.08)} in unrecoverable costs.` },
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
        { title: "Cash Flow Estimation Risk", description: "Five-year cash flow projections carry significant estimation uncertainty.", severity: "WARNING", mitigation: "Use conservative estimates and run multiple scenarios." },
        { title: "Discount Rate Sensitivity", description: `At ${fmt(discountRate)}%, the discount rate has a material impact on NPV.`, severity: "WARNING", mitigation: "Perform sensitivity analysis on discount rate ±2%." },
        { title: "Working Capital Recovery Risk", description: "Working capital recovery depends on market conditions at the end of the investment horizon.", severity: "WARNING", mitigation: "Stress-test working capital recovery at 50-100% of book value." },
        { title: "Scenario Range Interpretation", description: `Downside NPV ${currency(downsideNpv)} to upside NPV ${currency(upsideNpv)} shows a wide range of possible outcomes.`, severity: "INFO", mitigation: "Use the range to set contingency reserves." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Discount Rate", change: "+1%", impact: npv !== 0 ? `${currency(Math.abs(npv) * 0.08)} NPV change` : "N/A", severity: "HIGH" },
    { parameter: "Year 1 Cash Flow", change: "-10%", impact: cf1 > 0 ? `${currency(cf1 * 0.1)} reduction` : "N/A", severity: "MEDIUM" },
    { parameter: "Terminal Value", change: "-20%", impact: terminalValue > 0 ? `${currency(terminalValue * 0.2)} reduction` : "N/A", severity: "MEDIUM" },
    { parameter: "Scenario Spread", change: "Downside to Upside", impact: `Range: ${currency(downsideNpv)} to ${currency(upsideNpv)}`, severity: "HIGH" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Capital expenditure approval process requirements reviewed", status: "REVIEW", details: "Verify internal capex governance requirements." },
    { item: "Cash flow projections validated against market research", status: "REVIEW", details: "Independent validation of revenue and cost assumptions." },
    { item: "Discount rate aligned with company WACC", status: "REVIEW", details: "Confirm discount rate matches corporate finance policy." },
    { item: "Working capital assumptions verified with operations", status: "REVIEW", details: "Inventory, receivables, and payables impact confirmed." },
    { item: "Terminal value methodology reviewed", status: "REVIEW", details: "Verify residual value estimation method." },
    { item: "Scenario analysis covers realistic range", status: "REVIEW", details: "Downside and upside scenarios stress-tested." },
    { item: "Payback period within company policy limits", status: "REVIEW", details: "Confirm simple payback meets internal threshold." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateVal === 0) {
    recommendedAction = { action: "Proceed to detailed due diligence and capital committee submission.", priority: "HIGH", expected_benefit: `${currency(npv)} NPV at ${fmt(irrPct)}% IRR.` };
  } else if (decisionStateVal === 1) {
    recommendedAction = { action: "Review key assumptions — reduce cash flow uncertainty or negotiate better terms. Consider a phased investment approach.", priority: "HIGH", expected_benefit: "Improved decision confidence and risk reduction." };
  } else {
    recommendedAction = { action: "Do not invest under current assumptions. Re-evaluate if project cost decreases by 15% or cash flows improve.", priority: "HIGH", expected_benefit: `Avoids expected loss of ${currency(Math.abs(npv))}.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId,
    totalCost: currency(totalInitialCash),
    marginAmount: currency(npv),
    marginPercent: irrPct > 0 ? `${fmt(irrPct)}%` : "N/A",
    keyCostDriver: driverLabel,
  };
}
