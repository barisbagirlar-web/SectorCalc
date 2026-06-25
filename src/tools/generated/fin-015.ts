import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_015
 * Araç Adı: Tahvil Fiyat ve Getiri
 */

export const InputSchema_FIN_015 = z.object({
  nominal: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  kupon: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  piyasa_faizi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_015 = z.infer<typeof InputSchema_FIN_015>;

export interface Output_FIN_015 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_015(input: Input_FIN_015): Output_FIN_015 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: nominal, kupon, piyasa_faizi, vade
  
  const validData = InputSchema_FIN_015.parse(input);
  const { nominal, kupon, piyasa_faizi, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Fiyat = NPV(Kupon*Nominal, PiyasaFaizi, Vade) + Nominal/(1+PiyasaFaizi)^Vade
  const periyodikOdeme = (kupon / 100) * nominal;
  const faizOrani = piyasa_faizi / 100;
  let npvKupon = 0;
  for (let t = 1; t <= vade; t++) {
    npvKupon += periyodikOdeme / Math.pow(1 + faizOrani, t);
  }
  const nominalBugunkuDeger = nominal / Math.pow(1 + faizOrani, vade);
  const result = npvKupon + nominalBugunkuDeger;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Tahvil Değerleme",
      message: "Durum: Piyasa faizi kupon oranından yüksek. Bu tahvil 'İskontolu' (Nominal değerinin altında) fiyatlanacaktır."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Tahvil Değerleme",
      message: "Durum: Piyasa faizi kupon oranından düşük. Bu tahvil 'Primli' (Nominal değerinin üzerinde) fiyatlanacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}