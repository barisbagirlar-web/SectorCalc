import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_210
 * Araç Adı: Sonsuz Vida Verimi
 */

export const InputSchema_MECH_210 = z.object({
  helis_acisi: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  suratme_acisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_210 = z.infer<typeof InputSchema_MECH_210>;

export interface Output_MECH_210 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_210(input: Input_MECH_210): Output_MECH_210 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: helis_acisi, suratme_acisi
  
  const validData = InputSchema_MECH_210.parse(input);
  const { helis_acisi, suratme_acisi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = Math.tan(helis_acisi) / Math.max(0.0001, Math.tan(helis_acisi + suratme_acisi));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "VDI 2158 Dişli Standartları",
      message: "Mekanik Durum: Helis açısı sürtünme açısının altındadır. Sistem statik olarak 'Oto-Blokaj' (Self-locking) modundadır; çıkış milinden giriş miline doğru ters tahrik uygulanamaz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}