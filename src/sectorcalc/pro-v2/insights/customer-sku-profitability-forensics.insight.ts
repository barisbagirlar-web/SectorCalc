// SectorCalc PRO V2 — Customer SKU Profitability Forensics Insight Report

import type {
  ProInsightReport, InsightKpi, DecisionState, CostDistributionItem,
  CalculatedValue, HiddenLossItem, MissedAssumptionItem, RiskWarning,
  SensitivityCheck, ChecklistItem, RecommendedAction,
} from "../proInsightContract";

function fmt(val: number, decimals = 2): string { return val.toFixed(decimals); }
function currency(val: number, symbol = "$"): string { return val < 0 ? `-${symbol}${fmt(Math.abs(val))}` : `${symbol}${fmt(val)}`; }
function pct(val: number): string { return `${fmt(val)}%`; }

export function buildCustomerSkuForensicsReport(params: {
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

  const revenue             = O.out_customer_sku_revenue ?? 0;
  const productCost         = O.out_product_cost ?? 0;
  const logisticsCost       = O.out_logistics_cost ?? 0;
  const serviceCost         = O.out_service_cost ?? 0;
  const returnsClaims       = O.out_returns_claims_cost ?? 0;
  const financingTerm       = O.out_financing_term_cost ?? 0;
  const contributionProfit  = O.out_contribution_profit ?? 0;
  const fullyLoadedProfit   = O.out_fully_loaded_profit ?? 0;
  const marginPct           = O.out_margin_percentage ?? 0;
  const crossSubsidyFlag    = O.out_cross_subsidization_flag ?? 0;
  const annualRisk          = O.out_annual_money_at_risk ?? 0;
  const decisionScore       = O.out_final_decision_state ?? 0;

  const isToxic = crossSubsidyFlag === 1;
  const isBelowTarget = decisionScore === 1;
  const isGood = decisionScore === 0;

  const unitPrice  = engineInputs.n_unit_price ?? 0;
  const annualVol  = engineInputs.n_annual_volume ?? 0;
  const targetMarg = engineInputs.n_target_margin ?? 0;

  // ── Primary KPI ──────────────────────────────────────────────────
  let kpiLabel: string;
  let kpiSeverity: "CRITICAL" | "WARNING" | "OK";
  if (isToxic) {
    kpiLabel = "Cash-Negative SKU — Cross-Subsidizing";
    kpiSeverity = "CRITICAL";
  } else if (isBelowTarget) {
    kpiLabel = "Below Target Margin — Review Required";
    kpiSeverity = "WARNING";
  } else {
    kpiLabel = "Target Margin Achieved";
    kpiSeverity = "OK";
  }

  const primaryKpi: InsightKpi = {
    label: kpiLabel,
    value: isToxic ? currency(Math.abs(annualRisk)) : currency(fullyLoadedProfit),
    unit: isToxic ? "USD/yr at risk" : "USD/yr profit",
    severity: kpiSeverity,
    explanation:
      `Revenue ${currency(revenue)}, fully loaded profit ${currency(fullyLoadedProfit)} ` +
      `(${pct(marginPct)} margin vs target ${pct(targetMarg)}). ` +
      (isToxic ? `This SKU destroys value — annual money at risk: ${currency(annualRisk)}.` :
        isBelowTarget ? `Below target by ${pct(targetMarg - marginPct)}.` :
        `Exceeds target by ${pct(marginPct - targetMarg)}.`),
  };

  // ── Decision State ─────────────────────────────────────────────────
  let decisionState: DecisionState;
  if (isGood) {
    decisionState = {
      state: "PROFITABLE",
      label: "Fully Loaded Margin Achieved",
      summary:
        `Net margin ${pct(marginPct)} meets or exceeds target ${pct(targetMarg)}. ` +
        `Fully loaded profit ${currency(fullyLoadedProfit)} on volume ${fmt(annualVol, 0)} units. ` +
        `No cross-subsidization detected.`,
    };
  } else if (isBelowTarget) {
    decisionState = {
      state: "AT_RISK",
      label: "Below Target — Margin Gap Detected",
      summary:
        `Net margin ${pct(marginPct)} is below target ${pct(targetMarg)} ` +
        `by ${pct(targetMarg - marginPct)}. Fully loaded profit ${currency(fullyLoadedProfit)}. ` +
        `SKU contributes positively but misses margin threshold.`,
    };
  } else {
    decisionState = {
      state: "LOSS",
      label: "Toxic SKU — Cross-Subsidization Active",
      summary:
        `Net margin ${pct(marginPct)} is negative. Fully loaded loss ${currency(Math.abs(fullyLoadedProfit))} ` +
        `on volume ${fmt(annualVol, 0)} units. Annual money at risk: ${currency(annualRisk)}. ` +
        `Other products or customers are subsidizing this SKU. Immediate reprice, restructure, or discontinue.`,
    };
  }

  // ── Executive Interpretation ──────────────────────────────────────
  let execInterpretation: string;
  if (isToxic) {
    execInterpretation =
      `This SKU is cash-negative. At ${currency(unitPrice)}/unit, variable costs plus ` +
      `logistics (${pct(engineInputs.n_logistics_cost_pct ?? 0)}), service (${pct(engineInputs.n_service_cost_pct ?? 0)}), ` +
      `returns (${pct(engineInputs.n_return_rate_pct ?? 0)}), and financing (${pct(engineInputs.n_financing_cost_pct ?? 0)}) ` +
      `result in a net loss of ${currency(Math.abs(fullyLoadedProfit / annualVol))} per unit. ` +
      `Annualized money at risk: ${currency(annualRisk)}. ` +
      `Cross-subsidization is active — profitable SKUs are covering the losses of this product.`;
  } else if (isBelowTarget) {
    execInterpretation =
      `This SKU is profitable but below the target margin. Revenue ${currency(revenue)} with ` +
      `fully loaded profit of ${currency(fullyLoadedProfit)} (${pct(marginPct)}). ` +
      `The contribution profit of ${currency(contributionProfit)} shows the SKU covers variable costs, ` +
      `but the net margin of ${pct(marginPct)} falls short of the ${pct(targetMarg)} target. ` +
      `A repricing of ${currency((unitPrice * targetMarg / 100 + (unitPrice - (fullyLoadedProfit / annualVol))) - unitPrice)}/unit ` +
      `or equivalent cost reduction is needed to close the gap.`;
  } else {
    execInterpretation =
      `This SKU is performing well. Revenue ${currency(revenue)} generates a fully loaded profit ` +
      `of ${currency(fullyLoadedProfit)} (${pct(marginPct)}), exceeding the target of ${pct(targetMarg)}. ` +
      `Contribution profit of ${currency(contributionProfit)} reflects healthy margin structure. ` +
      `No cross-subsidization risk detected. The pricing and cost structure for this SKU is commercially sound.`;
  }

  // ── Cost Distribution ─────────────────────────────────────────────
  const totalCost = productCost + logisticsCost + serviceCost + returnsClaims + financingTerm;
  const costBase = totalCost > 0 ? totalCost : 1;
  const costDistribution: CostDistributionItem[] = [
    { category: "Product Cost (Materials + Direct Labor)", amount: productCost, percentage: parseFloat(((productCost / costBase) * 100).toFixed(1)) },
    { category: "Logistics & Distribution", amount: logisticsCost, percentage: parseFloat(((logisticsCost / costBase) * 100).toFixed(1)) },
    { category: "Post-Sales Service", amount: serviceCost, percentage: parseFloat(((serviceCost / costBase) * 100).toFixed(1)) },
    { category: "Returns & Claims", amount: returnsClaims, percentage: parseFloat(((returnsClaims / costBase) * 100).toFixed(1)) },
    { category: "Financing & Payment Terms", amount: financingTerm, percentage: parseFloat(((financingTerm / costBase) * 100).toFixed(1)) },
  ];

  // ── Calculated Values ─────────────────────────────────────────────
  const calculatedValues: CalculatedValue[] = [
    { label: "Total SKU Revenue", value: currency(revenue), unit: "per year", formula_ref: "Unit price × annual volume" },
    { label: "Contribution Profit", value: currency(contributionProfit), unit: "per year", formula_ref: "Revenue − variable costs before ancillary charges" },
    { label: "Fully Loaded Profit", value: currency(fullyLoadedProfit), unit: "per year", formula_ref: "Contribution profit − returns − financing costs" },
    { label: "Net Margin", value: pct(marginPct), unit: "%", formula_ref: "Fully loaded profit ÷ revenue × 100" },
    { label: "Product Cost", value: currency(productCost), unit: "per year", formula_ref: "Unit variable cost × annual volume" },
    { label: "Ancillary Cost Burden", value: currency(logisticsCost + serviceCost + returnsClaims + financingTerm), unit: "per year", formula_ref: "Logistics + service + returns + financing" },
    { label: "Annual Money at Risk", value: currency(annualRisk), unit: "per year", formula_ref: "Net loss when cross-subsidization is active" },
    { label: "Cross-Subsidization", value: crossSubsidyFlag === 1 ? "Active" : "None", unit: "", formula_ref: "Flag set when net margin per unit is negative" },
  ];

  // ── Hidden Losses ─────────────────────────────────────────────────
  const hiddenLosses: HiddenLossItem[] = [
    {
      title: "Unallocated Customer-Specific Costs",
      description: "Customer-specific support, samples, and engineering time may not be captured in standard cost allocations",
      potential_impact: `${currency(revenue * 0.02)}/yr`,
      severity: isToxic ? "HIGH" : "MEDIUM",
    },
    {
      title: "Volume Discount Erosion",
      description: "Off-invoice discounts, rebates, and volume incentives reduce effective selling price below list",
      potential_impact: `${currency(revenue * 0.03)}/yr potential erosion`,
      severity: "MEDIUM",
    },
    {
      title: "Inventory Holding & Obsolescence",
      description: "SKU-specific inventory carrying costs and obsolescence risk not included in logistics percentage",
      potential_impact: `${currency(productCost * 0.05)}/yr carrying cost`,
      severity: marginPct < 15 ? "HIGH" : "LOW",
    },
  ];

  // ── Missed Assumptions ────────────────────────────────────────────
  const missedAssumptions: MissedAssumptionItem[] = [
    {
      title: "Fixed Cost Allocation",
      description: "No fixed overhead allocation per SKU. All costs are modeled as variable or price-dependent percentages",
      impact_on_result: `True SKU profitability may be ${pct(Math.max(0, marginPct - 5))} to ${pct(marginPct + 5)} after fixed cost allocation`,
    },
    {
      title: "Return Rate Stability",
      description: "Return rate is modeled as a simple percentage. Actual returns may spike seasonally or by customer segment",
      impact_on_result: `A ${pct(2)} increase in return rate reduces net margin by approximately ${pct(2)}`,
    },
    {
      title: "Cost Pass-Through Assumption",
      description: "Logistics and service costs scale proportionally with price. In reality, some costs are fixed per unit regardless of price",
      impact_on_result: `Low-price SKUs may have higher true ancillary cost burden than modeled`,
    },
  ];

  // ── Risk Warnings ─────────────────────────────────────────────────
  const riskWarnings: RiskWarning[] = [];
  if (isToxic) {
    riskWarnings.push({
      title: "Cross-Subsidization Active — Cash-Negative SKU",
      description: `Net loss of ${currency(fullyLoadedProfit)} per year. Other profitable products are subsidizing this SKU.`,
      severity: "CRITICAL",
      mitigation: "Reprice above break-even, restructure cost base, or discontinue the SKU.",
    });
  }
  if (isBelowTarget) {
    riskWarnings.push({
      title: "Margin Gap Detected",
      description: `Net margin ${pct(marginPct)} is below target ${pct(targetMarg)} by ${pct(targetMarg - marginPct)}.`,
      severity: "WARNING",
      mitigation: "Review pricing, negotiate cost reductions, or improve operational efficiency.",
    });
  }
  if (marginPct < 10 && !isToxic) {
    riskWarnings.push({
      title: "Thin Margin — Vulnerable to Cost Increases",
      description: `A ${pct(marginPct)} margin provides limited buffer against raw material or logistics cost inflation.`,
      severity: "WARNING",
      mitigation: "Build cost escalation clauses into customer contracts.",
    });
  }
  if (annualRisk < 0 || isToxic) {
    riskWarnings.push({
      title: "Annualized Loss Exposure",
      description: `Annual money at risk: ${currency(annualRisk)}. This loss compounds if volume grows without repricing.`,
      severity: "CRITICAL",
      mitigation: "Implement price floor policy. No SKU should sell below fully loaded cost.",
    });
  }
  if (riskWarnings.length < 3) {
    riskWarnings.push({
      title: "Concentration Risk",
      description: `Single SKU profitability analysis does not capture portfolio-level risk or customer concentration.`,
      severity: "INFO",
      mitigation: "Run portfolio-level margin analysis to identify systemic risk.",
    });
  }

  // ── Sensitivity Checks ────────────────────────────────────────────
  const sensitivityChecks: SensitivityCheck[] = [
    { parameter: "Price Change (+5%)", change: "+5%", impact: unitPrice > 0 ? `${currency(revenue * 0.05)} additional revenue` : "N/A", severity: isToxic ? "HIGH" : "LOW" },
    { parameter: "Variable Cost Increase (+10%)", change: "+10%", impact: productCost > 0 ? `${currency(productCost * 0.1)} cost increase` : "N/A", severity: marginPct < 15 ? "HIGH" : "MEDIUM" },
    { parameter: "Logistics Cost (+2pp)", change: "+2pp", impact: `${currency(unitPrice * 0.02 * annualVol)} additional logistics cost`, severity: isToxic || isBelowTarget ? "HIGH" : "MEDIUM" },
    { parameter: "Return Rate (+1pp)", change: "+1pp", impact: `${currency(unitPrice * 0.01 * annualVol)} additional returns cost`, severity: "MEDIUM" },
    { parameter: "Volume Decline (-20%)", change: "-20%", impact: revenue > 0 ? `Revenue reduces by ${currency(revenue * 0.2)}` : "N/A", severity: "MEDIUM" },
  ];

  // ── Professional Checklist ────────────────────────────────────────
  const checklist: ChecklistItem[] = [
    { item: "Unit selling price confirmed with customer contract or price list", status: "REVIEW", details: "Verify latest agreed price and any pending adjustments." },
    { item: "Variable cost validated against BOM and purchasing records", status: "REVIEW", details: "Use current supplier pricing including any recent changes." },
    { item: "Logistics cost percentage verified with distribution records", status: "REVIEW", details: "Include freight, warehousing, and last-mile delivery." },
    { item: "Service cost estimate reviewed with after-sales team", status: "REVIEW", details: "Warranty, technical support, and field service costs." },
    { item: "Return rate based on historical claims data", status: "REVIEW", details: "Include warranty returns, credit memos, and replacements." },
    { item: "Financing cost confirmed with finance department", status: "REVIEW", details: "Factoring fees, payment term discounts, and customer financing." },
    { item: "Target margin aligned with corporate profitability goals", status: "ASSUMED", details: "Verify with management or financial planning." },
    { item: "Annual volume projection realistic vs committed orders", status: "REVIEW", details: "Use rolling forecast not pipeline optimistic estimates." },
    { item: "Cross-subsidization risk reviewed across customer portfolio", status: "NOT CHECKED", details: "Single SKU scope — portfolio analysis recommended." },
  ];

  // ── Recommended Action ─────────────────────────────────────────────
  let recommendedAction: RecommendedAction;
  if (isToxic) {
    recommendedAction = {
      action:
        `Immediate action required. Reprice to minimum of ${currency((fullyLoadedProfit + revenue) / annualVol)}/unit ` +
        `(break-even) or target ${currency((fullyLoadedProfit + revenue * (1 + targetMarg / 100)) / annualVol)}/unit ` +
        `to achieve ${pct(targetMarg)} margin. If reprice not possible, discontinue SKU.`,
      priority: "HIGH",
      expected_benefit: `Eliminates annual loss of ${currency(annualRisk)} and stops cross-subsidization.`,
    };
  } else if (isBelowTarget) {
    recommendedAction = {
      action:
        `Close the margin gap. Target price increase of ${pct(targetMarg - marginPct)} or equivalent cost reduction. ` +
        `Target selling price: ${currency(unitPrice * (1 + (targetMarg - marginPct) / 100))}/unit.`,
      priority: "MEDIUM",
      expected_benefit: `Improves net margin from ${pct(marginPct)} to ${pct(targetMarg)}, adding ${currency(revenue * (targetMarg - marginPct) / 100)} net profit.`,
    };
  } else {
    recommendedAction = {
      action:
        `Maintain current pricing and cost structure. Monitor quarterly for margin erosion. ` +
        `Consider volume incentives if excess capacity exists.`,
      priority: "LOW",
      expected_benefit: "Sustains current margin level and profitability.",
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
    marginPercent: pct(marginPct),
    marginAmount: currency(fullyLoadedProfit),
  };
}
