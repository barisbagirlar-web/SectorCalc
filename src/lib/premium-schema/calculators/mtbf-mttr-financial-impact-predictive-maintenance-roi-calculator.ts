import { MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101InputSchema, type MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101Input } from "./mtbf-mttr-finansal-etki-ve-kestirimci-bakim-roi-calculator-101-validation";

export const calculateMtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101Contract: any = {
  id: "mtbf-mttr-finansal-etki-ve-kestirimci-bakim-roi-calculator-101",
  version: "1.0.0",
  category: "cost",
  inputSchema: MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        failureCount,
        opHours,
        totalRepairHrs,
        downtimeCostHr,
        avgPartsCost,
        repairLaborRate,
        pmInvestment,
        failureReductionPct
      } = input;

      // Formula: Actual_Operating_Time = op_hours - total_repair_hrs
      const actualOperatingTime = opHours - totalRepairHrs;

      // Formula: MTBF = Actual_Operating_Time / failure_count
      const mTBF = failureCount > 0 ? actualOperatingTime / failureCount : 0;

      // Formula: MTTR = total_repair_hrs / failure_count
      const mTTR = failureCount > 0 ? totalRepairHrs / failureCount : 0;

      // Formula: Availability_Pct = (MTBF / (MTBF + MTTR)) * 100
      const availabilityPct = (mTBF + mTTR) > 0 ? (mTBF / (mTBF + mTTR)) * 100 : 0;

      // Formula: Current_Downtime_Cost = total_repair_hrs * downtime_cost_hr
      const currentDowntimeCost = totalRepairHrs * downtimeCostHr;

      // Formula: Current_Repair_Cost = (total_repair_hrs * repair_labor_rate) + (failure_count * avg_parts_cost)
      const currentRepairCost = (totalRepairHrs * repairLaborRate) + (failureCount * avgPartsCost);

      // Formula: Total_Current_Failure_Cost = Current_Downtime_Cost + Current_Repair_Cost
      const totalCurrentFailureCost = currentDowntimeCost + currentRepairCost;

      // Formula: New_Failure_Count = failure_count * (1 - (failure_reduction_pct / 100))
      const newFailureCount = failureCount * (1 - (failureReductionPct / 100));

      // Formula: New_Repair_Hrs = New_Failure_Count * MTTR
      const newRepairHrs = newFailureCount * mTTR;

      // Formula: New_Failure_Cost = (New_Repair_Hrs * downtime_cost_hr) + (New_Repair_Hrs * repair_labor_rate) + (New_Failure_Count * avg_parts_cost)
      const newFailureCost = (newRepairHrs * downtimeCostHr) + (newRepairHrs * repairLaborRate) + (newFailureCount * avgPartsCost);

      // Formula: Annual_Savings = Total_Current_Failure_Cost - New_Failure_Cost
      const annualSavings = totalCurrentFailureCost - newFailureCost;

      // Formula: ROI_Pct = ((Annual_Savings - pm_investment) / pm_investment) * 100
      const rOIPct = pmInvestment > 0 ? ((annualSavings - pmInvestment) / pmInvestment) * 100 : 0;

      return {
        actualOperatingTime: Math.round(actualOperatingTime * 100) / 100,
        mTBF: Math.round(mTBF * 100) / 100,
        mTTR: Math.round(mTTR * 100) / 100,
        availabilityPct: Math.round(availabilityPct * 100) / 100,
        currentDowntimeCost: Math.round(currentDowntimeCost * 100) / 100,
        currentRepairCost: Math.round(currentRepairCost * 100) / 100,
        totalCurrentFailureCost: Math.round(totalCurrentFailureCost * 100) / 100,
        newFailureCount: Math.round(newFailureCount * 100) / 100,
        newRepairHrs: Math.round(newRepairHrs * 100) / 100,
        newFailureCost: Math.round(newFailureCost * 100) / 100,
        annualSavings: Math.round(annualSavings * 100) / 100,
        rOIPct: Math.round(rOIPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};