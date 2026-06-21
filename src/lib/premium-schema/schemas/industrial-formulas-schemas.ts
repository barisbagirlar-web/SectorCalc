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
 * FMEA RPN (Risk Priority Number)
 * ════════════════════════════════════════════════════════════════════════════ */

const FMEA_RPN_SCHEMA: PremiumCalculatorSchema = {
  id: "fmea-rpn-calculator",
  legacyPaidSlug: "fmea-rpn-calculator",
  name: "FMEA RPN Calculator", name_i18n: {"en":"FMEA RPN Calculator","tr":"FMEA RPN Calculator (Risk Priority Number)"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "FMEA requires systematic RPN calculation (S\u00d7O\u00d7D), risk prioritization and cost-benefit of corrective actions. Spreadsheet-based FMEA lacks automatic risk level classification and action priority logic.", painStatement_i18n: {"en":"FMEA requires systematic RPN calculation (S\u00d7O\u00d7D), risk prioritization and cost-benefit of corrective actions. Spreadsheet-based FMEA lacks automatic risk level classification and action priority logic.","tr":"FMEA requires systematic RPN calculation (S\u00d7O\u00d7D), risk prioritization and cost-benefit of corrective actions. Spreadsheet-based FMEA lacks automatic risk level classification and action priority logic."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency","tr":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency.","tr":"All monetary inputs in this currency."}, expertMeaning: "ISO code for output formatting.", expertMeaning_i18n: {"en":"ISO code for output formatting.","tr":"ISO code for output formatting."} },
    { id: "prosesAdimiSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps","tr":"Proses ad\u0131m\u0131 say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "Total number of process steps/failure modes to evaluate.", helper_i18n: {"en":"Total number of process steps/failure modes to evaluate.","tr":"De\u011ferlendirilecek toplam proses ad\u0131m\u0131/hat modu say\u0131s\u0131."}, expertMeaning: "n for average RPN calculation", expertMeaning_i18n: {"en":"n for average RPN calculation","tr":"n for average RPN calculation"} },
    { id: "ortalamaSiddet_S", label: "Average severity S (1-10)", label_i18n: {"en":"Average severity S (1-10)","tr":"Ortalama \u015fiddet S (1-10)"}, type: "number", unit: "", required: true, smartDefault: 6, validation: { min: 1, max: 10 }, helper: "Average severity rating across all failure modes.", helper_i18n: {"en":"Average severity rating across all failure modes.","tr":"T\u00fcm hata modlar\u0131 i\u00e7in ortalama \u015fiddet puan\u0131."}, expertMeaning: "S in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"S in RPN = S \u00d7 O \u00d7 D","tr":"S in RPN = S \u00d7 O \u00d7 D"} },
    { id: "ortalamaOlusma_O", label: "Average occurrence O (1-10)", label_i18n: {"en":"Average occurrence O (1-10)","tr":"Ortalama olu\u015fma O (1-10)"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "Average occurrence rating across all failure modes.", helper_i18n: {"en":"Average occurrence rating across all failure modes.","tr":"T\u00fcm hata modlar\u0131 i\u00e7in ortalama olu\u015fma puan\u0131."}, expertMeaning: "O in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"O in RPN = S \u00d7 O \u00d7 D","tr":"O in RPN = S \u00d7 O \u00d7 D"} },
    { id: "ortalamaSaptama_D", label: "Average detection D (1-10)", label_i18n: {"en":"Average detection D (1-10)","tr":"Ortalama saptama D (1-10)"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "Average detection rating (10 = hard to detect).", helper_i18n: {"en":"Average detection rating (10 = hard to detect).","tr":"Ortalama saptama puan\u0131 (10 = zor tespit)."}, expertMeaning: "D in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"D in RPN = S \u00d7 O \u00d7 D","tr":"D in RPN = S \u00d7 O \u00d7 D"} },
    { id: "maliyet_failure", label: "Average cost per failure", label_i18n: {"en":"Average cost per failure","tr":"Hata ba\u015f\u0131na ortalama maliyet"}, type: "number", unit: "currency", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "Estimated cost incurred per failure occurrence.", helper_i18n: {"en":"Estimated cost incurred per failure occurrence.","tr":"Hata ba\u015f\u0131na tahmini maliyet."}, expertMeaning: "For cost-benefit analysis of corrective actions", expertMeaning_i18n: {"en":"For cost-benefit analysis of corrective actions","tr":"For cost-benefit analysis of corrective actions"} },
    { id: "maliyet_onlem", label: "Average cost per preventive action", label_i18n: {"en":"Average cost per preventive action","tr":"\u00d6nleyici faaliyet ba\u015f\u0131na ortalama maliyet"}, type: "number", unit: "currency", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Estimated cost to implement a corrective/preventive action.", helper_i18n: {"en":"Estimated cost to implement a corrective/preventive action.","tr":"D\u00fczeltici/\u00f6nleyici faaliyet uygulama maliyeti."}, expertMeaning: "For cost-benefit ratio calculation", expertMeaning_i18n: {"en":"For cost-benefit ratio calculation","tr":"For cost-benefit ratio calculation"} },
    { id: "kabulEdilebilirRPN", label: "Acceptable RPN threshold", label_i18n: {"en":"Acceptable RPN threshold","tr":"Kabul edilebilir RPN e\u015fi\u011fi"}, type: "number", unit: "", required: false, smartDefault: 100, validation: { min: 0, max: 1000 }, helper: "RPN below this value is considered acceptable (industry default: 100).", helper_i18n: {"en":"RPN below this value is considered acceptable (industry default: 100).","tr":"Bu de\u011ferin alt\u0131ndaki RPN kabul edilebilir kabul edilir (end\u00fcstri varsay\u0131lan\u0131: 100)."}, expertMeaning: "Action threshold for prioritization", expertMeaning_i18n: {"en":"Action threshold for prioritization","tr":"Action threshold for prioritization"} },
  ],
  outputs: [
    { id: "RPN_ortalama", label: "Average RPN (S\u00d7O\u00d7D)", label_i18n: {"en":"Average RPN (S\u00d7O\u00d7D)","tr":"Ortalama RPN (S\u00d7O\u00d7D)"}, unit: "", format: "number" },
    { id: "RPN_max", label: "Maximum possible RPN", label_i18n: {"en":"Maximum possible RPN","tr":"Maksimum olas\u0131 RPN"}, unit: "", format: "number" },
    { id: "riskDuzeyi", label: "Risk level classification", label_i18n: {"en":"Risk level classification","tr":"Risk seviyesi s\u0131n\u0131fland\u0131rmas\u0131"}, unit: "", format: "number" },
    { id: "oncelikSirasi", label: "Action priority order", label_i18n: {"en":"Action priority order","tr":"\u00d6ncelik s\u0131ras\u0131"}, unit: "", format: "number" },
    { id: "failureMaliyet_toplam", label: "Total failure cost exposure", label_i18n: {"en":"Total failure cost exposure","tr":"Toplam hata maliyeti maruziyeti"}, unit: "currency", format: "currency" },
    { id: "onlemMaliyet_toplam", label: "Total preventive action cost", label_i18n: {"en":"Total preventive action cost","tr":"Toplam \u00f6nleyici faaliyet maliyeti"}, unit: "currency", format: "currency" },
    { id: "faydaMaliyetOrani", label: "Benefit-cost ratio", label_i18n: {"en":"Benefit-cost ratio","tr":"Fayda-maliyet oran\u0131"}, unit: "", format: "number" },
    { id: "cozumOncelikleri", label: "Resolution recommendations", label_i18n: {"en":"Resolution recommendations","tr":"\u00c7\u00f6z\u00fcm \u00f6nerileri"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "RPN_ortalama", warning: 100, critical: 200, direction: "higher_is_bad", warningMessage: "RPN above 100 \u2014 moderate risk, consider corrective action.", warningMessage_i18n: {"en":"RPN above 100 \u2014 moderate risk, consider corrective action.","tr":"RPN above 100 \u2014 moderate risk, consider corrective action."}, criticalMessage: "RPN above 200 \u2014 critical risk, immediate action required.", criticalMessage_i18n: {"en":"RPN above 200 \u2014 critical risk, immediate action required.","tr":"RPN above 200 \u2014 critical risk, immediate action required."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.fmea_risk", inputMap: { severityS: "ortalamaSiddet_S", occurrenceO: "ortalamaOlusma_O", detectionD: "ortalamaSaptama_D", acceptThreshold: "kabulEdilebilirRPN" }, outputId: "RPN_ortalama" }],
  reportTemplate: { title: "FMEA RPN Analysis Report", title_i18n: {"en":"FMEA RPN Analysis Report","tr":"FMEA RPN Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["RPN = Severity \u00d7 Occurrence \u00d7 Detection (S\u00d7O\u00d7D).", "Risk levels: RPN\u2265200 Critical, 100\u2264RPN<200 Major, 50\u2264RPN<100 Moderate, RPN<50 Minor.", "AIAG & VDA FMEA Handbook reference standards."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * DOE Factorial Design Sample Size
 * ════════════════════════════════════════════════════════════════════════════ */

const DOE_FACTORIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "doe-factorial-design-calculator",
  legacyPaidSlug: "doe-factorial-design-calculator",
  name: "DOE Factorial Design Calculator", name_i18n: {"en":"DOE Factorial Design Calculator","tr":"DOE Fakt\u00f6riyel Tasar\u0131m Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Design of Experiments requires selecting the correct factorial resolution, determining sample size (2^k \u00d7 r) and checking confound patterns and statistical power. Manual calculation often misses aliasing structures and proper replication.", painStatement_i18n: {"en":"Design of Experiments requires selecting the correct factorial resolution, determining sample size (2^k \u00d7 r) and checking confound patterns and statistical power. Manual calculation often misses aliasing structures and proper replication.","tr":"Design of Experiments requires selecting the correct factorial resolution, determining sample size (2^k \u00d7 r) and checking confound patterns and statistical power. Manual calculation often misses aliasing structures and proper replication."},
  inputs: [
    { id: "faktorSayisi_k", label: "Number of factors k", label_i18n: {"en":"Number of factors k","tr":"Fakt\u00f6r say\u0131s\u0131 k"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 2, max: 10 }, helper: "Number of independent variables in the experiment.", helper_i18n: {"en":"Number of independent variables in the experiment.","tr":"Deneydeki ba\u011f\u0131ms\u0131z de\u011fi\u015fken say\u0131s\u0131."}, expertMeaning: "k for 2^k factorial design", expertMeaning_i18n: {"en":"k for 2^k factorial design","tr":"k for 2^k factorial design"} },
    { id: "faktorSeviyesi", label: "Factor levels", label_i18n: {"en":"Factor levels","tr":"Fakt\u00f6r seviyesi"}, type: "select", unit: "", required: true, smartDefault: "iki", options: [{ value: "iki", label: "2-level (2^k)" }, { value: "uc", label: "3-level (3^k)" }], helper: "Number of levels per factor.", helper_i18n: {"en":"Number of levels per factor.","tr":"Fakt\u00f6r ba\u015f\u0131na seviye say\u0131s\u0131."}, expertMeaning: "Determines design matrix size: 2^k or 3^k", expertMeaning_i18n: {"en":"Determines design matrix size: 2^k or 3^k","tr":"Determines design matrix size: 2^k or 3^k"} },
    { id: "merkezNoktaSayisi", label: "Center points", label_i18n: {"en":"Center points","tr":"Merkez nokta say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 0, max: 20 }, helper: "Replicated center points for curvature and pure error estimation.", helper_i18n: {"en":"Replicated center points for curvature and pure error estimation.","tr":"E\u011frilik ve saf hata tahmini i\u00e7in tekrarlanan merkez noktalar\u0131."}, expertMeaning: "n_c for curvature detection", expertMeaning_i18n: {"en":"n_c for curvature detection","tr":"n_c for curvature detection"} },
    { id: "blokSayisi", label: "Number of blocks", label_i18n: {"en":"Number of blocks","tr":"Blok say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 20 }, helper: "Blocking factor for nuisance variables (1 = no blocking).", helper_i18n: {"en":"Blocking factor for nuisance variables (1 = no blocking).","tr":"G\u00fcr\u00fclt\u00fc de\u011fi\u015fkenleri i\u00e7in bloklama (1 = blok yok)."}, expertMeaning: "b for blocked design total runs", expertMeaning_i18n: {"en":"b for blocked design total runs","tr":"b for blocked design total runs"} },
    { id: "etkiBuyuklugu_min", label: "Minimum detectable effect size", label_i18n: {"en":"Minimum detectable effect size","tr":"Minimum tespit edilebilir etki b\u00fcy\u00fckl\u00fc\u011f\u00fc"}, type: "number", unit: "\u03c3", required: false, smartDefault: 2, validation: { min: 0.1 }, helper: "Smallest effect size (in standard deviations) you want to detect.", helper_i18n: {"en":"Smallest effect size (in standard deviations) you want to detect.","tr":"Tespit etmek istedi\u011finiz en k\u00fc\u00e7\u00fck etki b\u00fcy\u00fckl\u00fc\u011f\u00fc (standart sapma cinsinden)."}, expertMeaning: "\u0394/\u03c3 for power analysis", expertMeaning_i18n: {"en":"\u0394/\u03c3 for power analysis","tr":"\u0394/\u03c3 for power analysis"} },
    { id: "varyans_tahmini", label: "Estimated variance \u03c3\u00b2", label_i18n: {"en":"Estimated variance \u03c3\u00b2","tr":"Tahmini varyans \u03c3\u00b2"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 0.01 }, helper: "Prior estimate of error variance from pilot data.", helper_i18n: {"en":"Prior estimate of error variance from pilot data.","tr":"Pilot verilerden hata varyans\u0131 \u00f6n tahmini."}, expertMeaning: "\u03c3\u00b2 for power/sample size", expertMeaning_i18n: {"en":"\u03c3\u00b2 for power/sample size","tr":"\u03c3\u00b2 for power/sample size"} },
    { id: "alfa", label: "Significance level \u03b1 (%)", label_i18n: {"en":"Significance level \u03b1 (%)","tr":"Anlaml\u0131l\u0131k d\u00fczeyi \u03b1 (%)"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "Type I error probability.", helper_i18n: {"en":"Type I error probability.","tr":"Tip I hata olas\u0131l\u0131\u011f\u0131."}, expertMeaning: "\u03b1 for critical F-value", expertMeaning_i18n: {"en":"\u03b1 for critical F-value","tr":"\u03b1 for critical F-value"} },
    { id: "beta", label: "Type II error \u03b2 (%)", label_i18n: {"en":"Type II error \u03b2 (%)","tr":"Tip II hata \u03b2 (%)"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 1, max: 50 }, helper: "Type II error probability (power = 1-\u03b2).", helper_i18n: {"en":"Type II error probability (power = 1-\u03b2).","tr":"Tip II hata olas\u0131l\u0131\u011f\u0131 (g\u00fc\u00e7 = 1-\u03b2)."}, expertMeaning: "\u03b2 for power = 1-\u03b2", expertMeaning_i18n: {"en":"\u03b2 for power = 1-\u03b2","tr":"\u03b2 for power = 1-\u03b2"} },
    { id: "replikasyonSayisi", label: "Number of replications r", label_i18n: {"en":"Number of replications r","tr":"Replikasyon say\u0131s\u0131 r"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 20 }, helper: "Complete replications of the full factorial design.", helper_i18n: {"en":"Complete replications of the full factorial design.","tr":"Tam fakt\u00f6riyel tasar\u0131m\u0131n tekrar say\u0131s\u0131."}, expertMeaning: "r in Total = 2^k \u00d7 r + center + blocks", expertMeaning_i18n: {"en":"r in Total = 2^k \u00d7 r + center + blocks","tr":"r in Total = 2^k \u00d7 r + center + blocks"} },
  ],
  outputs: [
    { id: "toplamDeneySayisi", label: "Total experiment runs", label_i18n: {"en":"Total experiment runs","tr":"Toplam deney say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "cozunurluk", label: "Design resolution", label_i18n: {"en":"Design resolution","tr":"Tasar\u0131m \u00e7\u00f6z\u00fcn\u00fcrl\u00fc\u011f\u00fc"}, unit: "", format: "number" },
    { id: "confoundPattern", label: "Confounding/aliasing pattern", label_i18n: {"en":"Confounding/aliasing pattern","tr":"Kar\u0131\u015fma/aliasing deseni"}, unit: "", format: "number" },
    { id: "power", label: "Statistical power", label_i18n: {"en":"Statistical power","tr":"\u0130statistiksel g\u00fc\u00e7"}, unit: "%", format: "percentage" },
    { id: "guc_mevcut", label: "Power adequate?", label_i18n: {"en":"Power adequate?","tr":"G\u00fc\u00e7 yeterli mi?"}, unit: "", format: "number" },
    { id: "noktaTuru", label: "Design point type", label_i18n: {"en":"Design point type","tr":"Tasar\u0131m noktas\u0131 t\u00fcr\u00fc"}, unit: "", format: "number" },
    { id: "oneri", label: "Recommendation", label_i18n: {"en":"Recommendation","tr":"\u00d6neri"}, unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.doe_factorial", inputMap: { factorCount_k: "faktorSayisi_k", factorLevel: "faktorSeviyesi", centerPoints: "merkezNoktaSayisi", blockCount: "blokSayisi", effectSize: "etkiBuyuklugu_min" }, outputId: "toplamDeneySayisi" }],
  reportTemplate: { title: "DOE Factorial Design Report", title_i18n: {"en":"DOE Factorial Design Report","tr":"DOE Fakt\u00f6riyel Tasar\u0131m Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Full factorial design: Total runs = 2^k \u00d7 r + center points + blocks.", "Resolution III confounds main effects with 2-factor interactions.", "Power \u2265 80% (\u03b2 \u2264 20%) is considered adequate per industry standard."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Reliability Block Diagram (RBD / MTBF)
 * ════════════════════════════════════════════════════════════════════════════ */

const RELIABILITY_BLOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "reliability-block-calculator",
  legacyPaidSlug: "reliability-block-calculator",
  name: "Reliability Block (RBD/MTBF) Calculator", name_i18n: {"en":"Reliability Block (RBD/MTBF) Calculator","tr":"Reliability Block (RBD/MTBF) Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "System reliability analysis requires combining series/parallel MTBF, calculating standby redundancy and verifying availability (MTBF/(MTBF+MTTR)). Manual combination of failure rates often neglects interaction effects.", painStatement_i18n: {"en":"System reliability analysis requires combining series/parallel MTBF, calculating standby redundancy and verifying availability (MTBF/(MTBF+MTTR)). Manual combination of failure rates often neglects interaction effects.","tr":"System reliability analysis requires combining series/parallel MTBF, calculating standby redundancy and verifying availability (MTBF/(MTBF+MTTR)). Manual combination of failure rates often neglects interaction effects."},
  inputs: [
    { id: "sistemKonfigurasyonu", label: "System configuration", label_i18n: {"en":"System configuration","tr":"Sistem konfig\u00fcrasyonu"}, type: "select", unit: "", required: true, smartDefault: "seri", options: [
      { value: "seri", label: "Series" },
      { value: "paralel", label: "Parallel" },
      { value: "seri_paralel", label: "Series-parallel (mixed)" },
      { value: "yedek", label: "Standby redundant" },
    ], helper: "Configuration type for combining component reliabilities.", helper_i18n: {"en":"Configuration type for combining component reliabilities.","tr":"Bile\u015fen g\u00fcvenilirliklerini birle\u015ftirme konfig\u00fcrasyon t\u00fcr\u00fc."}, expertMeaning: "Determines system reliability formula", expertMeaning_i18n: {"en":"Determines system reliability formula","tr":"Determines system reliability formula"} },
    { id: "bilesenSayisi", label: "Number of components n", label_i18n: {"en":"Number of components n","tr":"Bile\u015fen say\u0131s\u0131 n"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 2, max: 50 }, helper: "Total number of components/subsystems.", helper_i18n: {"en":"Total number of components/subsystems.","tr":"Toplam bile\u015fen/alt sistem say\u0131s\u0131."}, expertMeaning: "n for system reliability aggregation", expertMeaning_i18n: {"en":"n for system reliability aggregation","tr":"n for system reliability aggregation"} },
    { id: "bilesinMTBF_ortalama", label: "Average component MTBF", label_i18n: {"en":"Average component MTBF","tr":"Ortalama bile\u015fen MTBF"}, type: "number", unit: "hours", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "Mean Time Between Failures for each component.", helper_i18n: {"en":"Mean Time Between Failures for each component.","tr":"Her bile\u015fen i\u00e7in ar\u0131za aras\u0131 ortalama s\u00fcre."}, expertMeaning: "MTBF\u1e25 = 1/\u03bb\u1e25 for failure rate \u03bb\u1e25", expertMeaning_i18n: {"en":"MTBF\u1e25 = 1/\u03bb\u1e25 for failure rate \u03bb\u1e25","tr":"MTBF\u1e25 = 1/\u03bb\u1e25 for failure rate \u03bb\u1e25"} },
    { id: "bilesinMTTR_ortalama", label: "Average component MTTR", label_i18n: {"en":"Average component MTTR","tr":"Ortalama bile\u015fen MTTR"}, type: "number", unit: "hours", required: false, smartDefault: 8, validation: { min: 0.1 }, helper: "Mean Time To Repair for each component.", helper_i18n: {"en":"Mean Time To Repair for each component.","tr":"Her bile\u015fen i\u00e7in ortalama onar\u0131m s\u00fcresi."}, expertMeaning: "MTTR for availability A = MTBF/(MTBF+MTTR)", expertMeaning_i18n: {"en":"MTTR for availability A = MTBF/(MTBF+MTTR)","tr":"MTTR for availability A = MTBF/(MTBF+MTTR)"} },
    { id: "yedekSayisi", label: "Number of standby units", label_i18n: {"en":"Number of standby units","tr":"Yedek birim say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 0, max: 10 }, helper: "Standby redundant units (0 = active parallel without standby).", helper_i18n: {"en":"Standby redundant units (0 = active parallel without standby).","tr":"Bekleme yedek birim say\u0131s\u0131 (0 = yedeksiz aktif paralel)."}, expertMeaning: "m for standby reliability formula", expertMeaning_i18n: {"en":"m for standby reliability formula","tr":"m for standby reliability formula"} },
    { id: "calismaSuresi_t", label: "Operating time t", label_i18n: {"en":"Operating time t","tr":"\u00c7al\u0131\u015fma s\u00fcresi t"}, type: "number", unit: "hours", required: false, smartDefault: 8760, validation: { min: 1 }, helper: "Mission time for reliability R(t) = exp(-\u03bbt).", helper_i18n: {"en":"Mission time for reliability R(t) = exp(-\u03bbt).","tr":"G\u00fcvenilirlik i\u00e7in g\u00f6rev s\u00fcresi R(t) = exp(-\u03bbt)."}, expertMeaning: "t in R(t) = e^(-\u03bbt)", expertMeaning_i18n: {"en":"t in R(t) = e^(-\u03bbt)","tr":"t in R(t) = e^(-\u03bbt)"} },
    { id: "yedekGecisGuvenirligi", label: "Standby switch reliability", label_i18n: {"en":"Standby switch reliability","tr":"Yedek ge\u00e7i\u015f g\u00fcvenilirli\u011fi"}, type: "number", unit: "", required: false, smartDefault: 0.99, validation: { min: 0.5, max: 1 }, helper: "Probability that standby switches successfully (0.99 typical).", helper_i18n: {"en":"Probability that standby switches successfully (0.99 typical).","tr":"Yedek ge\u00e7i\u015f ba\u015far\u0131 olas\u0131l\u0131\u011f\u0131 (tipik 0.99)."}, expertMeaning: "R_sw for standby reliability with imperfect switching", expertMeaning_i18n: {"en":"R_sw for standby reliability with imperfect switching","tr":"R_sw for standby reliability with imperfect switching"} },
  ],
  outputs: [
    { id: "sistemMTBF", label: "System MTBF", label_i18n: {"en":"System MTBF","tr":"Sistem MTBF"}, unit: "hours", format: "number" },
    { id: "sistemMTTR", label: "System MTTR", label_i18n: {"en":"System MTTR","tr":"Sistem MTTR"}, unit: "hours", format: "number" },
    { id: "kullanilabilirlik_A", label: "Availability A", label_i18n: {"en":"Availability A","tr":"Kullan\u0131labilirlik A"}, unit: "%", format: "percentage" },
    { id: "R_t_seri", label: "Series reliability R(t)", label_i18n: {"en":"Series reliability R(t)","tr":"Seri g\u00fcvenilirlik R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_paralel", label: "Parallel reliability R(t)", label_i18n: {"en":"Parallel reliability R(t)","tr":"Paralel g\u00fcvenilirlik R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_seriparalel", label: "Series-parallel reliability R(t)", label_i18n: {"en":"Series-parallel reliability R(t)","tr":"Seri-paralel g\u00fcvenilirlik R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_yedek", label: "Standby reliability R(t)", label_i18n: {"en":"Standby reliability R(t)","tr":"Yedekli g\u00fcvenilirlik R(t)"}, unit: "", format: "percentage" },
    { id: "hataOrani_sistem", label: "System failure rate \u03bb", label_i18n: {"en":"System failure rate \u03bb","tr":"Sistem hata oran\u0131 \u03bb"}, unit: "/hour", format: "number" },
  ],
  thresholds: [
    { fieldId: "kullanilabilirlik_A", warning: 99, critical: 95, direction: "lower_is_bad", warningMessage: "Availability below 99% \u2014 target improvement needed.", warningMessage_i18n: {"en":"Availability below 99% \u2014 target improvement needed.","tr":"Availability below 99% \u2014 target improvement needed."}, criticalMessage: "Availability below 95% \u2014 critical gap, redesign recommended.", criticalMessage_i18n: {"en":"Availability below 95% \u2014 critical gap, redesign recommended.","tr":"Availability below 95% \u2014 critical gap, redesign recommended."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.reliability_block", inputMap: { config: "sistemKonfigurasyonu", componentCount: "bilesenSayisi", avgMTBF: "bilesinMTBF_ortalama", avgMTTR: "bilesinMTTR_ortalama", standbyCount: "yedekSayisi", missionHours: "calismaSuresi_t" }, outputId: "sistemMTBF" }],
  reportTemplate: { title: "Reliability Block Analysis Report", title_i18n: {"en":"Reliability Block Analysis Report","tr":"Reliability Block Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Series: \u03bb = \u03a3\u03bb\u1e25, MTBF = 1/\u03bb, R(t) = exp(-\u03bbt). Parallel: R(t) = 1-\u03a0(1-R\u1e25(t)).", "Standby: assumes imperfect switching with given switch reliability.", "Exponential failure distribution (constant failure rate) assumed."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * NIOSH Lifting (Revised)
 * ════════════════════════════════════════════════════════════════════════════ */

const NIOSH_LIFTING_SCHEMA: PremiumCalculatorSchema = {
  id: "niosh-lifting-calculator",
  legacyPaidSlug: "niosh-lifting-calculator",
  name: "NIOSH Lifting Calculator", name_i18n: {"en":"NIOSH Lifting Calculator","tr":"NIOSH Kald\u0131rma Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "The NIOSH Revised Lifting Equation (1991) requires computing six multipliers (HM, VM, DM, FM, AM, CM) to derive the Recommended Weight Limit (RWL) and Lifting Index (LI). Manual calculation is tedious and error-prone.", painStatement_i18n: {"en":"The NIOSH Revised Lifting Equation (1991) requires computing six multipliers (HM, VM, DM, FM, AM, CM) to derive the Recommended Weight Limit (RWL) and Lifting Index (LI). Manual calculation is tedious and error-prone.","tr":"The NIOSH Revised Lifting Equation (1991) requires computing six multipliers (HM, VM, DM, FM, AM, CM) to derive the Recommended Weight Limit (RWL) and Lifting Index (LI). Manual calculation is tedious and error-prone."},
  inputs: [
    { id: "yukAgirligi_L", label: "Load weight L", label_i18n: {"en":"Load weight L","tr":"Y\u00fck a\u011f\u0131rl\u0131\u011f\u0131 L"}, type: "number", unit: "kg", required: true, smartDefault: 15, validation: { min: 0.1 }, helper: "Weight of the object being lifted.", helper_i18n: {"en":"Weight of the object being lifted.","tr":"Kald\u0131r\u0131lan nesnenin a\u011f\u0131rl\u0131\u011f\u0131."}, expertMeaning: "L in LI = L / RWL", expertMeaning_i18n: {"en":"L in LI = L / RWL","tr":"L in LI = L / RWL"} },
    { id: "yatayMesafe_H", label: "Horizontal distance H", label_i18n: {"en":"Horizontal distance H","tr":"Yatay mesafe H"}, type: "number", unit: "cm", required: true, smartDefault: 40, validation: { min: 0 }, helper: "Horizontal distance from hands to spine midpoint.", helper_i18n: {"en":"Horizontal distance from hands to spine midpoint.","tr":"Ellerden omurga orta noktas\u0131na yatay mesafe."}, expertMeaning: "H for HM = 25/H (if H > 25 cm), else 1.0", expertMeaning_i18n: {"en":"H for HM = 25/H (if H > 25 cm), else 1.0","tr":"H for HM = 25/H (if H > 25 cm), else 1.0"} },
    { id: "dikeyBaslangic_V", label: "Vertical start height V", label_i18n: {"en":"Vertical start height V","tr":"Dikey ba\u015flang\u0131\u00e7 y\u00fcksekli\u011fi V"}, type: "number", unit: "cm", required: true, smartDefault: 75, validation: { min: 0 }, helper: "Vertical height of hands at lift start from floor.", helper_i18n: {"en":"Vertical height of hands at lift start from floor.","tr":"Kald\u0131rma ba\u015flang\u0131c\u0131nda ellerin yerden y\u00fcksekli\u011fi."}, expertMeaning: "V for VM = 1 - 0.003\u00b7|V-75|", expertMeaning_i18n: {"en":"V for VM = 1 - 0.003\u00b7|V-75|","tr":"V for VM = 1 - 0.003\u00b7|V-75|"} },
    { id: "dikeyBitis_D", label: "Vertical end height", label_i18n: {"en":"Vertical end height","tr":"Dikey biti\u015f y\u00fcksekli\u011fi"}, type: "number", unit: "cm", required: true, smartDefault: 0, validation: { min: 0 }, helper: "Vertical height at end of lift (0 = floor).", helper_i18n: {"en":"Vertical height at end of lift (0 = floor).","tr":"Kald\u0131rma sonunda y\u00fckseklik (0 = zemin)."}, expertMeaning: "D_v for DM = 0.82 + 4.5/D", expertMeaning_i18n: {"en":"D_v for DM = 0.82 + 4.5/D","tr":"D_v for DM = 0.82 + 4.5/D"} },
    { id: "tasimaMesafesi", label: "Travel distance", label_i18n: {"en":"Travel distance","tr":"Ta\u015f\u0131ma mesafesi"}, type: "number", unit: "cm", required: false, smartDefault: 25, validation: { min: 0 }, helper: "Vertical travel distance of the lift.", helper_i18n: {"en":"Vertical travel distance of the lift.","tr":"Kald\u0131rman\u0131n dikey seyahat mesafesi."}, expertMeaning: "D_vert for DM calculation", expertMeaning_i18n: {"en":"D_vert for DM calculation","tr":"D_vert for DM calculation"} },
    { id: "frekans_F", label: "Lifting frequency F", label_i18n: {"en":"Lifting frequency F","tr":"Kald\u0131rma frekans\u0131 F"}, type: "number", unit: "lifts/min", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "Average number of lifts per minute.", helper_i18n: {"en":"Average number of lifts per minute.","tr":"Dakikadaki ortalama kald\u0131rma say\u0131s\u0131."}, expertMeaning: "F for FM multiplier", expertMeaning_i18n: {"en":"F for FM multiplier","tr":"F for FM multiplier"} },
    { id: "sureDakika", label: "Duration", label_i18n: {"en":"Duration","tr":"S\u00fcre"}, type: "number", unit: "min", required: false, smartDefault: 60, validation: { min: 1 }, helper: "Total duration of lifting task in minutes.", helper_i18n: {"en":"Total duration of lifting task in minutes.","tr":"Kald\u0131rma g\u00f6revinin toplam s\u00fcresi (dakika)."}, expertMeaning: "Duration category (\u226460, 60-480, >480 min)", expertMeaning_i18n: {"en":"Duration category (\u226460, 60-480, >480 min)","tr":"Duration category (\u226460, 60-480, >480 min)"} },
    { id: "kavramaKalitesi", label: "Grip/coupling quality", label_i18n: {"en":"Grip/coupling quality","tr":"Kavrama kalitesi"}, type: "select", unit: "", required: true, smartDefault: "orta", options: [
      { value: "iyi", label: "Good (handles cutouts)" },
      { value: "orta", label: "Fair (fingers 90\u00b0)" },
      { value: "kotu", label: "Poor (fingers < 90\u00b0)" },
    ], helper: "Coupling quality between hands and the load.", helper_i18n: {"en":"Coupling quality between hands and the load.","tr":"Eller ile y\u00fck aras\u0131ndaki kavrama kalitesi."}, expertMeaning: "CM = 1.00 (good), 0.95 (fair), 0.90 (poor)", expertMeaning_i18n: {"en":"CM = 1.00 (good), 0.95 (fair), 0.90 (poor)","tr":"CM = 1.00 (good), 0.95 (fair), 0.90 (poor)"} },
    { id: "bedenBolgesi", label: "Body region", label_i18n: {"en":"Body region","tr":"Beden b\u00f6lgesi"}, type: "select", unit: "", required: true, smartDefault: "bel", options: [
      { value: "bel", label: "Waist level" },
      { value: "omuz", label: "Shoulder level" },
      { value: "diz_alti", label: "Below knee" },
    ], helper: "Region for asymmetric multiplier (AM) adjustment.", helper_i18n: {"en":"Region for asymmetric multiplier (AM) adjustment.","tr":"Asimetrik \u00e7arpan (AM) ayar\u0131 i\u00e7in b\u00f6lge."}, expertMeaning: "Determines twisting angle assumption", expertMeaning_i18n: {"en":"Determines twisting angle assumption","tr":"Determines twisting angle assumption"} },
  ],
  outputs: [
    { id: "recommendedWeightLimit_RWL", label: "Recommended Weight Limit (RWL)", label_i18n: {"en":"Recommended Weight Limit (RWL)","tr":"\u00d6nerilen A\u011f\u0131rl\u0131k Limiti (RWL)"}, unit: "kg", format: "number" },
    { id: "liftingIndex_LI", label: "Lifting Index (LI = L/RWL)", label_i18n: {"en":"Lifting Index (LI = L/RWL)","tr":"Kald\u0131rma \u0130ndeksi (LI = L/RWL)"}, unit: "", format: "number" },
    { id: "HM", label: "Horizontal multiplier HM", label_i18n: {"en":"Horizontal multiplier HM","tr":"Yatay \u00e7arpan HM"}, unit: "", format: "number" },
    { id: "VM", label: "Vertical multiplier VM", label_i18n: {"en":"Vertical multiplier VM","tr":"Dikey \u00e7arpan VM"}, unit: "", format: "number" },
    { id: "DM", label: "Distance multiplier DM", label_i18n: {"en":"Distance multiplier DM","tr":"Mesafe \u00e7arpan\u0131 DM"}, unit: "", format: "number" },
    { id: "FM", label: "Frequency multiplier FM", label_i18n: {"en":"Frequency multiplier FM","tr":"Frekans \u00e7arpan\u0131 FM"}, unit: "", format: "number" },
    { id: "AM", label: "Asymmetric multiplier AM", label_i18n: {"en":"Asymmetric multiplier AM","tr":"Asimetrik \u00e7arpan AM"}, unit: "", format: "number" },
    { id: "CM", label: "Coupling multiplier CM", label_i18n: {"en":"Coupling multiplier CM","tr":"Kavrama \u00e7arpan\u0131 CM"}, unit: "", format: "number" },
    { id: "riskDurumu", label: "Risk status", label_i18n: {"en":"Risk status","tr":"Risk durumu"}, unit: "", format: "number" },
    { id: "riskSeviyesi", label: "Risk level", label_i18n: {"en":"Risk level","tr":"Risk seviyesi"}, unit: "", format: "number" },
    { id: "aciklama", label: "Explanation", label_i18n: {"en":"Explanation","tr":"A\u00e7\u0131klama"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "liftingIndex_LI", warning: 1, critical: 3, direction: "higher_is_bad", warningMessage: "LI > 1.0 \u2014 task may pose risk for some workers.", warningMessage_i18n: {"en":"LI > 1.0 \u2014 task may pose risk for some workers.","tr":"LI > 1.0 \u2014 task may pose risk for some workers."}, criticalMessage: "LI > 3.0 \u2014 significant risk for most workers, redesign recommended.", criticalMessage_i18n: {"en":"LI > 3.0 \u2014 significant risk for most workers, redesign recommended.","tr":"LI > 3.0 \u2014 significant risk for most workers, redesign recommended."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.niosh_lifting", inputMap: { loadWeight_kg: "yukAgirligi_L", horizontal_cm: "yatayMesafe_H", verticalStart_cm: "dikeyBaslangic_V", verticalEnd_cm: "dikeyBitis_D", frequency_liftsPerMin: "frekans_F", couplingQuality: "kavramaKalitesi", bodyRegion: "bedenBolgesi", durationMin: "sureDakika" }, outputId: "recommendedWeightLimit_RWL" }],
  reportTemplate: { title: "NIOSH Lifting Analysis Report", title_i18n: {"en":"NIOSH Lifting Analysis Report","tr":"NIOSH Kald\u0131rma Analiz Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["RWL = LC \u00d7 HM \u00d7 VM \u00d7 DM \u00d7 FM \u00d7 AM \u00d7 CM (LC = 23 kg, NIOSH 1991).", "LI = Load Weight / RWL. LI > 1.0 = some risk; LI > 3.0 = high risk.", "Assumes two-handed symmetric lifting; single-hand or team lifting not modeled."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * REBA (Rapid Entire Body Assessment)
 * ════════════════════════════════════════════════════════════════════════════ */

const REBA_ASSESSMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "reba-rapid-body-assessment-calculator",
  legacyPaidSlug: "reba-rapid-body-assessment-calculator",
  name: "REBA Rapid Body Assessment Calculator", name_i18n: {"en":"REBA Rapid Body Assessment Calculator","tr":"REBA H\u0131zl\u0131 V\u00fccut De\u011ferlendirme Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "REBA requires scoring Group A (trunk/neck/legs) and Group B (upper arm/lower arm/wrist) with load and coupling modifiers. Manual scoring tables are prone to lookup errors.", painStatement_i18n: {"en":"REBA requires scoring Group A (trunk/neck/legs) and Group B (upper arm/lower arm/wrist) with load and coupling modifiers. Manual scoring tables are prone to lookup errors.","tr":"REBA requires scoring Group A (trunk/neck/legs) and Group B (upper arm/lower arm/wrist) with load and coupling modifiers. Manual scoring tables are prone to lookup errors."},
  inputs: [
    { id: "govdeSkoru", label: "Trunk score (1-5)", label_i18n: {"en":"Trunk score (1-5)","tr":"G\u00f6vde skoru (1-5)"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "Trunk posture score from REBA Table A.", helper_i18n: {"en":"Trunk posture score from REBA Table A.","tr":"REBA Tablo A'dan g\u00f6vde duru\u015f skoru."}, expertMeaning: "Trunk score (Group A)", expertMeaning_i18n: {"en":"Trunk score (Group A)","tr":"Trunk score (Group A)"} },
    { id: "boyunSkoru", label: "Neck score (1-3)", label_i18n: {"en":"Neck score (1-3)","tr":"Boyun skoru (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Neck posture score from REBA Table A.", helper_i18n: {"en":"Neck posture score from REBA Table A.","tr":"REBA Tablo A'dan boyun duru\u015f skoru."}, expertMeaning: "Neck score (Group A)", expertMeaning_i18n: {"en":"Neck score (Group A)","tr":"Neck score (Group A)"} },
    { id: "bacakSkoru", label: "Legs score (1-4)", label_i18n: {"en":"Legs score (1-4)","tr":"Bacak skoru (1-4)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 4 }, helper: "Legs posture score from REBA Table A.", helper_i18n: {"en":"Legs posture score from REBA Table A.","tr":"REBA Tablo A'dan bacak duru\u015f skoru."}, expertMeaning: "Legs score (Group A)", expertMeaning_i18n: {"en":"Legs score (Group A)","tr":"Legs score (Group A)"} },
    { id: "yuk_kg", label: "Load weight", label_i18n: {"en":"Load weight","tr":"Y\u00fck a\u011f\u0131rl\u0131\u011f\u0131"}, type: "number", unit: "kg", required: false, smartDefault: 10, validation: { min: 0 }, helper: "Weight being handled (0 if no load).", helper_i18n: {"en":"Weight being handled (0 if no load).","tr":"Ta\u015f\u0131nan a\u011f\u0131rl\u0131k (y\u00fck yoksa 0)."}, expertMeaning: "Determines load/force score for Group A", expertMeaning_i18n: {"en":"Determines load/force score for Group A","tr":"Determines load/force score for Group A"} },
    { id: "yukTutmaTipi", label: "Load holding type", label_i18n: {"en":"Load holding type","tr":"Y\u00fck tutma tipi"}, type: "select", unit: "", required: false, smartDefault: "iki_el", options: [
      { value: "tek_el", label: "One hand" },
      { value: "iki_el", label: "Two hands" },
      { value: "itme_cekme", label: "Push/pull" },
    ], helper: "How the load is held/controlled.", helper_i18n: {"en":"How the load is held/controlled.","tr":"Y\u00fck\u00fcn nas\u0131l tutuldu\u011fu/kontrol edildi\u011fi."}, expertMeaning: "Affects load score modifier", expertMeaning_i18n: {"en":"Affects load score modifier","tr":"Affects load score modifier"} },
    { id: "kolUstSkoru", label: "Upper arm score (1-6)", label_i18n: {"en":"Upper arm score (1-6)","tr":"\u00dcst kol skoru (1-6)"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 6 }, helper: "Upper arm posture score from REBA Table B.", helper_i18n: {"en":"Upper arm posture score from REBA Table B.","tr":"REBA Tablo B'den \u00fcst kol duru\u015f skoru."}, expertMeaning: "Upper arm score (Group B)", expertMeaning_i18n: {"en":"Upper arm score (Group B)","tr":"Upper arm score (Group B)"} },
    { id: "kolAltSkoru", label: "Lower arm score (1-3)", label_i18n: {"en":"Lower arm score (1-3)","tr":"Alt kol skoru (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Lower arm posture score from REBA Table B.", helper_i18n: {"en":"Lower arm posture score from REBA Table B.","tr":"REBA Tablo B'den alt kol duru\u015f skoru."}, expertMeaning: "Lower arm score (Group B)", expertMeaning_i18n: {"en":"Lower arm score (Group B)","tr":"Lower arm score (Group B)"} },
    { id: "elBilegiSkoru", label: "Wrist score (1-3)", label_i18n: {"en":"Wrist score (1-3)","tr":"El bile\u011fi skoru (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Wrist posture score from REBA Table B.", helper_i18n: {"en":"Wrist posture score from REBA Table B.","tr":"REBA Tablo B'den el bile\u011fi duru\u015f skoru."}, expertMeaning: "Wrist score (Group B)", expertMeaning_i18n: {"en":"Wrist score (Group B)","tr":"Wrist score (Group B)"} },
    { id: "aktiviteTipi", label: "Activity type", label_i18n: {"en":"Activity type","tr":"Aktivite tipi"}, type: "select", unit: "", required: false, smartDefault: "statik", options: [
      { value: "statik", label: "Static (held >1 min)" },
      { value: "tekrarlayan", label: "Repetitive (>4/min)" },
      { value: "anlik", label: "Sudden/rapid motion" },
      { value: "sabit", label: "Fixed posture/prolonged" },
    ], helper: "Activity type adds an additional score to final REBA.", helper_i18n: {"en":"Activity type adds an additional score to final REBA.","tr":"Aktivite tipi nihai REBA skoruna ek puan ekler."}, expertMeaning: "Activity score (+1 to +3)", expertMeaning_i18n: {"en":"Activity score (+1 to +3)","tr":"Activity score (+1 to +3)"} },
  ],
  outputs: [
    { id: "GrupA_Skoru", label: "Group A score (posture)", label_i18n: {"en":"Group A score (posture)","tr":"Grup A skoru (duru\u015f)"}, unit: "", format: "number" },
    { id: "GrupA_YukPuani", label: "Group A load score", label_i18n: {"en":"Group A load score","tr":"Grup A y\u00fck puan\u0131"}, unit: "", format: "number" },
    { id: "GrupA_Toplam", label: "Group A total (A+load)", label_i18n: {"en":"Group A total (A+load)","tr":"Grup A toplam (A+y\u00fck)"}, unit: "", format: "number" },
    { id: "GrupB_Skoru", label: "Group B score (arm/wrist)", label_i18n: {"en":"Group B score (arm/wrist)","tr":"Grup B skoru (kol/bilek)"}, unit: "", format: "number" },
    { id: "GrupB_KavramaPuani", label: "Group B coupling score", label_i18n: {"en":"Group B coupling score","tr":"Grup B kavrama puan\u0131"}, unit: "", format: "number" },
    { id: "GrupB_Toplam", label: "Group B total (B+coupling)", label_i18n: {"en":"Group B total (B+coupling)","tr":"Grup B toplam (B+kavrama)"}, unit: "", format: "number" },
    { id: "REBA_Skoru", label: "REBA final score", label_i18n: {"en":"REBA final score","tr":"REBA nihai skoru"}, unit: "", format: "number" },
    { id: "REBA_Seviyesi", label: "REBA action level", label_i18n: {"en":"REBA action level","tr":"REBA aksiyon seviyesi"}, unit: "", format: "number" },
    { id: "riskDurumu", label: "Risk status", label_i18n: {"en":"Risk status","tr":"Risk durumu"}, unit: "", format: "number" },
    { id: "aksiyonSeviyesi", label: "Action level recommendation", label_i18n: {"en":"Action level recommendation","tr":"Aksiyon seviyesi \u00f6nerisi"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "REBA_Skoru", warning: 4, critical: 8, direction: "higher_is_bad", warningMessage: "REBA score 4-7 \u2014 medium risk, further investigation needed.", warningMessage_i18n: {"en":"REBA score 4-7 \u2014 medium risk, further investigation needed.","tr":"REBA score 4-7 \u2014 medium risk, further investigation needed."}, criticalMessage: "REBA score 8+ \u2014 high risk, immediate ergonomic intervention needed.", criticalMessage_i18n: {"en":"REBA score 8+ \u2014 high risk, immediate ergonomic intervention needed.","tr":"REBA score 8+ \u2014 high risk, immediate ergonomic intervention needed."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.reba_assessment", inputMap: { trunkScore: "govdeSkoru", neckScore: "boyunSkoru", legsScore: "bacakSkoru", loadKg: "yuk_kg", upperArmScore: "kolUstSkoru", lowerArmScore: "kolAltSkoru", wristScore: "elBilegiSkoru", activityType: "aktiviteTipi" }, outputId: "REBA_Skoru" }],
  reportTemplate: { title: "REBA Ergonomic Assessment Report", title_i18n: {"en":"REBA Ergonomic Assessment Report","tr":"REBA Ergonomic Assessment Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["REBA scoring per Hignett & McAtamney (2000).", "Group A: Trunk+Neck+Legs posture scores; Group B: Upper arm+Lower arm+Wrist.", "Action levels: 0=negligible, 1=low, 2=medium, 3=high, 4=very high risk."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * RCM (Reliability-Centered Maintenance) Decision
 * ════════════════════════════════════════════════════════════════════════════ */

const RCM_DECISION_SCHEMA: PremiumCalculatorSchema = {
  id: "rcm-decision-calculator",
  legacyPaidSlug: "rcm-decision-calculator",
  name: "RCM Decision Calculator", name_i18n: {"en":"RCM Decision Calculator","tr":"RCM (G\u00fcvenilirlik Merkezli Bak\u0131m) Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "cost",
  painStatement: "Choosing between reactive, preventive, predictive (CBM) and proactive maintenance strategies requires cost comparison of each approach. Manual analysis often underestimates hidden costs of unplanned downtime.", painStatement_i18n: {"en":"Choosing between reactive, preventive, predictive (CBM) and proactive maintenance strategies requires cost comparison of each approach. Manual analysis often underestimates hidden costs of unplanned downtime.","tr":"Choosing between reactive, preventive, predictive (CBM) and proactive maintenance strategies requires cost comparison of each approach. Manual analysis often underestimates hidden costs of unplanned downtime."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency","tr":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency.","tr":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code.","tr":"ISO code."} },
    { id: "varlikSaysi", label: "Number of assets", label_i18n: {"en":"Number of assets","tr":"Varl\u0131k say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "Total number of assets under analysis.", helper_i18n: {"en":"Total number of assets under analysis.","tr":"Analizdeki toplam varl\u0131k say\u0131s\u0131."}, expertMeaning: "n for annual cost multiplication", expertMeaning_i18n: {"en":"n for annual cost multiplication","tr":"n for annual cost multiplication"} },
    { id: "MTBF_gun", label: "Mean Time Between Failures (MTBF)", label_i18n: {"en":"Mean Time Between Failures (MTBF)","tr":"Ortalama Ar\u0131za S\u00fcresi (MTBF)"}, type: "number", unit: "days", required: true, smartDefault: 90, validation: { min: 1 }, helper: "Average time between asset failures.", helper_i18n: {"en":"Average time between asset failures.","tr":"Varl\u0131k ar\u0131zalar\u0131 aras\u0131ndaki ortalama s\u00fcre."}, expertMeaning: "MTBF for unplanned frequency = 365/MTBF per year", expertMeaning_i18n: {"en":"MTBF for unplanned frequency = 365/MTBF per year","tr":"MTBF for unplanned frequency = 365/MTBF per year"} },
    { id: "MTTR_saat", label: "Mean Time To Repair (MTTR)", label_i18n: {"en":"Mean Time To Repair (MTTR)","tr":"Ortalama Onar\u0131m S\u00fcresi (MTTR)"}, type: "number", unit: "hours", required: false, smartDefault: 8, validation: { min: 0.1 }, helper: "Average repair time per failure.", helper_i18n: {"en":"Average repair time per failure.","tr":"Ar\u0131za ba\u015f\u0131na ortalama onar\u0131m s\u00fcresi."}, expertMeaning: "MTTR for downtime cost estimation", expertMeaning_i18n: {"en":"MTTR for downtime cost estimation","tr":"MTTR for downtime cost estimation"} },
    { id: "onarimMaliyeti", label: "Reactive repair cost per event", label_i18n: {"en":"Reactive repair cost per event","tr":"Reaktif onar\u0131m maliyeti (olay ba\u015f\u0131na)"}, type: "number", unit: "currency", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "Average cost of an unplanned repair event.", helper_i18n: {"en":"Average cost of an unplanned repair event.","tr":"Plans\u0131z onar\u0131m olay\u0131 ba\u015f\u0131na ortalama maliyet."}, expertMeaning: "C_repair for reactive cost = freq \u00d7 C_repair", expertMeaning_i18n: {"en":"C_repair for reactive cost = freq \u00d7 C_repair","tr":"C_repair for reactive cost = freq \u00d7 C_repair"} },
    { id: "koruyucuBakimMaliyeti", label: "Preventive maintenance cost per event", label_i18n: {"en":"Preventive maintenance cost per event","tr":"Koruyucu bak\u0131m maliyeti (olay ba\u015f\u0131na)"}, type: "number", unit: "currency", required: true, smartDefault: 1500, validation: { min: 0 }, helper: "Cost of one scheduled preventive maintenance.", helper_i18n: {"en":"Cost of one scheduled preventive maintenance.","tr":"Planl\u0131 koruyucu bak\u0131m olay\u0131 ba\u015f\u0131na maliyet."}, expertMeaning: "C_pm for preventive cost = freq \u00d7 C_pm", expertMeaning_i18n: {"en":"C_pm for preventive cost = freq \u00d7 C_pm","tr":"C_pm for preventive cost = freq \u00d7 C_pm"} },
    { id: "durumsalBakimMaliyeti", label: "Condition-based (CBM) cost per event", label_i18n: {"en":"Condition-based (CBM) cost per event","tr":"Durumsal bak\u0131m (CBM) maliyeti (olay ba\u015f\u0131na)"}, type: "number", unit: "currency", required: false, smartDefault: 800, validation: { min: 0 }, helper: "Cost of one condition-based monitoring inspection.", helper_i18n: {"en":"Cost of one condition-based monitoring inspection.","tr":"Durum bazl\u0131 izleme denetimi ba\u015f\u0131na maliyet."}, expertMeaning: "C_cbm for predictive cost = freq \u00d7 C_cbm", expertMeaning_i18n: {"en":"C_cbm for predictive cost = freq \u00d7 C_cbm","tr":"C_cbm for predictive cost = freq \u00d7 C_cbm"} },
    { id: "plansizDurusMaliyeti", label: "Cost per unplanned downtime hour", label_i18n: {"en":"Cost per unplanned downtime hour","tr":"Plans\u0131z duru\u015f saati ba\u015f\u0131na maliyet"}, type: "number", unit: "currency/hr", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "Lost production cost per hour of unplanned downtime.", helper_i18n: {"en":"Lost production cost per hour of unplanned downtime.","tr":"Plans\u0131z duru\u015f saati ba\u015f\u0131na kay\u0131p \u00fcretim maliyeti."}, expertMeaning: "C_dt for downtime cost = MTTR \u00d7 C_dt \u00d7 freq", expertMeaning_i18n: {"en":"C_dt for downtime cost = MTTR \u00d7 C_dt \u00d7 freq","tr":"C_dt for downtime cost = MTTR \u00d7 C_dt \u00d7 freq"} },
    { id: "koruyucuBakimSikligi", label: "Preventive maintenance interval", label_i18n: {"en":"Preventive maintenance interval","tr":"Koruyucu bak\u0131m aral\u0131\u011f\u0131"}, type: "number", unit: "days", required: false, smartDefault: 30, validation: { min: 1 }, helper: "Frequency of preventive maintenance in days.", helper_i18n: {"en":"Frequency of preventive maintenance in days.","tr":"Koruyucu bak\u0131m s\u0131kl\u0131\u011f\u0131 (g\u00fcn)."}, expertMeaning: "Freq_pm = 365/interval per year", expertMeaning_i18n: {"en":"Freq_pm = 365/interval per year","tr":"Freq_pm = 365/interval per year"} },
    { id: "durumsalBakimSikligi", label: "CBM inspection interval", label_i18n: {"en":"CBM inspection interval","tr":"CBM denetim aral\u0131\u011f\u0131"}, type: "number", unit: "days", required: false, smartDefault: 15, validation: { min: 1 }, helper: "Frequency of CBM inspections in days.", helper_i18n: {"en":"Frequency of CBM inspections in days.","tr":"CBM denetim s\u0131kl\u0131\u011f\u0131 (g\u00fcn)."}, expertMeaning: "Freq_cbm = 365/interval per year", expertMeaning_i18n: {"en":"Freq_cbm = 365/interval per year","tr":"Freq_cbm = 365/interval per year"} },
    { id: "kritiklik", label: "Asset criticality", label_i18n: {"en":"Asset criticality","tr":"Varl\u0131k kritikli\u011fi"}, type: "select", unit: "", required: true, smartDefault: "onemli", options: [
      { value: "kritik", label: "Critical (redundant MTBF needed)" },
      { value: "onemli", label: "Important (CBM preferred)" },
      { value: "standart", label: "Standard (PM sufficient)" },
    ], helper: "Criticality level determines recommended strategy.", helper_i18n: {"en":"Criticality level determines recommended strategy.","tr":"Kritiklik seviyesi \u00f6nerilen stratejiyi belirler."}, expertMeaning: "Affects decision logic for strategy selection", expertMeaning_i18n: {"en":"Affects decision logic for strategy selection","tr":"Affects decision logic for strategy selection"} },
  ],
  outputs: [
    { id: "plansizDurusSikligi", label: "Unplanned failure frequency (per year)", label_i18n: {"en":"Unplanned failure frequency (per year)","tr":"Plans\u0131z ar\u0131za s\u0131kl\u0131\u011f\u0131 (y\u0131ll\u0131k)"}, unit: "/year", format: "number" },
    { id: "plansizDurusMaliyeti_yil", label: "Annual reactive maintenance cost", label_i18n: {"en":"Annual reactive maintenance cost","tr":"Y\u0131ll\u0131k reaktif bak\u0131m maliyeti"}, unit: "currency", format: "currency" },
    { id: "koruyucuBakimMaliyeti_yil", label: "Annual preventive maintenance cost", label_i18n: {"en":"Annual preventive maintenance cost","tr":"Y\u0131ll\u0131k koruyucu bak\u0131m maliyeti"}, unit: "currency", format: "currency" },
    { id: "durumsalBakimMaliyeti_yil", label: "Annual CBM/predictive cost", label_i18n: {"en":"Annual CBM/predictive cost","tr":"Y\u0131ll\u0131k CBM/tahmini bak\u0131m maliyeti"}, unit: "currency", format: "currency" },
    { id: "toplamBakimMaliyeti", label: "Total annual maintenance cost", label_i18n: {"en":"Total annual maintenance cost","tr":"Toplam y\u0131ll\u0131k bak\u0131m maliyeti"}, unit: "currency", format: "currency" },
    { id: "TBM_tasarruf", label: "PM vs Reactive savings", label_i18n: {"en":"PM vs Reactive savings","tr":"\u00d6nleyici vs Reaktif tasarruf"}, unit: "currency", format: "currency" },
    { id: "CBM_tasarruf", label: "CBM vs Reactive savings", label_i18n: {"en":"CBM vs Reactive savings","tr":"CBM vs Reaktif tasarruf"}, unit: "currency", format: "currency" },
    { id: "oneri_strateji", label: "Recommended strategy", label_i18n: {"en":"Recommended strategy","tr":"\u00d6nerilen strateji"}, unit: "", format: "number" },
    { id: "yatirimGetirisi", label: "ROI of proactive vs reactive", label_i18n: {"en":"ROI of proactive vs reactive","tr":"Proaktif vs reaktif ROI"}, unit: "%", format: "percentage" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.rcm_decision", inputMap: { assetCount: "varlikSaysi", MTBF_days: "MTBF_gun", MTTR_hours: "MTTR_saat", repairCost: "onarimMaliyeti", pmCost: "koruyucuBakimMaliyeti", cbmCost: "durumsalBakimMaliyeti", downtimeCost: "plansizDurusMaliyeti" }, outputId: "toplamBakimMaliyeti" }],
  reportTemplate: { title: "RCM Decision Analysis Report", title_i18n: {"en":"RCM Decision Analysis Report","tr":"RCM Karar Analiz Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Total Maintenance = Planned (PM+CBM) + Unplanned (reactive) costs.", "PM savings = Reactive cost - PM cost; CBM savings = Reactive - CBM.", "Criticality level influences strategy recommendation (CBM for critical, PM for standard)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Pareto / RCA (Root Cause Analysis)
 * ════════════════════════════════════════════════════════════════════════════ */

const PARETO_RCA_SCHEMA: PremiumCalculatorSchema = {
  id: "pareto-root-cause-calculator",
  legacyPaidSlug: "pareto-root-cause-calculator",
  name: "Pareto / Root Cause Analysis Calculator", name_i18n: {"en":"Pareto / Root Cause Analysis Calculator","tr":"Pareto / K\u00f6k Neden Analizi Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Pareto analysis (80/20 rule) requires sorting cost categories, computing cumulative percentages and identifying the vital few. Manual sorting and cumulation is tedious when the 80% boundary shifts.", painStatement_i18n: {"en":"Pareto analysis (80/20 rule) requires sorting cost categories, computing cumulative percentages and identifying the vital few. Manual sorting and cumulation is tedious when the 80% boundary shifts.","tr":"Pareto analysis (80/20 rule) requires sorting cost categories, computing cumulative percentages and identifying the vital few. Manual sorting and cumulation is tedious when the 80% boundary shifts."},
  inputs: [
    { id: "kategoriSayisi", label: "Number of categories", label_i18n: {"en":"Number of categories","tr":"Kategori say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 7, validation: { min: 2, max: 30 }, helper: "Total number of cost or defect categories.", helper_i18n: {"en":"Total number of cost or defect categories.","tr":"Toplam maliyet veya kusur kategorisi say\u0131s\u0131."}, expertMeaning: "n for Pareto sorting", expertMeaning_i18n: {"en":"n for Pareto sorting","tr":"n for Pareto sorting"} },
    { id: "maliyetler_toplam", label: "Total loss/cost sum", label_i18n: {"en":"Total loss/cost sum","tr":"Toplam kay\u0131p/maliyet toplam\u0131"}, type: "number", unit: "currency", required: true, smartDefault: 54000, validation: { min: 0 }, helper: "Total of all cost category values.", helper_i18n: {"en":"Total of all cost category values.","tr":"T\u00fcm maliyet kategorilerinin toplam\u0131."}, expertMeaning: "\u03a3 cost for Pareto percentage = item/\u03a3", expertMeaning_i18n: {"en":"\u03a3 cost for Pareto percentage = item/\u03a3","tr":"\u03a3 cost for Pareto percentage = item/\u03a3"} },
    { id: "kategori_maliyet_list", label: "Category cost list (comma-separated)", label_i18n: {"en":"Category cost list (comma-separated)","tr":"Kategori maliyet listesi (virg\u00fclle ayr\u0131lm\u0131\u015f)"}, type: "number", unit: "", required: true, smartDefault: "20000,15000,8000,5000,3000,2000,1000", helper: "Enter costs separated by commas, ordered descending if known.", helper_i18n: {"en":"Enter costs separated by commas, ordered descending if known.","tr":"Maliyetleri virg\u00fclle ay\u0131rarak girin, biliniyorsa azalan s\u0131rada."}, expertMeaning: "Array of cost values for Pareto sort", expertMeaning_i18n: {"en":"Array of cost values for Pareto sort","tr":"Array of cost values for Pareto sort"} },
    { id: "kategori_isim_list", label: "Category names (comma-separated)", label_i18n: {"en":"Category names (comma-separated)","tr":"Kategori adlar\u0131 (virg\u00fclle ayr\u0131lm\u0131\u015f)"}, type: "number", unit: "", required: false, smartDefault: "Defects,Rework,Downtime,Material waste,Overprocessing,Inventory,Transport", helper: "Optional category names matching cost order.", helper_i18n: {"en":"Optional category names matching cost order.","tr":"Maliyet s\u0131ras\u0131na uygun kategori adlar\u0131 (iste\u011fe ba\u011fl\u0131)."}, expertMeaning: "Labels for Pareto chart", expertMeaning_i18n: {"en":"Labels for Pareto chart","tr":"Labels for Pareto chart"} },
    { id: "birikimliYuzde", label: "Cumulative % for vital few", label_i18n: {"en":"Cumulative % for vital few","tr":"Hayati az\u0131nl\u0131k i\u00e7in k\u00fcm\u00fclatif %"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 100 }, helper: "Cumulative percentage threshold (default 80%).", helper_i18n: {"en":"Cumulative percentage threshold (default 80%).","tr":"K\u00fcm\u00fclatif y\u00fczde e\u015fi\u011fi (varsay\u0131lan %80)."}, expertMeaning: "Pareto 80/20 threshold", expertMeaning_i18n: {"en":"Pareto 80/20 threshold","tr":"Pareto 80/20 threshold"} },
    { id: "oneMaliyet", label: "Estimated cost per item", label_i18n: {"en":"Estimated cost per item","tr":"Birim ba\u015f\u0131na tahmini maliyet"}, type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Average cost per loss item (for recovery estimation).", helper_i18n: {"en":"Average cost per loss item (for recovery estimation).","tr":"Kay\u0131p kalemi ba\u015f\u0131na ortalama maliyet (kurtarma tahmini i\u00e7in)."}, expertMeaning: "For recoverable amount = count \u00d7 cost per unit", expertMeaning_i18n: {"en":"For recoverable amount = count \u00d7 cost per unit","tr":"For recoverable amount = count \u00d7 cost per unit"} },
    { id: "yillikFrekans", label: "Annual frequency of loss events", label_i18n: {"en":"Annual frequency of loss events","tr":"Y\u0131ll\u0131k kay\u0131p olay s\u0131kl\u0131\u011f\u0131"}, type: "number", unit: "/year", required: false, smartDefault: 12, validation: { min: 1 }, helper: "Number of times the loss pattern occurs per year.", helper_i18n: {"en":"Number of times the loss pattern occurs per year.","tr":"Kay\u0131p deseninin y\u0131lda ka\u00e7 kez olu\u015ftu\u011fu."}, expertMeaning: "For annual extrapolation", expertMeaning_i18n: {"en":"For annual extrapolation","tr":"For annual extrapolation"} },
  ],
  outputs: [
    { id: "itemSayisi", label: "Number of items", label_i18n: {"en":"Number of items","tr":"\u00d6\u011fe say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "kategoriDagilimi", label: "Category distribution", label_i18n: {"en":"Category distribution","tr":"Kategori da\u011f\u0131l\u0131m\u0131"}, unit: "", format: "number" },
    { id: "kumulatifYuzde_list", label: "Cumulative percentage list", label_i18n: {"en":"Cumulative percentage list","tr":"K\u00fcm\u00fclatif y\u00fczde listesi"}, unit: "%", format: "number" },
    { id: "kumulatif_80", label: "Threshold cumulative at cutoff", label_i18n: {"en":"Threshold cumulative at cutoff","tr":"Kesme noktas\u0131nda k\u00fcm\u00fclatif e\u015fik"}, unit: "%", format: "number" },
    { id: "kritikKategoriler", label: "Vital few categories", label_i18n: {"en":"Vital few categories","tr":"Hayati az\u0131nl\u0131k kategorileri"}, unit: "", format: "number" },
    { id: "criticalCount", label: "Number of vital few items", label_i18n: {"en":"Number of vital few items","tr":"Hayati az\u0131nl\u0131k \u00f6\u011fe say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "totalLoss", label: "Total loss value", label_i18n: {"en":"Total loss value","tr":"Toplam kay\u0131p de\u011feri"}, unit: "currency", format: "currency" },
    { id: "pareto80Maliyet_included", label: "Cost captured in vital few", label_i18n: {"en":"Cost captured in vital few","tr":"Hayati az\u0131nl\u0131kta yakalanan maliyet"}, unit: "currency", format: "currency" },
    { id: "kurtarilabilirMiktar_80", label: "Recoverable amount (80% focus)", label_i18n: {"en":"Recoverable amount (80% focus)","tr":"Kurtar\u0131labilir miktar (%80 odak)"}, unit: "currency", format: "currency" },
    { id: "oneMaliyet_orani", label: "Unit cost ratio", label_i18n: {"en":"Unit cost ratio","tr":"Birim maliyet oran\u0131"}, unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.pareto_rca", inputMap: { categoryCount: "kategoriSayisi", totalSum: "maliyetler_toplam", costListText: "kategori_maliyet_list", thresholdPercent: "birikimliYuzde" }, outputId: "kumulatif_80" }],
  reportTemplate: { title: "Pareto / RCA Analysis Report", title_i18n: {"en":"Pareto / RCA Analysis Report","tr":"Pareto / K\u00f6k Neden Analiz Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Pareto 80/20 principle: \u224880% of effects come from \u224820% of causes.", "Items sorted descending; top items until cumulative \u2265 threshold = vital few.", "Recoverable amount assumes proportional improvement on vital few categories."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * VAP (Value-Added Process) Ratio Analyzer
 * ════════════════════════════════════════════════════════════════════════════ */

const VAP_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "value-added-process-analyzer",
  legacyPaidSlug: "value-added-process-analyzer",
  name: "Value-Added Process Ratio Analyzer", name_i18n: {"en":"Value-Added Process Ratio Analyzer","tr":"Katma De\u011ferli S\u00fcre\u00e7 Oran\u0131 Analiz\u00f6r\u00fc"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Lean process analysis requires decomposing total cycle time into value-added (VA), necessary non-value-added (NVA) and waste (W). Spreadsheets lack the structured decomposition and cost allocation.", painStatement_i18n: {"en":"Lean process analysis requires decomposing total cycle time into value-added (VA), necessary non-value-added (NVA) and waste (W). Spreadsheets lack the structured decomposition and cost allocation.","tr":"Lean process analysis requires decomposing total cycle time into value-added (VA), necessary non-value-added (NVA) and waste (W). Spreadsheets lack the structured decomposition and cost allocation."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency","tr":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency.","tr":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code.","tr":"ISO code."} },
    { id: "toplamCevrimSuresi_TCT", label: "Total cycle time (TCT)", label_i18n: {"en":"Total cycle time (TCT)","tr":"Toplam \u00e7evrim s\u00fcresi (TCT)"}, type: "number", unit: "min", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "Total elapsed time from start to finish of the process.", helper_i18n: {"en":"Total elapsed time from start to finish of the process.","tr":"S\u00fcrecin ba\u015flang\u0131c\u0131ndan biti\u015fine kadar ge\u00e7en toplam s\u00fcre."}, expertMeaning: "TCT for VAR = VA/TCT \u00d7 100", expertMeaning_i18n: {"en":"TCT for VAR = VA/TCT \u00d7 100","tr":"TCT for VAR = VA/TCT \u00d7 100"} },
    { id: "katmaDegerliSure_VA", label: "Value-added time (VA)", label_i18n: {"en":"Value-added time (VA)","tr":"Katma de\u011ferli s\u00fcre (VA)"}, type: "number", unit: "min", required: true, smartDefault: 15, validation: { min: 0 }, helper: "Time spent on activities that add value from the customer perspective.", helper_i18n: {"en":"Time spent on activities that add value from the customer perspective.","tr":"M\u00fc\u015fteri perspektifinden de\u011fer katan faaliyetlere harcanan s\u00fcre."}, expertMeaning: "VA for VAR_VA = VA/TCT", expertMeaning_i18n: {"en":"VA for VAR_VA = VA/TCT","tr":"VA for VAR_VA = VA/TCT"} },
    { id: "zorunluKatmaDegerliSure_NVA", label: "Necessary NVA time (NNVA)", label_i18n: {"en":"Necessary NVA time (NNVA)","tr":"Zorunlu KD d\u0131\u015f\u0131 s\u00fcre (NNVA)"}, type: "number", unit: "min", required: true, smartDefault: 35, validation: { min: 0 }, helper: "Time on required but non-value-adding activities (compliance, setup).", helper_i18n: {"en":"Time on required but non-value-adding activities (compliance, setup).","tr":"Gerekli ancak de\u011fer katmayan faaliyetlere harcanan s\u00fcre (uyum, kurulum)."}, expertMeaning: "NNVA for VAR_NVA = NNVA/TCT", expertMeaning_i18n: {"en":"NNVA for VAR_NVA = NNVA/TCT","tr":"NNVA for VAR_NVA = NNVA/TCT"} },
    { id: "kayipSure_W", label: "Waste time (W)", label_i18n: {"en":"Waste time (W)","tr":"Kay\u0131p s\u00fcre (W)"}, type: "number", unit: "min", required: true, smartDefault: 50, validation: { min: 0 }, helper: "Pure waste time (defects, waiting, overproduction, motion).", helper_i18n: {"en":"Pure waste time (defects, waiting, overproduction, motion).","tr":"Saf kay\u0131p s\u00fcre (kusur, bekleme, a\u015f\u0131r\u0131 \u00fcretim, hareket)."}, expertMeaning: "W for VAR_W = W/TCT", expertMeaning_i18n: {"en":"W for VAR_W = W/TCT","tr":"W for VAR_W = W/TCT"} },
    { id: "surecAdimiSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps","tr":"Proses ad\u0131m\u0131 say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 12, validation: { min: 1 }, helper: "Total steps in the process flow.", helper_i18n: {"en":"Total steps in the process flow.","tr":"Proses ak\u0131\u015f\u0131ndaki toplam ad\u0131m say\u0131s\u0131."}, expertMeaning: "For VA step ratio calculation", expertMeaning_i18n: {"en":"For VA step ratio calculation","tr":"For VA step ratio calculation"} },
    { id: "maliyet_C", label: "Total process cost", label_i18n: {"en":"Total process cost","tr":"Toplam proses maliyeti"}, type: "number", unit: "currency", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "Total cost of the process over the measured period.", helper_i18n: {"en":"Total cost of the process over the measured period.","tr":"\u00d6l\u00e7\u00fclen d\u00f6nemdeki toplam proses maliyeti."}, expertMeaning: "C for cost allocation = C \u00d7 VAR", expertMeaning_i18n: {"en":"C for cost allocation = C \u00d7 VAR","tr":"C for cost allocation = C \u00d7 VAR"} },
    { id: "israftanKurtarilanYuzde", label: "Waste recovery percentage", label_i18n: {"en":"Waste recovery percentage","tr":"\u0130sraftan kurtar\u0131lan y\u00fczde"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "Realistically achievable waste reduction through lean initiatives.", helper_i18n: {"en":"Realistically achievable waste reduction through lean initiatives.","tr":"Yal\u0131n giri\u015fimlerle ger\u00e7ek\u00e7i olarak ula\u015f\u0131labilir kay\u0131p azaltma y\u00fczdesi."}, expertMeaning: "For improvement potential estimate", expertMeaning_i18n: {"en":"For improvement potential estimate","tr":"For improvement potential estimate"} },
  ],
  outputs: [
    { id: "VAR_VA", label: "Value-added ratio (VAR_VA)", label_i18n: {"en":"Value-added ratio (VAR_VA)","tr":"Katma de\u011fer oran\u0131 (VAR_VA)"}, unit: "%", format: "percentage" },
    { id: "VAR_NVA", label: "Necessary NVA ratio (VAR_NVA)", label_i18n: {"en":"Necessary NVA ratio (VAR_NVA)","tr":"Zorunlu KD d\u0131\u015f\u0131 oran (VAR_NVA)"}, unit: "%", format: "percentage" },
    { id: "VAR_waste", label: "Waste ratio (VAR_W)", label_i18n: {"en":"Waste ratio (VAR_W)","tr":"Kay\u0131p oran\u0131 (VAR_W)"}, unit: "%", format: "percentage" },
    { id: "VA_Maliyet", label: "VA cost portion", label_i18n: {"en":"VA cost portion","tr":"KD maliyet pay\u0131"}, unit: "currency", format: "currency" },
    { id: "NVA_Maliyet", label: "NNVA cost portion", label_i18n: {"en":"NNVA cost portion","tr":"Zorunlu KD d\u0131\u015f\u0131 maliyet pay\u0131"}, unit: "currency", format: "currency" },
    { id: "kayipMaliyet", label: "Waste cost portion", label_i18n: {"en":"Waste cost portion","tr":"Kay\u0131p maliyet pay\u0131"}, unit: "currency", format: "currency" },
    { id: "kurtarilabilirMiktar", label: "Recoverable waste cost", label_i18n: {"en":"Recoverable waste cost","tr":"Kurtar\u0131labilir kay\u0131p maliyeti"}, unit: "currency", format: "currency" },
    { id: "idealVAR", label: "Ideal VA ratio (zero waste)", label_i18n: {"en":"Ideal VA ratio (zero waste)","tr":"\u0130deal KD oran\u0131 (s\u0131f\u0131r kay\u0131p)"}, unit: "%", format: "percentage" },
    { id: "iyilestirmePotansiyeli", label: "Improvement potential", label_i18n: {"en":"Improvement potential","tr":"\u0130yile\u015ftirme potansiyeli"}, unit: "currency", format: "currency" },
  ],
  thresholds: [
    { fieldId: "VAR_VA", warning: 30, critical: 10, direction: "lower_is_bad", warningMessage: "VA ratio below 30% \u2014 significant non-value-added content.", warningMessage_i18n: {"en":"VA ratio below 30% \u2014 significant non-value-added content.","tr":"VA ratio below 30% \u2014 significant non-value-added content."}, criticalMessage: "VA ratio below 10% \u2014 critically inefficient process, major redesign needed.", criticalMessage_i18n: {"en":"VA ratio below 10% \u2014 critically inefficient process, major redesign needed.","tr":"VA ratio below 10% \u2014 critically inefficient process, major redesign needed."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.vap_ratio", inputMap: { totalCycleTime_min: "toplamCevrimSuresi_TCT", vaTime_min: "katmaDegerliSure_VA", nnvaTime_min: "zorunluKatmaDegerliSure_NVA", wasteTime_min: "kayipSure_W", totalProcessCost: "maliyet_C", wasteRecoveryPercent: "israftanKurtarilanYuzde" }, outputId: "VAR_VA" }],
  reportTemplate: { title: "Value-Added Process Analysis Report", title_i18n: {"en":"Value-Added Process Analysis Report","tr":"Katma De\u011ferli S\u00fcre\u00e7 Analiz Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["VAR_VA = VA/TCT\u00d7100; VAR_NVA = NNVA/TCT\u00d7100; VAR_W = W/TCT\u00d7100.", "VA + NNVA + W = TCT. Ideal = VA/(VA+NNVA) after waste elimination.", "Lean benchmark: World-class processes have >60% VA ratio."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Kaizen Event / Cost Savings Tracker
 * ════════════════════════════════════════════════════════════════════════════ */

const KAIZEN_EVENT_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-event-tracker",
  legacyPaidSlug: "kaizen-event-tracker",
  name: "Kaizen Event & Cost Savings Tracker", name_i18n: {"en":"Kaizen Event & Cost Savings Tracker","tr":"Kaizen Etkinlik ve Maliyet Tasarrufu Takip\u00e7isi"},
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kaizen events generate measurable improvements but tracking total investment vs annual savings (ROI and payback) requires consolidating labor, material, consulting and operational gains. Manual tracking often misses hidden costs.", painStatement_i18n: {"en":"Kaizen events generate measurable improvements but tracking total investment vs annual savings (ROI and payback) requires consolidating labor, material, consulting and operational gains. Manual tracking often misses hidden costs.","tr":"Kaizen events generate measurable improvements but tracking total investment vs annual savings (ROI and payback) requires consolidating labor, material, consulting and operational gains. Manual tracking often misses hidden costs."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency","tr":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency.","tr":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code.","tr":"ISO code."} },
    { id: "surecAdi", label: "Process name", label_i18n: {"en":"Process name","tr":"S\u00fcre\u00e7 ad\u0131"}, type: "number", unit: "", required: false, smartDefault: "Assembly line", helper: "Name or identifier for the improved process.", helper_i18n: {"en":"Name or identifier for the improved process.","tr":"\u0130yile\u015ftirilen s\u00fcrecin ad\u0131 veya tan\u0131mlay\u0131c\u0131s\u0131."}, expertMeaning: "Process label for report", expertMeaning_i18n: {"en":"Process label for report","tr":"Process label for report"} },
    { id: "calisanSayisi", label: "Number of team members", label_i18n: {"en":"Number of team members","tr":"Ekip \u00fcyesi say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Employees participating in the Kaizen event.", helper_i18n: {"en":"Employees participating in the Kaizen event.","tr":"Kaizen etkinli\u011fine kat\u0131lan \u00e7al\u0131\u015fan say\u0131s\u0131."}, expertMeaning: "n for labor cost calculation", expertMeaning_i18n: {"en":"n for labor cost calculation","tr":"n for labor cost calculation"} },
    { id: "eventSuresi", label: "Event duration", label_i18n: {"en":"Event duration","tr":"Etkinlik s\u00fcresi"}, type: "number", unit: "days", required: true, smartDefault: 5, validation: { min: 0.5 }, helper: "Total duration of the Kaizen event in days.", helper_i18n: {"en":"Total duration of the Kaizen event in days.","tr":"Kaizen etkinli\u011finin toplam s\u00fcresi (g\u00fcn)."}, expertMeaning: "Duration for event labor cost", expertMeaning_i18n: {"en":"Duration for event labor cost","tr":"Duration for event labor cost"} },
    { id: "ekipUyesiSaatlikMaliyet", label: "Team member hourly cost", label_i18n: {"en":"Team member hourly cost","tr":"Ekip \u00fcyesi saatlik maliyeti"}, type: "number", unit: "currency/hr", required: true, smartDefault: 25, validation: { min: 0 }, helper: "Fully loaded hourly cost per team member.", helper_i18n: {"en":"Fully loaded hourly cost per team member.","tr":"Ekip \u00fcyesi ba\u015f\u0131na saatlik toplam maliyet."}, expertMeaning: "C_labor for labor cost = C_labor \u00d7 days \u00d7 8h", expertMeaning_i18n: {"en":"C_labor for labor cost = C_labor \u00d7 days \u00d7 8h","tr":"C_labor for labor cost = C_labor \u00d7 days \u00d7 8h"} },
    { id: "malzemeMaliyeti", label: "Material cost", label_i18n: {"en":"Material cost","tr":"Malzeme maliyeti"}, type: "number", unit: "currency", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Cost of materials used during the event.", helper_i18n: {"en":"Cost of materials used during the event.","tr":"Etkinlik s\u0131ras\u0131nda kullan\u0131lan malzeme maliyeti."}, expertMeaning: "C_material for total event cost", expertMeaning_i18n: {"en":"C_material for total event cost","tr":"C_material for total event cost"} },
    { id: "disDanismanMaliyeti", label: "External consultant cost", label_i18n: {"en":"External consultant cost","tr":"D\u0131\u015f dan\u0131\u015fman maliyeti"}, type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Fees paid to external consultants.", helper_i18n: {"en":"Fees paid to external consultants.","tr":"D\u0131\u015f dan\u0131\u015fmanlara \u00f6denen \u00fccretler."}, expertMeaning: "C_consultant for total event cost", expertMeaning_i18n: {"en":"C_consultant for total event cost","tr":"C_consultant for total event cost"} },
    { id: "mevcutDonguSuresi", label: "Current cycle time", label_i18n: {"en":"Current cycle time","tr":"Mevcut \u00e7evrim s\u00fcresi"}, type: "number", unit: "min", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "Cycle time before the Kaizen improvement.", helper_i18n: {"en":"Cycle time before the Kaizen improvement.","tr":"Kaizen iyile\u015ftirmesi \u00f6ncesi \u00e7evrim s\u00fcresi."}, expertMeaning: "CT_old for \u0394CT = (CT_old-CT_new)/CT_old", expertMeaning_i18n: {"en":"CT_old for \u0394CT = (CT_old-CT_new)/CT_old","tr":"CT_old for \u0394CT = (CT_old-CT_new)/CT_old"} },
    { id: "yeniDonguSuresi", label: "New cycle time", label_i18n: {"en":"New cycle time","tr":"Yeni \u00e7evrim s\u00fcresi"}, type: "number", unit: "min", required: true, smartDefault: 7, validation: { min: 0.1 }, helper: "Cycle time after the Kaizen improvement.", helper_i18n: {"en":"Cycle time after the Kaizen improvement.","tr":"Kaizen iyile\u015ftirmesi sonras\u0131 \u00e7evrim s\u00fcresi."}, expertMeaning: "CT_new for improvement percentage", expertMeaning_i18n: {"en":"CT_new for improvement percentage","tr":"CT_new for improvement percentage"} },
    { id: "mevcutHurdaOrani", label: "Current scrap rate", label_i18n: {"en":"Current scrap rate","tr":"Mevcut hurda oran\u0131"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "Scrap/reject rate before improvement.", helper_i18n: {"en":"Scrap/reject rate before improvement.","tr":"\u0130yile\u015ftirme \u00f6ncesi hurda/red oran\u0131."}, expertMeaning: "S_old for material savings", expertMeaning_i18n: {"en":"S_old for material savings","tr":"S_old for material savings"} },
    { id: "yeniHurdaOrani", label: "New scrap rate", label_i18n: {"en":"New scrap rate","tr":"Yeni hurda oran\u0131"}, type: "number", unit: "%", required: true, smartDefault: 4, validation: { min: 0, max: 100 }, helper: "Scrap/reject rate after improvement.", helper_i18n: {"en":"Scrap/reject rate after improvement.","tr":"\u0130yile\u015ftirme sonras\u0131 hurda/red oran\u0131."}, expertMeaning: "S_new for scrap reduction", expertMeaning_i18n: {"en":"S_new for scrap reduction","tr":"S_new for scrap reduction"} },
    { id: "mevcutDurusOrani", label: "Current downtime rate", label_i18n: {"en":"Current downtime rate","tr":"Mevcut duru\u015f oran\u0131"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "Downtime as percentage of planned time (before).", helper_i18n: {"en":"Downtime as percentage of planned time (before).","tr":"Planlanan zaman\u0131n y\u00fczdesi olarak duru\u015f s\u00fcresi (\u00f6nce)."}, expertMeaning: "D_old for downtime reduction", expertMeaning_i18n: {"en":"D_old for downtime reduction","tr":"D_old for downtime reduction"} },
    { id: "yeniDurusOrani", label: "New downtime rate", label_i18n: {"en":"New downtime rate","tr":"Yeni duru\u015f oran\u0131"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "Downtime as percentage of planned time (after).", helper_i18n: {"en":"Downtime as percentage of planned time (after).","tr":"Planlanan zaman\u0131n y\u00fczdesi olarak duru\u015f s\u00fcresi (sonra)."}, expertMeaning: "D_new for improvement", expertMeaning_i18n: {"en":"D_new for improvement","tr":"D_new for improvement"} },
    { id: "yillikUretimHacmi", label: "Annual production volume", label_i18n: {"en":"Annual production volume","tr":"Y\u0131ll\u0131k \u00fcretim hacmi"}, type: "number", unit: "units/year", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "Total units produced per year.", helper_i18n: {"en":"Total units produced per year.","tr":"Y\u0131lda \u00fcretilen toplam birim."}, expertMeaning: "V for annual savings = V \u00d7 unit savings", expertMeaning_i18n: {"en":"V for annual savings = V \u00d7 unit savings","tr":"V for annual savings = V \u00d7 unit savings"} },
    { id: "mevcutIsciSayisi", label: "Current headcount", label_i18n: {"en":"Current headcount","tr":"Mevcut i\u015f\u00e7i say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 20, validation: { min: 1 }, helper: "Number of operators currently assigned.", helper_i18n: {"en":"Number of operators currently assigned.","tr":"\u015eu anda atanm\u0131\u015f operat\u00f6r say\u0131s\u0131."}, expertMeaning: "H_old for labor savings", expertMeaning_i18n: {"en":"H_old for labor savings","tr":"H_old for labor savings"} },
    { id: "yeniIsciSayisi", label: "New headcount (after)", label_i18n: {"en":"New headcount (after)","tr":"Yeni i\u015f\u00e7i say\u0131s\u0131 (sonra)"}, type: "number", unit: "", required: true, smartDefault: 16, validation: { min: 1 }, helper: "Number of operators after improvement.", helper_i18n: {"en":"Number of operators after improvement.","tr":"\u0130yile\u015ftirme sonras\u0131 operat\u00f6r say\u0131s\u0131."}, expertMeaning: "H_new for labor savings", expertMeaning_i18n: {"en":"H_new for labor savings","tr":"H_new for labor savings"} },
    { id: "yillikEnerjiTasarrufu_kWh", label: "Annual energy savings", label_i18n: {"en":"Annual energy savings","tr":"Y\u0131ll\u0131k enerji tasarrufu"}, type: "number", unit: "kWh/year", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "Expected kWh reduction per year due to improvement.", helper_i18n: {"en":"Expected kWh reduction per year due to improvement.","tr":"\u0130yile\u015ftirme nedeniyle y\u0131ll\u0131k beklenen kWh azalmas\u0131."}, expertMeaning: "Energy savings for cost calculation", expertMeaning_i18n: {"en":"Energy savings for cost calculation","tr":"Energy savings for cost calculation"} },
    { id: "birimEnerjiMaliyeti", label: "Unit energy cost", label_i18n: {"en":"Unit energy cost","tr":"Birim enerji maliyeti"}, type: "number", unit: "currency/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "Cost per kWh of energy.", helper_i18n: {"en":"Cost per kWh of energy.","tr":"kWh ba\u015f\u0131na enerji maliyeti."}, expertMeaning: "C_kWh for energy savings", expertMeaning_i18n: {"en":"C_kWh for energy savings","tr":"C_kWh for energy savings"} },
  ],
  outputs: [
    { id: "toplamEventMaliyeti", label: "Total event investment cost", label_i18n: {"en":"Total event investment cost","tr":"Toplam etkinlik yat\u0131r\u0131m maliyeti"}, unit: "currency", format: "currency" },
    { id: "donguSuresiIyilesme_pct", label: "Cycle time improvement", label_i18n: {"en":"Cycle time improvement","tr":"\u00c7evrim s\u00fcresi iyile\u015fmesi"}, unit: "%", format: "percentage" },
    { id: "hurdaAzalma_pct", label: "Scrap reduction", label_i18n: {"en":"Scrap reduction","tr":"Hurda azalmas\u0131"}, unit: "%", format: "percentage" },
    { id: "durusAzalma_pct", label: "Downtime reduction", label_i18n: {"en":"Downtime reduction","tr":"Duru\u015f azalmas\u0131"}, unit: "%", format: "percentage" },
    { id: "iscilikTasarrufu_yil", label: "Annual labor cost savings", label_i18n: {"en":"Annual labor cost savings","tr":"Y\u0131ll\u0131k i\u015f\u00e7ilik maliyet tasarrufu"}, unit: "currency", format: "currency" },
    { id: "malzemeTasarrufu_yil", label: "Annual material cost savings", label_i18n: {"en":"Annual material cost savings","tr":"Y\u0131ll\u0131k malzeme maliyet tasarrufu"}, unit: "currency", format: "currency" },
    { id: "enerjiTasarrufu_yil", label: "Annual energy cost savings", label_i18n: {"en":"Annual energy cost savings","tr":"Y\u0131ll\u0131k enerji maliyet tasarrufu"}, unit: "currency", format: "currency" },
    { id: "toplamYillikTasarruf", label: "Total annual savings", label_i18n: {"en":"Total annual savings","tr":"Toplam y\u0131ll\u0131k tasarruf"}, unit: "currency", format: "currency" },
    { id: "ROI", label: "Return on Investment (ROI)", label_i18n: {"en":"Return on Investment (ROI)","tr":"Yat\u0131r\u0131m Getirisi (ROI)"}, unit: "%", format: "percentage" },
    { id: "geriOdemeSuresi_gun", label: "Payback period", label_i18n: {"en":"Payback period","tr":"Geri \u00f6deme s\u00fcresi"}, unit: "days", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.kaizen_event", inputMap: { eventDays: "eventSuresi", teamCount: "calisanSayisi", hourlyCost: "ekipUyesiSaatlikMaliyet", materialCost: "malzemeMaliyeti", consultantCost: "disDanismanMaliyeti", oldCycleTime: "mevcutDonguSuresi", newCycleTime: "yeniDonguSuresi" }, outputId: "toplamEventMaliyeti" }],
  reportTemplate: { title: "Kaizen Event & Cost Savings Report", title_i18n: {"en":"Kaizen Event & Cost Savings Report","tr":"Kaizen Etkinlik ve Maliyet Tasarrufu Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Investment = (Team\u00d7Days\u00d78h\u00d7Rate) + Material + Consultant.", "Annual savings = Labor + Material + Energy savings extrapolated to 12 months.", "ROI = (Annual Savings - Investment) / Investment \u00d7 100. Payback = Investment/AnnualSavings\u00d7365."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Value Stream Mapping (VSM) Metrics
 * ════════════════════════════════════════════════════════════════════════════ */

const VSM_METRICS_SCHEMA: PremiumCalculatorSchema = {
  id: "value-stream-mapping-analyzer",
  legacyPaidSlug: "value-stream-mapping-analyzer",
  name: "Value Stream Mapping (VSM) Metrics Analyzer", name_i18n: {"en":"Value Stream Mapping (VSM) Metrics Analyzer","tr":"De\u011fer Ak\u0131\u015f\u0131 Haritas\u0131 (VSM) Metrik Analiz\u00f6r\u00fc"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Value Stream Mapping requires calculating Process Cycle Efficiency (PCE), Takt Time, required headcount and inventory days across the current state. Manual spreadsheet metrics miss the relationship between flow and demand.", painStatement_i18n: {"en":"Value Stream Mapping requires calculating Process Cycle Efficiency (PCE), Takt Time, required headcount and inventory days across the current state. Manual spreadsheet metrics miss the relationship between flow and demand.","tr":"Value Stream Mapping requires calculating Process Cycle Efficiency (PCE), Takt Time, required headcount and inventory days across the current state. Manual spreadsheet metrics miss the relationship between flow and demand."},
  inputs: [
    { id: "prosesAdimSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps","tr":"Proses ad\u0131m\u0131 say\u0131s\u0131"}, type: "number", unit: "", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Total process steps in the value stream.", helper_i18n: {"en":"Total process steps in the value stream.","tr":"De\u011fer ak\u0131\u015f\u0131ndaki toplam proses ad\u0131m\u0131 say\u0131s\u0131."}, expertMeaning: "For VA/NVA step classification", expertMeaning_i18n: {"en":"For VA/NVA step classification","tr":"For VA/NVA step classification"} },
    { id: "toplamKatmaDegerliSure", label: "Total value-added time", label_i18n: {"en":"Total value-added time","tr":"Toplam katma de\u011ferli s\u00fcre"}, type: "number", unit: "min", required: true, smartDefault: 20, validation: { min: 0 }, helper: "Sum of all value-added processing times.", helper_i18n: {"en":"Sum of all value-added processing times.","tr":"T\u00fcm katma de\u011ferli i\u015flem s\u00fcrelerinin toplam\u0131."}, expertMeaning: "VA time for PCE = VA / Total Lead Time", expertMeaning_i18n: {"en":"VA time for PCE = VA / Total Lead Time","tr":"VA time for PCE = VA / Total Lead Time"} },
    { id: "toplamBeklemeSure", label: "Total waiting time", label_i18n: {"en":"Total waiting time","tr":"Toplam bekleme s\u00fcresi"}, type: "number", unit: "min", required: true, smartDefault: 120, validation: { min: 0 }, helper: "Sum of all waiting/queue times between steps.", helper_i18n: {"en":"Sum of all waiting/queue times between steps.","tr":"Ad\u0131mlar aras\u0131ndaki t\u00fcm bekleme/kuyruk s\u00fcrelerinin toplam\u0131."}, expertMeaning: "Non-VA time for total lead time", expertMeaning_i18n: {"en":"Non-VA time for total lead time","tr":"Non-VA time for total lead time"} },
    { id: "toplamTasimaSure", label: "Total transport/move time", label_i18n: {"en":"Total transport/move time","tr":"Toplam ta\u015f\u0131ma s\u00fcresi"}, type: "number", unit: "min", required: true, smartDefault: 30, validation: { min: 0 }, helper: "Sum of material movement times.", helper_i18n: {"en":"Sum of material movement times.","tr":"Malzeme hareket s\u00fcrelerinin toplam\u0131."}, expertMeaning: "Transport time (NVA)", expertMeaning_i18n: {"en":"Transport time (NVA)","tr":"Transport time (NVA)"} },
    { id: "toplamKontrolSure", label: "Total inspection time", label_i18n: {"en":"Total inspection time","tr":"Toplam kontrol s\u00fcresi"}, type: "number", unit: "min", required: true, smartDefault: 15, validation: { min: 0 }, helper: "Sum of quality inspection/review times.", helper_i18n: {"en":"Sum of quality inspection/review times.","tr":"Kalite kontrol/g\u00f6zden ge\u00e7irme s\u00fcrelerinin toplam\u0131."}, expertMeaning: "Inspection time (NNVA)", expertMeaning_i18n: {"en":"Inspection time (NNVA)","tr":"Inspection time (NNVA)"} },
    { id: "musteriTalepAdeti", label: "Customer daily demand", label_i18n: {"en":"Customer daily demand","tr":"M\u00fc\u015fteri g\u00fcnl\u00fck talebi"}, type: "number", unit: "units/day", required: true, smartDefault: 500, validation: { min: 1 }, helper: "Average daily quantity demanded by the customer.", helper_i18n: {"en":"Average daily quantity demanded by the customer.","tr":"M\u00fc\u015fteri taraf\u0131ndan talep edilen ortalama g\u00fcnl\u00fck miktar."}, expertMeaning: "D for Takt = Available Time / D", expertMeaning_i18n: {"en":"D for Takt = Available Time / D","tr":"D for Takt = Available Time / D"} },
    { id: "calismaSuresi_gun", label: "Available working time per day", label_i18n: {"en":"Available working time per day","tr":"G\u00fcnl\u00fck \u00e7al\u0131\u015fma s\u00fcresi"}, type: "number", unit: "min/day", required: true, smartDefault: 480, validation: { min: 1 }, helper: "Total net working minutes per shift.", helper_i18n: {"en":"Total net working minutes per shift.","tr":"Vardiya ba\u015f\u0131na net \u00e7al\u0131\u015fma dakikas\u0131."}, expertMeaning: "A_time for Takt = A_time / Demand", expertMeaning_i18n: {"en":"A_time for Takt = A_time / Demand","tr":"A_time for Takt = A_time / Demand"} },
    { id: "vardiyaSayisi", label: "Number of shifts", label_i18n: {"en":"Number of shifts","tr":"Vardiya say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 3 }, helper: "Shifts per day for total available time.", helper_i18n: {"en":"Shifts per day for total available time.","tr":"Toplam \u00e7al\u0131\u015fma s\u00fcresi i\u00e7in vardiya say\u0131s\u0131."}, expertMeaning: "Multiplier for total available time", expertMeaning_i18n: {"en":"Multiplier for total available time","tr":"Multiplier for total available time"} },
    { id: "mevcutStokMiktar", label: "Current inventory level", label_i18n: {"en":"Current inventory level","tr":"Mevcut stok miktar\u0131"}, type: "number", unit: "units", required: false, smartDefault: 2500, validation: { min: 0 }, helper: "Total WIP and FG inventory in the stream.", helper_i18n: {"en":"Total WIP and FG inventory in the stream.","tr":"Ak\u0131\u015ftaki toplam YD\u0130 ve mamul sto\u011fu."}, expertMeaning: "For inventory days = Stock / Daily Demand", expertMeaning_i18n: {"en":"For inventory days = Stock / Daily Demand","tr":"For inventory days = Stock / Daily Demand"} },
  ],
  outputs: [
    { id: "toplamGecenSure_PCT", label: "Total lead time (PCT)", label_i18n: {"en":"Total lead time (PCT)","tr":"Toplam ge\u00e7en s\u00fcre (PCT)"}, unit: "min", format: "number" },
    { id: "toplamKatmaDegerliSure_PLT", label: "Total value-added time (PLT)", label_i18n: {"en":"Total value-added time (PLT)","tr":"Toplam katma de\u011ferli s\u00fcre (PLT)"}, unit: "min", format: "number" },
    { id: "processCycleEfficiency_PCE", label: "Process Cycle Efficiency (PCE)", label_i18n: {"en":"Process Cycle Efficiency (PCE)","tr":"Proses \u00c7evrim Verimlili\u011fi (PCE)"}, unit: "%", format: "percentage" },
    { id: "taktTime_TT", label: "Takt Time (TT)", label_i18n: {"en":"Takt Time (TT)","tr":"Takt S\u00fcresi (TT)"}, unit: "min/unit", format: "number" },
    { id: "gerekliAdamSayisi", label: "Required headcount", label_i18n: {"en":"Required headcount","tr":"Gerekli i\u015fg\u00fcc\u00fc say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "stokGunu", label: "Inventory days", label_i18n: {"en":"Inventory days","tr":"Stok g\u00fcn\u00fc"}, unit: "days", format: "number" },
    { id: "prosesAdimSayisi_VA", label: "VA process steps", label_i18n: {"en":"VA process steps","tr":"KD proses ad\u0131m\u0131 say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "prosesAdimSayisi_NVA", label: "NVA process steps", label_i18n: {"en":"NVA process steps","tr":"KD d\u0131\u015f\u0131 proses ad\u0131m\u0131 say\u0131s\u0131"}, unit: "", format: "number" },
    { id: "iyilestirmeOrani", label: "Improvement ratio", label_i18n: {"en":"Improvement ratio","tr":"\u0130yile\u015ftirme oran\u0131"}, unit: "", format: "number" },
    { id: "hedefTakt", label: "Target takt", label_i18n: {"en":"Target takt","tr":"Hedef takt"}, unit: "min/unit", format: "number" },
  ],
  thresholds: [
    { fieldId: "processCycleEfficiency_PCE", warning: 25, critical: 10, direction: "lower_is_bad", warningMessage: "PCE below 25% \u2014 significant waste in the value stream.", warningMessage_i18n: {"en":"PCE below 25% \u2014 significant waste in the value stream.","tr":"PCE below 25% \u2014 significant waste in the value stream."}, criticalMessage: "PCE below 10% \u2014 critically inefficient value stream.", criticalMessage_i18n: {"en":"PCE below 10% \u2014 critically inefficient value stream.","tr":"PCE below 10% \u2014 critically inefficient value stream."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.vsm_metrics", inputMap: { vaTime_min: "toplamKatmaDegerliSure", waitTime_min: "toplamBeklemeSure", transportTime_min: "toplamTasimaSure", inspectionTime_min: "toplamKontrolSure", dailyDemand: "musteriTalepAdeti", workMinutesPerDay: "calismaSuresi_gun" }, outputId: "processCycleEfficiency_PCE" }],
  reportTemplate: { title: "Value Stream Mapping Analysis Report", title_i18n: {"en":"Value Stream Mapping Analysis Report","tr":"De\u011fer Ak\u0131\u015f\u0131 Haritas\u0131 Analiz Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["PCE = VA Time / Total Lead Time \u00d7 100. Total Lead Time = VA+Wait+Transport+Inspection.", "Takt Time = Available Time / Customer Demand. Lean target PCE > 25%.", "Inventory Days = Current Stock / Daily Customer Demand."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 5S Audit Scoring Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const FIVE_S_AUDIT_SCHEMA: PremiumCalculatorSchema = {
  id: "5s-audit-scoring-calculator",
  legacyPaidSlug: "5s-audit-scoring-calculator",
  name: "5S Audit Scoring Calculator", name_i18n: {"en":"5S Audit Scoring Calculator","tr":"5S Denetim Puanlama Hesaplay\u0131c\u0131"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "5S audit scoring requires computing each S (Sort/Set/Shine/Standardize/Sustain) percentage, overall score, letter grade and identifying the weakest S for improvement priority. Manual grading is inconsistent across auditors.", painStatement_i18n: {"en":"5S audit scoring requires computing each S (Sort/Set/Shine/Standardize/Sustain) percentage, overall score, letter grade and identifying the weakest S for improvement priority. Manual grading is inconsistent across auditors.","tr":"5S audit scoring requires computing each S (Sort/Set/Shine/Standardize/Sustain) percentage, overall score, letter grade and identifying the weakest S for improvement priority. Manual grading is inconsistent across auditors."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency","tr":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency.","tr":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code.","tr":"ISO code."} },
    { id: "sort_puan", label: "Sort (Seiri) score", label_i18n: {"en":"Sort (Seiri) score","tr":"Ay\u0131klama (Seiri) puan\u0131"}, type: "number", unit: "", required: true, smartDefault: 18, validation: { min: 1, max: 25 }, helper: "Score achieved in Sort category.", helper_i18n: {"en":"Score achieved in Sort category.","tr":"Ay\u0131klama kategorisinde al\u0131nan puan."}, expertMeaning: "S1 score for Sort% = score/max", expertMeaning_i18n: {"en":"S1 score for Sort% = score/max","tr":"S1 score for Sort% = score/max"} },
    { id: "sort_max", label: "Sort (Seiri) max score", label_i18n: {"en":"Sort (Seiri) max score","tr":"Ay\u0131klama (Seiri) maksimum puan"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Sort category.", helper_i18n: {"en":"Maximum possible score in Sort category.","tr":"Ay\u0131klama kategorisinde al\u0131nabilecek maksimum puan."}, expertMeaning: "Max S1 for percentage", expertMeaning_i18n: {"en":"Max S1 for percentage","tr":"Max S1 for percentage"} },
    { id: "setInOrder_puan", label: "Set in Order (Seiton) score", label_i18n: {"en":"Set in Order (Seiton) score","tr":"D\u00fczen (Seiton) puan\u0131"}, type: "number", unit: "", required: true, smartDefault: 16, validation: { min: 1, max: 25 }, helper: "Score achieved in Set in Order category.", helper_i18n: {"en":"Score achieved in Set in Order category.","tr":"D\u00fczen kategorisinde al\u0131nan puan."}, expertMeaning: "S2 score for Set% = score/max", expertMeaning_i18n: {"en":"S2 score for Set% = score/max","tr":"S2 score for Set% = score/max"} },
    { id: "setInOrder_max", label: "Set in Order (Seiton) max score", label_i18n: {"en":"Set in Order (Seiton) max score","tr":"D\u00fczen (Seiton) maksimum puan"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Set in Order category.", helper_i18n: {"en":"Maximum possible score in Set in Order category.","tr":"D\u00fczen kategorisinde al\u0131nabilecek maksimum puan."}, expertMeaning: "Max S2", expertMeaning_i18n: {"en":"Max S2","tr":"Max S2"} },
    { id: "shine_puan", label: "Shine (Seiso) score", label_i18n: {"en":"Shine (Seiso) score","tr":"Temizlik (Seiso) puan\u0131"}, type: "number", unit: "", required: true, smartDefault: 20, validation: { min: 1, max: 25 }, helper: "Score achieved in Shine category.", helper_i18n: {"en":"Score achieved in Shine category.","tr":"Temizlik kategorisinde al\u0131nan puan."}, expertMeaning: "S3 score", expertMeaning_i18n: {"en":"S3 score","tr":"S3 score"} },
    { id: "shine_max", label: "Shine (Seiso) max score", label_i18n: {"en":"Shine (Seiso) max score","tr":"Temizlik (Seiso) maksimum puan"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Shine category.", helper_i18n: {"en":"Maximum possible score in Shine category.","tr":"Temizlik kategorisinde al\u0131nabilecek maksimum puan."}, expertMeaning: "Max S3", expertMeaning_i18n: {"en":"Max S3","tr":"Max S3"} },
    { id: "standardize_puan", label: "Standardize (Seiketsu) score", label_i18n: {"en":"Standardize (Seiketsu) score","tr":"Standardizasyon (Seiketsu) puan\u0131"}, type: "number", unit: "", required: true, smartDefault: 14, validation: { min: 1, max: 25 }, helper: "Score achieved in Standardize category.", helper_i18n: {"en":"Score achieved in Standardize category.","tr":"Standardizasyon kategorisinde al\u0131nan puan."}, expertMeaning: "S4 score", expertMeaning_i18n: {"en":"S4 score","tr":"S4 score"} },
    { id: "standardize_max", label: "Standardize (Seiketsu) max score", label_i18n: {"en":"Standardize (Seiketsu) max score","tr":"Standardizasyon (Seiketsu) maksimum puan"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Standardize category.", helper_i18n: {"en":"Maximum possible score in Standardize category.","tr":"Standardizasyon kategorisinde al\u0131nabilecek maksimum puan."}, expertMeaning: "Max S4", expertMeaning_i18n: {"en":"Max S4","tr":"Max S4"} },
    { id: "sustain_puan", label: "Sustain (Shitsuke) score", label_i18n: {"en":"Sustain (Shitsuke) score","tr":"Disiplin (Shitsuke) puan\u0131"}, type: "number", unit: "", required: true, smartDefault: 12, validation: { min: 1, max: 25 }, helper: "Score achieved in Sustain category.", helper_i18n: {"en":"Score achieved in Sustain category.","tr":"Disiplin kategorisinde al\u0131nan puan."}, expertMeaning: "S5 score", expertMeaning_i18n: {"en":"S5 score","tr":"S5 score"} },
    { id: "sustain_max", label: "Sustain (Shitsuke) max score", label_i18n: {"en":"Sustain (Shitsuke) max score","tr":"Disiplin (Shitsuke) maksimum puan"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Sustain category.", helper_i18n: {"en":"Maximum possible score in Sustain category.","tr":"Disiplin kategorisinde al\u0131nabilecek maksimum puan."}, expertMeaning: "Max S5", expertMeaning_i18n: {"en":"Max S5","tr":"Max S5"} },
    { id: "hedefSkor", label: "Target overall score (%)", label_i18n: {"en":"Target overall score (%)","tr":"Hedef genel puan (%)"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "Minimum target percentage for acceptable 5S performance.", helper_i18n: {"en":"Minimum target percentage for acceptable 5S performance.","tr":"Kabul edilebilir 5S performans\u0131 i\u00e7in minimum hedef y\u00fczde."}, expertMeaning: "Target threshold for pass/fail", expertMeaning_i18n: {"en":"Target threshold for pass/fail","tr":"Target threshold for pass/fail"} },
    { id: "toplamCalisanSayisi", label: "Total employees in area", label_i18n: {"en":"Total employees in area","tr":"B\u00f6lgedeki toplam \u00e7al\u0131\u015fan say\u0131s\u0131"}, type: "number", unit: "", required: false, smartDefault: 25, validation: { min: 1 }, helper: "Total headcount assigned to the audited area.", helper_i18n: {"en":"Total headcount assigned to the audited area.","tr":"Denetlenen b\u00f6lgeye atanm\u0131\u015f toplam \u00e7al\u0131\u015fan say\u0131s\u0131."}, expertMeaning: "For training cost allocation", expertMeaning_i18n: {"en":"For training cost allocation","tr":"For training cost allocation"} },
    { id: "egitimSaati_calisan", label: "Training hours per employee", label_i18n: {"en":"Training hours per employee","tr":"\u00c7al\u0131\u015fan ba\u015f\u0131na e\u011fitim saati"}, type: "number", unit: "hours", required: false, smartDefault: 4, validation: { min: 0 }, helper: "Hours of 5S training provided per employee.", helper_i18n: {"en":"Hours of 5S training provided per employee.","tr":"\u00c7al\u0131\u015fan ba\u015f\u0131na verilen 5S e\u011fitim saati."}, expertMeaning: "For training investment cost", expertMeaning_i18n: {"en":"For training investment cost","tr":"For training investment cost"} },
    { id: "egitimMaliyeti_saat", label: "Training cost per hour", label_i18n: {"en":"Training cost per hour","tr":"Saatlik e\u011fitim maliyeti"}, type: "number", unit: "currency/hr", required: false, smartDefault: 15, validation: { min: 0 }, helper: "Average cost per training hour (trainer + materials).", helper_i18n: {"en":"Average cost per training hour (trainer + materials).","tr":"E\u011fitim saati ba\u015f\u0131na ortalama maliyet (e\u011fitmen + malzeme)."}, expertMeaning: "C_training = hours \u00d7 rate \u00d7 employees", expertMeaning_i18n: {"en":"C_training = hours \u00d7 rate \u00d7 employees","tr":"C_training = hours \u00d7 rate \u00d7 employees"} },
  ],
  outputs: [
    { id: "sort_yuzde", label: "Sort (Seiri) score %", label_i18n: {"en":"Sort (Seiri) score %","tr":"Ay\u0131klama (Seiri) puan %"}, unit: "%", format: "percentage" },
    { id: "setInOrder_yuzde", label: "Set in Order (Seiton) score %", label_i18n: {"en":"Set in Order (Seiton) score %","tr":"D\u00fczen (Seiton) puan %"}, unit: "%", format: "percentage" },
    { id: "shine_yuzde", label: "Shine (Seiso) score %", label_i18n: {"en":"Shine (Seiso) score %","tr":"Temizlik (Seiso) puan %"}, unit: "%", format: "percentage" },
    { id: "standardize_yuzde", label: "Standardize (Seiketsu) score %", label_i18n: {"en":"Standardize (Seiketsu) score %","tr":"Standardizasyon (Seiketsu) puan %"}, unit: "%", format: "percentage" },
    { id: "sustain_yuzde", label: "Sustain (Shitsuke) score %", label_i18n: {"en":"Sustain (Shitsuke) score %","tr":"Disiplin (Shitsuke) puan %"}, unit: "%", format: "percentage" },
    { id: "toplamPuan", label: "Total raw score", label_i18n: {"en":"Total raw score","tr":"Toplam ham puan"}, unit: "", format: "number" },
    { id: "toplamMaxPuan", label: "Total maximum score", label_i18n: {"en":"Total maximum score","tr":"Toplam maksimum puan"}, unit: "", format: "number" },
    { id: "genelSkor_yuzde", label: "Overall 5S score", label_i18n: {"en":"Overall 5S score","tr":"Genel 5S puan\u0131"}, unit: "%", format: "percentage" },
    { id: "hedefFarki", label: "Gap to target", label_i18n: {"en":"Gap to target","tr":"Hedefe fark"}, unit: "%", format: "percentage" },
    { id: "not_harf", label: "Letter grade", label_i18n: {"en":"Letter grade","tr":"Harf notu"}, unit: "", format: "number" },
    { id: "yesilAlan_orani", label: "Green area ratio (\u226580%)", label_i18n: {"en":"Green area ratio (\u226580%)","tr":"Ye\u015fil alan oran\u0131 (\u2265%80)"}, unit: "%", format: "percentage" },
    { id: "kategori_ortalamasi", label: "Category average %", label_i18n: {"en":"Category average %","tr":"Kategori ortalamas\u0131 %"}, unit: "%", format: "percentage" },
    { id: "egitimMaliyeti_toplam", label: "Total training investment", label_i18n: {"en":"Total training investment","tr":"Toplam e\u011fitim yat\u0131r\u0131m\u0131"}, unit: "currency", format: "currency" },
    { id: "iyilestirmeOncelikleri", label: "Improvement priorities", label_i18n: {"en":"Improvement priorities","tr":"\u0130yile\u015ftirme \u00f6ncelikleri"}, unit: "", format: "number" },
    { id: "one_cikan_kategori", label: "Highlight category (lowest)", label_i18n: {"en":"Highlight category (lowest)","tr":"\u00d6ne \u00e7\u0131kan kategori (en d\u00fc\u015f\u00fck)"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "genelSkor_yuzde", warning: 80, critical: 60, direction: "lower_is_bad", warningMessage: "Overall 5S score below 80% (B grade) \u2014 improvement needed.", warningMessage_i18n: {"en":"Overall 5S score below 80% (B grade) \u2014 improvement needed.","tr":"Overall 5S score below 80% (B grade) \u2014 improvement needed."}, criticalMessage: "Overall 5S score below 60% (D/F grade) \u2014 critical deficiency, immediate action required.", criticalMessage_i18n: {"en":"Overall 5S score below 60% (D/F grade) \u2014 critical deficiency, immediate action required.","tr":"Overall 5S score below 60% (D/F grade) \u2014 critical deficiency, immediate action required."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.ss_audit", inputMap: { sortScore: "sort_puan", sortMax: "sort_max", seitonScore: "setInOrder_puan", seitonMax: "setInOrder_max", seisoScore: "shine_puan", seisoMax: "shine_max", seiketsuScore: "standardize_puan", seiketsuMax: "standardize_max", shitsukeScore: "sustain_puan", shitsukeMax: "sustain_max", targetPercent: "hedefSkor" }, outputId: "genelSkor_yuzde" }],
  reportTemplate: { title: "5S Audit Scoring Report", title_i18n: {"en":"5S Audit Scoring Report","tr":"5S Denetim Puanlama Raporu"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Each S% = Score/Max\u00d7100. Total% = TotalScore/TotalMax\u00d7100.", "Grading: \u226590% A (Excellent), \u226580% B (Good), \u226570% C (Fair), \u226560% D (Needs Improvement), <60% F (Poor).", "Green area: categories scoring \u226580% are acceptable."] },
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
  FMEA_RPN_SCHEMA,
  DOE_FACTORIAL_SCHEMA,
  RELIABILITY_BLOCK_SCHEMA,
  NIOSH_LIFTING_SCHEMA,
  REBA_ASSESSMENT_SCHEMA,
  RCM_DECISION_SCHEMA,
  PARETO_RCA_SCHEMA,
  VAP_ANALYZER_SCHEMA,
  KAIZEN_EVENT_SCHEMA,
  VSM_METRICS_SCHEMA,
  FIVE_S_AUDIT_SCHEMA,
];
