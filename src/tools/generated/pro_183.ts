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
 * ID: PRO_183
 * Name: AIAG MSA Ölçüm Sistemi Doğrusallık (Linearity) ve Yanlılık Analizi
 */

export const InputSchema_PRO_183 = z.object({
  reference_values: z.number(),
  observed_means: z.number(),
  std_dev_repeatability: z.number(),
  tolerance_band: z.number(),
});

export type Input_PRO_183 = z.infer<typeof InputSchema_PRO_183>;

export interface Output_PRO_183 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_183(input: Input_PRO_183): Output_PRO_183 {
  const validData = InputSchema_PRO_183.parse(input);
  const { reference_values, observed_means, std_dev_repeatability, tolerance_band } = validData as any;
  
  const Bias_Array = observed_means - reference_values;
  const Linearity_Slope = SLOPE(Bias_Array, reference_values);
  const Linearity_Intercept = INTERCEPT(Bias_Array, reference_values);
  const Linearity_Value = Math.abs(Linearity_Slope) * tolerance_band;
  const Pct_Linearity = (Linearity_Value / tolerance_band) * 100;
  const Max_Bias = Math.max(Math.abs(Bias_Array));
  const Pct_Bias = (Max_Bias / tolerance_band) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Pct_Linearity > 5.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AIAG MSA Kıdemli Kalite El Kitabı",
        message: "Metrolojik Doğrusallık Reddi: Ölçüm sisteminin doğrusallık sapması (% Linearity) toleransın %5'ini aşmıştır. Cihaz, skalanın alt değerlerinde farklı, üst değerlerinde farklı hatalar üretmektedir. Ölçüm sonuçlarına güvenilemez; cihaz yazılımsal kompanizasyona gitmeli veya değiştirilmelidir."
      });
    }
  
  return {
    result: Pct_Bias,
    smartWarnings
  };
}
