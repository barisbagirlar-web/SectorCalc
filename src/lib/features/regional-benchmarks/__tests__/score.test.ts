import { describe, expect, it } from "vitest";
import { getBenchmarkBand, scoreAgainstBenchmark } from "@/lib/features/regional-benchmarks/score";

describe("getBenchmarkBand", () => {
  it("returns a global band for a known metric", () => {
    const band = getBenchmarkBand({ metric: "gross_margin", region: "global" });
    expect(band).not.toBeNull();
    expect(band?.low).toBe(20);
    expect(band?.high).toBe(50);
    expect(band?.direction).toBe("higher");
    expect(band?.confidence).toBe("low");
  });

  it("applies regional overrides", () => {
    const global = getBenchmarkBand({ metric: "energy_intensity", region: "global" });
    const tr = getBenchmarkBand({ metric: "energy_intensity", region: "tr" });
    expect(tr?.high).toBe(16);
    expect(global?.high).toBe(12);
  });

  it("carries industry through", () => {
    const band = getBenchmarkBand({ metric: "net_margin", region: "eu", industry: "cnc" });
    expect(band?.industry).toBe("cnc");
    expect(band?.region).toBe("eu");
  });
});

describe("scoreAgainstBenchmark", () => {
  it("flags below-range as risk for higher-is-better metrics", () => {
    const verdict = scoreAgainstBenchmark({ metric: "gross_margin", region: "global", value: 12 });
    expect(verdict.position).toBe("below_range");
    expect(verdict.severity).toBe("risk");
  });

  it("flags above-range as good for higher-is-better metrics", () => {
    const verdict = scoreAgainstBenchmark({ metric: "gross_margin", region: "global", value: 60 });
    expect(verdict.position).toBe("above_range");
    expect(verdict.severity).toBe("good");
  });

  it("flags below-range as good for lower-is-better metrics", () => {
    const verdict = scoreAgainstBenchmark({ metric: "scrap_rate", region: "global", value: 0.5 });
    expect(verdict.position).toBe("below_range");
    expect(verdict.severity).toBe("good");
  });

  it("flags above-range as risk for lower-is-better metrics", () => {
    const verdict = scoreAgainstBenchmark({ metric: "scrap_rate", region: "global", value: 12 });
    expect(verdict.position).toBe("above_range");
    expect(verdict.severity).toBe("risk");
  });

  it("marks within-range as watch", () => {
    const verdict = scoreAgainstBenchmark({ metric: "net_margin", region: "global", value: 9 });
    expect(verdict.position).toBe("within_range");
    expect(verdict.severity).toBe("watch");
  });

  it("returns unknown for non-finite values", () => {
    const verdict = scoreAgainstBenchmark({ metric: "net_margin", region: "global", value: Number.NaN });
    expect(verdict.position).toBe("unknown");
    expect(verdict.severity).toBe("unknown");
  });

  it("includes an explanation and source note", () => {
    const verdict = scoreAgainstBenchmark({ metric: "quote_risk", region: "global", value: 80 });
    expect(verdict.explanation).toContain("reference range");
    expect(verdict.sourceNote.length).toBeGreaterThan(0);
  });
});
