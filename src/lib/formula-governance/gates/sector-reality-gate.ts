/**
 * Sector Reality Gate
 * 
 * Hesaplama sonuçlarının sektörel gerçekliğe uygun olup olmadığını kontrol eder.
 * Her sektör için specific sanity rules.
 */

import type { CalculationResult, SanityCheckResult } from "./global-sanity-gate";

export interface SectorRealityRule {
  id: string;
  sectors: string[]; // Which sectors this rule applies to
  description: string;
  check: (result: CalculationResult, toolSlug: string) => SanityCheckResult;
}

// ============================================================================
// SECTOR REALITY RULES
// ============================================================================

export const SECTOR_REALITY_RULES: SectorRealityRule[] = [
  // CNC / Manufacturing Rules
  {
    id: "cnc-machine-rate-realistic",
    sectors: ["cnc", "manufacturing", "machining"],
    description: "CNC machine hourly rate should be within realistic range ($50-$300/hr)",
    check: (result) => {
      const machineRate = result.machineRate || result.machineHourlyCost;
      if (typeof machineRate === "number") {
        if (machineRate < 30) {
          return {
            passed: false,
            reason: `Machine rate $${machineRate}/hr is unrealistically low (typical: $50-$300/hr)`,
            severity: "warning",
          };
        }
        if (machineRate > 500) {
          return {
            passed: false,
            reason: `Machine rate $${machineRate}/hr is unrealistically high (typical: $50-$300/hr)`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  {
    id: "cnc-scrap-rate-realistic",
    sectors: ["cnc", "manufacturing"],
    description: "Scrap rate should be within realistic range (0%-15% typical)",
    check: (result) => {
      const scrapRate = result.scrapRate || result.defectRate;
      if (typeof scrapRate === "number") {
        if (scrapRate > 30) {
          return {
            passed: false,
            reason: `Scrap rate ${scrapRate}% is extremely high (typical: 0%-15%)`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  {
    id: "cnc-setup-time-realistic",
    sectors: ["cnc", "manufacturing"],
    description: "Setup time should be realistic (typically 5min-4hrs)",
    check: (result) => {
      const setupTime = result.setupTime || result.setupMinutes;
      if (typeof setupTime === "number") {
        if (setupTime > 480) {
          // 8 hours
          return {
            passed: false,
            reason: `Setup time ${setupTime} minutes (${(setupTime / 60).toFixed(1)}hrs) is extremely long`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  // Logistics Rules
  {
    id: "logistics-speed-realistic",
    sectors: ["logistics", "transport", "delivery"],
    description: "Vehicle speed should be realistic (0-120 km/h typical)",
    check: (result) => {
      const speed = result.speed || result.averageSpeed || result.vehicleSpeed;
      if (typeof speed === "number") {
        if (speed > 150) {
          return {
            passed: false,
            reason: `Vehicle speed ${speed} km/h is unrealistically high`,
            severity: "error",
          };
        }
        if (speed < 5 && speed > 0) {
          return {
            passed: false,
            reason: `Vehicle speed ${speed} km/h is unrealistically low`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  {
    id: "logistics-fuel-consumption-realistic",
    sectors: ["logistics", "transport"],
    description: "Fuel consumption should be realistic (5-50 L/100km typical)",
    check: (result) => {
      const fuelConsumption = result.fuelConsumption || result.fuelPer100km;
      if (typeof fuelConsumption === "number") {
        if (fuelConsumption > 80) {
          return {
            passed: false,
            reason: `Fuel consumption ${fuelConsumption} L/100km is extremely high`,
            severity: "warning",
          };
        }
        if (fuelConsumption < 2 && fuelConsumption > 0) {
          return {
            passed: false,
            reason: `Fuel consumption ${fuelConsumption} L/100km is unrealistically low`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  // Restaurant / Food Rules
  {
    id: "food-cost-percentage-realistic",
    sectors: ["restaurant", "food", "catering"],
    description: "Food cost percentage should be realistic (20%-40% typical)",
    check: (result) => {
      const foodCostPercent = result.foodCostPercentage || result.ingredientCostPercent;
      if (typeof foodCostPercent === "number") {
        if (foodCostPercent > 60) {
          return {
            passed: false,
            reason: `Food cost ${foodCostPercent}% is very high (typical: 20%-40%)`,
            severity: "warning",
          };
        }
        if (foodCostPercent < 10 && foodCostPercent > 0) {
          return {
            passed: false,
            reason: `Food cost ${foodCostPercent}% is unrealistically low`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  {
    id: "food-waste-percentage-realistic",
    sectors: ["restaurant", "food"],
    description: "Food waste percentage should be realistic (0%-15% typical)",
    check: (result) => {
      const wastePercent = result.wastePercentage || result.foodWastePercent;
      if (typeof wastePercent === "number") {
        if (wastePercent > 30) {
          return {
            passed: false,
            reason: `Food waste ${wastePercent}% is extremely high`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  // Energy Rules
  {
    id: "energy-power-factor-realistic",
    sectors: ["energy", "electrical"],
    description: "Power factor should be between 0 and 1",
    check: (result) => {
      const powerFactor = result.powerFactor;
      if (typeof powerFactor === "number") {
        if (powerFactor < 0 || powerFactor > 1) {
          return {
            passed: false,
            reason: `Power factor ${powerFactor} is outside valid range (0-1)`,
            severity: "error",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  {
    id: "energy-kwh-cost-realistic",
    sectors: ["energy", "electricity"],
    description: "kWh cost should be realistic ($0.05-$0.50 typical)",
    check: (result) => {
      const kwhCost = result.kwhCost || result.electricityRate || result.energyPrice;
      if (typeof kwhCost === "number") {
        if (kwhCost > 1.0) {
          return {
            passed: false,
            reason: `kWh cost $${kwhCost} is extremely high (typical: $0.05-$0.50)`,
            severity: "warning",
          };
        }
        if (kwhCost < 0.01 && kwhCost > 0) {
          return {
            passed: false,
            reason: `kWh cost $${kwhCost} is unrealistically low`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  // Labor / HR Rules
  {
    id: "labor-hourly-rate-realistic",
    sectors: ["labor", "hr", "payroll"],
    description: "Hourly labor rate should be realistic ($10-$150 typical)",
    check: (result) => {
      const hourlyRate = result.hourlyRate || result.laborRate || result.wageRate;
      if (typeof hourlyRate === "number") {
        if (hourlyRate < 5) {
          return {
            passed: false,
            reason: `Hourly rate $${hourlyRate} is below minimum wage in most regions`,
            severity: "warning",
          };
        }
        if (hourlyRate > 300) {
          return {
            passed: false,
            reason: `Hourly rate $${hourlyRate} is extremely high`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },

  // Construction Rules
  {
    id: "construction-area-realistic",
    sectors: ["construction", "building"],
    description: "Construction area should be realistic (>0 sq ft/m²)",
    check: (result) => {
      const area = result.area || result.squareFeet || result.squareMeters;
      if (typeof area === "number") {
        if (area > 1000000) {
          // 1M sq ft
          return {
            passed: false,
            reason: `Area ${area.toLocaleString()} is extremely large - verify input`,
            severity: "warning",
          };
        }
      }
      return { passed: true, severity: "info" };
    },
  },
];

// ============================================================================
// SECTOR DETECTION
// ============================================================================

function detectSector(toolSlug: string): string[] {
  const slug = toolSlug.toLowerCase();
  const sectors: string[] = [];

  // CNC / Manufacturing
  if (slug.includes("cnc") || slug.includes("machine") || slug.includes("scrap")) {
    sectors.push("cnc", "manufacturing");
  }

  // Logistics
  if (slug.includes("route") || slug.includes("transport") || slug.includes("delivery") || slug.includes("fuel")) {
    sectors.push("logistics", "transport");
  }

  // Restaurant / Food
  if (slug.includes("food") || slug.includes("restaurant") || slug.includes("catering") || slug.includes("portion")) {
    sectors.push("restaurant", "food");
  }

  // Energy
  if (slug.includes("energy") || slug.includes("kwh") || slug.includes("power") || slug.includes("electric")) {
    sectors.push("energy", "electricity");
  }

  // Labor / HR
  if (slug.includes("labor") || slug.includes("payroll") || slug.includes("employee") || slug.includes("wage")) {
    sectors.push("labor", "hr");
  }

  // Construction
  if (slug.includes("construct") || slug.includes("building") || slug.includes("area") || slug.includes("square")) {
    sectors.push("construction", "building");
  }

  return sectors;
}

// ============================================================================
// GATE RUNNER
// ============================================================================

export interface SectorRealityGateResult {
  passed: boolean;
  detectedSectors: string[];
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

export function runSectorRealityChecks(
  result: CalculationResult,
  toolSlug: string
): SectorRealityGateResult {
  const detectedSectors = detectSector(toolSlug);
  const failedRules: SectorRealityGateResult["failedRules"] = [];
  const warningRules: SectorRealityGateResult["warningRules"] = [];

  // Run rules that apply to detected sectors
  for (const rule of SECTOR_REALITY_RULES) {
    const appliesToThisTool = rule.sectors.some((s) => detectedSectors.includes(s));
    if (!appliesToThisTool) {
      continue;
    }

    const checkResult = rule.check(result, toolSlug);

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
    detectedSectors,
    failedRules,
    warningRules,
  };
}
