/**
 * smoke-approved-reports.mjs
 * Smoke test: POST /api/reports/approved + GET /api/verify-report
 *
 * Usage:
 *   node scripts/smoke-approved-reports.mjs [BASE_URL]
 *
 * Default BASE_URL: http://localhost:3000
 */

const BASE_URL = process.argv[2] ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`  ❌ ${label}${detail ? `: ${detail}` : ""}`);
  failed++;
}

async function json(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ── TEST 1: POST /api/reports/approved — missing required fields ──────────
console.log("\n[1] POST /api/reports/approved — missing required fields (400)");
{
  const res = await fetch(`${BASE_URL}/api/reports/approved`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolSlug: "steel-weight-calculator" }),
  });
  if (res.status === 400) ok("400 returned for missing locale/routePath");
  else fail("Expected 400", `got ${res.status}`);
  const data = await json(res);
  if (data?.error === "validation_error")
    ok("error=validation_error in body");
  else fail("Expected error=validation_error", JSON.stringify(data));
}

// ── TEST 2: POST /api/reports/approved — valid payload ────────────────────
console.log("\n[2] POST /api/reports/approved — valid payload");
let reportId, calculationHash, verifyUrl;
{
  const payload = {
    toolSlug: "steel-weight-calculator",
    toolType: "free",
    locale: "en",
    routePath: "/en/free-tools/steel-weight-calculator",
    formulaVersion: "1.0.0",
    inputSnapshot: {
      materialType: "carbon_steel",
      shape: "round_bar",
      diameter_mm: 50,
      length_mm: 1000,
    },
    resultSnapshot: {
      weight_kg: 15.4,
      density_kg_m3: 7850,
    },
  };

  const res = await fetch(`${BASE_URL}/api/reports/approved`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await json(res);

  if (res.status === 201) ok("201 Created");
  else fail("Expected 201", `got ${res.status}: ${JSON.stringify(data)}`);

  if (data?.ok === true) ok("ok=true");
  else fail("Expected ok=true", JSON.stringify(data));

  if (data?.reportId && /^SC-\d{8}-[A-Z0-9]+-[A-Z0-9]+$/.test(data.reportId)) {
    ok(`reportId format valid: ${data.reportId}`);
    reportId = data.reportId;
  } else {
    fail("Invalid or missing reportId", data?.reportId);
  }

  if (data?.calculationHash && data.calculationHash.length === 64) {
    ok(`calculationHash present (${data.calculationHash.slice(0, 12)}…)`);
    calculationHash = data.calculationHash;
  } else {
    fail("Invalid or missing calculationHash", data?.calculationHash);
  }

  if (data?.validationStampId) ok("validationStampId present");
  else fail("Missing validationStampId", JSON.stringify(data));

  if (data?.verifyUrl && data.verifyUrl.includes("/verify?reportId=")) {
    ok(`verifyUrl valid: ${data.verifyUrl}`);
    verifyUrl = data.verifyUrl;
  } else {
    fail("Invalid or missing verifyUrl", data?.verifyUrl);
  }

  if (data?.status === "issued") ok("status=issued");
  else fail("Expected status=issued", data?.status);
}

// ── TEST 3: GET /api/verify-report — missing reportId ────────────────────
console.log("\n[3] GET /api/verify-report — missing reportId (400)");
{
  const res = await fetch(`${BASE_URL}/api/verify-report`);
  if (res.status === 400) ok("400 returned for missing reportId");
  else fail("Expected 400", `got ${res.status}`);
}

// ── TEST 4: GET /api/verify-report — invalid format ──────────────────────
console.log("\n[4] GET /api/verify-report — invalid reportId format (400)");
{
  const res = await fetch(
    `${BASE_URL}/api/verify-report?reportId=not-a-valid-id`
  );
  if (res.status === 400) ok("400 returned for invalid reportId format");
  else fail("Expected 400", `got ${res.status}`);
}

// ── TEST 5: GET /api/verify-report — look up created report ──────────────
if (reportId) {
  console.log(`\n[5] GET /api/verify-report?reportId=${reportId}`);
  const res = await fetch(
    `${BASE_URL}/api/verify-report?reportId=${encodeURIComponent(reportId)}`
  );
  const data = await json(res);

  if (res.status === 200) ok("200 OK");
  else fail("Expected 200", `got ${res.status}: ${JSON.stringify(data)}`);

  if (data?.ok === true) ok("ok=true");
  else fail("Expected ok=true", JSON.stringify(data));

  if (data?.status === "verified") ok("status=verified");
  else fail("Expected status=verified", data?.status);

  if (data?.reportId === reportId) ok("reportId matches");
  else fail("reportId mismatch", data?.reportId);

  if (data?.validationStampId) ok("validationStampId present");
  else fail("Missing validationStampId");

  // Ensure private fields are NOT returned
  if (data?.userEmail === undefined) ok("userEmail not exposed");
  else fail("userEmail was exposed in verify response");

  if (data?.userId === undefined) ok("userId not exposed");
  else fail("userId was exposed in verify response");

  if (data?.inputSnapshot === undefined) ok("inputSnapshot not exposed");
  else fail("inputSnapshot was exposed in verify response");

  if (data?.resultSnapshot === undefined) ok("resultSnapshot not exposed");
  else fail("resultSnapshot was exposed in verify response");
}

// ── TEST 6: GET /api/verify-report — with hash ───────────────────────────
if (reportId && calculationHash) {
  console.log(`\n[6] GET /api/verify-report?reportId=...&hash=${calculationHash.slice(0, 12)}…`);
  const res = await fetch(
    `${BASE_URL}/api/verify-report?reportId=${encodeURIComponent(reportId)}&hash=${calculationHash}`
  );
  const data = await json(res);

  if (res.status === 200) ok("200 OK with hash");
  else fail("Expected 200", `got ${res.status}`);

  if (data?.status === "verified") ok("status=verified with matching hash");
  else fail("Expected status=verified", data?.status);

  if (data?.hashMatches === true) ok("hashMatches=true");
  else fail("Expected hashMatches=true", data?.hashMatches);
}

// ── TEST 7: GET /api/verify-report — wrong hash ──────────────────────────
if (reportId) {
  console.log("\n[7] GET /api/verify-report — wrong hash");
  const wrongHash = "a".repeat(64);
  const res = await fetch(
    `${BASE_URL}/api/verify-report?reportId=${encodeURIComponent(reportId)}&hash=${wrongHash}`
  );
  const data = await json(res);

  if (res.status === 200) ok("200 OK with wrong hash");
  else fail("Expected 200", `got ${res.status}`);

  if (data?.status === "hash_mismatch") ok("status=hash_mismatch");
  else fail("Expected status=hash_mismatch", data?.status);

  if (data?.hashMatches === false) ok("hashMatches=false");
  else fail("Expected hashMatches=false", data?.hashMatches);
}

// ── TEST 8: GET /api/verify-report — not found report ────────────────────
console.log("\n[8] GET /api/verify-report — not found");
{
  const res = await fetch(
    `${BASE_URL}/api/verify-report?reportId=SC-20260101-NOTEXIST-ZZZZ`
  );
  const data = await json(res);

  if (res.status === 200) ok("200 OK for not found");
  else fail("Expected 200", `got ${res.status}`);

  if (data?.status === "not_found") ok("status=not_found");
  else fail("Expected status=not_found", data?.status);
}

// ── TEST 9: /verify page loads ───────────────────────────────────────────
console.log("\n[9] GET /en/verify — page loads");
{
  const res = await fetch(`${BASE_URL}/en/verify`);
  if (res.status === 200) ok("/en/verify returns 200");
  else fail("Expected 200 for /en/verify", `got ${res.status}`);
  const html = await res.text();
  if (html.includes("Verify") || html.includes("Report ID"))
    ok("Page contains verify content");
  else fail("Page missing verify content");
}

// ── SUMMARY ──────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────");
console.log(`SMOKE RESULT: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("SMOKE FAILED");
  process.exit(1);
} else {
  console.log("SMOKE PASS");
}