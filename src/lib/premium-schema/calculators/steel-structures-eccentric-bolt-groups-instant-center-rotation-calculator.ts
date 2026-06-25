import { CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164InputSchema, type CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164Input } from "./celik-yapilarda-eksantrik-yuklu-civata-gruplari-anlik-donme-merkezi-icr-calculator-164-validation";

export const calculateCelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164Contract: any = {
  id: "celik-yapilarda-eksantrik-yuklu-civata-gruplari-anlik-donme-merkezi-icr-calculator-164",
  version: "1.0.0",
  category: "cost",
  inputSchema: CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract input values
      const boltCount = Number(input.boltCount);
      const eccentricityMm = Number(input.eccentricityMm);
      const boltShearCapacityKn = Number(input.boltShearCapacityKn);
      const appliedLoadKn = Number(input.appliedLoadKn);
      const rSquaredSumMm2 = Number(input.rSquaredSumMm2);
      const maxDistanceRMm = Number(input.maxDistanceRMm);

      // Validate inputs to prevent division by zero or invalid calculations
      if (boltCount <= 0 || rSquaredSumMm2 <= 0) {
        throw new Error("Bolt count and sum of squared distances must be greater than zero");
      }

      if (boltShearCapacityKn <= 0) {
        throw new Error("Bolt shear capacity must be greater than zero");
      }

      // Formula: Direct_Shear_Per_Bolt = applied_load_kn / bolt_count
      const directShearPerBolt = appliedLoadKn / boltCount;

      // Formula: Torsional_Shear_Max = (applied_load_kn * eccentricity_mm * max_distance_r_mm) / r_squared_sum_mm2
      const torsionalShearMax = (appliedLoadKn * eccentricityMm * maxDistanceRMm) / rSquaredSumMm2;

      // Formula: Elastic_Combined_Force_kN = SQRT(POWER(Direct_Shear_Per_Bolt, 2) + POWER(Torsional_Shear_Max, 2))
      const elasticCombinedForceKN = Math.sqrt(
        Math.pow(directShearPerBolt, 2) + Math.pow(torsionalShearMax, 2)
      );

      // Formula: Group_Ultimate_Capacity_ICR_kN = bolt_count * bolt_shear_capacity_kn * 0.85
      // 0.85 is a typical reduction factor for eccentric loading (ICR method)
      const groupUltimateCapacityICRKN = boltCount * boltShearCapacityKn * 0.85;

      // Formula: Safety_Factor_Elastic = bolt_shear_capacity_kn / Elastic_Combined_Force_kN
      const safetyFactorElastic = elasticCombinedForceKN > 0 
        ? boltShearCapacityKn / elasticCombinedForceKN 
        : 0;

      return {
        directShearPerBolt: Math.round(directShearPerBolt * 100) / 100,
        torsionalShearMax: Math.round(torsionalShearMax * 100) / 100,
        elasticCombinedForceKN: Math.round(elasticCombinedForceKN * 100) / 100,
        groupUltimateCapacityICRKN: Math.round(groupUltimateCapacityICRKN * 100) / 100,
        safetyFactorElastic: Math.round(safetyFactorElastic * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};