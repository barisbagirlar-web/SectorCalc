import { NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103InputSchema, type NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103Input } from "./nakit-donusum-duration-ccc-ve-fonlama-maliyeti-calculator-103-validation";

export const calculateNakitDonusumDurationCccVeFonlamaMaliyetiCalculator103Contract: any = {
  id: "nakit-donusum-duration-ccc-ve-fonlama-maliyeti-calculator-103",
  version: "1.0.0",
  category: "cost",
  inputSchema: NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103InputSchema,
  
  execute: async (input: NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103Input) => {
    try {
      const {
        avgAr,
        avgAp,
        avgInv,
        cogs,
        annualRevenue,
        waccDaily,
        cashReserve
      } = input;

      // DSO: Days Sales Outstanding
      const dSODaysSalesOutstanding = (avgAr / annualRevenue) * 365;

      // DIO: Days Inventory Outstanding
      const dIODaysInventoryOutstanding = (avgInv / cogs) * 365;

      // DPO: Days Payable Outstanding
      const dPODaysPayableOutstanding = (avgAp / cogs) * 365;

      // CCC: Cash Conversion Cycle
      const cCCCashConversionCycle = dSODaysSalesOutstanding + dIODaysInventoryOutstanding - dPODaysPayableOutstanding;

      // Daily Sales Rate
      const dailySalesRate = annualRevenue / 365;

      // Cash Gap Value
      const cashGapValue = cCCCashConversionCycle * dailySalesRate;

      // Financing Cost Needed
      // If cash reserve is sufficient, financing cost is zero
      const excessCashNeed = Math.max(0, cashGapValue - cashReserve);
      const waccDecimal = waccDaily / 100;
      // Financing cost = excess cash need * daily WACC * CCC days
      const financingCostNeeded = excessCashNeed * waccDecimal * cCCCashConversionCycle;

      return {
        dSODaysSalesOutstanding,
        dIODaysInventoryOutstanding,
        dPODaysPayableOutstanding,
        cCCCashConversionCycle,
        dailySalesRate,
        cashGapValue,
        financingCostNeeded
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};