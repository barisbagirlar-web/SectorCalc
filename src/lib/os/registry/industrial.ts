/**
 * Manufacturing OS — industrial module registry.
 * OEE / kayıp / verim odaklı operasyon modülleri; logic + premium report eşlemesi.
 */

export type IndustrialLogicId =
 | "oee_calculate"
 | "fuel_loss_calculate"
 | "margin_calculate";

export type PremiumReportId =
 | "tool_wear_audit"
 | "dead_mileage_audit"
 | "crop_health_audit";

export interface IndustrialModuleEntry {
 params: readonly string[];
 logic: IndustrialLogicId;
 premiumReport: PremiumReportId;
}

export type IndustrialModuleKey =
 | "cnc_tuning"
 | "fleet_optimization"
 | "yield_management";

export const ModuleRegistry: Record<
 IndustrialModuleKey,
 IndustrialModuleEntry
> = {
 // MANUFACTURING: OEE ODAKLI
 cnc_tuning: {
 params: [
 "Ideal_Cycle_Time",
 "Actual_Cycle_Time",
 "Downtime_Minutes",
 "Machine_Rate",
 ],
 logic: "oee_calculate",
 premiumReport: "tool_wear_audit",
 },

 // LOGISTICS: KAYIP ODAKLI
 fleet_optimization: {
 params: [
 "Planned_Route_KM",
 "Actual_Route_KM",
 "Fuel_Consumption",
 "Load_Capacity",
 ],
 logic: "fuel_loss_calculate",
 premiumReport: "dead_mileage_audit",
 },

 // AGRICULTURE: VERİM ODAKLI
 yield_management: {
 params: [
 "Target_Yield_Per_Ha",
 "Actual_Yield",
 "Input_Cost",
 "Market_Price",
 ],
 logic: "margin_calculate",
 premiumReport: "crop_health_audit",
 },
};

export function getIndustrialModule(
 key: IndustrialModuleKey
): IndustrialModuleEntry {
 return ModuleRegistry[key];
}

export function listIndustrialModuleKeys(): IndustrialModuleKey[] {
 return Object.keys(ModuleRegistry) as IndustrialModuleKey[];
}

export function getIndustrialModuleByLogic(
 logic: IndustrialLogicId
): IndustrialModuleKey | null {
 const match = (
 Object.entries(ModuleRegistry) as [
 IndustrialModuleKey,
 IndustrialModuleEntry,
 ][]
 ).find(([, entry]) => entry.logic === logic);

 return match?.[0] ?? null;
}

export function getIndustrialModuleByReport(
 report: PremiumReportId
): IndustrialModuleKey | null {
 const match = (
 Object.entries(ModuleRegistry) as [
 IndustrialModuleKey,
 IndustrialModuleEntry,
 ][]
 ).find(([, entry]) => entry.premiumReport === report);

 return match?.[0] ?? null;
}

/** Modül param anahtarları için tip-güvenli değer haritası. */
export type IndustrialModuleValues<K extends IndustrialModuleKey> = Record<
 (typeof ModuleRegistry)[K]["params"][number],
 number
>;

/** @deprecated Use {@link ModuleRegistry}. */
export const IndustrialRegistry = ModuleRegistry;
