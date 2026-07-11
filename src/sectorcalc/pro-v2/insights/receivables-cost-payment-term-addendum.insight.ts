// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { if (val < 0) return `-${symbol}${fmt(Math.abs(val))}`; return `${symbol}${fmt(val)}`; }
function pct(val: number): string { return `${fmt(val)}%`; }

export function buildReceivablesAddendumReport(params: {
  toolName: string; outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>; traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  const invoiceValue          = outputs.out_invoice_value ?? 0;
  const financingCost         = outputs.out_financing_cost ?? 0;
  const adminCost             = outputs.out_admin_collection_cost ?? 0;
  const defaultRisk           = outputs.out_default_risk_allowance ?? 0;
  const effectiveTermCost     = outputs.out_effective_term_cost ?? 0;
  const effectiveTermCostPct  = outputs.out_effective_term_cost_pct ?? 0;
  const marginErosion         = outputs.out_margin_erosion_amount ?? 0;
  const requiredAddendumAmt   = outputs.out_required_addendum_amount ?? 0;
  const requiredAddendumPct   = outputs.out_required_addendum_pct ?? 0;
  const revisedInvoice        = outputs.out_revised_invoice_amount ?? 0;
  const breakevenTerm         = outputs.out_breakeven_payment_term_days ?? 0;
  const decisionScore         = outputs.out_final_decision_state ?? 0;

  const invoiceEngine = engineInputs.invoice_value ?? 0;
  const paymentDays = engineInputs.payment_days ?? 0;
  const costOfCapitalPct = engineInputs.cost_of_capital_pct ?? 0;

  // ── Primary KPI ───────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (decisionScore === 2) {
    kpiLabel = "Critical — High Term Cost (Blocked)";
    kpiSeverity = "CRITICAL";
  } else if (decisionScore === 1) {
    kpiLabel = "Elevated — Moderate Term Cost (Review)";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Controlled — Low Term Cost (Good)";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: `Effective Term Cost: ${pct(effectiveTermCostPct)}`,
    value: currency(effectiveTermCost),
    unit: "USD",
    severity: kpiSeverity,
    explanation: `Invoice ${currency(invoiceValue)}, financing cost ${currency(financingCost)}, ` +
      `admin cost ${currency(adminCost)}, default risk ${currency(defaultRisk)}. ` +
      `Total term cost ${currency(effectiveTermCost)} (${pct(effectiveTermCostPct)} of invoice).`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = {
      state: "PROFITABLE",
      label: "Controlled — Low Term Cost",
      summary: `Term cost ${pct(effectiveTermCostPct)} (below 2% threshold). Payment terms are financially efficient. No addendum required.`,
    };
  } else if (decisionScore === 1) {
    decisionState = {
      state: "AT_RISK",
      label: "Elevated — Review Recommended",
      summary: `Term cost ${pct(effectiveTermCostPct)} (2–5% threshold). Consider renegotiating payment terms or adding a cost addendum.`,
    };
  } else {
    decisionState = {
      state: "LOSS",
      label: "Critical — High Term Cost",
      summary: `Term cost ${pct(effectiveTermCostPct)} exceeds 5% threshold. Payment terms are eroding margin significantly. Immediate renegotiation or addendum required.`,
    };
  }

  // ── Executive Interpretation ───────────────────────────────────────
  let execInterpretation: string;
  if (decisionScore === 2) {
    execInterpretation = `This receivable carries a critically high effective term cost of ${currency(effectiveTermCost)} ` +
      `(${pct(effectiveTermCostPct)} of invoice). At ${paymentDays} days with a ${pct(costOfCapitalPct)} cost of capital, ` +
      `the financing cost alone is ${currency(financingCost)}. Admin and default risk add another ` +
      `${currency(adminCost + defaultRisk)}. A payment term addendum of ${currency(requiredAddendumAmt)} ` +
      `(${pct(requiredAddendumPct)}) is required to neutralize the term cost. Revised invoice: ${currency(revisedInvoice)}.`;
  } else if (decisionScore === 1) {
    execInterpretation = `This receivable has an elevated term cost of ${currency(effectiveTermCost)} ` +
      `(${pct(effectiveTermCostPct)} of invoice). While not critical, the ${paymentDays}-day term at ` +
      `${pct(costOfCapitalPct)} cost of capital creates meaningful margin erosion of ${currency(marginErosion)}. ` +
      `Consider a revised invoice of ${currency(revisedInvoice)} including a ${pct(requiredAddendumPct)} addendum. ` +
      `The break-even payment term is ${fmt(breakevenTerm)} days relative to the early payment discount.`;
  } else {
    execInterpretation = `This receivable has a controlled term cost of ${currency(effectiveTermCost)} ` +
      `(${pct(effectiveTermCostPct)} of invoice). The ${paymentDays}-day term with ${pct(costOfCapitalPct)} cost of capital ` +
      `results in minimal margin erosion. Payment terms are financially efficient. ` +
      `The break-even payment term of ${fmt(breakevenTerm)} days indicates early payment discount is favorable.`;
  }

  // ── Cost Distribution ──────────────────────────────────────────────
  const costComponents: CostDistributionItem[] = [
    { category: "Financing Cost", amount: financingCost, percentage: effectiveTermCost > 0 ? (financingCost / effectiveTermCost) * 100 : 0 },
    { category: "Admin & Collection Cost", amount: adminCost, percentage: effectiveTermCost > 0 ? (adminCost / effectiveTermCost) * 100 : 0 },
    { category: "Default Risk Allowance", amount: defaultRisk, percentage: effectiveTermCost > 0 ? (defaultRisk / effectiveTermCost) * 100 : 0 },
  ];

  // ── Calculated Values ──────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Invoice Value", value: currency(invoiceValue), unit: "USD", formula_ref: "User input" },
    { label: "Financing Cost", value: currency(financingCost), unit: "USD", formula_ref: "Invoice × cost_of_capital% × (payment_days / 365)" },
    { label: "Effective Term Cost", value: currency(effectiveTermCost), unit: "USD", formula_ref: "Financing cost + admin cost + default risk" },
    { label: "Effective Term Cost (% of Invoice)", value: pct(effectiveTermCostPct), unit: "%", formula_ref: "Effective term cost ÷ invoice × 100" },
    { label: "Margin Erosion Amount", value: currency(marginErosion), unit: "USD", formula_ref: "Same as effective term cost" },
    { label: "Required Addendum Amount", value: currency(requiredAddendumAmt), unit: "USD", formula_ref: "Amount to add to invoice to offset term cost" },
    { label: "Required Addendum (% of Invoice)", value: pct(requiredAddendumPct), unit: "%", formula_ref: "Addendum amount ÷ invoice × 100" },
    { label: "Revised Invoice Amount", value: currency(revisedInvoice), unit: "USD", formula_ref: "Original invoice + addendum amount" },
    { label: "Breakeven Payment Term", value: `${fmt(breakevenTerm)} days`, unit: "days", formula_ref: "Early discount % ÷ cost of capital % × 365" },
  ];

  // ── Sensitivity Checks ─────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Cost of Capital", change: "+2%", impact: invoiceEngine > 0 ? `${currency(invoiceEngine * 0.02 * paymentDays / 365)} additional financing cost` : "N/A", severity: "HIGH" },
    { parameter: "Payment Term", change: "+30 days", impact: invoiceEngine > 0 && costOfCapitalPct > 0 ? `${currency(invoiceEngine * (costOfCapitalPct / 100) * 30 / 365)} additional financing cost` : "N/A", severity: "HIGH" },
    { parameter: "Admin Cost", change: "+50%", impact: adminCost > 0 ? `${currency(adminCost * 0.5)} cost increase` : "N/A", severity: "MEDIUM" },
    { parameter: "Default Risk", change: "+50%", impact: defaultRisk > 0 ? `${currency(defaultRisk * 0.5)} cost increase` : "N/A", severity: "MEDIUM" },
    { parameter: "Invoice Value", change: "+10%", impact: invoiceEngine > 0 ? `${currency(invoiceEngine * 0.1 * (costOfCapitalPct / 100) * paymentDays / 365)} additional financing cost` : "N/A", severity: "LOW" },
  ];

  // ── Hidden Cost Diagnosis ──────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Extended Payment Beyond Terms", description: "Customers paying beyond agreed terms increase effective financing cost. A 10-day delay adds approximately one-third more financing cost.", potential_impact: currency(financingCost * 0.33), severity: "MEDIUM" },
    { title: "Currency Conversion Cost", description: "Cross-currency receivables may incur FX conversion charges not captured in the financing rate.", potential_impact: currency(invoiceValue * 0.01), severity: "LOW" },
    { title: "Opportunity Cost of Tied Capital", description: "Capital tied in receivables cannot be deployed elsewhere. This opportunity cost grows with longer payment terms.", potential_impact: currency(financingCost * 0.2), severity: "LOW" },
  ];

  // ── Missed Assumptions ─────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Actual Payment Behavior", description: "Customers may not pay on the agreed date. Weighted average payment days often exceed contractual terms.", impact_on_result: `Effective term cost may be 15-30% higher than calculated.` },
    { title: "Cost of Capital Stability", description: "WACC or borrowing rate is assumed constant. Rising rates increase financing cost over the term period.", impact_on_result: `A 2% rate increase raises financing cost by ${pct(200 / costOfCapitalPct > 0 ? 200 / costOfCapitalPct * effectiveTermCostPct : 0)}.` },
    { title: "Early Discount Utilization", description: "Assumes customers may take the early discount. Actual utilization rate affects net term economics.", impact_on_result: `High utilization reduces effective days outstanding but increases discount cost.` },
  ];

  // ── Risk Warnings ──────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [
    {
      title: decisionScore === 2 ? "Critical Term Cost — Immediate Action Required" : decisionScore === 1 ? "Elevated Term Cost — Review Recommended" : "Controlled Term Cost",
      description: decisionScore === 2
        ? `Term cost of ${pct(effectiveTermCostPct)} exceeds 5% threshold. Margin erosion of ${currency(marginErosion)}.`
        : decisionScore === 1
          ? `Term cost of ${pct(effectiveTermCostPct)} in the 2-5% review zone. Margin erosion of ${currency(marginErosion)}.`
          : `Term cost of ${pct(effectiveTermCostPct)} is below 2%. Terms are financially efficient.`,
      severity: decisionScore === 2 ? "CRITICAL" as const : decisionScore === 1 ? "WARNING" as const : "INFO" as const,
    },
    {
      title: "Late Payment Exposure",
      description: `At ${paymentDays} days term, a late payment of even 15 days increases effective financing cost by approximately ${pct(50 / paymentDays > 0 ? 50 / paymentDays * effectiveTermCostPct : 0)}.`,
      severity: paymentDays > 60 ? "CRITICAL" as const : "WARNING" as const,
    },
    {
      title: "Breakeven Term vs. Early Discount",
      description: `Breakeven payment term is ${fmt(breakevenTerm)} days. If the actual payment term exceeds this, taking the early discount would be more cost-effective.`,
      severity: breakevenTerm < paymentDays ? "WARNING" as const : "INFO" as const,
    },
  ];

  // ── Professional Checklist ─────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Invoice value confirmed with contract or PO", status: "REVIEW", details: "Verify latest agreed invoice amount." },
    { item: "Payment terms verified against signed agreement", status: "REVIEW", details: "Confirm due date and any variability." },
    { item: "Cost of capital sourced from latest financial statement", status: "REVIEW", details: "Use WACC or current borrowing rate." },
    { item: "Admin collection cost based on actual process data", status: "REVIEW", details: "Include invoicing, reminders, reconciliation." },
    { item: "Default risk allowance aligned with credit policy", status: "REVIEW", details: "Check credit insurance or historical write-off rate." },
    { item: "Early payment discount terms match contract", status: "REVIEW", details: "Confirm discount rate and window." },
    { item: "Currency and FX exposure identified", status: "REVIEW", details: "Check if invoice currency differs from cost base." },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionScore === 2) {
    recommendedAction = {
      action: `Revise payment terms or add a ${pct(requiredAddendumPct)} cost addendum (${currency(requiredAddendumAmt)}). Renegotiate to reduce payment days from ${fmt(paymentDays)} or increase early discount incentive.`,
      priority: "HIGH",
      expected_benefit: `Recovers ${currency(effectiveTermCost)} in term cost per invoice.`,
    };
  } else if (decisionScore === 1) {
    recommendedAction = {
      action: `Consider a ${pct(requiredAddendumPct)} addendum (${currency(requiredAddendumAmt)}). Evaluate reducing payment term or negotiating better financing terms.`,
      priority: "MEDIUM",
      expected_benefit: `Improves margin by ${currency(effectiveTermCost)} per invoice.`,
    };
  } else {
    recommendedAction = {
      action: `Current payment terms are efficient. Monitor for changes in cost of capital or payment behavior.`,
      priority: "LOW",
      expected_benefit: "Maintains current margin level.",
    };
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
    totalCost: currency(effectiveTermCost),
    marginPercent: pct(effectiveTermCostPct),
    marginAmount: currency(marginErosion),
  };
}
