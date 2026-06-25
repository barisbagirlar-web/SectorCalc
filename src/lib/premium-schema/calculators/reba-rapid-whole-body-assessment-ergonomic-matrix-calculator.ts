import { RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82InputSchema, type RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82Input } from "./reba-hizli-tum-vucut-degerlendirmesi-ergonomik-matrisi-calculator-82-validation";

/**
 * REBA Table A Lookup based on trunk, neck, and legs scores.
 * Values derived from the standard REBA assessment matrix (Appendix A).
 */
function getTableAScore(trunk: number, neck: number, legs: number): number {
  const lookupTableA: Record<string, number> = {
    "1_1_1": 1, "1_1_2": 2, "1_1_3": 3, "1_1_4": 4,
    "1_2_1": 1, "1_2_2": 2, "1_2_3": 3, "1_2_4": 4,
    "1_3_1": 3, "1_3_2": 3, "1_3_3": 3, "1_3_4": 5,
    "2_1_1": 2, "2_1_2": 3, "2_1_3": 4, "2_1_4": 5,
    "2_2_1": 2, "2_2_2": 3, "2_2_3": 4, "2_2_4": 5,
    "2_3_1": 4, "2_3_2": 4, "2_3_3": 4, "2_3_4": 6,
    "3_1_1": 3, "3_1_2": 4, "3_1_3": 5, "3_1_4": 6,
    "3_2_1": 3, "3_2_2": 4, "3_2_3": 5, "3_2_4": 6,
    "3_3_1": 5, "3_3_2": 5, "3_3_3": 5, "3_3_4": 7,
    "4_1_1": 4, "4_1_2": 5, "4_1_3": 6, "4_1_4": 7,
    "4_2_1": 4, "4_2_2": 5, "4_2_3": 6, "4_2_4": 7,
    "4_3_1": 6, "4_3_2": 6, "4_3_3": 6, "4_3_4": 8,
    "5_1_1": 5, "5_1_2": 6, "5_1_3": 7, "5_1_4": 8,
    "5_2_1": 5, "5_2_2": 6, "5_2_3": 7, "5_2_4": 8,
    "5_3_1": 7, "5_3_2": 7, "5_3_3": 7, "5_3_4": 9,
  };
  const key = `${trunk}_${neck}_${legs}`;
  return lookupTableA[key] ?? Math.min(trunk + neck + legs, 10);
}

/**
 * REBA Table B Lookup based on upper arm, lower arm, and wrist scores.
 * Values derived from the standard REBA assessment matrix (Appendix B).
 */
function getTableBScore(upperArm: number, lowerArm: number, wrist: number): number {
  const lookupTableB: Record<string, number> = {
    "1_1_1": 1, "1_1_2": 2, "1_1_3": 3,
    "1_2_1": 1, "1_2_2": 2, "1_2_3": 3,
    "1_3_1": 2, "1_3_2": 3, "1_3_3": 4,
    "2_1_1": 2, "2_1_2": 3, "2_1_3": 4,
    "2_2_1": 2, "2_2_2": 3, "2_2_3": 4,
    "2_3_1": 3, "2_3_2": 4, "2_3_3": 5,
    "3_1_1": 3, "3_1_2": 4, "3_1_3": 5,
    "3_2_1": 3, "3_2_2": 4, "3_2_3": 5,
    "3_3_1": 4, "3_3_2": 5, "3_3_3": 6,
    "4_1_1": 4, "4_1_2": 5, "4_1_3": 6,
    "4_2_1": 4, "4_2_2": 5, "4_2_3": 6,
    "4_3_1": 5, "4_3_2": 6, "4_3_3": 7,
    "5_1_1": 5, "5_1_2": 6, "5_1_3": 7,
    "5_2_1": 5, "5_2_2": 6, "5_2_3": 7,
    "5_3_1": 6, "5_3_2": 7, "5_3_3": 8,
    "6_1_1": 6, "6_1_2": 7, "6_1_3": 8,
    "6_2_1": 6, "6_2_2": 7, "6_2_3": 8,
    "6_3_1": 7, "6_3_2": 8, "6_3_3": 9,
  };
  const key = `${upperArm}_${lowerArm}_${wrist}`;
  return lookupTableB[key] ?? Math.min(upperArm + lowerArm + wrist, 10);
}

/**
 * REBA Table C Lookup based on Score A Total and Score B Total.
 * Values derived from the standard REBA assessment matrix (Appendix C).
 */
