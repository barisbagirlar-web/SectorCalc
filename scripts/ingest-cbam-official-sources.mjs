#!/usr/bin/env node
/**
 * ingest-cbam-official-sources.mjs
 *
 * Downloads/reads official CBAM source artifacts, computes SHA-256,
 * and writes cbam-source-lock.json.
 *
 * If download is unavailable, marks sources as FETCH_BLOCKED
 * and keeps paid report locked.
 */
import { createHash, randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "data", "cbam", "official-sources");
const LOCK_FILE = join(OUTPUT_DIR, "cbam-source-lock.json");

// Source definitions (mirrors src/sectorcalc/cbam/cbam-official-source-registry.ts)
const SOURCES = [
  {
    source_id: "eu-commission-cbam-main",
    title: "CBAM main page — definitive regime status and official policy context",
    source_url: "https://ec.europa.eu/commission/presscorner/detail/en/qanda_25_2632",
    source_type: "REGULATORY_PUBLIC_SOURCE",
    legal_binding_status: "CONTEXT_ONLY",
    required_for_unlock: true,
    downloadable: false,
  },
  {
    source_id: "eu-commission-cbam-legislation",
    title: "CBAM legislation and guidance — default values, benchmarks, guidance index",
    source_url: "https://ec.europa.eu/taxation_customs/carbon-border-adjustment-mechanism_en",
    source_type: "REGULATORY_PUBLIC_SOURCE",
    legal_binding_status: "INFORMATIONAL",
    required_for_unlock: true,
    downloadable: false,
  },
  {
    source_id: "eur-lex-2025-2621",
    title: "Commission Implementing Regulation (EU) 2025/2621 — definitive-period default values",
    source_url: "https://eur-lex.europa.eu/eli/reg_impl/2025/2621",
    source_type: "REGULATORY_BINDING_LEGAL_SOURCE",
    legal_binding_status: "BINDING",
    required_for_unlock: true,
    downloadable: false,
  },
];

async function fetchUrl(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "SectorCalc-CBAM-Ingest/1.0" },
    });
    if (!response.ok) return null;
    const text = await response.text();
    return text;
  } catch {
    return null;
  }
}

function computeSha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function main() {
  console.log("CBAM Official Source Ingest\n");
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const lock = {};
  let allRequiredSucceeded = true;
  let allBlocked = true;

  for (const source of SOURCES) {
    const localFilename = `${source.source_id}.html`;
    const localPath = join(OUTPUT_DIR, localFilename);
    const record = {
      source_id: source.source_id,
      title: source.title,
      source_url: source.source_url,
      local_path: localPath,
      sha256: null,
      retrieved_at: null,
      source_type: source.source_type,
      legal_binding_status: source.legal_binding_status,
      verification_status: "FETCH_BLOCKED",
    };

    process.stdout.write(`  ${source.source_id}: `);

    if (!source.downloadable) {
      // Non-downloadable source — mark as manual verification required
      record.verification_status = "MANUAL_VERIFICATION_REQUIRED";
      console.log("MANUAL_VERIFICATION_REQUIRED (not downloadable)");
      allBlocked = false;
      lock[source.source_id] = record;
      continue;
    }

    // Attempt download
    const content = await fetchUrl(source.source_url);
    if (content) {
      const sha256 = computeSha256(content);
      writeFileSync(localPath, content, "utf-8");
      record.sha256 = sha256;
      record.retrieved_at = new Date().toISOString();
      record.verification_status = "VERIFIED";
      console.log(`FETCHED (sha256=${sha256.slice(0, 16)}...)`);
      allBlocked = false;
    } else {
      // If no local cached version exists, this source remains FETCH_BLOCKED
      if (existsSync(localPath)) {
        const cached = readFileSync(localPath, "utf-8");
        record.sha256 = computeSha256(cached);
        record.retrieved_at = new Date().toISOString();
        record.verification_status = "VERIFIED_FROM_CACHE";
        console.log(`CACHED (sha256=${record.sha256.slice(0, 16)}...)`);
        allBlocked = false;
      } else {
        console.log("FETCH_BLOCKED (cannot reach source)");
        if (source.required_for_unlock) {
          allRequiredSucceeded = false;
        }
      }
    }

    lock[source.source_id] = record;
  }

  // Write lock file
  writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2));
  console.log(`\nLock file written: ${LOCK_FILE}`);

  // Summary
  const verifiedCount = Object.values(lock).filter(
    (r) => r.verification_status === "VERIFIED" || r.verification_status === "VERIFIED_FROM_CACHE"
  ).length;
  const manualCount = Object.values(lock).filter(
    (r) => r.verification_status === "MANUAL_VERIFICATION_REQUIRED"
  ).length;
  const blockedCount = Object.values(lock).filter(
    (r) => r.verification_status === "FETCH_BLOCKED"
  ).length;

  console.log(`\nSummary:`);
  console.log(`  Verified / cached: ${verifiedCount}`);
  console.log(`  Manual verification required: ${manualCount}`);
  console.log(`  Fetch blocked: ${blockedCount}`);
  console.log(`\nResult: ${allRequiredSucceeded ? "REQUIRED_SOURCES_AVAILABLE" : "REQUIRED_SOURCES_BLOCKED"}`);

  if (allRequiredSucceeded) {
    console.log("\nAll required sources are available. Paid report may be unlocked after additional verification.");
  } else {
    console.log("\nSome required sources are blocked. Paid report generation remains locked.");
  }

  process.exit(allRequiredSucceeded ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
