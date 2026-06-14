// Auto-generated from kumas-serim-ve-kesim-optimizasyon-fire-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KumasSerimVeKesimOptimizasyonFireCalculatorInput {
  fabricWidth: number;
  fabricLength: number;
  patternLength: number;
  patternWidth: number;
  layers: number;
  markerEfficiency: number;
  defectRate: number;
  fabricCostPerMeter: number;
  laborCostPerHour: number;
  cuttingTimePerLayer: number;
  spreadingTimePerLayer: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const KumasSerimVeKesimOptimizasyonFireCalculatorInputSchema = z.object({
  fabricWidth: z.number().min(50).max(300).default(150),
  fabricLength: z.number().min(1).max(1000).default(100),
  patternLength: z.number().min(10).max(500).default(100),
  patternWidth: z.number().min(5).max(200).default(50),
  layers: z.number().min(1).max(500).default(50),
  markerEfficiency: z.number().min(50).max(100).default(85),
  defectRate: z.number().min(0).max(20).default(3),
  fabricCostPerMeter: z.number().min(1).max(1000).default(50),
  laborCostPerHour: z.number().min(10).max(200).default(30),
  cuttingTimePerLayer: z.number().min(5).max(300).default(30),
  spreadingTimePerLayer: z.number().min(5).max(200).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface KumasSerimVeKesimOptimizasyonFireCalculatorOutput {
  totalCost: number;
  breakdown: {
    fabricWasteCost: number;
    laborCost: number;
    wastePercentage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KumasSerimVeKesimOptimizasyonFireCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalFabricLength = ((): number => { try { const __v = input.fabricLength * input.layers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.usableFabricLength = ((): number => { try { const __v = results.totalFabricLength * (1 - input.defectRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalPatternArea = ((): number => { try { const __v = input.patternLength * input.patternWidth * input.layers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFabricArea = ((): number => { try { const __v = input.fabricWidth * results.usableFabricLength; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.markerArea = ((): number => { try { const __v = results.totalPatternArea / (input.markerEfficiency/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fabricWaste = ((): number => { try { const __v = results.totalFabricArea - results.markerArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fabricWasteCost = ((): number => { try { const __v = results.fabricWaste * input.fabricCostPerMeter / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborTime = ((): number => { try { const __v = (input.spreadingTimePerLayer + input.cuttingTimePerLayer) * input.layers / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.totalLaborTime * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.fabricWasteCost + results.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wastePercentage = ((): number => { try { const __v = (results.fabricWaste / results.totalFabricArea) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalCost * 1.1 : (input.dataConfidence == 'medium' ? results.totalCost * 1.05 : results.totalCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKumasSerimVeKesimOptimizasyonFireCalculator(input: KumasSerimVeKesimOptimizasyonFireCalculatorInput): KumasSerimVeKesimOptimizasyonFireCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fabricWasteCost: results.fabricWasteCost,
    laborCost: results.laborCost,
    wastePercentage: results.wastePercentage,
  };

  // rule: fabricWidth >= patternWidth
  // rule: fabricLength >= patternLength
  // rule: markerEfficiency between 50 and 100
  // rule: defectRate between 0 and 20
  // rule: layers >= 1
  // rule: fabricCostPerMeter > 0
  // rule: laborCostPerHour > 0
  // rule: cuttingTimePerLayer > 0
  // rule: spreadingTimePerLayer > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kumas hata orani yuksek, fire artabilir.
  // threshold skipped (non-JS): Marker verimliligi dusuk, optimizasyon onerilir.
  // threshold skipped (non-JS): Cok katli serim, kalite riski artabilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
