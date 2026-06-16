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

function evaluateAllFormulas(input: Welding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weldLength * input.weldThroat * input.weldThroat * 0.5; results["weldVolume"] = Number.isFinite(v) ? v : 0; } catch { results["weldVolume"] = 0; }
  try { const v = (results["weldVolume"] ?? 0) * input.electrodeDensity / 1000; results["weldMass"] = Number.isFinite(v) ? v : 0; } catch { results["weldMass"] = 0; }
  try { const v = (results["weldMass"] ?? 0) / (input.depositionEfficiency / 100); results["electrodeMass"] = Number.isFinite(v) ? v : 0; } catch { results["electrodeMass"] = 0; }
  try { const v = (results["electrodeMass"] ?? 0) * input.electrodeCostPerKg; results["electrodeCost"] = Number.isFinite(v) ? v : 0; } catch { results["electrodeCost"] = 0; }
  try { const v = input.weldLength / input.weldingSpeed; results["laborTime"] = Number.isFinite(v) ? v : 0; } catch { results["laborTime"] = 0; }
  try { const v = (results["laborTime"] ?? 0) * input.laborCostPerHour / 60; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["electrodeCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateWelding_calculator(input: Welding_calculatorInput): Welding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
