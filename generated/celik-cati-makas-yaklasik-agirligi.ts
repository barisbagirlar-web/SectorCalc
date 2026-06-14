// Auto-generated from celik-cati-makas-yaklasik-agirligi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CelikCatiMakasYaklasikAgirligiInput {
  catiAcikligi: number;
  makasAraligi: number;
  catiEgimi: number;
  celikSinifi: 'S235' | 'S275' | 'S355' | 'S420';
  karYuku: number;
  ruzgarYuku: number;
  ekYuk: number;
}

export const CelikCatiMakasYaklasikAgirligiInputSchema = z.object({
  catiAcikligi: z.number().min(5).max(50).default(20),
  makasAraligi: z.number().min(2).max(10).default(5),
  catiEgimi: z.number().min(5).max(45).default(15),
  celikSinifi: z.enum(['S235', 'S275', 'S355', 'S420']).default('S235'),
  karYuku: z.number().min(0).max(5).default(0.75),
  ruzgarYuku: z.number().min(0).max(3).default(0.5),
  ekYuk: z.number().min(0).max(1).default(0.2),
});

export interface CelikCatiMakasYaklasikAgirligiOutput {
  yaklasikAgirlik: number;
  breakdown: {
    toplamYuk: number;
    birimBoyYuk: number;
    kesitKatsayisi: number;
    agirlik: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CelikCatiMakasYaklasikAgirligiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toplamYuk = (() => { try { return input.karYuku + input.ruzgarYuku + input.ekYuk; } catch { return 0; } })();
  results.birimBoyYuk = (() => { try { return results.toplamYuk * input.makasAraligi; } catch { return 0; } })();
  results.kesitKatsayisi = (() => { try { return input.catiAcikligi <= 20 ? 0.012 : (input.catiAcikligi <= 30 ? 0.015 : 0.018); } catch { return 0; } })();
  results.agirlik = (() => { try { return results.kesitKatsayisi * results.birimBoyYuk * input.catiAcikligi * input.catiAcikligi * (1 + 0.01 * input.catiEgimi); } catch { return 0; } })();
  results.celikDuzeltme = (() => { try { return input.celikSinifi == 'S235' ? 1.0 : (input.celikSinifi == 'S275' ? 0.95 : (input.celikSinifi == 'S355' ? 0.9 : 0.85)); } catch { return 0; } })();
  results.yaklasikAgirlik = (() => { try { return results.agirlik * results.celikDuzeltme; } catch { return 0; } })();
  return results;
}

export function calculateCelikCatiMakasYaklasikAgirligi(input: CelikCatiMakasYaklasikAgirligiInput): CelikCatiMakasYaklasikAgirligiOutput {
  const results = evaluateFormulas(input);
  const yaklasikAgirlik = results.yaklasikAgirlik ?? 0;
  const breakdown = {
    toplamYuk: results.toplamYuk,
    birimBoyYuk: results.birimBoyYuk,
    kesitKatsayisi: results.kesitKatsayisi,
    agirlik: results.agirlik,
  };

  // rule: catiAcikligi must be between 5 and 50 m
  // rule: makasAraligi must be between 2 and 10 m
  // rule: catiEgimi must be between 5 and 45 degrees
  // rule: karYuku must be between 0 and 5 kN/m²
  // rule: ruzgarYuku must be between 0 and 3 kN/m²
  // rule: ekYuk must be between 0 and 1 kN/m²
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Buyuk aciklik, ozel tasarim gerekebilir
  // threshold skipped (non-JS): Yuksek kar yuku, takviye gerekebilir
  // threshold skipped (non-JS): Yuksek ruzgar yuku, baglanti detaylari onemli

  const dataConfidenceAdjusted = (() => { try { return yaklasikAgirlik; } catch { return yaklasikAgirlik; } })();

  return {
    yaklasikAgirlik,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli malzeme dokumu"],
  };
}
