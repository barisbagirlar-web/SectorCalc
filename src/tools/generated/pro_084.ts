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
 * ID: PRO_084
 * Name: REBA (Hızlı Tüm Vücut Değerlendirmesi) Ergonomik Matrisi
 */

export const InputSchema_PRO_084 = z.object({
  trunk_score: z.number(),
  neck_score: z.number(),
  legs_score: z.number(),
  upper_arm_score: z.number(),
  lower_arm_score: z.number(),
  wrist_score: z.number(),
  load_force_score: z.number(),
  coupling_score: z.number(),
  activity_score: z.number(),
});

export type Input_PRO_084 = z.infer<typeof InputSchema_PRO_084>;

export interface Output_PRO_084 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_084(input: Input_PRO_084): Output_PRO_084 {
  const validData = InputSchema_PRO_084.parse(input);
  const { trunk_score, neck_score, legs_score, upper_arm_score, lower_arm_score, wrist_score, load_force_score, coupling_score, activity_score } = validData as any;
  
  const Table_A_Score = REBA_LOOKUP_A(trunk_score, neck_score, legs_score);
  const Score_A_Total = Table_A_Score + load_force_score;
  const Table_B_Score = REBA_LOOKUP_B(upper_arm_score, lower_arm_score, wrist_score);
  const Score_B_Total = Table_B_Score + coupling_score;
  const Table_C_Score = REBA_LOOKUP_C(Score_A_Total, Score_B_Total);
  const Final_REBA_Score = Table_C_Score + activity_score;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Final_REBA_Score >= 11) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Uluslararası Ergonomi Derneği",
        message: "Çok Yüksek Risk: REBA skoru 11 veya üzerindedir. Operatörün çalışma postürü iskelet sistemine şiddetli hasar vermektedir. İş istasyonu tasarımı ACİLEN ve DERHAL değiştirilmelidir."
      });
    }
  
  return {
    result: Final_REBA_Score,
    smartWarnings
  };
}
