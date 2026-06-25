import { IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96InputSchema, type IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96Input } from "./ileri-seviye-oee-tpm-ve-6-buyuk-loss-finansal-cevirici-calculator-96-validation";

export const calculateIleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96Contract: any = {
  id: "ileri-seviye-oee-tpm-ve-6-buyuk-loss-finansal-cevirici-calculator-96",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96InputSchema,
  
  execute: async (input: any) => {
    try {
      const plannedTime = Number(input.plannedTime);
      const downtime = Number(input.downtime);
      const setupTime = Number(input.setupTime);
      const idealCt = Number(input.idealCt);
      const totalParts = Number(input.totalParts);
      const goodParts = Number(input.goodParts);
      const margin = Number(input.margin);

      // Validate inputs
      if (plannedTime <= 0 || idealCt <= 0 || totalParts <= 0 || margin < 0) {
        throw new Error("Invalid input values: plannedTime, idealCt, totalParts, and margin must be positive numbers.");
      }

      // Formula: Operating_Time = planned_time - downtime - setup_time
      const operatingTime = Math.max(0, plannedTime - downtime - setupTime);

      // Formula: Availability_Pct = (Operating_Time / planned_time) * 100
      const availabilityPct = plannedTime > 0 ? (operatingTime / plannedTime) * 100 : 0;

      // Formula: Performance_Pct = ((ideal_ct * total_parts) / Operating_Time) * 100
      const performancePct = operatingTime > 0 && idealCt > 0 ? ((idealCt * totalParts) / operatingTime) * 100 : 0;

      // Formula: Quality_Pct = (good_parts / total_parts) * 100
      const qualityPct = totalParts > 0 ? (goodParts / totalParts) * 100 : 0;

      // Formula: OEE_Pct = (Availability_Pct / 100) * (Performance_Pct / 100) * (Quality_Pct / 100) * 100
      const oEEPct = (availabilityPct / 100) * (performancePct / 100) * (qualityPct / 100) * 100;

      // Formula: Lost_Capacity_Units = (planned_time / ideal_ct) - good_parts
      const plannedCapacity = plannedTime > 0 && idealCt > 0 ? plannedTime / idealCt : 0;
      const lostCapacityUnits = Math.max(0, plannedCapacity - goodParts);

      // Formula: Financial_Loss = Lost_Capacity_Units * margin
      const financialLoss = lostCapacityUnits * margin;

      return {
        operatingTime: Math.round(operatingTime * 100) / 100,
        availabilityPct: Math.round(availabilityPct * 100) / 100,
        performancePct: Math.round(performancePct * 100) / 100,
        qualityPct: Math.round(qualityPct * 100) / 100,
        oEEPct: Math.round(oEEPct * 100) / 100,
        lostCapacityUnits: Math.round(lostCapacityUnits * 100) / 100,
        financialLoss: Math.round(financialLoss * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};