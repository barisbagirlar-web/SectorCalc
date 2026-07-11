// SectorCalc PRO V2 — Setup Time Reduction ROI (SMED) Insight Report
// Tool-specific insight builder for SMED ROI analysis.

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

export function buildSmedReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const currentSetupTime = outputs.out_current_setup_time ?? 0;
  const futureSetupTime = outputs.out_future_setup_time ?? 0;
  const timeSavedPerSetup = outputs.out_time_saved_per_setup ?? 0;
  const annualSetups = outputs.out_annual_setups ?? 0;
  const annualHoursRecovered = outputs.out_annual_hours_recovered ?? 0;
  const laborSaving = outputs.out_labor_saving ?? 0;
  const machineCapacityValue = outputs.out_machine_capacity_value ?? 0;
  const annualFinancialBenefit = outputs.out_annual_financial_benefit ?? 0;
  const implementationCost = outputs.out_implementation_cost ?? 0;
  const paybackMonths = outputs.out_payback_months ?? 0;
  const roiPercent = outputs.out_roi_percent ?? 0;
  const decisionStateCode = outputs.out_final_decision_state ?? 0;

  // ── Engine inputs ────────────────────────────────────────────────────
  const operatorCount = Math.max(1, Math.round(engineInputs.operator_count ?? 1));

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "SMED Project ROI",
    value: `${fmt(roiPercent)}%`,
    unit: "%",
    severity: paybackMonths < 12 ? "OK" : paybackMonths <= 24 ? "WARNING" : "CRITICAL",
    explanation: `SMED ROI of ${fmt(roiPercent)}% with a payback period of ${fmt(paybackMonths)} months. Annual benefit: ${currency(annualFinancialBenefit)}.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = { state: "PROFITABLE", label: "Strong SMED Investment Case", summary: `Payback of ${fmt(paybackMonths)} months (under 12 months) indicates a strong investment case for SMED implementation.` };
  } else if (decisionStateCode === 1) {
    decisionState = { state: "AT_RISK", label: "Moderate Payback — Review Required", summary: `Payback of ${fmt(paybackMonths)} months (12-24 months) is acceptable but requires careful review of implementation scope and cost.` };
  } else {
    decisionState = { state: "REVIEW", label: "Extended Payback — Reconsider Scope", summary: `Payback of ${fmt(paybackMonths)} months exceeds 24 months. Consider reducing implementation cost or targeting higher-impact changeovers first.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation =
    `This SMED setup time reduction analysis evaluates reducing setup time from ${fmt(currentSetupTime)} min ` +
    `to ${fmt(futureSetupTime)} min, saving ${fmt(timeSavedPerSetup)} min per setup. ` +
    `With ${fmt(annualSetups, 0)} setups per year, this recovers ${fmt(annualHoursRecovered)} hours annually. ` +
    `Annual financial benefit: ${currency(annualFinancialBenefit)} (${currency(laborSaving)} labor saving + ` +
    `${currency(machineCapacityValue)} machine capacity value). ` +
    `SMED implementation cost: ${currency(implementationCost)}. ` +
    `Payback period: ${fmt(paybackMonths)} months. ROI: ${fmt(roiPercent)}%.`;

  // ── 4. Cost distribution (benefit breakdown) ───────────────────────
  const totalBenefitForPct = annualFinancialBenefit > 0 ? annualFinancialBenefit : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Labor Saving", amount: laborSaving, percentage: (laborSaving / totalBenefitForPct) * 100 },
    { category: "Machine Capacity Value", amount: machineCapacityValue, percentage: (machineCapacityValue / totalBenefitForPct) * 100 },
    { category: "Implementation Cost (one-time)", amount: implementationCost, percentage: (implementationCost / totalBenefitForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Current Setup Time", value: fmt(currentSetupTime), unit: "min", formula_ref: "Direct input" },
    { label: "Target Setup Time (SMED)", value: fmt(futureSetupTime), unit: "min", formula_ref: "Direct input" },
    { label: "Time Saved per Setup", value: fmt(timeSavedPerSetup), unit: "min", formula_ref: "Current - Future setup time" },
    { label: "Annual Setups", value: `${fmt(annualSetups, 0)}`, unit: "setups/year", formula_ref: "Direct input" },
    { label: "Annual Hours Recovered", value: fmt(annualHoursRecovered), unit: "h", formula_ref: "Time saved × Setups / 60" },
    { label: "Labor Saving", value: currency(laborSaving), unit: "USD/year", formula_ref: "Hours × Labor rate × Operators" },
    { label: "Machine Capacity Value", value: currency(machineCapacityValue), unit: "USD/year", formula_ref: "Hours × Machine hourly rate" },
    { label: "Annual Financial Benefit", value: currency(annualFinancialBenefit), unit: "USD/year", formula_ref: "Labor saving + Machine capacity value" },
    { label: "SMED Implementation Cost", value: currency(implementationCost), unit: "USD", formula_ref: "Direct input" },
    { label: "Payback Period", value: `${fmt(paybackMonths)} months`, unit: "months", formula_ref: "Implementation cost / Monthly benefit" },
    { label: "ROI", value: `${fmt(roiPercent)}%`, unit: "%", formula_ref: "Annual benefit / Implementation cost × 100" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Lost Revenue from Unavailable Capacity", description: "Setup time also represents lost production capacity that could have generated revenue not captured in machine rate.", potential_impact: currency(annualFinancialBenefit * 0.25), severity: "HIGH" },
    { title: "Quality Defects During Setup Ramp-Up", description: "First-piece defects after changeover are common but not included in setup cost estimates.", potential_impact: currency(annualFinancialBenefit * 0.08), severity: "MEDIUM" },
    { title: "Operator Overtime for Extended Setups", description: "Long setups may trigger overtime pay at premium rates, especially at shift boundaries.", potential_impact: currency(laborSaving * 0.15), severity: "MEDIUM" },
    { title: "Expedited Tooling & Material Handling", description: "Setup-related logistics such as tool kitting, material staging, and crane time are often omitted.", potential_impact: currency(annualFinancialBenefit * 0.05), severity: "LOW" },
    { title: "Learning Curve After SMED Implementation", description: "Operators need time to reach full proficiency with new SMED procedures.", potential_impact: currency(annualFinancialBenefit * 0.1), severity: "MEDIUM" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Setup Time Reduction Is Fully Achievable", description: "The target setup time assumes all SMED improvements work as planned with no regression.", impact_on_result: `If only 70% of the reduction is achieved, payback extends to ${fmt(paybackMonths / 0.7)} months.` },
    { title: "Setup Count Remains Constant", description: "Setup volume may change with production mix, order patterns, and lot size changes.", impact_on_result: `A 20% reduction in setups reduces annual benefit by ${currency(annualFinancialBenefit * 0.2)}.` },
    { title: "Machine Rate Captures All Opportunity", description: "Machine capacity value assumes recovered hours can be filled with revenue-generating work.", impact_on_result: "If only 50% of capacity is utilized, machine value is halved." },
    { title: "Implementation Cost Is Complete", description: "Implementation cost may not include training downtime, lost production during SMED workshops, or ongoing support.", impact_on_result: `20% cost overrun reduces ROI by approximately ${fmt(roiPercent - (annualFinancialBenefit / (implementationCost * 1.2)) * 100)} pp.` },
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
        { title: paybackMonths < 12 ? "Payback Within Target" : "Payback Exceeds Target", description: `Payback period is ${fmt(paybackMonths)} months.`, severity: paybackMonths < 12 ? "INFO" : paybackMonths <= 24 ? "WARNING" : "CRITICAL" },
        { title: "Setup Reduction Feasibility", description: `Reducing from ${fmt(currentSetupTime)} min to ${fmt(futureSetupTime)} min (${fmt(timeSavedPerSetup)} min saved) requires thorough SMED analysis.`, severity: timeSavedPerSetup < 5 ? "WARNING" : "INFO", mitigation: "Verify reduction target with SMED workshop results." },
        { title: "Implementation Cost Risk", description: `Implementation cost of ${currency(implementationCost)} may underestimate training, tooling modification, and lost production costs.`, severity: "WARNING", mitigation: "Include 15-20% contingency in implementation budget." },
        { title: "Operator Training & Adoption", description: `SMED success depends on ${fmt(operatorCount, 0)} operators adopting new setup procedures.`, severity: "WARNING", mitigation: "Plan training and change management program." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Setup Reduction %", change: "-10%", impact: annualFinancialBenefit > 0 ? `Reduces benefit by approximately ${currency(annualFinancialBenefit * 0.1)}` : "N/A", severity: "HIGH" },
    { parameter: "Number of Setups", change: "-20%", impact: annualFinancialBenefit > 0 ? `Reduces benefit by ${currency(annualFinancialBenefit * 0.2)}` : "N/A", severity: "HIGH" },
    { parameter: "Implementation Cost", change: "+25%", impact: implementationCost > 0 ? `Extends payback to ${fmt(paybackMonths * 1.25)} months` : "N/A", severity: "MEDIUM" },
    { parameter: "Machine Hourly Rate", change: "+15%", impact: machineCapacityValue > 0 ? `Increases machine value by ${currency(machineCapacityValue * 0.15)}` : "N/A", severity: "MEDIUM" },
    { parameter: "Labor Rate", change: "+10%", impact: laborSaving > 0 ? `Increases labor saving by ${currency(laborSaving * 0.1)}` : "N/A", severity: "LOW" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "SMED workshop completed with cross-functional team", status: "REVIEW", details: "Verify workshop includes operators, engineers, and quality." },
    { item: "Current setup steps documented and timed", status: "REVIEW", details: "Internal/external element separation completed." },
    { item: "Target setup time validated with engineering team", status: "REVIEW", details: "Confirm reduction target is achievable." },
    { item: "Quick-change tooling and fixture modifications identified", status: "REVIEW", details: "List required hardware changes." },
    { item: "Operator training plan and schedule defined", status: "REVIEW", details: "Ensure training budget is included." },
    { item: "Implementation timeline and milestones established", status: "REVIEW", details: "Define project phases and deadlines." },
    { item: "Post-implementation measurement plan defined", status: "REVIEW", details: "Track actual setup time reduction." },
    { item: "Change management and communication plan ready", status: "REVIEW", details: "Ensure operator buy-in and support." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 0) {
    recommendedAction = { action: `Proceed with SMED implementation. Target ${fmt(timeSavedPerSetup)} min reduction per setup across ${fmt(annualSetups, 0)} annual changeovers.`, priority: "HIGH", expected_benefit: `Annual benefit of ${currency(annualFinancialBenefit)} with payback in ${fmt(paybackMonths)} months.` };
  } else if (decisionStateCode === 1) {
    recommendedAction = { action: `Review SMED implementation scope. Consider phased approach starting with highest-impact changeovers.`, priority: "HIGH", expected_benefit: `Phased approach reduces upfront investment and de-risks payback.` };
  } else {
    recommendedAction = { action: `Re-scope SMED project: reduce implementation cost or target smaller setup reductions first. Consider quick wins.`, priority: "MEDIUM", expected_benefit: `Lower-risk approach with faster payback on incremental improvements.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const labelMap: Record<string, string> = {
    current_setup_time_minutes: "Current Setup Time",
    future_setup_time_minutes: "Target Setup Time (SMED)",
    setups_per_year: "Setups per Year",
    machine_hourly_rate: "Machine Hourly Rate",
    labor_rate_per_hour: "Labor Rate per Hour",
    operator_count: "Operator Count",
    implementation_cost: "SMED Implementation Cost",
  };

  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: labelMap[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName, generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId,
    totalCost: currency(implementationCost),
    keyCostDriver: "Setup Time Reduction",
    marginPercent: `${fmt(roiPercent)}%`,
    marginAmount: currency(annualFinancialBenefit),
  };
}
