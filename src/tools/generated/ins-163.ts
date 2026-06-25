import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_163
 * Araç Adı: IRA RMD (Asgari Dağıtım)
 */

export const InputSchema_INS_163 = z.object({
  bakiye: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yasam_beklentisi: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_INS_163 = z.infer<typeof InputSchema_INS_163>;

export interface Output_INS_163 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_163(input: Input_INS_163): Output_INS_163 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: bakiye, yasam_beklentisi
  
  const validData = InputSchema_INS_163.parse(input);
  const { bakiye, yasam_beklentisi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = bakiye / Math.max(1, yasam_beklentisi);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Emeklilik Regülasyonları",
      message: "Kritik Uyarı: Yasal yaş sınırını geçtiyseniz, hesaplanan bu RMD tutarını yıl sonuna kadar çekmek ZORUNDASINIZ. Çekilmemesi veya eksik çekilmesi durumunda eksik tutar üzerinden %50'ye varan ağır vergi cezaları (Penalty) uygulanır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}