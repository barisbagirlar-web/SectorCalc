import { describe, expect, it } from "vitest";
import {
  formatGeneratedNumericValue,
  shouldFormatGeneratedValueAsPercent,
} from "@/lib/generated-tools/format-generated-numeric";

describe("formatGeneratedNumericValue", () => {
  it("formats machining cycle time as minutes, not percent", () => {
    expect(formatGeneratedNumericValue(0.84, "cutting_time", "en")).toBe("0.84 min");
    expect(shouldFormatGeneratedValueAsPercent("cutting_time", 0.84)).toBe(false);
  });

  it("formats spindle speed with rpm suffix", () => {
    expect(formatGeneratedNumericValue(954.93, "spindle_speed", "en")).toBe("954.93 rpm");
  });

  it("formats tool change frequency as a plain number", () => {
    expect(formatGeneratedNumericValue(0.028, "tool_change_frequency", "en")).toBe("0.03");
    expect(shouldFormatGeneratedValueAsPercent("tool_change_frequency", 0.028)).toBe(false);
  });

  it("still formats ratio-like keys between 0 and 1 as percent", () => {
    expect(formatGeneratedNumericValue(0.85, "oee_availability", "en")).toBe("85%");
  });
});
