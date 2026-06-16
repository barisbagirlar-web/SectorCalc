// Auto-generated from meld-score-calculator-schema.json
import * as z from 'zod';

export interface Meld_score_calculatorInput {
  materialWasteRate: number;
  energyConsumption: number;
  laborProductivity: number;
  defectRate: number;
  machineUtilization: number;
}

export const Meld_score_calculatorInputSchema = z.object({
  materialWasteRate: z.number().default(5),
  energyConsumption: z.number().default(10),
  laborProductivity: z.number().default(50),
  defectRate: z.number().default(2),
  machineUtilization: z.number().default(80),
});

function evaluateAllFormulas(input: Meld_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, Math.min(100, 100 - input.materialWasteRate * 10)); results["scoreMaterial"] = Number.isFinite(v) ? v : 0; } catch { results["scoreMaterial"] = 0; }
  try { const v = Math.max(0, Math.min(100, 100 - (input.energyConsumption - 5) * (100 / 15))); results["scoreEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["scoreEnergy"] = 0; }
  try { const v = Math.max(0, Math.min(100, input.laborProductivity)); results["scoreLabor"] = Number.isFinite(v) ? v : 0; } catch { results["scoreLabor"] = 0; }
  try { const v = Math.max(0, Math.min(100, 100 - input.defectRate * 10)); results["scoreDefect"] = Number.isFinite(v) ? v : 0; } catch { results["scoreDefect"] = 0; }
  try { const v = Math.max(0, Math.min(100, input.machineUtilization)); results["scoreUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["scoreUtilization"] = 0; }
  try { const v = Math.round((0.2 * (results["scoreMaterial"] ?? 0) + 0.25 * (results["scoreEnergy"] ?? 0) + 0.2 * (results["scoreLabor"] ?? 0) + 0.25 * (results["scoreDefect"] ?? 0) + 0.1 * (results["scoreUtilization"] ?? 0)) * 10) / 10; results["meldScore"] = Number.isFinite(v) ? v : 0; } catch { results["meldScore"] = 0; }
  return results;
}


export function calculateMeld_score_calculator(input: Meld_score_calculatorInput): Meld_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["meldScore"] ?? 0;
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


export interface Meld_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
