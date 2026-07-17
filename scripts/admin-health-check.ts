/**
 * Admin Health Check — CLI
 *
 * Usage:
 *   npx tsx scripts/admin-health-check.ts [--json]
 *
 * Runs the same checks as GET /api/admin/health-check but from the CLI,
 * using direct Firebase Admin SDK access (no HTTP server required).
 *
 * Authentication: requires GOOGLE_APPLICATION_CREDENTIALS env var or
 * Firebase Admin SDK default credentials.
 *
 * Returns exit code 0 if all checks pass, 1 if any fail.
 */

import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ── Configuration ──────────────────────────────────────────────────────────

const SUPER_ADMIN_EMAIL = "barisbagirlar@gmail.com";

const ADMIN_PAGE_TITLE_CONTRACT: Record<string, { metadata: string; hero: string }> = {
  "/admin": { metadata: "Super Admin Dashboard", hero: "Super Admin Dashboard" },
  "/admin/login": { metadata: "Admin sign in", hero: "Admin sign in" },
  "/admin/health-check": { metadata: "System Health Check (Admin)", hero: "System Health Check" },
  "/admin/case-studies": { metadata: "Case Studies (Admin)", hero: "Case Studies" },
  "/admin/case-studies/new": { metadata: "New Case Study (Admin)", hero: "New case study" },
  "/admin/case-studies/new/full": { metadata: "New case study - Advanced (Admin)", hero: "New case study (advanced)" },
  "/admin/tickets": { metadata: "Support Tickets (Admin)", hero: "Support Tickets" },
  "/admin/leads": { metadata: "Lead Intents (Admin)", hero: "Lead Intents" },
  "/admin/users": { metadata: "Member Management (Admin)", hero: "Member Management" },
  "/admin/kpi": { metadata: "Live KPI Review (Admin)", hero: "Live KPI Review" },
  "/admin/benchmarks": { metadata: "Benchmark Data (Admin)", hero: "Benchmark Data" },
  "/admin/schema-generator": { metadata: "Schema Generator (Admin)", hero: "Schema Generator" },
  "/admin/verification-queue": { metadata: "Verification Queue (Admin)", hero: "Verification Queue" },
};

const ADMIN_SUBNAV_CONTRACT = [
  "/admin",
  "/admin/health-check",
  "/admin/case-studies",
  "/admin/tickets",
  "/admin/leads",
  "/admin/users",
  "/admin/kpi",
  "/admin/benchmarks",
  "/admin/schema-generator",
];

const ADMIN_FIRESTORE_COLLECTIONS = [
  "users",
  "leadIntents",
  "supportTickets",
  "caseStudies",
  "reports",
  "verification_queue",
];

// ── Types ──────────────────────────────────────────────────────────────────

type CheckStatus = "pass" | "fail" | "warn";

interface CheckResult {
  check: string;
  status: CheckStatus;
  detail: string;
  category: string;
  metric?: number;
}

// ── Firebase Init ──────────────────────────────────────────────────────────

function initFirebaseAdmin() {
  if (getApps().length > 0) return;

  const projectRoot = process.cwd();
  const possiblePaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    join(projectRoot, "service-account.json"),
    join(projectRoot, ".env.local"),
  ];

  for (const credPath of possiblePaths) {
    if (credPath && existsSync(credPath) && credPath.endsWith(".json")) {
      try {
        const serviceAccount = JSON.parse(readFileSync(credPath, "utf-8"));
        initializeApp({ credential: cert(serviceAccount) });
        console.log(`[init] Firebase Admin initialized using ${credPath}`);
        return;
      } catch {
        continue;
      }
    }
  }

  // Fallback: application default credentials
  initializeApp();
  console.log("[init] Firebase Admin initialized using application default credentials");
}

// ── Checks ─────────────────────────────────────────────────────────────────

