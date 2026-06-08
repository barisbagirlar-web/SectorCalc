#!/usr/bin/env npx tsx
/**
 * Generates FormulaContract + oracle governance files for traffic catalog gap slugs.
 * Read-only on production calculators — mirrors formulas in independent oracle module.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

type CatalogInput = {
  readonly key: string;
  readonly min?: number;
};

type CatalogEntry = {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly resultType?: string;
  readonly inputs: readonly CatalogInput[];
};

type ParseKind = "plain" | "currency" | "percent" | "integer";

type OracleField = {
  readonly key: string;
  readonly expr: string;
};

type SlugOracleDef = {
  readonly primaryKey: string;
  readonly parseKind: ParseKind;
  readonly fields: readonly OracleField[];
  readonly formulaSummary: string;
  readonly productionEntry: string;
};

const EXISTING_CONTRACT_SLUGS = new Set([
  "loan-payment-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "compound-interest-calculator",
  "profit-margin-calculator",
  "break-even-calculator",
  "salary-cost-calculator",
  "cash-flow-gap-calculator",
  "machine-time-calculator",
  "rent-vs-buy-calculator",
  "food-cost-calculator",
  "welding-cost-estimator",
  "sample-size-calculator",
  "laser-cutting-time-check",
  "3d-print-cost-check",
]);

/** Contract unsafe without unit-string mapping review. */
const CONTRACT_DEFERRED_SLUGS = new Set([
  "length-converter",
  "weight-converter",
  "area-converter",
  "volume-converter",
  "temperature-converter",
  "ratio-calculator",
]);

function n(key: string): string {
  return `n(values, "${key}")`;
}

function sd(num: string, den: string): string {
  return `safeDiv(${num}, ${den})`;
}

