/**
 * Premium full-loop runtime bridge tests — welding, sheet-metal, HVAC, plumbing, panel shop,
 * roofing, painting, CNC, change-order, office cleaning, menu, return-profit.
 */

import { describe, expect, test } from "vitest";
import {
  runPremiumFullLoopCalculation,
  sanitizeCanonicalInputs,
} from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const WELDING_SLUG = "welding-bid-risk-analyzer";
const SHEET_METAL_SLUG = "sheet-metal-quote-risk-tool";
const HVAC_SLUG = "hvac-project-margin-guard";
const PLUMBING_SLUG = "plumbing-job-margin-verdict";
const ELECTRICAL_SLUG = "electrical-labor-estimator";
const PRINT_JOB_SLUG = "print-job-cost-check";
const LAWN_CARE_SLUG = "lawn-care-cost-check";

const WELDING_VALID_INPUTS = {
  materialCost: 1200,
  laborHours: 8,
  laborRate: 65,
  gasConsumableCost: 85,
  fitUpHours: 2,
  reworkRiskPercent: 10,
  targetMargin: 25,
} as const;

const SHEET_METAL_VALID_INPUTS = {
  programmingTime: 45,
  setupTime: 30,
  cutTime: 12,
  bendCount: 4,
  laborRate: 75,
  materialCost: 280,
  scrapRatePercent: 10,
  finishingCost: 35,
  targetMargin: 25,
} as const;

const HVAC_VALID_INPUTS = {
  equipmentCost: 8500,
  ductworkCost: 2200,
  laborHours: 24,
  laborRate: 75,
  commissioningCost: 450,
  callbackRiskPercent: 8,
  targetMargin: 22,
} as const;

const PLUMBING_VALID_INPUTS = {
  partsCost: 680,
  laborHours: 6,
  laborRate: 85,
  fixtureCount: 3,
  materialRunCost: 120,
  callbackRiskPercent: 10,
  targetMargin: 25,
} as const;

const ELECTRICAL_VALID_INPUTS = {
  materialCost: 2400,
  laborHours: 18,
  laborRate: 78,
  testingHours: 4,
  inspectionRiskPercent: 12,
  targetMargin: 24,
} as const;

const PRINT_JOB_VALID_INPUTS = {
  materialCost: 850,
  inkCost: 120,
  designHours: 6,
  laborRate: 72,
  installHours: 4,
  reprintRiskPercent: 8,
  targetMargin: 28,
} as const;

const LAWN_CARE_VALID_INPUTS = {
  crewHoursPerVisit: 3,
  laborRate: 42,
  fuelCostPerVisit: 18,
  supplyCostPerMonth: 95,
  visitsPerMonth: 4,
  equipmentWearCost: 60,
  targetMargin: 20,
} as const;

const ROOFING_SLUG = "roofing-contract-margin-guard";
const PAINTING_SLUG = "painting-job-profit-verdict";
const CNC_SLUG = "cnc-quote-risk-analyzer";
const CHANGE_ORDER_SLUG = "change-order-impact-analyzer";
const OFFICE_CLEANING_SLUG = "office-cleaning-bid-optimizer";
const MENU_SLUG = "menu-profit-leak-detector";
const RETURN_SLUG = "return-profit-erosion-tool";

const ROOFING_VALID_INPUTS = {
  materialCost: 4200,
  laborHours: 48,
  laborRate: 58,
  tearOffCost: 850,
  dumpFees: 320,
  weatherDelayRiskPercent: 12,
  targetMargin: 22,
} as const;

const PAINTING_VALID_INPUTS = {
  paintCost: 680,
  prepHours: 12,
  laborRate: 42,
  scaffoldCost: 350,
  touchUpRiskPercent: 10,
  areaSize: 2400,
  targetMargin: 24,
} as const;

const CNC_VALID_INPUTS = {
  setupTime: 60,
  cycleTime: 3,
  quantity: 20,
  toolCost: 500,
  materialCost: 400,
  machineRate: 90,
  riskMargin: 20,
} as const;

const CHANGE_ORDER_VALID_INPUTS = {
  originalBudget: 120000,
  changeEstimate: 8500,
  delayDays: 5,
  crewCostPerDay: 1200,
  marginTarget: 18,
} as const;

const OFFICE_CLEANING_VALID_INPUTS = {
  areaSize: 8500,
  laborRate: 28,
  hoursPerVisit: 3,
  supplyCost: 180,
  visitFrequency: 4,
  targetMargin: 22,
} as const;