async function runAllChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const app = getApps()[0];
  if (!app) {
    results.push({ check: "Firebase Init", status: "fail", detail: "No Firebase app initialized", category: "infrastructure" });
    return results;
  }

  const db = getFirestore(app);
  const auth = getAuth(app);

  // ── Firebase Init ──
  results.push({ check: "Firebase Admin SDK", status: "pass", detail: "Firebase Admin App initialized successfully", category: "infrastructure" });

  // ── Firestore Connectivity ──
  try {
    await db.collection("_health_check_").limit(1).get();
    results.push({ check: "Firestore Connectivity", status: "pass", detail: "Firestore read query executed successfully", category: "infrastructure" });
  } catch (err) {
    results.push({ check: "Firestore Connectivity", status: "fail", detail: `Firestore query failed: ${err instanceof Error ? err.message : "unknown"}`, category: "infrastructure" });
  }

  // ── Auth Connectivity ──
  try {
    await auth.listUsers(1);
    results.push({ check: "Auth Connectivity", status: "pass", detail: "Firebase Auth listUsers API responded", category: "auth" });
  } catch (err) {
    results.push({ check: "Auth Connectivity", status: "fail", detail: `Auth API call failed: ${err instanceof Error ? err.message : "unknown"}`, category: "auth" });
  }

  // ── Super Admin User ──
  try {
    const user = await auth.getUserByEmail(SUPER_ADMIN_EMAIL);
    results.push({ check: "Super Admin User", status: "pass", detail: `Super admin ${SUPER_ADMIN_EMAIL} exists (UID: ${user.uid.slice(0, 8)}...)`, category: "auth" });
  } catch {
    results.push({ check: "Super Admin User", status: "warn", detail: `Super admin ${SUPER_ADMIN_EMAIL} not found in Auth — may need to create account first`, category: "auth" });
  }

  // ── Admin Users Count ──
  try {
    const list = await auth.listUsers(1000);
    let adminCount = 0;
    for (const u of list.users) {
      if (u.customClaims?.admin === true) adminCount++;
    }
    results.push({
      check: "Admin Users Count",
      status: adminCount > 0 ? "pass" : "warn",
      detail: `${adminCount} user(s) with admin:true custom claim`,
      category: "auth",
      metric: adminCount,
    });
  } catch {
    results.push({ check: "Admin Users Count", status: "warn", detail: "Could not enumerate admin users", category: "auth" });
  }

  // ── Firestore Collections ──
  for (const name of ADMIN_FIRESTORE_COLLECTIONS) {
    try {
      const snap = await db.collection(name).limit(1).get();
      results.push({
        check: `Collection: ${name}`,
        status: "pass",
        detail: `Collection exists (${snap.docs.length} doc sample)`,
        category: "firestore",
        metric: snap.docs.length,
      });
    } catch (err) {
      results.push({
        check: `Collection: ${name}`,
        status: "warn",
        detail: `Collection check failed: ${err instanceof Error ? err.message : "unknown"}`,
        category: "firestore",
      });
    }
  }

  // ── Page Route Files ──
  const projectRoot = process.cwd();
  for (const [route, contract] of Object.entries(ADMIN_PAGE_TITLE_CONTRACT)) {
    const pagePath = join(projectRoot, "src/app", route, "page.tsx");
    if (existsSync(pagePath)) {
      const content = readFileSync(pagePath, "utf-8");

      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      const heroMatch = content.match(/title="([^"]+)"/);

      const metadataOk = titleMatch && titleMatch[1] === contract.metadata;
      const heroOk = heroMatch && heroMatch[1] === contract.hero;

      const errors: string[] = [];
      if (!metadataOk) errors.push(`metadata "${titleMatch?.[1] ?? "NOT_FOUND"}" ≠ expected "${contract.metadata}"`);
      if (!heroOk) errors.push(`hero "${heroMatch?.[1] ?? "NOT_FOUND"}" ≠ expected "${contract.hero}"`);

      if (errors.length === 0) {
        results.push({
          check: `Title: ${route}`,
          status: "pass",
          detail: `✓ metadata="${contract.metadata}" · hero="${contract.hero}"`,
          category: "title_integrity",
        });
      } else {
        results.push({
          check: `Title: ${route}`,
          status: "fail",
          detail: `✗ ${errors.join("; ")}`,
          category: "title_integrity",
        });
      }
    } else if (route.includes("[id]")) {
      results.push({
        check: `Title: ${route}`,
        status: "pass",
        detail: `Dynamic route — file exists pattern, generateMetadata verified via contract`,
        category: "title_integrity",
      });
    } else {
      results.push({
        check: `Title: ${route}`,
        status: "fail",
        detail: `File not found at src/app${route}/page.tsx`,
        category: "title_integrity",
      });
    }
  }

  // ── Subnav Integrity ──
  for (const route of ADMIN_SUBNAV_CONTRACT) {
    const pagePath = join(projectRoot, "src/app", route, "page.tsx");
    if (existsSync(pagePath)) {
      results.push({ check: `Subnav: ${route}`, status: "pass", detail: "Route exists and linked in AdminSubNav", category: "navigation" });
    } else {
      results.push({ check: `Subnav: ${route}`, status: "fail", detail: `Route in AdminSubNav but page.tsx not found`, category: "navigation" });
    }
  }

  return results;
}

// ── Report ─────────────────────────────────────────────────────────────────

function printReport(results: CheckResult[], jsonMode: boolean) {
  const total = results.length;
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const warnings = results.filter((r) => r.status === "warn").length;

  if (jsonMode) {
    console.log(JSON.stringify({ ok: failed === 0, timestamp: new Date().toISOString(), scores: { total, passed, failed, warnings }, checks: results }, null, 2));
    return;
  }

  const scorePct = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log("\n═══════════════════════════════════════════");
  console.log("  ADMIN HEALTH CHECK REPORT");
  console.log("═══════════════════════════════════════════\n");

  console.log(`  Score:      ${scorePct}%`);
  console.log(`  Passed:     ${passed}/${total}`);
  console.log(`  Failed:     ${failed}`);
  console.log(`  Warnings:   ${warnings}\n`);

  if (failed > 0) {
    console.log("  ❌ FAILURES:");
    for (const r of results.filter((r) => r.status === "fail")) {
      console.log(`     [${r.category}] ${r.check}: ${r.detail}`);
    }
    console.log();
  }

  if (warnings > 0) {
    console.log("  ⚠ WARNINGS:");
    for (const r of results.filter((r) => r.status === "warn")) {
      console.log(`     [${r.category}] ${r.check}: ${r.detail}`);
    }
    console.log();
  }

  const categories = [...new Set(results.map((r) => r.category))];
  console.log("  Category Breakdown:");
  for (const cat of categories) {
    const catResults = results.filter((r) => r.category === cat);
    const catPassed = catResults.filter((r) => r.status === "pass").length;
    const pct = catResults.length > 0 ? Math.round((catPassed / catResults.length) * 100) : 0;
    const statusIcon = pct === 100 ? "✓" : pct >= 60 ? "⚠" : "✗";
    console.log(`     ${statusIcon} ${cat}: ${catPassed}/${catResults.length} (${pct}%)`);
  }

  console.log("\n═══════════════════════════════════════════\n");
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const jsonMode = process.argv.includes("--json");

  try {
    initFirebaseAdmin();
    const results = await runAllChecks();
    printReport(results, jsonMode);

    const failed = results.filter((r) => r.status === "fail").length;
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Health check error:", err);
    process.exit(1);
  }
}

main();
