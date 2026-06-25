import { EndustriyelCatiYapisalYukVeCostCalculator23InputSchema, type EndustriyelCatiYapisalYukVeCostCalculator23Input } from "./endustriyel-cati-yapisal-yuk-ve-cost-calculator-23-validation";

export const calculateEndustriyelCatiYapisalYukVeCostCalculator23Contract: any = {
  id: "endustriyel-cati-yapisal-yuk-ve-cost-calculator-23",
  version: "1.0.0",
  category: "cost",
  inputSchema: EndustriyelCatiYapisalYukVeCostCalculator23InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        bldgLength,
        bldgWidth,
        roofPitchDeg,
        overhang,
        groundSnowLoad,
        exposureFactor,
        thermalFactor,
        materialCostM2,
        wastePct
      } = input as EndustriyelCatiYapisalYukVeCostCalculator23Input;

      // Formula: Pitch_Rad = (roof_pitch_deg * PI) / 180
      const pitchRad = (roofPitchDeg * Math.PI) / 180;

      // Formula: Slant_Width = (bldg_width / 2) / COS(Pitch_Rad)
      const slantWidth = (bldgWidth / 2) / Math.cos(pitchRad);

      // Formula: Gable_Area = 2 * Slant_Width * bldg_length
      const gableArea = 2 * slantWidth * bldgLength;

      // Formula: Perimeter = (2 * bldg_length) + (2 * bldg_width)
      const perimeter = (2 * bldgLength) + (2 * bldgWidth);

      // Formula: Overhang_Area = Perimeter * overhang
      const overhangArea = perimeter * overhang;

      // Formula: Total_Roof_Area = Gable_Area + Overhang_Area
      const totalRoofArea = gableArea + overhangArea;

      // Formula: Material_Area = Total_Roof_Area * (1 + (waste_pct / 100))
      const materialArea = totalRoofArea * (1 + (wastePct / 100));

      // Formula: Total_Material_Cost = Material_Area * material_cost_m2
      const totalMaterialCost = materialArea * materialCostM2;

      // Formula: Roof_Snow_Load = ground_snow_load * exposure_factor * thermal_factor
      const roofSnowLoad = groundSnowLoad * exposureFactor * thermalFactor;

      // Formula: Total_Snow_Weight_kN = (bldg_length * bldg_width) * Roof_Snow_Load
      const totalSnowWeightKN = (bldgLength * bldgWidth) * roofSnowLoad;

      return {
        pitchRad,
        slantWidth,
        gableArea,
        perimeter,
        overhangArea,
        totalRoofArea,
        materialArea,
        totalMaterialCost,
        roofSnowLoad,
        totalSnowWeightKN
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};