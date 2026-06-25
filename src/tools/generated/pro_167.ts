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
 * ID: PRO_167
 * Name: Su Koçu Sönümleme Tankı (Surge Tank) Hacim Boyutlandırma
 */

export const InputSchema_PRO_167 = z.object({
  pipe_length_m: z.number(),
  pipe_dia_m: z.number(),
  flow_velocity_m_s: z.number(),
  wave_celerity_m_s: z.number(),
  static_pressure_m: z.number(),
  max_allowable_head_m: z.number(),
});

export type Input_PRO_167 = z.infer<typeof InputSchema_PRO_167>;

export interface Output_PRO_167 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_167(input: Input_PRO_167): Output_PRO_167 {
  const validData = InputSchema_PRO_167.parse(input);
  const { pipe_length_m, pipe_dia_m, flow_velocity_m_s, wave_celerity_m_s, static_pressure_m, max_allowable_head_m } = validData as any;
  
  const Pipe_Area = (Math.PI / 4) * Math.pow(pipe_dia_m, 2);
  const Kinetic_Energy_Head = (Math.pow(flow_velocity_m_s, 2)) / (2 * 9.81);
  const Max_Surge_Head_Delta = max_allowable_head_m - static_pressure_m;
  const Required_Surge_Volume_m3 = (Pipe_Area * pipe_length_m * Kinetic_Energy_Head) / Max_Surge_Head_Delta;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Required_Surge_Volume_m3 > 50.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Hidrolik Geçici Rejim Koruma",
        message: "Yüksek Tank Maliyeti: Gereken sönümleme hacmi 50 m3'ün üzerindedir. Sadece hava kazanı (Surge Tank) kurmak yerine, vana kapanma sürelerini aktüatörlerle uzatarak şok dalgasını kaynağında hafifletmeyi değerlendirin."
      });
    }
  
  return {
    result: Required_Surge_Volume_m3,
    smartWarnings
  };
}
