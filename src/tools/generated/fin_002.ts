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
 * ID: FIN_002
 * Name: 1031 Vergi Erteleme Takası
 */

export const InputSchema_FIN_002 = z.object({
  satis_fiyati: z.number(),
  kalan_borc: z.number(),
  yeni_yatirim: z.number(),
});

export type Input_FIN_002 = z.infer<typeof InputSchema_FIN_002>;

export interface Output_FIN_002 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_002(input: Input_FIN_002): Output_FIN_002 {
  const validData = InputSchema_FIN_002.parse(input);
  const { satis_fiyati, kalan_borc, yeni_yatirim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (satis_fiyati < kalan_borc) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Finansal Mantık",
        message: "Kritik Uyarı: Kalan borç satış fiyatından yüksek. Gayrimenkul 'sualtında' (underwater) durumdadır."
      });
    }

    if ((satis_fiyati - kalan_borc) > yeni_yatirim) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Vergi Mevzuatı",
        message: "Uyarı: Yeni yatırım bedeli, elde edilen net nakitten (Satış - Borç) düşüktür. Aradaki fark (Boot) doğrudan sermaye kazancı vergisine tabidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
