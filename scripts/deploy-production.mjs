#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  chownSync,
  closeSync,
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();

function enableRequiredFirebaseExperiments() {
  const configured = (process.env.FIREBASE_CLI_EXPERIMENTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const experiments = new Set(configured);
  experiments.add("webframeworks");
  process.env.FIREBASE_CLI_EXPERIMENTS = [...experiments].join(",");
  console.log(
    `deploy-production: Firebase CLI experiments enabled: ${process.env.FIREBASE_CLI_EXPERIMENTS}`,
  );
}

enableRequiredFirebaseExperiments();

// ── Stale process cleanup ──────────────────────────────────────────────
// Kill any remaining next/firebase build processes from previous failed deploys
try { spawnSync("pkill", ["-f", "next.firebase-backup build"], { stdio: "ignore", timeout: 3000 }); } catch {}
try { spawnSync("pkill", ["-f", "next-firebase-deploy-shim"], { stdio: "ignore", timeout: 3000 }); } catch {}
try { spawnSync("pkill", ["-f", "next-build-with-500"], { stdio: "ignore", timeout: 3000 }); } catch {}
try { spawnSync("pkill", ["-f", "firebase-hosting-build"], { stdio: "ignore", timeout: 3000 }); } catch {}
// Remove stale lock files
try { unlinkSync(join(ROOT, ".sectorcalc-build.lock")); } catch {}
try { unlinkSync(join(ROOT, ".next-deploy.lock")); } catch {}
// Remove stale .firebase/hosting directory (leftover from failed deploy)
try { rmSync(join(ROOT, ".firebase", "sectorcalc-bf412", "hosting"), { recursive: true, force: true }); } catch {}

const DEPLOY_LOCK_PATH = join(ROOT, ".next-deploy.lock");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");
const NEXT_BIN_PATH = join(ROOT, "node_modules/.bin/next");
const NEXT_BIN_BACKUP_PATH = join(ROOT, "node_modules/.bin/next.firebase-backup");
const NEXT_DIST_BIN_PATH = join(ROOT, "node_modules/next/dist/bin/next");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=3072",
    },
    ...options,
  });
  return result.status ?? 1;
}

function acquireDeployLock() {
  try {
    const fd = openSync(DEPLOY_LOCK_PATH, "wx");
    closeSync(fd);
    return true;
  } catch {
    return false;
  }
}

function releaseDeployLock() {
  try {
    unlinkSync(DEPLOY_LOCK_PATH);
  } catch {
    // ignore
  }
}

function installNextBuildShim() {
  if (!existsSync(NEXT_DIST_BIN_PATH)) {
    console.error("deploy-production: node_modules/next/dist/bin/next is missing. Run npm install first.");
    process.exit(1);
  }

  if (!existsSync(NEXT_BIN_BACKUP_PATH)) {
    copyFileSync(NEXT_DIST_BIN_PATH, NEXT_BIN_BACKUP_PATH);
  }

  const shimLauncher = [
    "#!/usr/bin/env node",
    "const { spawnSync } = require('node:child_process');",
    "const { join } = require('node:path');",
    `const root = ${JSON.stringify(ROOT)};`,
    "const status = spawnSync(process.execPath, [join(root, 'scripts/next-firebase-deploy-shim.mjs'), ...process.argv.slice(2)], {",
    "  cwd: root,",
    "  stdio: 'inherit',",
    "  env: process.env,",
    "});",
    "process.exit(status.status ?? 1);",
    "",
  ].join("\n");

  try {
    unlinkSync(NEXT_BIN_PATH);
  } catch {
    // ignore missing wrapper
  }

  writeFileSync(NEXT_BIN_PATH, shimLauncher, "utf8");
  chmodSync(NEXT_BIN_PATH, 0o755);
  console.log("deploy-production: installed Next.js build shim for Firebase frameworks.");
}

