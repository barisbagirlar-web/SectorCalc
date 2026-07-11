// SectorCalc PRO V2 — True Employee Cost Statement Insight

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function pct(val: number, decimals = 1): string { return `${fmt(val, decimals)}%`; }
function currency(val: number): string {
  return val < 0 ? `-$${fmt(Math.abs(val), 2)}` : `$${fmt(val, 2)}`;
}

const DRIVER_LABELS = [
  "Base Salary", "Payroll Taxes", "Health Insurance", "Pension Contribution",
  "Bonus Allocation", "Paid Leave Cost", "Training Cost", "Recruitment Allocation",
  "Equipment & IT Cost", "Workspace & Facility Cost", "Other Benefits",
];

export function buildEmployeeCostReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const O = params.outputs;
  const displayInputs = params.displayInputs;

  const baseSalary       = O.out_base_salary ?? 0;
  const payrollTaxes     = O.out_payroll_taxes ?? 0;
  const healthIns        = O.out_health_insurance ?? 0;
  const pension          = O.out_pension_contribution ?? 0;
  const bonus            = O.out_bonus_allocation ?? 0;
  const leaveCost        = O.out_paid_leave_cost ?? 0;
  const training         = O.out_training_cost ?? 0;
  const recruitment      = O.out_recruitment_allocation ?? 0;
  const equipIT          = O.out_equipment_it_cost ?? 0;
  const facility         = O.out_workspace_facility_cost ?? 0;
  const other            = O.out_other_benefits ?? 0;
  const totalAnnual      = O.out_fully_loaded_annual_cost ?? 0;
  const monthlyCost      = O.out_monthly_cost ?? 0;
  const productiveHrs    = O.out_productive_hours_per_year ?? 1664;
  const hourlyCost       = O.out_productive_hourly_cost ?? 0;
  const loadedMultiplier = O.out_base_to_loaded_multiplier ?? 0;
  const primaryDriverIdx = O.out_primary_cost_driver ?? 0;
  const decisionScore    = O.out_final_decision_state ?? 0;

  const nonBaseCost      = totalAnnual - baseSalary;
  const burdenPct        = baseSalary > 0 ? (nonBaseCost / baseSalary) * 100 : 0;

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (loadedMultiplier > 2.5) {
    kpiLabel = "Critically High Employee Cost Burden";
    kpiSeverity = "CRITICAL";
  } else if (loadedMultiplier > 1.5) {
    kpiLabel = "Elevated Employment Cost Structure";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Cost-Efficient Employment Structure";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: `${currency(totalAnnual)} / ${currency(hourlyCost)}/h`,
    unit: "per year / per hour",
    severity: kpiSeverity,
    explanation: `Fully loaded cost ${currency(totalAnnual)}/yr (${currency(monthlyCost)}/mo). Hourly cost ${currency(hourlyCost)} at ${fmt(productiveHrs,0)} productive hrs. Loaded multiplier: ${fmt(loadedMultiplier,2)}x base salary.`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = { state: "PROFITABLE", label: "Controlled Cost Structure", summary: `Loaded cost ${currency(totalAnnual)} (${fmt(loadedMultiplier,2)}x base). Burden of ${pct(burdenPct)} is within standard range.` };
  } else if (decisionScore === 1) {
    decisionState = { state: "AT_RISK", label: "Elevated Cost Burden", summary: `Burden ratio ${fmt(loadedMultiplier,2)}x exceeds 1.5x threshold. Review benefits and overhead allocations.` };
  } else {
    decisionState = { state: "LOSS", label: "Critically High Overhead", summary: `Burden ratio ${fmt(loadedMultiplier,2)}x exceeds 2.5x — employment cost structure may not be competitive.` };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  const compVals = [baseSalary, payrollTaxes, healthIns, pension, bonus,
    leaveCost, training, recruitment, equipIT, facility, other];
  const driverLabel = primaryDriverIdx >= 0 && primaryDriverIdx < DRIVER_LABELS.length
    ? DRIVER_LABELS[primaryDriverIdx] : "Unknown";
  const execInterpretation =
    `This employee costs ${currency(totalAnnual)} annually (${currency(monthlyCost)} per month) ` +
    `on a base salary of ${currency(baseSalary)}. Payroll taxes add ${currency(payrollTaxes)} ` +
    `(${pct(payrollTaxes > 0 && baseSalary > 0 ? (payrollTaxes / baseSalary) * 100 : 0)}). ` +
    `Benefits total ${currency(healthIns + pension + bonus + leaveCost + other)}. ` +
    `Overhead allocations (training, recruitment, IT, facility) total ` +
    `${currency(training + recruitment + equipIT + facility)}. ` +
    `The productive hourly cost is ${currency(hourlyCost)} across ${fmt(productiveHrs,0)} hours. ` +
    `The base-to-loaded multiplier is ${fmt(loadedMultiplier,2)}x. ` +
    `The single largest cost driver is: ${driverLabel} (${currency(compVals[primaryDriverIdx])}).`;

  // ── Cost Distribution ─────────────────────────────────────────────
  const total = totalAnnual > 0 ? totalAnnual : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Base Salary", amount: baseSalary, percentage: parseFloat(((baseSalary / total) * 100).toFixed(1)) },
    { category: "Payroll Taxes", amount: payrollTaxes, percentage: parseFloat(((payrollTaxes / total) * 100).toFixed(1)) },
    { category: "Benefits & Bonuses", amount: healthIns + pension + bonus + leaveCost, percentage: parseFloat((((healthIns + pension + bonus + leaveCost) / total) * 100).toFixed(1)) },
    { category: "Overhead Allocations", amount: training + recruitment + equipIT + facility + other, percentage: parseFloat((((training + recruitment + equipIT + facility + other) / total) * 100).toFixed(1)) },
  ];

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Fully Loaded Annual Cost", value: currency(totalAnnual), unit: "per year" },
    { label: "Monthly Cost", value: currency(monthlyCost), unit: "per month" },
    { label: "Cost per Productive Hour", value: currency(hourlyCost), unit: "per hour" },
    { label: "Base-to-Loaded Multiplier", value: fmt(loadedMultiplier, 2), unit: "x base salary" },
    { label: "Non-Salary Burden", value: currency(nonBaseCost), unit: "per year" },
    { label: "Burden as % of Base", value: pct(burdenPct), unit: "%" },
    { label: "Productive Hours", value: fmt(productiveHrs, 0), unit: "hours/year" },
  ];

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Unrecorded Payroll Processing Costs",
      description: "Internal payroll processing, compliance, and HR administration costs",
      potential_impact: `${currency(totalAnnual * 0.01)}/yr`,
      severity: "MEDIUM",
    },
    {
      title: "Turnover & Replacement Cost",
      description: "Cost of recruiting, onboarding, and lost productivity during employee transitions",
      potential_impact: `${currency(baseSalary * 0.2)} per replacement`,
      severity: "HIGH",
    },
    {
      title: "Non-Productive Meeting Time",
      description: "Non-billable meetings, internal communications, and administrative tasks reduce effective productive hours",
      potential_impact: `~${fmt(productiveHrs * 0.08, 0)} hrs/yr lost per employee`,
      severity: "MEDIUM",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Uniform Benefit Allocation",
      description: "Benefits assumed proportional to salary — actual costs may vary by role and location",
      impact_on_result: "Health insurance particularly does not scale with salary",
    },
    {
      title: "Productive Hour Estimate",
      description: "Assumes consistent productivity across all working hours",
      impact_on_result: `Actual productive output may be ${fmt(productiveHrs * 0.85, 0)}-${fmt(productiveHrs, 0)} hrs/yr`,
    },
    {
      title: "Fixed Facility Cost Assumption",
      description: "Facility costs allocated per employee may change with headcount",
      impact_on_result: `${currency(facility * 0.3)} potential swing per employee at scale`,
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (loadedMultiplier > 2.0) {
    riskWarnings.push({ title: "Excessive Cost Burden", description: `Cost multiplier ${fmt(loadedMultiplier,2)}x may reduce competitiveness`, severity: "CRITICAL", mitigation: "Benchmark benefits and overhead against industry standards" });
  }
  if (payrollTaxes > baseSalary * 0.3) {
    riskWarnings.push({ title: "High Payroll Tax Jurisdiction", description: `Payroll taxes at ${pct((payrollTaxes / baseSalary) * 100)} of base salary`, severity: "WARNING", mitigation: "Review tax-efficient compensation structures" });
  }
  if (hourlyCost > 200) {
    riskWarnings.push({ title: "Premium Hourly Rate", description: `Hourly cost of ${currency(hourlyCost)} may price services out of market`, severity: "WARNING", mitigation: "Review utilization rate and cost allocation" });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({ title: "Benefit Cost Inflation", description: "Health insurance and benefit costs typically rise 5-10% annually", severity: "INFO", mitigation: "Budget for annual increases in total cost projections" });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Payroll Tax Rate +3pp", change: "+3pp", impact: `Adds ${currency(baseSalary * 0.03)}/yr (${currency(baseSalary * 0.03 / 12)}/mo)`, severity: loadedMultiplier > 1.5 ? "HIGH" : "LOW" },
    { parameter: "Productive Hours -10%", change: "-10%", impact: `Hourly cost rises to ${currency(hourlyCost / 0.9)}`, severity: "MEDIUM" },
    { parameter: "Health Insurance +20%", change: "+20%", impact: `Adds ${currency(healthIns * 0.2)}/yr`, severity: healthIns > baseSalary * 0.1 ? "HIGH" : "LOW" },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Base salary verified against employment contract", status: "ASSUMED", details: "Based on provided salary figure" },
    { item: "Payroll tax rate confirmed with local jurisdiction", status: "REVIEW", details: "Default 22.5% used — verify employer portion" },
    { item: "Health insurance cost confirmed with provider", status: "REVIEW", details: "Actual premium may differ from estimate" },
    { item: "Productive hours verified against time-tracking data", status: "ASSUMED", details: "Standard 1664 hours used" },
    { item: "Facility cost allocation basis reviewed", status: "REVIEW", details: "May need refinement based on actual headcount" },
    { item: "Pension/retirement contribution policy confirmed", status: "NOT CHECKED", details: "Default applied if not provided" },
    { item: "Tax implications reviewed by accountant", status: "NOT CHECKED", details: "This is a cost analysis, not tax advice" },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (loadedMultiplier > 2.5) {
    recommendedAction = { action: `Urgently review benefit plans and overhead structure. Target reduction of ${currency(totalAnnual * 0.2)} in non-salary costs.`, priority: "HIGH", expected_benefit: `Brings multiplier from ${fmt(loadedMultiplier,2)}x toward 2.0x.` };
  } else if (loadedMultiplier > 1.5) {
    recommendedAction = { action: `Benchmark benefits against industry peers. Identify top 3 cost drivers and negotiate better rates.`, priority: "MEDIUM", expected_benefit: `Potential ${currency(nonBaseCost * 0.1)} annual savings.` };
  } else {
    recommendedAction = { action: `Maintain current structure. Review annually and monitor benefit cost inflation.`, priority: "LOW", expected_benefit: "Sustains competitive employment cost structure." };
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
    totalCost: currency(totalAnnual),
    copySummary:
      `${params.toolName} — ${decisionState.label}\n` +
      `─────────────────────────────────\n` +
      `Fully Loaded Annual Cost: ${currency(totalAnnual)} | Hourly: ${currency(hourlyCost)}/h\n` +
      `Base Salary: ${currency(baseSalary)} | Multiplier: ${fmt(loadedMultiplier, 2)}x\n` +
      `Monthly Cost: ${currency(monthlyCost)} | Productive Hours: ${fmt(productiveHrs, 0)} hrs/yr\n` +
      `Burden: ${pct(burdenPct)} of base salary\n` +
      `Next: ${recommendedAction.action}\n` +
      `─────────────────────────────────\n` +
      `Technical simulation; not financial or legal advice. Verify before decisions.`,
  };
}
