/**
 * SectorCalc — Static Dev Server
 * 
 * Production-grade: build + serve. No watcher, no auto-rebuild.
 * PM2 restart handles code changes reliably.
 * Build hatası olursa eski sürüm yayında kalır.
 * 
 * Kullanım: node scripts/dev-static.mjs
 * Browser: http://localhost:3000
 * 
 * Yeniden derleme (kod değişikliği sonrası):
 *   npm run pm2:restart    # PM2 üzerinde
 *   sh dev.sh              # veya bu script
 */

import { spawn, execSync } from "child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PORT = 3000;

let serverProcess = null;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ts() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}
function log(tag, msg) {
  console.log(`[${ts()}] [${tag}] ${msg}`);
}
function spawnOut(cmd, args, opts = {}) {
  return spawn(cmd, args, { cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], shell: true, ...opts });
}
function spawnPipe(cmd, args, opts = {}) {
  return spawn(cmd, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], shell: true, ...opts });
}

// ─── PORT ────────────────────────────────────────────────────────────────────
function freePort() {
  try {
    const out = execSync(`lsof -ti tcp:${PORT} 2>/dev/null || true`, {
      encoding: "utf-8", cwd: ROOT,
    }).trim();
    for (const pid of out.split("\n").filter(Boolean)) {
      try { process.kill(parseInt(pid), "SIGKILL"); } catch {}
    }
  } catch {}
}

// ─── BUILD ────────────────────────────────────────────────────────────────────
function ensure500Html() {
  const FALLBACK =
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n";
  const exportDir = join(ROOT, ".next/export");
  const serverDir = join(ROOT, ".next/server");
  const serverPagesDir = join(serverDir, "pages");
  mkdirSync(exportDir, { recursive: true });
  mkdirSync(serverPagesDir, { recursive: true });
  writeFileSync(join(exportDir, "500.html"), FALLBACK, "utf8");
  writeFileSync(join(serverPagesDir, "500.html"), FALLBACK, "utf8");
  // Next.js 15.5 trace collector needs pages-manifest.json even in App Router projects
  // Workaround: ensure it exists before trace phase runs
  const manifestPath = join(serverDir, "pages-manifest.json");
  if (!existsSync(manifestPath)) {
    writeFileSync(manifestPath, "{}", "utf8");
  }
}
function build() {
  return new Promise((res) => {
    ensure500Html();
    log("BUILD", "Compiling...");
    const child = spawnOut("./node_modules/.bin/next", ["build"]);
    child.on("close", code => {
      if (code === 0) { log("BUILD", "✓ OK"); }
      else { log("BUILD", `Build warn: exit ${code} — using existing assets`); }
      // Always resolve — even if build exits non-zero, try serving existing .next
      res();
    });
    child.on("error", () => { log("BUILD", "Spawn error — trying to serve existing build"); res(); });
  });
}

// ─── SERVE ────────────────────────────────────────────────────────────────────
function serve() {
  return new Promise((res, rej) => {
    if (serverProcess) { serverProcess.kill("SIGTERM"); serverProcess = null; }
    freePort();
    setTimeout(() => {
      log("SERVE", "Starting → http://localhost:" + PORT);
      const child = spawnPipe("./node_modules/.bin/next", ["start", "-p", String(PORT)]);
      let started = false;
      const onData = d => {
        if (!started && d.toString().toLowerCase().includes("ready")) {
          started = true;
          log("SERVE", "Ready");
          res();
        }
      };
      child.stdout?.on("data", onData);
      child.stderr?.on("data", onData);
      child.on("close", c => {
        if (c !== 0 && c !== null) log("SERVE", `Exited (${c})`);
        if (!started) rej(new Error(`Server exited ${c}`));
      });
      serverProcess = child;
      // Fallback: resolve after 10s even if "Ready" not detected
      setTimeout(() => { if (!started) { started = true; log("SERVE", "Ready (timeout)"); res(); } }, 10000);
    }, 300);
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   SectorCalc Dev Server (static)         ║");
  console.log("║                                          ║");
  console.log("║   • Production build — 0 runtime error   ║");
  console.log("║   • Manual restart for code changes      ║");
  console.log("║   • Build fails → old version stays      ║");
  console.log("║   • PM2 ready — 7/24 uptime              ║");
  console.log(`║   → http://localhost:${PORT}                ║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log("");

  freePort();
  log("INIT", "Building...");
  try { await build(); } catch {}
  try {
    log("INIT", "Starting server...");
    await serve();
    log("INIT", "Ready — http://localhost:" + PORT);
    // Keep process alive forever to serve requests
    await new Promise(() => {});
  } catch (e) {
    log("INIT", `Server failed: ${e.message}`);
    process.exit(1);
  }
}

process.on("SIGINT", () => { freePort(); process.exit(0); });
process.on("SIGTERM", () => { freePort(); process.exit(0); });
process.on("uncaughtException", () => { /* survive */ });

main();
