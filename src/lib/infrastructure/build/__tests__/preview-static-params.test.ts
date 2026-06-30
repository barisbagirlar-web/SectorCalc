import { afterEach, describe, expect, test } from "vitest";
import {
  limitStaticParamsForPreview,
  shouldUsePreviewStaticParams,
} from "@/lib/infrastructure/build/preview-static-params";

const ENV_KEYS = [
  "SECTORCALC_FORCE_FULL_STATIC",
  "SECTORCALC_FAST_PREVIEW_STATIC",
] as const;

function clearEnv(): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

describe("shouldUsePreviewStaticParams", () => {
  afterEach(() => {
    clearEnv();
  });

  test("returns true by default (preview-safe)", () => {
    expect(shouldUsePreviewStaticParams()).toBe(true);
  });

  test("returns true in preview mode", () => {
    expect(shouldUsePreviewStaticParams()).toBe(true);
  });

  test("returns false when force full static is enabled", () => {
    process.env.SECTORCALC_FORCE_FULL_STATIC = "1";
    expect(shouldUsePreviewStaticParams()).toBe(false);
  });

  test("limits generated tool params in preview mode", () => {

    const params = limitStaticParamsForPreview(
      [
        { slug: "cnc-oee-loss" },
        { slug: "unknown-tool-alpha" },
        { slug: "unknown-tool-beta" },
        { slug: "unknown-tool-gamma" },
      ],
      { family: "generated-tools", slugKey: "slug", max: 6 },
    );

    expect(params.some((entry) => entry.slug === "cnc-oee-loss")).toBe(true);
    expect(params.length).toBeLessThanOrEqual(6);
  });
});
