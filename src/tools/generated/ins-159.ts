import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_159
 * Araç Adı: Emeklilik Tarihi (Runway)
 */

export const InputSchema_INS_159 = z.object({
  hedef_portfoy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  mevcut_birikim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  aylik_katki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_159 = z.infer<typeof InputSchema_INS_159>;

export interface Output_INS_159 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_159(input: Input_INS_159): Output_INS_159 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: hedef_portfoy, mevcut_birikim, aylik_katki, faiz
  
  const validData = InputSchema_INS_159.parse(input);
  const { hedef_portfoy, mevcut_birikim, aylik_katki, faiz } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const aylikFaiz = faiz / 1200;
  const pay = (hedef_portfoy * aylikFaiz + aylik_katki) / (mevcut_birikim * aylikFaiz + aylik_katki);
  const payda = 1 + aylikFaiz;
  const result = Math.log(Math.max(0.0001, pay)) / Math.log(Math.max(0.0001, payda));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 600) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "FIRE (Finansal Bağımsızlık) Metrikleri",
      message: "Kritik Uyarı: Mevcut tasarruf hızınız ve getiri oranınızla hedefinize ulaşmanız 50 yılı aşıyor. Hedefinize sağken ulaşmak için katkı miktarını dramatik olarak artırmanız veya beklentilerinizi düşürmeniz şarttır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}