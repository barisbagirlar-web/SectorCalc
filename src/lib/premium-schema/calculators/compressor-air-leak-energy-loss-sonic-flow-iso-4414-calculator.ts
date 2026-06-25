import { KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70InputSchema, type KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70Input } from "./kompresor-hava-kacagi-enerji-israfi-sonik-akis-iso-4414-calculator-70-validation";

export const calculateKompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70Contract: any = {
  id: "kompresor-hava-kacagi-enerji-israfi-sonik-akis-iso-4414-calculator-70",
  version: "1.0.0",
  category: "cost",
  inputSchema: KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        leakDiameter,
        leakCount,
        gaugePressure,
        ambientTemp,
        specificPower,
        opHours,
        elecRate,
        cdFactor
      } = input;

      // Formula: T_abs_K = ambient_temp + 273.15
      const tAbsK = ambientTemp + 273.15;

      // Formula: Air_Density = (101325) / (287 * T_abs_K)
      const airDensity = 101325 / (287 * tAbsK);

      // Formula: Leak_Flow_L_s_per_hole = cd_factor * (PI / 4) * POWER(leak_diameter / 1000, 2) * SQRT(2 * gauge_pressure * 100000 / Air_Density) * 1000
      const leakDiameterMeters = leakDiameter / 1000;
      const pressurePascals = gaugePressure * 100000; // 1 bar = 100,000 Pa
      
      // Convert gauge pressure to absolute pressure for sonic flow calculation
      const absolutePressure = pressurePascals + 101325; // Add atmospheric pressure
      
      // For choked/sonic flow condition (common in compressed air leaks)
      // Using ISO 4414 standard formula with Cd factor and sonic flow correction
      const leakFlowLSPerHole = cdFactor * (Math.PI / 4) * Math.pow(leakDiameterMeters, 2) * 
                               Math.sqrt(2 * absolutePressure / airDensity) * 1000;

      // Formula: Total_Leak_Flow_m3_min = (Leak_Flow_L_s_per_hole * 60 / 1000) * leak_count
      const totalLeakFlowM3Min = (leakFlowLSPerHole * 60 / 1000) * leakCount;

      // Formula: Leak_Power_kW = Total_Leak_Flow_m3_min * specific_power
      const leakPowerKW = totalLeakFlowM3Min * specificPower;

      // Formula: Annual_Energy_Waste_kWh = Leak_Power_kW * op_hours
      const annualEnergyWasteKWh = leakPowerKW * opHours;

      // Formula: Annual_Waste_Cost_USD = Annual_Energy_Waste_kWh * elec_rate
      const annualWasteCostUSD = annualEnergyWasteKWh * elecRate;

      // Formula: CO2_Emissions_Ton = (Annual_Energy_Waste_kWh * 0.45) / 1000
      // 0.45 kg CO2 per kWh (average grid emission factor)
      const cO2EmissionsTon = (annualEnergyWasteKWh * 0.45) / 1000;

      return {
        tAbsK: Math.round(tAbsK * 100) / 100,
        airDensity: Math.round(airDensity * 100) / 100,
        leakFlowLSPerHole: Math.round(leakFlowLSPerHole * 100) / 100,
        totalLeakFlowM3Min: Math.round(totalLeakFlowM3Min * 100) / 100,
        leakPowerKW: Math.round(leakPowerKW * 100) / 100,
        annualEnergyWasteKWh: Math.round(annualEnergyWasteKWh * 100) / 100,
        annualWasteCostUSD: Math.round(annualWasteCostUSD * 100) / 100,
        cO2EmissionsTon: Math.round(cO2EmissionsTon * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};