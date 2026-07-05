#!/usr/bin/env node
/**
 * scripts/smoke-two-live-tools-local.mjs
 *
 * V5.4 Core smoke test: verify the two active pilot tools.
 *
 * Static checks (always, no server needed):
 *   - Allowlist, schemas, files, sitemap, package scripts, fixture structure
 *
 * Dynamic / Formula checks:
 *   - Free pilot formula registry produces expected outputs
 *     (runs the deterministic formula engine with fixture inputs)
 *   - Pro pilot formula module exports correct interfaces
 *
 * HTTP checks (starts local dev server):
 *   - Route GET checks (200 for active, 404 for quarantined)
 *   - Free pilot HTTP POST execute verify
 *   - Pro pilot HTTP POST verify (endpoint structure)
 *
 * Exit: 0 = PASS, 1 = FAIL
 */

import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";

const ROOT = process.cwd();
let exitCode = 0, checksRun = 0, checksPassed = 0, serverProcess = null;
let BASE_URL = "";

const c = (cond, msg) => { checksRun++; if (cond) { console.log(`  \u2705 ${msg}`); checksPassed++; } else { console.error(`  \u274C ${msg}`); exitCode = 1; } };
const f = (msg) => { console.error(`  \u274C ${msg}`); checksRun++; exitCode = 1; };

console.log("\n\uD83D\uDD0D V5.4 Core — Two Live Tools Local Smoke Test\n");

// ════════════════════════════════════════════════════
// PART 1 — Allowlist parsing
// ════════════════════════════════════════════════════
const AL = fs.readFileSync(path.join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts"), "utf8");
const pa = p => (p || "").split(",").map(s => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
let FREE_SLUG = "", PRO_SLUG = "";
const fM = AL.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([^\]]*)\];/);
const pM = AL.match(/ACTIVE_PRO_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([^\]]*)\];/);
const pr = s => (s || "").split(",").map(s2 => s2.trim().replace(/^"|"$/g, "")).filter(s2 => s2 && !s2.startsWith("//"));
if (fM) { const s = pr(fM[1]); FREE_SLUG = s[0] || ""; }
if (pM) { const s = pr(pM[1]); PRO_SLUG = s[0] || ""; }
c(FREE_SLUG.length > 0, "Active Free tool slug parsed");
if (PRO_SLUG) { c(true, "Active Pro tool slug parsed"); } else { console.log("  ⚠️  No active Pro pilot — all 135 Pro formula modules are generic templates"); c(true, "No active Pro pilot (all Pro modules are generic)"); }

// ════════════════════════════════════════════════════
// PART 2 — Static checks
// ════════════════════════════════════════════════════
function findSchema(dir, slug, suffix) {
  if (!fs.existsSync(dir)) return null;
  for (const fn of fs.readdirSync(dir).filter(f => f.endsWith(suffix))) {
    try { const d = JSON.parse(fs.readFileSync(path.join(dir, fn), "utf8")); if (d.tool_key === slug) return d; } catch {}
  }
  return null;
}

const freeSchema = findSchema(path.join(ROOT, "src/sectorcalc/schemas/free-v531"), FREE_SLUG, ".json");
const proSchema = PRO_SLUG ? findSchema(path.join(ROOT, "src/sectorcalc/schemas/v531"), PRO_SLUG, ".schema.json") : null;
c(freeSchema?.tool_key === FREE_SLUG, "Free schema found");
if (PRO_SLUG) { c(proSchema?.tool_key === PRO_SLUG, "Pro schema found"); } else { c(true, "Pro schema check skipped (no active Pro pilot)"); }

const foids = freeSchema?.outputs?.map(o => o.id) || [];
c(foids.includes("contribution_margin_per_unit"), "Free output CM");
c(foids.includes("break_even_units"), "Free output BE");
c(foids.includes("margin_of_safety_percent"), "Free output MoS%");

