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
 * ID: PRO_165
 * Name: Endüstriyel Soğutma Kuleleri Yaklaşım (Approach) ve Isıl Verim Analizi
 */

export const InputSchema_PRO_165 = z.object({
  water_inlet_temp_c: z.number(),
  water_outlet_temp_c: z.number(),
  ambient_wet_bulb_c: z.number(),
  water_flow_m3_h: z.number(),
});

export type Input_PRO_165 = z.infer<typeof InputSchema_PRO_165>;

export interface Output_PRO_165 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_165(input: Input_PRO_165): Output_PRO_165 {
  const validData = InputSchema_PRO_165.parse(input);
  const { water_inlet_temp_c, water_outlet_temp_c, ambient_wet_bulb_c, water_flow_m3_h } = validData as any;
  
  const Cooling_Range = water_inlet_temp_c - water_outlet_temp_c;
  const Approach = water_outlet_temp_c - ambient_wet_bulb_c;
  const Tower_Efficiency_Pct = (Cooling_Range / (Cooling_Range + Approach)) * 100;
  const Heat_Rejected_kW = water_flow_m3_h * 1000 * 4.186 * Cooling_Range / 3600;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Approach < 3.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Cooling Technology Institute (CTI)",
        message: "Ekonomik Olmayan Boyutlandırma: Yaklaşım (Approach) sıcaklığı 3°C'nin altına zorlanmaktadır. Bu ısıl verime ulaşmak için gereken kule dolgu hacmi ve fan gücü eksponansiyel olarak büyüyecek, devasa bir yatırım israfı yaratacaktır."
      });
    }
  
  return {
    result: Heat_Rejected_kW,
    smartWarnings
  };
}
