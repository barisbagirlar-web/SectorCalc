// Auto-generated from pnomatik-silindir-kuvvet-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PnomatikSilindirKuvvetHesabiInput {
  pistonCapi: number;
  pistonKoluCapi: number;
  calismaBasinci: number;
  verim: number;
  yon: 'ileri' | 'geri';
}

export const PnomatikSilindirKuvvetHesabiInputSchema = z.object({
  pistonCapi: z.number().min(10).max(500).default(50),
  pistonKoluCapi: z.number().min(5).max(200).default(20),
  calismaBasinci: z.number().min(1).max(16).default(6),
  verim: z.number().min(50).max(100).default(90),
  yon: z.enum(['ileri', 'geri']).default('ileri'),
});

export interface PnomatikSilindirKuvvetHesabiOutput {
  kuvvetKgf: number;
  breakdown: {
    kuvvetN: number;
    alanEtkinCm2: number;
    verim: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PnomatikSilindirKuvvetHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.alanPiston = ((): number => { try { const __v = Math.PI * (input.pistonCapi/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alanPistonKolu = ((): number => { try { const __v = Math.PI * (input.pistonKoluCapi/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alanEtkin = ((): number => { try { const __v = input.yon === 'ileri' ? results.alanPiston : results.alanPiston - results.alanPistonKolu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kuvvetN = ((): number => { try { const __v = input.calismaBasinci * 1e5 * results.alanEtkin * 1e-6 * (input.verim/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kuvvetKgf = ((): number => { try { const __v = results.kuvvetN / 9.80665; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePnomatikSilindirKuvvetHesabi(input: PnomatikSilindirKuvvetHesabiInput): PnomatikSilindirKuvvetHesabiOutput {
  const results = evaluateFormulas(input);
  const kuvvetKgf = results.kuvvetKgf ?? 0;
  const breakdown = {
    kuvvetN: results.kuvvetN,
    alanEtkinCm2: results.alanEtkinCm2,
    verim: results.verim,
  };

  // rule: pistonKoluCapi < pistonCapi
  // rule: calismaBasinci >= 1 && calismaBasinci <= 16
  // rule: verim >= 50 && verim <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk kuvvet, silindir secimi gozden gecirilmeli
  // threshold skipped (non-JS): Yuksek kuvvet, yapisal dayanim kontrol edilmeli

  const dataConfidenceAdjusted = (() => { try { return dataConfidence ? results.kuvvetKgf * (dataConfidence/100) : results.kuvvetKgf; } catch { return kuvvetKgf; } })();

  return {
    kuvvetKgf,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Silindir karsilastirma"],
  };
}
