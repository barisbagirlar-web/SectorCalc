// Auto-generated premium calculator: kompresr-tank-boyutlandrma
import * as z from 'zod';

export interface KompresrTankBoyutlandrmaInput {
  kompresorDebisiQM3min: number;
  maxMinBasıncBar: number;
  hedefDolumSuresiSn: number;
  IzinVerilenMaxStartSaat: number;
  tankLitreFiyatı: number;
  mevcutTankHacmi: number;
}

export const KompresrTankBoyutlandrmaInputSchema = z.object({
  kompresorDebisiQM3min: z.number().min(0).default(0),
  maxMinBasıncBar: z.number().min(0).default(0),
  hedefDolumSuresiSn: z.number().min(0).default(0),
  IzinVerilenMaxStartSaat: z.number().min(0).default(0),
  tankLitreFiyatı: z.number().min(0).default(0),
  mevcutTankHacmi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.t * input.q * input.pAtm * input.pMax * input.pMin; results["vTank"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vTank"] = Number.NaN; }
  try { const v = input.timeToFill; results["t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t"] = Number.NaN; }
  try { const v = input.freeAirDelivery; results["q"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["q"] = Number.NaN; }
  try { const v = input.cutOutPressure; results["pMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pMax"] = Number.NaN; }
  try { const v = input.cutInPressure; results["pMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pMin"] = Number.NaN; }
  try { const v = input.vTank * input.pMax * input.pMin * input.q * input.pAtm; results["cycleTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleTime"] = Number.NaN; }
  try { const v = input.cycleTime; results["cyclesPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cyclesPerHour"] = Number.NaN; }
  try { const v = input.cyclesPerHour * input.maxStarts * input.fAIL * input.pASS; results["motorStartLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motorStartLimit"] = Number.NaN; }
  try { const v = input.volume * input.pricePerLiter; results["costTank"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costTank"] = Number.NaN; }
  return results;
}

export function calculateKompresrTankBoyutlandrma(input) {
  return evaluateAllFormulas(input);
}
