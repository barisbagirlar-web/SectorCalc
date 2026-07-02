/**
 * MarginCore Sector Risk Profiles - All 27 sectors
 *
 * Each sector has a unique `MarginCoreRiskProfile` defining:
 * - baseVolatility (σ/μ coefficient of variation)
 * - sectorRiskMultipliers (named cost-driver multipliers)
 * - cbamExposureIndex (0–1 carbon border exposure)
 * - macroShockVectors (probabilistic macro-economic shocks)
 *
 * These profiles are the "DNA" of each sector's risk model.
 * They are consumed by the central risk-engine (runMarginCoreEngine).
 */

import type { MarginCoreRiskProfile } from "@/lib/core/types/margincore-engine";

// ---------------------------------------------------------------------------
// Heavy Industry
// ---------------------------------------------------------------------------

export const CNC_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 toolBreakage: 1.08,
 setupOverrun: 1.06,
 materialScrap: 1.05,
 supplyChainDelay: 1.04,
 },
 cbamExposureIndex: 0.75,
 macroShockVectors: {
 steelPrice: { label: "Steel price spike", probability: 0.20, impactMultiplier: 1.18 },
 energyCost: { label: "Energy cost surge", probability: 0.15, impactMultiplier: 1.12 },
 },
};

export const WELDING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.25,
 sectorRiskMultipliers: {
 reworkRate: 1.10,
 fitUpOverrun: 1.07,
 consumableWaste: 1.04,
 inspectionFailure: 1.06,
 },
 cbamExposureIndex: 0.70,
 macroShockVectors: {
 steelPrice: { label: "Steel price spike", probability: 0.20, impactMultiplier: 1.18 },
 fillerMetal: { label: "Filler metal shortage", probability: 0.12, impactMultiplier: 1.15 },
 },
};

export const SHEET_METAL_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.20,
 sectorRiskMultipliers: {
 programmingSetup: 1.06,
 scrapRate: 1.08,
 toolingWear: 1.05,
 nestingInefficiency: 1.04,
 },
 cbamExposureIndex: 0.65,
 macroShockVectors: {
 sheetSteel: { label: "Sheet steel price spike", probability: 0.18, impactMultiplier: 1.16 },
 aluminumPrice: { label: "Aluminum price spike", probability: 0.12, impactMultiplier: 1.14 },
 },
};

export const PRINTING_3D_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.28,
 sectorRiskMultipliers: {
 printFailure: 1.12,
 postProcessing: 1.08,
 materialWaste: 1.06,
 supportRemoval: 1.04,
 },
 cbamExposureIndex: 0.25,
 macroShockVectors: {
 resinPrice: { label: "Resin/polymer price spike", probability: 0.15, impactMultiplier: 1.20 },
 machineDowntime: { label: "Machine downtime", probability: 0.10, impactMultiplier: 1.15 },
 },
};

// ---------------------------------------------------------------------------
// Building Trades
// ---------------------------------------------------------------------------

export const CONSTRUCTION_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.28,
 sectorRiskMultipliers: {
 changeOrder: 1.12,
 weatherDelay: 1.08,
 subcontractorOverrun: 1.06,
 permitDelay: 1.04,
 materialEscalation: 1.05,
 },
 cbamExposureIndex: 0.55,
 macroShockVectors: {
 lumberPrice: { label: "Lumber price spike", probability: 0.18, impactMultiplier: 1.22 },
 concretePrice: { label: "Concrete/cement spike", probability: 0.15, impactMultiplier: 1.12 },
 laborShortage: { label: "Labor shortage premium", probability: 0.20, impactMultiplier: 1.15 },
 },
};

export const HVAC_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 equipmentDelay: 1.08,
 ductworkComplexity: 1.06,
 callbackRisk: 1.07,
 refrigerantCost: 1.04,
 },
 cbamExposureIndex: 0.40,
 macroShockVectors: {
 copperPrice: { label: "Copper price spike", probability: 0.15, impactMultiplier: 1.18 },
 equipmentLeadTime: { label: "Equipment lead time extension", probability: 0.20, impactMultiplier: 1.12 },
 },
};

export const ELECTRICAL_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.20,
 sectorRiskMultipliers: {
 inspectionDelay: 1.06,
 materialEscalation: 1.08,
 testingTime: 1.05,
 reworkRisk: 1.04,
 },
 cbamExposureIndex: 0.30,
 macroShockVectors: {
 copperPrice: { label: "Copper price spike", probability: 0.15, impactMultiplier: 1.18 },
 panelShortage: { label: "Panel/switchgear shortage", probability: 0.12, impactMultiplier: 1.20 },
 },
};

