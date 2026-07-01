/* eslint-disable */
// @ts-nocheck

import { describe, expect, test } from "vitest";
import {
  resolveToolMetadataDescription,
  resolveToolTierLabel,
} from "@/lib/infrastructure/metadata/tool-metadata-copy";

describe("tool-metadata-copy", () => {
  test("resolves tier labels for all supported locales", () => {
    expect(resolveToolTierLabel("en", "free")).toBe("Free");
    expect(resolveToolTierLabel("tr", "free")).toBe("Ucretsiz");
    expect(resolveToolTierLabel("de", "free")).toBe("Kostenlos");
    expect(resolveToolTierLabel("fr", "free")).toBe("Gratuit");
    expect(resolveToolTierLabel("es", "free")).toBe("Gratis");
    expect(resolveToolTierLabel("ar", "free")).toBe("مجاني");
  });

  test("builds localized descriptions beyond en/tr", () => {
    const de = resolveToolMetadataDescription("de", "free", "Pipe Thickness", "Manufacturing");
    expect(de).toContain("Kostenlos");
    expect(de).toContain("Manufacturing");

    const ar = resolveToolMetadataDescription("ar", "premium", "Bid Risk", "Construction");
    expect(ar).toContain("Construction");
  });
});
