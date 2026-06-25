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
 * ID: PRO_034
 * Name: Proje Enflasyon Eskalasyonu ve Gerçek İskonto (NPV)
 */

export const InputSchema_PRO_034 = z.object({
  base_mat_cost: z.number(),
  base_lab_cost: z.number(),
  infl_mat_pct: z.number(),
  infl_lab_pct: z.number(),
  project_duration_yr: z.number(),
  nominal_discount_rate: z.number(),
  gen_inflation_rate: z.number(),
  risk_contingency_pct: z.number(),
});

export type Input_PRO_034 = z.infer<typeof InputSchema_PRO_034>;

export interface Output_PRO_034 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_034(input: Input_PRO_034): Output_PRO_034 {
  const validData = InputSchema_PRO_034.parse(input);
  const { base_mat_cost, base_lab_cost, infl_mat_pct, infl_lab_pct, project_duration_yr, nominal_discount_rate, gen_inflation_rate, risk_contingency_pct } = validData as any;
  
  const Escalated_Mat = base_mat_cost * Math.pow(1 + (infl_mat_pct/100), project_duration_yr);
  const Escalated_Lab = base_lab_cost * Math.pow(1 + (infl_lab_pct/100), project_duration_yr);
  const Total_Escalated_Base = Escalated_Mat + Escalated_Lab;
  const Contingency_Value = Total_Escalated_Base * (risk_contingency_pct / 100);
  const Total_Project_Budget = Total_Escalated_Base + Contingency_Value;
  const Real_Discount_Rate = ((1 + (nominal_discount_rate/100)) / (1 + (gen_inflation_rate/100))) - 1;
  const NPV_Cost_Real = Total_Project_Budget / Math.pow(1 + Real_Discount_Rate, project_duration_yr);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Real_Discount_Rate < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Makroekonomik Analiz",
        message: "Finansal Yıkım Riski: Reel iskonto oranınız negatif değerdedir. Projenizin getirisi genel enflasyonun altında kalıyor; yatırılan sermaye satın alma gücünü sürekli kaybedecek."
      });
    }

    if (infl_lab_pct > (gen_inflation_rate * 1.5)) {
      smartWarnings.push({
        severity: "INFO",
        source: "Maliyet Sürüklenmesi",
        message: "Bilgi: İşçilik maliyetlerindeki artış (Wage Inflation), genel enflasyonun çok üzerinde tahmin edilmiştir. Marj erimesine karşı sözleşmelere dinamik fiyat eskalasyon klozu (Price Adjustment Clause) eklenmelidir."
      });
    }
  
  return {
    result: NPV_Cost_Real,
    smartWarnings
  };
}
