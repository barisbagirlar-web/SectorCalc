// Auto-generated premium calculator: kiri-arl
import * as z from 'zod';

export interface KiriArlInput {
  profilTipiBoyutu: string;
  uzunluk: number;
  adet: number;
  CelikYogunlugu: number;
  elastisiteModuluE: number;
  tonFiyatı: number;
  boyaYalıtımM2Maliyeti: number;
}

export const KiriArlInputSchema = z.object({
  profilTipiBoyutu: z.number().min(0).default(0),
  uzunluk: z.number().min(0).default(0),
  adet: z.number().min(0).default(0),
  CelikYogunlugu: z.number().min(0).default(0),
  elastisiteModuluE: z.number().min(0).default(0),
  tonFiyatı: z.number().min(0).default(0),
  boyaYalıtımM2Maliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.lookupArea * input.profileType * input.size; results["areaCross"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaCross"] = Number.NaN; }
  try { const v = input.areaCross * input.densitySteel; results["weightPerMeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightPerMeter"] = Number.NaN; }
  try { const v = input.weightPerMeter * input.length * input.quantity; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = input.totalWeight * input.pricePerTon; results["costMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costMaterial"] = Number.NaN; }
  try { const v = input.perimeter * input.length; results["paintArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paintArea"] = Number.NaN; }
  try { const v = input.paintArea; results["fireproofingArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fireproofingArea"] = Number.NaN; }
  try { const v = input.w * input.l * input.e * input.i; results["deflectionMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deflectionMax"] = Number.NaN; }
  try { const v = input.w * input.l; results["momentMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["momentMax"] = Number.NaN; }
  return results;
}

export function calculateKiriArl(input) {
  return evaluateAllFormulas(input);
}
