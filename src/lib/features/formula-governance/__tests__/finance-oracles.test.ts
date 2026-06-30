/**
 * Finance oracle baseline unit tests (Phase 4).
 */

import { describe, expect, test } from "vitest";
import {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
} from "@/lib/features/formula-governance/oracle/finance-oracles";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";

describe("finance oracles", () => {
  test("loan payment amortization matches standard formula", () => {
    const result = calculateLoanPaymentOracle({ principal: 200_000, annualRate: 6, months: 360 });
    expect(result.monthlyPayment).toBeGreaterThan(1_000);
    expect(result.monthlyPayment).toBeLessThan(2_500);
  });

  test("loan payment zero rate equals principal divided by term", () => {
    const result = calculateLoanPaymentOracle({ principal: 60_000, annualRate: 0, months: 60 });
    expect(result.monthlyPayment).toBe(1_000);
  });

  test("mortgage oracle returns total interest", () => {
    const result = calculateMortgagePaymentOracle({ principal: 300_000, annualRate: 5, months: 360 });
    expect(result.totalPaid).toBeGreaterThan(result.monthlyPayment * 359);
    expect(result.totalInterest).toBe(result.totalPaid - 300_000);
  });

  test("simple interest oracle", () => {
    const result = calculateSimpleInterestOracle({ principal: 10_000, ratePercent: 5, years: 2 });
    expect(result.interestAmount).toBe(1_000);
    expect(result.totalRepayment).toBe(11_000);
  });

  test("compound interest oracle with zero rate", () => {
    const result = calculateCompoundInterestOracle({
      principal: 5_000,
      annualRate: 0,
      years: 10,
      compoundsPerYear: 12,
    });
    expect(result.futureValue).toBe(5_000);
    expect(result.interestEarned).toBe(0);
  });

  test("profit margin oracle allows negative margin", () => {
    const result = calculateProfitMarginOracle({ sellingPrice: 80, cost: 100 });
    expect(result.marginPercent).toBeLessThan(0);
  });

  test("invalid principal throws OracleValidationError", () => {
    expect(() =>
      calculateLoanPaymentOracle({ principal: 0, annualRate: 5, months: 12 }),
    ).toThrow(OracleValidationError);
  });
});
