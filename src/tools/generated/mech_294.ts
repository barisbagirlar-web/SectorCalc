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
 * ID: MECH_294
 * Name: Dişli Boşluğu (Backlash) Toleransı
 */

export const InputSchema_MECH_294 = z.object({
  modul: z.number(),
  eksenler_arasi_mesafe: z.number(),
  gercek_mesafe: z.number(),
});

export type Input_MECH_294 = z.infer<typeof InputSchema_MECH_294>;

export interface Output_MECH_294 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_294(input: Input_MECH_294): Output_MECH_294 {
  const validData = InputSchema_MECH_294.parse(input);
  const { modul, eksenler_arasi_mesafe, gercek_mesafe } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((gercek_mesafe - eksenler_arasi_mesafe) * 2 * 0.364) > (modul * 0.1)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AGMA / DIN 3967",
        message: "Uyarı: Dişliler arası çalışma boşluğu (Backlash) modüle oranla çok yüksektir. Yön değiştirmelerde (Reversing Loads) şiddetli vuruntu (Vibration/Impact) yaşanacak ve dişler kırılabilecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