const SLUG_ORACLE_DEFS: Record<string, SlugOracleDef> = {
  "square-meter-calculator": {
    primaryKey: "area",
    parseKind: "plain",
    fields: [{ key: "area", expr: `${n("length")} * ${n("width")}` }],
    formulaSummary: "Area = length × width (m²).",
    productionEntry: "length × width",
  },
  "square-footage-calculator": {
    primaryKey: "area",
    parseKind: "plain",
    fields: [{ key: "area", expr: `${n("length")} * ${n("width")}` }],
    formulaSummary: "Area = length × width (ft²).",
    productionEntry: "length × width",
  },
  "concrete-volume-calculator": {
    primaryKey: "volume",
    parseKind: "plain",
    fields: [{ key: "volume", expr: `${n("length")} * ${n("width")} * ${n("depth")}` }],
    formulaSummary: "Volume = length × width × depth.",
    productionEntry: "length × width × depth",
  },
  "concrete-bag-calculator": {
    primaryKey: "bags",
    parseKind: "integer",
    fields: [
      { key: "adjustedVolume", expr: `${n("volumeM3")} * (1 + ${n("wastePercent")} / 100)` },
      { key: "bags", expr: `Math.ceil(${sd("adjustedVolume", n("bagYieldM3"))})` },
    ],
    formulaSummary: "Bags = ceil(volume × (1 + waste%) ÷ yield per bag).",
    productionEntry: "ceil(volume × (1 + waste%) ÷ bag yield)",
  },
  "paint-coverage-calculator": {
    primaryKey: "liters",
    parseKind: "plain",
    fields: [{ key: "liters", expr: `${sd(`${n("areaM2")} * ${n("coats")}`, n("coveragePerLiter"))}` }],
    formulaSummary: "Liters = area × coats ÷ coverage per liter.",
    productionEntry: "area × coats ÷ coverage",
  },
  "tile-calculator": {
    primaryKey: "tiles",
    parseKind: "integer",
    fields: [
      { key: "tileAreaM2", expr: `${sd(`${n("tileLengthCm")} * ${n("tileWidthCm")}`, "10000")}` },
      {
        key: "tiles",
        expr: `Math.ceil(${sd(n("areaM2"), "tileAreaM2")} * (1 + ${n("wastePercent")} / 100))`,
      },
    ],
    formulaSummary: "Tiles = ceil(floor area ÷ tile area × (1 + waste%)).",
    productionEntry: "ceil(area ÷ tile area × (1 + waste%))",
  },
  "flooring-calculator": {
    primaryKey: "materialArea",
    parseKind: "plain",
    fields: [
      { key: "netArea", expr: `${n("roomLengthM")} * ${n("roomWidthM")}` },
      { key: "materialArea", expr: `netArea * (1 + ${n("wastePercent")} / 100)` },
    ],
    formulaSummary: "Material = room area × (1 + waste%).",
    productionEntry: "room area × (1 + waste%)",
  },
  "roofing-area-calculator": {
    primaryKey: "roofArea",
    parseKind: "plain",
    fields: [{ key: "roofArea", expr: `${n("lengthM")} * ${n("widthM")} * ${n("pitchFactor")}` }],
    formulaSummary: "Roof area = length × width × pitch factor.",
    productionEntry: "length × width × pitch factor",
  },
  "stair-calculator": {
    primaryKey: "steps",
    parseKind: "integer",
    fields: [
      { key: "steps", expr: `Math.ceil(${sd(n("totalRiseCm"), n("riserHeightCm"))})` },
      { key: "runM", expr: `${sd(`steps * ${n("treadDepthCm")}`, "100")}` },
    ],
    formulaSummary: "Steps = ceil(total rise ÷ riser height).",
    productionEntry: "ceil(rise ÷ riser)",
  },
  "drywall-calculator": {
    primaryKey: "sheets",
    parseKind: "integer",
    fields: [
      {
        key: "sheets",
        expr: `Math.ceil(${sd(n("wallAreaM2"), n("sheetAreaM2"))} * (1 + ${n("wastePercent")} / 100))`,
      },
    ],
    formulaSummary: "Sheets = ceil(wall area ÷ sheet area × (1 + waste%)).",
    productionEntry: "ceil(wall ÷ sheet × waste)",
  },
  "brick-calculator": {
    primaryKey: "bricks",
    parseKind: "integer",
    fields: [
      {
        key: "bricks",
        expr: `Math.ceil(${n("wallAreaM2")} * ${n("bricksPerM2")} * (1 + ${n("wastePercent")} / 100))`,
      },
    ],
    formulaSummary: "Bricks = ceil(wall area × bricks/m² × (1 + waste%)).",
    productionEntry: "ceil(wall × rate × waste)",
  },
  "rebar-weight-calculator": {
    primaryKey: "totalKg",
    parseKind: "plain",
    fields: [
      { key: "kgPerM", expr: `${sd(`${n("diameterMm")} * ${n("diameterMm")}`, "162")}` },
      { key: "totalKg", expr: `kgPerM * ${n("lengthM")} * ${n("quantity")}` },
    ],
    formulaSummary: "Weight/m = diameter² ÷ 162; total = kg/m × length × qty.",
    productionEntry: "diameter² ÷ 162 × length × qty",
  },
  "excavation-volume-calculator": {
    primaryKey: "volume",
    parseKind: "plain",
    fields: [{ key: "volume", expr: `${n("lengthM")} * ${n("widthM")} * ${n("depthM")}` }],
    formulaSummary: "Volume = length × width × depth.",
    productionEntry: "L × W × D",
  },
  "plaster-calculator": {
    primaryKey: "weightKg",
    parseKind: "plain",
    fields: [
      { key: "volumeM3", expr: `${n("areaM2")} * ${sd(n("thicknessMm"), "1000")}` },
      { key: "weightKg", expr: `volumeM3 * ${n("densityKgM3")}` },
    ],
    formulaSummary: "Weight = area × thickness × density.",
    productionEntry: "area × thickness × density",
  },
  "home-renovation-m2-calculator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      { key: "baseCost", expr: `${n("areaM2")} * ${n("costPerM2")}` },
      { key: "totalCost", expr: `baseCost * (1 + ${n("contingencyPercent")} / 100)` },
    ],
    formulaSummary: "Cost = area × rate × (1 + contingency%).",
    productionEntry: "area × rate × contingency",
  },
  "vat-calculator": {
    primaryKey: "gross",
    parseKind: "plain",
    fields: [
      { key: "vat", expr: `${n("net")} * (${n("vatRate")} / 100)` },
      { key: "gross", expr: `${n("net")} + vat` },
    ],
    formulaSummary: "Gross = net + net × VAT rate.",
    productionEntry: "net + net × VAT%",
  },
  "discount-calculator": {
    primaryKey: "salePrice",
    parseKind: "currency",
    fields: [
      { key: "salePrice", expr: `${n("originalPrice")} * (1 - ${n("discountPercent")} / 100)` },
      { key: "saved", expr: `${n("originalPrice")} - salePrice` },
    ],
    formulaSummary: "Sale = original × (1 − discount%).",
    productionEntry: "original × (1 − discount%)",
  },
  "percentage-calculator": {
    primaryKey: "result",
    parseKind: "plain",
    fields: [{ key: "result", expr: `${n("value")} * (${n("percent")} / 100)` }],
    formulaSummary: "Result = value × percent ÷ 100.",
    productionEntry: "value × percent ÷ 100",
  },
  "roi-calculator": {
    primaryKey: "roiPercent",
    parseKind: "percent",
    fields: [
      { key: "netGain", expr: `${n("gain")} - ${n("cost")}` },
      { key: "roiPercent", expr: `${sd("netGain", n("cost"))} * 100` },
    ],
    formulaSummary: "ROI = (gain − cost) ÷ cost × 100.",
    productionEntry: "(gain − cost) ÷ cost × 100",
  },
  "hourly-rate-calculator": {
    primaryKey: "hourlyRate",
    parseKind: "currency",
    fields: [{ key: "hourlyRate", expr: `${sd(n("monthlyIncome"), n("billableHours"))}` }],
    formulaSummary: "Rate = monthly income ÷ billable hours.",
    productionEntry: "income ÷ hours",
  },
  "depreciation-calculator": {
    primaryKey: "annualDepreciation",
    parseKind: "currency",
    fields: [
      {
        key: "annualDepreciation",
        expr: `${sd(`${n("assetCost")} - ${n("salvageValue")}`, n("usefulLifeYears"))}`,
      },
    ],
    formulaSummary: "Annual = (cost − salvage) ÷ useful life.",
    productionEntry: "(cost − salvage) ÷ life",
  },
  "unit-cost-calculator": {
    primaryKey: "unitCost",
    parseKind: "currency",
    fields: [{ key: "unitCost", expr: `${sd(n("totalCost"), n("quantity"))}` }],
    formulaSummary: "Unit cost = total ÷ quantity.",
    productionEntry: "total ÷ quantity",
  },
  "cnc-cycle-time-calculator": {
    primaryKey: "totalSeconds",
    parseKind: "integer",
    fields: [
      {
        key: "perPartSeconds",
        expr: `${n("machiningSeconds")} + ${n("loadUnloadSeconds")} + ${n("inspectionSeconds")}`,
      },
      { key: "totalSeconds", expr: `perPartSeconds * ${n("quantity")}` },
    ],
    formulaSummary: "Total = (machining + load/unload + inspection) × quantity.",
    productionEntry: "per-part seconds × qty",
  },
  "sheet-metal-weight-calculator": {
    primaryKey: "weightKg",
    parseKind: "plain",
    fields: [
      { key: "thicknessM", expr: `${sd(n("thicknessMm"), "1000")}` },
      {
        key: "weightKg",
        expr: `${n("lengthM")} * ${n("widthM")} * thicknessM * ${n("densityKgM3")}`,
      },
    ],
    formulaSummary: "Weight = L × W × thickness × density.",
    productionEntry: "L × W × t × density",
  },
  "material-waste-calculator": {
    primaryKey: "wastePercent",
    parseKind: "percent",
    fields: [
      { key: "wasteKg", expr: `${n("inputMaterialKg")} - ${n("goodOutputKg")}` },
      { key: "wastePercent", expr: `${sd("wasteKg", n("inputMaterialKg"))} * 100` },
    ],
    formulaSummary: "Waste % = (input − output) ÷ input × 100.",
    productionEntry: "(input − output) ÷ input",
  },
  "scrap-rate-calculator": {
    primaryKey: "scrapRatePercent",
    parseKind: "percent",
    fields: [{ key: "scrapRatePercent", expr: `${sd(n("scrapUnits"), n("totalUnits"))} * 100` }],
    formulaSummary: "Scrap rate = scrap ÷ total × 100.",
    productionEntry: "scrap ÷ total × 100",
  },
  "oee-calculator": {
    primaryKey: "oeePercent",
    parseKind: "percent",
    fields: [
      {
        key: "oeePercent",
        expr: `(${n("availabilityPercent")} / 100) * (${n("performancePercent")} / 100) * (${n("qualityPercent")} / 100) * 100`,
      },
    ],
    formulaSummary: "OEE = availability × performance × quality.",
    productionEntry: "A × P × Q",
  },
  "machine-hour-rate-calculator": {
    primaryKey: "hourlyRate",
    parseKind: "currency",
    fields: [
      { key: "fixedHourly", expr: `${sd(n("fixedMonthlyCost"), n("monthlyMachineHours"))}` },
      { key: "hourlyRate", expr: `fixedHourly + ${n("variableCostPerHour")}` },
    ],
    formulaSummary: "Rate = fixed monthly ÷ hours + variable/hour.",
    productionEntry: "fixed/hours + variable",
  },
  "tool-life-calculator": {
    primaryKey: "costPerPart",
    parseKind: "currency",
    fields: [{ key: "costPerPart", expr: `${sd(n("totalToolCost"), n("partsProduced"))}` }],
    formulaSummary: "Cost/part = tool cost ÷ parts produced.",
    productionEntry: "tool ÷ parts",
  },
  "cutting-speed-calculator": {
    primaryKey: "cuttingSpeed",
    parseKind: "plain",
    fields: [
      {
        key: "cuttingSpeed",
        expr: `${sd(`Math.PI * ${n("diameterMm")} * ${n("rpm")}`, "1000")}`,
      },
    ],
    formulaSummary: "Vc = π × diameter × rpm ÷ 1000.",
    productionEntry: "π × D × rpm ÷ 1000",
  },
  "feed-rate-calculator": {
    primaryKey: "feedRate",
    parseKind: "plain",
    fields: [{ key: "feedRate", expr: `${n("rpm")} * ${n("teeth")} * ${n("feedPerToothMm")}` }],
    formulaSummary: "Feed = rpm × teeth × feed/tooth.",
    productionEntry: "rpm × teeth × fz",
  },
  "tolerance-drift-calculator": {
    primaryKey: "drift",
    parseKind: "plain",
    fields: [
      { key: "drift", expr: `${n("actual")} - ${n("target")}` },
      { key: "driftPercent", expr: `${sd("drift", n("target"))} * 100` },
    ],
    formulaSummary: "Drift = actual − target.",
    productionEntry: "actual − target",
  },
  "batch-yield-calculator": {
    primaryKey: "yieldPercent",
    parseKind: "percent",
    fields: [{ key: "yieldPercent", expr: `${sd(n("goodOutputQty"), n("inputQty"))} * 100` }],
    formulaSummary: "Yield = good output ÷ input × 100.",
    productionEntry: "good ÷ input × 100",
  },
  "kwh-cost-calculator": {
    primaryKey: "cost",
    parseKind: "currency",
    fields: [{ key: "cost", expr: `${n("kwh")} * ${n("rate")}` }],
    formulaSummary: "Cost = kWh × rate.",
    productionEntry: "kWh × rate",
  },
  "electricity-bill-calculator": {
    primaryKey: "totalBill",
    parseKind: "currency",
    fields: [
      { key: "variableCharge", expr: `${n("kwh")} * ${n("rate")}` },
      { key: "totalBill", expr: `variableCharge + ${n("fixedCharge")}` },
    ],
    formulaSummary: "Bill = kWh × rate + fixed charge.",
    productionEntry: "kWh × rate + fixed",
  },
  "energy-consumption-check": {
    primaryKey: "energyCost",
    parseKind: "currency",
    fields: [
      { key: "kwh", expr: `${n("powerKw")} * ${n("hoursPerDay")} * ${n("days")}` },
      { key: "energyCost", expr: `kwh * ${n("rate")}` },
    ],
    formulaSummary: "kWh = power × hours × days; cost = kWh × rate.",
    productionEntry: "power × hours × days × rate",
  },
  "carbon-footprint-quick": {
    primaryKey: "kgCo2",
    parseKind: "plain",
    fields: [{ key: "kgCo2", expr: `${n("energyKwh")} * ${n("emissionFactorKgPerKwh")}` }],
    formulaSummary: "CO₂ = energy × emission factor.",
    productionEntry: "kWh × factor",
  },
  "fuel-emission-calculator": {
    primaryKey: "kgCo2",
    parseKind: "plain",
    fields: [{ key: "kgCo2", expr: `${n("litersFuel")} * ${n("kgCo2PerLiter")}` }],
    formulaSummary: "CO₂ = liters × kg CO₂/L.",
    productionEntry: "liters × factor",
  },
  "solar-panel-output-calculator": {
    primaryKey: "kwh",
    parseKind: "plain",
    fields: [
      {
        key: "kwh",
        expr: `${n("systemKw")} * ${n("sunHoursPerDay")} * ${n("days")} * (${n("efficiencyPercent")} / 100)`,
      },
    ],
    formulaSummary: "Output = kW × sun hours × days × efficiency.",
    productionEntry: "kW × sun × days × eff",
  },
  "heat-loss-calculator": {
    primaryKey: "watts",
    parseKind: "plain",
    fields: [{ key: "watts", expr: `${n("uValue")} * ${n("areaM2")} * ${n("tempDifferenceC")}` }],
    formulaSummary: "Heat loss = U × area × ΔT.",
    productionEntry: "U × area × ΔT",
  },
  "boiler-efficiency-calculator": {
    primaryKey: "efficiencyPercent",
    parseKind: "percent",
    fields: [
      {
        key: "efficiencyPercent",
        expr: `${sd(n("usefulOutputKwh"), n("fuelInputKwh"))} * 100`,
      },
    ],
    formulaSummary: "Efficiency = useful ÷ fuel input × 100.",
    productionEntry: "useful ÷ input × 100",
  },
  "compressor-energy-cost-calculator": {
    primaryKey: "energyCost",
    parseKind: "currency",
    fields: [
      { key: "kwh", expr: `${n("powerKw")} * ${n("operatingHours")}` },
      { key: "energyCost", expr: `kwh * ${n("rate")}` },
    ],
    formulaSummary: "Cost = power × hours × rate.",
    productionEntry: "kW × hours × rate",
  },
  "cbam-exposure-quick-check": {
    primaryKey: "exposure",
    parseKind: "currency",
    fields: [{ key: "exposure", expr: `${n("emissionsTon")} * ${n("carbonPrice")}` }],
    formulaSummary: "Exposure = emissions × carbon price.",
    productionEntry: "tonnes × price",
  },
  "fuel-consumption-calculator": {
    primaryKey: "fuelCost",
    parseKind: "currency",
    fields: [
      { key: "fuelLiters", expr: `${sd(n("distanceKm"), "100")} * ${n("consumptionPer100Km")}` },
      { key: "fuelCost", expr: `fuelLiters * ${n("fuelPrice")}` },
    ],
    formulaSummary: "Fuel = distance ÷ 100 × consumption; cost = fuel × price.",
    productionEntry: "fuelTrip",
  },
  "fuel-cost-calculator": {
    primaryKey: "fuelCost",
    parseKind: "currency",
    fields: [
      { key: "fuelLiters", expr: `${sd(n("distanceKm"), "100")} * ${n("consumptionPer100Km")}` },
      { key: "fuelCost", expr: `fuelLiters * ${n("fuelPrice")}` },
    ],
    formulaSummary: "Fuel = distance ÷ 100 × consumption; cost = fuel × price.",
    productionEntry: "fuelTrip",
  },
  "fuel-travel-calculator": {
    primaryKey: "fuelCost",
    parseKind: "currency",
    fields: [
      { key: "fuelLiters", expr: `${sd(n("distanceKm"), "100")} * ${n("consumptionPer100Km")}` },
      { key: "fuelCost", expr: `fuelLiters * ${n("fuelPrice")}` },
    ],
    formulaSummary: "Fuel = distance ÷ 100 × consumption; cost = fuel × price.",
    productionEntry: "fuelTrip",
  },
  "desi-calculator": {
    primaryKey: "volumetricWeight",
    parseKind: "plain",
    fields: [
      {
        key: "volumetricWeight",
        expr: `${sd(`${n("lengthCm")} * ${n("widthCm")} * ${n("heightCm")}`, n("divisor"))}`,
      },
    ],
    formulaSummary: "Desi = L × W × H ÷ divisor.",
    productionEntry: "L×W×H÷divisor",
  },
  "volumetric-weight-calculator": {
    primaryKey: "volumetricWeight",
    parseKind: "plain",
    fields: [
      {
        key: "volumetricWeight",
        expr: `${sd(`${n("lengthCm")} * ${n("widthCm")} * ${n("heightCm")}`, n("divisor"))}`,
      },
    ],
    formulaSummary: "Volumetric weight = L × W × H ÷ divisor.",
    productionEntry: "L×W×H÷divisor",
  },
  "route-cost-calculator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      {
        key: "totalCost",
        expr: `${n("distanceKm")} * ${n("fuelCostPerKm")} + ${n("driverHours")} * ${n("hourlyRate")} + ${n("tolls")}`,
      },
    ],
    formulaSummary: "Cost = distance × fuel/km + driver hours × rate + tolls.",
    productionEntry: "distance + labor + tolls",
  },
  "delivery-cost-calculator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      {
        key: "totalCost",
        expr: `${n("distanceKm")} * ${n("costPerKm")} + ${n("stops")} * ${n("costPerStop")}`,
      },
    ],
    formulaSummary: "Cost = distance × cost/km + stops × cost/stop.",
    productionEntry: "distance + stops",
  },
  "freight-cost-calculator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [{ key: "totalCost", expr: `${n("weightKg")} * ${n("ratePerKg")} + ${n("fixedFee")}` }],
    formulaSummary: "Cost = weight × rate/kg + fixed fee.",
    productionEntry: "weight × rate + fee",
  },
  "warehouse-storage-cost-calculator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      {
        key: "totalCost",
        expr: `${n("palletCount")} * ${n("costPerPalletPerDay")} * ${n("days")}`,
      },
    ],
    formulaSummary: "Cost = pallets × daily rate × days.",
    productionEntry: "pallets × rate × days",
  },
  "vehicle-depreciation-calculator": {
    primaryKey: "annualDepreciation",
    parseKind: "currency",
    fields: [
      {
        key: "annualDepreciation",
        expr: `${sd(`${n("purchasePrice")} - ${n("resaleValue")}`, n("years"))}`,
      },
    ],
    formulaSummary: "Annual = (purchase − resale) ÷ years.",
    productionEntry: "(purchase − resale) ÷ years",
  },
  "trip-budget-calculator": {
    primaryKey: "totalBudget",
    parseKind: "currency",
    fields: [
      {
        key: "totalBudget",
        expr: `${n("fuelCost")} + ${n("accommodationCost")} + ${n("foodCost")} + ${n("tolls")} + ${n("otherCost")}`,
      },
    ],
    formulaSummary: "Sum of fuel, accommodation, food, tolls and other.",
    productionEntry: "sum of trip line items",
  },
  "fertilizer-dosage-calculator": {
    primaryKey: "fertilizerKg",
    parseKind: "plain",
    fields: [{ key: "fertilizerKg", expr: `${n("areaHa")} * ${n("dosageKgPerHa")}` }],
    formulaSummary: "Fertilizer = area × dosage/ha.",
    productionEntry: "area × dosage",
  },
  "seed-rate-calculator": {
    primaryKey: "seedKg",
    parseKind: "plain",
    fields: [{ key: "seedKg", expr: `${n("areaHa")} * ${n("seedKgPerHa")}` }],
    formulaSummary: "Seed = area × seed rate/ha.",
    productionEntry: "area × rate",
  },
  "irrigation-cost-check": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      { key: "energyCost", expr: `${n("pumpKw")} * ${n("hours")} * ${n("energyRate")}` },
      { key: "totalCost", expr: `energyCost + ${n("waterCost")}` },
    ],
    formulaSummary: "Cost = pump kW × hours × rate + water cost.",
    productionEntry: "energy + water",
  },
  "water-usage-calculator": {
    primaryKey: "liters",
    parseKind: "plain",
    fields: [{ key: "liters", expr: `${n("flowRateLiterMin")} * ${n("minutes")}` }],
    formulaSummary: "Volume = flow rate × minutes.",
    productionEntry: "flow × minutes",
  },
  "feed-cost-estimator": {
    primaryKey: "totalCost",
    parseKind: "currency",
    fields: [
      { key: "totalCost", expr: `${n("feedKg")} * ${n("pricePerKg")} + ${n("transportCost")}` },
    ],
    formulaSummary: "Cost = feed kg × price + transport.",
    productionEntry: "feed × price + transport",
  },
  "milk-yield-check": {
    primaryKey: "revenue",
    parseKind: "currency",
    fields: [
      { key: "liters", expr: `${n("cows")} * ${n("litersPerCow")}` },
      { key: "revenue", expr: `liters * ${n("milkPrice")}` },
    ],
    formulaSummary: "Revenue = cows × liters/cow × price.",
    productionEntry: "cows × yield × price",
  },
  "crop-yield-calculator": {
    primaryKey: "revenue",
    parseKind: "currency",
    fields: [
      { key: "tons", expr: `${n("areaHa")} * ${n("yieldTonPerHa")}` },
      { key: "revenue", expr: `tons * ${n("pricePerTon")}` },
    ],
    formulaSummary: "Revenue = area × yield/ha × price/ton.",
    productionEntry: "area × yield × price",
  },
  "recipe-cost-check": {
    primaryKey: "portionCost",
    parseKind: "currency",
    fields: [{ key: "portionCost", expr: `${sd(n("ingredientCost"), n("portions"))}` }],
    formulaSummary: "Portion cost = ingredient cost ÷ portions.",
    productionEntry: "ingredient ÷ portions",
  },
  "portion-cost-calculator": {
    primaryKey: "portionCost",
    parseKind: "currency",
    fields: [{ key: "portionCost", expr: `${sd(n("totalBatchCost"), n("portions"))}` }],
    formulaSummary: "Portion cost = batch cost ÷ portions.",
    productionEntry: "batch ÷ portions",
  },
  "home-budget-calculator": {
    primaryKey: "remaining",
    parseKind: "currency",
    fields: [
      {
        key: "expenses",
        expr: `${n("rent")} + ${n("food")} + ${n("transport")} + ${n("utilities")}`,
      },
      { key: "remaining", expr: `${n("income")} - expenses` },
    ],
    formulaSummary: "Remaining = income − expenses.",
    productionEntry: "income − expenses",
  },
  "time-duration-calculator": {
    primaryKey: "durationMinutes",
    parseKind: "integer",
    fields: [
      { key: "startMin", expr: `${n("startHour")} * 60 + ${n("startMinute")}` },
      { key: "endMin", expr: `${n("endHour")} * 60 + ${n("endMinute")}` },
      { key: "durationMinutes", expr: "endMin >= startMin ? endMin - startMin : endMin + 1440 - startMin" },
    ],
    formulaSummary: "Duration from start to end with midnight wrap.",
    productionEntry: "end − start (wrap 24h)",
  },
  "age-calculator": {
    primaryKey: "ageYears",
    parseKind: "integer",
    fields: [{ key: "ageYears", expr: `${n("currentYear")} - ${n("birthYear")}` }],
    formulaSummary: "Age = current year − birth year.",
    productionEntry: "current − birth",
  },
  "date-difference-calculator": {
    primaryKey: "daysBetween",
    parseKind: "integer",
    fields: [{ key: "daysBetween", expr: `${n("endDayNumber")} - ${n("startDayNumber")}` }],
    formulaSummary: "Days = end day − start day.",
    productionEntry: "end − start",
  },
  "shopping-budget-calculator": {
    primaryKey: "total",
    parseKind: "currency",
    fields: [
      {
        key: "total",
        expr: `${n("item1")} + ${n("item2")} + ${n("item3")} + ${n("item4")} + ${n("item5")}`,
      },
    ],
    formulaSummary: "Sum of item1 through item5.",
    productionEntry: "sum items",
  },
  "unit-price-calculator": {
    primaryKey: "unitPrice",
    parseKind: "currency",
    fields: [{ key: "unitPrice", expr: `${sd(n("totalPrice"), n("quantity"))}` }],
    formulaSummary: "Unit price = total ÷ quantity.",
    productionEntry: "total ÷ qty",
  },
  "tip-calculator": {
    primaryKey: "totalWithTip",
    parseKind: "currency",
    fields: [
      { key: "tipAmount", expr: `${n("billAmount")} * (${n("tipPercent")} / 100)` },
      { key: "totalWithTip", expr: `${n("billAmount")} + tipAmount` },
    ],
    formulaSummary: "Total = bill + bill × tip%.",
    productionEntry: "bill + tip",
  },
  "savings-goal-calculator": {
    primaryKey: "monthsToGoal",
    parseKind: "plain",
    fields: [{ key: "monthsToGoal", expr: `${sd(n("targetAmount"), n("monthlySaving"))}` }],
    formulaSummary: "Months = target ÷ monthly saving.",
    productionEntry: "target ÷ monthly",
  },
  "percentage-increase-calculator": {
    primaryKey: "changePercent",
    parseKind: "percent",
    fields: [
      { key: "absoluteChange", expr: `${n("newValue")} - ${n("oldValue")}` },
      { key: "changePercent", expr: `${sd("absoluteChange", n("oldValue"))} * 100` },
    ],
    formulaSummary: "Change % = (new − old) ÷ old × 100.",
    productionEntry: "(new − old) ÷ old",
  },
  "average-calculator": {
    primaryKey: "average",
    parseKind: "plain",
    fields: [
      { key: "count", expr: "collectValues(values).length" },
      { key: "sum", expr: "collectValues(values).reduce((a, b) => a + b, 0)" },
      { key: "average", expr: "count > 0 ? safeDiv(sum, count) : 0" },
    ],
    formulaSummary: "Mean = sum ÷ count.",
    productionEntry: "mean of value1..value5",
  },
  "median-calculator": {
    primaryKey: "median",
    parseKind: "plain",
    fields: [
      {
        key: "median",
        expr: "(() => { const sorted = [...collectValues(values)].sort((a, b) => a - b); const n = sorted.length; if (n === 0) return 0; const mid = Math.floor(n / 2); return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]; })()",
      },
    ],
    formulaSummary: "Median of sorted entered values.",
    productionEntry: "median of value1..value5",
  },
  "standard-deviation-calculator": {
    primaryKey: "standardDeviation",
    parseKind: "plain",
    fields: [
      {
        key: "standardDeviation",
        expr: "(() => { const nums = collectValues(values); const count = nums.length; if (count === 0) return 0; const mean = safeDiv(nums.reduce((a, b) => a + b, 0), count); const variance = safeDiv(nums.reduce((acc, x) => acc + (x - mean) ** 2, 0), count); return Math.sqrt(variance); })()",
      },
    ],
    formulaSummary: "Population σ = √(Σ(x−μ)² / n).",
    productionEntry: "population σ",
  },
  "proportion-calculator": {
    primaryKey: "missingValue",
    parseKind: "plain",
    fields: [{ key: "missingValue", expr: `${sd(`${n("b")} * ${n("c")}`, n("a"))}` }],
    formulaSummary: "If a:b = c:x then x = b × c ÷ a.",
    productionEntry: "b × c ÷ a",
  },
  "probability-calculator": {
    primaryKey: "probability",
    parseKind: "plain",
    fields: [{ key: "probability", expr: `${sd(n("favorableOutcomes"), n("totalOutcomes"))}` }],
    formulaSummary: "Probability = favorable ÷ total.",
    productionEntry: "favorable ÷ total",
  },
  "z-score-calculator": {
    primaryKey: "zScore",
    parseKind: "plain",
    fields: [{ key: "zScore", expr: `${sd(`${n("value")} - ${n("mean")}`, n("standardDeviation"))}` }],
    formulaSummary: "Z = (value − mean) ÷ σ.",
    productionEntry: "(value − mean) ÷ σ",
  },
  "linear-regression-calculator": {
    primaryKey: "slope",
    parseKind: "plain",
    fields: [
      { key: "sumX", expr: `${n("x1")} + ${n("x2")} + ${n("x3")}` },
      { key: "sumY", expr: `${n("y1")} + ${n("y2")} + ${n("y3")}` },
      { key: "sumXY", expr: `${n("x1")} * ${n("y1")} + ${n("x2")} * ${n("y2")} + ${n("x3")} * ${n("y3")}` },
      { key: "sumX2", expr: `${n("x1")} * ${n("x1")} + ${n("x2")} * ${n("x2")} + ${n("x3")} * ${n("x3")}` },
      { key: "denom", expr: "3 * sumX2 - sumX * sumX" },
      { key: "slope", expr: "safeDiv(3 * sumXY - sumX * sumY, denom)" },
      { key: "intercept", expr: "safeDiv(sumY - slope * sumX, 3)" },
    ],
    formulaSummary: "Least-squares slope and intercept for three points.",
    productionEntry: "OLS slope/intercept",
  },
};

