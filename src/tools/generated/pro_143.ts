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
 * ID: PRO_143
 * Name: GD&T Gerçek Konum (True Position) ve MMC Bonus Tolerans
 */

export const InputSchema_PRO_143 = z.object({
  nom_x: z.number(),
  nom_y: z.number(),
  meas_x: z.number(),
  meas_y: z.number(),
  feature_mmc: z.number(),
  meas_diameter: z.number(),
  pos_tolerance: z.number(),
  is_hole: z.enum(["Delik", "Pim"]),
});

export type Input_PRO_143 = z.infer<typeof InputSchema_PRO_143>;

export interface Output_PRO_143 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_143(input: Input_PRO_143): Output_PRO_143 {
  const validData = InputSchema_PRO_143.parse(input);
  const { nom_x, nom_y, meas_x, meas_y, feature_mmc, meas_diameter, pos_tolerance, is_hole } = validData as any;
  
  const Dev_X = meas_x - nom_x;
    const Dev_Y = meas_y - nom_y;
    const Actual_True_Position = 2 * Math.sqrt(Math.pow(Dev_X, 2) + Math.pow(Dev_Y, 2));
    const Bonus_Tolerance = (is_hole == 'Delik') ? Math.max(0, meas_diameter - feature_mmc) : Math.max(0, feature_mmc - meas_diameter);
    const Total_Allowable_Tolerance = pos_tolerance + Bonus_Tolerance;
    const Position_Deviation_Gap = Total_Allowable_Tolerance - Actual_True_Position;
    const Pass_Fail_Status = (Actual_True_Position <= Total_Allowable_Tolerance) ? 'KABUL (PASS)' : 'RET (FAIL)';
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "INFO",
        source: "ASME Y14.5M",
        message: "Bonus Kurtarması: Deliğin merkezi teknik resimdeki orijinal konum toleransından kaymış olmasına rağmen, çapın büyümesinden (MMC'den uzaklaşmasından) kaynaklı 'Bonus Tolerans' kazanılmış ve parça montaj edilebilir olduğu için KURTARILMIŞTIR."
      });
    }

    if (Actual_True_Position > Total_Allowable_Tolerance) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Montaj Uygunluğu",
        message: "Montaj İmkansızlığı: Parça reddedilmiştir. Kayma miktarı, bonus tolerans eklendikten sonra bile karşı parçadaki pime/civata deliğine geçmeyecek kadar yüksektir."
      });
    }
  
  return {
    result: Position_Deviation_Gap,
    smartWarnings
  };
}
