/**
 * Pilot smart form manifest loader — Phase 5H-G-D/G (tests and server resolver).
 */

import { resolvePilotGovernanceSlugFromRoute } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { buildPilotUiBridgeManifestForSlug } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import { PILOT_UI_BRIDGE_SLUGS } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export function getPilotSmartFormManifest(slug: string): SmartFormUiBridgeManifest | null {
  const governanceSlug = resolvePilotGovernanceSlugFromRoute(slug) ?? slug;
  if (!PILOT_UI_BRIDGE_SLUGS.includes(governanceSlug as (typeof PILOT_UI_BRIDGE_SLUGS)[number])) {
    return null;
  }

  try {
    const manifest = buildPilotUiBridgeManifestForSlug(governanceSlug, "free_quick_check");
    if (!manifest || manifest.status !== "ui_bridge_ready") {
      return null;
    }
    return manifest;
  } catch {
    return null;
  }
}
