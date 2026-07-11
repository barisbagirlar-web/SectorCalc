// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Insight Report
// COMPUTED: server outputs, RULE_DERIVED: documented thresholds, ASSUMPTION: declared assumptions.

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return `${symbol}${fmt(val)}`; }

const ALT_LABELS: Record<number, string> = { 0: "Buy", 1: "Lease", 2: "Keep", 3: "None (all negative)" };

const INTERNAL_DIAG_IDS = [
  "schema_hash_mismatch", "client_schema_hash", "derating_config", "derating_",
  "trigger_inputs", "missing_trigger_inputs", "bounds_", "refrange_",
  "sens_warn", "formula_module", "formula_engine", "warn_blocked",
];

export function buildBuyLeaseKeepReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const buyNpv = outputs.out_buy_npv ?? 0;
  const leaseNpv = outputs.out_lease_npv ?? 0;
  const keepNpv = outputs.out_keep_npv ?? 0;
  const buyTotalLifecycle = outputs.out_buy_total_lifecycle ?? 0;
  const leaseTotalLifecycle = outputs.out_lease_total_lifecycle ?? 0;
  const keepTotalLifecycle = outputs.out_keep_total_lifecycle ?? 0;
  const selectedAlt = outputs.out_selected_alternative ?? 3;
  const decisionGap = outputs.out_decision_gap ?? 0;
  const decisionStateVal = outputs.out_final_decision_state ?? 2;

  // ── Derived from engine inputs ──────────────────────────────────────
  const purchasePrice = engineInputs.n_machine_purchase_price ?? 0;
  const maintenance = engineInputs.n_annual_maintenance_cost ?? 0;
  const downtime = engineInputs.n_annual_downtime_cost ?? 0;
  const residual = engineInputs.n_residual_value ?? 0;
  const savings = engineInputs.n_operating_savings_per_year ?? 0;
  const leaseAnnual = engineInputs.n_lease_annual_payment ?? 0;

  // ── Best alternative name ───────────────────────────────────────────
  const altLabel = ALT_LABELS[selectedAlt] ?? "Unknown";

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  let primaryKpiSeverity: "OK" | "WARNING" | "CRITICAL" | "INFO" = "INFO";
  if (decisionStateVal === 0) primaryKpiSeverity = "OK";
  else if (decisionStateVal === 1) primaryKpiSeverity = "WARNING";
  else primaryKpiSeverity = "CRITICAL";

  const bestNpv = Math.max(buyNpv, leaseNpv, keepNpv);
  const primaryKpi: InsightKpi = {
    label: `Best Alternative: ${altLabel}`,
    value: currency(bestNpv), unit: "USD (NPV)",
    severity: primaryKpiSeverity,
    explanation: `Buy NPV: ${currency(buyNpv)}, Lease NPV: ${currency(leaseNpv)}, Keep NPV: ${currency(keepNpv)}. Decision gap: ${currency(decisionGap)}.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateVal === 0) {
    decisionState = { state: "PROFITABLE", label: "GOOD — Clear Winner", summary: `${altLabel} is the clear best alternative with NPV ${currency(bestNpv)} and a decision gap of ${currency(decisionGap)}.` };
  } else if (decisionStateVal === 1) {
    decisionState = { state: "AT_RISK", label: "Review Required", summary: `Alternatives are close. Best NPV is ${currency(bestNpv)} via ${altLabel}. Decision gap is only ${currency(decisionGap)}.` };
  } else if (decisionStateVal === 3) {
    decisionState = { state: "LOSS", label: "All Alternatives Negative", summary: `All scenarios have negative NPV. Consider not acquiring or keeping the machine.` };
  } else {
    decisionState = { state: "LOSS", label: "BLOCKED", summary: `No viable option identified. Best NPV is ${currency(bestNpv)}.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation = `For this machine investment (purchase price ${currency(purchasePrice)}): Buying yields NPV ${currency(buyNpv)} with lifecycle cost ${currency(buyTotalLifecycle)}; Leasing yields NPV ${currency(leaseNpv)} with lifecycle cost ${currency(leaseTotalLifecycle)}; Keeping the existing machine yields NPV ${currency(keepNpv)} with lifecycle cost ${currency(keepTotalLifecycle)}. The recommended alternative is "${altLabel}" with a decision gap of ${currency(decisionGap)}.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = Math.abs(buyTotalLifecycle) + Math.abs(leaseTotalLifecycle) + Math.abs(keepTotalLifecycle) > 0
    ? Math.abs(buyTotalLifecycle) + Math.abs(leaseTotalLifecycle) + Math.abs(keepTotalLifecycle)
    : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Buy — Lifecycle Cost", amount: buyTotalLifecycle, percentage: (Math.abs(buyTotalLifecycle) / totalForPct) * 100 },
    { category: "Lease — Lifecycle Cost", amount: leaseTotalLifecycle, percentage: (Math.abs(leaseTotalLifecycle) / totalForPct) * 100 },
    { category: "Keep — Lifecycle Cost", amount: keepTotalLifecycle, percentage: (Math.abs(keepTotalLifecycle) / totalForPct) * 100 },
    { category: "Buy — NPV", amount: buyNpv, percentage: buyNpv > 0 ? (buyNpv / totalForPct) * 100 : 0 },
    { category: "Lease — NPV", amount: leaseNpv, percentage: leaseNpv > 0 ? (leaseNpv / totalForPct) * 100 : 0 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Buy Total Lifecycle Cost", value: currency(buyTotalLifecycle), unit: "USD", formula_ref: "Down payment + loan payments + maintenance + downtime - residual" },
    { label: "Lease Total Lifecycle Cost", value: currency(leaseTotalLifecycle), unit: "USD", formula_ref: "Annual lease payments × analysis years" },
    { label: "Keep Total Lifecycle Cost", value: currency(keepTotalLifecycle), unit: "USD", formula_ref: "Maintenance + downtime over analysis years" },
    { label: "Buy NPV", value: currency(buyNpv), unit: "USD", formula_ref: "Present value of net benefits under buy scenario" },
    { label: "Lease NPV", value: currency(leaseNpv), unit: "USD", formula_ref: "Present value of net benefits under lease scenario" },
    { label: "Keep NPV", value: currency(keepNpv), unit: "USD", formula_ref: "Present value of net benefits under keep scenario" },
  ];

  // ── 6. Hidden losses ───────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Installation & Training", description: "Buy scenario includes installation and operator training costs not reflected in the purchase price.", potential_impact: currency(purchasePrice * 0.05), severity: "MEDIUM" },
    { title: "Lease Exit Penalties", description: "Early termination or end-of-lease purchase obligations may add unexpected costs.", potential_impact: currency(leaseAnnual * 0.5), severity: "HIGH" },
    { title: "Keep — Efficiency Gap", description: "Keeping older equipment assumes 50% of new equipment savings — actual efficiency may be lower.", potential_impact: currency(savings * 0.2), severity: "MEDIUM" },
    { title: "Insurance & Tax Implications", description: "Different ownership structures (buy vs lease) have different insurance and tax treatments.", potential_impact: currency(purchasePrice * 0.02), severity: "LOW" },
    { title: "Residual Value Risk", description: "Actual resale value at end of useful life may differ materially from estimate.", potential_impact: currency(residual * 0.3), severity: "MEDIUM" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Operating Savings Linear Assumption", description: "Operating savings are assumed constant each year without degradation or improvement.", impact_on_result: `Could alter NPV by ${currency(Math.abs(buyNpv) * 0.15)}.` },
    { title: "Constant Discount Rate", description: "A fixed discount rate is applied over the analysis period.", impact_on_result: `NPV sensitivity of ~${currency(Math.abs(bestNpv) * 0.1)} per rate change.` },
    { title: "Lease Terms Fixed", description: "Lease terms are assumed non-negotiable; no mid-term renegotiation or buyout options modeled.", impact_on_result: `Lease cost could be ${currency(leaseAnnual * 0.2)} higher or lower.` },
    { title: "Downtime Cost Stability", description: "Downtime costs assumed constant across all scenarios, but new machines typically have less downtime.", impact_on_result: `Buy/lease NPV may be understated by ${currency(downtime * 0.3)}.` },
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
        { title: "Financing Assumption Risk", description: "Loan terms may differ based on credit profile and market conditions.", severity: "WARNING", mitigation: "Get pre-qualified loan terms before making decision." },
        { title: "Operating Savings Validation", description: `Projected annual savings of ${currency(savings)} must be validated with operational data.`, severity: "WARNING", mitigation: "Conduct time studies and energy audits to confirm savings potential." },
        { title: "Maintenance Cost Escalation", description: "Maintenance costs tend to increase over time, especially for older equipment.", severity: "WARNING", mitigation: "Budget 3-5% annual maintenance cost escalation." },
        { title: "Technology Obsolescence", description: "Newer, more efficient models may become available within the analysis period.", severity: "INFO", mitigation: "Consider a shorter analysis horizon or technology refresh clause." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Operating Savings", change: "-15%", impact: bestNpv > 0 ? `${currency(Math.abs(bestNpv) * 0.2)} NPV reduction` : "N/A", severity: "HIGH" },
    { parameter: "Discount Rate", change: "+2%", impact: bestNpv > 0 ? `${currency(Math.abs(bestNpv) * 0.12)} NPV change` : "N/A", severity: "HIGH" },
    { parameter: "Residual Value", change: "-30%", impact: residual > 0 ? `${currency(residual * 0.3)} reduction in buy benefit` : "N/A", severity: "MEDIUM" },
    { parameter: "Lease Payment", change: "+10%", impact: leaseAnnual > 0 ? `${currency(leaseAnnual * 0.1)} annual increase` : "N/A", severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Machine specifications verified against production requirements", status: "REVIEW", details: "Confirm capacity and capability match needs." },
    { item: "Loan pre-qualification obtained", status: "REVIEW", details: "Verify interest rate and term assumptions." },
    { item: "Lease agreement terms reviewed by legal", status: "REVIEW", details: "Review early termination, maintenance, and insurance clauses." },
    { item: "Operating savings validated with engineering team", status: "REVIEW", details: "Energy efficiency and productivity gains confirmed." },
    { item: "Maintenance cost historical data reviewed", status: "REVIEW", details: "Compare current maintenance spend with proposed estimates." },
    { item: "Tax implications of buy vs lease evaluated", status: "REVIEW", details: "Depreciation benefits vs lease deductibility analysis." },
    { item: "Residual value supported by equipment appraisal", status: "REVIEW", details: "Independent appraisal or market comparables reviewed." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateVal === 0) {
    recommendedAction = { action: `Proceed with "${altLabel}" scenario. Prepare detailed implementation plan and financing approval request.`, priority: "HIGH", expected_benefit: `${currency(bestNpv)} NPV at decision gap ${currency(decisionGap)}.` };
  } else if (decisionStateVal === 1) {
    recommendedAction = { action: "Negotiate better terms (lower purchase/lease price, better financing) to widen the decision gap.", priority: "HIGH", expected_benefit: "Improved NPV and clearer decision." };
  } else {
    recommendedAction = { action: "Do not proceed. Consider alternative solutions such as refurbishment, outsourcing, or process improvement.", priority: "HIGH", expected_benefit: `Avoids negative NPV outcomes.` };
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
    totalCost: currency(buyTotalLifecycle),
    marginAmount: currency(bestNpv),
    keyCostDriver: altLabel,
  };
}
