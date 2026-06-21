// Auto-generated premium calculator: ariza-sresi-maliyeti
import * as z from 'zod';

export interface ArizaSresiMaliyetiInput {
  arızaSuresi: number;
  etkilenen Isci: number;
  saatlik Ucret: number;
  hatKapasitesi: number;
  birimMarj: number;
  bostaGuc: number;
  markaHasar Carpanı: number;
}

export const ArizaSresiMaliyetiInputSchema = z.object({
  arızaSuresi: z.number().min(0).default(0),
  etkilenen Isci: z.number().min(0).default(0),
  saatlik Ucret: z.number().min(0).default(0),
  hatKapasitesi: z.number().min(0).default(0),
  birimMarj: z.number().min(0).default(0),
  bostaGuc: z.number().min(0).default(0),
  markaHasar Carpanı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.downtimeHours * input.affectedWorkers * input.avgHourlyRate * input.burdenRate; results["directLaborLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directLaborLoss"] = Number.NaN; }
  try { const v = input.downtimeHours * input.lineCapacity * input.contributionMargin; results["productionLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productionLoss"] = Number.NaN; }
  try { const v = input.idlePowerKW * input.downtimeHours * input.electricityRate; results["energyWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyWaste"] = Number.NaN; }
  try { const v = input.overtimeHours * input.overtimeRate * input.crewSize; results["recoveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recoveryCost"] = Number.NaN; }
  try { const v = input.directLaborLoss * input.productionLoss * input.energyWaste * input.recoveryCost * input.qualityLoss * input.penalty; results["totalDowntimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDowntimeCost"] = Number.NaN; }
  return results;
}

export function calculateArizaSresiMaliyeti(input) {
  return evaluateAllFormulas(input);
}
