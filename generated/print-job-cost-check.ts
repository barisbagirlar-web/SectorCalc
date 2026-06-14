// Auto-generated from print-job-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PrintJobCostCheckInput {
  paperCostPerSheet: number;
  inkCostPerMl: number;
  inkUsagePerSheet: number;
  laborCostPerHour: number;
  setupTimeMinutes: number;
  runTimePerSheet: number;
  quantity: number;
  wasteRate: number;
  machineDepreciationPerHour: number;
  energyCostPerKwh: number;
  powerConsumptionKw: number;
  maintenanceCostPerHour: number;
  overheadRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PrintJobCostCheckInputSchema = z.object({
  paperCostPerSheet: z.number().min(0).default(0.05),
  inkCostPerMl: z.number().min(0).default(0.5),
  inkUsagePerSheet: z.number().min(0).default(0.1),
  laborCostPerHour: z.number().min(0).default(25),
  setupTimeMinutes: z.number().min(0).default(10),
  runTimePerSheet: z.number().min(0).default(2),
  quantity: z.number().min(1).default(1000),
  wasteRate: z.number().min(0).max(100).default(5),
  machineDepreciationPerHour: z.number().min(0).default(10),
  energyCostPerKwh: z.number().min(0).default(0.12),
  powerConsumptionKw: z.number().min(0).default(1.5),
  maintenanceCostPerHour: z.number().min(0).default(5),
  overheadRate: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PrintJobCostCheckOutput {
  costPerSheet: number;
  breakdown: {
    materialCostPerSheet: number;
    laborCostPerSheet: number;
    machineCostPerSheet: number;
    overheadCostPerSheet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PrintJobCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalMaterialCost = ((): number => { try { const __v = input.paperCostPerSheet * input.quantity * (1 + input.wasteRate/100) + input.inkCostPerMl * input.inkUsagePerSheet * input.quantity * (1 + input.wasteRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.laborCostPerHour * (input.setupTimeMinutes/60 + input.runTimePerSheet/3600 * input.quantity); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMachineCost = ((): number => { try { const __v = (input.machineDepreciationPerHour + input.energyCostPerKwh * input.powerConsumptionKw + input.maintenanceCostPerHour) * (input.setupTimeMinutes/60 + input.runTimePerSheet/3600 * input.quantity); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.totalMaterialCost + results.totalLaborCost + results.totalMachineCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost * (1 + input.overheadRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSheet = ((): number => { try { const __v = results.totalCost / input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.1 : 1.0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePrintJobCostCheck(input: PrintJobCostCheckInput): PrintJobCostCheckOutput {
  const results = evaluateFormulas(input);
  const costPerSheet = results.costPerSheet ?? 0;
  const breakdown = {
    materialCostPerSheet: results.materialCostPerSheet,
    laborCostPerSheet: results.laborCostPerSheet,
    machineCostPerSheet: results.machineCostPerSheet,
    overheadCostPerSheet: results.overheadCostPerSheet,
  };

  // rule: paperCostPerSheet >= 0
  // rule: inkCostPerMl >= 0
  // rule: inkUsagePerSheet >= 0
  // rule: laborCostPerHour >= 0
  // rule: setupTimeMinutes >= 0
  // rule: runTimePerSheet > 0
  // rule: quantity > 0
  // rule: wasteRate >= 0 and wasteRate <= 100
  // rule: machineDepreciationPerHour >= 0
  // rule: energyCostPerKwh >= 0
  // rule: powerConsumptionKw >= 0
  // rule: maintenanceCostPerHour >= 0
  // rule: overheadRate >= 0 and overheadRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste rate detected, consider process improvement.
  // threshold skipped (non-JS): Long setup time, consider SMED techniques.
  // threshold skipped (non-JS): High ink usage, check coverage settings.
  // threshold skipped (non-JS): Overhead rate exceeds typical range.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost / input.quantity; } catch { return costPerSheet; } })();

  return {
    costPerSheet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
