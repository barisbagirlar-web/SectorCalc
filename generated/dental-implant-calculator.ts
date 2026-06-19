// Auto-generated from dental-implant-calculator-schema.json
import * as z from 'zod';

export interface Dental_implant_calculatorInput {
  materialCost: number;
  machiningTime: number;
  machineRate: number;
  laborCost: number;
  overheadPercent: number;
  batchSize: number;
  setupTime: number;
  dataConfidence?: number;
}

export const Dental_implant_calculatorInputSchema = z.object({
  materialCost: z.number().default(25),
  machiningTime: z.number().default(0.5),
  machineRate: z.number().default(120),
  laborCost: z.number().default(40),
  overheadPercent: z.number().default(25),
  batchSize: z.number().default(10),
  setupTime: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dental_implant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost; results["materialCostOutput"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCostOutput"] = 0; }
  try { const v = input.machiningTime * input.machineRate; results["machiningCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["machiningCost"] = 0; }
  try { const v = input.machiningTime * input.laborCost; results["laborCostOutput"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCostOutput"] = 0; }
  try { const v = (input.setupTime * input.machineRate) / input.batchSize; results["setupCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["setupCost"] = 0; }
  try { const v = input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize; results["directCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize) * (input.overheadPercent/100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize) * (1 + input.overheadPercent/100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDental_implant_calculator(input: Dental_implant_calculatorInput): Dental_implant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Dental_implant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
