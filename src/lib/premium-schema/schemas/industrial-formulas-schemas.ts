/**
 * Industrial Formula Tools — Combined Premium Calculator Schemas.
 *
 * 18 premium calculators with full input/output/threshold definitions.
 * Each schema maps to a paidSlug in revenue-tools-industrial-formulas.ts
 * and uses calculator functions from ../calculators/industrial-formulas-calculators.ts
 */

import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/* ─── Shared option sets ─── */

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "TRY", label: "TRY — Turkish Lira" },
] as const;

const GRID_REGION_OPTIONS = [
  { value: "turkey", label: "Turkey (0.447 kgCO₂e/kWh)" },
  { value: "eu_avg", label: "EU average (0.233 kgCO₂e/kWh)" },
  { value: "global_avg", label: "Global average (0.475 kgCO₂e/kWh)" },
  { value: "renewable", label: "100% renewable (0.000 kgCO₂e/kWh)" },
] as const;

const FLOW_ARRANGEMENT_OPTIONS = [
  { value: "counter", label: "Counter-flow" },
  { value: "parallel", label: "Parallel-flow" },
] as const;

const PIPE_MATERIAL_OPTIONS = [
  { value: "steel", label: "Carbon steel (ε=0.046 mm)" },
  { value: "galvanized", label: "Galvanized iron (ε=0.15 mm)" },
  { value: "cast_iron", label: "Cast iron (ε=0.26 mm)" },
  { value: "pvc", label: "PVC / HDPE (ε=0.0015 mm)" },
  { value: "concrete", label: "Concrete (ε=0.6 mm)" },
  { value: "drawn_tubing", label: "Drawn tubing (ε=0.0015 mm)" },
] as const;

const TEST_TYPE_OPTIONS = [
  { value: "proportion", label: "Proportion (categorical)" },
  { value: "mean", label: "Mean (continuous)" },
] as const;

const POWER_LEVEL_OPTIONS = [
  { value: "80", label: "80% (standard)" },
  { value: "90", label: "90% (stringent)" },
  { value: "95", label: "95% (conservative)" },
] as const;

const END_CONDITION_OPTIONS = [
  { value: "hinged", label: "Hinged (K=1.0)" },
  { value: "fixed_fixed", label: "Fixed-fixed (K=0.5)" },
  { value: "fixed_free", label: "Fixed-free (K=2.0)" },
] as const;

const SPRING_MATERIAL_OPTIONS = [
  { value: "steel", label: "Spring steel (G=79.3 GPa, UTS~1400 MPa)" },
  { value: "stainless", label: "Stainless steel (G=68.9 GPa, UTS~1200 MPa)" },
] as const;

const LOAD_TYPE_OPTIONS = [
  { value: "static", label: "Static (τ_allow=0.45·UTS)" },
  { value: "fatigue", label: "Fatigue (τ_allow=0.35·UTS, Goodman check)" },
] as const;

const BELT_TYPE_OPTIONS = [
  { value: "v_belt", label: "V-belt (η~96%, slip~2%)" },
  { value: "flat", label: "Flat belt (η~93%, slip~3%)" },
  { value: "timing", label: "Timing belt (η~99%, slip~0%)" },
] as const;

const LEARNING_MODEL_OPTIONS = [
  { value: "wright", label: "Wright (unit formula Yₙ = a·N^b)" },
  { value: "crawford", label: "Crawford (cum avg Ȳₙ = a·N^b)" },
] as const;

const YOUNG_MODULUS_OPTIONS = [
  { value: "steel", label: "Steel (E=210 GPa)" },
  { value: "stainless", label: "Stainless steel (E=193 GPa)" },
  { value: "aluminum", label: "Aluminum (E=69 GPa)" },
] as const;

/* ─── Shared default packs ─── */

const DEFAULT_ASSUMPTIONS = {
  hiddenLossMultiplier: 1,
  volatilityPercent: 5,
  targetMarginPercent: 10,
  assumptionNotes: [
    "All monetary values in user-selected currency.",
    "Results are technical simulations, not financial or legal advice.",
    "Verify all assumptions with a qualified professional before business decisions.",
  ],
} as const;

const DEFAULT_REPORT_TEMPLATE = {
  title: "Analysis Report",
  sections: ["executive_summary", "assumptions"] as const,
  exportFormats: ["pdf"] as const,
};

/* ════════════════════════════════════════════════════════════════════════════
 * 1. IRR — Internal Rate of Return
 * ════════════════════════════════════════════════════════════════════════════ */

