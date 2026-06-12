/**
 * Safe Formula Registry — typed, testable functions only.
 * Organized under 10 locked industrial formula families.
 * Schemas reference formulaId; never expression strings.
 */

import {
  FORMULA_FAMILIES,
  FORMULA_FAMILY_LABELS,
  type FormulaFamilyId,
} from "@/lib/premium-schema/formula-families";
import {
  getPrimedSevenMudaEngineeringResult,
  resolveHighestWasteCategoryIndex,
} from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import type { PremiumOutputFormat } from "@/lib/premium-schema/premium-calculator-schema";

export type FormulaInputs = Readonly<Record<string, number>>;

export type FormulaFn = (inputs: FormulaInputs) => number;

export interface FormulaDefinition {
  readonly id: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly fn: FormulaFn;
}

function assertFinite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function num(inputs: FormulaInputs, key: string, fallback = 0): number {
  const value = inputs[key];
  return assertFinite(typeof value === "number" ? value : Number(value), fallback);
}

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }
  return assertFinite(numerator / denominator);
}

function nonNegative(value: number): number {
  return assertFinite(Math.max(0, value));
}

// ---------------------------------------------------------------------------
// Definitions (family → tested function)
// ---------------------------------------------------------------------------

const FORMULA_DEFINITIONS: readonly FormulaDefinition[] = [
  {
    id: "measurement.variance_percent",
    family: "measurement",
    label: "Measurement variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "benchmark.variance_percent",
    family: "benchmark",
    label: "Benchmark variance percent",
    fn: (inputs) => {
      const actual = num(inputs, "actual");
      const target = num(inputs, "target");
      if (target === 0) return 0;
      return assertFinite(((actual - target) / target) * 100);
    },
  },
  {
    id: "time.labor_cost",
    family: "time",
    label: "Time / labor cost",
    fn: (inputs) => assertFinite(num(inputs, "hourlyCost") * num(inputs, "lossHours")),
  },
  {
    id: "time.downtime_minute_cost",
    family: "time",
    label: "Downtime cost from minutes and hourly rate",
    fn: (inputs) =>
      assertFinite((num(inputs, "downtimeMinutes") / 60) * num(inputs, "hourlyRate")),
  },
  {
    id: "time.downtime_units_lost",
    family: "time",
    label: "Output units lost during downtime",
    fn: (inputs) =>
      nonNegative((num(inputs, "downtimeMinutes") / 60) * num(inputs, "outputUnitsPerHour")),
  },
  {
    id: "scrap.material_cost",
    family: "scrap",
    label: "Scrap material cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "materialCost") * (num(inputs, "scrapRate") / 100)),
  },
  {
    id: "scrap.combined_operating",
    family: "scrap",
    label: "Combined operating cost stack",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "laborCost") + num(inputs, "materialCost") + num(inputs, "overheadCost")
      ),
  },
  {
    id: "scrap.total_exposure",
    family: "scrap",
    label: "Total loss exposure with hidden multiplier",
    fn: (inputs) =>
      assertFinite(num(inputs, "baseCost") * num(inputs, "hiddenMultiplier", 1)),
  },
  {
    id: "oee.basic",
    family: "oee",
    label: "OEE score",
    fn: (inputs) =>
      assertFinite(
        (num(inputs, "availability") * num(inputs, "performance") * num(inputs, "quality")) /
          10000
      ),
  },
  {
    id: "oee.availability_loss_cost",
    family: "oee",
    label: "Availability loss cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "machineRate") *
          Math.max(0, num(inputs, "downtimeHours") - num(inputs, "plannedHours") * 0.02)
      ),
  },
  {
    id: "route.deadhead_cost",
    family: "route",
    label: "Deadhead route cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "distanceKm") *
          num(inputs, "costPerKm") *
          (num(inputs, "emptyReturnPercent") / 100)
      ),
  },
  {
    id: "route.total_freight_cost",
    family: "route",
    label: "Total freight cost",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "fuelCost") +
          num(inputs, "driverCost") +
          num(inputs, "tolls") +
          num(inputs, "deadheadCost")
      ),
  },
  {
    id: "energy.excess_kwh_cost",
    family: "energy",
    label: "Excess kWh cost",
    fn: (inputs) =>
      assertFinite(Math.max(0, num(inputs, "currentKwh") - num(inputs, "targetKwh")) * num(inputs, "rate")),
  },
  {
    id: "energy.kwh_cost",
    family: "energy",
    label: "kWh cost",
    fn: (inputs) => assertFinite(num(inputs, "kwh") * num(inputs, "rate")),
  },
  {
    id: "energy.peak_demand_cost",
    family: "energy",
    label: "Peak demand cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "peakKwh") * num(inputs, "peakRate") + num(inputs, "demandCharge")),
  },
  {
    id: "energy.total_energy_cost",
    family: "energy",
    label: "Total energy cost",
    fn: (inputs) =>
      assertFinite(num(inputs, "excessKwh") * num(inputs, "energyRate") + num(inputs, "peakCost")),
  },
  {
    id: "carbon.cbam_exposure",
    family: "carbon",
    label: "CBAM exposure",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "emissionsTon") *
          num(inputs, "carbonPrice") *
          (num(inputs, "exposurePercent") / 100)
      ),
  },
  {
    id: "cost.p90_buffer",
    family: "cost",
    label: "P90 volatility buffer",
    fn: (inputs) =>
      assertFinite(num(inputs, "adjustedCost") * (num(inputs, "volatilityPercent") / 100) * 1.2816),
  },
  {
    id: "cost.minimum_safe_price",
    family: "cost",
    label: "Minimum safe price",
    fn: (inputs) => {
      const denom = Math.max(5, 100 - num(inputs, "targetMarginPercent"));
      return assertFinite(num(inputs, "p90Cost") / (denom / 100));
    },
  },
  {
    id: "yield.gap_value",
    family: "scrap",
    label: "Yield gap value",
    fn: (inputs) => assertFinite(num(inputs, "yieldGapTon") * num(inputs, "pricePerTon")),
  },
  {
    id: "loss.waste_exposure",
    family: "scrap",
    label: "Ingredient waste exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") * (num(inputs, "wasteRate") / 100)
      ),
  },
  {
    id: "loss.excess_waste_cost",
    family: "scrap",
    label: "Excess waste cost above target",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyIngredientCost") *
          (Math.max(0, num(inputs, "wasteRate") - num(inputs, "targetWasteRate")) / 100)
      ),
  },
  {
    id: "cost.margin_pressure",
    family: "cost",
    label: "Margin pressure from excess cost",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "excessCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "time.delay_cost",
    family: "time",
    label: "Project delay cost",
    fn: (inputs) => nonNegative(num(inputs, "dailySiteCost") * num(inputs, "delayDays")),
  },
  {
    id: "cost.overrun_cost",
    family: "cost",
    label: "Budget overrun cost",
    fn: (inputs) =>
      nonNegative(num(inputs, "budget") * (num(inputs, "overrunPercent") / 100)),
  },
  {
    id: "cost.total_exposure",
    family: "cost",
    label: "Combined exposure stack",
    fn: (inputs) =>
      nonNegative(num(inputs, "a") + num(inputs, "b") + num(inputs, "c")),
  },
  {
    id: "time.rework_cost",
    family: "time",
    label: "Rework labor cost",
    fn: (inputs) => nonNegative(num(inputs, "reworkHours") * num(inputs, "laborRate")),
  },
  {
    id: "cost.food_cost_percent",
    family: "cost",
    label: "Food cost percent of revenue",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "ingredientCost"), num(inputs, "monthlyRevenue")) * 100),
  },
  {
    id: "cost.delivery_fee_cost",
    family: "cost",
    label: "Delivery platform fee cost",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "monthlyRevenue") * (num(inputs, "deliveryAppFeePercent") / 100)
      ),
  },
  {
    id: "cost.restaurant_margin_pressure",
    family: "cost",
    label: "Restaurant margin pressure percent",
    fn: (inputs) =>
      nonNegative(
        safeDivide(
          num(inputs, "ingredientCost") +
            num(inputs, "deliveryFeeCost") +
            num(inputs, "wasteExposure"),
          num(inputs, "monthlyRevenue")
        ) * 100
      ),
  },
  {
    id: "cost.variance",
    family: "cost",
    label: "Positive cost variance",
    fn: (inputs) => nonNegative(num(inputs, "actual") - num(inputs, "planned")),
  },
  {
    id: "route.distance_drift_cost",
    family: "route",
    label: "Distance drift fuel cost",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "actualDistanceKm") - num(inputs, "plannedDistanceKm")) *
          num(inputs, "fuelCostPerKm")
      ),
  },
  {
    id: "cost.sum2",
    family: "cost",
    label: "Two-component cost sum",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.total2",
    family: "cost",
    label: "Two-component exposure total",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b")),
  },
  {
    id: "cost.value",
    family: "cost",
    label: "Pass-through numeric value",
    fn: (inputs) => nonNegative(num(inputs, "value")),
  },
  {
    id: "energy.compressor_leak_kwh",
    family: "energy",
    label: "Compressor leak kWh",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "compressorKw") *
          num(inputs, "operatingHours") *
          (num(inputs, "leakPercent") / 100)
      ),
  },
  {
    id: "cost.annualize",
    family: "cost",
    label: "Annualize monthly cost",
    fn: (inputs) => nonNegative(num(inputs, "monthlyCost") * 12),
  },
  {
    id: "cloud.api_call_cost",
    family: "cost",
    label: "API call volume cost",
    fn: (inputs) =>
      nonNegative(
        (num(inputs, "monthlyApiCalls") / 1000) * num(inputs, "costPerThousandCalls")
      ),
  },
  {
    id: "agriculture.yield_loss_revenue",
    family: "benchmark",
    label: "Yield loss revenue exposure",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "areaHa") *
          Math.max(0, num(inputs, "expectedYieldTonPerHa") - num(inputs, "actualYieldTonPerHa")) *
          num(inputs, "pricePerTon")
      ),
  },
  {
    id: "cost.unit_cost",
    family: "cost",
    label: "Unit cost from total and quantity",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "totalCost"), num(inputs, "quantity"))),
  },
  {
    id: "time.setup_loss",
    family: "time",
    label: "Setup and changeover downtime cost",
    fn: (inputs) =>
      nonNegative(
        (num(inputs, "setupMinutes") / 60) *
          num(inputs, "setupsPerMonth") *
          num(inputs, "hourlyCost")
      ),
  },
  {
    id: "cost.percent_of_amount",
    family: "cost",
    label: "Percent of amount exposure",
    fn: (inputs) =>
      nonNegative(num(inputs, "amount") * (num(inputs, "percent") / 100)),
  },
  {
    id: "cost.difference",
    family: "cost",
    label: "Difference between two amounts",
    fn: (inputs) => assertFinite(num(inputs, "a") - num(inputs, "b")),
  },
  {
    id: "cost.margin_rate_on_price",
    family: "cost",
    label: "Margin rate on price",
    fn: (inputs) =>
      assertFinite(
        safeDivide(num(inputs, "price") - num(inputs, "cost"), num(inputs, "price")) * 100,
      ),
  },
  {
    id: "cost.quote_target_price",
    family: "cost",
    label: "Quote target sales price",
    fn: (inputs) => {
      const denom = Math.max(5, 100 - num(inputs, "targetMarginPercent"));
      return assertFinite(num(inputs, "totalCost") / (denom / 100));
    },
  },
  {
    id: "cost.quote_safe_floor_price",
    family: "cost",
    label: "Quote minimum safe floor price",
    fn: (inputs) => {
      const margin = num(inputs, "targetMarginPercent") + num(inputs, "safetyMarginUplift");
      const denom = Math.max(5, 100 - margin);
      return assertFinite(num(inputs, "totalCost") / (denom / 100));
    },
  },
  {
    id: "cost.shop_hourly_rate",
    family: "cost",
    label: "Loaded machine shop hourly rate",
    fn: (inputs) =>
      assertFinite(
        safeDivide(num(inputs, "fixedMonthlyCost"), num(inputs, "monthlyMachineHours")) +
          num(inputs, "variableCostPerHour"),
      ),
  },
  {
    id: "cost.break_even_units",
    family: "cost",
    label: "Break-even volume in units",
    fn: (inputs) => {
      const contribution = num(inputs, "unitPrice") - num(inputs, "variableCostPerUnit");
      if (contribution <= 0) {
        return 0;
      }
      return assertFinite(num(inputs, "fixedCost") / contribution);
    },
  },
  {
    id: "cost.safety_margin_rate",
    family: "cost",
    label: "Safety margin above break-even",
    fn: (inputs) => {
      const current = num(inputs, "currentVolume");
      if (current <= 0) {
        return 0;
      }
      return assertFinite(
        Math.max(0, (current - num(inputs, "breakEvenUnits")) / current) * 100,
      );
    },
  },
  {
    id: "carbon.unit_product_emissions",
    family: "carbon",
    label: "Unit product embedded emissions",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "totalEmissionsTon"), num(inputs, "productionUnits"))),
  },
  {
    id: "carbon.unit_exposure_cost",
    family: "carbon",
    label: "Unit carbon cost at reference price",
    fn: (inputs) =>
      assertFinite(num(inputs, "unitEmissionsTon") * num(inputs, "carbonPrice")),
  },
  {
    id: "time.hour_overrun_cost",
    family: "time",
    label: "Hour overrun labor cost",
    fn: (inputs) =>
      nonNegative(
        Math.max(0, num(inputs, "actualHours") - num(inputs, "plannedHours")) *
          num(inputs, "hourlyCost")
      ),
  },
  {
    id: "cost.count_cost",
    family: "cost",
    label: "Count times unit cost",
    fn: (inputs) => nonNegative(num(inputs, "count") * num(inputs, "costEach")),
  },
  {
    id: "agriculture.feed_monthly_cost",
    family: "benchmark",
    label: "Monthly dairy feed cost",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "cows") * num(inputs, "feedCostPerCowPerDay") * num(inputs, "days")
      ),
  },
  {
    id: "agriculture.milk_yield_gap_revenue",
    family: "benchmark",
    label: "Milk yield gap revenue loss",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "cows") *
          Math.max(
            0,
            num(inputs, "targetMilkLitersPerCowPerDay") - num(inputs, "milkLitersPerCowPerDay")
          ) *
          num(inputs, "milkPricePerLiter") *
          num(inputs, "days")
      ),
  },
  {
    id: "retail.inventory_turnover",
    family: "benchmark",
    label: "Inventory turnover ratio",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "annualCOGS"), num(inputs, "averageInventory"))),
  },
  {
    id: "inventory.eoq_units",
    family: "benchmark",
    label: "Economic order quantity in units",
    fn: (inputs) => {
      const holdingCost =
        num(inputs, "unitCost") * (num(inputs, "carryingCostPercent") / 100);
      if (holdingCost <= 0) {
        return 0;
      }
      return assertFinite(
        Math.sqrt((2 * num(inputs, "annualDemand") * num(inputs, "orderCost")) / holdingCost),
      );
    },
  },
  {
    id: "inventory.carrying_cost_annual",
    family: "benchmark",
    label: "Annual inventory carrying cost from EOQ",
    fn: (inputs) => {
      const averageUnits = num(inputs, "eoqUnits") / 2;
      const averageValue = averageUnits * num(inputs, "unitCost");
      return nonNegative(averageValue * (num(inputs, "carryingCostPercent") / 100));
    },
  },
  {
    id: "warehouse.unused_space_cost",
    family: "cost",
    label: "Unused warehouse space cost",
    fn: (inputs) =>
      nonNegative(num(inputs, "monthlyRent") * (num(inputs, "unusedSpacePercent") / 100)),
  },
  {
    id: "legal.simple_interest_days",
    family: "cost",
    label: "Simple interest over days",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "principal") *
          (num(inputs, "annualInterestPercent") / 100) *
          (num(inputs, "days") / 365)
      ),
  },
  {
    id: "carbon.total_emissions",
    family: "carbon",
    label: "Total emissions tonnage",
    fn: (inputs) =>
      nonNegative(num(inputs, "energyEmissionsTon") + num(inputs, "fuelEmissionsTon")),
  },
  {
    id: "calibration.tolerance_status",
    family: "calibration",
    label: "Tolerance band usage percent",
    fn: (inputs) => {
      const tolerance = num(inputs, "tolerance");
      if (tolerance === 0) {
        return 0;
      }
      return nonNegative(
        (Math.abs(num(inputs, "actual") - num(inputs, "target")) / tolerance) * 100
      );
    },
  },
  {
    id: "calibration.tolerance_worst_case_stack",
    family: "calibration",
    label: "Worst-case tolerance stack",
    fn: (inputs) =>
      assertFinite(
        num(inputs, "t1") + num(inputs, "t2") + num(inputs, "t3") + num(inputs, "t4"),
      ),
  },
  {
    id: "calibration.tolerance_rss_stack",
    family: "calibration",
    label: "RSS tolerance stack",
    fn: (inputs) =>
      assertFinite(
        Math.sqrt(
          num(inputs, "t1") ** 2 +
            num(inputs, "t2") ** 2 +
            num(inputs, "t3") ** 2 +
            num(inputs, "t4") ** 2,
        ),
      ),
  },
  {
    id: "measurement.weld_throat_capacity",
    family: "measurement",
    label: "Simplified fillet weld throat capacity",
    fn: (inputs) => {
      const area = num(inputs, "throatMm") * num(inputs, "weldLengthMm");
      const safety = Math.max(1, num(inputs, "safetyFactor"));
      return nonNegative((area * num(inputs, "allowableStressMpa")) / safety);
    },
  },
  {
    id: "measurement.bolt_shear_capacity",
    family: "measurement",
    label: "Simplified bolt shear capacity",
    fn: (inputs) => {
      const radius = num(inputs, "boltDiameterMm") / 2;
      const area = Math.PI * radius * radius * num(inputs, "boltCount");
      const safety = Math.max(1, num(inputs, "safetyFactor"));
      return nonNegative((area * num(inputs, "allowableStressMpa")) / safety);
    },
  },
  {
    id: "measurement.bolt_tightening_torque",
    family: "measurement",
    label: "Bolt tightening torque estimate",
    fn: (inputs) => {
      const forceN = num(inputs, "clampForceKn") * 1000;
      const diameterM = num(inputs, "boltDiameterMm") / 1000;
      const friction = Math.max(0.01, num(inputs, "frictionFactor", 0.2));
      return nonNegative(forceN * diameterM * friction);
    },
  },
  {
    id: "measurement.fire_flow_demand",
    family: "measurement",
    label: "Fire system flow demand",
    fn: (inputs) =>
      nonNegative(num(inputs, "protectedAreaM2") * num(inputs, "designDensityLpmM2")),
  },
  {
    id: "measurement.hydrant_count",
    family: "measurement",
    label: "Hydrant count from flow demand",
    fn: (inputs) => {
      const demand = num(inputs, "flowDemandLpm");
      const capacity = Math.max(1, num(inputs, "hydrantCapacityLpm"));
      return Math.ceil(demand / capacity);
    },
  },
  {
    id: "measurement.cylinder_force",
    family: "measurement",
    label: "Hydraulic or pneumatic cylinder force",
    fn: (inputs) => {
      const pressureNmm2 = num(inputs, "pressureBar") * 0.1;
      const area = Math.PI * (num(inputs, "boreMm") / 2) ** 2;
      return nonNegative(pressureNmm2 * area);
    },
  },
  {
    id: "measurement.cylinder_retract_force",
    family: "measurement",
    label: "Cylinder retract force on rod side",
    fn: (inputs) => {
      const pressureNmm2 = num(inputs, "pressureBar") * 0.1;
      const bore = num(inputs, "boreMm");
      const rod = num(inputs, "rodMm");
      const area = (Math.PI / 4) * Math.max(bore * bore - rod * rod, 0);
      return nonNegative(pressureNmm2 * area);
    },
  },
  {
    id: "measurement.vessel_wall_thickness",
    family: "measurement",
    label: "Pressure vessel wall thickness screening",
    fn: (inputs) => {
      const pressure = num(inputs, "designPressureBar");
      const diameter = num(inputs, "diameterMm");
      const stress = Math.max(1, num(inputs, "allowableStressMpa"));
      const efficiency = Math.max(0.1, num(inputs, "weldEfficiency", 0.85));
      return nonNegative((pressure * diameter) / (2 * stress * efficiency * 10));
    },
  },
  {
    id: "cost.sum3",
    family: "cost",
    label: "Three-component cost sum",
    fn: (inputs) => nonNegative(num(inputs, "a") + num(inputs, "b") + num(inputs, "c")),
  },
  {
    id: "cost.ratio_percent",
    family: "cost",
    label: "Ratio as percent of denominator",
    fn: (inputs) =>
      nonNegative(safeDivide(num(inputs, "numerator"), num(inputs, "denominator")) * 100),
  },
  {
    id: "time.vsm_total_lead_time",
    family: "time",
    label: "Value stream total lead time",
    fn: (inputs) =>
      nonNegative(
        num(inputs, "processMinutes") + num(inputs, "waitMinutes") + num(inputs, "transportMinutes"),
      ),
  },
  {
    id: "benchmark.value_added_percent",
    family: "benchmark",
    label: "Value-added time percent of lead time",
    fn: (inputs) => {
      const total = num(inputs, "totalLeadMinutes");
      if (total === 0) return 0;
      return assertFinite((num(inputs, "valueAddedMinutes") / total) * 100);
    },
  },
  {
    id: "lean.muda_overproduction_cost",
    family: "cost",
    label: "Overproduction waste cost with holding uplift",
    fn: () => getPrimedSevenMudaEngineeringResult().overproductionCost,
  },
  {
    id: "lean.muda_waiting_cost",
    family: "cost",
    label: "Waiting waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().waitingCost,
  },
  {
    id: "lean.muda_transport_cost",
    family: "cost",
    label: "Transport waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().transportCost,
  },
  {
    id: "lean.muda_inventory_cost",
    family: "cost",
    label: "Excess inventory holding waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().inventoryCost,
  },
  {
    id: "lean.muda_motion_cost",
    family: "cost",
    label: "Unnecessary motion waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().motionCost,
  },
  {
    id: "lean.muda_overprocessing_cost",
    family: "cost",
    label: "Overprocessing waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().overprocessingCost,
  },
  {
    id: "lean.muda_defect_cost",
    family: "cost",
    label: "Defect waste cost from scrap and rework",
    fn: () => getPrimedSevenMudaEngineeringResult().defectCost,
  },
  {
    id: "lean.muda_total_waste_cost",
    family: "cost",
    label: "Seven muda total waste cost",
    fn: () => getPrimedSevenMudaEngineeringResult().totalWasteCost,
  },
  {
    id: "lean.muda_highest_waste_index",
    family: "cost",
    label: "Highest muda waste category rank",
    fn: () =>
      resolveHighestWasteCategoryIndex({
        overproductionCost: getPrimedSevenMudaEngineeringResult().overproductionCost,
        waitingCost: getPrimedSevenMudaEngineeringResult().waitingCost,
        transportCost: getPrimedSevenMudaEngineeringResult().transportCost,
        inventoryCost: getPrimedSevenMudaEngineeringResult().inventoryCost,
        motionCost: getPrimedSevenMudaEngineeringResult().motionCost,
        overprocessingCost: getPrimedSevenMudaEngineeringResult().overprocessingCost,
        defectCost: getPrimedSevenMudaEngineeringResult().defectCost,
      }),
  },
  {
    id: "energy.monthly_kwh_savings",
    family: "energy",
    label: "Monthly kWh savings from baseline minus proposed",
    fn: (inputs) =>
      nonNegative(num(inputs, "baselineKwhMonthly") - num(inputs, "proposedKwhMonthly")),
  },
  {
    id: "finance.payback_years",
    family: "cost",
    label: "Simple payback years from investment and annual savings",
    fn: (inputs) => {
      const savings = num(inputs, "annualSavings");
      if (savings <= 0) return 0;
      return assertFinite(num(inputs, "initialInvestment") / savings);
    },
  },
  {
    id: "finance.simple_npv",
    family: "cost",
    label: "Simple NPV with fixed annual cash flow",
    fn: (inputs) => {
      const investment = num(inputs, "initialInvestment");
      const annual = num(inputs, "annualCashFlow");
      const rate = num(inputs, "discountRatePercent") / 100;
      const years = Math.max(1, Math.round(num(inputs, "horizonYears", 5)));
      let pv = -investment;
      for (let year = 1; year <= years; year += 1) {
        pv += annual / (1 + rate) ** year;
      }
      return assertFinite(pv);
    },
  },
  {
    id: "finance.annual_yield_percent",
    family: "cost",
    label: "Annual cash flow as percent of investment",
    fn: (inputs) => {
      const investment = num(inputs, "initialInvestment");
      if (investment <= 0) return 0;
      return assertFinite((num(inputs, "annualCashFlow") / investment) * 100);
    },
  },
  {
    id: "finance.roi_percent",
    family: "cost",
    label: "Return on investment percent",
    fn: (inputs) => {
      const investment = num(inputs, "initialInvestment");
      if (investment <= 0) return 0;
      const net = num(inputs, "totalReturn") - investment;
      return assertFinite((net / investment) * 100);
    },
  },
  {
    id: "cost.employer_burden_total",
    family: "cost",
    label: "Employer total payroll with burden percent",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const burden = num(inputs, "employerBurdenPercent");
      return nonNegative(gross * (1 + burden / 100));
    },
  },
  {
    id: "cost.severance_screening",
    family: "cost",
    label: "Screening severance estimate from salary and service years",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const years = num(inputs, "yearsOfService");
      const weeksPerYear = num(inputs, "severanceWeeksPerYear", 4);
      return nonNegative(gross * (weeksPerYear / 4) * years);
    },
  },
  {
    id: "cost.notice_screening",
    family: "cost",
    label: "Screening notice-period cost estimate",
    fn: (inputs) => {
      const gross = num(inputs, "grossMonthlySalary");
      const weeks = num(inputs, "noticeWeeks", 4);
      return nonNegative(gross * (weeks / 4));
    },
  },
  {
    id: "measurement.pulley_driven_rpm",
    family: "measurement",
    label: "Driven pulley RPM from driver RPM and diameters",
    fn: (inputs) => {
      const driver = num(inputs, "driverDiameterMm");
      const driven = Math.max(1, num(inputs, "drivenDiameterMm"));
      return nonNegative((num(inputs, "driverRpm") * driver) / driven);
    },
  },
  {
    id: "measurement.belt_speed_mpm",
    family: "measurement",
    label: "Belt speed from driver diameter and RPM",
    fn: (inputs) => {
      const diameter = num(inputs, "driverDiameterMm");
      const rpm = num(inputs, "driverRpm");
      return nonNegative((Math.PI * diameter * rpm) / 1000);
    },
  },
  {
    id: "measurement.open_belt_length_mm",
    family: "measurement",
    label: "Open belt length estimate from pulley diameters and center distance",
    fn: (inputs) => {
      const driver = num(inputs, "driverDiameterMm");
      const driven = num(inputs, "drivenDiameterMm");
      const center = Math.max(driver + driven, num(inputs, "centerDistanceMm"));
      const diff = driver - driven;
      return nonNegative(
        2 * center + (Math.PI / 2) * (driver + driven) + (diff * diff) / (4 * center),
      );
    },
  },
];

