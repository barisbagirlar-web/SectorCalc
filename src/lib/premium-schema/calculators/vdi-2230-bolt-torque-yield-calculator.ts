import { Vdi2230CivataTorkVeAkmaYieldCalculator16InputSchema, type Vdi2230CivataTorkVeAkmaYieldCalculator16Input } from "./vdi-2230-civata-tork-ve-akma-yield-calculator-16-validation";

export const calculateVdi2230CivataTorkVeAkmaYieldCalculator16Contract: any = {
  id: "vdi-2230-civata-tork-ve-akma-yield-calculator-16",
  version: "1.0.0",
  category: "cost",
  inputSchema: Vdi2230CivataTorkVeAkmaYieldCalculator16InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract inputs
      const dNom = input.dNom;
      const pitch = input.pitch;
      const muT = input.muT;
      const muB = input.muB;
      const dW = input.dW;
      const yieldStrength = input.yieldStrength;
      const targetPreload = input.targetPreload;

      const PI = Math.PI;

      // Formula: d_2 = d_nom - (0.649519 * pitch)
      const d2 = dNom - (0.649519 * pitch);

      // Formula: d_3 = d_nom - (1.226869 * pitch)
      const d3 = dNom - (1.226869 * pitch);

      // Formula: A_t = (PI / 4) * ((d_2 + d_3) / 2)^2
      const aT = (PI / 4) * Math.pow((d2 + d3) / 2, 2);

      // Formula: F_M_max = (target_preload / 100) * yield_strength * A_t
      const fMMax = (targetPreload / 100) * yieldStrength * aT;

      // Formula: alpha_rad = (30 * PI) / 180 (30 degrees for standard ISO thread)
      const alphaRad = (30 * PI) / 180;

      // Formula: K_factor = 0.5 * ((pitch / (PI * d_nom)) + (mu_t / cos(alpha_rad)) * (d_2 / d_nom) + (mu_b * (d_w / d_nom)))
      const kFactor = 0.5 * (
        (pitch / (PI * dNom)) + 
        (muT / Math.cos(alphaRad)) * (d2 / dNom) + 
        (muB * (dW / dNom))
      );

      // Formula: Tightening_Torque = K_factor * d_nom * F_M_max / 1000 (convert to Nm)
      const tighteningTorque = (kFactor * dNom * fMMax) / 1000;

      // Formula: sigma_tensile = F_M_max / A_t
      const sigmaTensile = fMMax / aT;

      // Formula: tau_torsion = (Tightening_Torque * 1000 * (d_2 / 2)) / (0.196 * d_3^3)
      const tauTorsion = (tighteningTorque * 1000 * (d2 / 2)) / (0.196 * Math.pow(d3, 3));

      // Formula: sigma_vonMises = sqrt(sigma_tensile^2 + 3 * tau_torsion^2)
      const sigmaVonMises = Math.sqrt(Math.pow(sigmaTensile, 2) + 3 * Math.pow(tauTorsion, 2));

      // Formula: Utilization = (sigma_vonMises / yield_strength) * 100
      const utilization = (sigmaVonMises / yieldStrength) * 100;

      return {
        d2,
        d3,
        aT,
        fMMax,
        alphaRad,
        kFactor,
        tighteningTorque,
        sigmaTensile,
        tauTorsion,
        sigmaVonMises,
        utilization
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};