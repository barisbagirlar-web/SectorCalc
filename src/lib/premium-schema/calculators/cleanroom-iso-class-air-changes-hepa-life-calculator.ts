import { TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151InputSchema, type TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151Input } from "./temiz-oda-cleanroom-iso-sinifi-hava-degisimi-ve-hepa-omru-calculator-151-validation";

export const calculateTemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151Contract: any = {
  id: "temiz-oda-cleanroom-iso-sinifi-hava-degisimi-ve-hepa-omru-calculator-151",
  version: "1.0.0",
  category: "cost",
  inputSchema: TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151InputSchema,
  
  execute: async (input: any) => {
    try {
      const roomVolume = input.roomVolume;
      const isoClass = input.isoClass;
      const hepaFlowRate = input.hepaFlowRate;
      const pressureDropInitial = input.pressureDropInitial;
      const pressureDropFinal = input.pressureDropFinal;
      const dailyDustLoad = input.dailyDustLoad;
      const filterDustCapacity = input.filterDustCapacity;

      // Formula: Required_ACH = IF(iso_class <= 5, 240, IF(iso_class <= 7, 60, 20))
      let requiredACH: number;
      if (isoClass <= 5) {
        requiredACH = 240;
      } else if (isoClass <= 7) {
        requiredACH = 60;
      } else {
        requiredACH = 20;
      }

      // Formula: Total_Airflow_m3h = room_volume * Required_ACH
      const totalAirflowM3h = roomVolume * requiredACH;

      // Formula: Required_HEPA_Count = CEILING(Total_Airflow_m3h / hepa_flow_rate)
      const requiredHEPACount = Math.ceil(totalAirflowM3h / hepaFlowRate);

      // Formula: Filter_Life_Days = (filter_dust_capacity * Required_HEPA_Count) / daily_dust_load
      const filterLifeDays = dailyDustLoad > 0 ? (filterDustCapacity * requiredHEPACount) / dailyDustLoad : 0;

      // Formula: Filter_Life_Months = Filter_Life_Days / 30
      const filterLifeMonths = filterLifeDays / 30;

      // Formula: Pressure_Drop_Delta = pressure_drop_final - pressure_drop_initial
      const pressureDropDelta = pressureDropFinal - pressureDropInitial;

      return {
        requiredACH,
        totalAirflowM3h,
        requiredHEPACount,
        filterLifeDays,
        filterLifeMonths,
        pressureDropDelta
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};