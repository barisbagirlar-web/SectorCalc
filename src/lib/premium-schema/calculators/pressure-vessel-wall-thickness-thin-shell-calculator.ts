import { BasincliKapEtKalinligiInceCidarTestliCalculator9InputSchema, type BasincliKapEtKalinligiInceCidarTestliCalculator9Input } from "./basincli-kap-et-kalinligi-ince-cidar-testli-calculator-9-validation";

export const calculateBasincliKapEtKalinligiInceCidarTestliCalculator9Contract: any = {
  id: "basincli-kap-et-kalinligi-ince-cidar-testli-calculator-9",
  version: "1.0.0",
  category: "cost",
  inputSchema: BasincliKapEtKalinligiInceCidarTestliCalculator9InputSchema,
  
  execute: async (input: any) => {
    try {
      const p = Number(input.p);
      const ri = Number(input.ri);
      const head = Number(input.head);
      const e = Number(input.e);
      const ca = Number(input.ca);

      const s = 138; // MPa - typical allowable stress for SA-516 Gr.70 at 300°F
      
      // Formula: t_shell = (p * ri) / ((s * e) - (0.6 * p)) + ca
      const tShell = (p * ri) / ((s * e) - (0.6 * p)) + ca;
      
      // Formula: t_sphere = (p * ri) / ((2 * s * e) - (0.2 * p)) + ca
      const tSphere = (p * ri) / ((2 * s * e) - (0.2 * p)) + ca;
      
      // Formula: t_ellip = (p * (ri * 2)) / ((2 * s * e) - (0.2 * p)) + ca
      const tEllip = (p * (ri * 2)) / ((2 * s * e) - (0.2 * p)) + ca;
      
      // Formula: t_selected = IF(head == 'Silindirik', t_shell, IF(head == 'Küresel', t_sphere, t_ellip))
      let tSelected: number;
      if (head === 1) {
        tSelected = tShell;
      } else if (head === 2) {
        tSelected = tSphere;
      } else {
        tSelected = tEllip;
      }
      
      // Formula: MAWP = (s * e * (t_selected - ca)) / (ri + (0.6 * (t_selected - ca)))
      const mAWP = (s * e * (tSelected - ca)) / (ri + (0.6 * (tSelected - ca)));
      
      // Formula: HydroTest = 1.3 * MAWP
      const hydroTest = 1.3 * mAWP;

      return {
        tShell: Math.round(tShell * 100) / 100,
        tSphere: Math.round(tSphere * 100) / 100,
        tEllip: Math.round(tEllip * 100) / 100,
        tSelected: Math.round(tSelected * 100) / 100,
        mAWP: Math.round(mAWP * 100) / 100,
        hydroTest: Math.round(hydroTest * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};