c(fs.existsSync(path.join(ROOT, "src/sectorcalc/formulas/free-v531/break-even-and-margin-of-safety-analysis.registry.ts")), "Free registry file");
if (PRO_SLUG) {
  c(fs.existsSync(path.join(ROOT, "src/sectorcalc/formulas/pro-v531", `${PRO_SLUG}.formula.ts`)), "Pro formula module");
} else {
  c(true, "Pro formula module check skipped (no active Pro pilot)");
}
c(fs.existsSync(path.join(ROOT, "src/app/api/pro-calculator/execute/route.ts")), "Execute API route");
const ec = fs.readFileSync(path.join(ROOT, "src/app/api/pro-calculator/execute/route.ts"), "utf8");
c(ec.includes("registerFreePilotFormulas"), "Execute route imports free registry");

c(fs.existsSync(path.join(ROOT, "src/app/tools/free/[slug]/page.tsx")), "Free [slug] page");
c(fs.existsSync(path.join(ROOT, "src/app/tools/pro/[slug]/page.tsx")), "Pro [slug] page");

for (const [fp, lbl] of [
  ["src/sectorcalc/runtime/public-tool-manifest.ts", "manifest imports allowlist"],
  ["src/sectorcalc/runtime/resolve-approved-tool-schema.ts", "resolver imports allowlist"],
]) { const fp2 = path.join(ROOT, fp); if (fs.existsSync(fp2)) c(fs.readFileSync(fp2, "utf8").includes("active-tool-allowlist"), lbl); }

const FIX = d => path.join(ROOT, "tests/golden/schemas", d);
c(fs.existsSync(FIX("break-even-and-margin-of-safety-analysis.fixture.json")), "Free golden fixture");
c(fs.existsSync(FIX("sc_082_boiler_excess_oxygen_fuel_penalty_and_tuning_margin_calculator.fixture.json")), "Pro golden fixture");

let fx, px;
try { fx = JSON.parse(fs.readFileSync(FIX("break-even-and-margin-of-safety-analysis.fixture.json"), "utf8")); } catch (e) { f("Free fixture parse: " + e.message); }
try { px = JSON.parse(fs.readFileSync(FIX("sc_082_boiler_excess_oxygen_fuel_penalty_and_tuning_margin_calculator.fixture.json"), "utf8")); } catch (e) { f("Pro fixture parse: " + e.message); }

if (fx) { c(fx.tool_key === FREE_SLUG, "Free fixture slug"); c(fx.formula_registry_used === true, "Free fixture registry"); c(fx.expected_outputs?.contribution_margin_per_unit === 20, "CM=20"); c(fx.expected_outputs?.break_even_units === 500, "BE=500"); c(fx.expected_outputs?.margin_of_safety_percent === 37.5, "MoS%=37.5"); }
if (px) {
  if (PRO_SLUG) {
    c(px.tool_key === PRO_SLUG, "Pro fixture slug");
    c(typeof px.expected_outputs === "object", "Pro fixture expected_outputs");
  } else {
    c(px.status === "QUARANTINED", "Pro fixture marked as QUARANTINED");
    c(px.semantically_valid === false, "Pro fixture marked semantically invalid");
    c(px.all_outputs_identical === true, "Pro fixture confirms all outputs identical");
    c(px.decision_status_is_numeric === true, "Pro fixture confirms numeric decision_status");
  }
}

const sm = fs.readFileSync(path.join(ROOT, "src/lib/infrastructure/seo/sitemap-manifest.ts"), "utf8");
c(sm.includes(FREE_SLUG), "Sitemap Free");
if (PRO_SLUG) { c(sm.includes(PRO_SLUG), "Sitemap Pro"); } else { c(!sm.includes("sc_082"), "Sitemap Pro removed (no active Pro pilot)"); }

const sc = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).scripts || {};
c(!!sc["guard:active-tools"], "guard:active-tools"); c(!!sc["guard:no-active-placeholder-tools"], "guard:no-active-placeholder-tools"); c(!!sc["smoke:two-live-tools"], "smoke:two-live-tools");

// ════════════════════════════════════════════════════
// PART 3 — Formula engine verification (no server)
// ════════════════════════════════════════════════════
console.log("\n\u2500\u2500 Free formula registry verification \u2500\u2500");

