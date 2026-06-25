import { CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160InputSchema, type CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160Input } from "./cnc-taslama-grinding-tegetsel-kuvvet-ve-spesifik-enerji-calculator-160-validation";

export const calculateCncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160Contract: any = {
  id: "cnc-taslama-grinding-tegetsel-kuvvet-ve-spesifik-enerji-calculator-160",
  version: "1.0.0",
  category: "cost",
  inputSchema: CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160InputSchema,
  
  execute: async (input: CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160Input) => {
    try {
      // Destructure input values
      const wheelSpeedMS = input.wheelSpeedMS;
      const workSpeedMMin = input.workSpeedMMin;
      const depthOfCutMm = input.depthOfCutMm;
      const widthOfGrindingMm = input.widthOfGrindingMm;
      const specificEnergyJMm3 = input.specificEnergyJMm3;
      const spindleKw = input.spindleKw;

      // Formula 1: Convert work speed from m/min to m/s
      const vwMS = workSpeedMMin / 60;

      // Formula 2: Material Removal Rate (MRR) in mm³/s
      // MRR = depth_of_cut (mm) * width_of_grinding (mm) * work_speed (m/min) * 1000 (mm/m) / 60 (s/min)
      const mRRMm3S = depthOfCutMm * widthOfGrindingMm * workSpeedMMin * 1000 / 60;

      // Formula 3: Power Required in Watts
      // Power = specific_energy (J/mm³) * MRR (mm³/s)
      const powerRequiredW = specificEnergyJMm3 * mRRMm3S;

      // Formula 4: Power Required in Kilowatts
      const powerRequiredKW = powerRequiredW / 1000;

      // Formula 5: Tangential Force in Newtons
      // Force (N) = Power (W) / Velocity (m/s)
      const tangentialForceN = powerRequiredW / wheelSpeedMS;

      // Formula 6: Force per unit width in N/mm
      const forcePerWidthNMm = tangentialForceN / widthOfGrindingMm;

      // Formula 7: Spindle Utilization Percentage
      // Utilization = (Power Required (kW) / Spindle Power (kW)) * 100
      const spindleUtilizationPct = (powerRequiredKW / spindleKw) * 100;

      return {
        vwMS,
        mRRMm3S,
        powerRequiredW,
        powerRequiredKW,
        tangentialForceN,
        forcePerWidthNMm,
        spindleUtilizationPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};