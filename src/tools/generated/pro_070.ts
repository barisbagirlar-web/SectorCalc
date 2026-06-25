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
 * ID: PRO_070
 * Name: Kesim-Dolgu (Earthwork) Denge ve Nakliye Maliyeti
 */

export const InputSchema_PRO_070 = z.object({
  cut_volume: z.number(),
  fill_volume: z.number(),
  swell_factor: z.number(),
  shrink_factor: z.number(),
  haul_rate: z.number(),
  haul_distance: z.number(),
  borrow_rate: z.number(),
  disposal_rate: z.number(),
});

export type Input_PRO_070 = z.infer<typeof InputSchema_PRO_070>;

export interface Output_PRO_070 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_070(input: Input_PRO_070): Output_PRO_070 {
  const validData = InputSchema_PRO_070.parse(input);
  const { cut_volume, fill_volume, swell_factor, shrink_factor, haul_rate, haul_distance, borrow_rate, disposal_rate } = validData as any;
  
  const Loose_Cut_Volume = cut_volume * swell_factor;
  const Required_Compacted_Fill = fill_volume / shrink_factor;
  const Net_Balance_Loose = Loose_Cut_Volume - (Required_Compacted_Fill * swell_factor);
  const Borrow_Needed_m3 = Math.max(0, -Net_Balance_Loose);
  const Waste_Disposal_m3 = Math.max(0, Net_Balance_Loose);
  const Haul_Cost = Math.min(Loose_Cut_Volume, Required_Compacted_Fill * swell_factor) * haul_distance * haul_rate;
  const Borrow_Cost = Borrow_Needed_m3 * borrow_rate;
  const Disposal_Cost = Waste_Disposal_m3 * disposal_rate;
  const Total_Earthwork_Cost = Haul_Cost + Borrow_Cost + Disposal_Cost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Waste_Disposal_m3 > (cut_volume * 0.2)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Bruckner Hacim Dağılımı",
        message: "Proje Tasarım Zafiyeti: Kazıdan çıkan malzemenin %20'sinden fazlası dolguya yaramayıp atığa (Deşarj) gidiyor. Kırmızı kot (Eğim) çizgisi hatalı geçirilmiş; güzergah planı revize edilmezse döküm maliyetleri bütçeyi delecektir."
      });
    }
  
  return {
    result: Total_Earthwork_Cost,
    smartWarnings
  };
}
