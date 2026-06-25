import { MagazaservisSaatlikUcretBurdenedRateCalculator77InputSchema, type MagazaservisSaatlikUcretBurdenedRateCalculator77Input } from "./magazaservis-saatlik-ucret-burdened-rate-calculator-77-validation";

export const calculateMagazaservisSaatlikUcretBurdenedRateCalculator77Contract: any = {
  id: "magazaservis-saatlik-ucret-burdened-rate-calculator-77",
  version: "1.0.0",
  category: "cost",
  inputSchema: MagazaservisSaatlikUcretBurdenedRateCalculator77InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        techWages,
        adminWages,
        statutoryBurden,
        fixedOverhead,
        techCount,
        availableHrsPerTech,
        utilizationRate,
        targetProfitMargin
      } = input as MagazaservisSaatlikUcretBurdenedRateCalculator77Input;

      // Validate inputs to prevent division by zero or invalid calculations
      if (techCount <= 0 || availableHrsPerTech <= 0) {
        throw new Error("Teknisyen sayısı ve aylık mesai pozitif olmalıdır.");
      }

      const burdenMultiplier = 1 + (statutoryBurden / 100);
      const utilizationDecimal = utilizationRate / 100;

      // Formula: Direct_Labor_Cost = tech_wages * (1 + (statutory_burden / 100))
      const directLaborCost = techWages * burdenMultiplier;

      // Formula: Indirect_Labor_Cost = admin_wages * (1 + (statutory_burden / 100))
      const indirectLaborCost = adminWages * burdenMultiplier;

      // Formula: Total_Monthly_Cost = Direct_Labor_Cost + Indirect_Labor_Cost + fixed_overhead
      const totalMonthlyCost = directLaborCost + indirectLaborCost + fixedOverhead;

      // Formula: Total_Available_Hours = tech_count * available_hrs_per_tech
      const totalAvailableHours = techCount * availableHrsPerTech;

      // Formula: Billable_Hours = Total_Available_Hours * (utilization_rate / 100)
      const billableHours = totalAvailableHours * utilizationDecimal;

      // Prevent division by zero in subsequent calculations
      if (billableHours <= 0) {
        throw new Error("Fatura edilebilir saatler pozitif olmalıdır. Kullanım oranını kontrol edin.");
      }

      // Formula: Shop_Cost_Per_Hour = Total_Monthly_Cost / Billable_Hours
      const shopCostPerHour = totalMonthlyCost / billableHours;

      // Formula: Required_Billing_Rate = Shop_Cost_Per_Hour / (1 - (target_profit_margin / 100))
      const profitMarginDecimal = targetProfitMargin / 100;
      const requiredBillingRate = shopCostPerHour / (1 - profitMarginDecimal);

      // Formula: Effective_Markup_Pct = ((Required_Billing_Rate - (Direct_Labor_Cost / Total_Available_Hours)) / (Direct_Labor_Cost / Total_Available_Hours)) * 100
      const directLaborCostPerHour = directLaborCost / totalAvailableHours;
      
      // Handle edge case where directLaborCostPerHour is 0
      const effectiveMarkupPct = directLaborCostPerHour !== 0 
        ? ((requiredBillingRate - directLaborCostPerHour) / directLaborCostPerHour) * 100
        : 0;

      return {
        directLaborCost: Math.round(directLaborCost * 100) / 100,
        indirectLaborCost: Math.round(indirectLaborCost * 100) / 100,
        totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
        totalAvailableHours: Math.round(totalAvailableHours * 100) / 100,
        billableHours: Math.round(billableHours * 100) / 100,
        shopCostPerHour: Math.round(shopCostPerHour * 100) / 100,
        requiredBillingRate: Math.round(requiredBillingRate * 100) / 100,
        effectiveMarkupPct: Math.round(effectiveMarkupPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};