/**
 * Server-safe smart form pilot manifest resolver — Phase 5H-G-D/G.
 */

import { resolveSmartFormPilotGovernanceSlug } from "@/lib/infrastructure/feature-flags/smart-form-pilot";
import { buildPilotUiBridgeManifestForSlug } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import type { SmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export function resolveSmartFormPilotManifestForRoute(
  routeSlug: string,
): SmartFormUiBridgeManifest | null {
  const governanceSlug = resolveSmartFormPilotGovernanceSlug(routeSlug);
  if (!governanceSlug) {
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
