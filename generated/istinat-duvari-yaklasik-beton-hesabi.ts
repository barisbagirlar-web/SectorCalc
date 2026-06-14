// Auto-generated from istinat-duvari-yaklasik-beton-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IstinatDuvariYaklasikBetonHesabiInput {
  duvarYuksekligi: number;
  duvarUzunlugu: number;
  duvarTipi: 'konsol' | 'gabion' | 'prekast' | 'betonarme';
  zeminTipi: 'kumlu' | 'killi' | 'kayali' | 'siltli';
  betonSinifi: 'C20' | 'C25' | 'C30' | 'C35' | 'C40';
  donatiOrani: number;
  birimBetonFiyati: number;
  birimDonatiFiyati: number;
  isciVerimliligi: number;
  iscilikUcreti: number;
}

export const IstinatDuvariYaklasikBetonHesabiInputSchema = z.object({
  duvarYuksekligi: z.number().min(0.5).max(15).default(3),
  duvarUzunlugu: z.number().min(1).max(100).default(10),
  duvarTipi: z.enum(['konsol', 'gabion', 'prekast', 'betonarme']).default('konsol'),
  zeminTipi: z.enum(['kumlu', 'killi', 'kayali', 'siltli']).default('kumlu'),
  betonSinifi: z.enum(['C20', 'C25', 'C30', 'C35', 'C40']).default('C25'),
  donatiOrani: z.number().min(0.5).max(4).default(1),
  birimBetonFiyati: z.number().min(200).max(2000).default(800),
  birimDonatiFiyati: z.number().min(5).max(50).default(15),
  isciVerimliligi: z.number().min(1).max(5).default(2.5),
  iscilikUcreti: z.number().min(200).max(1500).default(500),
});

export interface IstinatDuvariYaklasikBetonHesabiOutput {
  toplamMaliyet: number;
  breakdown: {
    betonHacmi: number;
    donatiAgirligi: number;
    betonMaliyeti: number;
    donatiMaliyeti: number;
    iscilikMaliyeti: number;
    birimMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IstinatDuvariYaklasikBetonHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.betonHacmi = ((): number => { try { const __v = results.kesitAlani * input.duvarUzunlugu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.donatiAgirligi = ((): number => { try { const __v = results.betonHacmi * (input.donatiOrani / 100) * 7850; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.betonMaliyeti = ((): number => { try { const __v = results.betonHacmi * input.birimBetonFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.donatiMaliyeti = ((): number => { try { const __v = results.donatiAgirligi * input.birimDonatiFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isciGunSayisi = ((): number => { try { const __v = results.betonHacmi / input.isciVerimliligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.iscilikMaliyeti = ((): number => { try { const __v = results.isciGunSayisi * input.iscilikUcreti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.betonMaliyeti + results.donatiMaliyeti + results.iscilikMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimMaliyet = ((): number => { try { const __v = results.toplamMaliyet / results.betonHacmi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIstinatDuvariYaklasikBetonHesabi(input: IstinatDuvariYaklasikBetonHesabiInput): IstinatDuvariYaklasikBetonHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    betonHacmi: results.betonHacmi,
    donatiAgirligi: results.donatiAgirligi,
    betonMaliyeti: results.betonMaliyeti,
    donatiMaliyeti: results.donatiMaliyeti,
    iscilikMaliyeti: results.iscilikMaliyeti,
    birimMaliyet: results.birimMaliyet,
  };

  // rule: duvarYuksekligi >= 0.5
  // rule: duvarYuksekligi <= 15.0
  // rule: duvarUzunlugu >= 1.0
  // rule: duvarUzunlugu <= 100.0
  // rule: donatiOrani >= 0.5
  // rule: donatiOrani <= 4.0
  // rule: birimBetonFiyati >= 200
  // rule: birimBetonFiyati <= 2000
  // rule: birimDonatiFiyati >= 5
  // rule: birimDonatiFiyati <= 50
  // rule: isciVerimliligi >= 1.0
  // rule: isciVerimliligi <= 5.0
  // rule: iscilikUcreti >= 200
  // rule: iscilikUcreti <= 1500
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Donati orani yuksek, maliyet artabilir.
  // threshold skipped (non-JS): Isci verimliligi dusuk, is gucu planlamasi gozden gecirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet * 1.1; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
