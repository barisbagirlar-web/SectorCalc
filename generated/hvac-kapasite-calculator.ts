// Auto-generated premium calculator: hvac-kapasite
import * as z from 'zod';

export interface HvacKapasiteInput {
  alanHacim: number;
  dısIcSıcaklık: number;
  uDegerleri: number;
  kisiIsık: number;
  aCH: number;
  eER: number;
  saat: number;
  tarif: number;
}

export const HvacKapasiteInputSchema = z.object({
  alanHacim: z.number().min(0).default(0),
  dısIcSıcaklık: z.number().min(0).default(0),
  uDegerleri: z.number().min(0).default(0),
  kisiIsık: z.number().min(0).default(0),
  aCH: z.number().min(0).default(0),
  eER: z.number().min(0).default(0),
  saat: z.number().min(0).default(0),
  tarif: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cFM * input.deltaT; results["sensible"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sensible"] = Number.NaN; }
  try { const v = input.cFM * input.deltaW; results["latent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["latent"] = Number.NaN; }
  try { const v = input.sensible * input.latent; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.u * input.area * input.deltaT; results["envelope"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["envelope"] = Number.NaN; }
  try { const v = input.occ * input.sensPer * input.light * input.equip; results["internal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["internal"] = Number.NaN; }
  try { const v = input.cFMOut * input.tOut * input.tIn; results["vent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vent"] = Number.NaN; }
  try { const v = input.total; results["tons"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tons"] = Number.NaN; }
  try { const v = input.bTU * input.w; results["eER"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eER"] = Number.NaN; }
  try { const v = input.total * input.eER * input.hours * input.elecRate; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  return results;
}

export function calculateHvacKapasite(input) {
  return evaluateAllFormulas(input);
}
