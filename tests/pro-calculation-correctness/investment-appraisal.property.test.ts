import { describe, it } from "vitest";
import * as fc from "fast-check";
import {
  calculateDiscreteNpvResult,
  evaluateInvestmentAppraisalResult,
  type InvestmentAppraisalInput,
} from "../../src/sectorcalc/formulas/pro-v531/investment-appraisal-core";
import { createDecimalContext } from "../../src/sectorcalc/formulas/pro-v531/pro-decimal-domain";

const money = fc.integer({ min: 1, max: 1_000_000_000 });
const cashFlow = fc.integer({ min: 1, max: 250_000_000 });
const residual = fc.integer({ min: 0, max: 500_000_000 });
const periods = fc.integer({ min: 1, max: 30 });
const rateBasisPoints = fc.integer({ min: 0, max: 10_000 });

function rateFromBasisPoints(value: number): string {
  const context = createDecimalContext();
  return context.DecimalConstructor(String(value)).div("10000").toString();
}

function validInput(
  initialInvestment: number,
  annualCashFlow: number,
  discountRateBasisPoints: number,
  analysisPeriods: number,
  residualValue: number,
): InvestmentAppraisalInput {
  return {
    initialInvestment: String(initialInvestment),
    annualCashFlow: String(annualCashFlow),
    discountRate: rateFromBasisPoints(discountRateBasisPoints),
    periods: String(analysisPeriods),
    residualValue: String(residualValue),
    downsideFactor: "0.2",
    sourceConfidenceRatio: "0.9",
    uncertaintyMultiplier: "2",
  };
}

