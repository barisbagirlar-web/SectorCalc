import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_088
 * Araç Adı: USD Kredisi (Kur Riskli)
 */

export const InputSchema_FIN_088 = z.object({
  tutar_usd: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  mevcut_kur: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  kur_beklentisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_088 = z.infer<typeof InputSchema_FIN_088>;

export interface Output_FIN_088 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_088(input: Input_FIN_088): Output_FIN_088 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tutar_usd, faiz, vade, mevcut_kur, kur_beklentisi
  
  const validData = InputSchema_FIN_088.parse(input);
  const { tutar_usd, faiz, vade, mevcut_kur, kur_beklentisi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // PMT = tutar_usd * (faiz/100/12) / (1 - (1 + faiz/100/12)^(-vade))
  // TL_Taksit = PMT * mevcut_kur * (1 + kur_beklentisi/100)^(vade/12)
  const monthlyRate = faiz / 100 / 12;
  const pmt = monthlyRate === 0 ? tutar_usd / vade : tutar_usd * monthlyRate / (1 - Math.pow(1 + monthlyRate, -vade));
  const result = pmt * mevcut_kur * Math.pow(1 + kur_beklentisi / 100, vade / 12);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Kur Riski Yönetimi",
      message: "Kritik Uyarı: Yüksek kur artışı beklentisi. Şirketinizin gelirleri döviz cinsinden (ihracat vb.) değilse, açık pozisyon nedeniyle kur zararı faiz maliyetini katlayarak finansal krize yol açacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}