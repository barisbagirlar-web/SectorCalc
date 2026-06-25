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
 * ID: PRO_079
 * Name: Mağaza/Servis Saatlik Ücret (Burdened Rate) Hesaplayıcı
 */

export const InputSchema_PRO_079 = z.object({
  tech_wages: z.number(),
  admin_wages: z.number(),
  statutory_burden: z.number(),
  fixed_overhead: z.number(),
  tech_count: z.number(),
  available_hrs_per_tech: z.number(),
  utilization_rate: z.number(),
  target_profit_margin: z.number(),
});

export type Input_PRO_079 = z.infer<typeof InputSchema_PRO_079>;

export interface Output_PRO_079 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_079(input: Input_PRO_079): Output_PRO_079 {
  const validData = InputSchema_PRO_079.parse(input);
  const { tech_wages, admin_wages, statutory_burden, fixed_overhead, tech_count, available_hrs_per_tech, utilization_rate, target_profit_margin } = validData as any;
  
  const Direct_Labor_Cost = tech_wages * (1 + (statutory_burden / 100));
  const Indirect_Labor_Cost = admin_wages * (1 + (statutory_burden / 100));
  const Total_Monthly_Cost = Direct_Labor_Cost + Indirect_Labor_Cost + fixed_overhead;
  const Total_Available_Hours = tech_count * available_hrs_per_tech;
  const Billable_Hours = Total_Available_Hours * (utilization_rate / 100);
  const Shop_Cost_Per_Hour = Total_Monthly_Cost / Billable_Hours;
  const Required_Billing_Rate = Shop_Cost_Per_Hour / (1 - (target_profit_margin / 100));
  const Effective_Markup_Pct = ((Required_Billing_Rate - (Direct_Labor_Cost / Total_Available_Hours)) / (Direct_Labor_Cost / Total_Available_Hours)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (utilization_rate < 70) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Servis Yönetimi Endeksi",
        message: "Zarar Riski: Teknisyen kullanım (Billable) oranı %70'in altında olduğu için dükkanın sabit maliyetlerini çıkarmak için gereken 'Saatlik Faturalama Bedeli' (Billing Rate) piyasa ortalamasının çok üzerine çıkacaktır. İş akışını iyileştirip atıl süreyi azaltın."
      });
    }
  
  return {
    result: Effective_Markup_Pct,
    smartWarnings
  };
}
