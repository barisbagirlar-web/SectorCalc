import { assertSourcedBenchmarkPublishable } from "@/lib/features/benchmarks/sourced-benchmark-source-policy";
import {
  SOURCED_BENCHMARK_DISCLAIMER,
  SOURCED_BENCHMARK_UNAVAILABLE_MESSAGE,
  type SourcedBenchmarkEntry,
} from "@/lib/features/benchmarks/sourced-benchmark-types";

/** Registry of sourced benchmarks only — empty by default (no fabricated data). */
export const SOURCED_BENCHMARK_REGISTRY: readonly SourcedBenchmarkEntry[] = [];

export function listPublishableSourcedBenchmarks(): readonly SourcedBenchmarkEntry[] {
  return SOURCED_BENCHMARK_REGISTRY.filter(assertSourcedBenchmarkPublishable);
}

export function getSourcedBenchmarkForSectorCountry(
  sector: string,
  country: string,
): SourcedBenchmarkEntry | undefined {
  return listPublishableSourcedBenchmarks().find(
    (entry) => entry.sector === sector && entry.country === country,
  );
}

export function resolveSourcedBenchmarkMessage(
  sector: string,
  country: string,
):
  | { readonly kind: "available"; readonly entry: SourcedBenchmarkEntry }
  | { readonly kind: "unavailable"; readonly message: string } {
  const entry = getSourcedBenchmarkForSectorCountry(sector, country);
  if (!entry) {
    return { kind: "unavailable", message: SOURCED_BENCHMARK_UNAVAILABLE_MESSAGE };
  }
  return { kind: "available", entry };
}

export { SOURCED_BENCHMARK_DISCLAIMER, SOURCED_BENCHMARK_UNAVAILABLE_MESSAGE };
