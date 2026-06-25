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
 * ID: ELEC_225
 * Name: AC Motor Senkron Hız ve Kayma (Slip)
 */

export const InputSchema_ELEC_225 = z.object({
  frekans: z.number(),
  kutup_sayisi: z.number(),
  rotor_hizi: z.number(),
});

export type Input_ELEC_225 = z.infer<typeof InputSchema_ELEC_225>;

export interface Output_ELEC_225 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_225(input: Input_ELEC_225): Output_ELEC_225 {
  const validData = InputSchema_ELEC_225.parse(input);
  const { frekans, kutup_sayisi, rotor_hizi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((((120 * frekans) / kutup_sayisi) - rotor_hizi) / ((120 * frekans) / kutup_sayisi) * 100 > 10) {
      smartWarnings.push({
        severity: "WARNING",
        source: "NEMA Motor Standartları",
        message: "Uyarı: Motor kayması (Slip) %10'un üzerindedir. Endüstriyel asenkron motorlarda normal kayma %1-5 arasındadır. Aşırı kayma, motorun mekanik olarak aşırı yüklendiğini (Overload) veya şebeke voltajının çok düşük olduğunu gösterir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