function loadCatalog(): CatalogEntry[] {
  const path = join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json");
  return JSON.parse(readFileSync(path, "utf8")) as CatalogEntry[];
}

function targetSlugs(catalog: CatalogEntry[]): string[] {
  return catalog
    .map((entry) => entry.slug)
    .filter((slug) => !EXISTING_CONTRACT_SLUGS.has(slug))
    .filter((slug) => !CONTRACT_DEFERRED_SLUGS.has(slug))
    .filter((slug) => slug in SLUG_ORACLE_DEFS)
    .sort((a, b) => a.localeCompare(b));
}

function fnName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function generateOracleCompute(slugs: string[]): string {
  const helpers = `function n(values: TrafficOracleValues, key: string): number {
  const value = values[key];
  if (!Number.isFinite(value)) {
    throw new OracleValidationError("INVALID_QUANTITY", \`\${key} must be a finite number.\`);
  }
  return value;
}

function safeDiv(numerator: number, denominator: number): number {
  if (!Number.isFinite(denominator) || denominator === 0) {
    throw new OracleValidationError("INVALID_QUANTITY", "Division requires a non-zero finite denominator.");
  }
  return numerator / denominator;
}

function collectValues(values: TrafficOracleValues): number[] {
  const keys = ["value1", "value2", "value3", "value4", "value5"] as const;
  const nums: number[] = [];
  for (const key of keys) {
    const value = values[key];
    if (Number.isFinite(value)) {
      nums.push(value);
    }
  }
  return nums;
}
`;

  const functions = slugs
    .map((slug) => {
      const def = SLUG_ORACLE_DEFS[slug];
      const assignments = def.fields
        .map((field) => `  const ${field.key} = ${field.expr};`)
        .join("\n");
      const returnFields = def.fields.map((field) => `    ${field.key},`).join("\n");
      return `export function calculate${fnName(slug)}Oracle(values: TrafficOracleValues): TrafficCatalogOracleOutput {
${assignments}
  return {
${returnFields}
  };
}`;
    })
    .join("\n\n");

  return `/**
 * Traffic catalog oracle compute — independent reference implementations.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts — do not edit by hand.
 */

import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

export type TrafficOracleValues = Readonly<Record<string, number>>;

export type TrafficCatalogOracleOutput = Readonly<Record<string, number>>;

${helpers}

${functions}
`;
}

