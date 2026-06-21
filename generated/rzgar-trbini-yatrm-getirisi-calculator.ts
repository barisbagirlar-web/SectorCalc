// Auto-generated premium calculator: rzgar-trbini-yatrm-getirisi
import * as z from 'zod';

export interface RzgarTrbiniYatrmGetirisiInput {
  turbinGucuKW: number;
  gucEgrisi: number;
  ruzgarFrekansı: number;
  capex: number;
  wACC: number;
  tesvikTarifeCurrencykWh: number;
  kiraBakımSigorta: number;
  turbin OmruYıl: number;
}

export const RzgarTrbiniYatrmGetirisiInputSchema = z.object({
  turbinGucuKW: z.number().min(0).default(0),
  gucEgrisi: z.number().min(0).default(0),
  ruzgarFrekansı: z.number().min(0).default(0),
  capex: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  tesvikTarifeCurrencykWh: z.number().min(0).default(0),
  kiraBakımSigorta: z.number().min(0).default(0),
  turbin OmruYıl: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.powerCurveV * input.frequencyV; results["aEP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aEP"] = Number.NaN; }
  try { const v = input.aEP * input.ratedPower; results["capacityFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capacityFactor"] = Number.NaN; }
  try { const v = input.aEP * input.feedInTariff; results["annualRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualRevenue"] = Number.NaN; }
  try { const v = input.landLease * input.maintenance * input.insurance * input.gridFees; results["oPEX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oPEX"] = Number.NaN; }
  try { const v = input.annualRevenue * input.oPEX; results["eBITDA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eBITDA"] = Number.NaN; }
  try { const v = input.capex * input.opexT * input.r * input.t * input.aEPT; results["lCOE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lCOE"] = Number.NaN; }
  try { const v = input.eBITDAT * input.wACC * input.t * input.capex; results["nPV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPV"] = Number.NaN; }
  try { const v = input.r * input.where; results["iRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iRR"] = Number.NaN; }
  return results;
}

export function calculateRzgarTrbiniYatrmGetirisi(input) {
  return evaluateAllFormulas(input);
}
