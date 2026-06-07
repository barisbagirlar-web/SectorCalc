import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type {
 FreeRiskLevel,
 FreeToolInputValues,
 FreeToolResult,
} from "@/lib/tools/free-tool-results";
import {
 calculatePhase2FreeResult,
 isPhase2Sector,
} from "@/lib/tools/phase2-calculations";
import { calculateDesiResult } from "@/lib/tools/calculation-formulas";
import {
 type SectorFreeSignal,
 calculateWeldingFabFreeResult,
 calculateHvacFreeResult,
 calculateElectricalFreeResult,
 calculateLandscapingFreeResult,
 calculateAutoRepairFreeResult,
 calculatePrintingFreeResult,
 calculatePlumbingFreeResult,
 calculateCarpentryFreeResult,
 calculateRoofingFreeResult,
 calculatePaintingFreeResult,
 calculateSheetMetalFreeResult,
 calculate3dPrintFreeResult,
} from "@/lib/tools/sector-formulas-b";

export {
 calculateSpindleRpmResult,
 calculateFeedRateResult,
 calculateConcreteVolumeResult,
 calculateRebarWeightResult,
 calculateDesiResult,
 calculateFertilizerNpkResult,
 calculateIrrigationWaterResult,
 calculateCarbonFootprintResult,
 calculateHomeRenovationResult,
 calculateFuelConsumptionResult,
 calculateWeldingCostResult,
 calculateWeldingCostFromShopInputs,
 calculateHvacTonnageResult,
 calculateFoodCostResult,
 calculateProductMarginResult,
 calculateRepairTimeResult,
 calculatePlumbingCostResult,
 calculateRoofingCostResult,
} from "@/lib/tools/calculation-formulas";

