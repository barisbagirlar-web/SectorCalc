// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_per_cycle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.setupCost / input.cycleCount) + input.materialCostPerCycle + (input.laborCostPerHour * input.cycleTime) + (input.overheadRate * input.cycleTime); results["costPerCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerCycle"] = 0; }
  try { const v = input.setupCost / input.cycleCount; results["setupCostPerCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["setupCostPerCycle"] = 0; }
  try { const v = input.materialCostPerCycle; results["materialCostPerCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialCostPerCycle"] = 0; }
  try { const v = input.laborCostPerHour * input.cycleTime; results["laborCostPerCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCostPerCycle"] = 0; }
  try { const v = input.overheadRate * input.cycleTime; results["overheadCostPerCycle"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCostPerCycle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCost_per_cycle_calculator(input: Cost_per_cycle_calculatorInput): Cost_per_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overheadCostPerCycle"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
