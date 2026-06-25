import { KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140InputSchema, type KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140Input } from "./kaynak-soguma-duration-t85-ve-martenzit-kirilganlik-siniri-calculator-140-validation";

export const calculateKaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140Contract: any = {
  id: "kaynak-soguma-duration-t85-ve-martenzit-kirilganlik-siniri-calculator-140",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140InputSchema,
  
  execute: async (input: any) => {
    try {
      const heatInput = input.heatInput;
      const thickness = input.thickness;
      const preheatTemp = input.preheatTemp;
      const jointFactor = input.jointFactor;
      const criticalT85Min = input.criticalT85Min;

      const PI = Math.PI;
      const LAMBDA = 0.04; // Thermal conductivity (W/mm°C)
      const RHO_CP = 0.000012; // Volumetric heat capacity (kJ/mm³°C)
      const T_MS = 500; // Martensite start temperature (°C)
      const T_MF = 800; // Martensite finish temperature (°C)

      // Transition thickness calculation (d_trans)
      const heatInputPerUnit = (heatInput * 1000) / 2;
      const tempDiff1 = 1 / (T_MS - preheatTemp);
      const tempDiff2 = 1 / (T_MF - preheatTemp);
      const dTrans = Math.sqrt(heatInputPerUnit * (tempDiff1 + tempDiff2));

      // Determine cooling type (3D or 2D)
      const is3DCooling = thickness > dTrans;

      // t85 3D calculation (for thick plates)
      const t853D = (heatInput * 1000 * jointFactor / (2 * PI * LAMBDA)) * (1 / (T_MS - preheatTemp) - 1 / (T_MF - preheatTemp));

      // t85 2D calculation (for thin plates)
      const numerator = Math.pow(heatInput * 1000 * jointFactor, 2);
      const denominator = 4 * PI * LAMBDA * RHO_CP * Math.pow(thickness, 2);
      const tempDiffSquared = 1 / Math.pow(T_MS - preheatTemp, 2) - 1 / Math.pow(T_MF - preheatTemp, 2);
      const t852D = (numerator / denominator) * tempDiffSquared;

      // Actual cooling time based on cooling type
      const actualT85 = is3DCooling ? t853D : t852D;

      // Return results
      return {
        transitionThicknessDTrans: Math.round(dTrans * 100) / 100,
        coolingType: is3DCooling ? 1 : 0, // 1 for 3D, 0 for 2D
        t853D: Math.round(t853D * 100) / 100,
        t852D: Math.round(t852D * 100) / 100,
        actualT85: Math.round(actualT85 * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};