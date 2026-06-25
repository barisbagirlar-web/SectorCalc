import { Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144InputSchema, type Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144Input } from "./iec-60364-uc-faz-kablo-kesit-ve-gerilim-dusumu-voltage-drop-calculator-144-validation";

export const calculateIec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144Contract: any = {
  id: "iec-60364-uc-faz-kablo-kesit-ve-gerilim-dusumu-voltage-drop-calculator-144",
  version: "1.0.0",
  category: "cost",
  inputSchema: Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144InputSchema,
  
  execute: async (input: any) => {
    try {
      const loadKw = input.loadKw;
      const voltage = input.voltage;
      const powerFactor = input.powerFactor;
      const cableLength = input.cableLength;
      const crossSection = input.crossSection;
      const cableMaterial = input.cableMaterial;

      // Load Current I = (load_kw * 1000) / (SQRT(3) * voltage * power_factor)
      const sqrt3 = Math.sqrt(3);
      const loadCurrentI = (loadKw * 1000) / (sqrt3 * voltage * powerFactor);

      // Resistivity rho = IF(cable_material == 'Bakır (Cu)', 0.0175, 0.0283)
      const resistivityRho = cableMaterial === 'Bakır (Cu)' ? 0.0175 : 0.0283;

      // Resistance R = (rho * cable_length) / cross_section
      const resistanceR = (resistivityRho * cableLength) / crossSection;

      // Reactance X = 0.00008 * cable_length
      const reactanceX = 0.00008 * cableLength;

      // Sin Phi = SQRT(1 - POWER(power_factor, 2))
      const sinPhi = Math.sqrt(1 - Math.pow(powerFactor, 2));

      // Voltage Drop V = SQRT(3) * Load_Current_I * (Resistance_R * power_factor + Reactance_X * Sin_Phi)
      const voltageDropV = sqrt3 * loadCurrentI * (resistanceR * powerFactor + reactanceX * sinPhi);

      // Voltage Drop Pct = (Voltage_Drop_V / voltage) * 100
      const voltageDropPct = (voltageDropV / voltage) * 100;

      // Actual Voltage At Load = voltage - Voltage_Drop_V
      const actualVoltageAtLoad = voltage - voltageDropV;

      // Power Loss Cable W = 3 * POWER(Load_Current_I, 2) * Resistance_R
      const powerLossCableW = 3 * Math.pow(loadCurrentI, 2) * resistanceR;

      return {
        loadCurrentI,
        resistivityRho,
        resistanceR,
        reactanceX,
        sinPhi,
        voltageDropV,
        voltageDropPct,
        actualVoltageAtLoad,
        powerLossCableW
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};