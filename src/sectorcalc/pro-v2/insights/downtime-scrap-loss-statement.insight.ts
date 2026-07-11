// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Insight Report
// Tool-specific insight builder for downtime and scrap loss analysis.

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

export function buildDowntimeScrapReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs ──────────────────────────────────────────────────
  const downtimeHours = outputs.out_downtime_hours ?? 0;
  const lostProdHours = outputs.out_lost_productive_hours ?? 0;
  const lostUnits = outputs.out_lost_units ?? 0;
  const lostContribution = outputs.out_lost_contribution ?? 0;
  const laborIdleCost = outputs.out_labor_idle_cost ?? 0;
  const scrapMatCost = outputs.out_scrap_material_cost ?? 0;
  const reworkCost = outputs.out_rework_cost ?? 0;
  const dispInspCost = outputs.out_disposal_inspection_cost ?? 0;
  const totalEventLoss = outputs.out_total_event_loss ?? 0;
  const annualizedLoss = outputs.out_annualized_loss ?? 0;
  const primaryDriver = outputs.out_primary_loss_driver ?? 0;
  const recoveryPriority = outputs.out_recovery_priority ?? 0;
  const decisionStateCode = outputs.out_final_decision_state ?? 0;

  // ── Engine inputs ────────────────────────────────────────────────────
  const eventFreq = Math.max(1, Math.round(engineInputs.annual_event_frequency ?? 1));
  const hourlyContrib = engineInputs.hourly_contribution_rate ?? 0;

  // ── Driver labels ────────────────────────────────────────────────────
  const driverLabels = ["Lost Contribution (Production Value)", "Scrap Material Waste", "Rework Labor"];
  const primaryDriverLabel = driverLabels[primaryDriver] ?? "Unknown";

  // ── Recovery priority labels ─────────────────────────────────────────
  const priorityLabels = ["LOW (<$1K/event)", "MEDIUM ($1K-$10K/event)", "HIGH (>$10K/event)"];
  const priorityLabel = priorityLabels[recoveryPriority] ?? "Unknown";

  // ── 1. Primary KPI ─────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Total Annualized Loss",
    value: currency(annualizedLoss),
    unit: "USD/year",
    severity: decisionStateCode === 2 ? "CRITICAL" : decisionStateCode === 1 ? "WARNING" : "OK",
    explanation: `Annualized loss of ${currency(annualizedLoss)} based on ${fmt(eventFreq)} events per year at ${currency(totalEventLoss)} per event.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = { state: "PROFITABLE", label: "Manageable Loss Level", summary: `Annualized loss of ${currency(annualizedLoss)} is within manageable range. Standard monitoring recommended.` };
  } else if (decisionStateCode === 1) {
    decisionState = { state: "AT_RISK", label: "Significant Loss — Review Required", summary: `Annualized loss of ${currency(annualizedLoss)} requires management attention. Root cause investigation recommended.` };
  } else {
    decisionState = { state: "LOSS", label: "Critical Loss — Immediate Action Required", summary: `Annualized loss of ${currency(annualizedLoss)} is at a critical level. Immediate containment and corrective action needed.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────
  const execInterpretation =
    `This downtime and scrap event analysis evaluates a single-event loss of ${currency(totalEventLoss)} ` +
    `(${currency(lostContribution)} lost contribution + ${currency(laborIdleCost)} idle labor + ` +
    `${currency(scrapMatCost)} scrap material + ${currency(reworkCost)} rework + ` +
    `${currency(dispInspCost)} disposal/inspection). ` +
    `At ${fmt(eventFreq)} events per year, the annualized exposure is ${currency(annualizedLoss)}. ` +
    `The primary loss driver is "${primaryDriverLabel}", accounting for the largest share of the total event loss. ` +
    `Recovery priority is classified as "${priorityLabel}".`;

  // ── 4. Cost distribution ───────────────────────────────────────────
  const totalForPct = totalEventLoss > 0 ? totalEventLoss : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Lost Contribution (Production Value)", amount: lostContribution, percentage: (lostContribution / totalForPct) * 100 },
    { category: "Idle Labor Cost", amount: laborIdleCost, percentage: (laborIdleCost / totalForPct) * 100 },
    { category: "Scrap Material Cost", amount: scrapMatCost, percentage: (scrapMatCost / totalForPct) * 100 },
    { category: "Rework Cost", amount: reworkCost, percentage: (reworkCost / totalForPct) * 100 },
    { category: "Disposal & Inspection Cost", amount: dispInspCost, percentage: (dispInspCost / totalForPct) * 100 },
  ];

  // ── 5. Calculated values ───────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Downtime Hours", value: fmt(downtimeHours), unit: "h", formula_ref: "Direct input" },
    { label: "Lost Productive Hours", value: fmt(lostProdHours), unit: "h", formula_ref: "Equals downtime hours" },
    { label: "Lost Units (Scrap)", value: fmt(lostUnits, 0), unit: "units", formula_ref: "Scrap quantity from event" },
    { label: "Lost Contribution per Event", value: currency(lostContribution), unit: "USD", formula_ref: "Downtime hours x Hourly contribution rate" },
    { label: "Scrap Material Cost per Event", value: currency(scrapMatCost), unit: "USD", formula_ref: "Scrap quantity x Material cost per unit" },
    { label: "Rework Cost per Event", value: currency(reworkCost), unit: "USD", formula_ref: "Rework hours x Rework labor rate" },
    { label: "Total Loss per Event", value: currency(totalEventLoss), unit: "USD", formula_ref: "Sum of all loss components" },
    { label: "Annualized Loss", value: currency(annualizedLoss), unit: "USD/year", formula_ref: "Total event loss x Annual frequency" },
    { label: "Primary Loss Driver", value: primaryDriverLabel, unit: "", formula_ref: "Largest component of event loss" },
    { label: "Recovery Priority", value: priorityLabel, unit: "", formula_ref: "Based on total event loss threshold" },
  ];

  // ── 6. Hidden loss diagnosis ───────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    { title: "Expedited Freight & Logistics", description: "Emergency material orders, expedited shipping, and last-minute logistics costs are often not captured in standard loss accounting.", potential_impact: currency(totalEventLoss * 0.08), severity: "MEDIUM" },
    { title: "Quality Escalation & Customer Penalties", description: "Late deliveries or defective products reaching customers may trigger penalty clauses or quality escalation costs.", potential_impact: currency(totalEventLoss * 0.12), severity: "HIGH" },
    { title: "Overtime Premium", description: "Recovery efforts often require overtime pay at premium rates (1.5x-2x), which is not captured in standard labor costing.", potential_impact: currency(laborIdleCost * 0.5), severity: "MEDIUM" },
    { title: "Lost Learning Curve & Productivity", description: "Disrupted production flow breaks operator rhythm and learning curve, causing reduced throughput even after restart.", potential_impact: currency(lostContribution * 0.1), severity: "LOW" },
    { title: "Tooling & Fixture Damage", description: "Scrap events sometimes involve damaged tooling, dies, or fixtures that require replacement or repair.", potential_impact: currency(totalEventLoss * 0.05), severity: "LOW" },
  ];

  // ── 7. Missed assumptions ──────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    { title: "Event Frequency Stability", description: `Annualized loss assumes ${fmt(eventFreq)} events per year. Actual frequency may vary significantly.`, impact_on_result: `A 50% increase in frequency adds ${currency(annualizedLoss * 0.5)} to annual exposure.` },
    { title: "Full Cost Recovery Not Guaranteed", description: "Insurance claims or supplier recovery may offset some costs, but are not guaranteed and often delayed.", impact_on_result: `Even 20% recovery reduces annualized loss by ${currency(annualizedLoss * 0.2)}.` },
    { title: "Idle Labor Is Fully Burdened", description: "Idle labor cost assumes full burden rate. If operators are redeployed, actual idle cost may be lower.", impact_on_result: `50% redeployment reduces idle labor cost by ${currency(laborIdleCost * 0.5)} per event.` },
    { title: "Contribution Rate Assumes Full Utilization", description: "Lost contribution assumes the production line would have been operating at full capacity and selling all output.", impact_on_result: `At 80% utilization, actual lost contribution is ${currency(lostContribution * 0.8)}.` },
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
        { title: "Annualized Loss Exposure", description: `Total annual exposure is ${currency(annualizedLoss)} at ${fmt(eventFreq)} events/year.`, severity: decisionStateCode === 2 ? "CRITICAL" : decisionStateCode === 1 ? "WARNING" : "INFO" },
        { title: "Primary Loss Driver Concentration", description: `"${primaryDriverLabel}" is the dominant loss driver. Targeted improvement here yields highest ROI.`, severity: "WARNING", mitigation: "Investigate root cause of the primary driver. Implement corrective action plan." },
        { title: "Ripple Effect Risk", description: "A single downtime event can trigger cascading effects on downstream operations and customer delivery schedules.", severity: "WARNING", mitigation: "Assess downstream impact and implement buffer strategies." },
        { title: "Data Accuracy Risk", description: "Loss estimate accuracy depends on the precision of input parameters. Review actual cost records.", severity: "INFO", mitigation: "Cross-check inputs with financial records and production data." },
      ];

  // ── 9. Sensitivity checks ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Event Frequency", change: "+25%", impact: `${currency(annualizedLoss * 0.25)} additional annual loss`, severity: "HIGH" },
    { parameter: "Downtime Hours", change: "+1 hour", impact: hourlyContrib > 0 ? `${currency(hourlyContrib + (engineInputs.rework_labor_rate ?? 0))} additional cost per event` : "N/A", severity: "HIGH" },
    { parameter: "Scrap Quantity", change: "+10%", impact: scrapMatCost > 0 ? `${currency(scrapMatCost * 0.1)} additional scrap cost per event` : "N/A", severity: "MEDIUM" },
    { parameter: "Rework Hours", change: "+20%", impact: reworkCost > 0 ? `${currency(reworkCost * 0.2)} additional rework cost per event` : "N/A", severity: "MEDIUM" },
    { parameter: "Hourly Contribution Rate", change: "+10%", impact: `${currency(lostContribution * 0.1)} additional lost contribution per event`, severity: "HIGH" },
  ];

  // ── 10. Professional checklist ─────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Downtime root cause identified and documented", status: "REVIEW", details: "Verify root cause analysis is complete." },
    { item: "Scrap disposition plan defined (rework vs. recycle vs. landfill)", status: "REVIEW", details: "Confirm scrap handling procedure." },
    { item: "Corrective and preventive action (CAPA) initiated", status: "REVIEW", details: "Ensure CAPA process is triggered." },
    { item: "Loss data verified with actual cost records", status: "REVIEW", details: "Cross-check with financial system." },
    { item: "Insurance recovery claim assessed", status: "REVIEW", details: "Evaluate eligibility for insurance claim." },
    { item: "Customer impact and delivery schedule reviewed", status: "REVIEW", details: "Assess customer delivery risk." },
    { item: "Operator retraining needs identified", status: "REVIEW", details: "Evaluate if training is needed." },
    { item: "Preventive maintenance schedule reviewed", status: "REVIEW", details: "Check if PM schedule needs adjustment." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 2) {
    recommendedAction = { action: `Immediate containment: Investigate root cause of recurring events. Target 50% reduction in event frequency to bring annualized loss to ${currency(annualizedLoss * 0.5)}.`, priority: "HIGH", expected_benefit: `50% frequency reduction saves ${currency(annualizedLoss * 0.5)} annually.` };
  } else if (decisionStateCode === 1) {
    recommendedAction = { action: `Root cause investigation: Focus on "${primaryDriverLabel}" as primary loss driver. Set target of 20% reduction in loss per event.`, priority: "HIGH", expected_benefit: `20% reduction in event loss saves ${currency(totalEventLoss * 0.2 * eventFreq)} annually.` };
  } else {
    recommendedAction = { action: `Standard monitoring: Continue tracking event frequency and loss components. Review quarterly for adverse trends.`, priority: "MEDIUM", expected_benefit: `Early detection of adverse trends prevents escalation.` };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────
  const labelMap: Record<string, string> = {
    downtime_hours: "Downtime Hours",
    hourly_contribution_rate: "Hourly Contribution Rate",
    scrap_quantity: "Scrap Quantity",
    material_cost_per_unit: "Material Cost per Unit",
    rework_hours: "Rework Hours",
    rework_labor_rate: "Rework Labor Rate",
    disposal_inspection_cost: "Disposal & Inspection Cost",
    annual_event_frequency: "Annual Event Frequency",
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
    totalCost: currency(totalEventLoss),
    keyCostDriver: primaryDriverLabel,
  };
}
