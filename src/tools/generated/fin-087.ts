import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_087
 * Araç Adı: Kredi Uygunluk (Affordability)
 */

export const InputSchema_FIN_087 = z.object({
  net_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yasam_gideri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  max_taksit_orani: z.number().min(10, "Endüstriyel minimum tolerans: 10"),
});

export type Input_FIN_087 = z.infer<typeof InputSchema_FIN_087>;

export interface Output_FIN_087 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_087(input: Input_FIN_087): Output_FIN_087 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: net_gelir, yasam_gideri, max_taksit_orani
  
  const validData = InputSchema_FIN_087.parse(input);
  const { net_gelir, yasam_gideri, max_taksit_orani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const harcanabilir_gelir = net_gelir - yasam_gideri;
  const maksimum_oran_limiti = net_gelir * (max_taksit_orani / 100);
  const result = Math.min(harcanabilir_gelir, maksimum_oran_limiti);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Bütçe Analizi",
      message: "Kritik Uyarı: Temel yaşam giderleriniz mevcut net gelirinizi tamamen tüketiyor. Matematiksel olarak herhangi bir borçlanma kapasiteniz (Disposable Income) bulunmamaktadır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}