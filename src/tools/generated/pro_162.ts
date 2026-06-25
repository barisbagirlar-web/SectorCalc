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
 * ID: PRO_162
 * Name: CNC Taşlama (Grinding) Teğetsel Kuvvet ve Spesifik Enerji
 */

export const InputSchema_PRO_162 = z.object({
  wheel_speed_m_s: z.number(),
  work_speed_m_min: z.number(),
  depth_of_cut_mm: z.number(),
  width_of_grinding_mm: z.number(),
  specific_energy_j_mm3: z.number(),
  spindle_kw: z.number(),
});

export type Input_PRO_162 = z.infer<typeof InputSchema_PRO_162>;

export interface Output_PRO_162 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_162(input: Input_PRO_162): Output_PRO_162 {
  const validData = InputSchema_PRO_162.parse(input);
  const { wheel_speed_m_s, work_speed_m_min, depth_of_cut_mm, width_of_grinding_mm, specific_energy_j_mm3, spindle_kw } = validData as any;
  
  const Vw_m_s = work_speed_m_min / 60;
  const MRR_mm3_s = depth_of_cut_mm * width_of_grinding_mm * work_speed_m_min * 1000 / 60;
  const Power_Required_W = specific_energy_j_mm3 * MRR_mm3_s;
  const Power_Required_kW = Power_Required_W / 1000;
  const Tangential_Force_N = Power_Required_W / wheel_speed_m_s;
  const Force_Per_Width_N_mm = Tangential_Force_N / width_of_grinding_mm;
  const Spindle_Utilization_Pct = (Power_Required_kW / spindle_kw) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Power_Required_kW > spindle_kw) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO Taşlama Standardı",
        message: "Tezgah Durma (Stall) Riski: Hesaplanan taşlama gücü fener mili kapasitesini aşmaktadır. Taş parça içinde sıkışacak ve motor korumaya geçecektir."
      });
    }

    if (Force_Per_Width_N_mm > 30) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Termal Hasar (Grinding Burn)",
        message: "Termal Çatlak Uyarısı: Birim genişlik başına düşen kuvvet çok yüksektir. İş parçası yüzeyinde aşırı ısı birikmesi nedeniyle mikroskobik çatlaklar ve taşlama yanığı (Grinding burn) oluşacaktır. Pasa derinliğini düşürün."
      });
    }
  
  return {
    result: Spindle_Utilization_Pct,
    smartWarnings
  };
}
