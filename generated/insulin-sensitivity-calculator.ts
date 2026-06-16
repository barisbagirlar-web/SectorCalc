// Auto-generated from insulin-sensitivity-calculator-schema.json
import * as z from 'zod';

export interface Insulin_sensitivity_calculatorInput {
  rawMaterialCost: number;
  laborCost: number;
  energyCost: number;
  overheadCost: number;
  sensitivityRaw: number;
  sensitivityLabor: number;
  sensitivityEnergy: number;
  sensitivityOverhead: number;
}

export const Insulin_sensitivity_calculatorInputSchema = z.object({
  rawMaterialCost: z.number().default(10),
  laborCost: z.number().default(5),
  energyCost: z.number().default(2),
  overheadCost: z.number().default(3),
  sensitivityRaw: z.number().default(0.3),
  sensitivityLabor: z.number().default(0.2),
  sensitivityEnergy: z.number().default(0.1),
  sensitivityOverhead: z.number().default(0.15),
});

function evaluateAllFormulas(input: Insulin_sensitivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialCost + input.laborCost + input.energyCost + input.overheadCost; results["totalBaseline"] = Number.isFinite(v) ? v : 0; } catch { results["totalBaseline"] = 0; }
  try { const v = input.rawMaterialCost / (results["totalBaseline"] ?? 0); results["costShareRaw"] = Number.isFinite(v) ? v : 0; } catch { results["costShareRaw"] = 0; }
  try { const v = input.laborCost / (results["totalBaseline"] ?? 0); results["costShareLabor"] = Number.isFinite(v) ? v : 0; } catch { results["costShareLabor"] = 0; }
  try { const v = input.energyCost / (results["totalBaseline"] ?? 0); results["costShareEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["costShareEnergy"] = 0; }
  try { const v = input.overheadCost / (results["totalBaseline"] ?? 0); results["costShareOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["costShareOverhead"] = 0; }
  try { const v = (results["costShareRaw"] ?? 0) * input.sensitivityRaw; results["rawSensitivityContribution"] = Number.isFinite(v) ? v : 0; } catch { results["rawSensitivityContribution"] = 0; }
  try { const v = (results["costShareLabor"] ?? 0) * input.sensitivityLabor; results["laborSensitivityContribution"] = Number.isFinite(v) ? v : 0; } catch { results["laborSensitivityContribution"] = 0; }
  try { const v = (results["costShareEnergy"] ?? 0) * input.sensitivityEnergy; results["energySensitivityContribution"] = Number.isFinite(v) ? v : 0; } catch { results["energySensitivityContribution"] = 0; }
  try { const v = (results["costShareOverhead"] ?? 0) * input.sensitivityOverhead; results["overheadSensitivityContribution"] = Number.isFinite(v) ? v : 0; } catch { results["overheadSensitivityContribution"] = 0; }
  try { const v = (results["rawSensitivityContribution"] ?? 0) + (results["laborSensitivityContribution"] ?? 0) + (results["energySensitivityContribution"] ?? 0) + (results["overheadSensitivityContribution"] ?? 0); results["totalSensitivityScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalSensitivityScore"] = 0; }
  return results;
}


export function calculateInsulin_sensitivity_calculator(input: Insulin_sensitivity_calculatorInput): Insulin_sensitivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSensitivityScore"] ?? 0;
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


export interface Insulin_sensitivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
