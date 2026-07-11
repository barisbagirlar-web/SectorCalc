// SectorCalc PRO V2 — Plant-Wide Shop Rate Cost Structure Audit Insight

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function pct(val: number, decimals = 1): string { return `${fmt(val, decimals)}%`; }
function currency(val: number): string { return val < 0 ? `-$${fmt(Math.abs(val), 2)}` : `$${fmt(val, 2)}`; }

export function buildPlantWideShopRateReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const O = params.outputs;
  const displayInputs = params.displayInputs;

  const directCost          = O.out_annual_direct_cost ?? 0;
  const indirectCost        = O.out_annual_indirect_cost ?? 0;
  const productiveHours     = O.out_productive_hours ?? 0;
  const fixedCostPHour      = O.out_fixed_cost_per_hour ?? 0;
  const laborBurdenPH       = O.out_labor_burden_per_hour ?? 0;
  const facilityBurdenPH    = O.out_facility_burden_per_hour ?? 0;
  const maintenanceBurdenPH = O.out_maintenance_burden_per_hour ?? 0;
  const energyBurdenPH      = O.out_energy_burden_per_hour ?? 0;
  const plantWideRate       = O.out_plant_wide_shop_rate ?? 0;
  const rateGap             = O.out_current_rate_gap ?? 0;
  const annualUnderRecov    = O.out_annual_under_recovery ?? 0;
  const primaryPoolIdx      = O.out_primary_cost_pool ?? 0;
  const decisionScore       = O.out_final_decision_state ?? 0;

  const totalCost = directCost + indirectCost;
  const isRateAdequate = rateGap <= 0;
  const hasUnderRecovery = annualUnderRecov > 0;

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (decisionScore === 2) {
    kpiLabel = "Shop Rate Below Cost — BLOCKED";
    kpiSeverity = "CRITICAL";
  } else if (decisionScore === 1) {
    kpiLabel = "Shop Rate Under Review";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Shop Rate Adequate";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: `${currency(plantWideRate)}/hr (billed: ${currency(plantWideRate + rateGap)}/hr)`,
    unit: "USD per hour",
    severity: kpiSeverity,
    explanation: `Plant-wide shop rate ${currency(plantWideRate)}/hr vs current billed rate ${currency(plantWideRate + rateGap)}/hr. Annual under-recovery ${currency(annualUnderRecov)}.`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Rate Adequate", summary: `Shop rate ${currency(plantWideRate)}/hr is covered by the current billed rate ${currency(plantWideRate + rateGap)}/hr with adequate utilization.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "Rate Under Review", summary: `Current billed rate ${currency(plantWideRate + rateGap)}/hr is below the pricing floor or utilization is below 70%. Annual under-recovery ${currency(annualUnderRecov)}.` };
  } else {
    decisionState = { state: "LOSS", label: "Rate Below Cost", summary: `Current billed rate ${currency(plantWideRate + rateGap)}/hr is below the plant-wide cost rate of ${currency(plantWideRate)}/hr. Operations are losing money on every hour billed.` };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  const poolLabels = ["Total Annual Cost", "Labor Burden", "Facility Burden", "Maintenance Burden", "Energy Burden"];
  const poolLabel = primaryPoolIdx >= 0 && primaryPoolIdx < poolLabels.length ? poolLabels[primaryPoolIdx] : "Unknown";
  const execInterpretation =
    `This analysis shows a manufacturing operation with total annual cost of ${currency(directCost)} ` +
    `(direct) plus ${currency(indirectCost)} (indirect burden) across ${fmt(productiveHours, 0)} productive hours. ` +
    `The plant-wide shop rate is ${currency(plantWideRate)}/hr comprising fixed cost ${currency(fixedCostPHour)}/hr, ` +
    `labor burden ${currency(laborBurdenPH)}/hr, facility burden ${currency(facilityBurdenPH)}/hr, ` +
    `maintenance burden ${currency(maintenanceBurdenPH)}/hr, and energy burden ${currency(energyBurdenPH)}/hr. ` +
    `The current billed rate of ${currency(plantWideRate + rateGap)}/hr results in a rate gap of ${currency(Math.abs(rateGap))}/hr ` +
    `${isRateAdequate ? "favoring" : "short of"} the pricing target, ` +
    `with an annual under-recovery of ${currency(annualUnderRecov)}. ` +
    `The primary cost pool driving the rate is: ${poolLabel}.`;

  // ── Cost Distribution ─────────────────────────────────────────────
  const total = totalCost > 0 ? totalCost : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Direct Manufacturing Cost", amount: directCost, percentage: parseFloat(((directCost / total) * 100).toFixed(1)) },
    { category: "Labor Burden", amount: laborBurdenPH * productiveHours, percentage: parseFloat((((laborBurdenPH * productiveHours) / total) * 100).toFixed(1)) },
    { category: "Facility Burden", amount: facilityBurdenPH * productiveHours, percentage: parseFloat((((facilityBurdenPH * productiveHours) / total) * 100).toFixed(1)) },
    { category: "Maintenance Burden", amount: maintenanceBurdenPH * productiveHours, percentage: parseFloat((((maintenanceBurdenPH * productiveHours) / total) * 100).toFixed(1)) },
    { category: "Energy Burden", amount: energyBurdenPH * productiveHours, percentage: parseFloat((((energyBurdenPH * productiveHours) / total) * 100).toFixed(1)) },
  ];

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Plant-Wide Shop Rate", value: currency(plantWideRate), unit: "per hour" },
    { label: "Current Billed Rate", value: currency(plantWideRate + rateGap), unit: "per hour" },
    { label: "Rate Gap (pricing floor vs billed)", value: currency(rateGap), unit: "per hour" },
    { label: "Annual Under-Recovery", value: currency(annualUnderRecov), unit: "per year" },
    { label: "Fixed Cost per Hour", value: currency(fixedCostPHour), unit: "per hour" },
    { label: "Productive Hours", value: fmt(productiveHours, 0), unit: "hours/year" },
  ];

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Uncaptured Burden Components",
      description: "Indirect costs such as IT, compliance, and corporate allocations may not be fully reflected in burden rates",
      potential_impact: `${currency(directCost * 0.05)}/yr potential additional cost`,
      severity: hasUnderRecovery ? "HIGH" : "MEDIUM",
    },
    {
      title: "Capacity Idle Loss",
      description: "Unutilized capacity inflates effective shop rate as fixed costs are spread over fewer hours",
      potential_impact: `Up to ${currency(fixedCostPHour * productiveHours * 0.15)}/yr at current utilization`,
      severity: "MEDIUM",
    },
    {
      title: "Burden Cross-Subsidization",
      description: "Machine groups with higher burden rates may be cross-subsidizing lower-rate groups in the blended rate",
      potential_impact: `${currency(directCost * 0.08)}/yr potential misallocation`,
      severity: "MEDIUM",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Burden Stability Assumption",
      description: "Burden costs are assumed stable year-over-year; actual costs may vary with production volume",
      impact_on_result: "Fixed burden per hour may increase at lower volumes",
    },
    {
      title: "Allocation Base Accuracy",
      description: "Overhead allocation assumes the chosen base (hours) accurately reflects cost drivers",
      impact_on_result: `${currency(directCost * 0.03)} potential misallocation if base is not representative`,
    },
    {
      title: "Utilization Consistency",
      description: "Utilization rate is assumed to be consistent month-to-month; seasonal variations impact cost recovery",
      impact_on_result: `Actual under-recovery may be ${pct(20)} higher during low-season months`,
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (decisionScore === 2) {
    riskWarnings.push({ title: "Rate Below Cost", description: `Current billed rate is below the cost rate. Every hour billed loses ${currency(plantWideRate - (plantWideRate + rateGap))}.`, severity: "CRITICAL", mitigation: "Immediate rate increase or cost reduction required" });
  }
  if (decisionScore === 1) {
    riskWarnings.push({ title: "Inadequate Pricing Floor", description: `Billed rate does not meet the target margin floor. Rate gap of ${currency(rateGap)}/hr.`, severity: "WARNING", mitigation: "Review pricing strategy and cost structure" });
  }
  if (hasUnderRecovery) {
    riskWarnings.push({ title: "Revenue Leakage", description: `${currency(annualUnderRecov)}/yr is not being recovered due to utilization or rate gaps`, severity: annualUnderRecov > directCost * 0.1 ? "CRITICAL" : "WARNING", mitigation: "Increase utilization or adjust billing rates" });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({ title: "Burden Escalation Risk", description: "Labor, energy, and maintenance costs tend to escalate faster than billing rates", severity: "INFO", mitigation: "Annual rate review mechanism recommended" });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Utilization Drop (-10pp)", change: "-10pp", impact: `Rate increases by ${currency(fixedCostPHour * 0.1)}/hr`, severity: fixedCostPHour > plantWideRate * 0.5 ? "HIGH" : "MEDIUM" },
    { parameter: "Labor Burden Increase (+15%)", change: "+15%", impact: `Rate increases by ${currency(laborBurdenPH * 0.15)}/hr`, severity: laborBurdenPH > plantWideRate * 0.3 ? "HIGH" : "MEDIUM" },
    { parameter: "Energy Cost Increase (+20%)", change: "+20%", impact: `Rate increases by ${currency(energyBurdenPH * 0.2)}/hr`, severity: energyBurdenPH > plantWideRate * 0.1 ? "MEDIUM" : "LOW" },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "All direct costs verified against general ledger", status: "ASSUMED", details: "Based on provided total annual cost figure" },
    { item: "Burden components reviewed by category (labor, facility, maintenance, energy)", status: "REVIEW", details: "Burden values provided — verify against actual GL accounts" },
    { item: "Overhead allocation base validated as representative", status: "ASSUMED", details: "Overhead pool and allocation base provided" },
    { item: "Machine group costs reconciled with actual production data", status: "REVIEW", details: "Machine group data provided — recommend hourly verification" },
    { item: "Current billing rate confirmed with latest customer invoices", status: "ASSUMED", details: "Based on provided current shop rate" },
    { item: "Target margin aligned with strategic business objectives", status: "REVIEW", details: "Verify target margin against market positioning and strategy" },
    { item: "Utilization rate based on measured capacity data", status: "REVIEW", details: "Utilization provided as input — recommend time-study verification" },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionScore === 2) {
    recommendedAction = {
      action: `Immediate rate adjustment required. Increase billed rate to at least ${currency(plantWideRate)}/hr or reduce total annual cost by ${currency(Math.abs(annualUnderRecov))}.`,
      priority: "HIGH",
      expected_benefit: "Stops losses on every billed hour and restores cost recovery.",
    };
  } else if (decisionScore === 1) {
    recommendedAction = {
      action: `Review pricing strategy. Increase billed rate by ${currency(Math.max(rateGap, 0))}/hr or improve utilization to 70%+ to meet target margin.`,
      priority: "MEDIUM",
      expected_benefit: `Eliminates annual under-recovery of ${currency(annualUnderRecov)}.`,
    };
  } else {
    recommendedAction = {
      action: `Maintain current rate structure. Monitor burden costs quarterly and review shop rate annually against actual cost trends.`,
      priority: "LOW",
      expected_benefit: "Sustains cost recovery and margin targets.",
    };
  }

  // ── Assumptions Used ──────────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName: params.toolName,
    generatedAt: new Date().toISOString(),
    primaryKpi, decisionState, executiveInterpretation: execInterpretation,
    costDistribution, calculatedValues, hiddenLosses, missedAssumptions,
    riskWarnings, sensitivityChecks, checklist, recommendedAction, assumptionsUsed,
    traceId: params.traceId,
    totalCost: currency(totalCost),
    copySummary:
      `${params.toolName} — ${decisionState.label}\n` +
      `─────────────────────────────────\n` +
      `Plant-Wide Rate: ${currency(plantWideRate)}/hr | Billed Rate: ${currency(plantWideRate + rateGap)}/hr\n` +
      `Total Annual Cost: ${currency(totalCost)} | Productive Hours: ${fmt(productiveHours, 0)} hrs/yr\n` +
      `Rate Gap: ${currency(rateGap)}/hr | Annual Under-Recovery: ${currency(annualUnderRecov)}\n` +
      `Primary Cost Pool: ${poolLabel}\n` +
      `Next: ${recommendedAction.action}\n` +
      `─────────────────────────────────\n` +
      `Technical simulation; not financial or legal advice. Verify before decisions.`,
  };
}
