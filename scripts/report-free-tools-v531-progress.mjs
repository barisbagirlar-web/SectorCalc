#!/usr/bin/env node
import {
  countBy,
  getArgValue,
  hasFlag,
  readManifest,
  STATUS_ORDER,
  stableManifestHash,
} from "./lib/free-tools-v531-control-plane.mjs";

const args = process.argv.slice(2);
const manifest = readManifest();
const jsonMode = hasFlag(args, "--json");
const batchFilter = getArgValue(args, "--batch");

const tools = batchFilter
  ? manifest.tools.filter((tool) => tool.batch_id === batchFilter)
  : manifest.tools;

const statusCounts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
statusCounts.BLOCKED = 0;

for (const tool of tools) {
  statusCounts[tool.status] = (statusCounts[tool.status] || 0) + 1;
}

const batchCounts = Object.fromEntries(countBy(tools, "batch_id"));

const blocked = tools
  .filter((tool) => tool.status === "BLOCKED")
  .map((tool) => ({
    tool_key: tool.tool_key,
    batch_id: tool.batch_id,
    blockers: tool.blockers,
  }));

const nextTools = tools
  .filter((tool) => tool.status === "NOT_STARTED" || tool.status === "AUTHORING_READY")
  .slice(0, 25)
  .map((tool) => tool.tool_key);

const report = {
  result: "FREE_TOOLS_V531_PROGRESS_REPORT",
  tool_count: tools.length,
  total_manifest_tools: manifest.tools.length,
  batch_filter: batchFilter || null,
  status_counts: statusCounts,
  batch_counts: batchCounts,
  blocked_count: blocked.length,
  blocked,
  next_tools: nextTools,
  stable_manifest_hash: stableManifestHash(manifest),
};

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("FREE_TOOLS_V531_PROGRESS_REPORT=OK");
  console.log(`tool_count=${report.tool_count}`);
  console.log(`total_manifest_tools=${report.total_manifest_tools}`);
  console.log(`stable_manifest_hash=${report.stable_manifest_hash}`);
  console.log("");
  console.log("STATUS_COUNTS:");
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`- ${status}: ${count}`);
  }
  console.log("");
  console.log("BATCH_COUNTS:");
  for (const [batchId, count] of Object.entries(batchCounts)) {
    console.log(`- ${batchId}: ${count}`);
  }
  console.log("");
  console.log(`BLOCKED_COUNT=${blocked.length}`);
  if (blocked.length > 0) {
    for (const item of blocked) {
      console.log(`- ${item.tool_key}: ${JSON.stringify(item.blockers)}`);
    }
  }
  console.log("");
  console.log("NEXT_TOOLS:");
  for (const toolKey of nextTools) console.log(`- ${toolKey}`);
}
