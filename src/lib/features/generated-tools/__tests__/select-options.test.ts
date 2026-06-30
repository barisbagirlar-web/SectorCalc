import { describe, expect, it } from "vitest";
import {
  normalizeGeneratedSelectOptions,
  normalizeSelectOptionValue,
  resolveSelectOptionDisplay,
} from "@/lib/features/generated-tools/select-options";
import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";

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
});
