// Auto-generated from waste-reduction-calculator-schema.json
import * as z from 'zod';

export interface Waste_reduction_calculatorInput {
  totalProduction: number;
  defectUnits: number;
  materialInput: number;
  wasteMaterial: number;
  materialCostPerKg: number;
  defectReductionTarget: number;
  dataConfidence?: number;
}

export const Waste_reduction_calculatorInputSchema = z.object({
  totalProduction: z.number().default(1000),
  defectUnits: z.number().default(50),
  materialInput: z.number().default(500),
  wasteMaterial: z.number().default(30),
  materialCostPerKg: z.number().default(2.5),
  defectReductionTarget: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Waste_reduction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialInput / input.totalProduction; results["materialPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialPerUnit"] = 0; }
  try { const v = input.defectUnits / input.totalProduction * 100; results["currentDefectRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentDefectRate"] = 0; }
  try { const v = input.wasteMaterial / input.materialInput * 100; results["currentWasteRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentWasteRate"] = 0; }
  try { const v = input.wasteMaterial * input.materialCostPerKg; results["currentWasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentWasteCost"] = 0; }
  try { const v = input.defectUnits * (input.defectReductionTarget / 100) * (input.materialInput / input.totalProduction) * input.materialCostPerKg; results["savings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWaste_reduction_calculator(input: Waste_reduction_calculatorInput): Waste_reduction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["savings"]));
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


export interface Waste_reduction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
