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

function evaluateAllFormulas(input: Dental_implant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost; results["materialCostOutput"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostOutput"] = 0; }
  try { const v = input.machiningTime * input.machineRate; results["machiningCost"] = Number.isFinite(v) ? v : 0; } catch { results["machiningCost"] = 0; }
  try { const v = input.machiningTime * input.laborCost; results["laborCostOutput"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostOutput"] = 0; }
  try { const v = (input.setupTime * input.machineRate) / input.batchSize; results["setupCost"] = Number.isFinite(v) ? v : 0; } catch { results["setupCost"] = 0; }
  try { const v = input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize; results["directCost"] = Number.isFinite(v) ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize) * (input.overheadPercent/100); results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (input.materialCost + input.machiningTime*input.machineRate + input.machiningTime*input.laborCost + (input.setupTime*input.machineRate)/input.batchSize) * (1 + input.overheadPercent/100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateDental_implant_calculator(input: Dental_implant_calculatorInput): Dental_implant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Dental_implant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
