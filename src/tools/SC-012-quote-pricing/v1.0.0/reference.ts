/**
 * SC-012 reference data. Sector scrap benchmarks are estimates for v1.0.0.
 * Rates are Decimal-safe strings. Cross-tool feeding (SC-010/SC-011) is NOT
 * wired — labor/machine hourly costs are explicit inputs (see ASSUMPTIONS).
 */
export interface SectorBenchmarks {
  typicalScrapRate: string;
  note: string;
}

export const SECTORS: Record<string, SectorBenchmarks> = {
  steel_cutting: { typicalScrapRate: '0.10', note: 'Plate/profile cutting ~5-15% scrap depending on nesting.' },
  cnc_machining: { typicalScrapRate: '0.05', note: 'Chip/swarf ~3-8%; defective parts add more.' },
  welding_fab: { typicalScrapRate: '0.07', note: 'Offcuts + rework ~5-10%.' },
  sheet_metal: { typicalScrapRate: '0.12', note: 'Skeleton waste high without nesting optimization.' }
};

export const HIGH_SCRAP_THRESHOLD = '0.10';
export const LONG_PAYMENT_DAYS = 60;
export const THIN_MARGIN_THRESHOLD = '0.05';
