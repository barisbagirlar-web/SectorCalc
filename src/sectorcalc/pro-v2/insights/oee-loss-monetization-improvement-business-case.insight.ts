// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Insight
// Tool-specific insight builder for OEE loss analysis and improvement ROI.

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

export function buildOeeReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const availabilityPct = outputs.out_availability_pct ?? 0;
  const performancePct = outputs.out_performance_pct ?? 0;
  const qualityPct = outputs.out_quality_pct ?? 0;
  const oeePct = outputs.out_oee_pct ?? 0;
  const availLossHrs = outputs.out_availability_loss_hours ?? 0;
  const perfLossHrs = outputs.out_performance_loss_hours ?? 0;
  const qualLossHrs = outputs.out_quality_loss_hours ?? 0;
  const totalLossHrs = outputs.out_lost_productive_hours ?? 0;
  const lostGoodUnits = outputs.out_lost_good_units ?? 0;
  const availLossAmt = outputs.out_availability_loss_amount ?? 0;
  const perfLossAmt = outputs.out_performance_loss_amount ?? 0;
  const qualLossAmt = outputs.out_quality_loss_amount ?? 0;
  const totalAnnualOpp = outputs.out_total_annual_opportunity ?? 0;
  const largestDriver = outputs.out_largest_oee_loss_driver ?? 0;
  const improvementRoi = outputs.out_improvement_roi ?? 0;
  const decisionStateCode = outputs.out_final_decision_state ?? 0;
  const improvementInv = engineInputs?.improvement_investment ?? 0;

  // ── Driver labels ────────────────────────────────────────────────────
  const driverLabels = ["Availability Loss", "Performance Loss", "Quality Loss"];
  const largestDriverLabel = driverLabels[largestDriver] ?? "Unknown";

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Overall Equipment Effectiveness (OEE)",
    value: `${fmt(oeePct)}%`,
    unit: "%",
    severity: oeePct >= 85 ? "OK" : oeePct >= 60 ? "WARNING" : "CRITICAL",
    explanation: `OEE = ${fmt(availabilityPct)}% A × ${fmt(performancePct)}% P × ${fmt(qualityPct)}% Q. World-class target is 85%.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = { state: "PROFITABLE", label: "Strong Improvement ROI", summary: `Improvement ROI of ${fmt(improvementRoi * 100)}% indicates a strong financial case for the OEE improvement initiative.` };
  } else if (decisionStateCode === 1) {
    decisionState = { state: "AT_RISK", label: "Moderate ROI — Review Required", summary: `Improvement ROI of ${fmt(improvementRoi * 100)}% is moderate. Additional qualitative factors should be considered before proceeding.` };
  } else {
    decisionState = { state: "REVIEW", label: "Weak or Negative ROI", summary: `Improvement ROI of ${fmt(improvementRoi * 100)}% is weak. Investment should be deferred or re-scoped.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation =
    `This OEE analysis shows an overall OEE of ${fmt(oeePct)}% (` +
    `${fmt(availabilityPct)}% availability, ${fmt(performancePct)}% performance, ${fmt(qualityPct)}% quality). ` +
    `Total lost productive hours: ${fmt(totalLossHrs)} h (${fmt(availLossHrs)} h availability + ` +
    `${fmt(perfLossHrs)} h performance + ${fmt(qualLossHrs)} h quality). ` +
    `The annual financial opportunity from eliminating all OEE losses is ${currency(totalAnnualOpp)}. ` +
    `The largest loss driver is "${largestDriverLabel}" at ${currency(availLossAmt + perfLossAmt + qualLossAmt > 0 ? [availLossAmt, perfLossAmt, qualLossAmt][largestDriver] : 0)}. ` +
    `With an improvement investment of ${currency(improvementInv)}, the ROI is ${fmt(improvementRoi * 100)}%.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalLossAmt = availLossAmt + perfLossAmt + qualLossAmt;
  const totalForPct = totalLossAmt > 0 ? totalLossAmt : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Availability Loss (Downtime)", amount: availLossAmt, percentage: (availLossAmt / totalForPct) * 100 },
    { category: "Performance Loss (Speed)", amount: perfLossAmt, percentage: (perfLossAmt / totalForPct) * 100 },
    { category: "Quality Loss (Defects)", amount: qualLossAmt, percentage: (qualLossAmt / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Availability %", value: `${fmt(availabilityPct)}%`, unit: "%", formula_ref: "Operating time / Planned production time" },
    { label: "Performance %", value: `${fmt(performancePct)}%`, unit: "%", formula_ref: "(Total parts × Ideal cycle) / Net operating time" },
    { label: "Quality %", value: `${fmt(qualityPct)}%`, unit: "%", formula_ref: "Good parts / Total parts produced" },
    { label: "Overall OEE", value: `${fmt(oeePct)}%`, unit: "%", formula_ref: "Availability × Performance × Quality" },
    { label: "Availability Loss Hours", value: fmt(availLossHrs), unit: "h", formula_ref: "(Planned - Operating) / 3600" },
    { label: "Performance Loss Hours", value: fmt(perfLossHrs), unit: "h", formula_ref: "(Net - Valuable) / 3600" },
    { label: "Quality Loss Hours", value: fmt(qualLossHrs), unit: "h", formula_ref: "Defective parts × Ideal cycle / 3600" },
    { label: "Total Lost Productive Hours", value: fmt(totalLossHrs), unit: "h", formula_ref: "Sum of all loss hours" },
    { label: "Lost Good Units", value: `${fmt(lostGoodUnits, 0)}`, unit: "units", formula_ref: "Total parts - Good parts" },
    { label: "Availability Loss Amount", value: currency(availLossAmt), unit: "USD", formula_ref: "Availability loss hours × Hourly contribution" },
    { label: "Performance Loss Amount", value: currency(perfLossAmt), unit: "USD", formula_ref: "Performance loss hours × Hourly contribution" },
    { label: "Quality Loss Amount", value: currency(qualLossAmt), unit: "USD", formula_ref: "Quality loss hours × Hourly contribution" },
    { label: "Total Annual Opportunity", value: currency(totalAnnualOpp), unit: "USD/year", formula_ref: "Total annualized loss at current OEE" },
    { label: "Largest OEE Loss Driver", value: largestDriverLabel, unit: "", formula_ref: "Largest of availability/performance/quality loss" },
    { label: "Improvement ROI", value: `${fmt(improvementRoi * 100)}%`, unit: "%", formula_ref: "(Annual benefit - Investment) / Investment" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Micro-Stoppages Not Captured", description: "Brief interruptions under 1 minute are often not recorded but can account for 5-10% of performance loss.", potential_impact: currency(totalAnnualOpp * 0.08), severity: "HIGH" },
    { title: "Speed Loss from Ramp-Up/Ramp-Down", description: "Start-of-shift ramp-up and end-of-shift ramp-down periods operate below ideal cycle time but are counted as running time.", potential_impact: currency(totalAnnualOpp * 0.05), severity: "MEDIUM" },
    { title: "Changeover and Setup Inefficiency", description: "Changeover time is often classified as planned downtime but can be reduced through SMED methodology.", potential_impact: currency(availLossAmt * 0.2), severity: "HIGH" },
    { title: "Measurement System Error", description: "Inaccurate counters, timers, or quality inspection methods can mask true OEE performance.", potential_impact: currency(totalAnnualOpp * 0.05), severity: "MEDIUM" },
    { title: "Operator Learning Curve", description: "New or rotated operators produce at reduced speed and quality until fully trained.", potential_impact: currency(totalAnnualOpp * 0.03), severity: "LOW" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Ideal Cycle Time Accuracy", description: "The ideal cycle time assumption directly impacts both performance and quality loss calculations.", impact_on_result: `A 10% faster cycle increases performance % but may increase defect rate.` },
    { title: "Contribution Rate Reflects Full Value", description: "Hourly contribution rate assumes all produced good units are sold at full margin.", impact_on_result: `At 90% sell-through, actual contribution is 10% lower.` },
    { title: "Improvement Investment Is One-Time", description: "Investment assumes a single capital outlay. Ongoing costs for training, maintenance, and support are not included.", impact_on_result: `Annual support cost of 10% of investment reduces ROI by ${fmt(improvementRoi > 0 ? improvementRoi * 0.1 : 0)}%.` },
    { title: "All Loss Types Are Independent", description: "OEE pillars assume independence. In practice, addressing one loss type may affect others.", impact_on_result: "Improving speed may reduce quality if not carefully managed." },
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
        { title: "OEE Below World-Class", description: oeePct < 85 ? `OEE of ${fmt(oeePct)}% is below the 85% world-class benchmark.` : "OEE meets world-class standards.", severity: oeePct < 85 ? (oeePct < 60 ? "CRITICAL" : "WARNING") : "INFO" },
        { title: "Largest Loss Driver Concentration", description: `"${largestDriverLabel}" is the largest contributor to total OEE loss.`, severity: "WARNING", mitigation: "Focus improvement efforts on the largest loss driver first." },
        { title: "Improvement Investment Risk", description: `Improvement ROI is ${fmt(improvementRoi * 100)}%. Payback depends on sustained OEE improvement.`, severity: improvementRoi > 2 ? "INFO" : improvementRoi > 0.5 ? "WARNING" : "CRITICAL" },
        { title: "Data Quality Risk", description: "OEE accuracy depends on reliable time tracking and production counting systems.", severity: "WARNING", mitigation: "Verify data collection systems for accuracy and consistency." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Availability", change: "+5 pp", impact: `Reduces loss by ~${currency(availLossAmt * 0.08)}`, severity: "HIGH" },
    { parameter: "Performance", change: "+5 pp", impact: `Reduces loss by ~${currency(perfLossAmt > 0 ? perfLossAmt * 0.08 : 0)}`, severity: "HIGH" },
    { parameter: "Quality", change: "+2 pp", impact: qualityPct > 0 && qualityPct < 100 ? `Reduces loss by ~${currency(totalAnnualOpp * 0.02)}` : "N/A", severity: "MEDIUM" },
    { parameter: "Hourly Contribution", change: "+10%", impact: `${currency(totalAnnualOpp * 0.1)} additional opportunity`, severity: "HIGH" },
    { parameter: "Operating Hours per Year", change: "+10%", impact: `${currency(totalAnnualOpp * 0.1)} scaling of total opportunity`, severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Time measurement system verified (counters, timers, SCADA)", status: "REVIEW", details: "Verify data collection accuracy." },
    { item: "Ideal cycle time validated against design specifications", status: "REVIEW", details: "Confirm with process engineering." },
    { item: "Quality inspection method and sampling rate confirmed", status: "REVIEW", details: "Ensure inspection captures true defect rate." },
    { item: "Hourly contribution rate reconciled with financial records", status: "REVIEW", details: "Cross-check with cost accounting." },
    { item: "Improvement investment estimate includes all costs (CAPEX + OPEX)", status: "REVIEW", details: "Verify investment scope completeness." },
    { item: "Operator training and change management budgeted", status: "REVIEW", details: "Confirm soft costs are included." },
    { item: "Baseline OEE data covers representative production period", status: "REVIEW", details: "Ensure baseline is statistically valid." },
    { item: "Target OEE improvement validated with engineering team", status: "REVIEW", details: "Confirm improvement targets are achievable." },
    { item: "Risk assessment for improvement initiative completed", status: "REVIEW", details: "Identify and mitigate project risks." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 0) {
    recommendedAction = { action: `Proceed with improvement initiative. Focus on "${largestDriverLabel}" as primary improvement lever.`, priority: "HIGH", expected_benefit: `Targeted improvement reduces total loss by ${currency(totalAnnualOpp * 0.3)} annually.` };
  } else if (decisionStateCode === 1) {
    recommendedAction = { action: `Review improvement scope and investment. Consider phased approach starting with "${largestDriverLabel}" reduction.`, priority: "HIGH", expected_benefit: `Phased approach reduces risk while capturing quick wins.` };
  } else {
    recommendedAction = { action: `Re-scope improvement initiative. Reduce investment or target higher-impact areas first. Re-evaluate with revised parameters.`, priority: "MEDIUM", expected_benefit: `Avoids negative-ROI investment.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const labelMap: Record<string, string> = {
    planned_production_time_seconds: "Planned Production Time",
    operating_time_seconds: "Operating Time",
    net_operating_time_seconds: "Net Operating Time",
    ideal_cycle_time_per_part: "Ideal Cycle Time per Part",
    total_parts_produced: "Total Parts Produced",
    good_parts: "Good Parts",
    hourly_contribution: "Hourly Contribution",
    improvement_investment: "Improvement Investment",
    operating_hours_per_year: "Operating Hours per Year",
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
    totalCost: currency(totalAnnualOpp),
    keyCostDriver: largestDriverLabel,
    marginPercent: `${fmt(oeePct)}%`,
    marginAmount: currency(totalAnnualOpp),
  };
}