function generateOracleRegistry(slugs: string[]): string {
  const slugConst = slugs.map((s) => `  "${s}",`).join("\n");
  const exports = slugs
    .map(
      (slug) =>
        `  "${slug}": calculate${fnName(slug)}Oracle,`,
    )
    .join("\n");

  return `/**
 * Traffic catalog oracle registry — batch global expansion.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts
 */

import {
${slugs.map((slug) => `  calculate${fnName(slug)}Oracle,`).join("\n")}
  type TrafficCatalogOracleOutput,
  type TrafficOracleValues,
} from "@/lib/formula-governance/oracle/traffic-catalog-oracle-compute";

export const BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS = [
${slugConst}
] as const;

export type BatchTrafficCatalogOracleSlug = (typeof BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS)[number];

export function isBatchTrafficCatalogOracleSlug(slug: string): slug is BatchTrafficCatalogOracleSlug {
  return (BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export const BATCH_TRAFFIC_CATALOG_ORACLE_TOOL_IDS: Readonly<Record<BatchTrafficCatalogOracleSlug, string>> = {
${slugs.map((slug) => `  "${slug}": "free-traffic.${slug}",`).join("\n")}
};

const ORACLE_BY_SLUG: Readonly<Record<BatchTrafficCatalogOracleSlug, (values: TrafficOracleValues) => TrafficCatalogOracleOutput>> = {
${exports}
};

export function calculateBatchTrafficCatalogOracle(
  slug: BatchTrafficCatalogOracleSlug,
  values: TrafficOracleValues,
): TrafficCatalogOracleOutput {
  return ORACLE_BY_SLUG[slug](values);
}

export type BatchTrafficCatalogOracleSpec = {
  readonly slug: BatchTrafficCatalogOracleSlug;
  readonly primaryKey: string;
  readonly parseKind: "plain" | "currency" | "percent" | "integer";
};

export const BATCH_TRAFFIC_CATALOG_ORACLE_SPECS: readonly BatchTrafficCatalogOracleSpec[] = [
${slugs
  .map((slug) => {
    const def = SLUG_ORACLE_DEFS[slug];
    return `  { slug: "${slug}", primaryKey: "${def.primaryKey}", parseKind: "${def.parseKind}" },`;
  })
  .join("\n")}
];

export function getBatchTrafficCatalogOracleSpec(
  slug: BatchTrafficCatalogOracleSlug,
): BatchTrafficCatalogOracleSpec {
  const spec = BATCH_TRAFFIC_CATALOG_ORACLE_SPECS.find((entry) => entry.slug === slug);
  if (!spec) {
    throw new Error(\`Missing oracle spec for "\${slug}".\`);
  }
  return spec;
}
`;
}

