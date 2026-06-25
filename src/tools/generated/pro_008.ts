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
 * ID: PRO_008
 * Name: Servis Marj Kaçağı (Margin Leakage)
 */

export const InputSchema_PRO_008 = z.object({
  total_rev: z.number(),
  parts_rev: z.number(),
  parts_cogs: z.number(),
  shrinkage: z.number(),
  discounts: z.number(),
  billed_hrs: z.number(),
  paid_hrs: z.number(),
  opex: z.number(),
  target_margin: z.number(),
});

export type Input_PRO_008 = z.infer<typeof InputSchema_PRO_008>;

export interface Output_PRO_008 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_008(input: Input_PRO_008): Output_PRO_008 {
  const validData = InputSchema_PRO_008.parse(input);
  const { total_rev, parts_rev, parts_cogs, shrinkage, discounts, billed_hrs, paid_hrs, opex, target_margin } = validData as any;
  
  const GrossMargin_Parts = (parts_rev - parts_cogs) / parts_rev;
  const LaborEfficiency = (billed_hrs / paid_hrs);
  const NetMargin = (total_rev - parts_cogs - opex - shrinkage - discounts) / total_rev;
  const MarginGap = (target_margin / 100) - NetMargin;
  const AnnualLeakage = total_rev * MarginGap;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (LaborEfficiency < 0.85) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Verimlilik",
        message: "Teknisyen verimliliğiniz %85'in altında. Maaş ödenen zamanın %15'i atıl kalmaktadır."
      });
    }
  
  return {
    result: AnnualLeakage,
    smartWarnings
  };
}
