import { describe, expect, test } from "vitest";
import {
  buildCalculatorFunctionGroups,
  FUNCTION_CATEGORY_ORDER,
  FUNCTION_CATEGORY_TOOL_REFS,
  resolveFunctionCategoryToolRef,
} from "@/lib/catalog/calculator-function-categories";

describe("calculator-function-categories", () => {
  test("every configured slug resolves or is skipped at build time", () => {
    const missing: string[] = [];

    for (const categoryId of FUNCTION_CATEGORY_ORDER) {
      for (const ref of FUNCTION_CATEGORY_TOOL_REFS[categoryId]) {
        if (!resolveFunctionCategoryToolRef(ref, "en")) {
          missing.push(`${categoryId}:${ref}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  test("buildCalculatorFunctionGroups returns function groups with items", () => {
    const groups = buildCalculatorFunctionGroups({
      locale: "en",
      resolveGroupCopy: (id) => ({
        label: id,
        description: `${id} description`,
      }),
    });

    expect(groups.length).toBe(FUNCTION_CATEGORY_ORDER.length);
    for (const group of groups) {
      expect(group.items.length).toBeGreaterThan(0);
      expect(group.items.every((item) => item.href.startsWith("/tools/"))).toBe(true);
    }
  });

  test("groups are not sector hub links", () => {
    const groups = buildCalculatorFunctionGroups({
      locale: "en",
      resolveGroupCopy: (id) => ({ label: id, description: "d" }),
    });

    const hrefs = groups.flatMap((g) => g.items.map((i) => i.href));
    expect(hrefs.every((href) => !href.startsWith("/industries/"))).toBe(true);
  });
});
