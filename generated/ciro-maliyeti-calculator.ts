// Auto-generated premium calculator: ciro-maliyeti
import * as z from 'zod';

export interface CiroMaliyetiInput {
  ayrılanSayısı: number;
  tazminat: number;
  IseAlımSuresi: number;
  mulakatEgitimSuresi: number;
  tamVerimSuresi: number;
  gunlukCiro: number;
}

export const CiroMaliyetiInputSchema = z.object({
  ayrılanSayısı: z.number().min(0).default(0),
  tazminat: z.number().min(0).default(0),
  IseAlımSuresi: z.number().min(0).default(0),
  mulakatEgitimSuresi: z.number().min(0).default(0),
  tamVerimSuresi: z.number().min(0).default(0),
  gunlukCiro: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.exitInterview * input.hRRate * input.severance * input.admin; results["separationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["separationCost"] = Number.NaN; }
  try { const v = input.timeToFill * input.dailyRevenue * input.tempCost; results["vacancyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vacancyCost"] = Number.NaN; }
  try { const v = input.ads * input.agency * input.interviewTime * input.rate; results["replacementCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["replacementCost"] = Number.NaN; }
  try { const v = input.trainHours * input.trainerRate * input.onboardHours * input.newHireRate; results["trainingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trainingCost"] = Number.NaN; }
  try { const v = input.timeToFull * input.avgOutput * input.rampUp * input.margin; results["productivityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productivityLoss"] = Number.NaN; }
  try { const v = input.separation * input.vacancy * input.replacement * input.training * input.productivity; results["totalTurnoverCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTurnoverCost"] = Number.NaN; }
  return results;
}

export function calculateCiroMaliyeti(input) {
  return evaluateAllFormulas(input);
}
