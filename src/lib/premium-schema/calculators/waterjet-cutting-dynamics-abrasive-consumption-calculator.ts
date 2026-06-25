import { SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118InputSchema, type SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118Input } from "./su-jeti-waterjet-kesim-dinamikleri-ve-asindirici-tuketimi-calculator-118-validation";

export const calculateSuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118Contract: any = {
  id: "su-jeti-waterjet-kesim-dinamikleri-ve-asindirici-tuketimi-calculator-118",
  version: "1.0.0",
  category: "cost",
  inputSchema: SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        pressureBar,
        orificeDia,
        cdFactor,
        abrasiveRate,
        materialMachinability,
        thickness,
        abrasivePrice,
      } = input;

      // Formula: Water_Velocity_m_s = SQRT(2 * (pressure_bar * 100000) / 1000)
      const waterVelocityMS = Math.sqrt(2 * ((pressureBar * 100000) / 1000));

      // Formula: Orifice_Area_m2 = (PI / 4) * POWER(orifice_dia / 1000, 2)
      const orificeAreaM2 = (Math.PI / 4) * Math.pow(orificeDia / 1000, 2);

      // Formula: Water_Flow_L_min = cd_factor * Orifice_Area_m2 * Water_Velocity_m_s * 1000 * 60
      const waterFlowLMin = cdFactor * orificeAreaM2 * waterVelocityMS * 1000 * 60;

      // Formula: Abrasive_Water_Ratio = (abrasive_rate / 1000) / (Water_Flow_L_min)
      const abrasiveWaterRatio = (abrasiveRate / 1000) / waterFlowLMin;

      // Formula: Estimated_Cut_Speed_mm_min = (100 * POWER(pressure_bar, 1.25) * POWER(Water_Flow_L_min, 0.5)) / (thickness * material_machinability)
      const estimatedCutSpeedMmMin = (100 * Math.pow(pressureBar, 1.25) * Math.pow(waterFlowLMin, 0.5)) / (thickness * materialMachinability);

      // Formula: Abrasive_Cost_Per_Meter = ((abrasive_rate / 1000) / (Estimated_Cut_Speed_mm_min / 1000)) * abrasive_price
      const abrasiveCostPerMeter = ((abrasiveRate / 1000) / (estimatedCutSpeedMmMin / 1000)) * abrasivePrice;

      return {
        waterVelocityMS,
        orificeAreaM2,
        waterFlowLMin,
        abrasiveWaterRatio,
        estimatedCutSpeedMmMin,
        abrasiveCostPerMeter,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};