// Legacy aliases — stable ids for existing pilot schemas (same functions)
const LEGACY_ALIASES: Readonly<Record<string, string>> = {
  "loss.time_cost": "time.labor_cost",
  "loss.scrap_cost": "scrap.material_cost",
  "loss.combined_operating": "scrap.combined_operating",
  "loss.total_exposure": "scrap.total_exposure",
};

export const FORMULA_META: Record<
  string,
  { readonly family: FormulaFamilyId; readonly label: string }
> = {};

export const FORMULA_REGISTRY: Record<string, FormulaFn> = {};

for (const def of FORMULA_DEFINITIONS) {
  FORMULA_META[def.id] = { family: def.family, label: def.label };
  FORMULA_REGISTRY[def.id] = def.fn;
}

for (const [legacyId, canonicalId] of Object.entries(LEGACY_ALIASES)) {
  const canonical = FORMULA_DEFINITIONS.find((d) => d.id === canonicalId);
  if (!canonical) continue;
  FORMULA_META[legacyId] = { family: canonical.family, label: `${canonical.label} (legacy id)` };
  FORMULA_REGISTRY[legacyId] = canonical.fn;
}

/** Formulas grouped by the 10 locked families. */
export const FORMULAS_BY_FAMILY = FORMULA_FAMILIES.reduce<
  Record<FormulaFamilyId, readonly string[]>