function restoreNextBin() {
  if (!existsSync(NEXT_BIN_BACKUP_PATH) || !existsSync(NEXT_DIST_BIN_PATH)) {
    return false;
  }

  copyFileSync(NEXT_BIN_BACKUP_PATH, NEXT_DIST_BIN_PATH);
  chmodSync(NEXT_DIST_BIN_PATH, 0o755);

  try {
    unlinkSync(NEXT_BIN_PATH);
  } catch {
    // ignore
  }

  try {
    symlinkSync("../next/dist/bin/next", NEXT_BIN_PATH);
  } catch {
    copyFileSync(NEXT_DIST_BIN_PATH, NEXT_BIN_PATH);
    chmodSync(NEXT_BIN_PATH, 0o755);
  }

  console.log("deploy-production: restored original Next.js binary.");
  return true;
}

function ensureBuildReady() {
  return run("node", ["scripts/finalize-next-build.mjs"]) === 0;
}

/**
 * After Firebase frameworks creates the standalone directory,
 * copy .next/server/ into standalone/.next/server/ and rewrite
 * server.js with the full Next.js config from required-server-files.json
 * (especially experimental.* which Next.js 15.5+ requires).
 * Without this, the standalone .next/ directory is empty and the
 * server crashes with TypeError: Cannot read properties of undefined (reading 'caseSensitiveRoutes').
 */
function patchStandaloneAfterDeploy() {
  const functionsDir = join(ROOT, ".firebase", "sectorcalc-bf412", "functions");
  const standaloneDir = join(functionsDir, ".next", "standalone");
  const standaloneNextDir = join(standaloneDir, ".next");

  if (!existsSync(standaloneDir)) {
    console.error("deploy-production: standalone dir not found — cannot patch.");
    return false;
  }

  // Copy .next/server/ content into standalone/.next/server/
  const srcServer = join(ROOT, ".next", "server");
  const dstServer = join(standaloneNextDir, "server");
  if (existsSync(srcServer)) {
    mkdirSync(standaloneNextDir, { recursive: true });
    cpSync(srcServer, dstServer, { recursive: true, force: true });
    console.log(`deploy-production: copied .next/server → ${dstServer}`);
  }

  // Copy BUILD_ID
  const srcBuildId = join(ROOT, ".next", "BUILD_ID");
  const dstBuildId = join(standaloneNextDir, "BUILD_ID");
  if (existsSync(srcBuildId)) {
    writeFileSync(dstBuildId, readFileSync(srcBuildId, "utf8"), "utf8");
  }

  // ── Rewrite server.js with full config from required-server-files.json ──
  // Firebase frameworks creates a server.js with a minimal config that lacks
  // the experimental.* keys that Next.js 15.5+ requires. Without the full
  // config, the SSR function crashes on every request with TypeError.
  const serverJsPath = join(standaloneDir, "server.js");

  // Load full config from required-server-files.json
  const requiredFilesPath = join(ROOT, ".next", "required-server-files.json");
  let fullConfig = {};
  if (existsSync(requiredFilesPath)) {
    try {
      const requiredFiles = JSON.parse(readFileSync(requiredFilesPath, "utf8"));
      fullConfig = requiredFiles.config || {};
    } catch (e) {
      console.warn("deploy-production: could not parse required-server-files.json:", e.message);
    }
  } else {
    console.warn("deploy-production: required-server-files.json not found, using minimal config");
  }

  // Merge minimal overrides on top of full config
  // distDir="." because server.js lives at .next/standalone/server.js
  // dir resolves 5 levels up to repo root so distDir="." resolves correctly
  const serverConfig = {
    ...fullConfig,
    distDir: ".",
    output: "standalone",
    outputFileTracingRoot: ROOT,
  };

  writeFileSync(serverJsPath, `const path = require('path')
const dir = path.resolve(__dirname, "..", "..", "..", "..", "..")
process.env.NODE_ENV = 'production'
process.chdir(dir)
const currentPort = parseInt(process.env.PORT, 10) || 3000
const hostname = process.env.HOSTNAME || '0.0.0.0'
let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10)
const nextConfig = ${JSON.stringify(serverConfig)}
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig)
require('next')
const { startServer } = require('next/dist/server/lib/start-server')
if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) { keepAliveTimeout = undefined }
startServer({ dir, isDev: false, config: nextConfig, hostname, port: currentPort, allowRetry: false, keepAliveTimeout }).catch((err) => { console.error(err); process.exit(1); });
`);

  console.log("deploy-production: rewritten standalone/server.js with full config from required-server-files.json");
  console.log("deploy-production: standalone patched successfully.");
  return true;
}