function getNumber(values: FreeToolInputValues, key: string): number {
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

function buildGenericResult(
 riskLevel: FreeRiskLevel,
 headline: string,
 summary: string,
 missingFactors: string[]
): FreeToolResult {
 return {
 riskLevel,
 headline,
 summary,
 missingFactors,
 ctaLabel: "Unlock the Full Analyzer",
 };
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

export function isExtendedFreeSector(sector: string): boolean {
 return EXTENDED_SECTORS.has(sector);
}

function fromFreeSignal(
 signal: SectorFreeSignal,
 tool: RevenueTool
): FreeToolResult {
 if ("error" in signal) {
 return buildGenericResult(
 "MEDIUM",
 "Check your inputs.",
 signal.error,
 tool.freeMissingFactors.slice(0, 4)
 );
 }
 return buildGenericResult(
 signal.riskLevel,
 signal.headline,
 signal.summary,
 tool.freeMissingFactors.slice(0, 4)
 );
}

export function calculateExtendedFreeResult(
 tool: RevenueTool,
 values: FreeToolInputValues
): FreeToolResult | null {
 if (!EXTENDED_SECTORS.has(tool.sector)) {
 return null;
 }

 if (isPhase2Sector(tool.sector)) {
 return calculatePhase2FreeResult(tool, values);
 }

 if (tool.sector === "welding-fabrication") {
 return fromFreeSignal(
 calculateWeldingFabFreeResult({
 laborHours: getNumber(values, "laborHours"),
 fitUpHours: getNumber(values, "fitUpHours"),
 materialCost: getNumber(values, "materialCost"),
 laborRate: getNumber(values, "laborRate"),
 }),
 tool
 );
 }

 if (tool.sector === "hvac") {
 return fromFreeSignal(
 calculateHvacFreeResult({
 squareFootage: getNumber(values, "squareFootage"),
 tonnage: getNumber(values, "tonnage"),
 laborHours: getNumber(values, "laborHours"),
 }),
 tool
 );
 }

 if (tool.sector === "electrical-contracting") {
 return fromFreeSignal(
 calculateElectricalFreeResult({
 laborHours: getNumber(values, "laborHours"),
 laborRate: getNumber(values, "laborRate"),
 materialCost: getNumber(values, "materialCost"),
 }),
 tool
 );
 }

 if (tool.sector === "landscaping-lawn-care") {
 return fromFreeSignal(
 calculateLandscapingFreeResult({
 crewHoursPerVisit: getNumber(values, "crewHoursPerVisit"),
 visitsPerMonth: getNumber(values, "visitsPerMonth"),
 }),
 tool
 );
 }

 if (tool.sector === "auto-repair-shop") {
 return fromFreeSignal(
 calculateAutoRepairFreeResult({
 quotedPrice: getNumber(values, "quotedPrice"),
 repairHours: getNumber(values, "repairHours"),
 partsCost: getNumber(values, "partsCost"),
 }),
 tool
 );
 }

 if (tool.sector === "printing-signage") {
 return fromFreeSignal(
 calculatePrintingFreeResult({
 designHours: getNumber(values, "designHours"),
 laborRate: getNumber(values, "laborRate"),
 materialCost: getNumber(values, "materialCost"),
 }),
 tool
 );
 }

 if (tool.sector === "plumbing") {
 return fromFreeSignal(
 calculatePlumbingFreeResult({
 fixtureCount: getNumber(values, "fixtureCount"),
 laborHours: getNumber(values, "laborHours"),
 }),
 tool
 );
 }

 if (tool.sector === "carpentry-millwork") {
 return fromFreeSignal(
 calculateCarpentryFreeResult({
 laborHours: getNumber(values, "laborHours"),
 installHours: getNumber(values, "installHours"),
 }),
 tool
 );
 }

 if (tool.sector === "roofing") {
 return fromFreeSignal(
 calculateRoofingFreeResult({
 laborHours: getNumber(values, "laborHours"),
 laborRate: getNumber(values, "laborRate"),
 materialCost: getNumber(values, "materialCost"),
 }),
 tool
 );
 }

 if (tool.sector === "painting") {
 return fromFreeSignal(
 calculatePaintingFreeResult({
 areaSize: getNumber(values, "areaSize"),
 prepHours: getNumber(values, "prepHours"),
 }),
 tool
 );
 }

 if (tool.sector === "sheet-metal") {
 return fromFreeSignal(
 calculateSheetMetalFreeResult({
 setupTime: getNumber(values, "setupTime"),
 quantity: getNumber(values, "quantity"),
 }),
 tool
 );
 }

 if (tool.sector === "3d-printing-service") {
 return fromFreeSignal(
 calculate3dPrintFreeResult({
 printHours: getNumber(values, "printHours"),
 machineRate: getNumber(values, "machineRate"),
 materialCost: getNumber(values, "materialCost"),
 }),
 tool
 );
 }

 if (tool.sector === "logistics-transport") {
 const length = getNumber(values, "length");
 const width = getNumber(values, "width");
 const height = getNumber(values, "height");
 const quantity = Math.max(1, getNumber(values, "quantity"));
 const desiResult = calculateDesiResult({
 length,
 width,
 height,
 quantity,
 });
 if ("error" in desiResult) {
 return buildGenericResult(
 "MEDIUM",
 "Check package dimensions.",
 desiResult.error,
 tool.freeMissingFactors.slice(0, 4)
 );
 }
 const { desi } = desiResult;

 if (desi >= 100) {
 return buildGenericResult(
 "HIGH",
 "High desi — freight cost may spike.",
 `Total desi is ${desi} across ${quantity} package(s). Volumetric weight can exceed actual weight and inflate quotes.`,
 ["Deadhead return cost", "Toll fees", "Minimum safe freight price"]
 );
 }
 if (desi >= 40) {
 return buildGenericResult(
 "MEDIUM",
 "Moderate desi — verify carrier brackets.",
 `Total desi is ${desi}. Confirm carrier volumetric rules before locking the rate.`,
 ["Route tolls", "Empty return miles", "Full route verdict"]
 );
 }
 if (desi > 0) {
 return buildGenericResult(
 "LOW",
 `Total desi: ${desi} — within a typical bracket.`,
 `${quantity} package(s) at ${length}×${width}×${height} cm. Run the route analyzer before quoting long lanes with empty return.`,
 tool.freeMissingFactors.slice(0, 4)
 );
 }
 }

 return buildGenericResult(
 "LOW",
 "The quick check does not show severe visible risk.",
 "This result is only a quick estimate. Use the full analyzer before making pricing or bid decisions.",
 tool.freeMissingFactors.slice(0, 4)
 );
}
