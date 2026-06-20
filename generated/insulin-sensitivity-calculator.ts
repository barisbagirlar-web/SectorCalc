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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Insulin_sensitivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialCost + input.laborCost + input.energyCost + input.overheadCost; results["totalBaseline"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBaseline"] = Number.NaN; }
  try { const v = input.rawMaterialCost / (toNumericFormulaValue(results["totalBaseline"])); results["costShareRaw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costShareRaw"] = Number.NaN; }
  try { const v = input.laborCost / (toNumericFormulaValue(results["totalBaseline"])); results["costShareLabor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costShareLabor"] = Number.NaN; }
  try { const v = input.energyCost / (toNumericFormulaValue(results["totalBaseline"])); results["costShareEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costShareEnergy"] = Number.NaN; }
  try { const v = input.overheadCost / (toNumericFormulaValue(results["totalBaseline"])); results["costShareOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costShareOverhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costShareRaw"])) * input.sensitivityRaw; results["rawSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawSensitivityContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costShareLabor"])) * input.sensitivityLabor; results["laborSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborSensitivityContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costShareEnergy"])) * input.sensitivityEnergy; results["energySensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energySensitivityContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costShareOverhead"])) * input.sensitivityOverhead; results["overheadSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadSensitivityContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawSensitivityContribution"])) + (toNumericFormulaValue(results["laborSensitivityContribution"])) + (toNumericFormulaValue(results["energySensitivityContribution"])) + (toNumericFormulaValue(results["overheadSensitivityContribution"])); results["totalSensitivityScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSensitivityScore"] = Number.NaN; }
  return results;
}


export function calculateInsulin_sensitivity_calculator(input: Insulin_sensitivity_calculatorInput): Insulin_sensitivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSensitivityScore"]);
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


export interface Insulin_sensitivity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