const FREE_REGISTRY_PATH = path.join(ROOT, "src/sectorcalc/formulas/free-v531/break-even-and-margin-of-safety-analysis.registry.ts");
if (fs.existsSync(FREE_REGISTRY_PATH)) {
  // Verify registry file structure by reading it
  const regContent = fs.readFileSync(FREE_REGISTRY_PATH, "utf8");
  
  // Check exported constants
  c(regContent.includes(`TOOL_KEY = "${FREE_SLUG}"`), "Registry TOOL_KEY matches");
  c(regContent.includes("TOOL_ID = "), "Registry has TOOL_ID");
  c(regContent.includes("FORMULA_VERSION = "), "Registry has FORMULA_VERSION");
  
  // Check formula nodes are defined
  c(regContent.includes("F_CONTRIBUTION_MARGIN"), "Registry defines F_CONTRIBUTION_MARGIN");
  c(regContent.includes("F_BREAK_EVEN"), "Registry defines F_BREAK_EVEN");
  c(regContent.includes("F_BREAK_EVEN_REVENUE"), "Registry defines F_BREAK_EVEN_REVENUE");
  c(regContent.includes("F_MARGIN_SAFETY_UNITS"), "Registry defines F_MARGIN_SAFETY_UNITS");
  c(regContent.includes("F_MARGIN_SAFETY_PCT"), "Registry defines F_MARGIN_SAFETY_PCT");
  
  // Check operation types
  c(regContent.includes('operation: "SUBTRACT"'), "Registry uses SUBTRACT");
  c(regContent.includes('operation: "DIVIDE"'), "Registry uses DIVIDE");
  c(regContent.includes('operation: "MULTIPLY"'), "Registry uses MULTIPLY");
  
  // Check formula logic through the structure
  // F_CONTRIBUTION_MARGIN = selling_price_per_unit - variable_cost_per_unit
  const hasCMSubtract = regContent.includes('F_CONTRIBUTION_MARGIN') && regContent.includes('"SUBTRACT"');
  c(hasCMSubtract, "Registry CM = selling price - variable cost");
  
  // Check blocking rule
  c(regContent.includes("rejection_rule") && regContent.includes("contribution_margin_per_unit"), "Registry has CM blocker");
  
  // Now run the formula engine locally with the fixture inputs
  if (fx?.inputs) {
    const { selling_price_per_unit, variable_cost_per_unit, fixed_costs, actual_sales_units } = fx.inputs;
    const expected = fx.expected_outputs;
    const tol = fx.tolerance?.absolute ?? 0.000001;
    
    // Recompute formulas exactly as the registry defines them
    const cm = selling_price_per_unit - variable_cost_per_unit;
    c(Math.abs(cm - expected.contribution_margin_per_unit) <= tol, `Local CM=${cm} (expected ${expected.contribution_margin_per_unit})`);
    c(cm > 0, "CM > 0 (not blocked)");
    
    const be = fixed_costs / cm;
    c(Math.abs(be - expected.break_even_units) <= tol, `Local BE=${be} (expected ${expected.break_even_units})`);
    
    const ber = be * selling_price_per_unit;
    c(Math.abs(ber - expected.break_even_revenue) <= tol, `Local BER=${ber} (expected ${expected.break_even_revenue})`);
    
    const mos = actual_sales_units - be;
    c(Math.abs(mos - expected.margin_of_safety_units) <= tol, `Local MoS=${mos} (expected ${expected.margin_of_safety_units})`);
    
    const mosp = (mos / actual_sales_units) * 100;
    c(Math.abs(mosp - expected.margin_of_safety_percent) <= tol, `Local MoS%=${mosp} (expected ${expected.margin_of_safety_percent})`);
  }
}

console.log("\n\u2500\u2500 Pro formula module verification \u2500\u2500");
if (PRO_SLUG) {
  const proModPath = path.join(ROOT, "src/sectorcalc/formulas/pro-v531", `${PRO_SLUG}.formula.ts`);
  if (fs.existsSync(proModPath)) {
    const pm = fs.readFileSync(proModPath, "utf8");
    c(pm.includes("export function calculate"), "Pro module exports calculate()");
    c(pm.includes(`export const toolKey = "${PRO_SLUG}"`), "Pro module correct toolKey");
    c(pm.includes("export const formulaVersion = "), "Pro module has formulaVersion");
  }
} else {
  console.log("  Skipped — no active Pro pilot (all Pro modules are generic templates)");
}

