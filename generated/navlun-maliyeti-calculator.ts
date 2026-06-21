// Auto-generated premium calculator: navlun-maliyeti
import * as z from 'zod';

export interface NavlunMaliyetiInput {
  brutHacimselAgırlık: number;
  navlunKgFiyatı: number;
  kıymet: number;
  gumrukVergisi: number;
  tHC: number;
  bAFOranı: number;
  guvenlik Ucreti: number;
  sabitGumrukcuBedeli: number;
}

export const NavlunMaliyetiInputSchema = z.object({
  brutHacimselAgırlık: z.number().min(0).default(0),
  navlunKgFiyatı: z.number().min(0).default(0),
  kıymet: z.number().min(0).default(0),
  gumrukVergisi: z.number().min(0).default(0),
  tHC: z.number().min(0).default(0),
  bAFOranı: z.number().min(0).default(0),
  guvenlik Ucreti: z.number().min(0).default(0),
  sabitGumrukcuBedeli: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.grossWeight * input.volumetricWeight; results["chargeableWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chargeableWeight"] = Number.NaN; }
  try { const v = input.chargeableWeight * input.ratePerKg; results["baseFreight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseFreight"] = Number.NaN; }
  try { const v = input.baseFreight * input.bAFPct; results["bunkerSurcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bunkerSurcharge"] = Number.NaN; }
  try { const v = input.chargeableWeight * input.securityRate; results["securityFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["securityFee"] = Number.NaN; }
  try { const v = input.units * input.tHCRate; results["terminalHandling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["terminalHandling"] = Number.NaN; }
  try { const v = input.fixedFee * input.value * input.dutyPct; results["customsClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["customsClearance"] = Number.NaN; }
  try { const v = input.baseFreight * input.bunkerSurcharge * input.securityFee * input.terminalHandling * input.customsClearance; results["totalFreightCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFreightCost"] = Number.NaN; }
  try { const v = input.totalFreightCost * input.totalUnits; results["costPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnit"] = Number.NaN; }
  return results;
}

export function calculateNavlunMaliyeti(input) {
  return evaluateAllFormulas(input);
}
