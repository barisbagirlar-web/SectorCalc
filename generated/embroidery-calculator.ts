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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Embroidery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designWidth * input.designHeight * input.stitchDensity; results["stitchCount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stitchCount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["stitchCount"])) * input.threadFactor / 1000; results["threadLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["threadLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["threadLength"])) * input.threadCostPerMeter; results["threadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["threadCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["stitchCount"])) / input.machineEfficiency; results["machineTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machineTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["machineTime"])) / 60 * input.laborHourlyRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["threadCost"])) + (toNumericFormulaValue(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateEmbroidery_calculator(input: Embroidery_calculatorInput): Embroidery_calculatorOutput {
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


export interface Embroidery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