const MENU_VALID_INPUTS = {
  menuPrice: 18,
  ingredientCost: 5.5,
  wasteRate: 8,
  deliveryCommission: 22,
  laborCostPerItem: 2.8,
  targetMargin: 28,
} as const;

const RETURN_VALID_INPUTS = {
  productPrice: 89,
  productCost: 32,
  shippingCost: 6.5,
  returnRate: 12,
  paymentFeeRate: 2.9,
  adCostPerSale: 14,
} as const;

describe("premium full-loop runtime bridge — welding", () => {
  test("registers welding as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(WELDING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(WELDING_SLUG, {
      ...WELDING_VALID_INPUTS,
      rogueKey: 999,
      weldProcedureComplexity: 3,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("weldProcedureComplexity");
    expect(sanitized.canonical.materialCost).toBe(1200);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, {
      materialCost: 500,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor hours are zero", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, {
      ...WELDING_VALID_INPUTS,
      laborHours: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor hours"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("materialCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });

  test("blocks verdict when validation would fail on negative safe price", () => {
    const pre = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_VALID_INPUTS });
    expect(pre.status).toBe("success");
  });
});

describe("premium full-loop runtime bridge — sheet metal", () => {
  test("registers sheet-metal as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(SHEET_METAL_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      rogueKey: 999,
      nestingEfficiency: 0.85,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("nestingEfficiency");
    expect(sanitized.canonical.materialCost).toBe(280);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      materialCost: 500,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when scrap rate is out of range", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, {
      ...SHEET_METAL_VALID_INPUTS,
      scrapRatePercent: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Scrap rate"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(SHEET_METAL_SLUG, { ...SHEET_METAL_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("cutTime");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — HVAC", () => {
  test("registers hvac as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(HVAC_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(HVAC_SLUG, {
      ...HVAC_VALID_INPUTS,
      rogueKey: 999,
      manualJLoadVariance: 0.12,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("manualJLoadVariance");
    expect(sanitized.canonical.equipmentCost).toBe(8500);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(HVAC_SLUG, {
      equipmentCost: 5000,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(HVAC_SLUG, {
      ...HVAC_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when callback risk is out of range", () => {
    const result = runPremiumFullLoopCalculation(HVAC_SLUG, {
      ...HVAC_VALID_INPUTS,
      callbackRiskPercent: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Callback risk"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(HVAC_SLUG, { ...HVAC_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("equipmentCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — plumbing", () => {
  test("registers plumbing as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(PLUMBING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(PLUMBING_SLUG, {
      ...PLUMBING_VALID_INPUTS,
      rogueKey: 999,
      concealedDamageRisk: 0.2,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("concealedDamageRisk");
    expect(sanitized.canonical.partsCost).toBe(680);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(PLUMBING_SLUG, {
      partsCost: 400,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor hours are zero", () => {
    const result = runPremiumFullLoopCalculation(PLUMBING_SLUG, {
      ...PLUMBING_VALID_INPUTS,
      laborHours: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor hours"))).toBe(true);
  });

  test("blocks when callback risk is out of range", () => {
    const result = runPremiumFullLoopCalculation(PLUMBING_SLUG, {
      ...PLUMBING_VALID_INPUTS,
      callbackRiskPercent: 110,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Callback risk"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(PLUMBING_SLUG, { ...PLUMBING_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("partsCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — electrical labor estimator", () => {
  test("registers electrical-labor-estimator as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(ELECTRICAL_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(ELECTRICAL_SLUG, {
      ...ELECTRICAL_VALID_INPUTS,
      rogueKey: 999,
      codeJurisdictionRisk: 0.15,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("codeJurisdictionRisk");
    expect(sanitized.canonical.materialCost).toBe(2400);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(ELECTRICAL_SLUG, {
      materialCost: 1500,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(ELECTRICAL_SLUG, {
      ...ELECTRICAL_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when inspection risk is out of range", () => {
    const result = runPremiumFullLoopCalculation(ELECTRICAL_SLUG, {
      ...ELECTRICAL_VALID_INPUTS,
      inspectionRiskPercent: 150,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Inspection risk"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(ELECTRICAL_SLUG, { ...ELECTRICAL_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.slug).toBe(ELECTRICAL_SLUG);
    expect(result.trustTrace.canonicalInputs).toContain("testingHours");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — print job cost check", () => {
  test("registers print-job-cost-check as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(PRINT_JOB_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(PRINT_JOB_SLUG, {
      ...PRINT_JOB_VALID_INPUTS,
      rogueKey: 999,
      wideFormatSpoilage: 0.12,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("wideFormatSpoilage");
    expect(sanitized.canonical.materialCost).toBe(850);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(PRINT_JOB_SLUG, {
      materialCost: 400,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(PRINT_JOB_SLUG, {
      ...PRINT_JOB_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when reprint risk is out of range", () => {
    const result = runPremiumFullLoopCalculation(PRINT_JOB_SLUG, {
      ...PRINT_JOB_VALID_INPUTS,
      reprintRiskPercent: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Reprint risk"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(PRINT_JOB_SLUG, { ...PRINT_JOB_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.slug).toBe(PRINT_JOB_SLUG);
    expect(result.trustTrace.canonicalInputs).toContain("inkCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — lawn care cost check", () => {
  test("registers lawn-care-cost-check as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(LAWN_CARE_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(LAWN_CARE_SLUG, {
      ...LAWN_CARE_VALID_INPUTS,
      rogueKey: 999,
      routeDensityRisk: 0.2,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("routeDensityRisk");
    expect(sanitized.canonical.crewHoursPerVisit).toBe(3);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(LAWN_CARE_SLUG, {
      crewHoursPerVisit: 2,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(LAWN_CARE_SLUG, {
      ...LAWN_CARE_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("blocks when visits per month is zero", () => {
    const result = runPremiumFullLoopCalculation(LAWN_CARE_SLUG, {
      ...LAWN_CARE_VALID_INPUTS,
      visitsPerMonth: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Visits per month"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(LAWN_CARE_SLUG, { ...LAWN_CARE_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.slug).toBe(LAWN_CARE_SLUG);
    expect(result.trustTrace.canonicalInputs).toContain("fuelCostPerVisit");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — roofing", () => {
  test("registers roofing as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(ROOFING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(ROOFING_SLUG, {
      ...ROOFING_VALID_INPUTS,
      rogueKey: 999,
      manualOverride: 1,
      pitchGradeRisk: 0.15,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("manualOverride");
    expect(sanitized.rejectedKeys).toContain("pitchGradeRisk");
    expect(sanitized.canonical.materialCost).toBe(4200);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(ROOFING_SLUG, {
      materialCost: 2000,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when weather delay risk is out of range", () => {
    const result = runPremiumFullLoopCalculation(ROOFING_SLUG, {
      ...ROOFING_VALID_INPUTS,
      weatherDelayRiskPercent: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Weather delay risk"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(ROOFING_SLUG, { ...ROOFING_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("tearOffCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — painting", () => {
  test("registers painting as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(PAINTING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(PAINTING_SLUG, {
      ...PAINTING_VALID_INPUTS,
      rogueKey: 999,
      advancedPatchKey: 2,
      productionEfficiencyOverride: 0.9,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("advancedPatchKey");
    expect(sanitized.rejectedKeys).toContain("productionEfficiencyOverride");
    expect(sanitized.canonical.paintCost).toBe(680);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(PAINTING_SLUG, {
      paintCost: 400,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when labor rate is zero", () => {
    const result = runPremiumFullLoopCalculation(PAINTING_SLUG, {
      ...PAINTING_VALID_INPUTS,
      laborRate: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Labor rate"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(PAINTING_SLUG, { ...PAINTING_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("areaSize");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — CNC", () => {
  test("registers cnc as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(CNC_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(CNC_SLUG, {
      ...CNC_VALID_INPUTS,
      rogueKey: 999,
      manualOverride: 1,
      spindleWearFactor: 0.12,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("manualOverride");
    expect(sanitized.rejectedKeys).toContain("spindleWearFactor");
    expect(sanitized.canonical.machineRate).toBe(90);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(CNC_SLUG, {
      setupTime: 30,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when quantity is zero", () => {
    const result = runPremiumFullLoopCalculation(CNC_SLUG, {
      ...CNC_VALID_INPUTS,
      quantity: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Quantity"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(CNC_SLUG, { ...CNC_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("riskMargin");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — change order", () => {
  test("registers change-order as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(CHANGE_ORDER_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(CHANGE_ORDER_SLUG, {
      ...CHANGE_ORDER_VALID_INPUTS,
      rogueKey: 999,
      manualOverride: 1,
      extraLaborHours: 12,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("manualOverride");
    expect(sanitized.rejectedKeys).toContain("extraLaborHours");
    expect(sanitized.canonical.originalBudget).toBe(120000);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(CHANGE_ORDER_SLUG, {
      originalBudget: 50000,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when margin target is out of range", () => {
    const result = runPremiumFullLoopCalculation(CHANGE_ORDER_SLUG, {
      ...CHANGE_ORDER_VALID_INPUTS,
      marginTarget: 150,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Target margin"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(CHANGE_ORDER_SLUG, { ...CHANGE_ORDER_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("marginTarget");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — office cleaning", () => {
  test("registers office-cleaning as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(OFFICE_CLEANING_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(OFFICE_CLEANING_SLUG, {
      ...OFFICE_CLEANING_VALID_INPUTS,
      rogueKey: 999,
      advancedPatchKey: 1,
      routeDensityRisk: 0.2,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("advancedPatchKey");
    expect(sanitized.rejectedKeys).toContain("routeDensityRisk");
    expect(sanitized.canonical.areaSize).toBe(8500);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(OFFICE_CLEANING_SLUG, {
      areaSize: 5000,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when visit frequency is zero", () => {
    const result = runPremiumFullLoopCalculation(OFFICE_CLEANING_SLUG, {
      ...OFFICE_CLEANING_VALID_INPUTS,
      visitFrequency: 0,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Visit frequency"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(OFFICE_CLEANING_SLUG, {
      ...OFFICE_CLEANING_VALID_INPUTS,
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("visitFrequency");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — menu profit leak", () => {
  test("registers menu as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(MENU_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(MENU_SLUG, {
      ...MENU_VALID_INPUTS,
      rogueKey: 999,
      manualOverride: 1,
      platformMixOverride: 0.4,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("manualOverride");
    expect(sanitized.rejectedKeys).toContain("platformMixOverride");
    expect(sanitized.canonical.menuPrice).toBe(18);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(MENU_SLUG, {
      menuPrice: 15,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when waste rate is out of range", () => {
    const result = runPremiumFullLoopCalculation(MENU_SLUG, {
      ...MENU_VALID_INPUTS,
      wasteRate: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Waste rate"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(MENU_SLUG, { ...MENU_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("ingredientCost");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});

describe("premium full-loop runtime bridge — return profit erosion", () => {
  test("registers return-profit as full-loop slug", () => {
    expect(isFullLoopRuntimeSlug(RETURN_SLUG)).toBe(true);
  });

  test("rejects non-canonical input keys", () => {
    const sanitized = sanitizeCanonicalInputs(RETURN_SLUG, {
      ...RETURN_VALID_INPUTS,
      rogueKey: 999,
      advancedPatchKey: 1,
      chargebackReservePercent: 3,
    });

    expect(sanitized.rejectedKeys).toContain("rogueKey");
    expect(sanitized.rejectedKeys).toContain("advancedPatchKey");
    expect(sanitized.rejectedKeys).toContain("chargebackReservePercent");
    expect(sanitized.canonical.productPrice).toBe(89);
    expect("rogueKey" in sanitized.canonical).toBe(false);
  });

  test("blocks calculation when required inputs are missing", () => {
    const result = runPremiumFullLoopCalculation(RETURN_SLUG, {
      productPrice: 50,
    });

    expect(result.status).toBe("blocked");
    expect(result.loopStatus).toBe("NEED_DATA");
    expect(result.missingInputs.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(false);
  });

  test("blocks when return rate is out of range", () => {
    const result = runPremiumFullLoopCalculation(RETURN_SLUG, {
      ...RETURN_VALID_INPUTS,
      returnRate: 120,
    });

    expect(result.status).toBe("blocked");
    expect(result.blockers.some((blocker) => blocker.includes("Return rate"))).toBe(true);
  });

  test("returns report, verdict and trust trace on valid inputs", () => {
    const result = runPremiumFullLoopCalculation(RETURN_SLUG, { ...RETURN_VALID_INPUTS });

    expect(result.status).toBe("success");
    if (result.status !== "success") {
      return;
    }

    expect(result.report.minimumSafePrice).toBeGreaterThan(0);
    expect(result.toolResult.verdict.length).toBeGreaterThan(0);
    expect(result.trustTrace.validationPassed).toBe(true);
    expect(result.trustTrace.loopStatus).toBe("SUCCESS");
    expect(result.trustTrace.canonicalInputs).toContain("adCostPerSale");
    expect(result.trustTrace.validationSources.length).toBeGreaterThan(0);
  });
});
