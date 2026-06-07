/**
 * Business & operations oracle property tests (Phase 5C).
 */

import { describe, expect, test } from "vitest";
import * as fc from "fast-check";
import {
  calculateBreakEvenOracle,
  calculateCashFlowGapOracle,
  calculateSalaryCostOracle,
} from "@/lib/formula-governance/oracle/business-oracles";
import {
  calculateCncQuoteRiskOracle,
  calculateMachineTimeOracle,
} from "@/lib/formula-governance/oracle/operations-oracles";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

describe("break-even oracle properties", () => {
  test("fixed cost increase does not decrease break-even units", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 100_000, noNaN: true }),
        fc.double({ min: 50, max: 500, noNaN: true }),
        fc.double({ min: 0, max: 40, noNaN: true }),
        (fixedCost, unitPrice, variableCost) => {
          fc.pre(unitPrice - variableCost > 1);
          const base = calculateBreakEvenOracle({ fixedCost, unitPrice, variableCost });
          const bumped = calculateBreakEvenOracle({ fixedCost: fixedCost * 1.1, unitPrice, variableCost });
          expect(bumped.breakEvenUnits).toBeGreaterThanOrEqual(base.breakEvenUnits);
        },
      ),
    );
  });

  test("margin increase does not increase break-even units", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 50_000, noNaN: true }),
        fc.double({ min: 60, max: 200, noNaN: true }),
        fc.double({ min: 0, max: 50, noNaN: true }),
        (fixedCost, unitPrice, variableCost) => {
          fc.pre(unitPrice - variableCost > 5);
          const base = calculateBreakEvenOracle({ fixedCost, unitPrice, variableCost });
          const wider = calculateBreakEvenOracle({
            fixedCost,
            unitPrice: unitPrice + 10,
            variableCost,
          });
          expect(wider.breakEvenUnits).toBeLessThanOrEqual(base.breakEvenUnits);
        },
      ),
    );
  });

  test("price at or below variable cost is invalid", () => {
    expect(() =>
      calculateBreakEvenOracle({ fixedCost: 10_000, unitPrice: 40, variableCost: 45 }),
    ).toThrow(OracleValidationError);
  });
});

describe("salary cost oracle properties", () => {
  test("gross salary increase does not decrease employer cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 20_000, noNaN: true }),
        fc.double({ min: 0, max: 80, noNaN: true }),
        (grossSalary, employerRatePercent) => {
          const base = calculateSalaryCostOracle({ grossSalary, employerRatePercent });
          const bumped = calculateSalaryCostOracle({ grossSalary: grossSalary * 1.05, employerRatePercent });
          expect(bumped.totalEmployerCost).toBeGreaterThanOrEqual(base.totalEmployerCost);
        },
      ),
    );
  });

  test("employer rate increase does not decrease total cost", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000, max: 15_000, noNaN: true }),
        fc.double({ min: 0, max: 50, noNaN: true }),
        (grossSalary, employerRatePercent) => {
          fc.pre(employerRatePercent < 150);
          const base = calculateSalaryCostOracle({ grossSalary, employerRatePercent });
          const bumped = calculateSalaryCostOracle({ grossSalary, employerRatePercent: employerRatePercent + 5 });
          expect(bumped.totalEmployerCost).toBeGreaterThanOrEqual(base.totalEmployerCost);
        },
      ),
    );
  });

  test("negative salary is invalid", () => {
    expect(() => calculateSalaryCostOracle({ grossSalary: -500, employerRatePercent: 20 })).toThrow(
      OracleValidationError,
    );
  });
});

describe("cash-flow gap oracle properties", () => {
  test("receivables increase does not decrease working capital gap", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 10, max: 90, noNaN: true }),
        fc.double({ min: 0, max: 60, noNaN: true }),
        fc.double({ min: 100, max: 5000, noNaN: true }),
        (receivablesDays, payableDays, dailyCost) => {
          const base = calculateCashFlowGapOracle({ receivablesDays, payableDays, dailyCost });
          const bumped = calculateCashFlowGapOracle({
            receivablesDays: receivablesDays + 5,
            payableDays,
            dailyCost,
          });
          expect(bumped.workingCapitalGap).toBeGreaterThanOrEqual(base.workingCapitalGap);
        },
      ),
    );
  });

  test("payables increase does not increase working capital gap", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 20, max: 90, noNaN: true }),
        fc.double({ min: 0, max: 40, noNaN: true }),
        fc.double({ min: 100, max: 5000, noNaN: true }),
        (receivablesDays, payableDays, dailyCost) => {
          fc.pre(payableDays + 5 <= receivablesDays + 30);
          const base = calculateCashFlowGapOracle({ receivablesDays, payableDays, dailyCost });
          const bumped = calculateCashFlowGapOracle({
            receivablesDays,
            payableDays: payableDays + 5,
            dailyCost,
          });
          expect(bumped.workingCapitalGap).toBeLessThanOrEqual(base.workingCapitalGap);
        },
      ),
    );
  });

  test("daily cost increase does not decrease gap amount", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 30, max: 60, noNaN: true }),
        fc.double({ min: 10, max: 30, noNaN: true }),
        fc.double({ min: 200, max: 3000, noNaN: true }),
        (receivablesDays, payableDays, dailyCost) => {
          fc.pre(receivablesDays > payableDays);
          const base = calculateCashFlowGapOracle({ receivablesDays, payableDays, dailyCost });
          const bumped = calculateCashFlowGapOracle({
            receivablesDays,
            payableDays,
            dailyCost: dailyCost * 1.1,
          });
          expect(bumped.workingCapitalGap).toBeGreaterThanOrEqual(base.workingCapitalGap);
        },
      ),
    );
  });
});

