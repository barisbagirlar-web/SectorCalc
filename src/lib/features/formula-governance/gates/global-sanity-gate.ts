/**
 * Global Sanity Gate
 *
 * Checks whether calculation results are globally reasonable.
 * Negative values, over-100% rates, physical impossibilities etc.
 */

export interface GlobalSanityRule {
  id: string;
  description: string;
  check: (result: CalculationResult) => SanityCheckResult;
  autoFix?: (result: CalculationResult) => CalculationResult | null;
}

export interface CalculationResult {
  [key: string]: number | string | boolean | null | undefined;
}

export interface SanityCheckResult {
  passed: boolean;
  reason?: string;
  severity: "error" | "warning" | "info";
}

// ============================================================================
// GLOBAL SANITY RULES
// ============================================================================

export const GLOBAL_SANITY_RULES: GlobalSanityRule[] = [
  // Rule 1: No negative costs/prices
  {
    id: "no-negative-cost",
    description: "Costs and prices cannot be negative",
    check: (result) => {
      const costFields = [
        "cost",
        "price",
        "totalCost",
        "unitCost",
        "laborCost",
        "materialCost",
        "overhead",
        "safePrice",
        "bidPrice",
      ];

      for (const field of costFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Field "${field}" has negative value: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 2: Percentages must be 0-100% (or controlled)
  {
    id: "percentage-range",
    description: "Percentages must be between 0% and 100% (unless explicitly allowed)",
    check: (result) => {
      const percentageFields = [
        "efficiency",
        "scrapRate",
        "wastePercentage",
        "marginPercentage",
        "discountPercentage",
      ];

      for (const field of percentageFields) {
        const value = result[field];
        if (typeof value === "number") {
          if (value < 0) {
            return {
              passed: false,
              reason: `Percentage field "${field}" is negative: ${value}%`,
              severity: "error",
            };
          }
          if (value > 100) {
            return {
              passed: false,
              reason: `Percentage field "${field}" exceeds 100%: ${value}%`,
              severity: "warning", // Warning because some contexts allow >100%
            };
          }
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 3: OEE cannot exceed 100%
  {
    id: "oee-max-100",
    description: "OEE (Overall Equipment Effectiveness) cannot exceed 100%",
    check: (result) => {
      const oeeFields = ["oee", "OEE", "overallEquipmentEffectiveness"];

      for (const field of oeeFields) {
        const value = result[field];
        if (typeof value === "number") {
          if (value < 0) {
            return {
              passed: false,
              reason: `OEE "${field}" is negative: ${value}%`,
              severity: "error",
            };
          }
          if (value > 100) {
            return {
              passed: false,
              reason: `OEE "${field}" exceeds 100%: ${value}% (physically impossible)`,
              severity: "error",
            };
          }
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 4: Carbon/emissions cannot be negative
  {
    id: "no-negative-carbon",
    description: "Carbon emissions and environmental metrics cannot be negative",
    check: (result) => {
      const carbonFields = [
        "carbonEmissions",
        "co2Emissions",
        "carbonFootprint",
        "emissions",
        "environmentalImpact",
      ];

      for (const field of carbonFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Carbon/emissions field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 5: Break-even point cannot be negative
  {
    id: "no-negative-breakeven",
    description: "Break-even point cannot be negative",
    check: (result) => {
      const breakEvenFields = ["breakEvenPoint", "breakEvenUnits", "breakEvenDays"];

      for (const field of breakEvenFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Break-even field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 6: Time values must be non-negative
  {
    id: "no-negative-time",
    description: "Time durations cannot be negative",
    check: (result) => {
      const timeFields = [
        "time",
        "duration",
        "setupTime",
        "cycleTime",
        "leadTime",
        "processingTime",
        "totalTime",
      ];

      for (const field of timeFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Time field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 7: Distance cannot be negative
  {
    id: "no-negative-distance",
    description: "Distance values cannot be negative",
    check: (result) => {
      const distanceFields = ["distance", "totalDistance", "routeDistance"];

      for (const field of distanceFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Distance field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 8: Energy consumption cannot be negative
  {
    id: "no-negative-energy",
    description: "Energy consumption cannot be negative",
    check: (result) => {
      const energyFields = [
        "energy",
        "energyConsumption",
        "power",
        "kwh",
        "kWh",
        "electricityCost",
      ];

      for (const field of energyFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Energy field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 9: Employer cost must be >= net salary
  {
    id: "employer-cost-vs-net-salary",
    description: "Total employer cost must be greater than or equal to net salary",
    check: (result) => {
      const employerCost = result.employerCost || result.totalLaborCost;
      const netSalary = result.netSalary || result.takeHomePay;

      if (
        typeof employerCost === "number" &&
        typeof netSalary === "number" &&
        employerCost < netSalary
      ) {
        return {
          passed: false,
          reason: `Employer cost (${employerCost}) is less than net salary (${netSalary}) - impossible`,
          severity: "error",
        };
      }

      return { passed: true, severity: "info" };
    },
  },

  // Rule 10: Material weight/volume cannot be negative
  {
    id: "no-negative-material",
    description: "Material weight, volume, or quantity cannot be negative",
    check: (result) => {
      const materialFields = [
        "weight",
        "volume",
        "quantity",
        "amount",
        "materialWeight",
        "totalWeight",
      ];

      for (const field of materialFields) {
        const value = result[field];
        if (typeof value === "number" && value < 0) {
          return {
            passed: false,
            reason: `Material field "${field}" is negative: ${value}`,
            severity: "error",
          };
        }
      }

      return { passed: true, severity: "info" };
    },
  },
];

// ============================================================================
// GATE RUNNER
// ============================================================================

export interface GlobalSanityGateResult {
  passed: boolean;
  failedRules: Array<{
    rule: string;
    reason: string;
    severity: "error" | "warning" | "info";
  }>;
  warningRules: Array<{
    rule: string;
    reason: string;
  }>;
}

export function runGlobalSanityChecks(
  result: CalculationResult
): GlobalSanityGateResult {
  const failedRules: GlobalSanityGateResult["failedRules"] = [];
  const warningRules: GlobalSanityGateResult["warningRules"] = [];

  for (const rule of GLOBAL_SANITY_RULES) {
    const checkResult = rule.check(result);

    if (!checkResult.passed) {
      if (checkResult.severity === "error") {
        failedRules.push({
          rule: rule.id,
          reason: checkResult.reason || "Unknown failure",
          severity: checkResult.severity,
        });
      } else if (checkResult.severity === "warning") {
        warningRules.push({
          rule: rule.id,
          reason: checkResult.reason || "Unknown warning",
        });
      }
    }
  }

  return {
    passed: failedRules.length === 0,
    failedRules,
    warningRules,
  };
}
