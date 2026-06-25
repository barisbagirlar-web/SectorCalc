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
 * ID: PRO_033
 * Name: ISO 50001 Enerji Tüketim ve Reaktif Ceza Raporu
 */

export const InputSchema_PRO_033 = z.object({
  active_kwh: z.number(),
  reactive_ind_kvarh: z.number(),
  reactive_cap_kvarh: z.number(),
  peak_demand_kw: z.number(),
  active_rate: z.number(),
  reactive_rate: z.number(),
  demand_rate: z.number(),
  penalty_limit_ind: z.number(),
  penalty_limit_cap: z.number(),
});

export type Input_PRO_033 = z.infer<typeof InputSchema_PRO_033>;

export interface Output_PRO_033 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_033(input: Input_PRO_033): Output_PRO_033 {
  const validData = InputSchema_PRO_033.parse(input);
  const { active_kwh, reactive_ind_kvarh, reactive_cap_kvarh, peak_demand_kw, active_rate, reactive_rate, demand_rate, penalty_limit_ind, penalty_limit_cap } = validData as any;
  
  const Inductive_Ratio = (reactive_ind_kvarh / active_kwh) * 100;
  const Capacitive_Ratio = (reactive_cap_kvarh / active_kwh) * 100;
  const Inductive_Penalty = ((Inductive_Ratio > penalty_limit_ind) ? (reactive_ind_kvarh * reactive_rate) : (0));
  const Capacitive_Penalty = ((Capacitive_Ratio > penalty_limit_cap) ? (reactive_cap_kvarh * reactive_rate) : (0));
  const Active_Cost = active_kwh * active_rate;
  const Demand_Cost = peak_demand_kw * demand_rate;
  const Total_Bill = Active_Cost + Inductive_Penalty + Capacitive_Penalty + Demand_Cost;
  const Power_Factor = active_kwh / Math.sqrt(Math.pow(active_kwh, 2) + Math.pow(reactive_ind_kvarh, 2));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Şebeke Yönetmeliği",
        message: "Kritik Finansal Ceza: Reaktif enerji oranınız yasal limitleri aşmıştır ve faturanıza ceza yansımaktadır. Kompanzasyon panonuzdaki kondansatör kontaktörleri arızalı veya kademe dizilimi tesisin mevcut yük karakteristiğine uymuyor. Acil bakım gereklidir."
      });
    }
  
  return {
    result: Power_Factor,
    smartWarnings
  };
}
