/**
 * Formula contract registry — no contract, no launch.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";

const RENT_VS_BUY_DISCLAIMER =
  "This is a simplified comparison model, not financial or legal advice. Verify assumptions before housing or investment decisions.";

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
    "rentScenarioTotalCost",
    "buyScenarioNetPosition",
    "equityAtHorizon",
    "recommendationBand",
  ],
  assumptions: [
    RENT_VS_BUY_DISCLAIMER,
    "Comparison horizon is held constant across scenarios.",
    "Tax, insurance and maintenance may be approximated via ownership cost rate.",
  ],
  formulaSummary:
    "Current implementation compares cumulative rent paid against home purchase price only (simplified snapshot).",
  missingParameterWarnings: [
    "annualRentIncrease not modeled",
    "annualHomeAppreciation not modeled",
    "mortgageInterestRate not modeled",
    "mortgageTermYears not modeled",
    "investmentReturnRate not modeled",
    "ownershipCostPercent not modeled",
    "purchaseCostPercent not modeled",
    "sellingCostPercent not modeled",
  ],
  validationRules: [
    {
      id: "years-range",
      description: "comparisonYears must be between 1 and 40",
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
  ],
  scenarioTests: [
    { id: "normal-7yr", description: "7-year horizon with moderate rates", present: false },
    { id: "high-rent-growth", description: "High annual rent increase", present: false },
    { id: "low-appreciation", description: "Flat home appreciation", present: false },
    { id: "high-mortgage-rate", description: "Elevated mortgage interest", present: false },
    { id: "invalid-years", description: "comparisonYears outside 1–40 rejected", present: false },
  ],
  monotonicityRules: [
    {
      id: "rent-increase",
      description: "Higher annual rent increase must not reduce total rent scenario cost",
      inputKey: "annualRentIncrease",
      direction: "increase_should_increase",
      outputKey: "rentScenarioTotalCost",
    },
    {
      id: "mortgage-rate",
      description: "Higher mortgage interest must not improve buy scenario net position",
      inputKey: "mortgageInterestRate",
      direction: "increase_should_decrease",
      outputKey: "buyScenarioNetPosition",
    },
  ],
  oracleRequired: true,
  propertyTestsRegistered: false,
  decisionLanguageRules: [
    {
      id: "no-definitive-verdict",
      description:
        "Rent vs Buy must not give a definitive buy/rent command; use assumption-qualified language only.",
      acceptablePhrases: [
        "Under these assumptions...",
        "Buying looks stronger under the numbers entered.",
        "Renting and investing the difference looks stronger under the numbers entered.",
      ],
      requiredDisclaimer: true,
      forbiddenPhrases: [
        "you should buy",
        "you should rent",
        "this guarantees savings",
        "this is the best decision",
        "always buy",
        "always rent",
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
  ],
  auditOwner: "formula-governance",
};

export const FORMULA_CONTRACTS: readonly FormulaContract[] = [rentVsBuyContract];

export function getFormulaContractBySlug(slug: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.slug === slug);
}

export function getFormulaContractById(toolId: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.toolId === toolId);
}

export function listFormulaContractSlugs(): readonly string[] {
  return FORMULA_CONTRACTS.map((c) => c.slug);
}
