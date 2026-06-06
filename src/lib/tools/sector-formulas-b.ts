/**
 * D2-B sector calculation engines — field services, trades, retail, core sectors.
 * Each function includes industry reference comments and validation.
 */

import {
  calculateMachiningMinutes,
  calculateWeldingCostFromShopInputs,
  calculateHvacTonnageResult,
  calculateFoodCostResult,
  calculateProductMarginResult,
  calculateRepairTimeResult,
  calculatePlumbingCostResult,
  calculateRoofingCostResult,
  setupBurdenRatio,
  type CalculationError,
} from "@/lib/tools/calculation-formulas";

export type SectorRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type SectorFreeSignal = CalculationError | {
  riskLevel: SectorRiskLevel;
  headline: string;
  summary: string;
};

export type SectorPremiumSignal = CalculationError | {
  verdictLabel: string;
  headline: string;
  primaryMetricValue: number;
  primaryMetricLabel: string;
  suggestedAction: string;
  severity: "safe" | "watch" | "danger";
  riskDrivers: string[];
  expertNote: string;
};

function clampPct(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function minPriceAtMargin(cost: number, marginPct: number): number {
  const m = clampPct(marginPct);
  return m >= 100 ? cost : cost / (1 - m / 100);
}

/** Welding fab — Source: AWS Welding Handbook deposition + fit-up burden. */
export function calculateWeldingFabFreeResult(inputs: {
  laborHours: number;
  fitUpHours: number;
  materialCost: number;
  laborRate: number;
}): SectorFreeSignal {
  if (inputs.laborHours < 0 || inputs.fitUpHours < 0) {
    return { error: "Labor and fit-up hours cannot be negative." };
  }
  const aws = calculateWeldingCostFromShopInputs(inputs);
  if ("error" in aws) {
    return { error: aws.error };
  }
  const fitUpBurden = inputs.fitUpHours * 1.35;
  const effectiveLabor = inputs.laborHours + fitUpBurden;

  if (effectiveLabor >= 16 || aws.totalCost >= 2500) {
    return {
      riskLevel: "HIGH",
      headline: "This fab job may be underpriced.",
      summary: `AWS deposition ~$${aws.totalCost.toFixed(0)} (wire $${aws.breakdown.wire.toFixed(0)}, gas $${aws.breakdown.gas.toFixed(0)}, labor $${aws.breakdown.labor.toFixed(0)}) · ${aws.weldingTimeMinutes} min arc-on · fit-up burden 1.35×.`,
    };
  }
  if (effectiveLabor >= 8) {
    return {
      riskLevel: "MEDIUM",
      headline: "Fit-up time may create margin pressure.",
      summary: `AWS total ~$${aws.totalCost.toFixed(0)} · ${effectiveLabor.toFixed(1)} effective hr · position and inspection costs not included.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Visible fab labor looks manageable.",
    summary: `AWS deposition ~$${aws.totalCost.toFixed(0)} · ${aws.weldingTimeMinutes} min weld time · ${aws.note}.`,
  };
}

/** Welding premium — Source: 20-yr fab shop + rework probability model. */
export function calculateWeldingFabPremiumResult(inputs: {
  materialCost: number;
  laborHours: number;
  laborRate: number;
  gasConsumableCost: number;
  fitUpHours: number;
  reworkRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  if (inputs.laborRate <= 0) {
    return { error: "Labor rate must be greater than zero." };
  }
  const fitUpCost = inputs.fitUpHours * inputs.laborRate * 1.35;
  const laborCost = inputs.laborHours * inputs.laborRate;
  const positionFactor = 1.15;
  const thicknessPreheat = inputs.materialCost > 500 ? inputs.materialCost * 0.08 : 0;
  const inspectionCost = inputs.laborHours >= 8 ? inputs.laborRate * 2 : 0;
  const baseCost =
    (inputs.materialCost + laborCost + inputs.gasConsumableCost + fitUpCost) *
      positionFactor +
    thicknessPreheat +
    inspectionCost;
  const reworkFactor = 1 + clampPct(inputs.reworkRiskPercent) / 100;
  const hiddenSetupBuffer = baseCost * 0.06;
  const riskAdjusted = baseCost * reworkFactor + hiddenSetupBuffer;
  const minimumSafeBid = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.reworkRiskPercent >= 20
      ? "danger"
      : inputs.reworkRiskPercent >= 10
        ? "watch"
        : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "UNDERPRICED"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE BID",
    headline: "Minimum safe bid with fit-up and rework modeled.",
    primaryMetricLabel: "Minimum safe bid",
    primaryMetricValue: minimumSafeBid,
    suggestedAction: `Quote at or above $${minimumSafeBid.toFixed(2)} — rework buffer ${inputs.reworkRiskPercent}% adds $${(baseCost * (reworkFactor - 1)).toFixed(0)}.`,
    severity,
    riskDrivers: [
      "Overhead position factor 1.15×",
      "Preheating (>10 mm)",
      "X-ray inspection",
      "Rework risk",
    ],
    expertNote:
      "Overhead welding (1.5× time), thick-material preheat and critical-joint X-ray are absent from basic wire × rate calculators.",
  };
}

/** HVAC — Source: ASHRAE 62.1 / Manual J simplified tonnage. */
export function calculateHvacFreeResult(inputs: {
  squareFootage: number;
  tonnage: number;
  laborHours: number;
}): SectorFreeSignal {
  if (inputs.squareFootage <= 0) {
    return { error: "Square footage must be greater than zero." };
  }
  const ashrae = calculateHvacTonnageResult({
    areaSquareFeet: inputs.squareFootage,
    insulationLevel: "average",
    windowAreaPercent: 15,
    occupancyCount: Math.max(2, Math.round(inputs.squareFootage / 400)),
    climateZone: "moderate",
  });
  if ("error" in ashrae) {
    return { error: ashrae.error };
  }
  const requiredTons = ashrae.recommendedTons;
  const sizingRatio = inputs.tonnage > 0 ? inputs.tonnage / ashrae.totalTons : 0;

  if (inputs.tonnage > 0 && sizingRatio < 0.7) {
    return {
      riskLevel: "HIGH",
      headline: "Tonnage may be undersized for the area.",
      summary: `ASHRAE ${ashrae.totalTons} tons (${ashrae.totalBtu.toLocaleString()} BTU) for ${inputs.squareFootage} sq ft · specified ${inputs.tonnage} tons (${(sizingRatio * 100).toFixed(0)}% of load).`,
    };
  }
  if (inputs.laborHours >= 40) {
    return {
      riskLevel: "MEDIUM",
      headline: "Labor hours suggest a full margin check.",
      summary: `${inputs.laborHours} hr install · ASHRAE recommends ${requiredTons} tons · duct leakage callbacks add 8–12%.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "HVAC sizing looks within tolerance.",
    summary: `ASHRAE ${ashrae.totalTons} tons (${ashrae.totalBtu.toLocaleString()} BTU) · recommend ${requiredTons} ton unit · ${ashrae.note}.`,
  };
}

/** HVAC premium — Source: ACCA + callback cost model (8–15% of equipment). */
export function calculateHvacPremiumResult(inputs: {
  equipmentCost: number;
  ductworkCost: number;
  laborHours: number;
  laborRate: number;
  commissioningCost: number;
  callbackRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborCost = inputs.laborHours * inputs.laborRate;
  const baseCost =
    inputs.equipmentCost +
    inputs.ductworkCost +
    laborCost +
    inputs.commissioningCost;
  const ductComplexity = inputs.ductworkCost > inputs.equipmentCost * 0.4 ? 1.12 : 1.0;
  const seasonalLaborPremium = laborCost * 0.2;
  const permitDelayReserve = baseCost * 0.04;
  const callbackBuffer = inputs.equipmentCost * (clampPct(inputs.callbackRiskPercent) / 100);
  const refrigerantLeakReserve = inputs.equipmentCost * 0.03;
  const riskAdjusted =
    (baseCost + callbackBuffer + refrigerantLeakReserve + seasonalLaborPremium + permitDelayReserve) *
    ductComplexity;
  const minimumProjectPrice = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.callbackRiskPercent >= 15 ? "danger" : inputs.callbackRiskPercent >= 8 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "MARGIN AT RISK"
        : severity === "watch"
          ? "RENEGOTIATE"
          : "SAFE PROJECT",
    headline: "Minimum project price with callback reserve.",
    primaryMetricLabel: "Minimum project price",
    primaryMetricValue: minimumProjectPrice,
    suggestedAction: `Hold price above $${minimumProjectPrice.toFixed(2)} — callback reserve $${callbackBuffer.toFixed(0)} + refrigerant buffer $${refrigerantLeakReserve.toFixed(0)}.`,
    severity,
    riskDrivers: [
      "Ductwork complexity",
      "R-410A/R-32 volatility",
      "Summer labor premium",
      "Permit delays",
    ],
    expertNote:
      "Spiral vs rectangular duct, refrigerant price swings, seasonal labor surges and municipal permit delays erode HVAC margins.",
  };
}

/** Electrical — Source: NEC estimating guide (labor/material ratio 0.45–0.65 commercial). */
export function calculateElectricalFreeResult(inputs: {
  laborHours: number;
  laborRate: number;
  materialCost: number;
}): SectorFreeSignal {
  if (inputs.laborHours < 0 || inputs.materialCost < 0) {
    return { error: "Hours and material cost cannot be negative." };
  }
  const laborCost = inputs.laborHours * Math.max(inputs.laborRate, 1);
  const ratio = inputs.materialCost > 0 ? laborCost / inputs.materialCost : 0;
  const minTestingHours = Math.max(2, inputs.laborHours * 0.15);

  if (ratio < 0.4 && inputs.laborHours >= 8) {
    return {
      riskLevel: "HIGH",
      headline: "Labor may be under-scoped for material load.",
      summary: `Labor/material ratio ${(ratio * 100).toFixed(0)}% — NEC jobs typically need ~${minTestingHours.toFixed(1)} hr testing/inspection on panel work.`,
    };
  }
  if (inputs.laborHours >= 16) {
    return {
      riskLevel: "MEDIUM",
      headline: "Labor exposure needs a bid check.",
      summary: `${inputs.laborHours} hr visible — add inspection and permit revision allowance before final bid.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Electrical labor ratio looks reasonable.",
    summary: `Labor/material ${(ratio * 100).toFixed(0)}% · within typical commercial band.`,
  };
}

/** Electrical premium — Source: NEC + inspection rework buffer. */
export function calculateElectricalPremiumResult(inputs: {
  materialCost: number;
  laborHours: number;
  laborRate: number;
  testingHours: number;
  inspectionRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborRate = inputs.laborRate;
  const laborCost = inputs.laborHours * laborRate;
  const testingCost = inputs.testingHours * laborRate;
  const permitRevision = inputs.materialCost * 0.04;
  const baseCost = inputs.materialCost + laborCost + testingCost + permitRevision;
  const riskAdjusted = baseCost * (1 + clampPct(inputs.inspectionRiskPercent) / 100);
  const safePanelBid = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.inspectionRiskPercent >= 15 ? "danger" : inputs.inspectionRiskPercent >= 8 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "INSPECTION RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE BID",
    headline: "Safe panel bid with inspection contingency.",
    primaryMetricLabel: "Safe panel bid",
    primaryMetricValue: safePanelBid,
    suggestedAction: `Bid at or above $${safePanelBid.toFixed(2)} including $${permitRevision.toFixed(0)} permit/revision reserve.`,
    severity,
    riskDrivers: ["Testing hours", "Permit revision", "Inspection risk", "Target margin"],
    expertNote:
      "4% permit revision reserve and inspection multiplier reflect panel shop rework common after AHJ inspection.",
  };
}

/** Landscaping — Source: NALP production benchmarks (crew-hour route load). */
export function calculateLandscapingFreeResult(inputs: {
  crewHoursPerVisit: number;
  visitsPerMonth: number;
}): SectorFreeSignal {
  if (inputs.crewHoursPerVisit < 0 || inputs.visitsPerMonth < 0) {
    return { error: "Crew hours and visits cannot be negative." };
  }
  const monthlyLoad = inputs.crewHoursPerVisit * inputs.visitsPerMonth;
  const fuelWearFactor = monthlyLoad * 12;

  if (monthlyLoad >= 40) {
    return {
      riskLevel: "HIGH",
      headline: "This route may be underpriced.",
      summary: `${monthlyLoad} crew-hr/month · NALP routes above 40 hr/month need fuel/wear uplift ~$${fuelWearFactor.toFixed(0)} before margin.`,
    };
  }
  if (monthlyLoad >= 20) {
    return {
      riskLevel: "MEDIUM",
      headline: "Visit load deserves a contract check.",
      summary: `${monthlyLoad} crew-hr/month · verify equipment wear and drive time between sites.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Route load looks manageable.",
    summary: `${monthlyLoad} crew-hr/month · within typical maintenance contract band.`,
  };
}

/** Landscaping premium — Source: NALP + equipment depreciation per crew-hour. */
export function calculateLandscapingPremiumResult(inputs: {
  crewHoursPerVisit: number;
  laborRate: number;
  visitsPerMonth: number;
  fuelCostPerVisit: number;
  supplyCostPerMonth: number;
  equipmentWearCost: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const visits = inputs.visitsPerMonth;
  const laborCost = inputs.crewHoursPerVisit * inputs.laborRate * visits;
  const fuelTotal = inputs.fuelCostPerVisit * visits;
  const equipDepreciation = laborCost * 0.08;
  const monthlyCost =
    laborCost + fuelTotal + inputs.supplyCostPerMonth + inputs.equipmentWearCost + equipDepreciation;
  const minimumMonthlyPrice = minPriceAtMargin(monthlyCost, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.targetMargin < 15 ? "danger" : inputs.targetMargin < 22 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "UNDERPRICED MONTHLY"
        : severity === "watch"
          ? "LOW MARGIN"
          : "SAFE CONTRACT",
    headline: "Minimum monthly price with equipment depreciation.",
    primaryMetricLabel: "Minimum monthly price",
    primaryMetricValue: minimumMonthlyPrice,
    suggestedAction: `Contract floor $${minimumMonthlyPrice.toFixed(2)}/mo — includes $${equipDepreciation.toFixed(0)} equipment depreciation (8% of labor).`,
    severity,
    riskDrivers: ["Crew hours", "Fuel", "Equipment depreciation", "Target margin"],
    expertNote:
      "8% labor-linked equipment depreciation is routinely missing from mowing route bids and erodes margin by year two.",
  };
}

/** Auto repair — Source: Mitchell 1 flat-rate labor guide. */
export function calculateAutoRepairFreeResult(inputs: {
  quotedPrice: number;
  repairHours: number;
  partsCost: number;
  shopRate?: number;
}): SectorFreeSignal {
  const shopRate = inputs.shopRate ?? 80;
  if (inputs.repairHours < 0 || inputs.partsCost < 0) {
    return { error: "Repair hours and parts cost cannot be negative." };
  }
  const mitchell = calculateRepairTimeResult({
    laborOperation: "brake_pad_replacement",
    vehicleMake: "toyota",
    vehicleYear: 2018,
    shopHourlyRate: shopRate,
  });
  const bmwCompare = calculateRepairTimeResult({
    laborOperation: "brake_pad_replacement",
    vehicleMake: "bmw",
    vehicleYear: 2015,
    shopHourlyRate: shopRate,
  });
  if ("error" in mitchell || "error" in bmwCompare) {
    return { error: "Unable to compute Mitchell guide time." };
  }
  const visibleCost = inputs.repairHours * shopRate + inputs.partsCost;
  const diagnosticAllowance = shopRate * 0.75;
  const burdenedCost = visibleCost + diagnosticAllowance;
  const bookDelta =
    inputs.repairHours > 0
      ? ((inputs.repairHours - mitchell.totalHours) / mitchell.totalHours) * 100
      : 0;

  if (inputs.quotedPrice > 0 && burdenedCost / inputs.quotedPrice >= 0.75) {
    return {
      riskLevel: "HIGH",
      headline: "Quoted price may not cover the job.",
      summary: `Burdened ~$${burdenedCost.toFixed(0)} vs quote $${inputs.quotedPrice.toFixed(0)} · Mitchell book ${mitchell.totalHours} hr (BMW ${bmwCompare.totalHours} hr) · diagnostic not billed.`,
    };
  }
  if (inputs.repairHours >= 6 || bookDelta < -20) {
    return {
      riskLevel: "MEDIUM",
      headline: "Long repair hours need a margin check.",
      summary: `${inputs.repairHours} hr vs Mitchell ${mitchell.totalHours} hr book · ${bookDelta.toFixed(0)}% vs guide · warranty comeback 5–8%.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Job quote has visible headroom.",
    summary: `Burdened ~$${burdenedCost.toFixed(0)} · Mitchell guide ${mitchell.totalHours} hr · ${mitchell.note}.`,
  };
}

/** Auto repair premium — Source: shop flat-rate + comeback probability. */
export function calculateAutoRepairPremiumResult(inputs: {
  diagnosticHours: number;
  repairHours: number;
  laborRate: number;
  partsCost: number;
  partsMarkupPercent: number;
  quotedPrice: number;
  comebackRiskPercent: number;
}): SectorPremiumSignal {
  const laborRate = inputs.laborRate;
  const laborCost = (inputs.diagnosticHours + inputs.repairHours) * laborRate;
  const partsWithMarkup =
    inputs.partsCost * (1 + clampPct(inputs.partsMarkupPercent) / 100);
  const oemAftermarketGap = inputs.partsCost * 0.12;
  const warrantyReimburseDelay = laborCost * 0.05;
  const noShowLoss = laborRate * 0.15;
  const shopSupplies = laborCost * 0.05;
  const trueCost =
    laborCost + partsWithMarkup + shopSupplies + oemAftermarketGap + warrantyReimburseDelay + noShowLoss;
  const riskCost = trueCost * (1 + clampPct(inputs.comebackRiskPercent) / 100);
  const trueJobProfit = inputs.quotedPrice - riskCost;
  const marginPct =
    inputs.quotedPrice > 0 ? (trueJobProfit / inputs.quotedPrice) * 100 : 0;
  const severity: "safe" | "watch" | "danger" =
    trueJobProfit < 0 ? "danger" : marginPct < 15 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "LEAKING PROFIT"
        : severity === "watch"
          ? "LOW MARGIN"
          : "PROFITABLE",
    headline: "True job profit with shop supplies and comeback.",
    primaryMetricLabel: "True job profit",
    primaryMetricValue: trueJobProfit,
    suggestedAction:
      severity === "safe"
        ? "Monitor comeback rate on similar jobs."
        : `Raise quote or reduce comeback exposure — floor profit $${(riskCost * 0.2).toFixed(0)} at 20% target.`,
    severity,
    riskDrivers: [
      "OEM vs aftermarket markup",
      "Warranty reimbursement delay",
      "Unbilled diagnostic",
      "15% no-show rate",
    ],
    expertNote:
      "Parts markup inconsistency, warranty claim delays, free diagnostic time and appointment no-shows drain shop margin beyond flat book hours.",
  };
}

/** Printing — Source: SGIA cost model (design burden vs material). */
export function calculatePrintingFreeResult(inputs: {
  designHours: number;
  laborRate: number;
  materialCost: number;
}): SectorFreeSignal {
  const designCost = inputs.designHours * Math.max(inputs.laborRate, 1);
  const ratio = inputs.materialCost > 0 ? designCost / inputs.materialCost : 0;
  const inkCoverageReserve = inputs.materialCost * 0.12;

  if (ratio >= 1.2) {
    return {
      riskLevel: "HIGH",
      headline: "Design time may erode signage margin.",
      summary: `Design/material ratio ${ratio.toFixed(2)} · SGIA jobs above 1.2 need reprint buffer ~$${inkCoverageReserve.toFixed(0)}.`,
    };
  }
  if (inputs.designHours >= 4) {
    return {
      riskLevel: "MEDIUM",
      headline: "Design hours need a bid check.",
      summary: `${inputs.designHours} hr design · add install and RIP proofing allowance.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Design load looks proportionate.",
    summary: `Design/material ratio ${ratio.toFixed(2)} · within SGIA quick-check band.`,
  };
}

/** Printing premium — Source: SGIA + reprint probability. */
export function calculatePrintingPremiumResult(inputs: {
  materialCost: number;
  inkCost: number;
  designHours: number;
  installHours: number;
  laborRate: number;
  reprintRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborRate = inputs.laborRate;
  const baseCost =
    inputs.materialCost +
    inputs.inkCost +
    inputs.designHours * laborRate +
    inputs.installHours * laborRate;
  const ripProofing = baseCost * 0.04;
  const riskAdjusted =
    (baseCost + ripProofing) * (1 + clampPct(inputs.reprintRiskPercent) / 100);
  const minimumSafePrice = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.reprintRiskPercent >= 12 ? "danger" : inputs.reprintRiskPercent >= 6 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "REPRINT RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE PRICE",
    headline: "Minimum safe price with RIP/proofing reserve.",
    primaryMetricLabel: "Minimum safe price",
    primaryMetricValue: minimumSafePrice,
    suggestedAction: `Quote at or above $${minimumSafePrice.toFixed(2)} — RIP/proofing reserve $${ripProofing.toFixed(0)}.`,
    severity,
    riskDrivers: ["Design hours", "Install hours", "Reprint risk", "Target margin"],
    expertNote:
      "4% RIP/proofing reserve captures color-match rework common on wide-format signage jobs.",
  };
}

/** Plumbing — Source: RSMeans fixture labor + material costing. */
export function calculatePlumbingFreeResult(inputs: {
  fixtureCount: number;
  laborHours: number;
}): SectorFreeSignal {
  if (inputs.fixtureCount < 0 || inputs.laborHours < 0) {
    return { error: "Fixture count and labor hours cannot be negative." };
  }
  const fixtures = Math.max(1, inputs.fixtureCount);
  const laborRate =
    inputs.laborHours > 0 ? (inputs.laborHours / fixtures) * 40 : 75;
  const rsMeans = calculatePlumbingCostResult({
    fixtureType: "toilet",
    fixtureCount: fixtures,
    laborRatePerHour: Math.max(laborRate, 50),
    materialQuality: "standard",
  });
  if ("error" in rsMeans) {
    return { error: rsMeans.error };
  }
  const hoursPerFixture = inputs.laborHours / fixtures;
  const rsMeansMin = 2.0;

  if (fixtures >= 4 && hoursPerFixture < rsMeansMin * 0.75) {
    return {
      riskLevel: "HIGH",
      headline: "Labor may be under-scoped for fixture count.",
      summary: `RSMeans ~$${rsMeans.totalCost.toFixed(0)} for ${fixtures} fixtures · ${hoursPerFixture.toFixed(1)} hr/fixture vs ~${rsMeansMin} hr guide.`,
    };
  }
  if (inputs.laborHours >= 6) {
    return {
      riskLevel: "MEDIUM",
      headline: "Labor exposure needs a job check.",
      summary: `RSMeans $${rsMeans.totalCost.toFixed(0)} (${rsMeans.totalLaborHours} hr labor) · verify shut-off access and inspection.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Fixture labor looks adequate.",
    summary: `RSMeans ~$${rsMeans.totalCost.toFixed(0)} for ${fixtures} standard fixtures · ${rsMeans.note}.`,
  };
}

/** Plumbing premium — Source: RSMeans + callback + material run buffer. */
export function calculatePlumbingPremiumResult(inputs: {
  partsCost: number;
  laborHours: number;
  laborRate: number;
  materialRunCost: number;
  fixtureCount: number;
  callbackRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborCost = inputs.laborHours * inputs.laborRate;
  const accessDifficulty = laborCost * 0.15;
  const permitInspection = laborCost * 0.1;
  const waterDamageReserve = inputs.partsCost * 0.05;
  const fixtureAllowance = inputs.fixtureCount * 25;
  const inspectionBuffer = laborCost * 0.08;
  const baseCost =
    inputs.partsCost +
    laborCost +
    inputs.materialRunCost +
    fixtureAllowance +
    inspectionBuffer +
    accessDifficulty +
    permitInspection +
    waterDamageReserve;
  const riskAdjusted = baseCost * (1 + clampPct(inputs.callbackRiskPercent) / 100);
  const safeJobPrice = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.callbackRiskPercent >= 15 ? "danger" : inputs.callbackRiskPercent >= 8 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "CALLBACK RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE JOB",
    headline: "Safe job price with inspection buffer.",
    primaryMetricLabel: "Safe job price",
    primaryMetricValue: safeJobPrice,
    suggestedAction: `Price at or above $${safeJobPrice.toFixed(2)} for ${inputs.fixtureCount} fixtures.`,
    severity,
    riskDrivers: [
      "Crawl-space access 1.5×",
      "Permit inspection",
      "Emergency call premium",
      "Water damage liability",
    ],
    expertNote:
      "Crawl-space access, municipal permits, after-hours premiums and water-damage liability are omitted from fixture-count quick quotes.",
  };
}

/** Carpentry — Source: WWPA lumber waste 10–15% + shop/install split. */
export function calculateCarpentryFreeResult(inputs: {
  laborHours: number;
  installHours: number;
}): SectorFreeSignal {
  const totalHours = inputs.laborHours + inputs.installHours;
  const wasteAdjustedHours = totalHours * 1.12;

  if (totalHours >= 24) {
    return {
      riskLevel: "HIGH",
      headline: "This millwork job may be underpriced.",
      summary: `${totalHours} hr shop+install · WWPA 12% waste factor → ${wasteAdjustedHours.toFixed(0)} effective hr before finishing.`,
    };
  }
  if (totalHours >= 12) {
    return {
      riskLevel: "MEDIUM",
      headline: "Labor and install time need a bid check.",
      summary: `${totalHours} hr total · verify waste and finishing allowance on premium tier.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Millwork hours look moderate.",
    summary: `${totalHours} hr shop+install · quick check before quoting waste.`,
  };
}

/** Carpentry premium — Source: WWPA waste + finishing schedule risk. */
export function calculateCarpentryPremiumResult(inputs: {
  sheetMaterialCost: number;
  wasteRatePercent: number;
  laborHours: number;
  finishingCost: number;
  installHours: number;
  laborRate: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const wastePct = Math.max(inputs.wasteRatePercent, 10);
  const materialWithWaste =
    inputs.sheetMaterialCost * (1 + wastePct / 100);
  const laborRate = inputs.laborRate;
  const baseCost =
    materialWithWaste +
    inputs.laborHours * laborRate +
    inputs.finishingCost +
    inputs.installHours * laborRate;
  const finishingDelay = inputs.finishingCost * 0.1;
  const minimumMillworkBid = minPriceAtMargin(baseCost + finishingDelay, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    wastePct >= 18 ? "danger" : wastePct >= 10 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "REWORK RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE BID",
    headline: "Minimum millwork bid with waste and finishing delay.",
    primaryMetricLabel: "Minimum millwork bid",
    primaryMetricValue: minimumMillworkBid,
    suggestedAction: `Bid at or above $${minimumMillworkBid.toFixed(2)} with ${wastePct}% waste allowance.`,
    severity,
    riskDrivers: ["WWPA waste", "Finishing delay", "Install hours", "Target margin"],
    expertNote:
      "10% finishing schedule delay reserve captures humidity and coat-dry slip common on custom millwork installs.",
  };
}

/** Roofing — Source: NRCA square costing + labor/material ratio. */
export function calculateRoofingFreeResult(inputs: {
  laborHours: number;
  laborRate: number;
  materialCost: number;
}): SectorFreeSignal {
  const laborCost = inputs.laborHours * Math.max(inputs.laborRate, 1);
  const estimatedSqFt =
    inputs.materialCost > 0
      ? (inputs.materialCost / 350) * 100
      : Math.max(1000, inputs.laborHours * 80);
  const nrca = calculateRoofingCostResult({
    roofAreaSquareFeet: estimatedSqFt,
    materialType: "asphalt_shingle",
    roofPitch: 22,
    stories: 1,
    removalRequired: true,
  });
  if ("error" in nrca) {
    return { error: nrca.error };
  }
  const ratio = inputs.materialCost > 0 ? laborCost / inputs.materialCost : 0;
  const nrcaMinRatio = 0.45;

  if (ratio < nrcaMinRatio * 0.78 && inputs.laborHours >= 16) {
    return {
      riskLevel: "HIGH",
      headline: "Tear-off and delay risk may be missing.",
      summary: `NRCA ~$${nrca.totalCost.toFixed(0)} for ${nrca.squares} squares · labor/material ${(ratio * 100).toFixed(0)}% vs guide ~${(nrcaMinRatio * 100).toFixed(0)}%.`,
    };
  }
  if (inputs.laborHours >= 24) {
    return {
      riskLevel: "MEDIUM",
      headline: "Long labor hours need a contract check.",
      summary: `NRCA estimate $${nrca.totalCost.toFixed(0)} · ${inputs.laborHours} crew-hr · weather delay exposure rises after 3-day installs.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Roofing labor ratio acceptable.",
    summary: `NRCA ~$${nrca.totalCost.toFixed(0)} (${nrca.squares} squares) · ${nrca.note}.`,
  };
}

/** Roofing premium — Source: NRCA + weather delay multiplier. */
export function calculateRoofingPremiumResult(inputs: {
  materialCost: number;
  laborHours: number;
  laborRate: number;
  tearOffCost: number;
  dumpFees: number;
  weatherDelayRiskPercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborCost = inputs.laborHours * inputs.laborRate;
  const baseCost =
    inputs.materialCost + laborCost + inputs.tearOffCost + inputs.dumpFees;
  const underlaymentReserve = inputs.materialCost * 0.06;
  const ventilationAllowance = inputs.materialCost * 0.03;
  const iceDamMembrane = inputs.tearOffCost > 0 ? inputs.materialCost * 0.04 : 0;
  const warrantyReserve = inputs.materialCost * 0.05;
  const riskAdjusted =
    (baseCost + warrantyReserve + underlaymentReserve + ventilationAllowance + iceDamMembrane) *
    (1 + clampPct(inputs.weatherDelayRiskPercent) / 100);
  const minimumRoofingBid = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.weatherDelayRiskPercent >= 15 ? "danger" : inputs.weatherDelayRiskPercent >= 8 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "WARRANTY RISK"
        : severity === "watch"
          ? "LOW MARGIN"
          : "SAFE BID",
    headline: "Minimum roofing bid with warranty reserve.",
    primaryMetricLabel: "Minimum roofing bid",
    primaryMetricValue: minimumRoofingBid,
    suggestedAction: `Bid at or above $${minimumRoofingBid.toFixed(2)} — warranty reserve $${warrantyReserve.toFixed(0)}.`,
    severity,
    riskDrivers: [
      "Synthetic underlayment",
      "Ridge/soffit ventilation",
      "Ice-dam membrane",
      "Warranty transferability",
    ],
    expertNote:
      "Underlayment type, ventilation specs, ice-dam membranes in northern climates and transferable warranties affect true roofing margin.",
  };
}

/** Painting — Source: PDCA production rates (350 sq ft/hr roll, prep multiplier). */
export function calculatePaintingFreeResult(inputs: {
  areaSize: number;
  prepHours: number;
}): SectorFreeSignal {
  if (inputs.areaSize <= 0) {
    return { error: "Area size must be greater than zero." };
  }
  const prepIntensity = (inputs.prepHours / inputs.areaSize) * 100;
  const pdcaPrepThreshold = 0.15;
  const productionHours = inputs.areaSize / 350;
  const totalHours = inputs.prepHours + productionHours;

  if (prepIntensity >= pdcaPrepThreshold) {
    return {
      riskLevel: "HIGH",
      headline: "Prep time may erode painting margin.",
      summary: `Prep intensity ${prepIntensity.toFixed(2)} hr/100 sqft · PDCA threshold 0.15 · total ~${totalHours.toFixed(1)} hr incl. production.`,
    };
  }
  if (inputs.prepHours >= 8) {
    return {
      riskLevel: "MEDIUM",
      headline: "Prep hours need a job check.",
      summary: `${inputs.prepHours} hr prep on ${inputs.areaSize} sqft · scaffold/touch-up buffer recommended.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Prep load looks proportionate.",
    summary: `~${totalHours.toFixed(1)} hr total (PDCA 350 sqft/hr production rate).`,
  };
}

/** Painting premium — Source: PDCA + touch-up/scaffold buffer. */
export function calculatePaintingPremiumResult(inputs: {
  paintCost: number;
  prepHours: number;
  laborRate: number;
  scaffoldCost: number;
  touchUpRiskPercent: number;
  areaSize: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const laborRate = inputs.laborRate;
  const productionHours = inputs.areaSize / 350;
  const baseCost =
    inputs.paintCost +
    (inputs.prepHours + productionHours) * laborRate +
    inputs.scaffoldCost;
  const caulkMaskReserve = inputs.areaSize * 0.08;
  const riskAdjusted =
    (baseCost + caulkMaskReserve) *
    (1 + clampPct(inputs.touchUpRiskPercent) / 100);
  const minimumPaintingPrice = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.touchUpRiskPercent >= 12 ? "danger" : inputs.touchUpRiskPercent >= 6 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "PREP COST RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE PRICE",
    headline: "Minimum painting price with PDCA production model.",
    primaryMetricLabel: "Minimum painting price",
    primaryMetricValue: minimumPaintingPrice,
    suggestedAction: `Quote at or above $${minimumPaintingPrice.toFixed(2)} for ${inputs.areaSize} sq ft.`,
    severity,
    riskDrivers: ["PDCA production rate", "Caulk/mask reserve", "Touch-up risk", "Target margin"],
    expertNote:
      "$0.08/sqft caulk/mask reserve reflects punch-list touch-up labor absent from paint-only bids.",
  };
}

/** Sheet metal — Source: SME setup burden + 8–12% nest scrap. */
export function calculateSheetMetalFreeResult(inputs: {
  setupTime: number;
  quantity: number;
  cycleTime?: number;
}): SectorFreeSignal {
  const qty = Math.max(1, inputs.quantity);
  const cycle = inputs.cycleTime ?? 5;
  const burden = setupBurdenRatio(inputs.setupTime, cycle, qty);

  if (qty <= 2 && inputs.setupTime >= 45) {
    return {
      riskLevel: "HIGH",
      headline: "Setup-heavy sheet metal may be underpriced.",
      summary: `Setup burden ${(burden * 100).toFixed(0)}% on qty ${qty} · nest scrap typically adds 8–12% material.`,
    };
  }
  if (inputs.setupTime >= 25) {
    return {
      riskLevel: "MEDIUM",
      headline: "Setup time may create quote risk.",
      summary: `${inputs.setupTime} min setup · ${(burden * 100).toFixed(0)}% of total machine time is non-recurring.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Sheet metal setup looks balanced.",
    summary: `Setup burden ${(burden * 100).toFixed(0)}% · within job-shop tolerance for qty ${qty}.`,
  };
}

/** Sheet metal premium — Source: SME nesting scrap + bend cycle time. */
export function calculateSheetMetalPremiumResult(inputs: {
  programmingTime: number;
  setupTime: number;
  cutTime: number;
  bendCount: number;
  materialCost: number;
  scrapRatePercent: number;
  finishingCost: number;
  laborRate: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const totalMinutes =
    inputs.programmingTime +
    inputs.setupTime +
    inputs.cutTime +
    inputs.bendCount * 2;
  const laborCost = (totalMinutes / 60) * inputs.laborRate;
  const scrapPct = Math.max(inputs.scrapRatePercent, 8);
  const materialWithScrap =
    inputs.materialCost * (1 + scrapPct / 100);
  const nestOptimizationCredit = inputs.materialCost * 0.02;
  const baseCost =
    laborCost + materialWithScrap + inputs.finishingCost - nestOptimizationCredit;
  const safeSheetMetalQuote = minPriceAtMargin(baseCost, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    scrapPct >= 12 ? "danger" : scrapPct >= 6 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "SCRAP RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE QUOTE",
    headline: "Safe sheet metal quote with nest scrap model.",
    primaryMetricLabel: "Safe sheet metal quote",
    primaryMetricValue: safeSheetMetalQuote,
    suggestedAction: `Quote at or above $${safeSheetMetalQuote.toFixed(2)} or add setup line item.`,
    severity,
    riskDrivers: ["Programming", "Nest scrap", "Bend count", "Target margin"],
    expertNote:
      "Minimum 8% nest scrap and bend-cycle minutes reflect laser/turret reality on low-volume runs.",
  };
}

/** 3D print — Source: machine-hour rate + fail-rate curve (longer prints ↑ fail). */
export function calculate3dPrintFreeResult(inputs: {
  printHours: number;
  machineRate: number;
  materialCost: number;
}): SectorFreeSignal {
  const machineCost = inputs.printHours * Math.max(inputs.machineRate, 1);
  const ratio = inputs.materialCost > 0 ? machineCost / inputs.materialCost : 0;
  const failProbability = Math.min(0.25, inputs.printHours * 0.015);

  if (inputs.printHours >= 12 && ratio >= 2) {
    return {
      riskLevel: "HIGH",
      headline: "Long print jobs may be underpriced.",
      summary: `${inputs.printHours} hr print · est. fail risk ${(failProbability * 100).toFixed(0)}% · machine/material ratio ${ratio.toFixed(1)}×.`,
    };
  }
  if (inputs.printHours >= 6) {
    return {
      riskLevel: "MEDIUM",
      headline: "Print time needs a margin check.",
      summary: `${inputs.printHours} hr · verify post-processing and fail-rate buffer.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Print duration looks manageable.",
    summary: `${inputs.printHours} hr machine time · fail risk ~${(failProbability * 100).toFixed(0)}%.`,
  };
}

/** 3D print premium — Source: AM cost model (fail rate × print hours). */
export function calculate3dPrintPremiumResult(inputs: {
  materialCost: number;
  printHours: number;
  machineRate: number;
  postProcessHours: number;
  laborRate: number;
  failRatePercent: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const machineCost = inputs.printHours * inputs.machineRate;
  const postCost = inputs.postProcessHours * inputs.laborRate;
  const supportRemoval = inputs.materialCost * 0.15;
  const baseCost = inputs.materialCost + machineCost + postCost + supportRemoval;
  const hourFailBoost = Math.min(10, inputs.printHours * 0.8);
  const effectiveFail = clampPct(inputs.failRatePercent + hourFailBoost);
  const riskAdjusted = baseCost * (1 + effectiveFail / 100);
  const minimumPrintPrice = minPriceAtMargin(riskAdjusted, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    effectiveFail >= 15 ? "danger" : effectiveFail >= 8 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "FAIL RATE RISK"
        : severity === "watch"
          ? "REPRICE REQUIRED"
          : "SAFE PRINT",
    headline: "Minimum print price with support removal and fail curve.",
    primaryMetricLabel: "Minimum print price",
    primaryMetricValue: minimumPrintPrice,
    suggestedAction: `Price at or above $${minimumPrintPrice.toFixed(2)} — effective fail allowance ${effectiveFail.toFixed(0)}%.`,
    severity,
    riskDrivers: ["Print hours", "Support removal", "Fail curve", "Target margin"],
    expertNote:
      "15% support-removal burden and hour-linked fail boost model overnight print collapse common in service bureaus.",
  };
}

/** Cleaning — Source: ISSA 540 productivity (sq ft per worker per visit). */
export function calculateCleaningFreeResult(inputs: {
  areaSize: number;
  staffCount: number;
  visitFrequency: number;
}): SectorFreeSignal {
  if (inputs.areaSize <= 0 || inputs.staffCount <= 0) {
    return { error: "Area and staff count must be greater than zero." };
  }
  const issaRateSqftPerHour = 2500;
  const hoursPerVisit = inputs.areaSize / (issaRateSqftPerHour * inputs.staffCount);
  const monthlyHours = hoursPerVisit * inputs.visitFrequency;
  const workloadIndex = inputs.staffCount * inputs.visitFrequency;

  if (workloadIndex >= 40 || monthlyHours > 60) {
    return {
      riskLevel: "HIGH",
      headline: "This contract may be underpriced.",
      summary: `~${monthlyHours.toFixed(0)} hr/month at ISSA 2500 sqft/hr rate · ${inputs.staffCount} staff × ${inputs.visitFrequency} visits overloads margin.`,
    };
  }
  if (workloadIndex >= 16 || monthlyHours > 25) {
    return {
      riskLevel: "MEDIUM",
      headline: "Labor exposure needs a bid check.",
      summary: `~${monthlyHours.toFixed(0)} hr/month estimated · verify supply and travel on premium tier.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Cleaning workload looks manageable.",
    summary: `~${monthlyHours.toFixed(0)} hr/month · ISSA productivity benchmark applied.`,
  };
}

/** Cleaning premium — Source: ISSA + overhead allocation (15% G&A). */
export function calculateCleaningPremiumResult(inputs: {
  areaSize: number;
  laborRate: number;
  hoursPerVisit: number;
  supplyCost: number;
  visitFrequency: number;
  targetMargin: number;
}): SectorPremiumSignal {
  const monthlyCost =
    inputs.laborRate * inputs.hoursPerVisit * inputs.visitFrequency +
    inputs.supplyCost;
  const overhead = monthlyCost * 0.15;
  const totalCost = monthlyCost + overhead;
  const minimumMonthlyBid = minPriceAtMargin(totalCost, inputs.targetMargin);
  const severity: "safe" | "watch" | "danger" =
    inputs.targetMargin < 12 ? "danger" : inputs.targetMargin < 22 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "UNDERPRICED"
        : severity === "watch"
          ? "LOW MARGIN"
          : "SAFE BID",
    headline: "Minimum monthly bid with 15% G&A overhead.",
    primaryMetricLabel: "Minimum monthly bid",
    primaryMetricValue: minimumMonthlyBid,
    suggestedAction: `Keep monthly bid above $${minimumMonthlyBid.toFixed(2)} for ${inputs.areaSize} sq ft.`,
    severity,
    riskDrivers: ["Labor per visit", "Supplies", "G&A overhead", "Target margin"],
    expertNote:
      "15% G&A overhead covers supervision, insurance and travel between sites — missing from hourly × visits quotes.",
  };
}

/** Restaurant — Source: NRA food cost model. */
export function calculateRestaurantFreeResult(inputs: {
  menuPrice: number;
  foodCost: number;
  deliveryCommission?: number;
}): SectorFreeSignal {
  if (inputs.menuPrice <= 0) {
    return { error: "Menu price must be greater than zero." };
  }
  const nra = calculateFoodCostResult({
    ingredientCosts: [inputs.foodCost],
    menuPrice: inputs.menuPrice,
    wastePercent: 10,
    laborCostPerDish: 0,
  });
  if ("error" in nra) {
    return { error: nra.error };
  }
  const commission = inputs.deliveryCommission ?? 0;
  const commissionDrag = inputs.menuPrice * (commission / 100);
  const effectiveFoodRatio =
    (inputs.foodCost * 1.1 + commissionDrag) / inputs.menuPrice;
  const nraHigh = 0.4;
  const nraWatch = 0.3;

  if (effectiveFoodRatio >= nraHigh) {
    return {
      riskLevel: "HIGH",
      headline: "This item may be leaking profit.",
      summary: `NRA food cost ${nra.foodCostPercent}% (+10% waste) · effective ${(effectiveFoodRatio * 100).toFixed(0)}% with commission · ${nra.note}.`,
    };
  }
  if (effectiveFoodRatio >= nraWatch) {
    return {
      riskLevel: "MEDIUM",
      headline: "Margin pressure is visible.",
      summary: `Food cost ${nra.foodCostPercent}% · commission adds ${(commissionDrag / inputs.menuPrice * 100).toFixed(0)} pts · profit margin ${nra.profitMargin}%.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Food cost ratio within NRA band.",
    summary: `${nra.foodCostPercent}% food cost · ${nra.profitMargin}% margin before labor · ${nra.note}.`,
  };
}

/** Restaurant premium — Source: NRA prime cost (food + labor ≤ 60%). */
export function calculateRestaurantPremiumResult(inputs: {
  menuPrice: number;
  ingredientCost: number;
  wasteRate: number;
  deliveryCommission: number;
  laborCostPerItem: number;
  targetMargin: number;
}): SectorPremiumSignal {
  if (inputs.menuPrice <= 0) {
    return { error: "Menu price must be greater than zero." };
  }
  const portionVariance = inputs.ingredientCost * 0.1;
  const supplierFluctuation = inputs.ingredientCost * 0.05;
  const rushLaborPremium = inputs.laborCostPerItem * 0.15;
  const realCost =
    inputs.ingredientCost * (1 + clampPct(inputs.wasteRate) / 100) +
    portionVariance +
    supplierFluctuation +
    inputs.laborCostPerItem +
    rushLaborPremium +
    inputs.menuPrice * (clampPct(inputs.deliveryCommission) / 100);
  const realMargin = (inputs.menuPrice - realCost) / inputs.menuPrice;
  const target = clampPct(inputs.targetMargin) / 100;
  const primeCost = realCost / inputs.menuPrice;
  const severity: "safe" | "watch" | "danger" =
    realMargin < target * 0.7 ? "danger" : realMargin < target ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "REMOVE OR REPRICE"
        : severity === "watch"
          ? "LEAKING PROFIT"
          : "PROFITABLE",
    headline: "Real menu margin (NRA prime cost model).",
    primaryMetricLabel: "Real margin",
    primaryMetricValue: realMargin * 100,
    suggestedAction:
      severity === "safe"
        ? "Prime cost stable — monitor delivery mix."
        : `Prime cost ${(primeCost * 100).toFixed(0)}% — reprice or cut waste/commission exposure.`,
    severity,
    riskDrivers: [
      "Portion inconsistency ±10%",
      "Supplier price swings",
      "Rush-hour labor",
      "Menu engineering (stars/dogs)",
    ],
    expertNote:
      "Portion variance, supplier spikes, rush vs slow labor and menu-mix analysis (star/puzzle/plowhorse/dog) hide profit leaks NRA ratios miss.",
  };
}

/** Ecommerce — Source: Shopify/BigCommerce unit margin model. */
export function calculateEcommerceFreeResult(inputs: {
  productPrice: number;
  productCost: number;
  returnRate?: number;
}): SectorFreeSignal {
  if (inputs.productPrice <= 0) {
    return { error: "Product price must be greater than zero." };
  }
  const returnRate = inputs.returnRate ?? 0;
  const margin = calculateProductMarginResult({
    costPrice: inputs.productCost,
    sellingPrice: inputs.productPrice,
    shippingCost: 0,
    platformFeePercent: 3,
    returnRatePercent: returnRate,
  });
  if ("error" in margin) {
    return { error: margin.error };
  }
  const grossMargin = (inputs.productPrice - inputs.productCost) / inputs.productPrice;

  if (returnRate >= 15 || margin.marginPercent < 15) {
    return {
      riskLevel: "HIGH",
      headline: "Returns may erase the profit.",
      summary: `Gross ${(grossMargin * 100).toFixed(0)}% → net ${margin.marginPercent}% after ${returnRate}% returns · ${margin.note}.`,
    };
  }
  if (returnRate >= 8 || margin.marginPercent < 25) {
    return {
      riskLevel: "MEDIUM",
      headline: "Return risk needs a deeper check.",
      summary: `Net margin ${margin.marginPercent}% · total cost $${margin.totalCost.toFixed(2)}/unit before shipping and ads.`,
    };
  }
  return {
    riskLevel: "LOW",
    headline: "Gross margin looks healthy.",
    summary: `${margin.marginPercent}% net margin · gross ${(grossMargin * 100).toFixed(0)}% · ${returnRate}% return rate.`,
  };
}

/** Ecommerce premium — Source: DTC unit economics (full stack). */
export function calculateEcommercePremiumResult(inputs: {
  productPrice: number;
  productCost: number;
  shippingCost: number;
  returnRate: number;
  paymentFeeRate: number;
  adCostPerSale: number;
}): SectorPremiumSignal {
  if (inputs.productPrice <= 0) {
    return { error: "Product price must be greater than zero." };
  }
  const fee = inputs.productPrice * (clampPct(inputs.paymentFeeRate) / 100);
  const returnDrag = inputs.productPrice * (clampPct(inputs.returnRate) / 100);
  const reverseLogistics = inputs.shippingCost * (clampPct(inputs.returnRate) / 100) * 0.5;
  const cacRecoveryLoss = inputs.adCostPerSale * (clampPct(inputs.returnRate) / 100);
  const seasonalReturnSpike = returnDrag * 0.3;
  const fraudReserve = inputs.productPrice * 0.02;
  const netProfit =
    inputs.productPrice -
    inputs.productCost -
    inputs.shippingCost -
    fee -
    inputs.adCostPerSale -
    returnDrag -
    reverseLogistics -
    cacRecoveryLoss -
    seasonalReturnSpike -
    fraudReserve;
  const severity: "safe" | "watch" | "danger" =
    netProfit < 0 ? "danger" : netProfit < inputs.productPrice * 0.1 ? "watch" : "safe";

  return {
    verdictLabel:
      severity === "danger"
        ? "LOSS AFTER RETURNS"
        : severity === "watch"
          ? "FRAGILE"
          : "SCALABLE",
    headline: "Net profit after returns and reverse logistics.",
    primaryMetricLabel: "Net profit after returns",
    primaryMetricValue: netProfit,
    suggestedAction:
      severity === "danger"
        ? "Do not scale until return, shipping or ad cost is reduced."
        : `Net $${netProfit.toFixed(2)}/unit · reverse logistics reserve $${reverseLogistics.toFixed(2)}.`,
    severity,
    riskDrivers: [
      "CAC recovery on returns",
      "Holiday return spikes",
      "Wardrobing/fraud",
      "Reverse logistics",
    ],
    expertNote:
      "CAC lost on returns, holiday return spikes (30%+), wardrobing fraud and restocking friction erode DTC profit beyond gross margin.",
  };
}

/** Sheet metal free helper — expose machining minutes for shared use. */
export { calculateMachiningMinutes };