>(
  (acc, family) => {
    acc[family] = Object.entries(FORMULA_META)
      .filter(([, meta]) => meta.family === family)
      .map(([id]) => id)
      .sort();
    return acc;
  },
  {} as Record<FormulaFamilyId, readonly string[]>
);

export { FORMULA_FAMILIES, FORMULA_FAMILY_LABELS };

export function getFormulaFn(formulaId: string): FormulaFn {
  const fn = FORMULA_REGISTRY[formulaId];
  if (!fn) {
    throw new Error(`Unknown formulaId: ${formulaId}`);
  }
  return fn;
}

export function getFormulaFamily(formulaId: string): FormulaFamilyId | null {
  return FORMULA_META[formulaId]?.family ?? null;
}

export function listRegisteredFormulaIds(): readonly string[] {
  return Object.keys(FORMULA_REGISTRY).sort();
}

export function formulaIdsInFamily(family: FormulaFamilyId): readonly string[] {
  return FORMULAS_BY_FAMILY[family] ?? [];
}

export type FormulaOutputHint = PremiumOutputFormat;

export interface FormulaRegistryMeta {
  readonly formulaId: string;
  readonly family: FormulaFamilyId;
  readonly label: string;
  readonly description: string;
  readonly requiredInputs: readonly string[];
  readonly outputHint: FormulaOutputHint;
}

