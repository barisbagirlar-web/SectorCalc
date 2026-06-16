// Auto-generated from embroidery-calculator-schema.json
import * as z from 'zod';

export interface Embroidery_calculatorInput {
  designWidth: number;
  designHeight: number;
  stitchDensity: number;
  threadFactor: number;
  threadCostPerMeter: number;
  machineEfficiency: number;
  laborHourlyRate: number;
}

export const Embroidery_calculatorInputSchema = z.object({
  designWidth: z.number().default(10),
  designHeight: z.number().default(10),
  stitchDensity: z.number().default(50),
  threadFactor: z.number().default(30),
  threadCostPerMeter: z.number().default(0.05),
  machineEfficiency: z.number().default(600),
  laborHourlyRate: z.number().default(15),
});

function evaluateAllFormulas(input: Embroidery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designWidth * input.designHeight * input.stitchDensity; results["stitchCount"] = Number.isFinite(v) ? v : 0; } catch { results["stitchCount"] = 0; }
  try { const v = (results["stitchCount"] ?? 0) * input.threadFactor / 1000; results["threadLength"] = Number.isFinite(v) ? v : 0; } catch { results["threadLength"] = 0; }
  try { const v = (results["threadLength"] ?? 0) * input.threadCostPerMeter; results["threadCost"] = Number.isFinite(v) ? v : 0; } catch { results["threadCost"] = 0; }
  try { const v = (results["stitchCount"] ?? 0) / input.machineEfficiency; results["machineTime"] = Number.isFinite(v) ? v : 0; } catch { results["machineTime"] = 0; }
  try { const v = (results["machineTime"] ?? 0) / 60 * input.laborHourlyRate; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["threadCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateEmbroidery_calculator(input: Embroidery_calculatorInput): Embroidery_calculatorOutput {
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


export interface Embroidery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
