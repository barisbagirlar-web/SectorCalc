// Auto-generated premium calculator: karbon-ayak-izi-check
import * as z from 'zod';

export interface KarbonAyakIziCheckInput {
  yakıtTuketimleri: number;
  kacakEmisyon: number;
  elektrikTuketimi: number;
  malzemeMiktarlarıVeEF: number;
  tasımaMesafesiVeModu: number;
  gelecekKarbonFiyatı: number;
  UretimHacmi: number;
}

export const KarbonAyakIziCheckInputSchema = z.object({
  yakıtTuketimleri: z.number().min(0).default(0),
  kacakEmisyon: z.number().min(0).default(0),
  elektrikTuketimi: z.number().min(0).default(0),
  malzemeMiktarlarıVeEF: z.number().min(0).default(0),
  tasımaMesafesiVeModu: z.number().min(0).default(0),
  gelecekKarbonFiyatı: z.number().min(0).default(0),
  UretimHacmi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.fuelConsumptionI * input.emissionFactorI * input.fugitiveEmissions; results["scope1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope1"] = Number.NaN; }
  try { const v = input.electricityConsumption * input.gridEmissionFactor; results["scope2Location"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope2Location"] = Number.NaN; }
  try { const v = input.electricityConsumption * input.gridFactor * input.rECFactor; results["scope2Market"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope2Market"] = Number.NaN; }
  try { const v = input.materialI * input.materialEFI * input.logisticsEmissions; results["scope3Upstream"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope3Upstream"] = Number.NaN; }
  try { const v = input.scope1 * input.scope2Market * input.scope3Upstream; results["totalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCarbon"] = Number.NaN; }
  try { const v = input.totalCarbon * input.productionVolume; results["carbonIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonIntensity"] = Number.NaN; }
  try { const v = input.totalCarbon * input.forecastedCarbonPrice; results["financialRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialRisk"] = Number.NaN; }
  return results;
}

export function calculateKarbonAyakIziCheck(input) {
  return evaluateAllFormulas(input);
}
