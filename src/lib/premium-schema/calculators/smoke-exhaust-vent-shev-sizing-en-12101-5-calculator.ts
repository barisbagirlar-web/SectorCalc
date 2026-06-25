import { DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47InputSchema, type DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47Input } from "./duman-tahliye-kapagi-shev-boyutlandirma-en-121015-calculator-47-validation";

export const calculateDumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47Contract: any = {
  id: "duman-tahliye-kapagi-shev-boyutlandirma-en-121015-calculator-47",
  version: "1.0.0",
  category: "cost",
  inputSchema: DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        roofArea,
        ceilingHeight,
        smokeDepth,
        fireArea,
        inletArea,
        cvFactor,
        tAmbient
      } = input;

      // Formula: P_fire_perimeter = 4 * SQRT(fire_area)
      const pFirePerimeter = 4 * Math.sqrt(fireArea);

      // Formula: Q_mass = 0.188 * P_fire_perimeter * POWER(ceiling_height - smoke_depth, 1.5)
      const clearHeight = ceilingHeight - smokeDepth;
      const qMass = 0.188 * pFirePerimeter * Math.pow(clearHeight, 1.5);

      // Formula: Q_heat_release = 250 * fire_area
      const qHeatRelease = 250 * fireArea;

      // Formula: T_smoke = t_ambient + (Q_heat_release / (Q_mass * 1.005))
      const tSmoke = tAmbient + (qHeatRelease / (qMass * 1.005));

      // Formula: Av_Required = Q_mass / (cv_factor * SQRT(2 * 9.81 * smoke_depth * (T_smoke - t_ambient) / t_ambient))
      const densityRatio = (tSmoke - tAmbient) / tAmbient;
      const avRequired = qMass / (cvFactor * Math.sqrt(2 * 9.81 * smokeDepth * densityRatio));

      // Formula: Aa_Effective = Av_Required
      const aaEffective = avRequired;

      // Formula: Roof_Ratio_Pct = (Aa_Effective / roof_area) * 100
      const roofRatioPct = (aaEffective / roofArea) * 100;

      // Formula: Min_Hatch_Count = CEILING(Aa_Effective / 2.25)
      const minHatchCount = Math.ceil(aaEffective / 2.25);

      return {
        pFirePerimeter: Math.round(pFirePerimeter * 100) / 100,
        qMass: Math.round(qMass * 100) / 100,
        qHeatRelease: Math.round(qHeatRelease * 100) / 100,
        tSmoke: Math.round(tSmoke * 100) / 100,
        avRequired: Math.round(avRequired * 100) / 100,
        aaEffective: Math.round(aaEffective * 100) / 100,
        roofRatioPct: Math.round(roofRatioPct * 100) / 100,
        minHatchCount: minHatchCount
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};