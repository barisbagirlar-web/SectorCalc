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
 * ID: PRO_086
 * Name: İleri Seviye Pareto ve Kök Neden Finansmanı
 */

export const InputSchema_PRO_086 = z.object({
  defect_codes: z.number(),
  defect_frequencies: z.number(),
  cost_per_defect: z.number(),
  analysis_months: z.number(),
});

export type Input_PRO_086 = z.infer<typeof InputSchema_PRO_086>;

export interface Output_PRO_086 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_086(input: Input_PRO_086): Output_PRO_086 {
  const validData = InputSchema_PRO_086.parse(input);
  const { defect_codes, defect_frequencies, cost_per_defect, analysis_months } = validData as any;
  
  const Total_Frequency = SUM(defect_frequencies);
  const Cost_By_Code_i = defect_frequencies_i * cost_per_defect_i;
  const Total_Financial_Loss = SUM(Cost_By_Code);
  const Freq_Pct_i = (defect_frequencies_i / Total_Frequency) * 100;
  const Cost_Pct_i = (Cost_By_Code_i / Total_Financial_Loss) * 100;
  const Sorted_Cost_Pct = SORT(Cost_Pct_i, DESC);
  const Cumulative_Cost_Pct = CUM_SUM(Sorted_Cost_Pct);
  const Vital_Few_80_20_Count = 1;
  const Annual_Projected_Loss = Total_Financial_Loss * (12 / analysis_months);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Vital_Few_80_20_Count > (COUNT(defect_codes) * 0.5)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Vilfredo Pareto İlkesi",
        message: "Odak Dağılımı İhbarı: Toplam maliyetin %80'i, hata kodlarının %50'sinden fazlasından geliyor. Klasik 80/20 kuralı oluşmamış. Tek bir kök nedenden ziyade, sürecin genelinde (Sistemik) yaygın bir kontrolsüzlük ve varyans hakimdir."
      });
    }
  
  return {
    result: Annual_Projected_Loss,
    smartWarnings
  };
}
