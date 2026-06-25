import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_023
 * Araç Adı: İç Verim Oranı (IRR)
 */

export const InputSchema_FIN_023 = z.object({
  nakitAkislari: z.array(z.number()).nonempty("Nakit akışları dizisi boş olamaz."),
});

export type Input_FIN_023 = z.infer<typeof InputSchema_FIN_023>;

export interface Output_FIN_023 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_023(input: Input_FIN_023): Output_FIN_023 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: NakitAkislari (Dizi ₺)
  
  const validData = InputSchema_FIN_023.parse(input);
  const { nakitAkislari } = validData;
  
  // Newton-Raphson yöntemi ile IRR hesaplama (NPV(r)=0)
  const calculateNPV = (rate: number, cashFlows: number[]): number => {
    return cashFlows.reduce((npv, cf, t) => {
      return npv + cf / Math.pow(1 + rate, t);
    }, 0);
  };

  const calculateNPVDerivative = (rate: number, cashFlows: number[]): number => {
    return cashFlows.reduce((sum, cf, t) => {
      return sum - (t * cf) / Math.pow(1 + rate, t + 1);
    }, 0);
  };

  const findIRR = (cashFlows: number[], guess: number = 0.1, tolerance: number = 1e-7, maxIterations: number = 1000): number => {
    let rate = guess;
    for (let i = 0; i < maxIterations; i++) {
      const npv = calculateNPV(rate, cashFlows);
      if (Math.abs(npv) < tolerance) {
        return rate;
      }
      const derivative = calculateNPVDerivative(rate, cashFlows);
      if (Math.abs(derivative) < 1e-12) {
        // Türev çok küçük, farklı bir başlangıç değeri dene
        break;
      }
      rate = rate - npv / derivative;
    }
    // Yakınsama olmazsa farklı başlangıç değerleri dene
    const alternativeGuesses = [-0.5, 0.0, 0.2, 0.5, 1.0];
    for (const guess of alternativeGuesses) {
      let rate = guess;
      for (let i = 0; i < maxIterations; i++) {
        const npv = calculateNPV(rate, cashFlows);
        if (Math.abs(npv) < tolerance) {
          return rate;
        }
        const derivative = calculateNPVDerivative(rate, cashFlows);
        if (Math.abs(derivative) < 1e-12) continue;
        rate = rate - npv / derivative;
      }
    }
    return NaN; // Yakınsama başarısız
  };

  const result: number = findIRR(nakitAkislari) * 100; // Ondalık değeri yüzdeye çevir
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Kurumsal Finans",
      message: "Bilgi: Nakit akışlarında negatif-pozitif işaret değişimi birden fazla kez oluyorsa (örn: ortadaki yıllarda ek büyük yatırımlar), çoklu IRR sorunu oluşabilir. Bu durumlarda Modifiye İç Verim Oranı (MIRR) kullanılması tavsiye edilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}