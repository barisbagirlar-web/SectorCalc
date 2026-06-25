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
 * ID: PRO_133
 * Name: OLS Regresyon, Otokorelasyon (DW) ve VIF Doğrulama
 */

export const InputSchema_PRO_133 = z.object({
  n_samples: z.number(),
  p_predictors: z.number(),
  r_squared: z.number(),
  max_vif_value: z.number(),
  durbin_watson_stat: z.number(),
  condition_number: z.number(),
});

export type Input_PRO_133 = z.infer<typeof InputSchema_PRO_133>;

export interface Output_PRO_133 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_133(input: Input_PRO_133): Output_PRO_133 {
  const validData = InputSchema_PRO_133.parse(input);
  const { n_samples, p_predictors, r_squared, max_vif_value, durbin_watson_stat, condition_number } = validData as any;
  
  const Adjusted_R_Squared = 1 - ((1 - r_squared) * (n_samples - 1)) / (n_samples - p_predictors - 1);
  const F_Stat_Model = (r_squared / p_predictors) / ((1 - r_squared) / (n_samples - p_predictors - 1));
  const Multicollinearity_Risk = ((max_vif_value > 10 || condition_number > 30) ? (1) : (0));
  const Autocorrelation_Risk = ((durbin_watson_stat < 1.5 || durbin_watson_stat > 2.5) ? (1) : (0));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Autocorrelation_Risk === 1) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Ekonometri / Zaman Serileri",
        message: "Otokorelasyon Tespiti: Durbin-Watson istatistiği 2.0 ideal değerinden uzaktır (<1.5 veya >2.5). Hata terimleri birbirini etkilemektedir. Modelin standart hataları yanlış çıkacak ve t-testleri güvenilmez olacaktır."
      });
    }

    if (condition_number > 30) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Matris Cebri",
        message: "Kritik Şart Numarası: Kondisyon numarası (κ) 30'u aşmıştır. (X'X) matrisi 'Ill-conditioned' durumdadır. Girdi verilerindeki milyarda birlik bir sapma (Gürültü), Beta katsayılarını devasa oranlarda değiştirecektir."
      });
    }
  
  return {
    result: Autocorrelation_Risk,
    smartWarnings
  };
}
