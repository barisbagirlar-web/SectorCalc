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
 * copy .next/server/ into standalone/.next/server/ and patch
 * server.js so the SSR function can resolve all chunks and pages.
 * Without this, the standalone .next/ directory is empty and
 * all SSR routes fall through to the 404 notFound boundary.
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

  // Patch server.js: fix distDir to "." and dir to parent
  const serverJsPath = join(standaloneDir, "server.js");
  if (existsSync(serverJsPath)) {
    let serverJs = readFileSync(serverJsPath, "utf8");
    // Change distDir from "./.next" to "."
    serverJs = serverJs.replace(/"distDir":"\.\/\.next"/g, '"distDir":"."');
    // Change dir from __dirname to parent (repo root) so distDir="." resolves correctly
    serverJs = serverJs.replace(
      'const dir = path.join(__dirname)',
      'const dir = path.resolve(__dirname, "..", "..", "..", "..", "..")'
    );
    writeFileSync(serverJsPath, serverJs, "utf8");
    console.log(`deploy-production: patched ${serverJsPath}`);
  }

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
    console.log("deploy-production: redeploying patched functions…");
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
  }

  process.exit(0);
} finally {
  if (shimInstalled) {
    restoreNextBin();
  }
  releaseDeployLock();
}
