// Auto-generated premium calculator: digital-twin-maliyet
import * as z from 'zod';

export interface DigitalTwinMaliyetInput {
  prototipSahaTesti: number;
  modelleme Iscilik: number;
  bulutLisans: number;
  garantiDususu: number;
  erken CıkısGeliri: number;
}

export const DigitalTwinMaliyetInputSchema = z.object({
  prototipSahaTesti: z.number().min(0).default(0),
  modelleme Iscilik: z.number().min(0).default(0),
  bulutLisans: z.number().min(0).default(0),
  garantiDususu: z.number().min(0).default(0),
  erken CıkısGeliri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.prototyping * input.fieldTest * input.downtime * input.travel; results["costTrad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costTrad"] = Number.NaN; }
  try { const v = input.license * input.compute * input.sensor * input.modeling; results["costDT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDT"] = Number.NaN; }
  try { const v = input.physCycle * input.digCycle * input.iterations; results["timeGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeGain"] = Number.NaN; }
  try { const v = input.timeGain * input.dailyRev; results["revenueGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["revenueGain"] = Number.NaN; }
  try { const v = input.defectReduction * input.warrantyCost * input.volume; results["qualitySavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualitySavings"] = Number.NaN; }
  try { const v = input.costTrad * input.costDT * input.revenueGain * input.qualitySavings; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  return results;
}

export function calculateDigitalTwinMaliyet(input) {
  return evaluateAllFormulas(input);
}
