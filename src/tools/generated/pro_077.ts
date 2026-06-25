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
 * ID: PRO_077
 * Name: kWh Enerji Maliyet Analizi ve Reaktif Ceza Kalkanı
 */

export const InputSchema_PRO_077 = z.object({
  active_kwh: z.number(),
  reactive_kvarh: z.number(),
  peak_demand_kw: z.number(),
  active_rate: z.number(),
  reactive_rate: z.number(),
  demand_rate: z.number(),
  penalty_threshold: z.number(),
  tax_rate: z.number(),
});

export type Input_PRO_077 = z.infer<typeof InputSchema_PRO_077>;

export interface Output_PRO_077 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_077(input: Input_PRO_077): Output_PRO_077 {
  const validData = InputSchema_PRO_077.parse(input);
  const { active_kwh, reactive_kvarh, peak_demand_kw, active_rate, reactive_rate, demand_rate, penalty_threshold, tax_rate } = validData as any;
  
  const Power_Factor_PF = active_kwh / Math.sqrt(Math.pow(active_kwh, 2) + Math.pow(reactive_kvarh, 2));
  const Reactive_Ratio_Pct = (reactive_kvarh / active_kwh) * 100;
  const Penalty_kVArh = Math.max(0, reactive_kvarh - (active_kwh * (penalty_threshold / 100)));
  const Cost_Active = active_kwh * active_rate;
  const Cost_Reactive_Penalty = Penalty_kVArh * reactive_rate;
  const Cost_Demand = peak_demand_kw * demand_rate;
  const Subtotal = Cost_Active + Cost_Reactive_Penalty + Cost_Demand;
  const Total_Bill = Subtotal * (1 + (tax_rate / 100));
  const Blended_Unit_Cost_kWh = Total_Bill / active_kwh;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cost_Reactive_Penalty > 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Şebeke Yönetmeliği",
        message: "Finansal Ceza Uyarısı: Reaktif tüketiminiz yasal oranı (Threshold) aşmıştır ve faturanıza ceza olarak yansımaktadır. Tesisinizin Kompanzasyon Panosunda arızalı kondansatörler veya çekilmeyen kademeler mevcuttur. Acil pano bakımı yaptırın."
      });
    }
  
  return {
    result: Blended_Unit_Cost_kWh,
    smartWarnings
  };
}
