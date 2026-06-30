/**
 * Phase 5H-G-C — pilot UI bridge manifest tests.
 */

import { describe, expect, test } from "vitest";
import {
  buildPilotUiBridgeManifests,
  PILOT_UI_BRIDGE_SLUGS,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";

describe("pilot UI bridge manifest", () => {
  test("builds 3 pilot manifests", () => {
    const manifests = buildPilotUiBridgeManifests({ slugs: PILOT_UI_BRIDGE_SLUGS });

    expect(manifests).toHaveLength(10);
    expect(manifests.map((manifest) => manifest.slug)).toEqual([...PILOT_UI_BRIDGE_SLUGS]);
  });

  test("all pilot manifests are ui_bridge_ready with populated props", () => {
    const manifests = buildPilotUiBridgeManifests({ slugs: PILOT_UI_BRIDGE_SLUGS });

    for (const manifest of manifests) {
      expect(manifest.status).toBe("ui_bridge_ready");
      expect(manifest.sections.length).toBeGreaterThan(0);
      expect(manifest.fields.length).toBeGreaterThan(0);
      expect(manifest.trustTrace.enabled).toBe(true);
      expect(Object.keys(manifest.componentKinds).length).toBeGreaterThan(0);
    }
  });
});
