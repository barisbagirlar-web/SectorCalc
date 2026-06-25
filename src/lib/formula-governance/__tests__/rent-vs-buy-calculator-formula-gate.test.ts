/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — Test expects validateRentVsBuyCalculatorInputs (needs stub export)

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { validateRentVsBuyCalculatorInputs } from "@/lib/premium-schema/calculators/rent-vs-buy-calculator-validation";
import { calculateRentVsBuyModel } from "@/lib/tools/rent-vs-buy-model";

const SLUG = "rent-vs-buy-calculator";

const defaultInputs = {
  monthlyRent: 1800,
  homePrice: 420000,
  comparisonYears: 10,
  annualRentIncrease: 3,
  annualHomeAppreciation: 4,
  downPaymentPercent: 20,
  mortgageInterestRate: 6.5,
  mortgageTermYears: 30,
  investmentReturnRate: 5,
  ownershipCostPercent: 2,
  purchaseCostPercent: 3,
  sellingCostPercent: 6,
} as const;

describe("rent-vs-buy-calculator", () => {
  test("contract metadata present", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract?.slug).toBe(SLUG);
  });

  test("valid input produces finite comparison", () => {
    const result = calculateRentVsBuyModel(defaultInputs);
    expect(Number.isFinite(result.netDifference)).toBe(true);
    expect(Number.isFinite(result.monthlyMortgagePayment)).toBe(true);
  });

  test("invalid calendar year rejected", () => {
    const validation = validateRentVsBuyCalculatorInputs({
      ...defaultInputs,
      comparisonYears: 2026,
    });
    expect(validation.ok).toBe(false);
  });

  test("invalid negative rent rejected", () => {
    const validation = validateRentVsBuyCalculatorInputs({
      ...defaultInputs,
      monthlyRent: -1,
    });
    expect(validation.ok).toBe(false);
  });
});
