import machiningCostPerPartFormula from "./machining-cost-per-part.formula";
import cncShopHourlyRateFormula from "./cnc-shop-hourly-rate.formula";
import cuttingSpeedFeedRpmFormula from "./cutting-speed-feed-rpm.formula";
import tapDrillSizeFormula from "./tap-drill-size.formula";
import iso286ToleranceFitFormula from "./iso-286-tolerance-fit.formula";
import surfaceRoughnessConverterFormula from "./surface-roughness-converter.formula";
import materialRemovalRateFormula from "./material-removal-rate.formula";
import toolLifeToolCostPerPartFormula from "./tool-life-tool-cost-per-part.formula";
import scrapCostFormula from "./scrap-cost.formula";
import reworkVsScrapDecisionFormula from "./rework-vs-scrap-decision.formula";
import threadDimensionsReferenceFormula from "./thread-dimensions-reference.formula";
import knurlingDrillPointDepthFormula from "./knurling-drill-point-depth.formula";
import weldMetalWeightConsumableFormula from "./weld-metal-weight-consumable.formula";
import filletWeldSizeStrengthFormula from "./fillet-weld-size-strength.formula";
import weldingCostPerMeterFormula from "./welding-cost-per-meter.formula";
import weldingHeatInputFormula from "./welding-heat-input.formula";
import boltTorqueFormula from "./bolt-torque.formula";
import boltPreloadClampForceFormula from "./bolt-preload-clamp-force.formula";
import steelWeightFormula from "./steel-weight.formula";
import beamLoadDeflectionQuickCheckFormula from "./beam-load-deflection-quick-check.formula";
import sheetMetalBendAllowanceFormula from "./sheet-metal-bend-allowance.formula";
import oeeFormula from "./oee.formula";
import downtimeCostFormula from "./downtime-cost.formula";
import taktTimeCycleTimeFormula from "./takt-time-cycle-time.formula";
import setupTimeCostFormula from "./setup-time-cost.formula";
import lineBalancingEfficiencyFormula from "./line-balancing-efficiency.formula";
import compressedAirLeakCostFormula from "./compressed-air-leak-cost.formula";
import electricMotorRunningCostFormula from "./electric-motor-running-cost.formula";
import energyCostPerPartFormula from "./energy-cost-per-part.formula";
import cbamCostQuickEstimatorFormula from "./cbam-cost-quick-estimator.formula";
import electricityCo2EmissionsFormula from "./electricity-co2-emissions.formula";
import dieselFuelCo2EmissionsFormula from "./diesel-fuel-co2-emissions.formula";
import productCarbonFootprintBasicFormula from "./product-carbon-footprint-basic.formula";
import carbonPriceExposureFormula from "./carbon-price-exposure.formula";
import trueEmployeeCostFormula from "./true-employee-cost.formula";
import quoteMarginMarkupFormula from "./quote-margin-markup.formula";
import breakEvenPointFormula from "./break-even-point.formula";
import breakEvenMarginOfSafetyFormula from "./break-even-and-margin-of-safety-analysis.formula";
import paymentTermCostFormula from "./payment-term-cost.formula";
import machineInvestmentPaybackFormula from "./machine-investment-payback.formula";
import customerProfitabilityFormula from "./customer-profitability.formula";
import currencyAdjustedPricingFormula from "./currency-adjusted-pricing.formula";
import eoqFormula from "./eoq.formula";
import safetyStockReorderPointFormula from "./safety-stock-reorder-point.formula";
import inventoryCarryingCostFormula from "./inventory-carrying-cost.formula";
import palletContainerLoadCbmFormula from "./pallet-container-load-cbm.formula";
import freightCostPerKmTripFormula from "./freight-cost-per-km-trip.formula";
import concreteVolumeOrderQuantityFormula from "./concrete-volume-order-quantity.formula";
import rebarWeightCountFormula from "./rebar-weight-count.formula";
import recipeCostMenuPriceFormula from "./recipe-cost-menu-price.formula";
import fabricConsumptionGsmFormula from "./fabric-consumption-gsm.formula";
import vonMisesStressFormula from "./von-mises-stress-calculator.formula";
import netPresentValueFormula from "./net-present-value-calculator.formula";
import returnOnInvestmentFormula from "./return-on-investment-calculator.formula";

import type { FreeV531FormulaModule } from "./types";

