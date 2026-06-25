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
 * ID: PRO_099
 * Name: Saatlik Ücret (Tam Yüklü Burdened Rate) ve Servis Marjı
 */

export const InputSchema_PRO_099 = z.object({
  base_salary: z.number(),
  benefits: z.number(),
  statutory: z.number(),
  idle_pct: z.number(),
  margin_pct: z.number(),
});

export type Input_PRO_099 = z.infer<typeof InputSchema_PRO_099>;

export interface Output_PRO_099 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_099(input: Input_PRO_099): Output_PRO_099 {
  const validData = InputSchema_PRO_099.parse(input);
  const { base_salary, benefits, statutory, idle_pct, margin_pct } = validData as any;
  
  const Gross_Labor_Cost = base_salary * (1 + (statutory / 100)) + benefits;
  const Total_Working_Hours = 52 * 40;
  const Productive_Hours = Total_Working_Hours * (1 - (idle_pct / 100));
  const Burdened_Cost_Rate = Gross_Labor_Cost / Productive_Hours;
  const Target_Billing_Rate = Burdened_Cost_Rate / (1 - (margin_pct / 100));
  const Margin_Markup_Multiplier = Target_Billing_Rate / (base_salary / Total_Working_Hours);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (idle_pct > 25) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Servis Yönetimi Endeksi",
        message: "Zarar Döngüsü Riski: Personelin %25'ten fazla zamanı müşteriye fatura edilemiyor. Bu verimsizliği telafi etmek için piyasaya sunacağınız 'Saatlik Ücret' (Billing Rate) rakip firmaların çok üzerine çıkacak ve pazar payı kaybedeceksiniz."
      });
    }
  
  return {
    result: Margin_Markup_Multiplier,
    smartWarnings
  };
}
