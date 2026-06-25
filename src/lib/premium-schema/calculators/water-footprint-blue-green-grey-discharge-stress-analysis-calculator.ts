import { SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95InputSchema, type SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95Input } from "./su-ayak-izi-bluegreengrey-desarj-ve-stres-analysis-calculator-95-validation";

export const calculateSuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95Contract: any = {
  id: "su-ayak-izi-bluegreengrey-desarj-ve-stres-analysis-calculator-95",
  version: "1.0.0",
  category: "cost",
  inputSchema: SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95InputSchema,
  
  execute: async (input: any) => {
    try {
      const validatedInput = input as SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95Input;
      
      const blueW = validatedInput.blueW;
      const greenW = validatedInput.greenW;
      const greyW = validatedInput.greyW;
      const prodVol = validatedInput.prodVol;
      const benchmark = validatedInput.benchmark;

      // Formula: Total_Water_Footprint = blue_w + green_w + grey_w
      const totalWaterFootprint = blueW + greenW + greyW;

      // Formula: Unit_Water_Footprint = Total_Water_Footprint / prod_vol
      const unitWaterFootprint = prodVol > 0 ? totalWaterFootprint / prodVol : 0;

      // Formula: Blue_Ratio = (blue_w / Total_Water_Footprint) * 100
      const blueRatio = totalWaterFootprint > 0 ? (blueW / totalWaterFootprint) * 100 : 0;

      // Formula: Grey_Ratio = (grey_w / Total_Water_Footprint) * 100
      const greyRatio = totalWaterFootprint > 0 ? (greyW / totalWaterFootprint) * 100 : 0;

      // Formula: Benchmark_Gap = Unit_Water_Footprint - benchmark
      const benchmarkGap = unitWaterFootprint - benchmark;

      return {
        totalWaterFootprint: Math.round(totalWaterFootprint * 100) / 100,
        unitWaterFootprint: Math.round(unitWaterFootprint * 100) / 100,
        blueRatio: Math.round(blueRatio * 100) / 100,
        greyRatio: Math.round(greyRatio * 100) / 100,
        benchmarkGap: Math.round(benchmarkGap * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};