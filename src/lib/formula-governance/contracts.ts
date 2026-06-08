/**
 * Formula contract registry — no contract, no launch.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
  freeTrafficProductionAssumption,
  scenarioRuntimeTests,
} from "@/lib/formula-governance/contracts/shared";
import { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/top-critical";
import { BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { RENT_VS_BUY_RESULT_WARNING } from "@/lib/tools/rent-vs-buy-model";

const RENT_VS_BUY_DISCLAIMER =
  "Technical simulation only — not financial, legal, or tax advice. Verify assumptions before housing or investment decisions.";

export const rentVsBuyContract: FormulaContract = {
  toolId: "free-traffic.rent-vs-buy-calculator",
  toolName: "Rent vs Buy Comparison",
  slug: "rent-vs-buy-calculator",
  purpose:
    "Help users compare renting versus buying a home over a defined horizon with financing and ownership economics.",
  userDecision: "Should I rent or buy over the comparison period given my assumptions?",
  riskLevel: "critical",
  decisionImpact: "investment",
  requiredInputs: [
    "monthlyRent",
    "homePrice",
    "comparisonYears",
    "annualRentIncrease",
    "annualHomeAppreciation",
    "downPaymentPercent",
    "mortgageInterestRate",
    "mortgageTermYears",
    "investmentReturnRate",
    "ownershipCostPercent",
    "purchaseCostPercent",
    "sellingCostPercent",
  ],
  criticalInputs: [
    "monthlyRent",
    "homePrice",
    "comparisonYears",
    "annualRentIncrease",
    "annualHomeAppreciation",
    "downPaymentPercent",
    "mortgageInterestRate",
    "mortgageTermYears",
    "investmentReturnRate",
    "ownershipCostPercent",
    "purchaseCostPercent",
    "sellingCostPercent",
  ],
  outputs: [
    "recommendedPriceDifference",
    "totalRentPaid",
    "investmentValueIfRenting",
    "monthlyMortgagePayment",
    "totalMortgagePaid",
    "remainingMortgageBalance",
    "futureHomeValue",
    "estimatedOwnershipCosts",
    "estimatedSellingCosts",
    "rentNetPosition",
    "buyNetPosition",
    "netDifference",
    "strongerScenario",
  ],
  assumptions: [
    RENT_VS_BUY_DISCLAIMER,
    freeTrafficProductionAssumption(
      "rent-vs-buy-calculator",
      "calculateRentVsBuyComparison",
    ),
    RENT_VS_BUY_RESULT_WARNING,
    "Comparison horizon is held constant across scenarios.",
    "Ownership, tax and insurance effects are approximated via ownership cost percent.",
    GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
    "Model limitation: property tax, insurance, maintenance, financing and appreciation assumptions simplified.",
    "Model limitation: property tax, insurance, maintenance and opportunity cost approximated via ownership cost percent.",
    "Model limitation: local market conditions, rent control and transaction timing not modeled.",
    "Model limitation: investment return on down payment uses flat rate; tax treatment of rent vs buy excluded.",
    "Future extension: itemized tax deduction and capital-gains modeling.",
    "Future extension: regional insurance, PMI and maintenance schedules.",
    "Future extension: scenario-based ownership and financing stress tests.",
    "Numeric decision target is net cost comparison (netDifference); strongerScenario is narrative verdict only.",
  ],
  formulaSummary:
    "Rent scenario projects annual rent with growth, invests down payment plus purchase costs at the investment return rate, and compares rentNetPosition. Buy scenario amortizes mortgage, projects appreciation, ownership and selling costs, and compares buyNetPosition.",
  missingParameterWarnings: [],
  validationRules: [
    {
      id: "years-range",
      description: "comparisonYears must be between 1 and 40",
      kind: "edge",
    },
    {
      id: "calendar-year-guard",
      description: "comparisonYears must not be entered as a calendar year such as 2026",
      kind: "edge",
    },
    {
      id: "percent-bounds",
      description: "Rate and percent inputs must stay within 0–100 where applicable",
      kind: "dimensional",
    },
    {
      id: "currency-units",
      description: "Rent and price inputs must use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "net-difference-currency",
      description: "netDifference and recommendedPriceDifference use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "verdict-non-numeric",
      description: "strongerScenario is narrative verdict output; not a numeric calculation target",
      kind: "purpose",
    },
  ],
  scenarioTests: scenarioRuntimeTests([
    { id: "normal-7yr", description: "7-year horizon with moderate rates" },
    { id: "high-rent-growth", description: "High annual rent increase" },
    { id: "low-appreciation", description: "Flat home appreciation" },
    { id: "high-mortgage-rate", description: "Elevated mortgage interest" },
    { id: "invalid-years", description: "comparisonYears outside 1–40 rejected" },
  ]),
  monotonicityRules: [
    {
      id: "rent-increase",
      description: "Higher annual rent increase must not reduce total rent paid",
      inputKey: "annualRentIncrease",
      direction: "increase_should_increase",
      outputKey: "totalRentPaid",
    },
    {
      id: "investment-return",
      description: "Higher investment return must not weaken rent net position",
      inputKey: "investmentReturnRate",
      direction: "increase_should_increase",
      outputKey: "rentNetPosition",
    },
    {
      id: "home-appreciation",
      description: "Higher home appreciation must not weaken buy net position",
      inputKey: "annualHomeAppreciation",
      direction: "increase_should_increase",
      outputKey: "buyNetPosition",
    },
    {
      id: "mortgage-rate-payment",
      description: "Higher mortgage interest must not decrease monthly payment",
      inputKey: "mortgageInterestRate",
      direction: "increase_should_increase",
      outputKey: "monthlyMortgagePayment",
    },
    {
      id: "down-payment-payment",
      description: "Higher down payment percent must not increase monthly mortgage payment",
      inputKey: "downPaymentPercent",
      direction: "increase_should_decrease",
      outputKey: "monthlyMortgagePayment",
    },
  ],
  oracleRequired: true,
  propertyTestsRegistered: true,
  auditStatus: "NEEDS_REVIEW",
  decisionLanguageRules: [
    {
      id: "no-definitive-verdict",
      description:
        "Rent vs Buy must not give a definitive buy/rent command; use assumption-qualified language only.",
      acceptablePhrases: [
        "Under these assumptions, buying looks stronger.",
        "Under these assumptions, renting and investing the difference looks stronger.",
        "Small changes in rates, rent growth or home appreciation can change the result.",
      ],
      requiredDisclaimer: true,
      forbiddenPhrases: [
        "you should buy",
        "you should rent",
        "this guarantees savings",
        "this is the best decision",
        "always buy",
        "always rent",
        "guaranteed savings",
        "guaranteed margin",
        "guaranteed profit",
      ],
    },
  ],
  mustNotClaim: [
    "You should buy.",
    "You should rent.",
    "This guarantees savings.",
    "This is the best decision.",
    "Guaranteed better option",
    "Certified financial advice",
    "Exact future home value",
    "Guaranteed savings",
    "Guaranteed margin",
    "Guaranteed profit",
  ],
  auditOwner: "formula-governance",
};

export const FORMULA_CONTRACTS: readonly FormulaContract[] = [
  rentVsBuyContract,
  ...TOP_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
];

export function getFormulaContractBySlug(slug: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.slug === slug);
}

export function getFormulaContractById(toolId: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.toolId === toolId);
}

export function listFormulaContractSlugs(): readonly string[] {
  return FORMULA_CONTRACTS.map((c) => c.slug);
}
