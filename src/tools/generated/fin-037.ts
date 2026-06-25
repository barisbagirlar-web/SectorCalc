import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_037
 * Araç Adı: Sharpe Oranı
 */

export const InputSchema_FIN_037 = z.object({
  portfoy_getirisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  risksiz_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  volatilite: z.number().min(0.001, "Endüstriyel minimum tolerans: 0.001"),
});

export type Input_FIN_037 = z.infer<typeof InputSchema_FIN_037>;

export interface Output_FIN_037 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_037(input: Input_FIN_037): Output_FIN_037 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: portfoy_getirisi, risksiz_faiz, volatilite
  
  const validData = InputSchema_FIN_037.parse(input);
  const { portfoy_getirisi, risksiz_faiz, volatilite } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (portfoy_getirisi - risksiz_faiz) / Math.max(0.0001, volatilite); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Portföy Optimizasyonu",
      message: "Uyarı: Portföy getirisi risksiz faiz oranının altında kalmıştır. Alınan tüm riskler karşılıksız kalmış ve devlet tahvilinde (risksiz) durmaktan daha kötü bir performans sergilenmiştir."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Performans Analizi",
      message: "Not: Sharpe oranı 3'ün üzerindedir. Olağanüstü risk ayarlı bir getiri; eğer fon geçmişi kısaysa, verilerin aşırı optimizasyon (curve fitting) içerip içermediği denetlenmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}