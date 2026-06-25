import { TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171InputSchema, type TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171Input } from "./tema-isi-esanjoru-boru-demeti-dogal-frekans-analysis-calculator-171-validation";

export const calculateTemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171Contract: any = {
  id: "tema-isi-esanjoru-boru-demeti-dogal-frekans-analysis-calculator-171",
  version: "1.0.0",
  category: "cost",
  inputSchema: TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171InputSchema,
  
  execute: async (input: any) => {
    try {
      // Convert inputs to numbers
      const tubeOuterDia = Number(input.tubeOuterDia);
      const tubeWallThickness = Number(input.tubeWallThickness);
      const supportSpanLength = Number(input.supportSpanLength);
      const materialModulusE = Number(input.materialModulusE);
      const materialDensity = Number(input.materialDensity);
      const fluidInsideDensity = Number(input.fluidInsideDensity);
      const supportConditionFactor = Number(input.supportConditionFactor);

      // Validate inputs
      if (tubeOuterDia <= 0 || tubeWallThickness <= 0 || supportSpanLength <= 0 || 
          materialModulusE <= 0 || materialDensity <= 0 || fluidInsideDensity <= 0 || 
          supportConditionFactor <= 0) {
        throw new Error("All input values must be positive numbers");
      }

      if (tubeWallThickness * 2 >= tubeOuterDia) {
        throw new Error("Tube wall thickness must be less than half the outer diameter");
      }

      const PI = Math.PI;

      // Formula: D_outer_m = tube_outer_dia / 1000
      const dOuterM = tubeOuterDia / 1000;

      // Formula: D_inner_m = (tube_outer_dia - (2 * tube_wall_thickness)) / 1000
      const dInnerM = (tubeOuterDia - (2 * tubeWallThickness)) / 1000;

      // Formula: Tube_Inertia_I = (PI / 64) * (POWER(D_outer_m, 4) - POWER(D_inner_m, 4))
      const tubeInertiaI = (PI / 64) * (Math.pow(dOuterM, 4) - Math.pow(dInnerM, 4));

      // Formula: Mass_Tube_kg_m = (PI / 4) * (POWER(D_outer_m, 2) - POWER(D_inner_m, 2)) * material_density
      const massTubeKgM = (PI / 4) * (Math.pow(dOuterM, 2) - Math.pow(dInnerM, 2)) * materialDensity;

      // Formula: Mass_Fluid_kg_m = (PI / 4) * POWER(D_inner_m, 2) * fluid_inside_density
      const massFluidKgM = (PI / 4) * Math.pow(dInnerM, 2) * fluidInsideDensity;

      // Formula: Total_Mass_kg_m = Mass_Tube_kg_m + Mass_Fluid_kg_m
      const totalMassKgM = massTubeKgM + massFluidKgM;

      // Formula: L_m = support_span_length / 1000
      const lM = supportSpanLength / 1000;

      // Formula: Tube_Natural_Freq_Hz = support_condition_factor * SQRT(((material_modulus_E * 1e9) * Tube_Inertia_I) / (Total_Mass_kg_m * POWER(L_m, 4)))
      const tubeNaturalFreqHz = supportConditionFactor * Math.sqrt(
        ((materialModulusE * 1e9) * tubeInertiaI) / 
        (totalMassKgM * Math.pow(lM, 4))
      );

      return {
        dOuterM,
        dInnerM,
        tubeInertiaI,
        massTubeKgM,
        massFluidKgM,
        totalMassKgM,
        lM,
        tubeNaturalFreqHz
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};