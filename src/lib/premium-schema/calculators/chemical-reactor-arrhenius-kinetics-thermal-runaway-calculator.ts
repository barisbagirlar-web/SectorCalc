import { KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176InputSchema, type KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176Input } from "./kimyasal-reaktor-arrhenius-kinetigi-ve-termal-kacak-esigi-calculator-176-validation";

export const calculateKimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176Contract: any = {
  id: "kimyasal-reaktor-arrhenius-kinetigi-ve-termal-kacak-esigi-calculator-176",
  version: "1.0.0",
  category: "cost",
  inputSchema: KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        preExponentialA,
        activationEnergyEa,
        reactorTempC,
        reactionEnthalpyDh,
        reactantConcentration,
        jacketCoolingCapacityKw
      } = input;

      // Convert temperature from Celsius to Kelvin
      const tKelvin = reactorTempC + 273.15;

      // Universal gas constant in J/(mol·K)
      const gasConstantR = 8.314;

      // Arrhenius equation: k = A * exp(-Ea / (R * T))
      const reactionRateK = preExponentialA * Math.exp(-activationEnergyEa / (gasConstantR * tKelvin));

      // Heat generation rate in Watts: Q_gen = |ΔH| * k * C
      const heatGenerationRateW = Math.abs(reactionEnthalpyDh) * reactionRateK * reactantConcentration;

      // Convert heat generation to kilowatts
      const heatGenerationRateKW = heatGenerationRateW / 1000;

      // Semenov thermal runaway ratio: Ψ = Q_gen / Q_cooling
      const semenovThermalRunawayRatio = heatGenerationRateKW / jacketCoolingCapacityKw;

      return {
        tKelvin,
        gasConstantR,
        reactionRateK,
        heatGenerationRateW,
        heatGenerationRateKW,
        semenovThermalRunawayRatio
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};