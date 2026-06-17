// @ts-nocheck
// Auto-generated from gutter-calculator-schema.json
import * as z from 'zod';

export interface Gutter_calculatorInput {
  roofArea: number;
  rainfallIntensity: number;
  gutterSlope: number;
  gutterLength: number;
  gutterWidth: number;
  gutterDepth: number;
  runoffCoefficient: number;
  additionalArea: number;
}

export const Gutter_calculatorInputSchema = z.object({
  roofArea: z.number().default(100),
  rainfallIntensity: z.number().default(50),
  gutterSlope: z.number().default(10),
  gutterLength: z.number().default(10),
  gutterWidth: z.number().default(150),
  gutterDepth: z.number().default(100),
  runoffCoefficient: z.number().default(0.9),
  additionalArea: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gutter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.rainfallIntensity / 1000 / 3600; results["rainfallIntensity_m_per_s"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rainfallIntensity_m_per_s"] = 0; }
  try { const v = (asFormulaNumber(results["rainfallIntensity_m_per_s"])) * input.roofArea * input.runoffCoefficient; results["flowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flowRate"] = 0; }
  try { const v = input.gutterWidth * input.gutterDepth / 1e6; results["gutterArea_m2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gutterArea_m2"] = 0; }
  try { const v = (input.gutterWidth + 2 * input.gutterDepth) / 1000; results["wettedPerimeter_m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wettedPerimeter_m"] = 0; }
  try { const v = (asFormulaNumber(results["gutterArea_m2"])) / (asFormulaNumber(results["wettedPerimeter_m"])); results["hydraulicRadius"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hydraulicRadius"] = 0; }
  try { const v = input.gutterSlope / 1000; results["slope"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["slope"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGutter_calculator(input: Gutter_calculatorInput): Gutter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slope"]);
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


export interface Gutter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
