// Auto-generated premium calculator: smed-deiim-optimize-edici
import * as z from 'zod';

export interface SmedDeiimOptimizeEdiciInput {
  mevcut IcDısAyarDk: number;
  degisimFrekansı: number;
  hedef IcAyarDk: number;
  donusturmeOranı: number;
  darbogaz CıktıDegeriCurrencydk: number;
  sMEDYatırımı: number;
  vardiyaSuresiDk: number;
}

export const SmedDeiimOptimizeEdiciInputSchema = z.object({
  mevcut IcDısAyarDk: z.number().min(0).default(0),
  degisimFrekansı: z.number().min(0).default(0),
  hedef IcAyarDk: z.number().min(0).default(0),
  donusturmeOranı: z.number().min(0).default(0),
  darbogaz CıktıDegeriCurrencydk: z.number().min(0).default(0),
  sMEDYatırımı: z.number().min(0).default(0),
  vardiyaSuresiDk: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.internalCurrent * input.externalCurrent; results["currentSetupTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentSetupTime"] = Number.NaN; }
  try { const v = input.internalTarget * input.externalTarget; results["targetSetupTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetSetupTime"] = Number.NaN; }
  try { const v = input.internalCurrent * input.internalTarget; results["conversionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionRate"] = Number.NaN; }
  try { const v = input.currentSetupTime * input.targetSetupTime * input.changeoverFrequency; results["capacityRecovered"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capacityRecovered"] = Number.NaN; }
  try { const v = input.capacityRecovered * input.bottleneckThroughput * input.unitMargin; results["financialGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialGain"] = Number.NaN; }
  try { const v = input.training * input.tooling * input.modification; results["sMEDInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sMEDInvestment"] = Number.NaN; }
  try { const v = input.financialGain * input.sMEDInvestment; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  return results;
}

export function calculateSmedDeiimOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
