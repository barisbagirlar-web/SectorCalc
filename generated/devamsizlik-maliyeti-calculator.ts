// Auto-generated premium calculator: devamsizlik-maliyeti
import * as z from 'zod';

export interface DevamsizlikMaliyetiInput {
  kayıpSaat: number;
  Ucret: number;
  yanHak: number;
  olaySayısıS: number;
  fazlaMesai: number;
  gecici Isci: number;
  verimDusus: number;
}

export const DevamsizlikMaliyetiInputSchema = z.object({
  kayıpSaat: z.number().min(0).default(0),
  Ucret: z.number().min(0).default(0),
  yanHak: z.number().min(0).default(0),
  olaySayısıS: z.number().min(0).default(0),
  fazlaMesai: z.number().min(0).default(0),
  gecici Isci: z.number().min(0).default(0),
  verimDusus: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.absentHours * input.hourlyRate * input.burden; results["directCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directCost"] = Number.NaN; }
  try { const v = input.replaceOT * input.oTRate * input.regRate; results["overtimePremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overtimePremium"] = Number.NaN; }
  try { const v = input.tempHours * input.tempRate * input.markup; results["tempCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tempCost"] = Number.NaN; }
  try { const v = input.absentHours * input.outputPerHour * input.margin * input.effDrop; results["prodLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["prodLoss"] = Number.NaN; }
  try { const v = input.events * input.hRTime * input.hRRate; results["adminCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adminCost"] = Number.NaN; }
  try { const v = input.s * input.d; results["bradfordFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bradfordFactor"] = Number.NaN; }
  try { const v = input.direct * input.oT * input.temp * input.prod * input.admin; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}

export function calculateDevamsizlikMaliyeti(input) {
  return evaluateAllFormulas(input);
}