export const freeV531FormulaRegistry: Readonly<Record<string, FreeV531FormulaModule>> = {
  "machining-cost-per-part": machiningCostPerPartFormula,
  "cnc-shop-hourly-rate": cncShopHourlyRateFormula,
  "cutting-speed-feed-rpm": cuttingSpeedFeedRpmFormula,
  "tap-drill-size": tapDrillSizeFormula,
  "iso-286-tolerance-fit": iso286ToleranceFitFormula,
  "surface-roughness-converter": surfaceRoughnessConverterFormula,
  "material-removal-rate": materialRemovalRateFormula,
  "tool-life-tool-cost-per-part": toolLifeToolCostPerPartFormula,
  "scrap-cost": scrapCostFormula,
  "rework-vs-scrap-decision": reworkVsScrapDecisionFormula,
  "thread-dimensions-reference": threadDimensionsReferenceFormula,
  "knurling-drill-point-depth": knurlingDrillPointDepthFormula,
  "weld-metal-weight-consumable": weldMetalWeightConsumableFormula,
  "fillet-weld-size-strength": filletWeldSizeStrengthFormula,
  "welding-cost-per-meter": weldingCostPerMeterFormula,
  "welding-heat-input": weldingHeatInputFormula,
  "bolt-torque": boltTorqueFormula,
  "bolt-preload-clamp-force": boltPreloadClampForceFormula,
  "steel-weight": steelWeightFormula,
  "beam-load-deflection-quick-check": beamLoadDeflectionQuickCheckFormula,
  "sheet-metal-bend-allowance": sheetMetalBendAllowanceFormula,
  "oee": oeeFormula,
  "downtime-cost": downtimeCostFormula,
  "takt-time-cycle-time": taktTimeCycleTimeFormula,
  "setup-time-cost": setupTimeCostFormula,
  "line-balancing-efficiency": lineBalancingEfficiencyFormula,
  "compressed-air-leak-cost": compressedAirLeakCostFormula,
  "electric-motor-running-cost": electricMotorRunningCostFormula,
  "energy-cost-per-part": energyCostPerPartFormula,
  "cbam-cost-quick-estimator": cbamCostQuickEstimatorFormula,
  "electricity-co2-emissions": electricityCo2EmissionsFormula,
  "diesel-fuel-co2-emissions": dieselFuelCo2EmissionsFormula,
  "product-carbon-footprint-basic": productCarbonFootprintBasicFormula,
  "carbon-price-exposure": carbonPriceExposureFormula,
  "true-employee-cost": trueEmployeeCostFormula,
  "quote-margin-markup": quoteMarginMarkupFormula,
  "break-even-point": breakEvenPointFormula,
  "break-even-and-margin-of-safety-analysis": breakEvenMarginOfSafetyFormula,
  "payment-term-cost": paymentTermCostFormula,
  "machine-investment-payback": machineInvestmentPaybackFormula,
  "customer-profitability": customerProfitabilityFormula,
  "currency-adjusted-pricing": currencyAdjustedPricingFormula,
  "eoq": eoqFormula,
  "safety-stock-reorder-point": safetyStockReorderPointFormula,
  "inventory-carrying-cost": inventoryCarryingCostFormula,
  "pallet-container-load-cbm": palletContainerLoadCbmFormula,
  "freight-cost-per-km-trip": freightCostPerKmTripFormula,
  "concrete-volume-order-quantity": concreteVolumeOrderQuantityFormula,
  "rebar-weight-count": rebarWeightCountFormula,
  "recipe-cost-menu-price": recipeCostMenuPriceFormula,
  "fabric-consumption-gsm": fabricConsumptionGsmFormula,
  "von-mises-stress-calculator": vonMisesStressFormula,
  "net-present-value-calculator": netPresentValueFormula,
  "return-on-investment-calculator": returnOnInvestmentFormula,
};

