/**
 * Intel Engine — anonim benchmarking katmanı.
 * Ham operasyonel veri dışarı çıkmaz; yalnızca sektör ortalaması güncellenir.
 */

import type { AuditInput } from "@/lib/os/core/audit-engine";
import {
  getSectorEntry,
  listSectorRegistryKeys,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

export interface BenchmarkData {
  sectorId: SectorRegistryKey;
  efficiencyScore: number;
}

export interface AnonymizedBenchmarkRecord {
  sector: SectorRegistryKey;
  score: number;
  timestamp: string;
}

export interface SectorBenchmarkPool {
  sectorId: SectorRegistryKey;
  sampleCount: number;
  meanScore: number;
  updatedAt: string;
}

const SCORE_MIN = 0;
const SCORE_MAX = 100;

/** Sektör havuzu boşken karşılaştırma tabanı (anonim istatistiksel varsayılan). */
export const DEFAULT_INDUSTRY_BENCHMARK = 72;

function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return SCORE_MIN;
  }
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Number(score.toFixed(2))));
}

function isSectorRegistryKey(value: string): value is SectorRegistryKey {
  return (listSectorRegistryKeys() as string[]).includes(value);
}

/** Hedef–gerçekleşen sapmasına göre 0–100 verimlilik skoru. */
export function computeEfficiencyScore(target: number, actual: number): number {
  if (!Number.isFinite(target) || !Number.isFinite(actual)) {
    return SCORE_MIN;
  }

  if (target === 0) {
    return actual === 0 ? SCORE_MAX : SCORE_MIN;
  }

  const variancePct = Math.abs((actual - target) / target) * 100;
  return clampScore(SCORE_MAX - variancePct);
}

export function buildBenchmarkFromAudit(
  sectorId: SectorRegistryKey,
  input: Pick<AuditInput, "target" | "actual">,
): BenchmarkData {
  getSectorEntry(sectorId);

  return {
    sectorId,
    efficiencyScore: computeEfficiencyScore(input.target, input.actual),
  };
}

/** Veriyi anonimleştirir — yalnızca sektör kimliği + skor + zaman damgası. */
export function processBenchmarking(data: BenchmarkData): AnonymizedBenchmarkRecord {
  if (!isSectorRegistryKey(data.sectorId)) {
    throw new Error("Invalid sectorId for benchmarking.");
  }

  return {
    sector: data.sectorId,
    score: clampScore(data.efficiencyScore),
    timestamp: new Date().toISOString(),
  };
}

/** Havuz ortalamasını yeni anonim örnekle günceller (saf fonksiyon). */
export function mergeBenchmarkPool(
  pool: SectorBenchmarkPool | null,
  record: AnonymizedBenchmarkRecord,
): SectorBenchmarkPool {
  const previousCount = pool?.sampleCount ?? 0;
  const previousMean = pool?.meanScore ?? 0;
  const nextCount = previousCount + 1;
  const nextMean =
    previousCount === 0
      ? record.score
      : Number(((previousMean * previousCount + record.score) / nextCount).toFixed(2));

  return {
    sectorId: record.sector,
    sampleCount: nextCount,
    meanScore: nextMean,
    updatedAt: record.timestamp,
  };
}
