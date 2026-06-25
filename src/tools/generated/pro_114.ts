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
 * ID: PRO_114
 * Name: Sac Büküm (Abkant) Kuvveti ve Geri Yaylanma
 */

export const InputSchema_PRO_114 = z.object({
  thickness: z.number(),
  bend_length: z.number(),
  uts: z.number(),
  v_opening: z.number(),
  k_factor: z.number(),
  press_capacity: z.number(),
});

export type Input_PRO_114 = z.infer<typeof InputSchema_PRO_114>;

export interface Output_PRO_114 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_114(input: Input_PRO_114): Output_PRO_114 {
  const validData = InputSchema_PRO_114.parse(input);
  const { thickness, bend_length, uts, v_opening, k_factor, press_capacity } = validData as any;
  
  const Bending_Force_N = (1.33 * uts * bend_length * Math.pow(thickness, 2)) / v_opening;
  const Bending_Force_Ton = Bending_Force_N / 9810;
  const Min_V_Opening_Req = ((thickness <= 3) ? (6 * thickness) : (IF(thickness <= 10, 8 * thickness, 10 * thickness)));
  const Springback_Estimate_Deg = (0.5 * thickness) / (v_opening / 2);
  const Capacity_Utilization_Pct = (Bending_Force_Ton / press_capacity) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Bending_Force_Ton > press_capacity) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Pres Dinamikleri",
        message: "Tezgâh Hasar Riski: Gerekli büküm kuvveti, Abkant presin maksimum tonajını aşmaktadır. Üst çene kilitlenecek, hidrolik ünite aşırı yüke girecektir. Daha geniş bir V-açıklığına (v) geçin."
      });
    }

    if (v_opening < Min_V_Opening_Req) {
      smartWarnings.push({
        severity: "WARNING",
        source: "DIN Sac Normları",
        message: "Malzeme Yırtılma Riski: Seçilen V-Açıklığı, sac kalınlığına göre çok dardır. Dış büküm radyüsünde mikro çatlaklar ve sac yırtılmaları (Cracking) kesinlikle yaşanacaktır."
      });
    }
  
  return {
    result: Capacity_Utilization_Pct,
    smartWarnings
  };
}