function defaultFixture(catalogEntry: CatalogEntry): Record<string, number> {
  const fixture: Record<string, number> = {};
  for (const input of catalogEntry.inputs) {
    fixture[input.key] = input.min !== undefined ? Math.max(input.min, 1) : 10;
  }
  if (catalogEntry.slug === "average-calculator" || catalogEntry.slug === "median-calculator" || catalogEntry.slug === "standard-deviation-calculator") {
    fixture.value1 = 10;
    fixture.value2 = 20;
    fixture.value3 = 30;
    fixture.value4 = 40;
    fixture.value5 = 50;
  }
  if (catalogEntry.slug === "linear-regression-calculator") {
    fixture.x1 = 1;
    fixture.y1 = 2;
    fixture.x2 = 2;
    fixture.y2 = 4;
    fixture.x3 = 3;
    fixture.y3 = 6;
  }
  if (catalogEntry.slug === "age-calculator") {
    fixture.birthYear = 1990;
    fixture.currentYear = 2026;
  }
  if (catalogEntry.slug === "home-budget-calculator") {
    fixture.income = 5000;
    fixture.rent = 1200;
    fixture.food = 600;
    fixture.transport = 300;
    fixture.utilities = 200;
  }
  return fixture;
}

function generateCompare(slugs: string[], catalogBySlug: Map<string, CatalogEntry>): string {
  return `/**
 * Batch traffic catalog production vs oracle comparison.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import {
  BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS,
  calculateBatchTrafficCatalogOracle,
  getBatchTrafficCatalogOracleSpec,
  isBatchTrafficCatalogOracleSlug,
  type BatchTrafficCatalogOracleSlug,
} from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import {
  adaptProductionBatchTrafficCatalogOutput,
  type NormalizedBatchTrafficCatalogProductionOutput,
} from "@/lib/formula-governance/oracle/production-adapters";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";

const NUMERIC_TOLERANCE = 0.05;
const CURRENCY_TOLERANCE = 0.02;
const PERCENT_TOLERANCE = 0.05;
const INTEGER_TOLERANCE = 0.5;

function toleranceForField(field: string, parseKind: string): number {
  if (parseKind === "currency") return CURRENCY_TOLERANCE;
  if (parseKind === "percent") return PERCENT_TOLERANCE;
  if (parseKind === "integer") return INTEGER_TOLERANCE;
  return NUMERIC_TOLERANCE;
}

function compareNumericFields(fields: readonly {
  readonly field: string;
  readonly production: number;
  readonly oracle: number;
  readonly tolerance: number;
}[]): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  const diffs: FieldComparisonDiff[] = [];
  for (const entry of fields) {
    const delta = Math.abs(entry.production - entry.oracle);
    if (delta > entry.tolerance) {
      diffs.push({
        field: entry.field,
        production: entry.production,
        oracle: entry.oracle,
        delta,
        tolerance: entry.tolerance,
      });
    }
  }
  return { passed: diffs.length === 0, diffs };
}

export { BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS };

export type BatchTrafficCatalogComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: FreeTrafficInputValues;
  readonly expectPass?: boolean;
};

export function isBatchTrafficCatalogComparisonSlug(slug: string): slug is BatchTrafficCatalogOracleSlug {
  return isBatchTrafficCatalogOracleSlug(slug);
}

const SCENARIOS_BY_SLUG: Readonly<Record<BatchTrafficCatalogOracleSlug, readonly BatchTrafficCatalogComparisonScenario[]>> = {
${slugs
  .map((slug) => {
    const entry = catalogBySlug.get(slug);
    const fixture = entry ? defaultFixture(entry) : { a: 10, b: 5 };
    const invalidFixture = { ...fixture };
    const firstKey = Object.keys(fixture)[0];
    if (firstKey) {
      invalidFixture[firstKey] = -1;
    }
    return `  "${slug}": [
    { id: "golden-valid", kind: "normal", values: ${JSON.stringify(fixture)} },
    { id: "missing-input", kind: "edge", values: {}, expectPass: false },
    { id: "invalid-negative", kind: "edge", values: ${JSON.stringify(invalidFixture)}, expectPass: false },
    { id: "boundary-min", kind: "edge", values: ${JSON.stringify(fixture)} },
    { id: "rogue-key", kind: "absurd", values: { ...${JSON.stringify(fixture)}, rogueKey: 999 } },
    { id: "valid-success", kind: "normal", values: ${JSON.stringify(fixture)} },
  ],`;
  })
  .join("\n")}
};

function buildOracleOutput(
  slug: BatchTrafficCatalogOracleSlug,
  values: FreeTrafficInputValues,
): NormalizedBatchTrafficCatalogProductionOutput {
  const numeric: Record<string, number> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      numeric[key] = value;
    }
  }
  return calculateBatchTrafficCatalogOracle(slug, numeric);
}

export function compareBatchTrafficCatalogProductionVsOracle(input: {
  readonly slug: BatchTrafficCatalogOracleSlug;
  readonly scenarioId: string;
  readonly values: FreeTrafficInputValues;
}): OracleComparisonResult {
  const toolId = \`free-traffic.\${input.slug}\`;
  const spec = getBatchTrafficCatalogOracleSpec(input.slug);
  const production = adaptProductionBatchTrafficCatalogOutput(input.slug, input.values);
  if (production.status === "needs_adapter") {
    return {
      status: "NEEDS_ADAPTER",
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      diffs: [],
      message: production.reason,
    };
  }
  if (production.status === "error") {
    return {
      status: "FAIL",
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      diffs: [],
      message: production.reason,
    };
  }

  let oracle: NormalizedBatchTrafficCatalogProductionOutput;
  try {
    oracle = buildOracleOutput(input.slug, input.values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "FAIL",
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      diffs: [],
      message,
    };
  }

  const productionOutput = production.output as NormalizedBatchTrafficCatalogProductionOutput;
  const fields = Object.keys(oracle)
    .filter((key) => productionOutput[key] !== undefined)
    .map((key) => ({
      field: key,
      production: productionOutput[key],
      oracle: oracle[key],
      tolerance: toleranceForField(key, spec.parseKind),
    }));

  const comparison = compareNumericFields(fields);
  return {
    status: comparison.passed ? "PASS" : "FAIL",
    slug: input.slug,
    toolId,
    scenarioId: input.scenarioId,
    diffs: comparison.diffs,
  };
}

export function runBatchTrafficCatalogOracleComparisonAudit(
  slug: BatchTrafficCatalogOracleSlug,
): OracleComparisonAuditSummary {
  const toolId = \`free-traffic.\${slug}\`;
  const scenarios = SCENARIOS_BY_SLUG[slug] ?? [];
  const comparableScenarios = scenarios.filter((scenario) => scenario.expectPass !== false);

  if (!hasOracleForTool(toolId)) {
    return {
      slug,
      toolId,
      status: "NOT_WIRED",
      passCount: 0,
      failCount: 0,
      needsAdapterCount: 0,
      notWiredCount: scenarios.length,
      results: scenarios.map((scenario) => ({
        slug,
        toolId,
        scenarioId: scenario.id,
        status: "NOT_WIRED" as const,
        diffs: [],
      })),
    };
  }

  const results = comparableScenarios.map((scenario) =>
    compareBatchTrafficCatalogProductionVsOracle({
      slug,
      scenarioId: scenario.id,
      values: scenario.values,
    }),
  );

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;
  const needsAdapterCount = results.filter((result) => result.status === "NEEDS_ADAPTER").length;

  let status: OracleComparisonStatus = "PASS";
  if (needsAdapterCount > 0) {
    status = "NEEDS_ADAPTER";
  } else if (failCount > 0) {
    status = "FAIL";
  } else if (passCount === 0) {
    status = "NOT_WIRED";
  }

  return {
    slug,
    toolId,
    status,
    passCount,
    failCount,
    needsAdapterCount,
    notWiredCount: 0,
    results,
  };
}

export function runAllBatchTrafficCatalogOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS.map((slug) => runBatchTrafficCatalogOracleComparisonAudit(slug));
}
`;
}

