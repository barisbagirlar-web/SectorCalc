// Auto-generated premium calculator: isi-exchanger-fouling
import * as z from 'zod';

export interface IsiExchangerFoulingInput {
  ucleandirty: number;
  alan: number;
  lMTD: number;
  dPArtıs: number;
  temizlik: number;
  yakıt: number;
  kazanVerim: number;
}

export const IsiExchangerFoulingInputSchema = z.object({
  ucleandirty: z.number().min(0).default(0),
  alan: z.number().min(0).default(0),
  lMTD: z.number().min(0).default(0),
  dPArtıs: z.number().min(0).default(0),
  temizlik: z.number().min(0).default(0),
  yakıt: z.number().min(0).default(0),
  kazanVerim: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.uDirty * input.uClean; results["rFoul"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rFoul"] = Number.NaN; }
  try { const v = input.area * input.uClean * input.lMTD * input.uDirty; results["loss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loss"] = Number.NaN; }
  try { const v = input.loss * input.hours * input.boilEff; results["energyPen"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyPen"] = Number.NaN; }
  try { const v = input.energyPen * input.fuelCost; results["costEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costEnergy"] = Number.NaN; }
  try { const v = input.deltaPDirty * input.deltaPClean; results["dPInc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dPInc"] = Number.NaN; }
  try { const v = input.dPInc * input.flow * input.hours * input.pumpEff; results["pumpInc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pumpInc"] = Number.NaN; }
  try { const v = input.costEnergy * input.pumpInc; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.total * input.cleanCost; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  return results;
}

export function calculateIsiExchangerFouling(input) {
  return evaluateAllFormulas(input);
}
