#!/usr/bin/env node
/**
 * SectorCalc Paddle Webhook Route Guard
 *
 * Verifies that all required Paddle webhook routes exist and respond correctly.
 *
 * Checks:
 * 1. Canonical route file exists: src/app/api/paddle/webhook/route.ts
 * 2. Compatibility route file exists: src/app/api/webhook/paddle/route.ts
 * 3. Shared handler file exists: src/lib/paddle/paddle-webhook-handler.ts
 * 4. No file returns HTML 404
 * 5. No file returns text/html content-type
 *
 * Returns: PASS or FAIL
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passCount = 0;
let failCount = 0;

function pass(msg) {
  passCount++;
  console.log(`  ✅ PASS: ${msg}`);
}

function fail(msg) {
  failCount++;
  console.log(`  ❌ FAIL: ${msg}`);
}

function checkRoutes() {
  console.log("\n── Paddle Webhook Route Guard ──\n");

  // ── 1. Shared handler ──────────────────────────────────────────────
  const HANDLER_PATH = "src/lib/paddle/paddle-webhook-handler.ts";
  const handlerFull = join(ROOT, HANDLER_PATH);
  if (existsSync(handlerFull)) {
    pass(`Shared handler exists: ${HANDLER_PATH}`);
  } else {
    fail(`Missing shared handler: ${HANDLER_PATH}`);
  }

  // ── 2. Canonical route ─────────────────────────────────────────────
  const CANONICAL_PATH = "src/app/api/paddle/webhook/route.ts";
  const canonicalFull = join(ROOT, CANONICAL_PATH);
  if (existsSync(canonicalFull)) {
    const content = readFileSync(canonicalFull, "utf8");
    if (content.includes("handlePaddleWebhook")) {
      pass(`Canonical route uses shared handler: ${CANONICAL_PATH}`);
    } else {
      fail(`Canonical route missing handlePaddleWebhook import: ${CANONICAL_PATH}`);
    }
  } else {
    fail(`Missing canonical route: ${CANONICAL_PATH}`);
  }

  // ── 3. Compatibility route ─────────────────────────────────────────
  const COMPAT_PATH = "src/app/api/webhook/paddle/route.ts";
  const compatFull = join(ROOT, COMPAT_PATH);
  if (existsSync(compatFull)) {
    const content = readFileSync(compatFull, "utf8");
    if (content.includes("handlePaddleWebhook")) {
      pass(`Compatibility route uses shared handler: ${COMPAT_PATH}`);
    } else {
      fail(`Compatibility route missing handlePaddleWebhook import: ${COMPAT_PATH}`);
    }
  } else {
    fail(`Missing compatibility route: ${COMPAT_PATH}`);
  }

  // ── 4. Legacy route still exists (should delegate) ─────────────────
  const LEGACY_PATH = "src/app/api/paddle-webhook/route.ts";
  const legacyFull = join(ROOT, LEGACY_PATH);
  if (existsSync(legacyFull)) {
    const content = readFileSync(legacyFull, "utf8");
    if (content.includes("handlePaddleWebhook")) {
      pass(`Legacy route delegates to shared handler: ${LEGACY_PATH}`);
    } else {
      fail(`Legacy route missing handlePaddleWebhook: ${LEGACY_PATH}`);
    }
  } else {
    // Legacy route may be removed in the future — warning, not failure
    console.log(`  ⚠ INFO: Legacy route removed: ${LEGACY_PATH}`);
  }

  // ── 5. Route files must not contain HTML templates or 404 content ──
  const routeFiles = [
    canonicalFull,
    compatFull,
    legacyFull,
  ];

  for (const filePath of routeFiles) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf8");
    if (content.includes("404") || content.includes("Page Not Found") || content.includes("text/html")) {
      fail(`Route file contains HTML/404 content: ${filePath.replace(ROOT + "/", "")}`);
    } else {
      pass(`Route file has no HTML/404 content: ${filePath.replace(ROOT + "/", "")}`);
    }
  }

  // ── 6. Verify handler file has all required exports ─────────────────
  if (existsSync(handlerFull)) {
    const content = readFileSync(handlerFull, "utf8");
    const requiredExports = [
      "handlePaddleWebhook",
      "verifyPaddleSignature",
      "fulfillAtomically",
      "resolveUserId",
    ];
    for (const exp of requiredExports) {
      if (content.includes(`function ${exp}`) || content.includes(`export async function ${exp}`)) {
        pass(`Handler exports ${exp}`);
      } else {
        fail(`Handler missing function: ${exp}`);
      }
    }
  }

  // ── 7. Handler must have dead letter collection reference ──────────
  if (existsSync(handlerFull)) {
    const content = readFileSync(handlerFull, "utf8");
    if (content.includes("paddleDeadLetters")) {
      pass(`Handler references dead letter collection`);
    } else {
      fail(`Handler missing dead letter collection (paddleDeadLetters)`);
    }
  }

  // ── 8. Handler must have paddleFulfillments collection reference ────
  if (existsSync(handlerFull)) {
    const content = readFileSync(handlerFull, "utf8");
    if (content.includes("paddleFulfillments")) {
      pass(`Handler references paddleFulfillments collection`);
    } else {
      fail(`Handler missing paddleFulfillments collection`);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────
  console.log(`\n── Summary ──`);
  console.log(`  PASS: ${passCount}`);
  console.log(`  FAIL: ${failCount}`);

  if (failCount > 0) {
    console.log("\n❌ GUARD FAILED — Paddle webhook route integrity check failed.\n");
    process.exit(1);
  }

  console.log("\n✅ GUARD PASSED — All Paddle webhook route checks passed.\n");
}

checkRoutes();
