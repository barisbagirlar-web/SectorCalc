/**
 * Production-aligned smart form pilot submit keys — Phase 5H-G-G.
 */

export const THREE_D_PRINT_PILOT_SUBMIT_KEYS = [
  "materialCost",
  "printHours",
  "machineRate",
] as const;

export const AUTO_SHOP_PILOT_SUBMIT_KEYS = [
  "quotedPrice",
  "repairHours",
  "partsCost",
] as const;

export const CABINET_PILOT_SUBMIT_KEYS = [
  "sheetMaterialCost",
  "laborHours",
  "installHours",
] as const;

export type ThreeDPrintPilotSubmitKey = (typeof THREE_D_PRINT_PILOT_SUBMIT_KEYS)[number];
export type AutoShopPilotSubmitKey = (typeof AUTO_SHOP_PILOT_SUBMIT_KEYS)[number];
export type CabinetPilotSubmitKey = (typeof CABINET_PILOT_SUBMIT_KEYS)[number];
