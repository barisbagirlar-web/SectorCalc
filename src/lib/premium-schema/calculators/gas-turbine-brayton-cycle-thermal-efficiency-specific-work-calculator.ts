import { GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166InputSchema, type GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166Input } from "./gaz-turbinleri-brayton-cevrimi-isil-verim-ve-spesifik-is-calculator-166-validation";

export const calculateGazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166Contract: any = {
  id: "gaz-turbinleri-brayton-cevrimi-isil-verim-ve-spesifik-is-calculator-166",
  version: "1.0.0",
  category: "cost",
  inputSchema: GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166InputSchema,
  
  execute: async (input: any) => {
    try {
      const t1InletK = Number(input.t1InletK);
      const t3TurbineInletK = Number(input.t3TurbineInletK);
      const pressureRatioRp = Number(input.pressureRatioRp);
      const specificHeatRatioGamma = Number(input.specificHeatRatioGamma);
      const compEfficiency = Number(input.compEfficiency) / 100;
      const turbEfficiency = Number(input.turbEfficiency) / 100;

      // Gamma_Calc = (γ - 1) / γ
      const gammaCalc = (specificHeatRatioGamma - 1) / specificHeatRatioGamma;

      // T2s = T1 * (rp)^Gamma_Calc
      const t2s = t1InletK * Math.pow(pressureRatioRp, gammaCalc);

      // T2 = T1 + (T2s - T1) / η_comp
      const t2 = t1InletK + (t2s - t1InletK) / compEfficiency;

      // T4s = T3 / (rp)^Gamma_Calc
      const t4s = t3TurbineInletK / Math.pow(pressureRatioRp, gammaCalc);

      // T4 = T3 - η_turb * (T3 - T4s)
      const t4 = t3TurbineInletK - turbEfficiency * (t3TurbineInletK - t4s);

      // W_compressor = cp * (T2 - T1) where cp = 1.005 kJ/kgK for air
      const wCompressor = 1.005 * (t2 - t1InletK);

      // W_turbine = cp * (T3 - T4)
      const wTurbine = 1.005 * (t3TurbineInletK - t4);

      // Net_Specific_Work_kJ_kg = W_turbine - W_compressor
      const netSpecificWorkKJKg = wTurbine - wCompressor;

      // Heat_Input_kJ_kg = cp * (T3 - T2)
      const heatInputKJKg = 1.005 * (t3TurbineInletK - t2);

      // Thermal_Efficiency_Pct = (Net_Specific_Work_kJ_kg / Heat_Input_kJ_kg) * 100
      const thermalEfficiencyPct = heatInputKJKg > 0 ? (netSpecificWorkKJKg / heatInputKJKg) * 100 : 0;

      return {
        gammaCalc: Math.round(gammaCalc * 1000) / 1000,
        t2s: Math.round(t2s * 100) / 100,
        t2: Math.round(t2 * 100) / 100,
        t4s: Math.round(t4s * 100) / 100,
        t4: Math.round(t4 * 100) / 100,
        wCompressor: Math.round(wCompressor * 100) / 100,
        wTurbine: Math.round(wTurbine * 100) / 100,
        netSpecificWorkKJKg: Math.round(netSpecificWorkKJKg * 100) / 100,
        heatInputKJKg: Math.round(heatInputKJKg * 100) / 100,
        thermalEfficiencyPct: Math.round(thermalEfficiencyPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};