export const IRR_INVESTMENT_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "irr-investment-analyzer",
  legacyPaidSlug: "irr-investment-analyzer",
  name: "IRR Investment Analyzer",
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "Manually solving for IRR in Excel (IRR function) is a black box — you get a number without convergence diagnostics, sensitivity analysis or confidence level. This tool provides transparent hybrid Newton-Raphson + bisection solving.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code for output formatting." },
    { id: "initialInvestment", label: "Initial investment (negative = cash outflow)", type: "number", unit: "currency", required: true, validation: { min: -1e15, max: 0 }, smartDefault: -100000, helper: "Capital outlay at time zero. Enter as a negative value.", expertMeaning: "CF₀ in the IRR equation: 0 = Σ CF_t / (1+r)^t" },
    { id: "cashFlowYear1", label: "Cash flow year 1", type: "number", unit: "currency", required: true, smartDefault: 30000, helper: "Net cash inflow in year 1.", expertMeaning: "CF₁" },
    { id: "cashFlowYear2", label: "Cash flow year 2", type: "number", unit: "currency", required: false, smartDefault: 30000, helper: "Net cash inflow in year 2.", expertMeaning: "CF₂" },
    { id: "cashFlowYear3", label: "Cash flow year 3", type: "number", unit: "currency", required: false, smartDefault: 30000, helper: "Net cash inflow in year 3.", expertMeaning: "CF₃" },
    { id: "cashFlowYear4", label: "Cash flow year 4", type: "number", unit: "currency", required: false, smartDefault: 20000, helper: "Net cash inflow in year 4.", expertMeaning: "CF₄" },
    { id: "cashFlowYear5", label: "Cash flow year 5", type: "number", unit: "currency", required: false, smartDefault: 20000, helper: "Net cash inflow in year 5.", expertMeaning: "CF₅" },
    { id: "cashFlowYear6", label: "Cash flow year 6", type: "number", unit: "currency", required: false, smartDefault: 10000, helper: "Net cash inflow in year 6.", expertMeaning: "CF₆" },
    { id: "cashFlowYear7", label: "Cash flow year 7", type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Net cash inflow in year 7.", expertMeaning: "CF₇" },
    { id: "cashFlowYear8", label: "Cash flow year 8", type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Net cash inflow in year 8.", expertMeaning: "CF₈" },
    { id: "cashFlowYear9", label: "Cash flow year 9", type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Net cash inflow in year 9.", expertMeaning: "CF₉" },
    { id: "cashFlowYear10", label: "Cash flow year 10", type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Net cash inflow in year 10.", expertMeaning: "CF₁₀" },
  ],
  outputs: [
    { id: "irr", label: "Internal Rate of Return (IRR)", unit: "%", format: "percentage", isBigNumber: false },
    { id: "npvAtIrr", label: "NPV at IRR (theoretical zero)", unit: "currency", format: "currency" },
    { id: "convergenceStatus", label: "Convergence status", unit: "", format: "number" },
    { id: "iterations", label: "Solver iterations", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "finance.irr_estimate", inputMap: { initialInvestment: "initialInvestment", cashFlowYear1: "cashFlowYear1" }, outputId: "irr" }],
  reportTemplate: { title: "IRR Investment Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, hiddenLossMultiplier: 1, volatilityPercent: 15, targetMarginPercent: 10, assumptionNotes: ["IRR assumes reinvestment at the computed rate (IRR limitation).", "Multiple IRRs may exist if cash flows change sign more than once."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 2. NPV — Risk-Adjusted
 * ════════════════════════════════════════════════════════════════════════════ */

const NPV_RISK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "npv-risk-analyzer",
  legacyPaidSlug: "npv-risk-analyzer",
  name: "NPV Risk Analyzer",
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "A single-point NPV ignores scenario uncertainty and terminal value assumptions. This tool provides three-scenario NPV (base/optimistic/pessimistic) with terminal value and sensitivity analysis.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code." },
    { id: "initialCost", label: "Initial investment (negative = outflow)", type: "number", unit: "currency", required: true, smartDefault: -500000, helper: "Capital outlay at t₀.", expertMeaning: "I₀" },
    { id: "cashFlowYears1to5", label: "Average cash flow (years 1-5)", type: "number", unit: "currency", required: true, smartDefault: 120000, helper: "Average annual net cash inflow during the first 5 years.", expertMeaning: "CF₁₋₅" },
    { id: "cashFlowYears6to10", label: "Average cash flow (years 6-10)", type: "number", unit: "currency", required: false, smartDefault: 80000, helper: "Average annual net cash inflow during years 6-10 (if applicable).", expertMeaning: "CF₆₋₁₀" },
    { id: "discountRate", label: "Discount rate (%)", type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "Risk-adjusted cost of capital (WACC).", expertMeaning: "r in NPV = Σ CFₜ / (1+r)ᵗ" },
    { id: "projectLifeYears", label: "Project life (years)", type: "number", unit: "years", required: true, smartDefault: 10, validation: { min: 1, max: 50 }, helper: "Economic life of the project.", expertMeaning: "n" },
    { id: "probabilityBase", label: "Probability of base case (%)", type: "number", unit: "%", required: true, smartDefault: 60, validation: { min: 0, max: 100 }, helper: "Likelihood of the most probable scenario.", expertMeaning: "Weight for expected NPV" },
    { id: "probabilityOptimistic", label: "Probability of optimistic case (%)", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "Likelihood of upside scenario.", expertMeaning: "Probability optimistic. Pessimistic = 100% - P_base - P_opt" },
    { id: "terminalGrowthRate", label: "Terminal growth rate (%)", type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: -10, max: 10 }, helper: "Perpetuity growth rate (must be < discount rate).", expertMeaning: "g in TV = CF_n × (1+g) / (r-g)" },
  ],
  outputs: [
    { id: "npvBase", label: "NPV (base case)", unit: "currency", format: "currency" },
    { id: "npvOptimistic", label: "NPV (optimistic, r - 1%)", unit: "currency", format: "currency" },
    { id: "npvPessimistic", label: "NPV (pessimistic, r + 1%)", unit: "currency", format: "currency" },
    { id: "npvRiskAdjusted", label: "NPV (risk-adjusted/expected)", unit: "currency", format: "currency" },
    { id: "terminalValue", label: "Terminal value", unit: "currency", format: "currency" },
    { id: "sensitivityPercent", label: "Rate sensitivity (±1% impact)", unit: "%", format: "percentage" },
    { id: "npvVerdict", label: "Verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "finance.simple_npv", inputMap: { initialInvestment: "initialCost", annualCashFlow: "cashFlowYears1to5", discountRatePercent: "discountRate", horizonYears: "projectLifeYears" }, outputId: "npvBase", formulaFamily: "finance" }],
  reportTemplate: { title: "NPV Risk Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 15, targetMarginPercent: 10, assumptionNotes: ["Three scenario probabilities must sum to ≤100% (remainder = pessimistic).", "Terminal value assumes perpetual growth; ≤0% when r ≤ g."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 3. DCF — WACC-CAPM Enterprise Valuator
 * ════════════════════════════════════════════════════════════════════════════ */

const DCF_ENTERPRISE_VALUATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "dcf-enterprise-valuator",
  legacyPaidSlug: "dcf-enterprise-valuator",
  name: "DCF Enterprise Valuator",
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "DCF models require WACC calculation, terminal value assumption and scenario logic that spreadsheet errors easily break. This tool provides a structured WACC-CAPM DCF with per-share valuation and undervalued/fair/overvalued verdict.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code." },
    { id: "freeCashFlowYear1", label: "FCFF year 1", type: "number", unit: "currency", required: true, smartDefault: 100000, helper: "Free Cash Flow to Firm in year 1.", expertMeaning: "FCFF₁" },
    { id: "freeCashFlowYear2", label: "FCFF year 2", type: "number", unit: "currency", required: false, smartDefault: 110000, helper: "FCFF year 2.", expertMeaning: "FCFF₂" },
    { id: "freeCashFlowYear3", label: "FCFF year 3", type: "number", unit: "currency", required: false, smartDefault: 121000, helper: "FCFF year 3.", expertMeaning: "FCFF₃" },
    { id: "freeCashFlowYear4", label: "FCFF year 4", type: "number", unit: "currency", required: false, smartDefault: 133100, helper: "FCFF year 4.", expertMeaning: "FCFF₄" },
    { id: "freeCashFlowYear5", label: "FCFF year 5", type: "number", unit: "currency", required: false, smartDefault: 146410, helper: "FCFF year 5 (also used for terminal value).", expertMeaning: "FCFF₅" },
    { id: "equityValue", label: "Equity market value (E)", type: "number", unit: "currency", required: true, smartDefault: 2000000, helper: "Market capitalization or equity value.", expertMeaning: "E for WACC = E/V·Re + D/V·Rd·(1-T)" },
    { id: "debtValue", label: "Debt market value (D)", type: "number", unit: "currency", required: true, smartDefault: 1000000, helper: "Total interest-bearing debt.", expertMeaning: "D for WACC" },
    { id: "costOfEquity", label: "Cost of equity Re (%)", type: "number", unit: "%", required: true, smartDefault: 12, validation: { min: 0, max: 30 }, helper: "CAPM or implied cost of equity.", expertMeaning: "Re = Rf + β·MRP" },
    { id: "costOfDebt", label: "Cost of debt Rd (%)", type: "number", unit: "%", required: true, smartDefault: 6, validation: { min: 0, max: 20 }, helper: "Pre-tax cost of debt.", expertMeaning: "Rd (before tax shield)" },
    { id: "taxRate", label: "Corporate tax rate (%)", type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 50 }, helper: "Effective corporate income tax rate.", expertMeaning: "T for after-tax cost of debt" },
    { id: "terminalGrowthRate", label: "Terminal growth rate g (%)", type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 10 }, helper: "Perpetuity growth rate (must be < WACC).", expertMeaning: "g ≤ WACC for Gordon Growth Model" },
    { id: "sharesOutstanding", label: "Shares outstanding", type: "number", unit: "", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "Fully diluted shares outstanding.", expertMeaning: "For per-share value = equity value / shares" },
  ],
  outputs: [
    { id: "wacc", label: "WACC", unit: "%", format: "percentage" },
    { id: "enterpriseValue", label: "Enterprise value", unit: "currency", format: "currency" },
    { id: "equityValue", label: "Equity value", unit: "currency", format: "currency" },
    { id: "perShareValue", label: "Intrinsic value per share", unit: "currency", format: "currency" },
    { id: "dcfVerdict", label: "Valuation verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "finance.wacc", inputMap: { equityValue: "equityValue", debtValue: "debtValue", costOfEquity: "costOfEquity", costOfDebt: "costOfDebt", taxRate: "taxRate" }, outputId: "wacc" }],
  reportTemplate: { title: "DCF Enterprise Valuation Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 15, targetMarginPercent: 10, assumptionNotes: ["DCF is highly sensitive to terminal growth and WACC assumptions.", "Market values of equity and debt should be current, not book values."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 4. Lease vs Buy — NAL
 * ════════════════════════════════════════════════════════════════════════════ */

const LEASE_VS_BUY_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "lease-vs-buy-analyzer",
  legacyPaidSlug: "lease-vs-buy-analyzer",
  name: "Lease vs Buy Analyzer",
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "Lease vs buy decisions involve depreciation tax shields, after-tax discount rates and residual values that back-of-envelope comparisons miss. This tool computes the Net Advantage of Leasing (NAL) with full tax treatment.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs.", expertMeaning: "ISO code." },
    { id: "purchasePrice", label: "Purchase price (buy option)", type: "number", unit: "currency", required: true, smartDefault: 50000, helper: "Cash purchase price of the asset.", expertMeaning: "I₀" },
    { id: "leaseTermMonths", label: "Lease term (months)", type: "number", unit: "months", required: true, smartDefault: 36, validation: { min: 1, max: 120 }, helper: "Duration of the lease agreement.", expertMeaning: "NLA term" },
    { id: "monthlyLeasePayment", label: "Monthly lease payment", type: "number", unit: "currency", required: true, smartDefault: 1200, helper: "Fixed monthly payment under lease.", expertMeaning: "L" },
    { id: "taxRate", label: "Tax rate (%)", type: "number", unit: "%", required: true, smartDefault: 25, validation: { min: 0, max: 50 }, helper: "Marginal corporate tax rate.", expertMeaning: "T in after-tax cash flows" },
    { id: "salvageValuePercent", label: "Salvage value (% of purchase)", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "Residual value as percent of purchase price.", expertMeaning: "After-tax salvage in year n" },
    { id: "costOfDebt", label: "Cost of debt Rd (%)", type: "number", unit: "%", required: true, smartDefault: 7, validation: { min: 0, max: 20 }, helper: "Pre-tax cost of debt (discount rate).", expertMeaning: "Rd for after-tax discount rate Rd·(1-T)" },
  ],
  outputs: [
    { id: "pvBuy", label: "PV of buy (cost)", unit: "currency", format: "currency" },
    { id: "pvLease", label: "PV of lease (cost)", unit: "currency", format: "currency" },
    { id: "nal", label: "Net Advantage of Leasing", unit: "currency", format: "currency" },
    { id: "breakEvenPayment", label: "Break-even lease payment", unit: "currency", format: "currency" },
    { id: "leaseBuyVerdict", label: "Lease vs Buy verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "finance.nal", inputMap: { purchasePrice: "purchasePrice", monthlyLeasePayment: "monthlyLeasePayment", leaseTermMonths: "leaseTermMonths", costOfDebt: "costOfDebt", taxRate: "taxRate" }, outputId: "nal" }],
  reportTemplate: { title: "Lease vs Buy Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["This analysis assumes straight-line depreciation for tax shield calculation.", "NAL > 0 → Buy recommended; NAL < 0 → Lease recommended."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 5. Darcy-Weisbach Pipe Flow
 * ════════════════════════════════════════════════════════════════════════════ */

const DARCY_WEISBACH_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "darcy-weisbach-pipe-flow-calculator",
  legacyPaidSlug: "darcy-weisbach-pipe-flow-calculator",
  name: "Darcy-Weisbach Pipe Flow Calculator",
  sectorSlug: "sheet-metal",
  category: "fluid",
  painStatement: "Pipe pressure drop calculations require Reynolds number, Moody chart iteration (Colebrook-White) and minor loss summation — each a source of error. This tool automates the entire hydraulic analysis.",
  inputs: [
    { id: "flowRate", label: "Volumetric flow rate Q", type: "number", unit: "m³/h", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "Flow rate at operating conditions.", expertMeaning: "Q for Re = 4Q/πDν" },
    { id: "pipeLength", label: "Pipe length L", type: "number", unit: "m", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "Total equivalent pipe length (including fittings if known).", expertMeaning: "L for ΔP_f = f·(L/D)·(ρv²/2)" },
    { id: "pipeDiameter", label: "Pipe inner diameter D", type: "number", unit: "mm", required: true, smartDefault: 50, validation: { min: 1 }, helper: "Nominal inner diameter of the pipe.", expertMeaning: "D for cross-section area and Re" },
    { id: "pipeMaterial", label: "Pipe material (roughness ε)", type: "select", unit: "", required: true, smartDefault: "steel", options: [...PIPE_MATERIAL_OPTIONS], helper: "Select pipe material for roughness coefficient.", expertMeaning: "ε/D for Colebrook-White" },
    { id: "fluidDensity", label: "Fluid density ρ", type: "number", unit: "kg/m³", required: true, smartDefault: 1000, validation: { min: 0.1 }, helper: "Density at operating temperature (water ≈ 1000 kg/m³).", expertMeaning: "ρ for Re and ΔP" },
    { id: "fluidViscosity", label: "Dynamic viscosity μ", type: "number", unit: "Pa·s", required: true, smartDefault: 0.001, validation: { min: 1e-8 }, helper: "Dynamic viscosity (water 20°C ≈ 0.001 Pa·s).", expertMeaning: "μ for Re = ρvD/μ" },
  ],
  outputs: [
    { id: "reynoldsNumber", label: "Reynolds number Re", unit: "", format: "number" },
    { id: "flowRegime", label: "Flow regime", unit: "", format: "number" },
    { id: "darcyFrictionFactor", label: "Darcy friction factor f", unit: "", format: "number" },
    { id: "pressureDropPa", label: "Pressure drop ΔP", unit: "Pa", format: "number" },
    { id: "pressureDropBar", label: "Pressure drop ΔP", unit: "bar", format: "number" },
    { id: "pumpPowerKw", label: "Pump power required", unit: "kW", format: "number" },
    { id: "pressureDropVerdict", label: "Design verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "fluid.darcy_friction_factor", inputMap: { reynoldsNumber: "flowRate", relativeRoughness: "pipeMaterial", diameterMm: "pipeDiameter" }, outputId: "darcyFrictionFactor" }],
  reportTemplate: { title: "Pipe Flow Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Fluid assumed incompressible and Newtonian.", "Minor losses use K-factor method with typical values.", "Pump efficiency assumed 75% for power estimate."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 6. LMTD Heat Exchanger
 * ════════════════════════════════════════════════════════════════════════════ */

const LMTD_HEAT_EXCHANGER_SCHEMA: PremiumCalculatorSchema = {
  id: "lmtd-heat-exchanger-calculator",
  legacyPaidSlug: "lmtd-heat-exchanger-calculator",
  name: "LMTD Heat Exchanger Calculator",
  sectorSlug: "sheet-metal",
  category: "fluid",
  painStatement: "Heat exchanger sizing requires LMTD with F-correction, overall U calculation from individual resistances and NTU-effectiveness verification. One mistake in temperature approach can oversize by 30%.",
  inputs: [
    { id: "heatDuty", label: "Required heat duty Q", type: "number", unit: "kW", required: true, smartDefault: 500, validation: { min: 0.01 }, helper: "Thermal power to be transferred.", expertMeaning: "Q = U·A·ΔT_m·F" },
    { id: "hotInletTemp", label: "Hot fluid inlet T_h,in", type: "number", unit: "°C", required: true, smartDefault: 120, helper: "Inlet temperature of hot fluid.", expertMeaning: "T_h,i" },
    { id: "hotOutletTemp", label: "Hot fluid outlet T_h,out", type: "number", unit: "°C", required: true, smartDefault: 70, helper: "Outlet temperature of hot fluid.", expertMeaning: "T_h,o" },
    { id: "coldInletTemp", label: "Cold fluid inlet T_c,in", type: "number", unit: "°C", required: true, smartDefault: 30, helper: "Inlet temperature of cold fluid.", expertMeaning: "T_c,i" },
    { id: "coldOutletTemp", label: "Cold fluid outlet T_c,out", type: "number", unit: "°C", required: true, smartDefault: 60, helper: "Outlet temperature of cold fluid.", expertMeaning: "T_c,o" },
    { id: "flowArrangement", label: "Flow arrangement", type: "select", unit: "", required: true, smartDefault: "counter", options: [...FLOW_ARRANGEMENT_OPTIONS], helper: "Counter-flow gives highest LMTD.", expertMeaning: "Determines ΔT₁ and ΔT₂" },
    { id: "hConvInside", label: "Inside convection h_i", type: "number", unit: "W/m²K", required: true, smartDefault: 1500, validation: { min: 1 }, helper: "Tube-side heat transfer coefficient (water ~1500-5000).", expertMeaning: "h_i for U = 1/(1/h_i + R_f,i + ...)" },
    { id: "hConvOutside", label: "Outside convection h_o", type: "number", unit: "W/m²K", required: true, smartDefault: 800, validation: { min: 1 }, helper: "Shell-side heat transfer coefficient (water ~500-2000).", expertMeaning: "h_o" },
  ],
  outputs: [
    { id: "lmtdDeltaT1", label: "ΔT₁", unit: "°C", format: "number" },
    { id: "lmtdDeltaT2", label: "ΔT₂", unit: "°C", format: "number" },
    { id: "lmtdValue", label: "LMTD ΔT_lm", unit: "°C", format: "number" },
    { id: "correctionFactorF", label: "F-correction factor", unit: "", format: "number" },
    { id: "overallU", label: "Overall heat transfer coefficient U", unit: "W/m²K", format: "number" },
    { id: "requiredAreaM2", label: "Required heat transfer area A", unit: "m²", format: "number" },
    { id: "ntuValue", label: "NTU", unit: "", format: "number" },
    { id: "effectivenessEpsilon", label: "Effectiveness ε", unit: "", format: "percentage" },
    { id: "exchangerVerdict", label: "Design verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "fluid.heat_exchanger_lmtd", inputMap: { deltaT1: "hotInletTemp", deltaT2: "hotOutletTemp" }, outputId: "lmtdValue" }],
  reportTemplate: { title: "Heat Exchanger Design Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Fouling factors are assumed values; use measured values for final design.", "Wall thermal resistance assumes metallic tube wall (k=50 W/mK typical)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 7. OEE — Overall Equipment Effectiveness
 * ════════════════════════════════════════════════════════════════════════════ */

const OEE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-six-big-losses-analyzer",
  legacyPaidSlug: "oee-six-big-losses-analyzer",
  name: "OEE & Six Big Losses Analyzer",
  sectorSlug: "sheet-metal",
  category: "oee",
  painStatement: "Standalone availability, performance and quality metrics mask where losses concentrate. This tool decomposes OEE into the Six Big Loss categories with TEEP and Pareto analysis.",
  inputs: [
    { id: "plannedProductionTime", label: "Planned production time", type: "number", unit: "hours", required: true, smartDefault: 480, validation: { min: 1 }, helper: "Total scheduled operating hours per month.", expertMeaning: "POT (Planned Operating Time)" },
    { id: "downtimeHours", label: "Downtime (total)", type: "number", unit: "hours", required: true, smartDefault: 40, validation: { min: 0 }, helper: "Total breakdown + setup + adjustment hours.", expertMeaning: "DT" },
    { id: "idealCycleTime", label: "Ideal cycle time", type: "number", unit: "min/unit", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "Fastest possible cycle time per unit.", expertMeaning: "T_c for Performance = (Ideal × Total) / Operating" },
    { id: "totalUnitsProduced", label: "Total units produced", type: "number", unit: "units", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "Total output including defects.", expertMeaning: "Total count" },
    { id: "goodUnitsProduced", label: "Good units produced", type: "number", unit: "units", required: true, smartDefault: 4800, validation: { min: 0 }, helper: "First-pass yield (no rework).", expertMeaning: "Quality = Good / Total" },
    { id: "smallStopsMinutes", label: "Small stops (total min)", type: "number", unit: "minutes", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Minor stoppages < 5 min each.", expertMeaning: "Small stops loss category" },
    { id: "setupHours", label: "Setup / changeover time", type: "number", unit: "hours", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Total setup and changeover hours.", expertMeaning: "Setup loss category" },
  ],
  outputs: [
    { id: "availability", label: "Availability", unit: "%", format: "percentage" },
    { id: "performance", label: "Performance", unit: "%", format: "percentage" },
    { id: "quality", label: "Quality", unit: "%", format: "percentage" },
    { id: "oeeScore", label: "OEE score", unit: "%", format: "percentage" },
    { id: "teepScore", label: "TEEP score", unit: "%", format: "percentage" },
    { id: "worldClassGap", label: "Gap to World Class (85%)", unit: "%", format: "percentage" },
    { id: "oeeVerdict", label: "OEE verdict", unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "oeeScore", warning: 60, critical: 85, direction: "higher_is_bad", warningMessage: "OEE below 60% — urgent improvement needed.", criticalMessage: "OEE below 85% World Class target." },
  ],
  formulaPipeline: [{ formulaId: "oee.oee_score", inputMap: { availability: "plannedProductionTime", performance: "idealCycleTime", quality: "goodUnitsProduced" }, outputId: "oeeScore" }],
  reportTemplate: { title: "OEE & Lean Loss Analysis Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["OEE = Availability × Performance × Quality.", "World Class OEE = 85% (industry benchmark).", "Six Big Loss categories follow JIPM standard."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 8. Line Balancing
 * ════════════════════════════════════════════════════════════════════════════ */

const LINE_BALANCING_SCHEMA: PremiumCalculatorSchema = {
  id: "line-balancing-analyzer",
  legacyPaidSlug: "line-balancing-analyzer",
  name: "Line Balancing Analyzer",
  sectorSlug: "sheet-metal",
  category: "oee",
  painStatement: "Unbalanced assembly lines create bottleneck-driven idle time that increases WIP and extends lead time. This tool computes minimum stations, balance efficiency and bottleneck utilization.",
  inputs: [
    { id: "totalWorkContent", label: "Total work content Σtᵢ", type: "number", unit: "min", required: true, smartDefault: 45, validation: { min: 0.1 }, helper: "Sum of all task times in the process.", expertMeaning: "Σtᵢ for N_min = ceil(Σtᵢ / takt)" },
    { id: "taktTime", label: "Takt time", type: "number", unit: "min/unit", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "Available time divided by customer demand.", expertMeaning: "Takt = available time / demand" },
    { id: "actualStations", label: "Actual number of stations", type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "Current number of workstations in the line.", expertMeaning: "N_real" },
  ],
  outputs: [
    { id: "nMin", label: "Minimum stations N_min", unit: "", format: "number" },
    { id: "balanceEfficiency", label: "Balance efficiency", unit: "%", format: "percentage" },
    { id: "balanceLoss", label: "Balance loss", unit: "%", format: "percentage" },
    { id: "bottleneckLoad", label: "Bottleneck utilization", unit: "%", format: "percentage" },
    { id: "lineBalanceVerdict", label: "Balance verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "lean.balance_efficiency", inputMap: { totalWorkContent: "totalWorkContent", taktTime: "taktTime", actualStations: "actualStations" }, outputId: "balanceEfficiency", formulaFamily: "lean" }],
  reportTemplate: { title: "Line Balance Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["All task times assumed deterministic for single-model line.", "Takt time = available time per shift / customer demand per shift."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 9. Standard Time / Work Study
 * ════════════════════════════════════════════════════════════════════════════ */

const STANDARD_TIME_SCHEMA: PremiumCalculatorSchema = {
  id: "standard-time-work-study-calculator",
  legacyPaidSlug: "standard-time-work-study-calculator",
  name: "Standard Time & Work Study Calculator",
  sectorSlug: "sheet-metal",
  category: "time",
  painStatement: "Setting accurate standard times requires rating factor adjustment, allowance calculation and statistical sample size verification. This tool provides NT, ST, MTM-1 equivalent and sample adequacy check.",
  inputs: [
    { id: "observedTime", label: "Observed mean time (OT)", type: "number", unit: "min", required: true, smartDefault: 2.5, validation: { min: 0.01 }, helper: "Average observed cycle time from time study.", expertMeaning: "OT for NT = OT × RF" },
    { id: "sampleStdDev", label: "Sample standard deviation s", type: "number", unit: "min", required: true, smartDefault: 0.3, validation: { min: 1e-6 }, helper: "Standard deviation of observed times.", expertMeaning: "s for required sample size" },
    { id: "sampleSize", label: "Sample size n", type: "number", unit: "", required: true, smartDefault: 15, validation: { min: 1 }, helper: "Number of observations taken.", expertMeaning: "n" },
    { id: "ratingFactor", label: "Rating factor RF (%)", type: "number", unit: "%", required: true, smartDefault: 100, validation: { min: 50, max: 150 }, helper: "Operator performance rating (100% = normal pace).", expertMeaning: "RF: 100% = 83 TMU/s (MTM-1 normal)" },
    { id: "personalAllowance", label: "Personal allowance (%)", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 30 }, helper: "Time for personal needs.", expertMeaning: "A_p in ST = NT × (1 + A_total)" },
    { id: "fatigueAllowance", label: "Fatigue allowance (%)", type: "number", unit: "%", required: false, smartDefault: 4, validation: { min: 0, max: 30 }, helper: "Rest allowance for physical/mental fatigue.", expertMeaning: "A_f" },
    { id: "delayAllowance", label: "Delay allowance (%)", type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 30 }, helper: "Allowance for unavoidable delays.", expertMeaning: "A_d" },
  ],
  outputs: [
    { id: "normalTime", label: "Normal time", unit: "min", format: "number" },
    { id: "standardTime", label: "Standard time", unit: "min", format: "number" },
    { id: "requiredSampleSize", label: "Required sample size", unit: "", format: "number" },
    { id: "sampleAdequate", label: "Sample adequate?", unit: "", format: "number" },
    { id: "totalAllowance", label: "Total allowance", unit: "%", format: "percentage" },
    { id: "mtm1EquivalentTMU", label: "MTM-1 equivalent (TMU)", unit: "TMU", format: "number" },
    { id: "standardTimeVerdict", label: "Statistical verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "time.normal_time", inputMap: { observedTime: "observedTime", ratingFactor: "ratingFactor" }, outputId: "normalTime" }],
  reportTemplate: { title: "Standard Time Study Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["MTM-1 equivalent: 1 min ≈ 1667 TMU at normal pace.", "Rating factor 100% = MTM-1 normal pace (83 TMU/s).", "Required sample size uses t-distribution for confidence interval."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 10. Learning Curve
 * ════════════════════════════════════════════════════════════════════════════ */

const LEARNING_CURVE_SCHEMA: PremiumCalculatorSchema = {
  id: "learning-curve-calculator",
  legacyPaidSlug: "learning-curve-calculator",
  name: "Learning Curve Calculator (Wright + Crawford)",
  sectorSlug: "sheet-metal",
  category: "time",
  painStatement: "Production cost declines with cumulative volume at predictable rates, but choosing between Wright and Crawford models changes cost projections significantly. This tool provides both models with break-even analysis.",
  inputs: [
    { id: "firstUnitTime", label: "First unit time (a)", type: "number", unit: "hours", required: true, smartDefault: 100, validation: { min: 0.01 }, helper: "Time to produce the first unit.", expertMeaning: "a in Yₙ = a·N^b" },
    { id: "learningRate", label: "Learning rate p (%)", type: "number", unit: "%", required: true, smartDefault: 80, validation: { min: 50, max: 100 }, helper: "Percent reduction per doubling of output (80% is typical).", expertMeaning: "p = 2^b, b = ln(p)/ln(2)" },
    { id: "cumulativeQuantity", label: "Cumulative quantity N", type: "number", unit: "units", required: true, smartDefault: 100, validation: { min: 1 }, helper: "Total units produced to date.", expertMeaning: "N for unit N cost calculation" },
    { id: "learningModel", label: "Learning model", type: "select", unit: "", required: true, smartDefault: "wright", options: [...LEARNING_MODEL_OPTIONS], helper: "Wright = unit formula, Crawford = cumulative average.", expertMeaning: "Select model type" },
    { id: "hourlyCost", label: "Hourly labor rate", type: "number", unit: "currency/hr", required: false, smartDefault: 40, helper: "Fully loaded labor cost per hour.", expertMeaning: "For total labor cost" },
    { id: "unitMaterialCost", label: "Unit material cost", type: "number", unit: "currency", required: false, smartDefault: 15, helper: "Material cost per unit.", expertMeaning: "For total unit cost" },
    { id: "targetUnitCost", label: "Target unit cost (optional)", type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Cost target for break-even quantity calculation.", expertMeaning: "Break-even N" },
  ],
  outputs: [
    { id: "wrightUnitTimeN", label: "Wright: unit N time Yₙ", unit: "hours", format: "number" },
    { id: "wrightCumulativeAvgTime", label: "Wright: cumulative avg time", unit: "hours", format: "number" },
    { id: "crawfordCumulativeAvgTime", label: "Crawford: cumulative avg time", unit: "hours", format: "number" },
    { id: "totalLaborCost", label: "Total labor cost (cumulative)", unit: "currency", format: "currency" },
    { id: "breakEvenQuantity", label: "Break-even quantity", unit: "units", format: "number" },
    { id: "modelComparisonDelta", label: "Wright vs Crawford Δ", unit: "hours", format: "number" },
    { id: "learningCurveVerdict", label: "Cost verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "learning.wright_unit_time", inputMap: { firstUnitTime: "firstUnitTime", learningRate: "learningRate", cumulativeQuantity: "cumulativeQuantity" }, outputId: "wrightUnitTimeN", formulaFamily: "measurement" }],
  reportTemplate: { title: "Learning Curve Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Wright model: Yₙ = a·N^b (unit formula). Crawford: Ȳₙ = a·N^b (cumulative avg).", "Learning rate p between 50-100%; lower p = faster learning (more aggressive)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 11. Spring Design
 * ════════════════════════════════════════════════════════════════════════════ */

const SPRING_DESIGN_SCHEMA: PremiumCalculatorSchema = {
  id: "spring-design-calculator",
  legacyPaidSlug: "spring-design-calculator",
  name: "Helical Spring Design Calculator",
  sectorSlug: "sheet-metal",
  category: "measurement",
  painStatement: "Spring design requires concurrent checks of stress (Wahl factor), buckling (slenderness), fatigue (Goodman) and manufacturing constraints (spring index). Missing any one can cause premature failure.",
  inputs: [
    { id: "wireDiameter", label: "Wire diameter d", type: "number", unit: "mm", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "Diameter of the spring wire.", expertMeaning: "d" },
    { id: "meanCoilDiameter", label: "Mean coil diameter D", type: "number", unit: "mm", required: true, smartDefault: 30, validation: { min: 1 }, helper: "Average diameter of spring coils.", expertMeaning: "D for C = D/d" },
    { id: "activeCoils", label: "Active coils N_a", type: "number", unit: "", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Number of coils that deflect under load.", expertMeaning: "N_a" },
    { id: "totalCoils", label: "Total coils N_t", type: "number", unit: "", required: false, smartDefault: 10, validation: { min: 1 }, helper: "Total coils including end coils.", expertMeaning: "N_t = N_a + end coils" },
    { id: "springFreeLength", label: "Free length L₀", type: "number", unit: "mm", required: false, smartDefault: 100, validation: { min: 1 }, helper: "Unloaded spring length.", expertMeaning: "L₀ for buckling ratio" },
    { id: "springLoad", label: "Applied load F_max", type: "number", unit: "N", required: true, smartDefault: 500, validation: { min: 0.1 }, helper: "Maximum working load.", expertMeaning: "F for τ = K_w·8FD/πd³" },
    { id: "material", label: "Material", type: "select", unit: "", required: true, smartDefault: "steel", options: [...SPRING_MATERIAL_OPTIONS], helper: "Spring material determines G and UTS.", expertMeaning: "G and τ_allow" },
    { id: "loadType", label: "Load type", type: "select", unit: "", required: true, smartDefault: "static", options: [...LOAD_TYPE_OPTIONS], helper: "Fatigue loads have lower allowable stress.", expertMeaning: "τ_allow = 0.45·UTS (static) or 0.35·UTS (fatigue)" },
    { id: "endCondition", label: "End condition", type: "select", unit: "", required: false, smartDefault: "hinged", options: [...END_CONDITION_OPTIONS], helper: "End fixity affects buckling critical load.", expertMeaning: "K for Euler buckling" },
  ],
  outputs: [
    { id: "springRate", label: "Spring rate k", unit: "N/mm", format: "number" },
    { id: "springIndexC", label: "Spring index C", unit: "", format: "number" },
    { id: "wahlFactor", label: "Wahl stress factor K_w", unit: "", format: "number" },
    { id: "maxShearStress", label: "Max shear stress τ_max", unit: "MPa", format: "number" },
    { id: "allowableStress", label: "Allowable stress τ_allow", unit: "MPa", format: "number" },
    { id: "safetyFactor", label: "Buckling safety factor SF", unit: "", format: "number" },
    { id: "goodmanCriterion", label: "Goodman criterion", unit: "", format: "number" },
    { id: "springVerdict", label: "Design verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "measurement.spring_rate", inputMap: { wireDiameter: "wireDiameter", meanCoilDiameter: "meanCoilDiameter", activeCoils: "activeCoils" }, outputId: "springRate" }],
  reportTemplate: { title: "Spring Design Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Spring steel: G=79.3 GPa; Stainless: G=68.9 GPa.", "Static load: τ_allow = 0.45·UTS. Fatigue: 0.35·UTS + Goodman check.", "Buckling safety factor SF ≥ 5 for static, ≥ 6.5 for fatigue."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 12. Carbon Footprint (Scope 1-2-3 + CBAM)
 * ════════════════════════════════════════════════════════════════════════════ */

const CARBON_FOOTPRINT_SCHEMA: PremiumCalculatorSchema = {
  id: "carbon-footprint-calculator",
  legacyPaidSlug: "carbon-footprint-calculator",
  name: "Carbon Footprint Analyzer (Scope 1-2-3 + CBAM)",
  sectorSlug: "sheet-metal",
  category: "carbon",
  painStatement: "EU CBAM reporting requires comprehensive Scope 1-2-3 inventory with CBAM cost estimation. Manual spreadsheets miss emission factors, scope boundaries and cost exposure. This tool automates the full carbon inventory.",
  inputs: [
    { id: "naturalGasUsage", label: "Natural gas usage", type: "number", unit: "m³/month", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "Monthly natural gas consumption.", expertMeaning: "Scope 1 direct emission" },
    { id: "dieselUsage", label: "Diesel usage", type: "number", unit: "L/month", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Monthly diesel consumption (fleet/generators).", expertMeaning: "Scope 1" },
    { id: "gasolineUsage", label: "Gasoline usage", type: "number", unit: "L/month", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "Monthly gasoline consumption.", expertMeaning: "Scope 1" },
    { id: "electricityUsage", label: "Electricity usage", type: "number", unit: "kWh/month", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "Monthly grid electricity consumption.", expertMeaning: "Scope 2 = kWh × grid EF" },
    { id: "gridRegion", label: "Grid region", type: "select", unit: "", required: true, smartDefault: "turkey", options: [...GRID_REGION_OPTIONS], helper: "Grid emission factor based on region.", expertMeaning: "Grid EF for Scope 2" },
    { id: "businessTravelKm", label: "Business travel", type: "number", unit: "km/month", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Total business travel distance.", expertMeaning: "Scope 3 category 6" },
    { id: "freightTonKm", label: "Freight transport", type: "number", unit: "ton-km/month", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Third-party freight ton-km.", expertMeaning: "Scope 3 category 4" },
    { id: "importValueEUR", label: "Import value (CBAM)", type: "number", unit: "EUR", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Value of CBAM-covered imports for cost ratio.", expertMeaning: "CBAM cost % of import value" },
  ],
  outputs: [
    { id: "scope1TotalCO2e", label: "Scope 1 direct emissions", unit: "kgCO₂e/month", format: "number" },
    { id: "scope2TotalCO2e", label: "Scope 2 electricity", unit: "kgCO₂e/month", format: "number" },
    { id: "scope3TotalCO2e", label: "Scope 3 value chain", unit: "kgCO₂e/month", format: "number" },
    { id: "totalCO2eMonthly", label: "Total monthly CO₂e", unit: "kgCO₂e", format: "number" },
    { id: "totalCO2eYearly", label: "Total yearly CO₂e", unit: "kgCO₂e/year", format: "number" },
    { id: "cbamCostEUR", label: "CBAM cost exposure", unit: "€", format: "currency" },
    { id: "cbamPercentOfImportValue", label: "CBAM % of import value", unit: "%", format: "percentage" },
    { id: "dominantScope", label: "Dominant scope", unit: "", format: "number" },
    { id: "carbonVerdict", label: "Exposure level", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "carbon.total_co2e", inputMap: { scope1: "naturalGasUsage", scope2: "electricityUsage", scope3: "businessTravelKm" }, outputId: "totalCO2eMonthly", formulaFamily: "carbon" }],
  reportTemplate: { title: "Carbon Footprint Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Emission factors from IPCC and national grid data.", "CBAM cost: €90/tCO₂e (2026 estimated price).", "Scope 3 is limited to travel, freight and waste."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 13. Regression OLS
 * ════════════════════════════════════════════════════════════════════════════ */

const REGRESSION_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "regression-analyzer",
  legacyPaidSlug: "regression-analyzer",
  name: "Linear Regression Analyzer (OLS)",
  sectorSlug: "financial-planning",
  category: "measurement",
  painStatement: "Manual OLS computation is error-prone and Excel's LINEST output lacks intuitive interpretation of R², F-test and t-statistics for business decisions.",
  inputs: [
    { id: "regressionN", label: "Number of pairs n", type: "number", unit: "", required: true, smartDefault: 20, validation: { min: 3 }, helper: "Total number of (x,y) data pairs.", expertMeaning: "n" },
    { id: "regressionSumX", label: "Σx", type: "number", unit: "", required: true, smartDefault: 100, helper: "Sum of all x values.", expertMeaning: "Σx" },
    { id: "regressionSumY", label: "Σy", type: "number", unit: "", required: true, smartDefault: 200, helper: "Sum of all y values.", expertMeaning: "Σy" },
    { id: "regressionSumXY", label: "Σxy", type: "number", unit: "", required: true, smartDefault: 1200, helper: "Sum of all x·y products.", expertMeaning: "Σxy for β₁ = (n·Σxy - Σx·Σy)/(n·Σx² - (Σx)²)" },
    { id: "regressionSumX2", label: "Σx²", type: "number", unit: "", required: true, smartDefault: 600, helper: "Sum of squared x values.", expertMeaning: "Σx²" },
    { id: "regressionSumY2", label: "Σy²", type: "number", unit: "", required: false, smartDefault: 2500, helper: "Sum of squared y values (optional).", expertMeaning: "Σy² for R² and RSE" },
  ],
  outputs: [
    { id: "beta0", label: "Intercept β₀", unit: "", format: "number" },
    { id: "beta1", label: "Slope β₁", unit: "", format: "number" },
    { id: "rSquared", label: "R²", unit: "", format: "percentage" },
    { id: "adjustedRSquared", label: "Adjusted R²", unit: "", format: "percentage" },
    { id: "fStatistic", label: "F-statistic", unit: "", format: "number" },
    { id: "fPValue", label: "F-test p-value", unit: "", format: "number" },
    { id: "pearsonR", label: "Pearson correlation r", unit: "", format: "number" },
    { id: "regressionVerdict", label: "Regression verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "stats.ols_beta1", inputMap: { sampleSize: "regressionN", sumX: "regressionSumX", sumY: "regressionSumY", sumXY: "regressionSumXY", sumX2: "regressionSumX2" }, outputId: "beta1" }],
  reportTemplate: { title: "Linear Regression Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["OLS assumptions: linearity, independence, homoscedasticity, normality of residuals.", "R² > 0.6 + p < 0.05 = statistically significant model."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 14. Sample Size (Power Analysis)
 * ════════════════════════════════════════════════════════════════════════════ */

const SAMPLE_SIZE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "sample-size-calculator",
  legacyPaidSlug: "sample-size-calculator",
  name: "Sample Size & Power Analyzer",
  sectorSlug: "financial-planning",
  category: "measurement",
  painStatement: "Survey and experiment planning requires knowing the minimum sample size for statistical significance. This tool computes required sample size for proportions and means with confidence level and power adjustment.",
  inputs: [
    { id: "testType", label: "Test type", type: "select", unit: "", required: true, smartDefault: "proportion", options: [...TEST_TYPE_OPTIONS], helper: "Select proportion (categorical) or mean (continuous) test.", expertMeaning: "Determines sample size formula" },
    { id: "confidenceLevel", label: "Confidence level (%)", type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 80, max: 99.9 }, helper: "Confidence level for Z-score (95% → Z=1.96).", expertMeaning: "1-α" },
    { id: "errorMargin", label: "Margin of error e (%)", type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.1, max: 50 }, helper: "Acceptable sampling error.", expertMeaning: "ε in n = Z²·p·(1-p)/ε²" },
    { id: "estimatedProportion", label: "Estimated proportion p̂ (%)", type: "number", unit: "%", required: true, smartDefault: 50, validation: { min: 1, max: 99 }, helper: "Expected proportion for proportion test (50% = maximum n).", expertMeaning: "p for conservative sample size" },
    { id: "estimatedStdDev", label: "Estimated std dev σ", type: "number", unit: "", required: false, smartDefault: 10, validation: { min: 0.01 }, helper: "Expected population standard deviation (mean test only).", expertMeaning: "σ for n = (Z·σ/ε)²" },
    { id: "detectableEffect", label: "Detectable effect Δ", type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 0.01 }, helper: "Minimum meaningful effect size (mean test).", expertMeaning: "Δ" },
    { id: "powerLevel", label: "Statistical power", type: "select", unit: "", required: false, smartDefault: "80", options: [...POWER_LEVEL_OPTIONS], helper: "Probability of detecting true effect = 1-β.", expertMeaning: "Power = 1-β" },
  ],
  outputs: [
    { id: "requiredSampleSize", label: "Required sample size n", unit: "", format: "number" },
    { id: "actualPower", label: "Statistical power (1-β)", unit: "", format: "percentage" },
    { id: "type1ErrorRate", label: "Type I error rate α", unit: "", format: "percentage" },
    { id: "type2ErrorRate", label: "Type II error rate β", unit: "", format: "percentage" },
    { id: "sampleAdequacy", label: "Adequacy flag", unit: "", format: "number" },
    { id: "sampleSizeVerdict", label: "Sample adequacy", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "stats.sample_size_proportion", inputMap: { zScore: "confidenceLevel", estimatedProportion: "estimatedProportion", errorMargin: "errorMargin" }, outputId: "requiredSampleSize" }],
  reportTemplate: { title: "Sample Size Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Proportion test: n = Z²·p·(1-p)/ε². Mean test: n = (Z·σ/Δ)².", "p̂=0.50 gives conservative maximum sample size for proportion tests."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 15. ANOVA
 * ════════════════════════════════════════════════════════════════════════════ */

const ANOVA_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "anova-analyzer",
  legacyPaidSlug: "anova-analyzer",
  name: "One-Way ANOVA Analyzer",
  sectorSlug: "financial-planning",
  category: "measurement",
  painStatement: "ANOVA requires computing SS_between, SS_within, F-statistic, p-value and post-hoc (Tukey HSD) — each step is manual spreadsheet work. This tool automates the complete one-way ANOVA with effect size.",
  inputs: [
    { id: "groupCount", label: "Number of groups k", type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 2, max: 10 }, helper: "Number of groups being compared.", expertMeaning: "k" },
    { id: "totalSampleSize", label: "Total sample size N", type: "number", unit: "", required: true, smartDefault: 30, validation: { min: 6 }, helper: "Total observations across all groups.", expertMeaning: "N" },
    { id: "anovaGrandMean", label: "Grand mean ȳ_grand", type: "number", unit: "", required: true, smartDefault: 50, helper: "Mean of all observations combined.", expertMeaning: "ȳ for SS_between = Σ(nᵢ·(ȳᵢ - ȳ)²)" },
  ],
  outputs: [
    { id: "ssBetween", label: "SS between", unit: "", format: "number" },
    { id: "ssWithin", label: "SS within (error)", unit: "", format: "number" },
    { id: "ssTotal", label: "SS total", unit: "", format: "number" },
    { id: "dfBetween", label: "df between", unit: "", format: "number" },
    { id: "dfWithin", label: "df within", unit: "", format: "number" },
    { id: "fStatistic", label: "F-statistic", unit: "", format: "number" },
    { id: "fPValue", label: "p-value", unit: "", format: "number" },
    { id: "etaSquared", label: "η² (effect size)", unit: "", format: "percentage" },
    { id: "tukeyHSD", label: "Tukey HSD critical diff", unit: "", format: "number" },
    { id: "bonferroniAlpha", label: "Bonferroni α adjusted", unit: "", format: "percentage" },
    { id: "anovaVerdict", label: "ANOVA verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "stats.anova_f_stat", inputMap: { msBetween: "groupCount", msWithin: "totalSampleSize" }, outputId: "fStatistic" }],
  reportTemplate: { title: "ANOVA Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["ANOVA assumptions: independence, normality, homogeneity of variance.", "η² norms: small ≥0.01, medium ≥0.06, large ≥0.14.", "Tukey HSD assumes equal group sizes."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 16. ROI
 * ════════════════════════════════════════════════════════════════════════════ */

const ROI_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "roi-analyzer",
  legacyPaidSlug: "roi-analyzer",
  name: "ROI Analyzer with Payback & IRR",
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "Simple ROI calculation ignores time value of money, payback period and internal rate. This tool provides integrated analysis with payback years, DCF-based NPV and IRR verification.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code." },
    { id: "totalInvestment", label: "Total investment", type: "number", unit: "currency", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "Initial capital outlay.", expertMeaning: "I₀" },
    { id: "annualNetReturnYear1", label: "Net return year 1", type: "number", unit: "currency", required: true, smartDefault: 30000, helper: "Net cash inflow year 1.", expertMeaning: "CF₁" },
    { id: "annualNetReturnYear2", label: "Net return year 2", type: "number", unit: "currency", required: false, smartDefault: 35000, helper: "Net cash inflow year 2.", expertMeaning: "CF₂" },
    { id: "annualNetReturnYear3", label: "Net return year 3", type: "number", unit: "currency", required: false, smartDefault: 40000, helper: "Net cash inflow year 3.", expertMeaning: "CF₃" },
    { id: "annualNetReturnYear4", label: "Net return year 4", type: "number", unit: "currency", required: false, smartDefault: 30000, helper: "Net cash inflow year 4.", expertMeaning: "CF₄" },
    { id: "annualNetReturnYear5", label: "Net return year 5", type: "number", unit: "currency", required: false, smartDefault: 20000, helper: "Net cash inflow year 5.", expertMeaning: "CF₅" },
    { id: "targetDiscountRate", label: "Discount rate r (%)", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "Required rate of return / cost of capital.", expertMeaning: "r for NPV calculation" },
  ],
  outputs: [
    { id: "roiPercent", label: "ROI", unit: "%", format: "percentage" },
    { id: "paybackPeriodYears", label: "Payback period", unit: "years", format: "number" },
    { id: "paybackPeriodMonths", label: "Payback period", unit: "months", format: "number" },
    { id: "irrValue", label: "IRR", unit: "%", format: "percentage" },
    { id: "npvValue", label: "NPV (discounted)", unit: "currency", format: "currency" },
    { id: "investmentVerdict", label: "Investment verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "finance.roi_percent", inputMap: { initialInvestment: "totalInvestment", totalReturn: "annualNetReturnYear1" }, outputId: "roiPercent", formulaFamily: "finance" }],
  reportTemplate: { title: "ROI Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 15, targetMarginPercent: 10, assumptionNotes: ["ROI = (Total Return - Investment) / Investment × 100.", "Payback ignores time value of money.", "NPV > 0 + IRR > r + ROI > 0 → Accept investment."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 17. Belt-Pulley & Gear Ratio
 * ════════════════════════════════════════════════════════════════════════════ */

const BELT_PULLEY_GEAR_SCHEMA: PremiumCalculatorSchema = {
  id: "belt-pulley-gear-calculator",
  legacyPaidSlug: "belt-pulley-gear-calculator",
  name: "Belt-Pulley & Gear Ratio Calculator",
  sectorSlug: "sheet-metal",
  category: "measurement",
  painStatement: "Belt drive design involves speed ratio, belt speed, power transmission (Euler tension), slip, and multi-stage gear efficiency — each a manual calculation step that compounds errors.",
  inputs: [
    { id: "driverPulleyDiameter", label: "Driver pulley diameter d₁", type: "number", unit: "mm", required: true, smartDefault: 150, validation: { min: 10 }, helper: "Diameter of the driving pulley.", expertMeaning: "d₁" },
    { id: "drivenPulleyDiameter", label: "Driven pulley diameter d₂", type: "number", unit: "mm", required: true, smartDefault: 300, validation: { min: 10 }, helper: "Diameter of the driven pulley.", expertMeaning: "d₂ for speed ratio = d₂/d₁" },
    { id: "driverRPM", label: "Driver speed N₁", type: "number", unit: "RPM", required: true, smartDefault: 1450, validation: { min: 1 }, helper: "Rotational speed of driver pulley.", expertMeaning: "N₁" },
    { id: "beltType", label: "Belt type", type: "select", unit: "", required: true, smartDefault: "v_belt", options: [...BELT_TYPE_OPTIONS], helper: "Belt type determines slip and efficiency factors.", expertMeaning: "η and slip assumptions" },
    { id: "slipPercent", label: "Slip (%)", type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 10 }, helper: "Belt slip percentage (default from belt type).", expertMeaning: "s for N₂_actual = N₂_theoretical × (1-s)" },
    { id: "gearStageCount", label: "Gear stages", type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 10 }, helper: "Number of gear reduction stages.", expertMeaning: "Stages applied to total ratio" },
  ],
  outputs: [
    { id: "speedRatio", label: "Speed ratio d₂/d₁", unit: "", format: "number" },
    { id: "actualDrivenRPM", label: "Actual driven RPM N₂", unit: "RPM", format: "number" },
    { id: "beltSpeedMs", label: "Belt speed v", unit: "m/s", format: "number" },
    { id: "totalGearRatio", label: "Total gear ratio", unit: "", format: "number" },
    { id: "totalDriveEfficiency", label: "Total drive efficiency", unit: "%", format: "percentage" },
    { id: "driveVerdict", label: "Drive design verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "measurement.pulley_driven_rpm", inputMap: { driverDiameterMm: "driverPulleyDiameter", drivenDiameterMm: "drivenPulleyDiameter", driverRpm: "driverRPM" }, outputId: "actualDrivenRPM" }],
  reportTemplate: { title: "Belt-Pulley & Gear Drive Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Belt slip default: V-belt 2%, flat 3%, timing 0%.", "Gear stage efficiency: V-belt 97%, flat 95%, timing 99.5%.", "Euler tension ratio: exp(μ·θ)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 18. Hydraulic Cylinder
 * ════════════════════════════════════════════════════════════════════════════ */

const HYDRAULIC_CYLINDER_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-cylinder-calculator",
  legacyPaidSlug: "hydraulic-cylinder-calculator",
  name: "Hydraulic Cylinder Calculator",
  sectorSlug: "sheet-metal",
  category: "measurement",
  painStatement: "Hydraulic cylinder sizing requires concurrent force (push/pull), speed (extend/retract), power and Euler buckling calculations. Missing the rod-to-stroke ratio can cause catastrophic buckling failure.",
  inputs: [
    { id: "systemPressure", label: "System pressure P", type: "number", unit: "bar", required: true, smartDefault: 200, validation: { min: 1 }, helper: "Hydraulic system operating pressure.", expertMeaning: "P (1 bar = 1e5 Pa)" },
    { id: "pistonDiameter", label: "Piston diameter D", type: "number", unit: "mm", required: true, smartDefault: 63, validation: { min: 10 }, helper: "Bore diameter of hydraulic cylinder.", expertMeaning: "D for A_push = π·D²/4" },
    { id: "rodDiameter", label: "Rod diameter d", type: "number", unit: "mm", required: true, smartDefault: 36, validation: { min: 5 }, helper: "Piston rod diameter (D > d).", expertMeaning: "d for A_pull = π·(D²-d²)/4" },
    { id: "pumpFlowRate", label: "Pump flow rate Q", type: "number", unit: "L/min", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "Hydraulic pump volumetric flow rate.", expertMeaning: "Q for v_ext = Q / A_push" },
    { id: "cylinderStroke", label: "Cylinder stroke L", type: "number", unit: "mm", required: true, smartDefault: 500, validation: { min: 10 }, helper: "Full piston stroke length.", expertMeaning: "L for Euler slenderness ratio" },
    { id: "endCondition", label: "End condition", type: "select", unit: "", required: false, smartDefault: "hinged", options: [...END_CONDITION_OPTIONS], helper: "End fixity determines Euler column K factor.", expertMeaning: "K for P_cr = π²·E·I/(K·L)²" },
    { id: "youngModulus", label: "Rod material E-modulus", type: "select", unit: "", required: false, smartDefault: "steel", options: [...YOUNG_MODULUS_OPTIONS], helper: "Young's modulus of rod material.", expertMeaning: "E for Euler buckling" },
  ],
  outputs: [
    { id: "pushForceKN", label: "Push force F_push", unit: "kN", format: "number" },
    { id: "pullForceKN", label: "Pull force F_pull", unit: "kN", format: "number" },
    { id: "pushPullRatio", label: "Push-pull ratio", unit: "", format: "number" },
    { id: "extensionSpeedMms", label: "Extension speed v_ext", unit: "mm/s", format: "number" },
    { id: "retractionSpeedMms", label: "Retraction speed v_ret", unit: "mm/s", format: "number" },
    { id: "hydraulicPowerKw", label: "Hydraulic power", unit: "kW", format: "number" },
    { id: "eulerCriticalLoadKN", label: "Euler critical load P_cr", unit: "kN", format: "number" },
    { id: "bucklingSafetyFactor", label: "Buckling safety factor", unit: "", format: "number" },
    { id: "cylinderVerdict", label: "Cylinder design verdict", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "measurement.hydraulic_cylinder_push_pull_ratio", inputMap: { pistonDia: "pistonDiameter", rodDia: "rodDiameter" }, outputId: "pushPullRatio" }],
  reportTemplate: { title: "Hydraulic Cylinder Design Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Hydraulic fluid assumed incompressible; pump efficiency 100% for speed.", "Euler buckling: material E for steel 210 GPa, stainless 193 GPa, aluminum 69 GPa.", "Safety factor SF ≥ 5: safe design; SF < 3.5: buckling failure risk."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Aggregate export
 * ════════════════════════════════════════════════════════════════════════════ */

export const ALL_INDUSTRIAL_FORMULA_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  IRR_INVESTMENT_ANALYZER_SCHEMA,
  NPV_RISK_ANALYZER_SCHEMA,
  DCF_ENTERPRISE_VALUATOR_SCHEMA,
  LEASE_VS_BUY_ANALYZER_SCHEMA,
  DARCY_WEISBACH_CALCULATOR_SCHEMA,
  LMTD_HEAT_EXCHANGER_SCHEMA,
  OEE_CALCULATOR_SCHEMA,
  LINE_BALANCING_SCHEMA,
  STANDARD_TIME_SCHEMA,
  LEARNING_CURVE_SCHEMA,
  SPRING_DESIGN_SCHEMA,
  CARBON_FOOTPRINT_SCHEMA,
  REGRESSION_ANALYZER_SCHEMA,
  SAMPLE_SIZE_CALCULATOR_SCHEMA,
  ANOVA_ANALYZER_SCHEMA,
  ROI_ANALYZER_SCHEMA,
  BELT_PULLEY_GEAR_SCHEMA,
  HYDRAULIC_CYLINDER_SCHEMA,
];
