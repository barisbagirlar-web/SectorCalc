// @ts-nocheck
// Auto-generated from maintenance-cost-calculator-schema.json
import * as z from 'zod';

export interface Maintenance_cost_calculatorInput {
  laborRate: number;
  technicians: number;
  hoursPerMaintenance: number;
  maintenanceFrequency: number;
  partsCostPerMaintenance: number;
  overheadCostPerMaintenance: number;
}

export const Maintenance_cost_calculatorInputSchema = z.object({
  laborRate: z.number().default(50),
  technicians: z.number().default(2),
  hoursPerMaintenance: z.number().default(4),
  maintenanceFrequency: z.number().default(12),
  partsCostPerMaintenance: z.number().default(200),
  overheadCostPerMaintenance: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Maintenance_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.laborRate * input.technicians * input.hoursPerMaintenance; results["laborCostPerEvent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCostPerEvent"] = 0; }
  try { const v = (asFormulaNumber(results["laborCostPerEvent"])) + input.partsCostPerMaintenance + input.overheadCostPerMaintenance; results["totalCostPerEvent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostPerEvent"] = 0; }
  try { const v = input.partsCostPerMaintenance; results["partsCostPerEvent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["partsCostPerEvent"] = 0; }
  try { const v = input.overheadCostPerMaintenance; results["overheadCostPerEvent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCostPerEvent"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostPerEvent"])) * input.maintenanceFrequency; results["annualMaintenanceCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualMaintenanceCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMaintenance_cost_calculator(input: Maintenance_cost_calculatorInput): Maintenance_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualMaintenanceCost"]);
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


export interface Maintenance_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
