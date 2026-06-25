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
 * ID: PRO_120
 * Name: Su Jeti (Waterjet) Kesim Dinamikleri ve Aşındırıcı Tüketimi
 */

export const InputSchema_PRO_120 = z.object({
  pressure_bar: z.number(),
  orifice_dia: z.number(),
  cd_factor: z.number(),
  abrasive_rate: z.number(),
  material_machinability: z.number(),
  thickness: z.number(),
  abrasive_price: z.number(),
});

export type Input_PRO_120 = z.infer<typeof InputSchema_PRO_120>;

export interface Output_PRO_120 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_120(input: Input_PRO_120): Output_PRO_120 {
  const validData = InputSchema_PRO_120.parse(input);
  const { pressure_bar, orifice_dia, cd_factor, abrasive_rate, material_machinability, thickness, abrasive_price } = validData as any;
  
  const Water_Velocity_m_s = Math.sqrt(2 * (pressure_bar * 100000) / 1000);
  const Orifice_Area_m2 = (Math.PI / 4) * Math.pow(orifice_dia / 1000, 2);
  const Water_Flow_L_min = cd_factor * Orifice_Area_m2 * Water_Velocity_m_s * 1000 * 60;
  const Abrasive_Water_Ratio = (abrasive_rate / 1000) / (Water_Flow_L_min);
  const Estimated_Cut_Speed_mm_min = (100 * Math.pow(pressure_bar, 1.25) * Math.pow(Water_Flow_L_min, 0.5)) / (thickness * material_machinability);
  const Abrasive_Cost_Per_Meter = ((abrasive_rate / 1000) / (Estimated_Cut_Speed_mm_min / 1000)) * abrasive_price;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Abrasive_Water_Ratio > 0.20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Waterjet İmalat Kılavuzu",
        message: "Ekipman Aşınma Riski: Su debisine oranla püskürtülen aşındırıcı (Garnet) miktarı çok fazladır (%20'yi aşıyor). Bu fazlalık kesim hızını artırmaz; aksine karışım tüpünün (Mixing Tube / Nozzle) hızla zımparalanıp aşınmasına yol açarak sarf malzeme maliyetini katlar."
      });
    }
  
  return {
    result: Abrasive_Cost_Per_Meter,
    smartWarnings
  };
}
