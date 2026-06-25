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
 * ID: MECH_259
 * Name: Pompa Mil Gücü (Brake Horsepower - BHP)
 */

export const InputSchema_MECH_259 = z.object({
  debi: z.number(),
  basma_yuksekligi: z.number(),
  yogunluk: z.number(),
  verim: z.number(),
});

export type Input_MECH_259 = z.infer<typeof InputSchema_MECH_259>;

export interface Output_MECH_259 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_259(input: Input_MECH_259): Output_MECH_259 {
  const validData = InputSchema_MECH_259.parse(input);
  const { debi, basma_yuksekligi, yogunluk, verim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (verim < 50) {
      smartWarnings.push({
        severity: "WARNING",
        source: "API 610 / ISO 9906",
        message: "Uyarı: Pompa verimi %50'nin altında. Seçilen pompa sistemin BEP (En Verimli Çalışma Noktası) değerinin çok dışında çalışıyor. Bu durum aşırı enerji tüketimine, radyal rulman yorulmasına ve şaft kesmesine neden olur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
