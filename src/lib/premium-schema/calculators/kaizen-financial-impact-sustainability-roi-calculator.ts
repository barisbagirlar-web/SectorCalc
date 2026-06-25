import { KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63InputSchema, type KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63Input } from "./kaizen-finansal-etki-ve-surdurulebilirlik-roi-calculator-63-validation";

export const calculateKaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63Contract: any = {
  id: "kaizen-finansal-etki-ve-surdurulebilirlik-roi-calculator-63",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        baselineCost,
        actualCost,
        timeSavedMin,
        laborRate,
        conversionFactor,
        annualVolume,
        implementationCost,
        month1Savings,
        month6Savings
      } = input;

      // Formula: Hard_Savings = baseline_cost - actual_cost
      const hardSavings = baselineCost - actualCost;

      // Formula: Soft_Savings = (time_saved_min / 60) * labor_rate * annual_volume * (conversion_factor / 100)
      const softSavings = (timeSavedMin / 60) * laborRate * annualVolume * (conversionFactor / 100);

      // Formula: Total_Annual_Savings = Hard_Savings + Soft_Savings
      const totalAnnualSavings = hardSavings + softSavings;

      // Formula: Kaizen_ROI_Pct = ((Total_Annual_Savings - implementation_cost) / implementation_cost) * 100
      const kaizenROIPct = implementationCost > 0 
        ? ((totalAnnualSavings - implementationCost) / implementationCost) * 100 
        : 0;

      // Formula: Payback_Months = implementation_cost / (Total_Annual_Savings / 12)
      const paybackMonths = totalAnnualSavings > 0 
        ? implementationCost / (totalAnnualSavings / 12) 
        : 0;

      // Formula: Sustainability_Index = (month_6_savings / month_1_savings) * 100
      const sustainabilityIndex = month1Savings > 0 
        ? (month6Savings / month1Savings) * 100 
        : 0;

      return {
        hardSavings: Math.round(hardSavings * 100) / 100,
        softSavings: Math.round(softSavings * 100) / 100,
        totalAnnualSavings: Math.round(totalAnnualSavings * 100) / 100,
        kaizenROIPct: Math.round(kaizenROIPct * 100) / 100,
        paybackMonths: Math.round(paybackMonths * 100) / 100,
        sustainabilityIndex: Math.round(sustainabilityIndex * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};