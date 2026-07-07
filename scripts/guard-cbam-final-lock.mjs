#!/usr/bin/env node
/**
 * guard-cbam-final-lock.mjs
 *
 * Fails if:
 * - CBAM paid report path uses placeholder config
 * - CBAM_CONFIG_VERIFICATION_STATUS is illustrative while paid report enabled
 * - source lock is missing while paid report enabled
 * - Regulation (EU) 2025/2621 source is missing
 * - source hashes are missing
 * - audit/golden fixture is missing for enabled paid report
 * - /en or locale route created
 * - formula expressions leak
 */
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let violations = 0;
let checks = 0;

function check(label, condition, detail) {
  checks++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${label}`);
    console.error(`     ${detail}`);
    violations++;
  } else {
    console.log(`  ✅ PASS: ${label}`);
  }
}

function checkFileContains(filePath, pattern, label) {
  try {
    const content = readFileSync(filePath, "utf-8");
    check(label, pattern.test(content), `Expected pattern ${pattern} in ${filePath}`);
  } catch (e) {
    check(label, false, `Cannot read ${filePath}: ${e.message}`);
  }
}

async function main() {
  console.log("🔒 CBAM Final Lock Guard\n");

  // 1. Check report route uses verified config (not hardcoded illustrative)
  const reportRoutePath = join(ROOT, "src/app/api/cbam/report/route.ts");
  const reportContent = readFileSync(reportRoutePath, "utf-8");
  check(
    "Report route imports cbam-verified-config",
    reportContent.includes('from "@/sectorcalc/cbam/cbam-verified-config"'),
    "Report route must import { isCbamPaidReportAllowed } from cbam-verified-config"
  );
  check(
    "Report route uses isCbamPaidReportAllowed",
    reportContent.includes("isCbamPaidReportAllowed"),
    "Report route must call isCbamPaidReportAllowed()"
  );
  check(
    "Report route has no hardcoded ILLUSTRATIVE_PLACEHOLDER_DO_NOT_SHIP",
    !reportContent.includes("CBAM_CONFIG_VERIFICATION_STATUS"),
    "Hardcoded verification status must be removed from report route"
  );
  check(
    "Report route 503 returns BLOCKED/CBAM_VERIFIED_CONFIG_REQUIRED",
    reportContent.includes("CBAM_VERIFIED_CONFIG_REQUIRED"),
    "Blocked response must include exact reason string"
  );

  // 2. Check verified config exists
  const verifiedConfigPath = join(ROOT, "src/sectorcalc/cbam/cbam-verified-config.ts");
  check(
    "Verified config file exists",
    existsSync(verifiedConfigPath),
    "cbam-verified-config.ts must exist"
  );

  // 3. Check source registry exists
  const sourceRegistryPath = join(ROOT, "src/sectorcalc/cbam/cbam-official-source-registry.ts");
  check(
    "Source registry file exists",
    existsSync(sourceRegistryPath),
    "cbam-official-source-registry.ts must exist"
  );

  // 4. Check source registry has required binding source
  const registryContent = readFileSync(sourceRegistryPath, "utf-8");
  check(
    "Registry contains EUR-Lex 2025/2621 source",
    registryContent.includes("eur-lex-2025-2621"),
    "Regulation (EU) 2025/2621 must be in the source registry"
  );
  check(
    "Registry has required_for_unlock flag",
    registryContent.includes("required_for_unlock"),
    "Source registry must have required_for_unlock property"
  );
  check(
    "Registry has source_hash_lock flag",
    registryContent.includes("source_hash_lock"),
    "Source registry must have source_hash_lock in runtime_use"
  );

  // 5. Check source lock file exists (ingest must have been run)
  const sourceLockPath = join(ROOT, "data/cbam/official-sources/cbam-source-lock.json");
  check(
    "Source lock file exists",
    existsSync(sourceLockPath),
    `Source lock file must exist at ${sourceLockPath}. Run scripts/ingest-cbam-official-sources.mjs`
  );

  // 6. If lock file exists, check hashes and binding source
  if (existsSync(sourceLockPath)) {
    try {
      const lock = JSON.parse(readFileSync(sourceLockPath, "utf-8"));
      const bindingSource = lock["eur-lex-2025-2621"];
      check(
        "Binding source (EU 2025/2621) is present in lock file",
        !!bindingSource,
        "EUR-Lex 2025/2621 must be in source lock"
      );

      // Check hashes for all required sources (only if fetched — manual verification is OK too)
      const requiredIds = ["eu-commission-cbam-main", "eu-commission-cbam-legislation", "eur-lex-2025-2621"];
      for (const sourceId of requiredIds) {
        const src = lock[sourceId];
        const hasHash = src && typeof src.sha256 === "string" && src.sha256.length > 0;
        const isManual = src && src.verification_status === "MANUAL_VERIFICATION_REQUIRED";
        check(
          `Source ${sourceId} has sha256 (or manual verification)`,
          hasHash || isManual,
          `Source ${sourceId} must have a sha256 hash or be MANUAL_VERIFICATION_REQUIRED`
        );
      }
    } catch (e) {
      check("Source lock file is valid JSON", false, `Parse error: ${e.message}`);
    }
  }

  // 7. Check golden fixture
  const goldenFixturePath = join(ROOT, "tests/golden/cbam/engine.golden.json");
  check(
    "Golden fixture exists (or not required for locked config)",
    existsSync(goldenFixturePath) || !existsSync(sourceLockPath),
    "Golden fixture must exist when source lock is present: tests/golden/cbam/engine.golden.json"
  );

  // 8. Check audit seal
  const auditSealPath = join(ROOT, "tests/golden/cbam/audit-seal.hash");
  check(
    "Audit seal hash exists (or not required for locked config)",
    existsSync(auditSealPath) || !existsSync(sourceLockPath),
    "Audit seal must exist when source lock is present: tests/golden/cbam/audit-seal.hash"
  );

  // 9. Certificate price policy
  const certPolicyPath = join(ROOT, "data/cbam/certificate-price-policy.json");
  check(
    "Certificate price policy exists (or not required for locked config)",
    existsSync(certPolicyPath) || !existsSync(sourceLockPath),
    "Certificate price policy must exist when source lock is present: data/cbam/certificate-price-policy.json"
  );

  // 10. Check no /en or locale route created for CBAM
  check(
    "No /en/cbam route file exists",
    !existsSync(join(ROOT, "src/app/en/cbam")) && !existsSync(join(ROOT, "src/app/[locale]/cbam")),
    "Locale-prefixed CBAM route must NOT exist"
  );

  // 11. Check no formula expressions leak in public paths
  const cbamPagePath = join(ROOT, "src/app/cbam/page.tsx");
  if (existsSync(cbamPagePath)) {
    const cbamContent = readFileSync(cbamPagePath, "utf-8");
    check(
      "CBAM page has no formula expression patterns",
      !cbamContent.includes("emissions_tco2e_per_ton") &&
        !cbamContent.includes("direct_emissions") &&
        !cbamContent.includes("precursor_emissions"),
      "Public CBAM page must not expose internal formula expressions"
    );
  }

  // Summary
  console.log(`\n📊 Results: ${checks} checks, ${violations} violations`);
  if (violations > 0) {
    console.log("❌ GUARD FAILED");
    process.exit(1);
  }
  console.log("✅ GUARD PASSED");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