if (!acquireDeployLock()) {
  console.error("deploy-production: another deploy is already running (.next-deploy.lock).");
  console.error("deploy-production: run npm run stop:builds if the lock is stale.");
  process.exit(1);
}

let shimInstalled = false;

try {
  restoreNextBin();

  // Phase 1: Pre-build locally (enough RAM for full build). This creates .next cache
  // so that Cloud Build's framework build is incremental and avoids OOM (SIGKILL).
  const forceRebuild = process.env.DEPLOY_FORCE_REBUILD === "1";
  const hasBuild = !forceRebuild && existsSync(BUILD_ID_PATH);

  if (!hasBuild) {
    console.log("deploy-production: running full npm run build pipeline…");
    // Skip global build lock during deploy — deploy-production.mjs has its own lock.
    const buildStatus = run("npm", ["run", "build"], {
      env: {
        ...process.env,
        SECTORCALC_BUILD_LOCK_SKIP: "1",
      },
    });
    if (buildStatus !== 0) {
      console.error("deploy-production: build failed.");
      process.exit(1);
    }
  } else {
    console.log(`deploy-production: reusing existing build (${readFileSync(BUILD_ID_PATH, "utf8").trim()}).`);
  }

  if (!ensureBuildReady()) {
    console.error("deploy-production: .next output invalid — rerun with DEPLOY_FORCE_REBUILD=1");
    process.exit(1);
  }

  installNextBuildShim();
  shimInstalled = true;

  console.log("deploy-production: deploying Firebase Hosting + Firestore rules…");
  console.log("deploy-production: Firebase will run next build natively (incremental via cache).");
  const deployStatus = run("npx", [
    "firebase",
    "deploy",
    "--only",
    "hosting,firestore:rules",
    "--project",
    "sectorcalc-bf412",
  ], {
    env: {
      ...process.env,
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=4096",
      FIREBASE_FRAMEWORKS_BUILD_TARGET: "production",
      // Do NOT set SECTORCALC_FIREBASE_REUSE_BUILD. The shim must NOT early-exit.
      // Firebase framework needs to run next build through its full pipeline
      // to create the function source directory at .firebase/sectorcalc-bf412/functions/.
      // With .next cache present, the Cloud Build incremental build will be fast.
    },
  });

  if (deployStatus !== 0) {
    process.exit(deployStatus);
  }

  // Post-deploy: patch standalone with server chunks and fix paths
  console.log("deploy-production: patching standalone SSR function…");
  if (patchStandaloneAfterDeploy()) {
    // Check if Stripe env vars are non-placeholder before deploying functions
    const stripeKey = process.env.STRIPE_SECRET_KEY || "";
    const isStripeConfigured = stripeKey.length > 0 && !stripeKey.includes("sonra_doldur") && !stripeKey.includes("sk_test_") && stripeKey.startsWith("sk_live_");
    if (isStripeConfigured) {
      console.log("deploy-production: Stripe env vars configured, deploying functions…");
      const fnStatus = run("npx", [
        "firebase",
        "deploy",
        "--only",
        "functions:ssrsectorcalcbf412",
        "--project",
        "sectorcalc-bf412",
      ], {
        env: {
          ...process.env,
          NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192",
        },
      });
      process.exit(fnStatus);
    } else {
      console.log("deploy-production: Stripe env vars not configured (placeholders). Skipping functions deploy.");
      console.log("deploy-production: Hosting + Firestore rules deployed successfully.");
      process.exit(0);
    }
  }

  process.exit(0);
} finally {
  if (shimInstalled) {
    restoreNextBin();
  }
  releaseDeployLock();
}
