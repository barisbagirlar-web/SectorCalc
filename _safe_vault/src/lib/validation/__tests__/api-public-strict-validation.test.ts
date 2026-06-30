import { describe, expect, test } from "vitest";
import {
  findUnknownInputKeys,
  getApiValidatorForTool,
  getToolValidationSchema,
} from "@/lib/validation/calculator-validator";

describe("api-public strict validation (oee-downtime-calculator)", () => {
  const slug = "oee-downtime-calculator";

  test("rejects hallucinated field names", () => {
    const schema = getToolValidationSchema(slug);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const hallucinated = {
      total_work_content: "metin",
      number_operators: 20,
    };

    const unknownKeys = findUnknownInputKeys(
      hallucinated,
      schema.inputs.map((input) => input.id),
    );
    expect(unknownKeys).toContain("total_work_content");
    expect(unknownKeys).toContain("number_operators");
  });

  test("rejects empty inputs without schema defaults", () => {
    const validator = getApiValidatorForTool(slug);
    expect(validator).not.toBeNull();
    if (!validator) {
      return;
    }

    const result = validator.safeParse({});
    expect(result.success).toBe(false);
  });

  test("accepts valid OEE payload", () => {
    const validator = getApiValidatorForTool(slug);
    expect(validator).not.toBeNull();
    if (!validator) {
      return;
    }

    const result = validator.safeParse({
      planned_production_time: 480,
      downtime_minutes: 60,
      ideal_cycle_time: 0.5,
      total_parts_produced: 800,
      defective_parts: 20,
      shift_type: "day",
      include_micro_stops: true,
    });
    expect(result.success).toBe(true);
  });
});
