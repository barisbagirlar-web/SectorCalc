// Auto-generated from iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInput {
  projectDuration: number;
  scaffoldQuantity: number;
  formworkQuantity: number;
  dailyScaffoldCost: number;
  dailyFormworkCost: number;
  setupTime: number;
  dismantleTime: number;
  laborCostPerDay: number;
  numWorkers: number;
  optimizationMode: 'cost' | 'time' | 'balanced';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInputSchema = z.object({
  projectDuration: z.number().min(1).max(365).default(30),
  scaffoldQuantity: z.number().min(0).max(100000).default(1000),
  formworkQuantity: z.number().min(0).max(50000).default(500),
  dailyScaffoldCost: z.number().min(0).max(100).default(5),
  dailyFormworkCost: z.number().min(0).max(150).default(8),
  setupTime: z.number().min(0).max(30).default(2),
  dismantleTime: z.number().min(0).max(30).default(1),
  laborCostPerDay: z.number().min(0).max(5000).default(500),
  numWorkers: z.number().min(1).max(50).default(5),
  optimizationMode: z.enum(['cost', 'time', 'balanced']).default('cost'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface IskeleVeKalipKullanimSuresiOptimizasyonCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalScaffoldCost: number;
    totalFormworkCost: number;
    totalLaborCost: number;
    totalCostPerM2: number;
    effectiveUsageDays: number;
    costPerEffectiveDay: number;
    setupTimeRatio: number;
    dismantleTimeRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalScaffoldCost = ((): number => { try { const __v = input.scaffoldQuantity * input.dailyScaffoldCost * input.projectDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFormworkCost = ((): number => { try { const __v = input.formworkQuantity * input.dailyFormworkCost * input.projectDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.laborCostPerDay * (input.setupTime + input.dismantleTime) * input.numWorkers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalScaffoldCost + results.totalFormworkCost + results.totalLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerM2 = ((): number => { try { const __v = results.totalCost / (input.scaffoldQuantity + input.formworkQuantity); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupTimeRatio = ((): number => { try { const __v = input.setupTime / input.projectDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dismantleTimeRatio = ((): number => { try { const __v = input.dismantleTime / input.projectDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveUsageDays = ((): number => { try { const __v = input.projectDuration - input.setupTime - input.dismantleTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerEffectiveDay = ((): number => { try { const __v = results.totalCost / results.effectiveUsageDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizationScore = ((): number => { try { const __v = input.optimizationMode == 'cost' ? results.totalCost : (input.optimizationMode == 'time' ? input.projectDuration : results.totalCost * input.projectDuration); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalCost * 1.2 : (input.dataConfidence == 'medium' ? results.totalCost * 1.1 : results.totalCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIskeleVeKalipKullanimSuresiOptimizasyonCalculator(input: IskeleVeKalipKullanimSuresiOptimizasyonCalculatorInput): IskeleVeKalipKullanimSuresiOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalScaffoldCost: results.totalScaffoldCost,
    totalFormworkCost: results.totalFormworkCost,
    totalLaborCost: results.totalLaborCost,
    totalCostPerM2: results.totalCostPerM2,
    effectiveUsageDays: results.effectiveUsageDays,
    costPerEffectiveDay: results.costPerEffectiveDay,
    setupTimeRatio: results.setupTimeRatio,
    dismantleTimeRatio: results.dismantleTimeRatio,
  };

  // rule: setupTime + dismantleTime <= projectDuration
  // rule: scaffoldQuantity >= 0
  // rule: formworkQuantity >= 0
  // rule: dailyScaffoldCost >= 0
  // rule: dailyFormworkCost >= 0
  // rule: laborCostPerDay >= 0
  // rule: numWorkers >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 100
  // threshold skipped (non-JS): 0.3

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli maliyet kirilimi raporu"],
  };
}
