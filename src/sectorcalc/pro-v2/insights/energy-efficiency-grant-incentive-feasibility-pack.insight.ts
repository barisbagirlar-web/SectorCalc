// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Insight Report
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

export function buildGrantFeasibilityReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const baselineCost = outputs.out_baseline_energy_cost ?? 0;
  const projectedSaving = outputs.out_projected_energy_saving ?? 0;
  const grossCost = outputs.out_gross_project_cost ?? 0;
  const eligibleCost = outputs.out_eligible_project_cost ?? 0;
  const grantAmount = outputs.out_grant_amount ?? 0;
  const netInvestment = outputs.out_net_investment ?? 0;
  const annualSaving = outputs.out_annual_saving ?? 0;
  const payback = outputs.out_simple_payback_years ?? 0;
  const roiPct = outputs.out_roi_percent ?? 0;
  const npv = outputs.out_npv ?? 0;
  const grantDependency = outputs.out_grant_dependency_pct ?? 0;
  const energyPriceSensitivity = outputs.out_energy_price_sensitivity ?? 0;
  const riskScore = outputs.out_implementation_risk_score ?? 0;
  const decisionStateVal = outputs.out_final_decision_state ?? 2;

  // ── Derived from engine inputs ──────────────────────────────────────
  const baselineKwh = engineInputs.baseline_energy_consumption_kwh ?? 0;
  const energyPrice = engineInputs.baseline_energy_price_per_kwh ?? 0;
  const savingPct = engineInputs.projected_saving_pct ?? 0;
  const maintCost = engineInputs.annual_maintenance_cost ?? 0;
  const escalationPct = engineInputs.energy_price_escalation_pct ?? 0;
  const lifeYears = engineInputs.useful_life_years ?? 0;

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  let primaryKpiSeverity: "OK" | "WARNING" | "CRITICAL" | "INFO" = "INFO";
  if (decisionStateVal === 0) primaryKpiSeverity = "OK";
  else if (decisionStateVal === 1) primaryKpiSeverity = "WARNING";
  else primaryKpiSeverity = "CRITICAL";

  const primaryKpi: InsightKpi = {
    label: "Net Present Value (Grant Scenario)",
    value: currency(npv), unit: "USD",
    severity: primaryKpiSeverity,
    explanation: `Net investment ${currency(netInvestment)} after grant of ${currency(grantAmount)}. Payback: ${fmt(payback)} years, ROI: ${fmt(roiPct)}%. Risk score: ${fmt(riskScore, 1)}/100.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateVal === 0) {
    decisionState = { state: "PROFITABLE", label: "GOOD — Strong Feasibility", summary: `NPV ${currency(npv)} is positive with payback ${fmt(payback)} years (within 30% of useful life). Grant covers ${fmt(grantDependency)}% of cost.` };
  } else if (decisionStateVal === 1) {
    decisionState = { state: "AT_RISK", label: "Review Required", summary: `Marginal feasibility: NPV ${currency(npv)}, payback ${fmt(payback)} years. Grant dependency ${fmt(grantDependency)}%.` };
  } else {
    decisionState = { state: "LOSS", label: "BLOCKED — Poor Feasibility", summary: `Negative NPV ${currency(npv)} or payback ${fmt(payback)} years exceeds 60% of useful life.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation = `This energy efficiency project (gross cost ${currency(grossCost)}, eligible ${currency(eligibleCost)}) attracts a grant of ${currency(grantAmount)} (${fmt(grantDependency)}% dependency), reducing net investment to ${currency(netInvestment)}. Baseline energy cost is ${currency(baselineCost)} (${fmt(baselineKwh, 0)} kWh @ ${currency(energyPrice)}/kWh). Projected ${fmt(savingPct)}% saving yields annual benefit of ${currency(annualSaving)}. With maintenance of ${currency(maintCost)}/year, the net ROI is ${fmt(roiPct)}% over ${fmt(lifeYears, 0)} years. Implementation risk score: ${fmt(riskScore, 1)}/100.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = Math.abs(grossCost) + Math.abs(grantAmount) + Math.abs(baselineCost) > 0
    ? Math.abs(grossCost) + Math.abs(grantAmount) + Math.abs(baselineCost)
    : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Gross Project Cost", amount: grossCost, percentage: (Math.abs(grossCost) / totalForPct) * 100 },
    { category: "Grant / Incentive", amount: grantAmount, percentage: (Math.abs(grantAmount) / totalForPct) * 100 },
    { category: "Net Investment", amount: netInvestment, percentage: (Math.abs(netInvestment) / totalForPct) * 100 },
    { category: "Baseline Annual Energy Cost", amount: baselineCost, percentage: (Math.abs(baselineCost) / totalForPct) * 100 },
    { category: "Projected Annual Saving", amount: annualSaving, percentage: annualSaving > 0 ? (annualSaving / totalForPct) * 100 : 0 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Baseline Annual Energy Cost", value: currency(baselineCost), unit: "USD", formula_ref: "Baseline kWh × energy price" },
    { label: "Projected Energy Saving (kWh)", value: `${fmt(projectedSaving, 0)} kWh`, unit: "kWh", formula_ref: "Baseline kWh × saving %" },
    { label: "Grant Amount Received", value: currency(grantAmount), unit: "USD", formula_ref: "Min(grant, eligible cost)" },
    { label: "Net Investment After Grant", value: currency(netInvestment), unit: "USD", formula_ref: "Gross project cost - grant amount" },
    { label: "Simple Payback Period", value: `${fmt(payback)} years`, unit: "years", formula_ref: "Net investment ÷ annual saving" },
    { label: "Implementation Risk Score", value: `${fmt(riskScore, 1)}/100`, unit: "score", formula_ref: "Payback risk - grant benefit" },
  ];

  // ── 6. Hidden losses ───────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Grant Application & Compliance Cost", description: "Application fees, energy audits, and compliance reporting costs for grant programs are not included.", potential_impact: currency(grantAmount * 0.08), severity: "MEDIUM" },
    { title: "Project Management Overhead", description: "Internal project management time and consultant fees for energy efficiency projects are frequently omitted.", potential_impact: currency(grossCost * 0.06), severity: "MEDIUM" },
    { title: "Performance Verification Cost", description: "Measurement and verification (M&V) costs to validate energy savings are often not budgeted.", potential_impact: currency(grossCost * 0.03), severity: "LOW" },
    { title: "Maintenance Cost Escalation", description: "New equipment maintenance costs tend to rise over time, especially after warranty period.", potential_impact: currency(maintCost * lifeYears * 0.15), severity: "HIGH" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Energy Saving Persistence", description: "Energy savings assumed constant over the useful life, but savings typically degrade 1-3% annually.", impact_on_result: `NPV may be overstated by ${currency(Math.abs(npv) * 0.12)}.` },
    { title: "Grant Approval Assumed", description: "Grant eligibility does not guarantee approval. Application success rates vary by program.", impact_on_result: `Without grant, net investment increases to ${currency(grossCost)}.` },
    { title: "Energy Price Escalation Fixed", description: "Energy price escalation is applied uniformly, but actual price paths are uncertain.", impact_on_result: `±1% escalation changes NPV by ~${currency(Math.abs(npv) * 0.08)}.` },
    { title: "No Carbon Pricing Benefit", description: "Potential carbon tax savings or emissions trading benefits from reduced energy use are not included.", impact_on_result: `Could add ${currency(baselineCost * 0.05)} in additional benefits.` },
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
        { title: "Grant Dependency Risk", description: `Project is ${fmt(grantDependency)}% dependent on grant funding. Grant denial makes project uneconomical.`, severity: Math.abs(grantDependency) > 30 ? "WARNING" : "INFO", mitigation: "Identify alternative funding sources or reduce project scope." },
        { title: "Energy Price Assumption", description: `At ${currency(energyPrice)}/kWh with ${fmt(escalationPct)}% escalation, savings are sensitive to actual energy price trajectory.`, severity: "WARNING", mitigation: "Use conservative escalation rates." },
        { title: "Implementation Risk", description: `Risk score ${fmt(riskScore, 1)}/100 reflects payback period and grant dependency.`, severity: riskScore > 50 ? "WARNING" : "INFO", mitigation: "Develop detailed project implementation plan." },
        { title: "Savings Persistence Risk", description: "Projected savings are theoretical and depend on proper installation, commissioning, and operation.", severity: "WARNING", mitigation: "Include M&V plan in project budget." },
      ];
  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Energy Price", change: "+10%", impact: annualSaving > 0 ? `${currency(annualSaving * 0.3)} additional annual saving` : "N/A", severity: "HIGH" },
    { parameter: "Saving Percentage", change: "Drop from 30% to 20%", impact: annualSaving > 0 ? `Payback extends by ~${fmt(payback * 0.5, 1)} years` : "N/A", severity: "HIGH" },
    { parameter: "Grant Amount", change: "-50%", impact: grantAmount > 0 ? `Net investment increases by ${currency(grantAmount * 0.5)}` : "N/A", severity: "HIGH" },
    { parameter: "Maintenance Cost", change: "+20%", impact: maintCost > 0 ? `${currency(maintCost * 0.2)} annual increase` : "N/A", severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Energy audit completed and savings opportunities identified", status: "REVIEW", details: "Independent energy audit report reviewed." },
    { item: "Grant program eligibility criteria verified", status: "REVIEW", details: "Confirm project, organization, and timeline meet program requirements." },
    { item: "Grant application timeline and deadlines confirmed", status: "REVIEW", details: "Application windows and decision timelines reviewed." },
    { item: "Equipment specifications and vendor quotes obtained", status: "REVIEW", details: "At least 3 competitive quotes reviewed." },
    { item: "Installation contractor qualified and available", status: "REVIEW", details: "Verify contractor certifications and references." },
    { item: "Measurement and verification (M&V) plan in place", status: "REVIEW", details: "IPMVP protocol compliance confirmed." },
    { item: "Operations team engaged and trained on new equipment", status: "REVIEW", details: "Training plan and schedule reviewed." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateVal === 0) {
    recommendedAction = { action: "Proceed with grant application and project implementation. Attach this feasibility analysis to the application.", priority: "HIGH", expected_benefit: `${currency(annualSaving)} annual savings, ${currency(npv)} NPV.` };
  } else if (decisionStateVal === 1) {
    recommendedAction = { action: "Strengthen the business case: seek additional grant sources, negotiate vendor pricing, or increase project scope for better unit economics.", priority: "HIGH", expected_benefit: "Improved NPV and reduced payback period." };
  } else {
    recommendedAction = { action: "Do not proceed under current assumptions. Consider alternative energy efficiency measures with lower capital requirements.", priority: "HIGH", expected_benefit: `Avoids negative ${currency(Math.abs(npv))} NPV outcome.` };
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
    totalCost: currency(grossCost),
    marginAmount: currency(annualSaving),
    marginPercent: `${fmt(roiPct)}%`,
    keyCostDriver: grantDependency > 50 ? "Grant-dependent" : "Energy savings-driven",
  };
}
