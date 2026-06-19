// Auto-generated from welding-calculator-schema.json
import * as z from 'zod';

export interface Welding_calculatorInput {
  weldLength: number;
  weldThroat: number;
  electrodeDiameter: number;
  depositionEfficiency: number;
  electrodeDensity: number;
  laborCostPerHour: number;
  electrodeCostPerKg: number;
  weldingSpeed: number;
  dataConfidence?: number;
}

export const Welding_calculatorInputSchema = z.object({
  weldLength: z.number().default(100),
  weldThroat: z.number().default(5),
  electrodeDiameter: z.number().default(3.2),
  depositionEfficiency: z.number().default(65),
  electrodeDensity: z.number().default(7.85),
  laborCostPerHour: z.number().default(45),
  electrodeCostPerKg: z.number().default(3.5),
  weldingSpeed: z.number().default(300),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Welding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weldLength * input.weldThroat * input.weldThroat * 0.5; results["weldVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weldVolume"] = 0; }
  try { const v = (asFormulaNumber(results["weldVolume"])) * input.electrodeDensity / 1000; results["weldMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weldMass"] = 0; }
  try { const v = (asFormulaNumber(results["weldMass"])) / (input.depositionEfficiency / 100); results["electrodeMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electrodeMass"] = 0; }
  try { const v = (asFormulaNumber(results["electrodeMass"])) * input.electrodeCostPerKg; results["electrodeCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electrodeCost"] = 0; }
  try { const v = input.weldLength / input.weldingSpeed; results["laborTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborTime"] = 0; }
  try { const v = (asFormulaNumber(results["laborTime"])) * input.laborCostPerHour / 60; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["electrodeCost"])) + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWelding_calculator(input: Welding_calculatorInput): Welding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Welding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
