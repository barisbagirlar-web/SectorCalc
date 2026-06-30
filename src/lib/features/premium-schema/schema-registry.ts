import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
import { THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA } from "@/lib/features/premium-schema/schemas/3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator";
import { THREE_B_PRINTING_BATCH_NESTING_SCHEMA } from "@/lib/features/premium-schema/schemas/3b-baski-parti-optimizasyonu-ve-yuvalama-calculator";
import { THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/3b-baski-vs-talasli-imalat-basabas-noktasi-calculator";
import { FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator";
import { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA } from "@/lib/features/premium-schema/schemas/7-israf-muda-avcisi-parasal-karsilik-calculator";
import { ALL_INDUSTRIAL_FORMULA_SCHEMAS } from "@/lib/features/premium-schema/schemas/industrial-formulas-schemas";
import { AI_TOKEN_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/ai-token-cost-analyzer";
import { SIX_SIGMA_PRIORITIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/six-sigma-project-prioritizer";
import { AQL_SAMPLING_SCHEMA } from "@/lib/features/premium-schema/schemas/aql-sampling-risk-analyzer";
import { VEHICLE_DEPRECIATION_SCHEMA } from "@/lib/features/premium-schema/schemas/vehicle-depreciation-tco-analyzer";
import { DOWNTIME_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/downtime-cost-analyzer";
import { AUTO_REPAIR_COMEBACK_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-repair-comeback-analyzer";
import { AUTO_REPAIR_QUOTE_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-repair-quote-consistency-analyzer";
import { AUTO_SHOP_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-shop-margin-leak-analyzer";
import { ASME_VESSEL_SCHEMA } from "@/lib/features/premium-schema/schemas/asme-pressure-vessel-analyzer";
import { COMPRESSED_AIR_SCHEMA } from "@/lib/features/premium-schema/schemas/compressed-air-energy-cost-analyzer";
import { BREAK_EVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/break-even-margin-of-safety-analyzer";
import { CONCRETE_VOLUME_SCHEMA } from "@/lib/features/premium-schema/schemas/concrete-volume-cost-analyzer";
import { CALIBRATION_DRIFT_SCHEMA } from "@/lib/features/premium-schema/schemas/calibration-drift-risk-analyzer";
import { CBAM_EXPOSURE_SCHEMA } from "@/lib/features/premium-schema/schemas/cbam-exposure-analyzer";
import { CBAM_COMPLIANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/cbam-compliance-verdict-analyzer";
import { CHATTER_SCHEMA } from "@/lib/features/premium-schema/schemas/chatter-surface-quality-analyzer";
import { BOLT_TORQUE_SCHEMA } from "@/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";
import { TURNOVER_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/employee-turnover-cost-analyzer";
import { CLOUD_API_OVERRUN_SCHEMA } from "@/lib/features/premium-schema/schemas/cloud-api-overrun-analyzer";
import { CLOUD_WASTE_ELIMINATION_SCHEMA } from "@/lib/features/premium-schema/schemas/cloud-waste-elimination-analyzer";
// ── Batch 2 (Tools 21-60) imports ──
import { CLV_CAC_SCHEMA } from "@/lib/features/premium-schema/schemas/clv-cac-ratio-analyzer";
import { CNC_CYCLE_TIME_SCHEMA } from "@/lib/features/premium-schema/schemas/cnc-cycle-time-analyzer";
import { CNC_MACHINING_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/cnc-machining-cost-analyzer";
import { CPK_PPM_SCHEMA } from "@/lib/features/premium-schema/schemas/cpk-ppm-converter-analyzer";
import { CPM_DELAY_SCHEMA } from "@/lib/features/premium-schema/schemas/cpm-delay-penalty-analyzer";
import { ROOF_AREA_SCHEMA } from "@/lib/features/premium-schema/schemas/roof-area-load-analyzer";
import { BOTTLENECK_INVESTMENT_SCHEMA } from "@/lib/features/premium-schema/schemas/bottleneck-investment-analyzer";
import { SMED_CHANGEOVER_SCHEMA } from "@/lib/features/premium-schema/schemas/smed-changeover-matrix-analyzer";
import { WAREHOUSE_LAYOUT_SCHEMA } from "@/lib/features/premium-schema/schemas/warehouse-layout-analyzer";
import { ABSENTEEISM_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/absenteeism-cost-analyzer";
import { DIGITAL_TWIN_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/digital-twin-cost-analyzer";
import { SEWING_LINE_BALANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/sewing-line-balance-analyzer-pro";
import { DYE_RECIPE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/dye-recipe-cost-analyzer";
import { ENERGY_CONSUMPTION_SCHEMA } from "@/lib/features/premium-schema/schemas/energy-consumption-report-analyzer";
import { INFLATION_ESCALATION_SCHEMA } from "@/lib/features/premium-schema/schemas/inflation-escalation-analyzer";
import { ENVIRONMENTAL_WASTE_SCHEMA } from "@/lib/features/premium-schema/schemas/environmental-waste-cost-analyzer";
import { EOQ_INVENTORY_SCHEMA } from "@/lib/features/premium-schema/schemas/eoq-inventory-optimizer-analyzer";
import { EVM_FORECAST_SCHEMA } from "@/lib/features/premium-schema/schemas/evm-cost-forecast-analyzer";
import { FACTORY_LAYOUT_SCHEMA } from "@/lib/features/premium-schema/schemas/factory-layout-distance-analyzer";
import { INTEREST_RATE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/interest-rate-risk-analyzer";
import { FILAMENT_RECYCLING_SCHEMA } from "@/lib/features/premium-schema/schemas/filament-recycling-analyzer";
import { PRICE_ELASTICITY_SCHEMA } from "@/lib/features/premium-schema/schemas/price-elasticity-analyzer";
import { FLEXIBLE_MFG_ROI_SCHEMA } from "@/lib/features/premium-schema/schemas/flexible-manufacturing-roi-analyzer";
import { GAGE_RNR_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/gage-rnr-cost-analyzer";
import { FOOD_WASTE_MARGIN_SCHEMA } from "@/lib/features/premium-schema/schemas/food-waste-margin-analyzer";
import { FERTILIZER_DOSAGE_SCHEMA } from "@/lib/features/premium-schema/schemas/fertilizer-dosage-analyzer";
import { HACCP_DEVIATION_SCHEMA } from "@/lib/features/premium-schema/schemas/haccp-deviation-cost-analyzer";
import { VOLUMETRIC_WEIGHT_SCHEMA } from "@/lib/features/premium-schema/schemas/volumetric-weight-chargeable-analyzer";
import { LIGHTWEIGHT_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/lightweight-cost-savings-analyzer";
import { SCRAP_OPTIMIZE_SCHEMA } from "@/lib/features/premium-schema/schemas/scrap-rate-optimize-analyzer";
import { HVAC_CAPACITY_SCHEMA } from "@/lib/features/premium-schema/schemas/hvac-capacity-analyzer";
import { HYDRAULIC_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/hydraulic-system-loss-analyzer";
import { HEAT_EXCHANGER_FOULING_SCHEMA } from "@/lib/features/premium-schema/schemas/heat-exchanger-fouling-analyzer";
import { ISO50001_BASELINE_SCHEMA } from "@/lib/features/premium-schema/schemas/iso-50001-baseline-analyzer";
import { IRR_INVESTMENT_SCHEMA } from "@/lib/features/premium-schema/schemas/irr-investment-analyzer";
import { FEED_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/feed-cost-formulation-analyzer";
import { SCAFFOLD_RENTAL_SCHEMA } from "@/lib/features/premium-schema/schemas/scaffold-rental-cost-analyzer";
import { SPC_LIMIT_SCHEMA } from "@/lib/features/premium-schema/schemas/spc-limit-control-analyzer";
import { MACHINING_STRATEGY_SCHEMA } from "@/lib/features/premium-schema/schemas/machining-strategy-analyzer";
import { KAIZEN_SAVINGS_SCHEMA } from "@/lib/features/premium-schema/schemas/kaizen-savings-tracker-analyzer";
// ── Batch 3 (Tools 31-40) imports ──
import { PRODUCT_COMPLEXITY_SCHEMA } from "@/lib/features/premium-schema/schemas/product-complexity-hidden-cost-analyzer";
import { VACUUM_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/vacuum-leak-energy-analyzer";
import { SHIFT_COST_EFFICIENCY_SCHEMA } from "@/lib/features/premium-schema/schemas/shift-cost-efficiency-analyzer";
import { VSM_FINANCIAL_SCHEMA } from "@/lib/features/premium-schema/schemas/vsm-financial-converter-analyzer";
import { WPS_PREHEAT_SCHEMA } from "@/lib/features/premium-schema/schemas/wps-preheat-temperature-analyzer";
import { FUEL_ROUTE_DRIFT_SCHEMA } from "@/lib/features/premium-schema/schemas/fuel-route-drift-analyzer";
import { FIRE_HYDRANT_SCHEMA } from "@/lib/features/premium-schema/schemas/fire-hydrant-flow-analyzer";
import { RENOVATION_BUDGET_SCHEMA } from "@/lib/features/premium-schema/schemas/renovation-budget-optimizer-analyzer";
import { RENEWABLE_ENERGY_IRR_SCHEMA } from "@/lib/features/premium-schema/schemas/renewable-energy-irr-analyzer";
import { ROI_NPV_SCHEMA } from "@/lib/features/premium-schema/schemas/roi-npv-analyzer";
// ── Batch 4 (Tools 101-140) imports ──
import { BEAM_WEIGHT_SCHEMA } from "@/lib/features/premium-schema/schemas/beam-weight-analyzer";
import { BID_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/bid-risk-analyzer";
import { CARBON_FOOTPRINT_CHECK_SCHEMA } from "@/lib/features/premium-schema/schemas/carbon-footprint-check-analyzer";
import { CASH_FLOW_GAP_SCHEMA } from "@/lib/features/premium-schema/schemas/cash-flow-gap-analyzer";
import { CLEANING_BID_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/cleaning-bid-optimizer-analyzer";
import { COMPRESSED_AIR_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/compressed-air-leak-analyzer";
import { COMPRESSOR_TANK_SCHEMA } from "@/lib/features/premium-schema/schemas/compressor-tank-sizing-analyzer";
import { CONTAINER_LOAD_SCHEMA } from "@/lib/features/premium-schema/schemas/container-load-analyzer";
import { CONTRACT_INCENTIVE_ANALYZER } from "@/lib/features/premium-schema/schemas/contract-incentive-analyzer";
import { CROP_YIELD_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/crop-yield-loss-analyzer";
import { CURRENCY_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/currency-risk-analyzer";
import { CUT_FILL_BALANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/cut-fill-balance-analyzer";
import { CUTTING_TOOL_LIFE_SCHEMA } from "@/lib/features/premium-schema/schemas/cutting-tool-life-analyzer";
import { DAIRY_PROFIT_DETECTOR_ANALYZER } from "@/lib/features/premium-schema/schemas/dairy-profit-detector-analyzer";
import { DELIVERY_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/delivery-cost-analyzer";
import { DEMAND_FORECAST_STOCK_SCHEMA } from "@/lib/features/premium-schema/schemas/demand-forecast-stock-analyzer";
import { FABRIC_CUTTING_SCHEMA } from "@/lib/features/premium-schema/schemas/fabric-cutting-optimizer-analyzer";
import { FREIGHT_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/freight-cost-analyzer";
import { HOURLY_RATE_ANALYZER } from "@/lib/features/premium-schema/schemas/hourly-rate-analyzer";
import { INVENTORY_TURNOVER_RISK_ANALYZER } from "@/lib/features/premium-schema/schemas/inventory-turnover-risk-analyzer";
import { IRRIGATION_COST_CHECK_ANALYZER } from "@/lib/features/premium-schema/schemas/irrigation-cost-check-analyzer";
import { KWH_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/kwh-cost-analyzer";
import { LEARNING_CURVE_TIME_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/learning-curve-time-analyzer";
import { LOGISTICS_ROUTE_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/logistics-route-loss-analyzer";
import { MACHINE_ECONOMIC_LIFE_SCHEMA } from "@/lib/features/premium-schema/schemas/machine-economic-life-analyzer";
import { MATERIAL_REPLACEMENT_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/material-replacement-cost-analyzer";
import { MOQ_STOCK_BALANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/moq-stock-balance-analyzer";
import { MTBF_MTTR_FINANCIAL_SCHEMA } from "@/lib/features/premium-schema/schemas/mtbf-mttr-financial-analyzer";
import { MUDA_WASTE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/muda-waste-cost-analyzer";
import { NOISE_VIBRATION_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/noise-vibration-cost-analyzer";
import { OEE_DOWNTIME_SCHEMA } from "@/lib/features/premium-schema/schemas/oee-downtime-analyzer";
import { OFFICE_SUPPLIES_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/office-supplies-cost-analyzer";
import { OVERTIME_HIRING_BREAKEVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/overtime-hiring-breakeven-analyzer";
import { PALLET_RACK_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/pallet-rack-optimizer-analyzer";
import { PAYMENT_TERMS_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/payment-terms-optimizer-analyzer";
import { POKA_YOKE_ROI_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/poka-yoke-roi-analyzer";
import { PORTION_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/portion-cost-analyzer";
import { PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/project-cost-estimate-analyzer";
import { PROJECT_OVERRUN_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/project-overrun-analyzer";
import { QUALITY_COST_PAF_SCHEMA } from "@/lib/features/premium-schema/schemas/quality-cost-paf-analyzer";
import { RECIPE_COST_CHECK_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/recipe-cost-check-analyzer";
import { RECURRING_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/recurring-cost-analyzer";
import { REPAIR_SHOP_QUOTE_SCHEMA } from "@/lib/features/premium-schema/schemas/repair-shop-quote-analyzer";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/restaurant-menu-margin-leak-analyzer";
import { ROBOT_VS_MANUAL_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/robot-vs-manual-analyzer";
import { ROUTE_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/route-cost-analyzer";
import { ROUTE_OPTIMIZATION_ANALYZER } from "@/lib/features/premium-schema/schemas/route-optimization-analyzer";
import { SAAS_SHELFWARE_ANALYZER } from "@/lib/features/premium-schema/schemas/saas-shelfware-analyzer";
import { SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/sample-size-industrial-analyzer";
import { SEED_RATE_SCHEMA } from "@/lib/features/premium-schema/schemas/seed-rate-analyzer";
import { SHOP_HOURLY_RATE_SCHEMA } from "@/lib/features/premium-schema/schemas/shop-hourly-rate-analyzer";
import { SMED_CHANGEOVER_OPTIMIZER_ANALYZER } from "@/lib/features/premium-schema/schemas/smed-changeover-optimizer-analyzer";
import { SPC_SIGNAL_DELAY_ANALYZER } from "@/lib/features/premium-schema/schemas/spc-signal-delay-analyzer";
import { STEAM_TRAP_ENERGY_LOSS_ANALYZER } from "@/lib/features/premium-schema/schemas/steam-trap-energy-loss-analyzer";
import { SUBCONTRACTOR_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/subcontractor-margin-leak-analyzer";
import { SUPPLIER_CURRENCY_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/supplier-currency-risk-analyzer";
import { SUPPLIER_PERFORMANCE_TCO_ANALYZER } from "@/lib/features/premium-schema/schemas/supplier-performance-tco-analyzer";
import { SUPPLY_CHAIN_DISRUPTION_SCHEMA } from "@/lib/features/premium-schema/schemas/supply-chain-disruption-analyzer";
import { TAGUCHI_QUALITY_LOSS_ANALYZER } from "@/lib/features/premium-schema/schemas/taguchi-quality-loss-analyzer";
import { TAKT_TIME_FLEXIBILITY_SCHEMA } from "@/lib/features/premium-schema/schemas/takt-time-flexibility-analyzer";
import { TEXTILE_WASTE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/textile-waste-risk-analyzer";
import { TOOL_WEAR_COST_ANALYZER } from "@/lib/features/premium-schema/schemas/tool-wear-cost-analyzer";
import { TOTAL_EMPLOYEE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/total-employee-cost-analyzer";
import { TRANSFER_PRICING_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/transfer-pricing-optimizer-analyzer";
import { TRANSPORT_MODE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/transport-mode-risk-analyzer";
import { WATER_USAGE_OPTIMIZER_ANALYZER } from "@/lib/features/premium-schema/schemas/water-usage-optimizer-analyzer";
import { WELD_COST_ANALYSIS_SCHEMA } from "@/lib/features/premium-schema/schemas/weld-cost-analysis-analyzer";
import { WELD_STRENGTH_SCHEMA } from "@/lib/features/premium-schema/schemas/weld-strength-analyzer";
import { WELD_VOLUME_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/weld-volume-cost-analyzer";
import { WIND_TURBINE_INVESTMENT_ANALYZER } from "@/lib/features/premium-schema/schemas/wind-turbine-investment-analyzer";

/** Premium 152 batch 1 — schema-backed calculators. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,
  FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA,
  THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA,
  THREE_B_PRINTING_BATCH_NESTING_SCHEMA,
  THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA,
  AI_TOKEN_COST_ANALYZER_SCHEMA,
  SIX_SIGMA_PRIORITIZER_SCHEMA,
  AQL_SAMPLING_SCHEMA,
  VEHICLE_DEPRECIATION_SCHEMA,
  DOWNTIME_COST_ANALYZER_SCHEMA,
  AUTO_REPAIR_COMEBACK_SCHEMA,
  AUTO_REPAIR_QUOTE_SCHEMA,
  AUTO_SHOP_MARGIN_LEAK_SCHEMA,
  ASME_VESSEL_SCHEMA,
  COMPRESSED_AIR_SCHEMA,
  BREAK_EVEN_SCHEMA,
  CONCRETE_VOLUME_SCHEMA,
  CALIBRATION_DRIFT_SCHEMA,
  CBAM_EXPOSURE_SCHEMA,
  CBAM_COMPLIANCE_SCHEMA,
  CHATTER_SCHEMA,
  BOLT_TORQUE_SCHEMA,
  TURNOVER_COST_SCHEMA,
  CLOUD_API_OVERRUN_SCHEMA,
  CLOUD_WASTE_ELIMINATION_SCHEMA,
  // ── Batch 2 (Tools 21-60) ──
  CLV_CAC_SCHEMA,
  CNC_CYCLE_TIME_SCHEMA,
  CNC_MACHINING_COST_SCHEMA,
  CPK_PPM_SCHEMA,
  CPM_DELAY_SCHEMA,
  ROOF_AREA_SCHEMA,
  BOTTLENECK_INVESTMENT_SCHEMA,
  SMED_CHANGEOVER_SCHEMA,
  WAREHOUSE_LAYOUT_SCHEMA,
  ABSENTEEISM_COST_SCHEMA,
  DIGITAL_TWIN_COST_SCHEMA,
  SEWING_LINE_BALANCE_SCHEMA,
  DYE_RECIPE_COST_SCHEMA,
  ENERGY_CONSUMPTION_SCHEMA,
  INFLATION_ESCALATION_SCHEMA,
  ENVIRONMENTAL_WASTE_SCHEMA,
  EOQ_INVENTORY_SCHEMA,
  EVM_FORECAST_SCHEMA,
  FACTORY_LAYOUT_SCHEMA,
  INTEREST_RATE_RISK_SCHEMA,
  FILAMENT_RECYCLING_SCHEMA,
  PRICE_ELASTICITY_SCHEMA,
  FLEXIBLE_MFG_ROI_SCHEMA,
  GAGE_RNR_COST_SCHEMA,
  FOOD_WASTE_MARGIN_SCHEMA,
  FERTILIZER_DOSAGE_SCHEMA,
  HACCP_DEVIATION_SCHEMA,
  VOLUMETRIC_WEIGHT_SCHEMA,
  LIGHTWEIGHT_COST_SCHEMA,
  SCRAP_OPTIMIZE_SCHEMA,
  HVAC_CAPACITY_SCHEMA,
  HYDRAULIC_LOSS_SCHEMA,
  HEAT_EXCHANGER_FOULING_SCHEMA,
  ISO50001_BASELINE_SCHEMA,
  IRR_INVESTMENT_SCHEMA,
  FEED_COST_SCHEMA,
  SCAFFOLD_RENTAL_SCHEMA,
  SPC_LIMIT_SCHEMA,
  MACHINING_STRATEGY_SCHEMA,
  KAIZEN_SAVINGS_SCHEMA,
  // ── Batch 3 (Tools 31-40) ──
  PRODUCT_COMPLEXITY_SCHEMA,
  VACUUM_LEAK_SCHEMA,
  SHIFT_COST_EFFICIENCY_SCHEMA,
  VSM_FINANCIAL_SCHEMA,
  WPS_PREHEAT_SCHEMA,
  FUEL_ROUTE_DRIFT_SCHEMA,
  FIRE_HYDRANT_SCHEMA,
  RENOVATION_BUDGET_SCHEMA,
  RENEWABLE_ENERGY_IRR_SCHEMA,
  ROI_NPV_SCHEMA,
  // ── Batch 4 (Tools 101-140) ──
  BEAM_WEIGHT_SCHEMA,
  BID_RISK_SCHEMA,
  CARBON_FOOTPRINT_CHECK_SCHEMA,
  CASH_FLOW_GAP_SCHEMA,
  CLEANING_BID_OPTIMIZER_SCHEMA,
  COMPRESSED_AIR_LEAK_SCHEMA,
  COMPRESSOR_TANK_SCHEMA,
  CONTAINER_LOAD_SCHEMA,
  CONTRACT_INCENTIVE_ANALYZER,
  CROP_YIELD_LOSS_SCHEMA,
  CURRENCY_RISK_SCHEMA,
  CUT_FILL_BALANCE_SCHEMA,
  CUTTING_TOOL_LIFE_SCHEMA,
  DAIRY_PROFIT_DETECTOR_ANALYZER,
  DELIVERY_COST_SCHEMA,
  DEMAND_FORECAST_STOCK_SCHEMA,
  FABRIC_CUTTING_SCHEMA,
  FREIGHT_COST_SCHEMA,
  HOURLY_RATE_ANALYZER,
  INVENTORY_TURNOVER_RISK_ANALYZER,
  IRRIGATION_COST_CHECK_ANALYZER,
  KWH_COST_SCHEMA,
  LEARNING_CURVE_TIME_ANALYZER_SCHEMA,
  LOGISTICS_ROUTE_LOSS_SCHEMA,
  MACHINE_ECONOMIC_LIFE_SCHEMA,
  MATERIAL_REPLACEMENT_COST_SCHEMA,
  MOQ_STOCK_BALANCE_SCHEMA,
  MTBF_MTTR_FINANCIAL_SCHEMA,
  MUDA_WASTE_COST_SCHEMA,
  NOISE_VIBRATION_COST_SCHEMA,
  OEE_DOWNTIME_SCHEMA,
  OFFICE_SUPPLIES_COST_SCHEMA,
  OVERTIME_HIRING_BREAKEVEN_SCHEMA,
  PALLET_RACK_OPTIMIZER_SCHEMA,
  PAYMENT_TERMS_OPTIMIZER_SCHEMA,
  POKA_YOKE_ROI_ANALYZER_SCHEMA,
  PORTION_COST_ANALYZER_SCHEMA,
  PROJECT_COST_ESTIMATE_ANALYZER_SCHEMA,
  PROJECT_OVERRUN_ANALYZER_SCHEMA,
  QUALITY_COST_PAF_SCHEMA,
  RECIPE_COST_CHECK_ANALYZER_SCHEMA,
  RECURRING_COST_SCHEMA,
  REPAIR_SHOP_QUOTE_SCHEMA,
  RESTAURANT_MENU_MARGIN_LEAK_SCHEMA,
  ROBOT_VS_MANUAL_ANALYZER_SCHEMA,
  ROUTE_COST_ANALYZER_SCHEMA,
  ROUTE_OPTIMIZATION_ANALYZER,
  SAAS_SHELFWARE_ANALYZER,
  SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA,
  SEED_RATE_SCHEMA,
  SHOP_HOURLY_RATE_SCHEMA,
  SMED_CHANGEOVER_OPTIMIZER_ANALYZER,
  SPC_SIGNAL_DELAY_ANALYZER,
  STEAM_TRAP_ENERGY_LOSS_ANALYZER,
  SUBCONTRACTOR_MARGIN_LEAK_SCHEMA,
  SUPPLIER_CURRENCY_RISK_SCHEMA,
  SUPPLIER_PERFORMANCE_TCO_ANALYZER,
  SUPPLY_CHAIN_DISRUPTION_SCHEMA,
  TAGUCHI_QUALITY_LOSS_ANALYZER,
  TAKT_TIME_FLEXIBILITY_SCHEMA,
  TEXTILE_WASTE_RISK_SCHEMA,
  TOOL_WEAR_COST_ANALYZER,
  TOTAL_EMPLOYEE_COST_SCHEMA,
  TRANSFER_PRICING_OPTIMIZER_SCHEMA,
  TRANSPORT_MODE_RISK_SCHEMA,
  WATER_USAGE_OPTIMIZER_ANALYZER,
  WELD_COST_ANALYSIS_SCHEMA,
  WELD_STRENGTH_SCHEMA,
  WELD_VOLUME_COST_SCHEMA,
  WIND_TURBINE_INVESTMENT_ANALYZER,
  ...ALL_INDUSTRIAL_FORMULA_SCHEMAS,
];

export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "7-israf-muda-avcisi-parasal-karsilik-calculator":
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator":
    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator":
    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator":
    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator":
    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
  "ai-token-cost-analyzer": "ai-token-cost-analyzer",
  "six-sigma-project-prioritizer": "six-sigma-project-prioritizer",
  "aql-sampling-risk-analyzer": "aql-sampling-risk-analyzer",
  "vehicle-depreciation-tco-analyzer": "vehicle-depreciation-tco-analyzer",
  "downtime-cost-analyzer": "downtime-cost-analyzer",
  "auto-repair-comeback-analyzer": "auto-repair-comeback-analyzer",
  "auto-repair-quote-consistency-analyzer": "auto-repair-quote-consistency-analyzer",
  "auto-shop-margin-leak-analyzer": "auto-shop-margin-leak-analyzer",
  "asme-pressure-vessel-analyzer": "asme-pressure-vessel-analyzer",
  "compressed-air-energy-cost-analyzer": "compressed-air-energy-cost-analyzer",
  "break-even-margin-of-safety-analyzer": "break-even-margin-of-safety-analyzer",
  "concrete-volume-cost-analyzer": "concrete-volume-cost-analyzer",
  "calibration-drift-risk-analyzer": "calibration-drift-risk-analyzer",
  "cbam-exposure-analyzer": "cbam-exposure-analyzer",
  "cbam-compliance-verdict-analyzer": "cbam-compliance-verdict-analyzer",
  "chatter-surface-quality-analyzer": "chatter-surface-quality-analyzer",
  "bolt-torque-preload-analyzer": "bolt-torque-preload-analyzer",
  "employee-turnover-cost-analyzer": "employee-turnover-cost-analyzer",
  "cloud-api-overrun-analyzer": "cloud-api-overrun-analyzer",
  "cloud-waste-elimination-analyzer": "cloud-waste-elimination-analyzer",
  "irr-investment-analyzer": "irr-investment-analyzer",
  "irr-npv-investment-analyzer": "irr-npv-investment-analyzer",
  "npv-risk-analyzer": "npv-risk-analyzer",
  "dcf-enterprise-valuator": "dcf-enterprise-valuator",
  "lease-vs-buy-analyzer": "lease-vs-buy-analyzer",
  "darcy-weisbach-pipe-flow-calculator": "darcy-weisbach-pipe-flow-calculator",
  "lmtd-heat-exchanger-calculator": "lmtd-heat-exchanger-calculator",
  "oee-six-big-losses-analyzer": "oee-six-big-losses-analyzer",
  "line-balancing-analyzer": "line-balancing-analyzer",
  "standard-time-work-study-calculator": "standard-time-work-study-calculator",
  "learning-curve-calculator": "learning-curve-calculator",
  "spring-design-calculator": "spring-design-calculator",
  "carbon-footprint-calculator": "carbon-footprint-calculator",
  "regression-analyzer": "regression-analyzer",
  "sample-size-calculator": "sample-size-calculator",
  "anova-analyzer": "anova-analyzer",
  "roi-analyzer": "roi-analyzer",
  "belt-pulley-gear-calculator": "belt-pulley-gear-calculator",
  "hydraulic-cylinder-calculator": "hydraulic-cylinder-calculator",
  // ── Batch 4 (Tools 101-140) ──
  "beam-weight-analyzer": "beam-weight-analyzer",
  "bid-risk-analyzer": "bid-risk-analyzer",
  "carbon-footprint-check-analyzer": "carbon-footprint-check-analyzer",
  "cash-flow-gap-analyzer": "cash-flow-gap-analyzer",
  "cleaning-bid-optimizer-analyzer": "cleaning-bid-optimizer-analyzer",
  "compressed-air-leak-analyzer": "compressed-air-leak-analyzer",
  "compressor-tank-sizing-analyzer": "compressor-tank-sizing-analyzer",
  "container-load-analyzer": "container-load-analyzer",
  "contract-incentive-analyzer": "contract-incentive-analyzer",
  "crop-yield-loss-analyzer": "crop-yield-loss-analyzer",
  "currency-risk-analyzer": "currency-risk-analyzer",
  "cut-fill-balance-analyzer": "cut-fill-balance-analyzer",
  "cutting-tool-life-analyzer": "cutting-tool-life-analyzer",
  "dairy-profit-detector-analyzer": "dairy-profit-detector-analyzer",
  "delivery-cost-analyzer": "delivery-cost-analyzer",
  "demand-forecast-stock-analyzer": "demand-forecast-stock-analyzer",
  "fabric-cutting-optimizer-analyzer": "fabric-cutting-optimizer-analyzer",
  "freight-cost-analyzer": "freight-cost-analyzer",
  "hourly-rate-analyzer": "hourly-rate-analyzer",
  "inventory-turnover-risk-analyzer": "inventory-turnover-risk-analyzer",
  "irrigation-cost-check-analyzer": "irrigation-cost-check-analyzer",
  "kwh-cost-analyzer": "kwh-cost-analyzer",
  "learning-curve-time-analyzer": "learning-curve-time-analyzer",
  "logistics-route-loss-analyzer": "logistics-route-loss-analyzer",
  "machine-economic-life-analyzer": "machine-economic-life-analyzer",
  "material-replacement-cost-analyzer": "material-replacement-cost-analyzer",
  "moq-stock-balance-analyzer": "moq-stock-balance-analyzer",
  "mtbf-mttr-financial-analyzer": "mtbf-mttr-financial-analyzer",
  "muda-waste-cost-analyzer": "muda-waste-cost-analyzer",
  "noise-vibration-cost-analyzer": "noise-vibration-cost-analyzer",
  "oee-downtime-analyzer": "oee-downtime-analyzer",
  "office-supplies-cost-analyzer": "office-supplies-cost-analyzer",
  "overtime-hiring-breakeven-analyzer": "overtime-hiring-breakeven-analyzer",
  "pallet-rack-optimizer-analyzer": "pallet-rack-optimizer-analyzer",
  "payment-terms-optimizer-analyzer": "payment-terms-optimizer-analyzer",
  "poka-yoke-roi-analyzer": "poka-yoke-roi-analyzer",
  "portion-cost-analyzer": "portion-cost-analyzer",
  "project-cost-estimate-analyzer": "project-cost-estimate-analyzer",
  "project-overrun-analyzer": "project-overrun-analyzer",
  "quality-cost-paf-analyzer": "quality-cost-paf-analyzer",
  "recipe-cost-check-analyzer": "recipe-cost-check-analyzer",
  "recurring-cost-analyzer": "recurring-cost-analyzer",
  "repair-shop-quote-analyzer": "repair-shop-quote-analyzer",
  "restaurant-menu-margin-leak-analyzer": "restaurant-menu-margin-leak-analyzer",
  "robot-vs-manual-analyzer": "robot-vs-manual-analyzer",
  "route-cost-analyzer": "route-cost-analyzer",
  "route-optimization-analyzer": "route-optimization-analyzer",
  "saas-shelfware-analyzer": "saas-shelfware-analyzer",
  "sample-size-industrial-analyzer": "sample-size-industrial-analyzer",
  "seed-rate-analyzer": "seed-rate-analyzer",
  "shop-hourly-rate-analyzer": "shop-hourly-rate-analyzer",
  "smed-changeover-optimizer-analyzer": "smed-changeover-optimizer-analyzer",
  "spc-signal-delay-analyzer": "spc-signal-delay-analyzer",
  "steam-trap-energy-loss-analyzer": "steam-trap-energy-loss-analyzer",
  "subcontractor-margin-leak-analyzer": "subcontractor-margin-leak-analyzer",
  "supplier-currency-risk-analyzer": "supplier-currency-risk-analyzer",
  "supplier-performance-tco-analyzer": "supplier-performance-tco-analyzer",
  "supply-chain-disruption-analyzer": "supply-chain-disruption-analyzer",
  "taguchi-quality-loss-analyzer": "taguchi-quality-loss-analyzer",
  "takt-time-flexibility-analyzer": "takt-time-flexibility-analyzer",
  "textile-waste-risk-analyzer": "textile-waste-risk-analyzer",
  "tool-wear-cost-analyzer": "tool-wear-cost-analyzer",
  "total-employee-cost-analyzer": "total-employee-cost-analyzer",
  "transfer-pricing-optimizer-analyzer": "transfer-pricing-optimizer-analyzer",
  "transport-mode-risk-analyzer": "transport-mode-risk-analyzer",
  "water-usage-optimizer-analyzer": "water-usage-optimizer-analyzer",
  "weld-cost-analysis-analyzer": "weld-cost-analysis-analyzer",
  "weld-strength-analyzer": "weld-strength-analyzer",
  "weld-volume-cost-analyzer": "weld-volume-cost-analyzer",
  "wind-turbine-investment-analyzer": "wind-turbine-investment-analyzer",
};

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schema.id);
}

export function getPremiumCalculatorSchema(slug: string): PremiumCalculatorSchema | null {
  const normalized = slug.trim();
  return PREMIUM_CALCULATOR_SCHEMAS.find(
    (schema) => schema.id === normalized || schema.legacyPaidSlug === normalized,
  ) ?? null;
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | null {
  const trimmed = paidSlug.trim();
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[trimmed];
  if (schemaId) {
    return getPremiumCalculatorSchema(schemaId);
  }
  return getPremiumCalculatorSchema(trimmed);
}
