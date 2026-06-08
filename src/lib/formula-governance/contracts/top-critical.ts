/**
 * Top 10 critical FormulaContracts — Phase 3 governance coverage.
 * No formula changes; contract + audit skeleton only.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  GOVERNANCE_MINIMUM_SAFE_BID_TARGET_NOTE,
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  PREMIUM_DECISION_PRODUCTION_FILE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  buildFinanceAssuredContract,
  freeTrafficProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

export const loanPaymentCalculatorContract: FormulaContract = buildFinanceAssuredContract({
  toolId: "free-traffic.loan-payment-calculator",
  toolName: "Loan Payment Calculator",
  slug: "loan-payment-calculator",
  purpose: "Estimate fixed monthly amortizing loan payments from principal, nominal rate and term.",
  userDecision: "What is my approximate monthly payment for this loan under a fixed-rate model?",
  decisionImpact: "credit",
  requiredInputs: ["principal", "annualRate", "months"],
  criticalInputs: ["principal", "annualRate", "months"],
  outputs: ["recommendedPrice", "monthlyPayment"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("loan-payment-calculator", "amortizingPayment"),
    "Fixed nominal APR with monthly compounding via standard amortization.",
    "Taxes, insurance, origination fees and prepayment penalties are excluded.",
  ],
  formulaSummary:
    "Monthly payment = principal × [r(1+r)^n] / [(1+r)^n − 1] where r = annualRate/100/12 and n = months.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Fixed nominal APR with monthly compounding via standard amortization formula.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals amortizing monthly payment (monthlyPayment).",
    ],
    modelLimitations: [
      "Origination fees not modeled",
      "Variable or adjustable rates not modeled",
      "Property tax and insurance escrow not included unless modeled separately",
    ],
    futureExtensions: ["Insurance and tax escrow not included"],
  }),
  validationRules: [
    { id: "principal-positive", description: "principal must be > 0", kind: "edge" },
    { id: "rate-bounds", description: "annualRate within 0–100%", kind: "dimensional" },
    { id: "term-months", description: "months must be a positive integer", kind: "edge" },
    {
      id: "payment-currency",
      description: "monthlyPayment and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-30yr", description: "Normal case: 30-year fixed consumer loan" },
    { id: "edge-zero-rate", description: "Edge case: zero or near-zero interest rate" },
    { id: "absurd-term", description: "Absurd input: term outside 1–600 months rejected" },
    { id: "directional-rate-up", description: "Directional: higher rate increases payment" },
    { id: "sensitivity-principal", description: "Sensitivity: ±10% principal shifts payment proportionally" },
  ],
  monotonicityRules: [
    {
      id: "rate-up-payment",
      description: "Higher annualRate must not decrease monthly payment",
      inputKey: "annualRate",
      direction: "increase_should_increase",
      outputKey: "monthlyPayment",
    },
    {
      id: "principal-up-payment",
      description: "Higher principal must not decrease monthly payment",
      inputKey: "principal",
      direction: "increase_should_increase",
      outputKey: "monthlyPayment",
    },
    {
      id: "term-up-payment",
      description: "Longer term must not increase monthly payment",
      inputKey: "months",
      direction: "increase_should_decrease",
      outputKey: "monthlyPayment",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const mortgageCalculatorContract: FormulaContract = buildFinanceAssuredContract({
  toolId: "free-traffic.mortgage-calculator",
  toolName: "Mortgage Calculator",
  slug: "mortgage-calculator",
  purpose: "Estimate monthly mortgage payment and total interest over the loan term.",
  userDecision: "What are my approximate mortgage payment and interest totals under fixed-rate assumptions?",
  decisionImpact: "credit",
  requiredInputs: ["principal", "annualRate", "months"],
  criticalInputs: ["principal", "annualRate", "months"],
  outputs: ["recommendedPrice", "monthlyPayment", "totalPaid", "totalInterest"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("mortgage-calculator", "amortizingPayment + totals"),
    "Fixed-rate amortizing mortgage; monthly payments only.",
    "Property tax, insurance, PMI and closing costs excluded unless added later.",
  ],
  formulaSummary:
    "Uses standard amortizing payment; totalPaid = payment × months; totalInterest = totalPaid − principal.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Fixed-rate amortizing mortgage with monthly payments only.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals primary mortgage payment (monthlyPayment).",
    ],
    modelLimitations: [
      "PMI not modeled",
      "Property tax and insurance not modeled",
      "Adjustable-rate periods not modeled",
      "Closing costs and regional underwriting rules not modeled",
    ],
    futureExtensions: ["Escrow collection and disbursement timing not modeled"],
  }),
  validationRules: [
    { id: "principal-positive", description: "principal must be > 0", kind: "edge" },
    { id: "rate-percent", description: "annualRate is percent per year", kind: "dimensional" },
    { id: "term-positive", description: "months must be ≥ 1", kind: "edge" },
    {
      id: "payment-currency",
      description: "monthlyPayment and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-360", description: "Normal case: 30-year mortgage at market rate" },
    { id: "edge-short-term", description: "Edge case: 15-year term" },
    { id: "absurd-rate", description: "Absurd input: negative or >100% rate rejected" },
    { id: "directional-principal", description: "Directional: higher loan amount increases payment" },
    { id: "sensitivity-rate", description: "Sensitivity: +1% rate increases total interest materially" },
  ],
  monotonicityRules: [
    {
      id: "rate-up-payment",
      description: "Higher annualRate must not decrease monthly payment",
      inputKey: "annualRate",
      direction: "increase_should_increase",
      outputKey: "monthlyPayment",
    },
    {
      id: "principal-up-payment",
      description: "Higher principal must not decrease monthly payment",
      inputKey: "principal",
      direction: "increase_should_increase",
      outputKey: "monthlyPayment",
    },
    {
      id: "rate-up-interest",
      description: "Higher annualRate must not decrease total interest",
      inputKey: "annualRate",
      direction: "increase_should_increase",
      outputKey: "totalInterest",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const interestCalculatorContract: FormulaContract = buildFinanceAssuredContract({
  toolId: "free-traffic.interest-calculator",
  toolName: "Simple Interest Calculator",
  slug: "interest-calculator",
  purpose: "Calculate simple interest and total repayment from principal, rate and years.",
  userDecision: "How much simple interest accrues over this period under flat-rate assumptions?",
  decisionImpact: "financial",
  requiredInputs: ["principal", "ratePercent", "years"],
  criticalInputs: ["principal", "ratePercent", "years"],
  outputs: ["recommendedPrice", "interestAmount", "totalRepayment"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("interest-calculator", "simple interest"),
    "Simple interest only; no compounding within the period.",
    "Rate is nominal annual percent applied linearly over years.",
  ],
  formulaSummary: "Interest = principal × (ratePercent/100) × years; total = principal + interest.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Simple interest only; compounding not modeled by design.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals total repayment (totalRepayment).",
    ],
    modelLimitations: [
      "Payment schedule and partial repayments not modeled",
      "Compounding and reinvestment excluded unless modeled separately",
    ],
    futureExtensions: ["Amortizing payment schedule and partial prepayment paths"],
  }),
  validationRules: [
    { id: "principal-positive", description: "principal must be > 0", kind: "edge" },
    { id: "years-positive", description: "years must be > 0", kind: "edge" },
    { id: "rate-percent", description: "ratePercent is annual percent", kind: "dimensional" },
    {
      id: "repayment-currency",
      description: "totalRepayment and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-1yr", description: "Normal case: 1-year simple loan" },
    { id: "edge-low-rate", description: "Edge case: very low rate" },
    { id: "absurd-years", description: "Absurd input: zero or negative years rejected" },
    { id: "directional-rate", description: "Directional: higher rate increases interest" },
    { id: "sensitivity-principal", description: "Sensitivity: principal doubles → interest doubles" },
  ],
  monotonicityRules: [
    {
      id: "rate-up-interest",
      description: "Higher ratePercent must not decrease interest amount",
      inputKey: "ratePercent",
      direction: "increase_should_increase",
      outputKey: "interestAmount",
    },
    {
      id: "principal-up-interest",
      description: "Higher principal must not decrease interest amount",
      inputKey: "principal",
      direction: "increase_should_increase",
      outputKey: "interestAmount",
    },
    {
      id: "years-up-interest",
      description: "More years must not decrease interest amount",
      inputKey: "years",
      direction: "increase_should_increase",
      outputKey: "interestAmount",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const compoundInterestCalculatorContract: FormulaContract = buildFinanceAssuredContract({
  toolId: "free-traffic.compound-interest-calculator",
  toolName: "Compound Interest Calculator",
  slug: "compound-interest-calculator",
  purpose: "Project future value with compound growth from principal, rate, years and compounding frequency.",
  userDecision: "What future value might this deposit reach under compound growth assumptions?",
  decisionImpact: "investment",
  requiredInputs: ["principal", "annualRate", "years", "compoundsPerYear"],
  criticalInputs: ["principal", "annualRate", "years", "compoundsPerYear"],
  outputs: ["recommendedPrice", "futureValue", "interestEarned"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("compound-interest-calculator", "compound FV"),
    "Nominal rate with discrete compounding; no contributions or withdrawals.",
    "Tax, inflation and fees excluded.",
  ],
  formulaSummary:
    "Future value = principal × (1 + annualRate/100/compoundsPerYear)^(compoundsPerYear × years).",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Nominal rate with discrete compounding; no contributions or withdrawals.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals projected future value (futureValue).",
    ],
    modelLimitations: [
      "Periodic contributions not modeled",
      "Market volatility and sequence-of-returns risk not modeled",
    ],
    futureExtensions: [
      "Inflation adjustment not modeled",
      "Tax on interest not modeled",
      "Contribution timing and withdrawal schedules",
    ],
  }),
  validationRules: [
    { id: "compounds-positive", description: "compoundsPerYear must be ≥ 1", kind: "edge" },
    { id: "rate-bounds", description: "annualRate within reasonable percent bounds", kind: "dimensional" },
    { id: "years-positive", description: "years must be > 0", kind: "edge" },
    {
      id: "future-value-currency",
      description: "futureValue and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-monthly", description: "Normal case: monthly compounding over 10 years" },
    { id: "edge-annual", description: "Edge case: annual compounding only" },
    { id: "absurd-frequency", description: "Absurd input: zero compounds per year rejected" },
    { id: "directional-rate", description: "Directional: higher rate increases future value" },
    { id: "sensitivity-horizon", description: "Sensitivity: longer horizon increases future value" },
  ],
  monotonicityRules: [
    {
      id: "rate-up-fv",
      description: "Higher annualRate must not decrease future value",
      inputKey: "annualRate",
      direction: "increase_should_increase",
      outputKey: "futureValue",
    },
    {
      id: "principal-up-fv",
      description: "Higher principal must not decrease future value",
      inputKey: "principal",
      direction: "increase_should_increase",
      outputKey: "futureValue",
    },
    {
      id: "years-up-fv",
      description: "More years must not decrease future value",
      inputKey: "years",
      direction: "increase_should_increase",
      outputKey: "futureValue",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const profitMarginCalculatorContract: FormulaContract = buildFinanceAssuredContract({
  toolId: "free-traffic.profit-margin-calculator",
  toolName: "Profit Margin Calculator",
  slug: "profit-margin-calculator",
  purpose: "Compute selling margin percent and markup from unit price and cost.",
  userDecision: "What margin and markup do these price and cost inputs imply?",
  decisionImpact: "pricing",
  requiredInputs: ["sellingPrice", "cost"],
  criticalInputs: ["sellingPrice", "cost"],
  outputs: ["recommendedPrice", "marginPercent", "markupPercent"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("profit-margin-calculator", "margin % + markup %"),
    "Single-unit snapshot; excludes volume discounts, returns and overhead allocation.",
    "Margin % = (price − cost) ÷ price × 100.",
  ],
  formulaSummary: "Margin % = (sellingPrice − cost) ÷ sellingPrice × 100; markup on cost computed separately.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Single-unit gross margin snapshot without allocated overhead.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals gross margin percent (marginPercent).",
    ],
    modelLimitations: [
      "Fixed overhead not allocated",
      "Returns and chargebacks not modeled",
      "Volume discounts and tax effects excluded unless modeled",
    ],
    futureExtensions: ["Allocated overhead and multi-SKU mix margin"],
  }),
  validationRules: [
    { id: "price-positive", description: "sellingPrice must be > 0", kind: "edge" },
    { id: "cost-non-negative", description: "cost must be ≥ 0", kind: "edge" },
    { id: "margin-bounds", description: "margin percent stays within −100% to 100% for valid inputs", kind: "dimensional" },
    {
      id: "margin-percent-dimension",
      description: "marginPercent and recommendedPrice use percent semantics for governance target",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-margin", description: "Normal case: profitable SKU with 30% margin" },
    { id: "edge-break-even", description: "Edge case: price equals cost → 0% margin" },
    { id: "absurd-negative-price", description: "Absurd input: zero price rejected" },
    { id: "directional-cost", description: "Directional: higher cost lowers margin" },
    { id: "sensitivity-price", description: "Sensitivity: +10% price improves margin" },
  ],
  monotonicityRules: [
    {
      id: "cost-up-margin",
      description: "Higher cost must not improve margin percent",
      inputKey: "cost",
      direction: "increase_should_decrease",
      outputKey: "marginPercent",
    },
    {
      id: "price-up-margin",
      description: "Higher sellingPrice must not decrease margin percent",
      inputKey: "sellingPrice",
      direction: "increase_should_increase",
      outputKey: "marginPercent",
    },
    {
      id: "cost-up-markup",
      description: "Higher cost must not decrease markup percent when price fixed",
      inputKey: "cost",
      direction: "increase_should_increase",
      outputKey: "markupPercent",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const breakEvenCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.break-even-calculator",
  toolName: "Break-Even Calculator",
  slug: "break-even-calculator",
  purpose: "Estimate break-even volume from fixed costs, unit price and variable cost.",
  userDecision: "How many units must I sell to cover fixed costs under these unit economics?",
  decisionImpact: "financial",
  requiredInputs: ["fixedCost", "unitPrice", "variableCost"],
  criticalInputs: ["fixedCost", "unitPrice", "variableCost"],
  outputs: ["minimumSafeBid", "breakEvenUnits", "contributionMargin"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("break-even-calculator", "fixed ÷ contribution"),
    "Linear unit economics; constant price and variable cost per unit.",
    "Break-even undefined when contribution margin ≤ 0.",
  ],
  formulaSummary: "Units = fixedCost ÷ (unitPrice − variableCost); undefined if contribution ≤ 0.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Linear unit economics with constant price and variable cost per unit.",
      "Step-fixed costs not modeled.",
      GOVERNANCE_MINIMUM_SAFE_BID_TARGET_NOTE,
    ],
    modelLimitations: [
      "Price elasticity and volume discounts not modeled",
      "Multi-product mix not modeled",
      "Capacity constraints and demand saturation not modeled",
      "Fixed versus variable cost classification assumed by user inputs",
    ],
    futureExtensions: ["Multi-product break-even and capacity ceiling modeling"],
  }),
  validationRules: [
    { id: "contribution-check", description: "Reject or flag when unitPrice ≤ variableCost", kind: "edge" },
    { id: "fixed-non-negative", description: "fixedCost must be ≥ 0", kind: "edge" },
    { id: "currency-units", description: "Price and cost use consistent currency", kind: "dimensional" },
    {
      id: "break-even-units-count",
      description: "breakEvenUnits and minimumSafeBid use consistent count units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-volume", description: "Normal case: positive contribution margin" },
    { id: "edge-zero-fixed", description: "Edge case: zero fixed cost → zero break-even units" },
    { id: "absurd-contribution", description: "Absurd case: negative contribution → no break-even" },
    { id: "directional-fixed", description: "Directional: higher fixed cost increases break-even units" },
    { id: "sensitivity-price", description: "Sensitivity: higher unit price reduces break-even units" },
  ],
  monotonicityRules: [
    {
      id: "fixed-up-units",
      description: "Higher fixedCost must not decrease break-even units",
      inputKey: "fixedCost",
      direction: "increase_should_increase",
      outputKey: "breakEvenUnits",
    },
    {
      id: "price-up-units",
      description: "Higher unitPrice must not increase break-even units",
      inputKey: "unitPrice",
      direction: "increase_should_decrease",
      outputKey: "breakEvenUnits",
    },
    {
      id: "variable-up-units",
      description: "Higher variableCost must not decrease break-even units",
      inputKey: "variableCost",
      direction: "increase_should_increase",
      outputKey: "breakEvenUnits",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const salaryCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.salary-cost-calculator",
  toolName: "Employer Salary Cost Calculator",
  slug: "salary-cost-calculator",
  purpose: "Estimate total employer cost from gross salary and employer burden rate.",
  userDecision: "What total employer cost does this gross salary imply under the burden rate entered?",
  decisionImpact: "financial",
  requiredInputs: ["grossSalary", "employerRatePercent"],
  criticalInputs: ["grossSalary", "employerRatePercent"],
  outputs: ["recommendedPrice", "totalEmployerCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("salary-cost-calculator", "gross × (1 + burden%)"),
    "Monthly gross salary with flat employer load percent.",
    "Benefits, payroll tax rules and regional compliance vary by jurisdiction.",
  ],
  formulaSummary: "Total employer cost = grossSalary × (1 + employerRatePercent/100).",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Flat employer burden rate entered by user; not jurisdiction-specific tax tables.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals total employer payroll cost (totalEmployerCost).",
    ],
    modelLimitations: [
      "Jurisdiction-specific payroll taxes not itemized",
      "Benefits, insurance and local labor rules excluded unless modeled",
    ],
    futureExtensions: [
      "Benefits and bonuses not modeled separately",
      "Region-specific payroll tax tables",
    ],
  }),
  validationRules: [
    { id: "salary-positive", description: "grossSalary must be > 0", kind: "edge" },
    { id: "burden-percent", description: "employerRatePercent is percent not decimal", kind: "dimensional" },
    { id: "burden-bounds", description: "employerRatePercent within 0–200% sanity band", kind: "edge" },
    {
      id: "employer-cost-currency",
      description: "totalEmployerCost and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-burden", description: "Normal case: 20% employer load" },
    { id: "edge-zero-burden", description: "Edge case: zero employer load" },
    { id: "absurd-burden", description: "Absurd input: negative burden rejected" },
    { id: "directional-salary", description: "Directional: higher salary increases total cost" },
    { id: "sensitivity-burden", description: "Sensitivity: +5% burden increases total cost linearly" },
  ],
  monotonicityRules: [
    {
      id: "salary-up-total",
      description: "Higher grossSalary must not decrease total employer cost",
      inputKey: "grossSalary",
      direction: "increase_should_increase",
      outputKey: "totalEmployerCost",
    },
    {
      id: "burden-up-total",
      description: "Higher employerRatePercent must not decrease total employer cost",
      inputKey: "employerRatePercent",
      direction: "increase_should_increase",
      outputKey: "totalEmployerCost",
    },
    {
      id: "salary-up-linear",
      description: "Total cost scales linearly with grossSalary holding burden fixed",
      inputKey: "grossSalary",
      direction: "increase_should_increase",
      outputKey: "totalEmployerCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const cashFlowGapCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.cash-flow-gap-calculator",
  toolName: "Cash Flow Gap Calculator",
  slug: "cash-flow-gap-calculator",
  purpose: "Estimate working capital gap from receivables days, payables days and daily operating cost.",
  userDecision: "How much working capital might timing between receivables and payables tie up?",
  decisionImpact: "financial",
  requiredInputs: ["receivablesDays", "payableDays", "dailyCost"],
  criticalInputs: ["receivablesDays", "payableDays", "dailyCost"],
  outputs: ["recommendedPrice", "gapDays", "workingCapitalGap"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("cash-flow-gap-calculator", "gap days × daily cost"),
    "Linear daily cost; constant payment terms across the period.",
    "Seasonality, credit limits and line-of-credit costs excluded.",
  ],
  formulaSummary: "Gap days = receivablesDays − payableDays; working capital gap = gapDays × dailyCost.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Linear daily cost with simple receivable/payable timing model.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals working capital gap amount (workingCapitalGap).",
    ],
    modelLimitations: [
      "Seasonality not modeled",
      "Partial payments and bad debt not modeled",
      "Collection uncertainty and credit line availability not modeled",
    ],
    futureExtensions: [
      "Interest on working capital line not modeled",
      "Rolling 13-week cash forecast",
    ],
  }),
  validationRules: [
    { id: "days-non-negative", description: "Day inputs must be ≥ 0", kind: "edge" },
    { id: "daily-cost-positive", description: "dailyCost must be > 0 for meaningful gap", kind: "edge" },
    { id: "day-units", description: "Receivables and payables measured in days", kind: "dimensional" },
    {
      id: "gap-currency",
      description: "workingCapitalGap and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-gap", description: "Normal case: receivables longer than payables" },
    { id: "edge-balanced", description: "Edge case: equal receivable and payable days → zero gap" },
    { id: "absurd-negative-days", description: "Absurd input: negative days rejected" },
    { id: "directional-receivables", description: "Directional: longer receivables increase gap" },
    { id: "sensitivity-daily-cost", description: "Sensitivity: higher daily cost widens gap amount" },
  ],
  monotonicityRules: [
    {
      id: "receivables-up-gap",
      description: "Higher receivablesDays must not decrease working capital gap",
      inputKey: "receivablesDays",
      direction: "increase_should_increase",
      outputKey: "workingCapitalGap",
    },
    {
      id: "payables-up-gap",
      description: "Higher payableDays must not increase working capital gap",
      inputKey: "payableDays",
      direction: "increase_should_decrease",
      outputKey: "workingCapitalGap",
    },
    {
      id: "daily-cost-up-gap",
      description: "Higher dailyCost must not decrease working capital gap",
      inputKey: "dailyCost",
      direction: "increase_should_increase",
      outputKey: "workingCapitalGap",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const machineTimeCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.machine-time-calculator",
  toolName: "Machine Time Calculator",
  slug: "machine-time-calculator",
  purpose: "Estimate machine minutes and direct machine cost from setup, cycle time, quantity and hourly rate.",
  userDecision: "What machine time and direct machine cost does this job imply before quoting?",
  decisionImpact: "pricing",
  requiredInputs: ["setupMinutes", "cycleSeconds", "quantity", "machineRate"],
  criticalInputs: ["setupMinutes", "cycleSeconds", "quantity", "machineRate"],
  outputs: ["recommendedPrice", "totalMinutes", "machineCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("machine-time-calculator", "setup + cycle × qty"),
    "Setup plus cycle × quantity converted to hours × machine rate.",
    "Tooling, scrap, labor burden and overhead excluded on free tier.",
  ],
  formulaSummary:
    "Total minutes = setupMinutes + (cycleSeconds × quantity) / 60; machine cost = (total minutes / 60) × machineRate.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Setup plus cycle × quantity machine cost model.",
      "Operator labor not included unless user embeds it in machine rate.",
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "recommendedPrice metadata alias equals direct machine cost (machineCost).",
    ],
    modelLimitations: [
      "Tooling and fixture amortization not modeled",
      "Scrap and rework buffer not modeled",
      "Downtime, maintenance and operator delay not modeled",
      "Tool change, operator availability and queue time not modeled",
    ],
    futureExtensions: ["OEE-adjusted runtime and shop-floor queue modeling"],
  }),
  validationRules: [
    { id: "quantity-positive", description: "quantity must be ≥ 1", kind: "edge" },
    { id: "rate-positive", description: "machineRate must be > 0", kind: "edge" },
    { id: "time-units", description: "Setup in minutes, cycle in seconds", kind: "dimensional" },
    {
      id: "machine-cost-currency",
      description: "machineCost and recommendedPrice use consistent currency units",
      kind: "dimensional",
    },
  ],
  scenarioSpecs: [
    { id: "normal-job", description: "Normal case: batch with setup and cycle time" },
    { id: "edge-single-part", description: "Edge case: quantity = 1 setup-heavy job" },
    { id: "absurd-quantity", description: "Absurd input: zero quantity rejected" },
    { id: "directional-cycle", description: "Directional: longer cycle increases machine cost" },
    { id: "sensitivity-rate", description: "Sensitivity: +10% machine rate increases cost proportionally" },
  ],
  monotonicityRules: [
    {
      id: "cycle-up-cost",
      description: "Higher cycleSeconds must not decrease machine cost",
      inputKey: "cycleSeconds",
      direction: "increase_should_increase",
      outputKey: "machineCost",
    },
    {
      id: "quantity-up-cost",
      description: "Higher quantity must not decrease machine cost",
      inputKey: "quantity",
      direction: "increase_should_increase",
      outputKey: "machineCost",
    },
    {
      id: "rate-up-cost",
      description: "Higher machineRate must not decrease machine cost",
      inputKey: "machineRate",
      direction: "increase_should_increase",
      outputKey: "machineCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

export const cncQuoteRiskAnalyzerContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-premium.cnc-quote-risk-analyzer",
  toolName: "CNC Audit Engine",
  slug: "cnc-quote-risk-analyzer",
  purpose:
    "Estimate minimum safe price and quote risk verdict for CNC jobs using setup, cycle, tooling, material and machine rate inputs.",
  userDecision: "Should I accept this quote at the entered price given setup, tooling and margin risk?",
  decisionImpact: "pricing",
  requiredInputs: [
    "setupTime",
    "cycleTime",
    "quantity",
    "toolCost",
    "materialCost",
    "machineRate",
    "riskMargin",
  ],
  criticalInputs: [
    "setupTime",
    "cycleTime",
    "quantity",
    "toolCost",
    "materialCost",
    "machineRate",
    "riskMargin",
  ],
  outputs: ["minimumSafePrice", "quoteVerdict", "p90Cost", "suggestedAction"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    `Production: ${PREMIUM_DECISION_PRODUCTION_FILE} → BASE_COST_CALCULATORS["cnc-quote-risk-analyzer"] → calcCnc baseCost.`,
    "Premium analyzer adds hidden loss buffers and probabilistic safe price via risk engine.",
    "Under these assumptions, verdict bands are indicative — not a binding shop-floor guarantee.",
  ],
  formulaSummary:
    "Base cost from machine hours × rate plus tooling and material with scrap factor; safe price and verdict derived via MarginCore risk engine.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Base cost layer (machine hours × rate plus tooling/material) verified against independent oracle.",
    ],
    modelLimitations: [
      "Customer-specific tolerance bands may require manual override",
      "Premium decision layer (p90, safe price, verdict) not fully oracle-compared",
    ],
    futureExtensions: ["Multi-operation routing not fully modeled on v1"],
  }),
  validationRules: [
    { id: "quantity-min", description: "quantity must be ≥ 1", kind: "edge" },
    { id: "rate-positive", description: "machineRate must be > 0", kind: "edge" },
    { id: "margin-percent", description: "riskMargin is percent buffer not decimal", kind: "dimensional" },
    { id: "purpose-alignment", description: "Safe price must reflect setup-heavy low-volume jobs", kind: "purpose" },
  ],
  scenarioSpecs: [
    { id: "normal-quote", description: "Normal case: low-volume job with tooling cost" },
    { id: "edge-setup-heavy", description: "Edge case: setup dominates cycle time" },
    { id: "absurd-zero-rate", description: "Absurd input: zero machine rate rejected" },
    { id: "directional-tooling", description: "Directional: higher tool cost raises safe price floor" },
    { id: "sensitivity-margin", description: "Sensitivity: higher risk margin raises minimum safe price" },
  ],
  monotonicityRules: [
    {
      id: "tool-up-safe-price",
      description: "Higher toolCost must not decrease minimum safe price",
      inputKey: "toolCost",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "rate-up-safe-price",
      description: "Higher machineRate must not decrease minimum safe price",
      inputKey: "machineRate",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
    {
      id: "margin-up-safe-price",
      description: "Higher riskMargin must not decrease minimum safe price",
      inputKey: "riskMargin",
      direction: "increase_should_increase",
      outputKey: "minimumSafePrice",
    },
  ],
  decisionLanguageRules: [
    {
      id: "cnc-quote-assumption-qualified",
      description: STANDARD_DECISION_LANGUAGE_RULE.description,
      acceptablePhrases: [
        "Under these assumptions...",
        "Minimum safe price under the buffers entered.",
        "DO NOT ACCEPT UNDER — indicative floor only.",
      ],
      requiredDisclaimer: true,
      forbiddenPhrases: [
        "guaranteed savings",
        "best decision",
        "you should borrow",
        "you should buy",
        "you should sell",
        "guaranteed margin",
        "guaranteed profit",
        "safe to quote at any price",
        "guaranteed profit on this job",
      ],
    },
  ],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Guaranteed quote acceptance outcome",
    "Certified shop-floor approval",
  ],
});

export const TOP_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  loanPaymentCalculatorContract,
  mortgageCalculatorContract,
  interestCalculatorContract,
  compoundInterestCalculatorContract,
  profitMarginCalculatorContract,
  breakEvenCalculatorContract,
  salaryCostCalculatorContract,
  cashFlowGapCalculatorContract,
  machineTimeCalculatorContract,
  cncQuoteRiskAnalyzerContract,
];
