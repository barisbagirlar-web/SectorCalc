import { EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46InputSchema, type EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46Input } from "./endustriyel-su-ayak-izi-ve-sektor-kiyaslamasi-calculator-46-validation";

export const calculateEndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46Contract: any = {
  id: "endustriyel-su-ayak-izi-ve-sektor-kiyaslamasi-calculator-46",
  version: "1.0.0",
  category: "cost",
  inputSchema: EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46InputSchema,
  
  execute: async (input: any) => {
    try {
      const blueWater = Number(input.blueWater) || 0;
      const greenWater = Number(input.greenWater) || 0;
      const greyWater = Number(input.greyWater) || 0;
      const prodVolume = Number(input.prodVolume) || 1;
      const sectorBenchmark = Number(input.sectorBenchmark) || 0;

      // Total Water Footprint
      const totalWaterFootprint = blueWater + greenWater + greyWater;

      // Unit Water Footprint
      const unitWaterFootprint = totalWaterFootprint / prodVolume;

      // Water source ratios (as percentages)
      const blueRatio = totalWaterFootprint > 0 ? (blueWater / totalWaterFootprint) * 100 : 0;
      const greenRatio = totalWaterFootprint > 0 ? (greenWater / totalWaterFootprint) * 100 : 0;
      const greyRatio = totalWaterFootprint > 0 ? (greyWater / totalWaterFootprint) * 100 : 0;

      // Benchmark gap (positive means above benchmark)
      const benchmarkGap = unitWaterFootprint - sectorBenchmark;

      // Improvement potential in m3 (only positive gap matters)
      const improvementPotentialM3 = Math.max(0, benchmarkGap) * prodVolume;

      return {
        totalWaterFootprint: Math.round(totalWaterFootprint * 100) / 100,
        unitWaterFootprint: Math.round(unitWaterFootprint * 100) / 100,
        blueRatio: Math.round(blueRatio * 100) / 100,
        greenRatio: Math.round(greenRatio * 100) / 100,
        greyRatio: Math.round(greyRatio * 100) / 100,
        benchmarkGap: Math.round(benchmarkGap * 100) / 100,
        improvementPotentialM3: Math.round(improvementPotentialM3 * 100) / 100,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};