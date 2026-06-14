import { describe, expect, it } from "vitest";
import {
  canBridgePremiumSchemaToGenerated,
  listGeneratedPremiumBridgeSlugs,
  resolveGeneratedPremiumBridge,
} from "@/lib/generated-tools/premium-schema-bridge";

describe("premium-schema-bridge", () => {
  it("bridges muda hunter when premium schema and generated calculator both exist", () => {
    const slug = "7-israf-muda-avcisi-parasal-karsilik-calculator";
    expect(canBridgePremiumSchemaToGenerated(slug)).toBe(true);

    const payload = resolveGeneratedPremiumBridge(slug);
    expect(payload).not.toBeNull();
    expect(payload?.slug).toBe(slug);
    expect(payload?.schema.toolName).toContain("muda");
    expect(payload?.diagramSrc).toContain("-diagram.svg");
  });

  it("returns null for unknown slug", () => {
    expect(canBridgePremiumSchemaToGenerated("not-a-real-slug")).toBe(false);
    expect(resolveGeneratedPremiumBridge("not-a-real-slug")).toBeNull();
  });

  it("lists at least one bridged slug", () => {
    expect(listGeneratedPremiumBridgeSlugs().length).toBeGreaterThan(0);
  });
});
