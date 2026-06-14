// Auto-generated from basincli-kap-cidar-kalinligi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BasincliKapCidarKalinligiHesabiInput {
  designPressure: number;
  vesselDiameter: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
  materialType: 'Carbon Steel' | 'Stainless Steel' | 'Alloy Steel' | 'Aluminum' | 'Other';
}

export const BasincliKapCidarKalinligiHesabiInputSchema = z.object({
  designPressure: z.number().min(0.1).max(1000).default(10),
  vesselDiameter: z.number().min(100).max(10000).default(1000),
  allowableStress: z.number().min(50).max(500).default(138),
  jointEfficiency: z.number().min(0.6).max(1).default(0.85),
  corrosionAllowance: z.number().min(0).max(10).default(2),
  materialType: z.enum(['Carbon Steel', 'Stainless Steel', 'Alloy Steel', 'Aluminum', 'Other']).default('Carbon Steel'),
});

export interface BasincliKapCidarKalinligiHesabiOutput {
  nominalThickness: number;
  breakdown: {
    requiredThickness: number;
    corrosionAllowance: number;
    stressCheck: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BasincliKapCidarKalinligiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.requiredThickness = (() => { try { return ((input.designPressure * input.vesselDiameter) / (2 * input.allowableStress * input.jointEfficiency - input.designPressure)) + input.corrosionAllowance; } catch { return 0; } })();
  results.nominalThickness = (() => { try { return Math.ceil(results.requiredThickness / 0.5) * 0.5; } catch { return 0; } })();
  results.stressCheck = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateBasincliKapCidarKalinligiHesabi(input: BasincliKapCidarKalinligiHesabiInput): BasincliKapCidarKalinligiHesabiOutput {
  const results = evaluateFormulas(input);
  const nominalThickness = results.nominalThickness ?? 0;
  const breakdown = {
    requiredThickness: results.requiredThickness,
    corrosionAllowance: results.corrosionAllowance,
    stressCheck: results.stressCheck,
  };

  // rule: designPressure > 0
  // rule: vesselDiameter > 0
  // rule: allowableStress > 0
  // rule: jointEfficiency > 0 and jointEfficiency <= 1
  // rule: corrosionAllowance >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Tasarim basinci 100 bar'i asarsa yuksek basincli kap sinifina girer, ek hesaplamalar gerekir.
  // threshold skipped (non-JS): Cap 3000 mm'den buyukse nakliye ve montaj zorluklari olusabilir.
  // threshold skipped (non-JS): Musaade edilen gerilme 100 MPa altinda ise malzeme secimi gozden gecirilmelidir.

  const dataConfidenceAdjusted = (() => { try { return results.nominalThickness * (1 + (1 - dataConfidence) * 0.1); } catch { return nominalThickness; } })();

  return {
    nominalThickness,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli malzeme/basinc senaryolari)","Detayli rapor (malzeme secimi, maliyet analizi)"],
  };
}
