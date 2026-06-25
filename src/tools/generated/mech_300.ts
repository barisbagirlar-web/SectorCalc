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
 * ID: MECH_300
 * Name: V-Kayışı Kayma Oranı (Belt Slip)
 */

export const InputSchema_MECH_300 = z.object({
  surucu_cap: z.number(),
  surucu_devir: z.number(),
  surulen_cap: z.number(),
  surulen_gercek_devir: z.number(),
});

export type Input_MECH_300 = z.infer<typeof InputSchema_MECH_300>;

export interface Output_MECH_300 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_300(input: Input_MECH_300): Output_MECH_300 {
  const validData = InputSchema_MECH_300.parse(input);
  const { surucu_cap, surucu_devir, surulen_cap, surulen_gercek_devir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((((surucu_devir * (surucu_cap / surulen_cap)) - surulen_gercek_devir) / (surucu_devir * (surucu_cap / surulen_cap))) * 100 > 2.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makine Dinamiği",
        message: "Kritik Uyarı: Kayışta kayma oranı %2'nin üzerindedir. Normal şartlarda Elastik Kayma (Creep) %1 civarıdır. Bu seviye mekanik kaymadır (Slip); kayış yüzeyi aşırı ısınacak, yanacak ve kısa sürede kopacaktır. Kayışı gerdirin veya kesit büyütün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
