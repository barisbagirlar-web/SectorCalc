/**
 * Finance oracle property-based tests (Phase 4) — fast-check.
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
} from "@/lib/features/formula-governance/oracle/finance-oracles";
import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";

describe("finance oracle properties", () => {
  test("loan: higher principal does not decrease payment", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1_000, max: 500_000, noNaN: true }),
        fc.double({ min: 0.1, max: 15, noNaN: true }),
        fc.integer({ min: 12, max: 360 }),
        fc.double({ min: 1.01, max: 1.5, noNaN: true }),
        (principal, rate, months, multiplier) => {
          const base = calculateLoanPaymentOracle({ principal, annualRate: rate, months });
          const bumped = calculateLoanPaymentOracle({
            principal: principal * multiplier,
            annualRate: rate,
            months,
          });
          expect(bumped.monthlyPayment).toBeGreaterThanOrEqual(base.monthlyPayment);
        },
      ),
    );
  });

  test("loan: higher rate does not decrease payment", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10_000, max: 400_000, noNaN: true }),
        fc.double({ min: 0.5, max: 10, noNaN: true }),
        fc.integer({ min: 24, max: 360 }),
        fc.double({ min: 0.1, max: 3, noNaN: true }),
        (principal, rate, months, bump) => {
          const base = calculateLoanPaymentOracle({ principal, annualRate: rate, months });
          const high = calculateLoanPaymentOracle({
            principal,
            annualRate: rate + bump,
            months,
          });
          expect(high.monthlyPayment).toBeGreaterThanOrEqual(base.monthlyPayment);
        },
      ),
    );
  });

  test("loan: longer term lowers payment but raises total paid", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50_000, max: 300_000, noNaN: true }),
        fc.double({ min: 2, max: 8, noNaN: true }),
        (principal, rate) => {
          const short = calculateLoanPaymentOracle({ principal, annualRate: rate, months: 180 });
          const long = calculateLoanPaymentOracle({ principal, annualRate: rate, months: 360 });
          expect(long.monthlyPayment).toBeLessThanOrEqual(short.monthlyPayment);
          expect(long.monthlyPayment * 360).toBeGreaterThan(short.monthlyPayment * 180);
        },
      ),
    );
  });

  test("loan: zero or negative principal is invalid", () => {
    expect(() => calculateLoanPaymentOracle({ principal: 0, annualRate: 5, months: 12 })).toThrow(
      OracleValidationError,
    );
    expect(() => calculateLoanPaymentOracle({ principal: -1, annualRate: 5, months: 12 })).toThrow(
      OracleValidationError,
    );
  });

  test("loan: absurd term is invalid", () => {
    expect(() => calculateLoanPaymentOracle({ principal: 10_000, annualRate: 5, months: 0 })).toThrow(
      OracleValidationError,
    );
    expect(() =>
      calculateLoanPaymentOracle({ principal: 10_000, annualRate: 5, months: 10_000 }),
    ).toThrow(OracleValidationError);
  });

  test("mortgage: higher principal does not decrease payment", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100_000, max: 600_000, noNaN: true }),
        fc.double({ min: 3, max: 9, noNaN: true }),
        fc.integer({ min: 120, max: 360 }),
        (principal, rate, months) => {
          const base = calculateMortgagePaymentOracle({ principal, annualRate: rate, months });
          const bumped = calculateMortgagePaymentOracle({
            principal: principal * 1.1,
            annualRate: rate,
            months,
          });
          expect(bumped.monthlyPayment).toBeGreaterThanOrEqual(base.monthlyPayment);
        },
      ),
    );
  });

  test("simple interest: monotonic in principal, rate, and time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 50_000, noNaN: true }),
        fc.double({ min: 0.5, max: 20, noNaN: true }),
        fc.double({ min: 0.5, max: 30, noNaN: true }),
        (principal, rate, years) => {
          const base = calculateSimpleInterestOracle({ principal, ratePercent: rate, years });
          const pUp = calculateSimpleInterestOracle({
            principal: principal * 1.1,
            ratePercent: rate,
            years,
          });
          const rUp = calculateSimpleInterestOracle({
            principal,
            ratePercent: rate + 0.5,
            years,
          });
          const tUp = calculateSimpleInterestOracle({
            principal,
            ratePercent: rate,
            years: years + 0.5,
          });
          expect(pUp.interestAmount).toBeGreaterThanOrEqual(base.interestAmount);
          expect(rUp.interestAmount).toBeGreaterThanOrEqual(base.interestAmount);
          expect(tUp.interestAmount).toBeGreaterThanOrEqual(base.interestAmount);
        },
      ),
    );
  });

  test("compound interest: monotonic and zero rate equals principal", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100, max: 20_000, noNaN: true }),
        fc.double({ min: 1, max: 12, noNaN: true }),
        fc.integer({ min: 1, max: 12 }),
        (principal, rate, years) => {
          const base = calculateCompoundInterestOracle({
            principal,
            annualRate: rate,
            years,
            compoundsPerYear: 12,
          });
          const pUp = calculateCompoundInterestOracle({
            principal: principal * 1.1,
            annualRate: rate,
            years,
            compoundsPerYear: 12,
          });
          expect(pUp.futureValue).toBeGreaterThanOrEqual(base.futureValue);
        },
      ),
    );

    const zeroRate = calculateCompoundInterestOracle({
      principal: 2_000,
      annualRate: 0,
      years: 5,
      compoundsPerYear: 4,
    });
    expect(zeroRate.futureValue).toBe(2_000);
  });

  test("profit margin: revenue up with fixed cost improves margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10, max: 500, noNaN: true }),
        fc.double({ min: 1, max: 400, noNaN: true }),
        (price, cost) => {
          fc.pre(price > cost);
          const base = calculateProfitMarginOracle({ sellingPrice: price, cost });
          const bumped = calculateProfitMarginOracle({ sellingPrice: price * 1.1, cost });
          expect(bumped.marginPercent).toBeGreaterThanOrEqual(base.marginPercent);
        },
      ),
    );
  });

  test("profit margin: cost up with fixed revenue lowers margin", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 20, max: 500, noNaN: true }),
        fc.double({ min: 1, max: 400, noNaN: true }),
        (price, cost) => {
          fc.pre(price > cost);
          const base = calculateProfitMarginOracle({ sellingPrice: price, cost });
          const bumped = calculateProfitMarginOracle({ sellingPrice: price, cost: cost * 1.1 });
          expect(bumped.marginPercent).toBeLessThanOrEqual(base.marginPercent);
        },
      ),
    );
  });

  test("profit margin: non-positive revenue is invalid", () => {
    expect(() => calculateProfitMarginOracle({ sellingPrice: 0, cost: 10 })).toThrow(
      OracleValidationError,
    );
  });
});