const FORMULA_META_DETAILS: Record<
  string,
  Omit<FormulaRegistryMeta, "formulaId" | "family" | "label">
> = {
  "measurement.variance_percent": {
    description: "Percent deviation of actual versus target measurement.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "benchmark.variance_percent": {
    description: "Percent variance against a benchmark target.",
    requiredInputs: ["actual", "target"],
    outputHint: "percentage",
  },
  "time.labor_cost": {
    description: "Labor or machine time converted to cost exposure.",
    requiredInputs: ["hourlyCost", "lossHours"],
    outputHint: "currency",
  },
  "time.downtime_minute_cost": {
    description: "Downtime minutes converted to cost at an hourly shop rate.",
    requiredInputs: ["downtimeMinutes", "hourlyRate"],
    outputHint: "currency",
  },
  "time.downtime_units_lost": {
    description: "Good units not produced during downtime.",
    requiredInputs: ["downtimeMinutes", "outputUnitsPerHour"],
    outputHint: "number",
  },
  "scrap.material_cost": {
    description: "Material cost multiplied by scrap rate percent.",
    requiredInputs: ["materialCost", "scrapRate"],
    outputHint: "currency",
  },
  "scrap.combined_operating": {
    description: "Stack of labor, material and overhead operating costs.",
    requiredInputs: ["laborCost", "materialCost", "overheadCost"],
    outputHint: "currency",
  },
  "scrap.total_exposure": {
    description: "Base cost scaled by hidden loss multiplier.",
    requiredInputs: ["baseCost", "hiddenMultiplier"],
    outputHint: "currency",
  },
  "oee.basic": {
    description: "Classic OEE score from availability, performance and quality.",
    requiredInputs: ["availability", "performance", "quality"],
    outputHint: "score",
  },
  "oee.availability_loss_cost": {
    description: "Cost of availability loss above planned tolerance.",
    requiredInputs: ["machineRate", "downtimeHours", "plannedHours"],
    outputHint: "currency",
  },
  "route.deadhead_cost": {
    description: "Unpaid return distance cost exposure.",
    requiredInputs: ["distanceKm", "costPerKm", "emptyReturnPercent"],
    outputHint: "currency",
  },
  "route.total_freight_cost": {
    description: "Fuel, driver, tolls and deadhead combined freight cost.",
    requiredInputs: ["fuelCost", "driverCost", "tolls", "deadheadCost"],
    outputHint: "currency",
  },
  "energy.excess_kwh_cost": {
    description: "Cost of kWh consumption above target.",
    requiredInputs: ["currentKwh", "targetKwh", "rate"],
    outputHint: "currency",
  },
  "energy.kwh_cost": {
    description: "Simple kWh times rate cost.",
    requiredInputs: ["kwh", "rate"],
    outputHint: "currency",
  },
  "energy.peak_demand_cost": {
    description: "Peak kWh tariff plus demand charge.",
    requiredInputs: ["peakKwh", "peakRate", "demandCharge"],
    outputHint: "currency",
  },
  "energy.total_energy_cost": {
    description: "Excess kWh cost plus peak demand stack.",
    requiredInputs: ["excessKwh", "energyRate", "peakCost"],
    outputHint: "currency",
  },
  "carbon.cbam_exposure": {
    description: "Carbon border adjustment exposure estimate.",
    requiredInputs: ["emissionsTon", "carbonPrice", "exposurePercent"],
    outputHint: "currency",
  },
  "cost.p90_buffer": {
    description: "P90 volatility buffer on adjusted cost.",
    requiredInputs: ["adjustedCost", "volatilityPercent"],
    outputHint: "currency",
  },
  "cost.minimum_safe_price": {
    description: "Minimum safe price from P90 cost and target margin.",
    requiredInputs: ["p90Cost", "targetMarginPercent"],
    outputHint: "currency",
  },
  "yield.gap_value": {
    description: "Yield gap tonnage valued at price per ton.",
    requiredInputs: ["yieldGapTon", "pricePerTon"],
    outputHint: "currency",
  },
  "loss.waste_exposure": {
    description: "Ingredient waste cost from monthly spend and waste rate.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate"],
    outputHint: "currency",
  },
  "loss.excess_waste_cost": {
    description: "Waste cost above target waste rate band.",
    requiredInputs: ["monthlyIngredientCost", "wasteRate", "targetWasteRate"],
    outputHint: "currency",
  },
  "cost.margin_pressure": {
    description: "Excess cost as percent of monthly revenue.",
    requiredInputs: ["excessCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "time.delay_cost": {
    description: "Daily site cost multiplied by delay days.",
    requiredInputs: ["dailySiteCost", "delayDays"],
    outputHint: "currency",
  },
  "cost.overrun_cost": {
    description: "Budget overrun from percent drift.",
    requiredInputs: ["budget", "overrunPercent"],
    outputHint: "currency",
  },
  "cost.total_exposure": {
    description: "Sum of three exposure components.",
    requiredInputs: ["a", "b", "c"],
    outputHint: "currency",
  },
  "time.rework_cost": {
    description: "Rework hours multiplied by labor rate.",
    requiredInputs: ["reworkHours", "laborRate"],
    outputHint: "currency",
  },
  "cost.food_cost_percent": {
    description: "Ingredient cost as percent of monthly revenue.",
    requiredInputs: ["ingredientCost", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.delivery_fee_cost": {
    description: "Delivery platform fee from revenue and fee percent.",
    requiredInputs: ["monthlyRevenue", "deliveryAppFeePercent"],
    outputHint: "currency",
  },
  "cost.restaurant_margin_pressure": {
    description: "Combined ingredient, delivery and waste pressure on revenue.",
    requiredInputs: ["ingredientCost", "deliveryFeeCost", "wasteExposure", "monthlyRevenue"],
    outputHint: "percentage",
  },
  "cost.variance": {
    description: "Positive variance of actual over planned cost.",
    requiredInputs: ["actual", "planned"],
    outputHint: "currency",
  },
  "route.distance_drift_cost": {
    description: "Fuel cost of distance driven above plan.",
    requiredInputs: ["plannedDistanceKm", "actualDistanceKm", "fuelCostPerKm"],
    outputHint: "currency",
  },
  "cost.sum2": {
    description: "Sum of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.total2": {
    description: "Total of two exposure components.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.value": {
    description: "Pass-through of a single numeric input to pipeline output.",
    requiredInputs: ["value"],
    outputHint: "currency",
  },
  "energy.compressor_leak_kwh": {
    description: "Compressor leak kWh from power, hours and leak percent.",
    requiredInputs: ["compressorKw", "leakPercent", "operatingHours"],
    outputHint: "number",
  },
  "cost.annualize": {
    description: "Monthly cost multiplied by twelve.",
    requiredInputs: ["monthlyCost"],
    outputHint: "currency",
  },
  "cloud.api_call_cost": {
    description: "API call volume cost from calls and per-thousand rate.",
    requiredInputs: ["monthlyApiCalls", "costPerThousandCalls"],
    outputHint: "currency",
  },
  "agriculture.yield_loss_revenue": {
    description: "Revenue lost from yield gap per hectare.",
    requiredInputs: ["areaHa", "expectedYieldTonPerHa", "actualYieldTonPerHa", "pricePerTon"],
    outputHint: "currency",
  },
  "cost.unit_cost": {
    description: "Total cost divided by quantity for per-unit exposure.",
    requiredInputs: ["totalCost", "quantity"],
    outputHint: "currency",
  },
  "time.setup_loss": {
    description: "Setup minutes converted to monthly changeover cost.",
    requiredInputs: ["setupMinutes", "setupsPerMonth", "hourlyCost"],
    outputHint: "currency",
  },
  "cost.percent_of_amount": {
    description: "Percent applied to a base amount.",
    requiredInputs: ["amount", "percent"],
    outputHint: "currency",
  },
  "cost.difference": {
    description: "Signed difference between two numeric amounts.",
    requiredInputs: ["a", "b"],
    outputHint: "currency",
  },
  "cost.margin_rate_on_price": {
    description: "Gross margin percent based on price and cost.",
    requiredInputs: ["price", "cost"],
    outputHint: "percentage",
  },
  "cost.quote_target_price": {
    description: "Target sales price from loaded cost and target margin.",
    requiredInputs: ["totalCost", "targetMarginPercent"],
    outputHint: "currency",
  },
  "cost.quote_safe_floor_price": {
    description: "Minimum safe price with extra margin uplift.",
    requiredInputs: ["totalCost", "targetMarginPercent", "safetyMarginUplift"],
    outputHint: "currency",
  },
  "cost.shop_hourly_rate": {
    description: "Fixed monthly burden per hour plus variable hourly cost.",
    requiredInputs: ["fixedMonthlyCost", "monthlyMachineHours", "variableCostPerHour"],
    outputHint: "currency",
  },
  "cost.break_even_units": {
    description: "Units required to cover fixed costs at contribution margin.",
    requiredInputs: ["fixedCost", "unitPrice", "variableCostPerUnit"],
    outputHint: "number",
  },
  "cost.safety_margin_rate": {
    description: "Percent volume cushion above break-even.",
    requiredInputs: ["breakEvenUnits", "currentVolume"],
    outputHint: "percentage",
  },
  "carbon.unit_product_emissions": {
    description: "Total emissions divided by production units.",
    requiredInputs: ["totalEmissionsTon", "productionUnits"],
    outputHint: "number",
  },
  "carbon.unit_exposure_cost": {
    description: "Unit emissions multiplied by reference carbon price.",
    requiredInputs: ["unitEmissionsTon", "carbonPrice"],
    outputHint: "currency",
  },
  "time.hour_overrun_cost": {
    description: "Labor cost of hours above planned estimate.",
    requiredInputs: ["actualHours", "plannedHours", "hourlyCost"],
    outputHint: "currency",
  },
  "cost.count_cost": {
    description: "Unit count multiplied by cost each.",
    requiredInputs: ["count", "costEach"],
    outputHint: "currency",
  },
  "agriculture.feed_monthly_cost": {
    description: "Monthly feed spend from herd size and daily rate.",
    requiredInputs: ["cows", "feedCostPerCowPerDay", "days"],
    outputHint: "currency",
  },
  "agriculture.milk_yield_gap_revenue": {
    description: "Revenue gap from milk yield below target.",
    requiredInputs: [
      "cows",
      "milkLitersPerCowPerDay",
      "targetMilkLitersPerCowPerDay",
      "milkPricePerLiter",
      "days",
    ],
    outputHint: "currency",
  },
  "retail.inventory_turnover": {
    description: "Annual COGS divided by average inventory.",
    requiredInputs: ["annualCOGS", "averageInventory"],
    outputHint: "score",
  },
  "inventory.eoq_units": {
    description: "Classic EOQ from demand, order cost and holding cost percent.",
    requiredInputs: ["annualDemand", "orderCost", "unitCost", "carryingCostPercent"],
    outputHint: "number",
  },
  "inventory.carrying_cost_annual": {
    description: "Annual carrying cost from average EOQ inventory.",
    requiredInputs: ["eoqUnits", "unitCost", "carryingCostPercent"],
    outputHint: "currency",
  },
  "warehouse.unused_space_cost": {
    description: "Rent allocated to unused warehouse space.",
    requiredInputs: ["monthlyRent", "unusedSpacePercent"],
    outputHint: "currency",
  },
  "legal.simple_interest_days": {
    description: "Simple interest from principal, rate and days.",
    requiredInputs: ["principal", "annualInterestPercent", "days"],
    outputHint: "currency",
  },
  "carbon.total_emissions": {
    description: "Sum of energy and fuel emissions tonnage.",
    requiredInputs: ["energyEmissionsTon", "fuelEmissionsTon"],
    outputHint: "number",
  },
  "calibration.tolerance_status": {
    description: "Percent of tolerance band consumed by deviation.",
    requiredInputs: ["target", "actual", "tolerance"],
    outputHint: "percentage",
  },
  "calibration.tolerance_worst_case_stack": {
    description: "Linear worst-case sum of four tolerance contributions.",
    requiredInputs: ["t1", "t2", "t3", "t4"],
    outputHint: "number",
  },
  "calibration.tolerance_rss_stack": {
    description: "Root-sum-square stack of four tolerance contributions.",
    requiredInputs: ["t1", "t2", "t3", "t4"],
    outputHint: "number",
  },
  "measurement.weld_throat_capacity": {
    description: "Screening-level fillet weld capacity estimate.",
    requiredInputs: ["throatMm", "weldLengthMm", "allowableStressMpa", "safetyFactor"],
    outputHint: "number",
  },
  "measurement.bolt_shear_capacity": {
    description: "Screening-level bolt shear capacity estimate.",
    requiredInputs: ["boltDiameterMm", "boltCount", "allowableStressMpa", "safetyFactor"],
    outputHint: "number",
  },
  "measurement.bolt_tightening_torque": {
    description: "Torque estimate from clamp force, bolt diameter and friction factor.",
    requiredInputs: ["clampForceKn", "boltDiameterMm", "frictionFactor"],
    outputHint: "number",
  },
  "measurement.fire_flow_demand": {
    description: "Required fire flow from protected area and design density.",
    requiredInputs: ["protectedAreaM2", "designDensityLpmM2"],
    outputHint: "number",
  },
  "measurement.hydrant_count": {
    description: "Hydrant count from total flow demand and per-hydrant capacity.",
    requiredInputs: ["flowDemandLpm", "hydrantCapacityLpm"],
    outputHint: "number",
  },
  "measurement.cylinder_force": {
    description: "Cylinder force from pressure and bore diameter.",
    requiredInputs: ["pressureBar", "boreMm"],
    outputHint: "number",
  },
  "measurement.cylinder_retract_force": {
    description: "Retract force from pressure, bore and rod diameters.",
    requiredInputs: ["pressureBar", "boreMm", "rodMm"],
    outputHint: "number",
  },
  "measurement.vessel_wall_thickness": {
    description: "Screening wall thickness from pressure, diameter and allowable stress.",
    requiredInputs: ["designPressureBar", "diameterMm", "allowableStressMpa", "weldEfficiency"],
    outputHint: "number",
  },
  "cost.sum3": {
    description: "Sum of three cost components.",
    requiredInputs: ["a", "b", "c"],
    outputHint: "currency",
  },
  "cost.ratio_percent": {
    description: "Numerator as percent of denominator.",
    requiredInputs: ["numerator", "denominator"],
    outputHint: "percentage",
  },
  "time.vsm_total_lead_time": {
    description: "Total lead time from process, wait and transport minutes.",
    requiredInputs: ["processMinutes", "waitMinutes", "transportMinutes"],
    outputHint: "number",
  },
  "benchmark.value_added_percent": {
    description: "Value-added minutes as percent of total lead time.",
    requiredInputs: ["valueAddedMinutes", "totalLeadMinutes"],
    outputHint: "percentage",
  },
  "lean.muda_overproduction_cost": {
    description: "REV5 overproduction waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_waiting_cost": {
    description: "REV5 waiting waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_transport_cost": {
    description: "REV5 transport waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_inventory_cost": {
    description: "REV5 inventory waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_motion_cost": {
    description: "REV5 motion waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_overprocessing_cost": {
    description: "REV5 overprocessing waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_defect_cost": {
    description: "REV5 defect waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_total_waste_cost": {
    description: "REV5 total waste cost from the primed engineering model.",
    requiredInputs: [],
    outputHint: "currency",
  },
  "lean.muda_highest_waste_index": {
    description: "Rank of the highest REV5 muda waste category (1–7).",
    requiredInputs: [],
    outputHint: "number",
  },
  "energy.monthly_kwh_savings": {
    description: "Monthly kWh reduction from baseline to proposed consumption.",
    requiredInputs: ["baselineKwhMonthly", "proposedKwhMonthly"],
    outputHint: "number",
  },
  "finance.payback_years": {
    description: "Initial investment divided by annual savings.",
    requiredInputs: ["initialInvestment", "annualSavings"],
    outputHint: "number",
  },
  "finance.simple_npv": {
    description: "NPV with fixed annual cash flow and discount rate.",
    requiredInputs: ["initialInvestment", "annualCashFlow", "discountRatePercent", "horizonYears"],
    outputHint: "currency",
  },
  "finance.annual_yield_percent": {
    description: "Annual cash flow divided by initial investment.",
    requiredInputs: ["initialInvestment", "annualCashFlow"],
    outputHint: "percentage",
  },
  "finance.roi_percent": {
    description: "Return on investment as percent of initial investment.",
    requiredInputs: ["initialInvestment", "totalReturn"],
    outputHint: "percentage",
  },
  "cost.employer_burden_total": {
    description: "Gross monthly salary with employer burden percent.",
    requiredInputs: ["grossMonthlySalary", "employerBurdenPercent"],
    outputHint: "currency",
  },
  "cost.severance_screening": {
    description: "Screening severance estimate from salary and service years.",
    requiredInputs: ["grossMonthlySalary", "yearsOfService", "severanceWeeksPerYear"],
    outputHint: "currency",
  },
  "cost.notice_screening": {
    description: "Screening notice-period cost from weekly salary factor.",
    requiredInputs: ["grossMonthlySalary", "noticeWeeks"],
    outputHint: "currency",
  },
  "measurement.pulley_driven_rpm": {
    description: "Driven pulley RPM from driver speed and pulley diameters.",
    requiredInputs: ["driverRpm", "driverDiameterMm", "drivenDiameterMm"],
    outputHint: "number",
  },
  "measurement.belt_speed_mpm": {
    description: "Linear belt speed from driver pulley diameter and RPM.",
    requiredInputs: ["driverDiameterMm", "driverRpm"],
    outputHint: "number",
  },
  "measurement.open_belt_length_mm": {
    description: "Open belt length from pulley diameters and center distance.",
    requiredInputs: ["driverDiameterMm", "drivenDiameterMm", "centerDistanceMm"],
    outputHint: "number",
  },
};

function buildFormulaRegistryMeta(): FormulaRegistryMeta[] {
  return listRegisteredFormulaIds().map((formulaId) => {
    const canonicalId = LEGACY_ALIASES[formulaId] ?? formulaId;
    const meta = FORMULA_META[formulaId];
    const details = FORMULA_META_DETAILS[canonicalId];
    if (!meta || !details) {
      throw new Error(`Missing formula metadata for "${formulaId}"`);
    }
    return {
      formulaId,
      family: meta.family,
      label: meta.label,
      description: details.description,
      requiredInputs: details.requiredInputs,
      outputHint: details.outputHint,
    };
  });
}

export const FORMULA_REGISTRY_META: readonly FormulaRegistryMeta[] = buildFormulaRegistryMeta();

export function getFormulaRegistryMeta(formulaId: string): FormulaRegistryMeta | null {
  return FORMULA_REGISTRY_META.find((item) => item.formulaId === formulaId) ?? null;
}
