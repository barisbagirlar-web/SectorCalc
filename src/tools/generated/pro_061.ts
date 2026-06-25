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
 * ID: PRO_061
 * Name: Adil Yaşam Ücreti (Living Wage) ve İşgücü Verimi
 */

export const InputSchema_PRO_061 = z.object({
  rent_cost: z.number(),
  food_cost: z.number(),
  transport_cost: z.number(),
  health_edu_cost: z.number(),
  utilities_misc: z.number(),
  adults: z.number(),
  children: z.number(),
  tax_rate: z.number(),
  work_hours_wk: z.number(),
  current_wage: z.number(),
});

export type Input_PRO_061 = z.infer<typeof InputSchema_PRO_061>;

export interface Output_PRO_061 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_061(input: Input_PRO_061): Output_PRO_061 {
  const validData = InputSchema_PRO_061.parse(input);
  const { rent_cost, food_cost, transport_cost, health_edu_cost, utilities_misc, adults, children, tax_rate, work_hours_wk, current_wage } = validData as any;
  
  const Monthly_Net_Required = rent_cost + food_cost + transport_cost + health_edu_cost + utilities_misc;
  const Annual_Net_Required = Monthly_Net_Required * 12;
  const Annual_Gross_Required = Annual_Net_Required / (1 - (tax_rate / 100));
  const Target_Hourly_Wage = Annual_Gross_Required / (work_hours_wk * 52) / adults;
  const Wage_Gap_Pct = ((Target_Hourly_Wage - current_wage) / Target_Hourly_Wage) * 100;
  const Daily_Allowance_Per_Capita = Monthly_Net_Required / 30 / (adults + (children * 0.5));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Wage_Gap_Pct > 0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ILO (Uluslararası Çalışma Örgütü)",
        message: "Sosyo-Ekonomik Risk: Mevcut saatlik ücretiniz, adil yaşam standartlarının % altına düşmektedir. Bu durum yüksek personel devir hızına (Turnover), düşük motivasyona ve uzun vadede artan işe alım maliyetlerine neden olacaktır."
      });
    }
  
  return {
    result: Daily_Allowance_Per_Capita,
    smartWarnings
  };
}
