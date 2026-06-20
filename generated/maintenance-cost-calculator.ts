// Auto-generated from maintenance-cost-calculator-schema.json
import * as z from 'zod';

export interface Maintenance_cost_calculatorInput {
  laborRate: number;
  technicians: number;
  hoursPerMaintenance: number;
  maintenanceFrequency: number;
  partsCostPerMaintenance: number;
  overheadCostPerMaintenance: number;
  dataConfidence?: number;
}

export const Maintenance_cost_calculatorInputSchema = z.object({
  laborRate: z.number().default(50),
  technicians: z.number().default(2),
  hoursPerMaintenance: z.number().default(4),
  maintenanceFrequency: z.number().default(12),
  partsCostPerMaintenance: z.number().default(200),
  overheadCostPerMaintenance: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Maintenance_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborRate * input.technicians * input.hoursPerMaintenance; results["laborCostPerEvent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostPerEvent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["laborCostPerEvent"])) + input.partsCostPerMaintenance + input.overheadCostPerMaintenance; results["totalCostPerEvent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerEvent"] = Number.NaN; }
  try { const v = input.partsCostPerMaintenance; results["partsCostPerEvent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["partsCostPerEvent"] = Number.NaN; }
  try { const v = input.overheadCostPerMaintenance; results["overheadCostPerEvent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadCostPerEvent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostPerEvent"])) * input.maintenanceFrequency; results["annualMaintenanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualMaintenanceCost"] = Number.NaN; }
  return results;
}


export function calculateMaintenance_cost_calculator(input: Maintenance_cost_calculatorInput): Maintenance_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualMaintenanceCost"]);
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


export interface Maintenance_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
