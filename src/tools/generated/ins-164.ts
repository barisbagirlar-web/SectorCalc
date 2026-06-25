import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_164
 * Araç Adı: Sosyal Güvenlik Yardımları
 */

export const InputSchema_INS_164 = z.object({
  ort_indeksli_kazanc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  emeklilik_yasi: z.number().min(50, "Endüstriyel minimum tolerans: 50"),
});

export type Input_INS_164 = z.infer<typeof InputSchema_INS_164>;

export interface Output_INS_164 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_164(input: Input_INS_164): Output_INS_164 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ort_indeksli_kazanc, emeklilik_yasi
  
  const validData = InputSchema_INS_164.parse(input);
  const { ort_indeksli_kazanc, emeklilik_yasi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // SOSYAL_GUVENLIK_FORMULU: Temel aylık = ort_indeksli_kazanc * 0.65 (standart ikame oranı)
  const temelBenefit = ort_indeksli_kazanc * 0.65;
  
  // YAS_CARPANI: Emeklilik yaşına göre düzeltme katsayısı
  // Referans yaş 65 kabul edilir, erken emeklilikte %2/ay kesinti, geç emeklilikte %1/ay artış
  const referansYas = 65;
  const yasFarki = emeklilik_yasi - referansYas;
  
  // Erken emeklilik: aylık %2 kesinti, geç emeklilik: aylık %1 artış
  let yasCarpani: number;
  if (yasFarki < 0) {
    // Erken emeklilik: her ay için %2 kesinti
    yasCarpani = 1 - (Math.abs(yasFarki) * 12 * 0.02);
  } else {
    // Geç emeklilik: her ay için %1 artış
    yasCarpani = 1 + (yasFarki * 12 * 0.01);
  }
  
  // Minimum %25, maksimum %130 sınırı
  yasCarpani = Math.max(0.25, Math.min(1.30, yasCarpani));
  
  const result = temelBenefit * yasCarpani;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (emeklilik_yasi < 65) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Erken Emeklilik Kesintileri",
      message: `Uyarı: Tam (Yasal) emeklilik yaşı olan 65'ten önce maaş almaya başlıyorsunuz. Bu karar, alacağınız aylık maaşta ömür boyu sürecek ${((1 - yasCarpani) * 100).toFixed(1)}% oranında kalıcı bir kesintiye (Penalty) neden olacaktır.`
    });
  }
  
  return {
    result,
    smartWarnings
  };
}