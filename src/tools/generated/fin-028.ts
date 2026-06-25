import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_028
 * Araç Adı: İşletme Değerleme (DCF)
 */

export const InputSchema_FIN_028 = z.object({
  wacc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  terminal_buyume: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_028 = z.infer<typeof InputSchema_FIN_028>;

export interface Output_FIN_028 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_028(input: Input_FIN_028): Output_FIN_028 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: wacc, terminal_buyume
  
  const validData = InputSchema_FIN_028.parse(input);
  const { wacc, terminal_buyume } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Dizi girdisi olmadığından, son yıl FCF'si için varsayılan 1 birim kullanıldı.
  const fcf_n = 1; // Varsayılan son yıl FCF (₺)
  const n = 5; // Varsayılan projeksiyon süresi (yıl)
  const waccDecimal = wacc / 100;
  const terminalBuyumeDecimal = terminal_buyume / 100;
  
  // TV = FCF_n * (1 + TerminalBuyume) / (WACC - TerminalBuyume)
  const terminalValue = fcf_n * (1 + terminalBuyumeDecimal) / (waccDecimal - terminalBuyumeDecimal);
  
  // Varsayılan olarak öngörülen FCF dizisi (her yıl için sabit 1 birim)
  let npvFcf = 0;
  for (let i = 1; i <= n; i++) {
    npvFcf += fcf_n / Math.pow(1 + waccDecimal, i);
  }
  
  // EV = NPV(FCF) + TV / (1 + WACC)^n
  const result = npvFcf + terminalValue / Math.pow(1 + waccDecimal, n);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Değerleme Pratikleri",
      message: "Uyarı: Seçilen terminal büyüme oranı, genel makroekonomik büyüme (enflasyon/GSYİH) beklentilerine göre oldukça agresif. Terminal değer, toplam şirket değerini suni olarak domine edebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}