import { describe, expect, it } from "vitest";
import {
  firstSelectOptionValue,
  normalizeGeneratedSelectOptions,
  normalizeSelectOptionValue,
  resolveGeneratedSelectOptions,
  resolveSelectOptionDisplay,
} from "@/lib/generated-tools/select-options";
import type { GeneratedToolInput } from "@/lib/generated-tools/types";

describe("select-options", () => {
  it("normalizes object select options to string values and labels", () => {
    const normalized = normalizeGeneratedSelectOptions([
      { value: "aluminum_6061", label: "Aluminum 6061" },
      "steel_1018",
    ]);

    expect(normalized?.values).toEqual(["aluminum_6061", "steel_1018"]);
    expect(normalized?.labels).toEqual({
      aluminum_6061: "Aluminum 6061",
      steel_1018: "Steel 1018",
    });
  });

  it("resolves display labels from optionLabels map", () => {
    const input = {
      id: "material_type",
      label: "Material",
      type: "select",
      unit: "",
      businessContext: "",
      options: ["aluminum_6061"],
      optionLabels: { aluminum_6061: "Aluminum 6061" },
    } satisfies GeneratedToolInput;

    expect(normalizeSelectOptionValue({ value: "aluminum_6061" })).toBe("aluminum_6061");
    expect(resolveSelectOptionDisplay(input, "aluminum_6061")).toBe("Aluminum 6061");
  });

  it("normalizes numeric object options for render", () => {
    const input = {
      id: "compounding_frequency",
      label: "Compounding Frequency",
      type: "select",
      unit: "",
      businessContext: "",
      options: [{ value: 12, label: "Monthly" }] as unknown as readonly string[],
    } satisfies GeneratedToolInput;

    expect(resolveGeneratedSelectOptions(input)).toEqual([
      { value: "12", label: "Monthly" },
    ]);
    expect(firstSelectOptionValue(input)).toBe("12");
  });

  it("preserves labels when options are already normalized strings", () => {
    const normalized = normalizeGeneratedSelectOptions([
      { value: 1, label: "Annually" },
      { value: 12, label: "Monthly" },
    ]);
    expect(normalized?.labels).toEqual({ "1": "Annually", "12": "Monthly" });
  });
});