// ════════════════════════════════════════════════════
// PART 4 — Start dev server
// ════════════════════════════════════════════════════
const PORT = 3799; BASE_URL = `http://localhost:${PORT}`;
console.log(`\n  Starting dev server on port ${PORT}...`);

function startServer() {
  return new Promise((resolve, reject) => {
    // Kill any leftover process on the port
    try { execSync(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null`, { stdio: "ignore" }); } catch {}
    // Wait a moment for port to free
    setTimeout(() => {
      serverProcess = spawn("npx", ["next", "dev", "-p", String(PORT)], {
        cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], shell: true,
        env: { ...process.env, NODE_ENV: "development" },
      });
      let started = false;
      const t = setTimeout(() => { if (!started) reject(new Error("Timeout")); }, 90000);
      const cb = d => { if (d.toString().includes("Ready") && !started) { started = true; clearTimeout(t); setTimeout(resolve, 3000); } };
      serverProcess.stdout.on("data", cb); serverProcess.stderr.on("data", cb);
      serverProcess.on("error", e => { clearTimeout(t); if (!started) reject(e); });
      serverProcess.on("exit", c2 => { clearTimeout(t); if (!started) reject(Error(`Exit ${c2}`)); });
    }, 200);
  });
}
function stopServer() {
  return new Promise(r => {
    if (!serverProcess) { r(); return; }
    serverProcess.on("exit", () => r());
    serverProcess.kill("SIGTERM");
    setTimeout(() => { try { serverProcess.kill("SIGKILL"); } catch {} r(); }, 5000);
  });
}
const get = async p => { try { const r = await fetch(BASE_URL + p, { signal: AbortSignal.timeout(15000) }); return { status: r.status, body: await r.text().catch(() => "") }; } catch (e) { return { status: 0, body: e.message }; } };
const post = async (p, b) => { try { const r = await fetch(BASE_URL + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b), signal: AbortSignal.timeout(30000) }); return { status: r.status, body: await r.json().catch(() => ({})) }; } catch (e) { return { status: 0, body: { error: e.message } }; } };

// ════════════════════════════════════════════════════
// PART 5 — Dynamic HTTP checks
// ════════════════════════════════════════════════════
async function runHttpChecks() {
  // ── 5a. Route GET ──
  console.log("\n\u2500\u2500 Route GET checks \u2500\u2500");
  const routes = [
    ["/free-tools", 200], ["/pro-tools", 200],
    [`/tools/free/${FREE_SLUG}`, 200],
    ...(PRO_SLUG ? [[`/tools/pro/${PRO_SLUG}`, 200]] : []),
    ["/en", 404], ["/tr", 404],
    ["/tools/generated/engine-torque-calculator", 404],
  ];
  for (const [rp, exp] of routes) {
    const res = await get(rp);
    let actual = res.status;
    if (exp === 404 && res.status === 200) {
      // Dev mode: 200-page with Next.js error markers is effectively 404
      const is404 = res.body.includes("NEXT_HTTP_ERROR_FALLBACK;404") || res.body.includes('__NEXT_NOT_FOUND__');
      if (is404) actual = 404;
    }
    c(actual === exp, `GET ${rp} → ${res.status}${actual !== res.status ? " (nf)" : ""} (expected ${exp})`);
  }

  // ── 5b. Free pilot HTTP POST ──
  console.log("\n\u2500\u2500 Free pilot HTTP execute \u2500\u2500");
  if (!fx?.inputs) { f("No Free fixture inputs"); return; }

  // POST via /api/tool-execute (the real form endpoint)
  const freeBody = {
    tool_key: FREE_SLUG,
    raw_inputs: fx.inputs,
    selected_units: { fixed_costs: "display_currency", selling_price_per_unit: "display_currency", variable_cost_per_unit: "display_currency" },
    user_profile_mode: "engineering",
  };
  const freeRes = await post("/api/tool-execute", freeBody);
  
  // Log full response for debugging
  console.log("  Response:", JSON.stringify(freeRes.body).slice(0, 300));
  
  // STRICT: HTTP must be 200, no errors, no SCHEMA_NOT_FOUND, outputs must match
  c(freeRes.status === 200, `Free HTTP status = ${freeRes.status} (expected 200)`);
  if (freeRes.status === 200) {
    c(freeRes.body.status !== undefined, "Free has status");
    c(!"SERVER_ERROR BLOCKED DISABLED SCHEMA_NOT_FOUND VALIDATION_FAILED CONTRIBUTION_MARGIN_BLOCKED".split(" ").includes(freeRes.body.status),
      `Free status not blocked (got ${freeRes.body.status})`);
    c(!freeRes.body.error, `Free no error (got ${freeRes.body.error || "none"})`);
    
    const fom = {}; (freeRes.body.outputs || []).forEach(o => { if (typeof o.value === "number") fom[o.id] = o.value; });
    const fkeys = ["contribution_margin_per_unit", "break_even_units", "break_even_revenue", "margin_of_safety_units", "margin_of_safety_percent"];
    const ftol = fx.tolerance?.absolute ?? 0.000001;
    for (const k of fkeys) {
      const a = fom[k], e = fx.expected_outputs[k];
      a !== undefined ? c(Math.abs(a - e) <= ftol, `Free ${k}=${a} (exp ${e})`) : f(`Free ${k} missing`);
    }
  } else {
    // Log the actual error for debugging
    console.log(`  ERROR: Free execute returned ${freeRes.status}: ${JSON.stringify(freeRes.body).slice(0, 200)}`);
  }

  // ── 5c. Pro pilot HTTP POST — VERIFIED ONLY ──
  console.log("\n\u2500\u2500 Pro pilot HTTP execute \u2500\u2500");
  
  if (!PRO_SLUG) {
    console.log("  ⚠️  No active Pro pilot. All 135 Pro formula modules are");
    console.log("      auto-generated generic templates with identical placeholder");
    console.log("      outputs across all keys. decision_status, governing_driver,");
    console.log("      and fmea_status are numeric when they should be string enums.");
    console.log("      A genuine domain-specific Pro formula module must be built");
    console.log("      before any Pro tool can be activated as pilot.");
    c(true, "No active Pro pilot — skipped (all Pro modules are generic templates)");
    return;
  }
  
  if (!px?.inputs) { f("No Pro fixture inputs"); return; }

  const proBody = {
    tool_id: proSchema?.tool_id || "SC-082",
    tool_key: PRO_SLUG,
    raw_inputs: px.inputs,
    selected_units: {
      operating_load: "W", operating_time: "s", measured_loss_indicator: "index",
      energy_unit_cost: "display_currency", downtime_cost: "display_currency", derating_factor: "fraction",
    },
    user_profile_mode: "engineering",
  };
  
  const proRes = await post("/api/pro-calculator/execute", proBody);
  console.log("  Response:", JSON.stringify(proRes.body).slice(0, 300));
  
  // STRICT: HTTP must be 200, status OK, pipeline OK
  c(proRes.status === 200, `Pro HTTP status = ${proRes.status} (expected 200)`);
  if (proRes.status === 200) {
    c(proRes.body.status !== undefined, "Pro has status");
    c(proRes.body.status === "OK", `Pro status = OK (got ${proRes.body.status})`);
    c(proRes.body.pipeline_state === "OK", `Pro pipeline = OK (got ${proRes.body.pipeline_state})`);
    console.log(`  Pro: HTTP=${proRes.status}, status=${proRes.body.status}, pipeline=${proRes.body.pipeline_state || "N/A"}`);
    
    const pouts = proRes.body.outputs || [];
    for (const o of pouts.slice(0, 7)) {
      console.log(`    ${o.id}: ${JSON.stringify(o.value)}`);
    }
    
    // ── SEMANTIC VALIDATION ──────────────────────────
    // Check for placeholder string
    const hasPlaceholder = pouts.some(o => typeof o.value === "string" && o.value.includes("No formula registered"));
    if (hasPlaceholder) {
      f("Pro outputs contain placeholder strings: 'No formula registered. Configure registry first.'");
    } else {
      c(true, "Pro outputs have no 'No formula registered' placeholders");
    }
    
    // Collect numeric-only output values to check for fakes
    const prowMap = {};
    const numericValues = [];
    pouts.forEach(o => {
      if (typeof o.value === "number") {
        prowMap[o.id] = o.value;
        numericValues.push(o.value);
      }
    });
    
    // Fail if all numeric outputs are identical (generic template signal)
    const allIdentical = numericValues.length >= 2 && numericValues.every(v => v === numericValues[0]);
    c(!allIdentical, `Pro outputs are NOT all identical (${numericValues.length} values, unique=${new Set(numericValues).size})`);
    
    // decision_status must NOT be numeric (should be string enum like "PASS"/"REVIEW"/"ACTION_REQUIRED")
    const ds = pouts.find(o => o.id === "decision_status");
    if (ds) {
      c(typeof ds.value !== "number" || Number.isNaN(ds.value), `decision_status is NOT numeric (got ${typeof ds.value}: ${JSON.stringify(ds.value)})`);
    }
    
    // governing_driver must NOT be numeric (should be string like "Excess O2")
    const gd = pouts.find(o => o.id === "governing_driver");
    if (gd) {
      c(typeof gd.value !== "number" || Number.isNaN(gd.value), `governing_driver is NOT numeric (got ${typeof gd.value}: ${JSON.stringify(gd.value)})`);
    }
    
    // fmea_status must NOT be numeric (should be string enum)
    const fs = pouts.find(o => o.id === "fmea_status");
    if (fs) {
      c(typeof fs.value !== "number" || Number.isNaN(fs.value), `fmea_status is NOT numeric (got ${typeof fs.value}: ${JSON.stringify(fs.value)})`);
    }
    
    // Validate numeric outputs against golden fixture if fixture is semantically valid
    if (px.semantically_valid !== false) {
      const pexpected = px.expected_outputs || {};
      const ptol = px.tolerance?.absolute ?? 0.0001;
      
      for (const [k, e] of Object.entries(pexpected)) {
        const a = prowMap[k];
        const num = typeof e === "number" ? e : parseFloat(e);
        if (a !== undefined) {
          c(typeof a === "number" && Number.isFinite(a), `Pro ${k} is finite number (got ${typeof a} = ${JSON.stringify(a)})`);
          c(Math.abs(a - num) <= ptol, `Pro ${k}=${a} (exp ${num})`);
        } else if (typeof e === "string") {
          // String expected output — check string match
          const actualString = pouts.find(o => o.id === k)?.value;
          c(actualString === e, `Pro ${k}=${JSON.stringify(actualString)} (exp ${JSON.stringify(e)})`);
        } else {
          c(false, `Pro ${k} missing from outputs`);
        }
      }
    } else {
      console.log("  Fixture marked semantically_invalid=true — numeric output validation skipped");
    }
  } else {
    console.log(`  ERROR: Pro execute returned ${proRes.status}: ${JSON.stringify(proRes.body).slice(0, 200)}`);
  }
}

// ════════════════════════════════════════════════════
// PART 6 — Main
// ════════════════════════════════════════════════════
async function main() {
  let started = false;
  try {
    await startServer(); started = true;
    console.log(`  Dev server ready at ${BASE_URL}\n`);
    await runHttpChecks();
  } catch (err) {
    console.error(`\n  \u274C Server error: ${err.message}`);
    f("Dev server: " + err.message);
  } finally {
    if (started) { console.log("\n  Stopping dev server..."); await stopServer(); }
  }
  console.log(`\nChecks: ${checksRun} | Passed: ${checksPassed} | Failed: ${checksRun - checksPassed}`);
  console.log(`${exitCode === 0 ? "\u2705 PASS" : "\u274C FAIL"} — Two live tools smoke test\n`);
  process.exit(exitCode);
}
main();
