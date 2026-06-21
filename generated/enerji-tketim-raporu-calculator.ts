// Auto-generated premium calculator: enerji-tketim-raporu
import * as z from 'zod';

export interface EnerjiTketimRaporuInput {
  aktifT0T3: number;
  reaktif: number;
  demax: number;
  pFHedef: number;
  cezaEsik: number;
  aktifReaktifGucBedeli: number;
  karbon: number;
}

export const EnerjiTketimRaporuInputSchema = z.object({
  aktifT0T3: z.number().min(0).default(0),
  reaktif: z.number().min(0).default(0),
  demax: z.number().min(0).default(0),
  pFHedef: z.number().min(0).default(0),
  cezaEsik: z.number().min(0).default(0),
  aktifReaktifGucBedeli: z.number().min(0).default(0),
  karbon: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.kWh; results["active"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["active"] = Number.NaN; }
  try { const v = input.kVArh; results["reactive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reactive"] = Number.NaN; }
  try { const v = input.active * input.reactive; results["pF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pF"] = Number.NaN; }
  try { const v = input.pF * input.thresh * input.reactive * input.active * input.tariff; results["reactivePenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reactivePenalty"] = Number.NaN; }
  try { const v = input.peakKW * input.demandRate; results["demandCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["demandCharge"] = Number.NaN; }
  try { const v = input.kWh * input.tOURate; results["tOU"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tOU"] = Number.NaN; }
  try { const v = input.base * input.tOU * input.demand * input.penalty * input.tax; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.active * input.emisFactor * input.carbonPrice; results["carbon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbon"] = Number.NaN; }
  return results;
}

export function calculateEnerjiTketimRaporu(input) {
  return evaluateAllFormulas(input);
}
