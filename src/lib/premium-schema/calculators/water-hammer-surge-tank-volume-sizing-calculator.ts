import { SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165InputSchema, type SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165Input } from "./su-kocu-sonumleme-tanki-surge-tank-hacim-boyutlandirma-calculator-165-validation";

export const calculateSuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165Contract: any = {
  id: "su-kocu-sonumleme-tanki-surge-tank-hacim-boyutlandirma-calculator-165",
  version: "1.0.0",
  category: "cost",
  inputSchema: SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165InputSchema,
  
  execute: async (input: any) => {
    try {
      const validatedInput = SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165InputSchema.parse(input);
      
      const { pipeLengthM, pipeDiaM, flowVelocityMS, waveCelerityMS, staticPressureM, maxAllowableHeadM } = validatedInput;
      
      const GRAVITY = 9.81;
      
      // Pipe cross-sectional area in m²
      const pipeArea = (Math.PI / 4) * Math.pow(pipeDiaM, 2);
      
      // Kinetic energy head in meters (velocity head)
      const kineticEnergyHead = Math.pow(flowVelocityMS, 2) / (2 * GRAVITY);
      
      // Maximum allowable surge head delta from static pressure
      const maxSurgeHeadDelta = maxAllowableHeadM - staticPressureM;
      
      // Joukowsky water hammer pressure rise (initial surge head)
      const joukowskyHeadRise = (waveCelerityMS * flowVelocityMS) / GRAVITY;
      
      // Required surge tank volume calculation using characteristic method
      // The volume is a function of the kinetic energy and the allowable pressure rise
      const requiredSurgeVolumeM3 = maxSurgeHeadDelta > 0 
        ? (2 * pipeArea * pipeLengthM * kineticEnergyHead) / maxSurgeHeadDelta
        : 0;
      
      return {
        pipeArea: Math.round(pipeArea * 10000) / 10000,
        kineticEnergyHead: Math.round(kineticEnergyHead * 100) / 100,
        maxSurgeHeadDelta: Math.round(maxSurgeHeadDelta * 100) / 100,
        requiredSurgeVolumeM3: Math.round(requiredSurgeVolumeM3 * 1000) / 1000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};