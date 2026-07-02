"use server";

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
  DEFAULT_INDUSTRY_BENCHMARK,
  mergeBenchmarkPool,
  processBenchmarking,
  type BenchmarkData,
  type SectorBenchmarkPool,
} from "@/lib/os/core/intel-engine";

const POOL_COLLECTION = "benchmarkPools";

export type RecordBenchmarkResult =
  | { ok: true; pool: SectorBenchmarkPool; userScore: number; industryAvg: number }
  | { ok: false; error: string };

export type FetchBenchmarkResult =
  | { ok: true; pool: SectorBenchmarkPool | null; industryAvg: number }
  | { ok: false; error: string };

export async function getSectorBenchmarkPool(
  sectorId: BenchmarkData["sectorId"],
): Promise<FetchBenchmarkResult> {
  try {
    const db = getAdminFirestore();
    if (!db) {
      return { ok: false, error: "Benchmark pool unavailable." };
    }

    const snapshot = await db.collection(POOL_COLLECTION).doc(sectorId).get();
    if (!snapshot.exists) {
      return {
        ok: true,
        pool: null,
        industryAvg: DEFAULT_INDUSTRY_BENCHMARK,
      };
    }

    const pool = snapshot.data() as SectorBenchmarkPool;
    return {
      ok: true,
      pool,
      industryAvg: pool.meanScore,
    };
  } catch {
    return { ok: false, error: "Could not load benchmark pool." };
  }
}

/** Anonim skoru Firestore havuzuna yazar - uid veya ham metrik saklanmaz. */
export async function submitAnonymizedBenchmark(
  data: BenchmarkData,
): Promise<RecordBenchmarkResult> {
  try {
    const record = processBenchmarking(data);
    const db = getAdminFirestore();

    if (!db) {
      return { ok: false, error: "Benchmark pool unavailable." };
    }

    const docRef = db.collection(POOL_COLLECTION).doc(record.sector);
    const snapshot = await docRef.get();
    const existing = snapshot.exists
      ? (snapshot.data() as SectorBenchmarkPool)
      : null;
    const industryAvg =
      existing && existing.sampleCount > 0
        ? existing.meanScore
        : DEFAULT_INDUSTRY_BENCHMARK;
    const nextPool = mergeBenchmarkPool(existing, record);

    await docRef.set(nextPool, { merge: true });

    return {
      ok: true,
      pool: nextPool,
      userScore: record.score,
      industryAvg,
    };
  } catch {
    return { ok: false, error: "Could not update benchmark pool." };
  }
}
