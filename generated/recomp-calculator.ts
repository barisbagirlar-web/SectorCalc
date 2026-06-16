// Auto-generated from recomp-calculator-schema.json
import * as z from 'zod';

export interface Recomp_calculatorInput {
  initialPressure: number;
  finalPressure: number;
  flowRate: number;
  efficiency: number;
  adiabaticIndex: number;
  electricityCost: number;
}

export const Recomp_calculatorInputSchema = z.object({
  initialPressure: z.number().default(1),
  finalPressure: z.number().default(10),
  flowRate: z.number().default(1000),
  efficiency: z.number().default(75),
  adiabaticIndex: z.number().default(1.4),
  electricityCost: z.number().default(0.1),
});

function evaluateAllFormulas(input: Recomp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.adiabaticIndex / (input.adiabaticIndex - 1)) * (input.initialPressure * 100) * (input.flowRate / 3600) * (Math.pow(input.finalPressure / input.initialPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / (input.efficiency / 100); results["powerKW"] = Number.isFinite(v) ? v : 0; } catch { results["powerKW"] = 0; }
  try { const v = ((input.adiabaticIndex / (input.adiabaticIndex - 1)) * (input.initialPressure * 100) * (input.flowRate / 3600) * (Math.pow(input.finalPressure / input.initialPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / (input.efficiency / 100); results["energyKWhPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["energyKWhPerHour"] = 0; }
  try { const v = (((input.adiabaticIndex / (input.adiabaticIndex - 1)) * (input.initialPressure * 100) * (input.flowRate / 3600) * (Math.pow(input.finalPressure / input.initialPressure, (input.adiabaticIndex - 1) / input.adiabaticIndex) - 1)) / (input.efficiency / 100)) * input.electricityCost; results["costPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["costPerHour"] = 0; }
  return results;
}


export function calculateRecomp_calculator(input: Recomp_calculatorInput): Recomp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["powerKW"] ?? 0;
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


export interface Recomp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
