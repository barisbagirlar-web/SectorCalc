// Auto-generated from hidrolik-silindir-itme-kuvveti-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HidrolikSilindirItmeKuvvetiHesabiInput {
  pistonCap: number;
  rodCap: number;
  systemPressure: number;
  forceType: 'itme' | 'cekme';
}

export const HidrolikSilindirItmeKuvvetiHesabiInputSchema = z.object({
  pistonCap: z.number().min(10).max(500).default(50),
  rodCap: z.number().min(5).max(300).default(25),
  systemPressure: z.number().min(10).max(400).default(100),
  forceType: z.enum(['itme', 'cekme']).default('itme'),
});

export interface HidrolikSilindirItmeKuvvetiHesabiOutput {
  forceTon: number;
  breakdown: {
    pistonArea: number;
    rodArea: number;
    effectiveArea: number;
    forceN: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HidrolikSilindirItmeKuvvetiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.pistonArea = ((): number => { try { const __v = pi * (input.pistonCap/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rodArea = ((): number => { try { const __v = pi * (input.rodCap/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveArea = ((): number => { try { const __v = input.forceType == 'itme' ? results.pistonArea : results.pistonArea - results.rodArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.forceN = ((): number => { try { const __v = results.effectiveArea * input.systemPressure * 10; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.forceTon = ((): number => { try { const __v = results.forceN / 9810; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHidrolikSilindirItmeKuvvetiHesabi(input: HidrolikSilindirItmeKuvvetiHesabiInput): HidrolikSilindirItmeKuvvetiHesabiOutput {
  const results = evaluateFormulas(input);
  const forceTon = results.forceTon ?? 0;
  const breakdown = {
    pistonArea: results.pistonArea,
    rodArea: results.rodArea,
    effectiveArea: results.effectiveArea,
    forceN: results.forceN,
  };

  // rule: pistonCap > rodCap
  // rule: systemPressure >= 10
  // rule: systemPressure <= 400
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Piston capi 200 mm'den buyukse buyuk silindir sinifina girer.
  // threshold skipped (non-JS): Sistem basinci 250 bar'i asarsa yuksek basinc uyarisi.

  const dataConfidenceAdjusted = (() => { try { return results.forceTon * (1 - 0.05); } catch { return forceTon; } })();

  return {
    forceTon,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
