import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type {
  PremiumSeverity,
  PremiumToolInputValues,
  PremiumToolResult,
} from "@/lib/tools/premium-tool-results";
import {
  calculatePhase2PremiumResult,
  isPhase2Sector,
} from "@/lib/tools/phase2-calculations";
import { calculateLogisticsRouteOptimizationResult } from "@/lib/tools/calculation-formulas";
import {
  type SectorPremiumSignal,
  calculateWeldingFabPremiumResult,
  calculateHvacPremiumResult,
  calculateElectricalPremiumResult,
  calculateLandscapingPremiumResult,
  calculateAutoRepairPremiumResult,
  calculatePrintingPremiumResult,
  calculatePlumbingPremiumResult,
  calculateCarpentryPremiumResult,
  calculateRoofingPremiumResult,
  calculatePaintingPremiumResult,
  calculateSheetMetalPremiumResult,
  calculate3dPrintPremiumResult,
} from "@/lib/tools/sector-formulas-b";

export {
  calculateCncMachiningTimeResult,
  calculateConstructionProjectRiskResult,
  calculateLogisticsRouteOptimizationResult,
  calculateCropYieldOptimizerResult,
  calculateCbamComplianceResult,
  calculateRenovationBudgetOptimizerResult,
} from "@/lib/tools/calculation-formulas";

function getNumber(values: PremiumToolInputValues, key: string): number {
  const raw = values[key];
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }
  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function money(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0.00";
  }
  return `$${Math.max(0, value).toFixed(2)}`;
}

function clampMargin(targetMargin: number): number {
  return Math.min(95, Math.max(0, targetMargin));
}

function minimumPrice(baseCost: number, targetMargin: number): number {
  const margin = clampMargin(targetMargin);
  if (margin >= 100) {
    return baseCost;
  }
  return baseCost / (1 - margin / 100);
}

const EXTENDED_SECTORS = new Set([
  "welding-fabrication",
  "hvac",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
  "logistics-transport",
  "agriculture-crops",
  "agriculture-irrigation",
  "agriculture-feed",
  "agriculture-dairy",
  "energy-consumption",
  "energy-carbon",
  "daily-renovation",
  "daily-fuel",
  "daily-meals",
]);

export function isExtendedPremiumSector(sector: string): boolean {
  return EXTENDED_SECTORS.has(sector);
}

function getSelectYes(values: PremiumToolInputValues, key: string): boolean {
  return values[key] === "yes";
}

function fromPremiumSignal(
  signal: SectorPremiumSignal,
  formatMetric: (value: number) => string = money
): PremiumToolResult {
  if ("error" in signal) {
    return {
      verdict: "REVIEW INPUTS",
      headline: "Inputs need correction.",
      primaryMetricLabel: "Result",
      primaryMetricValue: money(0),
      riskDrivers: ["Input validation"],
      suggestedAction: signal.error,
      severity: "watch",
    };
  }
  return {
    verdict: signal.verdictLabel,
    headline: signal.headline,
    primaryMetricLabel: signal.primaryMetricLabel,
    primaryMetricValue: formatMetric(signal.primaryMetricValue),
    riskDrivers: signal.riskDrivers,
    suggestedAction: signal.suggestedAction,
    severity: signal.severity,
  };
}

