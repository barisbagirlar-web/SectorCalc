import { Iso50001EnerjiReferansCizgisiEnbModeliCalculator121InputSchema, type Iso50001EnerjiReferansCizgisiEnbModeliCalculator121Input } from "./iso-50001-enerji-referans-cizgisi-enb-modeli-calculator-121-validation";

export const calculateIso50001EnerjiReferansCizgisiEnbModeliCalculator121Contract: any = {
  id: "iso-50001-enerji-referans-cizgisi-enb-modeli-calculator-121",
  version: "1.0.0",
  category: "cost",
  inputSchema: Iso50001EnerjiReferansCizgisiEnbModeliCalculator121InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        actualEnergy,
        modeledEnergy,
        reductionTarget,
        energyTariff
      } = input;

      // Validate inputs to prevent division by zero or invalid calculations
      if (modeledEnergy === 0) {
        throw new Error("Modeled energy cannot be zero");
      }

      if (reductionTarget < 0 || reductionTarget > 100) {
        throw new Error("Reduction target must be between 0 and 100");
      }

      // Formula: EnPI_Ratio = actual_energy / modeled_energy
      const enPIRatio = actualEnergy / modeledEnergy;

      // Formula: CUSUM_Residual = modeled_energy - actual_energy
      const cUSUMResidual = modeledEnergy - actualEnergy;

      // Formula: Financial_Savings = CUSUM_Residual * energy_tariff
      const financialSavings = cUSUMResidual * energyTariff;

      // Formula: Target_Consumption = modeled_energy * (1 - (reduction_target / 100))
      const targetConsumption = modeledEnergy * (1 - (reductionTarget / 100));

      // Formula: Target_Gap = actual_energy - Target_Consumption
      const targetGap = actualEnergy - targetConsumption;

      return {
        enPIRatio,
        cUSUMResidual,
        financialSavings,
        targetConsumption,
        targetGap
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};