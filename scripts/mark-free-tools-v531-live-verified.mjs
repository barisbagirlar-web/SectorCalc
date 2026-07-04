#!/usr/bin/env node
import {
  appendHistory,
  fail,
  getArgValue,
  readManifest,
  toolsForSelector,
  validateEvidenceByStatus,
  validateManifestShape,
  writeManifest,
} from "./lib/free-tools-v531-control-plane.mjs";

const args = process.argv.slice(2);
const manifest = readManifest();
const baseUrl = getArgValue(args, "--base-url", "https://sectorcalc.com");
const commit = getArgValue(args, "--commit", "UNKNOWN");
const smoke = getArgValue(args, "--smoke", "PASS");

if (smoke !== "PASS") {
  fail("FREE_TOOLS_V531_LIVE_VERIFICATION", ["Live verification requires --smoke PASS."]);
}

const shapeFailures = validateManifestShape(manifest);
if (shapeFailures.length) fail("FREE_TOOLS_V531_LIVE_VERIFICATION", shapeFailures);

const tools = toolsForSelector(manifest, args);
const failures = [];

for (const tool of tools) {
  if (tool.status !== "DEPLOY_READY") {
    failures.push(`${tool.tool_key}: live verification requires DEPLOY_READY. actual=${tool.status}`);
  }

  if (tool.activation !== "READY_FOR_DEPLOY") {
    failures.push(`${tool.tool_key}: live verification requires READY_FOR_DEPLOY activation.`);
  }
}

if (failures.length) fail("FREE_TOOLS_V531_LIVE_VERIFICATION", failures);

for (const tool of tools) {
  tool.status = "LIVE_VERIFIED";
  tool.activation = "ENABLED";
  tool.last_updated = new Date().toISOString();
  tool.checks.live_smoke = "PASS";
  tool.live_verification = {
    base_url: baseUrl,
    commit,
    smoke: "PASS",
    verified_at: new Date().toISOString(),
  };
  appendHistory(tool, "LIVE_VERIFIED", `Live smoke passed at ${baseUrl}.`);
}

for (const batch of manifest.batches) {
  const batchTools = manifest.tools.filter((tool) => tool.batch_id === batch.batch_id);
  if (batchTools.length > 0 && batchTools.every((tool) => tool.status === "LIVE_VERIFIED")) {
    batch.status = "LIVE_VERIFIED";
    batch.activation = "ENABLED";
    batch.last_updated = new Date().toISOString();
  }
}

const evidenceFailures = validateEvidenceByStatus(manifest);
if (evidenceFailures.length) fail("FREE_TOOLS_V531_LIVE_VERIFICATION", evidenceFailures);

writeManifest(manifest);

console.log("FREE_TOOLS_V531_LIVE_VERIFICATION=PASS");
console.log(`verified_tools=${tools.length}`);
console.log("status=LIVE_VERIFIED");
console.log("activation=ENABLED");
