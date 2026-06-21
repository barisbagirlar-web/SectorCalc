// Auto-generated premium calculator: konteyner-yk
import * as z from 'zod';

export interface KonteynerYkInput {
  konteynerTipi: string;
  IcHacimPayload: number;
  paletKoli Olculeri: number;
  brutAgırlık: number;
  konteynerTasımaBedeli: number;
  IstiflemeKısıtı: string;
}

export const KonteynerYkInputSchema = z.object({
  konteynerTipi: z.number().min(0).default(0),
  IcHacimPayload: z.number().min(0).default(0),
  paletKoli Olculeri: z.number().min(0).default(0),
  brutAgırlık: z.number().min(0).default(0),
  konteynerTasımaBedeli: z.number().min(0).default(0),
  IstiflemeKısıtı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.itemVolumeI * input.containerMaxVolume; results["volumeUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeUtilization"] = Number.NaN; }
  try { const v = input.itemWeightI * input.containerMaxPayload; results["weightUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightUtilization"] = Number.NaN; }
  try { const v = input.grossWeight * input.volumetricWeight; results["chargeableWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chargeableWeight"] = Number.NaN; }
  try { const v = input.volumeUtilization * input.weightUtilization; results["loadEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loadEfficiency"] = Number.NaN; }
  try { const v = input.loadEfficiency * input.freightCost; results["wastedSpaceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastedSpaceCost"] = Number.NaN; }
  try { const v = input.containerHeight * input.palletHeight; results["palletStacking"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["palletStacking"] = Number.NaN; }
  try { const v = input.palletStacking * input.floorAreaPallets * input.weightLimit * input.palletWeight; results["maxPallets"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxPallets"] = Number.NaN; }
  return results;
}

export function calculateKonteynerYk(input) {
  return evaluateAllFormulas(input);
}
