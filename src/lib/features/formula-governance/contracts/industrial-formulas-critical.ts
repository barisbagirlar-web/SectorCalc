/**
 * Industrial Formula Tools — 18 FormulaContracts (Phase 5H-c).
 *
 * ECMI / ISO 9001 — TÜV-certifiable engineering quality.
 * Each contract declares purpose, inputs, outputs, assumptions, validation rules,
 * scenarios, monotonicity, decision language and warning policy.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildCriticalContract,
  calculatorProductionAssumption,
  scenarioSkeletons,
} from "@/lib/features/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";

const PREMIUM_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional engineering advice. Verify assumptions before business decisions.";

/* ────────────────────────────────────────────────────────────────────────────
 * Shared warning policies
 * ──────────────────────────────────────────────────────────────────────────── */

const FINANCIAL_WARNING_POLICY = createWarningPolicy({
  acceptedAssumptions: [
    GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
    "User-supplied cash flows align to the same time period and currency.",
    "Discount rates are nominal and include expected inflation unless stated.",
  ],
  modelLimitations: [
    PREMIUM_DISCLAIMER,
    "Does not account for tax effects unless explicitly modeled (e.g., depreciation shield in Lease vs Buy).",
    "Not a regulatory, legal, or certified financial advisory tool.",
  ],
  futureExtensions: ["Scenario Monte Carlo simulation pack.", "Multi-currency cash flow normalization."],
});

const ENGINEERING_WARNING_POLICY = createWarningPolicy({
  acceptedAssumptions: [
    "User-supplied physical properties (density, viscosity, conductivity) are accurate for the operating condition.",
    "Flow is steady-state and fully developed for pipe/duct calculations.",
    "Material properties are isotropic and temperature-invariant unless stated.",
  ],
  modelLimitations: [
    PREMIUM_DISCLAIMER,
    "Not a substitute for detailed engineering design, CFD, FEA or certified pressure vessel analysis.",
    "Local code compliance and safety factors must be verified by a licensed engineer.",
  ],
  futureExtensions: ["Temperature-dependent property interpolation.", "Multi-phase flow regime detection."],
});

