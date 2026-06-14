// Auto-generated from takim-tutucu-ve-baglama-aparati-setup-suresi-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInput {
  setupTimeCurrent: number;
  numWorkers: number;
  hourlyLaborCost: number;
  numSetupsPerDay: number;
  machineHourlyCost: number;
  defectRateAfterSetup: number;
  productionRatePerHour: number;
  partCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInputSchema = z.object({
  setupTimeCurrent: z.number().min(0).max(480).default(30),
  numWorkers: z.number().min(1).max(5).default(1),
  hourlyLaborCost: z.number().min(0).max(200).default(25),
  numSetupsPerDay: z.number().min(0).max(20).default(2),
  machineHourlyCost: z.number().min(0).max(1000).default(100),
  defectRateAfterSetup: z.number().min(0).max(100).default(2),
  productionRatePerHour: z.number().min(0).max(10000).default(100),
  partCost: z.number().min(0).max(1000).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorOutput {
  totalCostPerDay: number;
  breakdown: {
    setupLaborCostPerDay: number;
    setupMachineCostPerDay: number;
    defectCostPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalSetupCostPerDay = ((): number => { try { const __v = input.numSetupsPerDay * input.setupTimeCurrent / 60 * (input.numWorkers * input.hourlyLaborCost + input.machineHourlyCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCostPerSetup = ((): number => { try { const __v = input.defectRateAfterSetup / 100 * input.productionRatePerHour * (input.setupTimeCurrent / 60) * input.partCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDefectCostPerDay = ((): number => { try { const __v = input.numSetupsPerDay * results.defectCostPerSetup; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerDay = ((): number => { try { const __v = results.totalSetupCostPerDay + results.totalDefectCostPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupTimeReductionPotential = ((): number => { try { const __v = input.setupTimeCurrent * 0.5; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.potentialSavingsPerDay = ((): number => { try { const __v = input.numSetupsPerDay * (results.setupTimeReductionPotential / 60) * (input.numWorkers * input.hourlyLaborCost + input.machineHourlyCost) + input.numSetupsPerDay * (input.defectRateAfterSetup / 100 * input.productionRatePerHour * (results.setupTimeReductionPotential / 60) * input.partCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCostPerDay * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTakimTutucuVeBaglamaAparatiSetupSuresiCalculator(input: TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorInput): TakimTutucuVeBaglamaAparatiSetupSuresiCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerDay = results.totalCostPerDay ?? 0;
  const breakdown = {
    setupLaborCostPerDay: results.setupLaborCostPerDay,
    setupMachineCostPerDay: results.setupMachineCostPerDay,
    defectCostPerDay: results.totalDefectCostPerDay,
  };

  // rule: setupTimeCurrent >= 0
  // rule: numWorkers >= 1
  // rule: hourlyLaborCost > 0
  // rule: numSetupsPerDay >= 0
  // rule: machineHourlyCost >= 0
  // rule: defectRateAfterSetup >= 0 and defectRateAfterSetup <= 100
  // rule: productionRatePerHour >= 0
  // rule: partCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High defect rate after setup; consider process stabilization improvements.
  // threshold skipped (non-JS): Setup time exceeds 60 minutes; SMED implementation recommended.
  // threshold skipped (non-JS): High number of setups; consider batch size optimization.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCostPerDay; } })();

  return {
    totalCostPerDay,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
