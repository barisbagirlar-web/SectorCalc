// Auto-generated from yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInput {
  annualProductionVolume: number;
  adhesiveCostPerUnit: number;
  sealantCostPerUnit: number;
  adhesiveWasteRate: number;
  sealantWasteRate: number;
  defectRate: number;
  reworkCostPerUnit: number;
  laborCostPerHour: number;
  applicationTimePerUnit: number;
  materialType: 'standard' | 'high-performance' | 'eco-friendly';
  dataConfidence: number;
}

export const YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInputSchema = z.object({
  annualProductionVolume: z.number().min(0).default(100000),
  adhesiveCostPerUnit: z.number().min(0).default(0.5),
  sealantCostPerUnit: z.number().min(0).default(0.3),
  adhesiveWasteRate: z.number().min(0).max(100).default(5),
  sealantWasteRate: z.number().min(0).max(100).default(5),
  defectRate: z.number().min(0).max(100).default(2),
  reworkCostPerUnit: z.number().min(0).default(1),
  laborCostPerHour: z.number().min(0).default(25),
  applicationTimePerUnit: z.number().min(0).default(0.1),
  materialType: z.enum(['standard', 'high-performance', 'eco-friendly']).default('standard'),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorOutput {
  costPerUnit: number;
  breakdown: {
    totalMaterialCost: number;
    totalWasteCost: number;
    totalDefectCost: number;
    totalLaborCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalMaterialCost = ((): number => { try { const __v = input.annualProductionVolume * (input.adhesiveCostPerUnit + input.sealantCostPerUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteCost = ((): number => { try { const __v = input.annualProductionVolume * (input.adhesiveCostPerUnit * input.adhesiveWasteRate/100 + input.sealantCostPerUnit * input.sealantWasteRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDefectCost = ((): number => { try { const __v = input.annualProductionVolume * input.defectRate/100 * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.annualProductionVolume * input.applicationTimePerUnit * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalMaterialCost + results.totalWasteCost + results.totalDefectCost + results.totalLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.totalCost / input.annualProductionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteReductionPotential = ((): number => { try { const __v = results.totalWasteCost * (1 - input.dataConfidence/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence)/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculator(input: YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorInput): YapistiriciVeSizdirmazlikMalzemesiTuketimOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const costPerUnit = results.costPerUnit ?? 0;
  const breakdown = {
    totalMaterialCost: results.totalMaterialCost,
    totalWasteCost: results.totalWasteCost,
    totalDefectCost: results.totalDefectCost,
    totalLaborCost: results.totalLaborCost,
  };

  // rule: annualProductionVolume >= 0
  // rule: adhesiveCostPerUnit >= 0
  // rule: sealantCostPerUnit >= 0
  // rule: adhesiveWasteRate >= 0 and adhesiveWasteRate <= 100
  // rule: sealantWasteRate >= 0 and sealantWasteRate <= 100
  // rule: defectRate >= 0 and defectRate <= 100
  // rule: reworkCostPerUnit >= 0
  // rule: laborCostPerHour >= 0
  // rule: applicationTimePerUnit >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High adhesive waste rate; consider process improvement.
  // threshold skipped (non-JS): High sealant waste rate; consider process improvement.
  // threshold skipped (non-JS): Critical defect rate; immediate quality action required.
  // threshold skipped (non-JS): Labor cost above benchmark; review efficiency.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return costPerUnit; } })();

  return {
    costPerUnit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
