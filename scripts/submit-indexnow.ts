#!/usr/bin/env npx tsx
/**
 * Submit indexable URLs to IndexNow (Bing, Yandex, etc.).
 *
 * Env:
 *   INDEXNOW_KEY   — required for submission; exits 0 with warning if missing
 *   SITE_HOST      — default sectorcalc.com (or NEXT_PUBLIC_SITE_URL)
 *   INDEXNOW_MODE  — all (default) | priority | en-tr
 *   INDEXNOW_VERIFY_KEY — set to 1 to GET key file before submit
 *
 * Modes:
 *   all       — en, tr, de, fr, es, ar (~21k, auto-batched at 9500/request)
 *   priority  — critical + high URLs all six locales (~438)
 *   en-tr     — English + Turkish only (~7k, legacy fast path)
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  resolveIndexNowSubmitMode,
  submitIndexNowManifest,
} from "../src/lib/seo/indexnow-submit";

async function main(): Promise<void> {
  const key = process.env.INDEXNOW_KEY?.trim();

  if (!key) {
    console.warn(
      "INDEXNOW_KEY not set — skipping IndexNow submission. See docs/indexnow-setup.md",
    );
    process.exit(0);
  }

  const mode = resolveIndexNowSubmitMode(process.env.INDEXNOW_MODE);
  const keyFile = join(process.cwd(), "public", `${key}.txt`);

  if (!existsSync(keyFile) && process.env.INDEXNOW_KEY_FILE_OPTIONAL !== "1") {
    console.warn(
      `Note: public/${key}.txt not found locally. Production may serve the key via INDEXNOW_KEY env + /api/indexnow-verification.`,
    );
    console.warn(
      "Set INDEXNOW_KEY_FILE_OPTIONAL=1 to silence, or INDEXNOW_VERIFY_KEY=1 to verify live key URL.",
    );
  }

  const summary = await submitIndexNowManifest({ key, mode });

  if (summary.totalUrls === 0) {
    console.error("IndexNow failed — URL list is empty. Run npm run seo:export-manifest first.");
    process.exit(1);
  }

  console.log(`IndexNow mode: ${summary.mode}`);
  console.log(`Host: ${summary.host}`);
  console.log(`Key location: ${summary.keyLocation}`);
  console.log(`URLs: ${summary.totalUrls} across ${summary.batchCount} batch(es)`);

  for (const batch of summary.batches) {
    const label =
      summary.batchCount > 1
        ? `Batch ${batch.batchIndex}/${summary.batchCount}`
        : "Batch";
    if (batch.ok) {
      console.log(`${label} OK — ${batch.urlCount} URLs (HTTP ${batch.status ?? 200})`);
    } else {
      console.error(`${label} FAILED — HTTP ${batch.status ?? "network"}`);
      if (batch.responseText) {
        console.error(batch.responseText);
      }
    }
  }

  if (summary.ok) {
    console.log(`IndexNow OK — submitted ${summary.totalUrls} URLs total`);
    process.exit(0);
  }

  console.error("IndexNow failed — see batch errors above");
  process.exit(1);
}

void main();
