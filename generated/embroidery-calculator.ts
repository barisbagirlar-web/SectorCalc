// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Embroidery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.designWidth * input.designHeight * input.stitchDensity; results["stitchCount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["stitchCount"] = 0; }
  try { const v = (asFormulaNumber(results["stitchCount"])) * input.threadFactor / 1000; results["threadLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["threadLength"] = 0; }
  try { const v = (asFormulaNumber(results["threadLength"])) * input.threadCostPerMeter; results["threadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["threadCost"] = 0; }
  try { const v = (asFormulaNumber(results["stitchCount"])) / input.machineEfficiency; results["machineTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machineTime"] = 0; }
  try { const v = (asFormulaNumber(results["machineTime"])) / 60 * input.laborHourlyRate; results["laborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (asFormulaNumber(results["threadCost"])) + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEmbroidery_calculator(input: Embroidery_calculatorInput): Embroidery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Embroidery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
