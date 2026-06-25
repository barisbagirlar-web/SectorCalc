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
 * ID: MECH_298
 * Name: Hidrolik Akümülatör Kapasitesi (Boyle-Mariotte)
 */

export const InputSchema_MECH_298 = z.object({
  v0: z.number(),
  p0: z.number(),
  p1: z.number(),
  p2: z.number(),
});

export type Input_MECH_298 = z.infer<typeof InputSchema_MECH_298>;

export interface Output_MECH_298 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_298(input: Input_MECH_298): Output_MECH_298 {
  const validData = InputSchema_MECH_298.parse(input);
  const { v0, p0, p1, p2 } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (p0 < (p2 * 0.25)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Akışkan Gücü (Fluid Power)",
        message: "Uyarı: Ön dolum basıncı çok düşük. Maksimum basınç anında membran/balon aşırı sıkışacak (Ezilecek) ve elastomerin ömrü dramatik şekilde kısalacaktır. P0 genellikle P1'in %90'ı olarak seçilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
