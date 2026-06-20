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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Welding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weldLength * input.weldThroat * input.weldThroat * 0.5; results["weldVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weldVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weldVolume"])) * input.electrodeDensity / 1000; results["weldMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weldMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weldMass"])) / (input.depositionEfficiency / 100); results["electrodeMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electrodeMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["electrodeMass"])) * input.electrodeCostPerKg; results["electrodeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electrodeCost"] = Number.NaN; }
  try { const v = input.weldLength / input.weldingSpeed; results["laborTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["laborTime"])) * input.laborCostPerHour / 60; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["electrodeCost"])) + (toNumericFormulaValue(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateWelding_calculator(input: Welding_calculatorInput): Welding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
