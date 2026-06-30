import { describe, expect, test } from "vitest";
import {
  buildZodSchema,
  describeExpectedInputFormat,
  formatZodValidationErrors,
} from "@/lib/core/validation/calculator-validator-schema";

describe("calculator-validator", () => {
  test("buildZodSchema validates number/select/boolean inputs", () => {
    const validator = buildZodSchema([
      {
        id: "amount",
        label: "Amount",
        type: "number",
        unit: "USD",
        min: 0,
        max: 100,
        default: 10,
      },
      {
        id: "mode",
        label: "Mode",
        type: "select",
        unit: "unitless",
        options: ["fast", "safe"],
        default: "safe",
      },
      {
        id: "enabled",
        label: "Enabled",
        type: "boolean",
        unit: "unitless",
        default: true,
      },
    ]);

    const valid = validator.safeParse({
      amount: "25",
      mode: "fast",
      enabled: "true",
    });
    expect(valid.success).toBe(true);

    const invalid = validator.safeParse({
      amount: -1,
      mode: "invalid",
      enabled: true,
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const errors = formatZodValidationErrors(invalid.error);
      expect(errors.length).toBeGreaterThan(0);
    }
  });

  test("describeExpectedInputFormat documents select options", () => {
    const format = describeExpectedInputFormat([
      {
        id: "confidence_level",
        label: "Confidence Level",
        type: "select",
        unit: "%",
        options: ["90", "95", "99"],
      },
    ]);

    expect(format.confidence_level).toContain("select");
    expect(format.confidence_level).toContain("95");
  });

  test("strict API schema rejects hallucinated field names", () => {
    const validator = buildZodSchema(
      [
        {
          id: "planned_production_time",
          label: "Planned Production Time",
          type: "number",
          unit: "minutes",
          default: 480,
          min: 0,
          max: 1440,
        },
        {
          id: "number_operators",
          label: "Operators",
          type: "number",
          unit: "count",
          default: 20,
        },
      ],
      { strict: true, useDefaults: false },
    );

    const hallucinated = validator.safeParse({
      total_work_content: "metin",
      number_operators: 20,
    });
    expect(hallucinated.success).toBe(false);
  });

  test("strict API schema rejects invalid numeric strings on known fields", () => {
    const validator = buildZodSchema(
      [
        {
          id: "planned_production_time",
          label: "Planned Production Time",
          type: "number",
          unit: "minutes",
        },
      ],
      { strict: true, useDefaults: false },
    );

    const invalid = validator.safeParse({
      planned_production_time: "metin",
    });
    expect(invalid.success).toBe(false);
  });
});
