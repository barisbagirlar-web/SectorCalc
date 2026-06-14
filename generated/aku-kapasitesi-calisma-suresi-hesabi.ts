// Auto-generated from aku-kapasitesi-calisma-suresi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AkuKapasitesiCalismaSuresiHesabiInput {
  akuKapasitesi: number;
  gerilim: number;
  yukGucu: number;
  verimlilik: number;
  desarjDerinligi: number;
  sicaklikFaktoru: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AkuKapasitesiCalismaSuresiHesabiInputSchema = z.object({
  akuKapasitesi: z.number().min(1).max(10000).default(100),
  gerilim: z.number().min(1).max(1000).default(12),
  yukGucu: z.number().min(0.1).max(100000).default(50),
  verimlilik: z.number().min(0).max(100).default(85),
  desarjDerinligi: z.number().min(0).max(100).default(80),
  sicaklikFaktoru: z.number().min(0.5).max(1.5).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AkuKapasitesiCalismaSuresiHesabiOutput {
  calismaSuresiSaat: number;
  breakdown: {
    kullanilabilirEnerji: number;
    calismaSuresiDakika: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AkuKapasitesiCalismaSuresiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kullanilabilirEnerji = ((): number => { try { const __v = input.akuKapasitesi * input.gerilim * (desarjDerinligi / 100) * input.sicaklikFaktoru * (input.verimlilik / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.calismaSuresiSaat = ((): number => { try { const __v = results.kullanilabilirEnerji / input.yukGucu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.calismaSuresiDakika = ((): number => { try { const __v = results.calismaSuresiSaat * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.calismaSuresiSaat * 0.8 : (input.dataConfidence == 'medium' ? results.calismaSuresiSaat * 0.95 : results.calismaSuresiSaat); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAkuKapasitesiCalismaSuresiHesabi(input: AkuKapasitesiCalismaSuresiHesabiInput): AkuKapasitesiCalismaSuresiHesabiOutput {
  const results = evaluateFormulas(input);
  const calismaSuresiSaat = results.calismaSuresiSaat ?? 0;
  const breakdown = {
    kullanilabilirEnerji: results.kullanilabilirEnerji,
    calismaSuresiDakika: results.calismaSuresiDakika,
  };

  // rule: yukGucu > 0
  // rule: akuKapasitesi > 0
  // rule: gerilim > 0
  // rule: verimlilik >= 0 && verimlilik <= 100
  // rule: desarjDerinligi >= 0 && desarjDerinligi <= 100
  // rule: sicaklikFaktoru >= 0.5 && sicaklikFaktoru <= 1.5
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk verimlilik, sistem kayiplari yuksek.
  // threshold skipped (non-JS): Yuksek desarj derinligi aku omrunu kisaltabilir.
  // threshold skipped (non-JS): Sicaklik faktoru ideal araligin disinda.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return calismaSuresiSaat; } })();

  return {
    calismaSuresiSaat,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
