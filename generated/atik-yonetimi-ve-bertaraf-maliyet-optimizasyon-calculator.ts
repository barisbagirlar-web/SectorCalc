// Auto-generated from atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput {
  annualWasteVolume: number;
  wasteType: 'mixed' | 'organic' | 'recyclable' | 'hazardous' | 'construction';
  disposalMethod: 'landfill' | 'incineration' | 'recycling' | 'composting' | 'anaerobic_digestion';
  unitDisposalCost: number;
  transportCostPerTonKm: number;
  averageDistance: number;
  recyclingRevenuePerTon: number;
  laborCostPerHour: number;
  laborHoursPerTon: number;
  equipmentCostPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputSchema = z.object({
  annualWasteVolume: z.number().min(0).default(1000),
  wasteType: z.enum(['mixed', 'organic', 'recyclable', 'hazardous', 'construction']).default('mixed'),
  disposalMethod: z.enum(['landfill', 'incineration', 'recycling', 'composting', 'anaerobic_digestion']).default('landfill'),
  unitDisposalCost: z.number().min(0).default(50),
  transportCostPerTonKm: z.number().min(0).default(0.5),
  averageDistance: z.number().min(0).default(50),
  recyclingRevenuePerTon: z.number().min(0).default(20),
  laborCostPerHour: z.number().min(0).default(15),
  laborHoursPerTon: z.number().min(0).default(0.5),
  equipmentCostPerYear: z.number().min(0).default(10000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorOutput {
  totalCostPerTon: number;
  breakdown: {
    transportCost: number;
    disposalCost: number;
    laborCost: number;
    equipmentCost: number;
    recyclingRevenue: number;
    netCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.transportCost = (() => { try { return input.annualWasteVolume * input.transportCostPerTonKm * input.averageDistance; } catch { return 0; } })();
  results.disposalCost = (() => { try { return input.annualWasteVolume * input.unitDisposalCost; } catch { return 0; } })();
  results.laborCost = (() => { try { return input.annualWasteVolume * input.laborHoursPerTon * input.laborCostPerHour; } catch { return 0; } })();
  results.totalDirectCost = (() => { try { return results.transportCost + results.disposalCost + results.laborCost + input.equipmentCostPerYear; } catch { return 0; } })();
  results.recyclingRevenue = (() => { try { return input.annualWasteVolume * input.recyclingRevenuePerTon; } catch { return 0; } })();
  results.netCost = (() => { try { return results.totalDirectCost - results.recyclingRevenue; } catch { return 0; } })();
  results.totalCostPerTon = (() => { try { return results.netCost / input.annualWasteVolume; } catch { return 0; } })();
  results.recyclingRate = (() => { try { return 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(input: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput): AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerTon = results.totalCostPerTon ?? 0;
  const breakdown = {
    transportCost: results.transportCost,
    disposalCost: results.disposalCost,
    laborCost: results.laborCost,
    equipmentCost: results.equipmentCost,
    recyclingRevenue: results.recyclingRevenue,
    netCost: results.netCost,
  };

  // rule: annualWasteVolume > 0
  // rule: unitDisposalCost >= 0
  // rule: transportCostPerTonKm >= 0
  // rule: averageDistance >= 0
  // rule: recyclingRevenuePerTon >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerTon >= 0
  // rule: equipmentCostPerYear >= 0
  // rule: if wasteType == 'hazardous' then disposalMethod must be 'incineration' or 'landfill' (special handling)
  // rule: if disposalMethod == 'recycling' then recyclingRevenuePerTon > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): totalCostPerTon
  // threshold skipped (non-string): recyclingRate

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCostPerTon; } })();

  return {
    totalCostPerTon,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu disa aktarma","CSV veri disa aktarma","Trend analizi (gecmis verilerle karsilastirma)","Senaryo karsilastirma (farkli atik turleri/yontemleri)","Detayli maliyet kirilimi grafikleri"],
  };
}
