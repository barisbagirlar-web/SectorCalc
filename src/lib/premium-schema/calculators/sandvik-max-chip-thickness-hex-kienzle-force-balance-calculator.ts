import { SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189InputSchema, type SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189Input } from "./sandvik-uyumlu-maksimum-talas-kalinligi-hex-ve-kienzle-kuvvet-dengesi-calculator-189-validation";

export const calculateSandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189Contract: any = {
  id: "sandvik-uyumlu-maksimum-talas-kalinligi-hex-ve-kienzle-kuvvet-dengesi-calculator-189",
  version: "1.0.0",
  category: "cost",
  inputSchema: SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse input values
      const toolDiameterDc = Number(input.toolDiameterDc);
      const radialCutAe = Number(input.radialCutAe);
      const feedPerToothFz = Number(input.feedPerToothFz);
      const kc11BaseForce = Number(input.kc11BaseForce);
      const mcChipExponent = Number(input.mcChipExponent);
      const axialCutAp = Number(input.axialCutAp);
      const spindleRpm = Number(input.spindleRpm);
      const flutesZ = Number(input.flutesZ);

      // Validate inputs to avoid division by zero or negative values
      if (toolDiameterDc <= 0 || radialCutAe <= 0 || feedPerToothFz <= 0 || kc11BaseForce <= 0 || axialCutAp <= 0 || spindleRpm <= 0 || flutesZ <= 0) {
        throw new Error("All input values must be positive numbers greater than zero.");
      }

      // Formula: Engagement_Ratio = radial_cut_ae / tool_diameter_dc
      const engagementRatio = radialCutAe / toolDiameterDc;

      // Formula: Max_Chip_Thickness_hex = fz_per_tooth * SQRT(radial_cut_ae / tool_diameter_dc)
      const maxChipThicknessHex = feedPerToothFz * Math.sqrt(radialCutAe / toolDiameterDc);

      // Formula: Kienzle_Kc = kc11_base_force / POWER(Max_Chip_Thickness_hex, mc_chip_exponent)
      const kienzleKc = kc11BaseForce / Math.pow(maxChipThicknessHex, mcChipExponent);

      // Formula: Tangential_Force_Fc_N = Kienzle_Kc * axial_cut_ap * feed_per_tooth_fz
      const tangentialForceFcN = kienzleKc * axialCutAp * feedPerToothFz;

      // Formula: Torque_Mc_Nm = (Tangential_Force_Fc_N * tool_diameter_dc) / 2000
      const torqueMcNm = (tangentialForceFcN * toolDiameterDc) / 2000;

      // Formula: Power_Pc_kW = (Tangential_Force_Fc_N * (PI * tool_diameter_dc * spindle_rpm / 60000)) / 1000
      const cuttingSpeed = (Math.PI * toolDiameterDc * spindleRpm) / 60000; // m/s
      const powerPcKW = (tangentialForceFcN * cuttingSpeed) / 1000;

      // Formula: Table_Feed_Vf = feed_per_tooth_fz * flutes_z * spindle_rpm
      const tableFeedVf = feedPerToothFz * flutesZ * spindleRpm;

      return {
        engagementRatio: Math.round(engagementRatio * 10000) / 10000,
        maxChipThicknessHex: Math.round(maxChipThicknessHex * 10000) / 10000,
        kienzleKc: Math.round(kienzleKc * 100) / 100,
        tangentialForceFcN: Math.round(tangentialForceFcN * 100) / 100,
        torqueMcNm: Math.round(torqueMcNm * 100) / 100,
        powerPcKW: Math.round(powerPcKW * 100) / 100,
        tableFeedVf: Math.round(tableFeedVf * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};