export const PLUMBING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 partsRunDelay: 1.06,
 callbackRisk: 1.08,
 fixtureComplexity: 1.05,
 codeUpgrade: 1.04,
 },
 cbamExposureIndex: 0.20,
 macroShockVectors: {
 copperPrice: { label: "Copper/brass price spike", probability: 0.12, impactMultiplier: 1.15 },
 pvcShortage: { label: "PVC pipe shortage", probability: 0.08, impactMultiplier: 1.10 },
 },
};

export const ROOFING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.26,
 sectorRiskMultipliers: {
 tearOffSurprise: 1.10,
 weatherDelay: 1.08,
 dumpFeeIncrease: 1.04,
 warrantyRisk: 1.06,
 },
 cbamExposureIndex: 0.45,
 macroShockVectors: {
 asphaltPrice: { label: "Asphalt shingle price spike", probability: 0.15, impactMultiplier: 1.18 },
 lumberPrice: { label: "Lumber/truss price spike", probability: 0.12, impactMultiplier: 1.15 },
 },
};

export const PAINTING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.24,
 sectorRiskMultipliers: {
 prepTimeOverrun: 1.10,
 scaffoldCost: 1.06,
 touchUpRework: 1.08,
 surfaceCondition: 1.05,
 },
 cbamExposureIndex: 0.12,
 macroShockVectors: {
 paintPrice: { label: "Paint/coating price spike", probability: 0.12, impactMultiplier: 1.15 },
 leadAbatement: { label: "Lead paint abatement", probability: 0.08, impactMultiplier: 1.30 },
 },
};

// ---------------------------------------------------------------------------
// Field Services
// ---------------------------------------------------------------------------

export const CLEANING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.18,
 sectorRiskMultipliers: {
 staffTurnover: 1.08,
 reworkProbability: 1.05,
 supplyCostDrift: 1.04,
 travelTimeOverrun: 1.03,
 },
 cbamExposureIndex: 0.05,
 macroShockVectors: {
 minimumWage: { label: "Minimum wage increase", probability: 0.25, impactMultiplier: 1.12 },
 chemicalPrice: { label: "Cleaning chemical price spike", probability: 0.10, impactMultiplier: 1.15 },
 },
};

export const LANDSCAPING_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 fuelCostVariance: 1.08,
 equipmentWear: 1.06,
 crewHourOverrun: 1.05,
 weatherDisruption: 1.07,
 },
 cbamExposureIndex: 0.08,
 macroShockVectors: {
 fuelPrice: { label: "Fuel price spike", probability: 0.20, impactMultiplier: 1.18 },
 plantCost: { label: "Plant/nursery cost increase", probability: 0.10, impactMultiplier: 1.12 },
 },
};

export const AUTO_REPAIR_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.24,
 sectorRiskMultipliers: {
 diagnosticTime: 1.10,
 comebackRisk: 1.08,
 partsDelay: 1.06,
 warrantyClaim: 1.05,
 },
 cbamExposureIndex: 0.25,
 macroShockVectors: {
 partsPrice: { label: "OEM parts price spike", probability: 0.15, impactMultiplier: 1.18 },
 technicianShortage: { label: "Technician shortage premium", probability: 0.18, impactMultiplier: 1.12 },
 },
};

// ---------------------------------------------------------------------------
// Food & Retail
// ---------------------------------------------------------------------------

export const RESTAURANT_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.20,
 sectorRiskMultipliers: {
 foodWaste: 1.08,
 deliveryCommission: 1.06,
 laborOverhead: 1.05,
 ingredientDrift: 1.07,
 },
 cbamExposureIndex: 0.10,
 macroShockVectors: {
 foodInflation: { label: "Food price inflation", probability: 0.25, impactMultiplier: 1.15 },
 laborCost: { label: "Labor cost increase", probability: 0.20, impactMultiplier: 1.10 },
 },
};

export const ECOMMERCE_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.26,
 sectorRiskMultipliers: {
 returnRate: 1.10,
 adCostVariance: 1.08,
 paymentFee: 1.03,
 shippingSurcharge: 1.06,
 },
 cbamExposureIndex: 0.08,
 macroShockVectors: {
 cpcInflation: { label: "Ad CPC inflation", probability: 0.22, impactMultiplier: 1.20 },
 shippingRate: { label: "Shipping rate increase", probability: 0.18, impactMultiplier: 1.15 },
 },
};

// ---------------------------------------------------------------------------
// Custom Manufacturing
// ---------------------------------------------------------------------------