describe("machine time oracle properties", () => {
  test("quantity increase does not decrease total time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 120, noNaN: true }),
        fc.double({ min: 5, max: 120, noNaN: true }),
        fc.double({ min: 1, max: 500, noNaN: true }),
        fc.double({ min: 40, max: 150, noNaN: true }),
        (setupMinutes, cycleSeconds, quantity, machineRate) => {
          fc.pre(quantity < 400);
          const base = calculateMachineTimeOracle({ setupMinutes, cycleSeconds, quantity, machineRate });
          const bumped = calculateMachineTimeOracle({
            setupMinutes,
            cycleSeconds,
            quantity: quantity + 1,
            machineRate,
          });
          expect(bumped.totalMinutes).toBeGreaterThanOrEqual(base.totalMinutes);
        },
      ),
    );
  });

  test("cycle time increase does not decrease total time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 90, noNaN: true }),
        fc.double({ min: 5, max: 90, noNaN: true }),
        fc.double({ min: 1, max: 200, noNaN: true }),
        fc.double({ min: 40, max: 150, noNaN: true }),
        (setupMinutes, cycleSeconds, quantity, machineRate) => {
          const base = calculateMachineTimeOracle({ setupMinutes, cycleSeconds, quantity, machineRate });
          const bumped = calculateMachineTimeOracle({
            setupMinutes,
            cycleSeconds: cycleSeconds + 5,
            quantity,
            machineRate,
          });
          expect(bumped.totalMinutes).toBeGreaterThanOrEqual(base.totalMinutes);
        },
      ),
    );
  });

  test("setup time increase does not decrease total time", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 90, noNaN: true }),
        fc.double({ min: 5, max: 90, noNaN: true }),
        fc.double({ min: 1, max: 200, noNaN: true }),
        fc.double({ min: 40, max: 150, noNaN: true }),
        (setupMinutes, cycleSeconds, quantity, machineRate) => {
          const base = calculateMachineTimeOracle({ setupMinutes, cycleSeconds, quantity, machineRate });
          const bumped = calculateMachineTimeOracle({
            setupMinutes: setupMinutes + 10,
            cycleSeconds,
            quantity,
            machineRate,
          });
          expect(bumped.totalMinutes).toBeGreaterThanOrEqual(base.totalMinutes);
        },
      ),
    );
  });

  test("negative quantity is invalid", () => {
    expect(() =>
      calculateMachineTimeOracle({ setupMinutes: 30, cycleSeconds: 45, quantity: -1, machineRate: 85 }),
    ).toThrow(OracleValidationError);
  });
});

describe("CNC quote risk oracle properties", () => {
  const baseInput = {
    setupTime: 90,
    cycleTime: 2.5,
    quantity: 50,
    toolCost: 400,
    materialCost: 800,
    machineRate: 95,
  };

  test("material cost increase does not decrease base cost", () => {
    const base = calculateCncQuoteRiskOracle(baseInput);
    const bumped = calculateCncQuoteRiskOracle({ ...baseInput, materialCost: 1200 });
    expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
  });

  test("machine rate increase does not decrease base cost", () => {
    const base = calculateCncQuoteRiskOracle(baseInput);
    const bumped = calculateCncQuoteRiskOracle({ ...baseInput, machineRate: 120 });
    expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
  });

  test("scrap rate increase does not decrease base cost", () => {
    const base = calculateCncQuoteRiskOracle({ ...baseInput, scrapRatePercent: 5 });
    const bumped = calculateCncQuoteRiskOracle({ ...baseInput, scrapRatePercent: 12 });
    expect(bumped.baseCost).toBeGreaterThanOrEqual(base.baseCost);
  });

  test("negative material cost is invalid", () => {
    expect(() => calculateCncQuoteRiskOracle({ ...baseInput, materialCost: -100 })).toThrow(
      OracleValidationError,
    );
  });
});
