/**
 * Industrial Formula Tools — Combined Premium Calculator Schemas.
 *
 * 18 premium calculators with full input/output/threshold definitions.
 * Each schema maps to a paidSlug in revenue-tools-industrial-formulas.ts
 * and uses calculator functions from ../calculators/industrial-formulas-calculators.ts
 */

import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

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
 * 19. Hydraulic Cylinder Tonnage & Power Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const HYDRAULIC_CYLINDER_TONNAGE_POWER_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-cylinder-tonnage-power-calculator",
  legacyPaidSlug: "hydraulic-cylinder-tonnage-power-calculator",
  name: "Hydraulic Cylinder Tonnage & Power Calculator",
  name_i18n: {"en":"Hydraulic Cylinder Tonnage & Power Calculator"},
  sectorSlug: "sheet-metal",
  category: "measurement",
  painStatement: "Hydraulic cylinder tonnage and motor power selection without accounting for annular area difference, volumetric efficiency, and friction losses leads to undersized pumps or oversized motors — a mismatch that wastes energy and capital on every cycle.",
  inputs: [
    { id: "pistonDiameter_D", label: "Piston diameter D", type: "number", unit: "mm", required: true, smartDefault: 63, validation: { min: 10 }, helper: "Cylinder bore diameter.", expertMeaning: "D for A_push = π·D²/4" },
    { id: "rodDiameter_d", label: "Rod diameter d", type: "number", unit: "mm", required: true, smartDefault: 36, validation: { min: 5 }, helper: "Piston rod diameter (d < D).", expertMeaning: "d for annular area A_pull = π·(D²-d²)/4" },
    { id: "systemPressure_P", label: "System pressure P", type: "number", unit: "bar", required: true, smartDefault: 200, validation: { min: 1 }, helper: "Hydraulic system working pressure.", expertMeaning: "1 bar = 1e5 Pa" },
    { id: "strokeLength_L", label: "Stroke length L", type: "number", unit: "mm", required: true, smartDefault: 500, validation: { min: 10 }, helper: "Full piston stroke length.", expertMeaning: "L for cylinder displacement" },
    { id: "cylinderCount_n", label: "Cylinder count n", type: "number", unit: "adet", required: true, smartDefault: 1, validation: { min: 1 }, helper: "Number of simultaneously acting cylinders.", expertMeaning: "Total flow = n × single-cylinder flow" },
    { id: "pumpFlowRate_Q", label: "Pump flow rate Q", type: "number", unit: "L/min", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "Hydraulic pump volumetric delivery.", expertMeaning: "Q for speed: v = Q / (n × A)" },
    { id: "volumetricEfficiency_η_v", label: "Volumetric efficiency η_v", type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 70, max: 98 }, helper: "Volumetric efficiency of pump/cylinder.", expertMeaning: "Effective flow = Q × η_v/100" },
    { id: "mechanicalEfficiency_η_m", label: "Mechanical efficiency η_m", type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 80, max: 98 }, helper: "Mechanical efficiency of cylinder.", expertMeaning: "F_actual = F_ideal × η_m/100" },
    { id: "frictionLossCoeff", label: "Friction loss coefficient f", type: "number", unit: "", required: true, smartDefault: 0.05, validation: { min: 0, max: 0.15 }, helper: "Seal and wiper friction as fraction of output force.", expertMeaning: "Effective friction force = f × F_ideal" },
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code." },
  ],
  outputs: [
    { id: "pistonArea_cm2", label: "Piston area A_push", unit: "cm²", format: "number" },
    { id: "annularArea_cm2", label: "Annular area A_pull", unit: "cm²", format: "number" },
    { id: "pushForce_ton", label: "Push force F_push", unit: "ton-f", format: "number" },
    { id: "pullForce_ton", label: "Pull force F_pull", unit: "ton-f", format: "number" },
    { id: "pushPullRatio", label: "Push/pull ratio", unit: "", format: "number" },
    { id: "extendSpeed_mms", label: "Extension speed v_ext", unit: "mm/s", format: "number" },
    { id: "retractSpeed_mms", label: "Retraction speed v_ret", unit: "mm/s", format: "number" },
    { id: "totalFlowRate", label: "Total flow rate Q_total", unit: "L/min", format: "number" },
    { id: "hydraulicPower_kW", label: "Hydraulic power P_hyd", unit: "kW", format: "number" },
    { id: "motorPower_HP", label: "Motor power P_motor", unit: "HP", format: "number" },
    { id: "specificPower", label: "Specific power per cylinder", unit: "kW", format: "number" },
    { id: "areaRatio", label: "Area ratio D²/(D²-d²)", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.hydraulic_cylinder_tonnage_0", inputMap: { pistonDiameter_D: "pistonDiameter_D", rodDiameter_d: "rodDiameter_d", systemPressure_P: "systemPressure_P", strokeLength_L: "strokeLength_L", cylinderCount_n: "cylinderCount_n", pumpFlowRate_Q: "pumpFlowRate_Q", volumetricEfficiency_η_v: "volumetricEfficiency_η_v", mechanicalEfficiency_η_m: "mechanicalEfficiency_η_m", frictionLossCoeff: "frictionLossCoeff" }, outputId: "pushForce_ton" }],
  reportTemplate: { title: "Hydraulic Cylinder Tonnage & Power Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Hydraulic fluid assumed incompressible and Newtonian.", "Friction loss coefficient f includes seal and wiper friction.", "Cylinder count n assumes simultaneous operation; total flow distributed evenly.", "Motor power calculation includes both volumetric and mechanical efficiencies.", "Efficiency values are typical manufacturer ranges; measured values preferred for final design."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 20. Compressor Power & Air Flow Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const COMPRESSOR_POWER_AIR_FLOW_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-power-air-flow-calculator",
  legacyPaidSlug: "compressor-power-air-flow-calculator",
  name: "Compressor Power & Air Flow Calculator", name_i18n: {"en":"Compressor Power & Air Flow Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Selecting a compressor without accounting for polytropic exponent, interstage cooling, and part-load efficiency leads to oversized motors and wasted energy — a 10% oversizing penalty persists for the entire equipment life.", painStatement_i18n: {"en":"Selecting a compressor without accounting for polytropic exponent, interstage cooling, and part-load efficiency leads to oversized motors and wasted energy — a 10% oversizing penalty persists for the entire equipment life."},
  inputs: [
    { id: "airFlowRate", label: "Air flow rate Q", label_i18n: {"en":"Air flow rate Q"}, type: "number", unit: "m\u00b3/min", required: true, smartDefault: 40, validation: { min: 0.1 }, helper: "Actual volumetric flow rate at suction conditions.", helper_i18n: {"en":"Actual volumetric flow rate at suction conditions."}, expertMeaning: "Q for isentropic work: W_is = \u03ba/(\u03ba-1)\u00b7P1\u00b7Q\u00b7((P2/P1)^((\u03ba-1)/\u03ba)-1)", expertMeaning_i18n: {"en":"Q for isentropic work: W_is = \u03ba/(\u03ba-1)\u00b7P1\u00b7Q\u00b7((P2/P1)^((\u03ba-1)/\u03ba)-1)"} },
    { id: "operatingPressure", label: "Operating pressure P\u2082", label_i18n: {"en":"Operating pressure P\u2082"}, type: "number", unit: "bar_g", required: true, smartDefault: 8, validation: { min: 0.1 }, helper: "Required discharge pressure (gauge).", helper_i18n: {"en":"Required discharge pressure (gauge)."}, expertMeaning: "P2 for pressure ratio: \u03a0 = (P2 + Patm)/P1", expertMeaning_i18n: {"en":"P2 for pressure ratio: \u03a0 = (P2 + Patm)/P1"} },
    { id: "inletTemperature", label: "Inlet temperature T\u2081", label_i18n: {"en":"Inlet temperature T\u2081"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 25, validation: { min: -50, max: 200 }, helper: "Suction air temperature.", helper_i18n: {"en":"Suction air temperature."}, expertMeaning: "T1 in K for T2 = T1\u00b7(P2/P1)^((n-1)/n)", expertMeaning_i18n: {"en":"T1 in K for T2 = T1\u00b7(P2/P1)^((n-1)/n)"} },
    { id: "inletPressure", label: "Inlet pressure P\u2081", label_i18n: {"en":"Inlet pressure P\u2081"}, type: "number", unit: "bar_abs", required: true, smartDefault: 1.013, validation: { min: 0.1 }, helper: "Absolute suction pressure (typically 1.013 bar at sea level).", helper_i18n: {"en":"Absolute suction pressure (typically 1.013 bar at sea level)."}, expertMeaning: "P1 for pressure ratio calculation", expertMeaning_i18n: {"en":"P1 for pressure ratio calculation"} },
    { id: "polytropicExponent", label: "Polytropic exponent n", label_i18n: {"en":"Polytropic exponent n"}, type: "number", unit: "", required: false, smartDefault: 1.35, validation: { min: 1, max: 1.67 }, helper: "n = 1.0 for isothermal, 1.4 for isentropic (air), typical 1.25-1.35 for screw compressors.", helper_i18n: {"en":"n = 1.0 for isothermal, 1.4 for isentropic (air), typical 1.25-1.35 for screw compressors."}, expertMeaning: "Polytropic exponent for real gas compression work", expertMeaning_i18n: {"en":"Polytropic exponent for real gas compression work"} },
    { id: "isentropicEfficiency", label: "Isentropic efficiency \u03b7_is", label_i18n: {"en":"Isentropic efficiency \u03b7_is"}, type: "number", unit: "%", required: true, smartDefault: 82, validation: { min: 30, max: 100 }, helper: "Compressor stage isentropic efficiency (screw: 75-85%, centrifugal: 80-88%).", helper_i18n: {"en":"Compressor stage isentropic efficiency (screw: 75-85%, centrifugal: 80-88%)."}, expertMeaning: "\u03b7_is = W_is / W_actual", expertMeaning_i18n: {"en":"\u03b7_is = W_is / W_actual"} },
    { id: "mechanicalEfficiency", label: "Mechanical efficiency \u03b7_m", label_i18n: {"en":"Mechanical efficiency \u03b7_m"}, type: "number", unit: "%", required: false, smartDefault: 95, validation: { min: 50, max: 100 }, helper: "Gears, bearings, seals efficiency.", helper_i18n: {"en":"Gears, bearings, seals efficiency."}, expertMeaning: "W_shaft = W_actual / \u03b7_m", expertMeaning_i18n: {"en":"W_shaft = W_actual / \u03b7_m"} },
    { id: "motorEfficiency", label: "Motor efficiency \u03b7_el", label_i18n: {"en":"Motor efficiency \u03b7_el"}, type: "number", unit: "%", required: false, smartDefault: 93, validation: { min: 50, max: 100 }, helper: "Electric motor efficiency (IE3: 93-95%, IE4: 95-97%).", helper_i18n: {"en":"Electric motor efficiency (IE3: 93-95%, IE4: 95-97%)."}, expertMeaning: "P_motor = W_shaft / \u03b7_el", expertMeaning_i18n: {"en":"P_motor = W_shaft / \u03b7_el"} },
    { id: "stageCount", label: "Stage count z", label_i18n: {"en":"Stage count z"}, type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 1, max: 6 }, helper: "Number of compression stages (1 for single-stage, 2+ for intercooled).", helper_i18n: {"en":"Number of compression stages (1 for single-stage, 2+ for intercooled)."}, expertMeaning: "Stage pressure ratio: \u03a0^(1/z)", expertMeaning_i18n: {"en":"Stage pressure ratio: \u03a0^(1/z)"} },
    { id: "annualOperatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "h/year", required: false, smartDefault: 6000, validation: { min: 0, max: 8760 }, helper: "Full-load equivalent operating hours per year.", helper_i18n: {"en":"Full-load equivalent operating hours per year."}, expertMeaning: "For annual energy: kWh = P_motor \u00d7 hours", expertMeaning_i18n: {"en":"For annual energy: kWh = P_motor \u00d7 hours"} },
    { id: "electricityTariff", label: "Electricity tariff", label_i18n: {"en":"Electricity tariff"}, type: "select", unit: "", required: false, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "Currency for annual cost calculation.", helper_i18n: {"en":"Currency for annual cost calculation."}, expertMeaning: "Annual cost = kWh \u00d7 tariff_rate", expertMeaning_i18n: {"en":"Annual cost = kWh \u00d7 tariff_rate"} },
  ],
  outputs: [
    { id: "motorPowerkW", label: "Motor power P_motor", label_i18n: {"en":"Motor power P_motor"}, unit: "kW", format: "number", isBigNumber: false },
    { id: "motorPowerHP", label: "Motor power P_motor", label_i18n: {"en":"Motor power P_motor"}, unit: "HP", format: "number" },
    { id: "specificPower", label: "Specific power", label_i18n: {"en":"Specific power"}, unit: "kW/(m\u00b3/min)", format: "number" },
    { id: "exitTemperatureC", label: "Discharge temperature T\u2082", label_i18n: {"en":"Discharge temperature T\u2082"}, unit: "\u00b0C", format: "number" },
    { id: "annualEnergykWh", label: "Annual energy consumption", label_i18n: {"en":"Annual energy consumption"}, unit: "kWh", format: "number", isBigNumber: true },
    { id: "annualCost", label: "Annual energy cost", label_i18n: {"en":"Annual energy cost"}, unit: "currency", format: "currency", isBigNumber: false },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.compressor_power", inputMap: { airFlowRate: "airFlowRate", operatingPressure: "operatingPressure", inletTemperature: "inletTemperature", inletPressure: "inletPressure", polytropicExponent: "polytropicExponent", isentropicEfficiency: "isentropicEfficiency", mechanicalEfficiency: "mechanicalEfficiency", motorEfficiency: "motorEfficiency", stageCount: "stageCount", annualOperatingHours: "annualOperatingHours", electricityTariff: "electricityTariff" }, outputId: "motorPowerkW" }],
  reportTemplate: { title: "Compressor Power & Air Flow Report", title_i18n: {"en":"Compressor Power & Air Flow Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Compressor work based on polytropic compression model.", "Interstage cooling assumed perfect for multi-stage (T\u2081 = T\u2081 at each stage).", "Atmospheric pressure assumed 1.013 bar abs at sea level.", "Annual cost requires electricity tariff input; default shown in selected currency."] },
};

const MATERIAL_OPTIONS = [
  { value: "steel", label: "Steel (kc1=1780 N/mm\u00b2, mc=0.26)", label_i18n: {"en":"Steel (kc1=1780 N/mm\u00b2, mc=0.26)"} },
  { value: "stainless", label: "Stainless steel (kc1=2400 N/mm\u00b2, mc=0.23)", label_i18n: {"en":"Stainless steel (kc1=2400 N/mm\u00b2, mc=0.23)"} },
  { value: "aluminum", label: "Aluminum (kc1=800 N/mm\u00b2, mc=0.28)", label_i18n: {"en":"Aluminum (kc1=800 N/mm\u00b2, mc=0.28)"} },
  { value: "cast_iron", label: "Cast iron (kc1=1400 N/mm\u00b2, mc=0.23)", label_i18n: {"en":"Cast iron (kc1=1400 N/mm\u00b2, mc=0.23)"} },
  { value: "brass", label: "Brass (kc1=900 N/mm\u00b2, mc=0.28)", label_i18n: {"en":"Brass (kc1=900 N/mm\u00b2, mc=0.28)"} },
  { value: "titanium", label: "Titanium (kc1=1850 N/mm\u00b2, mc=0.18)", label_i18n: {"en":"Titanium (kc1=1850 N/mm\u00b2, mc=0.18)"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 20. Cutting Parameters & Power Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const CUTTING_PARAMETERS_POWER_SCHEMA: PremiumCalculatorSchema = {
  id: "cutting-parameters-power-calculator",
  legacyPaidSlug: "cutting-parameters-power-calculator",
  name: "Cutting Parameters & Power Calculator", name_i18n: {"en":"Cutting Parameters & Power Calculator"},
  sectorSlug: "metal-fabrication",
  category: "measurement",
  painStatement: "Blind cutting parameter selection causes tool breakage, chatter, and poor surface finish \u2014 each minute of trial-and-error at \u20ac150+ machine-hour rate burns budget before a single good part is made.", painStatement_i18n: {"en":"Blind cutting parameter selection causes tool breakage, chatter, and poor surface finish \u2014 each minute of trial-and-error at \u20ac150+ machine-hour rate burns budget before a single good part is made."},
  inputs: [
    { id: "workpieceMaterial", label: "Workpiece material", label_i18n: {"en":"Workpiece material"}, type: "select", unit: "", required: true, smartDefault: "steel", options: [...MATERIAL_OPTIONS], helper: "Material determines specific cutting force kc1 and exponent mc.", helper_i18n: {"en":"Material determines specific cutting force kc1 and exponent mc."}, expertMeaning: "kc = kc1 \u00d7 (hm^(-mc)) \u00d7 (1 - \u03b3\u2080/100) correction", expertMeaning_i18n: {"en":"kc = kc1 \u00d7 (hm^(-mc)) \u00d7 (1 - \u03b3\u2080/100) correction"} },
    { id: "toolDiameter", label: "Tool diameter Dc", label_i18n: {"en":"Tool diameter Dc"}, type: "number", unit: "mm", required: true, smartDefault: 20, validation: { min: 0.5 }, helper: "Cutting tool outer diameter.", helper_i18n: {"en":"Cutting tool outer diameter."}, expertMeaning: "Dc for n = 1000\u00d7Vc/(\u03c0\u00d7Dc)", expertMeaning_i18n: {"en":"Dc for n = 1000\u00d7Vc/(\u03c0\u00d7Dc)"} },
    { id: "toothCount", label: "Number of teeth z", label_i18n: {"en":"Number of teeth z"}, type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1, max: 200 }, helper: "Number of cutting edges on the tool.", helper_i18n: {"en":"Number of cutting edges on the tool."}, expertMeaning: "z for feed speed: Vf = fz \u00d7 z \u00d7 n", expertMeaning_i18n: {"en":"z for feed speed: Vf = fz \u00d7 z \u00d7 n"} },
    { id: "cuttingSpeed", label: "Cutting speed Vc", label_i18n: {"en":"Cutting speed Vc"}, type: "number", unit: "m/min", required: true, smartDefault: 200, validation: { min: 1 }, helper: "Peripheral speed of the cutting tool.", helper_i18n: {"en":"Peripheral speed of the cutting tool."}, expertMeaning: "Vc for spindle speed: n = 1000\u00d7Vc/(\u03c0\u00d7Dc)", expertMeaning_i18n: {"en":"Vc for spindle speed: n = 1000\u00d7Vc/(\u03c0\u00d7Dc)"} },
    { id: "feedPerTooth", label: "Feed per tooth fz", label_i18n: {"en":"Feed per tooth fz"}, type: "number", unit: "mm/tooth", required: true, smartDefault: 0.1, validation: { min: 0.001 }, helper: "Advance per cutting edge per revolution.", helper_i18n: {"en":"Advance per cutting edge per revolution."}, expertMeaning: "fz for Vf = fz \u00d7 z \u00d7 n and hm = fz \u00d7 ae/Dc", expertMeaning_i18n: {"en":"fz for Vf = fz \u00d7 z \u00d7 n and hm = fz \u00d7 ae/Dc"} },
    { id: "depthOfCut", label: "Depth of cut ap", label_i18n: {"en":"Depth of cut ap"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "Axial depth of cut.", helper_i18n: {"en":"Axial depth of cut."}, expertMeaning: "ap for MRR = ap \u00d7 ae \u00d7 Vf / 1000", expertMeaning_i18n: {"en":"ap for MRR = ap \u00d7 ae \u00d7 Vf / 1000"} },
    { id: "cuttingWidth", label: "Cutting width ae", label_i18n: {"en":"Cutting width ae"}, type: "number", unit: "mm", required: true, smartDefault: 16, validation: { min: 0.01 }, helper: "Radial width of cut (ae \u2264 Dc for full slotting).", helper_i18n: {"en":"Radial width of cut (ae \u2264 Dc for full slotting)."}, expertMeaning: "ae for engagement angle and chip thickness", expertMeaning_i18n: {"en":"ae for engagement angle and chip thickness"} },
    { id: "specificCuttingForce", label: "Specific cutting force kc1", label_i18n: {"en":"Specific cutting force kc1"}, type: "number", unit: "N/mm\u00b2", required: false, smartDefault: 1780, validation: { min: 100 }, helper: "Unit-specific cutting force at 1 mm\u00b2 chip section (auto-filled from material).", helper_i18n: {"en":"Unit-specific cutting force at 1 mm\u00b2 chip section (auto-filled from material)."}, expertMeaning: "kc1 for corrected kc = kc1 \u00d7 hm^(-mc)", expertMeaning_i18n: {"en":"kc1 for corrected kc = kc1 \u00d7 hm^(-mc)"} },
    { id: "materialExponent", label: "Material exponent mc", label_i18n: {"en":"Material exponent mc"}, type: "number", unit: "", required: false, smartDefault: 0.26, validation: { min: 0.1, max: 0.5 }, helper: "Chip thickness correction exponent (auto-filled from material).", helper_i18n: {"en":"Chip thickness correction exponent (auto-filled from material)."}, expertMeaning: "mc for kc correction in Kienzle formula", expertMeaning_i18n: {"en":"mc for kc correction in Kienzle formula"} },
    { id: "machineEfficiency", label: "Machine efficiency \u03b7", label_i18n: {"en":"Machine efficiency \u03b7"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 30, max: 100 }, helper: "Spindle drive mechanical efficiency.", helper_i18n: {"en":"Spindle drive mechanical efficiency."}, expertMeaning: "P_motor = Pc / \u03b7", expertMeaning_i18n: {"en":"P_motor = Pc / \u03b7"} },
  ],
  outputs: [
    { id: "spindleSpeedRpm", label: "Spindle speed n", label_i18n: {"en":"Spindle speed n"}, unit: "rpm", format: "number" },
    { id: "feedSpeedMmMin", label: "Feed speed Vf", label_i18n: {"en":"Feed speed Vf"}, unit: "mm/min", format: "number" },
    { id: "cuttingForceN", label: "Cutting force Fc", label_i18n: {"en":"Cutting force Fc"}, unit: "N", format: "number" },
    { id: "torqueNm", label: "Torque Tc", label_i18n: {"en":"Torque Tc"}, unit: "Nm", format: "number" },
    { id: "cuttingPowerkW", label: "Cutting power Pc", label_i18n: {"en":"Cutting power Pc"}, unit: "kW", format: "number" },
    { id: "motorPowerkW", label: "Motor power P_motor", label_i18n: {"en":"Motor power P_motor"}, unit: "kW", format: "number" },
    { id: "mrrCm3Min", label: "Material removal rate MRR", label_i18n: {"en":"Material removal rate MRR"}, unit: "cm\u00b3/min", format: "number" },
    { id: "surfaceRoughnessRa", label: "Surface roughness Ra", label_i18n: {"en":"Surface roughness Ra"}, unit: "\u00b5m", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.cutting_power", inputMap: { workpieceMaterial: "workpieceMaterial", toolDiameter: "toolDiameter", toothCount: "toothCount", cuttingSpeed: "cuttingSpeed", feedPerTooth: "feedPerTooth", depthOfCut: "depthOfCut", cuttingWidth: "cuttingWidth", specificCuttingForce: "specificCuttingForce", materialExponent: "materialExponent", machineEfficiency: "machineEfficiency" }, outputId: "cuttingPowerkW" }],
  reportTemplate: { title: "Cutting Parameters & Power Report", title_i18n: {"en":"Cutting Parameters & Power Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Kienzle-Victor cutting force model: kc = kc1 \u00d7 hm^(-mc).", "Surface roughness Ra \u2248 fz\u00b2/(8\u00d7re) for theoretical finish.", "Machine efficiency includes spindle and drive train losses.", "Cutting tool assumed sharp; wear factor not included."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 21. Evaporative Cooling (FES) Capacity Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const EVAPORATIVE_COOLING_CAPACITY_SCHEMA: PremiumCalculatorSchema = {
  id: "evaporative-cooling-capacity-calculator",
  legacyPaidSlug: "evaporative-cooling-capacity-calculator",
  name: "Evaporative Cooling (FES) Capacity Calculator", name_i18n: {"en":"Evaporative Cooling (FES) Capacity Calculator"},
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Industrial facilities waste 30-50% of cooling energy by running conventional HVAC instead of evaporative cooling \u2014 a retrofit decision needs airflow, psychrometric, and annual cost savings computed together.", painStatement_i18n: {"en":"Industrial facilities waste 30-50% of cooling energy by running conventional HVAC instead of evaporative cooling \u2014 a retrofit decision needs airflow, psychrometric, and annual cost savings computed together."},
  inputs: [
    { id: "areaLength", label: "Area length L", label_i18n: {"en":"Area length L"}, type: "number", unit: "m", required: true, smartDefault: 60, validation: { min: 1 }, helper: "Building or zone length.", helper_i18n: {"en":"Building or zone length."}, expertMeaning: "Volume = L \u00d7 W \u00d7 H", expertMeaning_i18n: {"en":"Volume = L \u00d7 W \u00d7 H"} },
    { id: "areaWidth", label: "Area width W", label_i18n: {"en":"Area width W"}, type: "number", unit: "m", required: true, smartDefault: 40, validation: { min: 1 }, helper: "Building or zone width.", helper_i18n: {"en":"Building or zone width."}, expertMeaning: "Volume = L \u00d7 W \u00d7 H", expertMeaning_i18n: {"en":"Volume = L \u00d7 W \u00d7 H"} },
    { id: "ceilingHeight", label: "Ceiling height H", label_i18n: {"en":"Ceiling height H"}, type: "number", unit: "m", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Average ceiling height.", helper_i18n: {"en":"Average ceiling height."}, expertMeaning: "Volume for ACH-based airflow", expertMeaning_i18n: {"en":"Volume for ACH-based airflow"} },
    { id: "achValue", label: "ACH requirement", label_i18n: {"en":"ACH requirement"}, type: "number", unit: "1/h", required: true, smartDefault: 30, validation: { min: 1, max: 120 }, helper: "Air changes per hour required (industrial: 15-60 ACH).", helper_i18n: {"en":"Air changes per hour required (industrial: 15-60 ACH)."}, expertMeaning: "Total airflow = Volume \u00d7 ACH", expertMeaning_i18n: {"en":"Total airflow = Volume \u00d7 ACH"} },
    { id: "outdoorDryBulb", label: "Outdoor dry-bulb T_db", label_i18n: {"en":"Outdoor dry-bulb T_db"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 38, validation: { min: -10, max: 55 }, helper: "Summer design dry-bulb temperature.", helper_i18n: {"en":"Summer design dry-bulb temperature."}, expertMeaning: "T_db for evaporative cooling potential", expertMeaning_i18n: {"en":"T_db for evaporative cooling potential"} },
    { id: "outdoorWetBulb", label: "Outdoor wet-bulb T_wb", label_i18n: {"en":"Outdoor wet-bulb T_wb"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 22, validation: { min: -20, max: 40 }, helper: "Summer design wet-bulb temperature.", helper_i18n: {"en":"Summer design wet-bulb temperature."}, expertMeaning: "T_wb for saturation efficiency: \u0394T = \u03b7\u00d7(T_db-T_wb)", expertMeaning_i18n: {"en":"T_wb for saturation efficiency: \u0394T = \u03b7\u00d7(T_db-T_wb)"} },
    { id: "padEfficiency", label: "Pad efficiency \u03b7_pad", label_i18n: {"en":"Pad efficiency \u03b7_pad"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 40, max: 100 }, helper: "Evaporative media saturation efficiency (CELdek: 80-90%).", helper_i18n: {"en":"Evaporative media saturation efficiency (CELdek: 80-90%)."}, expertMeaning: "\u03b7 = (T_db_in - T_db_out)/(T_db_in - T_wb_in)", expertMeaning_i18n: {"en":"\u03b7 = (T_db_in - T_db_out)/(T_db_in - T_wb_in)"} },
    { id: "unitAirflow", label: "Unit airflow rate", label_i18n: {"en":"Unit airflow rate"}, type: "number", unit: "m\u00b3/h", required: true, smartDefault: 30000, validation: { min: 100 }, helper: "Airflow per FES unit.", helper_i18n: {"en":"Airflow per FES unit."}, expertMeaning: "Number of units = Total airflow / Unit airflow (rounded up)", expertMeaning_i18n: {"en":"Number of units = Total airflow / Unit airflow (rounded up)"} },
    { id: "unitPower", label: "Unit power", label_i18n: {"en":"Unit power"}, type: "number", unit: "kW", required: true, smartDefault: 1.5, validation: { min: 0.1 }, helper: "Electrical power per FES unit (fan + pump).", helper_i18n: {"en":"Electrical power per FES unit (fan + pump)."}, expertMeaning: "Total FES power = Unit count \u00d7 Unit power", expertMeaning_i18n: {"en":"Total FES power = Unit count \u00d7 Unit power"} },
    { id: "conventionalPower", label: "Conventional system power", label_i18n: {"en":"Conventional system power"}, type: "number", unit: "kW", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "Equivalent conventional HVAC electrical power.", helper_i18n: {"en":"Equivalent conventional HVAC electrical power."}, expertMeaning: "Baseline for energy saving calculation", expertMeaning_i18n: {"en":"Baseline for energy saving calculation"} },
    { id: "unitWaterConsumption", label: "Unit water consumption", label_i18n: {"en":"Unit water consumption"}, type: "number", unit: "L/h", required: true, smartDefault: 20, validation: { min: 0 }, helper: "Water consumption per FES unit.", helper_i18n: {"en":"Water consumption per FES unit."}, expertMeaning: "Annual water = Unit consumption \u00d7 Units \u00d7 Hours", expertMeaning_i18n: {"en":"Annual water = Unit consumption \u00d7 Units \u00d7 Hours"} },
    { id: "electricityTariff", label: "Electricity tariff", label_i18n: {"en":"Electricity tariff"}, type: "select", unit: "", required: false, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "Currency for annual cost calculation.", helper_i18n: {"en":"Currency for annual cost calculation."}, expertMeaning: "Annual cost = kWh \u00d7 tariff_rate / 100", expertMeaning_i18n: {"en":"Annual cost = kWh \u00d7 tariff_rate / 100"} },
    { id: "waterTariff", label: "Water tariff", label_i18n: {"en":"Water tariff"}, type: "select", unit: "", required: false, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "Currency for water cost calculation.", helper_i18n: {"en":"Currency for water cost calculation."}, expertMeaning: "Annual water cost = m\u00b3 \u00d7 tariff_rate", expertMeaning_i18n: {"en":"Annual water cost = m\u00b3 \u00d7 tariff_rate"} },
    { id: "dailyOperatingHours", label: "Daily operating hours", label_i18n: {"en":"Daily operating hours"}, type: "number", unit: "h/day", required: true, smartDefault: 10, validation: { min: 0, max: 24 }, helper: "Operating hours per day.", helper_i18n: {"en":"Operating hours per day."}, expertMeaning: "Annual hours = Daily hours \u00d7 Annual days", expertMeaning_i18n: {"en":"Annual hours = Daily hours \u00d7 Annual days"} },
    { id: "annualOperatingDays", label: "Annual operating days", label_i18n: {"en":"Annual operating days"}, type: "number", unit: "day/year", required: true, smartDefault: 260, validation: { min: 1, max: 365 }, helper: "Operating days per year.", helper_i18n: {"en":"Operating days per year."}, expertMeaning: "Annual hours = Daily hours \u00d7 Annual days", expertMeaning_i18n: {"en":"Annual hours = Daily hours \u00d7 Annual days"} },
  ],
  outputs: [
    { id: "volumeM3", label: "Zone volume", label_i18n: {"en":"Zone volume"}, unit: "m\u00b3", format: "number" },
    { id: "totalAirflow", label: "Total airflow required", label_i18n: {"en":"Total airflow required"}, unit: "m\u00b3/h", format: "number" },
    { id: "dischargeTemperature", label: "Supply air temperature", label_i18n: {"en":"Supply air temperature"}, unit: "\u00b0C", format: "number" },
    { id: "temperatureDrop", label: "Temperature drop \u0394T", label_i18n: {"en":"Temperature drop \u0394T"}, unit: "\u00b0C", format: "number" },
    { id: "unitCount", label: "Number of FES units", label_i18n: {"en":"Number of FES units"}, unit: "", format: "number" },
    { id: "totalPowerFES", label: "Total FES power", label_i18n: {"en":"Total FES power"}, unit: "kW", format: "number" },
    { id: "annualEnergyFES", label: "Annual FES energy", label_i18n: {"en":"Annual FES energy"}, unit: "kWh", format: "number", isBigNumber: true },
    { id: "annualEnergyConv", label: "Annual conventional energy", label_i18n: {"en":"Annual conventional energy"}, unit: "kWh", format: "number", isBigNumber: true },
    { id: "energySavingskWh", label: "Energy savings", label_i18n: {"en":"Energy savings"}, unit: "kWh", format: "number", isBigNumber: true },
    { id: "energySavingsPct", label: "Energy savings", label_i18n: {"en":"Energy savings"}, unit: "%", format: "percentage" },
    { id: "annualElectricCostFES", label: "Annual FES electricity cost", label_i18n: {"en":"Annual FES electricity cost"}, unit: "currency", format: "currency" },
    { id: "annualWaterCost", label: "Annual water cost", label_i18n: {"en":"Annual water cost"}, unit: "currency", format: "currency" },
    { id: "totalSavings", label: "Total annual savings", label_i18n: {"en":"Total annual savings"}, unit: "currency", format: "currency", isBigNumber: false },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.evaporative_cooling", inputMap: { areaLength: "areaLength", areaWidth: "areaWidth", ceilingHeight: "ceilingHeight", achValue: "achValue", outdoorDryBulb: "outdoorDryBulb", outdoorWetBulb: "outdoorWetBulb", padEfficiency: "padEfficiency", unitAirflow: "unitAirflow", unitPower: "unitPower", conventionalPower: "conventionalPower", unitWaterConsumption: "unitWaterConsumption", electricityTariff: "electricityTariff", waterTariff: "waterTariff", dailyOperatingHours: "dailyOperatingHours", annualOperatingDays: "annualOperatingDays" }, outputId: "totalSavings" }],
  reportTemplate: { title: "Evaporative Cooling (FES) Capacity Report", title_i18n: {"en":"Evaporative Cooling (FES) Capacity Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Pad efficiency based on manufacturer data at nominal face velocity.", "Conventional system power is baseline for comparison; actual savings may vary.", "Water consumption includes evaporation + bleed-off at typical concentration ratio.", "Annual hours = daily hours \u00d7 annual days; assumes full-load operation."] },
};

const CAPACITY_UNIT_OPTIONS = [
  { value: "kW", label: "kW", label_i18n: {"en":"kW"} },
  { value: "TR", label: "TR (tons of refrigeration)", label_i18n: {"en":"TR (tons of refrigeration)"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 22. Condenser Precooling (Adiabatic) Energy Savings
 * ════════════════════════════════════════════════════════════════════════════ */

const CONDENSER_PRECOOLING_SAVINGS_SCHEMA: PremiumCalculatorSchema = {
  id: "condenser-precooling-savings-calculator",
  legacyPaidSlug: "condenser-precooling-savings-calculator",
  name: "Condenser Precooling (Adiabatic) Energy Savings Calculator", name_i18n: {"en":"Condenser Precooling (Adiabatic) Energy Savings Calculator"},
  sectorSlug: "hvac",
  category: "cost",
  painStatement: "Every 1\u00b0C reduction in condenser inlet temperature cuts chiller energy by 3% \u2014 yet most facilities never calculate the ROI of a simple pre-cooling pad retrofit, leaving thousands in savings on the table.", painStatement_i18n: {"en":"Every 1\u00b0C reduction in condenser inlet temperature cuts chiller energy by 3% \u2014 yet most facilities never calculate the ROI of a simple pre-cooling pad retrofit, leaving thousands in savings on the table."},
  inputs: [
    { id: "chillerCapacity", label: "Chiller capacity", label_i18n: {"en":"Chiller capacity"}, type: "number", unit: "", required: true, smartDefault: 500, validation: { min: 1 }, helper: "Nominal cooling capacity of the chiller.", helper_i18n: {"en":"Nominal cooling capacity of the chiller."}, expertMeaning: "Capacity in selected unit (kW or TR)", expertMeaning_i18n: {"en":"Capacity in selected unit (kW or TR)"} },
    { id: "capacityUnit", label: "Capacity unit", label_i18n: {"en":"Capacity unit"}, type: "select", unit: "", required: true, smartDefault: "kW", options: [...CAPACITY_UNIT_OPTIONS], helper: "Select kW or refrigeration tons.", helper_i18n: {"en":"Select kW or refrigeration tons."}, expertMeaning: "1 TR = 3.517 kW", expertMeaning_i18n: {"en":"1 TR = 3.517 kW"} },
    { id: "existingCOP", label: "Existing COP", label_i18n: {"en":"Existing COP"}, type: "number", unit: "", required: true, smartDefault: 3.5, validation: { min: 1, max: 10 }, helper: "Current coefficient of performance of the chiller.", helper_i18n: {"en":"Current coefficient of performance of the chiller."}, expertMeaning: "COP = Cooling output / Electrical input", expertMeaning_i18n: {"en":"COP = Cooling output / Electrical input"} },
    { id: "condenserInletTemp", label: "Condenser inlet temp T_cond", label_i18n: {"en":"Condenser inlet temp T_cond"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 38, validation: { min: -10, max: 60 }, helper: "Current condenser entering air temperature.", helper_i18n: {"en":"Current condenser entering air temperature."}, expertMeaning: "Baseline for precooling \u0394T calculation", expertMeaning_i18n: {"en":"Baseline for precooling \u0394T calculation"} },
    { id: "wetBulbTemp", label: "Wet-bulb temperature T_wb", label_i18n: {"en":"Wet-bulb temperature T_wb"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 22, validation: { min: -20, max: 40 }, helper: "Design wet-bulb temperature at site.", helper_i18n: {"en":"Design wet-bulb temperature at site."}, expertMeaning: "Determines adiabatic cooling potential", expertMeaning_i18n: {"en":"Determines adiabatic cooling potential"} },
    { id: "precoolEfficiency", label: "Precooling efficiency \u03b7", label_i18n: {"en":"Precooling efficiency \u03b7"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 30, max: 100 }, helper: "Adiabatic pad saturation efficiency.", helper_i18n: {"en":"Adiabatic pad saturation efficiency."}, expertMeaning: "T_new = T_cond - \u03b7\u00d7(T_cond - T_wb)", expertMeaning_i18n: {"en":"T_new = T_cond - \u03b7\u00d7(T_cond - T_wb)"} },
    { id: "annualOperatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "h/year", required: true, smartDefault: 4000, validation: { min: 0, max: 8760 }, helper: "Full-load chiller operating hours per year.", helper_i18n: {"en":"Full-load chiller operating hours per year."}, expertMeaning: "Annual kWh = Power(kW) \u00d7 hours", expertMeaning_i18n: {"en":"Annual kWh = Power(kW) \u00d7 hours"} },
    { id: "electricityTariff", label: "Electricity tariff", label_i18n: {"en":"Electricity tariff"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "Currency for cost calculations.", helper_i18n: {"en":"Currency for cost calculations."}, expertMeaning: "Annual cost = kWh \u00d7 tariff_rate / 100", expertMeaning_i18n: {"en":"Annual cost = kWh \u00d7 tariff_rate / 100"} },
    { id: "precoolSystemCost", label: "Precooling system cost", label_i18n: {"en":"Precooling system cost"}, type: "number", unit: "currency", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "Total installed cost of precooling system.", helper_i18n: {"en":"Total installed cost of precooling system."}, expertMeaning: "CAPEX for payback calculation", expertMeaning_i18n: {"en":"CAPEX for payback calculation"} },
    { id: "precoolOpex", label: "Precooling opex", label_i18n: {"en":"Precooling opex"}, type: "number", unit: "currency", required: false, smartDefault: 500, validation: { min: 0 }, helper: "Annual operating cost of precooling system (water, maintenance).", helper_i18n: {"en":"Annual operating cost of precooling system (water, maintenance)."}, expertMeaning: "Annual OPEX for net savings calculation", expertMeaning_i18n: {"en":"Annual OPEX for net savings calculation"} },
  ],
  outputs: [
    { id: "capacityKW", label: "Chiller capacity", label_i18n: {"en":"Chiller capacity"}, unit: "kW", format: "number" },
    { id: "newCondenserTemp", label: "New condenser inlet temp", label_i18n: {"en":"New condenser inlet temp"}, unit: "\u00b0C", format: "number" },
    { id: "newCOP", label: "Improved COP", label_i18n: {"en":"Improved COP"}, unit: "", format: "number" },
    { id: "existingPower", label: "Existing chiller power", label_i18n: {"en":"Existing chiller power"}, unit: "kW", format: "number" },
    { id: "newPower", label: "New chiller power", label_i18n: {"en":"New chiller power"}, unit: "kW", format: "number" },
    { id: "powerSavingsKW", label: "Power savings", label_i18n: {"en":"Power savings"}, unit: "kW", format: "number" },
    { id: "annualSavingsKWh", label: "Annual energy savings", label_i18n: {"en":"Annual energy savings"}, unit: "kWh", format: "number", isBigNumber: true },
    { id: "annualSavings", label: "Annual cost savings", label_i18n: {"en":"Annual cost savings"}, unit: "currency", format: "currency", isBigNumber: false },
    { id: "netSavings", label: "Net annual savings", label_i18n: {"en":"Net annual savings"}, unit: "currency", format: "currency" },
    { id: "paybackMonths", label: "Payback period", label_i18n: {"en":"Payback period"}, unit: "months", format: "duration" },
    { id: "roi", label: "ROI", label_i18n: {"en":"ROI"}, unit: "%", format: "percentage" },
    { id: "co2Reduction", label: "CO\u2082 reduction", label_i18n: {"en":"CO\u2082 reduction"}, unit: "tCO\u2082e", format: "number" },
  ],
  thresholds: [{ fieldId: "paybackMonths", warning: 36, critical: 60, direction: "higher_is_bad", warningMessage: "Payback longer than 3 years \u2014 review system cost.", warningMessage_i18n: {"en":"Payback longer than 3 years \u2014 review system cost."}, criticalMessage: "Payback exceeds 5 years \u2014 precooling may not be economical.", criticalMessage_i18n: {"en":"Payback exceeds 5 years \u2014 precooling may not be economical."} }],
  formulaPipeline: [{ formulaId: "industrial.condenser_precooling", inputMap: { chillerCapacity: "chillerCapacity", capacityUnit: "capacityUnit", existingCOP: "existingCOP", condenserInletTemp: "condenserInletTemp", wetBulbTemp: "wetBulbTemp", precoolEfficiency: "precoolEfficiency", annualOperatingHours: "annualOperatingHours", electricityTariff: "electricityTariff", precoolSystemCost: "precoolSystemCost", precoolOpex: "precoolOpex" }, outputId: "annualSavings" }],
  reportTemplate: { title: "Condenser Precooling Energy Savings Report", title_i18n: {"en":"Condenser Precooling Energy Savings Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["COP improvement estimated at 3% per \u00b0C condenser temperature reduction.", "Adiabatic precooling effectiveness depends on ambient humidity conditions.", "System cost and opex are user estimates; obtain vendor quotes for final decision.", "CO\u2082 reduction based on grid average emission factor (0.4 kgCO\u2082e/kWh)."] },
};

const PAD_TYPE_OPTIONS = [
  { value: "CELdek_7090", label: "CELdek 7090 (\u03b7~90%, \u0394P~15 Pa @ 2 m/s)", label_i18n: {"en":"CELdek 7090 (\u03b7~90%, \u0394P~15 Pa @ 2 m/s)"} },
  { value: "CELdek_5090", label: "CELdek 5090 (\u03b7~85%, \u0394P~12 Pa @ 2 m/s)", label_i18n: {"en":"CELdek 5090 (\u03b7~85%, \u0394P~12 Pa @ 2 m/s)"} },
  { value: "GLASdek", label: "GLASdek (\u03b7~80%, \u0394P~10 Pa @ 2 m/s)", label_i18n: {"en":"GLASdek (\u03b7~80%, \u0394P~10 Pa @ 2 m/s)"} },
] as const;

const PAD_THICKNESS_OPTIONS = [
  { value: "100", label: "100 mm", label_i18n: {"en":"100 mm"} },
  { value: "150", label: "150 mm", label_i18n: {"en":"150 mm"} },
  { value: "200", label: "200 mm", label_i18n: {"en":"200 mm"} },
  { value: "300", label: "300 mm", label_i18n: {"en":"300 mm"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 23. Pad Media (CELdek/GLASdek) Psychrometric Analysis
 * ════════════════════════════════════════════════════════════════════════════ */

const PAD_MEDIA_PSYCHROMETRIC_SCHEMA: PremiumCalculatorSchema = {
  id: "pad-media-psychrometric-calculator",
  legacyPaidSlug: "pad-media-psychrometric-calculator",
  name: "Pad Media (CELdek/GLASdek) Psychrometric Analysis", name_i18n: {"en":"Pad Media (CELdek/GLASdek) Psychrometric Analysis"},
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Pad media selection without psychrometric analysis leads to wrong thickness, undersized face area, and inadequate cooling \u2014 a 10% efficiency miss means 3-5\u00b0C warmer supply air on peak days.", painStatement_i18n: {"en":"Pad media selection without psychrometric analysis leads to wrong thickness, undersized face area, and inadequate cooling \u2014 a 10% efficiency miss means 3-5\u00b0C warmer supply air on peak days."},
  inputs: [
    { id: "padType", label: "Pad type", label_i18n: {"en":"Pad type"}, type: "select", unit: "", required: true, smartDefault: "CELdek_7090", options: [...PAD_TYPE_OPTIONS], helper: "Evaporative media type and grade.", helper_i18n: {"en":"Evaporative media type and grade."}, expertMeaning: "Determines saturation efficiency and pressure drop curves", expertMeaning_i18n: {"en":"Determines saturation efficiency and pressure drop curves"} },
    { id: "padThickness", label: "Pad thickness t", label_i18n: {"en":"Pad thickness t"}, type: "select", unit: "", required: true, smartDefault: "150", options: [...PAD_THICKNESS_OPTIONS], helper: "Media thickness in mm (nominal).", helper_i18n: {"en":"Media thickness in mm (nominal)."}, expertMeaning: "Thicker media = higher efficiency + higher pressure drop", expertMeaning_i18n: {"en":"Thicker media = higher efficiency + higher pressure drop"} },
    { id: "faceVelocity", label: "Face velocity V", label_i18n: {"en":"Face velocity V"}, type: "number", unit: "m/s", required: true, smartDefault: 2, validation: { min: 0.5, max: 4 }, helper: "Air velocity at pad face (CELdek: 1.5-3 m/s recommended).", helper_i18n: {"en":"Air velocity at pad face (CELdek: 1.5-3 m/s recommended)."}, expertMeaning: "V for pressure drop and contact time", expertMeaning_i18n: {"en":"V for pressure drop and contact time"} },
    { id: "padArea", label: "Pad face area A", label_i18n: {"en":"Pad face area A"}, type: "number", unit: "m\u00b2", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "Total pad face area (height \u00d7 width).", helper_i18n: {"en":"Total pad face area (height \u00d7 width)."}, expertMeaning: "Airflow = A \u00d7 V \u00d7 3600", expertMeaning_i18n: {"en":"Airflow = A \u00d7 V \u00d7 3600"} },
    { id: "inletDryBulb", label: "Inlet dry-bulb T_db", label_i18n: {"en":"Inlet dry-bulb T_db"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 38, validation: { min: -10, max: 55 }, helper: "Entering air dry-bulb temperature.", helper_i18n: {"en":"Entering air dry-bulb temperature."}, expertMeaning: "T_db for saturation efficiency calculation", expertMeaning_i18n: {"en":"T_db for saturation efficiency calculation"} },
    { id: "inletWetBulb", label: "Inlet wet-bulb T_wb", label_i18n: {"en":"Inlet wet-bulb T_wb"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 22, validation: { min: -20, max: 40 }, helper: "Entering air wet-bulb temperature.", helper_i18n: {"en":"Entering air wet-bulb temperature."}, expertMeaning: "T_wb for psychrometric cooling limit", expertMeaning_i18n: {"en":"T_wb for psychrometric cooling limit"} },
    { id: "inletRH", label: "Inlet relative humidity", label_i18n: {"en":"Inlet relative humidity"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "Entering air relative humidity.", helper_i18n: {"en":"Entering air relative humidity."}, expertMeaning: "RH for enthalpy-based saturation check", expertMeaning_i18n: {"en":"RH for enthalpy-based saturation check"} },
    { id: "barometricPressure", label: "Barometric pressure", label_i18n: {"en":"Barometric pressure"}, type: "number", unit: "mbar", required: false, smartDefault: 1013, validation: { min: 800, max: 1100 }, helper: "Site atmospheric pressure (1013 mbar at sea level).", helper_i18n: {"en":"Site atmospheric pressure (1013 mbar at sea level)."}, expertMeaning: "P_bar for psychrometric property correction", expertMeaning_i18n: {"en":"P_bar for psychrometric property correction"} },
  ],
  outputs: [
    { id: "saturationEfficiency", label: "Saturation efficiency \u03b7_sat", label_i18n: {"en":"Saturation efficiency \u03b7_sat"}, unit: "%", format: "percentage" },
    { id: "outletDryBulb", label: "Outlet dry-bulb T_db_out", label_i18n: {"en":"Outlet dry-bulb T_db_out"}, unit: "\u00b0C", format: "number" },
    { id: "temperatureDrop", label: "Temperature drop \u0394T", label_i18n: {"en":"Temperature drop \u0394T"}, unit: "\u00b0C", format: "number" },
    { id: "outletRH", label: "Outlet relative humidity", label_i18n: {"en":"Outlet relative humidity"}, unit: "%", format: "percentage" },
    { id: "airflowM3h", label: "Airflow rate", label_i18n: {"en":"Airflow rate"}, unit: "m\u00b3/h", format: "number" },
    { id: "coolingCapacityKW", label: "Cooling capacity", label_i18n: {"en":"Cooling capacity"}, unit: "kW", format: "number" },
    { id: "waterConsumptionLh", label: "Water consumption", label_i18n: {"en":"Water consumption"}, unit: "L/h", format: "number" },
    { id: "pressureDropPa", label: "Pressure drop \u0394P", label_i18n: {"en":"Pressure drop \u0394P"}, unit: "Pa", format: "number" },
  ],
  thresholds: [{ fieldId: "temperatureDrop", warning: 8, critical: 5, direction: "lower_is_bad", warningMessage: "Temperature drop below 8\u00b0C \u2014 consider thicker media or higher flow.", warningMessage_i18n: {"en":"Temperature drop below 8\u00b0C \u2014 consider thicker media or higher flow."}, criticalMessage: "Temperature drop below 5\u00b0C \u2014 cooling is marginal; review design.", criticalMessage_i18n: {"en":"Temperature drop below 5\u00b0C \u2014 cooling is marginal; review design."} }],
  formulaPipeline: [{ formulaId: "industrial.pad_media_psychrometric", inputMap: { padType: "padType", padThickness: "padThickness", faceVelocity: "faceVelocity", padArea: "padArea", inletDryBulb: "inletDryBulb", inletWetBulb: "inletWetBulb", inletRH: "inletRH", barometricPressure: "barometricPressure" }, outputId: "coolingCapacityKW" }],
  reportTemplate: { title: "Pad Media Psychrometric Analysis Report", title_i18n: {"en":"Pad Media Psychrometric Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Saturation efficiency based on ASHRAE pad media performance data.", "Pressure drop interpolated from manufacturer curves at specified face velocity.", "Outlet RH assumes adiabatic saturation process near constant enthalpy.", "Barometric pressure correction applied for altitude effects on psychrometrics."] },
};

const REFRIGERANT_OPTIONS = [
  { value: "R-134a", label: "R-134a (GWP=1430)", label_i18n: {"en":"R-134a (GWP=1430)"} },
  { value: "R-410A", label: "R-410A (GWP=2088)", label_i18n: {"en":"R-410A (GWP=2088)"} },
  { value: "R-404A", label: "R-404A (GWP=3922)", label_i18n: {"en":"R-404A (GWP=3922)"} },
  { value: "R-407C", label: "R-407C (GWP=1774)", label_i18n: {"en":"R-407C (GWP=1774)"} },
  { value: "R-32", label: "R-32 (GWP=675)", label_i18n: {"en":"R-32 (GWP=675)"} },
  { value: "R-290", label: "R-290 / Propane (GWP=3)", label_i18n: {"en":"R-290 / Propane (GWP=3)"} },
  { value: "R-744", label: "R-744 / CO\u2082 (GWP=1)", label_i18n: {"en":"R-744 / CO\u2082 (GWP=1)"} },
  { value: "other", label: "Other (manual GWP)", label_i18n: {"en":"Other (manual GWP)"} },
] as const;

const TEST_FREQUENCY_OPTIONS = [
  { value: "3ay", label: "Every 3 months (quarterly)", label_i18n: {"en":"Every 3 months (quarterly)"} },
  { value: "6ay", label: "Every 6 months (semi-annual)", label_i18n: {"en":"Every 6 months (semi-annual)"} },
  { value: "12ay", label: "Every 12 months (annual)", label_i18n: {"en":"Every 12 months (annual)"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 24. F-Gas Leak & CO\u2082 Equivalent Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const FGAS_LEAK_CO2_SCHEMA: PremiumCalculatorSchema = {
  id: "fgas-leak-co2-calculator",
  legacyPaidSlug: "fgas-leak-co2-calculator",
  name: "F-Gas Leak & CO\u2082 Equivalent Calculator", name_i18n: {"en":"F-Gas Leak & CO\u2082 Equivalent Calculator"},
  sectorSlug: "hvac",
  category: "energy",
  painStatement: "F-gas regulations impose mandatory leak testing and reporting \u2014 a single unaccounted R-404A leak of 50 kg equals 196 tCO\u2082e, equivalent to 42 cars driven for a year, with fines up to \u20ac50,000 for non-compliance.", painStatement_i18n: {"en":"F-gas regulations impose mandatory leak testing and reporting \u2014 a single unaccounted R-404A leak of 50 kg equals 196 tCO\u2082e, equivalent to 42 cars driven for a year, with fines up to \u20ac50,000 for non-compliance."},
  inputs: [
    { id: "refrigerantType", label: "Refrigerant type", label_i18n: {"en":"Refrigerant type"}, type: "select", unit: "", required: true, smartDefault: "R-410A", options: [...REFRIGERANT_OPTIONS], helper: "Select refrigerant type; auto-fills GWP value.", helper_i18n: {"en":"Select refrigerant type; auto-fills GWP value."}, expertMeaning: "GWP per IPCC AR6 / EU F-Gas regulation", expertMeaning_i18n: {"en":"GWP per IPCC AR6 / EU F-Gas regulation"} },
    { id: "gwpValue", label: "GWP value", label_i18n: {"en":"GWP value"}, type: "number", unit: "kgCO\u2082e/kg", required: false, smartDefault: 2088, validation: { min: 0 }, helper: "Global warming potential (auto-filled from refrigerant type).", helper_i18n: {"en":"Global warming potential (auto-filled from refrigerant type)."}, expertMeaning: "GWP for tCO\u2082e = charge(kg) \u00d7 GWP / 1000", expertMeaning_i18n: {"en":"GWP for tCO\u2082e = charge(kg) \u00d7 GWP / 1000"} },
    { id: "refrigerantCharge", label: "Refrigerant charge per unit", label_i18n: {"en":"Refrigerant charge per unit"}, type: "number", unit: "kg", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "Refrigerant charge per device/system.", helper_i18n: {"en":"Refrigerant charge per device/system."}, expertMeaning: "Total charge = Charge per unit \u00d7 Number of units", expertMeaning_i18n: {"en":"Total charge = Charge per unit \u00d7 Number of units"} },
    { id: "unitCount", label: "Number of units", label_i18n: {"en":"Number of units"}, type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 1 }, helper: "Total number of systems with this refrigerant.", helper_i18n: {"en":"Total number of systems with this refrigerant."}, expertMeaning: "Scales total charge and emissions", expertMeaning_i18n: {"en":"Scales total charge and emissions"} },
    { id: "annualLeakRate", label: "Annual leak rate", label_i18n: {"en":"Annual leak rate"}, type: "number", unit: "%/year", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "Estimated annual leakage rate (EU avg: 10-25%).", helper_i18n: {"en":"Estimated annual leakage rate (EU avg: 10-25%)."}, expertMeaning: "Annual leak (kg) = Total charge \u00d7 Leak rate / 100", expertMeaning_i18n: {"en":"Annual leak (kg) = Total charge \u00d7 Leak rate / 100"} },
    { id: "leakTestFrequency", label: "Leak test frequency", label_i18n: {"en":"Leak test frequency"}, type: "select", unit: "", required: false, smartDefault: "12ay", options: [...TEST_FREQUENCY_OPTIONS], helper: "F-Gas mandatory leak test interval.", helper_i18n: {"en":"F-Gas mandatory leak test interval."}, expertMeaning: "EU F-Gas Regulation 517/2014 leak test intervals by tCO\u2082e", expertMeaning_i18n: {"en":"EU F-Gas Regulation 517/2014 leak test intervals by tCO\u2082e"} },
    { id: "testUnitCost", label: "Test unit cost", label_i18n: {"en":"Test unit cost"}, type: "number", unit: "currency", required: false, smartDefault: 200, validation: { min: 0 }, helper: "Cost per individual leak test.", helper_i18n: {"en":"Cost per individual leak test."}, expertMeaning: "Annual test cost = Tests/year \u00d7 Unit cost", expertMeaning_i18n: {"en":"Annual test cost = Tests/year \u00d7 Unit cost"} },
    { id: "refrigerantUnitPrice", label: "Refrigerant unit price", label_i18n: {"en":"Refrigerant unit price"}, type: "number", unit: "currency", required: false, smartDefault: 25, validation: { min: 0 }, helper: "Cost per kg of refrigerant (replacement cost).", helper_i18n: {"en":"Cost per kg of refrigerant (replacement cost)."}, expertMeaning: "Annual leak cost = Leak(kg) \u00d7 Unit price", expertMeaning_i18n: {"en":"Annual leak cost = Leak(kg) \u00d7 Unit price"} },
  ],
  outputs: [
    { id: "totalChargeKg", label: "Total refrigerant charge", label_i18n: {"en":"Total refrigerant charge"}, unit: "kg", format: "number" },
    { id: "tCO2ePerDevice", label: "CO\u2082e per device", label_i18n: {"en":"CO\u2082e per device"}, unit: "tCO\u2082e", format: "number" },
    { id: "tCO2eTotal", label: "Total CO\u2082e", label_i18n: {"en":"Total CO\u2082e"}, unit: "tCO\u2082e", format: "number", isBigNumber: true },
    { id: "leakTestRequirement", label: "Leak test requirement", label_i18n: {"en":"Leak test requirement"}, unit: "", format: "number" },
    { id: "annualTestCost", label: "Annual test cost", label_i18n: {"en":"Annual test cost"}, unit: "currency", format: "currency" },
    { id: "annualLeakKg", label: "Annual leak quantity", label_i18n: {"en":"Annual leak quantity"}, unit: "kg", format: "number" },
    { id: "leakCost", label: "Annual leak cost", label_i18n: {"en":"Annual leak cost"}, unit: "currency", format: "currency" },
    { id: "leakEmissionCO2e", label: "Leak emission CO\u2082e", label_i18n: {"en":"Leak emission CO\u2082e"}, unit: "tCO\u2082e", format: "number" },
    { id: "totalComplianceCost", label: "Total compliance cost", label_i18n: {"en":"Total compliance cost"}, unit: "currency", format: "currency" },
  ],
  thresholds: [{ fieldId: "tCO2eTotal", warning: 10, critical: 50, direction: "higher_is_bad", warningMessage: "Total CO\u2082e exceeds 10 t \u2014 F-Gas mandatory leak checks apply.", warningMessage_i18n: {"en":"Total CO\u2082e exceeds 10 t \u2014 F-Gas mandatory leak checks apply."}, criticalMessage: "Total CO\u2082e exceeds 50 t \u2014 quarterly leak testing required + reporting.", criticalMessage_i18n: {"en":"Total CO\u2082e exceeds 50 t \u2014 quarterly leak testing required + reporting."} }],
  formulaPipeline: [{ formulaId: "industrial.fgas_leak", inputMap: { refrigerantType: "refrigerantType", gwpValue: "gwpValue", refrigerantCharge: "refrigerantCharge", unitCount: "unitCount", annualLeakRate: "annualLeakRate", leakTestFrequency: "leakTestFrequency", testUnitCost: "testUnitCost", refrigerantUnitPrice: "refrigerantUnitPrice" }, outputId: "totalComplianceCost" }],
  reportTemplate: { title: "F-Gas Leak & CO\u2082 Equivalent Report", title_i18n: {"en":"F-Gas Leak & CO\u2082 Equivalent Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["GWP values per IPCC AR6 / EU F-Gas Regulation 517/2014.", "Leak test intervals follow EU F-Gas requirements based on total tCO\u2082e.", "Annual leak rate is user estimate; actual leakage may vary with system age.", "Compliance cost includes testing and refrigerant replacement only; fines excluded."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 25. Water Footprint Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const WATER_FOOTPRINT_SCHEMA: PremiumCalculatorSchema = {
  id: "water-footprint-calculator",
  legacyPaidSlug: "water-footprint-calculator",
  name: "Water Footprint Calculator", name_i18n: {"en":"Water Footprint Calculator"},
  sectorSlug: "general",
  category: "energy",
  painStatement: "Water footprint accounting is mandatory for ESG reporting but most facilities only track the utility bill \u2014 blue (groundwater), green (rainwater), and grey (wastewater) components are invisible without systematic quantification.", painStatement_i18n: {"en":"Water footprint accounting is mandatory for ESG reporting but most facilities only track the utility bill \u2014 blue (groundwater), green (rainwater), and grey (wastewater) components are invisible without systematic quantification."},
  inputs: [
    { id: "blueWaterConsumption", label: "Blue water consumption", label_i18n: {"en":"Blue water consumption"}, type: "number", unit: "m\u00b3/year", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "Surface and groundwater consumption (municipal supply + wells).", helper_i18n: {"en":"Surface and groundwater consumption (municipal supply + wells)."}, expertMeaning: "Blue WF = direct withdrawal - return flow", expertMeaning_i18n: {"en":"Blue WF = direct withdrawal - return flow"} },
    { id: "greenWaterConsumption", label: "Green water consumption", label_i18n: {"en":"Green water consumption"}, type: "number", unit: "m\u00b3/year", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Rainwater consumed (mostly agricultural/landscaping).", helper_i18n: {"en":"Rainwater consumed (mostly agricultural/landscaping)."}, expertMeaning: "Green WF = effective rainfall evapotranspiration", expertMeaning_i18n: {"en":"Green WF = effective rainfall evapotranspiration"} },
    { id: "greyWaterVolume", label: "Grey water volume", label_i18n: {"en":"Grey water volume"}, type: "number", unit: "m\u00b3/year", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Wastewater volume requiring dilution to meet quality standards.", helper_i18n: {"en":"Wastewater volume requiring dilution to meet quality standards."}, expertMeaning: "Grey WF = (C_effluent - C_natural) / (C_max - C_natural) \u00d7 V_effluent", expertMeaning_i18n: {"en":"Grey WF = (C_effluent - C_natural) / (C_max - C_natural) \u00d7 V_effluent"} },
    { id: "productionVolume", label: "Production volume", label_i18n: {"en":"Production volume"}, type: "number", unit: "units/year", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "Total annual production output in selected units.", helper_i18n: {"en":"Total annual production output in selected units."}, expertMeaning: "Unit WF = Total WF / Production volume", expertMeaning_i18n: {"en":"Unit WF = Total WF / Production volume"} },
    { id: "sectorBenchmark", label: "Sector benchmark", label_i18n: {"en":"Sector benchmark"}, type: "number", unit: "m\u00b3/unit", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "Industry average water intensity per unit of production.", helper_i18n: {"en":"Industry average water intensity per unit of production."}, expertMeaning: "Benchmark gap = Unit WF - Sector benchmark", expertMeaning_i18n: {"en":"Benchmark gap = Unit WF - Sector benchmark"} },
  ],
  outputs: [
    { id: "totalWaterFootprint", label: "Total water footprint", label_i18n: {"en":"Total water footprint"}, unit: "m\u00b3/year", format: "number", isBigNumber: true },
    { id: "unitWaterFootprint", label: "Unit water footprint", label_i18n: {"en":"Unit water footprint"}, unit: "m\u00b3/unit", format: "number" },
    { id: "blueRatio", label: "Blue water ratio", label_i18n: {"en":"Blue water ratio"}, unit: "%", format: "percentage" },
    { id: "greenRatio", label: "Green water ratio", label_i18n: {"en":"Green water ratio"}, unit: "%", format: "percentage" },
    { id: "greyRatio", label: "Grey water ratio", label_i18n: {"en":"Grey water ratio"}, unit: "%", format: "percentage" },
    { id: "benchmarkGap", label: "Benchmark gap", label_i18n: {"en":"Benchmark gap"}, unit: "m\u00b3/unit", format: "number" },
    { id: "improvementPotential", label: "Improvement potential", label_i18n: {"en":"Improvement potential"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "unitWaterFootprint", warning: 0.1, critical: 0.2, direction: "higher_is_bad", warningMessage: "Unit water footprint above 0.1 m\u00b3/unit \u2014 investigate reduction opportunities.", warningMessage_i18n: {"en":"Unit water footprint above 0.1 m\u00b3/unit \u2014 investigate reduction opportunities."}, criticalMessage: "Unit water footprint above 0.2 m\u00b3/unit \u2014 urgent water efficiency program needed.", criticalMessage_i18n: {"en":"Unit water footprint above 0.2 m\u00b3/unit \u2014 urgent water efficiency program needed."} }],
  formulaPipeline: [{ formulaId: "industrial.water_footprint", inputMap: { blueWaterConsumption: "blueWaterConsumption", greenWaterConsumption: "greenWaterConsumption", greyWaterVolume: "greyWaterVolume", productionVolume: "productionVolume", sectorBenchmark: "sectorBenchmark" }, outputId: "totalWaterFootprint" }],
  reportTemplate: { title: "Water Footprint Analysis Report", title_i18n: {"en":"Water Footprint Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Blue water includes municipal supply and groundwater extraction.", "Green water includes effective precipitation consumed by vegetation.", "Grey water calculated as dilution volume to meet receiving water quality standards.", "Benchmark comparison based on sector average; verify against your specific sub-sector."] },
};

const BUILDING_TYPE_OPTIONS = [
  { value: "warehouse", label: "Warehouse / Storage (fire load 500-1000 MJ/m\u00b2)", label_i18n: {"en":"Warehouse / Storage (fire load 500-1000 MJ/m\u00b2)"} },
  { value: "industrial", label: "Industrial / Factory (fire load 400-800 MJ/m\u00b2)", label_i18n: {"en":"Industrial / Factory (fire load 400-800 MJ/m\u00b2)"} },
  { value: "commercial", label: "Commercial / Office (fire load 300-600 MJ/m\u00b2)", label_i18n: {"en":"Commercial / Office (fire load 300-600 MJ/m\u00b2)"} },
  { value: "retail", label: "Retail / Mall (fire load 400-700 MJ/m\u00b2)", label_i18n: {"en":"Retail / Mall (fire load 400-700 MJ/m\u00b2)"} },
  { value: "parking", label: "Parking garage (fire load 200-400 MJ/m\u00b2)", label_i18n: {"en":"Parking garage (fire load 200-400 MJ/m\u00b2)"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 26. Smoke Exhaust (SHEV) Sizing Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const SMOKE_EXHAUST_SHEV_SCHEMA: PremiumCalculatorSchema = {
  id: "smoke-exhaust-shev-calculator",
  legacyPaidSlug: "smoke-exhaust-shev-calculator",
  name: "Smoke Exhaust (SHEV) Sizing Calculator", name_i18n: {"en":"Smoke Exhaust (SHEV) Sizing Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Smoke exhaust sizing per EN 12101-5 requires iterative calculation of fire perimeter, plume mass flow, and vent area \u2014 a 20% undersized SHEV can render a smoke control system ineffective during a fire event.", painStatement_i18n: {"en":"Smoke exhaust sizing per EN 12101-5 requires iterative calculation of fire perimeter, plume mass flow, and vent area \u2014 a 20% undersized SHEV can render a smoke control system ineffective during a fire event."},
  inputs: [
    { id: "buildingType", label: "Building type", label_i18n: {"en":"Building type"}, type: "select", unit: "", required: true, smartDefault: "warehouse", options: [...BUILDING_TYPE_OPTIONS], helper: "Building occupancy type determines design fire.", helper_i18n: {"en":"Building occupancy type determines design fire."}, expertMeaning: "Design fire HRR per EN 12101-5 Table A.1", expertMeaning_i18n: {"en":"Design fire HRR per EN 12101-5 Table A.1"} },
    { id: "ceilingArea", label: "Ceiling / compartment area A_tavan", label_i18n: {"en":"Ceiling / compartment area A_tavan"}, type: "number", unit: "m\u00b2", required: true, smartDefault: 2000, validation: { min: 10 }, helper: "Total ceiling area of the smoke compartment.", helper_i18n: {"en":"Total ceiling area of the smoke compartment."}, expertMeaning: "A_tavan for natural vent area ratio", expertMeaning_i18n: {"en":"A_tavan for natural vent area ratio"} },
    { id: "zoneLength", label: "Zone length L", label_i18n: {"en":"Zone length L"}, type: "number", unit: "m", required: true, smartDefault: 50, validation: { min: 1 }, helper: "Smoke zone length.", helper_i18n: {"en":"Smoke zone length."}, expertMeaning: "Fire perimeter ~ 2\u00d7(L+W) for design fire", expertMeaning_i18n: {"en":"Fire perimeter ~ 2\u00d7(L+W) for design fire"} },
    { id: "zoneWidth", label: "Zone width W", label_i18n: {"en":"Zone width W"}, type: "number", unit: "m", required: true, smartDefault: 40, validation: { min: 1 }, helper: "Smoke zone width.", helper_i18n: {"en":"Smoke zone width."}, expertMeaning: "Fire perimeter ~ 2\u00d7(L+W) for design fire", expertMeaning_i18n: {"en":"Fire perimeter ~ 2\u00d7(L+W) for design fire"} },
    { id: "ceilingHeight", label: "Ceiling height H", label_i18n: {"en":"Ceiling height H"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 2, max: 50 }, helper: "Smoke compartment height.", helper_i18n: {"en":"Smoke compartment height."}, expertMeaning: "H for plume mass flow calculation", expertMeaning_i18n: {"en":"H for plume mass flow calculation"} },
    { id: "smokeLayerDepth", label: "Smoke layer depth d", label_i18n: {"en":"Smoke layer depth d"}, type: "number", unit: "m", required: false, smartDefault: 2, validation: { min: 0.1, max: 20 }, helper: "Design smoke layer depth below ceiling.", helper_i18n: {"en":"Design smoke layer depth below ceiling."}, expertMeaning: "Clear height z = H - d", expertMeaning_i18n: {"en":"Clear height z = H - d"} },
    { id: "fireArea", label: "Fire area A_fire", label_i18n: {"en":"Fire area A_fire"}, type: "number", unit: "m\u00b2", required: false, smartDefault: 36, validation: { min: 0.1 }, helper: "Design fire area (typically 6m \u00d7 6m = 36 m\u00b2 for warehouses).", helper_i18n: {"en":"Design fire area (typically 6m \u00d7 6m = 36 m\u00b2 for warehouses)."}, expertMeaning: "Fire perimeter P = 2\u00d7\u221a(\u03c0\u00d7A_fire) for circular fire", expertMeaning_i18n: {"en":"Fire perimeter P = 2\u00d7\u221a(\u03c0\u00d7A_fire) for circular fire"} },
    { id: "inletArea", label: "Inlet air area A_inlet", label_i18n: {"en":"Inlet air area A_inlet"}, type: "number", unit: "m\u00b2", required: false, smartDefault: 5, validation: { min: 0 }, helper: "Total area of natural air inlets for make-up air.", helper_i18n: {"en":"Total area of natural air inlets for make-up air."}, expertMeaning: "A_inlet \u2265 1.4\u00d7A_vent per EN 12101-5 for natural systems", expertMeaning_i18n: {"en":"A_inlet \u2265 1.4\u00d7A_vent per EN 12101-5 for natural systems"} },
    { id: "ventFlowCoefficient", label: "Vent flow coefficient Cv", label_i18n: {"en":"Vent flow coefficient Cv"}, type: "number", unit: "", required: false, smartDefault: 0.65, validation: { min: 0.3, max: 1 }, helper: "Discharge coefficient of SHEV vent (typical: 0.6-0.7).", helper_i18n: {"en":"Discharge coefficient of SHEV vent (typical: 0.6-0.7)."}, expertMeaning: "Cv for volumetric flow Q = Cv \u00d7 A \u00d7 \u221a(2g\u00d7\u0394H\u00d7\u0394T/T)", expertMeaning_i18n: {"en":"Cv for volumetric flow Q = Cv \u00d7 A \u00d7 \u221a(2g\u00d7\u0394H\u00d7\u0394T/T)"} },
    { id: "windSpeed", label: "External wind speed", label_i18n: {"en":"External wind speed"}, type: "number", unit: "m/s", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "Design wind speed at roof level.", helper_i18n: {"en":"Design wind speed at roof level."}, expertMeaning: "Wind effect on natural vent performance per EN 12101-2", expertMeaning_i18n: {"en":"Wind effect on natural vent performance per EN 12101-2"} },
  ],
  outputs: [
    { id: "firePerimeter", label: "Fire perimeter P", label_i18n: {"en":"Fire perimeter P"}, unit: "m", format: "number" },
    { id: "plumeMassFlow", label: "Plume mass flow m_dot", label_i18n: {"en":"Plume mass flow m_dot"}, unit: "kg/s", format: "number" },
    { id: "requiredVentArea", label: "Required vent area A_vent", label_i18n: {"en":"Required vent area A_vent"}, unit: "m\u00b2", format: "number" },
    { id: "effectiveAreaRatio", label: "Effective vent area ratio", label_i18n: {"en":"Effective vent area ratio"}, unit: "%", format: "percentage" },
    { id: "ventSize", label: "Recommended vent size", label_i18n: {"en":"Recommended vent size"}, unit: "m\u00b2", format: "number" },
    { id: "ventCount", label: "Number of vents required", label_i18n: {"en":"Number of vents required"}, unit: "", format: "number" },
    { id: "inletCheck", label: "Inlet area check", label_i18n: {"en":"Inlet area check"}, unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "effectiveAreaRatio", warning: 0.5, critical: 0.3, direction: "lower_is_bad", warningMessage: "Vent area below 0.5% of ceiling area \u2014 consider increasing vent count or size.", warningMessage_i18n: {"en":"Vent area below 0.5% of ceiling area \u2014 consider increasing vent count or size."}, criticalMessage: "Vent area below 0.3% \u2014 non-compliant per EN 12101-5 minimum requirement.", criticalMessage_i18n: {"en":"Vent area below 0.3% \u2014 non-compliant per EN 12101-5 minimum requirement."} }],
  formulaPipeline: [{ formulaId: "industrial.smoke_exhaust_shev", inputMap: { buildingType: "buildingType", ceilingArea: "ceilingArea", zoneLength: "zoneLength", zoneWidth: "zoneWidth", ceilingHeight: "ceilingHeight", smokeLayerDepth: "smokeLayerDepth", fireArea: "fireArea", inletArea: "inletArea", ventFlowCoefficient: "ventFlowCoefficient", windSpeed: "windSpeed" }, outputId: "requiredVentArea" }],
  reportTemplate: { title: "Smoke Exhaust (SHEV) Sizing Report", title_i18n: {"en":"Smoke Exhaust (SHEV) Sizing Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Design fire based on building type per EN 12101-5 Table A.1.", "Plume mass flow uses Heskestad model for axisymmetric plume.", "Natural vent sizing assumes steady-state conditions and neutral plane at mid-height.", "Inlet area should be \u2265 1.4 \u00d7 vent area per EN 12101-5 for natural smoke exhaust."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 27. Natural Ventilation (ACH) Requirement Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const NATURAL_VENTILATION_ACH_SCHEMA: PremiumCalculatorSchema = {
  id: "natural-ventilation-ach-calculator",
  legacyPaidSlug: "natural-ventilation-ach-calculator",
  name: "Natural Ventilation (ACH) Requirement Calculator", name_i18n: {"en":"Natural Ventilation (ACH) Requirement Calculator"},
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Designing natural ventilation openings without calculating the stack-effect driving pressure leads to undersized louvres, stagnant zones, and IAQ complaints \u2014 occupants suffer while energy savings never materialize.", painStatement_i18n: {"en":"Designing natural ventilation openings without calculating the stack-effect driving pressure leads to undersized louvres, stagnant zones, and IAQ complaints \u2014 occupants suffer while energy savings never materialize."},
  inputs: [
    { id: "areaLength", label: "Zone length L", label_i18n: {"en":"Zone length L"}, type: "number", unit: "m", required: true, smartDefault: 30, validation: { min: 1 }, helper: "Length of the ventilated zone.", helper_i18n: {"en":"Length of the ventilated zone."}, expertMeaning: "Volume = L \u00d7 W \u00d7 H", expertMeaning_i18n: {"en":"Volume = L \u00d7 W \u00d7 H"} },
    { id: "areaWidth", label: "Zone width W", label_i18n: {"en":"Zone width W"}, type: "number", unit: "m", required: true, smartDefault: 20, validation: { min: 1 }, helper: "Width of the ventilated zone.", helper_i18n: {"en":"Width of the ventilated zone."}, expertMeaning: "Volume = L \u00d7 W \u00d7 H", expertMeaning_i18n: {"en":"Volume = L \u00d7 W \u00d7 H"} },
    { id: "ceilingHeight", label: "Ceiling height H", label_i18n: {"en":"Ceiling height H"}, type: "number", unit: "m", required: true, smartDefault: 6, validation: { min: 1 }, helper: "Average ceiling height.", helper_i18n: {"en":"Average ceiling height."}, expertMeaning: "Volume and stack height for buoyancy", expertMeaning_i18n: {"en":"Volume and stack height for buoyancy"} },
    { id: "indoorTemperature", label: "Indoor temperature Ti", label_i18n: {"en":"Indoor temperature Ti"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 26, validation: { min: -10, max: 60 }, helper: "Desired indoor temperature.", helper_i18n: {"en":"Desired indoor temperature."}, expertMeaning: "Ti for \u0394T = Ti - To (driving force)", expertMeaning_i18n: {"en":"Ti for \u0394T = Ti - To (driving force)"} },
    { id: "outdoorTemperature", label: "Outdoor temperature To", label_i18n: {"en":"Outdoor temperature To"}, type: "number", unit: "\u00b0C", required: true, smartDefault: 32, validation: { min: -30, max: 50 }, helper: "Design outdoor temperature.", helper_i18n: {"en":"Design outdoor temperature."}, expertMeaning: "To for \u0394T = Ti - To; natural ventilation works when \u0394T > 0", expertMeaning_i18n: {"en":"To for \u0394T = Ti - To; natural ventilation works when \u0394T > 0"} },
    { id: "targetACH", label: "Target ACH", label_i18n: {"en":"Target ACH"}, type: "number", unit: "1/h", required: true, smartDefault: 6, validation: { min: 0.5, max: 60 }, helper: "Required air changes per hour (IAQ: 4-8 ACH for occupied spaces).", helper_i18n: {"en":"Required air changes per hour (IAQ: 4-8 ACH for occupied spaces)."}, expertMeaning: "Required flow Q = Volume \u00d7 ACH / 3600", expertMeaning_i18n: {"en":"Required flow Q = Volume \u00d7 ACH / 3600"} },
    { id: "ventDischargeCoefficient", label: "Vent discharge coefficient Cd", label_i18n: {"en":"Vent discharge coefficient Cd"}, type: "number", unit: "", required: false, smartDefault: 0.65, validation: { min: 0.3, max: 1 }, helper: "Discharge coefficient (sharp-edged: 0.6; louvre: 0.4-0.7).", helper_i18n: {"en":"Discharge coefficient (sharp-edged: 0.6; louvre: 0.4-0.7)."}, expertMeaning: "Cd for A = Q/(Cd\u00d7\u221a(2g\u00d7\u0394H\u00d7\u0394T/Ti))", expertMeaning_i18n: {"en":"Cd for A = Q/(Cd\u00d7\u221a(2g\u00d7\u0394H\u00d7\u0394T/Ti))"} },
    { id: "stackHeight", label: "Stack height \u0394H", label_i18n: {"en":"Stack height \u0394H"}, type: "number", unit: "m", required: false, smartDefault: 3, validation: { min: 0.1 }, helper: "Vertical distance between inlet and outlet openings.", helper_i18n: {"en":"Vertical distance between inlet and outlet openings."}, expertMeaning: "\u0394H for stack-induced pressure: \u0394P = \u03c1\u2080\u00d7g\u00d7\u0394H\u00d7\u0394T/Ti", expertMeaning_i18n: {"en":"\u0394H for stack-induced pressure: \u0394P = \u03c1\u2080\u00d7g\u00d7\u0394H\u00d7\u0394T/Ti"} },
  ],
  outputs: [
    { id: "zoneVolumeM3", label: "Zone volume", label_i18n: {"en":"Zone volume"}, unit: "m\u00b3", format: "number" },
    { id: "requiredFlowM3s", label: "Required flow rate Q", label_i18n: {"en":"Required flow rate Q"}, unit: "m\u00b3/s", format: "number" },
    { id: "temperatureDelta", label: "Temperature difference \u0394T", label_i18n: {"en":"Temperature difference \u0394T"}, unit: "\u00b0C", format: "number" },
    { id: "requiredVentArea", label: "Required vent area A_total", label_i18n: {"en":"Required vent area A_total"}, unit: "m\u00b2", format: "number" },
    { id: "lowerVentArea", label: "Lower (inlet) vent area", label_i18n: {"en":"Lower (inlet) vent area"}, unit: "m\u00b2", format: "number" },
    { id: "upperVentArea", label: "Upper (outlet) vent area", label_i18n: {"en":"Upper (outlet) vent area"}, unit: "m\u00b2", format: "number" },
    { id: "actualAirflowM3h", label: "Actual airflow rate", label_i18n: {"en":"Actual airflow rate"}, unit: "m\u00b3/h", format: "number" },
  ],
  thresholds: [{ fieldId: "temperatureDelta", warning: 3, critical: 0.5, direction: "lower_is_bad", warningMessage: "\u0394T below 3\u00b0C \u2014 weak buoyancy; consider mechanical ventilation support.", warningMessage_i18n: {"en":"\u0394T below 3\u00b0C \u2014 weak buoyancy; consider mechanical ventilation support."}, criticalMessage: "\u0394T below 0.5\u00b0C \u2014 natural ventilation may not be feasible; design mechanical system.", criticalMessage_i18n: {"en":"\u0394T below 0.5\u00b0C \u2014 natural ventilation may not be feasible; design mechanical system."} }],
  formulaPipeline: [{ formulaId: "industrial.natural_ventilation", inputMap: { areaLength: "areaLength", areaWidth: "areaWidth", ceilingHeight: "ceilingHeight", indoorTemperature: "indoorTemperature", outdoorTemperature: "outdoorTemperature", targetACH: "targetACH", ventDischargeCoefficient: "ventDischargeCoefficient", stackHeight: "stackHeight" }, outputId: "requiredVentArea" }],
  reportTemplate: { title: "Natural Ventilation (ACH) Requirement Report", title_i18n: {"en":"Natural Ventilation (ACH) Requirement Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Natural ventilation driven by stack effect only; wind effect not included.", "Discharge coefficient assumes sharp-edged opening; louvres reduce effective area.", "Temperature difference must be positive for buoyancy-driven flow.", "Equal inlet and outlet area assumed for neutral pressure plane at mid-height."] },
};

const COMPOUNDING_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily (365/year)", label_i18n: {"en":"Daily (365/year)"} },
  { value: "weekly", label: "Weekly (52/year)", label_i18n: {"en":"Weekly (52/year)"} },
  { value: "monthly", label: "Monthly (12/year)", label_i18n: {"en":"Monthly (12/year)"} },
  { value: "quarterly", label: "Quarterly (4/year)", label_i18n: {"en":"Quarterly (4/year)"} },
  { value: "semi_annual", label: "Semi-annual (2/year)", label_i18n: {"en":"Semi-annual (2/year)"} },
  { value: "annual", label: "Annual (1/year)", label_i18n: {"en":"Annual (1/year)"} },
  { value: "continuous", label: "Continuous (e^rt)", label_i18n: {"en":"Continuous (e^rt)"} },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 28. Compound Interest Calculator (Detailed)
 * ════════════════════════════════════════════════════════════════════════════ */

const COMPOUND_INTEREST_SCHEMA: PremiumCalculatorSchema = {
  id: "compound-interest-calculator",
  legacyPaidSlug: "compound-interest-calculator",
  name: "Compound Interest Calculator (Detailed)", name_i18n: {"en":"Compound Interest Calculator (Detailed)"},
  sectorSlug: "financial-planning",
  category: "finance",
  painStatement: "A simple FV = PV\u00d7(1+r)^n formula hides the power of periodic contributions, compounding frequency, inflation erosion, and tax impact \u2014 decisions made with oversimplified calculators can cost hundreds of thousands over a 30-year horizon.", painStatement_i18n: {"en":"A simple FV = PV\u00d7(1+r)^n formula hides the power of periodic contributions, compounding frequency, inflation erosion, and tax impact \u2014 decisions made with oversimplified calculators can cost hundreds of thousands over a 30-year horizon."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code for output formatting.", expertMeaning_i18n: {"en":"ISO code for output formatting."} },
    { id: "initialPrincipal", label: "Initial principal PV", label_i18n: {"en":"Initial principal PV"}, type: "number", unit: "currency", required: true, smartDefault: 10000, validation: { min: 0 }, helper: "Starting investment amount (present value).", helper_i18n: {"en":"Starting investment amount (present value)."}, expertMeaning: "PV in FV = PV\u00d7(1+r/m)^(m\u00d7t)", expertMeaning_i18n: {"en":"PV in FV = PV\u00d7(1+r/m)^(m\u00d7t)"} },
    { id: "monthlyContribution", label: "Monthly contribution PMT", label_i18n: {"en":"Monthly contribution PMT"}, type: "number", unit: "currency", required: false, smartDefault: 500, validation: { min: 0 }, helper: "Regular periodic contribution amount.", helper_i18n: {"en":"Regular periodic contribution amount."}, expertMeaning: "PMT for FV of annuity: FV = PMT\u00d7(((1+r/m)^(m\u00d7t)-1)/(r/m))", expertMeaning_i18n: {"en":"PMT for FV of annuity: FV = PMT\u00d7(((1+r/m)^(m\u00d7t)-1)/(r/m))"} },
    { id: "annualRate", label: "Annual interest rate r", label_i18n: {"en":"Annual interest rate r"}, type: "number", unit: "%/year", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "Nominal annual interest or return rate.", helper_i18n: {"en":"Nominal annual interest or return rate."}, expertMeaning: "r as decimal in FV formula: r/100", expertMeaning_i18n: {"en":"r as decimal in FV formula: r/100"} },
    { id: "compoundingFrequency", label: "Compounding frequency m", label_i18n: {"en":"Compounding frequency m"}, type: "select", unit: "", required: true, smartDefault: "monthly", options: [...COMPOUNDING_FREQUENCY_OPTIONS], helper: "How often interest is compounded per year.", helper_i18n: {"en":"How often interest is compounded per year."}, expertMeaning: "m in FV = PV\u00d7(1+r/m)^(m\u00d7t); continuous: FV = PV\u00d7e^(r\u00d7t)", expertMeaning_i18n: {"en":"m in FV = PV\u00d7(1+r/m)^(m\u00d7t); continuous: FV = PV\u00d7e^(r\u00d7t)"} },
    { id: "investmentPeriod", label: "Investment period t", label_i18n: {"en":"Investment period t"}, type: "number", unit: "years", required: true, smartDefault: 10, validation: { min: 0.5, max: 100 }, helper: "Total investment horizon in years.", helper_i18n: {"en":"Total investment horizon in years."}, expertMeaning: "t in FV formula exponent", expertMeaning_i18n: {"en":"t in FV formula exponent"} },
    { id: "inflationRate", label: "Expected inflation rate i", label_i18n: {"en":"Expected inflation rate i"}, type: "number", unit: "%/year", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "Expected average annual inflation rate.", helper_i18n: {"en":"Expected average annual inflation rate."}, expertMeaning: "Real return = ((1+r)/(1+i)) - 1 (Fisher equation)", expertMeaning_i18n: {"en":"Real return = ((1+r)/(1+i)) - 1 (Fisher equation)"} },
    { id: "taxRate", label: "Capital gains tax rate t", label_i18n: {"en":"Capital gains tax rate t"}, type: "number", unit: "%", required: false, smartDefault: 0, validation: { min: 0, max: 100 }, helper: "Effective tax rate on investment returns.", helper_i18n: {"en":"Effective tax rate on investment returns."}, expertMeaning: "After-tax interest = r \u00d7 (1 - t/100)", expertMeaning_i18n: {"en":"After-tax interest = r \u00d7 (1 - t/100)"} },
  ],
  outputs: [
    { id: "totalPeriods", label: "Total compounding periods", label_i18n: {"en":"Total compounding periods"}, unit: "", format: "number" },
    { id: "fvPrincipal", label: "FV from principal only", label_i18n: {"en":"FV from principal only"}, unit: "currency", format: "currency" },
    { id: "fvContributions", label: "FV from contributions", label_i18n: {"en":"FV from contributions"}, unit: "currency", format: "currency" },
    { id: "fvTotal", label: "Total future value", label_i18n: {"en":"Total future value"}, unit: "currency", format: "currency", isBigNumber: true },
    { id: "totalInvested", label: "Total amount invested", label_i18n: {"en":"Total amount invested"}, unit: "currency", format: "currency" },
    { id: "totalInterest", label: "Total interest earned", label_i18n: {"en":"Total interest earned"}, unit: "currency", format: "currency", isBigNumber: true },
    { id: "afterTaxInterest", label: "After-tax interest", label_i18n: {"en":"After-tax interest"}, unit: "currency", format: "currency" },
    { id: "afterTaxTotal", label: "After-tax total value", label_i18n: {"en":"After-tax total value"}, unit: "currency", format: "currency" },
    { id: "realReturnPct", label: "Real return (inflation-adjusted)", label_i18n: {"en":"Real return (inflation-adjusted)"}, unit: "%", format: "percentage" },
    { id: "purchasingPower", label: "Inflation-adjusted purchasing power", label_i18n: {"en":"Inflation-adjusted purchasing power"}, unit: "currency", format: "currency" },
    { id: "doublingYears", label: "Rule of 72 doubling years", label_i18n: {"en":"Rule of 72 doubling years"}, unit: "years", format: "duration" },
  ],
  thresholds: [{ fieldId: "realReturnPct", warning: 1, critical: 0, direction: "lower_is_bad", warningMessage: "Real return below 1% \u2014 inflation is eroding purchasing power significantly.", warningMessage_i18n: {"en":"Real return below 1% \u2014 inflation is eroding purchasing power significantly."}, criticalMessage: "Real return zero or negative \u2014 investment is losing purchasing power after inflation.", criticalMessage_i18n: {"en":"Real return zero or negative \u2014 investment is losing purchasing power after inflation."} }],
  formulaPipeline: [{ formulaId: "industrial.compound_interest", inputMap: { currency: "currency", initialPrincipal: "initialPrincipal", monthlyContribution: "monthlyContribution", annualRate: "annualRate", compoundingFrequency: "compoundingFrequency", investmentPeriod: "investmentPeriod", inflationRate: "inflationRate", taxRate: "taxRate" }, outputId: "fvTotal" }],
  reportTemplate: { title: "Compound Interest Analysis Report", title_i18n: {"en":"Compound Interest Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["FV assumes constant rate of return over entire investment period (no volatility).", "Inflation adjustment uses Fisher equation: (1+r_nominal)/(1+i) - 1.", "Capital gains tax applied to interest portion only (not principal).", "Rule of 72 = 72 / (r \u00d7 100) for approximate doubling time.", "Monthly contributions assumed to occur at end of each period (ordinary annuity)."] },
};

/* ─── Shared option sets for tools #173-#180 ─── */

const INSULATION_OPTIONS = [
  { value: "iyi", label: "Good (R \u2265 4.0 m\u00b2K/W)" },
  { value: "orta", label: "Average (R ~ 2.5 m\u00b2K/W)" },
  { value: "kotu", label: "Poor (R ~ 1.0 m\u00b2K/W)" },
] as const;

const GLASS_TYPE_OPTIONS = [
  { value: "cift_cam", label: "Double-glazed (U~2.8 W/m\u00b2K)" },
  { value: "uc_cam", label: "Triple-glazed (U~1.8 W/m\u00b2K)" },
  { value: "tek_cam", label: "Single-glazed (U~5.7 W/m\u00b2K)" },
] as const;

const PANEL_TYPE_OPTIONS = [
  { value: "PKKP_11", label: "Type 11 \u2014 1 row + 1 fin" },
  { value: "PKKP_21", label: "Type 21 \u2014 2 rows + 1 fin" },
  { value: "PKKP_22", label: "Type 22 \u2014 2 rows + 2 fins (standard)" },
  { value: "PKKP_33", label: "Type 33 \u2014 3 rows + 3 fins" },
] as const;

const OPERATING_TEMP_OPTIONS = [
  { value: "75/65", label: "75/65 \u00b0C \u2014 Standard radiator system" },
  { value: "55/45", label: "55/45 \u00b0C \u2014 Low-temperature system" },
  { value: "45/35", label: "45/35 \u00b0C \u2014 Very low-temp / heat pump" },
] as const;

const FLOOR_TYPE_OPTIONS = [
  { value: "sap", label: "Screed / Cement (R~0.10 m\u00b2K/W)" },
  { value: "parke", label: "Parquet / Wood (R~0.15 m\u00b2K/W)" },
  { value: "fayans", label: "Tile / Ceramic (R~0.02 m\u00b2K/W)" },
  { value: "hal\u0131", label: "Carpet (R~0.25 m\u00b2K/W)" },
] as const;

const PIPE_DIAMETER_OPTIONS = [
  { value: "16", label: "16 mm (standard PEX)" },
  { value: "17", label: "17 mm (PEX-Al-PEX)" },
  { value: "20", label: "20 mm (large loop)" },
] as const;

const COLLECTOR_TYPE_OPTIONS = [
  { value: "duz_levha", label: "Flat plate (\u03b7~70%, cost-effective)" },
  { value: "vakum_tupu", label: "Evacuated tube (\u03b7~80%, colder climates)" },
  { value: "heat_pipe", label: "Heat pipe (\u03b7~85%, high efficiency)" },
] as const;

const AUXILIARY_SOURCE_OPTIONS = [
  { value: "elektrikli", label: "Electric resistance" },
  { value: "dogalgaz", label: "Natural gas boiler" },
  { value: "isitma_pompasi", label: "Heat pump" },
] as const;

const CARD_TYPE_OPTIONS = [
  { value: "cekim", label: "Withdrawal Kanban" },
  { value: "uretim", label: "Production Kanban" },
  { value: "sinyal", label: "Signal Kanban" },
] as const;

const PROCESS_TYPE_OPTIONS = [
  { value: "service", label: "Service (people-flow)" },
  { value: "manufacturing", label: "Manufacturing (material-flow)" },
  { value: "software", label: "Software (work-item-flow)" },
] as const;

/* ════════════════════════════════════════════════════════════════════════════
 * 29. Living Wage Calculator (SGK & T\u00fcrkiye payroll)
 * ════════════════════════════════════════════════════════════════════════════ */

const LIVING_WAGE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "living-wage-calculator",
  legacyPaidSlug: "living-wage-calculator",
  name: "Living Wage Calculator",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Calculating true employer cost per employee requires aggregating gross salary, overtime, SGK, unemployment fund, stamp tax, income tax withholding, meal and transportation allowances \u2014 one missing rate creates a misleading net cost figure.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "TRY", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code for output formatting." },
    { id: "calisanSayisi", label: "Number of employees", type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 1 }, helper: "Total employee headcount for aggregate calculations.", expertMeaning: "n for total employer cost = n \u00d7 per-employee cost" },
    { id: "brUcret_Aylik", label: "Gross monthly salary (per employee)", type: "number", unit: "currency", required: true, smartDefault: 20000, validation: { min: 0 }, helper: "Base gross salary before any deductions.", expertMeaning: "Br\u00fct \u00fccret \u2014 SGK, \u0130\u015fsizlik, Damga, Gelir Vergisi matrah\u0131" },
    { id: "fazlaMesaiSaat_Aylik", label: "Overtime hours per month (per employee)", type: "number", unit: "hours", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Total overtime hours worked per month.", expertMeaning: "Fazla mesai \u2014 br\u00fct \u00fccrete eklenir" },
    { id: "fazlaMesaiKatsayisi", label: "Overtime multiplier", type: "number", unit: "x", required: false, smartDefault: 1.5, validation: { min: 1, max: 3 }, helper: "Hourly rate multiplier for overtime (legal min. 1.5x).", expertMeaning: "Fazla mesai katsay\u0131s\u0131 \u2014 1.5 = %50 zaml\u0131" },
    { id: "SGK_isverenOrani", label: "SGK employer contribution rate", type: "number", unit: "%", required: true, smartDefault: 15.5, validation: { min: 0, max: 40 }, helper: "Employer social security premium rate (standard 15.5%).", expertMeaning: "SGK i\u015fveren pay\u0131 \u2014 k\u0131sa vadeli + uzun vadeli kollar" },
    { id: "issizlikFonuOrani", label: "Unemployment fund rate (employer)", type: "number", unit: "%", required: true, smartDefault: 2, validation: { min: 0, max: 5 }, helper: "Employer unemployment insurance fund contribution.", expertMeaning: "\u0130\u015fsizlik fonu i\u015fveren pay\u0131" },
    { id: "damgaVergiOrani", label: "Stamp tax rate", type: "number", unit: "%", required: true, smartDefault: 0.759, validation: { min: 0, max: 5 }, helper: "Stamp duty on gross salary (2025 rate: 0.759%).", expertMeaning: "Damga vergisi oran\u0131 \u2014 br\u00fct \u00fccret \u00fczerinden" },
    { id: "gelirVergiDilimi", label: "Income tax bracket", type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 45 }, helper: "Applicable marginal income tax rate for the employee.", expertMeaning: "Gelir vergisi dilimi \u2014 kademeli oran" },
    { id: "AGI_tutari", label: "Minimum living allowance (AGI)", type: "number", unit: "currency", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Asgari ge\u00e7im indirimi (may be zeroed after tax reform).", expertMeaning: "AGI \u2014 br\u00fct asgari \u00fccrete ba\u011fl\u0131 indirim" },
    { id: "yemekYardimi_Gunluk", label: "Daily meal allowance", type: "number", unit: "currency", required: false, smartDefault: 100, validation: { min: 0 }, helper: "Daily meal card or cash allowance per employee.", expertMeaning: "Yemek yard\u0131m\u0131 \u2014 g\u00fcnl\u00fck tutar" },
    { id: "yolYardimi_Gunluk", label: "Daily transportation allowance", type: "number", unit: "currency", required: false, smartDefault: 50, validation: { min: 0 }, helper: "Daily transport allowance per employee.", expertMeaning: "Yol yard\u0131m\u0131 \u2014 g\u00fcnl\u00fck tutar" },
    { id: "calismaGunu_Ay", label: "Working days per month", type: "number", unit: "days", required: true, smartDefault: 22, validation: { min: 1, max: 31 }, helper: "Average number of working days in a month.", expertMeaning: "Ayl\u0131k \u00e7al\u0131\u015fma g\u00fcn\u00fc say\u0131s\u0131 \u2014 yard\u0131m hesaplar\u0131nda kullan\u0131l\u0131r" },
  ],
  outputs: [
    { id: "brUcret_Yillik", label: "Gross annual salary (per employee)", unit: "currency", format: "currency" },
    { id: "SGK_toplam_isveren", label: "SGK total (employer share, annual)", unit: "currency", format: "currency" },
    { id: "issizlik_toplam", label: "Unemployment fund (employer, annual)", unit: "currency", format: "currency" },
    { id: "damgaVergisi", label: "Stamp tax (annual)", unit: "currency", format: "currency" },
    { id: "gelirVergisi_yillik", label: "Income tax withheld (annual)", unit: "currency", format: "currency" },
    { id: "kesintiToplami", label: "Total deductions (annual)", unit: "currency", format: "currency" },
    { id: "netUcret_Aylik", label: "Net monthly salary (per employee)", unit: "currency", format: "currency" },
    { id: "netUcret_Yillik", label: "Net annual salary (per employee)", unit: "currency", format: "currency" },
    { id: "isvereneToplamMaliyet", label: "Total employer cost (annual, per employee)", unit: "currency", format: "currency", isBigNumber: true },
    { id: "calisanaFayda_pct", label: "Net benefit ratio (net \u00f7 gross)", unit: "%", format: "percentage" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.living_wage", inputMap: { calisanSayisi: "calisanSayisi", brUcret_Aylik: "brUcret_Aylik", fazlaMesaiSaat_Aylik: "fazlaMesaiSaat_Aylik", fazlaMesaiKatsayisi: "fazlaMesaiKatsayisi", SGK_isverenOrani: "SGK_isverenOrani", issizlikFonuOrani: "issizlikFonuOrani", damgaVergiOrani: "damgaVergiOrani", gelirVergiDilimi: "gelirVergiDilimi", AGI_tutari: "AGI_tutari", yemekYardimi_Gunluk: "yemekYardimi_Gunluk", yolYardimi_Gunluk: "yolYardimi_Gunluk", calismaGunu_Ay: "calismaGunu_Ay" }, outputId: "netUcret_Aylik" }],
  reportTemplate: { title: "Living Wage & Employer Cost Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["SGK employer = br\u00fct \u00d7 (SGK_oran\u0131/100); \u0130\u015fsizlik = br\u00fct \u00d7 (i\u015fsizlik_oran\u0131/100).", "Damga vergisi = br\u00fct \u00d7 (damga_oran\u0131/100); Gelir vergisi = br\u00fct \u00d7 (vergi_dilimi/100).", "Net = br\u00fct - kesintiler + yard\u0131mlar; \u0130\u015fveren maliyeti = br\u00fct \u00d7 (1 + SGK/100 + i\u015fsizlik/100) + yard\u0131mlar.", "Results are technical simulations \u2014 consult a qualified payroll specialist for exact figures."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 30. Panel Radiator Heating Capacity Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const PANEL_RADIATOR_HEATING_SCHEMA: PremiumCalculatorSchema = {
  id: "panel-radiator-heating-capacity-calculator",
  legacyPaidSlug: "panel-radiator-heating-capacity-calculator",
  name: "Panel Radiator Heating Capacity Calculator",
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Sizing a panel radiator requires room heat-loss calculation (volume \u00d7 \u0394T \u00d7 U-value), panel output correction for non-standard operating temperatures, and boiler power verification \u2014 one wrong correction factor can undersize the radiator by 30%.",
  inputs: [
    { id: "odaUzunlugu", label: "Room length", type: "number", unit: "m", required: true, smartDefault: 5, validation: { min: 0.5 }, helper: "Length of the room.", expertMeaning: "L for room volume V = L \u00d7 W \u00d7 H" },
    { id: "odaGenisligi", label: "Room width", type: "number", unit: "m", required: true, smartDefault: 4, validation: { min: 0.5 }, helper: "Width of the room.", expertMeaning: "W for room volume" },
    { id: "odaYuksekligi", label: "Room height", type: "number", unit: "m", required: true, smartDefault: 2.7, validation: { min: 1, max: 10 }, helper: "Ceiling height.", expertMeaning: "H for room volume" },
    { id: "hedefSicaklik_Ti", label: "Target indoor temperature Ti", type: "number", unit: "\u00b0C", required: true, smartDefault: 22, validation: { min: 10, max: 35 }, helper: "Desired indoor temperature.", expertMeaning: "Ti \u2014 indoor set-point" },
    { id: "disSicaklik_To", label: "Outdoor design temperature To", type: "number", unit: "\u00b0C", required: true, smartDefault: 0, validation: { min: -40, max: 40 }, helper: "Winter design outdoor temperature for the region.", expertMeaning: "To for \u0394T = Ti - To" },
    { id: "izolasyonSeviyesi", label: "Insulation level", type: "select", unit: "", required: true, smartDefault: "orta", options: [...INSULATION_OPTIONS], helper: "Building envelope insulation quality.", expertMeaning: "Determines U-value multiplier (0.7 / 1.0 / 1.5 W/m\u00b3K)" },
    { id: "camTipi", label: "Window glazing type", type: "select", unit: "", required: true, smartDefault: "cift_cam", options: [...GLASS_TYPE_OPTIONS], helper: "Type of window glazing installed.", expertMeaning: "Glass U-value for window heat loss correction" },
    { id: "camAlani_Orani", label: "Window-to-wall area ratio", type: "number", unit: "%", required: true, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "Percentage of exterior wall area that is glazed.", expertMeaning: "Glazing ratio for solar gain and transmission loss adjustment" },
    { id: "kisiSayisi", label: "Number of occupants", type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 0, max: 200 }, helper: "Average number of people in the room.", expertMeaning: "Internal heat gain from occupants (~100 W/person)" },
    { id: "aydinlatmaW_m2", label: "Lighting power density", type: "number", unit: "W/m\u00b2", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "Installed lighting wattage per square meter.", expertMeaning: "Internal heat gain from lighting" },
    { id: "panelTipi", label: "Radiator panel type", type: "select", unit: "", required: true, smartDefault: "PKKP_22", options: [...PANEL_TYPE_OPTIONS], helper: "Panel type determines heat output per unit length.", expertMeaning: "PKKP types: row count + fin count" },
    { id: "isletimSicakligi", label: "Operating temperature regime", type: "select", unit: "", required: true, smartDefault: "75/65", options: [...OPERATING_TEMP_OPTIONS], helper: "Flow/return temperature of the heating system.", expertMeaning: "\u0394T_sys for power correction: Q_actual = Q_nom \u00d7 (\u0394T_sys/50)^n" },
    { id: "kazanVerimi_\u03b7", label: "Boiler efficiency", type: "number", unit: "%", required: true, smartDefault: 90, validation: { min: 50, max: 100 }, helper: "Condensing boiler: 90-98%; conventional: 75-85%.", expertMeaning: "\u03b7 for boiler input power = heat output / \u03b7" },
  ],
  outputs: [
    { id: "odaHacmi_m3", label: "Room volume", unit: "m\u00b3", format: "number" },
    { id: "isiIhtiyaci_W", label: "Total heat demand", unit: "W", format: "number", isBigNumber: true },
    { id: "isiIhtiyaci_kcalh", label: "Heat demand", unit: "kcal/h", format: "number" },
    { id: "panelGucu_W_75_65", label: "Panel output @ 75/65 \u00b0C", unit: "W", format: "number" },
    { id: "panelGucu_W_diger", label: "Panel output @ operating temp", unit: "W", format: "number" },
    { id: "gerekliPanelBoyu", label: "Required panel length", unit: "mm", format: "number" },
    { id: "secilenPanel", label: "Recommended panel specification", unit: "", format: "number" },
    { id: "kazanGucu_kW", label: "Required boiler power", unit: "kW", format: "number" },
    { id: "yillikIsitmaMaliyeti", label: "Annual heating cost (estimated)", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.panel_radiator", inputMap: { odaUzunlugu: "odaUzunlugu", odaGenisligi: "odaGenisligi", odaYuksekligi: "odaYuksekligi", hedefSicaklik_Ti: "hedefSicaklik_Ti", disSicaklik_To: "disSicaklik_To", izolasyonSeviyesi: "izolasyonSeviyesi", camTipi: "camTipi", camAlani_Orani: "camAlani_Orani", kisiSayisi: "kisiSayisi", aydinlatmaW_m2: "aydinlatmaW_m2", panelTipi: "panelTipi", isletimSicakligi: "isletimSicakligi", kazanVerimi_\u03b7: "kazanVerimi_\u03b7" }, outputId: "isiIhtiyaci_W" }],
  reportTemplate: { title: "Panel Radiator Sizing Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Heat loss = volume \u00d7 \u0394T \u00d7 U_factor \u00d7 correction; \u0394T = Ti - To.", "Panel power correction: Q_actual = Q_nom \u00d7 (\u0394T_m/50)^n per EN 442.", "Occupant heat gain ~100 W/person; lighting ~10 W/m\u00b2 typical.", "Annual energy cost assumes 2,000 equivalent full-load heating hours."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 31. Underfloor Heating Design Calculator (EN 1264)
 * ════════════════════════════════════════════════════════════════════════════ */

const UNDERFLOOR_HEATING_SCHEMA: PremiumCalculatorSchema = {
  id: "underfloor-heating-design-calculator",
  legacyPaidSlug: "underfloor-heating-design-calculator",
  name: "Underfloor Heating Design Calculator",
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Underfloor heating design per EN 1264 requires iterative calculation of floor surface temperature, heat flux, pipe spacing, circuit count, pressure drop, and pump sizing \u2014 a manual miss in any parameter leads to cold spots or excessive floor temperature.",
  inputs: [
    { id: "alanUzunlugu", label: "Heated area length", type: "number", unit: "m", required: true, smartDefault: 8, validation: { min: 0.5 }, helper: "Length of the heated floor area.", expertMeaning: "L for heated area A = L \u00d7 W" },
    { id: "alanGenisligi", label: "Heated area width", type: "number", unit: "m", required: true, smartDefault: 6, validation: { min: 0.5 }, helper: "Width of the heated floor area.", expertMeaning: "W for heated area" },
    { id: "odaSicakligi_Ti", label: "Target room temperature Ti", type: "number", unit: "\u00b0C", required: true, smartDefault: 22, validation: { min: 10, max: 35 }, helper: "Desired indoor air temperature.", expertMeaning: "Ti for \u0394T_floor = T_floor_mean - Ti" },
    { id: "serpantinAraligi_cm", label: "Pipe spacing (serpentine pitch)", type: "number", unit: "cm", required: true, smartDefault: 15, validation: { min: 5, max: 50 }, helper: "Center-to-center distance between pipe loops.", expertMeaning: "T for pipe length per m\u00b2 = 100/T (m/m\u00b2)" },
    { id: "zeminTipi", label: "Floor covering type", type: "select", unit: "", required: true, smartDefault: "sap", options: [...FLOOR_TYPE_OPTIONS], helper: "Floor finish affects thermal resistance upward.", expertMeaning: "R_floor for upward heat flux calculation per EN 1264" },
    { id: "isletimSicakligi_gidis", label: "Flow temperature (supply)", type: "number", unit: "\u00b0C", required: true, smartDefault: 45, validation: { min: 20, max: 60 }, helper: "Water temperature entering the floor loop.", expertMeaning: "T_supply for \u0394T_system = T_supply - T_return" },
    { id: "donusSicakligi", label: "Return temperature", type: "number", unit: "\u00b0C", required: true, smartDefault: 35, validation: { min: 15, max: 55 }, helper: "Water temperature returning from the floor loop.", expertMeaning: "T_return \u2014 \u0394T_system typically 5-10 K" },
    { id: "boruDisCap_mm", label: "Pipe outer diameter", type: "select", unit: "", required: true, smartDefault: "16", options: [...PIPE_DIAMETER_OPTIONS], helper: "Pipe diameter affects hydraulic resistance.", expertMeaning: "d for pressure drop and max loop length" },
    { id: "b\u00f6lgeDebisi_Lmin", label: "Zone flow rate", type: "number", unit: "L/min", required: true, smartDefault: 10, validation: { min: 0.5 }, helper: "Water flow rate per zone or manifold circuit.", expertMeaning: "Q_flow for \u0394P and heat transport capacity" },
    { id: "odadanCokOdaya", label: "Number of zones / rooms served", type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 50 }, helper: "How many separate zones this manifold serves.", expertMeaning: "N_zones for total manifold flow and pump sizing" },
    { id: "pompVerimi_\u03b7", label: "Circulation pump efficiency", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 10, max: 100 }, helper: "Pump motor and hydraulic efficiency.", expertMeaning: "\u03b7_pump for electrical pump power = hydraulic power / \u03b7" },
  ],
  outputs: [
    { id: "isitmaAlani_m2", label: "Heated floor area", unit: "m\u00b2", format: "number" },
    { id: "ortalamaZeminSicakligi", label: "Mean floor surface temperature", unit: "\u00b0C", format: "number" },
    { id: "isiAkisi_Wm2", label: "Heat flux upward", unit: "W/m\u00b2", format: "number" },
    { id: "toplamIsiGucu", label: "Total heating power", unit: "W", format: "number", isBigNumber: true },
    { id: "boruBoyu_toplam", label: "Total pipe length", unit: "m", format: "number" },
    { id: "boruSayisi_devre", label: "Circuits in parallel", unit: "", format: "number" },
    { id: "boruBoyu_devre", label: "Pipe length per circuit", unit: "m", format: "number" },
    { id: "devreSayisi", label: "Number of circuits required", unit: "", format: "number" },
    { id: "basincDusumu_bar", label: "Pressure drop per circuit", unit: "bar", format: "number" },
    { id: "pompaDebisi", label: "Required pump flow rate", unit: "L/min", format: "number" },
    { id: "pompaBasinci_mSS", label: "Required pump head", unit: "mSS", format: "number" },
    { id: "pompaGucu", label: "Pump electrical power", unit: "W", format: "number" },
  ],
  thresholds: [{ fieldId: "ortalamaZeminSicakligi", warning: 29, critical: 35, direction: "higher_is_bad", warningMessage: "Floor temperature exceeds 29 \u00b0C comfort limit (TS EN 1264).", criticalMessage: "Floor temperature exceeds 35 \u00b0C \u2014 possible discomfort or damage." }],
  formulaPipeline: [{ formulaId: "industrial.underfloor_heating", inputMap: { alanUzunlugu: "alanUzunlugu", alanGenisligi: "alanGenisligi", odaSicakligi_Ti: "odaSicakligi_Ti", serpantinAraligi_cm: "serpantinAraligi_cm", zeminTipi: "zeminTipi", isletimSicakligi_gidis: "isletimSicakligi_gidis", donusSicakligi: "donusSicakligi", boruDisCap_mm: "boruDisCap_mm", b\u00f6lgeDebisi_Lmin: "b\u00f6lgeDebisi_Lmin", pompVerimi_\u03b7: "pompVerimi_\u03b7" }, outputId: "toplamIsiGucu" }],
  reportTemplate: { title: "Underfloor Heating Design Report (EN 1264)", sections: ["executive_summary", "thresholds", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Design per EN 1264: floor surface temp \u2264 29 \u00b0C (occupied), \u2264 35 \u00b0C (perimeter).", "Pipe length per circuit limited to \u2264 120 m (16 mm) or \u2264 150 m (20 mm).", "Pressure drop uses Darcy-Weisbach + minor losses (K-factor method).", "Results are technical simulations \u2014 verify with a certified HVAC engineer."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 32. Solar Tube / Solar Collector Sizing Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const SOLAR_COLLECTOR_SCHEMA: PremiumCalculatorSchema = {
  id: "solar-tube-collector-sizing-calculator",
  legacyPaidSlug: "solar-tube-collector-sizing-calculator",
  name: "Solar Tube / Solar Collector Sizing Calculator",
  sectorSlug: "hvac",
  category: "measurement",
  painStatement: "Sizing a solar thermal system requires balancing hot water demand, collector area, storage volume, solar irradiation, and auxiliary backup \u2014 oversizing the collector wastes investment, undersizing leaves reliance on expensive backup energy.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code for output formatting." },
    { id: "kullaniciSayisi", label: "Number of users", type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1, max: 1000 }, helper: "Number of people consuming hot water.", expertMeaning: "n for daily demand Q = n \u00d7 L/person \u00d7 cp \u00d7 \u0394T" },
    { id: "gunlukKullanim_su_L_kisi", label: "Daily hot water consumption per person", type: "number", unit: "L/person/day", required: true, smartDefault: 50, validation: { min: 5, max: 500 }, helper: "Average hot water usage per person per day.", expertMeaning: "L/person/day \u2014 typical: 30-60 (residential), 20-40 (office)" },
    { id: "sogukSuSicakligi_Tc", label: "Cold water inlet temperature Tc", type: "number", unit: "\u00b0C", required: true, smartDefault: 10, validation: { min: 0, max: 30 }, helper: "Ground water temperature entering the system.", expertMeaning: "Tc for \u0394T = Tg - Tc" },
    { id: "sicakSuHedef_Tg", label: "Target hot water temperature Tg", type: "number", unit: "\u00b0C", required: true, smartDefault: 60, validation: { min: 30, max: 90 }, helper: "Desired hot water storage temperature.", expertMeaning: "Tg \u2014 legionella prevention: \u2265 60 \u00b0C" },
    { id: "kolektorVerimi_\u03b7_kol", label: "Collector efficiency", type: "number", unit: "%", required: true, smartDefault: 70, validation: { min: 10, max: 95 }, helper: "Optical and thermal efficiency of the collector.", expertMeaning: "\u03b7_kol \u2014 flat plate ~70%, evacuated tube ~80%, heat pipe ~85%" },
    { id: "guneslenmeSuresi_saat", label: "Daily sunshine duration", type: "number", unit: "hours", required: true, smartDefault: 5, validation: { min: 1, max: 16 }, helper: "Average daily peak sun hours for the location.", expertMeaning: "t_sun \u2014 hours of usable solar irradiation per day" },
    { id: "gunesIsinimiGunl\u00fck_Wm2", label: "Daily solar irradiance", type: "number", unit: "W/m\u00b2", required: true, smartDefault: 500, validation: { min: 50, max: 1200 }, helper: "Average daily solar power per square meter.", expertMeaning: "I for Q_solar = I \u00d7 A \u00d7 \u03b7 \u00d7 t" },
    { id: "kolektorTipi", label: "Collector type", type: "select", unit: "", required: true, smartDefault: "duz_levha", options: [...COLLECTOR_TYPE_OPTIONS], helper: "Type of solar thermal collector.", expertMeaning: "Affects efficiency, cost, and operating temperature range" },
    { id: "depolamaKapasitesi_saat", label: "Storage capacity factor", type: "number", unit: "hours", required: false, smartDefault: 24, validation: { min: 1, max: 72 }, helper: "Hours of hot water demand the storage tank should cover.", expertMeaning: "T_storage \u2014 typical 24h (residential), 12h (commercial)" },
    { id: "yardimciKaynak", label: "Auxiliary backup source", type: "select", unit: "", required: true, smartDefault: "elektrikli", options: [...AUXILIARY_SOURCE_OPTIONS], helper: "Backup heating when solar is insufficient.", expertMeaning: "Determines auxiliary energy cost rate" },
    { id: "yardimciKaynakVerimi_\u03b7_yd", label: "Auxiliary heater efficiency", type: "number", unit: "%", required: true, smartDefault: 100, validation: { min: 50, max: 100 }, helper: "Efficiency of the backup heating device.", expertMeaning: "\u03b7_yd \u2014 electric: ~100%, gas: ~90%, heat pump: ~300%" },
    { id: "enerjiBirimFiyati", label: "Energy unit price", type: "number", unit: "currency/kWh", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "Cost per kWh of auxiliary energy.", expertMeaning: "Price per kWh for annual operating cost calculation" },
  ],
  outputs: [
    { id: "gunlukSicakSuIhtiyaci_L", label: "Daily hot water demand", unit: "L/day", format: "number" },
    { id: "gunlukToplamEnerji_kWh", label: "Daily thermal energy requirement", unit: "kWh", format: "number" },
    { id: "kolektorAlan\u0131_m2", label: "Required collector area", unit: "m\u00b2", format: "number" },
    { id: "depolamaHacmi_L", label: "Recommended storage tank volume", unit: "L", format: "number" },
    { id: "yardimciKaynakEnerji_kWh_y\u0131l", label: "Annual auxiliary energy consumption", unit: "kWh/year", format: "number", isBigNumber: true },
    { id: "yillikEnerjiMaliyeti", label: "Annual auxiliary energy cost", unit: "currency", format: "currency" },
    { id: "yillikTasarruf_percent", label: "Solar fraction (annual savings %)", unit: "%", format: "percentage" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.solar_collector", inputMap: { kullaniciSayisi: "kullaniciSayisi", gunlukKullanim_su_L_kisi: "gunlukKullanim_su_L_kisi", sogukSuSicakligi_Tc: "sogukSuSicakligi_Tc", sicakSuHedef_Tg: "sicakSuHedef_Tg", kolektorVerimi_\u03b7_kol: "kolektorVerimi_\u03b7_kol", guneslenmeSuresi_saat: "guneslenmeSuresi_saat", gunesIsinimiGunl\u00fck_Wm2: "gunesIsinimiGunl\u00fck_Wm2" }, outputId: "kolektorAlan\u0131_m2" }],
  reportTemplate: { title: "Solar Collector Sizing Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Energy demand: Q = m \u00d7 cp \u00d7 \u0394T; Collector area: A = Q / (I \u00d7 \u03b7_kol \u00d7 t).", "Solar fraction assumes 300 sunny-day-equivalents per year (temperate climate).", "Storage sized for T_storage hours of demand; minimum 1.2 \u00d7 daily demand.", "Results are technical simulations \u2014 verify with a certified solar installer."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 33. EPQ (Economic Production Quantity) Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const EPQ_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "epq-production-quantity-calculator",
  legacyPaidSlug: "epq-production-quantity-calculator",
  name: "EPQ (Economic Production Quantity) Calculator",
  sectorSlug: "general",
  category: "cost",
  painStatement: "The classic EOQ formula ignores finite production rates, leading to overestimated batch sizes for make-to-stock environments. The EPQ model accounts for simultaneous production and consumption with finite replenishment rate.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code for output formatting." },
    { id: "yillikTalep_D", label: "Annual demand D", type: "number", unit: "units/year", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "Total annual customer demand.", expertMeaning: "D for EPQ = \u221a(2 \u00d7 D \u00d7 S / (H \u00d7 (1 - d/p)))" },
    { id: "hazirlikMaliyeti_S", label: "Setup / changeover cost S", type: "number", unit: "currency", required: true, smartDefault: 500, validation: { min: 0 }, helper: "Cost per production run setup (labor, scrap, downtime).", expertMeaning: "S \u2014 setup cost per batch" },
    { id: "birimStokTutmaMaliyeti_H", label: "Unit holding cost H", type: "number", unit: "currency/unit/year", required: true, smartDefault: 2, validation: { min: 0 }, helper: "Cost to hold one unit in inventory for one year.", expertMeaning: "H \u2014 storage, insurance, obsolescence, opportunity cost" },
    { id: "gunlukUretimHizi_p", label: "Daily production rate p", type: "number", unit: "units/day", required: true, smartDefault: 100, validation: { min: 1 }, helper: "Maximum production output per day.", expertMeaning: "p \u2014 finite replenishment rate (p > d required)" },
    { id: "gunlukTalepHizi_d", label: "Daily demand rate d", type: "number", unit: "units/day", required: true, smartDefault: 40, validation: { min: 0 }, helper: "Average daily consumption rate.", expertMeaning: "d \u2014 must be < p for EPQ to be finite and positive" },
    { id: "birimDegiskenMaliyet_C", label: "Unit variable cost C", type: "number", unit: "currency", required: false, smartDefault: 10, validation: { min: 0 }, helper: "Direct material + labor + overhead per unit.", expertMeaning: "C for total production cost = D \u00d7 C" },
    { id: "satisFiyati_P", label: "Unit selling price P", type: "number", unit: "currency", required: false, smartDefault: 25, validation: { min: 0 }, helper: "Revenue per unit sold.", expertMeaning: "P for gross margin = (P - C) \u00d7 D" },
    { id: "calismaGunu_yil", label: "Working days per year", type: "number", unit: "days", required: true, smartDefault: 250, validation: { min: 1, max: 366 }, helper: "Number of production days per year.", expertMeaning: "N_days to derive d = D / N_days" },
  ],
  outputs: [
    { id: "EPQ_miktar", label: "Economic Production Quantity EPQ", unit: "units", format: "number" },
    { id: "envanterDongusu_gun", label: "Inventory cycle length", unit: "days", format: "number" },
    { id: "maksimumStok", label: "Maximum inventory level", unit: "units", format: "number" },
    { id: "yillikHazirlikMaliyeti", label: "Annual setup cost", unit: "currency", format: "currency" },
    { id: "yillikStokMaliyeti", label: "Annual holding cost", unit: "currency", format: "currency" },
    { id: "toplamStokMaliyeti_yillik", label: "Total annual inventory cost", unit: "currency", format: "currency" },
    { id: "ortalamaStok", label: "Average inventory", unit: "units", format: "number" },
    { id: "devirSayisi", label: "Inventory turns per year", unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.epq", inputMap: { yillikTalep_D: "yillikTalep_D", hazirlikMaliyeti_S: "hazirlikMaliyeti_S", birimStokTutmaMaliyeti_H: "birimStokTutmaMaliyeti_H", gunlukUretimHizi_p: "gunlukUretimHizi_p", gunlukTalepHizi_d: "gunlukTalepHizi_d", calismaGunu_yil: "calismaGunu_yil" }, outputId: "EPQ_miktar" }],
  reportTemplate: { title: "EPQ \u2014 Economic Production Quantity Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["EPQ = \u221a(2 \u00d7 D \u00d7 S / (H \u00d7 (1 - d/p))); requires p > d.", "Maximum inventory = EPQ \u00d7 (1 - d/p).", "Assumes constant demand and production rates (deterministic model).", "Results are technical simulations \u2014 adjust for demand seasonality."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 34. Kanban Bin / Card Count Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const KANBAN_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "kanban-bin-card-calculator",
  legacyPaidSlug: "kanban-bin-card-calculator",
  name: "Kanban Bin / Card Count Calculator",
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Setting the correct number of Kanban cards is a balance between stock-out risk and WIP. The standard formula accounts for demand, lead time, safety stock factor, and container capacity \u2014 one wrong factor creates either shortages or excess inventory.",
  inputs: [
    { id: "gunlukTalep_d", label: "Daily demand d", type: "number", unit: "units/day", required: true, smartDefault: 100, validation: { min: 1 }, helper: "Average daily consumption rate of the part.", expertMeaning: "d for Kanban count = (d \u00d7 LT \u00d7 (1 + k)) / q + 1" },
    { id: "tedarikSuresi_LT", label: "Lead time LT", type: "number", unit: "days", required: true, smartDefault: 3, validation: { min: 0.1 }, helper: "Total replenishment lead time (production + transport).", expertMeaning: "LT \u2014 time from signal to receipt" },
    { id: "guvenlikStoguFaktoru_k", label: "Safety stock factor k", type: "number", unit: "", required: true, smartDefault: 0.2, validation: { min: 0, max: 2 }, helper: "Safety buffer as a decimal fraction of lead time demand (0.2 = 20%).", expertMeaning: "k \u2014 safety stock = k \u00d7 d \u00d7 LT" },
    { id: "kutuKapasitesi_q", label: "Container capacity q", type: "number", unit: "units/container", required: true, smartDefault: 20, validation: { min: 1 }, helper: "Number of units per Kanban container or bin.", expertMeaning: "q \u2014 standard container size" },
    { id: "kartTuru", label: "Kanban card type", type: "select", unit: "", required: false, smartDefault: "cekim", options: [...CARD_TYPE_OPTIONS], helper: "Type of Kanban signal being calculated.", expertMeaning: "Withdrawal: inter-process transport; Production: build signal; Signal: batch trigger" },
  ],
  outputs: [
    { id: "kanbanSayisi", label: "Number of Kanban cards required", unit: "", format: "number" },
    { id: "emniyetStogu_miktar", label: "Safety stock quantity", unit: "units", format: "number" },
    { id: "optimumSiparisMiktari", label: "Optimum order quantity", unit: "units", format: "number" },
    { id: "toplamStok", label: "Total Kanban stock (active + safety)", unit: "units", format: "number" },
    { id: "devirHizi_yillik", label: "Annual inventory turns", unit: "", format: "number" },
    { id: "yillikStokMaliyeti", label: "Annual stocking cost (estimated)", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.kanban", inputMap: { gunlukTalep_d: "gunlukTalep_d", tedarikSuresi_LT: "tedarikSuresi_LT", guvenlikStoguFaktoru_k: "guvenlikStoguFaktoru_k", kutuKapasitesi_q: "kutuKapasitesi_q" }, outputId: "kanbanSayisi" }],
  reportTemplate: { title: "Kanban Card Count Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Kanban count = (d \u00d7 LT \u00d7 (1 + k)) / q + 1 (rounded up).", "Safety stock = k \u00d7 d \u00d7 LT; assumes stable demand and lead time.", "Annual stocking cost estimated at 20% of average inventory value.", "Results are technical simulations \u2014 adjust k based on process variability."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 35. Little's Law (WIP) Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const LITTLES_LAW_SCHEMA: PremiumCalculatorSchema = {
  id: "littles-law-calculator",
  legacyPaidSlug: "littles-law-calculator",
  name: "Little's Law (WIP) Calculator",
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Little's Law (WIP = CT \u00d7 TH) is the fundamental equation of queuing theory, yet most teams don't track all three metrics simultaneously. Given any two, this tool computes the third and translates WIP into financial exposure.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "Currency for WIP cost calculation.", expertMeaning: "ISO code for cost output formatting." },
    { id: "prosesTipi", label: "Process type", type: "select", unit: "", required: true, smartDefault: "manufacturing", options: [...PROCESS_TYPE_OPTIONS], helper: "Type of process for metric interpretation.", expertMeaning: "Service: people-flow; MFG: material-flow; SW: work-item-flow" },
    { id: "wip_miktar", label: "Work in Process WIP", type: "number", unit: "units", required: false, smartDefault: 500, validation: { min: 0 }, helper: "Current number of items in the system (omit to compute).", expertMeaning: "WIP \u2014 items started but not finished" },
    { id: "cikisHizi", label: "Throughput TH", type: "number", unit: "units/hour", required: false, smartDefault: 10, validation: { min: 0 }, helper: "Average completion rate (omit to compute).", expertMeaning: "TH \u2014 throughput (units/time), also called exit rate" },
    { id: "cevrimSuresi_CT", label: "Cycle time CT", type: "number", unit: "hours", required: false, smartDefault: 0, validation: { min: 0 }, helper: "Average time from start to finish (omit to compute).", expertMeaning: "CT \u2014 cycle time = WIP / TH" },
    { id: "maliyet_birim", label: "Average cost per WIP unit", type: "number", unit: "currency", required: false, smartDefault: 50, validation: { min: 0 }, helper: "Average value or cost tied up in each WIP unit.", expertMeaning: "For WIP financial exposure = WIP \u00d7 cost" },
  ],
  outputs: [
    { id: "cevrimSuresi_hesaplanan", label: "Cycle time CT (computed)", unit: "hours", format: "number" },
    { id: "wip_hesaplanan", label: "WIP (computed)", unit: "units", format: "number" },
    { id: "cikis_hesaplanan", label: "Throughput TH (computed)", unit: "units/hour", format: "number" },
    { id: "wipMaliyeti", label: "WIP financial exposure", unit: "currency", format: "currency", isBigNumber: true },
    { id: "cevrimSuresi_dakika", label: "Cycle time", unit: "minutes", format: "number" },
    { id: "throughput_g\u00fcnl\u00fck", label: "Daily throughput (8h shift)", unit: "units/day", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.littles_law", inputMap: { prosesTipi: "prosesTipi", wip_miktar: "wip_miktar", cikisHizi: "cikisHizi", cevrimSuresi_CT: "cevrimSuresi_CT" }, outputId: "cevrimSuresi_hesaplanan" }],
  reportTemplate: { title: "Little's Law \u2014 WIP Analysis Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Little's Law: WIP = CT \u00d7 TH; CT = WIP / TH; TH = WIP / CT.", "Assumes steady-state (stationary) process with stable averages.", "Enter exactly 2 of 3 variables (WIP, CT, TH); the third is computed.", "Daily throughput = TH \u00d7 8 (assuming 8-hour shift).", "WIP cost = WIP \u00d7 average cost per unit (financial exposure estimate)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 36. Milk Run Route Optimization Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const MILK_RUN_SCHEMA: PremiumCalculatorSchema = {
  id: "milk-run-route-calculator",
  legacyPaidSlug: "milk-run-route-calculator",
  name: "Milk Run Route Optimization Calculator",
  sectorSlug: "logistics",
  category: "cost",
  painStatement: "Milk-run collection logistics must balance supplier distance, vehicle capacity, load/unload time, waiting time, and driver cost against dedicated pickup costs. Without a structured comparison, logistics managers cannot quantify the savings potential of switching from dedicated to milk-run routing.",
  inputs: [
    { id: "currency", label: "Currency", type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", expertMeaning: "ISO code for output formatting." },
    { id: "tedarikciSayisi", label: "Number of suppliers on route", type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 100 }, helper: "Suppliers visited in one milk-run circuit.", expertMeaning: "N_suppliers for total route distance and time" },
    { id: "tedarikciMesafe_ortalama", label: "Average distance per supplier leg", type: "number", unit: "km", required: true, smartDefault: 30, validation: { min: 0.1 }, helper: "Average one-way distance between consecutive stops.", expertMeaning: "d_avg \u2014 includes depot-to-first and last-to-depot" },
    { id: "turSayisi_gunluk", label: "Number of milk-run tours per day", type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 10 }, helper: "How many complete circuits per day.", expertMeaning: "N_tours for total daily distance = N_tours \u00d7 route_distance" },
    { id: "arabaMaliyeti_km", label: "Vehicle cost per km", type: "number", unit: "currency/km", required: true, smartDefault: 0.5, validation: { min: 0.01 }, helper: "Fuel + maintenance + tire cost per kilometer.", expertMeaning: "C_km \u2014 variable vehicle operating cost" },
    { id: "arabaTamYuk_kg", label: "Vehicle full load capacity", type: "number", unit: "kg", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "Maximum payload weight per vehicle.", expertMeaning: "Capacity constraint for load consolidation check" },
    { id: "talep_gunluk_kg", label: "Daily total collection volume", type: "number", unit: "kg/day", required: true, smartDefault: 2000, validation: { min: 1 }, helper: "Total daily material weight to be collected.", expertMeaning: "Q_daily \u2014 must be \u2264 capacity \u00d7 tours for feasibility" },
    { id: "yuklemeBosaltmaDk", label: "Load/unload time per stop", type: "number", unit: "minutes", required: true, smartDefault: 20, validation: { min: 0 }, helper: "Time to load collected goods at each supplier.", expertMeaning: "T_load per stop \u2014 affects total route duration" },
    { id: "beklemeSuresiDk", label: "Waiting time per stop", type: "number", unit: "minutes", required: false, smartDefault: 10, validation: { min: 0 }, helper: "Average queue/wait time at each supplier.", expertMeaning: "T_wait \u2014 document handling, security, delays" },
    { id: "ortalamaHiz_kmh", label: "Average vehicle speed", type: "number", unit: "km/h", required: true, smartDefault: 50, validation: { min: 5, max: 120 }, helper: "Average travel speed including traffic.", expertMeaning: "v_avg for travel time = distance / v_avg" },
    { id: "surucuSaatUcreti", label: "Driver hourly wage", type: "number", unit: "currency/hour", required: true, smartDefault: 15, validation: { min: 0 }, helper: "Fully loaded driver labor cost per hour.", expertMeaning: "C_driver \u2014 for total driver cost" },
    { id: "rotaPlanlamaMaliyeti", label: "Route planning overhead (daily)", type: "number", unit: "currency/day", required: false, smartDefault: 100, validation: { min: 0 }, helper: "Daily fixed cost for route planning and administration.", expertMeaning: "C_plan \u2014 fixed daily overhead for milk-run operations" },
    { id: "aracSabitMaliyeti_gun", label: "Daily fixed vehicle cost", type: "number", unit: "currency/day", required: false, smartDefault: 200, validation: { min: 0 }, helper: "Daily depreciation, insurance, and licensing per vehicle.", expertMeaning: "C_fixed \u2014 daily fixed cost per vehicle" },
  ],
  outputs: [
    { id: "toplamMesafe", label: "Total daily route distance", unit: "km/day", format: "number" },
    { id: "toplamSure", label: "Total route duration", unit: "hours", format: "number" },
    { id: "surucuMaliyeti", label: "Driver cost (daily)", unit: "currency", format: "currency" },
    { id: "akaryakitMaliyeti", label: "Fuel / per-km cost (daily)", unit: "currency", format: "currency" },
    { id: "rotaPlanlamaMaliyeti_out", label: "Route planning overhead (daily)", unit: "currency", format: "currency" },
    { id: "toplamGunlukMaliyet", label: "Total daily milk-run cost", unit: "currency", format: "currency" },
    { id: "mevcutToplamaMaliyeti", label: "Estimated dedicated collection cost (baseline)", unit: "currency", format: "currency" },
    { id: "aylikTasarruf", label: "Monthly savings vs dedicated", unit: "currency", format: "currency", isBigNumber: true },
    { id: "yillikTasarruf", label: "Annual savings vs dedicated", unit: "currency", format: "currency", isBigNumber: true },
    { id: "tasarrufOrani", label: "Savings percentage", unit: "%", format: "percentage" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.milk_run", inputMap: { tedarikciSayisi: "tedarikciSayisi", tedarikciMesafe_ortalama: "tedarikciMesafe_ortalama", turSayisi_gunluk: "turSayisi_gunluk", arabaMaliyeti_km: "arabaMaliyeti_km", surucuSaatUcreti: "surucuSaatUcreti", yuklemeBosaltmaDk: "yuklemeBosaltmaDk", beklemeSuresiDk: "beklemeSuresiDk", ortalamaHiz_kmh: "ortalamaHiz_kmh" }, outputId: "toplamGunlukMaliyet" }],
  reportTemplate: { title: "Milk Run Route Optimization Report", sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Milk-run distance = N_suppliers \u00d7 d_avg \u00d7 N_tours (simplified circular route).", "Baseline (dedicated): each supplier visited independently = 2 \u00d7 d_avg per trip.", "Total daily cost = distance cost + driver cost + planning + fixed vehicle cost.", "Results are technical simulations \u2014 verify with real route data."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 37. CPM / PERT (Critical Path Method)
 * ════════════════════════════════════════════════════════════════════════════ */

const CPM_PERT_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-pert-calculator",
  legacyPaidSlug: "cpm-pert-calculator",
  name: "CPM / PERT Critical Path Analyzer", name_i18n: {"en":"CPM / PERT Critical Path Analyzer"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Manual PERT calculations (Te = (O+4M+P)/6, variance, Z-scores) are tedious and error-prone in spreadsheets. This tool automates the full critical path analysis with probabilistic completion estimates.", painStatement_i18n: {"en":"Manual PERT calculations (Te = (O+4M+P)/6, variance, Z-scores) are tedious and error-prone in spreadsheets. This tool automates the full critical path analysis with probabilistic completion estimates."},
  inputs: [
    { id: "aktiviteSayisi", label: "Number of activities", label_i18n: {"en":"Number of activities"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1, max: 1000 }, helper: "Total number of activities in the project network.", helper_i18n: {"en":"Total number of activities in the project network."}, expertMeaning: "n for activity count", expertMeaning_i18n: {"en":"n for activity count"} },
    { id: "iyimserSure", label: "Optimistic time (days)", label_i18n: {"en":"Optimistic time (days)"}, type: "number", unit: "days", required: true, smartDefault: 5, validation: { min: 0.1 }, helper: "Activity duration under ideal conditions (O).", helper_i18n: {"en":"Activity duration under ideal conditions (O)."}, expertMeaning: "O for Te = (O+4M+P)/6", expertMeaning_i18n: {"en":"O for Te = (O+4M+P)/6"} },
    { id: "enOlasiSure", label: "Most likely time (days)", label_i18n: {"en":"Most likely time (days)"}, type: "number", unit: "days", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "Activity duration under normal conditions (M).", helper_i18n: {"en":"Activity duration under normal conditions (M)."}, expertMeaning: "M for Te = (O+4M+P)/6", expertMeaning_i18n: {"en":"M for Te = (O+4M+P)/6"} },
    { id: "kotumserSure", label: "Pessimistic time (days)", label_i18n: {"en":"Pessimistic time (days)"}, type: "number", unit: "days", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "Activity duration under worst-case conditions (P).", helper_i18n: {"en":"Activity duration under worst-case conditions (P)."}, expertMeaning: "P for Te = (O+4M+P)/6 and \u03c3\u00b2 = ((P-O)/6)\u00b2", expertMeaning_i18n: {"en":"P for Te = (O+4M+P)/6 and \u03c3\u00b2 = ((P-O)/6)\u00b2"} },
    { id: "kritikAktiviteSayisi", label: "Activities on critical path", label_i18n: {"en":"Activities on critical path"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1 }, helper: "Number of activities on the longest path determining project duration.", helper_i18n: {"en":"Number of activities on the longest path determining project duration."}, expertMeaning: "k for critical path variance sum", expertMeaning_i18n: {"en":"k for critical path variance sum"} },
    { id: "hedefTamamlamaSuresi", label: "Target completion (days)", label_i18n: {"en":"Target completion (days)"}, type: "number", unit: "days", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "Desired project completion deadline in days.", helper_i18n: {"en":"Desired project completion deadline in days."}, expertMeaning: "T for Z = (T - CriticalPath) / \u03c3", expertMeaning_i18n: {"en":"T for Z = (T - CriticalPath) / \u03c3"} },
    { id: "maliyet_kritikAktivite", label: "Cost per critical activity", label_i18n: {"en":"Cost per critical activity"}, type: "number", unit: "currency", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "Estimated cost per activity on the critical path.", helper_i18n: {"en":"Estimated cost per activity on the critical path."}, expertMeaning: "For total cost estimate", expertMeaning_i18n: {"en":"For total cost estimate"} },
  ],
  outputs: [
    { id: "beklenenSure", label: "Expected time Te", label_i18n: {"en":"Expected time Te"}, unit: "days", format: "number" },
    { id: "varyans", label: "Variance \u03c3\u00b2", label_i18n: {"en":"Variance \u03c3\u00b2"}, unit: "", format: "number" },
    { id: "standartSapma", label: "Std deviation \u03c3", label_i18n: {"en":"Std deviation \u03c3"}, unit: "days", format: "number" },
    { id: "kritikYolSuresi", label: "Critical path duration", label_i18n: {"en":"Critical path duration"}, unit: "days", format: "number" },
    { id: "zSkoru", label: "Z-score", label_i18n: {"en":"Z-score"}, unit: "", format: "number" },
    { id: "tamamlanmaOlasiligi", label: "Completion probability", label_i18n: {"en":"Completion probability"}, unit: "%", format: "percentage" },
    { id: "toplamProjeMaliyeti", label: "Total project cost", label_i18n: {"en":"Total project cost"}, unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.cpm_pert_0", inputMap: { optimisticTime: "iyimserSure", mostLikelyTime: "enOlasiSure", pessimisticTime: "kotumserSure", criticalActivities: "kritikAktiviteSayisi", targetCompletion: "hedefTamamlamaSuresi", costPerActivity: "maliyet_kritikAktivite" }, outputId: "beklenenSure" }],
  reportTemplate: { title: "CPM/PERT Critical Path Report", title_i18n: {"en":"CPM/PERT Critical Path Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["PERT: Te = (O+4M+P)/6, \u03c3\u00b2 = ((P-O)/6)\u00b2.", "Critical path duration = Te \u00d7 critical activities.", "Z = (Target - CriticalPath) / \u03c3; normal distribution for probability.", "PERT assumes beta distribution for activity times.", "Cost estimate based on critical path activities only."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 38. Queuing Theory (M/M/1)
 * ════════════════════════════════════════════════════════════════════════════ */

const QUEUING_MM1_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "queuing-mm1-calculator",
  legacyPaidSlug: "queuing-mm1-calculator",
  name: "Queuing Theory (M/M/1) Analyzer", name_i18n: {"en":"Queuing Theory (M/M/1) Analyzer"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Manual M/M/1 queuing calculations (\u03bb, \u03bc, \u03c1, L, Lq, W, Wq) and cost trade-off analysis are repetitive and error-prone. This tool automates the full single-server queue with cost optimization.", painStatement_i18n: {"en":"Manual M/M/1 queuing calculations (\u03bb, \u03bc, \u03c1, L, Lq, W, Wq) and cost trade-off analysis are repetitive and error-prone. This tool automates the full single-server queue with cost optimization."},
  inputs: [
    { id: "musteriSayisi_gunluk", label: "Daily customer arrivals", label_i18n: {"en":"Daily customer arrivals"}, type: "number", unit: "", required: true, smartDefault: 100, validation: { min: 1 }, helper: "Total number of customers arriving per day.", helper_i18n: {"en":"Total number of customers arriving per day."}, expertMeaning: "\u03bb for \u03bb = arrivals/day \u00f7 working hours", expertMeaning_i18n: {"en":"\u03bb for \u03bb = arrivals/day \u00f7 working hours"} },
    { id: "calismaSaati_gunluk", label: "Working hours per day", label_i18n: {"en":"Working hours per day"}, type: "number", unit: "hours", required: true, smartDefault: 8, validation: { min: 1, max: 24 }, helper: "Hours of operation per day.", helper_i18n: {"en":"Hours of operation per day."}, expertMeaning: "For \u03bb = arrivals/hr", expertMeaning_i18n: {"en":"For \u03bb = arrivals/hr"} },
    { id: "ortalamaServisSuresi_dk", label: "Average service time (min)", label_i18n: {"en":"Average service time (min)"}, type: "number", unit: "min", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "Average time to serve one customer in minutes.", helper_i18n: {"en":"Average time to serve one customer in minutes."}, expertMeaning: "1/\u03bc for \u03bc = 60 / service_min", expertMeaning_i18n: {"en":"1/\u03bc for \u03bc = 60 / service_min"} },
    { id: "kuyrukMaliyeti_beklemeDk", label: "Waiting cost per min", label_i18n: {"en":"Waiting cost per min"}, type: "number", unit: "currency", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "Estimated cost per customer per minute of waiting.", helper_i18n: {"en":"Estimated cost per customer per minute of waiting."}, expertMeaning: "C_w for total waiting cost = C_w \u00d7 L \u00d7 working_hours", expertMeaning_i18n: {"en":"C_w for total waiting cost = C_w \u00d7 L \u00d7 working_hours"} },
    { id: "calisanSaatUcreti", label: "Staff hourly cost", label_i18n: {"en":"Staff hourly cost"}, type: "number", unit: "currency", required: false, smartDefault: 20, validation: { min: 0 }, helper: "Hourly wage cost per staff member.", helper_i18n: {"en":"Hourly wage cost per staff member."}, expertMeaning: "C_s for staff cost = C_s \u00d7 staff \u00d7 working_hours", expertMeaning_i18n: {"en":"C_s for staff cost = C_s \u00d7 staff \u00d7 working_hours"} },
    { id: "mevcutPersonelSayisi", label: "Current staff count", label_i18n: {"en":"Current staff count"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1 }, helper: "Number of staff currently serving customers.", helper_i18n: {"en":"Number of staff currently serving customers."}, expertMeaning: "s for total staff cost", expertMeaning_i18n: {"en":"s for total staff cost"} },
  ],
  outputs: [
    { id: "varisOrani_lambda", label: "Arrival rate \u03bb", label_i18n: {"en":"Arrival rate \u03bb"}, unit: "per hour", format: "number" },
    { id: "servisOrani_mu", label: "Service rate \u03bc", label_i18n: {"en":"Service rate \u03bc"}, unit: "per hour", format: "number" },
    { id: "kullanimOrani_rho", label: "Utilization \u03c1", label_i18n: {"en":"Utilization \u03c1"}, unit: "%", format: "percentage" },
    { id: "musteriSayisi_sistem_L", label: "Avg customers in system L", label_i18n: {"en":"Avg customers in system L"}, unit: "", format: "number" },
    { id: "musteriSayisi_kuyruk_Lq", label: "Avg customers in queue Lq", label_i18n: {"en":"Avg customers in queue Lq"}, unit: "", format: "number" },
    { id: "beklemeSuresi_sistem_W", label: "Avg time in system W", label_i18n: {"en":"Avg time in system W"}, unit: "hours", format: "number" },
    { id: "beklemeSuresi_kuyruk_Wq", label: "Avg time in queue Wq", label_i18n: {"en":"Avg time in queue Wq"}, unit: "hours", format: "number" },
    { id: "beklemeMaliyeti", label: "Total waiting cost", label_i18n: {"en":"Total waiting cost"}, unit: "currency", format: "currency" },
    { id: "personelMaliyeti", label: "Staff cost", label_i18n: {"en":"Staff cost"}, unit: "currency", format: "currency" },
    { id: "toplamMaliyet", label: "Total cost", label_i18n: {"en":"Total cost"}, unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.queuing_0", inputMap: { dailyArrivals: "musteriSayisi_gunluk", workingHours: "calismaSaati_gunluk", serviceTimeMin: "ortalamaServisSuresi_dk", waitingCostPerMin: "kuyrukMaliyeti_beklemeDk", staffHourlyCost: "calisanSaatUcreti", staffCount: "mevcutPersonelSayisi" }, outputId: "varisOrani_lambda" }],
  reportTemplate: { title: "Queuing Theory (M/M/1) Analysis Report", title_i18n: {"en":"Queuing Theory (M/M/1) Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["M/M/1 assumptions: Poisson arrivals, exponential service times, single server, infinite queue capacity.", "\u03bb = arrivals / working hours; \u03bc = 60 / service minutes; \u03c1 = \u03bb/\u03bc (must be < 1 for stability).", "L = \u03c1/(1-\u03c1); Lq = \u03c1\u00b2/(1-\u03c1); W = L/\u03bb; Wq = Lq/\u03bb.", "Waiting cost = waiting cost per min \u00d7 L \u00d7 working hours \u00d7 60.", "Utilization \u03c1 \u2265 0.9 indicates high congestion risk."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * FMEA RPN (Risk Priority Number)
 * ════════════════════════════════════════════════════════════════════════════ */


const FMEA_RPN_SCHEMA: PremiumCalculatorSchema = {
  id: "fmea-rpn-calculator",
  legacyPaidSlug: "fmea-rpn-calculator",
  name: "FMEA RPN Calculator", name_i18n: {"en":"FMEA RPN Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "FMEA requires systematic RPN calculation (S\u00d7O\u00d7D), risk prioritization and cost-benefit of corrective actions. Spreadsheet-based FMEA lacks automatic risk level classification and action priority logic.", painStatement_i18n: {"en":"FMEA requires systematic RPN calculation (S\u00d7O\u00d7D), risk prioritization and cost-benefit of corrective actions. Spreadsheet-based FMEA lacks automatic risk level classification and action priority logic."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code for output formatting.", expertMeaning_i18n: {"en":"ISO code for output formatting."} },
    { id: "prosesAdimiSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "Total number of process steps/failure modes to evaluate.", helper_i18n: {"en":"Total number of process steps/failure modes to evaluate."}, expertMeaning: "n for average RPN calculation", expertMeaning_i18n: {"en":"n for average RPN calculation"} },
    { id: "ortalamaSiddet_S", label: "Average severity S (1-10)", label_i18n: {"en":"Average severity S (1-10)"}, type: "number", unit: "", required: true, smartDefault: 6, validation: { min: 1, max: 10 }, helper: "Average severity rating across all failure modes.", helper_i18n: {"en":"Average severity rating across all failure modes."}, expertMeaning: "S in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"S in RPN = S \u00d7 O \u00d7 D"} },
    { id: "ortalamaOlusma_O", label: "Average occurrence O (1-10)", label_i18n: {"en":"Average occurrence O (1-10)"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "Average occurrence rating across all failure modes.", helper_i18n: {"en":"Average occurrence rating across all failure modes."}, expertMeaning: "O in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"O in RPN = S \u00d7 O \u00d7 D"} },
    { id: "ortalamaSaptama_D", label: "Average detection D (1-10)", label_i18n: {"en":"Average detection D (1-10)"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "Average detection rating (10 = hard to detect).", helper_i18n: {"en":"Average detection rating (10 = hard to detect)."}, expertMeaning: "D in RPN = S \u00d7 O \u00d7 D", expertMeaning_i18n: {"en":"D in RPN = S \u00d7 O \u00d7 D"} },
    { id: "maliyet_failure", label: "Average cost per failure", label_i18n: {"en":"Average cost per failure"}, type: "number", unit: "currency", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "Estimated cost incurred per failure occurrence.", helper_i18n: {"en":"Estimated cost incurred per failure occurrence."}, expertMeaning: "For cost-benefit analysis of corrective actions", expertMeaning_i18n: {"en":"For cost-benefit analysis of corrective actions"} },
    { id: "maliyet_onlem", label: "Average cost per preventive action", label_i18n: {"en":"Average cost per preventive action"}, type: "number", unit: "currency", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Estimated cost to implement a corrective/preventive action.", helper_i18n: {"en":"Estimated cost to implement a corrective/preventive action."}, expertMeaning: "For cost-benefit ratio calculation", expertMeaning_i18n: {"en":"For cost-benefit ratio calculation"} },
    { id: "kabulEdilebilirRPN", label: "Acceptable RPN threshold", label_i18n: {"en":"Acceptable RPN threshold"}, type: "number", unit: "", required: false, smartDefault: 100, validation: { min: 0, max: 1000 }, helper: "RPN below this value is considered acceptable (industry default: 100).", helper_i18n: {"en":"RPN below this value is considered acceptable (industry default: 100)."}, expertMeaning: "Action threshold for prioritization", expertMeaning_i18n: {"en":"Action threshold for prioritization"} },
  ],
  outputs: [
    { id: "RPN_ortalama", label: "Average RPN (S\u00d7O\u00d7D)", label_i18n: {"en":"Average RPN (S\u00d7O\u00d7D)"}, unit: "", format: "number" },
    { id: "RPN_max", label: "Maximum possible RPN", label_i18n: {"en":"Maximum possible RPN"}, unit: "", format: "number" },
    { id: "riskDuzeyi", label: "Risk level classification", label_i18n: {"en":"Risk level classification"}, unit: "", format: "number" },
    { id: "oncelikSirasi", label: "Action priority order", label_i18n: {"en":"Action priority order"}, unit: "", format: "number" },
    { id: "failureMaliyet_toplam", label: "Total failure cost exposure", label_i18n: {"en":"Total failure cost exposure"}, unit: "currency", format: "currency" },
    { id: "onlemMaliyet_toplam", label: "Total preventive action cost", label_i18n: {"en":"Total preventive action cost"}, unit: "currency", format: "currency" },
    { id: "faydaMaliyetOrani", label: "Benefit-cost ratio", label_i18n: {"en":"Benefit-cost ratio"}, unit: "", format: "number" },
    { id: "cozumOncelikleri", label: "Resolution recommendations", label_i18n: {"en":"Resolution recommendations"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "RPN_ortalama", warning: 100, critical: 200, direction: "higher_is_bad", warningMessage: "RPN above 100 \u2014 moderate risk, consider corrective action.", warningMessage_i18n: {"en":"RPN above 100 \u2014 moderate risk, consider corrective action."}, criticalMessage: "RPN above 200 \u2014 critical risk, immediate action required.", criticalMessage_i18n: {"en":"RPN above 200 \u2014 critical risk, immediate action required."} },
  ],
  formulaPipeline: [
    { formulaId: "industrial.fmea_risk", inputMap: { severityS: "ortalamaSiddet_S", occurrenceO: "ortalamaOlusma_O", detectionD: "ortalamaSaptama_D" }, outputId: "RPN_ortalama" },
    { formulaId: "industrial.fmea_max", inputMap: {}, outputId: "RPN_max" },
    { formulaId: "industrial.fmea_recommendation", inputMap: { severityS: "ortalamaSiddet_S", occurrenceO: "ortalamaOlusma_O", detectionD: "ortalamaSaptama_D" }, outputId: "riskDuzeyi" },
    { formulaId: "industrial.fmea_priority", inputMap: { severityS: "ortalamaSiddet_S", occurrenceO: "ortalamaOlusma_O", detectionD: "ortalamaSaptama_D" }, outputId: "oncelikSirasi" },
    { formulaId: "industrial.fmea_failure_cost", inputMap: { maliyet_failure: "maliyet_failure", prosesAdimiSayisi: "prosesAdimiSayisi", occurrenceO: "ortalamaOlusma_O" }, outputId: "failureMaliyet_toplam" },
    { formulaId: "industrial.fmea_prevention_cost", inputMap: { maliyet_onlem: "maliyet_onlem", prosesAdimiSayisi: "prosesAdimiSayisi" }, outputId: "onlemMaliyet_toplam" },
    { formulaId: "industrial.fmea_2", inputMap: { maliyet_failure: "maliyet_failure", maliyet_onlem: "maliyet_onlem" }, outputId: "faydaMaliyetOrani" },
    { formulaId: "industrial.fmea_recommendation", inputMap: { severityS: "ortalamaSiddet_S", occurrenceO: "ortalamaOlusma_O", detectionD: "ortalamaSaptama_D" }, outputId: "cozumOncelikleri" },
  ],
  reportTemplate: { title: "FMEA RPN Analysis Report", title_i18n: {"en":"FMEA RPN Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["RPN = Severity \u00d7 Occurrence \u00d7 Detection (S\u00d7O\u00d7D).", "Risk levels: RPN\u2265200 Critical, 100\u2264RPN<200 Major, 50\u2264RPN<100 Moderate, RPN<50 Minor.", "AIAG & VDA FMEA Handbook reference standards."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * DOE Factorial Design Sample Size
 * ════════════════════════════════════════════════════════════════════════════ */

const DOE_FACTORIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "doe-factorial-design-calculator",
  legacyPaidSlug: "doe-factorial-design-calculator",
  name: "DOE Factorial Design Calculator", name_i18n: {"en":"DOE Factorial Design Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Design of Experiments requires selecting the correct factorial resolution, determining sample size (2^k \u00d7 r) and checking confound patterns and statistical power. Manual calculation often misses aliasing structures and proper replication.", painStatement_i18n: {"en":"Design of Experiments requires selecting the correct factorial resolution, determining sample size (2^k \u00d7 r) and checking confound patterns and statistical power. Manual calculation often misses aliasing structures and proper replication."},
  inputs: [
    { id: "faktorSayisi_k", label: "Number of factors k", label_i18n: {"en":"Number of factors k"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 2, max: 10 }, helper: "Number of independent variables in the experiment.", helper_i18n: {"en":"Number of independent variables in the experiment."}, expertMeaning: "k for 2^k factorial design", expertMeaning_i18n: {"en":"k for 2^k factorial design"} },
    { id: "faktorSeviyesi", label: "Factor levels", label_i18n: {"en":"Factor levels"}, type: "select", unit: "", required: true, smartDefault: "iki", options: [{ value: "iki", label: "2-level (2^k)" }, { value: "uc", label: "3-level (3^k)" }], helper: "Number of levels per factor.", helper_i18n: {"en":"Number of levels per factor."}, expertMeaning: "Determines design matrix size: 2^k or 3^k", expertMeaning_i18n: {"en":"Determines design matrix size: 2^k or 3^k"} },
    { id: "merkezNoktaSayisi", label: "Center points", label_i18n: {"en":"Center points"}, type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 0, max: 20 }, helper: "Replicated center points for curvature and pure error estimation.", helper_i18n: {"en":"Replicated center points for curvature and pure error estimation."}, expertMeaning: "n_c for curvature detection", expertMeaning_i18n: {"en":"n_c for curvature detection"} },
    { id: "blokSayisi", label: "Number of blocks", label_i18n: {"en":"Number of blocks"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 20 }, helper: "Blocking factor for nuisance variables (1 = no blocking).", helper_i18n: {"en":"Blocking factor for nuisance variables (1 = no blocking)."}, expertMeaning: "b for blocked design total runs", expertMeaning_i18n: {"en":"b for blocked design total runs"} },
    { id: "etkiBuyuklugu_min", label: "Minimum detectable effect size", label_i18n: {"en":"Minimum detectable effect size"}, type: "number", unit: "\u03c3", required: false, smartDefault: 2, validation: { min: 0.1 }, helper: "Smallest effect size (in standard deviations) you want to detect.", helper_i18n: {"en":"Smallest effect size (in standard deviations) you want to detect."}, expertMeaning: "\u0394/\u03c3 for power analysis", expertMeaning_i18n: {"en":"\u0394/\u03c3 for power analysis"} },
    { id: "varyans_tahmini", label: "Estimated variance \u03c3\u00b2", label_i18n: {"en":"Estimated variance \u03c3\u00b2"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 0.01 }, helper: "Prior estimate of error variance from pilot data.", helper_i18n: {"en":"Prior estimate of error variance from pilot data."}, expertMeaning: "\u03c3\u00b2 for power/sample size", expertMeaning_i18n: {"en":"\u03c3\u00b2 for power/sample size"} },
    { id: "alfa", label: "Significance level \u03b1 (%)", label_i18n: {"en":"Significance level \u03b1 (%)"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "Type I error probability.", helper_i18n: {"en":"Type I error probability."}, expertMeaning: "\u03b1 for critical F-value", expertMeaning_i18n: {"en":"\u03b1 for critical F-value"} },
    { id: "beta", label: "Type II error \u03b2 (%)", label_i18n: {"en":"Type II error \u03b2 (%)"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 1, max: 50 }, helper: "Type II error probability (power = 1-\u03b2).", helper_i18n: {"en":"Type II error probability (power = 1-\u03b2)."}, expertMeaning: "\u03b2 for power = 1-\u03b2", expertMeaning_i18n: {"en":"\u03b2 for power = 1-\u03b2"} },
    { id: "replikasyonSayisi", label: "Number of replications r", label_i18n: {"en":"Number of replications r"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 20 }, helper: "Complete replications of the full factorial design.", helper_i18n: {"en":"Complete replications of the full factorial design."}, expertMeaning: "r in Total = 2^k \u00d7 r + center + blocks", expertMeaning_i18n: {"en":"r in Total = 2^k \u00d7 r + center + blocks"} },
  ],
  outputs: [
    { id: "toplamDeneySayisi", label: "Total experiment runs", label_i18n: {"en":"Total experiment runs"}, unit: "", format: "number" },
    { id: "cozunurluk", label: "Design resolution", label_i18n: {"en":"Design resolution"}, unit: "", format: "number" },
    { id: "confoundPattern", label: "Confounding/aliasing pattern", label_i18n: {"en":"Confounding/aliasing pattern"}, unit: "", format: "number" },
    { id: "power", label: "Statistical power", label_i18n: {"en":"Statistical power"}, unit: "%", format: "percentage" },
    { id: "guc_mevcut", label: "Power adequate?", label_i18n: {"en":"Power adequate?"}, unit: "", format: "number" },
    { id: "noktaTuru", label: "Design point type", label_i18n: {"en":"Design point type"}, unit: "", format: "number" },
    { id: "oneri", label: "Recommendation", label_i18n: {"en":"Recommendation"}, unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.doe_factorial", inputMap: { factorCount_k: "faktorSayisi_k", factorLevel: "faktorSeviyesi", centerPoints: "merkezNoktaSayisi", blockCount: "blokSayisi", effectSize: "etkiBuyuklugu_min" }, outputId: "toplamDeneySayisi" }],
  reportTemplate: { title: "DOE Factorial Design Report", title_i18n: {"en":"DOE Factorial Design Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Full factorial design: Total runs = 2^k \u00d7 r + center points + blocks.", "Resolution III confounds main effects with 2-factor interactions.", "Power \u2265 80% (\u03b2 \u2264 20%) is considered adequate per industry standard."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Reliability Block Diagram (RBD / MTBF)
 * ════════════════════════════════════════════════════════════════════════════ */

const RELIABILITY_BLOCK_SCHEMA: PremiumCalculatorSchema = {
  id: "reliability-block-calculator",
  legacyPaidSlug: "reliability-block-calculator",
  name: "Reliability Block (RBD/MTBF) Calculator", name_i18n: {"en":"Reliability Block (RBD/MTBF) Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "System reliability analysis requires combining series/parallel MTBF, calculating standby redundancy and verifying availability (MTBF/(MTBF+MTTR)). Manual combination of failure rates often neglects interaction effects.", painStatement_i18n: {"en":"System reliability analysis requires combining series/parallel MTBF, calculating standby redundancy and verifying availability (MTBF/(MTBF+MTTR)). Manual combination of failure rates often neglects interaction effects."},
  inputs: [
    { id: "sistemKonfigurasyonu", label: "System configuration", label_i18n: {"en":"System configuration"}, type: "select", unit: "", required: true, smartDefault: "seri", options: [
      { value: "seri", label: "Series" },
      { value: "paralel", label: "Parallel" },
      { value: "seri_paralel", label: "Series-parallel (mixed)" },
      { value: "yedek", label: "Standby redundant" },
    ], helper: "Configuration type for combining component reliabilities.", helper_i18n: {"en":"Configuration type for combining component reliabilities."}, expertMeaning: "Determines system reliability formula", expertMeaning_i18n: {"en":"Determines system reliability formula"} },
    { id: "bilesenSayisi", label: "Number of components n", label_i18n: {"en":"Number of components n"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 2, max: 50 }, helper: "Total number of components/subsystems.", helper_i18n: {"en":"Total number of components/subsystems."}, expertMeaning: "n for system reliability aggregation", expertMeaning_i18n: {"en":"n for system reliability aggregation"} },
    { id: "bilesinMTBF_ortalama", label: "Average component MTBF", label_i18n: {"en":"Average component MTBF"}, type: "number", unit: "hours", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "Mean Time Between Failures for each component.", helper_i18n: {"en":"Mean Time Between Failures for each component."}, expertMeaning: "MTBF\u1e25 = 1/\u03bb\u1e25 for failure rate \u03bb\u1e25", expertMeaning_i18n: {"en":"MTBF\u1e25 = 1/\u03bb\u1e25 for failure rate \u03bb\u1e25"} },
    { id: "bilesinMTTR_ortalama", label: "Average component MTTR", label_i18n: {"en":"Average component MTTR"}, type: "number", unit: "hours", required: false, smartDefault: 8, validation: { min: 0.1 }, helper: "Mean Time To Repair for each component.", helper_i18n: {"en":"Mean Time To Repair for each component."}, expertMeaning: "MTTR for availability A = MTBF/(MTBF+MTTR)", expertMeaning_i18n: {"en":"MTTR for availability A = MTBF/(MTBF+MTTR)"} },
    { id: "yedekSayisi", label: "Number of standby units", label_i18n: {"en":"Number of standby units"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 0, max: 10 }, helper: "Standby redundant units (0 = active parallel without standby).", helper_i18n: {"en":"Standby redundant units (0 = active parallel without standby)."}, expertMeaning: "m for standby reliability formula", expertMeaning_i18n: {"en":"m for standby reliability formula"} },
    { id: "calismaSuresi_t", label: "Operating time t", label_i18n: {"en":"Operating time t"}, type: "number", unit: "hours", required: false, smartDefault: 8760, validation: { min: 1 }, helper: "Mission time for reliability R(t) = exp(-\u03bbt).", helper_i18n: {"en":"Mission time for reliability R(t) = exp(-\u03bbt)."}, expertMeaning: "t in R(t) = e^(-\u03bbt)", expertMeaning_i18n: {"en":"t in R(t) = e^(-\u03bbt)"} },
    { id: "yedekGecisGuvenirligi", label: "Standby switch reliability", label_i18n: {"en":"Standby switch reliability"}, type: "number", unit: "", required: false, smartDefault: 0.99, validation: { min: 0.5, max: 1 }, helper: "Probability that standby switches successfully (0.99 typical).", helper_i18n: {"en":"Probability that standby switches successfully (0.99 typical)."}, expertMeaning: "R_sw for standby reliability with imperfect switching", expertMeaning_i18n: {"en":"R_sw for standby reliability with imperfect switching"} },
  ],
  outputs: [
    { id: "sistemMTBF", label: "System MTBF", label_i18n: {"en":"System MTBF"}, unit: "hours", format: "number" },
    { id: "sistemMTTR", label: "System MTTR", label_i18n: {"en":"System MTTR"}, unit: "hours", format: "number" },
    { id: "kullanilabilirlik_A", label: "Availability A", label_i18n: {"en":"Availability A"}, unit: "%", format: "percentage" },
    { id: "R_t_seri", label: "Series reliability R(t)", label_i18n: {"en":"Series reliability R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_paralel", label: "Parallel reliability R(t)", label_i18n: {"en":"Parallel reliability R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_seriparalel", label: "Series-parallel reliability R(t)", label_i18n: {"en":"Series-parallel reliability R(t)"}, unit: "", format: "percentage" },
    { id: "R_t_yedek", label: "Standby reliability R(t)", label_i18n: {"en":"Standby reliability R(t)"}, unit: "", format: "percentage" },
    { id: "hataOrani_sistem", label: "System failure rate \u03bb", label_i18n: {"en":"System failure rate \u03bb"}, unit: "/hour", format: "number" },
  ],
  thresholds: [
    { fieldId: "kullanilabilirlik_A", warning: 99, critical: 95, direction: "lower_is_bad", warningMessage: "Availability below 99% \u2014 target improvement needed.", warningMessage_i18n: {"en":"Availability below 99% \u2014 target improvement needed."}, criticalMessage: "Availability below 95% \u2014 critical gap, redesign recommended.", criticalMessage_i18n: {"en":"Availability below 95% \u2014 critical gap, redesign recommended."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.reliability_block", inputMap: { config: "sistemKonfigurasyonu", componentCount: "bilesenSayisi", avgMTBF: "bilesinMTBF_ortalama", avgMTTR: "bilesinMTTR_ortalama", standbyCount: "yedekSayisi", missionHours: "calismaSuresi_t" }, outputId: "sistemMTBF" }],
  reportTemplate: { title: "Reliability Block Analysis Report", title_i18n: {"en":"Reliability Block Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Series: \u03bb = \u03a3\u03bb\u1e25, MTBF = 1/\u03bb, R(t) = exp(-\u03bbt). Parallel: R(t) = 1-\u03a0(1-R\u1e25(t)).", "Standby: assumes imperfect switching with given switch reliability.", "Exponential failure distribution (constant failure rate) assumed."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * NIOSH Lifting (Revised)
 * ════════════════════════════════════════════════════════════════════════════ */

const NIOSH_LIFTING_SCHEMA: PremiumCalculatorSchema = {
  id: "niosh-lifting-calculator",
  legacyPaidSlug: "niosh-lifting-calculator",
  name: "NIOSH Lifting Calculator", name_i18n: {"en":"NIOSH Lifting Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "The NIOSH Revised Lifting Equation (1991) requires computing six multipliers (HM, VM, DM, FM, AM, CM) to derive the Recommended Weight Limit (RWL) and Lifting Index (LI). Manual calculation is tedious and error-prone.", painStatement_i18n: {"en":"The NIOSH Revised Lifting Equation (1991) requires computing six multipliers (HM, VM, DM, FM, AM, CM) to derive the Recommended Weight Limit (RWL) and Lifting Index (LI). Manual calculation is tedious and error-prone."},
  inputs: [
    { id: "yukAgirligi_L", label: "Load weight L", label_i18n: {"en":"Load weight L"}, type: "number", unit: "kg", required: true, smartDefault: 15, validation: { min: 0.1 }, helper: "Weight of the object being lifted.", helper_i18n: {"en":"Weight of the object being lifted."}, expertMeaning: "L in LI = L / RWL", expertMeaning_i18n: {"en":"L in LI = L / RWL"} },
    { id: "yatayMesafe_H", label: "Horizontal distance H", label_i18n: {"en":"Horizontal distance H"}, type: "number", unit: "cm", required: true, smartDefault: 40, validation: { min: 0 }, helper: "Horizontal distance from hands to spine midpoint.", helper_i18n: {"en":"Horizontal distance from hands to spine midpoint."}, expertMeaning: "H for HM = 25/H (if H > 25 cm), else 1.0", expertMeaning_i18n: {"en":"H for HM = 25/H (if H > 25 cm), else 1.0"} },
    { id: "dikeyBaslangic_V", label: "Vertical start height V", label_i18n: {"en":"Vertical start height V"}, type: "number", unit: "cm", required: true, smartDefault: 75, validation: { min: 0 }, helper: "Vertical height of hands at lift start from floor.", helper_i18n: {"en":"Vertical height of hands at lift start from floor."}, expertMeaning: "V for VM = 1 - 0.003\u00b7|V-75|", expertMeaning_i18n: {"en":"V for VM = 1 - 0.003\u00b7|V-75|"} },
    { id: "dikeyBitis_D", label: "Vertical end height", label_i18n: {"en":"Vertical end height"}, type: "number", unit: "cm", required: true, smartDefault: 0, validation: { min: 0 }, helper: "Vertical height at end of lift (0 = floor).", helper_i18n: {"en":"Vertical height at end of lift (0 = floor)."}, expertMeaning: "D_v for DM = 0.82 + 4.5/D", expertMeaning_i18n: {"en":"D_v for DM = 0.82 + 4.5/D"} },
    { id: "tasimaMesafesi", label: "Travel distance", label_i18n: {"en":"Travel distance"}, type: "number", unit: "cm", required: false, smartDefault: 25, validation: { min: 0 }, helper: "Vertical travel distance of the lift.", helper_i18n: {"en":"Vertical travel distance of the lift."}, expertMeaning: "D_vert for DM calculation", expertMeaning_i18n: {"en":"D_vert for DM calculation"} },
    { id: "frekans_F", label: "Lifting frequency F", label_i18n: {"en":"Lifting frequency F"}, type: "number", unit: "lifts/min", required: true, smartDefault: 4, validation: { min: 0.1 }, helper: "Average number of lifts per minute.", helper_i18n: {"en":"Average number of lifts per minute."}, expertMeaning: "F for FM multiplier", expertMeaning_i18n: {"en":"F for FM multiplier"} },
    { id: "sureDakika", label: "Duration", label_i18n: {"en":"Duration"}, type: "number", unit: "min", required: false, smartDefault: 60, validation: { min: 1 }, helper: "Total duration of lifting task in minutes.", helper_i18n: {"en":"Total duration of lifting task in minutes."}, expertMeaning: "Duration category (\u226460, 60-480, >480 min)", expertMeaning_i18n: {"en":"Duration category (\u226460, 60-480, >480 min)"} },
    { id: "kavramaKalitesi", label: "Grip/coupling quality", label_i18n: {"en":"Grip/coupling quality"}, type: "select", unit: "", required: true, smartDefault: "orta", options: [
      { value: "iyi", label: "Good (handles cutouts)" },
      { value: "orta", label: "Fair (fingers 90\u00b0)" },
      { value: "kotu", label: "Poor (fingers < 90\u00b0)" },
    ], helper: "Coupling quality between hands and the load.", helper_i18n: {"en":"Coupling quality between hands and the load."}, expertMeaning: "CM = 1.00 (good), 0.95 (fair), 0.90 (poor)", expertMeaning_i18n: {"en":"CM = 1.00 (good), 0.95 (fair), 0.90 (poor)"} },
    { id: "bedenBolgesi", label: "Body region", label_i18n: {"en":"Body region"}, type: "select", unit: "", required: true, smartDefault: "bel", options: [
      { value: "bel", label: "Waist level" },
      { value: "omuz", label: "Shoulder level" },
      { value: "diz_alti", label: "Below knee" },
    ], helper: "Region for asymmetric multiplier (AM) adjustment.", helper_i18n: {"en":"Region for asymmetric multiplier (AM) adjustment."}, expertMeaning: "Determines twisting angle assumption", expertMeaning_i18n: {"en":"Determines twisting angle assumption"} },
  ],
  outputs: [
    { id: "recommendedWeightLimit_RWL", label: "Recommended Weight Limit (RWL)", label_i18n: {"en":"Recommended Weight Limit (RWL)"}, unit: "kg", format: "number" },
    { id: "liftingIndex_LI", label: "Lifting Index (LI = L/RWL)", label_i18n: {"en":"Lifting Index (LI = L/RWL)"}, unit: "", format: "number" },
    { id: "HM", label: "Horizontal multiplier HM", label_i18n: {"en":"Horizontal multiplier HM"}, unit: "", format: "number" },
    { id: "VM", label: "Vertical multiplier VM", label_i18n: {"en":"Vertical multiplier VM"}, unit: "", format: "number" },
    { id: "DM", label: "Distance multiplier DM", label_i18n: {"en":"Distance multiplier DM"}, unit: "", format: "number" },
    { id: "FM", label: "Frequency multiplier FM", label_i18n: {"en":"Frequency multiplier FM"}, unit: "", format: "number" },
    { id: "AM", label: "Asymmetric multiplier AM", label_i18n: {"en":"Asymmetric multiplier AM"}, unit: "", format: "number" },
    { id: "CM", label: "Coupling multiplier CM", label_i18n: {"en":"Coupling multiplier CM"}, unit: "", format: "number" },
    { id: "riskDurumu", label: "Risk status", label_i18n: {"en":"Risk status"}, unit: "", format: "number" },
    { id: "riskSeviyesi", label: "Risk level", label_i18n: {"en":"Risk level"}, unit: "", format: "number" },
    { id: "aciklama", label: "Explanation", label_i18n: {"en":"Explanation"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "liftingIndex_LI", warning: 1, critical: 3, direction: "higher_is_bad", warningMessage: "LI > 1.0 \u2014 task may pose risk for some workers.", warningMessage_i18n: {"en":"LI > 1.0 \u2014 task may pose risk for some workers."}, criticalMessage: "LI > 3.0 \u2014 significant risk for most workers, redesign recommended.", criticalMessage_i18n: {"en":"LI > 3.0 \u2014 significant risk for most workers, redesign recommended."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.niosh_lifting", inputMap: { loadWeight_kg: "yukAgirligi_L", horizontal_cm: "yatayMesafe_H", verticalStart_cm: "dikeyBaslangic_V", verticalEnd_cm: "dikeyBitis_D", frequency_liftsPerMin: "frekans_F", couplingQuality: "kavramaKalitesi", bodyRegion: "bedenBolgesi", durationMin: "sureDakika" }, outputId: "recommendedWeightLimit_RWL" }],
  reportTemplate: { title: "NIOSH Lifting Analysis Report", title_i18n: {"en":"NIOSH Lifting Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["RWL = LC \u00d7 HM \u00d7 VM \u00d7 DM \u00d7 FM \u00d7 AM \u00d7 CM (LC = 23 kg, NIOSH 1991).", "LI = Load Weight / RWL. LI > 1.0 = some risk; LI > 3.0 = high risk.", "Assumes two-handed symmetric lifting; single-hand or team lifting not modeled."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * REBA (Rapid Entire Body Assessment)
 * ════════════════════════════════════════════════════════════════════════════ */

const REBA_ASSESSMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "reba-rapid-body-assessment-calculator",
  legacyPaidSlug: "reba-rapid-body-assessment-calculator",
  name: "REBA Rapid Body Assessment Calculator", name_i18n: {"en":"REBA Rapid Body Assessment Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "REBA requires scoring Group A (trunk/neck/legs) and Group B (upper arm/lower arm/wrist) with load and coupling modifiers. Manual scoring tables are prone to lookup errors.", painStatement_i18n: {"en":"REBA requires scoring Group A (trunk/neck/legs) and Group B (upper arm/lower arm/wrist) with load and coupling modifiers. Manual scoring tables are prone to lookup errors."},
  inputs: [
    { id: "govdeSkoru", label: "Trunk score (1-5)", label_i18n: {"en":"Trunk score (1-5)"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "Trunk posture score from REBA Table A.", helper_i18n: {"en":"Trunk posture score from REBA Table A."}, expertMeaning: "Trunk score (Group A)", expertMeaning_i18n: {"en":"Trunk score (Group A)"} },
    { id: "boyunSkoru", label: "Neck score (1-3)", label_i18n: {"en":"Neck score (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Neck posture score from REBA Table A.", helper_i18n: {"en":"Neck posture score from REBA Table A."}, expertMeaning: "Neck score (Group A)", expertMeaning_i18n: {"en":"Neck score (Group A)"} },
    { id: "bacakSkoru", label: "Legs score (1-4)", label_i18n: {"en":"Legs score (1-4)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 4 }, helper: "Legs posture score from REBA Table A.", helper_i18n: {"en":"Legs posture score from REBA Table A."}, expertMeaning: "Legs score (Group A)", expertMeaning_i18n: {"en":"Legs score (Group A)"} },
    { id: "yuk_kg", label: "Load weight", label_i18n: {"en":"Load weight"}, type: "number", unit: "kg", required: false, smartDefault: 10, validation: { min: 0 }, helper: "Weight being handled (0 if no load).", helper_i18n: {"en":"Weight being handled (0 if no load)."}, expertMeaning: "Determines load/force score for Group A", expertMeaning_i18n: {"en":"Determines load/force score for Group A"} },
    { id: "yukTutmaTipi", label: "Load holding type", label_i18n: {"en":"Load holding type"}, type: "select", unit: "", required: false, smartDefault: "iki_el", options: [
      { value: "tek_el", label: "One hand" },
      { value: "iki_el", label: "Two hands" },
      { value: "itme_cekme", label: "Push/pull" },
    ], helper: "How the load is held/controlled.", helper_i18n: {"en":"How the load is held/controlled."}, expertMeaning: "Affects load score modifier", expertMeaning_i18n: {"en":"Affects load score modifier"} },
    { id: "kolUstSkoru", label: "Upper arm score (1-6)", label_i18n: {"en":"Upper arm score (1-6)"}, type: "number", unit: "", required: true, smartDefault: 3, validation: { min: 1, max: 6 }, helper: "Upper arm posture score from REBA Table B.", helper_i18n: {"en":"Upper arm posture score from REBA Table B."}, expertMeaning: "Upper arm score (Group B)", expertMeaning_i18n: {"en":"Upper arm score (Group B)"} },
    { id: "kolAltSkoru", label: "Lower arm score (1-3)", label_i18n: {"en":"Lower arm score (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Lower arm posture score from REBA Table B.", helper_i18n: {"en":"Lower arm posture score from REBA Table B."}, expertMeaning: "Lower arm score (Group B)", expertMeaning_i18n: {"en":"Lower arm score (Group B)"} },
    { id: "elBilegiSkoru", label: "Wrist score (1-3)", label_i18n: {"en":"Wrist score (1-3)"}, type: "number", unit: "", required: true, smartDefault: 2, validation: { min: 1, max: 3 }, helper: "Wrist posture score from REBA Table B.", helper_i18n: {"en":"Wrist posture score from REBA Table B."}, expertMeaning: "Wrist score (Group B)", expertMeaning_i18n: {"en":"Wrist score (Group B)"} },
    { id: "aktiviteTipi", label: "Activity type", label_i18n: {"en":"Activity type"}, type: "select", unit: "", required: false, smartDefault: "statik", options: [
      { value: "statik", label: "Static (held >1 min)" },
      { value: "tekrarlayan", label: "Repetitive (>4/min)" },
      { value: "anlik", label: "Sudden/rapid motion" },
      { value: "sabit", label: "Fixed posture/prolonged" },
    ], helper: "Activity type adds an additional score to final REBA.", helper_i18n: {"en":"Activity type adds an additional score to final REBA."}, expertMeaning: "Activity score (+1 to +3)", expertMeaning_i18n: {"en":"Activity score (+1 to +3)"} },
  ],
  outputs: [
    { id: "GrupA_Skoru", label: "Group A score (posture)", label_i18n: {"en":"Group A score (posture)"}, unit: "", format: "number" },
    { id: "GrupA_YukPuani", label: "Group A load score", label_i18n: {"en":"Group A load score"}, unit: "", format: "number" },
    { id: "GrupA_Toplam", label: "Group A total (A+load)", label_i18n: {"en":"Group A total (A+load)"}, unit: "", format: "number" },
    { id: "GrupB_Skoru", label: "Group B score (arm/wrist)", label_i18n: {"en":"Group B score (arm/wrist)"}, unit: "", format: "number" },
    { id: "GrupB_KavramaPuani", label: "Group B coupling score", label_i18n: {"en":"Group B coupling score"}, unit: "", format: "number" },
    { id: "GrupB_Toplam", label: "Group B total (B+coupling)", label_i18n: {"en":"Group B total (B+coupling)"}, unit: "", format: "number" },
    { id: "REBA_Skoru", label: "REBA final score", label_i18n: {"en":"REBA final score"}, unit: "", format: "number" },
    { id: "REBA_Seviyesi", label: "REBA action level", label_i18n: {"en":"REBA action level"}, unit: "", format: "number" },
    { id: "riskDurumu", label: "Risk status", label_i18n: {"en":"Risk status"}, unit: "", format: "number" },
    { id: "aksiyonSeviyesi", label: "Action level recommendation", label_i18n: {"en":"Action level recommendation"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "REBA_Skoru", warning: 4, critical: 8, direction: "higher_is_bad", warningMessage: "REBA score 4-7 \u2014 medium risk, further investigation needed.", warningMessage_i18n: {"en":"REBA score 4-7 \u2014 medium risk, further investigation needed."}, criticalMessage: "REBA score 8+ \u2014 high risk, immediate ergonomic intervention needed.", criticalMessage_i18n: {"en":"REBA score 8+ \u2014 high risk, immediate ergonomic intervention needed."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.reba_assessment", inputMap: { trunkScore: "govdeSkoru", neckScore: "boyunSkoru", legsScore: "bacakSkoru", loadKg: "yuk_kg", upperArmScore: "kolUstSkoru", lowerArmScore: "kolAltSkoru", wristScore: "elBilegiSkoru", activityType: "aktiviteTipi" }, outputId: "REBA_Skoru" }],
  reportTemplate: { title: "REBA Ergonomic Assessment Report", title_i18n: {"en":"REBA Ergonomic Assessment Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["REBA scoring per Hignett & McAtamney (2000).", "Group A: Trunk+Neck+Legs posture scores; Group B: Upper arm+Lower arm+Wrist.", "Action levels: 0=negligible, 1=low, 2=medium, 3=high, 4=very high risk."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * RCM (Reliability-Centered Maintenance) Decision
 * ════════════════════════════════════════════════════════════════════════════ */

const RCM_DECISION_SCHEMA: PremiumCalculatorSchema = {
  id: "rcm-decision-calculator",
  legacyPaidSlug: "rcm-decision-calculator",
  name: "RCM Decision Calculator", name_i18n: {"en":"RCM Decision Calculator"},
  sectorSlug: "general",
  category: "cost",
  painStatement: "Choosing between reactive, preventive, predictive (CBM) and proactive maintenance strategies requires cost comparison of each approach. Manual analysis often underestimates hidden costs of unplanned downtime.", painStatement_i18n: {"en":"Choosing between reactive, preventive, predictive (CBM) and proactive maintenance strategies requires cost comparison of each approach. Manual analysis often underestimates hidden costs of unplanned downtime."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code."} },
    { id: "varlikSaysi", label: "Number of assets", label_i18n: {"en":"Number of assets"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "Total number of assets under analysis.", helper_i18n: {"en":"Total number of assets under analysis."}, expertMeaning: "n for annual cost multiplication", expertMeaning_i18n: {"en":"n for annual cost multiplication"} },
    { id: "MTBF_gun", label: "Mean Time Between Failures (MTBF)", label_i18n: {"en":"Mean Time Between Failures (MTBF)"}, type: "number", unit: "days", required: true, smartDefault: 90, validation: { min: 1 }, helper: "Average time between asset failures.", helper_i18n: {"en":"Average time between asset failures."}, expertMeaning: "MTBF for unplanned frequency = 365/MTBF per year", expertMeaning_i18n: {"en":"MTBF for unplanned frequency = 365/MTBF per year"} },
    { id: "MTTR_saat", label: "Mean Time To Repair (MTTR)", label_i18n: {"en":"Mean Time To Repair (MTTR)"}, type: "number", unit: "hours", required: false, smartDefault: 8, validation: { min: 0.1 }, helper: "Average repair time per failure.", helper_i18n: {"en":"Average repair time per failure."}, expertMeaning: "MTTR for downtime cost estimation", expertMeaning_i18n: {"en":"MTTR for downtime cost estimation"} },
    { id: "onarimMaliyeti", label: "Reactive repair cost per event", label_i18n: {"en":"Reactive repair cost per event"}, type: "number", unit: "currency", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "Average cost of an unplanned repair event.", helper_i18n: {"en":"Average cost of an unplanned repair event."}, expertMeaning: "C_repair for reactive cost = freq \u00d7 C_repair", expertMeaning_i18n: {"en":"C_repair for reactive cost = freq \u00d7 C_repair"} },
    { id: "koruyucuBakimMaliyeti", label: "Preventive maintenance cost per event", label_i18n: {"en":"Preventive maintenance cost per event"}, type: "number", unit: "currency", required: true, smartDefault: 1500, validation: { min: 0 }, helper: "Cost of one scheduled preventive maintenance.", helper_i18n: {"en":"Cost of one scheduled preventive maintenance."}, expertMeaning: "C_pm for preventive cost = freq \u00d7 C_pm", expertMeaning_i18n: {"en":"C_pm for preventive cost = freq \u00d7 C_pm"} },
    { id: "durumsalBakimMaliyeti", label: "Condition-based (CBM) cost per event", label_i18n: {"en":"Condition-based (CBM) cost per event"}, type: "number", unit: "currency", required: false, smartDefault: 800, validation: { min: 0 }, helper: "Cost of one condition-based monitoring inspection.", helper_i18n: {"en":"Cost of one condition-based monitoring inspection."}, expertMeaning: "C_cbm for predictive cost = freq \u00d7 C_cbm", expertMeaning_i18n: {"en":"C_cbm for predictive cost = freq \u00d7 C_cbm"} },
    { id: "plansizDurusMaliyeti", label: "Cost per unplanned downtime hour", label_i18n: {"en":"Cost per unplanned downtime hour"}, type: "number", unit: "currency/hr", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "Lost production cost per hour of unplanned downtime.", helper_i18n: {"en":"Lost production cost per hour of unplanned downtime."}, expertMeaning: "C_dt for downtime cost = MTTR \u00d7 C_dt \u00d7 freq", expertMeaning_i18n: {"en":"C_dt for downtime cost = MTTR \u00d7 C_dt \u00d7 freq"} },
    { id: "koruyucuBakimSikligi", label: "Preventive maintenance interval", label_i18n: {"en":"Preventive maintenance interval"}, type: "number", unit: "days", required: false, smartDefault: 30, validation: { min: 1 }, helper: "Frequency of preventive maintenance in days.", helper_i18n: {"en":"Frequency of preventive maintenance in days."}, expertMeaning: "Freq_pm = 365/interval per year", expertMeaning_i18n: {"en":"Freq_pm = 365/interval per year"} },
    { id: "durumsalBakimSikligi", label: "CBM inspection interval", label_i18n: {"en":"CBM inspection interval"}, type: "number", unit: "days", required: false, smartDefault: 15, validation: { min: 1 }, helper: "Frequency of CBM inspections in days.", helper_i18n: {"en":"Frequency of CBM inspections in days."}, expertMeaning: "Freq_cbm = 365/interval per year", expertMeaning_i18n: {"en":"Freq_cbm = 365/interval per year"} },
    { id: "kritiklik", label: "Asset criticality", label_i18n: {"en":"Asset criticality"}, type: "select", unit: "", required: true, smartDefault: "onemli", options: [
      { value: "kritik", label: "Critical (redundant MTBF needed)" },
      { value: "onemli", label: "Important (CBM preferred)" },
      { value: "standart", label: "Standard (PM sufficient)" },
    ], helper: "Criticality level determines recommended strategy.", helper_i18n: {"en":"Criticality level determines recommended strategy."}, expertMeaning: "Affects decision logic for strategy selection", expertMeaning_i18n: {"en":"Affects decision logic for strategy selection"} },
  ],
  outputs: [
    { id: "plansizDurusSikligi", label: "Unplanned failure frequency (per year)", label_i18n: {"en":"Unplanned failure frequency (per year)"}, unit: "/year", format: "number" },
    { id: "plansizDurusMaliyeti_yil", label: "Annual reactive maintenance cost", label_i18n: {"en":"Annual reactive maintenance cost"}, unit: "currency", format: "currency" },
    { id: "koruyucuBakimMaliyeti_yil", label: "Annual preventive maintenance cost", label_i18n: {"en":"Annual preventive maintenance cost"}, unit: "currency", format: "currency" },
    { id: "durumsalBakimMaliyeti_yil", label: "Annual CBM/predictive cost", label_i18n: {"en":"Annual CBM/predictive cost"}, unit: "currency", format: "currency" },
    { id: "toplamBakimMaliyeti", label: "Total annual maintenance cost", label_i18n: {"en":"Total annual maintenance cost"}, unit: "currency", format: "currency" },
    { id: "TBM_tasarruf", label: "PM vs Reactive savings", label_i18n: {"en":"PM vs Reactive savings"}, unit: "currency", format: "currency" },
    { id: "CBM_tasarruf", label: "CBM vs Reactive savings", label_i18n: {"en":"CBM vs Reactive savings"}, unit: "currency", format: "currency" },
    { id: "oneri_strateji", label: "Recommended strategy", label_i18n: {"en":"Recommended strategy"}, unit: "", format: "number" },
    { id: "yatirimGetirisi", label: "ROI of proactive vs reactive", label_i18n: {"en":"ROI of proactive vs reactive"}, unit: "%", format: "percentage" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.rcm_decision", inputMap: { assetCount: "varlikSaysi", MTBF_days: "MTBF_gun", MTTR_hours: "MTTR_saat", repairCost: "onarimMaliyeti", pmCost: "koruyucuBakimMaliyeti", cbmCost: "durumsalBakimMaliyeti", downtimeCost: "plansizDurusMaliyeti" }, outputId: "toplamBakimMaliyeti" }],
  reportTemplate: { title: "RCM Decision Analysis Report", title_i18n: {"en":"RCM Decision Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Total Maintenance = Planned (PM+CBM) + Unplanned (reactive) costs.", "PM savings = Reactive cost - PM cost; CBM savings = Reactive - CBM.", "Criticality level influences strategy recommendation (CBM for critical, PM for standard)."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Pareto / RCA (Root Cause Analysis)
 * ════════════════════════════════════════════════════════════════════════════ */

const PARETO_RCA_SCHEMA: PremiumCalculatorSchema = {
  id: "pareto-root-cause-calculator",
  legacyPaidSlug: "pareto-root-cause-calculator",
  name: "Pareto / Root Cause Analysis Calculator", name_i18n: {"en":"Pareto / Root Cause Analysis Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Pareto analysis (80/20 rule) requires sorting cost categories, computing cumulative percentages and identifying the vital few. Manual sorting and cumulation is tedious when the 80% boundary shifts.", painStatement_i18n: {"en":"Pareto analysis (80/20 rule) requires sorting cost categories, computing cumulative percentages and identifying the vital few. Manual sorting and cumulation is tedious when the 80% boundary shifts."},
  inputs: [
    { id: "kategoriSayisi", label: "Number of categories", label_i18n: {"en":"Number of categories"}, type: "number", unit: "", required: true, smartDefault: 7, validation: { min: 2, max: 30 }, helper: "Total number of cost or defect categories.", helper_i18n: {"en":"Total number of cost or defect categories."}, expertMeaning: "n for Pareto sorting", expertMeaning_i18n: {"en":"n for Pareto sorting"} },
    { id: "maliyetler_toplam", label: "Total loss/cost sum", label_i18n: {"en":"Total loss/cost sum"}, type: "number", unit: "currency", required: true, smartDefault: 54000, validation: { min: 0 }, helper: "Total of all cost category values.", helper_i18n: {"en":"Total of all cost category values."}, expertMeaning: "\u03a3 cost for Pareto percentage = item/\u03a3", expertMeaning_i18n: {"en":"\u03a3 cost for Pareto percentage = item/\u03a3"} },
    { id: "kategori_maliyet_list", label: "Category cost list (comma-separated)", label_i18n: {"en":"Category cost list (comma-separated)"}, type: "number", unit: "", required: true, smartDefault: "20000,15000,8000,5000,3000,2000,1000", helper: "Enter costs separated by commas, ordered descending if known.", helper_i18n: {"en":"Enter costs separated by commas, ordered descending if known."}, expertMeaning: "Array of cost values for Pareto sort", expertMeaning_i18n: {"en":"Array of cost values for Pareto sort"} },
    { id: "kategori_isim_list", label: "Category names (comma-separated)", label_i18n: {"en":"Category names (comma-separated)"}, type: "number", unit: "", required: false, smartDefault: "Defects,Rework,Downtime,Material waste,Overprocessing,Inventory,Transport", helper: "Optional category names matching cost order.", helper_i18n: {"en":"Optional category names matching cost order."}, expertMeaning: "Labels for Pareto chart", expertMeaning_i18n: {"en":"Labels for Pareto chart"} },
    { id: "birikimliYuzde", label: "Cumulative % for vital few", label_i18n: {"en":"Cumulative % for vital few"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 100 }, helper: "Cumulative percentage threshold (default 80%).", helper_i18n: {"en":"Cumulative percentage threshold (default 80%)."}, expertMeaning: "Pareto 80/20 threshold", expertMeaning_i18n: {"en":"Pareto 80/20 threshold"} },
    { id: "oneMaliyet", label: "Estimated cost per item", label_i18n: {"en":"Estimated cost per item"}, type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Average cost per loss item (for recovery estimation).", helper_i18n: {"en":"Average cost per loss item (for recovery estimation)."}, expertMeaning: "For recoverable amount = count \u00d7 cost per unit", expertMeaning_i18n: {"en":"For recoverable amount = count \u00d7 cost per unit"} },
    { id: "yillikFrekans", label: "Annual frequency of loss events", label_i18n: {"en":"Annual frequency of loss events"}, type: "number", unit: "/year", required: false, smartDefault: 12, validation: { min: 1 }, helper: "Number of times the loss pattern occurs per year.", helper_i18n: {"en":"Number of times the loss pattern occurs per year."}, expertMeaning: "For annual extrapolation", expertMeaning_i18n: {"en":"For annual extrapolation"} },
  ],
  outputs: [
    { id: "itemSayisi", label: "Number of items", label_i18n: {"en":"Number of items"}, unit: "", format: "number" },
    { id: "kategoriDagilimi", label: "Category distribution", label_i18n: {"en":"Category distribution"}, unit: "", format: "number" },
    { id: "kumulatifYuzde_list", label: "Cumulative percentage list", label_i18n: {"en":"Cumulative percentage list"}, unit: "%", format: "number" },
    { id: "kumulatif_80", label: "Threshold cumulative at cutoff", label_i18n: {"en":"Threshold cumulative at cutoff"}, unit: "%", format: "number" },
    { id: "kritikKategoriler", label: "Vital few categories", label_i18n: {"en":"Vital few categories"}, unit: "", format: "number" },
    { id: "criticalCount", label: "Number of vital few items", label_i18n: {"en":"Number of vital few items"}, unit: "", format: "number" },
    { id: "totalLoss", label: "Total loss value", label_i18n: {"en":"Total loss value"}, unit: "currency", format: "currency" },
    { id: "pareto80Maliyet_included", label: "Cost captured in vital few", label_i18n: {"en":"Cost captured in vital few"}, unit: "currency", format: "currency" },
    { id: "kurtarilabilirMiktar_80", label: "Recoverable amount (80% focus)", label_i18n: {"en":"Recoverable amount (80% focus)"}, unit: "currency", format: "currency" },
    { id: "oneMaliyet_orani", label: "Unit cost ratio", label_i18n: {"en":"Unit cost ratio"}, unit: "", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.pareto_rca", inputMap: { categoryCount: "kategoriSayisi", totalSum: "maliyetler_toplam", costListText: "kategori_maliyet_list", thresholdPercent: "birikimliYuzde" }, outputId: "kumulatif_80" }],
  reportTemplate: { title: "Pareto / RCA Analysis Report", title_i18n: {"en":"Pareto / RCA Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Pareto 80/20 principle: \u224880% of effects come from \u224820% of causes.", "Items sorted descending; top items until cumulative \u2265 threshold = vital few.", "Recoverable amount assumes proportional improvement on vital few categories."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * VAP (Value-Added Process) Ratio Analyzer
 * ════════════════════════════════════════════════════════════════════════════ */

const VAP_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "value-added-process-analyzer",
  legacyPaidSlug: "value-added-process-analyzer",
  name: "Value-Added Process Ratio Analyzer", name_i18n: {"en":"Value-Added Process Ratio Analyzer"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Lean process analysis requires decomposing total cycle time into value-added (VA), necessary non-value-added (NVA) and waste (W). Spreadsheets lack the structured decomposition and cost allocation.", painStatement_i18n: {"en":"Lean process analysis requires decomposing total cycle time into value-added (VA), necessary non-value-added (NVA) and waste (W). Spreadsheets lack the structured decomposition and cost allocation."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code."} },
    { id: "toplamCevrimSuresi_TCT", label: "Total cycle time (TCT)", label_i18n: {"en":"Total cycle time (TCT)"}, type: "number", unit: "min", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "Total elapsed time from start to finish of the process.", helper_i18n: {"en":"Total elapsed time from start to finish of the process."}, expertMeaning: "TCT for VAR = VA/TCT \u00d7 100", expertMeaning_i18n: {"en":"TCT for VAR = VA/TCT \u00d7 100"} },
    { id: "katmaDegerliSure_VA", label: "Value-added time (VA)", label_i18n: {"en":"Value-added time (VA)"}, type: "number", unit: "min", required: true, smartDefault: 15, validation: { min: 0 }, helper: "Time spent on activities that add value from the customer perspective.", helper_i18n: {"en":"Time spent on activities that add value from the customer perspective."}, expertMeaning: "VA for VAR_VA = VA/TCT", expertMeaning_i18n: {"en":"VA for VAR_VA = VA/TCT"} },
    { id: "zorunluKatmaDegerliSure_NVA", label: "Necessary NVA time (NNVA)", label_i18n: {"en":"Necessary NVA time (NNVA)"}, type: "number", unit: "min", required: true, smartDefault: 35, validation: { min: 0 }, helper: "Time on required but non-value-adding activities (compliance, setup).", helper_i18n: {"en":"Time on required but non-value-adding activities (compliance, setup)."}, expertMeaning: "NNVA for VAR_NVA = NNVA/TCT", expertMeaning_i18n: {"en":"NNVA for VAR_NVA = NNVA/TCT"} },
    { id: "kayipSure_W", label: "Waste time (W)", label_i18n: {"en":"Waste time (W)"}, type: "number", unit: "min", required: true, smartDefault: 50, validation: { min: 0 }, helper: "Pure waste time (defects, waiting, overproduction, motion).", helper_i18n: {"en":"Pure waste time (defects, waiting, overproduction, motion)."}, expertMeaning: "W for VAR_W = W/TCT", expertMeaning_i18n: {"en":"W for VAR_W = W/TCT"} },
    { id: "surecAdimiSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps"}, type: "number", unit: "", required: false, smartDefault: 12, validation: { min: 1 }, helper: "Total steps in the process flow.", helper_i18n: {"en":"Total steps in the process flow."}, expertMeaning: "For VA step ratio calculation", expertMeaning_i18n: {"en":"For VA step ratio calculation"} },
    { id: "maliyet_C", label: "Total process cost", label_i18n: {"en":"Total process cost"}, type: "number", unit: "currency", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "Total cost of the process over the measured period.", helper_i18n: {"en":"Total cost of the process over the measured period."}, expertMeaning: "C for cost allocation = C \u00d7 VAR", expertMeaning_i18n: {"en":"C for cost allocation = C \u00d7 VAR"} },
    { id: "israftanKurtarilanYuzde", label: "Waste recovery percentage", label_i18n: {"en":"Waste recovery percentage"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "Realistically achievable waste reduction through lean initiatives.", helper_i18n: {"en":"Realistically achievable waste reduction through lean initiatives."}, expertMeaning: "For improvement potential estimate", expertMeaning_i18n: {"en":"For improvement potential estimate"} },
  ],
  outputs: [
    { id: "VAR_VA", label: "Value-added ratio (VAR_VA)", label_i18n: {"en":"Value-added ratio (VAR_VA)"}, unit: "%", format: "percentage" },
    { id: "VAR_NVA", label: "Necessary NVA ratio (VAR_NVA)", label_i18n: {"en":"Necessary NVA ratio (VAR_NVA)"}, unit: "%", format: "percentage" },
    { id: "VAR_waste", label: "Waste ratio (VAR_W)", label_i18n: {"en":"Waste ratio (VAR_W)"}, unit: "%", format: "percentage" },
    { id: "VA_Maliyet", label: "VA cost portion", label_i18n: {"en":"VA cost portion"}, unit: "currency", format: "currency" },
    { id: "NVA_Maliyet", label: "NNVA cost portion", label_i18n: {"en":"NNVA cost portion"}, unit: "currency", format: "currency" },
    { id: "kayipMaliyet", label: "Waste cost portion", label_i18n: {"en":"Waste cost portion"}, unit: "currency", format: "currency" },
    { id: "kurtarilabilirMiktar", label: "Recoverable waste cost", label_i18n: {"en":"Recoverable waste cost"}, unit: "currency", format: "currency" },
    { id: "idealVAR", label: "Ideal VA ratio (zero waste)", label_i18n: {"en":"Ideal VA ratio (zero waste)"}, unit: "%", format: "percentage" },
    { id: "iyilestirmePotansiyeli", label: "Improvement potential", label_i18n: {"en":"Improvement potential"}, unit: "currency", format: "currency" },
  ],
  thresholds: [
    { fieldId: "VAR_VA", warning: 30, critical: 10, direction: "lower_is_bad", warningMessage: "VA ratio below 30% \u2014 significant non-value-added content.", warningMessage_i18n: {"en":"VA ratio below 30% \u2014 significant non-value-added content."}, criticalMessage: "VA ratio below 10% \u2014 critically inefficient process, major redesign needed.", criticalMessage_i18n: {"en":"VA ratio below 10% \u2014 critically inefficient process, major redesign needed."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.vap_ratio", inputMap: { totalCycleTime_min: "toplamCevrimSuresi_TCT", vaTime_min: "katmaDegerliSure_VA", nnvaTime_min: "zorunluKatmaDegerliSure_NVA", wasteTime_min: "kayipSure_W", totalProcessCost: "maliyet_C", wasteRecoveryPercent: "israftanKurtarilanYuzde" }, outputId: "VAR_VA" }],
  reportTemplate: { title: "Value-Added Process Analysis Report", title_i18n: {"en":"Value-Added Process Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["VAR_VA = VA/TCT\u00d7100; VAR_NVA = NNVA/TCT\u00d7100; VAR_W = W/TCT\u00d7100.", "VA + NNVA + W = TCT. Ideal = VA/(VA+NNVA) after waste elimination.", "Lean benchmark: World-class processes have >60% VA ratio."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Kaizen Event / Cost Savings Tracker
 * ════════════════════════════════════════════════════════════════════════════ */

const KAIZEN_EVENT_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-event-tracker",
  legacyPaidSlug: "kaizen-event-tracker",
  name: "Kaizen Event & Cost Savings Tracker", name_i18n: {"en":"Kaizen Event & Cost Savings Tracker"},
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kaizen events generate measurable improvements but tracking total investment vs annual savings (ROI and payback) requires consolidating labor, material, consulting and operational gains. Manual tracking often misses hidden costs.", painStatement_i18n: {"en":"Kaizen events generate measurable improvements but tracking total investment vs annual savings (ROI and payback) requires consolidating labor, material, consulting and operational gains. Manual tracking often misses hidden costs."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code."} },
    { id: "surecAdi", label: "Process name", label_i18n: {"en":"Process name"}, type: "number", unit: "", required: false, smartDefault: "Assembly line", helper: "Name or identifier for the improved process.", helper_i18n: {"en":"Name or identifier for the improved process."}, expertMeaning: "Process label for report", expertMeaning_i18n: {"en":"Process label for report"} },
    { id: "calisanSayisi", label: "Number of team members", label_i18n: {"en":"Number of team members"}, type: "number", unit: "", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Employees participating in the Kaizen event.", helper_i18n: {"en":"Employees participating in the Kaizen event."}, expertMeaning: "n for labor cost calculation", expertMeaning_i18n: {"en":"n for labor cost calculation"} },
    { id: "eventSuresi", label: "Event duration", label_i18n: {"en":"Event duration"}, type: "number", unit: "days", required: true, smartDefault: 5, validation: { min: 0.5 }, helper: "Total duration of the Kaizen event in days.", helper_i18n: {"en":"Total duration of the Kaizen event in days."}, expertMeaning: "Duration for event labor cost", expertMeaning_i18n: {"en":"Duration for event labor cost"} },
    { id: "ekipUyesiSaatlikMaliyet", label: "Team member hourly cost", label_i18n: {"en":"Team member hourly cost"}, type: "number", unit: "currency/hr", required: true, smartDefault: 25, validation: { min: 0 }, helper: "Fully loaded hourly cost per team member.", helper_i18n: {"en":"Fully loaded hourly cost per team member."}, expertMeaning: "C_labor for labor cost = C_labor \u00d7 days \u00d7 8h", expertMeaning_i18n: {"en":"C_labor for labor cost = C_labor \u00d7 days \u00d7 8h"} },
    { id: "malzemeMaliyeti", label: "Material cost", label_i18n: {"en":"Material cost"}, type: "number", unit: "currency", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "Cost of materials used during the event.", helper_i18n: {"en":"Cost of materials used during the event."}, expertMeaning: "C_material for total event cost", expertMeaning_i18n: {"en":"C_material for total event cost"} },
    { id: "disDanismanMaliyeti", label: "External consultant cost", label_i18n: {"en":"External consultant cost"}, type: "number", unit: "currency", required: false, smartDefault: 0, helper: "Fees paid to external consultants.", helper_i18n: {"en":"Fees paid to external consultants."}, expertMeaning: "C_consultant for total event cost", expertMeaning_i18n: {"en":"C_consultant for total event cost"} },
    { id: "mevcutDonguSuresi", label: "Current cycle time", label_i18n: {"en":"Current cycle time"}, type: "number", unit: "min", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "Cycle time before the Kaizen improvement.", helper_i18n: {"en":"Cycle time before the Kaizen improvement."}, expertMeaning: "CT_old for \u0394CT = (CT_old-CT_new)/CT_old", expertMeaning_i18n: {"en":"CT_old for \u0394CT = (CT_old-CT_new)/CT_old"} },
    { id: "yeniDonguSuresi", label: "New cycle time", label_i18n: {"en":"New cycle time"}, type: "number", unit: "min", required: true, smartDefault: 7, validation: { min: 0.1 }, helper: "Cycle time after the Kaizen improvement.", helper_i18n: {"en":"Cycle time after the Kaizen improvement."}, expertMeaning: "CT_new for improvement percentage", expertMeaning_i18n: {"en":"CT_new for improvement percentage"} },
    { id: "mevcutHurdaOrani", label: "Current scrap rate", label_i18n: {"en":"Current scrap rate"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "Scrap/reject rate before improvement.", helper_i18n: {"en":"Scrap/reject rate before improvement."}, expertMeaning: "S_old for material savings", expertMeaning_i18n: {"en":"S_old for material savings"} },
    { id: "yeniHurdaOrani", label: "New scrap rate", label_i18n: {"en":"New scrap rate"}, type: "number", unit: "%", required: true, smartDefault: 4, validation: { min: 0, max: 100 }, helper: "Scrap/reject rate after improvement.", helper_i18n: {"en":"Scrap/reject rate after improvement."}, expertMeaning: "S_new for scrap reduction", expertMeaning_i18n: {"en":"S_new for scrap reduction"} },
    { id: "mevcutDurusOrani", label: "Current downtime rate", label_i18n: {"en":"Current downtime rate"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "Downtime as percentage of planned time (before).", helper_i18n: {"en":"Downtime as percentage of planned time (before)."}, expertMeaning: "D_old for downtime reduction", expertMeaning_i18n: {"en":"D_old for downtime reduction"} },
    { id: "yeniDurusOrani", label: "New downtime rate", label_i18n: {"en":"New downtime rate"}, type: "number", unit: "%", required: true, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "Downtime as percentage of planned time (after).", helper_i18n: {"en":"Downtime as percentage of planned time (after)."}, expertMeaning: "D_new for improvement", expertMeaning_i18n: {"en":"D_new for improvement"} },
    { id: "yillikUretimHacmi", label: "Annual production volume", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "units/year", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "Total units produced per year.", helper_i18n: {"en":"Total units produced per year."}, expertMeaning: "V for annual savings = V \u00d7 unit savings", expertMeaning_i18n: {"en":"V for annual savings = V \u00d7 unit savings"} },
    { id: "mevcutIsciSayisi", label: "Current headcount", label_i18n: {"en":"Current headcount"}, type: "number", unit: "", required: true, smartDefault: 20, validation: { min: 1 }, helper: "Number of operators currently assigned.", helper_i18n: {"en":"Number of operators currently assigned."}, expertMeaning: "H_old for labor savings", expertMeaning_i18n: {"en":"H_old for labor savings"} },
    { id: "yeniIsciSayisi", label: "New headcount (after)", label_i18n: {"en":"New headcount (after)"}, type: "number", unit: "", required: true, smartDefault: 16, validation: { min: 1 }, helper: "Number of operators after improvement.", helper_i18n: {"en":"Number of operators after improvement."}, expertMeaning: "H_new for labor savings", expertMeaning_i18n: {"en":"H_new for labor savings"} },
    { id: "yillikEnerjiTasarrufu_kWh", label: "Annual energy savings", label_i18n: {"en":"Annual energy savings"}, type: "number", unit: "kWh/year", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "Expected kWh reduction per year due to improvement.", helper_i18n: {"en":"Expected kWh reduction per year due to improvement."}, expertMeaning: "Energy savings for cost calculation", expertMeaning_i18n: {"en":"Energy savings for cost calculation"} },
    { id: "birimEnerjiMaliyeti", label: "Unit energy cost", label_i18n: {"en":"Unit energy cost"}, type: "number", unit: "currency/kWh", required: false, smartDefault: 0.12, validation: { min: 0 }, helper: "Cost per kWh of energy.", helper_i18n: {"en":"Cost per kWh of energy."}, expertMeaning: "C_kWh for energy savings", expertMeaning_i18n: {"en":"C_kWh for energy savings"} },
  ],
  outputs: [
    { id: "toplamEventMaliyeti", label: "Total event investment cost", label_i18n: {"en":"Total event investment cost"}, unit: "currency", format: "currency" },
    { id: "donguSuresiIyilesme_pct", label: "Cycle time improvement", label_i18n: {"en":"Cycle time improvement"}, unit: "%", format: "percentage" },
    { id: "hurdaAzalma_pct", label: "Scrap reduction", label_i18n: {"en":"Scrap reduction"}, unit: "%", format: "percentage" },
    { id: "durusAzalma_pct", label: "Downtime reduction", label_i18n: {"en":"Downtime reduction"}, unit: "%", format: "percentage" },
    { id: "iscilikTasarrufu_yil", label: "Annual labor cost savings", label_i18n: {"en":"Annual labor cost savings"}, unit: "currency", format: "currency" },
    { id: "malzemeTasarrufu_yil", label: "Annual material cost savings", label_i18n: {"en":"Annual material cost savings"}, unit: "currency", format: "currency" },
    { id: "enerjiTasarrufu_yil", label: "Annual energy cost savings", label_i18n: {"en":"Annual energy cost savings"}, unit: "currency", format: "currency" },
    { id: "toplamYillikTasarruf", label: "Total annual savings", label_i18n: {"en":"Total annual savings"}, unit: "currency", format: "currency" },
    { id: "ROI", label: "Return on Investment (ROI)", label_i18n: {"en":"Return on Investment (ROI)"}, unit: "%", format: "percentage" },
    { id: "geriOdemeSuresi_gun", label: "Payback period", label_i18n: {"en":"Payback period"}, unit: "days", format: "number" },
  ],
  thresholds: [],
  formulaPipeline: [{ formulaId: "industrial.kaizen_event", inputMap: { eventDays: "eventSuresi", teamCount: "calisanSayisi", hourlyCost: "ekipUyesiSaatlikMaliyet", materialCost: "malzemeMaliyeti", consultantCost: "disDanismanMaliyeti", oldCycleTime: "mevcutDonguSuresi", newCycleTime: "yeniDonguSuresi" }, outputId: "toplamEventMaliyeti" }],
  reportTemplate: { title: "Kaizen Event & Cost Savings Report", title_i18n: {"en":"Kaizen Event & Cost Savings Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Investment = (Team\u00d7Days\u00d78h\u00d7Rate) + Material + Consultant.", "Annual savings = Labor + Material + Energy savings extrapolated to 12 months.", "ROI = (Annual Savings - Investment) / Investment \u00d7 100. Payback = Investment/AnnualSavings\u00d7365."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * Value Stream Mapping (VSM) Metrics
 * ════════════════════════════════════════════════════════════════════════════ */

const VSM_METRICS_SCHEMA: PremiumCalculatorSchema = {
  id: "value-stream-mapping-analyzer",
  legacyPaidSlug: "value-stream-mapping-analyzer",
  name: "Value Stream Mapping (VSM) Metrics Analyzer", name_i18n: {"en":"Value Stream Mapping (VSM) Metrics Analyzer"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "Value Stream Mapping requires calculating Process Cycle Efficiency (PCE), Takt Time, required headcount and inventory days across the current state. Manual spreadsheet metrics miss the relationship between flow and demand.", painStatement_i18n: {"en":"Value Stream Mapping requires calculating Process Cycle Efficiency (PCE), Takt Time, required headcount and inventory days across the current state. Manual spreadsheet metrics miss the relationship between flow and demand."},
  inputs: [
    { id: "prosesAdimSayisi", label: "Number of process steps", label_i18n: {"en":"Number of process steps"}, type: "number", unit: "", required: true, smartDefault: 8, validation: { min: 1 }, helper: "Total process steps in the value stream.", helper_i18n: {"en":"Total process steps in the value stream."}, expertMeaning: "For VA/NVA step classification", expertMeaning_i18n: {"en":"For VA/NVA step classification"} },
    { id: "toplamKatmaDegerliSure", label: "Total value-added time", label_i18n: {"en":"Total value-added time"}, type: "number", unit: "min", required: true, smartDefault: 20, validation: { min: 0 }, helper: "Sum of all value-added processing times.", helper_i18n: {"en":"Sum of all value-added processing times."}, expertMeaning: "VA time for PCE = VA / Total Lead Time", expertMeaning_i18n: {"en":"VA time for PCE = VA / Total Lead Time"} },
    { id: "toplamBeklemeSure", label: "Total waiting time", label_i18n: {"en":"Total waiting time"}, type: "number", unit: "min", required: true, smartDefault: 120, validation: { min: 0 }, helper: "Sum of all waiting/queue times between steps.", helper_i18n: {"en":"Sum of all waiting/queue times between steps."}, expertMeaning: "Non-VA time for total lead time", expertMeaning_i18n: {"en":"Non-VA time for total lead time"} },
    { id: "toplamTasimaSure", label: "Total transport/move time", label_i18n: {"en":"Total transport/move time"}, type: "number", unit: "min", required: true, smartDefault: 30, validation: { min: 0 }, helper: "Sum of material movement times.", helper_i18n: {"en":"Sum of material movement times."}, expertMeaning: "Transport time (NVA)", expertMeaning_i18n: {"en":"Transport time (NVA)"} },
    { id: "toplamKontrolSure", label: "Total inspection time", label_i18n: {"en":"Total inspection time"}, type: "number", unit: "min", required: true, smartDefault: 15, validation: { min: 0 }, helper: "Sum of quality inspection/review times.", helper_i18n: {"en":"Sum of quality inspection/review times."}, expertMeaning: "Inspection time (NNVA)", expertMeaning_i18n: {"en":"Inspection time (NNVA)"} },
    { id: "musteriTalepAdeti", label: "Customer daily demand", label_i18n: {"en":"Customer daily demand"}, type: "number", unit: "units/day", required: true, smartDefault: 500, validation: { min: 1 }, helper: "Average daily quantity demanded by the customer.", helper_i18n: {"en":"Average daily quantity demanded by the customer."}, expertMeaning: "D for Takt = Available Time / D", expertMeaning_i18n: {"en":"D for Takt = Available Time / D"} },
    { id: "calismaSuresi_gun", label: "Available working time per day", label_i18n: {"en":"Available working time per day"}, type: "number", unit: "min/day", required: true, smartDefault: 480, validation: { min: 1 }, helper: "Total net working minutes per shift.", helper_i18n: {"en":"Total net working minutes per shift."}, expertMeaning: "A_time for Takt = A_time / Demand", expertMeaning_i18n: {"en":"A_time for Takt = A_time / Demand"} },
    { id: "vardiyaSayisi", label: "Number of shifts", label_i18n: {"en":"Number of shifts"}, type: "number", unit: "", required: false, smartDefault: 1, validation: { min: 1, max: 3 }, helper: "Shifts per day for total available time.", helper_i18n: {"en":"Shifts per day for total available time."}, expertMeaning: "Multiplier for total available time", expertMeaning_i18n: {"en":"Multiplier for total available time"} },
    { id: "mevcutStokMiktar", label: "Current inventory level", label_i18n: {"en":"Current inventory level"}, type: "number", unit: "units", required: false, smartDefault: 2500, validation: { min: 0 }, helper: "Total WIP and FG inventory in the stream.", helper_i18n: {"en":"Total WIP and FG inventory in the stream."}, expertMeaning: "For inventory days = Stock / Daily Demand", expertMeaning_i18n: {"en":"For inventory days = Stock / Daily Demand"} },
  ],
  outputs: [
    { id: "toplamGecenSure_PCT", label: "Total lead time (PCT)", label_i18n: {"en":"Total lead time (PCT)"}, unit: "min", format: "number" },
    { id: "toplamKatmaDegerliSure_PLT", label: "Total value-added time (PLT)", label_i18n: {"en":"Total value-added time (PLT)"}, unit: "min", format: "number" },
    { id: "processCycleEfficiency_PCE", label: "Process Cycle Efficiency (PCE)", label_i18n: {"en":"Process Cycle Efficiency (PCE)"}, unit: "%", format: "percentage" },
    { id: "taktTime_TT", label: "Takt Time (TT)", label_i18n: {"en":"Takt Time (TT)"}, unit: "min/unit", format: "number" },
    { id: "gerekliAdamSayisi", label: "Required headcount", label_i18n: {"en":"Required headcount"}, unit: "", format: "number" },
    { id: "stokGunu", label: "Inventory days", label_i18n: {"en":"Inventory days"}, unit: "days", format: "number" },
    { id: "prosesAdimSayisi_VA", label: "VA process steps", label_i18n: {"en":"VA process steps"}, unit: "", format: "number" },
    { id: "prosesAdimSayisi_NVA", label: "NVA process steps", label_i18n: {"en":"NVA process steps"}, unit: "", format: "number" },
    { id: "iyilestirmeOrani", label: "Improvement ratio", label_i18n: {"en":"Improvement ratio"}, unit: "", format: "number" },
    { id: "hedefTakt", label: "Target takt", label_i18n: {"en":"Target takt"}, unit: "min/unit", format: "number" },
  ],
  thresholds: [
    { fieldId: "processCycleEfficiency_PCE", warning: 25, critical: 10, direction: "lower_is_bad", warningMessage: "PCE below 25% \u2014 significant waste in the value stream.", warningMessage_i18n: {"en":"PCE below 25% \u2014 significant waste in the value stream."}, criticalMessage: "PCE below 10% \u2014 critically inefficient value stream.", criticalMessage_i18n: {"en":"PCE below 10% \u2014 critically inefficient value stream."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.vsm_metrics", inputMap: { vaTime_min: "toplamKatmaDegerliSure", waitTime_min: "toplamBeklemeSure", transportTime_min: "toplamTasimaSure", inspectionTime_min: "toplamKontrolSure", dailyDemand: "musteriTalepAdeti", workMinutesPerDay: "calismaSuresi_gun" }, outputId: "processCycleEfficiency_PCE" }],
  reportTemplate: { title: "Value Stream Mapping Analysis Report", title_i18n: {"en":"Value Stream Mapping Analysis Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { ...DEFAULT_ASSUMPTIONS, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["PCE = VA Time / Total Lead Time \u00d7 100. Total Lead Time = VA+Wait+Transport+Inspection.", "Takt Time = Available Time / Customer Demand. Lean target PCE > 25%.", "Inventory Days = Current Stock / Daily Customer Demand."] },
};

/* ════════════════════════════════════════════════════════════════════════════
 * 5S Audit Scoring Calculator
 * ════════════════════════════════════════════════════════════════════════════ */

const FIVE_S_AUDIT_SCHEMA: PremiumCalculatorSchema = {
  id: "5s-audit-scoring-calculator",
  legacyPaidSlug: "5s-audit-scoring-calculator",
  name: "5S Audit Scoring Calculator", name_i18n: {"en":"5S Audit Scoring Calculator"},
  sectorSlug: "general",
  category: "measurement",
  painStatement: "5S audit scoring requires computing each S (Sort/Set/Shine/Standardize/Sustain) percentage, overall score, letter grade and identifying the weakest S for improvement priority. Manual grading is inconsistent across auditors.", painStatement_i18n: {"en":"5S audit scoring requires computing each S (Sort/Set/Shine/Standardize/Sustain) percentage, overall score, letter grade and identifying the weakest S for improvement priority. Manual grading is inconsistent across auditors."},
  inputs: [
    { id: "currency", label: "Currency", label_i18n: {"en":"Currency"}, type: "select", unit: "", required: true, smartDefault: "USD", options: [...CURRENCY_OPTIONS], helper: "All monetary inputs in this currency.", helper_i18n: {"en":"All monetary inputs in this currency."}, expertMeaning: "ISO code.", expertMeaning_i18n: {"en":"ISO code."} },
    { id: "sort_puan", label: "Sort (Seiri) score", label_i18n: {"en":"Sort (Seiri) score"}, type: "number", unit: "", required: true, smartDefault: 18, validation: { min: 1, max: 25 }, helper: "Score achieved in Sort category.", helper_i18n: {"en":"Score achieved in Sort category."}, expertMeaning: "S1 score for Sort% = score/max", expertMeaning_i18n: {"en":"S1 score for Sort% = score/max"} },
    { id: "sort_max", label: "Sort (Seiri) max score", label_i18n: {"en":"Sort (Seiri) max score"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Sort category.", helper_i18n: {"en":"Maximum possible score in Sort category."}, expertMeaning: "Max S1 for percentage", expertMeaning_i18n: {"en":"Max S1 for percentage"} },
    { id: "setInOrder_puan", label: "Set in Order (Seiton) score", label_i18n: {"en":"Set in Order (Seiton) score"}, type: "number", unit: "", required: true, smartDefault: 16, validation: { min: 1, max: 25 }, helper: "Score achieved in Set in Order category.", helper_i18n: {"en":"Score achieved in Set in Order category."}, expertMeaning: "S2 score for Set% = score/max", expertMeaning_i18n: {"en":"S2 score for Set% = score/max"} },
    { id: "setInOrder_max", label: "Set in Order (Seiton) max score", label_i18n: {"en":"Set in Order (Seiton) max score"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Set in Order category.", helper_i18n: {"en":"Maximum possible score in Set in Order category."}, expertMeaning: "Max S2", expertMeaning_i18n: {"en":"Max S2"} },
    { id: "shine_puan", label: "Shine (Seiso) score", label_i18n: {"en":"Shine (Seiso) score"}, type: "number", unit: "", required: true, smartDefault: 20, validation: { min: 1, max: 25 }, helper: "Score achieved in Shine category.", helper_i18n: {"en":"Score achieved in Shine category."}, expertMeaning: "S3 score", expertMeaning_i18n: {"en":"S3 score"} },
    { id: "shine_max", label: "Shine (Seiso) max score", label_i18n: {"en":"Shine (Seiso) max score"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Shine category.", helper_i18n: {"en":"Maximum possible score in Shine category."}, expertMeaning: "Max S3", expertMeaning_i18n: {"en":"Max S3"} },
    { id: "standardize_puan", label: "Standardize (Seiketsu) score", label_i18n: {"en":"Standardize (Seiketsu) score"}, type: "number", unit: "", required: true, smartDefault: 14, validation: { min: 1, max: 25 }, helper: "Score achieved in Standardize category.", helper_i18n: {"en":"Score achieved in Standardize category."}, expertMeaning: "S4 score", expertMeaning_i18n: {"en":"S4 score"} },
    { id: "standardize_max", label: "Standardize (Seiketsu) max score", label_i18n: {"en":"Standardize (Seiketsu) max score"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Standardize category.", helper_i18n: {"en":"Maximum possible score in Standardize category."}, expertMeaning: "Max S4", expertMeaning_i18n: {"en":"Max S4"} },
    { id: "sustain_puan", label: "Sustain (Shitsuke) score", label_i18n: {"en":"Sustain (Shitsuke) score"}, type: "number", unit: "", required: true, smartDefault: 12, validation: { min: 1, max: 25 }, helper: "Score achieved in Sustain category.", helper_i18n: {"en":"Score achieved in Sustain category."}, expertMeaning: "S5 score", expertMeaning_i18n: {"en":"S5 score"} },
    { id: "sustain_max", label: "Sustain (Shitsuke) max score", label_i18n: {"en":"Sustain (Shitsuke) max score"}, type: "number", unit: "", required: true, smartDefault: 25, validation: { min: 1 }, helper: "Maximum possible score in Sustain category.", helper_i18n: {"en":"Maximum possible score in Sustain category."}, expertMeaning: "Max S5", expertMeaning_i18n: {"en":"Max S5"} },
    { id: "hedefSkor", label: "Target overall score (%)", label_i18n: {"en":"Target overall score (%)"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "Minimum target percentage for acceptable 5S performance.", helper_i18n: {"en":"Minimum target percentage for acceptable 5S performance."}, expertMeaning: "Target threshold for pass/fail", expertMeaning_i18n: {"en":"Target threshold for pass/fail"} },
    { id: "toplamCalisanSayisi", label: "Total employees in area", label_i18n: {"en":"Total employees in area"}, type: "number", unit: "", required: false, smartDefault: 25, validation: { min: 1 }, helper: "Total headcount assigned to the audited area.", helper_i18n: {"en":"Total headcount assigned to the audited area."}, expertMeaning: "For training cost allocation", expertMeaning_i18n: {"en":"For training cost allocation"} },
    { id: "egitimSaati_calisan", label: "Training hours per employee", label_i18n: {"en":"Training hours per employee"}, type: "number", unit: "hours", required: false, smartDefault: 4, validation: { min: 0 }, helper: "Hours of 5S training provided per employee.", helper_i18n: {"en":"Hours of 5S training provided per employee."}, expertMeaning: "For training investment cost", expertMeaning_i18n: {"en":"For training investment cost"} },
    { id: "egitimMaliyeti_saat", label: "Training cost per hour", label_i18n: {"en":"Training cost per hour"}, type: "number", unit: "currency/hr", required: false, smartDefault: 15, validation: { min: 0 }, helper: "Average cost per training hour (trainer + materials).", helper_i18n: {"en":"Average cost per training hour (trainer + materials)."}, expertMeaning: "C_training = hours \u00d7 rate \u00d7 employees", expertMeaning_i18n: {"en":"C_training = hours \u00d7 rate \u00d7 employees"} },
  ],
  outputs: [
    { id: "sort_yuzde", label: "Sort (Seiri) score %", label_i18n: {"en":"Sort (Seiri) score %"}, unit: "%", format: "percentage" },
    { id: "setInOrder_yuzde", label: "Set in Order (Seiton) score %", label_i18n: {"en":"Set in Order (Seiton) score %"}, unit: "%", format: "percentage" },
    { id: "shine_yuzde", label: "Shine (Seiso) score %", label_i18n: {"en":"Shine (Seiso) score %"}, unit: "%", format: "percentage" },
    { id: "standardize_yuzde", label: "Standardize (Seiketsu) score %", label_i18n: {"en":"Standardize (Seiketsu) score %"}, unit: "%", format: "percentage" },
    { id: "sustain_yuzde", label: "Sustain (Shitsuke) score %", label_i18n: {"en":"Sustain (Shitsuke) score %"}, unit: "%", format: "percentage" },
    { id: "toplamPuan", label: "Total raw score", label_i18n: {"en":"Total raw score"}, unit: "", format: "number" },
    { id: "toplamMaxPuan", label: "Total maximum score", label_i18n: {"en":"Total maximum score"}, unit: "", format: "number" },
    { id: "genelSkor_yuzde", label: "Overall 5S score", label_i18n: {"en":"Overall 5S score"}, unit: "%", format: "percentage" },
    { id: "hedefFarki", label: "Gap to target", label_i18n: {"en":"Gap to target"}, unit: "%", format: "percentage" },
    { id: "not_harf", label: "Letter grade", label_i18n: {"en":"Letter grade"}, unit: "", format: "number" },
    { id: "yesilAlan_orani", label: "Green area ratio (\u226580%)", label_i18n: {"en":"Green area ratio (\u226580%)"}, unit: "%", format: "percentage" },
    { id: "kategori_ortalamasi", label: "Category average %", label_i18n: {"en":"Category average %"}, unit: "%", format: "percentage" },
    { id: "egitimMaliyeti_toplam", label: "Total training investment", label_i18n: {"en":"Total training investment"}, unit: "currency", format: "currency" },
    { id: "iyilestirmeOncelikleri", label: "Improvement priorities", label_i18n: {"en":"Improvement priorities"}, unit: "", format: "number" },
    { id: "one_cikan_kategori", label: "Highlight category (lowest)", label_i18n: {"en":"Highlight category (lowest)"}, unit: "", format: "number" },
  ],
  thresholds: [
    { fieldId: "genelSkor_yuzde", warning: 80, critical: 60, direction: "lower_is_bad", warningMessage: "Overall 5S score below 80% (B grade) \u2014 improvement needed.", warningMessage_i18n: {"en":"Overall 5S score below 80% (B grade) \u2014 improvement needed."}, criticalMessage: "Overall 5S score below 60% (D/F grade) \u2014 critical deficiency, immediate action required.", criticalMessage_i18n: {"en":"Overall 5S score below 60% (D/F grade) \u2014 critical deficiency, immediate action required."} },
  ],
  formulaPipeline: [{ formulaId: "industrial.ss_audit", inputMap: { sortScore: "sort_puan", sortMax: "sort_max", seitonScore: "setInOrder_puan", seitonMax: "setInOrder_max", seisoScore: "shine_puan", seisoMax: "shine_max", seiketsuScore: "standardize_puan", seiketsuMax: "standardize_max", shitsukeScore: "sustain_puan", shitsukeMax: "sustain_max", targetPercent: "hedefSkor" }, outputId: "genelSkor_yuzde" }],
  reportTemplate: { title: "5S Audit Scoring Report", title_i18n: {"en":"5S Audit Scoring Report"}, sections: ["executive_summary", "assumptions"], exportFormats: ["pdf", "excel"] },
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
  HYDRAULIC_CYLINDER_TONNAGE_POWER_SCHEMA,
  COMPRESSOR_POWER_AIR_FLOW_SCHEMA,
  CUTTING_PARAMETERS_POWER_SCHEMA,
  EVAPORATIVE_COOLING_CAPACITY_SCHEMA,
  CONDENSER_PRECOOLING_SAVINGS_SCHEMA,
  PAD_MEDIA_PSYCHROMETRIC_SCHEMA,
  FGAS_LEAK_CO2_SCHEMA,
  WATER_FOOTPRINT_SCHEMA,
  SMOKE_EXHAUST_SHEV_SCHEMA,
  NATURAL_VENTILATION_ACH_SCHEMA,
  COMPOUND_INTEREST_SCHEMA,
  LIVING_WAGE_CALCULATOR_SCHEMA,
  PANEL_RADIATOR_HEATING_SCHEMA,
  UNDERFLOOR_HEATING_SCHEMA,
  SOLAR_COLLECTOR_SCHEMA,
  EPQ_CALCULATOR_SCHEMA,
  KANBAN_CALCULATOR_SCHEMA,
  LITTLES_LAW_SCHEMA,
  MILK_RUN_SCHEMA,
  CPM_PERT_CALCULATOR_SCHEMA,
  QUEUING_MM1_CALCULATOR_SCHEMA,
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
