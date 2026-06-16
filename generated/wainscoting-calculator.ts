// Auto-generated from wainscoting-calculator-schema.json
import * as z from 'zod';

export interface Wainscoting_calculatorInput {
  wallLength: number;
  wainscotingHeight: number;
  panelWidth: number;
  stileWidth: number;
  sheetLength: number;
  sheetWidth: number;
}

export const Wainscoting_calculatorInputSchema = z.object({
  wallLength: z.number().default(12),
  wainscotingHeight: z.number().default(3),
  panelWidth: z.number().default(2),
  stileWidth: z.number().default(0.25),
  sheetLength: z.number().default(8),
  sheetWidth: z.number().default(4),
});

function evaluateAllFormulas(input: Wainscoting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input.wallLength - input.stileWidth) / (input.panelWidth + input.stileWidth)); results["nPanels"] = Number.isFinite(v) ? v : 0; } catch { results["nPanels"] = 0; }
  try { const v = (results["nPanels"] ?? 0) + 1; results["nStiles"] = Number.isFinite(v) ? v : 0; } catch { results["nStiles"] = 0; }
  try { const v = 2 * input.wallLength + (results["nStiles"] ?? 0) * input.wainscotingHeight; results["totalTrimLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalTrimLength"] = 0; }
  try { const v = Math.ceil((results["nPanels"] ?? 0) * input.panelWidth * input.wainscotingHeight / (input.sheetLength * input.sheetWidth)); results["plywoodSheets"] = Number.isFinite(v) ? v : 0; } catch { results["plywoodSheets"] = 0; }
  return results;
}


export function calculateWainscoting_calculator(input: Wainscoting_calculatorInput): Wainscoting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nPanels"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
