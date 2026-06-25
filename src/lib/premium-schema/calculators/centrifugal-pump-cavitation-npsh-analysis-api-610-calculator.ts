import { SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117InputSchema, type SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117Input } from "./santrifuj-pompa-kavitasyon-ve-npsh-analysis-api-610-calculator-117-validation";

export const calculateSantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117Contract: any = {
  id: "santrifuj-pompa-kavitasyon-ve-npsh-analysis-api-610-calculator-117",
  version: "1.0.0",
  category: "cost",
  inputSchema: SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        atmPressure,
        vaporPressure,
        density,
        suctionHead,
        frictionLoss,
        npshR
      } = input as SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117Input;

      // Gravitational acceleration constant (m/s²)
      const G = 9.81;
      // Conversion factor from bar to Pascal (1 bar = 100,000 Pa)
      const BAR_TO_PA = 100000;

      // Head_Atm = (Atmospheric Pressure in Pa) / (Density * g)
      const headAtm = (atmPressure * BAR_TO_PA) / (density * G);

      // Head_Vapor = (Vapor Pressure in Pa) / (Density * g)
      const headVapor = (vaporPressure * BAR_TO_PA) / (density * G);

      // NPSH_Available = Head_Atm - Head_Vapor + suctionHead - frictionLoss
      const nPSHAvailable = headAtm - headVapor + suctionHead - frictionLoss;

      // NPSH_Margin = NPSH_Available - NPSHr
      const nPSHMargin = nPSHAvailable - npshR;

      // NPSH_Ratio = NPSH_Available / NPSHr
      const nPSHRatio = npshR !== 0 ? nPSHAvailable / npshR : 0;

      return {
        headAtm,
        headVapor,
        nPSHAvailable,
        nPSHMargin,
        nPSHRatio
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};