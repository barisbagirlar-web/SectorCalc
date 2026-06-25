import { KaliteMaliyetiCoqPafModelAnalysisCalculator64InputSchema, type KaliteMaliyetiCoqPafModelAnalysisCalculator64Input } from "./kalite-maliyeti-coq-paf-model-analysis-calculator-64-validation";

export const calculateKaliteMaliyetiCoqPafModelAnalysisCalculator64Contract: any = {
  id: "kalite-maliyeti-coq-paf-model-analysis-calculator-64",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaliteMaliyetiCoqPafModelAnalysisCalculator64InputSchema,
  
  execute: async (input: any) => {
    try {
      const { preventionCost, appraisalCost, internalFailure, externalFailure, totalSales } = input;

      // Total Cost of Quality (COQ)
      const totalCOQ = preventionCost + appraisalCost + internalFailure + externalFailure;

      // COQ to Sales Percentage
      const cOQToSalesPct = totalSales > 0 ? (totalCOQ / totalSales) * 100 : 0;

      // Ratio calculations (as percentages of total COQ)
      const preventionRatio = totalCOQ > 0 ? (preventionCost / totalCOQ) * 100 : 0;
      const appraisalRatio = totalCOQ > 0 ? (appraisalCost / totalCOQ) * 100 : 0;
      const internalFailRatio = totalCOQ > 0 ? (internalFailure / totalCOQ) * 100 : 0;
      const externalFailRatio = totalCOQ > 0 ? (externalFailure / totalCOQ) * 100 : 0;

      // Conformance and Non-Conformance costs
      const conformanceCost = preventionCost + appraisalCost;
      const nonConformanceCost = internalFailure + externalFailure;

      return {
        totalCOQ: Math.round(totalCOQ * 100) / 100,
        cOQToSalesPct: Math.round(cOQToSalesPct * 100) / 100,
        preventionRatio: Math.round(preventionRatio * 100) / 100,
        appraisalRatio: Math.round(appraisalRatio * 100) / 100,
        internalFailRatio: Math.round(internalFailRatio * 100) / 100,
        externalFailRatio: Math.round(externalFailRatio * 100) / 100,
        conformanceCost: Math.round(conformanceCost * 100) / 100,
        nonConformanceCost: Math.round(nonConformanceCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};