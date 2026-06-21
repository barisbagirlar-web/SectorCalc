// Auto-generated premium calculator: vardiya-maliyet-verimlilii
import * as z from 'zod';

export interface VardiyaMaliyetVerimliliiInput {
  vardiyaPlanlıPlansızDurusSuresiDk: number;
  operatorSayısı: number;
  makineGucuKW: number;
  elektrikTarifesi: number;
  saatlik Ucret: number;
  saglam UretimAdedi: number;
  birimMarj: number;
}

export const VardiyaMaliyetVerimliliiInputSchema = z.object({
  vardiyaPlanlıPlansızDurusSuresiDk: z.number().min(0).default(0),
  operatorSayısı: z.number().min(0).default(0),
  makineGucuKW: z.number().min(0).default(0),
  elektrikTarifesi: z.number().min(0).default(0),
  saatlik Ucret: z.number().min(0).default(0),
  saglam UretimAdedi: z.number().min(0).default(0),
  birimMarj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.shiftDuration * input.plannedDowntime; results["plannedProductionTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["plannedProductionTime"] = Number.NaN; }
  try { const v = input.plannedProductionTime * input.unplannedDowntime; results["actualRunTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualRunTime"] = Number.NaN; }
  try { const v = input.operators * input.shiftHours * input.hourlyRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = input.machinePower * input.actualRunTime * input.elecRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = input.goodUnits * input.unitContributionMargin; results["outputValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outputValue"] = Number.NaN; }
  try { const v = input.outputValue * input.laborCost * input.energyCost * input.overhead; results["shiftEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shiftEfficiency"] = Number.NaN; }
  try { const v = input.laborCost * input.energyCost * input.overhead * input.goodUnits; results["costPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnit"] = Number.NaN; }
  return results;
}

export function calculateVardiyaMaliyetVerimlilii(input) {
  return evaluateAllFormulas(input);
}
