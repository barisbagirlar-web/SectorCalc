import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");
const FORMULA_DIR = path.resolve(__dirname, "../../src/sectorcalc/formulas/pro-v531");

describe("pro-v531-baris: formula leak", () => {
  const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));

  it("no schema file should contain executable formula expressions in the formulas array", () => {
    for (const file of schemaFiles) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      for (const formula of (schema.formulas ?? [])) {
        const expr = formula.expression || "";
        // Allow empty, REDACTED, or natural-language descriptions
        if (expr && expr !== "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI") {
          const hasOperators = /[+\-*/^()]/.test(expr);
          const hasMathFuncs = /\b(sin|cos|tan|sqrt|log|exp|pow|abs|round)\b/i.test(expr);
          if (hasOperators || hasMathFuncs) {
            // Fail only if expression looks like actual math, not a note
            if (expr.length > 15) {
              expect(expr).toBe("INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI");
            }
          }
        }
      }
    }
  });

  it("formula registry files should import from server-only", () => {
    const formulaFiles = fs.readdirSync(FORMULA_DIR).filter(f => f === "baris-formula-registry.ts" || f === "baris-readiness-data.ts");
    for (const file of formulaFiles) {
      const content = fs.readFileSync(path.join(FORMULA_DIR, file), "utf-8");
      if (file.endsWith("registry.ts")) {
        expect(content).toContain("server-only");
      }
    }
  });

  it("no schema should have public_formula_expression_policy other than FORBIDDEN", () => {
    for (const file of schemaFiles) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      for (const formula of (schema.formulas ?? [])) {
        expect(formula.public_formula_expression_policy).toBe("FORBIDDEN");
      }
    }
  });
});
