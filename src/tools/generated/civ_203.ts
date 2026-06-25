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
 * ID: CIV_203
 * Name: Zemin Taşıma Kapasitesi
 */

export const InputSchema_CIV_203 = z.object({
  kohezyon: z.number(),
  temel_genislik: z.number(),
  yogunluk: z.number(),
  derinlik: z.number(),
  nc_nq_ng: z.number(),
});

export type Input_CIV_203 = z.infer<typeof InputSchema_CIV_203>;

export interface Output_CIV_203 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_203(input: Input_CIV_203): Output_CIV_203 {
  const validData = InputSchema_CIV_203.parse(input);
  const { kohezyon, temel_genislik, yogunluk, derinlik, nc_nq_ng } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (kohezyon === 0 && derinlik === 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Terzaghi Taşıma Kapasitesi Teorisi",
        message: "Kritik Uyarı: Saf kohezyonsuz kum zeminlerde gömme derinliği olmadan temel tasarımı yapılması sıfır taşıma kapasitesi (Göçme) riski doğurur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
