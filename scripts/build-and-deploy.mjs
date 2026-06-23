#!/usr/bin/env node
/**
 * Build (with DNS fix + SSG limit) then deploy to Firebase Hosting.
 * Restores the real Next.js binary after deploy.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, chmodSync, existsSync, unlinkSync, symlinkSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const NEXT_DIST_BIN = join(ROOT, "node_modules/next/dist/bin/next");
const NEXT_BIN = join(ROOT, "node_modules/.bin/next");
const BACKUP = join(ROOT, "node_modules/.bin/next.firebase-backup");
const BUILD_ID_PATH = join(ROOT, ".next/BUILD_ID");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

function installShim() {
  if (!existsSync(BACKUP)) {
    copyFileSync(NEXT_DIST_BIN, BACKUP);
    chmodSync(BACKUP, 0o755);
  }
  const shim = [
    `#!/usr/bin/env node`,
    `"use strict";`,
    `if (process.env.SECTORCALC_SHIM_REAL_NEXT) {`,
    `  const {spawnSync}=require("child_process");`,
    `  const {existsSync}=require("fs");`,
    `  const ROOT=${JSON.stringify(ROOT)};`,
    `  const backup=join(ROOT,"node_modules/.bin/next.firebase-backup");`,
    `  if(existsSync(backup)){`,
    `    const s=spawnSync(process.execPath,[backup,...process.argv.slice(2)],{cwd:ROOT,stdio:"inherit",env:process.env});`,
    `    process.exit(s.status??1);`,
    `  }`,
    `}`,
    `const {spawnSync}=require("child_process");`,
    `const {existsSync}=require("fs");`,
    `const {join}=require("path");`,
    `const ROOT=${JSON.stringify(ROOT)};`,
    `const args=process.argv.slice(2);`,
    `if(args[0]==="build"){`,
    `  const s=spawnSync(process.execPath,[join(ROOT,"scripts/next-firebase-deploy-shim.mjs"),...args],{`,
    `    cwd:ROOT,stdio:"inherit",env:{...process.env,NODE_OPTIONS:process.env.NODE_OPTIONS||"--max-old-space-size=8192 --dns-result-order=ipv4first"`,
    `  }}).status;`,
    `  process.exit(s??1);`,
    `}`,
    `const backup=join(ROOT,"node_modules/.bin/next.firebase-backup");`,
    `if(existsSync(backup)){`,
    `  const s=spawnSync(process.execPath,[backup,...args],{cwd:ROOT,stdio:"inherit"});`,
    `  process.exit(s.status??1);`,
    `}`,
    `console.error("next-shim: real Next.js binary not found");`,
    `process.exit(1);`,
    ``,
  ].join("\n");
  try { unlinkSync(NEXT_BIN); } catch {}
  writeFileSync(NEXT_BIN, shim, "utf8");
  chmodSync(NEXT_BIN, 0o755);
  console.log("build-and-deploy: shim installed.");
}

function restoreBinary() {
  if (!existsSync(BACKUP) || !existsSync(NEXT_DIST_BIN)) return;
  copyFileSync(BACKUP, NEXT_DIST_BIN);
  chmodSync(NEXT_DIST_BIN, 0o755);
  try { unlinkSync(NEXT_BIN); } catch {}
  try { symlinkSync("../next/dist/bin/next", NEXT_BIN); } catch { copyFileSync(NEXT_DIST_BIN, NEXT_BIN); chmodSync(NEXT_BIN,0o755); }
  console.log("build-and-deploy: restored original Next.js binary.");
}

// Step 1: Build with retry (handles manifest race condition in Next.js 15.5)
console.log("build-and-deploy: building (with retry)...");
run("node", ["scripts/next-build-with-500-fallback.mjs"], {
  env: {
    ...process.env,
    NODE_OPTIONS: "--max-old-space-size=8192 --dns-result-order=ipv4first",
    SECTORCALC_FAST_PREVIEW_STATIC: "1",
  },
});

if (!existsSync(BUILD_ID_PATH)) {
  console.error("build-and-deploy: build did not produce BUILD_ID");
  process.exit(1);
}
console.log(`build-and-deploy: build OK (BUILD_ID=${readFileSync(BUILD_ID_PATH,"utf8").trim()})`);

// Step 2: Finalize + Validate
run("node", ["scripts/finalize-next-build.mjs"]);
run("node", ["scripts/validate-next-build.mjs"]);
console.log("build-and-deploy: build validated OK.");

// Step 3: Install shim then deploy
installShim();
console.log("build-and-deploy: deploying to Firebase...");
const deployStatus = spawnSync("firebase", ["deploy", "--only", "hosting", "--project", "sectorcalc-bf412"], {
  cwd: ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=8192 --dns-result-order=ipv4first",
    SECTORCALC_FIREBASE_REUSE_BUILD: "1",
  },
}).status ?? 1;

// Step 4: Restore binary
restoreBinary();

process.exit(deployStatus);
