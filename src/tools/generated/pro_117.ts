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
 * ID: PRO_117
 * Name: Pnömatik Silindir Hava Tüketimi (ISO 4414)
 */

export const InputSchema_PRO_117 = z.object({
  bore_dia: z.number(),
  stroke: z.number(),
  cycles_per_min: z.number(),
  working_pressure: z.number(),
  dead_volume_pct: z.number(),
  specific_power: z.number(),
  elec_rate: z.number(),
  annual_hours: z.number(),
});

export type Input_PRO_117 = z.infer<typeof InputSchema_PRO_117>;

export interface Output_PRO_117 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_117(input: Input_PRO_117): Output_PRO_117 {
  const validData = InputSchema_PRO_117.parse(input);
  const { bore_dia, stroke, cycles_per_min, working_pressure, dead_volume_pct, specific_power, elec_rate, annual_hours } = validData as any;
  
  const Area_cm2 = (Math.PI / 4) * Math.pow(bore_dia / 10, 2);
  const Vol_Per_Stroke_Liters = Area_cm2 * (stroke / 10) / 1000;
  const Compression_Ratio = (working_pressure + 1.013) / 1.013;
  const Free_Air_Per_Cycle_Liters = (Vol_Per_Stroke_Liters * 2) * Compression_Ratio * (1 + (dead_volume_pct / 100));
  const Air_Consumption_m3_min = (Free_Air_Per_Cycle_Liters * cycles_per_min) / 1000;
  const Power_Required_kW = Air_Consumption_m3_min * specific_power;
  const Annual_Energy_Cost = Power_Required_kW * annual_hours * elec_rate;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (working_pressure > 8) {
      smartWarnings.push({
        severity: "WARNING",
        source: "FESTO Enerji Tasarruf Merkezi",
        message: "Gereksiz Basınç İhbarı: Pnömatik sisteminizi 8 Bar üzerinde çalıştırıyorsunuz. Havanın her 1 Bar daha fazla sıkıştırılması %7 ekstra kompresör enerjisi çeker. İşi yapabiliyorsa regülatörü 6 Bar'a düşürün."
      });
    }
  
  return {
    result: Annual_Energy_Cost,
    smartWarnings
  };
}
