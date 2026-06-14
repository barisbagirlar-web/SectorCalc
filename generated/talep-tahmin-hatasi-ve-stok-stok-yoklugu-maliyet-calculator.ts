// Auto-generated from talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInput {
  forecastErrorPercent: number;
  averageDemand: number;
  leadTimeDays: number;
  unitCost: number;
  holdingCostPercent: number;
  stockoutCostPerUnit: number;
  safetyStockUnits: number;
  serviceLevel: number;
}

export const TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInputSchema = z.object({
  forecastErrorPercent: z.number().min(0).max(100).default(10),
  averageDemand: z.number().min(0).default(1000),
  leadTimeDays: z.number().min(1).max(365).default(30),
  unitCost: z.number().min(0).default(50),
  holdingCostPercent: z.number().min(0).max(100).default(20),
  stockoutCostPerUnit: z.number().min(0).default(100),
  safetyStockUnits: z.number().min(0).default(200),
  serviceLevel: z.number().min(0).max(100).default(95),
});

export interface TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalInventoryCost: number;
    stockoutCost: number;
    expectedDemandPerLeadTime: number;
    safetyStockNeeded: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.expectedDemandPerLeadTime = ((): number => { try { const __v = input.averageDemand * (input.leadTimeDays / 30); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.safetyStockNeeded = ((): number => { try { const __v = Math.sqrt(input.leadTimeDays/30) * input.forecastErrorPercent/100 * input.averageDemand * 1.645; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInventoryCost = ((): number => { try { const __v = (input.safetyStockUnits + results.expectedDemandPerLeadTime) * input.unitCost * (input.holdingCostPercent/100) / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedStockoutUnits = ((): number => { try { const __v = Math.max(0, (1 - input.serviceLevel/100) * input.averageDemand * (input.leadTimeDays/30)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.stockoutCost = ((): number => { try { const __v = results.expectedStockoutUnits * input.stockoutCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalInventoryCost + results.stockoutCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTalepTahminHatasiVeStokStokYokluguMaliyetCalculator(input: TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorInput): TalepTahminHatasiVeStokStokYokluguMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalInventoryCost: results.totalInventoryCost,
    stockoutCost: results.stockoutCost,
    expectedDemandPerLeadTime: results.expectedDemandPerLeadTime,
    safetyStockNeeded: results.safetyStockNeeded,
  };

  // rule: forecastErrorPercent >= 0 and forecastErrorPercent <= 100
  // rule: averageDemand > 0
  // rule: leadTimeDays > 0
  // rule: unitCost > 0
  // rule: holdingCostPercent >= 0 and holdingCostPercent <= 100
  // rule: stockoutCostPerUnit >= 0
  // rule: safetyStockUnits >= 0
  // rule: serviceLevel >= 0 and serviceLevel <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Tahmin hatasi yuksek, iyilestirme gerekli
  // threshold skipped (non-JS): Servis seviyesi dusuk, stok yoklugu riski yuksek
  // threshold skipped (non-JS): Stok tasima maliyeti orani yuksek, stok optimizasyonu onerilir

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 + (input.forecastErrorPercent/100) * 0.1); } catch { return totalCost; } })();

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
