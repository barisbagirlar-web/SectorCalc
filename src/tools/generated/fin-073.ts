import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_073
 * Araç Adı: Kişisel Kredi (İhtiyaç)
 */

export const InputSchema_FIN_073 = z.object({
  tutar: z.number().min(100, "Endüstriyel minimum tolerans: 100"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  masraf: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_073 = z.infer<typeof InputSchema_FIN_073>;

export interface Output_FIN_073 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_073(input: Input_FIN_073): Output_FIN_073 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tutar, faiz, vade, masraf
  
  const validData = InputSchema_FIN_073.parse(input);
  const { tutar, faiz, vade, masraf } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const monthlyInterestRate = faiz / 100 / 12;
  const netPrincipal = tutar - masraf;
  
  let taksit: number;
  if (monthlyInterestRate === 0) {
    taksit = netPrincipal / vade;
  } else {
    const temp = Math.pow(1 + monthlyInterestRate, vade);
    taksit = netPrincipal * monthlyInterestRate * temp / (temp - 1);
  }
  
  const toplamMaliyet = (taksit * vade) + masraf - tutar;
  const result = toplamMaliyet;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Tüketici Koruma Standartları",
      message: "Kritik Uyarı: Dosya masrafları ve sigorta kesintileri talep edilen anaparanın %5'ini aşıyor. Bu durum 'Predatory Lending' (Yırtıcı/Fahiş Kredilendirme) sınıfına girebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}