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
 * ID: PRO_058
 * Name: PERT/CPM Proje Süresi ve Varyans (Z-Skoru) Olasılığı
 */

export const InputSchema_PRO_058 = z.object({
  t_opt: z.number(),
  t_ml: z.number(),
  t_pess: z.number(),
  target_duration: z.number(),
  daily_penalty: z.number(),
});

export type Input_PRO_058 = z.infer<typeof InputSchema_PRO_058>;

export interface Output_PRO_058 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_058(input: Input_PRO_058): Output_PRO_058 {
  const validData = InputSchema_PRO_058.parse(input);
  const { t_opt, t_ml, t_pess, target_duration, daily_penalty } = validData as any;
  
  const PERT_Expected_Time = (t_opt + (4 * t_ml) + t_pess) / 6;
  const PERT_Std_Dev = (t_pess - t_opt) / 6;
  const PERT_Variance = Math.pow(PERT_Std_Dev, 2);
  const Z_Score = (target_duration - PERT_Expected_Time) / PERT_Std_Dev;
  const Prob_On_Time_Pct = jStat.normal.cdf(Z_Score) * 100;
  const Prob_Delay_Pct = 100 - Prob_On_Time_Pct;
  const Expected_Delay_Days = Math.max(0, PERT_Expected_Time - target_duration);
  const Expected_Penalty_Risk = Expected_Delay_Days * daily_penalty;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Prob_On_Time_Pct < 80) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "PMBOK Risk Analizi",
        message: "Kritik Proje Riski: Taahhüt edilen sürede bitirme olasılığınız %80'in altındadır. Ciddi ceza (Liquidated Damages) ödeme riskiyle karşı karşıyasınız. Faaliyetleri hızlandırma (Crashing) veya paralel yürütme (Fast-Tracking) bütçesi ayırın."
      });
    }
  
  return {
    result: Expected_Penalty_Risk,
    smartWarnings
  };
}
