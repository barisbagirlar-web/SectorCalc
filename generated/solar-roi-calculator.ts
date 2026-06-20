// Auto-generated from solar-roi-calculator-schema.json
import * as z from 'zod';

export interface Solar_roi_calculatorInput {
  systemCost: number;
  yillikUretim: number;
  elektrikFiyati: number;
  sistemOmru: number;
  tesvikOrani: number;
  dataConfidence?: number;
}

export const Solar_roi_calculatorInputSchema = z.object({
  systemCost: z.number().default(50000),
  yillikUretim: z.number().default(5000),
  elektrikFiyati: z.number().default(1.2),
  sistemOmru: z.number().default(25),
  tesvikOrani: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Solar_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.systemCost * (1 - input.tesvikOrani / 100); results["netMaliyet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netMaliyet"] = Number.NaN; }
  try { const v = input.yillikUretim * input.elektrikFiyati; results["yillikTasarruf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yillikTasarruf"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["yillikTasarruf"])) * input.sistemOmru; results["toplamTasarruf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamTasarruf"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["toplamTasarruf"])) - (toNumericFormulaValue(results["netMaliyet"])); results["netKar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netKar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netMaliyet"])) / (toNumericFormulaValue(results["yillikTasarruf"])); results["geriOdemeSuresi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["geriOdemeSuresi"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netKar"])) / (toNumericFormulaValue(results["netMaliyet"]))) * 100; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roi"] = Number.NaN; }
  return results;
}


export function calculateSolar_roi_calculator(input: Solar_roi_calculatorInput): Solar_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roi"]);
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


export interface Solar_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