export const PRINTING_SIGNAGE_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 designTime: 1.08,
 reprintRisk: 1.10,
 installLabor: 1.06,
 materialWaste: 1.05,
 },
 cbamExposureIndex: 0.20,
 macroShockVectors: {
 vinylPrice: { label: "Vinyl/substrate price spike", probability: 0.12, impactMultiplier: 1.15 },
 inkCost: { label: "Ink/consumable cost increase", probability: 0.10, impactMultiplier: 1.12 },
 },
};

export const CARPENTRY_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.24,
 sectorRiskMultipliers: {
 wasteRate: 1.08,
 finishingTime: 1.07,
 installOverrun: 1.06,
 materialGradeChange: 1.05,
 },
 cbamExposureIndex: 0.18,
 macroShockVectors: {
 lumberPrice: { label: "Lumber price spike", probability: 0.18, impactMultiplier: 1.22 },
 hardwareCost: { label: "Hardware/fastener price increase", probability: 0.10, impactMultiplier: 1.10 },
 },
};

// ---------------------------------------------------------------------------
// Logistics & Transport
// ---------------------------------------------------------------------------

export const LOGISTICS_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.24,
 sectorRiskMultipliers: {
 emptyReturnMiles: 1.12,
 fuelVariance: 1.08,
 tollIncrease: 1.04,
 detentionTime: 1.06,
 },
 cbamExposureIndex: 0.55,
 macroShockVectors: {
 dieselPrice: { label: "Diesel price spike", probability: 0.25, impactMultiplier: 1.20 },
 driverShortage: { label: "Driver shortage premium", probability: 0.20, impactMultiplier: 1.12 },
 },
};

// ---------------------------------------------------------------------------
// Agriculture & Livestock
// ---------------------------------------------------------------------------

export const CROP_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.30,
 sectorRiskMultipliers: {
 weatherRisk: 1.12,
 fertilizerOverApplication: 1.08,
 pestDamage: 1.10,
 harvestLoss: 1.06,
 },
 cbamExposureIndex: 0.35,
 macroShockVectors: {
 fertilizerPrice: { label: "Fertilizer price spike", probability: 0.20, impactMultiplier: 1.25 },
 droughtRisk: { label: "Drought event", probability: 0.15, impactMultiplier: 1.30 },
 },
};

export const IRRIGATION_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.26,
 sectorRiskMultipliers: {
 pumpingCost: 1.08,
 waterRights: 1.06,
 systemMaintenance: 1.05,
 efficiencyLoss: 1.07,
 },
 cbamExposureIndex: 0.28,
 macroShockVectors: {
 energyPrice: { label: "Energy price spike (pumps)", probability: 0.18, impactMultiplier: 1.18 },
 waterScarcity: { label: "Water allocation cut", probability: 0.12, impactMultiplier: 1.25 },
 },
};

export const FEED_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.25,
 sectorRiskMultipliers: {
 feedWaste: 1.08,
 storageLoss: 1.06,
 priceVolatility: 1.10,
 conversionInefficiency: 1.05,
 },
 cbamExposureIndex: 0.40,
 macroShockVectors: {
 grainPrice: { label: "Grain price spike", probability: 0.22, impactMultiplier: 1.20 },
 soybeanPrice: { label: "Soybean meal price spike", probability: 0.18, impactMultiplier: 1.18 },
 },
};

export const DAIRY_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.24,
 sectorRiskMultipliers: {
 feedCostRatio: 1.10,
 yieldVariance: 1.08,
 vetCost: 1.04,
 cullRate: 1.05,
 },
 cbamExposureIndex: 0.45,
 macroShockVectors: {
 milkPrice: { label: "Milk price decline", probability: 0.20, impactMultiplier: 0.85 },
 feedCost: { label: "Feed cost spike", probability: 0.22, impactMultiplier: 1.20 },
 },
};

// ---------------------------------------------------------------------------
// Energy & Environment
// ---------------------------------------------------------------------------

export const ENERGY_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.20,
 sectorRiskMultipliers: {
 demandCharge: 1.10,
 peakOverrun: 1.08,
 tariffEscalation: 1.06,
 equipmentInefficiency: 1.05,
 },
 cbamExposureIndex: 0.60,
 macroShockVectors: {
 electricityPrice: { label: "Electricity price spike", probability: 0.18, impactMultiplier: 1.20 },
 naturalGasPrice: { label: "Natural gas price spike", probability: 0.15, impactMultiplier: 1.25 },
 },
};

export const CARBON_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.28,
 sectorRiskMultipliers: {
 carbonPriceVolatility: 1.15,
 scope3DataGap: 1.08,
 methodologyRisk: 1.06,
 auditCost: 1.04,
 },
 cbamExposureIndex: 0.90,
 macroShockVectors: {
 etsPrice: { label: "EU ETS carbon price spike", probability: 0.20, impactMultiplier: 1.30 },
 cbamExpansion: { label: "CBAM scope expansion", probability: 0.15, impactMultiplier: 1.25 },
 },
};

