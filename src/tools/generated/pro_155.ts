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
 * ID: PRO_155
 * Name: Tolerans Yığılması (Tolerance Stack-up) Olasılıksal RSS Analizi
 */

export const InputSchema_PRO_155 = z.object({
  tol_array: z.number(),
  gap_nominal: z.number(),
  process_cpk: z.number(),
  assembly_volume: z.number(),
  cost_per_scrap: z.number(),
});

export type Input_PRO_155 = z.infer<typeof InputSchema_PRO_155>;

export interface Output_PRO_155 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_155(input: Input_PRO_155): Output_PRO_155 {
  const validData = InputSchema_PRO_155.parse(input);
  const { tol_array, gap_nominal, process_cpk, assembly_volume, cost_per_scrap } = validData as any;
  
  const Worst_Case_Stack_Max = SUM(tol_array);
  const Squared_Tols = Math.pow(tol_array, 2);
  const RSS_Statistical_Stack = Math.sqrt(SUM(Squared_Tols));
  const Sigma_Assembly = RSS_Statistical_Stack / (3 * process_cpk);
  const Z_Score_Gap = gap_nominal / Sigma_Assembly;
  const Defect_Prob_Pct = (1 - jStat.normal.cdf(Z_Score_Gap)) * 100;
  const Expected_Defect_Units = assembly_volume * (Defect_Prob_Pct / 100);
  const Expected_Failure_Cost = Expected_Defect_Units * cost_per_scrap;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "INFO",
        source: "ASME Y14.5 Tolerans Analizi",
        message: "İstatistiksel Kazanım: Worst-Case (En Kötü Senaryo) hesabına göre parçalar montajlanamıyor (Tolerans yığılması boşluğu aşıyor). Ancak RSS analizine göre çakışma ihtimali %1'in altında. Tasarımı zorlamaya gerek yok, mevcut toleranslarla güvenle üretebilirsiniz."
      });
    }

    if (Z_Score_Gap < 3.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Altı Sigma Montaj Prensipleri",
        message: "Kritik Çakışma Riski: Montajın Z-Skoru 3.0'ın altındadır (Düşük Cp). Üretim hattında yüksek oranda parça birbirine geçmeyecek ve pahalıya patlayan montaj içi düzeltmelere (Rework) neden olacaktır. Parça toleranslarını daraltın."
      });
    }
  
  return {
    result: Expected_Failure_Cost,
    smartWarnings
  };
}
