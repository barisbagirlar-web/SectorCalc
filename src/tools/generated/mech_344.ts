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
 * ID: MECH_344
 * Name: Hidrolik Pompa Hacimsel Verim ve Debi
 */

export const InputSchema_MECH_344 = z.object({
  iletim_hacmi: z.number(),
  devir: z.number(),
  gercek_debi: z.number(),
});

export type Input_MECH_344 = z.infer<typeof InputSchema_MECH_344>;

export interface Output_MECH_344 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_344(input: Input_MECH_344): Output_MECH_344 {
  const validData = InputSchema_MECH_344.parse(input);
  const { iletim_hacmi, devir, gercek_debi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((gercek_debi / ((iletim_hacmi * devir) / 1000)) * 100 < 80) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 4413 Hidrolik Sistem Denetimi",
        message: "Kritik Pompa Arızası: Pompanın hacimsel verimi %80'in altına düşmüştür. Bu durum pompa içinde yüksek iç kaçak (Internal Leakage), şiddetli aşınma veya kavitasyon hasarı olduğunu gösterir. Yağ sıcaklığı hızla yükselecektir, pompayı revizyona alın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
