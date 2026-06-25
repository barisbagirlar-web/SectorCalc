import { DisliVeKayiskasnakGucAktarimDinamikleriCalculator60InputSchema, type DisliVeKayiskasnakGucAktarimDinamikleriCalculator60Input } from "./disli-ve-kayiskasnak-guc-aktarim-dinamikleri-calculator-60-validation";

export const calculateDisliVeKayiskasnakGucAktarimDinamikleriCalculator60Contract: any = {
  id: "disli-ve-kayiskasnak-guc-aktarim-dinamikleri-calculator-60",
  version: "1.0.0",
  category: "cost",
  inputSchema: DisliVeKayiskasnakGucAktarimDinamikleriCalculator60InputSchema,
  
  execute: async (input: any) => {
    try {
      const powerKw = input.powerKw;
      const rpmDrive = input.rpmDrive;
      const moduleMm = input.moduleMm;
      const teethDrive = input.teethDrive;
      const faceWidth = input.faceWidth;
      const lewisY = input.lewisY;
      const allowableStress = input.allowableStress;
      const frictionMu = input.frictionMu;
      const wrapAngleDeg = input.wrapAngleDeg;

      // PCD (Pitch Circle Diameter) in mm
      const pCDMm = moduleMm * teethDrive;

      // Pitch Velocity in m/s
      const pitchVelocityMS = (Math.PI * pCDMm * rpmDrive) / 60000;

      // Transmitted Load in N
      const transmittedLoadN = (powerKw * 1000) / pitchVelocityMS;

      // Dynamic Factor (Kv) using Barth equation for moderate quality gears
      const kvDynamic = 6 / (6 + pitchVelocityMS);

      // Bending Stress in MPa using Lewis equation with dynamic factor
      const bendingStressMPa = transmittedLoadN / (faceWidth * moduleMm * lewisY * kvDynamic);

      // Safety Factor for Gear
      const safetyFactorGear = allowableStress / bendingStressMPa;

      // Wrap angle in radians
      const wrapRad = (wrapAngleDeg * Math.PI) / 180;

      // Belt tension ratio using Euler's belt friction equation
      const beltTensionRatio = Math.exp(frictionMu * wrapRad);

      // Belt tensions (tight side and slack side)
      const beltTensionRatioMinusOne = beltTensionRatio - 1;
      const tensionTightN = beltTensionRatioMinusOne !== 0 
        ? transmittedLoadN * (beltTensionRatio / beltTensionRatioMinusOne) 
        : 0;
      const tensionSlackN = beltTensionRatioMinusOne !== 0 
        ? transmittedLoadN / beltTensionRatioMinusOne 
        : 0;

      return {
        pCDMm: Math.round(pCDMm * 100) / 100,
        pitchVelocityMS: Math.round(pitchVelocityMS * 100) / 100,
        transmittedLoadN: Math.round(transmittedLoadN * 100) / 100,
        kvDynamic: Math.round(kvDynamic * 100) / 100,
        bendingStressMPa: Math.round(bendingStressMPa * 100) / 100,
        safetyFactorGear: Math.round(safetyFactorGear * 100) / 100,
        wrapRad: Math.round(wrapRad * 100) / 100,
        beltTensionRatio: Math.round(beltTensionRatio * 100) / 100,
        tensionTightN: Math.round(tensionTightN * 100) / 100,
        tensionSlackN: Math.round(tensionSlackN * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};