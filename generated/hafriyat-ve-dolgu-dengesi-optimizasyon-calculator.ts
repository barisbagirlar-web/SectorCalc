// Auto-generated from hafriyat-ve-dolgu-dengesi-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HafriyatVeDolguDengesiOptimizasyonCalculatorInput {
  excavationVolume: number;
  fillVolume: number;
  soilType: 'kil' | 'kum' | 'kaya' | 'balcik';
  swellFactor: number;
  compactionFactor: number;
  transportDistance: number;
  unitCostExcavation: number;
  unitCostFill: number;
  unitCostTransport: number;
  dataConfidence: number;
}

export const HafriyatVeDolguDengesiOptimizasyonCalculatorInputSchema = z.object({
  excavationVolume: z.number().min(0).default(1000),
  fillVolume: z.number().min(0).default(800),
  soilType: z.enum(['kil', 'kum', 'kaya', 'balcik']).default('kil'),
  swellFactor: z.number().min(0).max(100).default(25),
  compactionFactor: z.number().min(0).max(100).default(90),
  transportDistance: z.number().min(0).default(10),
  unitCostExcavation: z.number().min(0).default(50),
  unitCostFill: z.number().min(0).default(40),
  unitCostTransport: z.number().min(0).default(2),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface HafriyatVeDolguDengesiOptimizasyonCalculatorOutput {
  totalCost: number;
  breakdown: {
    excavationCost: number;
    fillCost: number;
    transportCost: number;
    netBalance: number;
    costPerM3: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HafriyatVeDolguDengesiOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.excavatedSwollen = ((): number => { try { const __v = input.excavationVolume * (1 + input.swellFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillCompacted = ((): number => { try { const __v = input.fillVolume / (input.compactionFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netBalance = ((): number => { try { const __v = results.excavatedSwollen - results.fillCompacted; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.transportVolume = ((): number => { try { const __v = Math.Math.abs(results.netBalance); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.excavationVolume * input.unitCostExcavation + input.fillVolume * input.unitCostFill + results.transportVolume * input.transportDistance * input.unitCostTransport; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerM3 = ((): number => { try { const __v = results.totalCost / (input.excavationVolume + input.fillVolume); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHafriyatVeDolguDengesiOptimizasyonCalculator(input: HafriyatVeDolguDengesiOptimizasyonCalculatorInput): HafriyatVeDolguDengesiOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    excavationCost: results.excavationCost,
    fillCost: results.fillCost,
    transportCost: results.transportCost,
    netBalance: results.netBalance,
    costPerM3: results.costPerM3,
  };

  // rule: excavationVolume > 0
  // rule: fillVolume > 0
  // rule: swellFactor >= 0 && swellFactor <= 100
  // rule: compactionFactor >= 0 && compactionFactor <= 100
  // rule: transportDistance >= 0
  // rule: unitCostExcavation > 0
  // rule: unitCostFill > 0
  // rule: unitCostTransport > 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (netBalance < 0) hiddenLossDrivers.push("netBalance");
  if (totalCost > 100000) hiddenLossDrivers.push("Yuksek maliyet uyarisi");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli maliyet dokumu"],
  };
}
