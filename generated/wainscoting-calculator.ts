// Auto-generated from wainscoting-calculator-schema.json
import * as z from 'zod';

export interface Wainscoting_calculatorInput {
  wallLength: number;
  wainscotingHeight: number;
  panelWidth: number;
  stileWidth: number;
  sheetLength: number;
  sheetWidth: number;
  dataConfidence?: number;
}

export const Wainscoting_calculatorInputSchema = z.object({
  wallLength: z.number().default(12),
  wainscotingHeight: z.number().default(3),
  panelWidth: z.number().default(2),
  stileWidth: z.number().default(0.25),
  sheetLength: z.number().default(8),
  sheetWidth: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wainscoting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wainscotingHeight * input.panelWidth * input.stileWidth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.wallLength * input.wainscotingHeight * input.panelWidth * input.stileWidth * (input.sheetLength * input.sheetWidth); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.sheetLength * input.sheetWidth; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWainscoting_calculator(input: Wainscoting_calculatorInput): Wainscoting_calculatorOutput {
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


export interface Wainscoting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