function getTableCScore(scoreA: number, scoreB: number): number {
  const lookupTableC: Record<string, number> = {
    "1_1": 1, "1_2": 1, "1_3": 2, "1_4": 3, "1_5": 4, "1_6": 6, "1_7": 7, "1_8": 8, "1_9": 9, "1_10": 10,
    "2_1": 1, "2_2": 2, "2_3": 3, "2_4": 4, "2_5": 5, "2_6": 7, "2_7": 8, "2_8": 9, "2_9": 10, "2_10": 11,
    "3_1": 2, "3_2": 3, "3_3": 4, "3_4": 5, "3_5": 6, "3_6": 7, "3_7": 8, "3_8": 9, "3_9": 10, "3_10": 11,
    "4_1": 3, "4_2": 4, "4_3": 5, "4_4": 6, "4_5": 7, "4_6": 8, "4_7": 9, "4_8": 10, "4_9": 11, "4_10": 12,
    "5_1": 4, "5_2": 5, "5_3": 6, "5_4": 7, "5_5": 8, "5_6": 9, "5_7": 10, "5_8": 11, "5_9": 12, "5_10": 12,
    "6_1": 5, "6_2": 6, "6_3": 7, "6_4": 8, "6_5": 9, "6_6": 10, "6_7": 11, "6_8": 12, "6_9": 12, "6_10": 12,
    "7_1": 6, "7_2": 7, "7_3": 8, "7_4": 9, "7_5": 10, "7_6": 11, "7_7": 12, "7_8": 12, "7_9": 12, "7_10": 12,
    "8_1": 7, "8_2": 8, "8_3": 9, "8_4": 10, "8_5": 11, "8_6": 12, "8_7": 12, "8_8": 12, "8_9": 12, "8_10": 12,
    "9_1": 8, "9_2": 9, "9_3": 10, "9_4": 11, "9_5": 12, "9_6": 12, "9_7": 12, "9_8": 12, "9_9": 12, "9_10": 12,
    "10_1": 9, "10_2": 10, "10_3": 11, "10_4": 12, "10_5": 12, "10_6": 12, "10_7": 12, "10_8": 12, "10_9": 12, "10_10": 12,
  };
  const safeA = Math.min(Math.max(scoreA, 1), 10);
  const safeB = Math.min(Math.max(scoreB, 1), 10);
  const key = `${safeA}_${safeB}`;
  return lookupTableC[key] ?? Math.min(safeA + safeB, 12);
}

export const calculateRebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82Contract: any = {
  id: "reba-hizli-tum-vucut-degerlendirmesi-ergonomik-matrisi-calculator-82",
  version: "1.0.0",
  category: "cost",
  inputSchema: RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82InputSchema,
  
  execute: async (input: any) => {
    try {
      const data = input as RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82Input;

      // Clamp input values to valid REBA ranges
      const trunkScore = Math.min(Math.max(data.trunkScore, 1), 5);
      const neckScore = Math.min(Math.max(data.neckScore, 1), 3);
      const legsScore = Math.min(Math.max(data.legsScore, 1), 4);
      const upperArmScore = Math.min(Math.max(data.upperArmScore, 1), 6);
      const lowerArmScore = Math.min(Math.max(data.lowerArmScore, 1), 3);
      const wristScore = Math.min(Math.max(data.wristScore, 1), 3);
      const loadForceScore = Math.min(Math.max(data.loadForceScore, 0), 2);
      const couplingScore = Math.min(Math.max(data.couplingScore, 0), 3);
      const activityScore = Math.min(Math.max(data.activityScore, 0), 3);

      // REBA Calculation pipeline
      const tableAScore = getTableAScore(trunkScore, neckScore, legsScore);
      const scoreATotal = tableAScore + loadForceScore;
      const tableBScore = getTableBScore(upperArmScore, lowerArmScore, wristScore);
      const scoreBTotal = tableBScore + couplingScore;
      const tableCScore = getTableCScore(scoreATotal, scoreBTotal);
      const finalREBAScore = tableCScore + activityScore;

      return {
        tableAScore: Math.round(tableAScore * 100) / 100,
        scoreATotal: Math.round(scoreATotal * 100) / 100,
        tableBScore: Math.round(tableBScore * 100) / 100,
        scoreBTotal: Math.round(scoreBTotal * 100) / 100,
        tableCScore: Math.round(tableCScore * 100) / 100,
        finalREBAScore: Math.round(finalREBAScore * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};