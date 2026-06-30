/**
 * Production-aligned smart form pilot submit keys — Phase 5H-G-G / 5H-H.
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

export const ELECTRICAL_LABOR_PILOT_SUBMIT_KEYS = [
  "materialCost",
  "laborHours",
  "laborRate",
] as const;

export const HVAC_TONNAGE_PILOT_SUBMIT_KEYS = [
  "squareFootage",
  "tonnage",
  "laborHours",
] as const;

export const LAWN_CARE_PILOT_SUBMIT_KEYS = ["crewHoursPerVisit", "visitsPerMonth"] as const;

export const PRINT_JOB_PILOT_SUBMIT_KEYS = [
  "materialCost",
  "designHours",
  "laborRate",
] as const;

export const PLUMBING_FIXTURE_PILOT_SUBMIT_KEYS = ["fixtureCount", "laborHours"] as const;

export const LASER_CUTTING_PILOT_SUBMIT_KEYS = ["setupTime", "quantity"] as const;

export const WELDING_COST_PILOT_SUBMIT_KEYS = [
  "materialCost",
  "laborHours",
  "laborRate",
  "fitUpHours",
] as const;

export type ThreeDPrintPilotSubmitKey = (typeof THREE_D_PRINT_PILOT_SUBMIT_KEYS)[number];
export type AutoShopPilotSubmitKey = (typeof AUTO_SHOP_PILOT_SUBMIT_KEYS)[number];
export type CabinetPilotSubmitKey = (typeof CABINET_PILOT_SUBMIT_KEYS)[number];
