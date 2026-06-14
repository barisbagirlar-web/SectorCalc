// Auto-generated from tesis-yerlesimi-ve-malzeme-akis-mesafe-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInput {
  numDepartments: number;
  distanceMatrix: number;
  flowMatrix: number;
  materialHandlingCostPerMeter: number;
  operatingDaysPerYear: number;
  layoutType: 'process' | 'product' | 'cellular' | 'fixed';
  optimizationCriterion: 'minimizeDistance' | 'minimizeCost' | 'minimizeTime';
  dataConfidence: number;
}

export const TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInputSchema = z.object({
  numDepartments: z.number().min(2).max(50).default(5),
  distanceMatrix: z.number().min(0).max(1000).default(0),
  flowMatrix: z.number().min(0).max(10000).default(0),
  materialHandlingCostPerMeter: z.number().min(0).max(100).default(0.5),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
  layoutType: z.enum(['process', 'product', 'cellular', 'fixed']).default('cellular'),
  optimizationCriterion: z.enum(['minimizeDistance', 'minimizeCost', 'minimizeTime']).default('minimizeDistance'),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalDistance: number;
    totalCost: number;
    averageDistancePerFlow: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDistance = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDistance * input.materialHandlingCostPerMeter * input.operatingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.averageDistancePerFlow = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculator(input: TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorInput): TesisYerlesimiVeMalzemeAkisMesafeOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalDistance: results.totalDistance,
    totalCost: results.totalCost,
    averageDistancePerFlow: results.averageDistancePerFlow,
  };

  // rule: numDepartments >= 2
  // rule: numDepartments <= 50
  // rule: distanceMatrix boyutu numDepartments x numDepartments olmali
  // rule: flowMatrix boyutu numDepartments x numDepartments olmali
  // rule: materialHandlingCostPerMeter >= 0
  // rule: operatingDaysPerYear >= 1
  // rule: operatingDaysPerYear <= 365
  // rule: dataConfidence >= 50
  // rule: dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): >10000 -> 'Yuksek toplam mesafe, yerlesim optimizasyonu onerilir'
  // threshold skipped (non-JS): >100000 -> 'Tasima maliyeti yuksek, surec iyilestirme gerekli'
  // threshold skipped (non-JS): <70 -> 'Veri guveni dusuk, sonuclar dikkatli yorumlanmali'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirmali senaryo analizi","Detayli rapor (grafiklerle)"],
  };
}
