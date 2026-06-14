// Auto-generated from filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInput {
  materialType: 'filament' | 'recine' | 'toz';
  materialCostPerKg: number;
  partWeightGrams: number;
  productionVolume: number;
  scrapRate: number;
  recycleRate: number;
  recycleCostPerKg: number;
  laborCostPerHour: number;
  cycleTimeMinutes: number;
  machineCostPerHour: number;
  energyCostPerKwh: number;
  powerConsumptionKw: number;
  dataConfidence: number;
}

export const FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputSchema = z.object({
  materialType: z.enum(['filament', 'recine', 'toz']).default('filament'),
  materialCostPerKg: z.number().min(0).default(100),
  partWeightGrams: z.number().min(0).default(50),
  productionVolume: z.number().min(0).default(10000),
  scrapRate: z.number().min(0).max(100).default(5),
  recycleRate: z.number().min(0).max(100).default(0),
  recycleCostPerKg: z.number().min(0).default(20),
  laborCostPerHour: z.number().min(0).default(50),
  cycleTimeMinutes: z.number().min(0).default(10),
  machineCostPerHour: z.number().min(0).default(100),
  energyCostPerKwh: z.number().min(0).default(1.5),
  powerConsumptionKw: z.number().min(0).default(5),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorOutput {
  costPerPart: number;
  breakdown: {
    totalMaterialCost: number;
    scrapMaterialCost: number;
    recycleSavings: number;
    netScrapCost: number;
    totalLaborCost: number;
    totalMachineCost: number;
    totalEnergyCost: number;
    totalProductionCost: number;
    effectiveScrapRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalMaterialCost = ((): number => { try { const __v = input.productionVolume * (input.partWeightGrams / 1000) * input.materialCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scrapMaterialCost = ((): number => { try { const __v = results.totalMaterialCost * (input.scrapRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.recycleSavings = ((): number => { try { const __v = results.scrapMaterialCost * (input.recycleRate / 100) * (1 - input.recycleCostPerKg / input.materialCostPerKg); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netScrapCost = ((): number => { try { const __v = results.scrapMaterialCost - results.recycleSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.productionVolume * (input.cycleTimeMinutes / 60) * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMachineCost = ((): number => { try { const __v = input.productionVolume * (input.cycleTimeMinutes / 60) * input.machineCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalEnergyCost = ((): number => { try { const __v = input.productionVolume * (input.cycleTimeMinutes / 60) * input.powerConsumptionKw * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalProductionCost = ((): number => { try { const __v = results.totalMaterialCost + results.totalLaborCost + results.totalMachineCost + results.totalEnergyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPart = ((): number => { try { const __v = results.totalProductionCost / input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveScrapRate = ((): number => { try { const __v = input.scrapRate * (1 - input.recycleRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.costPerPart * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(input: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInput): FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorOutput {
  const results = evaluateFormulas(input);
  const costPerPart = results.costPerPart ?? 0;
  const breakdown = {
    totalMaterialCost: results.totalMaterialCost,
    scrapMaterialCost: results.scrapMaterialCost,
    recycleSavings: results.recycleSavings,
    netScrapCost: results.netScrapCost,
    totalLaborCost: results.totalLaborCost,
    totalMachineCost: results.totalMachineCost,
    totalEnergyCost: results.totalEnergyCost,
    totalProductionCost: results.totalProductionCost,
    effectiveScrapRate: results.effectiveScrapRate,
  };

  // rule: scrapRate >= 0 && scrapRate <= 100
  // rule: recycleRate >= 0 && recycleRate <= 100
  // rule: materialCostPerKg > 0
  // rule: partWeightGrams > 0
  // rule: productionVolume > 0
  // rule: cycleTimeMinutes > 0
  // rule: laborCostPerHour >= 0
  // rule: machineCostPerHour >= 0
  // rule: energyCostPerKwh >= 0
  // rule: powerConsumptionKw >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  // rule: if recycleRate > 0 then recycleCostPerKg > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.scrapRate > 10) hiddenLossDrivers.push("Yuksek fire orani: Surec iyilestirme onerilir.");
  if (input.recycleRate < 20) hiddenLossDrivers.push("Dusuk geri donusum orani: Cevresel etki ve maliyet avantaji kaciriliyor.");
  if (input.dataConfidence < 0.7) hiddenLossDrivers.push("Dusuk veri guveni: Sonuclar daha az guvenilir.");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return costPerPart; } })();

  return {
    costPerPart,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli malzeme turleri arasinda)","Detayli rapor (fire kaynaklari, maliyet dagilimi)"],
  };
}
