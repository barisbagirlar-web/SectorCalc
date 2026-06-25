import { MultiProductBreakevenBreakevenVeDolAnalysisCalculator11InputSchema, type MultiProductBreakevenBreakevenVeDolAnalysisCalculator11Input } from "./multi-product-breakeven-breakeven-ve-dol-analysis-calculator-11-validation";

export const calculateMultiProductBreakevenBreakevenVeDolAnalysisCalculator11Contract: any = {
  id: "multi-product-breakeven-breakeven-ve-dol-analysis-calculator-11",
  version: "1.0.0",
  category: "cost",
  inputSchema: MultiProductBreakevenBreakevenVeDolAnalysisCalculator11InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        fixedCosts,
        targetProfit,
        taxRate,
        productPrices,
        productVcosts,
        productMix,
        actualVolume
      } = input;

      // Ensure arrays are properly parsed if they come as strings
      const prices = Array.isArray(productPrices) ? productPrices : [productPrices].flat();
      const vcosts = Array.isArray(productVcosts) ? productVcosts : [productVcosts].flat();
      const mix = Array.isArray(productMix) ? productMix : [productMix].flat();

      const n = Math.min(prices.length, vcosts.length, mix.length);

      // UnitCM_Array = product_prices - product_vcosts
      const unitCMArray: number[] = [];
      for (let i = 0; i < n; i++) {
        unitCMArray.push(prices[i] - vcosts[i]);
      }

      // WACM = SUM(UnitCM_Array * product_mix)
      let wACM = 0;
      for (let i = 0; i < n; i++) {
        wACM += unitCMArray[i] * mix[i];
      }

      // BEP_Units = fixed_costs / WACM
      const bEPUnits = wACM !== 0 ? fixedCosts / wACM : 0;

      // BEP_Revenue = SUM(BEP_Units * product_mix * product_prices)
      let bEPRevenue = 0;
      for (let i = 0; i < n; i++) {
        bEPRevenue += bEPUnits * mix[i] * prices[i];
      }

      // Target_Units = (fixed_costs + (target_profit / (1 - (tax_rate/100)))) / WACM
      const taxDecimal = taxRate / 100;
      const afterTaxTarget = targetProfit / (1 - taxDecimal);
      const targetUnits = wACM !== 0 ? (fixedCosts + afterTaxTarget) / wACM : 0;

      // MarginOfSafety = MAX(0, ((actual_volume - BEP_Units) / actual_volume) * 100)
      const marginOfSafety = actualVolume > 0 
        ? Math.max(0, ((actualVolume - bEPUnits) / actualVolume) * 100)
        : 0;

      // OperatingIncome = (actual_volume * WACM) - fixed_costs
      const operatingIncome = (actualVolume * wACM) - fixedCosts;

      // DOL = IF(OperatingIncome > 0, (actual_volume * WACM) / OperatingIncome, null)
      const dOL = operatingIncome > 0 
        ? (actualVolume * wACM) / operatingIncome 
        : 0;

      return {
        unitCMArray,
        wACM: Math.round(wACM * 100) / 100,
        bEPUnits: Math.round(bEPUnits * 100) / 100,
        bEPRevenue: Math.round(bEPRevenue * 100) / 100,
        targetUnits: Math.round(targetUnits * 100) / 100,
        marginOfSafety: Math.round(marginOfSafety * 100) / 100,
        operatingIncome: Math.round(operatingIncome * 100) / 100,
        dOL: Math.round(dOL * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};