/**
 * Formula contract registry — no contract, no launch.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
  freeTrafficProductionAssumption,
  scenarioRuntimeTests,
} from "@/lib/formula-governance/contracts/shared";
import { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/top-critical";
import { BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-expansion-critical";
import { BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-traffic-catalog-critical";
import { BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-premium-schema-critical";
import { ROADMAP_FREE_BATCH_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roadmap-free-batch-critical";
import { PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/premium-schema-extended-critical";
import { SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/seven-muda-waste-cost-critical";
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/agriculture-irrigation-yield-loss-critical";
import { CALIBRATION_DRIFT_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/calibration-drift-risk-critical";
import { CLOUD_API_COST_OVERRUN_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cloud-api-cost-overrun-critical";
import { ENERGY_COMPRESSOR_LEAK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/energy-compressor-leak-cost-critical";
import { CNC_TOOL_WEAR_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-tool-wear-cost-critical";
import { DAIRY_FEED_EFFICIENCY_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dairy-feed-efficiency-loss-critical";
import { CONSTRUCTION_PROJECT_OVERRUN_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/construction-project-overrun-critical";
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/construction-subcontractor-margin-leak-critical";
import { PAINTING_REWORK_COVERAGE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/painting-rework-coverage-risk-critical";
import { FOOD_WASTE_MARGIN_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/food-waste-margin-loss-critical";
import { HVAC_CALLBACK_MARGIN_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hvac-callback-margin-risk-critical";
import { RESTAURANT_MENU_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/restaurant-menu-margin-leak-critical";
import { WAREHOUSE_SPACE_COST_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/warehouse-space-cost-leak-critical";
import { SHEET_METAL_SCRAP_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sheet-metal-scrap-risk-critical";
import { PRINTING_REPRINT_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/printing-reprint-margin-leak-critical";
import { COMPRESSOR_LEAK_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/compressor-leak-cost-calculator-critical";
import { DOWNTIME_MINUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/downtime-minute-cost-calculator-critical";
import { ENERGY_PEAK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/energy-peak-cost-critical";
import { ENERGY_SAVINGS_PACKAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/energy-savings-package-calculator-critical";
import { INVENTORY_CARRYING_COST_EOQ_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/inventory-carrying-cost-eoq-calculator-critical";
import { LOGISTICS_FUEL_ROUTE_DRIFT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/logistics-fuel-route-drift-critical";
import { LOGISTICS_ROUTE_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/logistics-route-loss-critical";
import { PLUMBING_LEAK_CALLBACK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/plumbing-leak-callback-cost-critical";
import { PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/product-customer-profitability-calculator-critical";
import { RETAIL_INVENTORY_TURNOVER_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/retail-inventory-turnover-risk-critical";
import { ROOFING_WEATHER_DELAY_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roofing-weather-delay-risk-critical";
import { TEXTILE_FABRIC_WASTE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/textile-fabric-waste-risk-critical";
import { VALUE_STREAM_MAP_VSM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/value-stream-map-vsm-calculator-critical";
import { ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/annual-leave-severance-notice-calculator-critical";
import { BELT_PULLEY_SPEED_LENGTH_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/belt-pulley-speed-length-calculator-critical";
import { BOLT_TIGHTENING_TORQUE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/bolt-tightening-torque-calculator-critical";
import { CNC_OEE_LOSS_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-oee-loss-critical";
import { EMPLOYEE_TOTAL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/employee-total-cost-calculator-critical";
import { FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fire-system-flow-hydrant-calculator-critical";
import { HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hydraulic-pneumatic-cylinder-force-calculator-critical";
import { INVESTMENT_PAYBACK_NPV_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/investment-payback-npv-calculator-critical";
import { OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/oee-equipment-effectiveness-calculator-critical";
import { QUALITY_COST_PAF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/quality-cost-paf-calculator-critical";
import { SHOP_RATE_HOURLY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/shop-rate-hourly-cost-calculator-critical";
import { TOLERANCE_STACK_UP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tolerance-stack-up-calculator-critical";
import { AUTO_REPAIR_COMEBACK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/auto-repair-comeback-cost-critical";
import { CARBON_FOOTPRINT_COMPLIANCE_RISK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/carbon-footprint-compliance-risk-critical";
import { CBAM_COMPLIANCE_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cbam-compliance-verdict-critical";
import { CBAM_EXPOSURE_QUICK_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cbam-exposure-quick-check-critical";
import { ELECTRICAL_PANEL_REWORK_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/electrical-panel-rework-cost-critical";
import { LEGAL_INTEREST_FEE_CALCULATOR_PRO_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/legal-interest-fee-calculator-pro-critical";
import { AUTO_SHOP_MARGIN_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/auto-shop-margin-leak-detector-critical";
import { CHANGE_ORDER_IMPACT_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/change-order-impact-analyzer-critical";
import { CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-quote-risk-analyzer-critical";
import { CROP_YIELD_LOSS_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/crop-yield-loss-analyzer-critical";
import { DAIRY_PROFIT_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dairy-profit-detector-critical";
import { HEAT_LOSS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/heat-loss-calculator-critical";
import { HVAC_PROJECT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hvac-project-margin-guard-critical";
import { LANDSCAPING_CONTRACT_PROFIT_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/landscaping-contract-profit-tool-critical";
import { MATERIAL_WASTE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/material-waste-calculator-critical";
import { MEAL_PLANNING_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/meal-planning-verdict-critical";
import { MENU_PROFIT_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/menu-profit-leak-detector-critical";
import { MILLWORK_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/millwork-bid-risk-analyzer-critical";
import { OFFICE_CLEANING_BID_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/office-cleaning-bid-optimizer-critical";
import { PAINTING_JOB_PROFIT_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/painting-job-profit-verdict-critical";
import { PANEL_SHOP_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/panel-shop-margin-verdict-critical";
import { PLUMBING_JOB_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/plumbing-job-margin-verdict-critical";
import { PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/profit-margin-calculator-critical";
import { QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/quote-price-profit-margin-calculator-critical";
import { RETURN_PROFIT_EROSION_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/return-profit-erosion-tool-critical";
import { ROOFING_CONTRACT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roofing-contract-margin-guard-critical";
import { ROUTE_OPTIMIZATION_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/route-optimization-analyzer-critical";
import { SCRAP_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/scrap-rate-calculator-critical";
import { SHEET_METAL_QUOTE_RISK_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sheet-metal-quote-risk-tool-critical";
import { SIGNAGE_BID_SAFE_PRICE_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/signage-bid-safe-price-tool-critical";
import { WATER_OPTIMIZATION_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/water-optimization-verdict-critical";
import { THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/3d-print-job-margin-tool-critical";
import { WELDING_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/welding-bid-risk-analyzer-critical";
import { ENERGY_EFFICIENCY_REPORT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/energy-efficiency-report-critical";
import { RENOVATION_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/renovation-budget-optimizer-critical";
import { TRIP_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/trip-budget-optimizer-critical";
import { OEE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/oee-calculator-critical";
import { AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/agv-amr-otonom-tasima-geri-donus-calculator-critical";
import { ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/alti-sigma-dpmo-sigma-seviyesi-cevirici-critical";
import { AMBALAJ_MALZEMESI_DEGISIMI_VE_MALIYET_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator-critical";
import { AMPER_KILOWATT_KW_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/amper-kilowatt-kw-cevirici-critical";
import { ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator-critical";
import { ARAC_AMORTISMAN_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-amortisman-hesaplama-critical";
import { ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-bakim-periyodu-takip-hesaplama-critical";
import { ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/arac-kira-satin-alma-karsilastirma-critical";
import { ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator-critical";
import { ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator-critical";
import { BACA_HAVALANDIRMA_KANALI_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/baca-havalandirma-kanali-cap-hesabi-critical";
import { BATCH_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-yield-calculator-critical";
import { BOILER_EFFICIENCY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boiler-efficiency-calculator-critical";
import { BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-agirlik-hesaplama-celik-paslanmaz-critical";
import { BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator-critical";
import { BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boya-kaplama-sarfiyati-m-basina-hesabi-critical";
import { BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boya-ve-apre-recetesi-maliyet-optimizasyon-calculator-critical";
import { BREAK_EVEN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/break-even-calculator-critical";
import { BRICK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/brick-calculator-critical";
import { BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator-critical";
import { CASH_FLOW_GAP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cash-flow-gap-calculator-critical";
import { CAY_KAHVE_SU_TUKETIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cay-kahve-su-tuketim-maliyeti-critical";
import { CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/celik-cati-makas-yaklasik-agirligi-critical";
import { CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/celik-raf-depo-rafi-yuk-kapasitesi-critical";
import { CLEANING_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cleaning-cost-calculator-critical";
import { CNC_CYCLE_TIME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-cycle-time-calculator-critical";
import { COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cobot-vs-manuel-iscilik-karsilastirma-calculator-critical";
import { COMPRESSOR_ENERGY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/compressor-energy-cost-calculator-critical";
import { CONCRETE_BAG_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/concrete-bag-calculator-critical";
import { CONCRETE_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/concrete-volume-calculator-critical";
import { CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cpk-ppk-hata-maliyeti-ppm-calculator-critical";
import { CROP_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/crop-yield-calculator-critical";
import { CUTTING_SPEED_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cutting-speed-calculator-critical";
import { DELIVERY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/delivery-cost-calculator-critical";
import { DEPO_RAF_PALET_YERLESIM_OPTIMIZASYONU_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/depo-raf-palet-yerlesim-optimizasyonu-critical";
import { DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator-critical";
import { DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/depreciation-calculator-critical";
import { DESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/desi-calculator-critical";
import { DISLI_MODUL_CAP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/disli-modul-cap-hesaplama-critical";
import { DIZEL_BENZIN_MALIYET_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dizel-benzin-maliyet-karsilastirma-critical";
import { DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator-critical";
import { DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dovme-ekstruzyon-proses-kuvvet-ve-pres-kapasite-calculator-critical";
import { DRYWALL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/drywall-calculator-critical";
import { ELECTRICITY_BILL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/electricity-bill-calculator-critical";
import { ENERGY_CONSUMPTION_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/energy-consumption-check-critical";
import { ENERJI_IZLEME_SISTEMI_YATIRIM_VE_TASARRUF_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator-critical";
import { ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enflasyon-fiyat-eskalasyonu-hesaplama-critical";
import { ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enjeksiyon-dokum-cekme-payi-hesabi-critical";
import { ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator-critical";
import { EXCAVATION_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/excavation-volume-calculator-critical";
import { FAZLA_MESAI_UCRETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fazla-mesai-ucreti-hesaplama-critical";
import { FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fazla-mesai-vs-yeni-ise-alim-basabas-calculator-critical";
import { FERTILIZER_DOSAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fertilizer-dosage-calculator-critical";
import { FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator-critical";
import { FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fiyat-artisi-ve-talep-esnekligi-karlilik-simulasyon-calculator-critical";
import { FLOORING_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/flooring-calculator-critical";
import { FOOD_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/food-cost-calculator-critical";
import { FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/forklift-transpalet-kullanim-maliyeti-critical";
import { FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fotokopi-yazici-toner-sayfa-maliyeti-critical";
import { FREIGHT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/freight-cost-calculator-critical";
import { FUEL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fuel-cost-calculator-critical";
import { FUEL_TRAVEL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fuel-travel-calculator-critical";
import { GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/gecis-grade-change-off-spec-ve-yikama-kayip-calculator-critical";
import { GERI_DONUSUM_GELIR_MALIYET_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/geri-donusum-gelir-maliyet-hesabi-critical";
import { HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hafriyat-ve-dolgu-dengesi-optimizasyon-calculator-critical";
import { HOURLY_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hourly-rate-calculator-critical";
import { IRRIGATION_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/irrigation-cost-check-critical";
import { IRSALIYE_FATURA_ADEDI_BASINA_SEVKIYAT_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/irsaliye-fatura-adedi-basina-sevkiyat-maliyeti-critical";
import { IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati-critical";
import { ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-degistirici-esanjor-kapasite-hesabi-critical";
import { ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator-critical";
import { ISI_YUKU_VE_ISITMA_SOGUTMA_KAPASITE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator-critical";
import { ISITMA_SOGUTMA_YUKU_KCAL_KW_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isitma-sogutma-yuku-kcal-kw-hesabi-critical";
import { ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iskele-ve-kalip-kullanim-suresi-optimizasyon-calculator-critical";
import { ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isletme-sermayesi-ve-nakit-dongusu-optimizasyon-calculator-critical";
import { ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator-critical";
import { ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/istatistiksel-proses-kontrol-spc-limit-hesabi-critical";
import { JENERATOR_KAPASITESI_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/jenerator-kapasitesi-secim-hesaplama-critical";
import { KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaizen-kazanc-takip-ve-onceliklendirme-calculator-critical";
import { KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaynak-dikis-hacmi-maliyeti-hesabi-critical";
import { KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator-critical";
import { KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator-critical";
import { KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kesme-parametreleri-takim-omru-optimizasyon-calculator-critical";
import { KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kiris-kolon-yaklasik-agirlik-hesabi-critical";
import { KLIMA_BTU_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/klima-btu-secim-hesaplama-critical";
import { KOK_NEDEN_ANALIZI_RCA_TEKRARLAYAN_ARIZA_BIRIKIMLI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator-critical";
import { KOMPRESOR_DEBISI_TANK_HACMI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kompresor-debisi-tank-hacmi-hesabi-critical";
import { KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/konteyner-yukleme-kapasitesi-teu-hesabi-critical";
import { KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/koruyucu-bakim-frekansi-ve-maliyet-optimizasyon-calculator-critical";
import { KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kosebent-lama-agirlik-hesaplama-critical";
import { KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator-critical";
import { KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kumas-serim-ve-kesim-optimizasyon-fire-calculator-critical";
import { KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kumlama-raspa-kum-sarfiyati-hesabi-critical";
import { KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kutle-dengesi-ve-fire-takip-calculator-critical";
import { KWH_CONSUMPTION_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kwh-consumption-check-critical";
import { KWH_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kwh-cost-calculator-critical";
import { LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator-critical";
import { LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/lastik-omru-degisim-km-hesaplama-critical";
import { LPG_BENZIN_TASARRUF_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/lpg-benzin-tasarruf-karsilastirma-critical";
import { MACHINE_HOUR_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/machine-hour-rate-calculator-critical";
import { MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/makine-ekonomik-omru-hurda-deger-hesabi-critical";
import { MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/matkap-kilavuz-delik-capi-tablosu-critical";
import { MIL_AKS_CAPI_HESABI_EGILME_BURULMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/mil-aks-capi-hesabi-egilme-burulma-critical";
import { MILK_YIELD_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/milk-yield-check-critical";
import { MTBF_MTTR_VE_KULLANILABILIRLIK_FINANSAL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/mtbf-mttr-ve-kullanilabilirlik-finansal-calculator-critical";
import { MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator-critical";
import { NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/npu-npi-profil-agirlik-hesaplama-critical";
import { OFIS_KIRTASIYE_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ofis-kirtasiye-sarfiyat-hesabi-critical";
import { OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ogrenme-egrisi-ve-parti-sure-tahmin-calculator-critical";
import { OTO_SERVIS_IS_EMRI_VE_YEDEK_PARCA_TEKLIF_TUTARLILIK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator-critical";
import { PAINT_COVERAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paint-coverage-calculator-critical";
import { PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paketleme-malzemesi-strec-koli-sarfiyati-critical";
import { PALET_AMBALAJ_KERESTE_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/palet-ambalaj-kereste-hesabi-critical";
import { PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli-critical";
import { PERSONEL_DEVAMSIZLIK_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/personel-devamsizlik-maliyeti-hesaplama-critical";
import { PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/plastik-enjeksiyon-cevrim-suresi-tahmini-critical";
import { POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/poka-yoke-hata-onleme-yatirim-geri-donus-calculator-critical";
import { POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/pompa-gucu-basma-yuksekligi-hesabi-critical";
import { PORTION_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/portion-cost-calculator-critical";
import { PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/prefabrik-konteyner-ofis-m-maliyeti-critical";
import { PRINT_JOB_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/print-job-cost-check-critical";
import { PROJECT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/project-cost-calculator-critical";
import { RADYATOR_PETEK_BOYU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/radyator-petek-boyu-hesaplama-critical";
import { REBAR_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/rebar-weight-calculator-critical";
import { RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/recete-maliyeti-ve-alternatif-hammadde-etki-calculator-critical";
import { RECIPE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/recipe-cost-check-critical";
import { RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/restoran-tabak-maliyeti-ve-porsiyon-optimizasyon-calculator-critical";
import { ROOFING_SQUARE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/roofing-square-cost-check-critical";
import { ROUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/route-cost-calculator-critical";
import { RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ruzgar-turbini-yaklasik-uretim-hesabi-critical";
import { SALARY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/salary-cost-calculator-critical";
import { SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/satis-kanali-karlilik-karsilastirma-calculator-critical";
import { SEED_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/seed-rate-calculator-critical";
import { SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ses-yalitimi-desibel-azaltimi-hesabi-critical";
import { SHEET_METAL_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sheet-metal-weight-calculator-critical";
import { SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/smed-setup-suresi-ve-ekonomik-parti-calculator-critical";
import { SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sofor-operator-gunluk-yevmiye-maliyeti-critical";
import { SOGUK_ODA_SOGUTMA_YUKU_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/soguk-oda-sogutma-yuku-hesabi-critical";
import { SOLAR_PANEL_OUTPUT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/solar-panel-output-calculator-critical";
import { SQUARE_FOOTAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/square-footage-calculator-critical";
import { SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/su-debisi-litre-dakika-hesaplama-critical";
import { SU_ISITMA_KAZAN_BOYLER_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/su-isitma-kazan-boyler-kapasite-hesabi-critical";
import { TAGUCHI_KALITE_KAYIP_FONKSIYONU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/taguchi-kalite-kayip-fonksiyonu-calculator-critical";
import { TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tahta-mdf-sunta-m-agirlik-hesabi-critical";
import { TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/takim-tutucu-ve-baglama-aparati-setup-suresi-calculator-critical";
import { TALEP_TAHMIN_HATASI_VE_STOK_STOK_YOKLUGU_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/talep-tahmin-hatasi-ve-stok-stok-yoklugu-maliyet-calculator-critical";
import { TEMIZLIK_MALZEMESI_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/temizlik-malzemesi-sarfiyat-hesabi-critical";
import { TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator-critical";
import { TILE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tile-calculator-critical";
import { TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tir-kamyon-yuk-kapasitesi-hesaplama-critical";
import { TOLERANCE_DRIFT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tolerance-drift-calculator-critical";
import { TOOL_LIFE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tool-life-calculator-critical";
import { TOPLANTI_SAATI_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/toplanti-saati-maliyeti-hesaplama-critical";
import { TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator-critical";
import { UNIT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/unit-cost-calculator-critical";
import { UNIT_PRICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/unit-price-calculator-critical";
import { UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ups-kesintisiz-guc-kaynagi-secimi-critical";
import { URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator-critical";
import { VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator-critical";
import { VAKUM_SISTEMI_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vakum-sistemi-kacak-ve-enerji-kayip-calculator-critical";
import { VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vida-somun-adim-dis-ustu-cap-hesabi-critical";
import { VOLUMETRIC_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/volumetric-weight-calculator-critical";
import { WAREHOUSE_STORAGE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/warehouse-storage-cost-calculator-critical";
import { WATER_USAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/water-usage-calculator-critical";
import { YALITIM_MALZEMESI_M_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yalitim-malzemesi-m-hesaplama-critical";
import { YAPISTIRICI_VE_SIZDIRMAZLIK_MALZEMESI_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yapistirici-ve-sizdirmazlik-malzemesi-tuketim-optimizasyon-calculator-critical";
import { YAY_HELISEL_KUVVET_UZAMA_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yay-helisel-kuvvet-uzama-hesabi-critical";
import { YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yedek-parca-stok-seviyesi-ve-durus-riski-optimizasyon-calculator-critical";
import { YEMEK_TABLDOT_MALIYET_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yemek-tabldot-maliyet-hesaplama-critical";
import { ZAMAN_ETUDU_VE_STANDART_SURE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/zaman-etudu-ve-standart-sure-calculator-critical";
import { AKU_KAPASITESI_CALISMA_SURESI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aku-kapasitesi-calisma-suresi-hesabi-critical";
import { AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aql-kabul-orneklemesi-risk-ve-maliyet-calculator-critical";
import { AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aydinlatma-armatur-sayisi-hesaplama-critical";
import { BORU_CAPI_AKIS_HIZI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-capi-akis-hizi-hesaplama-critical";
import { CABINET_COST_ESTIMATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cabinet-cost-estimator-critical";
import { CIT_KORKULUK_MALZEME_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cit-korkuluk-malzeme-hesabi-critical";
import { EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator-critical";
import { ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator-critical";
import { FUEL_CONSUMPTION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fuel-consumption-calculator-critical";
import { IOT_SENSOR_VE_ONGORUCU_BAKIM_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator-critical";
import { KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-critical";
import { KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator-critical";
import { KESME_BUKME_ABKANT_TONAJ_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kesme-bukme-abkant-tonaj-hesabi-critical";
import { KRITIKLIK_RISK_MATRISI_VE_BAKIM_STRATEJISI_SECIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator-critical";
import { LASER_CUTTING_TIME_CHECK_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/laser-cutting-time-check-critical";
import { MOTOR_GUCU_KW_HP_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/motor-gucu-kw-hp-cevirici-critical";
import { MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/musteri-kaybi-churn-ve-kaybedilen-gelir-calculator-critical";
import { SILINDIR_HACMI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/silindir-hacmi-hesaplama-critical";
import { SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama-critical";
import { SQUARE_METER_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/square-meter-calculator-critical";
import { TEL_KABLO_UZUNLUGU_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tel-kablo-uzunlugu-agirlik-hesabi-critical";
import { TITRESIM_FREKANS_PERIYOT_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/titresim-frekans-periyot-hesaplama-critical";
import { TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator-critical";
import { VEHICLE_DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vehicle-depreciation-calculator-critical";
import { ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/engine-modules-critical";
import { P77_FREE_TRAFFIC_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/p77-free-traffic-batch";
import { RENT_VS_BUY_RESULT_WARNING } from "@/lib/tools/rent-vs-buy-model";

const RENT_VS_BUY_DISCLAIMER =
  "Technical simulation only — not financial, legal, or tax advice. Verify assumptions before housing or investment decisions.";

export const rentVsBuyContract: FormulaContract = {
  toolId: "free-traffic.rent-vs-buy-calculator",
  toolName: "Rent vs Buy Comparison",
  slug: "rent-vs-buy-calculator",
  purpose:
    "Help users compare renting versus buying a home over a defined horizon with financing and ownership economics.",
  userDecision: "Should I rent or buy over the comparison period given my assumptions?",
  riskLevel: "critical",
  decisionImpact: "investment",
  requiredInputs: [
    "monthlyRent",
    "homePrice",
    "comparisonYears",
    "annualRentIncrease",
    "annualHomeAppreciation",
    "downPaymentPercent",
    "mortgageInterestRate",
    "mortgageTermYears",
    "investmentReturnRate",
    "ownershipCostPercent",
    "purchaseCostPercent",
    "sellingCostPercent",
  ],
  criticalInputs: [
    "monthlyRent",
    "homePrice",
    "comparisonYears",
    "annualRentIncrease",
    "annualHomeAppreciation",
    "downPaymentPercent",
    "mortgageInterestRate",
    "mortgageTermYears",
    "investmentReturnRate",
    "ownershipCostPercent",
    "purchaseCostPercent",
    "sellingCostPercent",
  ],
  outputs: [
    "recommendedPriceDifference",
    "totalRentPaid",
    "investmentValueIfRenting",
    "monthlyMortgagePayment",
    "totalMortgagePaid",
    "remainingMortgageBalance",
    "futureHomeValue",
    "estimatedOwnershipCosts",
    "estimatedSellingCosts",
    "rentNetPosition",
    "buyNetPosition",
    "netDifference",
    "strongerScenario",
  ],
  assumptions: [
    RENT_VS_BUY_DISCLAIMER,
    freeTrafficProductionAssumption(
      "rent-vs-buy-calculator",
      "calculateRentVsBuyComparison",
    ),
    RENT_VS_BUY_RESULT_WARNING,
    "Comparison horizon is held constant across scenarios.",
    "Ownership, tax and insurance effects are approximated via ownership cost percent.",
    GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE,
    "Model limitation: property tax, insurance, maintenance, financing and appreciation assumptions simplified.",
    "Model limitation: property tax, insurance, maintenance and opportunity cost approximated via ownership cost percent.",
    "Model limitation: local market conditions, rent control and transaction timing not modeled.",
    "Model limitation: investment return on down payment uses flat rate; tax treatment of rent vs buy excluded.",
    "Future extension: itemized tax deduction and capital-gains modeling.",
    "Future extension: regional insurance, PMI and maintenance schedules.",
    "Future extension: scenario-based ownership and financing stress tests.",
    "Numeric decision target is net cost comparison (netDifference); strongerScenario is narrative verdict only.",
  ],
  formulaSummary:
    "Rent scenario projects annual rent with growth, invests down payment plus purchase costs at the investment return rate, and compares rentNetPosition. Buy scenario amortizes mortgage, projects appreciation, ownership and selling costs, and compares buyNetPosition.",
  missingParameterWarnings: [],
  validationRules: [
    {
      id: "years-range",
      description: "comparisonYears must be between 1 and 40",
      kind: "edge",
    },
    {
      id: "calendar-year-guard",
      description: "comparisonYears must not be entered as a calendar year such as 2026",
      kind: "edge",
    },
    {
      id: "percent-bounds",
      description: "Rate and percent inputs must stay within 0–100 where applicable",
      kind: "dimensional",
    },
    {
      id: "currency-units",
      description: "Rent and price inputs must use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "net-difference-currency",
      description: "netDifference and recommendedPriceDifference use consistent currency units",
      kind: "dimensional",
    },
    {
      id: "verdict-non-numeric",
      description: "strongerScenario is narrative verdict output; not a numeric calculation target",
      kind: "purpose",
    },
  ],
  scenarioTests: scenarioRuntimeTests([
    { id: "normal-7yr", description: "7-year horizon with moderate rates" },
    { id: "high-rent-growth", description: "High annual rent increase" },
    { id: "low-appreciation", description: "Flat home appreciation" },
    { id: "high-mortgage-rate", description: "Elevated mortgage interest" },
    { id: "invalid-years", description: "comparisonYears outside 1–40 rejected" },
  ]),
  monotonicityRules: [
    {
      id: "rent-increase",
      description: "Higher annual rent increase must not reduce total rent paid",
      inputKey: "annualRentIncrease",
      direction: "increase_should_increase",
      outputKey: "totalRentPaid",
    },
    {
      id: "investment-return",
      description: "Higher investment return must not weaken rent net position",
      inputKey: "investmentReturnRate",
      direction: "increase_should_increase",
      outputKey: "rentNetPosition",
    },
    {
      id: "home-appreciation",
      description: "Higher home appreciation must not weaken buy net position",
      inputKey: "annualHomeAppreciation",
      direction: "increase_should_increase",
      outputKey: "buyNetPosition",
    },
    {
      id: "mortgage-rate-payment",
      description: "Higher mortgage interest must not decrease monthly payment",
      inputKey: "mortgageInterestRate",
      direction: "increase_should_increase",
      outputKey: "monthlyMortgagePayment",
    },
    {
      id: "down-payment-payment",
      description: "Higher down payment percent must not increase monthly mortgage payment",
      inputKey: "downPaymentPercent",
      direction: "increase_should_decrease",
      outputKey: "monthlyMortgagePayment",
    },
  ],
  oracleRequired: true,
  propertyTestsRegistered: true,
  auditStatus: "NEEDS_REVIEW",
  decisionLanguageRules: [
    {
      id: "no-definitive-verdict",
      description:
        "Rent vs Buy must not give a definitive buy/rent command; use assumption-qualified language only.",
      acceptablePhrases: [
        "Under these assumptions, buying looks stronger.",
        "Under these assumptions, renting and investing the difference looks stronger.",
        "Small changes in rates, rent growth or home appreciation can change the result.",
      ],
      requiredDisclaimer: true,
      forbiddenPhrases: [
        "you should buy",
        "you should rent",
        "this guarantees savings",
        "this is the best decision",
        "always buy",
        "always rent",
        "guaranteed savings",
        "guaranteed margin",
        "guaranteed profit",
      ],
    },
  ],
  mustNotClaim: [
    "You should buy.",
    "You should rent.",
    "This guarantees savings.",
    "This is the best decision.",
    "Guaranteed better option",
    "Certified financial advice",
    "Exact future home value",
    "Guaranteed savings",
    "Guaranteed margin",
    "Guaranteed profit",
  ],
  auditOwner: "formula-governance",
};

export const FORMULA_CONTRACTS: readonly FormulaContract[] = [
  rentVsBuyContract,
  ...TOP_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_TRAFFIC_CATALOG_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_PREMIUM_SCHEMA_CRITICAL_FORMULA_CONTRACTS,
  ...ROADMAP_FREE_BATCH_CRITICAL_FORMULA_CONTRACTS,
  ...PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS,
  ...SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS,
  ...AGRICULTURE_IRRIGATION_YIELD_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...CALIBRATION_DRIFT_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...CLOUD_API_COST_OVERRUN_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_COMPRESSOR_LEAK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_TOOL_WEAR_COST_CRITICAL_FORMULA_CONTRACTS,
  ...DAIRY_FEED_EFFICIENCY_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...CONSTRUCTION_PROJECT_OVERRUN_CRITICAL_FORMULA_CONTRACTS,
  ...CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...PAINTING_REWORK_COVERAGE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...FOOD_WASTE_MARGIN_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...HVAC_CALLBACK_MARGIN_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...RESTAURANT_MENU_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...WAREHOUSE_SPACE_COST_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...SHEET_METAL_SCRAP_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...PRINTING_REPRINT_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS,
  ...COMPRESSOR_LEAK_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DOWNTIME_MINUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_PEAK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_SAVINGS_PACKAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...INVENTORY_CARRYING_COST_EOQ_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...LOGISTICS_FUEL_ROUTE_DRIFT_CRITICAL_FORMULA_CONTRACTS,
  ...LOGISTICS_ROUTE_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...PLUMBING_LEAK_CALLBACK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RETAIL_INVENTORY_TURNOVER_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...ROOFING_WEATHER_DELAY_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...TEXTILE_FABRIC_WASTE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...VALUE_STREAM_MAP_VSM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BELT_PULLEY_SPEED_LENGTH_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BOLT_TIGHTENING_TORQUE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_OEE_LOSS_CRITICAL_FORMULA_CONTRACTS,
  ...EMPLOYEE_TOTAL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...INVESTMENT_PAYBACK_NPV_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...QUALITY_COST_PAF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SHOP_RATE_HOURLY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TOLERANCE_STACK_UP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AUTO_REPAIR_COMEBACK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...CARBON_FOOTPRINT_COMPLIANCE_RISK_CRITICAL_FORMULA_CONTRACTS,
  ...CBAM_COMPLIANCE_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...CBAM_EXPOSURE_QUICK_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...ELECTRICAL_PANEL_REWORK_COST_CRITICAL_FORMULA_CONTRACTS,
  ...LEGAL_INTEREST_FEE_CALCULATOR_PRO_CRITICAL_FORMULA_CONTRACTS,
  ...AUTO_SHOP_MARGIN_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS,
  ...CHANGE_ORDER_IMPACT_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...CROP_YIELD_LOSS_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...DAIRY_PROFIT_DETECTOR_CRITICAL_FORMULA_CONTRACTS,
  ...HEAT_LOSS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...HVAC_PROJECT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS,
  ...LANDSCAPING_CONTRACT_PROFIT_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...MATERIAL_WASTE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...MEAL_PLANNING_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...MENU_PROFIT_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS,
  ...MILLWORK_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...OFFICE_CLEANING_BID_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS,
  ...PAINTING_JOB_PROFIT_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...PANEL_SHOP_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...PLUMBING_JOB_MARGIN_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RETURN_PROFIT_EROSION_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...ROOFING_CONTRACT_MARGIN_GUARD_CRITICAL_FORMULA_CONTRACTS,
  ...ROUTE_OPTIMIZATION_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...SCRAP_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SHEET_METAL_QUOTE_RISK_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...SIGNAGE_BID_SAFE_PRICE_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...WATER_OPTIMIZATION_VERDICT_CRITICAL_FORMULA_CONTRACTS,
  ...THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS,
  ...WELDING_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_EFFICIENCY_REPORT_CRITICAL_FORMULA_CONTRACTS,
  ...RENOVATION_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS,
  ...TRIP_BUDGET_OPTIMIZER_CRITICAL_FORMULA_CONTRACTS,
  ...OEE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AGV_AMR_OTONOM_TASIMA_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ALTI_SIGMA_DPMO_SIGMA_SEVIYESI_CEVIRICI_CRITICAL_FORMULA_CONTRACTS,
  ...AMBALAJ_MALZEMESI_DEGISIMI_VE_MALIYET_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AMPER_KILOWATT_KW_CEVIRICI_CRITICAL_FORMULA_CONTRACTS,
  ...ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ARAC_AMORTISMAN_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...ARAC_BAKIM_PERIYODU_TAKIP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...ARAC_KIRA_SATIN_ALMA_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS,
  ...ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ATIK_YONETIMI_VE_BERTARAF_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BACA_HAVALANDIRMA_KANALI_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...BATCH_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BOILER_EFFICIENCY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BORU_AGIRLIK_HESAPLAMA_CELIK_PASLANMAZ_CRITICAL_FORMULA_CONTRACTS,
  ...BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...BOYA_VE_APRE_RECETESI_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BREAK_EVEN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BRICK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...BUHAR_KAPANI_STEAM_TRAP_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CASH_FLOW_GAP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CAY_KAHVE_SU_TUKETIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_CRITICAL_FORMULA_CONTRACTS,
  ...CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_CRITICAL_FORMULA_CONTRACTS,
  ...CLEANING_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_CYCLE_TIME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...COMPRESSOR_ENERGY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CONCRETE_BAG_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CONCRETE_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CPK_PPK_HATA_MALIYETI_PPM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CROP_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CUTTING_SPEED_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DELIVERY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DEPO_RAF_PALET_YERLESIM_OPTIMIZASYONU_CRITICAL_FORMULA_CONTRACTS,
  ...DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DISLI_MODUL_CAP_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...DIZEL_BENZIN_MALIYET_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS,
  ...DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DOVME_EKSTRUZYON_PROSES_KUVVET_VE_PRES_KAPASITE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...DRYWALL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ELECTRICITY_BILL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ENERGY_CONSUMPTION_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...ENERJI_IZLEME_SISTEMI_YATIRIM_VE_TASARRUF_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ENFLASYON_FIYAT_ESKALASYONU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...ENJEKSIYON_DOKUM_CEKME_PAYI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...EXCAVATION_VOLUME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FAZLA_MESAI_UCRETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FERTILIZER_DOSAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FIYAT_ARTISI_VE_TALEP_ESNEKLIGI_KARLILIK_SIMULASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FLOORING_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FOOD_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...FOTOKOPI_YAZICI_TONER_SAYFA_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...FREIGHT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FUEL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FUEL_TRAVEL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...GECIS_GRADE_CHANGE_OFF_SPEC_VE_YIKAMA_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...GERI_DONUSUM_GELIR_MALIYET_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...HOURLY_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...IRRIGATION_COST_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...IRSALIYE_FATURA_ADEDI_BASINA_SEVKIYAT_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...IS_ELBISESI_KKD_KISISEL_KORUYUCU_DONANIM_SARFIYATI_CRITICAL_FORMULA_CONTRACTS,
  ...ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ISI_YUKU_VE_ISITMA_SOGUTMA_KAPASITE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ISITMA_SOGUTMA_YUKU_KCAL_KW_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...ISKELE_VE_KALIP_KULLANIM_SURESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ISLETME_SERMAYESI_VE_NAKIT_DONGUSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ISO_50001_ENERJI_YONETIMI_TABAN_CIZGISI_VE_TASARRUF_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...JENERATOR_KAPASITESI_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...KAIZEN_KAZANC_TAKIP_VE_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KAYNAK_DIKIS_HACMI_MALIYETI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KAYNAK_MALIYETI_VE_DOLGU_METALI_TUKETIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KLIMA_BTU_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...KOK_NEDEN_ANALIZI_RCA_TEKRARLAYAN_ARIZA_BIRIKIMLI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KOMPRESOR_DEBISI_TANK_HACMI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KONTEYNER_YUKLEME_KAPASITESI_TEU_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KORUYUCU_BAKIM_FREKANSI_VE_MALIYET_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KOSEBENT_LAMA_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KUMAS_SERIM_VE_KESIM_OPTIMIZASYON_FIRE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KUMLAMA_RASPA_KUM_SARFIYATI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KWH_CONSUMPTION_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...KWH_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...LPG_BENZIN_TASARRUF_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS,
  ...MACHINE_HOUR_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...MAKINE_EKONOMIK_OMRU_HURDA_DEGER_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_CRITICAL_FORMULA_CONTRACTS,
  ...MIL_AKS_CAPI_HESABI_EGILME_BURULMA_CRITICAL_FORMULA_CONTRACTS,
  ...MILK_YIELD_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...MTBF_MTTR_VE_KULLANILABILIRLIK_FINANSAL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...MUSTERI_YASAM_BOYU_DEGER_CLV_VE_EDINME_MALIYETI_CAC_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...OFIS_KIRTASIYE_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...OTO_SERVIS_IS_EMRI_VE_YEDEK_PARCA_TEKLIF_TUTARLILIK_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...PAINT_COVERAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_CRITICAL_FORMULA_CONTRACTS,
  ...PALET_AMBALAJ_KERESTE_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_CRITICAL_FORMULA_CONTRACTS,
  ...PERSONEL_DEVAMSIZLIK_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_CRITICAL_FORMULA_CONTRACTS,
  ...POKA_YOKE_HATA_ONLEME_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...PORTION_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...PREFABRIK_KONTEYNER_OFIS_M_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...PRINT_JOB_COST_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...PROJECT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RADYATOR_PETEK_BOYU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...REBAR_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RECETE_MALIYETI_VE_ALTERNATIF_HAMMADDE_ETKI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RECIPE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...RESTORAN_TABAK_MALIYETI_VE_PORSIYON_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ROOFING_SQUARE_COST_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...ROUTE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...RUZGAR_TURBINI_YAKLASIK_URETIM_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...SALARY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SATIS_KANALI_KARLILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SEED_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...SHEET_METAL_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SMED_SETUP_SURESI_VE_EKONOMIK_PARTI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SOFOR_OPERATOR_GUNLUK_YEVMIYE_MALIYETI_CRITICAL_FORMULA_CONTRACTS,
  ...SOGUK_ODA_SOGUTMA_YUKU_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...SOLAR_PANEL_OUTPUT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SQUARE_FOOTAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SU_DEBISI_LITRE_DAKIKA_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...SU_ISITMA_KAZAN_BOYLER_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...TAGUCHI_KALITE_KAYIP_FONKSIYONU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TAHTA_MDF_SUNTA_M_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...TAKIM_TUTUCU_VE_BAGLAMA_APARATI_SETUP_SURESI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TALEP_TAHMIN_HATASI_VE_STOK_STOK_YOKLUGU_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TEMIZLIK_MALZEMESI_SARFIYAT_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...TEMIZLIK_VE_HIJYEN_KIMYASAL_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TILE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...TOLERANCE_DRIFT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TOOL_LIFE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TOPLANTI_SAATI_MALIYETI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...UNIT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...UNIT_PRICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...UPS_KESINTISIZ_GUC_KAYNAGI_SECIMI_CRITICAL_FORMULA_CONTRACTS,
  ...URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...VADE_FARKI_VE_ERKEN_ODEME_ISKONTOSU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...VAKUM_SISTEMI_KACAK_VE_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...VOLUMETRIC_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...WAREHOUSE_STORAGE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...WATER_USAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...YALITIM_MALZEMESI_M_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...YAPISTIRICI_VE_SIZDIRMAZLIK_MALZEMESI_TUKETIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...YAY_HELISEL_KUVVET_UZAMA_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...YEDEK_PARCA_STOK_SEVIYESI_VE_DURUS_RISKI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...YEMEK_TABLDOT_MALIYET_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...ZAMAN_ETUDU_VE_STANDART_SURE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AKU_KAPASITESI_CALISMA_SURESI_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...AYDINLATMA_ARMATUR_SAYISI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...BORU_CAPI_AKIS_HIZI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...CABINET_COST_ESTIMATOR_CRITICAL_FORMULA_CONTRACTS,
  ...CIT_KORKULUK_MALZEME_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...EGITIM_YATIRIMI_VE_VERIMLILIK_ARTISI_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ESNEK_URETIM_HUCRESI_YATIRIM_VE_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...FUEL_CONSUMPTION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...IOT_SENSOR_VE_ONGORUCU_BAKIM_YATIRIM_GERI_DONUS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KAPASITE_PLANLAMA_VE_DARBOGAZ_YATIRIM_ONCELIKLENDIRME_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KAZANILMIS_DEGER_YONETIMI_EVM_TAMAMLANMA_MALIYET_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...KESME_BUKME_ABKANT_TONAJ_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...KRITIKLIK_RISK_MATRISI_VE_BAKIM_STRATEJISI_SECIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...LASER_CUTTING_TIME_CHECK_CRITICAL_FORMULA_CONTRACTS,
  ...MOTOR_GUCU_KW_HP_CEVIRICI_CRITICAL_FORMULA_CONTRACTS,
  ...MUSTERI_KAYBI_CHURN_VE_KAYBEDILEN_GELIR_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...SILINDIR_HACMI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...SQUARE_METER_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...TEL_KABLO_UZUNLUGU_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS,
  ...TITRESIM_FREKANS_PERIYOT_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS,
  ...TOPLAM_SAHIP_OLMA_MALIYETI_TCO_EKIPMAN_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...VEHICLE_DEPRECIATION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS,
  ...ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS,
  ...P77_FREE_TRAFFIC_FORMULA_CONTRACTS,
];

export function getFormulaContractBySlug(slug: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.slug === slug);
}

export function getFormulaContractById(toolId: string): FormulaContract | undefined {
  return FORMULA_CONTRACTS.find((c) => c.toolId === toolId);
}

export function listFormulaContractSlugs(): readonly string[] {
  return FORMULA_CONTRACTS.map((c) => c.slug);
}
