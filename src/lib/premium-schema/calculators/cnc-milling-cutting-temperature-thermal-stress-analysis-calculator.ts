import { CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169InputSchema, type CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169Input } from "./cnc-frezelemede-kesme-sicakligi-ve-isil-gerilme-analysis-calculator-169-validation";

export const calculateCncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169Contract: any = {
  id: "cnc-frezelemede-kesme-sicakligi-ve-isil-gerilme-analysis-calculator-169",
  version: "1.0.0",
  category: "cost",
  inputSchema: CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169InputSchema,
  
  execute: async (input: any) => {
    try {
      const cuttingSpeedVc = input.cuttingSpeedVc;
      const feedPerToothFz = input.feedPerToothFz;
      const depthOfCutAp = input.depthOfCutAp;
      const specificHeatCapacity = input.specificHeatCapacity;
      const materialDensity = input.materialDensity;
      const thermalConductivity = input.thermalConductivity;
      const toolSofteningTemp = input.toolSofteningTemp;
      const ambientTemp = input.ambientTemp;

      // Formula: V_m_s = cutting_speed_vc / 60
      const vMS = cuttingSpeedVc / 60;

      // Formula: Thermal_Diffusivity_alpha = thermal_conductivity / (material_density * specific_heat_capacity)
      const thermalDiffusivityAlpha = thermalConductivity / (materialDensity * specificHeatCapacity);

      // Formula: Peclet_Number_Pe = (V_m_s * feed_per_tooth_fz / 1000) / Thermal_Diffusivity_alpha
      const pecletNumberPe = (vMS * (feedPerToothFz / 1000)) / thermalDiffusivityAlpha;

      // Formula: Theoretical_Max_Temp_Rise = 1.2 * (specific_heat_capacity * 0.001) * POWER(Peclet_Number_Pe, 0.5)
      const theoreticalMaxTempRise = 1.2 * (specificHeatCapacity * 0.001) * Math.sqrt(pecletNumberPe);

      // Formula: Cutting_Tip_Temp = ambient_temp + (Theoretical_Max_Temp_Rise * (cutting_speed_vc / 100))
      const cuttingTipTemp = ambientTemp + (theoreticalMaxTempRise * (cuttingSpeedVc / 100));

      // Formula: Thermal_Stress_MPa = 0.5 * 210000 * 12e-6 * (Cutting_Tip_Temp - ambient_temp)
      const thermalStressMPa = 0.5 * 210000 * 12e-6 * (cuttingTipTemp - ambientTemp);

      return {
        vMS,
        thermalDiffusivityAlpha,
        pecletNumberPe,
        theoreticalMaxTempRise,
        cuttingTipTemp,
        thermalStressMPa
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};