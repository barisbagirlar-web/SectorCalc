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
 * ID: PRO_168
 * Name: Gaz Türbinleri Brayton Çevrimi Isıl Verim ve Spesifik İş
 */

export const InputSchema_PRO_168 = z.object({
  t1_inlet_k: z.number(),
  t3_turbine_inlet_k: z.number(),
  pressure_ratio_rp: z.number(),
  specific_heat_ratio_gamma: z.number(),
  comp_efficiency: z.number(),
  turb_efficiency: z.number(),
});

export type Input_PRO_168 = z.infer<typeof InputSchema_PRO_168>;

export interface Output_PRO_168 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_168(input: Input_PRO_168): Output_PRO_168 {
  const validData = InputSchema_PRO_168.parse(input);
  const { t1_inlet_k, t3_turbine_inlet_k, pressure_ratio_rp, specific_heat_ratio_gamma, comp_efficiency, turb_efficiency } = validData as any;
  
  const Gamma_Calc = (specific_heat_ratio_gamma - 1) / specific_heat_ratio_gamma;
  const T2s = t1_inlet_k * Math.pow(pressure_ratio_rp, Gamma_Calc);
  const T2 = t1_inlet_k + (T2s - t1_inlet_k) / (comp_efficiency / 100);
  const T4s = t3_turbine_inlet_k / Math.pow(pressure_ratio_rp, Gamma_Calc);
  const T4 = t3_turbine_inlet_k - (turb_efficiency / 100) * (t3_turbine_inlet_k - T4s);
  const W_compressor = 1.005 * (T2 - t1_inlet_k);
  const W_turbine = 1.005 * (t3_turbine_inlet_k - T4);
  const Net_Specific_Work_kJ_kg = W_turbine - W_compressor;
  const Heat_Input_kJ_kg = 1.005 * (t3_turbine_inlet_k - T2);
  const Thermal_Efficiency_Pct = (Net_Specific_Work_kJ_kg / Heat_Input_kJ_kg) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Net_Specific_Work_kJ_kg <= 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 3977 Gaz Türbini Standartları",
        message: "Negatif İş Çıktısı: Kompresörü döndürmek için gereken güç, türbinin ürettiği mekanik gücü aşmaktadır. Çevrim kendi kendini besleyemez ve net güç üretemez. Basınç oranını veya verimleri düzeltin."
      });
    }
  
  return {
    result: Thermal_Efficiency_Pct,
    smartWarnings
  };
}
