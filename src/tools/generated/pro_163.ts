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
 * ID: PRO_163
 * Name: Boru Hatlarında Kavitasyon ve Buharlaşma Basıncı Sınır Analizi
 */

export const InputSchema_PRO_163 = z.object({
  static_pressure_bar: z.number(),
  fluid_velocity_m_s: z.number(),
  fluid_temp_c: z.number(),
  density_kg_m3: z.number(),
  vapor_pressure_bar: z.number(),
});

export type Input_PRO_163 = z.infer<typeof InputSchema_PRO_163>;

export interface Output_PRO_163 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_163(input: Input_PRO_163): Output_PRO_163 {
  const validData = InputSchema_PRO_163.parse(input);
  const { static_pressure_bar, fluid_velocity_m_s, fluid_temp_c, density_kg_m3, vapor_pressure_bar } = validData as any;
  
  const P_static_pa = static_pressure_bar * 100000;
  const P_vapor_pa = vapor_pressure_bar * 100000;
  const Dynamic_Pressure_Pa = 0.5 * density_kg_m3 * Math.pow(fluid_velocity_m_s, 2);
  const Total_Pressure_Pa = P_static_pa + Dynamic_Pressure_Pa;
  const Cavitation_Index_Sigma = (P_static_pa - P_vapor_pa) / Dynamic_Pressure_Pa;
  const Min_Pressure_Drop_Allowed_Bar = (P_static_pa - P_vapor_pa) / 100000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cavitation_Index_Sigma < 1.5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 4413 / ASME",
        message: "Kritik Kavitasyon Riski: Kavitasyon indeksi (Sigma) emniyet sınırı olan 1.5'in altına düşmüştür. Akışkan lokal daralmalarda veya dirseklerde buharlaşacak ve mikro patlamalarla boru cidarında oyulma (Pitting/Erozyon) ve valf hasarı yaratacaktır."
      });
    }
  
  return {
    result: Min_Pressure_Drop_Allowed_Bar,
    smartWarnings
  };
}
