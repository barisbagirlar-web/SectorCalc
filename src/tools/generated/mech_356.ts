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
 * ID: MECH_356
 * Name: Hidrolik Motor Çıkış Torku
 */

export const InputSchema_MECH_356 = z.object({
  basinc_farki: z.number(),
  iletim_hacmi: z.number(),
  mekanik_verim: z.number(),
});

export type Input_MECH_356 = z.infer<typeof InputSchema_MECH_356>;

export interface Output_MECH_356 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_356(input: Input_MECH_356): Output_MECH_356 {
  const validData = InputSchema_MECH_356.parse(input);
  const { basinc_farki, iletim_hacmi, mekanik_verim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (basinc_farki > 350) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Ağır Hizmet Hidroliği",
        message: "Kritik Basınç Uyarısı: Sistem basınç farkı 350 Bar'ı aşıyor. Bu yük, standart dişli veya kanatlı (Vane) hidrolik motorların gövde sızdırmazlıklarını patlatır. Yalnızca ağır hizmet tipi eksenel/radyal pistonlu motorlar kullanılmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
