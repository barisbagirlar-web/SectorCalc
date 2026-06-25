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
 * ID: PRO_041
 * Name: Hidrolik Silindir Tonaj, Hız ve Motor Gücü
 */

export const InputSchema_PRO_041 = z.object({
  bore_dia: z.number(),
  rod_dia: z.number(),
  sys_pressure: z.number(),
  stroke_length: z.number(),
  cylinder_qty: z.number(),
  pump_flow: z.number(),
  vol_eff: z.number(),
  mech_eff: z.number(),
  friction_coeff: z.number(),
});

export type Input_PRO_041 = z.infer<typeof InputSchema_PRO_041>;

export interface Output_PRO_041 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_041(input: Input_PRO_041): Output_PRO_041 {
  const validData = InputSchema_PRO_041.parse(input);
  const { bore_dia, rod_dia, sys_pressure, stroke_length, cylinder_qty, pump_flow, vol_eff, mech_eff, friction_coeff } = validData as any;
  
  const A_piston = (Math.PI / 4) * Math.pow(bore_dia / 1000, 2);
  const A_annular = (Math.PI / 4) * (Math.pow(bore_dia / 1000, 2) - Math.pow(rod_dia / 1000, 2));
  const Force_Push_N = sys_pressure * 100000 * A_piston * (1 - friction_coeff);
  const Force_Push_Ton = Force_Push_N / 9806.65;
  const Force_Pull_N = sys_pressure * 100000 * A_annular * (1 - friction_coeff);
  const Force_Pull_Ton = Force_Pull_N / 9806.65;
  const Vel_Extend = (pump_flow * 1000) / (A_piston * 60 * 1000);
  const Vel_Retract = (pump_flow * 1000) / (A_annular * 60 * 1000);
  const CycleTime_s = (stroke_length / Vel_Extend) + (stroke_length / Vel_Retract);
  const Total_Q = pump_flow * cylinder_qty;
  const HydraulicPower_kW = (Total_Q * sys_pressure) / (600 * (vol_eff / 100) * (mech_eff / 100));
  const AreaRatio = A_piston / A_annular;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (AreaRatio > 2.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Hidrolik Devre Tasarımı",
        message: "Uyarı: Piston/Anüler alan oranı 2.0'den büyüktür (Kalın rodlu silindir). Geri dönüş esnasında basınç yükselmesi (Intensification) riski vardır; yön valflerini bu dönüş debisine göre boyutlandırın."
      });
    }
  
  return {
    result: AreaRatio,
    smartWarnings
  };
}
