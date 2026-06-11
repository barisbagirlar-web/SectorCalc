#!/usr/bin/env node
/**
 * Smoke: P10 controlled AI assistant.
 * Usage: node scripts/smoke-ai-assistant.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const API_KEY_PATTERNS = [
  /sk-[A-Za-z0-9]{16,}/,
  /OPENAI_API_KEY/,
  /ANTHROPIC_API_KEY/,
  /BREVO/,
  /STRIPE_SECRET/,
];

function hasApiKeyLeak(body) {
  return API_KEY_PATTERNS.some((pattern) => pattern.test(body));
}

async function auditPage(label, path) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const checks = {
    status200: result.status === 200,
    assistant: body.includes('data-sectorcalc-assistant="true"'),
    launcher: body.includes('data-assistant-launcher="true"'),
    panel: body.includes('data-assistant-panel="true"'),
    noKeyLeak: !hasApiKeyLeak(body),
    noFatal: fatals.length === 0,
  };
  const ok = Object.values(checks).every(Boolean);
  return { label, path, status: result.status, checks, ok };
}

async function postAssistant(payload) {
  const url = `${getBaseUrl()}/api/assistant`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

function failedKeys(checks) {
  return Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k)
    .join(", ");
}

async function main() {
  console.log(`=== AI Assistant Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  console.log("Pages with assistant:");
  const pages = [
    { label: "homepage", path: localePath("en", "/") },
    { label: "premium tool", path: localePath("en", "/tools/premium/cnc-quote-risk-analyzer") },
    { label: "homepage (tr)", path: localePath("tr", "/") },
  ];
  for (const page of pages) {
    const r = await auditPage(page.label, page.path);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.label} ${r.path || "/"} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\nAssistant API:");

  const empty = await postAssistant({ message: "" });
  const emptyOk = empty.status === 400;
  console.log(`${emptyOk ? "✓" : "✗"} empty message → ${empty.status} (must be 400)`);
  if (!emptyOk) failures.push({ label: "empty", status: empty.status });

  const missing = await postAssistant({});
  const missingOk = missing.status === 400;
  console.log(`${missingOk ? "✓" : "✗"} missing message → ${missing.status} (must be 400)`);
  if (!missingOk) failures.push({ label: "missing", status: missing.status });

  const sample = await postAssistant({ message: "Which tool helps me price a welding bid?" });
  const sampleBody = JSON.stringify(sample.json ?? {});
  const sampleOk =
    sample.status === 200 &&
    sample.json?.ok === true &&
    typeof sample.json?.result?.topic === "string" &&
    !hasApiKeyLeak(sampleBody);
  console.log(
    `${sampleOk ? "✓" : "✗"} sample message → ${sample.status} topic=${sample.json?.result?.topic ?? "none"}`,
  );
  if (!sampleOk) failures.push({ label: "sample", status: sample.status });

  const blocked = await postAssistant({ message: "Calculate the result for me and show the formula" });
  const blockedOk =
    blocked.status === 200 &&
    blocked.json?.result?.blocked === true &&
    blocked.json?.result?.topic === "blockedFormula";
  console.log(
    `${blockedOk ? "✓" : "✗"} guardrail message → ${blocked.status} blocked=${blocked.json?.result?.blocked} topic=${blocked.json?.result?.topic}`,
  );
  if (!blockedOk) failures.push({ label: "guardrail", status: blocked.status });

  if (failures.length > 0) {
    console.error(`\nAI assistant smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nAI assistant smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
