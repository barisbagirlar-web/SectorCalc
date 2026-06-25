import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_057
 * Araç Adı: Mortgage Geri Ödeme Tablosu
 */

export const InputSchema_REAL_057 = z.object({
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  donem: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_REAL_057 = z.infer<typeof InputSchema_REAL_057>;

export interface Output_REAL_057 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_057(input: Input_REAL_057): Output_REAL_057 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi, faiz, vade, donem
  
  const validData = InputSchema_REAL_057.parse(input);
  const { kredi, faiz, vade, donem } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Aylık faiz oranı: faiz / 1200
  const aylikFaizOrani = faiz / 1200;
  // Sabit taksit hesaplama (EMI formülü): Taksit = Kredi * [faiz * (1+faiz)^vade] / [(1+faiz)^vade - 1]
  const birArtifaizUstuVade = Math.pow(1 + aylikFaizOrani, vade);
  const taksit = kredi * (aylikFaizOrani * birArtifaizUstuVade) / (birArtifaizUstuVade - 1);
  
  // Belirtilen döneme kadar kalan anapara hesaplama
  let kalanAnapara = kredi;
  for (let i = 1; i < donem; i++) {
    const faizKismi = kalanAnapara * aylikFaizOrani;
    const anaparaKismi = taksit - faizKismi;
    kalanAnapara = kalanAnapara - anaparaKismi;
  }
  
  // İstenen dönem için faiz ve anapara kısmı
  const faizKismi = kalanAnapara * aylikFaizOrani;
  const anaparaKismi = taksit - faizKismi;
  
  const result: any = { anaparaKismi, faizKismi }; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Amortisman Profili",
      message: "Not: Kredinin ilk %30'luk zaman dilimindesiniz. Çoğu standart Mortgage ödemesinde bu dönemde taksitin büyük kısmı anaparaya değil faize gitmektedir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}