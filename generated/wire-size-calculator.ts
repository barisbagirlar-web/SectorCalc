// Auto-generated from wire-size-calculator-schema.json
import * as z from 'zod';

export interface Wire_size_calculatorInput {
  current: number;
  voltage: number;
  length: number;
  material: number;
  voltageDropPercent: number;
  phases: number;
}

export const Wire_size_calculatorInputSchema = z.object({
  current: z.number().default(10),
  voltage: z.number().default(230),
  length: z.number().default(50),
  material: z.number().default(0),
  voltageDropPercent: z.number().default(3),
  phases: z.number().default(1),
});

function evaluateAllFormulas(input: Wire_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.phases == 1 ? 2 : Math.sqrt(3)) * input.length * input.current * (input.material == 0 ? 0.0172 : 0.0282) / (input.voltage * (input.voltageDropPercent / 100)); results["requiredArea"] = Number.isFinite(v) ? v : 0; } catch { results["requiredArea"] = 0; }
  try { const v = (input.phases == 1 ? 2 : Math.sqrt(3)) * input.length * input.current * (input.material == 0 ? 0.0172 : 0.0282) / (results["requiredArea"] ?? 0); results["voltageDrop"] = Number.isFinite(v) ? v : 0; } catch { results["voltageDrop"] = 0; }
  try { const v = input.current * (results["voltageDrop"] ?? 0); results["powerLoss"] = Number.isFinite(v) ? v : 0; } catch { results["powerLoss"] = 0; }
  try { const v = (results["requiredArea"] ?? 0) <= 1.5 ? 1.5 : (results["requiredArea"] ?? 0) <= 2.5 ? 2.5 : (results["requiredArea"] ?? 0) <= 4 ? 4 : (results["requiredArea"] ?? 0) <= 6 ? 6 : (results["requiredArea"] ?? 0) <= 10 ? 10 : (results["requiredArea"] ?? 0) <= 16 ? 16 : (results["requiredArea"] ?? 0) <= 25 ? 25 : (results["requiredArea"] ?? 0) <= 35 ? 35 : (results["requiredArea"] ?? 0) <= 50 ? 50 : (results["requiredArea"] ?? 0) <= 70 ? 70 : (results["requiredArea"] ?? 0) <= 95 ? 95 : (results["requiredArea"] ?? 0) <= 120 ? 120 : (results["requiredArea"] ?? 0) <= 150 ? 150 : (results["requiredArea"] ?? 0) <= 185 ? 185 : (results["requiredArea"] ?? 0) <= 240 ? 240 : (results["requiredArea"] ?? 0) <= 300 ? 300 : (results["requiredArea"] ?? 0) <= 400 ? 400 : 500; results["recommendedSize"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedSize"] = 0; }
  return results;
}


export function calculateWire_size_calculator(input: Wire_size_calculatorInput): Wire_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredArea"] ?? 0;
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


export interface Wire_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
