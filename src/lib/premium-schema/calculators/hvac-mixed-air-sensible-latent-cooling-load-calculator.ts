import { HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148InputSchema, type HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148Input } from "./hvac-karisim-havasi-duyulur-ve-gizli-latent-sogutma-yuku-calculator-148-validation";

export const calculateHvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148Contract: any = {
  id: "hvac-karisim-havasi-duyulur-ve-gizli-latent-sogutma-yuku-calculator-148",
  version: "1.0.0",
  category: "cost",
  inputSchema: HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        outdoorFlowCfm,
        outdoorTDb,
        outdoorW,
        returnFlowCfm,
        returnTDb,
        returnW,
        supplyTDb,
        supplyW,
      } = input as HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148Input;

      // Validate inputs to prevent division by zero
      if (outdoorFlowCfm <= 0 || returnFlowCfm <= 0) {
        throw new Error("Flow rates must be greater than zero.");
      }

      // Calculate total flow
      const totalFlowCFM = outdoorFlowCfm + returnFlowCfm;

      // Calculate mixed air conditions (weighted average by flow)
      const mixTDb = ((outdoorFlowCfm * outdoorTDb) + (returnFlowCfm * returnTDb)) / totalFlowCFM;
      const mixWGrains = ((outdoorFlowCfm * outdoorW) + (returnFlowCfm * returnW)) / totalFlowCFM;

      // Calculate temperature difference for sensible cooling
      // Note: If supply temperature is higher than mix, this could be negative (heating)
      // For cooling calculations, we assume supplyTDb < mixTDb
      const tempDifference = mixTDb - supplyTDb;
      
      // Calculate moisture difference for latent cooling
      // For dehumidification, supplyW should be less than mixWGrains
      const moistureDifference = mixWGrains - supplyW;

      // Sensible cooling: 1.08 * CFM * ΔT (BTUh)
      // 1.08 accounts for air density and specific heat in HVAC units
      const sensibleCoolingBTUh = 1.08 * totalFlowCFM * tempDifference;

      // Latent cooling: 0.68 * CFM * ΔW (BTUh) where W is in grains/lb
      // 0.68 converts grains/lb to BTUh per CFM
      const latentCoolingBTUh = 0.68 * totalFlowCFM * moistureDifference;

      // Total cooling load
      const totalCoolingLoadBTUh = sensibleCoolingBTUh + latentCoolingBTUh;

      // Convert to tons (1 ton = 12,000 BTU/h)
      const totalCoolingTons = totalCoolingLoadBTUh / 12000;

      // Sensible heat ratio
      const sensibleHeatRatioSHR = totalCoolingLoadBTUh !== 0 
        ? sensibleCoolingBTUh / totalCoolingLoadBTUh 
        : 0;

      return {
        totalFlowCFM: Math.round(totalFlowCFM * 100) / 100,
        mixTDb: Math.round(mixTDb * 100) / 100,
        mixWGrains: Math.round(mixWGrains * 100) / 100,
        sensibleCoolingBTUh: Math.round(sensibleCoolingBTUh * 100) / 100,
        latentCoolingBTUh: Math.round(latentCoolingBTUh * 100) / 100,
        totalCoolingLoadBTUh: Math.round(totalCoolingLoadBTUh * 100) / 100,
        totalCoolingTons: Math.round(totalCoolingTons * 100) / 100,
        sensibleHeatRatioSHR: Math.round(sensibleHeatRatioSHR * 1000) / 1000,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};