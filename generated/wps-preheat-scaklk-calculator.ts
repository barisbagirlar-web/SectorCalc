// Auto-generated premium calculator: wps-preheat-scaklk
import * as z from 'zod';

export interface WpsPreheatScaklkInput {
  malzemeKompozisyonuC: number;
  mn: number;
  cr: number;
  mo: number;
  v: number;
  ni: number;
  cu: number;
  kalınlıkMm: number;
  isıGirdisiKJmm: number;
  hidrojenSeviyesiMl100g: number;
  ortamSıcaklıgı: number;
  isıtıcıVerimi: number;
  enerjiFiyatı: number;
}

export const WpsPreheatScaklkInputSchema = z.object({
  malzemeKompozisyonuC: z.number().min(0).default(0),
  mn: z.number().min(0).default(0),
  cr: z.number().min(0).default(0),
  mo: z.number().min(0).default(0),
  v: z.number().min(0).default(0),
  ni: z.number().min(0).default(0),
  cu: z.number().min(0).default(0),
  kalınlıkMm: z.number().min(0).default(0),
  isıGirdisiKJmm: z.number().min(0).default(0),
  hidrojenSeviyesiMl100g: z.number().min(0).default(0),
  ortamSıcaklıgı: z.number().min(0).default(0),
  isıtıcıVerimi: z.number().min(0).default(0),
  enerjiFiyatı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.c * input.mn * input.cr * input.mo * input.v * input.ni * input.cu; results["carbonEquivalentCE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonEquivalentCE"] = Number.NaN; }
  try { const v = input.f * input.cE * input.thickness * input.hydrogenLevel * input.heatInput; results["preheatTemp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preheatTemp"] = Number.NaN; }
  try { const v = input.t85 * input.thickness * input.heatInput * input.constant; results["criticalCoolingTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["criticalCoolingTime"] = Number.NaN; }
  try { const v = input.preheatTemp * input.requiredPreheat * input.hIGH * input.lOW; results["hydrogenCrackingRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hydrogenCrackingRisk"] = Number.NaN; }
  try { const v = input.mass * input.specificHeat * input.preheatTemp * input.ambientTemp * input.heaterEfficiency * input.energyPrice; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  return results;
}

export function calculateWpsPreheatScaklk(input) {
  return evaluateAllFormulas(input);
}
