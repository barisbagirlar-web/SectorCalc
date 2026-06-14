// Auto-generated from mtbf-mttr-ve-kullanilabilirlik-finansal-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MtbfMttrVeKullanilabilirlikFinansalCalculatorInput {
  operatingTime: number;
  totalDowntime: number;
  numberOfFailures: number;
  costPerDowntimeHour: number;
  maintenanceCostPerFailure: number;
  dataConfidence: number;
}

export const MtbfMttrVeKullanilabilirlikFinansalCalculatorInputSchema = z.object({
  operatingTime: z.number().min(0).max(8760).default(8760),
  totalDowntime: z.number().min(0).max(8760).default(100),
  numberOfFailures: z.number().min(0).max(10000).default(10),
  costPerDowntimeHour: z.number().min(0).max(1000000).default(1000),
  maintenanceCostPerFailure: z.number().min(0).max(1000000).default(5000),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface MtbfMttrVeKullanilabilirlikFinansalCalculatorOutput {
  totalCost: number;
  breakdown: {
    mtbf: number;
    mttr: number;
    availability: number;
    totalDowntimeCost: number;
    totalMaintenanceCost: number;
    costPerFailure: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MtbfMttrVeKullanilabilirlikFinansalCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.mtbf = ((): number => { try { const __v = input.operatingTime / input.numberOfFailures; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.mttr = ((): number => { try { const __v = input.totalDowntime / input.numberOfFailures; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.availability = ((): number => { try { const __v = (input.operatingTime - input.totalDowntime) / input.operatingTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDowntimeCost = ((): number => { try { const __v = input.totalDowntime * input.costPerDowntimeHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMaintenanceCost = ((): number => { try { const __v = input.numberOfFailures * input.maintenanceCostPerFailure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDowntimeCost + results.totalMaintenanceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerFailure = ((): number => { try { const __v = results.totalCost / input.numberOfFailures; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMtbfMttrVeKullanilabilirlikFinansalCalculator(input: MtbfMttrVeKullanilabilirlikFinansalCalculatorInput): MtbfMttrVeKullanilabilirlikFinansalCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    mtbf: results.mtbf,
    mttr: results.mttr,
    availability: results.availability,
    totalDowntimeCost: results.totalDowntimeCost,
    totalMaintenanceCost: results.totalMaintenanceCost,
    costPerFailure: results.costPerFailure,
  };

  // rule: operatingTime must be > 0
  // rule: totalDowntime must be >= 0 and <= operatingTime
  // rule: numberOfFailures must be >= 0
  // rule: costPerDowntimeHour must be >= 0
  // rule: maintenanceCostPerFailure must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): availability
  // threshold skipped (non-string): mtbf
  // threshold skipped (non-string): mttr

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 + (100 - input.dataConfidence) / 100); } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed breakdown report with charts"],
  };
}
