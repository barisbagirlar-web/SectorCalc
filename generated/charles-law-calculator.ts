// Auto-generated from charles-law-calculator-schema.json
import * as z from 'zod';

export interface Charles_law_calculatorInput {
  initialVolume: number;
  initialTemperature: number;
  finalTemperature: number;
  dataConfidence?: number;
}

export const Charles_law_calculatorInputSchema = z.object({
  initialVolume: z.number().default(1),
  initialTemperature: z.number().default(273.15),
  finalTemperature: z.number().default(373.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Charles_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialVolume * input.finalTemperature / input.initialTemperature; results["finalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalVolume"])) - input.initialVolume; results["volumeChange"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeChange"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["volumeChange"])) / input.initialVolume) * 100; results["volumeChangePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeChangePercent"] = Number.NaN; }
  try { const v = input.initialVolume * input.finalTemperature / input.initialTemperature; results["finalVolume___initialVolume___finalTempe"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalVolume___initialVolume___finalTempe"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalVolume"])) - input.initialVolume; results["volumeChange___finalVolume___initialVolu"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeChange___finalVolume___initialVolu"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["volumeChange"])) / input.initialVolume) * 100; results["volumeChangePercent____volumeChange___in"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeChangePercent____volumeChange___in"] = Number.NaN; }
  return results;
}


export function calculateCharles_law_calculator(input: Charles_law_calculatorInput): Charles_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalVolume"]);
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


export interface Charles_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
