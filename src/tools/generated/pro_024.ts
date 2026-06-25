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
 * ID: PRO_024
 * Name: CPM Gecikme Cezası ve Hızlandırma (Crashing) Analizi
 */

export const InputSchema_PRO_024 = z.object({
  planned_duration: z.number(),
  actual_duration: z.number(),
  excusable_delay: z.number(),
  daily_penalty: z.number(),
  acceleration_cost: z.number(),
  max_crash_days: z.number(),
});

export type Input_PRO_024 = z.infer<typeof InputSchema_PRO_024>;

export interface Output_PRO_024 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_024(input: Input_PRO_024): Output_PRO_024 {
  const validData = InputSchema_PRO_024.parse(input);
  const { planned_duration, actual_duration, excusable_delay, daily_penalty, acceleration_cost, max_crash_days } = validData as any;
  
  const Gross_Delay = Math.max(0, actual_duration - planned_duration);
  const NonExcusable_Delay = Math.max(0, Gross_Delay - excusable_delay);
  const Base_Penalty = NonExcusable_Delay * daily_penalty;
  const Opt_Crash_Days = ((daily_penalty > acceleration_cost) ? Math.Math.min(NonExcusable_Delay, max_crash_days) : 0);
  const Total_Crash_Cost = Opt_Crash_Days * acceleration_cost;
  const Residual_Penalty = (NonExcusable_Delay - Opt_Crash_Days) * daily_penalty;
  const Net_Financial_Impact = Total_Crash_Cost + Residual_Penalty;
  const Savings_From_Crashing = Base_Penalty - Net_Financial_Impact;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (acceleration_cost > daily_penalty) {
      smartWarnings.push({
        severity: "INFO",
        source: "Sözleşme ve Ceza Hukuku",
        message: "Finansal Karar: Projeyi hızlandırmanın (Crashing) günlük maliyeti, sözleşmedeki günlük gecikme cezasından yüksektir. Prestij/Müşteri ilişkisi riski yoksa, finansal olarak cezayı ödemek hızlandırmaktan daha mantıklıdır."
      });
    }
  
  return {
    result: Savings_From_Crashing,
    smartWarnings
  };
}
