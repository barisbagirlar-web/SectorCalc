import { UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147InputSchema, type UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147Input } from "./uret-vs-satin-al-makeorbuy-breakeven-ve-firsat-maliyeti-calculator-147-validation";

export const calculateUretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147Contract: any = {
  id: "uret-vs-satin-al-makeorbuy-breakeven-ve-firsat-maliyeti-calculator-147",
  version: "1.0.0",
  category: "cost",
  inputSchema: UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147InputSchema,
  
  execute: async (input: UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147Input) => {
    try {
      const {
        supplierPrice,
        supplierOrderCost,
        inhouseFixedCapex,
        inhouseVarCost,
        annualVolume,
        lostMarginOpportunity
      } = input;

      // Total_Buy_Cost = (annual_volume * supplier_price) + supplier_order_cost
      const totalBuyCost = (annualVolume * supplierPrice) + supplierOrderCost;

      // Total_Make_Cost = inhouse_fixed_capex + (annual_volume * inhouse_var_cost) + lost_margin_opportunity
      const totalMakeCost = inhouseFixedCapex + (annualVolume * inhouseVarCost) + lostMarginOpportunity;

      // Breakeven_Volume = (inhouse_fixed_capex + lost_margin_opportunity - supplier_order_cost) / (supplier_price - inhouse_var_cost)
      let breakevenVolume = 0;
      const denominator = supplierPrice - inhouseVarCost;
      if (denominator !== 0) {
        breakevenVolume = Math.max(0, (inhouseFixedCapex + lostMarginOpportunity - supplierOrderCost) / denominator);
      } else {
        breakevenVolume = Infinity;
      }

      // Decision_Score = Total_Buy_Cost - Total_Make_Cost
      const decisionScore = totalBuyCost - totalMakeCost;

      // Strategic_Decision: positive score means buy is more expensive -> make internally
      // Negative or zero means buy is cheaper or equal -> buy externally
      const strategicDecision = decisionScore > 0 ? 1 : 0;

      return {
        totalBuyCost: Math.round(totalBuyCost * 100) / 100,
        totalMakeCost: Math.round(totalMakeCost * 100) / 100,
        breakevenVolume: breakevenVolume === Infinity ? Infinity : Math.round(breakevenVolume * 100) / 100,
        decisionScore: Math.round(decisionScore * 100) / 100,
        strategicDecision
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};