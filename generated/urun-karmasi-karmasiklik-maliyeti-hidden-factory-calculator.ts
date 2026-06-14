// Auto-generated from urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInput {
  productCount: number;
  totalProductionVolume: number;
  averageBatchSize: number;
  setupTimePerChangeover: number;
  hourlyLaborCost: number;
  defectRate: number;
  reworkCostPerUnit: number;
  inventoryHoldingCostRate: number;
  averageInventoryValue: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputSchema = z.object({
  productCount: z.number().min(1).max(10000).default(10),
  totalProductionVolume: z.number().min(1).max(100000000).default(100000),
  averageBatchSize: z.number().min(1).max(100000).default(100),
  setupTimePerChangeover: z.number().min(0).max(480).default(30),
  hourlyLaborCost: z.number().min(0).max(200).default(25),
  defectRate: z.number().min(0).max(100).default(2),
  reworkCostPerUnit: z.number().min(0).max(1000).default(5),
  inventoryHoldingCostRate: z.number().min(0).max(100).default(20),
  averageInventoryValue: z.number().min(0).max(100000000).default(500000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorOutput {
  hiddenFactoryCost: number;
  breakdown: {
    setupLaborCost: number;
    reworkCost: number;
    inventoryHoldingCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.numberOfChangeovers = ((): number => { try { const __v = input.totalProductionVolume / input.averageBatchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSetupTimeHours = ((): number => { try { const __v = results.numberOfChangeovers * (input.setupTimePerChangeover / 60); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupLaborCost = ((): number => { try { const __v = results.totalSetupTimeHours * input.hourlyLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectQuantity = ((): number => { try { const __v = input.totalProductionVolume * (input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = results.defectQuantity * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryHoldingCost = ((): number => { try { const __v = input.averageInventoryValue * (input.inventoryHoldingCostRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hiddenFactoryCost = ((): number => { try { const __v = results.setupLaborCost + results.reworkCost + results.inventoryHoldingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.hiddenFactoryCost / input.totalProductionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.hiddenFactoryCost * 1.2 : (input.dataConfidence == 'medium' ? results.hiddenFactoryCost * 1.1 : results.hiddenFactoryCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(input: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInput): UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorOutput {
  const results = evaluateFormulas(input);
  const hiddenFactoryCost = results.hiddenFactoryCost ?? 0;
  const breakdown = {
    setupLaborCost: results.setupLaborCost,
    reworkCost: results.reworkCost,
    inventoryHoldingCost: results.inventoryHoldingCost,
  };

  // rule: productCount must be >= 1
  // rule: totalProductionVolume must be >= 1
  // rule: averageBatchSize must be >= 1
  // rule: setupTimePerChangeover must be >= 0
  // rule: hourlyLaborCost must be >= 0
  // rule: defectRate must be between 0 and 100
  // rule: reworkCostPerUnit must be >= 0
  // rule: inventoryHoldingCostRate must be between 0 and 100
  // rule: averageInventoryValue must be >= 0
  // rule: If dataConfidence is 'low', then defectRate must be increased by 20% for calculation
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): defectRate > 5 -> 'Kritik: Hata orani %5 uzerinde, kalite iyilestirme gerekli'
  // threshold skipped (non-JS): setupTimePerChangeover > 60 -> 'Uyari: Set-up suresi 60 dakikadan fazla, SMED uygulanmali'
  // threshold skipped (non-JS): inventoryHoldingCostRate > 25 -> 'Uyari: Stok tasima maliyeti orani yuksek, stok optimizasyonu onerilir'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return hiddenFactoryCost; } })();

  return {
    hiddenFactoryCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli maliyet kirilimi"],
  };
}
