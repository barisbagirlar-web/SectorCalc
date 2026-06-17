// @ts-nocheck
// Auto-generated from downspout-calculator-schema.json
import * as z from 'zod';

export interface Downspout_calculatorInput {
  roofLength: number;
  roofWidth: number;
  rainfallIntensity: number;
  downspoutDiameter: number;
  efficiencyFactor: number;
}

export const Downspout_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(10),
  rainfallIntensity: z.number().default(50),
  downspoutDiameter: z.number().default(100),
  efficiencyFactor: z.number().default(85),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Downspout_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.roofWidth * input.roofLength * input.rainfallIntensity / 3600; results["totalFlow"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFlow"] = 0; }
  try { const v = (Math.PI * input.efficiencyFactor * input.downspoutDiameter ** 2) / 400000; results["downspoutCapacity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["downspoutCapacity"] = 0; }
  try { const v = (asFormulaNumber(results["totalFlow"])) / (asFormulaNumber(results["downspoutCapacity"])); results["requiredDownspoutsFloat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredDownspoutsFloat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDownspout_calculator(input: Downspout_calculatorInput): Downspout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredDownspoutsFloat"]);
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


export interface Downspout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
