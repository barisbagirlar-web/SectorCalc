// @ts-nocheck
// Auto-generated from solar-roi-calculator-schema.json
import * as z from 'zod';

export interface Solar_roi_calculatorInput {
  systemCost: number;
  yillikUretim: number;
  elektrikFiyati: number;
  sistemOmru: number;
  tesvikOrani: number;
}

export const Solar_roi_calculatorInputSchema = z.object({
  systemCost: z.number().default(50000),
  yillikUretim: z.number().default(5000),
  elektrikFiyati: z.number().default(1.2),
  sistemOmru: z.number().default(25),
  tesvikOrani: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Solar_roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.systemCost * (1 - input.tesvikOrani / 100); results["netMaliyet"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netMaliyet"] = 0; }
  try { const v = input.yillikUretim * input.elektrikFiyati; results["yillikTasarruf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yillikTasarruf"] = 0; }
  try { const v = (asFormulaNumber(results["yillikTasarruf"])) * input.sistemOmru; results["toplamTasarruf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["toplamTasarruf"] = 0; }
  try { const v = (asFormulaNumber(results["toplamTasarruf"])) - (asFormulaNumber(results["netMaliyet"])); results["netKar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netKar"] = 0; }
  try { const v = (asFormulaNumber(results["netMaliyet"])) / (asFormulaNumber(results["yillikTasarruf"])); results["geriOdemeSuresi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["geriOdemeSuresi"] = 0; }
  try { const v = ((asFormulaNumber(results["netKar"])) / (asFormulaNumber(results["netMaliyet"]))) * 100; results["roi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSolar_roi_calculator(input: Solar_roi_calculatorInput): Solar_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roi"]);
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


export interface Solar_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
