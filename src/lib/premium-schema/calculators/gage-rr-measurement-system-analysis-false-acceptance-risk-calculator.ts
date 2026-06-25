import { GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86InputSchema, type GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86Input } from "./gage-rr-olcum-sistemi-analysis-ve-yanlis-kabul-riski-calculator-86-validation";

export const calculateGageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86Contract: any = {
  id: "gage-rr-olcum-sistemi-analysis-ve-yanlis-kabul-riski-calculator-86",
  version: "1.0.0",
  category: "cost",
  inputSchema: GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        evEquipmentVariation,
        avAppraiserVariation,
        pvPartVariation,
        toleranceBand
      } = input;

      // GRR Total = sqrt(EV^2 + AV^2)
      const gRRTotal = Math.sqrt(
        Math.pow(Number(evEquipmentVariation), 2) + 
        Math.pow(Number(avAppraiserVariation), 2)
      );

      // TV Total Variation = sqrt(GRR^2 + PV^2)
      const tVTotalVariation = Math.sqrt(
        Math.pow(gRRTotal, 2) + 
        Math.pow(Number(pvPartVariation), 2)
      );

      // Pct GRR to TV = (GRR / TV) * 100
      const pctGRRToTV = tVTotalVariation > 0 
        ? (gRRTotal / tVTotalVariation) * 100 
        : 0;

      // Pct GRR to Tolerance = (6 * GRR / tolerance) * 100
      const pctGRRToTolerance = Number(toleranceBand) > 0 
        ? ((6 * gRRTotal) / Number(toleranceBand)) * 100 
        : 0;

      // NDC Number Distinct Categories = floor(1.41 * (PV / GRR))
      const nDCNumberDistinctCategories = gRRTotal > 0 
        ? Math.floor(1.41 * (Number(pvPartVariation) / gRRTotal)) 
        : 0;

      return {
        gRRTotal: Math.round(gRRTotal * 100) / 100,
        tVTotalVariation: Math.round(tVTotalVariation * 100) / 100,
        pctGRRToTV: Math.round(pctGRRToTV * 100) / 100,
        pctGRRToTolerance: Math.round(pctGRRToTolerance * 100) / 100,
        nDCNumberDistinctCategories: Math.max(0, nDCNumberDistinctCategories)
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};