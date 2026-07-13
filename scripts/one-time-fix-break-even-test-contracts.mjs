#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

function patch(path, source, target, label) {
  const absolute = resolve(root, path);
  const content = readFileSync(absolute, "utf8");
  const first = content.indexOf(source);
  const last = content.lastIndexOf(source);
  if (first < 0 || first !== last) {
    throw new Error(`${label}: expected exactly one source block in ${path}`);
  }
  writeFileSync(
    absolute,
    content.slice(0, first) + target + content.slice(first + source.length),
    "utf8",
  );
}

patch(
  "tests/pro-v2/form-api-formula-pipeline.test.ts",
  'import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";',
  'import { normalizeInputs, preservePhysicalQuantity } from "@/sectorcalc/pro-form/unit-normalizer";',
  "import canonical-to-display conversion",
);

patch(
  "tests/pro-v2/form-api-formula-pipeline.test.ts",
  `    // Assign display values for each input
    if (iid.includes("discount")) val = 10; // 10% display → 0.10 ratio after normalization`,
  `    // Prefer the schema-owned canonical example/default and convert it to the
    // selected display unit exactly as the production state machine does.
    const typedInput = inp as typeof inp & { example_value?: unknown };
    const explicitValue = typedInput.example_value ?? inp.default_value;
    if (typeof explicitValue === "number" && Number.isFinite(explicitValue)) {
      if (bu && unit && unit !== bu) {
        const converted = preservePhysicalQuantity(
          explicitValue,
          bu,
          unit,
          inp.quantity_kind,
          (schema.unit_conversion_contract?.conversion_registry || {}) as ConversionRegistry,
        );
        val = "newValue" in converted ? converted.newValue : explicitValue;
      } else {
        val = explicitValue;
      }
    } else if (iid.includes("discount")) val = 10; // 10% display → 0.10 ratio after normalization`,
  "schema-owned pipeline test inputs",
);

patch(
  "tests/pro-v2/tool-specific-report-isolation.test.ts",
  `const TOOL_SPECIFIC_SLUGS = [
  "true-employee-cost-statement",`,
  `const TOOL_SPECIFIC_SLUGS = [
  "break-even-survival-cash-calculator",
  "true-employee-cost-statement",`,
  "classify break-even as tool-specific",
);

patch(
  "tests/pro-v2/tool-specific-report-isolation.test.ts",
  `function readContractRegistry(): string {
  const path = resolve(PROJECT_ROOT, "src", "sectorcalc", "pro-report", "pro-report-contract-registry.ts");
  return readFileSync(path, "utf8");
}
`,
  `function readContractRegistry(): string {
  const path = resolve(PROJECT_ROOT, "src", "sectorcalc", "pro-report", "pro-report-contract-registry.ts");
  return readFileSync(path, "utf8");
}

function extractFormulaOutputIds(formula: string): string[] {
  return Array.from(new Set([
    ...Array.from(formula.matchAll(/id:\\s*["'](out_[a-z_]+)["']/g), (match) => match[1]),
    ...Array.from(formula.matchAll(/\\[["'](out_[a-z_]+)["']\\]/g), (match) => match[1]),
    ...Array.from(formula.matchAll(/\\b(out_[a-z_]+)\\s*:/g), (match) => match[1]),
  ]));
}
`,
  "central formula output extraction",
);

patch(
  "tests/pro-v2/tool-specific-report-isolation.test.ts",
  `    // Formula must have output declarations
    // Check that formula has at least some output IDs defined
    const outputCount = (formula!.match(/id:\\s*["']out_[a-z_]+["']/g) || []).length +
      (formula!.match(/\\[["']out_[a-z_]+["']\\]/g) || []).length;
    expect(outputCount).toBeGreaterThan(0);`,
  `    const formulaOutputIds = extractFormulaOutputIds(formula!);
    expect(formulaOutputIds.length).toBeGreaterThan(0);`,
  "formula existence output extraction",
);

patch(
  "tests/pro-v2/tool-specific-report-isolation.test.ts",
  `    // Extract formula output IDs (both \`id: "out_xxx"\` and \`outputs["out_xxx"]\` syntax)
    const formulaOutputIds = [
      ...Array.from(formula!.matchAll(/id:\\s*["'](out_[a-z_]+)["']/g), (m) => m[1]),
      ...Array.from(formula!.matchAll(/\\[["'](out_[a-z_]+)["']\\]/g), (m) => m[1]),
    ];`,
  `    const formulaOutputIds = extractFormulaOutputIds(formula!);`,
  "formula output contract extraction",
);

console.log("BREAK_EVEN_TEST_CONTRACT_PATCH=APPLIED");
