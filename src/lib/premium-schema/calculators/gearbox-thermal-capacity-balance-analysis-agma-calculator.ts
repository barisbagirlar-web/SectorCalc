import { SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116InputSchema, type SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116Input } from "./sanziman-reduktor-termal-kapasite-denge-analysis-agma-calculator-116-validation";

export const calculateSanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116Contract: any = {
  id: "sanziman-reduktor-termal-kapasite-denge-analysis-agma-calculator-116",
  version: "1.0.0",
  category: "cost",
  inputSchema: SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse and validate input values
      const inputPower = Number(input.inputPower) || 0;
      const gearEfficiency = Number(input.gearEfficiency) || 0;
      const surfaceArea = Number(input.surfaceArea) || 0;
      const ambientTemp = Number(input.ambientTemp) || 0;
      const maxOilTemp = Number(input.maxOilTemp) || 0;
      const heatTransferCoeff = Number(input.heatTransferCoeff) || 0;

      // Formula: Heat_Generated_kW = input_power * (1 - (gear_efficiency / 100))
      const heatGeneratedKW = inputPower * (1 - (gearEfficiency / 100));
      
      // Formula: Heat_Generated_W = Heat_Generated_kW * 1000
      const heatGeneratedW = heatGeneratedKW * 1000;
      
      // Formula: Max_Heat_Dissipated_W = heat_transfer_coeff * surface_area * (max_oil_temp - ambient_temp)
      const maxHeatDissipatedW = heatTransferCoeff * surfaceArea * (maxOilTemp - ambientTemp);
      
      // Formula: Thermal_Balance_W = Max_Heat_Dissipated_W - Heat_Generated_W
      const thermalBalanceW = maxHeatDissipatedW - heatGeneratedW;
      
      // Formula: Expected_Oil_Temp = ambient_temp + (Heat_Generated_W / (heat_transfer_coeff * surface_area))
      const denominator = heatTransferCoeff * surfaceArea;
      const expectedOilTemp = denominator > 0 
        ? ambientTemp + (heatGeneratedW / denominator)
        : 0;

      return {
        heatGeneratedKW: Math.round(heatGeneratedKW * 100) / 100,
        heatGeneratedW: Math.round(heatGeneratedW * 100) / 100,
        maxHeatDissipatedW: Math.round(maxHeatDissipatedW * 100) / 100,
        thermalBalanceW: Math.round(thermalBalanceW * 100) / 100,
        expectedOilTemp: Math.round(expectedOilTemp * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};