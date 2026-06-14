// Auto-generated from ups-kesintisiz-guc-kaynagi-secimi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface UpsKesintisizGucKaynagiSecimiInput {
  totalLoadPower: number;
  powerFactor: number;
  requiredRuntime: number;
  inputVoltage: '220' | '380' | '400' | '480';
  phaseType: '1-phase' | '3-phase';
  batteryType: 'VRLA' | 'Li-ion' | 'NiCd';
  ambientTemperature: number;
  efficiency: number;
  loadGrowthRate: number;
  redundancyLevel: 'N' | 'N+1' | '2N';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const UpsKesintisizGucKaynagiSecimiInputSchema = z.object({
  totalLoadPower: z.number().min(0.5).max(10000).default(10),
  powerFactor: z.number().min(0.5).max(1).default(0.8),
  requiredRuntime: z.number().min(5).max(480).default(15),
  inputVoltage: z.enum(['220', '380', '400', '480']).default('380'),
  phaseType: z.enum(['1-phase', '3-phase']).default('3-phase'),
  batteryType: z.enum(['VRLA', 'Li-ion', 'NiCd']).default('VRLA'),
  ambientTemperature: z.number().min(0).max(40).default(25),
  efficiency: z.number().min(80).max(99).default(95),
  loadGrowthRate: z.number().min(0).max(20).default(5),
  redundancyLevel: z.enum(['N', 'N+1', '2N']).default('N+1'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface UpsKesintisizGucKaynagiSecimiOutput {
  requiredCapacity: number;
  breakdown: {
    apparentPower: number;
    batteryCapacityAh: number;
    estimatedBatteryLifeYears: number;
    adjustedBatteryLife: number;
    totalCostOfOwnership: number;
    initialCost: number;
    maintenanceCostPerYear: number;
    energyCostPerYear: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: UpsKesintisizGucKaynagiSecimiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.apparentPower = ((): number => { try { const __v = input.totalLoadPower / input.powerFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.requiredCapacity = ((): number => { try { const __v = results.apparentPower * (1 + input.loadGrowthRate / 100) * (1 + (input.redundancyLevel == 'N' ? 0 : input.redundancyLevel == 'N+1' ? 0.5 : 1)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.batteryVoltage = ((): number => { try { const __v = input.phaseType == '1-phase' ? 48 : 240; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.depthOfDischarge = ((): number => { try { const __v = input.batteryType == 'VRLA' ? 0.8 : input.batteryType == 'Li-ion' ? 0.9 : 0.7; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.estimatedBatteryLifeYears = ((): number => { try { const __v = input.batteryType == 'VRLA' ? 5 : input.batteryType == 'Li-ion' ? 10 : 15; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.temperatureDerating = ((): number => { try { const __v = input.ambientTemperature > 25 ? 1 - (input.ambientTemperature - 25) * 0.005 : 1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedBatteryLife = ((): number => { try { const __v = results.estimatedBatteryLifeYears * results.temperatureDerating; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.initialCost = ((): number => { try { const __v = results.requiredCapacity * 200; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCostPerYear = ((): number => { try { const __v = results.requiredCapacity * 10; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCostPerYear = ((): number => { try { const __v = results.requiredCapacity * 8760 * (1 - input.efficiency/100) * 0.1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 0.95 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.confidenceAdjustedCapacity = ((): number => { try { const __v = results.requiredCapacity * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.batteryCapacityAh = ((): number => { try { const __v = (results.requiredCapacity * 1000 * input.requiredRuntime) / (60 * results.batteryVoltage * input.efficiency/100 * results.depthOfDischarge); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostOfOwnership = ((): number => { try { const __v = results.initialCost + (results.maintenanceCostPerYear * results.adjustedBatteryLife) + (results.energyCostPerYear * results.adjustedBatteryLife); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateUpsKesintisizGucKaynagiSecimi(input: UpsKesintisizGucKaynagiSecimiInput): UpsKesintisizGucKaynagiSecimiOutput {
  const results = evaluateFormulas(input);
  const requiredCapacity = results.requiredCapacity ?? 0;
  const breakdown = {
    apparentPower: results.apparentPower,
    batteryCapacityAh: results.batteryCapacityAh,
    estimatedBatteryLifeYears: results.estimatedBatteryLifeYears,
    adjustedBatteryLife: results.adjustedBatteryLife,
    totalCostOfOwnership: results.totalCostOfOwnership,
    initialCost: results.initialCost,
    maintenanceCostPerYear: results.maintenanceCostPerYear,
    energyCostPerYear: results.energyCostPerYear,
  };

  // rule: totalLoadPower > 0
  // rule: powerFactor > 0 and powerFactor <= 1
  // rule: requiredRuntime >= 5
  // rule: efficiency >= 80 and efficiency <= 99
  // rule: ambientTemperature >= 0 and ambientTemperature <= 40
  // rule: loadGrowthRate >= 0
  // rule: if phaseType == '1-phase' then inputVoltage == 220
  // rule: if phaseType == '3-phase' then inputVoltage in [380,400,480]
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk verim, enerji maliyetlerini artirir.
  // threshold skipped (non-JS): Yuksek sicaklik aku omrunu kisaltir.
  // threshold skipped (non-JS): Yuksek buyume orani kapasite yetersizligine yol acabilir.
  // threshold skipped (non-JS): Dusuk guc faktoru, UPS kapasitesini dusurur.

  const dataConfidenceAdjusted = (() => { try { return results.confidenceAdjustedCapacity (kVA); } catch { return requiredCapacity; } })();

  return {
    requiredCapacity,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi","Karsilastirma (farkli UPS modelleri)","Detayli maliyet dokumu"],
  };
}
