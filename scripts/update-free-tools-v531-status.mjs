#!/usr/bin/env node
import {
  ALLOWED_STATUSES,
  appendHistory,
  fail,
  getArgValue,
  getArgValues,
  hasFlag,
  readManifest,
  STATUS_ORDER,
  toolsForSelector,
  validateEvidenceByStatus,
  validateManifestShape,
  writeManifest,
} from "./lib/free-tools-v531-control-plane.mjs";

const args = process.argv.slice(2);
const manifest = readManifest();
const status = getArgValue(args, "--status");
const note = getArgValue(args, "--note", "");
const setGatePass = hasFlag(args, "--gate-pass");

const failures = validateManifestShape(manifest);
if (failures.length) fail("FREE_TOOLS_V531_STATUS_UPDATE", failures);

if (!status || !ALLOWED_STATUSES.has(status)) {
  fail("FREE_TOOLS_V531_STATUS_UPDATE", [`Invalid or missing --status. Allowed: ${Array.from(ALLOWED_STATUSES).join(", ")}`]);
}

const tools = toolsForSelector(manifest, args);

for (const tool of tools) {
  tool.status = status;
  tool.last_updated = new Date().toISOString();

  if (status === "BLOCKED") {
    tool.activation = "DISABLED";
    const blocker = getArgValue(args, "--blocker", note || "Blocked without detailed reason.");
    if (!Array.isArray(tool.blockers)) tool.blockers = [];
    tool.blockers.push({
      reason: blocker,
      created_at: new Date().toISOString(),
    });
  }

  if (setGatePass) {
    tool.last_gate_result = "PASS";
    tool.checks.local_gates = "PASS";
  }

  if (STATUS_ORDER.includes(status) && status !== "DEPLOY_READY" && status !== "LIVE_VERIFIED") {
    tool.activation = "DISABLED";
  }

  appendHistory(tool, status, note);
}

const evidenceFailures = validateEvidenceByStatus(manifest);
if (evidenceFailures.length) fail("FREE_TOOLS_V531_STATUS_UPDATE", evidenceFailures);

writeManifest(manifest);

console.log("FREE_TOOLS_V531_STATUS_UPDATE=PASS");
console.log(`updated_tools=${tools.length}`);
console.log(`status=${status}`);
