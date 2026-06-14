// Auto-generated from kasko-sigorta-prim-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaskoSigortaPrimKarsilastirmaInput {
  vehicleValue: number;
  vehicleAge: number;
  driverAge: number;
  driverExperience: number;
  hasAccidentHistory: boolean;
  coverageType: 'full' | 'partial' | 'thirdParty';
  region: 'marmara' | 'ege' | 'akdeniz' | 'icAnadolu' | 'karadeniz' | 'doguAnadolu' | 'guneydoguAnadolu';
  dataConfidence: number;
}

export const KaskoSigortaPrimKarsilastirmaInputSchema = z.object({
  vehicleValue: z.number().min(10000).max(10000000).default(500000),
  vehicleAge: z.number().min(0).max(30).default(3),
  driverAge: z.number().min(18).max(99).default(35),
  driverExperience: z.number().min(0).max(80).default(10),
  hasAccidentHistory: z.boolean().default(false),
  coverageType: z.enum(['full', 'partial', 'thirdParty']).default('full'),
  region: z.enum(['marmara', 'ege', 'akdeniz', 'icAnadolu', 'karadeniz', 'doguAnadolu', 'guneydoguAnadolu']).default('marmara'),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface KaskoSigortaPrimKarsilastirmaOutput {
  finalPremium: number;
  breakdown: {
    basePremium: number;
    ageFactor: number;
    driverFactor: number;
    accidentFactor: number;
    coverageFactor: number;
    regionFactor: number;
    rawPremium: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaskoSigortaPrimKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.basePremium = ((): number => { try { const __v = input.vehicleValue * 0.03; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ageFactor = ((): number => { try { const __v = 1 + (input.vehicleAge * 0.02); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driverFactor = ((): number => { try { const __v = 1 + ( (input.driverAge < 25 ? 0.2 : (input.driverAge > 65 ? 0.15 : 0)) + (input.driverExperience < 5 ? 0.1 : 0) ); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.accidentFactor = ((): number => { try { const __v = input.hasAccidentHistory ? 1.2 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coverageFactor = ((): number => { try { const __v = input.coverageType == 'full' ? 1.0 : (input.coverageType == 'partial' ? 0.7 : 0.3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.regionFactor = ((): number => { try { const __v = input.region == 'marmara' ? 1.2 : (input.region == 'ege' ? 1.1 : (input.region == 'akdeniz' ? 1.0 : (input.region == 'icAnadolu' ? 0.9 : (input.region == 'karadeniz' ? 0.8 : (input.region == 'doguAnadolu' ? 0.7 : 0.6))))); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rawPremium = ((): number => { try { const __v = results.basePremium * results.ageFactor * results.driverFactor * results.accidentFactor * results.coverageFactor * results.regionFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalPremium = ((): number => { try { const __v = results.rawPremium * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.finalPremium * input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaskoSigortaPrimKarsilastirma(input: KaskoSigortaPrimKarsilastirmaInput): KaskoSigortaPrimKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const finalPremium = results.finalPremium ?? 0;
  const breakdown = {
    basePremium: results.basePremium,
    ageFactor: results.ageFactor,
    driverFactor: results.driverFactor,
    accidentFactor: results.accidentFactor,
    coverageFactor: results.coverageFactor,
    regionFactor: results.regionFactor,
    rawPremium: results.rawPremium,
  };

  // rule: vehicleValue >= 10000
  // rule: vehicleValue <= 10000000
  // rule: vehicleAge >= 0 && vehicleAge <= 30
  // rule: driverAge >= 18 && driverAge <= 99
  // rule: driverExperience >= 0 && driverExperience <= 80
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  // rule: if (hasAccidentHistory == true) then driverAge >= 25 else true
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.vehicleValue > 5000000) hiddenLossDrivers.push("Yuksek degerli arac, ek guvence onerilir.");
  if (input.driverAge < 25) hiddenLossDrivers.push("driverAge");
  if (input.hasAccidentHistory == true) hiddenLossDrivers.push("Kaza gecmisi var, prim artisi uygulanir.");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return finalPremium; } })();

  return {
    finalPremium,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
