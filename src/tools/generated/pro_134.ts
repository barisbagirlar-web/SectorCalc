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
 * ID: PRO_134
 * Name: İstatistiksel Güç Analizi ve Örneklem (Cohen's d)
 */

export const InputSchema_PRO_134 = z.object({
  mean_group_1: z.number(),
  mean_group_2: z.number(),
  std_dev_1: z.number(),
  std_dev_2: z.number(),
  alpha_level: z.number(),
  target_power: z.number(),
  attrition_rate: z.number(),
});

export type Input_PRO_134 = z.infer<typeof InputSchema_PRO_134>;

export interface Output_PRO_134 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_134(input: Input_PRO_134): Output_PRO_134 {
  const validData = InputSchema_PRO_134.parse(input);
  const { mean_group_1, mean_group_2, std_dev_1, std_dev_2, alpha_level, target_power, attrition_rate } = validData as any;
  
  const Pooled_Variance = (Math.pow(std_dev_1, 2) + Math.pow(std_dev_2, 2)) / 2;
  const Pooled_StdDev = Math.sqrt(Pooled_Variance);
  const Cohens_d_Effect_Size = Math.abs(mean_group_1 - mean_group_2) / Pooled_StdDev;
  const Z_Alpha = jStat.normal.inv(1 - (alpha_level / 2));
  const Z_Beta = jStat.normal.inv(target_power);
  const n_Per_Group_Raw = 2 * Math.pow((Z_Alpha + Z_Beta) / Cohens_d_Effect_Size, 2);
  const n_Final_Adjusted = CEILING(n_Per_Group_Raw / (1 - (attrition_rate / 100)));
  const Total_Sample_Size = n_Final_Adjusted * 2;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cohens_d_Effect_Size < 0.20) {
      smartWarnings.push({
        severity: "INFO",
        source: "İstatistiksel Çıkarım",
        message: "Zayıf Etki Büyüklüğü: Cohen's d değeri 0.20'nin altındadır. İki grup arasındaki fark pratik (Endüstriyel) olarak önemsiz olabilir. Bu kadar küçük bir farkı ispatlamak için gereken örneklem boyutu (Maliyet) çok büyük çıkacaktır."
      });
    }
  
  return {
    result: Total_Sample_Size,
    smartWarnings
  };
}
