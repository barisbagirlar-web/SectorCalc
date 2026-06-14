// Auto-generated from civata-on-germe-kuvveti-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CivataOnGermeKuvvetiHesabiInput {
  civataCapi: number;
  adim: number;
  malzemeSinifi: '4.6' | '5.6' | '6.8' | '8.8' | '10.9' | '12.9';
  surtunmeKatsayisi: number;
  onGermeYuzdesi: number;
}

export const CivataOnGermeKuvvetiHesabiInputSchema = z.object({
  civataCapi: z.number().min(6).max(100).default(16),
  adim: z.number().min(0.5).max(6).default(2),
  malzemeSinifi: z.enum(['4.6', '5.6', '6.8', '8.8', '10.9', '12.9']).default('8.8'),
  surtunmeKatsayisi: z.number().min(0.08).max(0.3).default(0.15),
  onGermeYuzdesi: z.number().min(50).max(90).default(70),
});

export interface CivataOnGermeKuvvetiHesabiOutput {
  onGermeKuvveti: number;
  breakdown: {
    gerilmeAlani: number;
    akmaDayanimi: number;
    tork: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CivataOnGermeKuvvetiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gerilmeAlani = ((): number => { try { const __v = π/4 * (input.civataCapi - 0.9382 * input.adim)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.akmaDayanimi = ((): number => { try { const __v = (Number(input.malzemeSinifi) || 0) === '4.6' ? 240 : (Number(input.malzemeSinifi) || 0) === '5.6' ? 300 : (Number(input.malzemeSinifi) || 0) === '6.8' ? 480 : (Number(input.malzemeSinifi) || 0) === '8.8' ? 640 : (Number(input.malzemeSinifi) || 0) === '10.9' ? 900 : 1080; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.onGermeKuvveti = ((): number => { try { const __v = input.onGermeYuzdesi / 100 * results.akmaDayanimi * results.gerilmeAlani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tork = ((): number => { try { const __v = results.onGermeKuvveti * (0.16 * input.adim + 0.577 * input.surtunmeKatsayisi * input.civataCapi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCivataOnGermeKuvvetiHesabi(input: CivataOnGermeKuvvetiHesabiInput): CivataOnGermeKuvvetiHesabiOutput {
  const results = evaluateFormulas(input);
  const onGermeKuvveti = results.onGermeKuvveti ?? 0;
  const breakdown = {
    gerilmeAlani: results.gerilmeAlani,
    akmaDayanimi: results.akmaDayanimi,
    tork: results.tork,
  };

  // rule: civataCapi >= 6 && civataCapi <= 100
  // rule: adim >= 0.5 && adim <= 6
  // rule: surtunmeKatsayisi >= 0.08 && surtunmeKatsayisi <= 0.3
  // rule: onGermeYuzdesi >= 50 && onGermeYuzdesi <= 90
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek on germe yuzdesi, malzeme akmasi riski olusturabilir.
  // threshold skipped (non-JS): Dusuk surtunme katsayisi, tork kontrolunde hassasiyet gerektirir.

  const dataConfidenceAdjusted = (() => { try { return results.onGermeKuvveti; } catch { return onGermeKuvveti; } })();

  return {
    onGermeKuvveti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
