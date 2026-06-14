// Auto-generated from machine-time-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MachineTimeCalculatorInput {
  availableTimePerDay: number;
  plannedDowntimePerDay: number;
  unplannedDowntimePerDay: number;
  operatingSpeed: number;
  idealSpeed: number;
  defectRate: number;
  hourlyCost: number;
  dataConfidence: number;
}

export const MachineTimeCalculatorInputSchema = z.object({
  availableTimePerDay: z.number().min(0).max(24).default(24),
  plannedDowntimePerDay: z.number().min(0).max(24).default(2),
  unplannedDowntimePerDay: z.number().min(0).max(24).default(1),
  operatingSpeed: z.number().min(0).default(100),
  idealSpeed: z.number().min(0).default(120),
  defectRate: z.number().min(0).max(1).default(0.02),
  hourlyCost: z.number().min(0).default(50),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface MachineTimeCalculatorOutput {
  costPerGoodUnit: number;
  breakdown: {
    oee: number;
    availability: number;
    performance: number;
    quality: number;
    goodUnitsProduced: number;
    totalCostPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MachineTimeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.plannedProductionTime = ((): number => { try { const __v = input.availableTimePerDay - input.plannedDowntimePerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.actualRunTime = ((): number => { try { const __v = results.plannedProductionTime - input.unplannedDowntimePerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.availability = ((): number => { try { const __v = results.actualRunTime / results.plannedProductionTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.performance = ((): number => { try { const __v = input.operatingSpeed / input.idealSpeed; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quality = ((): number => { try { const __v = 1 - input.defectRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oee = ((): number => { try { const __v = results.availability * results.performance * results.quality; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.goodUnitsProduced = ((): number => { try { const __v = results.actualRunTime * input.operatingSpeed * results.quality; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerDay = ((): number => { try { const __v = input.availableTimePerDay * input.hourlyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerGoodUnit = ((): number => { try { const __v = results.totalCostPerDay / results.goodUnitsProduced; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.costPerGoodUnit / input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMachineTimeCalculator(input: MachineTimeCalculatorInput): MachineTimeCalculatorOutput {
  const results = evaluateFormulas(input);
  const costPerGoodUnit = results.costPerGoodUnit ?? 0;
  const breakdown = {
    oee: results.oee,
    availability: results.availability,
    performance: results.performance,
    quality: results.quality,
    goodUnitsProduced: results.goodUnitsProduced,
    totalCostPerDay: results.totalCostPerDay,
  };

  // rule: availableTimePerDay >= 0 && availableTimePerDay <= 24
  // rule: plannedDowntimePerDay >= 0 && plannedDowntimePerDay <= availableTimePerDay
  // rule: unplannedDowntimePerDay >= 0 && unplannedDowntimePerDay <= (availableTimePerDay - plannedDowntimePerDay)
  // rule: operatingSpeed >= 0
  // rule: idealSpeed >= operatingSpeed
  // rule: defectRate >= 0 && defectRate <= 1
  // rule: hourlyCost >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Defect rate exceeds 5% - investigate quality issues.
  // threshold skipped (non-JS): Warning: Unplanned downtime exceeds 2 hours - review maintenance schedule.
  // threshold skipped (non-JS): Warning: Performance below 80% - consider speed optimization.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return costPerGoodUnit; } })();

  return {
    costPerGoodUnit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed breakdown report with charts"],
  };
}
