// @ts-nocheck
// Auto-generated from pavement-design-calculator-schema.json
import * as z from 'zod';

export interface Pavement_design_calculatorInput {
  axleLoad: number;
  standardLoad: number;
  trafficCount: number;
  designLife: number;
  subgradeCBR: number;
  reliabilityFactor: number;
}

export const Pavement_design_calculatorInputSchema = z.object({
  axleLoad: z.number().default(80),
  standardLoad: z.number().default(80),
  trafficCount: z.number().default(500),
  designLife: z.number().default(20),
  subgradeCBR: z.number().default(5),
  reliabilityFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pavement_design_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.axleLoad / input.standardLoad) ** 4; results["esalPerVehicle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["esalPerVehicle"] = 0; }
  try { const v = input.trafficCount * (asFormulaNumber(results["esalPerVehicle"])); results["dailyESAL"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyESAL"] = 0; }
  try { const v = (asFormulaNumber(results["dailyESAL"])) * 365 * input.designLife; results["designESAL"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["designESAL"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePavement_design_calculator(input: Pavement_design_calculatorInput): Pavement_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["designESAL"]);
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


export interface Pavement_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
