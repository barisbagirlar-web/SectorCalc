// Auto-generated from topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInput {
  initialWeight: number;
  weightReductionPercent: number;
  annualDistance: number;
  fuelConsumption: number;
  fuelPrice: number;
  optimizationCost: number;
  productionVolume: number;
  materialCostPerKg: number;
  vehicleLifespan: number;
  discountRate: number;
}

export const TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputSchema = z.object({
  initialWeight: z.number().min(1).max(100000).default(100),
  weightReductionPercent: z.number().min(0).max(80).default(20),
  annualDistance: z.number().min(1000).max(500000).default(20000),
  fuelConsumption: z.number().min(1).max(50).default(8),
  fuelPrice: z.number().min(0.1).max(10).default(1.5),
  optimizationCost: z.number().min(0).max(1000000).default(5000),
  productionVolume: z.number().min(1).max(1000000).default(1000),
  materialCostPerKg: z.number().min(0.1).max(100).default(5),
  vehicleLifespan: z.number().min(1).max(30).default(10),
  discountRate: z.number().min(0).max(20).default(5),
});

export interface TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorOutput {
  netSaving: number;
  breakdown: {
    annualFuelSaving: number;
    annualMaterialCostSaving: number;
    totalSavingOverLifespan: number;
    paybackPeriod: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.weightSaved = ((): number => { try { const __v = input.initialWeight * (input.weightReductionPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCostSavingPerUnit = ((): number => { try { const __v = results.weightSaved * input.materialCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaterialCostSaving = ((): number => { try { const __v = results.materialCostSavingPerUnit * input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelSavingPer100km = ((): number => { try { const __v = results.weightSaved * 0.0005; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualFuelSaving = ((): number => { try { const __v = results.fuelSavingPer100km * (input.annualDistance / 100) * input.fuelPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualTotalSaving = ((): number => { try { const __v = results.annualMaterialCostSaving + results.annualFuelSaving; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSavingOverLifespan = ((): number => { try { const __v = results.annualTotalSaving * ((1 - (1 + input.discountRate/100)^(-input.vehicleLifespan)) / (input.discountRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netSaving = ((): number => { try { const __v = results.totalSavingOverLifespan - input.optimizationCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.optimizationCost / results.annualTotalSaving; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.netSaving / input.optimizationCost) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(input: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInput): TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorOutput {
  const results = evaluateFormulas(input);
  const netSaving = results.netSaving ?? 0;
  const breakdown = {
    annualFuelSaving: results.annualFuelSaving,
    annualMaterialCostSaving: results.annualMaterialCostSaving,
    totalSavingOverLifespan: results.totalSavingOverLifespan,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
  };

  // rule: weightReductionPercent >= 0 AND weightReductionPercent <= 80
  // rule: initialWeight > 0
  // rule: annualDistance >= 1000
  // rule: fuelConsumption > 0
  // rule: fuelPrice > 0
  // rule: optimizationCost >= 0
  // rule: productionVolume >= 1
  // rule: materialCostPerKg > 0
  // rule: vehicleLifespan >= 1
  // rule: discountRate >= 0 AND discountRate <= 20
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High weight reduction may require advanced materials or compromise structural integrity.
  // threshold skipped (non-JS): High fuel consumption indicates inefficient vehicle; savings may be overestimated.
  // threshold skipped (non-JS): Optimization cost is high; consider alternative methods.

  const dataConfidenceAdjusted = (() => { try { return results.netSaving * (1 - 0.1); } catch { return netSaving; } })();

  return {
    netSaving,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Baseline","Detailed Report with Charts"],
  };
}
