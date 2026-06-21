// Auto-generated premium calculator: cbam-maruziyet
import * as z from 'zod';

export interface CbamMaruziyetInput {
  UretimHacmi: number;
  gazKomurElektrikTuketimi: number;
  prosesEmisyonu: number;
  yenilenebilirOranı: number;
  eUETSFiyatı: number;
}

export const CbamMaruziyetInputSchema = z.object({
  UretimHacmi: z.number().min(0).default(0),
  gazKomurElektrikTuketimi: z.number().min(0).default(0),
  prosesEmisyonu: z.number().min(0).default(0),
  yenilenebilirOranı: z.number().min(0).default(0),
  eUETSFiyatı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.activityData * input.emissionFactor; results["directEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directEmissions"] = Number.NaN; }
  try { const v = input.elecConsumption * input.gridFactor; results["indirectEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["indirectEmissions"] = Number.NaN; }
  try { const v = input.directEmissions * input.indirectEmissions * input.productionVolume; results["carbonIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonIntensity"] = Number.NaN; }
  try { const v = input.embeddedEmissions * input.freeAllowance * input.eUETSPrice; results["cBAMCertificateCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cBAMCertificateCost"] = Number.NaN; }
  try { const v = input.benchmark * input.productionVolume * input.leakageFactor; results["freeAllowance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["freeAllowance"] = Number.NaN; }
  try { const v = input.dataComplete * input.verification * input.reduction; results["complianceScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["complianceScore"] = Number.NaN; }
  return results;
}

export function calculateCbamMaruziyet(input) {
  return evaluateAllFormulas(input);
}
