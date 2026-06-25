import { ServisMarjKacagiMarginLeakageCalculator8InputSchema, type ServisMarjKacagiMarginLeakageCalculator8Input } from "./servis-marj-kacagi-margin-leakage-calculator-8-validation";

export const calculateServisMarjKacagiMarginLeakageCalculator8Contract: any = {
  id: "servis-marj-kacagi-margin-leakage-calculator-8",
  version: "1.0.0",
  category: "cost",
  inputSchema: ServisMarjKacagiMarginLeakageCalculator8InputSchema,
  
  execute: async (input: any) => {
    try {
    // Formula: GrossMargin_Parts = (parts_rev - parts_cogs) / parts_rev
    // Formula: LaborEfficiency = (billed_hrs / paid_hrs)
    // Formula: NetMargin = (total_rev - parts_cogs - opex - shrinkage - discounts) / total_rev
    // Formula: MarginGap = (target_margin / 100) - NetMargin
    // Formula: AnnualLeakage = total_rev * MarginGap

      const totalRev = input.totalRev || 0;
      const partsRev = input.partsRev || 0;
      const partsCogs = input.partsCogs || 0;
      const shrinkage = input.shrinkage || 0;
      const discounts = input.discounts || 0;
      const billedHrs = input.billedHrs || 0;
      const paidHrs = input.paidHrs || 0;
      const opex = input.opex || 0;
      const targetMargin = input.targetMargin || 0;

      // GrossMargin_Parts: (parts_rev - parts_cogs) / parts_rev
      let grossMarginParts = 0;
      if (partsRev > 0) {
        grossMarginParts = (partsRev - partsCogs) / partsRev;
      }

      // LaborEfficiency: (billed_hrs / paid_hrs)
      let laborEfficiency = 0;
      if (paidHrs > 0) {
        laborEfficiency = billedHrs / paidHrs;
      }

      // NetMargin: (total_rev - parts_cogs - opex - shrinkage - discounts) / total_rev
      let netMargin = 0;
      if (totalRev > 0) {
        netMargin = (totalRev - partsCogs - opex - shrinkage - discounts) / totalRev;
      }

      // MarginGap: (target_margin / 100) - NetMargin
      const marginGap = (targetMargin / 100) - netMargin;

      // AnnualLeakage: total_rev * MarginGap
      const annualLeakage = totalRev * marginGap;

      return {
        grossMarginParts,
        laborEfficiency,
        netMargin,
        marginGap,
        annualLeakage
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};