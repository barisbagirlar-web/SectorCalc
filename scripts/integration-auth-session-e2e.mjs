#!/usr/bin/env node

const BASE = process.env.BARIS_E2E_BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.BARIS_E2E_TEST_USER_EMAIL || "";
const PASSWORD = process.env.BARIS_E2E_TEST_USER_PASSWORD || "";
const TOOL_KEY = process.env.BARIS_E2E_TOOL_KEY || "break-even-survival-cash-calculator";
const STRICT = process.env.BARIS_E2E_STRICT === "true" || process.argv.includes("--strict");

let failures = 0;
let skips = 0;
const pass = (name, detail = "") => console.log(`PASS ${name} ${detail}`);
const fail = (name, detail = "") => { failures += 1; console.error(`FAIL ${name} ${detail}`); };
const skip = (name, detail = "") => { skips += 1; console.log(`SKIP ${name} ${detail}`); };

async function json(response) {
  return response.json().catch(() => ({}));
}

async function expectStatus(path, expected) {
  const response = await fetch(new URL(path, BASE), { redirect: "manual" });
  if (response.status === expected) pass(`GET ${path}`, `status=${expected}`);
  else fail(`GET ${path}`, `expected=${expected};actual=${response.status}`);
}

for (const route of ["/manifest.webmanifest", "/icon.png", "/favicon.ico", "/robots.txt"]) {
  await expectStatus(route, 200);
}

for (const slug of [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "job-quote-builder-pro-pack",
  "true-employee-cost-statement",
]) {
  await expectStatus(`/tools/pro/${slug}`, 200);
}

const unauthenticated = await fetch(new URL("/api/pro-tool-session/create", BASE), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ toolKey: TOOL_KEY }),
});
if (unauthenticated.status === 401) pass("UNAUTHENTICATED_GUARD", "status=401");
else fail("UNAUTHENTICATED_GUARD", `expected=401;actual=${unauthenticated.status}`);

if (!EMAIL || !PASSWORD) {
  if (STRICT) fail("AUTH_CREDENTIALS", "required E2E credentials are missing");
  else skip("AUTH_FLOW", "credentials are missing");
} else {
  const login = await fetch(new URL("/api/auth/login", BASE), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const loginBody = await json(login);
  if (login.status !== 200 || !loginBody.idToken) {
    fail("AUTH_LOGIN", `status=${login.status};error=${loginBody.error || "missing idToken"}`);
  } else {
    pass("AUTH_LOGIN", "status=200;idToken=present");

    const session = await fetch(new URL("/api/auth/session", BASE), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: loginBody.idToken }),
    });
    const setCookie = session.headers.get("set-cookie") || "";
    if (session.status === 200 && setCookie.includes("__session=")) {
      pass("SESSION_COOKIE", "status=200;cookie=__session");
    } else {
      const sessionBody = await json(session);
      fail("SESSION_COOKIE", `status=${session.status};error=${sessionBody.error || "missing cookie"}`);
    }

    const proSession = await fetch(new URL("/api/pro-tool-session/create", BASE), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginBody.idToken}`,
      },
      body: JSON.stringify({ toolKey: TOOL_KEY }),
    });
    const proSessionBody = await json(proSession);
    if (proSession.status !== 200 || !proSessionBody.usageSessionId) {
      fail("PRO_SESSION", `status=${proSession.status};error=${proSessionBody.error || "missing usageSessionId"}`);
    } else {
      pass("PRO_SESSION", "status=200;usageSessionId=present");

      const execution = await fetch(new URL("/api/pro-tool-execute", BASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginBody.idToken}`,
        },
        body: JSON.stringify({
          toolKey: TOOL_KEY,
          usageSessionId: proSessionBody.usageSessionId,
          inputs: {
            monthly_fixed_costs: 50000,
            revenue_per_unit: 100,
            variable_cost_per_unit: 60,
            current_units_sold: 800,
            target_units: 1200,
            operating_days_per_year: 250,
            worst_case_revenue_drop_pct: 30,
          },
        }),
      });
      const executionBody = await json(execution);
      const result = executionBody.result;
      if (execution.status === 200 && result && Object.keys(result).length > 0) {
        pass("PRO_EXECUTION", `status=200;resultKeys=${Object.keys(result).length}`);
      } else {
        fail("PRO_EXECUTION", `status=${execution.status};error=${executionBody.error || "empty result"}`);
      }
    }
  }
}

console.log(`AUTH_E2E_RESULT=passes_unknown;failures=${failures};skips=${skips}`);
process.exit(failures === 0 && (!STRICT || skips === 0) ? 0 : 1);
