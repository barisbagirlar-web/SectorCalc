// Auto-generated from cost-per-cycle-calculator-schema.json
import * as z from 'zod';

export interface Cost_per_cycle_calculatorInput {
  setupCost: number;
  cycleCount: number;
  materialCostPerCycle: number;
  laborCostPerHour: number;
  cycleTime: number;
  overheadRate: number;
}

export const Cost_per_cycle_calculatorInputSchema = z.object({
  setupCost: z.number().default(0),
  cycleCount: z.number().default(1),
  materialCostPerCycle: z.number().default(0),
  laborCostPerHour: z.number().default(0),
  cycleTime: z.number().default(0.01),
  overheadRate: z.number().default(0),
});

function evaluateAllFormulas(input: Cost_per_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.setupCost / input.cycleCount) + input.materialCostPerCycle + (input.laborCostPerHour * input.cycleTime) + (input.overheadRate * input.cycleTime); results["costPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["costPerCycle"] = 0; }
  try { const v = input.setupCost / input.cycleCount; results["setupCostPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["setupCostPerCycle"] = 0; }
  try { const v = input.materialCostPerCycle; results["materialCostPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostPerCycle"] = 0; }
  try { const v = input.laborCostPerHour * input.cycleTime; results["laborCostPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostPerCycle"] = 0; }
  try { const v = input.overheadRate * input.cycleTime; results["overheadCostPerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCostPerCycle"] = 0; }
  return results;
}


export function calculateCost_per_cycle_calculator(input: Cost_per_cycle_calculatorInput): Cost_per_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Çevrim Başına Maliyet (TL/çevrim)"] ?? 0;
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


export interface Cost_per_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
