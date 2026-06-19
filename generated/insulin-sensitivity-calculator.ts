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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Insulin_sensitivity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialCost + input.laborCost + input.energyCost + input.overheadCost; results["totalBaseline"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBaseline"] = 0; }
  try { const v = input.rawMaterialCost / (asFormulaNumber(results["totalBaseline"])); results["costShareRaw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costShareRaw"] = 0; }
  try { const v = input.laborCost / (asFormulaNumber(results["totalBaseline"])); results["costShareLabor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costShareLabor"] = 0; }
  try { const v = input.energyCost / (asFormulaNumber(results["totalBaseline"])); results["costShareEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costShareEnergy"] = 0; }
  try { const v = input.overheadCost / (asFormulaNumber(results["totalBaseline"])); results["costShareOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costShareOverhead"] = 0; }
  try { const v = (asFormulaNumber(results["costShareRaw"])) * input.sensitivityRaw; results["rawSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawSensitivityContribution"] = 0; }
  try { const v = (asFormulaNumber(results["costShareLabor"])) * input.sensitivityLabor; results["laborSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborSensitivityContribution"] = 0; }
  try { const v = (asFormulaNumber(results["costShareEnergy"])) * input.sensitivityEnergy; results["energySensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energySensitivityContribution"] = 0; }
  try { const v = (asFormulaNumber(results["costShareOverhead"])) * input.sensitivityOverhead; results["overheadSensitivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadSensitivityContribution"] = 0; }
  try { const v = (asFormulaNumber(results["rawSensitivityContribution"])) + (asFormulaNumber(results["laborSensitivityContribution"])) + (asFormulaNumber(results["energySensitivityContribution"])) + (asFormulaNumber(results["overheadSensitivityContribution"])); results["totalSensitivityScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSensitivityScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateInsulin_sensitivity_calculator(input: Insulin_sensitivity_calculatorInput): Insulin_sensitivity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalSensitivityScore"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
