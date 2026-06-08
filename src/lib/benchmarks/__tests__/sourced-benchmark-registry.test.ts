import { describe, expect, test } from "vitest";
import {
  resolveSourcedBenchmarkMessage,
  SOURCED_BENCHMARK_REGISTRY,
} from "@/lib/benchmarks/sourced-benchmark-registry";
import { isSourcedBenchmarkSourceValid } from "@/lib/benchmarks/sourced-benchmark-source-policy";
import type { SourcedBenchmarkEntry } from "@/lib/benchmarks/sourced-benchmark-types";

describe("sourced benchmark registry", () => {
  test("default registry has no fabricated entries", () => {
    expect(SOURCED_BENCHMARK_REGISTRY).toHaveLength(0);
  });

  test("no-source returns unavailable fallback", () => {
    const result = resolveSourcedBenchmarkMessage("welding", "TR");
    expect(result.kind).toBe("unavailable");
    if (result.kind === "unavailable") {
      expect(result.message).toContain("not available");
    }
  });

  test("source required for publishable benchmark", () => {
    expect(
      isSourcedBenchmarkSourceValid({
        sourceName: "",
        sourceType: "official_statistics",
        year: 2024,
        disclaimer: "",
      }),
    ).toBe(false);

    const valid: Pick<SourcedBenchmarkEntry, "sourceName" | "sourceType" | "year" | "disclaimer"> = {
      sourceName: "Turkish Statistical Institute",
      sourceType: "official_statistics",
      year: 2023,
      disclaimer: "Sample disclaimer for test.",
    };
    expect(isSourcedBenchmarkSourceValid(valid)).toBe(true);
  });
});
