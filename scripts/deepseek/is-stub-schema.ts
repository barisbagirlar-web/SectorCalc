import fs from "node:fs";

const STUB_FORMULA_MARKERS = [
  "primary_value * (1 + secondary_value / 100) / tertiary_value",
  "secondary_value / tertiary_value",
  "value * 1",
] as const;

const STUB_INPUT_IDS = new Set(["primary_value", "secondary_value", "tertiary_value", "value"]);

export function isStubSchemaContent(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") {
    return true;
  }
  const record = raw as Record<string, unknown>;
  const formulas = record.formulas;
  if (!formulas || typeof formulas !== "object") {
    return true;
  }
  const joined = Object.values(formulas as Record<string, string>).join(" ");
  if (STUB_FORMULA_MARKERS.some((marker) => joined.includes(marker))) {
    return true;
  }
  const inputs = record.inputs;
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return true;
  }
  const ids = inputs
    .map((input) => (input && typeof input === "object" ? String((input as { id?: string }).id ?? "") : ""))
    .filter(Boolean);
  if (ids.length <= 3 && ids.every((id) => STUB_INPUT_IDS.has(id))) {
    return true;
  }
  return false;
}

export function isStubSchemaFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return true;
  }
  try {
    return isStubSchemaContent(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  } catch {
    return true;
  }
}
