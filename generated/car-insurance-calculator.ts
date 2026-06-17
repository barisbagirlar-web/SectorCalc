// @ts-nocheck
// Auto-generated from car-insurance-calculator-schema.json
import * as z from 'zod';

export interface Car_insurance_calculatorInput {
  carValue: number;
  driverAge: number;
  drivingExperience: number;
  noClaimsYears: number;
  annualMileage: number;
  coverageLevel: number;
  regionRisk: number;
  vehicleAge: number;
}

export const Car_insurance_calculatorInputSchema = z.object({
  carValue: z.number().default(20000),
  driverAge: z.number().default(35),
  drivingExperience: z.number().default(10),
  noClaimsYears: z.number().default(5),
  annualMileage: z.number().default(15000),
  coverageLevel: z.number().default(3),
  regionRisk: z.number().default(5),
  vehicleAge: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Car_insurance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.carValue * 0.03; results["basePremium"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = input.driverAge < 25 ? 1.8 : (input.driverAge <= 60 ? 1.0 : 1.3); results["ageFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = input.drivingExperience < 2 ? 2.0 : (input.drivingExperience <= 5 ? 1.5 : 1.0); results["experienceFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["experienceFactor"] = 0; }
  try { const v = input.annualMileage <= 10000 ? 0.9 : (input.annualMileage <= 20000 ? 1.0 : 1.2); results["mileageFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mileageFactor"] = 0; }
  try { const v = input.coverageLevel === 1 ? 0.7 : (input.coverageLevel === 2 ? 0.85 : 1.0); results["coverageFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["coverageFactor"] = 0; }
  try { const v = 1 + (input.regionRisk - 5) * 0.02; results["regionFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["regionFactor"] = 0; }
  try { const v = input.vehicleAge <= 5 ? 1.0 : (input.vehicleAge <= 10 ? 0.95 : 1.1); results["vehicleAgeFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vehicleAgeFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCar_insurance_calculator(input: Car_insurance_calculatorInput): Car_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vehicleAgeFactor"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Car_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
