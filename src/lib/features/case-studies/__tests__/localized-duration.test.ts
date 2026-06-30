import { describe, expect, it } from "vitest";
import { getLocalizedDuration } from "@/lib/features/case-studies/academic-format";

describe("getLocalizedDuration", () => {
  it("returns localized duration for known keys", () => {
    expect(getLocalizedDuration("5 months", "tr")).toBe("5 ay");
    expect(getLocalizedDuration("5 months", "en")).toBe("5 months");
    expect(getLocalizedDuration("5 months", "de")).toBe("5 Monate");
    expect(getLocalizedDuration("5 months", "fr")).toBe("5 mois");
    expect(getLocalizedDuration("5 months", "es")).toBe("5 meses");
    expect(getLocalizedDuration("5 months", "ar")).toBe("٥ أشهر");
  });

  it("falls back to the original key when unknown", () => {
    expect(getLocalizedDuration("12 months", "tr")).toBe("12 months");
  });
});
