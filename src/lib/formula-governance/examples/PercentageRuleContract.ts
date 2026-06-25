import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç: FIN_001 - Yüzde Kuralı (Percentage Rule)
 * 
 * Basit bir hesaplamayı, otonom kararlar üretebilen bir endüstri otoritesine dönüştürür.
 * Girdiler, "smart_warnings" ve tolerans sınırları bu katmanda güvence altına alınır.
 */

// 1. Zod ile Tolerans ve Input Kilitleri (Endüstriyel Sınırlar)
export const PercentageRuleInputSchema = z.object({
  aylik_kira: z.number().min(1, "Kira bedeli 0 veya negatif olamaz."),
  mulk_degeri: z.number().min(1000, "Geçerli bir mülk değeri giriniz.")
});

export type PercentageRuleInput = z.infer<typeof PercentageRuleInputSchema>;

// 2. Akıllı Uyarı Tipleri
export type SmartWarningSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface SmartWarning {
  severity: SmartWarningSeverity;
  source: string; // Örn: ISO 9001, Big Four, Gayrimenkul Piyasa Standartları
  message: string;
}

export interface PercentageRuleOutput {
  oran: number; // % cinsinden oran
  smartWarnings: SmartWarning[];
}

// 3. Formula Contract & Otonom Karar Motoru (Rule Engine)
export function executePercentageRule(input: PercentageRuleInput): PercentageRuleOutput {
  // Veriyi validate et (Zod şeması ile P2.4 Runtime Trust katmanı)
  const validData = PercentageRuleInputSchema.parse(input);

  const { aylik_kira, mulk_degeri } = validData;

  // Matematiksel Formül (Zero-division güvenliği)
  const safeMulkDegeri = Math.max(1, mulk_degeri);
  const oran = (aylik_kira / safeMulkDegeri) * 100;

  const smartWarnings: SmartWarning[] = [];

  // OTONOM MÜHENDİSLİK / FİNANS UYARILARI (Smart Warnings Entegrasyonu)
  if (oran < 0.4) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Gayrimenkul Yatırım Metrikleri",
      message: "Uyarı: Kira getirisi mülk değerinin %0.4'ünün altındadır. Amortisman süresi (ROI) 20 yılın üzerindedir, bu düşük verimli bir yatırımdır."
    });
  }

  if (oran > 2.0) {
    smartWarnings.push({
      severity: "INFO",
      source: "Piyasa Standartları (Big Four)",
      message: "Not: %2'nin üzerindeki aylık kira getirileri genellikle mikro apartmanlar, kısa dönem kiralama veya yüksek riskli bölgeler için geçerlidir. Veriyi doğrulayın."
    });
  }

  return {
    oran: Number(oran.toFixed(2)),
    smartWarnings
  };
}
