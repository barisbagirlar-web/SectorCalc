// Auto-generated from primer-calculator-schema.json
import * as z from 'zod';

export interface Primer_calculatorInput {
  surfaceArea: number;
  coverageRate: number;
  coats: number;
  wasteFactor: number;
  containerSize: number;
  pricePerContainer: number;
  dataConfidence?: number;
}

export const Primer_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(100),
  coverageRate: z.number().default(10),
  coats: z.number().default(1),
  wasteFactor: z.number().default(5),
  containerSize: z.number().default(20),
  pricePerContainer: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Primer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea * input.coats / input.coverageRate; results["baseVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseVolume"])) * input.wasteFactor / 100; results["wasteVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseVolume"])) + (toNumericFormulaValue(results["wasteVolume"])); results["adjustedVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedVolume"])) / input.containerSize; results["containersDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["containersDecimal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["containersDecimal"])) * input.pricePerContainer; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePrimer_calculator(input: Primer_calculatorInput): Primer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedVolume"]);
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


export interface Primer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
