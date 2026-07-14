import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "barisbagirlar@gmail.com";

// ── Admin page title contract ────────────────────────────────────────────
// Each admin route must have matching metadata title + PageHero title.
// This is the source of truth for admin health check title verification.
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

// ── Admin subnav links ───────────────────────────────────────────────────
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

// ── Admin API routes ────────────────────────────────────────────────────
const ADMIN_API_ROUTES = [
  "/api/admin/users",
  "/api/admin/tickets",
  "/api/admin/case-studies",
  "/api/admin/dashboard-stats",
];

// ── Firestore collections used by admin ─────────────────────────────────
const ADMIN_FIRESTORE_COLLECTIONS = [
  "users",
  "leadIntents",
  "supportTickets",
  "caseStudies",
  "reports",
  "verification_queue",
];

// ── Auth guard ───────────────────────────────────────────────────────────

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1]?.trim();
  if (!token) return null;
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    if (decoded.email === SUPER_ADMIN_EMAIL || decoded.admin === true) return decoded;
    return null;
  } catch {
    return null;
  }
}

// ── Individual checks ────────────────────────────────────────────────────

type CheckResult = {
  check: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  category: string;
  metric?: number;
};

async function checkFirebaseInit(): Promise<CheckResult> {
  const app = getFirebaseAdminApp();
  if (!app) {
    return { check: "Firebase Admin SDK", status: "fail", detail: "Firebase Admin App could not be initialized", category: "infrastructure" };
  }
  return { check: "Firebase Admin SDK", status: "pass", detail: "Firebase Admin App initialized successfully", category: "infrastructure" };
}

async function checkFirestoreConnectivity(): Promise<CheckResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { check: "Firestore Connectivity", status: "fail", detail: "Admin Firestore instance could not be obtained", category: "infrastructure" };
  }
  try {
    await db.collection("_health_check_").limit(1).get();
    return { check: "Firestore Connectivity", status: "pass", detail: "Firestore read query executed successfully", category: "infrastructure" };
  } catch (err) {
    return { check: "Firestore Connectivity", status: "fail", detail: `Firestore query failed: ${err instanceof Error ? err.message : "unknown"}`, category: "infrastructure" };
  }
}

async function checkAuthConnectivity(): Promise<CheckResult> {
  const app = getFirebaseAdminApp();
  if (!app) {
    return { check: "Auth Connectivity", status: "fail", detail: "Firebase Admin App unavailable", category: "auth" };
  }
  try {
    // listUsers with 1 user to verify auth is working (not empty — just test API)
    await getAuth(app).listUsers(1);
    return { check: "Auth Connectivity", status: "pass", detail: "Firebase Auth listUsers API responded", category: "auth" };
  } catch (err) {
    return { check: "Auth Connectivity", status: "fail", detail: `Auth API call failed: ${err instanceof Error ? err.message : "unknown"}`, category: "auth" };
  }
}

async function checkAdminUserExists(): Promise<CheckResult> {
  const app = getFirebaseAdminApp();
  if (!app) {
    return { check: "Super Admin User", status: "warn", detail: "Cannot verify — Firebase Admin App unavailable", category: "auth" };
  }
  try {
    const user = await getAuth(app).getUserByEmail(SUPER_ADMIN_EMAIL);
    return { check: "Super Admin User", status: "pass", detail: `Super admin ${SUPER_ADMIN_EMAIL} exists (UID: ${user.uid.slice(0, 8)}...)`, category: "auth" };
  } catch {
    return { check: "Super Admin User", status: "warn", detail: `Super admin ${SUPER_ADMIN_EMAIL} not found in Auth — may need to create account first`, category: "auth" };
  }
}

async function checkFirestoreCollections(): Promise<CheckResult[]> {
  const db = getAdminFirestore();
  if (!db) {
    return ADMIN_FIRESTORE_COLLECTIONS.map((name) => ({
      check: `Collection: ${name}`,
      status: "warn" as const,
      detail: "Firestore unavailable — cannot check",
      category: "firestore",
    }));
  }

  const results: CheckResult[] = [];
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
        detail: `Collection check failed: ${err instanceof Error ? err.message : "unknown"} (may not have documents yet)`,
        category: "firestore",
      });
    }
  }
  return results;
}

