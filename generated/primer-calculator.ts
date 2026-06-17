// @ts-nocheck
// Auto-generated from primer-calculator-schema.json
import * as z from 'zod';

export interface Primer_calculatorInput {
  surfaceArea: number;
  coverageRate: number;
  coats: number;
  wasteFactor: number;
  containerSize: number;
  pricePerContainer: number;
}

export const Primer_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(100),
  coverageRate: z.number().default(10),
  coats: z.number().default(1),
  wasteFactor: z.number().default(5),
  containerSize: z.number().default(20),
  pricePerContainer: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Primer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.surfaceArea * input.coats / input.coverageRate; results["baseVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseVolume"] = 0; }
  try { const v = (asFormulaNumber(results["baseVolume"])) * input.wasteFactor / 100; results["wasteVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteVolume"] = 0; }
  try { const v = (asFormulaNumber(results["baseVolume"])) + (asFormulaNumber(results["wasteVolume"])); results["adjustedVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedVolume"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedVolume"])) / input.containerSize; results["containersDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["containersDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["containersDecimal"])) * input.pricePerContainer; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePrimer_calculator(input: Primer_calculatorInput): Primer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedVolume"]);
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


export interface Primer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
