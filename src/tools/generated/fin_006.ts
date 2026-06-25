/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: FIN_006
 * Name: Yıllık Ödeme (Annuity Payout)
 */

export const InputSchema_FIN_006 = z.object({
  birikim: z.number(),
  faiz: z.number(),
  sure: z.number(),
});

export type Input_FIN_006 = z.infer<typeof InputSchema_FIN_006>;

export interface Output_FIN_006 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_006(input: Input_FIN_006): Output_FIN_006 {
  const validData = InputSchema_FIN_006.parse(input);
  const { birikim, faiz, sure } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Gelir / birikim > 0.08) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Güvenli Çekim Oranı (%4 Kuralı)",
        message: "Uyarı: Yıllık çekim oranınız toplam birikiminizin %8'ini aşıyor. Piyasaların kötü gitmesi durumunda emeklilik fonunuzun planlanandan çok daha erken tükenme riski yüksektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
