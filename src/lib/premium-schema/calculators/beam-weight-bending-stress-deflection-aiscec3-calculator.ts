import { KirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69InputSchema } from "./kiris-agirligi-egilme-gerilmesi-ve-sehim-aiscec3-calculator-69-validation";

export const calculateKirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69Contract: any = {
  id: "kiris-agirligi-egilme-gerilmesi-ve-sehim-aiscec3-calculator-69",
  version: "1.0.0",
  category: "cost",
  inputSchema: KirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        profileArea,       // cm2
        inertiaIx,         // cm4
        sectionModulus,    // cm3
        length,            // m
        yieldStrength,     // MPa
        distLoad,          // kN/m
        elasticModulus,    // GPa
        density            // kg/m3
      } = input;

      // Weight per meter (kg/m)
      const weightKgPerM = (profileArea / 10000) * density;

      // Total weight (kg)
      const totalWeightKg = weightKgPerM * length;

      // Total dead load (kN/m) - convert kg/m to kN/m using g=9.81 m/s2
      const totalDeadLoadKNM = (weightKgPerM * 9.81) / 1000;

      // Total load = distributed load + self-weight dead load
      const totalLoadW = distLoad + totalDeadLoadKNM;

      // Max bending moment for simply supported beam (kNm)
      const mMaxKNm = (totalLoadW * Math.pow(length, 2)) / 8;

      // Bending stress (MPa) - convert M_max from kNm to Nmm, section modulus from cm3 to mm3
      const bendingStressMPa = (mMaxKNm * 1000000) / (sectionModulus * 1000);

      // Safety factor
      const safetyFactor = yieldStrength / bendingStressMPa;

      // Deflection (mm) for simply supported beam under UDL
      // Formula: (5 * w * L^4) / (384 * E * I)
      // Units: w in N/mm, L in mm, E in MPa, I in mm4
      const lengthMM = length * 1000;
      const totalLoadNPerMM = (totalLoadW * 1000) / 1000; // kN/m -> N/mm (1 kN/m = 1 N/mm)
      const elasticModulusMPa = elasticModulus * 1000; // GPa -> MPa
      const inertiaMM4 = inertiaIx * 10000; // cm4 -> mm4
      const deflectionMaxMm = (5 * totalLoadNPerMM * Math.pow(lengthMM, 4)) / (384 * elasticModulusMPa * inertiaMM4);

      // Deflection limit (mm) = L/360
      const deflectionLimitMm = lengthMM / 360;

      return {
        weightKgPerM,
        totalWeightKg,
        totalDeadLoadKNM,
        totalLoadW,
        mMaxKNm,
        bendingStressMPa,
        safetyFactor,
        deflectionMaxMm,
        deflectionLimitMm
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};