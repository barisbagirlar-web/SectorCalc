import {
  SOURCED_BENCHMARK_DISCLAIMER,
  type SourcedBenchmarkEntry,
  type SourcedBenchmarkSourceType,
} from "@/lib/features/benchmarks/sourced-benchmark-types";

export function isSourcedBenchmarkSourceValid(entry: Pick<
  SourcedBenchmarkEntry,
  "sourceName" | "sourceType" | "year" | "disclaimer"
>): boolean {
  if (!entry.sourceName.trim() || !entry.disclaimer.trim()) {
    return false;
  }
  if (!Number.isFinite(entry.year) || entry.year < 1990) {
    return false;
  }
  const allowed: readonly SourcedBenchmarkSourceType[] = [
    "official_statistics",
    "chamber_report",
    "academic_paper",
    "internal_anonymized_aggregate",
    "user_verified_dataset",
  ];
  return allowed.includes(entry.sourceType);
}

export function assertSourcedBenchmarkPublishable(entry: SourcedBenchmarkEntry): boolean {
  return isSourcedBenchmarkSourceValid(entry) && entry.sourceName.length >= 3;
}

export { SOURCED_BENCHMARK_DISCLAIMER };
