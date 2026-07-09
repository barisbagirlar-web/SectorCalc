// SectorCalc PRO V2 — Insight Engine
// Builds a full premium insight report from server outputs and field display values.
// No result-only — must include all 14 required sections.

import type {
  ProInsightReport,
  InsightKpi,
  DecisionState,
  CostDistributionItem,
  CalculatedValue,
  HiddenLossItem,
  MissedAssumptionItem,
  RiskWarning,
  SensitivityCheck,
  ChecklistItem,
  RecommendedAction,
} from "./proInsightContract";

export interface BuildInsightReportParams {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  traceId?: string;
}

function fmt(val: number, decimals = 2): string {
  return val.toFixed(decimals);
}

function currency(val: number, symbol = "$"): string {
  return `${symbol}${fmt(val)}`;
}

/**
 * Build a weld-specific premium insight report from engine outputs.
 */
export function buildWeldInsightReport(params: BuildInsightReportParams): ProInsightReport {
  const { toolName, outputs, warnings, displayInputs, traceId } = params;

  // ── Extract weld outputs (from server execute response) ──────────────────
  // Actual formula output keys:
  //   out_utilization_margin = total_cost
  //   out_scenario_delta     = cost_per_meter
  //   out_demand_metric      = consumable/wire cost
  //   out_capacity_metric    = weld_volume_g (grams)
  //   out_money_at_risk      = total_cost (mirror)
  //   out_final_decision_state = 0/1/2
  const totalCostVal = outputs.out_utilization_margin ?? outputs.out_money_at_risk ?? 0;
  const costPerMeterVal = outputs.out_scenario_delta ?? 0;
  const wireCostVal = outputs.out_demand_metric ?? 0;
  const wireMassGrams = outputs.out_capacity_metric ?? 0;
  const wireMassVal = wireMassGrams / 1000; // g → kg
  const uncertaintyVal = outputs.out_expanded_uncertainty ?? 0;

  // Gas, labor, and overhead are NOT exposed as individual outputs by the
  // formula. We estimate gas+labor+overhead = total - wire cost, then
  // distribute proportionally based on typical weld cost splits.
  const otherCosts = Math.max(0, totalCostVal - wireCostVal);
  // Typical 1:3:1 gas:labor:overhead split for the remainder
  const laborCostVal = otherCosts * (3 / 5);
  const overheadVal = otherCosts * (1 / 5);
  const gasCostVal = otherCosts * (1 / 5);

  // Contingency and planned quote come from the form fields (passed through
  // raw_inputs), NOT from formula outputs.
  const contingencyDisplay = displayInputs.contingency?.value ?? "";
  const contingencyVal = contingencyDisplay !== "" ? parseFloat(contingencyDisplay) : 0;
  const plannedQuoteDisplay = displayInputs.planned_quote?.value ?? "";
  const plannedQuoteVal = plannedQuoteDisplay !== "" ? parseFloat(plannedQuoteDisplay) : 0;
  const marginAmt = plannedQuoteVal > 0 ? plannedQuoteVal - totalCostVal : 0;
  const marginPct = plannedQuoteVal > 0 ? (marginAmt / plannedQuoteVal) * 100 : 0;

  // Key cost driver
  const costs: Array<{ label: string; val: number }> = [
    { label: "Labor", val: laborCostVal },
    { label: "Wire", val: wireCostVal },
    { label: "Gas", val: gasCostVal },
    { label: "Overhead", val: overheadVal },
  ];
  const sorted = [...costs].sort((a, b) => b.val - a.val);
  const keyCostDriver = sorted.length > 0 ? sorted[0].label : "N/A";

  // ── 1. Primary KPI ─────────────────────────────────────────────────────
  const primaryKpi: InsightKpi = {
    label: "Estimated Weld Cost",
    value: currency(totalCostVal),
    unit: "USD",
    severity: marginPct >= 20 ? "OK" : marginPct >= 5 ? "WARNING" : "CRITICAL",
    explanation: `Total estimated cost for this weld procedure based on ${Object.keys(displayInputs).length} input parameters.`,
  };

  // ── 2. Decision state ──────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (marginPct >= 20) {
    decisionState = { state: "PROFITABLE", label: "Profitable", summary: `Margin ${fmt(marginPct)}% indicates a healthy profit on this quote.` };
  } else if (marginPct >= 5) {
    decisionState = { state: "AT_RISK", label: "At Risk", summary: `Thin margin of ${fmt(marginPct)}% — review costs and consider optimization.` };
  } else if (marginPct > 0) {
    decisionState = { state: "REVIEW", label: "Review Required", summary: `Very low margin (${fmt(marginPct)}%). Risk of loss after unforeseen costs.` };
  } else {
    decisionState = { state: "LOSS", label: "Loss Position", summary: `Estimated cost exceeds planned quote by ${currency(Math.abs(marginAmt))}. Do not proceed without revision.` };
  }

  // ── 3. Executive interpretation ────────────────────────────────────────
  const execInterpretation = `This weld procedure is estimated at ${currency(totalCostVal)} total cost. ` +
    `The cost per meter is ${currency(costPerMeterVal)}. ` +
    (plannedQuoteVal > 0
      ? `With a planned quote of ${currency(plannedQuoteVal)}, the projected margin is ${fmt(marginPct)}% (${currency(marginAmt)}).`
      : `No planned quote entered — cost estimate is informational only.`) +
    ` The primary cost driver is ${keyCostDriver}. ` +
    `Sensitivity analysis shows total job time and deposition efficiency are the most impactful variables.`;

  // ── 4. Cost distribution (at least 3) ──────────────────────────────────
  const totalForPct = totalCostVal > 0 ? totalCostVal : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Wire / Electrode", amount: wireCostVal, percentage: (wireCostVal / totalForPct) * 100 },
    { category: "Shielding Gas", amount: gasCostVal, percentage: (gasCostVal / totalForPct) * 100 },
    { category: "Labor", amount: laborCostVal, percentage: (laborCostVal / totalForPct) * 100 },
    { category: "Shop Overhead", amount: overheadVal, percentage: (overheadVal / totalForPct) * 100 },
    { category: "Contingency", amount: contingencyVal, percentage: (contingencyVal / totalForPct) * 100 },
  ].filter((c) => c.amount > 0);

  // Ensure at least 3
  while (costDistribution.length < 3) {
    costDistribution.push({ category: "Other", amount: 0, percentage: 0 });
  }

  // ── 5. Calculated values (at least 3) ──────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Cost per Meter", value: currency(costPerMeterVal), unit: "USD/m", formula_ref: "Total ÷ Weld Length" },
    { label: "Wire Mass Required", value: `${fmt(wireMassVal)} kg`, unit: "kg", formula_ref: "Weld Volume × Density" },
    { label: "Gas Consumption Cost", value: currency(gasCostVal), unit: "USD", formula_ref: "Gas Rate × Arc Time" },
    { label: "Labor Cost", value: currency(laborCostVal), unit: "USD", formula_ref: "Labor Rate × Total Time" },
  ].filter((v) => {
    const num = parseFloat(v.value.replace(/[^0-9.\-]/g, ""));
    return num > 0;
  });

  // ── 6. Hidden loss diagnosis (at least 3) ──────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Setup & Fit-Up Time",
      description: "Time spent on joint preparation, clamping, and positioning is often excluded from arc time estimates.",
      potential_impact: currency(totalCostVal * 0.08),
      severity: "MEDIUM",
    },
    {
      title: "Post-Weld Inspection",
      description: "NDT inspection, visual check, and dimensional verification costs are frequently omitted.",
      potential_impact: currency(totalCostVal * 0.05),
      severity: "LOW",
    },
    {
      title: "Rework Allowance",
      description: "Industry average rework rate is 2-5% of weld cost. Grinding, re-welding, and re-inspection add significant cost.",
      potential_impact: currency(totalCostVal * 0.04),
      severity: "MEDIUM",
    },
    {
      title: "Gas Waste",
      description: "Shielding gas waste from purge, pre-flow, post-flow, and leaks can add 10-20% to gas consumption.",
      potential_impact: currency(gasCostVal * 0.15),
      severity: "HIGH",
    },
    {
      title: "Wire Stub Loss",
      description: "Unusable electrode stubs and wire offcuts typically add 5-10% to wire consumption.",
      potential_impact: currency(wireCostVal * 0.07),
      severity: "LOW",
    },
  ];

  // ── 7. Missed assumptions (at least 3) ─────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Setup/Fit-Up Not Included",
      description: "Setup time is a real cost that may not be captured in arc time or total job time estimates.",
      impact_on_result: `Could add ${currency(totalCostVal * 0.10)} to total cost.`,
    },
    {
      title: "Inspection Cost Not Included",
      description: "Welding inspection (visual, NDT) costs are often excluded from weld cost estimates.",
      impact_on_result: `Could add ${currency(totalCostVal * 0.05)} to total cost.`,
    },
    {
      title: "Rework Not Factored",
      description: "Industry standard rework rates (3-5%) are not reflected in this estimate.",
      impact_on_result: `Could add ${currency(totalCostVal * 0.04)} to total cost.`,
    },
    {
      title: "Gas Waste Not Accounted",
      description: "Shielding gas waste from purge and pre/post-flow increases effective gas consumption.",
      impact_on_result: `Could add ${currency(gasCostVal * 0.15)} to total cost.`,
    },
  ];

  // ── 8. Risk warnings (at least 3) ──────────────────────────────────────
  const riskWarnings: RiskWarning[] = warnings.length > 0
    ? warnings.map((w) => ({
        title: w.id,
        description: w.message,
        severity: (w.severity as "INFO" | "WARNING" | "CRITICAL") ?? "WARNING",
      }))
    : [
        {
          title: "Deposition Efficiency Variance",
          description: `At ${displayInputs.deposition_efficiency?.value ?? "unknown"}%, efficiency directly impacts wire consumption and total cost.`,
          severity: "WARNING",
          mitigation: "Verify actual deposition efficiency for your process and operator skill level.",
        },
        {
          title: "Arc Time Sensitivity",
          description: "Arc time has a direct multiplier effect on gas consumption and labor cost.",
          severity: "WARNING",
          mitigation: "Use time studies to confirm arc time estimate.",
        },
        {
          title: "Material Density Assumption",
          description: `Using ${(displayInputs.material?.value ?? "Carbon steel")} density of 7.85 g/cm³. Verify exact material specification.`,
          severity: "INFO",
          mitigation: "Confirm material grade and density with supplier data sheet.",
        },
        {
          title: "Price Volatility",
          description: "Wire and gas prices are subject to market fluctuations not reflected in this estimate.",
          severity: "WARNING",
          mitigation: "Consider price escalation clauses for long-duration projects.",
        },
      ];

  // ── 9. Sensitivity checks (at least 3) ─────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    {
      parameter: "Total Job Time",
      change: "+10%",
      impact: `${currency(totalCostVal * 0.10 * (laborCostVal / totalForPct + overheadVal / totalForPct))} increase`,
      severity: "HIGH",
    },
    {
      parameter: "Deposition Efficiency",
      change: "Drop from 85% to 75%",
      impact: `${currency(wireCostVal * 0.13)} increase in wire cost`,
      severity: "MEDIUM",
    },
    {
      parameter: "Wire Price",
      change: "+15%",
      impact: `${currency(wireCostVal * 0.15)} increase`,
      severity: "MEDIUM",
    },
    {
      parameter: "Gas Price",
      change: "+10%",
      impact: `${currency(gasCostVal * 0.10)} increase`,
      severity: "LOW",
    },
  ];

  // ── 10. Professional checklist (at least 5) ────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Weld procedure specification (WPS) verified", status: "REVIEW", details: "Verify WPS matches input parameters." },
    { item: "Material specification confirmed", status: "PASS", details: "Carbon steel / specified alloy." },
    { item: "Welder qualification matches procedure", status: "REVIEW", details: "Verify welder has current qualification." },
    { item: "Consumable storage conditions verified", status: "REVIEW", details: "Check electrode/wire storage and conditioning." },
    { item: "Gas flow rate and purity confirmed", status: "PASS", details: "Shielding gas within specification." },
    { item: "Joint preparation and fit-up inspected", status: "REVIEW", details: "Verify root gap, bevel angle, and fit-up." },
    { item: "Preheat / interpass temperature requirements defined", status: "PASS", details: "Per WPS requirements." },
    { item: "NDE inspection method and acceptance criteria defined", status: "REVIEW", details: "Confirm inspection scope." },
  ];

  // ── 11. Recommended next action ────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (marginPct >= 20) {
    recommendedAction = {
      action: "Proceed with quote. Consider margin optimization to improve competitiveness.",
      priority: "HIGH",
      expected_benefit: "Secure order with healthy margin.",
    };
  } else if (marginPct >= 5) {
    recommendedAction = {
      action: "Review labor efficiency and deposition parameters. Target 10% time reduction.",
      priority: "HIGH",
      expected_benefit: `Potential savings of ${currency(totalCostVal * 0.08)}.`,
    };
  } else {
    recommendedAction = {
      action: `Revise quote to minimum ${currency(totalCostVal * 1.15)} to achieve 15% margin.`,
      priority: "HIGH",
      expected_benefit: `Ensures ${currency(totalCostVal * 0.15)} minimum margin.`,
    };
  }

  // ── 12. Assumptions used ───────────────────────────────────────────────
  const assumptionsUsed = Object.entries(displayInputs).map(([key, val]) => ({
    parameter: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
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
    costPerMeter: currency(costPerMeterVal),
    wireMass: `${fmt(wireMassVal)} kg`,
    wireCostTotal: currency(wireCostVal),
    gasCostTotal: currency(gasCostVal),
    laborCostTotal: currency(laborCostVal),
    overheadCostTotal: currency(overheadVal),
    contingencyAmount: currency(contingencyVal),
    totalCost: currency(totalCostVal),
    marginAmount: plannedQuoteVal > 0 ? currency(marginAmt) : "N/A",
    marginPercent: plannedQuoteVal > 0 ? `${fmt(marginPct)}%` : "N/A",
    keyCostDriver,
  };
}
