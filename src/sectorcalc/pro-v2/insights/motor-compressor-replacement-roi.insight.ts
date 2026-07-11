// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Insight Report
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

export function buildMotorRoiReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const baselineKwh = outputs.out_baseline_energy_kwh ?? 0;
  const baselineCost = outputs.out_baseline_energy_cost ?? 0;
  const proposedKwh = outputs.out_proposed_energy_kwh ?? 0;
  const proposedCost = outputs.out_proposed_energy_cost ?? 0;
  const energySaving = outputs.out_annual_energy_saving ?? 0;
  const maintSaving = outputs.out_maintenance_saving ?? 0;
  const annualSaving = outputs.out_annual_financial_saving ?? 0;
  const replacementCost = outputs.out_replacement_cost ?? 0;
  const payback = outputs.out_simple_payback_years ?? 0;
  const roiPct = outputs.out_roi_percent ?? 0;
  const npv = outputs.out_npv ?? 0;
  const energySensitivity = outputs.out_energy_price_sensitivity ?? 0;
  const driverIdx = outputs.out_primary_saving_driver ?? 0;
  const decisionStateVal = outputs.out_final_decision_state ?? 2;

  // ── Derived from engine inputs ──────────────────────────────────────
  const currentPower = engineInputs.n_current_power_kw ?? 0;
  const proposedPower = engineInputs.n_proposed_power_kw ?? 0;
  const hours = engineInputs.n_annual_operating_hours ?? 0;
  const energyPrice = engineInputs.n_energy_price_per_kwh ?? 0;
  const currentCost = engineInputs.n_current_maintenance_cost ?? 0;
  const lifeYears = engineInputs.n_useful_life_years ?? 0;

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  let primaryKpiSeverity: "OK" | "WARNING" | "CRITICAL" | "INFO" = "INFO";
  if (decisionStateVal === 0) primaryKpiSeverity = "OK";
  else if (decisionStateVal === 1) primaryKpiSeverity = "WARNING";
  else primaryKpiSeverity = "CRITICAL";

  const primaryKpi: InsightKpi = {
    label: "Net Present Value (Replacement)",
    value: currency(npv), unit: "USD",
    severity: primaryKpiSeverity,
    explanation: `Payback: ${fmt(payback)} years, ROI: ${fmt(roiPct)}%. Annual saving: ${currency(annualSaving)}.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateVal === 0) {
    decisionState = { state: "PROFITABLE", label: "GOOD — Replace", summary: `Payback of ${fmt(payback)} years is within 3-year threshold with positive NPV ${currency(npv)}.` };
  } else if (decisionStateVal === 1) {
    decisionState = { state: "AT_RISK", label: "Review Required", summary: `Replacement pays back in ${fmt(payback)} years but is marginal. NPV: ${currency(npv)}.` };
  } else {
    decisionState = { state: "LOSS", label: "BLOCKED — Do Not Replace", summary: `Payback of ${fmt(payback)} years exceeds useful life or NPV is negative.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const driverLabel = driverIdx === 0 ? "Energy savings" : "Maintenance savings";
  const execInterpretation = `Replacing this ${fmt(currentPower)}kW unit with a ${fmt(proposedPower)}kW unit saves ${fmt(baselineKwh - proposedKwh)} kWh/year (${currency(baselineCost)} → ${currency(proposedCost)}). Annual financial savings total ${currency(annualSaving)} (${currency(energySaving)} energy + ${currency(maintSaving)} maintenance). The replacement cost of ${currency(replacementCost)} is recovered in ${fmt(payback)} years. ROI is ${fmt(roiPct)}% with NPV ${currency(npv)}. Primary driver: ${driverLabel}.`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = Math.abs(baselineCost) + Math.abs(proposedCost) + Math.abs(replacementCost) > 0
    ? Math.abs(baselineCost) + Math.abs(proposedCost) + Math.abs(replacementCost)
    : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Baseline Energy Cost", amount: baselineCost, percentage: (Math.abs(baselineCost) / totalForPct) * 100 },
    { category: "Proposed Energy Cost", amount: proposedCost, percentage: (Math.abs(proposedCost) / totalForPct) * 100 },
    { category: "Replacement Investment", amount: replacementCost, percentage: (Math.abs(replacementCost) / totalForPct) * 100 },
    { category: "Annual Energy Saving", amount: energySaving, percentage: (energySaving / totalForPct) * 100 },
    { category: "Maintenance Saving", amount: maintSaving, percentage: (maintSaving / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Baseline Energy Consumption", value: `${fmt(baselineKwh, 0)} kWh`, unit: "kWh", formula_ref: "Current power × operating hours" },
    { label: "Proposed Energy Consumption", value: `${fmt(proposedKwh, 0)} kWh`, unit: "kWh", formula_ref: "Proposed power × operating hours" },
    { label: "Annual Energy Cost Saving", value: currency(energySaving), unit: "USD", formula_ref: "Baseline cost - Proposed cost" },
    { label: "Annual Maintenance Saving", value: currency(maintSaving), unit: "USD", formula_ref: "Current maintenance - Proposed maintenance" },
    { label: "Simple Payback Period", value: `${fmt(payback)} years`, unit: "years", formula_ref: "Replacement cost ÷ Annual financial saving" },
    { label: "Return on Investment (ROI)", value: `${fmt(roiPct)}%`, unit: "%", formula_ref: "(Total saving over life - Cost) ÷ Cost" },
  ];

  // ── 6. Hidden losses ───────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Installation & Commissioning", description: "Installation labor, electrical work, and commissioning costs are frequently excluded from replacement cost estimates.", potential_impact: currency(replacementCost * 0.1), severity: "HIGH" },
    { title: "Production Downtime During Changeover", description: "Lost production during motor/compressor changeover is not reflected in the analysis.", potential_impact: currency(annualSaving * 0.15), severity: "MEDIUM" },
    { title: "Efficiency Degradation Over Time", description: "New equipment efficiency degrades over time; the payback calculation assumes constant efficiency.", potential_impact: currency(annualSaving * 0.1), severity: "MEDIUM" },
    { title: "Disposal Cost of Old Equipment", description: "Environmental disposal or recycling costs for the replaced unit are not included.", potential_impact: currency(replacementCost * 0.03), severity: "LOW" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Constant Energy Price", description: "Energy prices are held constant in the baseline projection, but prices fluctuate.", impact_on_result: `Energy price +10% adds ~${currency(energySaving * 0.3)} annual saving.` },
    { title: "No Load Variation", description: "Motor/compressor assumed to run at full rated power continuously.", impact_on_result: `Actual savings may be 10-20% lower with variable loads.` },
    { title: "Maintenance Cost Linear", description: "Maintenance costs assumed constant over life, but typically increase with age.", impact_on_result: `Proposed maintenance may increase by ${currency(proposedCost * 0.5)} in later years.` },
    { title: "Full Operating Hours Achievable", description: "Assumes all annual hours are achievable with the new equipment.", impact_on_result: `Unplanned downtime could reduce savings by ${currency(annualSaving * 0.1)}.` },
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
        { title: "Energy Price Volatility", description: `At ${currency(energyPrice)}/kWh, energy cost is a significant operating expense. Price increases improve replacement economics.`, severity: "WARNING", mitigation: "Consider fixed-price energy contracts." },
        { title: "Load Factor Uncertainty", description: "Actual operating load may be lower than rated power, reducing projected savings.", severity: "WARNING", mitigation: "Install power metering to verify actual load profile." },
        { title: "Maintenance Cost Validation", description: `Current maintenance cost of ${currency(currentCost)} must be verified from actual maintenance records.`, severity: "INFO", mitigation: "Review 3-year maintenance history." },
        { title: "Technology Improvement Rate", description: "More efficient models may be available soon, making early replacement less attractive.", severity: "INFO", mitigation: "Review technology roadmap before final decision." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Energy Price", change: "+10%", impact: energySaving > 0 ? `${currency(energySaving * 0.3)} additional annual saving` : "N/A", severity: "HIGH" },
    { parameter: "Operating Hours", change: "-10%", impact: energySaving > 0 ? `${currency(annualSaving * 0.1)} reduction` : "N/A", severity: "HIGH" },
    { parameter: "Replacement Cost", change: "+15%", impact: replacementCost > 0 ? `Payback extends by ${fmt(payback * 0.15, 1)} years` : "N/A", severity: "MEDIUM" },
    { parameter: "Discount Rate", change: "+2%", impact: npv !== 0 ? `${currency(Math.abs(npv) * 0.1)} NPV change` : "N/A", severity: "MEDIUM" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Motor/compressor specifications match application requirements", status: "REVIEW", details: "Verify power, speed, and duty cycle match process needs." },
    { item: "Energy audit data reviewed for baseline verification", status: "REVIEW", details: "Confirm current consumption from metered data." },
    { item: "Installation feasibility assessed (space, foundation, electrical)", status: "REVIEW", details: "Site survey completed." },
    { item: "Maintenance cost historical data analyzed", status: "REVIEW", details: "3-year maintenance records reviewed." },
    { item: "Energy price trend and forecast reviewed", status: "REVIEW", details: "Utility rate outlook considered." },
    { item: "Warranty and service agreement terms reviewed", status: "REVIEW", details: "Verify warranty coverage and service response times." },
    { item: "Disposal / recycling plan for replaced equipment in place", status: "REVIEW", details: "Environmental compliance confirmed." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateVal === 0) {
    recommendedAction = { action: "Proceed with replacement. Submit capital requisition with this analysis attached.", priority: "HIGH", expected_benefit: `${currency(annualSaving)} annual savings, ${fmt(roiPct)}% ROI.` };
  } else if (decisionStateVal === 1) {
    recommendedAction = { action: "Review operating hours and energy price assumptions. Consider partial replacement or phased approach.", priority: "HIGH", expected_benefit: "Improved economics or risk reduction." };
  } else {
    recommendedAction = { action: "Delay replacement. Focus on optimizing current equipment performance and re-evaluate in 12 months.", priority: "HIGH", expected_benefit: `Avoids negative NPV outcome.` };
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
    totalCost: currency(replacementCost),
    marginAmount: currency(annualSaving),
    marginPercent: `${fmt(roiPct)}%`,
    keyCostDriver: driverLabel,
  };
}
