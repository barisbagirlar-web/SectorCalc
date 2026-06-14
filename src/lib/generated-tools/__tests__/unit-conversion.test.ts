import { describe, expect, it } from "vitest";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
  inferGeneratedInputUnitGroup,
  shouldShowGeneratedUnitSelector,
} from "@/lib/generated-tools/unit-conversion";
import type { GeneratedToolInput } from "@/lib/generated-tools/types";

const lengthInput: GeneratedToolInput = {
  id: "length",
  label: "Length",
  type: "number",
  unit: "m",
  businessContext: "Length",
};

const percentInput: GeneratedToolInput = {
  id: "wasteFactor",
  label: "Waste Factor",
  type: "number",
  unit: "%",
  businessContext: "Waste",
};

describe("generated-tools unit conversion", () => {
  it("infers length group from field id and schema unit", () => {
    expect(inferGeneratedInputUnitGroup(lengthInput)).toBe("length");
    expect(shouldShowGeneratedUnitSelector(lengthInput)).toBe(true);
  });

  it("skips percentage and currency-like units", () => {
    expect(shouldShowGeneratedUnitSelector(percentInput)).toBe(false);
    expect(
      shouldShowGeneratedUnitSelector({
        ...lengthInput,
        id: "unitCost",
        unit: "USD/m3",
      }),
    ).toBe(false);
  });

  it("uses locale-based default units", () => {
    const defaults = buildInitialSelectedUnits([lengthInput], "en");
    expect(defaults.length).toBe("cm");

    const trDefaults = buildInitialSelectedUnits([lengthInput], "tr");
    expect(trDefaults.length).toBe("cm");
  });

  it("converts selected units to schema units before calculation", () => {
    const converted = convertGeneratedFormValues(
      [lengthInput],
      { length: 10 },
      { length: "ft" },
    );
    expect(converted.length).toBeCloseTo(3.048, 3);
  });
});
