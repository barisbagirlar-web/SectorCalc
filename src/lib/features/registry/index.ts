export {
 getSectorConfig,
 getSectorConfigByShortId,
 listSectorRegistryKeys,
 SectorRegistry,
 TEXTILE_WASTE_SECTOR_CONFIG,
 type MetricUnit,
 type SectorConfig,
 type SectorRegistryKey,
 type VarianceType,
} from "@/lib/features/registry/sector-registry";

export {
 runSectorDiagnostic,
 defaultToleranceForVarianceType,
 type SectorMetricValues,
} from "@/lib/features/registry/sector-diagnostic";
