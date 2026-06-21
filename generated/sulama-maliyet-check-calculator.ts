// Auto-generated premium calculator: sulama-maliyet-check
import * as z from 'zod';

export interface SulamaMaliyetCheckInput {
  eTcMmgun: number;
  alanDekar: number;
  efektifYagısMm: number;
  toplamManometrikYukseklikM: number;
  pompaMotorVerimi: number;
  elektrikTarifesiCurrencykWh: number;
  bakımCurrencyda: number;
}

export const SulamaMaliyetCheckInputSchema = z.object({
  eTcMmgun: z.number().min(0).default(0),
  alanDekar: z.number().min(0).default(0),
  efektifYagısMm: z.number().min(0).default(0),
  toplamManometrikYukseklikM: z.number().min(0).default(0),
  pompaMotorVerimi: z.number().min(0).default(0),
  elektrikTarifesiCurrencykWh: z.number().min(0).default(0),
  bakımCurrencyda: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.eTc * input.area * input.effectiveRainfall; results["waterRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterRequirement"] = Number.NaN; }
  try { const v = input.waterRequirement * input.totalHead * input.pumpEff * input.motorEff; results["pumpEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pumpEnergy"] = Number.NaN; }
  try { const v = input.pumpEnergy * input.elecRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = input.area * input.maintRatePerHa; results["maintCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maintCost"] = Number.NaN; }
  try { const v = input.energyCost * input.maintCost * input.laborCost * input.depreciation; results["totalIrrigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalIrrigationCost"] = Number.NaN; }
  try { const v = input.totalIrrigationCost * input.waterRequirement; results["costPerM3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerM3"] = Number.NaN; }
  try { const v = input.waterRequirement * input.losses; results["waterUseEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterUseEfficiency"] = Number.NaN; }
  return results;
}

export function calculateSulamaMaliyetCheck(input) {
  return evaluateAllFormulas(input);
}