function generateContracts(slugs: string[], catalogBySlug: Map<string, CatalogEntry>): string {
  const contracts = slugs.map((slug) => {
    const entry = catalogBySlug.get(slug);
    const def = SLUG_ORACLE_DEFS[slug];
    if (!entry || !def) return "";
    const requiredInputs = entry.inputs.map((input) => `"${input.key}"`).join(", ");
    const outputs = [...def.fields.map((field) => `"${field.key}"`), '"recommendedPrice"'].join(", ");
    const title = entry.title.replace(/"/g, '\\"');
    return `const ${fnName(slug)}Contract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.${slug}",
  toolName: "${title}",
  slug: "${slug}",
  purpose: "${entry.description.replace(/"/g, '\\"')}",
  userDecision: "What result do these inputs produce under the documented formula?",
  decisionImpact: "operational",
  requiredInputs: [${requiredInputs}],
  criticalInputs: [${requiredInputs}],
  outputs: [${outputs}],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    freeTrafficProductionAssumption("${slug}", "${def.productionEntry}"),
    "${def.formulaSummary}",
  ],
  formulaSummary: "${def.formulaSummary}",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Inputs processed in browser; values are not stored unless saved.",
      "Governance ontology target recommendedPrice maps to primary numeric output (${def.primaryKey}).",
    ],
    modelLimitations: ["Free-tier quick check — excludes sector-specific risk and paid verdict outputs."],
    futureExtensions: ["Paid analyzer integration when sector pack exists."],
  }),
  validationRules: [
    { id: "inputs-finite", description: "Required numeric inputs must be finite.", kind: "edge" },
    { id: "primary-output-finite", description: "Primary output must be finite when inputs are valid.", kind: "edge" },
    { id: "units-consistent", description: "Inputs use consistent units per field labels.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite primary output." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Invalid negative inputs rejected where min bound applies." },
    { id: "boundary-min", description: "Minimum boundary inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "primary-non-negative-inputs", description: "Increasing primary cost drivers should not decrease primary output when applicable.", inputKey: "${entry.inputs[0]?.key ?? "value"}", direction: "increase_should_increase", outputKey: "${def.primaryKey}" },
    { id: "output-finite", description: "Primary output remains finite for valid inputs.", inputKey: "${entry.inputs[0]?.key ?? "value"}", direction: "increase_should_increase", outputKey: "${def.primaryKey}" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "${entry.inputs[0]?.key ?? "value"}", direction: "increase_should_increase", outputKey: "${def.primaryKey}" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});`;
  });

  return `/**
 * Batch traffic catalog FormulaContracts — global expansion run.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  freeTrafficProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

${contracts.join("\n\n")}

export const BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS = [
${slugs.map((s) => `  "${s}",`).join("\n")}
] as const;

export const BATCH_TRAFFIC_CATALOG_ORACLE_WIRED_SLUGS = BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS;

export const BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
${slugs.map((s) => `  ${fnName(s)}Contract,`).join("\n")}
];
`;
}

function generateProductionLocators(slugs: string[], catalogBySlug: Map<string, CatalogEntry>): string {
  const entries = slugs
    .map((slug) => {
      const def = SLUG_ORACLE_DEFS[slug];
      const entry = catalogBySlug.get(slug);
      const inputShape = entry?.inputs?.map((i) => `"${i.key}"`).join(", ") ?? "";
      return `  {
    slug: "${slug}",
    toolId: "free-traffic.${slug}",
    productionFilePath: "src/lib/tools/free-traffic-calculators.ts",
    productionFunctionName: "calculateFreeTrafficTool",
    productionEntry: 'CALCULATORS["${slug}"] → ${def.productionEntry}',
    oracleFunctionName: "calculate${fnName(slug)}Oracle",
    inputShape: [${inputShape}],
    productionOutputShape: ["primaryValue", "${def.primaryKey}"],
    oracleOutputShape: [${def.fields.map((f) => `"${f.key}"`).join(", ")}],
    comparisonWired: true,
  },`;
    })
    .join("\n");

  return `/**
 * Traffic catalog production formula locators.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts
 */

import type { BatchTrafficCatalogOracleSlug } from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import { BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS } from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import type { ProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

export const BATCH_TRAFFIC_CATALOG_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
${entries}
];

export function getBatchTrafficCatalogProductionFormulaLocator(
  slug: BatchTrafficCatalogOracleSlug,
): ProductionFormulaLocator | undefined {
  return BATCH_TRAFFIC_CATALOG_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isBatchTrafficCatalogProductionSlug(slug: string): slug is BatchTrafficCatalogOracleSlug {
  return (BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS as readonly string[]).includes(slug);
}
`;
}

function generateScenarioHandlers(slugs: string[]): string {
  return `/**
 * Generic scenario handlers for traffic catalog oracle batch.
 * GENERATED by scripts/generate-batch-traffic-catalog-governance.ts
 */

import {
  BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS,
  calculateBatchTrafficCatalogOracle,
  getBatchTrafficCatalogOracleSpec,
  type BatchTrafficCatalogOracleSlug,
} from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

type ScenarioHandler = () => void;

function buildHandlers(slug: BatchTrafficCatalogOracleSlug): Record<string, ScenarioHandler> {
  const spec = getBatchTrafficCatalogOracleSpec(slug);
  const baseline = SCENARIO_FIXTURES[slug];
  return {
    "golden-valid": () => {
      const result = calculateBatchTrafficCatalogOracle(slug, baseline);
      const primary = result[spec.primaryKey];
      if (!Number.isFinite(primary)) {
        throw new Error("Expected finite primary output.");
      }
    },
    "missing-input": () => {
      try {
        calculateBatchTrafficCatalogOracle(slug, {});
        throw new Error("Expected validation error for missing inputs.");
      } catch (error) {
        if (!(error instanceof OracleValidationError)) {
          throw error;
        }
      }
    },
    "invalid-negative": () => {
      const firstKey = Object.keys(baseline)[0];
      if (!firstKey) return;
      try {
        calculateBatchTrafficCatalogOracle(slug, { ...baseline, [firstKey]: -1 });
      } catch (error) {
        if (error instanceof OracleValidationError) return;
      }
    },
    "boundary-min": () => {
      const result = calculateBatchTrafficCatalogOracle(slug, baseline);
      if (!Number.isFinite(result[spec.primaryKey])) {
        throw new Error("Boundary fixture must produce finite output.");
      }
    },
    "rogue-key": () => {
      const result = calculateBatchTrafficCatalogOracle(slug, baseline);
      if (!Number.isFinite(result[spec.primaryKey])) {
        throw new Error("Rogue keys must not affect oracle baseline.");
      }
    },
  };
}

const SCENARIO_FIXTURES: Readonly<Record<BatchTrafficCatalogOracleSlug, Readonly<Record<string, number>>>> = {
${slugs
  .map((slug) => {
    const entry = loadCatalog().find((e) => e.slug === slug);
    const fixture = entry ? defaultFixture(entry) : { value: 10 };
    return `  "${slug}": ${JSON.stringify(fixture)},`;
  })
  .join("\n")}
};

export const BATCH_TRAFFIC_CATALOG_SCENARIO_HANDLERS: Record<string, Record<string, ScenarioHandler>> =
  Object.fromEntries(BATCH_TRAFFIC_CATALOG_ORACLE_SLUGS.map((slug) => [slug, buildHandlers(slug)]));
`;
}

function main(): void {
  const catalog = loadCatalog();
  const catalogBySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
  const slugs = targetSlugs(catalog);

  const missingDefs = catalog
    .map((e) => e.slug)
    .filter((s) => !EXISTING_CONTRACT_SLUGS.has(s) && !CONTRACT_DEFERRED_SLUGS.has(s))
    .filter((s) => !(s in SLUG_ORACLE_DEFS));
  if (missingDefs.length > 0) {
    console.warn("Missing oracle defs for:", missingDefs.join(", "));
  }

  writeFileSync(
    join(ROOT, "src/lib/formula-governance/oracle/traffic-catalog-oracle-compute.ts"),
    generateOracleCompute(slugs),
  );
  writeFileSync(
    join(ROOT, "src/lib/formula-governance/oracle/batch-traffic-catalog-oracles.ts"),
    generateOracleRegistry(slugs),
  );
  writeFileSync(
    join(ROOT, "src/lib/formula-governance/oracle/compare-batch-traffic-catalog-oracle.ts"),
    generateCompare(slugs, catalogBySlug),
  );
  writeFileSync(
    join(ROOT, "src/lib/formula-governance/contracts/batch-traffic-catalog-critical.ts"),
    generateContracts(slugs, catalogBySlug),
  );
  writeFileSync(
    join(ROOT, "src/lib/formula-governance/scenario-handlers-batch-traffic-catalog.ts"),
    generateScenarioHandlers(slugs),
  );
  writeFileSync(
    join(ROOT, "src/lib/formula-governance/oracle/batch-traffic-catalog-production-locators.ts"),
    generateProductionLocators(slugs, catalogBySlug),
  );

  console.log(`Generated traffic catalog governance for ${slugs.length} slugs.`);
  console.log(`Deferred (no contract): ${[...CONTRACT_DEFERRED_SLUGS].join(", ")}`);
}

main();
