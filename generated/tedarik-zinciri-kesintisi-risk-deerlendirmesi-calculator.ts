// Auto-generated premium calculator: tedarik-zinciri-kesintisi-risk-deerlendirmesi
import * as z from 'zod';

export interface TedarikZinciriKesintisiRiskDeerlendirmesiInput {
  kesintiOlasılıgı: number;
  gunlukGelir: number;
  tamamlanmaSuresiGun: number;
  tamponKapasite: number;
  CiftKaynakPrimMaliyeti: number;
  sigortaPrimi: number;
  guvenlikStoguMaliyeti: number;
}

export const TedarikZinciriKesintisiRiskDeerlendirmesiInputSchema = z.object({
  kesintiOlasılıgı: z.number().min(0).default(0),
  gunlukGelir: z.number().min(0).default(0),
  tamamlanmaSuresiGun: z.number().min(0).default(0),
  tamponKapasite: z.number().min(0).default(0),
  CiftKaynakPrimMaliyeti: z.number().min(0).default(0),
  sigortaPrimi: z.number().min(0).default(0),
  guvenlikStoguMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.probabilityOfDisruption * input.financialImpact; results["riskExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskExposure"] = Number.NaN; }
  try { const v = input.daysToRestoreFullCapacity; results["timeToRecover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeToRecover"] = Number.NaN; }
  try { const v = input.dailyRevenue * input.timeToRecover * input.bufferCapacityPct; results["revenueLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["revenueLoss"] = Number.NaN; }
  try { const v = input.dualSourcingPremium * input.safetyStockCarryingCost * input.insurancePremium; results["mitigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mitigationCost"] = Number.NaN; }
  try { const v = input.expectedAnnualLoss * input.mitigationCost; results["riskAdjustedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskAdjustedCost"] = Number.NaN; }
  try { const v = input.timeToRecover * input.vulnerabilityScore; results["resilienceIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resilienceIndex"] = Number.NaN; }
  return results;
}

export function calculateTedarikZinciriKesintisiRiskDeerlendirmesi(input) {
  return evaluateAllFormulas(input);
}
