/**
 * Server-safe smart form pilot manifest resolver — Phase 5H-G-D.
 */

import { shouldUseSmartFormPilot } from "@/lib/feature-flags/smart-form-pilot";
import { buildPilotUiBridgeManifestForSlug } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export function resolveSmartFormPilotManifestForRoute(
  slug: string,
): SmartFormUiBridgeManifest | null {
  if (!shouldUseSmartFormPilot(slug)) {
    return null;
  }

  try {
    const manifest = buildPilotUiBridgeManifestForSlug(slug, "free_quick_check");
    if (!manifest || manifest.status !== "ui_bridge_ready") {
      return null;
    }
    return manifest;
  } catch {
    return null;
  }
}
