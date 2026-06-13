import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";
import {
  calculateHomeRenovationM2Check,
  calculateKwhConsumptionCheck,
  calculatePaintCoverageCostCheck,
  calculatePlumbingFixtureCostCheck,
} from "@/lib/tools/p77-batch-b-free-calculators";

type ScenarioHandler = () => void;

const KWH_GOLDEN = {
  powerKw: 10,
  hoursPerDay: 8,
  days: 30,
  tariffPerKwh: 0.15,
};

const PAINT_GOLDEN = {
  paintableArea: 100,
  coveragePerUnit: 10,
  coats: 2,
  unitPrice: 25,
  wasteAllowancePct: 10,
};

const PLUMBING_GOLDEN = {
  fixtureCount: 3,
  unitMaterialCost: 200,
  laborHoursPerFixture: 2,
  laborRate: 75,
  overheadPct: 15,
};

const RENOVATION_GOLDEN = {
  areaM2: 80,
  unitCostPerM2: 500,
  demolitionCost: 2000,
  contingencyPct: 10,
};

export const KWH_CONSUMPTION_SCENARIOS: Record<string, ScenarioHandler> = {
  "golden-valid": () => {
    const result = calculateKwhConsumptionCheck(KWH_GOLDEN);
    if (result.periodKwh !== 2400 || result.energyCost !== 360) {
      throw new Error(`Expected 2400 kWh and $360, got ${result.periodKwh} / ${result.energyCost}.`);
    }
  },
  "missing-input": () => {
    try {
      calculateKwhConsumptionCheck({ ...KWH_GOLDEN, days: "" });
      throw new Error("Expected validation error for missing days.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "invalid-negative": () => {
    try {
      calculateKwhConsumptionCheck({ ...KWH_GOLDEN, powerKw: -1 });
      throw new Error("Expected validation error for negative power.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "boundary-min": () => {
    const result = calculateKwhConsumptionCheck({ ...KWH_GOLDEN, hoursPerDay: 0 });
    if (result.periodKwh !== 0) {
      throw new Error("Zero hours/day should yield zero period kWh.");
    }
  },
  "zero-divisor": () => {
    try {
      calculateKwhConsumptionCheck({ ...KWH_GOLDEN, days: 0 });
      throw new Error("Expected validation error for zero days.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

export const PAINT_COVERAGE_SCENARIOS: Record<string, ScenarioHandler> = {
  "golden-valid": () => {
    const result = calculatePaintCoverageCostCheck(PAINT_GOLDEN);
    if (result.requiredUnits !== 22 || result.paintCost !== 550) {
      throw new Error(`Expected 22 units and $550, got ${result.requiredUnits} / ${result.paintCost}.`);
    }
  },
  "missing-input": () => {
    try {
      calculatePaintCoverageCostCheck({ ...PAINT_GOLDEN, coats: "" });
      throw new Error("Expected validation error for missing coats.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "invalid-negative": () => {
    try {
      calculatePaintCoverageCostCheck({ ...PAINT_GOLDEN, unitPrice: -5 });
      throw new Error("Expected validation error for negative unit price.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "boundary-min": () => {
    const result = calculatePaintCoverageCostCheck({ ...PAINT_GOLDEN, wasteAllowancePct: 0 });
    if (result.requiredUnits < 20) {
      throw new Error("Expected at least 20 units without waste.");
    }
  },
  "zero-divisor": () => {
    try {
      calculatePaintCoverageCostCheck({ ...PAINT_GOLDEN, coveragePerUnit: 0 });
      throw new Error("Expected validation error for zero coverage.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

export const PLUMBING_FIXTURE_SCENARIOS: Record<string, ScenarioHandler> = {
  "golden-valid": () => {
    const result = calculatePlumbingFixtureCostCheck(PLUMBING_GOLDEN);
    if (result.totalCost !== 1207.5) {
      throw new Error(`Expected total $1207.5, got ${result.totalCost}.`);
    }
  },
  "missing-input": () => {
    try {
      calculatePlumbingFixtureCostCheck({ ...PLUMBING_GOLDEN, fixtureCount: "" });
      throw new Error("Expected validation error for missing fixture count.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "invalid-negative": () => {
    try {
      calculatePlumbingFixtureCostCheck({ ...PLUMBING_GOLDEN, laborRate: -1 });
      throw new Error("Expected validation error for negative labor rate.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "boundary-min": () => {
    const result = calculatePlumbingFixtureCostCheck({ ...PLUMBING_GOLDEN, overheadPct: 0 });
    if (result.totalCost !== 1050) {
      throw new Error(`Expected $1050 without overhead, got ${result.totalCost}.`);
    }
  },
  "zero-divisor": () => {
    try {
      calculatePlumbingFixtureCostCheck({ ...PLUMBING_GOLDEN, fixtureCount: 0 });
      throw new Error("Expected validation error for zero fixtures.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

export const HOME_RENOVATION_M2_SCENARIOS: Record<string, ScenarioHandler> = {
  "golden-valid": () => {
    const result = calculateHomeRenovationM2Check(RENOVATION_GOLDEN);
    if (result.totalEstimatedCost !== 46200) {
      throw new Error(`Expected $46200 total, got ${result.totalEstimatedCost}.`);
    }
  },
  "missing-input": () => {
    try {
      calculateHomeRenovationM2Check({ ...RENOVATION_GOLDEN, areaM2: "" });
      throw new Error("Expected validation error for missing area.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "invalid-negative": () => {
    try {
      calculateHomeRenovationM2Check({ ...RENOVATION_GOLDEN, unitCostPerM2: -100 });
      throw new Error("Expected validation error for negative unit cost.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
  "boundary-min": () => {
    const result = calculateHomeRenovationM2Check({ ...RENOVATION_GOLDEN, contingencyPct: 0 });
    if (result.totalEstimatedCost !== 42000) {
      throw new Error(`Expected $42000 without contingency, got ${result.totalEstimatedCost}.`);
    }
  },
  "zero-divisor": () => {
    try {
      calculateHomeRenovationM2Check({ ...RENOVATION_GOLDEN, areaM2: 0 });
      throw new Error("Expected validation error for zero area.");
    } catch (error) {
      if (!(error instanceof OracleValidationError)) {
        throw error;
      }
    }
  },
};

export const P77_BATCH_B_SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> = {
  "kwh-consumption-check": KWH_CONSUMPTION_SCENARIOS,
  "paint-coverage-cost-check": PAINT_COVERAGE_SCENARIOS,
  "plumbing-fixture-cost-check": PLUMBING_FIXTURE_SCENARIOS,
  "home-renovation-m2": HOME_RENOVATION_M2_SCENARIOS,
};
