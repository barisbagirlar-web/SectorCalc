import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { SuperV4Schema } from "../contract-types";
import {
  buildExecutePayload,
  getFormToSchemaMap,
} from "../pro-execute-payload-adapter";
import {
  createInitialUniversalFormState,
  universalFormMachineReducer,
} from "../form-state-machine";

function loadSchema(): SuperV4Schema {
  const schemaPath = path.join(
    process.cwd(),
    "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
  );
  return JSON.parse(readFileSync(schemaPath, "utf8")) as SuperV4Schema;
}

describe("break-even form to API payload contract", () => {
  it("sends only schema raw input ids and preserves percent display units", () => {
    const schema = loadSchema();
    const initialized = universalFormMachineReducer(
      createInitialUniversalFormState("engineering"),
      { type: "INIT_SCHEMA", schema },
    );
    const formToSchemaMap = getFormToSchemaMap(schema.tool_key);

    expect(formToSchemaMap).not.toBeNull();
    const payload = buildExecutePayload({
      formState: initialized.rawInputState,
      selectedUnits: initialized.selectedUnitState,
      toolKey: schema.tool_key,
      toolId: schema.tool_id,
      schemaVersion: schema.metadata.schema_version,
      usageSessionId: "test-session",
      formToSchemaMap: formToSchemaMap!,
      displayCurrency: "EUR",
      userProfileMode: "engineering",
    });

    const schemaInputIds = schema.inputs.map((input) => input.id).sort();
    expect(Object.keys(payload.raw_inputs).sort()).toEqual(schemaInputIds);
    expect(payload.raw_inputs.contribution_margin_ratio).toBe(42);
    expect(payload.raw_inputs.downside_revenue_factor).toBe(70);
    expect(payload.raw_inputs.source_confidence_ratio).toBe(90);
    expect(payload.selected_units.contribution_margin_ratio).toBe("percent");
    expect(payload.selected_units.downside_revenue_factor).toBe("percent");
    expect(payload.selected_units.source_confidence_ratio).toBe("percent");
    expect(payload.display_currency).toBe("EUR");
    expect(payload.raw_inputs).not.toHaveProperty("initial_investment");
    expect(payload.raw_inputs).not.toHaveProperty("n_initial_investment");
  });
});
