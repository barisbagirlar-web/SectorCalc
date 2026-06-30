import { describe, expect, it } from "vitest";
import {
  isKnownWasteTypeKey,
  normalizeWasteTypeKey,
  resolveBreakdownColor,
} from "@/lib/chart-helpers";
import { buildBreakdownChartData, buildBreakdownChartGroups } from "@/lib/chart-helpers/breakdown-chart-data";
import { resolveRelatedInputsForBreakdownKey } from "@/lib/chart-helpers/resolve-waste-related-inputs";

describe("chart helpers", () => {
  it("normalizes seven muda cost keys", () => {
    expect(normalizeWasteTypeKey("waitingCost")).toBe("waiting");
    expect(normalizeWasteTypeKey("transportation")).toBe("transport");
    expect(normalizeWasteTypeKey("defectCost")).toBe("defects");
  });

  it("assigns stable colors to waste types", () => {
    expect(resolveBreakdownColor("waitingCost")).toBe("#f97316");
    expect(resolveBreakdownColor("unknownMetric")).toBe("#6b7280");
    expect(isKnownWasteTypeKey("inventoryCost")).toBe(true);
  });

  it("builds chart data with percentages and colors", () => {
    const data = buildBreakdownChartData(
      { waitingCost: 200, overproductionCost: 800 },
      "en-US",
      "TRY",
      (key) => key,
    );

    expect(data).toHaveLength(2);
    const overproduction = data.find((item) => item.key === "overproductionCost");
    expect(overproduction?.percent).toBe("80.0");
    expect(overproduction?.color).toBe("#ef4444");
  });

  it("omits zero and non-finite breakdown values", () => {
    const data = buildBreakdownChartData(
      { waitingCost: 0, overproductionCost: 800, invalid: Number.NaN },
      "en-US",
      "TRY",
      (key) => key,
    );

    expect(data).toHaveLength(1);
    expect(data[0]?.key).toBe("overproductionCost");
  });

  it("returns empty groups when breakdown has no positive finite values", () => {
    const groups = buildBreakdownChartGroups(
      { waitingCost: 0, invalid: Number.NaN },
      "en-US",
      "TRY",
      (key) => key,
    );
    expect(groups).toHaveLength(0);
  });

  it("resolves related inputs for a waste breakdown key", () => {
    const inputs = [
      {
        id: "waitingHours",
        label: "Waiting hours",
        type: "number" as const,
        unit: "h",
        businessContext: "test",
      },
      {
        id: "productionUnits",
        label: "Units",
        type: "number" as const,
        unit: "unit",
        businessContext: "test",
      },
    ];

    const related = resolveRelatedInputsForBreakdownKey(
      "waitingCost",
      inputs,
      { waitingHours: 12, productionUnits: 500 },
      (input) => input.label,
    );

    expect(related).toHaveLength(1);
    expect(related[0]?.id).toBe("waitingHours");
  });
});
