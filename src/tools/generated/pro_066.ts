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
 * ID: PRO_066
 * Name: Kalite Maliyeti (COQ) - PAF Model Analizi
 */

export const InputSchema_PRO_066 = z.object({
  prevention_cost: z.number(),
  appraisal_cost: z.number(),
  internal_failure: z.number(),
  external_failure: z.number(),
  total_sales: z.number(),
});

export type Input_PRO_066 = z.infer<typeof InputSchema_PRO_066>;

export interface Output_PRO_066 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_066(input: Input_PRO_066): Output_PRO_066 {
  const validData = InputSchema_PRO_066.parse(input);
  const { prevention_cost, appraisal_cost, internal_failure, external_failure, total_sales } = validData as any;
  
  const Total_COQ = prevention_cost + appraisal_cost + internal_failure + external_failure;
  const COQ_to_Sales_Pct = (Total_COQ / total_sales) * 100;
  const Prevention_Ratio = (prevention_cost / Total_COQ) * 100;
  const Appraisal_Ratio = (appraisal_cost / Total_COQ) * 100;
  const Internal_Fail_Ratio = (internal_failure / Total_COQ) * 100;
  const External_Fail_Ratio = (external_failure / Total_COQ) * 100;
  const Conformance_Cost = prevention_cost + appraisal_cost;
  const NonConformance_Cost = internal_failure + external_failure;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (NonConformance_Cost > (Total_COQ * 0.7)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Juran Kalite Prensipleri",
        message: "Stratejik Kayıp: Kalitesizlik (Hurda/İade) maliyetleriniz, toplam kalite bütçenizin %70'ini oluşturmaktadır. Yangın söndürme modundasınız. Önleme (Prevention) bütçesini artırmadan bu döngüden çıkamazsınız."
      });
    }
  
  return {
    result: NonConformance_Cost,
    smartWarnings
  };
}
