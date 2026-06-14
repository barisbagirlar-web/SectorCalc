// Auto-generated from yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInput {
  annualDemand: number;
  leadTimeDays: number;
  serviceLevel: number;
  unitCost: number;
  orderingCost: number;
  holdingCostRate: number;
  downtimeCostPerHour: number;
  repairTimeHours: number;
  demandVariability: number;
  leadTimeVariability: number;
  criticality: 'dusuk' | 'orta' | 'yuksek';
}

export const YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInputSchema = z.object({
  annualDemand: z.number().min(1).max(1000000).default(1000),
  leadTimeDays: z.number().min(1).max(365).default(30),
  serviceLevel: z.number().min(50).max(99.99).default(95),
  unitCost: z.number().min(1).max(1000000).default(500),
  orderingCost: z.number().min(0).max(10000).default(100),
  holdingCostRate: z.number().min(0).max(100).default(20),
  downtimeCostPerHour: z.number().min(0).max(1000000).default(10000),
  repairTimeHours: z.number().min(0.5).max(168).default(4),
  demandVariability: z.number().min(0).max(100).default(2),
  leadTimeVariability: z.number().min(0).max(100).default(5),
  criticality: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalInventoryCost: number;
    expectedDowntimeCostPerYear: number;
    safetyStock: number;
    reorderPoint: number;
    economicOrderQuantity: number;
    averageInventory: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyDemand = ((): number => { try { const __v = input.annualDemand / 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.economicOrderQuantity = ((): number => { try { const __v = Math.sqrt(2 * input.annualDemand * input.orderingCost / (input.unitCost * input.holdingCostRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualOrderingCost = ((): number => { try { const __v = (input.annualDemand / results.economicOrderQuantity) * input.orderingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.stockoutProbability = ((): number => { try { const __v = 1 - input.serviceLevel/100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDowntimeHoursPerYear = ((): number => { try { const __v = results.stockoutProbability * (input.annualDemand / results.economicOrderQuantity) * input.repairTimeHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDowntimeCostPerYear = ((): number => { try { const __v = results.expectedDowntimeHoursPerYear * input.downtimeCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.serviceLevelZScore = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.safetyStock = ((): number => { try { const __v = results.serviceLevelZScore(input.serviceLevel/100) * Math.sqrt(input.leadTimeDays * input.demandVariability^2 + (results.dailyDemand^2 * input.leadTimeVariability^2)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reorderPoint = ((): number => { try { const __v = results.dailyDemand * input.leadTimeDays + results.safetyStock; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.averageInventory = ((): number => { try { const __v = results.economicOrderQuantity / 2 + results.safetyStock; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualHoldingCost = ((): number => { try { const __v = results.averageInventory * input.unitCost * input.holdingCostRate/100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInventoryCost = ((): number => { try { const __v = results.annualHoldingCost + results.annualOrderingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalInventoryCost + results.expectedDowntimeCostPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculator(input: YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorInput): YedekParcaStokSeviyesiVeDurusRiskiOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalInventoryCost: results.totalInventoryCost,
    expectedDowntimeCostPerYear: results.expectedDowntimeCostPerYear,
    safetyStock: results.safetyStock,
    reorderPoint: results.reorderPoint,
    economicOrderQuantity: results.economicOrderQuantity,
    averageInventory: results.averageInventory,
  };

  // rule: annualDemand > 0
  // rule: leadTimeDays > 0
  // rule: serviceLevel >= 50 and serviceLevel <= 99.99
  // rule: unitCost > 0
  // rule: orderingCost >= 0
  // rule: holdingCostRate >= 0 and holdingCostRate <= 100
  // rule: downtimeCostPerHour >= 0
  // rule: repairTimeHours > 0
  // rule: demandVariability >= 0
  // rule: leadTimeVariability >= 0
  // rule: if criticality == 'yuksek' then serviceLevel >= 95 else true
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.serviceLevel < 90) hiddenLossDrivers.push("serviceLevel");
  if (input.downtimeCostPerHour > 50000) hiddenLossDrivers.push("downtimeCostPerHour");
  if (input.holdingCostRate > 30) hiddenLossDrivers.push("holdingCostRate");

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 + (input.demandVariability / 100)); } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle)","Karsilastirma (farkli senaryolar)","Detayli rapor (grafiklerle)"],
  };
}
