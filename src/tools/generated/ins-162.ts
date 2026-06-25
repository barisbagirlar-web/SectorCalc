import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_162
 * Araç Adı: Backdoor Roth IRA Dönüşümü
 */

export const InputSchema_INS_162 = z.object({
  geleneksel_bakiye: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  donusen_tutar: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  vergi_orani: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_162 = z.infer<typeof InputSchema_INS_162>;

export interface Output_INS_162 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_162(input: Input_INS_162): Output_INS_162 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: geleneksel_bakiye, donusen_tutar, vergi_orani
  
  const validData = InputSchema_INS_162.parse(input);
  const { geleneksel_bakiye, donusen_tutar, vergi_orani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const vergi = donusen_tutar * (vergi_orani / 100);
  const result = geleneksel_bakiye + donusen_tutar - vergi;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "IRS Pro-Rata Kuralı",
      message: "Uyarı: Eğer Geleneksel IRA hesaplarınızda daha önceden vergi avantajıyla (Vergi Öncesi) yatırdığınız paralar varsa, 'Pro-Rata' kuralı devreye girer. Sadece vergisini ödediğiniz kısmı değil, tüm bakiyenin oranına göre sürpriz bir vergi faturasıyla (Tax Bill) karşılaşabilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}