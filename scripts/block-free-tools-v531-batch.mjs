#!/usr/bin/env node
import {
  appendHistory,
  fail,
  getArgValue,
  readManifest,
  toolsForSelector,
  validateManifestShape,
  writeManifest,
} from "./lib/free-tools-v531-control-plane.mjs";

const args = process.argv.slice(2);
const manifest = readManifest();
const reason = getArgValue(args, "--reason");

if (!reason) {
  fail("FREE_TOOLS_V531_BATCH_BLOCK", ["Missing required --reason."]);
}

const shapeFailures = validateManifestShape(manifest);
if (shapeFailures.length) fail("FREE_TOOLS_V531_BATCH_BLOCK", shapeFailures);

const tools = toolsForSelector(manifest, args);

for (const tool of tools) {
  tool.status = "BLOCKED";
  tool.activation = "DISABLED";
  tool.last_updated = new Date().toISOString();
  if (!Array.isArray(tool.blockers)) tool.blockers = [];
  tool.blockers.push({
    reason,
    created_at: new Date().toISOString(),
  });
  appendHistory(tool, "BLOCKED", reason);
}

for (const batch of manifest.batches) {
  const batchTools = manifest.tools.filter((tool) => tool.batch_id === batch.batch_id);
  if (batchTools.some((tool) => tool.status === "BLOCKED")) {
    batch.status = "BLOCKED";
    batch.activation = "DISABLED";
    batch.last_updated = new Date().toISOString();
    if (!Array.isArray(batch.blockers)) batch.blockers = [];
    batch.blockers.push({
      reason,
      created_at: new Date().toISOString(),
    });
  }
}

writeManifest(manifest);

console.log("FREE_TOOLS_V531_BATCH_BLOCK=PASS");
console.log(`blocked_tools=${tools.length}`);
console.log(`reason=${reason}`);
