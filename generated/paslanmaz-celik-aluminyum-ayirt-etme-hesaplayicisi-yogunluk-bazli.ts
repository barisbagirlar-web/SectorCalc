// Auto-generated from paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInput {
  sampleMass: number;
  sampleVolume: number;
  materialType: 'paslanmaz-celik' | 'aluminyum' | 'unknown';
  dataConfidence: number;
}

export const PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputSchema = z.object({
  sampleMass: z.number().min(0.1).max(1000).default(10),
  sampleVolume: z.number().min(0.1).max(500).default(2),
  materialType: z.enum(['paslanmaz-celik', 'aluminyum', 'unknown']).default('unknown'),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliOutput {
  materialResult: number;
  breakdown: {
    density: number;
    confidenceAdjustedDensity: number;
    userGuess: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.density = ((): number => { try { const __v = input.sampleMass / input.sampleVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isAluminum = ((): number => { try { const __v = results.density >= 2.5 && results.density <= 3.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isStainlessSteel = ((): number => { try { const __v = results.density >= 7.5 && results.density <= 8.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialResult = ((): number => { try { const __v = results.isAluminum ? 'aluminyum' : (results.isStainlessSteel ? 'paslanmaz-celik' : 'tanimsiz'); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.confidenceAdjustedDensity = ((): number => { try { const __v = results.density * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(input: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInput): PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliOutput {
  const results = evaluateFormulas(input);
  const materialResult = results.materialResult ?? 0;
  const breakdown = {
    density: results.density,
    confidenceAdjustedDensity: results.confidenceAdjustedDensity,
    userGuess: results.userGuess,
  };

  // rule: sampleMass > 0
  // rule: sampleVolume > 0
  // rule: dataConfidence >= 50 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): density < 2.5 || density > 8.0 -> 'Beklenmeyen yogunluk degeri, olcumleri kontrol edin'

  const dataConfidenceAdjusted = (() => { try { return results.confidenceAdjustedDensity; } catch { return materialResult; } })();

  return {
    materialResult,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma"],
  };
}
