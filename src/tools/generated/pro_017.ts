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
 * ID: PRO_017
 * Name: Personel Devir (Turnover) Maliyeti ve Ramp-Up Etkisi
 */

export const InputSchema_PRO_017 = z.object({
  terminations: z.number(),
  severance_avg: z.number(),
  vacancy_days: z.number(),
  daily_revenue_per_emp: z.number(),
  recruit_cost: z.number(),
  onboarding_hrs: z.number(),
  trainer_rate: z.number(),
  rampup_days: z.number(),
  rampup_productivity: z.number(),
});

export type Input_PRO_017 = z.infer<typeof InputSchema_PRO_017>;

export interface Output_PRO_017 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_017(input: Input_PRO_017): Output_PRO_017 {
  const validData = InputSchema_PRO_017.parse(input);
  const { terminations, severance_avg, vacancy_days, daily_revenue_per_emp, recruit_cost, onboarding_hrs, trainer_rate, rampup_days, rampup_productivity } = validData as any;
  
  const SeparationCost = terminations * severance_avg;
  const VacancyCost = terminations * vacancy_days * daily_revenue_per_emp;
  const AcquisitionCost = terminations * recruit_cost;
  const TrainingCost = terminations * onboarding_hrs * trainer_rate;
  const ProductivityLoss = terminations * rampup_days * daily_revenue_per_emp * (1 - (rampup_productivity / 100));
  const TotalTurnoverCost = SeparationCost + VacancyCost + AcquisitionCost + TrainingCost + ProductivityLoss;
  const CostPerEmployee = TotalTurnoverCost / terminations;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ProductivityLoss > (TotalTurnoverCost * 0.4)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Öğrenme Eğrisi İhlali",
        message: "Uyarı: Yeni işe alınanların tam verime ulaşana kadar yarattığı üretim/satış kaybı (Gizli Fırsat Maliyeti), toplam devir maliyetinin %40'ını aşıyor. Eğitim (Onboarding) süreciniz yetersiz veya süreç çok karmaşık."
      });
    }
  
  return {
    result: CostPerEmployee,
    smartWarnings
  };
}