export { default as machiningCostPerPartFormula } from "./machining-cost-per-part.formula";
export { default as cncShopHourlyRateFormula } from "./cnc-shop-hourly-rate.formula";
export { default as cuttingSpeedFeedRpmFormula } from "./cutting-speed-feed-rpm.formula";
export { default as tapDrillSizeFormula } from "./tap-drill-size.formula";
export { default as iso286ToleranceFitFormula } from "./iso-286-tolerance-fit.formula";
export { default as surfaceRoughnessConverterFormula } from "./surface-roughness-converter.formula";
export { default as materialRemovalRateFormula } from "./material-removal-rate.formula";
export { default as toolLifeToolCostPerPartFormula } from "./tool-life-tool-cost-per-part.formula";
export { default as scrapCostFormula } from "./scrap-cost.formula";
export { default as reworkVsScrapDecisionFormula } from "./rework-vs-scrap-decision.formula";
export { default as threadDimensionsReferenceFormula } from "./thread-dimensions-reference.formula";
export { default as knurlingDrillPointDepthFormula } from "./knurling-drill-point-depth.formula";
export { default as weldMetalWeightConsumableFormula } from "./weld-metal-weight-consumable.formula";
export { default as filletWeldSizeStrengthFormula } from "./fillet-weld-size-strength.formula";
export { default as weldingCostPerMeterFormula } from "./welding-cost-per-meter.formula";
export { default as weldingHeatInputFormula } from "./welding-heat-input.formula";
export { default as boltTorqueFormula } from "./bolt-torque.formula";
export { default as boltPreloadClampForceFormula } from "./bolt-preload-clamp-force.formula";
export { default as steelWeightFormula } from "./steel-weight.formula";
export { default as beamLoadDeflectionQuickCheckFormula } from "./beam-load-deflection-quick-check.formula";
export { default as sheetMetalBendAllowanceFormula } from "./sheet-metal-bend-allowance.formula";
export { default as oeeFormula } from "./oee.formula";
export { default as downtimeCostFormula } from "./downtime-cost.formula";
export { default as taktTimeCycleTimeFormula } from "./takt-time-cycle-time.formula";
export { default as setupTimeCostFormula } from "./setup-time-cost.formula";
export { default as lineBalancingEfficiencyFormula } from "./line-balancing-efficiency.formula";
export { default as compressedAirLeakCostFormula } from "./compressed-air-leak-cost.formula";
export { default as electricMotorRunningCostFormula } from "./electric-motor-running-cost.formula";
export { default as energyCostPerPartFormula } from "./energy-cost-per-part.formula";
export { default as cbamCostQuickEstimatorFormula } from "./cbam-cost-quick-estimator.formula";
export { default as electricityCo2EmissionsFormula } from "./electricity-co2-emissions.formula";
export { default as dieselFuelCo2EmissionsFormula } from "./diesel-fuel-co2-emissions.formula";
export { default as productCarbonFootprintBasicFormula } from "./product-carbon-footprint-basic.formula";
export { default as carbonPriceExposureFormula } from "./carbon-price-exposure.formula";
export { default as trueEmployeeCostFormula } from "./true-employee-cost.formula";
export { default as quoteMarginMarkupFormula } from "./quote-margin-markup.formula";
export { default as breakEvenPointFormula } from "./break-even-point.formula";
export { default as breakEvenMarginOfSafetyFormula } from "./break-even-and-margin-of-safety-analysis.formula";
export { default as paymentTermCostFormula } from "./payment-term-cost.formula";
export { default as machineInvestmentPaybackFormula } from "./machine-investment-payback.formula";
export { default as customerProfitabilityFormula } from "./customer-profitability.formula";
export { default as currencyAdjustedPricingFormula } from "./currency-adjusted-pricing.formula";
export { default as eoqFormula } from "./eoq.formula";
export { default as safetyStockReorderPointFormula } from "./safety-stock-reorder-point.formula";
export { default as inventoryCarryingCostFormula } from "./inventory-carrying-cost.formula";
export { default as palletContainerLoadCbmFormula } from "./pallet-container-load-cbm.formula";
export { default as freightCostPerKmTripFormula } from "./freight-cost-per-km-trip.formula";
export { default as concreteVolumeOrderQuantityFormula } from "./concrete-volume-order-quantity.formula";
export { default as rebarWeightCountFormula } from "./rebar-weight-count.formula";
export { default as recipeCostMenuPriceFormula } from "./recipe-cost-menu-price.formula";
export { default as fabricConsumptionGsmFormula } from "./fabric-consumption-gsm.formula";
export { default as vonMisesStressFormula } from "./von-mises-stress-calculator.formula";
export { default as netPresentValueFormula } from "./net-present-value-calculator.formula";
export { default as returnOnInvestmentFormula } from "./return-on-investment-calculator.formula";
export type {
  FreeV531RiskLevel,
  FreeV531DecisionState,
  FreeV531RedactionStatus,
  FreeV531Severity,
  FreeV531InputSpec,
  FreeV531OutputMetric,
  FreeV531Warning,
  FreeV531AuditSeal,
  FreeV531ExecuteResponse,
  FreeV531FormulaModule,
} from "./types";
