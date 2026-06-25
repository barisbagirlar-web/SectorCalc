import { EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163InputSchema, type EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163Input } from "./endustriyel-sogutma-kuleleri-yaklasim-approach-ve-isil-verim-analysis-calculator-163-validation";

export const calculateEndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163Contract: any = {
  id: "endustriyel-sogutma-kuleleri-yaklasim-approach-ve-isil-verim-analysis-calculator-163",
  version: "1.0.0",
  category: "cost",
  inputSchema: EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values with defaults
      const waterInletTempC = Number(input.waterInletTempC) || 0;
      const waterOutletTempC = Number(input.waterOutletTempC) || 0;
      const ambientWetBulbC = Number(input.ambientWetBulbC) || 0;
      const waterFlowM3H = Number(input.waterFlowM3H) || 0;

      // Formula: Cooling_Range = water_inlet_temp_c - water_outlet_temp_c
      const coolingRange = waterInletTempC - waterOutletTempC;

      // Formula: Approach = water_outlet_temp_c - ambient_wet_bulb_c
      const approach = waterOutletTempC - ambientWetBulbC;

      // Formula: Tower_Efficiency_Pct = (Cooling_Range / (Cooling_Range + Approach)) * 100
      // Guard against division by zero when coolingRange + approach = 0
      const denominator = coolingRange + approach;
      const towerEfficiencyPct = denominator !== 0 ? (coolingRange / denominator) * 100 : 0;

      // Formula: Heat_Rejected_kW = water_flow_m3_h * 1000 * 4.186 * Cooling_Range / 3600
      // Water density: 1000 kg/m3, specific heat: 4.186 kJ/(kg·°C), 1 kJ/s = 1 kW
      // Conversion: m3/h to kg/s = (m3/h * 1000) / 3600
      const heatRejectedKW = waterFlowM3H * 1000 * 4.186 * coolingRange / 3600;

      return {
        coolingRange: Math.round(coolingRange * 100) / 100,
        approach: Math.round(approach * 100) / 100,
        towerEfficiencyPct: Math.round(towerEfficiencyPct * 100) / 100,
        heatRejectedKW: Math.round(heatRejectedKW * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};