describe("investment appraisal Decimal properties", () => {
  it("satisfies the zero-rate identity for all generated conventional cash flows", () => {
    fc.assert(
      fc.property(money, cashFlow, periods, residual, (investment, flow, count, terminal) => {
        const result = evaluateInvestmentAppraisalResult(
          validInput(investment, flow, 0, count, terminal),
          { includeIrr: false },
        );
        if (!result.ok) return false;

        const context = createDecimalContext();
        const expected = context.DecimalConstructor(String(investment))
          .neg()
          .plus(
            context.DecimalConstructor(String(flow)).times(String(count)),
          )
          .plus(String(terminal));
        return result.value.netPresentValue.eq(expected);
      }),
      { numRuns: 300, seed: 5317001 },
    );
  });

  it("never values non-negative future cash flows above their undiscounted value", () => {
    fc.assert(
      fc.property(
        money,
        cashFlow,
        rateBasisPoints,
        periods,
        residual,
        (investment, flow, rate, count, terminal) => {
          const discounted = evaluateInvestmentAppraisalResult(
            validInput(investment, flow, rate, count, terminal),
            { includeIrr: false },
          );
          const undiscounted = evaluateInvestmentAppraisalResult(
            validInput(investment, flow, 0, count, terminal),
            { includeIrr: false },
          );
          return (
            discounted.ok &&
            undiscounted.ok &&
            discounted.value.netPresentValue.lte(
              undiscounted.value.netPresentValue,
            )
          );
        },
      ),
      { numRuns: 300, seed: 5317002 },
    );
  });

  it("adds residual value exactly once at the final-period discount factor", () => {
    fc.assert(
      fc.property(
        money,
        cashFlow,
        rateBasisPoints,
        periods,
        residual,
        (investment, flow, rate, count, terminal) => {
          const withResidual = evaluateInvestmentAppraisalResult(
            validInput(investment, flow, rate, count, terminal),
            { includeIrr: false },
          );
          const withoutResidual = evaluateInvestmentAppraisalResult(
            validInput(investment, flow, rate, count, 0),
            { includeIrr: false },
          );
          if (!withResidual.ok || !withoutResidual.ok) return false;

          const context = createDecimalContext();
          const discountBase = context.DecimalConstructor("1").plus(
            rateFromBasisPoints(rate),
          );
          const expectedTerminalPresentValue = context
            .DecimalConstructor(String(terminal))
            .div(discountBase.pow(count));
          return withResidual.value.netPresentValue
            .minus(withoutResidual.value.netPresentValue)
            .eq(expectedTerminalPresentValue);
        },
      ),
      { numRuns: 300, seed: 5317003 },
    );
  }, 15_000);

  it("is scale invariant for monetary amounts and dimensionless metrics", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50_000_000 }),
        fc.integer({ min: 1, max: 10_000_000 }),
        rateBasisPoints,
        fc.integer({ min: 1, max: 15 }),
        fc.integer({ min: 0, max: 10_000_000 }),
        fc.integer({ min: 1, max: 1_000 }),
        (investment, flow, rate, count, terminal, scale) => {
          const context = createDecimalContext();
          const base = evaluateInvestmentAppraisalResult(
            validInput(investment, flow, rate, count, terminal),
            { includeIrr: false },
          );
          const scaled = evaluateInvestmentAppraisalResult({
            ...validInput(investment, flow, rate, count, terminal),
            initialInvestment: context
              .DecimalConstructor(String(investment))
              .times(String(scale))
              .toString(),
            annualCashFlow: context
              .DecimalConstructor(String(flow))
              .times(String(scale))
              .toString(),
            residualValue: context
              .DecimalConstructor(String(terminal))
              .times(String(scale))
              .toString(),
          }, { includeIrr: false });
          const monetaryEnclosure = context
            .DecimalConstructor(String(scale))
            .times(String(count))
            .times("1e-40");
          const ratioEnclosure = context.DecimalConstructor("1e-40");
          return (
            base.ok &&
            scaled.ok &&
            scaled.value.netPresentValue
              .minus(base.value.netPresentValue.times(String(scale)))
              .abs()
              .lte(monetaryEnclosure) &&
            scaled.value.breakEvenAnnualCashFlow
              .minus(
                base.value.breakEvenAnnualCashFlow.times(String(scale)),
              )
              .abs()
              .lte(monetaryEnclosure) &&
            scaled.value.profitabilityIndex
              .minus(base.value.profitabilityIndex)
              .abs()
              .lte(ratioEnclosure)
          );
        },
      ),
      { numRuns: 200, seed: 5317004 },
    );
  });

  it("returns an IRR whose Decimal NPV is enclosed by the certified tolerance", () => {
    fc.assert(
      fc.property(
        money,
        cashFlow,
        fc.integer({ min: 1, max: 20 }),
        residual,
        (investment, flow, count, terminal) => {
          const input = validInput(investment, flow, 1_000, count, terminal);
          const result = evaluateInvestmentAppraisalResult(input);
          if (!result.ok) return false;
          if (result.value.internalRateOfReturn === null) {
            const atCertifiedMaximum = calculateDiscreteNpvResult(
              String(investment),
              String(flow),
              "1000000",
              String(count),
              String(terminal),
            );
            return atCertifiedMaximum.ok && atCertifiedMaximum.value.gt("0");
          }
          const atRoot = calculateDiscreteNpvResult(
            String(investment),
            String(flow),
            result.value.internalRateOfReturn.toString(),
            String(count),
            String(terminal),
          );
          if (!atRoot.ok) return false;

          const context = createDecimalContext();
          const scale = context.DecimalConstructor(String(investment));
          return atRoot.value.abs().lte(scale.times("1e-15"));
        },
      ),
      { numRuns: 40, seed: 5317005 },
    );
  }, 30_000);

  it("is deterministic and idempotent at the exact-decimal boundary", () => {
    fc.assert(
      fc.property(
        money,
        cashFlow,
        rateBasisPoints,
        periods,
        residual,
        (investment, flow, rate, count, terminal) => {
          const input = validInput(investment, flow, rate, count, terminal);
          const first = evaluateInvestmentAppraisalResult(input, {
            includeIrr: false,
          });
          const second = evaluateInvestmentAppraisalResult(input, {
            includeIrr: false,
          });
          return (
            first.ok &&
            second.ok &&
            first.value.netPresentValue.eq(second.value.netPresentValue) &&
            first.value.stressedNetPresentValue.eq(
              second.value.stressedNetPresentValue,
            ) &&
            first.value.lowerBound.eq(second.value.lowerBound) &&
            first.value.upperBound.eq(second.value.upperBound) &&
            first.value.decisionState === second.value.decisionState
          );
        },
      ),
      { numRuns: 300, seed: 5317006 },
    );
  });

  it("fails closed for generated zero, negative, non-finite, fractional, and overflow-like inputs", () => {
    const invalidMutation = fc.constantFrom<
      (input: InvestmentAppraisalInput) => InvestmentAppraisalInput
    >(
      (input) => ({ ...input, initialInvestment: "0" }),
      (input) => ({ ...input, initialInvestment: "-1" }),
      (input) => ({ ...input, discountRate: "-0.0001" }),
      (input) => ({ ...input, discountRate: "1.0001" }),
      (input) => ({ ...input, periods: "2.5" }),
      (input) => ({ ...input, periods: "51" }),
      (input) => ({ ...input, residualValue: "-0.01" }),
      (input) => ({ ...input, downsideFactor: "NaN" }),
      (input) => ({ ...input, sourceConfidenceRatio: "Infinity" }),
      (input) => ({ ...input, uncertaintyMultiplier: "1e1000000" }),
    );

    fc.assert(
      fc.property(
        money,
        cashFlow,
        periods,
        residual,
        invalidMutation,
        (investment, flow, count, terminal, mutate) => {
          const invalid = mutate(
            validInput(investment, flow, 1_000, count, terminal),
          );
          return !evaluateInvestmentAppraisalResult(invalid).ok;
        },
      ),
      { numRuns: 300, seed: 5317007 },
    );
  });
});
