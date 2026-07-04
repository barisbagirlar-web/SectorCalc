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
const note = getArgValue(args, "--note", "Activated for deploy after local gates passed.");

const shapeFailures = validateManifestShape(manifest);
if (shapeFailures.length) fail("FREE_TOOLS_V531_BATCH_ACTIVATION", shapeFailures);

const tools = toolsForSelector(manifest, args);
const failures = [];

for (const tool of tools) {
  if (tool.status !== "LOCAL_GATES_PASS") {
    failures.push(`${tool.tool_key}: activation requires status LOCAL_GATES_PASS. actual=${tool.status}`);
  }

  if (tool.last_gate_result !== "PASS") {
    failures.push(`${tool.tool_key}: activation requires last_gate_result=PASS.`);
  }
}

if (failures.length) fail("FREE_TOOLS_V531_BATCH_ACTIVATION", failures);

for (const tool of tools) {
  tool.status = "DEPLOY_READY";
  tool.activation = "READY_FOR_DEPLOY";
  tool.last_updated = new Date().toISOString();
  tool.checks.local_gates = "PASS";
  appendHistory(tool, "DEPLOY_READY", note);
}

for (const batch of manifest.batches) {
  const batchTools = manifest.tools.filter((tool) => tool.batch_id === batch.batch_id);
  if (batchTools.length > 0 && batchTools.every((tool) => tool.status === "DEPLOY_READY" || tool.status === "LIVE_VERIFIED")) {
    batch.status = "DEPLOY_READY";
    batch.activation = "READY_FOR_DEPLOY";
    batch.last_updated = new Date().toISOString();
  }
}

const evidenceFailures = validateEvidenceByStatus(manifest);
if (evidenceFailures.length) fail("FREE_TOOLS_V531_BATCH_ACTIVATION", evidenceFailures);

writeManifest(manifest);

console.log("FREE_TOOLS_V531_BATCH_ACTIVATION=PASS");
console.log(`activated_tools=${tools.length}`);
console.log("activation=READY_FOR_DEPLOY");
console.log("status=DEPLOY_READY");
