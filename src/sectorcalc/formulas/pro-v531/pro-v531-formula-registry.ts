import "server-only";

export interface FormulaModuleConfig {
  toolKey: string;
  file: string;
}

export const PRO_FORMULA_CONFIGS: FormulaModuleConfig[] = [
  { toolKey: "sc_013_eurocode_steel_connection_capacity_check_calculator", file: "sc_013_eurocode_steel_connection_capacity_check_calculator.formula.ts" },
  { toolKey: "sc_019_cbam_covered_steel_import_cost_and_welding_haz_carbon_auditor_calculator", file: "sc_019_cbam_covered_steel_import_cost_and_welding_haz_carbon_auditor_calculator.formula.ts" },
  { toolKey: "sc_045_anchor_embedment_and_edge_breakout_evidence_calculator", file: "sc_045_anchor_embedment_and_edge_breakout_evidence_calculator.formula.ts" },
  { toolKey: "sc_035_press_brake_springback_and_rework_margin_calculator", file: "sc_035_press_brake_springback_and_rework_margin_calculator.formula.ts" },
  { toolKey: "sc_027_welding_wps_pqr_heat_input_and_distortion_rework_cost_calculator", file: "sc_027_welding_wps_pqr_heat_input_and_distortion_rework_cost_calculator.formula.ts" },
  { toolKey: "sc_047_crane_outrigger_pressure_and_ground_mat_bearing_margin_calculator", file: "sc_047_crane_outrigger_pressure_and_ground_mat_bearing_margin_calculator.formula.ts" },
  { toolKey: "sc_025_laser_cutting_nitrogen_consumption_and_kerf_dross_rework_cost_calculator", file: "sc_025_laser_cutting_nitrogen_consumption_and_kerf_dross_rework_cost_calculator.formula.ts" },
  { toolKey: "sc_020_cnc_spindle_power_and_tool_amortization_break_even_analysis_calculator", file: "sc_020_cnc_spindle_power_and_tool_amortization_break_even_analysis_calculator.formula.ts" },
  { toolKey: "sc_046_formwork_lateral_pressure_and_tie_rod_spacing_risk_calculator", file: "sc_046_formwork_lateral_pressure_and_tie_rod_spacing_risk_calculator.formula.ts" },
  { toolKey: "sc_098_cnc_setup_reuse_and_one_off_job_floor_price_calculator", file: "sc_098_cnc_setup_reuse_and_one_off_job_floor_price_calculator.formula.ts" },
  { toolKey: "sc_002_ion_implantation_dose_and_uniformity_margin_calculator", file: "sc_002_ion_implantation_dose_and_uniformity_margin_calculator.formula.ts" },
  { toolKey: "sc_003_concrete_maturity_strength_margin_calculator", file: "sc_003_concrete_maturity_strength_margin_calculator.formula.ts" },
  { toolKey: "sc_007_lng_boil_off_rate_and_tank_pressure_margin_calculator", file: "sc_007_lng_boil_off_rate_and_tank_pressure_margin_calculator.formula.ts" },
  { toolKey: "sc_009_autoclave_degree_of_cure_and_tg_margin_calculator", file: "sc_009_autoclave_degree_of_cure_and_tg_margin_calculator.formula.ts" },
  { toolKey: "sc_010_post_weld_heat_treatment_qualification_margin_calculator", file: "sc_010_post_weld_heat_treatment_qualification_margin_calculator.formula.ts" },
  { toolKey: "sc_012_lyophilization_collapse_temperature_margin_calculator", file: "sc_012_lyophilization_collapse_temperature_margin_calculator.formula.ts" },
  { toolKey: "sc_093_digital_product_passport_bom_evidence_gap_cost_calculator", file: "sc_093_digital_product_passport_bom_evidence_gap_cost_calculator.formula.ts" },
  { toolKey: "sc_039_fixture_clamping_force_and_part_deflection_risk_calculator", file: "sc_039_fixture_clamping_force_and_part_deflection_risk_calculator.formula.ts" },
  { toolKey: "sc_036_galvanizing_zinc_adhesion_and_vent_drain_risk_cost_calculator", file: "sc_036_galvanizing_zinc_adhesion_and_vent_drain_risk_cost_calculator.formula.ts" },
  { toolKey: "sc_021_compressed_air_leak_cfm_peak_tariff_and_carbon_cost_calculator", file: "sc_021_compressed_air_leak_cfm_peak_tariff_and_carbon_cost_calculator.formula.ts" },
  { toolKey: "sc_111_welding_preheat_carbon_equivalent_and_hydrogen_cracking_risk_calculator", file: "sc_111_welding_preheat_carbon_equivalent_and_hydrogen_cracking_risk_calculator.formula.ts" },
  { toolKey: "sc_095_bolt_preload_loss_and_slip_critical_joint_check_calculator", file: "sc_095_bolt_preload_loss_and_slip_critical_joint_check_calculator.formula.ts" },
  { toolKey: "sc_094_en_1090_welding_execution_class_cost_risk_estimator_calculator", file: "sc_094_en_1090_welding_execution_class_cost_risk_estimator_calculator.formula.ts" },
  { toolKey: "sc_096_welding_consumable_deposition_efficiency_and_shielding_gas_cost_pricer_calculator", file: "sc_096_welding_consumable_deposition_efficiency_and_shielding_gas_cost_pricer_calculator.formula.ts" },
  { toolKey: "sc_056_reefer_container_temperature_deviation_and_product_spoilage_risk_calculator", file: "sc_056_reefer_container_temperature_deviation_and_product_spoilage_risk_calculator.formula.ts" },
  { toolKey: "sc_103_spare_part_criticality_and_downtime_cost_comparison_calculator", file: "sc_103_spare_part_criticality_and_downtime_cost_comparison_calculator.formula.ts" },
  { toolKey: "sc_022_textile_dye_batch_water_energy_ghg_cost_deviation_map_calculator", file: "sc_022_textile_dye_batch_water_energy_ghg_cost_deviation_map_calculator.formula.ts" },
  { toolKey: "sc_081_steam_trap_leakage_and_condensate_recovery_roi_calculator", file: "sc_081_steam_trap_leakage_and_condensate_recovery_roi_calculator.formula.ts" },
  { toolKey: "sc_029_apparel_marker_efficiency_and_fabric_width_change_loss_calculator", file: "sc_029_apparel_marker_efficiency_and_fabric_width_change_loss_calculator.formula.ts" },
  { toolKey: "sc_034_industrial_capex_justification_and_hidden_opex_penalty_modeler_calculator", file: "sc_034_industrial_capex_justification_and_hidden_opex_penalty_modeler_calculator.formula.ts" },
  { toolKey: "sc_037_paint_booth_dft_overspray_and_repainting_margin_calculator", file: "sc_037_paint_booth_dft_overspray_and_repainting_margin_calculator.formula.ts" },
  { toolKey: "sc_070_fabric_gsm_shrinkage_and_finished_roll_yield_calculator", file: "sc_070_fabric_gsm_shrinkage_and_finished_roll_yield_calculator.formula.ts" },
  { toolKey: "sc_076_gauge_r_and_r_decision_risk_calculator", file: "sc_076_gauge_r_and_r_decision_risk_calculator.formula.ts" },
  { toolKey: "sc_112_steel_column_base_plate_grout_crushing_margin_calculator", file: "sc_112_steel_column_base_plate_grout_crushing_margin_calculator.formula.ts" },
  { toolKey: "sc_082_boiler_excess_oxygen_fuel_penalty_and_tuning_margin_calculator", file: "sc_082_boiler_excess_oxygen_fuel_penalty_and_tuning_margin_calculator.formula.ts" },
  { toolKey: "sc_104_preventive_maintenance_interval_and_failure_cost_optimization_calculator", file: "sc_104_preventive_maintenance_interval_and_failure_cost_optimization_calculator.formula.ts" },
  { toolKey: "sc_119_cnc_thread_milling_cycle_and_tap_breakage_risk_calculator", file: "sc_119_cnc_thread_milling_cycle_and_tap_breakage_risk_calculator.formula.ts" },
  { toolKey: "sc_108_vibration_severity_bearing_failure_cost_estimator_calculator", file: "sc_108_vibration_severity_bearing_failure_cost_estimator_calculator.formula.ts" },
  { toolKey: "sc_028_vfd_pump_affinity_law_and_demand_charge_overrun_estimator_calculator", file: "sc_028_vfd_pump_affinity_law_and_demand_charge_overrun_estimator_calculator.formula.ts" },
  { toolKey: "sc_038_powder_coating_cure_window_and_oven_energy_cost_calculator", file: "sc_038_powder_coating_cure_window_and_oven_energy_cost_calculator.formula.ts" },
  { toolKey: "sc_055_container_axle_load_and_road_legal_margin_calculator", file: "sc_055_container_axle_load_and_road_legal_margin_calculator.formula.ts" },
  { toolKey: "sc_001_data_center_power_and_cooling_capacity_margin_with_occupancy_ramp_calculator", file: "sc_001_data_center_power_and_cooling_capacity_margin_with_occupancy_ramp_calculator.formula.ts" },
  { toolKey: "sc_004_electrolyzer_stack_degradation_and_replacement_timing_calculator", file: "sc_004_electrolyzer_stack_degradation_and_replacement_timing_calculator.formula.ts" },
  { toolKey: "sc_005_metal_am_powder_reuse_risk_margin_calculator", file: "sc_005_metal_am_powder_reuse_risk_margin_calculator.formula.ts" },
  { toolKey: "sc_006_grain_silo_self_heating_and_ignition_risk_index_calculator", file: "sc_006_grain_silo_self_heating_and_ignition_risk_index_calculator.formula.ts" },
  { toolKey: "sc_008_post_quench_hardness_and_microstructure_risk_margin_calculator", file: "sc_008_post_quench_hardness_and_microstructure_risk_margin_calculator.formula.ts" },
  { toolKey: "sc_011_battery_cell_formation_yield_and_scrap_ramp_margin_calculator", file: "sc_011_battery_cell_formation_yield_and_scrap_ramp_margin_calculator.formula.ts" },
  { toolKey: "sc_048_temporary_support_load_redistribution_margin_calculator", file: "sc_048_temporary_support_load_redistribution_margin_calculator.formula.ts" },
  { toolKey: "sc_058_hazardous_material_segregated_loading_plan_check_calculator", file: "sc_058_hazardous_material_segregated_loading_plan_check_calculator.formula.ts" },
  { toolKey: "sc_087_heat_exchanger_fouling_u_value_cleaning_payback_calculator", file: "sc_087_heat_exchanger_fouling_u_value_cleaning_payback_calculator.formula.ts" },
  { toolKey: "sc_085_transformer_hot_spot_aging_and_overload_margin_calculator", file: "sc_085_transformer_hot_spot_aging_and_overload_margin_calculator.formula.ts" },
  { toolKey: "sc_023_cold_chain_route_tco_reefer_diesel_kwh_and_door_open_loss_calculator", file: "sc_023_cold_chain_route_tco_reefer_diesel_kwh_and_door_open_loss_calculator.formula.ts" },
  { toolKey: "sc_033_container_stowage_cbm_demurrage_and_carbon_surcharge_calculator", file: "sc_033_container_stowage_cbm_demurrage_and_carbon_surcharge_calculator.formula.ts" },
  { toolKey: "sc_041_grinding_wheel_wear_and_thermal_burn_risk_cost_calculator", file: "sc_041_grinding_wheel_wear_and_thermal_burn_risk_cost_calculator.formula.ts" },
  { toolKey: "sc_077_cp_cpk_scrap_cost_confidence_calculator", file: "sc_077_cp_cpk_scrap_cost_confidence_calculator.formula.ts" },
  { toolKey: "sc_083_chiller_fouling_approach_temperature_cleaning_payback_calculator", file: "sc_083_chiller_fouling_approach_temperature_cleaning_payback_calculator.formula.ts" },
  { toolKey: "sc_118_sheet_metal_flat_pattern_bend_allowance_audit_calculator", file: "sc_118_sheet_metal_flat_pattern_bend_allowance_audit_calculator.formula.ts" },
  { toolKey: "sc_109_hydraulic_oil_contamination_iso_code_and_valve_failure_risk_calculator", file: "sc_109_hydraulic_oil_contamination_iso_code_and_valve_failure_risk_calculator.formula.ts" },
  { toolKey: "sc_042_surface_roughness_and_cycle_time_trade_off_calculator", file: "sc_042_surface_roughness_and_cycle_time_trade_off_calculator.formula.ts" },
  { toolKey: "sc_044_hydraulic_press_tonnage_and_die_deflection_margin_calculator", file: "sc_044_hydraulic_press_tonnage_and_die_deflection_margin_calculator.formula.ts" },
  { toolKey: "sc_072_textile_wastewater_cod_color_chemical_dose_cost_estimator_calculator", file: "sc_072_textile_wastewater_cod_color_chemical_dose_cost_estimator_calculator.formula.ts" },
  { toolKey: "sc_024_pivot_irrigation_kwh_and_drought_yield_loss_risk_calculator", file: "sc_024_pivot_irrigation_kwh_and_drought_yield_loss_risk_calculator.formula.ts" },
  { toolKey: "sc_026_injection_molding_cycle_time_and_heater_carbon_tax_calculator", file: "sc_026_injection_molding_cycle_time_and_heater_carbon_tax_calculator.formula.ts" },
  { toolKey: "sc_031_paint_cure_oven_gas_consumption_and_voc_carbon_credit_loss_calculator", file: "sc_031_paint_cure_oven_gas_consumption_and_voc_carbon_credit_loss_calculator.formula.ts" },
  { toolKey: "sc_099_toolholder_runout_and_tool_life_loss_calculator", file: "sc_099_toolholder_runout_and_tool_life_loss_calculator.formula.ts" },
  { toolKey: "sc_054_rebar_congestion_and_concrete_placeability_risk_index_calculator", file: "sc_054_rebar_congestion_and_concrete_placeability_risk_index_calculator.formula.ts" },
  { toolKey: "sc_032_turkish_sme_cnc_hourly_cost_grant_leasing_adjusted_calculator", file: "sc_032_turkish_sme_cnc_hourly_cost_grant_leasing_adjusted_calculator.formula.ts" },
  { toolKey: "sc_059_demurrage_free_time_risk_and_document_preparation_hours_calculator", file: "sc_059_demurrage_free_time_risk_and_document_preparation_hours_calculator.formula.ts" },
  { toolKey: "sc_073_apparel_sewing_line_balance_and_wip_delay_cost_calculator", file: "sc_073_apparel_sewing_line_balance_and_wip_delay_cost_calculator.formula.ts" },
  { toolKey: "sc_088_injection_molding_residence_time_and_polymer_degradation_margin_calculator", file: "sc_088_injection_molding_residence_time_and_polymer_degradation_margin_calculator.formula.ts" },
  { toolKey: "sc_064_poultry_ventilation_ammonia_and_heat_stress_margin_calculator", file: "sc_064_poultry_ventilation_ammonia_and_heat_stress_margin_calculator.formula.ts" },
  { toolKey: "sc_078_aql_sampling_producer_consumer_risk_calculator", file: "sc_078_aql_sampling_producer_consumer_risk_calculator.formula.ts" },
  { toolKey: "sc_080_calibration_interval_risk_and_cost_optimization_calculator", file: "sc_080_calibration_interval_risk_and_cost_optimization_calculator.formula.ts" },
  { toolKey: "sc_120_bearing_fit_thermal_expansion_assembly_risk_calculator", file: "sc_120_bearing_fit_thermal_expansion_assembly_risk_calculator.formula.ts" },
  { toolKey: "sc_016_1_1000_robust_design_reliability_calculator", file: "sc_016_1_1000_robust_design_reliability_calculator.formula.ts" },
  { toolKey: "sc_040_edm_wire_consumption_and_kerf_accuracy_cost_calculator", file: "sc_040_edm_wire_consumption_and_kerf_accuracy_cost_calculator.formula.ts" },
  { toolKey: "sc_052_pile_concrete_overbreak_and_tremie_loss_cost_calculator", file: "sc_052_pile_concrete_overbreak_and_tremie_loss_cost_calculator.formula.ts" },
  { toolKey: "sc_071_knitting_yarn_consumption_and_needle_break_defect_cost_calculator", file: "sc_071_knitting_yarn_consumption_and_needle_break_defect_cost_calculator.formula.ts" },
  { toolKey: "sc_050_scaffold_tie_and_wind_load_pre_margin_calculator", file: "sc_050_scaffold_tie_and_wind_load_pre_margin_calculator.formula.ts" },
  { toolKey: "sc_097_steel_plate_nesting_scrap_and_drop_off_scrap_risk_calculator", file: "sc_097_steel_plate_nesting_scrap_and_drop_off_scrap_risk_calculator.formula.ts" },
  { toolKey: "sc_113_textile_roll_defect_four_point_system_claim_cost_calculator", file: "sc_113_textile_roll_defect_four_point_system_claim_cost_calculator.formula.ts" },
  { toolKey: "sc_107_product_mix_bottleneck_contribution_calculator", file: "sc_107_product_mix_bottleneck_contribution_calculator.formula.ts" },
  { toolKey: "sc_117_field_welding_shielding_gas_flow_and_wind_loss_calculator", file: "sc_117_field_welding_shielding_gas_flow_and_wind_loss_calculator.formula.ts" },
  { toolKey: "sc_089_mold_cooling_reynolds_cycle_time_and_warpage_balance_calculator", file: "sc_089_mold_cooling_reynolds_cycle_time_and_warpage_balance_calculator.formula.ts" },
  { toolKey: "sc_100_cnc_thermal_growth_and_tolerance_drift_calculator", file: "sc_100_cnc_thermal_growth_and_tolerance_drift_calculator.formula.ts" },
  { toolKey: "sc_106_customer_profitability_and_toxic_account_detection_calculator", file: "sc_106_customer_profitability_and_toxic_account_detection_calculator.formula.ts" },
  { toolKey: "sc_061_grain_dryer_shrinkage_and_fuel_cost_margin_calculator", file: "sc_061_grain_dryer_shrinkage_and_fuel_cost_margin_calculator.formula.ts" },
  { toolKey: "sc_017_api_based_structural_load_transfer_calculator", file: "sc_017_api_based_structural_load_transfer_calculator.formula.ts" },
  { toolKey: "sc_065_cold_room_door_open_load_and_defrost_plan_cost_calculator", file: "sc_065_cold_room_door_open_load_and_defrost_plan_cost_calculator.formula.ts" },
  { toolKey: "sc_079_rework_vs_scrap_economic_decision_calculator", file: "sc_079_rework_vs_scrap_economic_decision_calculator.formula.ts" },
  { toolKey: "sc_084_power_factor_correction_capacitor_payback_and_harmonic_risk_calculator", file: "sc_084_power_factor_correction_capacitor_payback_and_harmonic_risk_calculator.formula.ts" },
  { toolKey: "sc_062_irrigation_pump_voltage_drop_and_water_shortage_cost_calculator", file: "sc_062_irrigation_pump_voltage_drop_and_water_shortage_cost_calculator.formula.ts" },
  { toolKey: "sc_053_asphalt_compaction_temperature_window_and_roller_plan_calculator", file: "sc_053_asphalt_compaction_temperature_window_and_roller_plan_calculator.formula.ts" },
  { toolKey: "sc_074_enzyme_wash_weight_loss_and_color_deviation_margin_calculator", file: "sc_074_enzyme_wash_weight_loss_and_color_deviation_margin_calculator.formula.ts" },
  { toolKey: "sc_086_motor_vfd_retrofit_savings_and_harmonic_derating_risk_calculator", file: "sc_086_motor_vfd_retrofit_savings_and_harmonic_derating_risk_calculator.formula.ts" },
  { toolKey: "sc_063_greenhouse_heating_degree_hour_fuel_and_condensation_risk_calculator", file: "sc_063_greenhouse_heating_degree_hour_fuel_and_condensation_risk_calculator.formula.ts" },
  { toolKey: "sc_043_cnc_coolant_concentration_tool_life_and_corrosion_cost_calculator", file: "sc_043_cnc_coolant_concentration_tool_life_and_corrosion_cost_calculator.formula.ts" },
  { toolKey: "sc_049_masonry_wall_lintel_bearing_and_crack_risk_calculator", file: "sc_049_masonry_wall_lintel_bearing_and_crack_risk_calculator.formula.ts" },
  { toolKey: "sc_110_air_receiver_sizing_and_compressor_cycling_cost_calculator", file: "sc_110_air_receiver_sizing_and_compressor_cycling_cost_calculator.formula.ts" },
  { toolKey: "sc_115_solar_plant_soiling_loss_and_cleaning_water_cost_calculator", file: "sc_115_solar_plant_soiling_loss_and_cleaning_water_cost_calculator.formula.ts" },
  { toolKey: "sc_101_restaurant_menu_engineering_real_gross_margin_calculator", file: "sc_101_restaurant_menu_engineering_real_gross_margin_calculator.formula.ts" },
  { toolKey: "sc_105_supplier_delay_buffer_and_cash_tied_in_inventory_risk_calculator", file: "sc_105_supplier_delay_buffer_and_cash_tied_in_inventory_risk_calculator.formula.ts" },
  { toolKey: "sc_075_digital_textile_printing_ink_laydown_and_curing_energy_cost_calculator", file: "sc_075_digital_textile_printing_ink_laydown_and_curing_energy_cost_calculator.formula.ts" },
  { toolKey: "sc_092_lumber_drying_emc_defect_risk_calculator", file: "sc_092_lumber_drying_emc_defect_risk_calculator.formula.ts" },
  { toolKey: "sc_066_blast_chiller_batch_cooling_compliance_margin_calculator", file: "sc_066_blast_chiller_batch_cooling_compliance_margin_calculator.formula.ts" },
  { toolKey: "sc_060_milk_cooling_tank_bacterial_growth_time_risk_calculator", file: "sc_060_milk_cooling_tank_bacterial_growth_time_risk_calculator.formula.ts" },
  { toolKey: "sc_116_warehouse_picking_route_congestion_cost_calculator", file: "sc_116_warehouse_picking_route_congestion_cost_calculator.formula.ts" },
  { toolKey: "sc_090_extrusion_die_swell_and_wall_thickness_margin_calculator", file: "sc_090_extrusion_die_swell_and_wall_thickness_margin_calculator.formula.ts" },
  { toolKey: "sc_030_forklift_battery_charge_cycle_and_peak_grid_kw_penalty_calculator", file: "sc_030_forklift_battery_charge_cycle_and_peak_grid_kw_penalty_calculator.formula.ts" },
  { toolKey: "sc_057_pallet_stretch_wrap_holding_force_and_film_cost_optimization_calculator", file: "sc_057_pallet_stretch_wrap_holding_force_and_film_cost_optimization_calculator.formula.ts" },
  { toolKey: "sc_069_kitchen_hood_makeup_air_gap_calculator", file: "sc_069_kitchen_hood_makeup_air_gap_calculator.formula.ts" },
  { toolKey: "sc_091_edge_banding_glue_line_failure_and_adhesive_cost_calculator", file: "sc_091_edge_banding_glue_line_failure_and_adhesive_cost_calculator.formula.ts" },
  { toolKey: "sc_051_waterproofing_membrane_lap_and_pinhole_leakage_risk_cost_calculator", file: "sc_051_waterproofing_membrane_lap_and_pinhole_leakage_risk_cost_calculator.formula.ts" },
  { toolKey: "sc_114_restaurant_cold_chain_accept_reject_cost_calculator", file: "sc_114_restaurant_cold_chain_accept_reject_cost_calculator.formula.ts" },
  { toolKey: "sc_102_restaurant_peak_hour_labor_and_table_turn_profit_calculator", file: "sc_102_restaurant_peak_hour_labor_and_table_turn_profit_calculator.formula.ts" },
  { toolKey: "sc_067_bakery_fermentation_window_and_dough_yield_margin_calculator", file: "sc_067_bakery_fermentation_window_and_dough_yield_margin_calculator.formula.ts" },
  { toolKey: "sc_015_designer_fea_snap_through_stress_pre_screening_calculator", file: "sc_015_designer_fea_snap_through_stress_pre_screening_calculator.formula.ts" },
  { toolKey: "sc_014_automotive_aerodynamic_drag_scenario_estimator_calculator", file: "sc_014_automotive_aerodynamic_drag_scenario_estimator_calculator.formula.ts" },
  { toolKey: "sc_068_fryer_oil_tpm_change_cost_threshold_calculator", file: "sc_068_fryer_oil_tpm_change_cost_threshold_calculator.formula.ts" },
  { toolKey: "sc_018_unit_aware_electrical_rlc_circuit_solver_calculator", file: "sc_018_unit_aware_electrical_rlc_circuit_solver_calculator.formula.ts" },
  { toolKey: "sc_150_flange_bolt_torque_and_gasket_seating_stress_calculator", file: "sc_150_flange_bolt_torque_and_gasket_seating_stress_calculator.formula.ts" },
  { toolKey: "sc_151_rigging_sling_angle_and_multi_leg_load_calculator", file: "sc_151_rigging_sling_angle_and_multi_leg_load_calculator.formula.ts" },
  { toolKey: "sc_152_cnc_job_quote_builder_calculator", file: "sc_152_cnc_job_quote_builder_calculator.formula.ts" },
  { toolKey: "sc_153_weld_cost_per_meter_quote_builder_calculator", file: "sc_153_weld_cost_per_meter_quote_builder_calculator.formula.ts" },
  { toolKey: "sc_154_sheet_metal_part_quote_builder_calculator", file: "sc_154_sheet_metal_part_quote_builder_calculator.formula.ts" },
  { toolKey: "sc_155_crane_lift_plan_generator_calculator", file: "sc_155_crane_lift_plan_generator_calculator.formula.ts" },
  { toolKey: "sc_156_bolt_torque_chart_and_tightening_record_generator_calculator", file: "sc_156_bolt_torque_chart_and_tightening_record_generator_calculator.formula.ts" },
  { toolKey: "sc_157_cbam_exporter_emission_data_pack_calculator", file: "sc_157_cbam_exporter_emission_data_pack_calculator.formula.ts" },
  { toolKey: "sc_158_en_1090_ndt_and_inspection_plan_generator_calculator", file: "sc_158_en_1090_ndt_and_inspection_plan_generator_calculator.formula.ts" },
  { toolKey: "sc_159_mill_certificate_en_10204_3_1_verifier_calculator", file: "sc_159_mill_certificate_en_10204_3_1_verifier_calculator.formula.ts" },
  { toolKey: "sc_160_concrete_pour_card_formwork_strip_decision_report_calculator", file: "sc_160_concrete_pour_card_formwork_strip_decision_report_calculator.formula.ts" },
  { toolKey: "sc_161_quote_margin_leak_counter_calculator", file: "sc_161_quote_margin_leak_counter_calculator.formula.ts" },
  { toolKey: "sc_162_facility_bleed_score_calculator", file: "sc_162_facility_bleed_score_calculator.formula.ts" },
  { toolKey: "sc_163_old_machine_bleeding_cash_counter_calculator", file: "sc_163_old_machine_bleeding_cash_counter_calculator.formula.ts" },
  { toolKey: "sc_164_customer_profit_leak_detector_calculator", file: "sc_164_customer_profit_leak_detector_calculator.formula.ts" }
];

// Lazy-loaded module cache
const moduleCache = new Map<string, any>();

export function getProFormulaModuleSync(toolKey: string): any | null {
  if (moduleCache.has(toolKey)) {
    return moduleCache.get(toolKey);
  }
  return null;
}

export function setProFormulaModule(toolKey: string, mod: any): void {
  moduleCache.set(toolKey, mod);
}

export async function loadProFormulaModule(toolKey: string): Promise<{ toolKey: string; formulaVersion: string; calculate: (inputs: Record<string, number>) => any } | null> {
  const cached = getProFormulaModuleSync(toolKey);
  if (cached) return cached;

  const config = PRO_FORMULA_CONFIGS.find(c => c.toolKey === toolKey);
  if (!config) return null;

  try {
    const mod = await import(`./${config.file.replace(".ts", "")}`);
    const module_ = { toolKey: mod.toolKey, formulaVersion: mod.formulaVersion, calculate: mod.calculate };
    setProFormulaModule(toolKey, module_);
    return module_;
  } catch {
    return null;
  }
}

export function listProFormulaToolKeys(): string[] {
  return PRO_FORMULA_CONFIGS.map(c => c.toolKey).sort();
}
