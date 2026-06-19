// Auto-generated from cleaning-cost-calculator-schema.json
import * as z from 'zod';

export interface Cleaning_cost_calculatorInput {
  area: number;
  frequency: number;
  laborRate: number;
  laborTime: number;
  materialCost: number;
  equipmentCost: number;
  overheadMargin: number;
  dataConfidence?: number;
}

export const Cleaning_cost_calculatorInputSchema = z.object({
  area: z.number().default(100),
  frequency: z.number().default(4),
  laborRate: z.number().default(50),
  laborTime: z.number().default(0.1),
  materialCost: z.number().default(2),
  equipmentCost: z.number().default(100),
  overheadMargin: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cleaning_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.frequency * input.laborTime * input.laborRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.area * input.frequency * input.materialCost; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.equipmentCost; results["equipmentCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equipmentCost"] = 0; }
  try { const v = (asFormulaNumber(results["laborCost"])) + input.materialCost + input.equipmentCost; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.overheadMargin / 100); results["overheadAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["overheadAmount"])); results["totalMonthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCleaning_cost_calculator(input: Cleaning_cost_calculatorInput): Cleaning_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthlyCost"]);
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


export interface Cleaning_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