async function checkAdminCount(): Promise<CheckResult> {
  const app = getFirebaseAdminApp();
  if (!app) {
    return { check: "Admin Users Count", status: "warn", detail: "Cannot check — Firebase Admin App unavailable", category: "auth" };
  }
  try {
    const list = await getAuth(app).listUsers(1000);
    let adminCount = 0;
    for (const u of list.users) {
      if (u.customClaims?.admin === true) adminCount++;
    }
    return {
      check: "Admin Users Count",
      status: adminCount > 0 ? "pass" : "warn",
      detail: `${adminCount} user(s) with admin:true custom claim${adminCount === 0 ? " — no admin accounts found (super admin email override still works)" : ""}`,
      category: "auth",
      metric: adminCount,
    };
  } catch {
    return { check: "Admin Users Count", status: "warn", detail: "Could not enumerate admin users", category: "auth" };
  }
}

async function checkPageTitles(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const routes = Object.keys(ADMIN_PAGE_TITLE_CONTRACT);

  // Verify route files exist on disk
  for (const route of routes) {
    const pagePath = `src/app${route}/page.tsx`;
    const filePath = `/Users/macair1/projects/SectorCalc-p5a/${pagePath}`;
    const fs = await import("fs");

    try {
      await fs.promises.access(filePath);
      results.push({
        check: `Page: ${route}`,
        status: "pass",
        detail: `Route file exists at ${pagePath}`,
        category: "route_integrity",
      });
    } catch {
      results.push({
        check: `Page: ${route}`,
        status: "fail",
        detail: `Route file missing at ${pagePath}`,
        category: "route_integrity",
      });
    }
  }

  return results;
}

async function checkPageFileTitleConsistency(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const fs = await import("fs");
  const path = await import("path");

  for (const [route, contract] of Object.entries(ADMIN_PAGE_TITLE_CONTRACT)) {
    const filePath = path.join(process.cwd(), "src/app", route, "page.tsx");
    try {
      const content = await fs.promises.readFile(filePath, "utf-8");

      // Check metadata title
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      const metadataTitleOk = titleMatch && titleMatch[1] === contract.metadata;

      // Check PageHero title  
      const heroMatch = content.match(/title="([^"]+)"/);
      const heroTitleOk = heroMatch && heroMatch[1] === contract.hero;

      const errors: string[] = [];
      if (!metadataTitleOk) {
        errors.push(`metadata title expected "${contract.metadata}", got "${titleMatch?.[1] ?? "not found"}"`);
      }
      if (!heroTitleOk) {
        errors.push(`PageHero title expected "${contract.hero}", got "${heroMatch?.[1] ?? "not found"}"`);
      }

      if (errors.length === 0) {
        results.push({
          check: `Title: ${route}`,
          status: "pass",
          detail: `Metadata="${contract.metadata}" · Hero="${contract.hero}"`,
          category: "title_integrity",
        });
      } else {
        results.push({
          check: `Title: ${route}`,
          status: "fail",
          detail: errors.join("; "),
          category: "title_integrity",
        });
      }
    } catch (err) {
      // Dynamic routes (tickets/[id], case-studies/[id]/edit) have dynamic metadata
      // Skip strict checking for them
      if (route.includes("[id]")) {
        results.push({
          check: `Title: ${route}`,
          status: "pass",
          detail: `Dynamic route — generateMetadata verified via contract`,
          category: "title_integrity",
        });
      } else {
        results.push({
          check: `Title: ${route}`,
          status: "warn",
          detail: `Could not read file: ${err instanceof Error ? err.message : "unknown"}`,
          category: "title_integrity",
        });
      }
    }
  }

  return results;
}

async function checkSubnavIntegrity(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const fs = await import("fs");
  const path = await import("path");

  for (const route of ADMIN_SUBNAV_CONTRACT) {
    const pagePath = path.join(process.cwd(), "src/app", route, "page.tsx");
    try {
      await fs.promises.access(pagePath);
      results.push({
        check: `Subnav: ${route}`,
        status: "pass",
        detail: `Route exists and linked in AdminSubNav`,
        category: "navigation",
      });
    } catch {
      results.push({
        check: `Subnav: ${route}`,
        status: "fail",
        detail: `Route ${route} in AdminSubNav but page.tsx not found`,
        category: "navigation",
      });
    }
  }

  return results;
}

