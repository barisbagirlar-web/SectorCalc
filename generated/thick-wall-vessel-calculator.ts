// @ts-nocheck
// Auto-generated from thick-wall-vessel-calculator-schema.json
import * as z from 'zod';

export interface Thick_wall_vessel_calculatorInput {
  insideDiameter: number;
  outsideDiameter: number;
  internalPressure: number;
  externalPressure: number;
  yieldStrength: number;
}

export const Thick_wall_vessel_calculatorInputSchema = z.object({
  insideDiameter: z.number().default(100),
  outsideDiameter: z.number().default(200),
  internalPressure: z.number().default(10),
  externalPressure: z.number().default(0),
  yieldStrength: z.number().default(250),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thick_wall_vessel_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.insideDiameter / 2; results["ri"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ri"] = 0; }
  try { const v = input.outsideDiameter / 2; results["ro"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ro"] = 0; }
  try { const v = ((input.internalPressure * (asFormulaNumber(results["ri"])) ** 2 - input.externalPressure * (asFormulaNumber(results["ro"])) ** 2) / ((asFormulaNumber(results["ro"])) ** 2 - (asFormulaNumber(results["ri"])) ** 2)) + ((input.internalPressure - input.externalPressure) * (asFormulaNumber(results["ro"])) ** 2 / ((asFormulaNumber(results["ro"])) ** 2 - (asFormulaNumber(results["ri"])) ** 2)); results["hoopStressInner"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hoopStressInner"] = 0; }
  try { const v = -input.internalPressure; results["radialStressInner"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["radialStressInner"] = 0; }
  try { const v = (input.internalPressure * (asFormulaNumber(results["ri"])) ** 2 - input.externalPressure * (asFormulaNumber(results["ro"])) ** 2) / ((asFormulaNumber(results["ro"])) ** 2 - (asFormulaNumber(results["ri"])) ** 2); results["longitudinalStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["longitudinalStress"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThick_wall_vessel_calculator(input: Thick_wall_vessel_calculatorInput): Thick_wall_vessel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hoopStressInner"]);
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


export interface Thick_wall_vessel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
