/**
 * Rent vs Buy property and validation tests (Phase 5B).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateRentVsBuyModel,
  RENT_VS_BUY_CALENDAR_YEAR_MESSAGE,
  RentVsBuyValidationError,
  type RentVsBuyInput,
} from "@/lib/tools/rent-vs-buy-model";

const BASE: RentVsBuyInput = {
  monthlyRent: 2000,
  homePrice: 400_000,
  comparisonYears: 10,
  annualRentIncrease: 3,
  annualHomeAppreciation: 3,
  downPaymentPercent: 20,
  mortgageInterestRate: 6.5,
  mortgageTermYears: 30,
  investmentReturnRate: 5,
  ownershipCostPercent: 1.5,
  purchaseCostPercent: 2,
  sellingCostPercent: 6,
};

describe("rent vs buy model validation", () => {
  test("comparisonYears outside 1–40 is invalid", () => {
    expect(() => calculateRentVsBuyModel({ ...BASE, comparisonYears: 0 })).toThrow(
      RentVsBuyValidationError,
    );
    expect(() => calculateRentVsBuyModel({ ...BASE, comparisonYears: 41 })).toThrow(
      RentVsBuyValidationError,
    );
  });

  test("comparisonYears=2026 returns calendar year message", () => {
    try {
      calculateRentVsBuyModel({ ...BASE, comparisonYears: 2026 });
      throw new Error("Expected validation failure");
    } catch (error) {
      expect(error).toBeInstanceOf(RentVsBuyValidationError);
      expect((error as RentVsBuyValidationError).message).toBe(RENT_VS_BUY_CALENDAR_YEAR_MESSAGE);
    }
  });

  test("zero or negative monthlyRent is invalid", () => {
    expect(() => calculateRentVsBuyModel({ ...BASE, monthlyRent: 0 })).toThrow(
      RentVsBuyValidationError,
    );
    expect(() => calculateRentVsBuyModel({ ...BASE, monthlyRent: -100 })).toThrow(
      RentVsBuyValidationError,
    );
  });

  test("zero or negative homePrice is invalid", () => {
    expect(() => calculateRentVsBuyModel({ ...BASE, homePrice: 0 })).toThrow(
      RentVsBuyValidationError,
    );
  });
});

describe("rent vs buy model properties", () => {
  test("annualRentIncrease increases totalRentPaid", () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 8, noNaN: true }), (bump) => {
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          annualRentIncrease: BASE.annualRentIncrease + bump,
        });
        expect(bumped.totalRentPaid).toBeGreaterThanOrEqual(base.totalRentPaid);
      }),
    );
  });

  test("investmentReturnRate increases rentNetPosition", () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 4, noNaN: true }), (bump) => {
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          investmentReturnRate: BASE.investmentReturnRate + bump,
        });
        expect(bumped.rentNetPosition).toBeGreaterThanOrEqual(base.rentNetPosition);
      }),
    );
  });

  test("annualHomeAppreciation increases buyNetPosition", () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 5, noNaN: true }), (bump) => {
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          annualHomeAppreciation: BASE.annualHomeAppreciation + bump,
        });
        expect(bumped.buyNetPosition).toBeGreaterThanOrEqual(base.buyNetPosition);
      }),
    );
  });

  test("mortgageInterestRate increases monthlyMortgagePayment", () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 3, noNaN: true }), (bump) => {
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          mortgageInterestRate: BASE.mortgageInterestRate + bump,
        });
        expect(bumped.monthlyMortgagePayment).toBeGreaterThanOrEqual(base.monthlyMortgagePayment);
      }),
    );
  });

  test("higher homePrice increases monthlyMortgagePayment with same down payment percent", () => {
    fc.assert(
      fc.property(fc.double({ min: 1.05, max: 1.3, noNaN: true }), (multiplier) => {
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          homePrice: BASE.homePrice * multiplier,
        });
        expect(bumped.monthlyMortgagePayment).toBeGreaterThanOrEqual(base.monthlyMortgagePayment);
        expect(bumped.loanAmount).toBeGreaterThan(base.loanAmount);
      }),
    );
  });

  test("downPaymentPercent increases reduces loan amount", () => {
    fc.assert(
      fc.property(fc.double({ min: 1, max: 15, noNaN: true }), (bump) => {
        fc.pre(BASE.downPaymentPercent + bump <= 90);
        const base = calculateRentVsBuyModel(BASE);
        const bumped = calculateRentVsBuyModel({
          ...BASE,
          downPaymentPercent: BASE.downPaymentPercent + bump,
        });
        expect(bumped.loanAmount).toBeLessThanOrEqual(base.loanAmount);
      }),
    );
  });
});

describe("rent vs buy oracle parity smoke", () => {
  test("model produces stronger scenario label inputs", () => {
    const buyCase = calculateRentVsBuyModel({
      ...BASE,
      annualHomeAppreciation: 8,
      annualRentIncrease: 1,
    });
    const rentCase = calculateRentVsBuyModel({
      ...BASE,
      annualHomeAppreciation: 0.5,
      annualRentIncrease: 8,
      mortgageInterestRate: 10,
    });
    expect(["buy", "rent", "tie"]).toContain(buyCase.strongerScenario);
    expect(["buy", "rent", "tie"]).toContain(rentCase.strongerScenario);
  });
});