// ---------------------------------------------------------------------------
// Daily Life
// ---------------------------------------------------------------------------

export const RENOVATION_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.26,
 sectorRiskMultipliers: {
 weatherDelay: 1.08,
 scopeCreep: 1.10,
 permitDelay: 1.04,
 materialPriceDrift: 1.06,
 },
 cbamExposureIndex: 0.25,
 macroShockVectors: {
 lumberPrice: { label: "Lumber price spike", probability: 0.15, impactMultiplier: 1.18 },
 contractorPremium: { label: "Contractor rate increase", probability: 0.18, impactMultiplier: 1.12 },
 },
};

export const FUEL_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.22,
 sectorRiskMultipliers: {
 fuelPriceVariance: 1.10,
 tollSurprise: 1.04,
 routeDeviation: 1.06,
 vehicleMaintenance: 1.05,
 },
 cbamExposureIndex: 0.50,
 macroShockVectors: {
 gasolinePrice: { label: "Gasoline price spike", probability: 0.22, impactMultiplier: 1.20 },
 dieselPrice: { label: "Diesel price spike", probability: 0.20, impactMultiplier: 1.18 },
 },
};

export const MEALS_RISK_PROFILE: MarginCoreRiskProfile = {
 baseVolatility: 0.15,
 sectorRiskMultipliers: {
 foodWaste: 1.06,
 ingredientDrift: 1.08,
 portionOverrun: 1.04,
 premiumSubstitution: 1.05,
 },
 cbamExposureIndex: 0.04,
 macroShockVectors: {
 foodInflation: { label: "Food price inflation", probability: 0.20, impactMultiplier: 1.12 },
 seasonalSpike: { label: "Seasonal ingredient spike", probability: 0.15, impactMultiplier: 1.18 },
 },
};

// ---------------------------------------------------------------------------
// Lookup Map
// ---------------------------------------------------------------------------

/** Map of sector slug → risk profile */
export const SECTOR_RISK_PROFILES: Record<string, MarginCoreRiskProfile> = {
 // Heavy Industry
 "cnc-manufacturing": CNC_RISK_PROFILE,
 "welding-fabrication": WELDING_RISK_PROFILE,
 "sheet-metal": SHEET_METAL_RISK_PROFILE,
 "3d-printing-service": PRINTING_3D_RISK_PROFILE,

 // Building Trades
 "construction": CONSTRUCTION_RISK_PROFILE,
 "hvac": HVAC_RISK_PROFILE,
 "electrical-contracting": ELECTRICAL_RISK_PROFILE,
 "plumbing": PLUMBING_RISK_PROFILE,
 "roofing": ROOFING_RISK_PROFILE,
 "painting": PAINTING_RISK_PROFILE,

 // Field Services
 "cleaning": CLEANING_RISK_PROFILE,
 "landscaping-lawn-care": LANDSCAPING_RISK_PROFILE,
 "auto-repair-shop": AUTO_REPAIR_RISK_PROFILE,

 // Food & Retail
 "restaurant": RESTAURANT_RISK_PROFILE,
 "ecommerce": ECOMMERCE_RISK_PROFILE,

 // Custom Manufacturing
 "printing-signage": PRINTING_SIGNAGE_RISK_PROFILE,
 "carpentry-millwork": CARPENTRY_RISK_PROFILE,

 // Logistics
 "logistics-transport": LOGISTICS_RISK_PROFILE,

 // Agriculture
 "agriculture-crops": CROP_RISK_PROFILE,
 "agriculture-irrigation": IRRIGATION_RISK_PROFILE,
 "agriculture-feed": FEED_RISK_PROFILE,
 "agriculture-dairy": DAIRY_RISK_PROFILE,

 // Energy
 "energy-consumption": ENERGY_RISK_PROFILE,
 "energy-carbon": CARBON_RISK_PROFILE,

 // Daily Life
 "daily-renovation": RENOVATION_RISK_PROFILE,
 "daily-fuel": FUEL_RISK_PROFILE,
 "daily-meals": MEALS_RISK_PROFILE,
};

/** Get risk profile for a sector, with fallback */
export function getSectorRiskProfile(sectorSlug: string): MarginCoreRiskProfile {
 return SECTOR_RISK_PROFILES[sectorSlug] ?? {
 baseVolatility: 0.20,
 sectorRiskMultipliers: { genericRisk: 1.05 },
 cbamExposureIndex: 0,
 };
}