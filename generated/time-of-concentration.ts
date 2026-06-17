// @ts-nocheck
// Auto-generated from time-of-concentration-schema.json
import * as z from 'zod';

export interface Time_of_concentrationInput {
  flowLength: number;
  slope: number;
  manningN: number;
  rainfallIntensity: number;
  catchmentArea: number;
  percentImpervious: number;
}

export const Time_of_concentrationInputSchema = z.object({
  flowLength: z.number().default(100),
  slope: z.number().default(0.01),
  manningN: z.number().default(0.035),
  rainfallIntensity: z.number().default(50),
  catchmentArea: z.number().default(10),
  percentImpervious: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Time_of_concentrationInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.01947 * (input.flowLength ** 0.77) * (input.slope ** -0.385); results["kirpichTc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kirpichTc"] = 0; }
  try { const v = (0.938 / input.manningN) * (input.flowLength ** 0.6) * (input.slope ** -0.3); results["manningTc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["manningTc"] = 0; }
  try { const v = (input.flowLength ** 0.8) * ((1000 / (25.4 * (input.rainfallIntensity / 1000) * 1000 / 25.4 + 1)) ** 0.7) / (440 * (input.slope ** 0.5)); results["scsLag"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["scsLag"] = 0; }
  try { const v = 0.5 * (asFormulaNumber(results["kirpichTc"])) + 0.3 * (asFormulaNumber(results["manningTc"])) + 0.2 * (asFormulaNumber(results["scsLag"])); results["weightedTc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightedTc"] = 0; }
  try { const v = (asFormulaNumber(results["weightedTc"])) * (1 + 0.2 * (input.percentImpervious / 100)); results["adjustedTc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedTc"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTime_of_concentration(input: Time_of_concentrationInput): Time_of_concentrationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedTc"]);
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


export interface Time_of_concentrationOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
