// SectorCalc PRO V2 — FX Commodity Pass-Through Pricer Insight

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

export function buildFxCommodityPricerReport(params: {
  toolName: string;
  outputs: Record<string, number>;
  warnings: Array<{ id: string; severity: string; message: string }>;
  displayInputs: Record<string, { value: string; unit: string }>;
  engineInputs: Record<string, number>;
  traceId?: string;
}): ProInsightReport {
  const O = params.outputs;
  const displayInputs = params.displayInputs;
  const engineInputs = params.engineInputs;

  const baselineCost      = O.out_baseline_cost ?? 0;
  const fxChangePct       = O.out_fx_change_percent ?? 0;
  const commChangePct     = O.out_commodity_change_percent ?? 0;
  const weightedImpact    = O.out_weighted_cost_change_pct ?? 0;
  const deadband          = O.out_deadband_threshold_pct ?? 2;
  const passThroughAmt    = O.out_pass_through_amount ?? 0;
  const revisedPrice      = O.out_revised_price ?? 0;
  const protectedMargin   = O.out_protected_margin ?? 0;
  const unprotectedExp    = O.out_unprotected_exposure ?? 0;
  const annualEscalation  = O.out_annual_escalation ?? 0;
  const priceReviewTrig   = O.out_price_review_trigger ?? 0;
  const decisionScore     = O.out_final_decision_state ?? 0;

  const basePrice     = engineInputs.n_base_price ?? 0;
  const annualVol     = engineInputs.n_annual_volume ?? 0;

  const isTriggered = priceReviewTrig === 1;
  const absImpact = Math.abs(weightedImpact);

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (decisionScore === 2) {
    kpiLabel = "Cost Exposure Exceeds 5% — Price Blocked";
    kpiSeverity = "CRITICAL";
  } else if (decisionScore === 1) {
    kpiLabel = "Cost Movement Requires Price Review";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Cost Movement Within Deadband";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: `${pct(weightedImpact, 2)} / ${fmt(deadband, 0)}%`,
    unit: "weighted change / deadband",
    severity: kpiSeverity,
    explanation:
      `Weighted cost change ${pct(weightedImpact, 2)} vs. deadband ${fmt(deadband, 0)}%. ` +
      `Revised price ${currency(revisedPrice)}. Annual escalation ${currency(annualEscalation)}.`,
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (decisionScore === 0) {
    decisionState = {
      state: "PROFITABLE",
      label: "Within Deadband — No Action Required",
      summary:
        `Weighted cost change ${pct(weightedImpact, 2)} is within the ${fmt(deadband, 0)}% deadband. ` +
        `Price remains at ${currency(baselineCost)}. No pass-through triggered.`,
    };
  } else if (decisionScore === 1) {
    decisionState = {
      state: "AT_RISK",
      label: "Review Required — Deadband Exceeded",
      summary:
        `Weighted cost change ${pct(weightedImpact, 2)} exceeds the ${fmt(deadband, 0)}% deadband. ` +
        `Suggested revised price ${currency(revisedPrice)} (${currency(passThroughAmt)} pass-through). ` +
        `Annual escalation ${currency(annualEscalation)}. Customer notification recommended.`,
    };
  } else {
    decisionState = {
      state: "LOSS",
      label: "Blocked — Severe Cost Exposure",
      summary:
        `Weighted cost change ${pct(weightedImpact, 2)} exceeds the 5% severe exposure threshold. ` +
        `Price ${currency(revisedPrice)} with annual escalation ${currency(annualEscalation)}. ` +
        `Executive review required before any price action.`,
    };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  const execInterpretation =
    `This analysis examines a product with a base price of ${currency(basePrice)} ` +
    `and annual volume of ${fmt(annualVol, 0)} units. ` +
    `FX rates moved by ${pct(fxChangePct, 2)} (spot ${fmt(engineInputs.n_fx_rate_spot ?? 0, 4)} vs. budget ${fmt(engineInputs.n_fx_rate_budget ?? 0, 4)}) ` +
    `and commodity index changed by ${pct(commChangePct, 2)} ` +
    `(current ${fmt(engineInputs.n_commodity_index_current ?? 0, 1)} vs. budget ${fmt(engineInputs.n_commodity_index_budget ?? 0, 1)}). ` +
    `After applying hedging (FX ${fmt(engineInputs.n_fx_hedge_pct ?? 0, 0)}%, commodity ${fmt(engineInputs.n_commodity_hedge_pct ?? 0, 0)}%), ` +
    `the weighted unhedged cost impact is ${pct(weightedImpact, 2)}. ` +
    (isTriggered
      ? `This exceeds the ${fmt(deadband, 0)}% deadband, triggering a price review. ` +
        `The suggested pass-through is ${currency(passThroughAmt)} per unit (${currency(annualEscalation)} annualized).`
      : `This remains within the ${fmt(deadband, 0)}% deadband, so no price adjustment is needed.`) +
    ` Protected margin is ${currency(protectedMargin)} per unit with ${currency(unprotectedExp)} of unhedged exposure per unit.`;

  // ── Cost Distribution ─────────────────────────────────────────────
  const costDistribution: CostDistributionItem[] = [
    { category: "Base Price", amount: baselineCost, percentage: 100 },
    { category: "FX Cost Change", amount: baselineCost * Math.abs(fxChangePct) / 100, percentage: parseFloat(Math.abs(fxChangePct).toFixed(1)) },
    { category: "Commodity Cost Change", amount: baselineCost * Math.abs(commChangePct) / 100, percentage: parseFloat(Math.abs(commChangePct).toFixed(1)) },
    { category: "Weighted Pass-Through", amount: Math.abs(passThroughAmt), percentage: parseFloat(absImpact.toFixed(1)) },
  ];

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Weighted Cost Change", value: pct(weightedImpact, 2), unit: "%" },
    { label: "Deadband Threshold", value: `${fmt(deadband, 0)}%`, unit: "%" },
    { label: "Pass-Through Amount", value: currency(passThroughAmt), unit: "per unit" },
    { label: "Revised Price", value: currency(revisedPrice), unit: "per unit" },
    { label: "Protected Margin", value: currency(protectedMargin), unit: "per unit" },
    { label: "Unprotected Exposure", value: currency(unprotectedExp), unit: "per unit" },
    { label: "Annual Escalation", value: currency(annualEscalation), unit: "per year" },
    { label: "Price Review Trigger", value: isTriggered ? "Yes" : "No", unit: "" },
  ];

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Unhedged Residual Exposure",
      description: "Even with hedging, residual FX and commodity exposure passes through to margin",
      potential_impact: `${currency(unprotectedExp * annualVol)}/yr potential margin erosion`,
      severity: absImpact > 3 ? "HIGH" : "MEDIUM",
    },
    {
      title: "Lag in Index Pass-Through",
      description: "Contractual price adjustment lags may delay pass-through by 1-3 months",
      potential_impact: `Up to ${currency(Math.abs(passThroughAmt) * (annualVol / 12) * 2)} temporary margin pressure`,
      severity: isTriggered ? "HIGH" : "MEDIUM",
    },
    {
      title: "Hedge Rollover Risk",
      description: "Hedging contracts may not be renewable at favorable rates upon expiry",
      potential_impact: `${currency(baselineCost * annualVol * 0.02)}/yr additional exposure if hedge costs rise`,
      severity: "MEDIUM",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Linear Pass-Through Assumption",
      description: "Assumes cost changes pass through linearly to price without volume elasticity effects",
      impact_on_result: "Actual pass-through may be constrained by customer contracts or competitive pressure",
    },
    {
      title: "Static Hedge Ratio",
      description: "Hedge coverage percentages are assumed constant throughout the period",
      impact_on_result: "Actual hedge ratios may vary, changing effective exposure",
    },
    {
      title: "Material Cost Percentage Stability",
      description: "Assumes material cost as a percentage of price remains constant across volume changes",
      impact_on_result: "Fixed cost absorption changes at different volume levels may affect true margin",
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (decisionScore === 2) {
    riskWarnings.push({
      title: "Severe Cost Exposure",
      description: `Weighted cost impact of ${pct(weightedImpact, 2)} exceeds the 5% severe threshold. Immediate executive action required.`,
      severity: "CRITICAL",
      mitigation: "Renegotiate supplier contracts, increase hedge coverage, or adjust base pricing",
    });
  }
  if (decisionScore === 1) {
    riskWarnings.push({
      title: "Deadband Exceeded — Price Review",
      description: `Cost change of ${pct(weightedImpact, 2)} exceeds the ${fmt(deadband, 0)}% deadband. Customer notification may be contractually required.`,
      severity: "WARNING",
      mitigation: "Initiate price review process and notify procurement/sales teams",
    });
  }
  if (Math.abs(fxChangePct) > 5) {
    riskWarnings.push({
      title: "Significant FX Movement",
      description: `FX rate changed by ${pct(fxChangePct, 2)}, indicating potential sustained currency pressure.`,
      severity: "WARNING",
      mitigation: "Review FX hedge strategy and consider extending hedge duration",
    });
  }
  if (Math.abs(commChangePct) > 10) {
    riskWarnings.push({
      title: "High Commodity Volatility",
      description: `Commodity index moved by ${pct(commChangePct, 2)}, well above typical fluctuation bands.`,
      severity: "WARNING",
      mitigation: "Evaluate fixed-price supply agreements or additional commodity hedging",
    });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({
      title: "Customer Price Sensitivity",
      description: "Pass-through price increases may face customer resistance or volume reduction",
      severity: "INFO",
      mitigation: "Prepare value-add justification and competitive benchmarking for customer discussions",
    });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    {
      parameter: "FX Rate +5%",
      change: "+5%",
      impact: `Weighted impact changes by approximately ${pct(5 * (1 - (engineInputs.n_fx_hedge_pct ?? 0) / 100) * (1 - (engineInputs.n_material_cost_pct ?? 0) / 100), 2)}`,
      severity: (engineInputs.n_fx_hedge_pct ?? 0) < 50 ? "HIGH" : "MEDIUM",
    },
    {
      parameter: "Commodity Index +10%",
      change: "+10%",
      impact: `Weighted impact changes by approximately ${pct(10 * (1 - (engineInputs.n_commodity_hedge_pct ?? 0) / 100) * (engineInputs.n_material_cost_pct ?? 0) / 100, 2)}`,
      severity: (engineInputs.n_commodity_hedge_pct ?? 0) < 50 ? "HIGH" : "MEDIUM",
    },
    {
      parameter: "Material Cost Share +5pp",
      change: "+5pp",
      impact: `Increases commodity exposure weight, amplifying pass-through by ${pct(absImpact * 0.05 / ((engineInputs.n_material_cost_pct ?? 1) / 100), 2)}`,
      severity: "MEDIUM",
    },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "FX spot rate sourced from verified financial data provider", status: "ASSUMED", details: "Based on provided spot rate input" },
    { item: "Hedge coverage percentages confirmed with treasury/risk team", status: "REVIEW", details: "Hedge ratios may change quarterly" },
    { item: "Commodity index validated against published market data", status: "ASSUMED", details: "Based on provided index values" },
    { item: "Deadband threshold aligned with customer contract terms", status: "REVIEW", details: "Default 2% used — verify contractual deadband" },
    { item: "Pass-through mechanism complies with governing price agreement", status: "REVIEW", details: "Legal review of pass-through clause recommended" },
    { item: "Annual volume forecast validated against latest sales projection", status: "ASSUMED", details: "Based on provided annual volume figure" },
    { item: "Tax and duty implications of price adjustment considered", status: "NOT CHECKED", details: "Cross-border tax effects not modeled" },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (decisionScore === 2) {
    recommendedAction = {
      action: `Block price action. Escalate to executive committee. Weighted cost impact ${pct(weightedImpact, 2)} exceeds 5% severe threshold. Review hedge strategy and supplier contracts immediately.`,
      priority: "HIGH",
      expected_benefit: `Avoids unilateral price action that may breach customer agreements; enables structured risk response.`,
    };
  } else if (decisionScore === 1) {
    recommendedAction = {
      action: `Initiate price review. Notify customer of ${currency(passThroughAmt)}/unit pass-through (${pct(weightedImpact, 2)}). Target revised price ${currency(revisedPrice)}.`,
      priority: "HIGH",
      expected_benefit: `Recovers ${currency(annualEscalation)} in annual margin through contractual pass-through mechanism.`,
    };
  } else {
    recommendedAction = {
      action: `No price action required. Monitor FX and commodity markets quarterly. Re-run analysis if spot rate or index moves by more than 5%.`,
      priority: "LOW",
      expected_benefit: `Maintains customer pricing stability while remaining within risk tolerance.`,
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
  };
}
