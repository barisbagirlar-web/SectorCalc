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
 * ID: PRO_013
 * Name: Kalibrasyon Sapma ve ISO 17025 Karar Riski
 */

export const InputSchema_PRO_013 = z.object({
  current_err: z.number(),
  prev_err: z.number(),
  days_between: z.number(),
  next_interval: z.number(),
  tolerance: z.number(),
  base_u: z.number(),
  delta_t: z.number(),
  temp_coeff: z.number(),
});

export type Input_PRO_013 = z.infer<typeof InputSchema_PRO_013>;

export interface Output_PRO_013 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_013(input: Input_PRO_013): Output_PRO_013 {
  const validData = InputSchema_PRO_013.parse(input);
  const { current_err, prev_err, days_between, next_interval, tolerance, base_u, delta_t, temp_coeff } = validData as any;
  
  const DriftRate_Daily = Math.abs(current_err - prev_err) / days_between;
  const PredictedDrift = DriftRate_Daily * next_interval;
  const U_env = temp_coeff * delta_t;
  const U_combined = Math.sqrt(Math.pow(base_u/2, 2) + Math.pow(PredictedDrift/Math.sqrt(3), 2) + Math.pow(U_env/Math.sqrt(3), 2));
  const U_expanded = U_combined * 2;
  const TUR = tolerance / U_expanded;
  const GuardBand = U_expanded;
  const AcceptanceLimit = tolerance - GuardBand;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TUR < 4) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 17025 / ILAC G8",
        message: "Kritik Karar Riski: Test Belirsizlik Oranı (TUR) 4:1'in altındadır. Cihazın ölçüm belirsizliği, tolerans aralığına göre çok büyüktür. Parçanın sağlam (Pass) olduğu halde reddedilme (False Reject) veya bozuk olduğu halde kabul edilme (False Accept) riski yasal limitleri aşmıştır."
      });
    }
  
  return {
    result: AcceptanceLimit,
    smartWarnings
  };
}
