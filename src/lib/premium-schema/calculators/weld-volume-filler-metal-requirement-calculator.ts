import { KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65InputSchema, type KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65Input } from "./kaynak-hacmi-ve-dolgu-malzemesi-ihtiyaci-calculator-65-validation";

export const calculateKaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65Contract: any = {
  id: "kaynak-hacmi-ve-dolgu-malzemesi-ihtiyaci-calculator-65",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65InputSchema,
  
  execute: async (input: KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65Input) => {
    try {
      const {
        weldType,
        rootGap,
        grooveAngle,
        weldLength,
        reinforcement,
        density,
        depEfficiency
      } = input;

      // Convert degrees to radians
      const radAngle = (grooveAngle * Math.PI) / 180;

      // Calculate area for fillet weld (Köşe Kaynağı)
      const legSize = weldType; // weldType is used as leg size in mm
      const areaFillet = (Math.pow(legSize, 2) / 2) + (legSize * reinforcement);

      // Calculate area for V-groove weld (Alın Kaynağı)
      const areaVGroove = (rootGap * legSize) + (Math.pow(legSize, 2) * Math.tan(radAngle / 2)) + (legSize * reinforcement);

      // Determine cross section area based on weld type
      // Assuming weldType: 1 = Fillet (Köşe), 2 = V-Groove (Alın)
      const crossSectionArea = weldType === 1 ? areaFillet : areaVGroove;

      // Convert weld length from meters to mm for volume calculation
      // Cross section area in mm², weld length in meters (convert to mm)
      const weldLengthMm = weldLength * 1000;
      // Volume in mm³, convert to cm³ (1 cm³ = 1000 mm³)
      const volumeCm3 = (crossSectionArea * weldLengthMm) / 1000;

      // Calculate deposited weight in kg
      // density in kg/m³, volume in cm³
      // 1 m³ = 1,000,000 cm³
      const weightDepositedKg = (volumeCm3 * density) / 1000000;

      // Calculate required filler metal considering deposition efficiency
      const requiredFillerKg = weightDepositedKg / (depEfficiency / 100);

      return {
        radAngle,
        areaFillet,
        areaVGroove,
        crossSectionArea,
        volumeCm3,
        weightDepositedKg,
        requiredFillerKg
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};