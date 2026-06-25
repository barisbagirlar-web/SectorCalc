import { DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28InputSchema, type DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28Input } from "./dijital-ikiz-digital-twin-prototip-roi-analysis-calculator-28-validation";

export const calculateDijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28Contract: any = {
  id: "dijital-ikiz-digital-twin-prototip-roi-analysis-calculator-28",
  version: "1.0.0",
  category: "cost",
  inputSchema: DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        physProtoCost,
        physIterations,
        fieldTestCost,
        dtSoftwareLic,
        dtCloudHrs,
        cloudRate,
        sensorCapex,
        engModelingHrs,
        engRate,
        timeToMarketGain,
        dailyMarketRev
      } = input;

      // Cost_Physical_Baseline = (phys_proto_cost * phys_iterations) + field_test_cost
      const costPhysicalBaseline = (physProtoCost * physIterations) + fieldTestCost;

      // Cost_DT_OpEx = dt_software_lic + (dt_cloud_hrs * cloud_rate) + (eng_modeling_hrs * eng_rate)
      const costDTOpEx = dtSoftwareLic + (dtCloudHrs * cloudRate) + (engModelingHrs * engRate);

      // Cost_DT_Total = Cost_DT_OpEx + sensor_capex
      const costDTTotal = costDTOpEx + sensorCapex;

      // Savings_Prototyping = Cost_Physical_Baseline - Cost_DT_Total
      const savingsPrototyping = costPhysicalBaseline - costDTTotal;

      // Revenue_Gain_TTM = time_to_market_gain * daily_market_rev
      const revenueGainTTM = timeToMarketGain * dailyMarketRev;

      // Total_Value_Created = Savings_Prototyping + Revenue_Gain_TTM
      const totalValueCreated = savingsPrototyping + revenueGainTTM;

      // DT_ROI = (Total_Value_Created / Cost_DT_Total) * 100
      const dTROI = costDTTotal > 0 ? (totalValueCreated / costDTTotal) * 100 : 0;

      // Payback_Months = (sensor_capex / (Total_Value_Created / 12))
      const paybackMonths = totalValueCreated > 0 ? (sensorCapex / (totalValueCreated / 12)) : 0;

      return {
        costPhysicalBaseline: Math.round(costPhysicalBaseline * 100) / 100,
        costDTOpEx: Math.round(costDTOpEx * 100) / 100,
        costDTTotal: Math.round(costDTTotal * 100) / 100,
        savingsPrototyping: Math.round(savingsPrototyping * 100) / 100,
        revenueGainTTM: Math.round(revenueGainTTM * 100) / 100,
        totalValueCreated: Math.round(totalValueCreated * 100) / 100,
        dTROI: Math.round(dTROI * 100) / 100,
        paybackMonths: Math.round(paybackMonths * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};