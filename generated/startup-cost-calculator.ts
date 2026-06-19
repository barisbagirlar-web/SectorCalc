// Auto-generated from startup-cost-calculator-schema.json
import * as z from 'zod';

export interface Startup_cost_calculatorInput {
  equipmentCost: number;
  legalAndPermitCost: number;
  depositCost: number;
  initialInventoryCost: number;
  marketingLaunchCost: number;
  workingCapital: number;
  dataConfidence?: number;
}

export const Startup_cost_calculatorInputSchema = z.object({
  equipmentCost: z.number().default(0),
  legalAndPermitCost: z.number().default(0),
  depositCost: z.number().default(0),
  initialInventoryCost: z.number().default(0),
  marketingLaunchCost: z.number().default(0),
  workingCapital: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Startup_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.equipmentCost + input.legalAndPermitCost + input.depositCost + input.initialInventoryCost + input.marketingLaunchCost + input.workingCapital; results["totalStartupCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStartupCost"] = 0; }
  try { const v = input.equipmentCost; results["equipmentCostOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equipmentCostOut"] = 0; }
  try { const v = input.legalAndPermitCost; results["legalCostOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["legalCostOut"] = 0; }
  try { const v = input.depositCost; results["depositCostOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depositCostOut"] = 0; }
  try { const v = input.initialInventoryCost; results["initialInventoryOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["initialInventoryOut"] = 0; }
  try { const v = input.marketingLaunchCost; results["marketingLaunchOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["marketingLaunchOut"] = 0; }
  try { const v = input.workingCapital; results["workingCapitalOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["workingCapitalOut"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStartup_cost_calculator(input: Startup_cost_calculatorInput): Startup_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalStartupCost"]);
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


export interface Startup_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
