import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even derating contract", () => {
  it("declares no partial derating rules", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      derating_contract: { rules?: unknown[] };
    };

    expect(schema.derating_contract).toEqual({ rules: [] });
    expect(JSON.stringify(schema)).not.toContain("D001");
    expect(JSON.stringify(schema)).not.toContain("D002");
  });
});
