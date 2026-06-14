// Auto-generated from palet-ambalaj-kereste-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaletAmbalajKeresteHesabiInput {
  palletType: 'EUR' | 'ISO' | 'CUSTOM';
  woodType: 'Cam' | 'Mese' | 'Kayin' | 'Kavak';
  palletQuantity: number;
  woodMoisture: number;
  woodDensity: number;
  laborCostPerHour: number;
  machineCostPerHour: number;
  productionTimePerPallet: number;
  defectRate: number;
  woodCostPerCubicMeter: number;
  overheadRate: number;
  profitMargin: number;
  dataConfidence: number;
}

export const PaletAmbalajKeresteHesabiInputSchema = z.object({
  palletType: z.enum(['EUR', 'ISO', 'CUSTOM']).default('EUR'),
  woodType: z.enum(['Cam', 'Mese', 'Kayin', 'Kavak']).default('Cam'),
  palletQuantity: z.number().min(1).max(1000000).default(1000),
  woodMoisture: z.number().min(6).max(20).default(12),
  woodDensity: z.number().min(300).max(900).default(500),
  laborCostPerHour: z.number().min(0).max(500).default(50),
  machineCostPerHour: z.number().min(0).max(1000).default(100),
  productionTimePerPallet: z.number().min(1).max(60).default(5),
  defectRate: z.number().min(0).max(100).default(2),
  woodCostPerCubicMeter: z.number().min(0).max(10000).default(3000),
  overheadRate: z.number().min(0).max(100).default(15),
  profitMargin: z.number().min(0).max(100).default(20),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface PaletAmbalajKeresteHesabiOutput {
  costPerPallet: number;
  breakdown: {
    totalWoodCost: number;
    totalLaborCost: number;
    totalMachineCost: number;
    totalOverhead: number;
    totalCost: number;
    sellingPricePerPallet: number;
    totalProfit: number;
    defectCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaletAmbalajKeresteHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.woodVolumePerPallet = ((): number => { try { const __v = input.palletType === 'EUR' ? 0.045 : input.palletType === 'ISO' ? 0.054 : 0.05; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWoodVolume = ((): number => { try { const __v = input.palletQuantity * results.woodVolumePerPallet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWoodCost = ((): number => { try { const __v = results.totalWoodVolume * input.woodCostPerCubicMeter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.palletQuantity * (input.productionTimePerPallet / 60) * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMachineCost = ((): number => { try { const __v = input.palletQuantity * (input.productionTimePerPallet / 60) * input.machineCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.totalWoodCost + results.totalLaborCost + results.totalMachineCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalOverhead = ((): number => { try { const __v = results.totalDirectCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.totalOverhead; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPallet = ((): number => { try { const __v = results.totalCost / input.palletQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sellingPricePerPallet = ((): number => { try { const __v = results.costPerPallet / (1 - input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRevenue = ((): number => { try { const __v = results.sellingPricePerPallet * input.palletQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalProfit = ((): number => { try { const __v = results.totalRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCost = ((): number => { try { const __v = results.totalCost * (input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCostPerPallet = ((): number => { try { const __v = results.costPerPallet * (1 + input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.adjustedCostPerPallet * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaletAmbalajKeresteHesabi(input: PaletAmbalajKeresteHesabiInput): PaletAmbalajKeresteHesabiOutput {
  const results = evaluateFormulas(input);
  const costPerPallet = results.costPerPallet ?? 0;
  const breakdown = {
    totalWoodCost: results.totalWoodCost,
    totalLaborCost: results.totalLaborCost,
    totalMachineCost: results.totalMachineCost,
    totalOverhead: results.totalOverhead,
    totalCost: results.totalCost,
    sellingPricePerPallet: results.sellingPricePerPallet,
    totalProfit: results.totalProfit,
    defectCost: results.defectCost,
  };

  // rule: woodMoisture >= 6 && woodMoisture <= 20
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: productionTimePerPallet > 0
  // rule: laborCostPerHour >= 0
  // rule: machineCostPerHour >= 0
  // rule: woodCostPerCubicMeter >= 0
  // rule: overheadRate >= 0 && overheadRate <= 100
  // rule: profitMargin >= 0 && profitMargin <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Hata orani %5'in uzerinde, kalite iyilestirme gerekli.
  // threshold skipped (non-JS): Nem orani yuksek, kurutma maliyeti artabilir.
  // threshold skipped (non-JS): Uretim suresi uzun, verimlilik dusuk.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return costPerPallet; } })();

  return {
    costPerPallet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analizi","Karsilastirma","Detayli Rapor"],
  };
}
