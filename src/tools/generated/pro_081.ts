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
 * ID: PRO_081
 * Name: Deney Tasarımı (DOE) Tam Faktöriyel ve ANOVA Analizi
 */

export const InputSchema_PRO_081 = z.object({
  factor_count: z.number(),
  replicates: z.number(),
  center_points: z.number(),
  cost_per_run: z.number(),
  response_values: z.number(),
  alpha_level: z.number(),
});

export type Input_PRO_081 = z.infer<typeof InputSchema_PRO_081>;

export interface Output_PRO_081 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_081(input: Input_PRO_081): Output_PRO_081 {
  const validData = InputSchema_PRO_081.parse(input);
  const { factor_count, replicates, center_points, cost_per_run, response_values, alpha_level } = validData as any;
  
  const Total_Runs_n = (Math.pow(2, factor_count) * replicates) + center_points;
  const Total_Experiment_Cost = Total_Runs_n * cost_per_run;
  const Grand_Mean = SUM(response_values) / Total_Runs_n;
  const SS_Total = SUM(Math.pow(response_values - Grand_Mean, 2));
  const SS_Error = SS_Total - SUM(SS_Factors);
  const df_factor = 1;
  const df_error = Total_Runs_n - Math.pow(2, factor_count) - center_points;
  const MS_Factor = SS_Factors / df_factor;
  const MS_Error = SS_Error / df_error;
  const F_Value = MS_Factor / MS_Error;
  const P_Value = 1 - F_DIST(F_Value, df_factor, df_error);
  const R_Squared = (SS_Total - SS_Error) / SS_Total;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (P_Value > alpha_level) {
      smartWarnings.push({
        severity: "INFO",
        source: "İstatistiksel Çıkarım",
        message: "Analiz Sonucu: Ana etkinin p-değeri anlamlılık düzeyinden (Alpha) büyüktür. Bu faktörün süreç çıktısı üzerinde istatistiksel olarak anlamlı bir etkisi bulunmamaktadır."
      });
    }
  
  return {
    result: R_Squared,
    smartWarnings
  };
}
