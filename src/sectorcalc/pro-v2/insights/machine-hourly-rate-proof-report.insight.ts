// SectorCalc PRO V2 — Machine Hourly Rate Proof Report Insight
// All values derived from server outputs, declared assumptions, or documented thresholds.
// Classifications: COMPUTED, RULE_DERIVED, ASSUMPTION, REVIEW_ITEM
// No PASS without explicit evidence. No internal diagnostics.

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(v: number, d = 2): string {
  return Number.isFinite(v) ? v.toFixed(d) : "0.00";
}
function cur(v: number, s = "$"): string { return `${s}${fmt(v)}`; }

export function buildMachineRateReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const { toolName, outputs, displayInputs, engineInputs, traceId } = params;

  // ── Server outputs (all COMPUTED) ──────────────────────────────────────
  const totalCostPerHr      = outputs.out_total_cost_per_hour ?? 0;
  const minSustainableRate  = outputs.out_minimum_sustainable_rate ?? 0;
  const targetSellRate      = outputs.out_target_sell_rate ?? 0;
  const currentShopRate     = engineInputs.current_shop_rate ?? 0;
  const rateGap             = outputs.out_current_rate_gap ?? 0;
  const annualRecovery      = outputs.out_annual_under_recovery_or_surplus ?? 0;
  const scheduledHrs        = outputs.out_scheduled_hours_per_year ?? 0;
  const availableHrs        = outputs.out_available_hours_per_year ?? 0;
  const productiveHrs       = outputs.out_productive_hours_per_year ?? 0;
  const fixedCostPerHr      = outputs.out_fixed_cost_per_productive_hour ?? 0;
  const variableCostPerHr   = outputs.out_variable_cost_per_hour ?? 0;
  const deprCostPerHr       = outputs.out_depreciation_cost_per_hour ?? 0;
  const maintCostPerHr      = outputs.out_maintenance_cost_per_hour ?? 0;
  const insTaxCostPerHr     = outputs.out_insurance_tax_cost_per_hour ?? 0;
  const facilityCostPerHr   = outputs.out_facility_cost_per_hour ?? 0;
  const financeCostPerHr    = outputs.out_financing_cost_per_hour ?? 0;
  const otherFixedPerHr     = outputs.out_other_fixed_cost_per_hour ?? 0;
  const energyCostPerHr     = outputs.out_energy_cost_per_hour ?? 0;
  const laborCostPerHr      = outputs.out_labor_cost_per_hour ?? 0;
  const consumablesPerHr    = outputs.out_consumables_cost_per_hour ?? 0;
  const toolingCostPerHr    = outputs.out_tooling_cost_per_hour ?? 0;
  const annualDepr          = outputs.out_annual_depreciation_cost ?? 0;
  const annualFixedCost     = outputs.out_annual_fixed_cost ?? 0;
  const beContribution      = outputs.out_break_even_contribution_per_hour ?? 0;
  const beUtilPct           = outputs.out_utilization_breakeven_percent ?? 0;
  const beStatus            = outputs.out_break_even_status ?? 0;
  const decisionStateCode   = outputs.out_final_decision_state ?? 0;
  const primaryDriverId     = outputs.out_primary_cost_driver ?? 0;
  const scenarioState       = outputs.out_production_scenario_state ?? -1;

  // Optional scenario outputs
  const setupCountPerYear   = outputs.out_setup_count_per_year ?? 0;
  const reqMachineHours     = outputs.out_required_machine_hours ?? 0;
  const capacityReqPct      = outputs.out_capacity_requirement_percent ?? 0;
  const costPerPart         = outputs.out_cost_per_part ?? 0;
  const targetSellPricePart = outputs.out_target_sell_price_per_part ?? 0;

  const scenarioComplete = scenarioState !== -1;

  // ── Engine inputs ──────────────────────────────────────────────────────
  const targetMargPct = engineInputs.target_margin_percent ?? 0;

  // ── 1. Primary KPI ─────────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Fully Loaded Machine Cost per Productive Hour",
    value: cur(totalCostPerHr),
    unit: "USD/h",
    severity: decisionStateCode === 2 ? "CRITICAL" : decisionStateCode === 1 ? "WARNING" : "OK",
    explanation:
      `Total cost per productive hour: fixed ${cur(fixedCostPerHr)}/h + variable ${cur(variableCostPerHr)}/h. ` +
      `Minimum sustainable rate is ${cur(minSustainableRate)}/h. ` +
      `Target sell rate at ${fmt(targetMargPct)}% margin is ${cur(targetSellRate)}/h.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionStateCode === 0) {
    decisionState = {
      state: "PROFITABLE",
      label: "Current Rate Protects Target Margin",
      summary: `Current shop rate of ${cur(currentShopRate)}/h meets or exceeds the target sell rate ` +
        `of ${cur(targetSellRate)}/h. The hourly rate structure is validated.`,
    };
  } else if (decisionStateCode === 1) {
    decisionState = {
      state: "REVIEW",
      label: "Rate Under Review",
      summary: rateGap < 0
        ? `Current shop rate of ${cur(currentShopRate)}/h is ${cur(Math.abs(rateGap))}/h below the target. ` +
          `The cost structure covers costs but misses the target margin.`
        : `Current shop rate covers the target margin but review flags exist ` +
          `(utilization below 50% or breakeven above 85%).`,
    };
  } else {
    decisionState = {
      state: "LOSS",
      label: "Rate Does Not Cover Cost",
      summary: rateGap < 0
        ? `Current shop rate of ${cur(currentShopRate)}/h is below the minimum sustainable rate ` +
          `of ${cur(minSustainableRate)}/h.`
        : `Calculation is blocked due to invalid inputs (check warnings).`,
    };
  }

  // ── 3. Executive interpretation ────────────────────────────────────────
  const execInterpretation =
    `This machine hourly rate proof report computes the fully loaded cost per productive hour ` +
    `for a machine with ${fmt(scheduledHrs)} scheduled hours, ${fmt(availableHrs)} available hours ` +
    `(after ${engineInputs.planned_downtime_percent ?? 0}% planned downtime), and ` +
    `${fmt(productiveHrs)} productive hours (at ${engineInputs.utilization_percent ?? 0}% utilization).\n\n` +
    `The total cost per productive hour is ${cur(totalCostPerHr)}/h, composed of ` +
    `${cur(fixedCostPerHr)}/h fixed costs (${cur(annualFixedCost)} annually) and ` +
    `${cur(variableCostPerHr)}/h variable costs.\n\n` +
    `The minimum sustainable rate is ${cur(minSustainableRate)}/h — this is the break-even rate ` +
    `that covers all costs without profit. The target sell rate at ${fmt(targetMargPct)}% revenue margin ` +
    `is ${cur(targetSellRate)}/h.\n\n` +
    (rateGap >= 0
      ? `Current shop rate of ${cur(currentShopRate)}/h is ${cur(rateGap)}/h above the target sell rate, ` +
        `protecting the target margin.`
      : `Current shop rate of ${cur(currentShopRate)}/h is ${cur(Math.abs(rateGap))}/h below the target sell rate, ` +
        `meaning the target margin is not fully protected.`) +
    `\n\n` +
    `Annual under-recovery (or surplus) is ${cur(Math.abs(annualRecovery))} per year. ` +
    (annualRecovery < 0 ? `This negative gap represents revenue leakage.` : `This positive surplus confirms rate adequacy.`) +
    `\n\n` +
    (beStatus === 1
      ? `The current shop rate does not cover variable costs. Break-even utilization is not achievable.`
      : `Break-even utilization is ${fmt(beUtilPct)}% of available hours.`) +
    (scenarioComplete
      ? `\n\nThe optional production scenario requires ${fmt(reqMachineHours)} machine hours ` +
        `(${fmt(capacityReqPct)}% of available capacity). ` +
        (capacityReqPct > 100
          ? `This exceeds available capacity — review volume or add a second shift/machine.`
          : `Capacity is sufficient for the planned volume.`) +
        ` Cost per part: ${cur(costPerPart)}. Target sell price per part: ${cur(targetSellPricePart)}.`
      : ``);

  // ── 4. Hourly cost structure ───────────────────────────────────────────
  const totalBreakdown = fixedCostPerHr + variableCostPerHr;
  const costDistribution: CostDistributionItem[] = [
    { category: "Depreciation", amount: deprCostPerHr, percentage: totalCostPerHr > 0 ? (deprCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Maintenance", amount: maintCostPerHr, percentage: totalCostPerHr > 0 ? (maintCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Insurance & Tax", amount: insTaxCostPerHr, percentage: totalCostPerHr > 0 ? (insTaxCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Facility Allocation", amount: facilityCostPerHr, percentage: totalCostPerHr > 0 ? (facilityCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Financing Cost", amount: financeCostPerHr, percentage: totalCostPerHr > 0 ? (financeCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Other Fixed Cost", amount: otherFixedPerHr, percentage: totalCostPerHr > 0 ? (otherFixedPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Energy", amount: energyCostPerHr, percentage: totalCostPerHr > 0 ? (energyCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Labor", amount: laborCostPerHr, percentage: totalCostPerHr > 0 ? (laborCostPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Supplies", amount: consumablesPerHr, percentage: totalCostPerHr > 0 ? (consumablesPerHr / totalCostPerHr) * 100 : 0 },
    { category: "Tooling", amount: toolingCostPerHr, percentage: totalCostPerHr > 0 ? (toolingCostPerHr / totalCostPerHr) * 100 : 0 },
  ];
  const breakdownSum = costDistribution.reduce((s, c) => s + c.amount, 0);

  // ── 5. Calculated values ──────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Scheduled Hours per Year", value: fmt(scheduledHrs), unit: "h" },
    { label: "Available Hours per Year", value: fmt(availableHrs), unit: "h" },
    { label: "Productive Hours per Year", value: fmt(productiveHrs), unit: "h" },
    { label: "Annual Fixed Cost", value: cur(annualFixedCost), unit: "USD/year" },
    { label: "Fixed Cost per Productive Hour", value: cur(fixedCostPerHr), unit: "USD/h" },
    { label: "Variable Cost per Hour", value: cur(variableCostPerHr), unit: "USD/h" },
    { label: "Fully Loaded Total Cost per Hour", value: cur(totalCostPerHr), unit: "USD/h" },
    { label: "Minimum Sustainable Rate", value: cur(minSustainableRate), unit: "USD/h" },
    { label: "Target Sell Rate", value: cur(targetSellRate), unit: "USD/h" },
    { label: "Current Rate Gap", value: cur(rateGap), unit: "USD/h" },
    { label: "Annual Under-Recovery / Surplus", value: cur(annualRecovery), unit: "USD/year" },
    { label: "Break-Even Utilization", value: `${fmt(beUtilPct)}%`, unit: "% of available hours" },
  ];

  if (scenarioComplete) {
    calculatedValues.push(
      { label: "Annual Production Volume", value: fmt(engineInputs.annual_production_volume ?? 0), unit: "units" },
      { label: "Setup Count per Year", value: `${setupCountPerYear}`, unit: "batches" },
      { label: "Required Machine Hours", value: fmt(reqMachineHours), unit: "h" },
      { label: "Capacity Requirement", value: `${fmt(capacityReqPct)}%`, unit: "% of productive hours" },
      { label: "Cost per Part", value: cur(costPerPart), unit: "USD/part" },
      { label: "Target Sell Price per Part", value: cur(targetSellPricePart), unit: "USD/part" },
      { label: "Capacity Surplus / Deficit", value: capacityReqPct > 100 ? `Deficit of ${fmt(capacityReqPct - 100)}%` : `Surplus of ${fmt(100 - capacityReqPct)}%`, unit: "" },
    );
  }

  // ── 6. Primary cost driver ─────────────────────────────────────────────
  const driverNames = ["Fixed", "Energy", "Labor", "Supplies", "Tooling"];
  const driverValues = [fixedCostPerHr, energyCostPerHr, laborCostPerHr, consumablesPerHr, toolingCostPerHr];
  const driverName = driverNames[primaryDriverId] ?? "Unknown";
  const driverVal = driverValues[primaryDriverId] ?? 0;
  const driverPct = totalCostPerHr > 0 ? (driverVal / totalCostPerHr) * 100 : 0;

  const driverExplanation =
    `The largest hourly cost component is "${driverName}" at ${cur(driverVal)}/h ` +
    `(${fmt(driverPct)}% of total hourly cost). ` +
    (primaryDriverId === 0
      ? `Fixed costs are driven by depreciation, maintenance, facility, and insurance. ` +
        `Review each fixed component for reduction opportunities.`
      : primaryDriverId === 1
        ? `Energy cost depends on machine power demand (${engineInputs.machine_power_kw ?? 0} kW) ` +
          `and electricity price. Consider power-saving measures or off-peak scheduling.`
        : primaryDriverId === 2
          ? `Labor cost is driven by operator count and fully loaded rate. ` +
            `Review automation potential or multi-machine operation.`
          : primaryDriverId === 3
            ? `Supplies cost is an operating expense that scales with runtime. ` +
              `Review consumption rates and bulk pricing.`
            : `Tooling cost reflects wear-part consumption. Review tool life data and purchasing agreements.`);

  // ── 7. Hidden cost diagnosis ──────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Nonproductive Setup and Waiting Time",
      description: "Setup time, tool changes, material handling, and waiting are not included in the productive utilization. These activities consume available hours without producing output.",
      potential_impact: cur(totalCostPerHr * (1 - (engineInputs.utilization_percent ?? 80) / 100) * productiveHrs),
      severity: "HIGH",
    },
    {
      title: "Unallocated Floor / Facility Cost",
      description: "Facility allocation may not capture all occupancy costs including cleaning, security, and common area maintenance.",
      potential_impact: cur(facilityCostPerHr * productiveHrs * 0.15),
      severity: "MEDIUM",
    },
    {
      title: "Maintenance Underbudgeting",
      description: "Planned maintenance cost may not reflect major overhauls or unexpected breakdown repairs in older machines.",
      potential_impact: cur(maintCostPerHr * productiveHrs * 0.3),
      severity: "HIGH",
    },
    {
      title: "Tooling and Supplies Omitted from Rate",
      description: "If tooling and supplies are not included in the shop rate, they directly reduce margins on quoted work.",
      potential_impact: cur((toolingCostPerHr + consumablesPerHr) * productiveHrs),
      severity: "MEDIUM",
    },
    {
      title: "Wage-Only Labor Rate Instead of Fully Loaded",
      description: "Using wage-only rates without benefits, payroll taxes, and supervision allocation understates true labor cost.",
      potential_impact: cur(laborCostPerHr * productiveHrs * 0.3),
      severity: "HIGH",
    },
  ];

  // ── 8. Missed assumptions ──────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Utilization at Declared Level",
      description: `The calculation assumes ${engineInputs.utilization_percent ?? 80}% utilization. Actual values may differ by job type, season, and machine reliability.`,
      impact_on_result: `A 10pp utilization drop increases total hourly cost by ~${cur(totalCostPerHr * 0.1)}.`,
    },
    {
      title: "Electricity Price Stability",
      description: "Electricity price is assumed constant. Tariff changes directly affect energy cost per hour.",
      impact_on_result: `A 20% price increase adds ${cur(energyCostPerHr * 0.2)}/h to operating cost.`,
    },
    {
      title: "Average Power Demand Accuracy",
      description: "Machine power draw is assumed at the declared average. Actual demand varies with load, cycle phase, and age.",
      impact_on_result: `A 15% higher draw adds ${cur(energyCostPerHr * 0.15)}/h.`,
    },
    {
      title: "Labor Rate Loading Completeness",
      description: "Fully loaded rate must include wages, benefits, payroll taxes, training, PPE, and supervision allocation.",
      impact_on_result: `Missing benefit loading of 25% adds ${cur(laborCostPerHr * 0.25)}/h.`,
    },
  ];

  // ── 9. Risk warnings ───────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [
    {
      title: decisionStateCode === 2 ? "Rate Does Not Cover Cost" : rateGap < 0 ? "Margin Below Target" : "Margin On Target",
      description: decisionStateCode === 2
        ? `Total cost per hour is ${cur(totalCostPerHr)} while the current shop rate is ${cur(currentShopRate)}/h. The rate structure requires immediate review.`
        : rateGap < 0
          ? `Current shop rate is ${cur(Math.abs(rateGap))}/h below the target sell rate of ${cur(targetSellRate)}/h.`
          : `Current shop rate of ${cur(currentShopRate)}/h meets or exceeds target.`,
      severity: decisionStateCode === 2 ? "CRITICAL" : rateGap < 0 ? "WARNING" : "INFO",
    },
    {
      title: "Utilization Risk",
      description: `Current utilization is ${engineInputs.utilization_percent ?? 80}%. If actual utilization is lower, fixed cost per hour increases.`,
      severity: (engineInputs.utilization_percent ?? 80) < 50 ? "CRITICAL" : "WARNING",
      mitigation: "Review actual production records. Consider removing or redeploying underutilized capacity.",
    },
    {
      title: "Break-Even Utilization Feasibility",
      description: beStatus === 1
        ? "The current shop rate does not cover variable costs. Break-even is not achievable at any utilization."
        : `Break-even requires ${fmt(beUtilPct)}% of available hours. ${beUtilPct > 85 ? "This is high and may be challenging to sustain." : "This is operationally achievable."}`,
      severity: beStatus === 1 ? "CRITICAL" : beUtilPct > 85 ? "WARNING" : "INFO",
    },
    {
      title: "Depreciation Period vs Actual Life",
      description: `Depreciation is spread over ${engineInputs.economic_life_years ?? 8} years. If the machine requires replacement sooner, true hourly cost increases.`,
      severity: "WARNING",
      mitigation: "Cross-check economic life against historical machine replacement intervals.",
    },
    {
      title: "Annual Under-Recovery Exposure",
      description: annualRecovery < 0
        ? `Annual revenue leakage is ${cur(Math.abs(annualRecovery))} at current rates.`
        : "No annual under-recovery at current rates.",
      severity: annualRecovery < 0 ? "WARNING" : "INFO",
    },
  ];

  // ── 10. Sensitivity analysis ──────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    {
      parameter: "Utilization",
      change: "-10 pp",
      impact: totalCostPerHr > 0 && engineInputs.utilization_percent > 10
        ? `Fixed cost spread less: +${cur(fixedCostPerHr * (engineInputs.utilization_percent / (engineInputs.utilization_percent - 10) - 1))}/h`
        : "Utilization too low for meaningful calculation",
      severity: "HIGH",
    },
    {
      parameter: "Labor Rate",
      change: "+10%",
      impact: laborCostPerHr > 0 ? `+${cur(laborCostPerHr * 0.1)}/h` : "N/A",
      severity: "MEDIUM",
    },
    {
      parameter: "Maintenance Cost",
      change: "+15%",
      impact: maintCostPerHr > 0 ? `+${cur(maintCostPerHr * 0.15)}/h` : "N/A",
      severity: "MEDIUM",
    },
    {
      parameter: "Electricity Price",
      change: "+20%",
      impact: energyCostPerHr > 0 ? `+${cur(energyCostPerHr * 0.2)}/h` : "N/A",
      severity: "MEDIUM",
    },
    {
      parameter: "Shop Rate Adjustment to Meet Target",
      change: "Rate increase needed",
      impact: rateGap < 0
        ? `Increase current shop rate by ${cur(Math.abs(rateGap))}/h (${fmt((Math.abs(rateGap) / totalCostPerHr) * 100)}% rate increase)`
        : "Current rate already meets target",
      severity: rateGap < 0 ? "HIGH" : "LOW",
    },
  ];

  // ── 11. Professional rate-setting checklist ───────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Machine purchase price and residual value verified against invoice or valuation", status: "REVIEW", details: "Verify with equipment purchase records." },
    { item: "Economic life confirmed by historical replacement data or industry standard", status: "ASSUMED", details: `Assumed ${engineInputs.economic_life_years ?? 8} years. Confirm with depreciation schedule.` },
    { item: "Maintenance history reviewed for major repair cycles", status: "REVIEW", details: "Cross-check average maintenance cost against 3-year actuals." },
    { item: "Electricity price from latest utility tariff or power purchase agreement", status: "ASSUMED", details: `Assumed at ${engineInputs.electricity_price ?? 0.12} USD/kWh. Verify with latest bill.` },
    { item: "Labor rate confirmed fully loaded (benefits, payroll taxes, supervision)", status: "REVIEW", details: "Cross-check with HR/payroll cost reports." },
    { item: "Facility allocation basis confirmed (floor area, machine footprint, utilities)", status: "REVIEW", details: "Review allocation method and denominator." },
    { item: "Productive utilization verified by actual production data (not target)", status: "REVIEW", details: "Review machine monitoring data for actual runtime percentage." },
    { item: "Current shop rate or market benchmark available for comparison", status: "REVIEW", details: "Check whether the calculated rate is competitive in the market." },
    { item: "Target revenue margin aligned with business strategy and commercial goals", status: "REVIEW", details: `Target margin is ${fmt(targetMargPct)}%. Confirm with management.` },
    { item: "Optional production scenario completeness verified", status: scenarioComplete ? "PROVIDED" : "NOT CHECKED", details: scenarioComplete ? "All four scenario fields provided." : "Scenario not provided — no capacity or per-part cost computed." },
  ];

  // ── 12. Recommended next action ───────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionStateCode === 2) {
    recommendedAction = {
      action: `Revise the shop rate immediately. Current cost of ${cur(totalCostPerHr)}/h exceeds the shop rate of ${cur(currentShopRate)}/h. Increase the rate to at least ${cur(minSustainableRate)}/h to cover costs, or reduce fixed/variable costs by at least ${cur(totalCostPerHr - currentShopRate)}/h.`,
      priority: "HIGH",
      expected_benefit: `Bringing the rate to ${cur(minSustainableRate)}/h eliminates the current loss position.`,
    };
  } else if (rateGap < 0) {
    recommendedAction = {
      action: `Increase the current shop rate from ${cur(currentShopRate)}/h to ${cur(targetSellRate)}/h to protect the ${fmt(targetMargPct)}% target revenue margin. Alternatively, reduce costs by ${cur(Math.abs(rateGap))}/h to close the gap.`,
      priority: "HIGH",
      expected_benefit: `Closing the ${cur(Math.abs(rateGap))}/h gap generates ${cur(Math.abs(annualRecovery))} in annual recovery.`,
    };
  } else {
    recommendedAction = {
      action: `Proceed to pricing review after verifying: utilization assumption, fully loaded labor rate, maintenance cost trend, and the optional production scenario assumptions. Current rate structure validates the ${fmt(targetMargPct)}% target margin.`,
      priority: "MEDIUM",
      expected_benefit: `Rate adequacy confirmed. Verification protects against unforeseen cost exposure.`,
    };
  }

  // ── 13. Assumptions used ──────────────────────────────────────────────
  const labelMap: Record<string, string> = {
    planned_operating_hours: "Planned Operating Hours per Year",
    utilization_percent: "Productive Utilization",
    planned_downtime_percent: "Planned Downtime Allowance",
    purchase_price: "Machine Purchase Price",
    residual_value: "Residual / Salvage Value",
    economic_life_years: "Economic Life",
    maintenance_cost: "Annual Maintenance Cost",
    insurance_tax_cost: "Annual Insurance and Tax Cost",
    facility_allocation: "Annual Facility Allocation",
    machine_power_kw: "Average Machine Power Demand",
    electricity_price: "Electricity Price",
    consumables_cost_per_hour: "Consumables Cost per Operating Hour",
    tooling_cost_per_hour: "Tooling Cost per Operating Hour",
    operator_count: "Number of Operators",
    labor_rate_per_hour: "Fully Loaded Labor Rate",
    current_shop_rate: "Current Shop Rate",
    target_margin_percent: "Target Revenue Margin",
    financing_cost_percent: "Annual Financing Cost Rate",
    other_annual_fixed_cost: "Other Annual Fixed Cost",
    annual_production_volume: "Annual Production Volume",
    cycle_time_seconds: "Cycle Time per Unit",
    setup_time_minutes: "Setup Time per Batch",
    average_batch_quantity: "Average Batch Quantity",
  };

  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: labelMap[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: `${val.value} ${val.unit}`,
  }));

  return {
    toolName,
    generatedAt: new Date().toISOString(),
    primaryKpi,
    decisionState,
    executiveInterpretation: execInterpretation,
    costDistribution,
    calculatedValues,
    hiddenLosses,
    missedAssumptions,
    riskWarnings,
    sensitivityChecks,
    checklist,
    recommendedAction,
    assumptionsUsed,
    traceId,
    totalCost: cur(totalCostPerHr),
    keyCostDriver: driverName,
    marginPercent: `${fmt(targetMargPct)}%`,
    marginAmount: cur(targetSellRate - totalCostPerHr),
  };
}
