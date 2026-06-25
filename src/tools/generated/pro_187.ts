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
 * ID: PRO_187
 * Name: HVAC Chiller Değişken Birincil Akış (VPF) Enerji ve Termal Şok Sınırı
 */

export const InputSchema_PRO_187 = z.object({
  min_flow_gpm: z.number(),
  max_flow_gpm: z.number(),
  current_flow_gpm: z.number(),
  flow_change_rate_pct: z.number(),
  evap_volume_liters: z.number(),
  pump_power_kw: z.number(),
});

export type Input_PRO_187 = z.infer<typeof InputSchema_PRO_187>;

export interface Output_PRO_187 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_187(input: Input_PRO_187): Output_PRO_187 {
  const validData = InputSchema_PRO_187.parse(input);
  const { min_flow_gpm, max_flow_gpm, current_flow_gpm, flow_change_rate_pct, evap_volume_liters, pump_power_kw } = validData as any;
  
  const Flow_Safety_Margin_Low = current_flow_gpm - min_flow_gpm;
  const Flow_Safety_Margin_High = max_flow_gpm - current_flow_gpm;
  const V_Velocity_Factor = current_flow_gpm / max_flow_gpm;
  const Pump_Energy_Savings_Pct = (1 - Math.pow(current_flow_gpm / max_flow_gpm, 3)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (flow_change_rate_pct > 10.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASHRAE 90.1 / Trane Chiller Kılavuzları",
        message: "Termal Şok / Trip Riski: Değişken akış hızı dakikada %10'dan fazla değişmektedir. Chiller otomasyon paneli bu hıza yanıt veremez; evaporatör tüplerinde anlık donma (Freeze stat trip) tetiklenecek ve kompresör korumaya geçerek tesisi komple durduracaktır."
      });
    }
  
  return {
    result: Pump_Energy_Savings_Pct,
    smartWarnings
  };
}
