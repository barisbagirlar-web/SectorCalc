import { describe, expect, it } from "vitest";
import {
  detectUnitSystemFromCountry,
  resolveUnitSystemPreference,
} from "@/config/measurement";

describe("measurement config", () => {
  it("detects imperial for US and UK", () => {
    expect(detectUnitSystemFromCountry("US")).toBe("imperial");
    expect(detectUnitSystemFromCountry("GB")).toBe("imperial");
    expect(detectUnitSystemFromCountry("UK")).toBe("imperial");
  });

  it("defaults to metric for other countries", () => {
    expect(detectUnitSystemFromCountry("TR")).toBe("metric");
    expect(detectUnitSystemFromCountry("DE")).toBe("metric");
    expect(detectUnitSystemFromCountry(null)).toBe("metric");
  });

  it("prefers manual override over geo detection", () => {
    expect(
      resolveUnitSystemPreference({
        manual: "metric",
        country: "US",
      }),
    ).toBe("metric");
  });

  it("uses geo when no manual override exists", () => {
    expect(
      resolveUnitSystemPreference({
        country: "US",
      }),
    ).toBe("imperial");
  });
});
