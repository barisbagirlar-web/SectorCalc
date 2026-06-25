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
 * ID: CNC_213
 * Name: Kesme Hızı (Vc)
 */

export const InputSchema_CNC_213 = z.object({
  cap: z.number(),
  devir: z.number(),
});

export type Input_CNC_213 = z.infer<typeof InputSchema_CNC_213>;

export interface Output_CNC_213 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_213(input: Input_CNC_213): Output_CNC_213 {
  const validData = InputSchema_CNC_213.parse(input);
  const { cap, devir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((3.14159 * cap * devir) / 1000) > 1000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO Kesici Takım Limitleri",
        message: "Uyarı: Kesme hızı (Vc) 1000 m/dk'yı aşmıştır. Bu olağanüstü yüksek hızlar sadece Alüminyum gibi çok yumuşak malzemelerde veya özel CBN/Seramik takımlarla uygulanabilir. Çelik veya Titanyum işliyorsanız takım (Insert) anında eriyecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