const STATISTICAL_WARNING_POLICY = createWarningPolicy({
  acceptedAssumptions: [
    "Input data is randomly sampled and representative of the population under study.",
    "No uncontrolled confounders bias the group comparison (ANOVA) or regression estimates.",
  ],
  modelLimitations: [
    PREMIUM_DISCLAIMER,
    "Does not automatically verify normality, homoscedasticity, or independence assumptions.",
    "Not a substitute for domain-specific statistical review or peer validation.",
  ],
  futureExtensions: ["Automated residual normality test (Shapiro-Wilk).", "Non-parametric alternative indicators."],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 1. IRR — Internal Rate of Return
 * ──────────────────────────────────────────────────────────────────────────── */
export const IrrCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.irr",
  toolName: "IRR Investment Analyzer",
  slug: "irr-investment-analyzer",
  purpose: "Compute the internal rate of return (IRR) — the discount rate that zeroes the NPV of a cash-flow series — using a hybrid bisection + Newton-Raphson algorithm with convergence guards.",
  userDecision: "Should this investment be accepted or rejected based on IRR relative to WACC?",
  decisionImpact: "investment",
  requiredInputs: [
    "initialInvestment", "cashFlowYear1", "cashFlowYear2", "cashFlowYear3",
    "cashFlowYear4", "cashFlowYear5", "cashFlowYear6", "cashFlowYear7",
    "cashFlowYear8", "cashFlowYear9", "cashFlowYear10",
  ],
  criticalInputs: ["initialInvestment"],
  outputs: ["irr", "npvAtWacc", "investmentVerdict", "convergenceStatus"],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "IRR is computed via bisection (bracket −0.999 to 0.5 expanded up to 200 steps) then Newton-Raphson refinement (max 1000 iterations).",
    "Convergence tolerance: |NPV| < 1e-10 or bracket width < 1e-10.",
    "Cash flow sign convention: negative = outflow, positive = inflow.",
    "At least one positive and one negative cash flow required for a valid IRR.",
    "NULL returns: no sign change, invalid input (NaN/Inf), or failed convergence.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "IrrCalculatorContract — deterministic hybrid IRR solver",
    ),
  ],
  formulaSummary:
    "Hybrid bisection + Newton-Raphson IRR: NPV(r)=Σ[CF_t/(1+r)^t]=0. Convergence at |NPV|<1e-10. Returns NULL for no-sign-change or non-convergence.",
  missingParameterWarnings: [],
  warningPolicy: FINANCIAL_WARNING_POLICY,
  validationRules: [
    { id: "irr-sign-check", description: "At least one positive and one negative cash flow must be present.", kind: "edge" },
    { id: "irr-finite-check", description: "All cash flow values must be finite (no NaN or Infinity).", kind: "edge" },
    { id: "irr-initial-investment-negative", description: "Initial investment should be negative (outflow).", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "irr-standard-investment", description: "Standard investment series [-10000, 3000, 4000, 5000, 5000, 4000] expects IRR ≈ 29.07%." },
    { id: "irr-no-sign-change", description: "All positive cash flows must return NULL_NO_SIGN_CHANGE." },
    { id: "irr-single-negative", description: "Single negative outflow returns NULL_INVALID_INPUT." },
  ]),
  monotonicityRules: [
    { id: "irr-initial-outflow", description: "More negative initial investment increases IRR (leverage effect).", inputKey: "initialInvestment", direction: "increase_should_increase", outputKey: "irr" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed investment return", "This IRR is the actual return"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 2. NPV — Net Present Value
 * ──────────────────────────────────────────────────────────────────────────── */
export const NpvCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.npv",
  toolName: "NPV Risk-Adjusted Analyzer",
  slug: "npv-risk-analyzer",
  purpose: "Compute net present value (NPV) of a cash-flow series with risk-adjusted scenario probabilities, terminal value (Gordon growth model) and sensitivity analysis.",
  userDecision: "Should this project be accepted based on risk-adjusted NPV?",
  decisionImpact: "investment",
  requiredInputs: [
    "initialCost", "cashFlowYears1to5", "cashFlowYears6to10",
    "discountRate", "projectLifeYears", "probabilityBase",
    "probabilityOptimistic", "terminalGrowthRate",
  ],
  criticalInputs: ["initialCost", "discountRate"],
  outputs: ["npvBase", "npvRiskAdjusted", "terminalValue", "sensitivityPercent", "npvVerdict"],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Risk-adjusted NPV = P_base × NPV_base + P_optimistic × NPV_optimistic + (1 − P_base − P_optimistic) × NPV_pessimistic.",
    "Terminal value TV = CF_n × (1+g) / (r−g) with r>g constraint. Returns NULL if r ≤ g.",
    "Sensitivity = (NPV_opt − NPV_pess) / (2 × NPV_base).",
    "Discount rate r > −1 and r ≠ −1 enforced.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "NpvCalculatorContract — deterministic NPV with risk adjustment and terminal value",
    ),
  ],
  formulaSummary:
    "Risk-adjusted NPV with scenario probabilities, Gordon growth terminal value (r>g constraint), sensitivity percentage for discount rate ±1% shift.",
  missingParameterWarnings: [],
  warningPolicy: FINANCIAL_WARNING_POLICY,
  validationRules: [
    { id: "npv-discount-rate-valid", description: "Discount rate must be > −1 and ≠ −1.", kind: "dimensional" },
    { id: "npv-terminal-growth-check", description: "Terminal growth rate must be < discount rate.", kind: "edge" },
    { id: "npv-probability-sum", description: "Base + optimistic probabilities must be ≤ 100%.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "npv-standard-case", description: "Positive NPV with 10% discount rate, uniform cash flows." },
    { id: "npv-terminal-invalid", description: "r ≤ g returns NULL terminal value." },
    { id: "npv-sensitivity-extreme", description: "NPV_base near zero produces large sensitivity ratio." },
  ]),
  monotonicityRules: [
    { id: "npv-initial-cost", description: "Higher initial cost reduces NPV.", inputKey: "initialCost", direction: "increase_should_decrease", outputKey: "npvBase" },
    { id: "npv-discount-rate", description: "Higher discount rate reduces NPV.", inputKey: "discountRate", direction: "increase_should_decrease", outputKey: "npvBase" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed NPV", "Certain future cash flows"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 3. DCF — Discounted Cash Flow / WACC-CAPM
 * ──────────────────────────────────────────────────────────────────────────── */
export const DcfCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.dcf",
  toolName: "DCF Enterprise Valuator",
  slug: "dcf-enterprise-valuator",
  purpose: "Compute enterprise value and equity value using WACC-driven DCF with CAPM cost of equity, terminal value, and scenario-weighted valuation.",
  userDecision: "Is the business/project undervalued, fairly valued or overvalued based on DCF?",
  decisionImpact: "investment",
  requiredInputs: [
    "freeCashFlowYear1", "freeCashFlowYear2", "freeCashFlowYear3",
    "freeCashFlowYear4", "freeCashFlowYear5",
    "equityValue", "debtValue", "costOfEquity", "costOfDebt",
    "taxRate", "terminalGrowthRate", "sharesOutstanding",
  ],
  criticalInputs: ["equityValue", "debtValue", "costOfEquity", "terminalGrowthRate"],
  outputs: ["wacc", "enterpriseValue", "equityValueCalc", "perShareValue", "dcfVerdict"],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "WACC = (E/V)×Re + (D/V)×Rd×(1−Tc). Re via CAPM: Re = Rf + β×(Rm−Rf).",
    "Enterprise Value = Σ[FCFF_t/(1+WACC)^t] + TV/(1+WACC)^n.",
    "Terminal Value TV = FCFF_n×(1+g)/(WACC−g). Constraint: WACC > g.",
    "Equity Value = Enterprise Value − Net Debt.",
    "Scenario weighting: 0.25×Bull + 0.50×Base + 0.25×Bear.",
    "Base case uses user FCFF; Bull: g+1%, WACC−0.5%; Bear: g−1%, WACC+0.5%.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "DcfCalculatorContract — WACC-CAPM DCF with scenario analysis",
    ),
  ],
  formulaSummary:
    "WACC-driven DCF: CAPM cost of equity, debt tax shield, terminal value with WACC>g constraint, scenario-weighted (bull/base/bear) enterprise and per-share valuation.",
  missingParameterWarnings: [],
  warningPolicy: FINANCIAL_WARNING_POLICY,
  validationRules: [
    { id: "dcf-wacc-gt-g", description: "WACC must be greater than terminal growth rate.", kind: "edge" },
    { id: "dcf-tax-rate-valid", description: "Tax rate must be between 0% and 100%.", kind: "dimensional" },
    { id: "dcf-shares-positive", description: "Shares outstanding must be positive.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "dcf-standard-valuation", description: "Positive enterprise value with WACC > g." },
    { id: "dcf-wacc-equals-g", description: "WACC = g returns NULL for terminal value." },
    { id: "dcf-bull-bear-spread", description: "Bull case value > base > bear case." },
  ]),
  monotonicityRules: [
    { id: "dcf-cost-of-equity", description: "Higher cost of equity reduces enterprise value.", inputKey: "costOfEquity", direction: "increase_should_decrease", outputKey: "enterpriseValue" },
    { id: "dcf-terminal-growth", description: "Higher terminal growth increases enterprise value.", inputKey: "terminalGrowthRate", direction: "increase_should_increase", outputKey: "enterpriseValue" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "This is the true company value", "Certain valuation"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 4. Lease vs Buy (NAL)
 * ──────────────────────────────────────────────────────────────────────────── */
export const LeaseVsBuyCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.lease-vs-buy",
  toolName: "Lease vs Buy Decision Analyzer",
  slug: "lease-vs-buy-analyzer",
  purpose: "Compute the Net Advantage to Leasing (NAL) by comparing the PV of buying (with depreciation tax shield and salvage) vs. leasing (with tax-deductible payments).",
  userDecision: "Should we lease or buy this asset based on NAL?",
  decisionImpact: "financial",
  requiredInputs: [
    "purchasePrice", "leaseTermMonths", "monthlyLeasePayment",
    "taxRate", "salvageValuePercent", "costOfDebt",
  ],
  criticalInputs: ["purchasePrice", "costOfDebt"],
  outputs: ["pvBuy", "pvLease", "nal", "breakEvenPayment", "leaseBuyVerdict"],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "PV_buy = C₀ − Σ[(C₀/n × Tc)/(1+r_d)^t] − S_n×(1−Tc)/(1+r_d)^n.",
    "PV_lease = Σ[L_t×(1−Tc)/(1+r_d)^t].",
    "NAL = PV_buy − PV_lease. NAL > 0 → Buy; NAL < 0 → Lease; NAL = 0 → Break-even.",
    "r_d = Rd × (1−Tc). Straight-line depreciation over lease term.",
    "Maintenance delta ΔM, insurance delta ΔI, and opportunity cost (r_opportunity × C₀) adjust NAL when provided.",
    "Salvage value is post-tax at disposal.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "LeaseVsBuyCalculatorContract — deterministic NAL with tax effects",
    ),
  ],
  formulaSummary:
    "NAL = PV_buy − PV_lease. PV_buy includes depreciation tax shield and after-tax salvage. PV_lease includes after-tax lease payments. Adjusted for maintenance, insurance and opportunity cost deltas.",
  missingParameterWarnings: [],
  warningPolicy: FINANCIAL_WARNING_POLICY,
  validationRules: [
    { id: "nal-lease-term-positive", description: "Lease term must be > 0 months.", kind: "edge" },
    { id: "nal-payment-positive", description: "Monthly lease payment must be > 0.", kind: "edge" },
    { id: "nal-tax-rate-valid", description: "Tax rate between 0% and 100%.", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "nal-buy-advantage", description: "Low lease payment + high salvage → Buy advantage (NAL > 0)." },
    { id: "nal-lease-advantage", description: "High lease payment + zero salvage → Lease not advantageous (NAL < 0)." },
    { id: "nal-break-even-zero", description: "When PV_buy = PV_lease, NAL = 0." },
  ]),
  monotonicityRules: [
    { id: "nal-purchase-price", description: "Higher purchase price increases PV of buying.", inputKey: "purchasePrice", direction: "increase_should_increase", outputKey: "pvBuy" },
    { id: "nal-lease-payment", description: "Higher lease payment increases PV of leasing.", inputKey: "monthlyLeasePayment", direction: "increase_should_increase", outputKey: "pvLease" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed lease vs buy savings", "Tax advice"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Darcy-Weisbach Pressure Drop
 * ──────────────────────────────────────────────────────────────────────────── */
export const DarcyWeisbachCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.darcy-weisbach",
  toolName: "Darcy-Weisbach Full Analyzer",
  slug: "darcy-weisbach-analyzer",
  purpose: "Compute total pressure drop ΔP in a pipe system using the Darcy-Weisbach equation with Colebrook-White friction factor iteration, Reynolds number classification, minor losses and pump power estimate.",
  userDecision: "Is the pipe system pressure drop acceptable, or does it require redesign (larger diameter / lower flow)?",
  decisionImpact: "technical",
  requiredInputs: [
    "flowRate", "pipeLength", "pipeDiameter", "fluidDensity",
    "fluidViscosity", "pipeMaterial",
  ],
  criticalInputs: ["flowRate", "pipeDiameter", "pipeMaterial"],
  outputs: [
    "reynoldsNumber", "flowRegime", "darcyFrictionFactor",
    "pressureDropPa", "pressureDropBar", "pumpPowerKw",
    "minorLossTotal", "pressureDropVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "ΔP = f × (L/D) × (ρ × V²/2). Sudden contraction/expansion configurable.",
    "Colebrook-White: 1/√f = −2.0×log₁₀(ε/(3.7D) + 2.51/(Re×√f)).",
    "Swamee-Jain initial estimate: f₀ = 0.25/[log₁₀(ε/(3.7D) + 5.74/Re^0.9)]².",
    "Newton-Raphson refinement: max 50 iterations, tolerance |f_{n+1}−f_n| < 1e-8.",
    "Reynolds: Re < 2300 laminar (f=64/Re), Re > 4000 turbulent (Colebrook-White), 2300-4000 transitional (interpolated).",
    "Minor loss K values: elbow 90°=0.9, gate valve=10.0 (full open), tee=1.8, check valve=2.5.",
    "Sudden expansion: K=(1−A₁/A₂)². Sudden contraction: K=0.5×(1−A₂/A₁).",
    "Pump power: P = ΔP_total × Q / η (η=0.75 assumed).",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "DarcyWeisbachCalculatorContract — Colebrook-White Newton-Raphson iteration",
    ),
  ],
  formulaSummary:
    "Darcy-Weisbach ΔP with Colebrook-White friction factor (Newton-Raphson), Reynolds regime classification, minor losses (fittings, valves, area changes) and pump power estimate.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "dw-flow-rate-positive", description: "Flow rate must be > 0 m³/h.", kind: "edge" },
    { id: "dw-diameter-positive", description: "Pipe diameter must be > 0 mm.", kind: "edge" },
    { id: "dw-density-positive", description: "Fluid density must be > 0 kg/m³.", kind: "edge" },
    { id: "dw-viscosity-positive", description: "Dynamic viscosity must be > 0 Pa·s.", kind: "edge" },
    { id: "dw-colebrook-convergence", description: "Colebrook-White must converge within 50 iterations or fall back to Swamee-Jain with warning.", kind: "scenario" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "dw-turbulent-water", description: "Water at 10 m³/h, 100m steel pipe DN50 → turbulent, Re > 4000." },
    { id: "dw-laminar-oil", description: "High-viscosity oil → laminar Re < 2300, f = 64/Re." },
    { id: "dw-minor-loss-dominant", description: "Short pipe with many fittings → minor losses dominate." },
  ]),
  monotonicityRules: [
    { id: "dw-flow-inc-pressure-inc", description: "Higher flow rate increases pressure drop.", inputKey: "flowRate", direction: "increase_should_increase", outputKey: "pressureDropPa" },
    { id: "dw-diameter-inc-pressure-dec", description: "Larger pipe diameter reduces pressure drop.", inputKey: "pipeDiameter", direction: "increase_should_decrease", outputKey: "pressureDropPa" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed flow rate", "This replaces detailed hydraulic analysis"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 6. Heat Exchanger Sizing (LMTD)
 * ──────────────────────────────────────────────────────────────────────────── */
export const HeatExchangerCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.lmtd-heat-exchanger",
  toolName: "LMTD Heat Exchanger Sizer",
  slug: "lmtd-heat-exchanger-analyzer",
  purpose: "Compute required heat transfer area A using LMTD method with counter-flow and parallel-flow, F-correction factor for multi-pass, overall U with fouling resistances, and NTU-effectiveness verification.",
  userDecision: "Is the heat exchanger adequately sized, or does it require redesign (F < 0.75 → uneconomical)?",
  decisionImpact: "technical",
  requiredInputs: [
    "heatDuty", "hotInletTemp", "hotOutletTemp",
    "coldInletTemp", "coldOutletTemp",
    "hConvInside", "hConvOutside",
  ],
  criticalInputs: ["heatDuty", "hotInletTemp", "coldInletTemp"],
  outputs: [
    "lmtdDeltaT1", "lmtdDeltaT2", "lmtdValue",
    "correctionFactorF", "overallU", "requiredAreaM2",
    "ntuValue", "effectivenessEpsilon", "exchangerVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "LMTD_counter = (ΔT₁−ΔT₂)/ln(ΔT₁/ΔT₂). Special case: ΔT₁=ΔT₂ → LMTD = ΔT₁ (L'Hopital guard).",
    "LMTD_parallel = same formula with different ΔT₁/ΔT₂ assignment.",
    "F-correction for 1-2 shell-and-tube: R=(T_h,in−T_h,out)/(T_c,out−T_c,in), P=(T_c,out−T_c,in)/(T_h,in−T_c,in).",
    "WARNING: F < 0.75 → economically infeasible design.",
    "Overall U: 1/U = 1/h_i + r_i×ln(r_o/r_i)/k_w + 1/h_o + R_fi + R_fo.",
    "NTU = U×A/C_min. Effectiveness ε = [1−exp(−NTU×(1−C_r))]/[1−C_r×exp(−NTU×(1−C_r))] for counter-flow.",
    "C_r = 1 (phase change): ε = 1−exp(−NTU).",
    "Q_actual = ε × C_min × (T_h,in − T_c,in) used for verification.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "HeatExchangerCalculatorContract — LMTD with F-correction, U with fouling, NTU-effectiveness",
    ),
  ],
  formulaSummary:
    "LMTD with ΔT₁=ΔT₂ guard, 1-2 shell-and-tube F-correction (R<0.75 warning), overall U with tubular conduction and fouling, NTU-effectiveness verification.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "hx-duty-positive", description: "Heat duty must be > 0 kW.", kind: "edge" },
    { id: "hx-temp-delta-physical", description: "Hot inlet > hot outlet and cold outlet > cold inlet for counter-flow.", kind: "dimensional" },
    { id: "hx-f-correction-warning", description: "F < 0.75 triggers redesign warning.", kind: "scenario" },
    { id: "hx-lmtd-special-case", description: "ΔT₁ = ΔT₂ must not divide by ln(1)=0; special case returns ΔT₁.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "hx-counter-flow-standard", description: "Standard counter-flow, 100kW, 90/60 → 20/50°C." },
    { id: "hx-parallel-flow", description: "Parallel flow arrangement with same temperatures." },
    { id: "hx-lmtd-equal-delta", description: "ΔT₁ = ΔT₂ special case guard." },
  ]),
  monotonicityRules: [
    { id: "hx-duty-inc-area-inc", description: "Higher heat duty increases required area.", inputKey: "heatDuty", direction: "increase_should_increase", outputKey: "requiredAreaM2" },
    { id: "hx-u-inc-area-dec", description: "Higher convection coefficient reduces required area.", inputKey: "hConvInside", direction: "increase_should_decrease", outputKey: "requiredAreaM2" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed heat transfer", "This replaces detailed thermal design"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 7. OEE — Overall Equipment Effectiveness
 * ──────────────────────────────────────────────────────────────────────────── */
export const OeeCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.oee",
  toolName: "OEE & Six Big Losses Analyzer",
  slug: "oee-six-big-losses-analyzer",
  purpose: "Compute Overall Equipment Effectiveness (OEE = Availability × Performance × Quality) with Six Big Losses decomposition, TEEP and World Class benchmarking (≥85%).",
  userDecision: "Is the equipment operating at World Class OEE (≥85%), or which loss category should be prioritized?",
  decisionImpact: "operational",
  requiredInputs: [
    "plannedProductionTime", "downtimeHours", "idealCycleTime",
    "totalUnitsProduced", "goodUnitsProduced",
  ],
  criticalInputs: ["plannedProductionTime", "goodUnitsProduced"],
  outputs: [
    "availability", "performance", "quality", "oeeScore", "teepScore",
    "breakdownLoss", "setupLoss", "smallStopsLoss",
    "speedLoss", "startupScrapLoss", "productionScrapLoss",
    "lossPareto", "worldClassGap", "oeeVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "OEE = Availability × Performance × Quality.",
    "Availability = (Planned_time − Downtime) / Planned_time.",
    "Performance = (Units × Ideal_cycle) / Operating_time. Capped at 1.0.",
    "Quality = Good_units / Total_units. Capped at 1.0.",
    "Six Big Losses: Breakdown, Setup, Small Stops, Speed Loss, Startup Scrap, Production Scrap.",
    "TEEP = OEE × Utilization_rate (Planned / Calendar time). Calendar = 8760 hrs/yr.",
    "World Class: OEE ≥ 85%, TEEP ≥ 65%.",
    "Loss Pareto sorts categories by contribution to total loss (1 − OEE).",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "OeeCalculatorContract — OEE with Six Big Losses and TEEP",
    ),
  ],
  formulaSummary:
    "OEE = A × P × Q. Six Big Losses: breakdown, setup, small stops, speed, startup scrap, production scrap. TEEP = OEE × utilization. World Class ≥ 85%.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "oee-performance-capped", description: "Performance > 1.0 indicates input error; capped at 1.0.", kind: "edge" },
    { id: "oee-quality-capped", description: "Quality > 1.0 indicates input error; capped at 1.0.", kind: "edge" },
    { id: "oee-planned-time-positive", description: "Planned production time must be > 0.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "oee-world-class", description: "A=0.95, P=0.95, Q=0.99 → OEE = 89.3% → World Class." },
    { id: "oee-poor-performance", description: "A=0.80, P=0.65, Q=0.90 → OEE = 46.8% → urgent action." },
    { id: "oee-quality-dominant-loss", description: "High scrap rate → quality loss dominates Pareto." },
  ]),
  monotonicityRules: [
    { id: "oee-downtime-oee-dec", description: "More downtime reduces OEE.", inputKey: "downtimeHours", direction: "increase_should_decrease", outputKey: "oeeScore" },
    { id: "oee-good-units-oee-inc", description: "More good units increases OEE.", inputKey: "goodUnitsProduced", direction: "increase_should_increase", outputKey: "oeeScore" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed OEE improvement", "This replaces on-site TPM assessment"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 8. Line Balancing
 * ──────────────────────────────────────────────────────────────────────────── */
export const LineBalancingCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.line-balancing",
  toolName: "Line Balancing & Takt Optimizer",
  slug: "line-balancing-analyzer",
  purpose: "Compute takt time, theoretical minimum stations (N_min = ceil(Σt_i / Takt)), balance efficiency η, station load distribution via Largest Candidate Rule, and bottleneck station identification.",
  userDecision: "How many stations are needed and which station is the bottleneck? What is the rebalance action?",
  decisionImpact: "operational",
  requiredInputs: [
    "taskCount", "totalWorkContent", "taktTime", "actualStations",
  ],
  criticalInputs: ["taktTime", "totalWorkContent"],
  outputs: [
    "nMin", "balanceEfficiency", "balanceLoss",
    "bottleneckStationId", "bottleneckLoad",
    "stationLoadDistribution", "rebalanceAction",
    "lineBalanceVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Takt = Available_time / Customer_demand.",
    "N_min = ceil(Σt_i / Takt).",
    "Balance efficiency η = Σt_i / (N_real × Takt) × 100%.",
    "Largest Candidate Rule: sort tasks by descending duration, assign to station until capacity reached.",
    "Dependency constraints: task must have all predecessors assigned before assignment.",
    "Balance loss = 100% − η.",
    "Rebalance action suggests stations to combine or split based on load variance.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "LineBalancingCalculatorContract — takt, N_min, efficiency, bottleneck",
    ),
  ],
  formulaSummary:
    "Takt = available/demand. N_min = ceil(Σt_i/takt). η = Σt_i/(N_real×takt)×100%. Largest Candidate Rule station allocation. Bottleneck = highest load station.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "lb-takt-positive", description: "Takt time must be > 0.", kind: "edge" },
    { id: "lb-work-content-positive", description: "Total work content must be > 0.", kind: "edge" },
    { id: "lb-stations-positive", description: "Actual stations must be >= 1.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "lb-perfect-balance", description: "Total work = N_real × Takt → η = 100%." },
    { id: "lb-severe-imbalance", description: "One station at 95% load, others at 30% → η ≈ 50%." },
    { id: "lb-n-min-equal-n-real", description: "N_min = N_real → theoretical optimum." },
  ]),
  monotonicityRules: [
    { id: "lb-work-content-inc-stations-inc", description: "More work content increases minimum stations.", inputKey: "totalWorkContent", direction: "increase_should_increase", outputKey: "nMin" },
    { id: "lb-takt-inc-efficiency-inc", description: "Longer takt time increases balance efficiency.", inputKey: "taktTime", direction: "increase_should_increase", outputKey: "balanceEfficiency" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed balance improvement", "This replaces time-and-motion study"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 9. Standard Time / Work Study
 * ──────────────────────────────────────────────────────────────────────────── */
export const StandardTimeCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.standard-time",
  toolName: "Standard Time & Work Study Analyzer",
  slug: "standard-time-work-study",
  purpose: "Compute normal time (NT = OT × RF), standard time (ST = NT × (1 + ΣAllowance)), required sample size for statistical confidence, and MTM-1 equivalent lookup.",
  userDecision: "What is the statistically valid standard time for this operation, and is the sample size adequate?",
  decisionImpact: "operational",
  requiredInputs: [
    "observedTime", "sampleStdDev", "sampleSize",
    "ratingFactor", "personalAllowance", "fatigueAllowance",
    "delayAllowance",
  ],
  criticalInputs: ["observedTime", "ratingFactor"],
  outputs: [
    "normalTime", "standardTime", "requiredSampleSize",
    "sampleAdequate", "totalAllowance",
    "mtm1EquivalentTMU", "standardTimeVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "NT = OT × RF. RF=1.00 (normal), RF=1.10 (10% faster), RF=0.90 (10% slower).",
    "ST = NT × (1 + Allowance_total/100).",
    "Allowance = Personal (5%) + Fatigue (4-15% by work type) + Delay (1-5%).",
    "Required sample: n = (t_{α/2} × s / (e × x̄))². t ≈ 2.045 for 95% CI, n=30.",
    "MTM-1 equivalents: REACH, GRASP, MOVE, POSITION TMU values per distance/difficulty.",
    "1 TMU = 0.00001 hour = 0.036 seconds.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "StandardTimeCalculatorContract — NT, ST, sample size, MTM-1",
    ),
  ],
  formulaSummary:
    "NT = OT × RF. ST = NT × (1 + Allowance). Required n = (t×s/(e×x̄))². MTM-1 equivalents for standard motion classes.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "st-observed-time-positive", description: "Observed time must be > 0.", kind: "edge" },
    { id: "st-rating-factor-valid", description: "Rating factor between 50% and 150%.", kind: "dimensional" },
    { id: "st-sample-size-positive", description: "Sample size must be >= 1.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "st-normal-pace", description: "RF=1.00, 5min OT, 15% allowance → ST ≈ 5.75 min." },
    { id: "st-statistically-inadequate", description: "Small sample with high variance → n* > n." },
    { id: "st-mtm-equivalents", description: "R_20_A (12.9 TMU) + G1A (2.0 TMU) + M_10_B (11.3 TMU)." },
  ]),
  monotonicityRules: [
    { id: "st-observed-time-inc-st-inc", description: "Longer observed time increases standard time.", inputKey: "observedTime", direction: "increase_should_increase", outputKey: "standardTime" },
    { id: "st-rating-inc-st-inc", description: "Higher rating factor increases standard time.", inputKey: "ratingFactor", direction: "increase_should_increase", outputKey: "standardTime" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "This is the exact standard time", "Guaranteed labor efficiency"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 10. Learning Curve (Wright / Crawford)
 * ──────────────────────────────────────────────────────────────────────────── */
export const LearningCurveCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.learning-curve",
  toolName: "Learning Curve Cost Projector",
  slug: "learning-curve-cost-projector",
  purpose: "Project unit time and cumulative total cost using Wright (unit) and Crawford (cumulative average) learning curve models. Compute break-even quantity at target unit cost.",
  userDecision: "At what cumulative quantity does unit cost reach the target? Which learning model (Wright vs Crawford) is more conservative?",
  decisionImpact: "financial",
  requiredInputs: [
    "firstUnitTime", "learningRate", "cumulativeQuantity",
    "hourlyCost", "unitMaterialCost",
  ],
  criticalInputs: ["firstUnitTime", "learningRate"],
  outputs: [
    "wrightUnitTimeN", "wrightCumulativeAvgTime",
    "crawfordCumulativeAvgTime", "totalLaborCost",
    "breakEvenQuantity", "modelComparisonDelta",
    "learningCurveVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Wright (unit): Y_n = a × n^b, b = log(p)/log(2). p = learning rate (0.80 = 80%).",
    "Crawford (cumulative avg): Ȳ_n = a × n^b.",
    "Cumulative total approx: TC = a × N^(b+1) / (b+1).",
    "Break-even: n* = (C_target / a)^(1/b) for unit cost = C_target.",
    "Marginal unit (Crawford): Y_n = a × [(n+0.5)^(b+1) − (n−0.5)^(b+1)].",
    "p < 0.50 or p > 1.00 triggers invalid input warning.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "LearningCurveCalculatorContract — Wright + Crawford models",
    ),
  ],
  formulaSummary:
    "Wright Y_n = a×n^b. Crawford cumulative avg Ȳ_n = a×n^b. b = log(p)/log(2). Break-even n* = (target/a)^(1/b).",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "lc-learning-rate-valid", description: "Learning rate must be between 50% and 100%.", kind: "dimensional" },
    { id: "lc-first-time-positive", description: "First unit time must be > 0.", kind: "edge" },
    { id: "lc-quantity-positive", description: "Cumulative quantity must be >= 1.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "lc-80-pct", description: "80% learning, first unit 100hr, unit 100 → Y_100 ≈ 100×100^log(0.8)/log(2)." },
    { id: "lc-wright-vs-crawford", description: "Wright unit time < Crawford cumulative avg for same parameters." },
    { id: "lc-breakeven-reachable", description: "Target cost = first unit cost/2 → n* calculable." },
  ]),
  monotonicityRules: [
    { id: "lc-cumulative-inc-time-dec", description: "More cumulative units reduces unit time (learning effect).", inputKey: "cumulativeQuantity", direction: "increase_should_decrease", outputKey: "wrightUnitTimeN" },
    { id: "lc-learning-rate-inc-time-dec", description: "Monotonicity rule for lc-learning-rate-inc-time-dec.", inputKey: "learningRate", direction: "increase_should_increase", outputKey: "wrightUnitTimeN" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed learning rate", "This replaces actual production data"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 11. Spring Design (Helical Compression)
 * ──────────────────────────────────────────────────────────────────────────── */
export const SpringDesignCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.spring-design",
  toolName: "Helical Spring Design Analyzer",
  slug: "spring-design-analyzer",
  purpose: "Compute helical compression spring rate, Wahl-corrected shear stress, Euler buckling critical load, and Goodman fatigue criterion for static and fatigue loading.",
  userDecision: "Is the spring design safe (stress < allowable, no buckling, adequate fatigue life)?",
  decisionImpact: "technical",
  requiredInputs: [
    "wireDiameter", "meanCoilDiameter", "activeCoils",
    "totalCoils", "springFreeLength", "springLoad",
    "endCondition", "material", "loadType",
  ],
  criticalInputs: ["wireDiameter", "meanCoilDiameter", "springLoad"],
  outputs: [
    "springRate", "springIndexC", "wahlFactor",
    "maxShearStress", "allowableStress",
    "bucklingSlendernessRatio", "bucklingCriticalLoad",
    "goodmanCriterion", "safetyFactor", "springVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Spring rate: k = G×d⁴/(8×D³×N_a). G_steel = 79.3 GPa, G_stainless = 68.9 GPa.",
    "Spring index C = D/d. WARNING: C < 4 (hard to make), C > 12 (buckling risk).",
    "Wahl factor: K_w = (4C−1)/(4C−4) + 0.615/C.",
    "τ_max = K_w × (8×F×D)/(π×d³).",
    "τ_allowable = 0.45×UTS (static), 0.35×UTS (fatigue). UTS_steel ≈ 1400 MPa.",
    "Buckling slenderness λ = L₀/D. Critical λ: 2.62 (both free), 3.74 (one fixed).",
    "Euler critical: F_krit = k×L₀×[1 − √(1 − (πD/L₀)² × 2G/(2G+E))].",
    "Goodman: σ_a/S_e + σ_m/UTS < 1/SF. SF fatigue target ≥ 1.5.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "SpringDesignCalculatorContract — Wahl correction, buckling, Goodman",
    ),
  ],
  formulaSummary:
    "k = G×d⁴/(8×D³×N_a). C = D/d. Wahl K_w stress correction. Euler λ buckling check. Goodman σ_a/S_e + σ_m/UTS < 1/SF.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "spring-index-range", description: "Spring index C should be between 4 and 12. Outside range triggers warning.", kind: "edge" },
    { id: "spring-wire-dia-positive", description: "Wire diameter must be > 0 mm.", kind: "edge" },
    { id: "spring-coils-positive", description: "Active coils must be >= 1.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "spring-standard-steel", description: "Steel, d=5, D=40, N_a=10, F=500N → C=8, k≈49 N/mm." },
    { id: "spring-buckling-risk", description: "Long slender spring (L₀/D > 2.62) → buckling warning." },
    { id: "spring-fatigue-goodman", description: "Fatigue load with Goodman criterion check." },
  ]),
  monotonicityRules: [
    { id: "spring-dia-inc-rate-inc", description: "Thicker wire increases spring rate (k∝d⁴).", inputKey: "wireDiameter", direction: "increase_should_increase", outputKey: "springRate" },
    { id: "spring-load-inc-stress-inc", description: "Higher load increases max shear stress.", inputKey: "springLoad", direction: "increase_should_increase", outputKey: "maxShearStress" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed spring life", "This replaces prototype testing"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 12. Carbon Footprint (Scope 1, 2, 3)
 * ──────────────────────────────────────────────────────────────────────────── */
export const CarbonFootprintCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.carbon-footprint",
  toolName: "Carbon Footprint Scope 1-2-3 Full Analyzer",
  slug: "carbon-footprint-full-analyzer",
  purpose: "Compute total CO₂e emissions across GHG Protocol Scope 1 (direct fuels), Scope 2 (grid electricity), and Scope 3 (travel, freight, waste). GWP factors per AR6, CBAM cost estimate.",
  userDecision: "What is the total carbon footprint, which scope dominates, and what is the CBAM cost exposure?",
  decisionImpact: "operational",
  requiredInputs: [
    "naturalGasUsage", "dieselUsage", "gasolineUsage",
    "electricityUsage", "gridRegion",
  ],
  criticalInputs: ["naturalGasUsage", "electricityUsage"],
  outputs: [
    "scope1TotalCO2e", "scope2TotalCO2e", "scope3TotalCO2e",
    "totalCO2eMonthly", "totalCO2eYearly",
    "cbamCostEUR", "cbamPercentOfImportValue",
    "dominantScope", "carbonVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Scope 1 EF: Natural gas 2.204 kgCO₂e/m³, Diesel 2.640 kgCO₂e/L, Gasoline 2.392 kgCO₂e/L, LPG 1.630 kgCO₂e/L.",
    "Scope 2 EF: Turkey 0.447, EU avg 0.233, Renewable PPA 0.000, Global avg 0.475 kgCO₂e/kWh.",
    "Scope 3: Travel 0.2 kgCO₂e/km, Freight 0.15 kgCO₂e/ton-km, Waste 0.5 kgCO₂e/kg.",
    "GWP factors (AR6, 100yr): CO₂=1, CH₄_fossil=29.8, N₂O=273, HFC-134a=1530, SF₆=25200.",
    "CBAM cost = tCO₂e × CBAM_certificate_price (€90/tCO₂e assumed).",
    "Market-based (renewable PPA): Scope 2 = 0 kgCO₂e.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "CarbonFootprintCalculatorContract — GHG Protocol Scope 1-2-3 with CBAM",
    ),
  ],
  formulaSummary:
    "CO₂e = Σ(Activity_i × EF_i × GWP_i). Scope 1: fuels. Scope 2: grid with regional EF. Scope 3: travel/freight/waste. CBAM cost = tCO₂e × €90.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "GHG emission factors are from IPCC AR6 (2024 reference) and may differ from national inventories.",
      "CBAM certificate price is assumed at €90/tCO₂e; actual price varies by auction.",
    ],
    modelLimitations: [
      PREMIUM_DISCLAIMER,
      "Does not include process emissions (cement/steel/chemical) unless explicitly modeled.",
      "Not a substitute for verified GHG Protocol reporting or accredited carbon audit.",
    ],
    futureExtensions: ["Country-specific grid EF database.", "Process emission factors by industry (cement, steel, chemicals)."],
  }),
  validationRules: [
    { id: "cf-fuel-positive", description: "Fuel usage values must be >= 0.", kind: "edge" },
    { id: "cf-grid-region-valid", description: "Grid region must be one of the supported values.", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "cf-turkey-manufacturing", description: "500 m³ gas + 10000 kWh grid + Turkey EF → scope 1+2 ≈ 5570 kgCO₂e." },
    { id: "cf-renewable-ppa", description: "Renewable PPA → Scope 2 = 0." },
    { id: "cf-cbam-positive", description: "100 tCO₂e with €50k import value → CBAM ≈ €9000 (18%)." },
  ]),
  monotonicityRules: [
    { id: "cf-gas-inc-emissions-inc", description: "More natural gas usage increases CO₂ emissions.", inputKey: "naturalGasUsage", direction: "increase_should_increase", outputKey: "totalCO2eMonthly" },
    { id: "cf-electricity-inc-emissions-inc", description: "More electricity usage increases CO₂ emissions.", inputKey: "electricityUsage", direction: "increase_should_increase", outputKey: "totalCO2eMonthly" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "This is a certified carbon footprint", "Guaranteed CBAM exemption"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 13. Regression & Correlation
 * ──────────────────────────────────────────────────────────────────────────── */
export const RegressionCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.regression",
  toolName: "Regression & Correlation Analyzer",
  slug: "regression-correlation-analyzer",
  purpose: "Compute OLS simple linear regression coefficients (β₀, β₁), R², adjusted R², F-statistic with p-value, t-statistics, Pearson correlation r, and residual standard error.",
  userDecision: "Is the linear relationship statistically significant (p < 0.05)? How strong is it (R²)?",
  decisionImpact: "informational",
  requiredInputs: [
    "regressionN", "regressionSumX", "regressionSumY",
    "regressionSumXY", "regressionSumX2", "regressionSumY2",
  ],
  criticalInputs: ["regressionN"],
  outputs: [
    "beta0", "beta1", "rSquared", "adjustedRSquared",
    "fStatistic", "fPValue", "tStatisticBeta1",
    "pearsonR", "residualStdError", "regressionVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "β₁ = (n×Σxy − Σx×Σy) / (n×Σx² − (Σx)²). β₀ = ȳ − β₁ × x̄.",
    "R² = SS_reg / SS_tot = 1 − SS_res/SS_tot.",
    "Adjusted R² = 1 − (1−R²)×(n−1)/(n−2).",
    "F = SS_reg / (SS_res/(n−2)). p-value from F-distribution with df(1, n−2).",
    "Pearson r = Σ[(xᵢ−x̄)(yᵢ−ȳ)] / √[Σ(xᵢ−x̄)² × Σ(yᵢ−ȳ)²].",
    "t = r × √(n−2) / √(1−r²). df = n−2.",
    "Assumes linearity, independence, homoscedasticity and normality of residuals.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "RegressionCalculatorContract — OLS with R², F-test, t-statistics",
    ),
  ],
  formulaSummary:
    "β₁ = (nΣxy−ΣxΣy)/(nΣx²−(Σx)²). R², adj-R², F(df1,df2), t(df). Pearson r with significance. Residual standard error.",
  missingParameterWarnings: [],
  warningPolicy: STATISTICAL_WARNING_POLICY,
  validationRules: [
    { id: "reg-n-gte-3", description: "Sample size must be >= 3 for meaningful regression.", kind: "edge" },
    { id: "reg-n-var-x", description: "Denominator n×Σx²−(Σx)² must not be zero (requires variance in x).", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "reg-perfect-linear", description: "y = 2x + 1, points (1,3),(2,5),(3,7) → R²=1.0, β₁=2, β₀=1." },
    { id: "reg-no-correlation", description: "Random scatter → R² ≈ 0, p > 0.05." },
    { id: "reg-strong-positive", description: "r > 0.80, p < 0.05 → significant strong correlation." },
  ]),
  monotonicityRules: [
    { id: "reg-sumxy-inc-beta1-inc", description: "Higher Σxy increases slope β₁.", inputKey: "regressionSumXY", direction: "increase_should_increase", outputKey: "beta1" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Causation proven", "This regression predicts future values with certainty"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 14. Sample Size (Power Analysis)
 * ──────────────────────────────────────────────────────────────────────────── */
export const SampleSizeCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.sample-size",
  toolName: "Sample Size & Power Analyzer",
  slug: "sample-size-power-analyzer",
  purpose: "Compute minimum required sample size for proportion estimation (n = z²×p̂(1−p̂)/e²) and mean t-test (n = (z_α/2+z_β)²×σ²/Δ²) with Type I/II error balance.",
  userDecision: "Is the sample size adequate for the desired confidence, power and effect size?",
  decisionImpact: "informational",
  requiredInputs: [
    "testType", "confidenceLevel", "errorMargin",
    "estimatedProportion", "estimatedStdDev",
    "detectableEffect", "powerLevel",
  ],
  criticalInputs: ["confidenceLevel", "errorMargin"],
  outputs: [
    "requiredSampleSize", "actualPower", "type1ErrorRate",
    "type2ErrorRate", "sampleAdequacy",
    "sampleSizeVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Proportion: n = z²_{α/2} × p̂(1−p̂) / e². z_{0.025}=1.960 (95%), z_{0.005}=2.576 (99%).",
    "Mean (t-test): n = (z_{α/2} + z_β)² × σ² / Δ².",
    "z_β: 80% power→0.842, 90%→1.282, 95%→1.645.",
    "p̂ = 0.5 (maximum sample size) when proportion is unknown.",
    "α = 0.05 (industry standard), β = 0.20 (80% power).",
    "Medical standard: α = 0.01, Power ≥ 0.90.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "SampleSizeCalculatorContract — proportion and mean power analysis",
    ),
  ],
  formulaSummary:
    "Proportion: n = z²×p̂(1−p̂)/e². Mean: n = (z_α/2+z_β)²×σ²/Δ². z_{0.05/2}=1.960. Power: 80% (z=0.842), 90% (1.282), 95% (1.645).",
  missingParameterWarnings: [],
  warningPolicy: STATISTICAL_WARNING_POLICY,
  validationRules: [
    { id: "ss-confidence-valid", description: "Confidence level must be between 80% and 99.9%.", kind: "dimensional" },
    { id: "ss-error-margin-positive", description: "Error margin must be > 0% and < 100%.", kind: "edge" },
    { id: "ss-proportion-valid", description: "Estimated proportion must be between 0% and 100%.", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "ss-proportion-unknown", description: "p̂=0.5, 95% confidence, 5% margin → n ≈ 385." },
    { id: "ss-mean-80-power", description: "σ=10, Δ=5, 95% confidence, 80% power → n ≈ 32." },
    { id: "ss-90-power-larger", description: "σ=10, Δ=5, 95% confidence, 90% power → n ≈ 43 (larger than 80%)." },
  ]),
  monotonicityRules: [
    { id: "ss-confidence-inc-n-inc", description: "Higher confidence level increases required sample size.", inputKey: "confidenceLevel", direction: "increase_should_increase", outputKey: "requiredSampleSize" },
    { id: "ss-margin-inc-n-dec", description: "Larger error margin reduces required sample size.", inputKey: "errorMargin", direction: "increase_should_decrease", outputKey: "requiredSampleSize" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "This sample size guarantees significance", "Statistical significance = practical importance"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 15. ANOVA (One-Way)
 * ──────────────────────────────────────────────────────────────────────────── */
export const AnovaCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.anova",
  toolName: "ANOVA & Post-Hoc Analyzer",
  slug: "anova-variance-analyzer",
  purpose: "Compute one-way ANOVA table (SS_between, SS_within, df, MS, F, p-value), η² effect size, Tukey HSD and Bonferroni post-hoc pairwise comparisons.",
  userDecision: "Do at least two group means differ significantly (p < α)? Which specific groups differ?",
  decisionImpact: "informational",
  requiredInputs: [
    "groupCount", "totalSampleSize", "anovaGrandMean",
    "group1Mean", "group1Size", "group2Mean", "group2Size",
    "group3Mean", "group3Size",
  ],
  criticalInputs: ["groupCount", "totalSampleSize"],
  outputs: [
    "ssBetween", "ssWithin", "ssTotal",
    "dfBetween", "dfWithin", "msBetween", "msWithin",
    "fStatistic", "fPValue", "etaSquared",
    "tukeyHSDMatrix", "bonferroniAlpha",
    "anovaVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "SS_between = Σ{nⱼ(ȳⱼ − ȳ_grand)²}, df = k−1.",
    "SS_within = ΣΣ{(yᵢⱼ − ȳⱼ)²} approximated from group means and pooled variance.",
    "SS_total = SS_between + SS_within, df = N−1.",
    "F = MS_between / MS_within. p-value from F-distribution df(k−1, N−k).",
    "η² = SS_between / SS_total. Small=0.01, Medium=0.06, Large=0.14.",
    "Tukey HSD = q_{α,k,N−k} × √(MS_within / nⱼ) for equal n.",
    "Bonferroni: α* = α / C, C = k(k−1)/2 pairwise comparisons.",
    "Assumes normality within groups, homogeneity of variance, independence.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "AnovaCalculatorContract — one-way ANOVA with post-hoc",
    ),
  ],
  formulaSummary:
    "SS_b = Σnⱼ(ȳⱼ−ȳ_grand)². F = MS_b/MS_w. η² = SS_b/SS_t. Tukey HSD q-critical. Bonferroni α/k_comparisons.",
  missingParameterWarnings: [],
  warningPolicy: STATISTICAL_WARNING_POLICY,
  validationRules: [
    { id: "anova-groups-min-2", description: "At least 2 groups required.", kind: "edge" },
    { id: "anova-n-gt-k", description: "Total sample size must be > number of groups.", kind: "edge" },
    { id: "anova-group-sizes-positive", description: "Each group size must be >= 2.", kind: "edge" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "anova-all-equal", description: "All group means equal → F ≈ 0, p > 0.05, H₀ not rejected." },
    { id: "anova-one-different", description: "One group mean far from others → F large, p < 0.05, post-hoc identifies the pair." },
    { id: "anova-large-effect", description: "η² > 0.14 → large effect size." },
  ]),
  monotonicityRules: [
    { id: "anova-between-ss-inc-f-inc", description: "More groups with divergent means increases F-statistic.", inputKey: "groupCount", direction: "increase_should_increase", outputKey: "fStatistic" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Causation proven by ANOVA", "Guaranteed group difference"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 16. ROI — Return on Investment
 * ──────────────────────────────────────────────────────────────────────────── */
export const RoiCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.roi",
  toolName: "ROI & Payback Analyzer",
  slug: "roi-payback-analyzer",
  purpose: "Compute ROI%, exact payback period, IRR and NPV from multi-period cash flows. ROI alone is meaningless without IRR and NPV context.",
  userDecision: "Should this investment be accepted based on positive ROI, IRR > discount rate, and positive NPV?",
  decisionImpact: "financial",
  requiredInputs: [
    "totalInvestment", "annualNetReturnYear1", "annualNetReturnYear2",
    "annualNetReturnYear3", "annualNetReturnYear4", "annualNetReturnYear5",
    "targetDiscountRate",
  ],
  criticalInputs: ["totalInvestment", "targetDiscountRate"],
  outputs: [
    "roiPercent", "paybackPeriodYears", "paybackPeriodMonths",
    "irrValue", "npvValue", "investmentVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "ROI = (Net_Profit / Investment) × 100%. Net Profit = Total Return − Investment.",
    "Payback = cumulative cash flow reaches investment. Linear interpolation for partial year.",
    "IRR via Newton-NPV hybrid (same algorithm as IRR calculator).",
    "NPV at target discount rate. Positive NPV + IRR > rate + ROI > 0 → Accept.",
    "ROI alone is NOT sufficient — must be presented with IRR and NPV.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "RoiCalculatorContract — ROI with payback, IRR and NPV",
    ),
  ],
  formulaSummary:
    "ROI% = (ΣReturns − Investment)/Investment × 100. Payback: years to cumulative = investment. IRR: hybrid Newton-NPV. NPV: at target discount rate.",
  missingParameterWarnings: [],
  warningPolicy: FINANCIAL_WARNING_POLICY,
  validationRules: [
    { id: "roi-investment-positive", description: "Total investment must be > 0.", kind: "edge" },
    { id: "roi-discount-rate-valid", description: "Discount rate must be > 0 and < 100.", kind: "dimensional" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "roi-positive-all-metrics", description: "ROI > 0, IRR > discount rate, NPV > 0 → Accept." },
    { id: "roi-conflicting-metrics", description: "ROI positive but NPV negative → borderline." },
    { id: "roi-negative", description: "Total return < investment → negative ROI." },
  ]),
  monotonicityRules: [
    { id: "roi-investment-inc-roi-dec", description: "Higher investment reduces ROI percentage.", inputKey: "totalInvestment", direction: "increase_should_decrease", outputKey: "roiPercent" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed return on investment", "This ROI is the actual return"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 17. Belt-Pulley & Gear Ratio
 * ──────────────────────────────────────────────────────────────────────────── */
export const BeltPulleyCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.belt-pulley-gear",
  toolName: "Belt-Pulley & Gear Ratio Analyzer",
  slug: "belt-pulley-gear-analyzer",
  purpose: "Compute speed ratio i = N₁/N₂ = d₂/d₁, actual RPM with belt slip correction, belt speed v, power transmission P = (F₁−F₂)×v, Euler tension ratio F₁/F₂ = e^(μθ), multi-stage gear ratios and total drive efficiency.",
  userDecision: "Is the drive design acceptable? Is belt slip within limits (<5%)? Is total efficiency adequate?",
  decisionImpact: "technical",
  requiredInputs: [
    "driverPulleyDiameter", "drivenPulleyDiameter", "driverRPM",
    "beltTensionF1", "beltTensionF2", "coefficientFriction",
    "wrapAngle", "slipPercent", "beltType", "gearStageCount",
  ],
  criticalInputs: ["driverPulleyDiameter", "drivenPulleyDiameter", "driverRPM"],
  outputs: [
    "speedRatio", "actualDrivenRPM", "beltSpeedMs",
    "powerTransmissionW", "eulerTensionRatio",
    "totalGearRatio", "totalDriveEfficiency",
    "driveVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "Speed ratio: i = d₂/d₁ = N₁/N₂. Driven RPM: N₂ = N₁ / i.",
    "Actual N₂ = N₂_theoretical × (1 − s). s: V-belt=2%, flat=3%, timing=0%.",
    "Belt speed: v = π × d₁ × N₁ / 60000 [m/s].",
    "Power: P = (F₁ − F₂) × v [W].",
    "Euler: F₁/F₂ = e^(μθ). θ in radians.",
    "Gear efficiency: helical 0.97-0.99, spur 0.98-0.995, worm 0.40-0.90.",
    "Multi-stage: i_total = i₁×i₂×i₃..., η_total = η₁×η₂×η₃...",
    "Total efficiency = η_belt × η_gear_total.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "BeltPulleyCalculatorContract — speed ratio, slip, power, Euler, efficiency",
    ),
  ],
  formulaSummary:
    "i = d₂/d₁. N₂_actual = N₁/i × (1−s). v = πd₁N₁/60000. P = (F₁−F₂)v. F₁/F₂=e^(μθ). Multi-stage η = Πηᵢ.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "bp-diameters-positive", description: "Both pulley diameters must be > 0 mm.", kind: "edge" },
    { id: "bp-rpm-positive", description: "Driver RPM must be > 0.", kind: "edge" },
    { id: "bp-slip-threshold", description: "Total slip > 5% triggers redesign warning.", kind: "scenario" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "bp-standard-reduction", description: "d₁=100, d₂=200, N₁=1450 → i=2, N₂≈725." },
    { id: "bp-slip-correction", description: "V-belt with 2% slip → actual RPM = theoretical × 0.98." },
    { id: "bp-two-stage-gear", description: "Two stages with i₁=2, i₂=3 → i_total=6, η≈0.97×0.97=0.94." },
  ]),
  monotonicityRules: [
    { id: "bp-driver-dia-inc-speed-inc", description: "Larger driver pulley increases belt speed.", inputKey: "driverPulleyDiameter", direction: "increase_should_increase", outputKey: "beltSpeedMs" },
    { id: "bp-driven-dia-inc-ratio-inc", description: "Larger driven pulley increases speed ratio.", inputKey: "drivenPulleyDiameter", direction: "increase_should_increase", outputKey: "speedRatio" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed belt life", "This replaces drive train validation"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * 18. Hydraulic Cylinder Force & Buckling
 * ──────────────────────────────────────────────────────────────────────────── */
export const HydraulicCylinderCalculatorContract: FormulaContract = buildCriticalContract({
  toolId: "industrial-formula.hydraulic-cylinder",
  toolName: "Hydraulic Cylinder Force & Buckling Analyzer",
  slug: "hydraulic-cylinder-force-analyzer",
  purpose: "Compute push force F_push = P×A_piston, pull force F_pull = P×A_ring, extension/retraction speeds v = Q/A, hydraulic power P_hyd = ΔP×Q, and Euler buckling critical load F_krit = π²×E×I/(K×L)² with safety factor SF.",
  userDecision: "Is the hydraulic cylinder design safe against buckling (SF ≥ 3.5)? Are push/pull forces adequate?",
  decisionImpact: "technical",
  requiredInputs: [
    "systemPressure", "pistonDiameter", "rodDiameter",
    "pumpFlowRate", "cylinderStroke", "endCondition", "youngModulus",
  ],
  criticalInputs: ["systemPressure", "pistonDiameter", "cylinderStroke"],
  outputs: [
    "pushForceKN", "pullForceKN", "pushPullRatio",
    "extensionSpeedMms", "retractionSpeedMms",
    "hydraulicPowerKw", "eulerCriticalLoadKN",
    "bucklingSafetyFactor", "cylinderVerdict",
  ],
  assumptions: [
    PREMIUM_DISCLAIMER,
    "F_push = P × π×D²/4. F_pull = P × π×(D²−d²)/4.",
    "v_push = Q / A_piston. v_pull = Q / A_ring.",
    "Hydraulic power: P_hyd = ΔP × Q [W] or F × v.",
    "Volumetric efficiency η_v ≈ 0.95-0.98, Mechanical η_m ≈ 0.88-0.95.",
    "Total efficiency η_total = η_v × η_m ≈ 0.83-0.93.",
    "Euler buckling: F_krit = π² × E × I / (K × L)².",
    "I = π × d⁴ / 64. E_steel = 210 GPa, E_stainless = 193 GPa, E_aluminum = 69 GPa.",
    "K factors: 0.5 (fixed-fixed), 1.0 (hinged-hinged), 2.0 (fixed-free).",
    "Required SF ≥ 3.5 for buckling safety.",
    calculatorProductionAssumption(
      "src/lib/formula-governance/contracts/industrial-formulas-critical.ts",
      "HydraulicCylinderCalculatorContract — push/pull, speed, power, Euler buckling",
    ),
  ],
  formulaSummary:
    "F_push = P×πD²/4. F_pull = P×π(D²−d²)/4. v = Q/A. P_hyd = ΔP×Q. F_krit = π²EI/(KL)². SF = F_krit/F_applied ≥ 3.5.",
  missingParameterWarnings: [],
  warningPolicy: ENGINEERING_WARNING_POLICY,
  validationRules: [
    { id: "hc-pressure-positive", description: "System pressure must be > 0 bar.", kind: "edge" },
    { id: "hc-dia-valid", description: "Piston diameter > rod diameter > 0.", kind: "dimensional" },
    { id: "hc-sf-buckling", description: "Buckling safety factor must be ≥ 3.5 for safe design.", kind: "scenario" },
  ],
  scenarioTests: scenarioSkeletons([
    { id: "hc-standard-cylinder", description: "P=200bar, D=63mm, d=36mm → F_push ≈ 62kN, F_pull ≈ 42kN." },
    { id: "hc-buckling-failure", description: "Long rod (L=2000mm, d=36mm, hinged) → SF < 3.5." },
    { id: "hc-speed-power", description: "Q=30L/min, P=200bar → v_push ≈ 160mm/s, P_hyd ≈ 10kW." },
  ]),
  monotonicityRules: [
    { id: "hc-pressure-inc-force-inc", description: "Higher pressure increases push force.", inputKey: "systemPressure", direction: "increase_should_increase", outputKey: "pushForceKN" },
    { id: "hc-piston-dia-inc-force-inc", description: "Larger piston diameter increases push force.", inputKey: "pistonDiameter", direction: "increase_should_increase", outputKey: "pushForceKN" },
    { id: "hc-stroke-inc-buckling-dec", description: "Longer stroke reduces buckling safety factor.", inputKey: "cylinderStroke", direction: "increase_should_decrease", outputKey: "bucklingSafetyFactor" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed cylinder life", "This replaces hydraulic system certification"],
});

/* ────────────────────────────────────────────────────────────────────────────
 * Aggregate export
 * ──────────────────────────────────────────────────────────────────────────── */
export const INDUSTRIAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  IrrCalculatorContract,
  NpvCalculatorContract,
  DcfCalculatorContract,
  LeaseVsBuyCalculatorContract,
  DarcyWeisbachCalculatorContract,
  HeatExchangerCalculatorContract,
  OeeCalculatorContract,
  LineBalancingCalculatorContract,
  StandardTimeCalculatorContract,
  LearningCurveCalculatorContract,
  SpringDesignCalculatorContract,
  CarbonFootprintCalculatorContract,
  RegressionCalculatorContract,
  SampleSizeCalculatorContract,
  AnovaCalculatorContract,
  RoiCalculatorContract,
  BeltPulleyCalculatorContract,
  HydraulicCylinderCalculatorContract,
];
