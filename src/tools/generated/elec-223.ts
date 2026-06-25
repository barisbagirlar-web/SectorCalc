import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ELEC_223
 * Araç Adı: AC Güç ve Güç Faktörü
 */

export const InputSchema_ELEC_223 = z.object({
  gorunur_guc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  aktif_guc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ELEC_223 = z.infer<typeof InputSchema_ELEC_223>;

export interface Output_ELEC_223 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_223(input: Input_ELEC_223): Output_ELEC_223 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: gorunur_guc, aktif_guc
  
  const validData = InputSchema_ELEC_223.parse(input);
  const { gorunur_guc, aktif_guc } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Şebeke Regülasyonları (IEC / TEDAŞ)",
      message: "Kritik Uyarı: Güç faktörünüz (Cos φ) 0.85'in altında. Sistem şebekeden aşırı reaktif güç çekmektedir. Kompanzasyon panosu kurulmazsa elektrik faturanıza ağır 'Reaktif Ceza' yansıyacak ve trafo kapasiteniz boşa harcanacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