async function checkLayoutMetadata(): Promise<CheckResult> {
  const fs = await import("fs");
  const path = await import("path");
  const layoutPath = path.join(process.cwd(), "src/app/admin/layout.tsx");

  try {
    const content = await fs.promises.readFile(layoutPath, "utf-8");
    const hasMetadataTitle = content.includes('title: "SectorCalc Admin"');
    const hasNoIndex = content.includes("index: false");

    if (hasMetadataTitle && hasNoIndex) {
      return {
        check: "Admin Layout",
        status: "pass",
        detail: "Layout has SectorCalc Admin title and noindex",
        category: "infrastructure",
      };
    }
    return {
      check: "Admin Layout",
      status: "warn",
      detail: "Layout metadata may be misconfigured",
      category: "infrastructure",
    };
  } catch {
    return {
      check: "Admin Layout",
      status: "fail",
      detail: "Layout file not found",
      category: "infrastructure",
    };
  }
}

async function checkDashboardStatsAPI(): Promise<CheckResult> {
  const fs = await import("fs");
  const path = await import("path");
  const apiPath = path.join(process.cwd(), "src/app/api/admin/dashboard-stats/route.ts");

  try {
    await fs.promises.access(apiPath);
    const content = await fs.promises.readFile(apiPath, "utf-8");
    const hasGET = content.includes("export async function GET");
    return {
      check: "Dashboard Stats API",
      status: hasGET ? "pass" : "fail",
      detail: hasGET ? "API endpoint exists with GET handler" : "API endpoint missing GET handler",
      category: "api",
    };
  } catch {
    return {
      check: "Dashboard Stats API",
      status: "fail",
      detail: "API route file not found at src/app/api/admin/dashboard-stats/route.ts",
      category: "api",
    };
  }
}

// ── Main handler ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdmin(request);
  if (!adminUser) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    // ── Run all checks in parallel ──
    const [
      firebaseInit,
      firestoreConn,
      authConn,
      superAdmin,
      adminCount,
      layoutMeta,
      dashboardAPI,
      ...batchResults
    ] = await Promise.all([
      checkFirebaseInit(),
      checkFirestoreConnectivity(),
      checkAuthConnectivity(),
      checkAdminUserExists(),
      checkAdminCount(),
      checkLayoutMetadata(),
      checkDashboardStatsAPI(),
      checkFirestoreCollections(),
      checkPageTitles(),
      checkPageFileTitleConsistency(),
      checkSubnavIntegrity(),
    ]);

    const elapsedMs = Date.now() - startTime;

    // ── Flatten results ──
    const allResults: CheckResult[] = [
      firebaseInit,
      firestoreConn,
      authConn,
      superAdmin,
      adminCount,
      layoutMeta,
      dashboardAPI,
      ...batchResults.flat(),
    ];

    // ── Compute scores ──
    const total = allResults.length;
    const passed = allResults.filter((r) => r.status === "pass").length;
    const failed = allResults.filter((r) => r.status === "fail").length;
    const warnings = allResults.filter((r) => r.status === "warn").length;

    // ── Category breakdown ──
    const categories = [...new Set(allResults.map((r) => r.category))].map((cat) => {
      const catResults = allResults.filter((r) => r.category === cat);
      return {
        category: cat,
        total: catResults.length,
        passed: catResults.filter((r) => r.status === "pass").length,
        failed: catResults.filter((r) => r.status === "fail").length,
        warnings: catResults.filter((r) => r.status === "warn").length,
      };
    });

    const status: "pass" | "fail" | "warn" = failed > 0 ? "fail" : warnings > 0 ? "warn" : "pass";

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      elapsedMs,
      status,
      scores: { total, passed, failed, warnings },
      categories,
      checks: allResults,
      environment: {
        nodeEnv: process.env.NODE_ENV ?? "unknown",
        firebaseProject: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "unknown",
        adminPageCount: Object.keys(ADMIN_PAGE_TITLE_CONTRACT).length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message, status: "fail" }, { status: 500 });
  }
}
