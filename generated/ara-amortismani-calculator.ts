// Auto-generated premium calculator: ara-amortismani
import * as z from 'zod';

export interface AraAmortismaniInput {
  edinmeBedeli: number;
  kalıntıDeger: number;
  faydalı Omur: number;
  yıllıkKm: number;
  amortismanYontemi: string;
  kurumlarVergisi: number;
  wACC: number;
}

export const AraAmortismaniInputSchema = z.object({
  edinmeBedeli: z.number().min(0).default(0),
  kalıntıDeger: z.number().min(0).default(0),
  faydalı Omur: z.number().min(0).default(0),
  yıllıkKm: z.number().min(0).default(0),
  amortismanYontemi: z.number().min(0).default(0),
  kurumlarVergisi: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cost * input.salvageValue * input.usefulLife; results["sLAnnual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sLAnnual"] = Number.NaN; }
  try { const v = input.usefulLife; results["dBRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dBRate"] = Number.NaN; }
  try { const v = input.bookValue_ * input.t * input.dBRate; results["dBYearT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dBYearT"] = Number.NaN; }
  try { const v = input.cost * input.assetClass * input.year; results["mACRSYearT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mACRSYearT"] = Number.NaN; }
  try { const v = input.cost * input.salvageValue * input.totalExpectedUnits; results["uoPPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uoPPerUnit"] = Number.NaN; }
  try { const v = input.acquisitionCost * input.opCostT * input.maintCostT * input.salvageT * input.discountRate * input.t; results["tCO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCO"] = Number.NaN; }
  try { const v = input.depreciation * input.taxRate; results["taxShield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxShield"] = Number.NaN; }
  return results;
}

export function calculateAraAmortismani(input) {
  return evaluateAllFormulas(input);
}
