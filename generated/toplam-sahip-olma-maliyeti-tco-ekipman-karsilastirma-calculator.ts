// Auto-generated from toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInput {
  purchasePrice: number;
  annualMaintenanceCost: number;
  annualEnergyCost: number;
  annualOperatingCost: number;
  lifespanYears: number;
  salvageValue: number;
  discountRate: number;
  annualProductionVolume: number;
  defectRate: number;
  downtimeHoursPerYear: number;
  costPerDowntimeHour: number;
  inflationRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInputSchema = z.object({
  purchasePrice: z.number().min(0).default(100000),
  annualMaintenanceCost: z.number().min(0).default(5000),
  annualEnergyCost: z.number().min(0).default(12000),
  annualOperatingCost: z.number().min(0).default(8000),
  lifespanYears: z.number().min(1).max(50).default(10),
  salvageValue: z.number().min(0).default(10000),
  discountRate: z.number().min(0).max(100).default(8),
  annualProductionVolume: z.number().min(0).default(50000),
  defectRate: z.number().min(0).max(100).default(2),
  downtimeHoursPerYear: z.number().min(0).max(8760).default(100),
  costPerDowntimeHour: z.number().min(0).default(500),
  inflationRate: z.number().min(0).max(100).default(2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorOutput {
  totalCostOfOwnership: number;
  breakdown: {
    initialInvestment: number;
    maintenanceCost: number;
    energyCost: number;
    operatingCost: number;
    qualityCost: number;
    downtimeCost: number;
    salvageValueDiscounted: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.reworkCostPerUnit = ((): number => { try { const __v = 10; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostOfOwnership = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualRecurringCost = ((): number => { try { const __v = input.annualMaintenanceCost + input.annualEnergyCost + input.annualOperatingCost + (input.defectRate/100)*input.annualProductionVolume*results.reworkCostPerUnit + input.downtimeHoursPerYear*input.costPerDowntimeHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedTCO = ((): number => { try { const __v = results.totalCostOfOwnership * (1 + (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator(input: ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorInput): ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostOfOwnership = results.totalCostOfOwnership ?? 0;
  const breakdown = {
    initialInvestment: results.initialInvestment,
    maintenanceCost: results.maintenanceCost,
    energyCost: results.energyCost,
    operatingCost: results.operatingCost,
    qualityCost: results.qualityCost,
    downtimeCost: results.downtimeCost,
    salvageValueDiscounted: results.salvageValueDiscounted,
  };

  // rule: purchasePrice >= 0
  // rule: annualMaintenanceCost >= 0
  // rule: annualEnergyCost >= 0
  // rule: annualOperatingCost >= 0
  // rule: lifespanYears >= 1
  // rule: salvageValue >= 0
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: annualProductionVolume >= 0
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: downtimeHoursPerYear >= 0 && downtimeHoursPerYear <= 8760
  // rule: costPerDowntimeHour >= 0
  // rule: inflationRate >= 0 && inflationRate <= 100
  // rule: salvageValue <= purchasePrice
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek hata orani kalite maliyetlerini artirir.
  // threshold skipped (non-JS): Asiri ariza suresi verimliligi dusurur.
  // threshold skipped (non-JS): Bakim maliyeti satin alma fiyatinin %10'unu asiyor.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedTCO; } catch { return totalCostOfOwnership; } })();

  return {
    totalCostOfOwnership,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (zaman serisi)","Ekipman karsilastirma (birden fazla ekipman)","Detayli maliyet kirilimi grafikleri"],
  };
}
