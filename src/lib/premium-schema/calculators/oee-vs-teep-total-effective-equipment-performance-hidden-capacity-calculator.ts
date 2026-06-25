import { OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158InputSchema, type OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158Input } from "./oee-vs-teep-total-effective-equipment-perf-gizli-kapasite-analysis-calculator-158-validation";

export const calculateOeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158Contract: any = {
  id: "oee-vs-teep-total-effective-equipment-perf-gizli-kapasite-analysis-calculator-158",
  version: "1.0.0",
  category: "cost",
  inputSchema: OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158InputSchema,
  
  execute: async (input: OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158Input) => {
    try {
      const {
        totalCalendarTime,
        unscheduledTime,
        plannedMaintenance,
        unplannedDowntime,
        idealCycleTime,
        totalUnitsProduced,
        goodUnits,
        capexPerNewMachine
      } = input;

      // Validate inputs to prevent division by zero or negative values
      if (totalCalendarTime <= 0 || idealCycleTime <= 0 || totalUnitsProduced <= 0) {
        throw new Error("Invalid input: totalCalendarTime, idealCycleTime, and totalUnitsProduced must be greater than zero");
      }

      // Formula: Loading_Time = total_calendar_time - unscheduled_time - planned_maintenance
      const loadingTime = Math.max(0, totalCalendarTime - unscheduledTime - plannedMaintenance);

      // Formula: Operating_Time = Loading_Time - unplanned_downtime
      const operatingTime = Math.max(0, loadingTime - unplannedDowntime);

      // Formula: Availability_Pct = (Operating_Time / Loading_Time) * 100
      const availabilityPct = loadingTime > 0 ? (operatingTime / loadingTime) * 100 : 0;

      // Formula: Performance_Pct = ((ideal_cycle_time * total_units_produced) / Operating_Time) * 100
      const performancePct = operatingTime > 0 ? ((idealCycleTime * totalUnitsProduced) / operatingTime) * 100 : 0;

      // Formula: Quality_Pct = (good_units / total_units_produced) * 100
      const qualityPct = totalUnitsProduced > 0 ? (goodUnits / totalUnitsProduced) * 100 : 0;

      // Formula: OEE_Pct = (Availability_Pct / 100) * (Performance_Pct / 100) * (Quality_Pct / 100) * 100
      const oEEPct = ((availabilityPct / 100) * (performancePct / 100) * (qualityPct / 100)) * 100;

      // Formula: Utilization_Factor = Loading_Time / total_calendar_time
      const utilizationFactor = loadingTime / totalCalendarTime;

      // Formula: TEEP_Pct = OEE_Pct * Utilization_Factor
      const tEEPPct = oEEPct * utilizationFactor;

      // Formula: Hidden_Capacity_Hours = total_calendar_time * (1 - (TEEP_Pct / 100))
      const hiddenCapacityHours = totalCalendarTime * (1 - (tEEPPct / 100));

      // Formula: Equivalent_Hidden_Machines = Hidden_Capacity_Hours / total_calendar_time
      const equivalentHiddenMachines = hiddenCapacityHours / totalCalendarTime;

      // Formula: Avoidable_CAPEX = Equivalent_Hidden_Machines * capex_per_new_machine
      const avoidableCAPEX = equivalentHiddenMachines * capexPerNewMachine;

      return {
        loadingTime: Math.round(loadingTime * 100) / 100,
        operatingTime: Math.round(operatingTime * 100) / 100,
        availabilityPct: Math.round(availabilityPct * 100) / 100,
        performancePct: Math.round(performancePct * 100) / 100,
        qualityPct: Math.round(qualityPct * 100) / 100,
        oEEPct: Math.round(oEEPct * 100) / 100,
        utilizationFactor: Math.round(utilizationFactor * 100) / 100,
        tEEPPct: Math.round(tEEPPct * 100) / 100,
        hiddenCapacityHours: Math.round(hiddenCapacityHours * 100) / 100,
        equivalentHiddenMachines: Math.round(equivalentHiddenMachines * 100) / 100,
        avoidableCAPEX: Math.round(avoidableCAPEX * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};