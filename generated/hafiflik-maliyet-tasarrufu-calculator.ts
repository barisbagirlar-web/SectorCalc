// Auto-generated premium calculator: hafiflik-maliyet-tasarrufu
import * as z from 'zod';

export interface HafiflikMaliyetTasarrufuInput {
  orijinalYeniAgırlık: number;
  malzeme: string;
  yeniKgFiyat: number;
  kalıpFarkı: number;
  OmurSaat: number;
  yakıt: number;
}

export const HafiflikMaliyetTasarrufuInputSchema = z.object({
  orijinalYeniAgırlık: z.number().min(0).default(0),
  malzeme: z.number().min(0).default(0),
  yeniKgFiyat: z.number().min(0).default(0),
  kalıpFarkı: z.number().min(0).default(0),
  OmurSaat: z.number().min(0).default(0),
  yakıt: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.massOrig * input.massLW; results["weightRed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightRed"] = Number.NaN; }
  try { const v = input.weightRed * input.fuelFactor * input.dist * input.fuelPrice; results["fuelSavAuto"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelSavAuto"] = Number.NaN; }
  try { const v = input.weightRed * input.burnFactor * input.hours * input.jetPrice; results["fuelSavAero"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelSavAero"] = Number.NaN; }
  try { const v = input.weightRed * input.revPerKg; results["payloadGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payloadGain"] = Number.NaN; }
  try { const v = input.costLW * input.costOrig * input.vol; results["matPrem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["matPrem"] = Number.NaN; }
  try { const v = input.toolLW * input.toolOrig; results["toolDelta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toolDelta"] = Number.NaN; }
  try { const v = input.fuelSav * input.payload * input.life * input.matPrem * input.toolDelta; results["netSav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netSav"] = Number.NaN; }
  return results;
}

export function calculateHafiflikMaliyetTasarrufu(input) {
  return evaluateAllFormulas(input);
}
