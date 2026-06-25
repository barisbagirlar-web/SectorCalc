import { TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172InputSchema, type TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172Input } from "./tema-akis-kaynakli-esanjor-rezonans-ve-akiskan-elastigi-siniri-calculator-172-validation";

export const calculateTemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172Contract: any = {
  id: "tema-akis-kaynakli-esanjor-rezonans-ve-akiskan-elastigi-siniri-calculator-172",
  version: "1.0.0",
  category: "cost",
  inputSchema: TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        shellFluidVelocity,
        tubeOuterDia,
        tubeNaturalFreq,
        strouhalNumber,
        shellFluidDensity,
        fluidDampingRatio,
        connorsConstant,
        totalMassKgM
      } = input as TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172Input;

      // Convert tube outer diameter from mm to m
      const dM = tubeOuterDia / 1000;

      // Vortex shedding frequency
      const vortexSheddingFreqFv = (strouhalNumber * shellFluidVelocity) / dM;

      // Frequency ratio
      const frequencyRatio = tubeNaturalFreq !== 0 ? vortexSheddingFreqFv / tubeNaturalFreq : 0;

      // Mass damping parameter
      const massDampingParameter = (2 * Math.PI * fluidDampingRatio * totalMassKgM) / (shellFluidDensity * Math.pow(dM, 2));

      // Critical fluidelastic velocity
      const criticalFluidelasticVelocity = connorsConstant * tubeNaturalFreq * dM * Math.sqrt(massDampingParameter);

      // Fluidelastic instability ratio
      const fluidelasticInstabilityRatio = criticalFluidelasticVelocity !== 0 ? shellFluidVelocity / criticalFluidelasticVelocity : 0;

      return {
        dM: Math.round(dM * 1000000) / 1000000,
        vortexSheddingFreqFv: Math.round(vortexSheddingFreqFv * 1000000) / 1000000,
        frequencyRatio: Math.round(frequencyRatio * 1000000) / 1000000,
        massDampingParameter: Math.round(massDampingParameter * 1000000) / 1000000,
        criticalFluidelasticVelocity: Math.round(criticalFluidelasticVelocity * 1000000) / 1000000,
        fluidelasticInstabilityRatio: Math.round(fluidelasticInstabilityRatio * 1000000) / 1000000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};