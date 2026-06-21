// Auto-generated premium calculator: su-kullanm-optimize-edici
import * as z from 'zod';

export interface SuKullanmOptimizeEdiciInput {
  toplamTuketimGeriDonusumM3: number;
  UretimHacmi: number;
  SebekeAtıksuBirimFiyatıCurrencym3: number;
  suEnerjiYogunluguKWhm3: number;
  kacakMiktarıM3: number;
  ekipmanYatırımı: number;
  IskontoOranı: number;
}

export const SuKullanmOptimizeEdiciInputSchema = z.object({
  toplamTuketimGeriDonusumM3: z.number().min(0).default(0),
  UretimHacmi: z.number().min(0).default(0),
  SebekeAtıksuBirimFiyatıCurrencym3: z.number().min(0).default(0),
  suEnerjiYogunluguKWhm3: z.number().min(0).default(0),
  kacakMiktarıM3: z.number().min(0).default(0),
  ekipmanYatırımı: z.number().min(0).default(0),
  IskontoOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalWaterConsumed * input.productionVolume; results["waterIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterIntensity"] = Number.NaN; }
  try { const v = input.historicalAvg * input.productionVolume; results["baselineConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baselineConsumption"] = Number.NaN; }
  try { const v = input.baselineConsumption * input.actualConsumption; results["waterSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterSavings"] = Number.NaN; }
  try { const v = input.waterSavings * input.waterSupplyRate * input.wastewaterTreatmentRate; results["costSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSavings"] = Number.NaN; }
  try { const v = input.recycledWater * input.totalWaterConsumed; results["recycleRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recycleRate"] = Number.NaN; }
  try { const v = input.totalSupplied * input.totalMetered; results["leakLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leakLoss"] = Number.NaN; }
  try { const v = input.costSavings * input.equipmentCost * input.installationCost; results["rOIWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOIWater"] = Number.NaN; }
  try { const v = input.totalConsumed * input.energyIntensityWater * input.gridEmissionFactor; results["carbonFootprintWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonFootprintWater"] = Number.NaN; }
  return results;
}

export function calculateSuKullanmOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
