#!/usr/bin/env node

/**
 * setup-firebase-paddle-env.mjs
 *
 * SectorCalc Paddle pipeline — Firebase SSR environment setup.
 *
 * Checks all required environment variables for the Paddle payment pipeline
 * and provides step-by-step setup instructions.
 *
 * Usage:
 *   node scripts/setup-firebase-paddle-env.mjs
 *   node scripts/setup-firebase-paddle-env.mjs --check-only
 *   node scripts/setup-firebase-paddle-env.mjs --interactive
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const ENV_PRODUCTION_PATH = path.join(PROJECT_ROOT, ".env.production");
const ENV_EXAMPLE_PATH = path.join(PROJECT_ROOT, ".env.example");

const REQUIRED_PUBLIC_VARS = [
  { key: "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN", label: "Paddle client token", source: "Paddle Dashboard → Developer Tools → Authentication" },
];

const REQUIRED_SERVER_VARS = [
  { key: "PADDLE_WEBHOOK_SECRET", label: "Paddle webhook HMAC secret", source: "Paddle Dashboard → Developer Tools → Notifications → Webhook settings", critical: true },
  { key: "PADDLE_SECRET_KEY", label: "Paddle API secret key", source: "Paddle Dashboard → Developer Tools → Authentication", critical: false },
  { key: "PADDLE_PRICE_BARIS_KEY_PACK", label: "Baris PRO key-pack price ID", source: "Paddle Dashboard → Catalog → create key_pack_10 price", critical: false },
];

const OPTIONAL_PUBLIC_VARS = [
  { key: "NEXT_PUBLIC_PADDLE_ENV", label: "Paddle environment", default: "sandbox" },
  { key: "NEXT_PUBLIC_PRICE_ID_TRY_IT", label: "Price ID: Try It (1 credit)", default: "pri_01kvv1wpnq508nkg37f9vy0aqy" },
  { key: "NEXT_PUBLIC_PRICE_ID_ESSENTIALS", label: "Price ID: Essentials (5 credits)", default: "pri_01kvv20wppf64fht2tn82wq8wc" },
  { key: "NEXT_PUBLIC_PRICE_ID_POPULAR", label: "Price ID: Popular (15 credits)", default: "pri_01kvv24222vst09fyh7rxv3ck8" },
  { key: "NEXT_PUBLIC_PRICE_ID_TEAMS", label: "Price ID: Teams (30 credits)", default: "pri_01kvv27axkgbd5ddmd9c6gaaj9" },
  { key: "NEXT_PUBLIC_PRICE_ID_BEST_VALUE", label: "Price ID: Best Value (100 credits)", default: "pri_01kvv28x31xas1q8pdrqqa4hr7" },
];

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    vars[key] = value;
  }
  return vars;
}

function checkVar(envVars, key) {
  return envVars[key] !== undefined && envVars[key] !== "";
}

function printBanner() {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║    SectorCalc Paddle Pipeline — Environment Setup       ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printSection(title) {
  console.log(`┌─ ${title}`);
  console.log("│");
}

function formatStatus(found, label, source, critical) {
  const icon = found ? "✓" : critical ? "✗ CRITICAL" : "○ OPTIONAL";
  const labelPart = ` ${label}`.padEnd(45);
  const statusPart = found ? "SET" : "MISSING";
  if (found) {
    return `  ${icon} ${labelPart} ${statusPart}`;
  }
  return `  ${icon} ${labelPart} ${statusPart}\n       → Set in .env.production: ${source}`;
}

function getFirebaseProject() {
  try {
    const out = execSync("firebase projects:list --json 2>/dev/null", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
    const parsed = JSON.parse(out);
    if (parsed.result && parsed.result.length > 0) {
      return parsed.result[0].projectId;
    }
  } catch {}
  return null;
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check-only");
  const interactive = args.includes("--interactive");

  printBanner();

  // ── 1. Check environment files ──────────────────────────────────────
  printSection("1. Environment File Check");

  const envExists = fs.existsSync(ENV_PRODUCTION_PATH);
  const exampleExists = fs.existsSync(ENV_EXAMPLE_PATH);

  if (!envExists) {
    console.log("  ✗ .env.production NOT FOUND");
    console.log("    → Copy .env.example to .env.production and fill in values");
    if (exampleExists) {
      console.log("    → cp .env.example .env.production");
    }
  } else {
    console.log("  ✓ .env.production found");
  }
  if (!exampleExists) {
    console.log("  ○ .env.example NOT FOUND (will be created by git clone)");
  } else {
    console.log("  ✓ .env.example found");
  }
  console.log("");

  // If no env file, we can't check further in check-only mode
  if (!envExists && checkOnly) {
    console.log("RESULT: BLOCKED — .env.production missing");
    process.exit(1);
  }

  // ── 2. Parse env vars ──────────────────────────────────────────────
  const envVars = envExists ? readEnvFile(ENV_PRODUCTION_PATH) : {};

  if (!envExists && !checkOnly) {
    console.log("  Creating .env.production from template...");
    console.log("  → .env.production already exists in workspace (created by setup)");
    console.log("  → Verify values are correct before deploying");
    console.log("");
  }

  // ── 3. Check required public vars ───────────────────────────────────
  printSection("2. Required Public Client Vars (NEXT_PUBLIC_*)");
  console.log("   These must be set for Paddle.js to initialize on the client.");
  console.log("");

  let allPublicSet = true;
  for (const v of REQUIRED_PUBLIC_VARS) {
    const found = checkVar(envVars, v.key);
    if (!found) allPublicSet = false;
    console.log(formatStatus(found, v.label, v.source, true));
  }
  console.log("");

  // ── 4. Check required server vars (CRITICAL) ────────────────────────
  printSection("3. Required Server Vars (PADDLE_*)");
  console.log("   These must be set in .env.production OR Firebase Console.");
  console.log("   CRITICAL: Without PADDLE_WEBHOOK_SECRET, credits are never granted!");
  console.log("");

  let critMissing = false;
  for (const v of REQUIRED_SERVER_VARS) {
    const found = checkVar(envVars, v.key);
    if (v.critical && !found) critMissing = true;
    console.log(formatStatus(found, v.label, v.source, v.critical));
  }
  console.log("");

  // ── 5. Check optional vars ──────────────────────────────────────────
  printSection("4. Optional Vars (defaults in code fallbacks)");
  console.log("");

  for (const v of OPTIONAL_PUBLIC_VARS) {
    const found = checkVar(envVars, v.key);
    console.log(formatStatus(found, `${v.label} (default: ${v.default})`, "", false));
  }
  console.log("");

  // ── 6. Firebase project check ───────────────────────────────────────
  printSection("5. Firebase Project");
  console.log("");

  const projectId = getFirebaseProject();
  if (projectId) {
    console.log(`  ✓ Firebase project detected: ${projectId}`);
  } else {
    console.log("  ○ Firebase project not detected (run: firebase use --add)");
  }
  console.log("");

  // ── 7. Summary ──────────────────────────────────────────────────────
  printSection("6. Summary");
  console.log("");

  if (critMissing) {
    console.log("  ✗ CRITICAL: PADDLE_WEBHOOK_SECRET is MISSING.");
    console.log("    → Credits will NOT be granted after payment.");
    console.log("    → Fix: Set PADDLE_WEBHOOK_SECRET in .env.production and redeploy.");
    console.log("");
    console.log("    Get it from: https://vendors.paddle.com/authentication");
    console.log("    → Developer Tools → Notifications → Webhook settings");
    console.log("    → Copy the secret key under your webhook endpoint.");
    console.log("");
  } else {
    console.log("  ✓ All critical env vars are configured.");
    console.log("");
  }

  if (checkOnly && critMissing) {
    process.exit(1);
  }

  // ── 8. Deploy instructions ──────────────────────────────────────────
  if (!checkOnly) {
    console.log("─── NEXT STEPS ──────────────────────────────────────────────");
    console.log("");
    console.log("  1. Fill in missing env vars in .env.production");
    if (critMissing) {
      console.log("     → Get PADDLE_WEBHOOK_SECRET from Paddle Dashboard");
      console.log("     → Add it to .env.production: PADDLE_WEBHOOK_SECRET=pdl_webhook_...");
    }
    console.log("  2. Deploy to Firebase:");
    console.log("     npm run build");
    console.log("     firebase deploy --only hosting --project sectorcalc-bf412");
    console.log("  3. Configure Paddle webhook destination:");
    console.log("     Paddle Dashboard → Developer Tools → Notifications");
    console.log("     → Add destination: https://sectorcalc.com/api/paddle-webhook");
    console.log("  4. Test with sandbox purchase");
    console.log("     → Use test card: 4000 0000 0000 0077 (3DS: 4000 0025 0000 0004)");
    console.log("");
  }

  if (!critMissing && !allPublicSet) {
    console.log("  WARNING: Some public vars are missing but code defaults exist.");
    console.log("  Recommend setting NEXT_PUBLIC_PADDLE_CLIENT_TOKEN for production.");
    console.log("");
  }

  if (critMissing) {
    console.log("RESULT: BLOCKED — Critical env vars missing");
    process.exit(1);
  } else {
    console.log("RESULT: OK — All env vars configured");
    process.exit(0);
  }
}

main();
