// Auto-generated premium calculator: maaza-saatlik-cret
import * as z from 'zod';

export interface MaazaSaatlikCretInput {
  teknisyenIdari Ucretler: number;
  faturalanabilirSaatHedefi: number;
  kiraFaturaSigorta: number;
  amortisman: number;
  hedefKarMarjı: number;
  gercekFaturalama Ucreti: number;
}

export const MaazaSaatlikCretInputSchema = z.object({
  teknisyenIdari Ucretler: z.number().min(0).default(0),
  faturalanabilirSaatHedefi: z.number().min(0).default(0),
  kiraFaturaSigorta: z.number().min(0).default(0),
  amortisman: z.number().min(0).default(0),
  hedefKarMarjı: z.number().min(0).default(0),
  gercekFaturalama Ucreti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.technicianWages; results["directLabor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directLabor"] = Number.NaN; }
  try { const v = input.managerWages * input.adminWages; results["indirectLabor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["indirectLabor"] = Number.NaN; }
  try { const v = input.rent * input.utilities * input.insurance * input.tools * input.depreciation; results["overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead"] = Number.NaN; }
  try { const v = input.directLabor * input.indirectLabor * input.overhead; results["totalShopCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalShopCost"] = Number.NaN; }
  try { const v = input.totalAvailableHours * input.utilizationRate; results["billableHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["billableHours"] = Number.NaN; }
  try { const v = input.totalShopCost * input.billableHours; results["shopHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shopHourlyRate"] = Number.NaN; }
  try { const v = input.actualBillingRate * input.shopHourlyRate; results["effectiveMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMargin"] = Number.NaN; }
  return results;
}

export function calculateMaazaSaatlikCret(input) {
  return evaluateAllFormulas(input);
}