export function calculateExtendedPremiumResult(
  tool: RevenueTool,
  values: PremiumToolInputValues
): PremiumToolResult | null {
  if (!EXTENDED_SECTORS.has(tool.sector)) {
    return null;
  }

  if (isPhase2Sector(tool.sector)) {
    return calculatePhase2PremiumResult(tool, values);
  }

  const targetMargin = clampMargin(getNumber(values, "targetMargin"));

  if (tool.sector === "welding-fabrication") {
    return fromPremiumSignal(
      calculateWeldingFabPremiumResult({
        materialCost: getNumber(values, "materialCost"),
        laborHours: getNumber(values, "laborHours"),
        laborRate: getNumber(values, "laborRate"),
        gasConsumableCost: getNumber(values, "gasConsumableCost"),
        fitUpHours: getNumber(values, "fitUpHours"),
        reworkRiskPercent: getNumber(values, "reworkRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "hvac") {
    return fromPremiumSignal(
      calculateHvacPremiumResult({
        equipmentCost: getNumber(values, "equipmentCost"),
        ductworkCost: getNumber(values, "ductworkCost"),
        laborHours: getNumber(values, "laborHours"),
        laborRate: getNumber(values, "laborRate"),
        commissioningCost: getNumber(values, "commissioningCost"),
        callbackRiskPercent: getNumber(values, "callbackRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "electrical-contracting") {
    return fromPremiumSignal(
      calculateElectricalPremiumResult({
        materialCost: getNumber(values, "materialCost"),
        laborHours: getNumber(values, "laborHours"),
        laborRate: getNumber(values, "laborRate"),
        testingHours: getNumber(values, "testingHours"),
        inspectionRiskPercent: getNumber(values, "inspectionRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "landscaping-lawn-care") {
    return fromPremiumSignal(
      calculateLandscapingPremiumResult({
        crewHoursPerVisit: getNumber(values, "crewHoursPerVisit"),
        laborRate: getNumber(values, "laborRate"),
        visitsPerMonth: getNumber(values, "visitsPerMonth"),
        fuelCostPerVisit: getNumber(values, "fuelCostPerVisit"),
        supplyCostPerMonth: getNumber(values, "supplyCostPerMonth"),
        equipmentWearCost: getNumber(values, "equipmentWearCost"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "auto-repair-shop") {
    return fromPremiumSignal(
      calculateAutoRepairPremiumResult({
        diagnosticHours: getNumber(values, "diagnosticHours"),
        repairHours: getNumber(values, "repairHours"),
        laborRate: getNumber(values, "laborRate"),
        partsCost: getNumber(values, "partsCost"),
        partsMarkupPercent: getNumber(values, "partsMarkupPercent"),
        quotedPrice: getNumber(values, "quotedPrice"),
        comebackRiskPercent: getNumber(values, "comebackRiskPercent"),
      })
    );
  }

  if (tool.sector === "printing-signage") {
    return fromPremiumSignal(
      calculatePrintingPremiumResult({
        materialCost: getNumber(values, "materialCost"),
        inkCost: getNumber(values, "inkCost"),
        designHours: getNumber(values, "designHours"),
        installHours: getNumber(values, "installHours"),
        laborRate: getNumber(values, "laborRate"),
        reprintRiskPercent: getNumber(values, "reprintRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "plumbing") {
    return fromPremiumSignal(
      calculatePlumbingPremiumResult({
        partsCost: getNumber(values, "partsCost"),
        laborHours: getNumber(values, "laborHours"),
        laborRate: getNumber(values, "laborRate"),
        materialRunCost: getNumber(values, "materialRunCost"),
        fixtureCount: getNumber(values, "fixtureCount"),
        callbackRiskPercent: getNumber(values, "callbackRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "carpentry-millwork") {
    return fromPremiumSignal(
      calculateCarpentryPremiumResult({
        sheetMaterialCost: getNumber(values, "sheetMaterialCost"),
        wasteRatePercent: getNumber(values, "wasteRatePercent"),
        laborHours: getNumber(values, "laborHours"),
        finishingCost: getNumber(values, "finishingCost"),
        installHours: getNumber(values, "installHours"),
        laborRate: getNumber(values, "laborRate"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "roofing") {
    return fromPremiumSignal(
      calculateRoofingPremiumResult({
        materialCost: getNumber(values, "materialCost"),
        laborHours: getNumber(values, "laborHours"),
        laborRate: getNumber(values, "laborRate"),
        tearOffCost: getNumber(values, "tearOffCost"),
        dumpFees: getNumber(values, "dumpFees"),
        weatherDelayRiskPercent: getNumber(values, "weatherDelayRiskPercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "painting") {
    return fromPremiumSignal(
      calculatePaintingPremiumResult({
        paintCost: getNumber(values, "paintCost"),
        prepHours: getNumber(values, "prepHours"),
        laborRate: getNumber(values, "laborRate"),
        scaffoldCost: getNumber(values, "scaffoldCost"),
        touchUpRiskPercent: getNumber(values, "touchUpRiskPercent"),
        areaSize: getNumber(values, "areaSize"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "sheet-metal") {
    return fromPremiumSignal(
      calculateSheetMetalPremiumResult({
        programmingTime: getNumber(values, "programmingTime"),
        setupTime: getNumber(values, "setupTime"),
        cutTime: getNumber(values, "cutTime"),
        bendCount: getNumber(values, "bendCount"),
        materialCost: getNumber(values, "materialCost"),
        scrapRatePercent: getNumber(values, "scrapRatePercent"),
        finishingCost: getNumber(values, "finishingCost"),
        laborRate: getNumber(values, "laborRate"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "3d-printing-service") {
    return fromPremiumSignal(
      calculate3dPrintPremiumResult({
        materialCost: getNumber(values, "materialCost"),
        printHours: getNumber(values, "printHours"),
        machineRate: getNumber(values, "machineRate"),
        postProcessHours: getNumber(values, "postProcessHours"),
        laborRate: getNumber(values, "laborRate"),
        failRatePercent: getNumber(values, "failRatePercent"),
        targetMargin,
      })
    );
  }

  if (tool.sector === "logistics-transport") {
    const distanceKm = getNumber(values, "distanceKm");
    const fuelPricePerKm = getNumber(values, "fuelPricePerKm");
    const driverRate = getNumber(values, "driverHourlyRate");
    const hours = getNumber(values, "estimatedHours");
    const returnEmpty = getSelectYes(values, "returnEmpty");
    const hasTolls = getSelectYes(values, "hasTolls");
    const overweightRisk = getSelectYes(values, "overweightRisk");

    const routeResult = calculateLogisticsRouteOptimizationResult({
      distanceKm,
      fuelPricePerKm,
      driverHourlyRate: driverRate,
      estimatedHours: hours,
      returnEmpty,
      hasTolls,
      overweightRisk,
    });

    if ("error" in routeResult) {
      return {
        verdict: "REVIEW INPUTS",
        headline: "Route cost could not be calculated.",
        primaryMetricLabel: "Minimum safe freight price",
        primaryMetricValue: money(0),
        riskDrivers: ["Fuel & distance", "Driver hours", "Route inputs"],
        suggestedAction: routeResult.error,
        severity: "watch",
      };
    }

    const minimumSafeFreight = minimumPrice(routeResult.realTotalCost, targetMargin);
    let severity: PremiumSeverity = "safe";

    if (routeResult.verdictLabel.includes("HIGH RISK")) {
      severity = "danger";
    } else if (routeResult.verdictLabel.includes("MODERATE") || routeResult.verdictLabel.includes("TIME")) {
      severity = "watch";
    }

    if (overweightRisk && severity === "safe") {
      severity = "watch";
    }

    return {
      verdict: routeResult.verdictLabel,
      headline: "True route cost with hidden freight leaks modeled.",
      primaryMetricLabel: "Minimum safe freight price",
      primaryMetricValue: money(minimumSafeFreight),
      riskDrivers: [
        `Fuel ${money(routeResult.costBreakdown.fuel)}`,
        returnEmpty
          ? `Deadhead ${money(routeResult.costBreakdown.deadhead)}`
          : "No deadhead modeled",
        hasTolls ? `Tolls ${money(routeResult.costBreakdown.tolls)}` : "No tolls",
        hours > 11 ? "Driver HOS / delay risk" : "Drive time within window",
      ],
      suggestedAction: routeResult.suggestedAction,
      severity,
    };
  }

  return null;
}
