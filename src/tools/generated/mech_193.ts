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
 * ID: MECH_193
 * Name: Mil Tasarımı (ASME)
 */

export const InputSchema_MECH_193 = z.object({
  moment: z.number(),
  tork: z.number(),
  akma_gerilmesi: z.number(),
});

export type Input_MECH_193 = z.infer<typeof InputSchema_MECH_193>;

export interface Output_MECH_193 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_193(input: Input_MECH_193): Output_MECH_193 {
  const validData = InputSchema_MECH_193.parse(input);
  const { moment, tork, akma_gerilmesi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (true) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME Mil Tasarım Kodu",
        message: "Uyarı: Bu formül salt statik yüklemeyi temsil eder. Dönen millerde tam değişken eğilme ve sabit burulma (Fatigue/Yorulma) vardır. Şok (Kt) ve Yorulma (Kf) faktörleri ile Goodman/Soderberg kriterleri dikkate alınmadan mil imal edilemez."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
