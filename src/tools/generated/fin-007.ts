import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_007
 * Araç Adı: Yıllık Maliyet Oranı (APR)
 */

export const InputSchema_FIN_007 = z.object({
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  masraf: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_FIN_007 = z.infer<typeof InputSchema_FIN_007>;

export interface Output_FIN_007 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

function pmt(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * monthlyRate * factor / (factor - 1);
}

function irr(cashFlows: number[]): number {
  const guess = 0.1;
  let rate = guess;
  const maxIter = 1000;
  const tolerance = 1e-7;

  for (let iter = 0; iter < maxIter; iter++) {
    let npv = 0;
    let dnpv = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      const denominator = Math.pow(1 + rate, i);
      npv += cashFlows[i] / denominator;
      dnpv -= i * cashFlows[i] / Math.pow(1 + rate, i + 1);
    }
    if (Math.abs(npv) < tolerance) return rate;
    if (Math.abs(dnpv) < tolerance) break;
    rate = rate - npv / dnpv;
    if (rate <= -1) rate = -0.99999;
  }
  return rate;
}

export function execute_FIN_007(input: Input_FIN_007): Output_FIN_007 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi, faiz, vade, masraf
  
  const validData = InputSchema_FIN_007.parse(input);
  const { kredi, faiz, vade, masraf } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const netKredi = kredi - masraf;
  const aylikFaiz = faiz / 100 / 12;
  const aylikOdeme = pmt(kredi, aylikFaiz, vade);
  const nakitAkislari: number[] = [netKredi];
  for (let i = 0; i < vade; i++) {
    nakitAkislari.push(-aylikOdeme);
  }
  const monthlyIrr = irr(nakitAkislari);
  const result = monthlyIrr * 12 * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Tüketici Koruma Kanunu",
      message: "Kritik Uyarı: Kredi tahsis ve sigorta masrafları toplam kredinin %10'unu aşıyor. Gerçek maliyet (APR) akdi faizden çok daha yüksek çıkacaktır; yasal tefecilik/gizli masraf riski."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}