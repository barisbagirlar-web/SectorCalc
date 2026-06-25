import { EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42InputSchema, type EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42Input } from "./evaporatif-sogutma-fes-kapasite-ve-roi-analysis-calculator-42-validation";

export const calculateEvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42Contract: any = {
  id: "evaporatif-sogutma-fes-kapasite-ve-roi-analysis-calculator-42",
  version: "1.0.0",
  category: "cost",
  inputSchema: EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        len,
        wid,
        hei,
        ach,
        tDry,
        tWet,
        padEff,
        devFlow,
        devKw,
        convKw,
        waterLph,
        elecRate,
        waterRate,
        opHours
      } = input;

      // Formula: Volume = len * wid * hei
      const volume = len * wid * hei;

      // Formula: Total_Q = Volume * ach
      const totalQ = volume * ach;

      // Formula: T_out_pad = t_dry - (pad_eff / 100) * (t_dry - t_wet)
      const tOutPad = tDry - (padEff / 100) * (tDry - tWet);

      // Formula: Delta_T = t_dry - T_out_pad
      const deltaT = tDry - tOutPad;

      // Formula: DeviceCount = CEILING(Total_Q / dev_flow)
      const deviceCount = Math.ceil(totalQ / devFlow);

      // Formula: TotalPower_FES = DeviceCount * dev_kw
      const totalPowerFES = deviceCount * devKw;

      // Formula: TotalWater_Lph = DeviceCount * water_lph
      const totalWaterLph = deviceCount * waterLph;

      // Formula: AnnualElec_FES = TotalPower_FES * op_hours
      const annualElecFES = totalPowerFES * opHours;

      // Formula: AnnualElec_Conv = conv_kw * op_hours
      const annualElecConv = convKw * opHours;

      // Formula: EnergySavings_kWh = AnnualElec_Conv - AnnualElec_FES
      const energySavingsKWh = annualElecConv - annualElecFES;

      // Formula: AnnualElecCost_FES = AnnualElec_FES * elec_rate
      const annualElecCostFES = annualElecFES * elecRate;

      // Formula: AnnualWaterCost = (TotalWater_Lph * op_hours / 1000) * water_rate
      const annualWaterCost = (totalWaterLph * opHours / 1000) * waterRate;

      // Formula: TotalOpEx_FES = AnnualElecCost_FES + AnnualWaterCost
      const totalOpExFES = annualElecCostFES + annualWaterCost;

      // Formula: TotalSavings_USD = (AnnualElec_Conv * elec_rate) - TotalOpEx_FES
      const totalSavingsUSD = (annualElecConv * elecRate) - totalOpExFES;

      return {
        volume,
        totalQ,
        tOutPad,
        deltaT,
        deviceCount,
        totalPowerFES,
        totalWaterLph,
        annualElecFES,
        annualElecConv,
        energySavingsKWh,
        annualElecCostFES,
        annualWaterCost,
        totalOpExFES,
        totalSavingsUSD
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};