#!/usr/bin/env node
import {
  fail,
  readManifest,
  stableManifestHash,
  validateEvidenceByStatus,
  validateManifestShape,
} from "./lib/free-tools-v531-control-plane.mjs";

const manifest = readManifest();
const failures = [
  ...validateManifestShape(manifest),
  ...validateEvidenceByStatus(manifest),
];

if (failures.length > 0) {
  fail("FREE_TOOLS_V531_CONTROL_PLANE_GUARD", failures);
}

console.log("FREE_TOOLS_V531_CONTROL_PLANE_GUARD=PASS");
console.log(`tool_count=${manifest.tools.length}`);
console.log(`batch_count=${manifest.batches.length}`);
console.log(`stable_manifest_hash=${stableManifestHash(manifest)}`);
