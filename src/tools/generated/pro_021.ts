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
 * ID: PRO_021
 * Name: İleri Seviye CNC Çevrim Süresi ve Spindle Verimi
 */

export const InputSchema_PRO_021 = z.object({
  vc_m_min: z.number(),
  fz_mm_tooth: z.number(),
  tool_dia_mm: z.number(),
  flutes_z: z.number(),
  cut_length_mm: z.number(),
  rapid_dist_mm: z.number(),
  rapid_vel_mm_min: z.number(),
  tool_changes: z.number(),
  tc_time_sec: z.number(),
  load_unload_min: z.number(),
});

export type Input_PRO_021 = z.infer<typeof InputSchema_PRO_021>;

export interface Output_PRO_021 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_021(input: Input_PRO_021): Output_PRO_021 {
  const validData = InputSchema_PRO_021.parse(input);
  const { vc_m_min, fz_mm_tooth, tool_dia_mm, flutes_z, cut_length_mm, rapid_dist_mm, rapid_vel_mm_min, tool_changes, tc_time_sec, load_unload_min } = validData as any;
  
  const RPM = (vc_m_min * 1000) / (Math.PI * tool_dia_mm);
  const FeedRate = fz_mm_tooth * flutes_z * RPM;
  const T_cut_min = cut_length_mm / FeedRate;
  const T_rapid_min = rapid_dist_mm / rapid_vel_mm_min;
  const T_toolchange_min = (tool_changes * tc_time_sec) / 60;
  const Total_CycleTime = T_cut_min + T_rapid_min + T_toolchange_min + load_unload_min;
  const Spindle_Utilization = (T_cut_min / Total_CycleTime) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Spindle_Utilization < 40) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Yalın Üretim (OEE)",
        message: "Kritik Verimsizlik: Spindle kullanım oranınız %40'ın altındadır. Makinenin zamanının çoğu boşa hareket (G00), parça bağlama veya takım değiştirmeyle geçiyor. Fikstür optimizasyonu (Sıfır Noktası Sistemleri) şarttır."
      });
    }
  
  return {
    result: Spindle_Utilization,
    smartWarnings
  };
}
