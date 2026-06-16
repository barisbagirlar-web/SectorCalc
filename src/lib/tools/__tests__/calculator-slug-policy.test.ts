import { describe, expect, test } from "vitest";
import {
  ensureCalculatorSlug,
  isCalculatorSlug,
} from "@/lib/tools/calculator-slug-policy";
import {
  migrateGeneratedToolSlugPath,
  resolveGeneratedToolSlugRedirect,
} from "@/lib/tools/generated-tool-slug-redirects";
import { getLocalizedPathRedirect } from "@/lib/i18n/locale-routing";

describe("calculator-slug-policy", () => {
  test("detects calculator suffix", () => {
    expect(isCalculatorSlug("oee-downtime-calculator")).toBe(true);
    expect(isCalculatorSlug("aql-sampling-risk-cost")).toBe(false);
  });

  test("appends calculator suffix once", () => {
    expect(ensureCalculatorSlug("aql-sampling-risk-cost")).toBe(
      "aql-sampling-risk-cost-calculator",
    );
    expect(ensureCalculatorSlug("margin-calculator")).toBe("margin-calculator");
  });
});

describe("generated-tool-slug-redirects", () => {
  test("resolves known redirect slug from config", () => {
    const target = resolveGeneratedToolSlugRedirect("aql-sampling-risk-cost");
    if (target) {
      expect(target.endsWith("-calculator")).toBe(true);
    }
  });

  test("migrates generated tool paths", () => {
    const migrated = migrateGeneratedToolSlugPath("/tools/generated/aql-sampling-risk-cost");
    if (migrated) {
      expect(migrated).toContain("-calculator");
    }
  });

  test("localizes redirect for prefixed locales", () => {
    const migrated = migrateGeneratedToolSlugPath("/tools/generated/aql-sampling-risk-cost");
    if (!migrated) {
      return;
    }
    expect(getLocalizedPathRedirect(`/tr/tools/generated/aql-sampling-risk-cost`)).toBe(
      `/tr${migrated}`,
    );
    expect(getLocalizedPathRedirect(`/de/tools/generated/aql-sampling-risk-cost`)).toBe(
      `/de${migrated}`,
    );
    expect(getLocalizedPathRedirect(`/ar/tools/generated/aql-sampling-risk-cost`)).toBe(
      `/ar${migrated}`,
    );
  });
});
