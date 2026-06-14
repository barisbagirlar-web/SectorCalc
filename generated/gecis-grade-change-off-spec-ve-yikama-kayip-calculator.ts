// Auto-generated from gecis-grade-change-off-spec-ve-yikama-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface GecisGradeChangeOffSpecVeYikamaKayipCalculatorInput {
  annualProductionVolume: number;
  gradeChangeFrequency: number;
  offSpecTimePerChange: number;
  washTimePerChange: number;
  productionRate: number;
  costPerTon: number;
  offSpecRecoveryRate: number;
  dataConfidence: number;
}

export const GecisGradeChangeOffSpecVeYikamaKayipCalculatorInputSchema = z.object({
  annualProductionVolume: z.number().min(0).default(100000),
  gradeChangeFrequency: z.number().min(0).default(50),
  offSpecTimePerChange: z.number().min(0).default(2),
  washTimePerChange: z.number().min(0).default(1),
  productionRate: z.number().min(0).default(50),
  costPerTon: z.number().min(0).default(500),
  offSpecRecoveryRate: z.number().min(0).max(100).default(50),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface GecisGradeChangeOffSpecVeYikamaKayipCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalOffSpecTime: number;
    totalWashTime: number;
    totalLostTime: number;
    lostProductionTons: number;
    offSpecTons: number;
    recoveredTons: number;
    netLostTons: number;
    costPerGradeChange: number;
    lossRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalOffSpecTime = ((): number => { try { const __v = input.gradeChangeFrequency * input.offSpecTimePerChange; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWashTime = ((): number => { try { const __v = input.gradeChangeFrequency * input.washTimePerChange; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLostTime = ((): number => { try { const __v = results.totalOffSpecTime + results.totalWashTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lostProductionTons = ((): number => { try { const __v = results.totalLostTime * input.productionRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.offSpecTons = ((): number => { try { const __v = input.gradeChangeFrequency * input.offSpecTimePerChange * input.productionRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.recoveredTons = ((): number => { try { const __v = results.offSpecTons * (input.offSpecRecoveryRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netLostTons = ((): number => { try { const __v = results.lostProductionTons - results.recoveredTons; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.netLostTons * input.costPerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerGradeChange = ((): number => { try { const __v = results.totalCost / input.gradeChangeFrequency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossRatio = ((): number => { try { const __v = results.netLostTons / input.annualProductionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateGecisGradeChangeOffSpecVeYikamaKayipCalculator(input: GecisGradeChangeOffSpecVeYikamaKayipCalculatorInput): GecisGradeChangeOffSpecVeYikamaKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalOffSpecTime: results.totalOffSpecTime,
    totalWashTime: results.totalWashTime,
    totalLostTime: results.totalLostTime,
    lostProductionTons: results.lostProductionTons,
    offSpecTons: results.offSpecTons,
    recoveredTons: results.recoveredTons,
    netLostTons: results.netLostTons,
    costPerGradeChange: results.costPerGradeChange,
    lossRatio: results.lossRatio,
  };

  // rule: annualProductionVolume > 0
  // rule: gradeChangeFrequency >= 0
  // rule: offSpecTimePerChange >= 0
  // rule: washTimePerChange >= 0
  // rule: productionRate > 0
  // rule: costPerTon > 0
  // rule: offSpecRecoveryRate >= 0 && offSpecRecoveryRate <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if > 4 then 'High off-spec time - consider SMED improvements'
  // threshold skipped (non-JS): if > 2 then 'Excessive wash time - evaluate cleaning procedures'
  // threshold skipped (non-JS): if < 30 then 'Low recovery rate - investigate reprocessing efficiency'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
