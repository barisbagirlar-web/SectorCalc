// Auto-generated from meld-score-calculator-schema.json
import * as z from 'zod';

export interface Meld_score_calculatorInput {
  materialWasteRate: number;
  energyConsumption: number;
  laborProductivity: number;
  defectRate: number;
  machineUtilization: number;
  dataConfidence?: number;
}

export const Meld_score_calculatorInputSchema = z.object({
  materialWasteRate: z.number().default(5),
  energyConsumption: z.number().default(10),
  laborProductivity: z.number().default(50),
  defectRate: z.number().default(2),
  machineUtilization: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meld_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.materialWasteRate / 100) * input.energyConsumption * input.laborProductivity * (input.defectRate / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.materialWasteRate / 100) * input.energyConsumption * input.laborProductivity * (input.defectRate / 100) * ((input.machineUtilization / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.machineUtilization / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeld_score_calculator(input: Meld_score_calculatorInput): Meld_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Meld_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
