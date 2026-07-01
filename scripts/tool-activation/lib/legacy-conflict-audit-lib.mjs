import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";

export const LEGACY_CONFLICT_REPORT_PATH = path.join(
  ROOT,
  "scripts/.cache/legacy-conflict-report.json",
);

const SCAN_ROOTS = [
  path.join(ROOT, "src"),
  path.join(ROOT, "scripts"),
  path.join(ROOT, "functions/src"),
  path.join(ROOT, "apps"),
  path.join(ROOT, "docs"),
  path.join(ROOT, "messages"),
];

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".astro",
  ".css",
]);

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "out",
  ".cache",
]);

const FORMULA_GATE_LEGACY_PATTERNS = [
  {
    id: "hardcoded-formula-gate-tr",
    re: /Formula Gate Onaylı/g,
    severity: "high",
    note: "Hardcoded Formula Gate label — must flow through runtime trust + formula-gate-copy",
  },
  {
    id: "hardcoded-formula-gate-en",
    re: /Formula Gate Approved/g,
    severity: "high",
    note: "Hardcoded Formula Gate label — must flow through runtime trust + formula-gate-copy",
  },
  {
    id: "has-formula-source-audit-direct",
    re: /\bhasFormulaSourceAudit\s*\(/g,
    severity: "medium",
    note: "Direct registry audit call — badge surfaces must also use evaluateRuntimeTrust",
  },
];

const PREMIUM_FREE_COPY_PATTERNS = [
  {
    id: "free-faq-answer-on-surface",
    re: /tAuthority\s*\(\s*["']faqFree(?:Title|Answer)["']\s*\)/g,
    severity: "high",
    note: "Free authority FAQ copy — verify premium surface uses contentAuthority.premium keys",
  },
  {
    id: "free-faq-evet-tr",
    re: /Evet\.\s*SectorCalc ücretsiz hesaplama/g,
    severity: "high",
    note: "Free-tier FAQ answer leaking into non-free surface",
  },
  {
    id: "premium-surface-free-copy-flag",
    re: /premiumSurfaceUsesFreeCopy:\s*true/g,
    severity: "info",
    note: "Explicit tier copy mismatch flag — trust engine should block payment/gate",
  },
];

const GENERIC_GUIDE_PATTERNS = [
  {
    id: "girdi-rehberi-tr",
    re: /Girdi rehberi/gi,
    severity: "medium",
    note: "Legacy generic input guide copy",
  },
  {
    id: "schema-hesaplama-generic",
    re: /Bu şema,\s*hesaplama alanlarına/gi,
    severity: "medium",
    note: "Generic schema guide fallback copy",
  },
  {
    id: "generic-calculator-graphic",
    re: /GenericCalculatorGraphic|data-template=["']generic["']/g,
    severity: "medium",
    note: "Generic SVG fallback renderer",
  },
  {
    id: "legacy-reference-graphic-card",
    re: /ReferenceGraphicCard|GuidedReferenceGraphic/g,
    severity: "low",
    note: "Legacy reference graphic path — should be isolated behind input-guide policy",
  },
  {
    id: "resolve-reference-graphic-live",
    re: /resolveReferenceGraphic\s*\(/g,
    severity: "info",
    note: "Legacy resolver usage — audit-only unless gated by shouldRenderInputGuide",
  },
];

const VERIFY_CERT_PATTERNS = [
  { id: "certified-claim", re: /\bcertified\b/gi, severity: "low" },
  { id: "public-verify", re: /public verify/gi, severity: "medium" },
  { id: "qr-verification", re: /QR verification/gi, severity: "medium" },
  { id: "hash-verification", re: /hash verification/gi, severity: "medium" },
  { id: "legal-grade", re: /legal-grade/gi, severity: "medium" },
  { id: "auditor-mode", re: /auditor mode/gi, severity: "medium" },
  { id: "bank-mode", re: /bank mode/gi, severity: "medium" },
  { id: "onayli-rapor", re: /onaylı rapor/gi, severity: "medium" },
  { id: "muhurlu", re: /mühürlü/gi, severity: "medium" },
  { id: "sertifikali", re: /sertifikalı/gi, severity: "medium" },
];

const PLACEHOLDER_RESULT_PATTERNS = [
  {
    id: "degerleri-girin",
    re: /Değerleri girin/gi,
    severity: "medium",
    note: "Placeholder-only result copy",
  },
  {
    id: "placeholder-only-result-finding",
    re: /placeholder_only_result/g,
    severity: "info",
    note: "Runtime readiness placeholder result finding",
  },
  {
    id: "enter-values-placeholder",
    re: /Enter values to (?:see|calculate)/gi,
    severity: "medium",
    note: "Placeholder-only result copy (EN)",
  },
];

const P9_WIP_PATHS = [
  "functions/src/createStripeCheckout.ts",
  "functions/src/stripeWebhook.ts",
  "functions/src/constants.ts",
  "functions/src/index.ts",
  "src/lib/billing/use-premium-tool-access.ts",
];

const GUIDE_CMS_PATHS = [
  "apps/guide-frontend",
  "apps/guide-frontend/src/lib/strapi.ts",
  "apps/guide-frontend/wrangler.toml",
];

const BUILD_DRIFT_PATHS = [
  "public/ai-categories.json",
  "public/ai-tool-index.json",
  "public/ai-tool-index.txt",
  "public/ai-tool-routes.json",
  "next-env.d.ts",
];

const ALLOWLIST_VERIFY_PATHS = [
  "docs/",
  "scripts/",
  "src/lib/reports/__tests__/",
  "src/lib/formula-governance/__tests__/",
  "src/components/case-studies/",
  "src/app/[locale]/disclaimer/",
  "src/app/[locale]/how-it-works/",
  "messages/",
  "legacy-conflict",
  "audit-legacy-conflicts",
  "deepseek",
  "runtime-trust-engine.md",
  "formula-gate-trust-policy.md",
];

const ALLOWLIST_FORMULA_GATE_PATHS = [
  "formula-gate-copy.ts",
  "formula-source-audit-registry.ts",
  "runtime-trust-engine.ts",
  "runtime-readiness-p24-verdicts.ts",
  "FormulaSourceAuditBadge.tsx",
  "FormulaGateCatalogMeta.tsx",
  "FormulaGateToolStatus.tsx",
  "docs/",
  "scripts/",
  "__tests__/",
  "audit-legacy-conflicts",
  "legacy-conflict",
];

const PREMIUM_ROUTE_FRAGMENTS = [
  "/tools/premium/",
  "/tools/premium-schema/",
  "MigratedFreePremiumToolSurface.tsx",
  "PremiumToolPage.tsx",
];

const FREE_ROUTE_ALLOWLIST = [
  "src/app/[locale]/tools/free/",
  "FreeToolPage.tsx",
  "FreeToolAuthorityBlock.tsx",
];

function rel(filePath) {
  return path.relative(ROOT, filePath).split("\\").join("/");
}

function isAllowlisted(filePath, allowlist) {
  const normalized = rel(filePath);
  return allowlist.some((fragment) => normalized.includes(fragment));
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
      continue;
    }

    const ext = path.extname(entry.name);
    if (TEXT_EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

function scanPatternGroup(files, patterns, options = {}) {
  const findings = [];
  const allowlist = options.allowlist ?? [];

  for (const filePath of files) {
    if (allowlist.length > 0 && isAllowlisted(filePath, allowlist)) {
      continue;
    }

    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split("\n");

    for (const pattern of patterns) {
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const matches = [...line.matchAll(pattern.re)];
        if (matches.length === 0) {
          continue;
        }

        findings.push({
          id: pattern.id,
          severity: pattern.severity,
          file: rel(filePath),
          line: index + 1,
          excerpt: line.trim().slice(0, 160),
          note: pattern.note ?? null,
          matchCount: matches.length,
        });
      }
    }
  }

  return findings;
}

function dedupeFindings(findings) {
  const seen = new Set();
  return findings.filter((item) => {
    const key = `${item.id}|${item.file}|${item.line}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function isPremiumRouteFile(filePath) {
  const normalized = rel(filePath);
  if (FREE_ROUTE_ALLOWLIST.some((fragment) => normalized.includes(fragment))) {
    return false;
  }
  return PREMIUM_ROUTE_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}

function collectPremiumSchemaIds() {
  const schemasDir = path.join(ROOT, "src/lib/premium-schema/schemas");
  const ids = new Set();

  if (!fs.existsSync(schemasDir)) {
    return [];
  }

  for (const file of fs.readdirSync(schemasDir)) {
    if (!file.endsWith(".ts") || file === "index.ts") {
      continue;
    }

    const text = fs.readFileSync(path.join(schemasDir, file), "utf8");
    const match = text.match(/PremiumCalculatorSchema\s*=\s*\{[\s\S]*?\n\s*id:\s*"([^"]+)"/);
    if (match) {
      ids.add(match[1]);
    }
  }

  return [...ids];
}

function parseSlugMapFromRegistry() {
  const registryPath = path.join(ROOT, "src/lib/premium-schema/schema-registry.ts");
  const text = readTextIfExists(registryPath);
  if (!text) {
    return { map: {}, schemaIds: [], errors: ["missing_schema_registry"] };
  }

  const map = {};
  const blockMatch = text.match(
    /export const PREMIUM_SCHEMA_SLUG_MAP[\s\S]*?=\s*\{([\s\S]*?)\};/,
  );
  if (!blockMatch) {
    return { map: {}, schemaIds: [], errors: ["slug_map_parse_failed"] };
  }

  const pairRe = /"([^"]+)":\s*"([^"]+)"/g;
  let match;
  while ((match = pairRe.exec(blockMatch[1])) !== null) {
    map[match[1]] = match[2];
  }

  const schemaIds = collectPremiumSchemaIds();

  return { map, schemaIds, errors: [] };
}

function scanPremiumFreeCopyMismatch(files) {
  const findings = [];
  const premiumFiles = files.filter((filePath) => isPremiumRouteFile(filePath));

  for (const filePath of premiumFiles) {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split("\n");

    for (const pattern of PREMIUM_FREE_COPY_PATTERNS) {
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const matches = [...line.matchAll(pattern.re)];
        if (matches.length === 0) {
          continue;
        }

        findings.push({
          id: pattern.id,
          severity: pattern.severity,
          file: rel(filePath),
          line: index + 1,
          excerpt: line.trim().slice(0, 160),
          note: pattern.note ?? null,
          matchCount: matches.length,
        });
      }
    }
  }

  const trafficPage = path.join(ROOT, "src/components/tools/FreeTrafficToolPage.tsx");
  if (fs.existsSync(trafficPage)) {
    const text = fs.readFileSync(trafficPage, "utf8");
    if (
      /surfaceTier === "premium"\s*\?\s*tPremiumAuthority\("faqIsFree(?:Title|Answer)"\)/.test(
        text,
      )
    ) {
      findings.push({
        id: "premium-surface-uses-premium-faq-keys",
        severity: "info",
        file: rel(trafficPage),
        note: "Premium branch uses contentAuthority.premium faqIsFree* keys (safe)",
      });
    } else if (/tAuthority\("faqFree(?:Title|Answer)"\)/.test(text)) {
      findings.push({
        id: "premium-traffic-page-free-copy-risk",
        severity: "high",
        file: rel(trafficPage),
        note: "FreeTrafficToolPage may leak free FAQ copy on premium surface",
      });
    }
  }

  return dedupeFindings(findings);
}

function auditDuplicateSlugAlias() {
  const findings = [];
  const { map, schemaIds, errors } = parseSlugMapFromRegistry();

  for (const error of errors) {
    findings.push({ id: error, severity: "high", note: "Premium schema slug map parse issue" });
  }

  const schemaToPaid = new Map();
  for (const [paidSlug, schemaId] of Object.entries(map)) {
    if (!schemaIds.includes(schemaId)) {
      findings.push({
        id: "slug_map_missing_schema_id",
        severity: "high",
        paidSlug,
        schemaId,
        note: "paidSlug maps to schema id not present in registry schemas",
      });
    }

    const existing = schemaToPaid.get(schemaId) ?? [];
    existing.push(paidSlug);
    schemaToPaid.set(schemaId, existing);
  }

  for (const [schemaId, paidSlugs] of schemaToPaid.entries()) {
    if (paidSlugs.length > 1) {
      findings.push({
        id: "slug_map_duplicate_schema_target",
        severity: "medium",
        schemaId,
        paidSlugs,
        note: "Multiple legacy paid slugs map to same premium schema id (alias collision)",
      });
    }
  }

  const p24Path = path.join(ROOT, "src/lib/tools/runtime-readiness-p24-verdicts.ts");
  const p24Text = readTextIfExists(p24Path);
  if (p24Text) {
    const slugKeys = [...p24Text.matchAll(/"([^"]+)":\s*"(?:PASS|WARN|FAIL|QUARANTINE)"/g)].map(
      (item) => item[1],
    );
    const duplicates = slugKeys.filter((slug, index) => slugKeys.indexOf(slug) !== index);
    for (const slug of [...new Set(duplicates)]) {
      findings.push({
        id: "p24_snapshot_duplicate_verdict",
        severity: "high",
        slug,
        note: "Duplicate P2.4 verdict key in runtime-readiness-p24-verdicts.ts",
      });
    }
  }

  const indexPath = path.join(ROOT, "public/ai-tool-index.json");
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      const slugs = (index.tools ?? index.items ?? []).map((tool) => tool.slug);
      const seen = new Set();
      for (const slug of slugs) {
        if (seen.has(slug)) {
          findings.push({
            id: "ai_tool_index_duplicate_slug",
            severity: "high",
            slug,
            note: "Duplicate slug in public/ai-tool-index.json",
          });
        }
        seen.add(slug);
      }
    } catch {
      findings.push({
        id: "ai_tool_index_parse_failed",
        severity: "medium",
        note: "Could not parse public/ai-tool-index.json for duplicate slug audit",
      });
    }
  }

  return findings;
}

function auditBuildCacheDrift() {
  const findings = [];
  const cacheDir = path.join(ROOT, "scripts/.cache");

  for (const relativePath of BUILD_DRIFT_PATHS) {
    const fullPath = path.join(ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      findings.push({
        id: "build_drift_missing_expected",
        severity: "info",
        path: relativePath,
        note: "Expected local/generated path absent",
      });
      continue;
    }

    const stat = fs.statSync(fullPath);
    findings.push({
      id: "build_drift_present",
      severity: "info",
      path: relativePath,
      modifiedAt: stat.mtime.toISOString(),
      gitStatusHint: "do_not_commit_unless_explicit_export",
    });
  }

  if (fs.existsSync(cacheDir)) {
    const cacheFiles = walkFiles(cacheDir);
    for (const filePath of cacheFiles) {
      const stat = fs.statSync(filePath);
      findings.push({
        id: "cache_artifact_present",
        severity: "info",
        path: rel(filePath),
        modifiedAt: stat.mtime.toISOString(),
        note: "scripts/.cache output — legacy finding only, not decision source",
      });
    }
  }

  return findings;
}

function auditP9WipIsolation() {
  const findings = [];

  for (const relativePath of P9_WIP_PATHS) {
    const fullPath = path.join(ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      findings.push({
        id: "p9_wip_missing",
        severity: "info",
        path: relativePath,
      });
      continue;
    }

    const stat = fs.statSync(fullPath);
    findings.push({
      id: "p9_wip_present",
      severity: "info",
      path: relativePath,
      modifiedAt: stat.mtime.toISOString(),
      isolation: "report_only_do_not_modify_in_p1a",
    });
  }

  return findings;
}

function auditGuideCmsIsolation(srcFiles) {
  const findings = [];
  const guideRoot = path.join(ROOT, "apps/guide-frontend");
  const guideExists = fs.existsSync(guideRoot);

  findings.push({
    id: guideExists ? "guide_cms_present" : "guide_cms_absent",
    severity: "info",
    path: "apps/guide-frontend",
    note: "Rehber CMS — isolated from main Next.js tool line",
  });

  for (const relativePath of GUIDE_CMS_PATHS) {
    const fullPath = path.join(ROOT, relativePath);
    if (fs.existsSync(fullPath)) {
      findings.push({
        id: "guide_cms_asset",
        severity: "info",
        path: relativePath,
        isolation: "do_not_wire_to_main_tool_pipeline",
      });
    }
  }

  const mainAppImports = [];
  for (const filePath of srcFiles) {
    const text = fs.readFileSync(filePath, "utf8");
    if (/apps\/guide-frontend|from\s+["'].*guide-frontend|rehber.*strapi/i.test(text)) {
      mainAppImports.push({
        file: rel(filePath),
        note: "Main app references guide CMS — cross-wire risk",
      });
    }
  }

  if (mainAppImports.length > 0) {
    findings.push({
      id: "guide_cms_main_app_crosswire",
      severity: "high",
      imports: mainAppImports,
    });
  } else {
    findings.push({
      id: "guide_cms_main_app_isolated",
      severity: "info",
      note: "No src/ imports detected from apps/guide-frontend",
    });
  }

  return findings;
}

function auditHostingProduction() {
  const firebasePath = path.join(ROOT, "firebase.json");
  const firebase = readTextIfExists(firebasePath);
  const hosting = {
    primaryProduction: "www.sectorcalc.com — Firebase (Next.js app)",
    firebaseHostingRole: "secondary — Firebase frameworks backend / legacy deploy path",
    firebaseHostingConfigured: Boolean(firebase?.includes('"hosting"')),
    firebaseFrameworksBackend: Boolean(firebase?.includes("frameworksBackend")),
    note: "Do not treat Firebase Hosting as sole production authority during P2.5 Control Plane setup",
  };

  return hosting;
}

function auditFormulaGateSurfaces(srcFiles) {
  const badgeFiles = [];
  for (const filePath of srcFiles) {
    const normalized = rel(filePath);
    if (!normalized.includes("src/components/formula/")) {
      continue;
    }
    const text = fs.readFileSync(filePath, "utf8");
    if (
      /getFormulaGateVerifiedLabel|FormulaSourceAuditBadge|canShowFormulaGateApproved|evaluateRuntimeTrust/.test(
        text,
      )
    ) {
      badgeFiles.push({
        file: normalized,
        usesRuntimeTrust: /evaluateRuntimeTrust/.test(text),
        usesCanShow: /canShowFormulaGateApproved/.test(text),
        directRegistryOnly:
          /hasFormulaSourceAudit/.test(text) &&
          !/canShowFormulaGateApproved/.test(text),
      });
    }
  }

  const risky = badgeFiles.filter((item) => item.directRegistryOnly);
  return {
    surfaces: badgeFiles,
    riskySurfaces: risky,
  };
}

function summarizeCategory(findings) {
  const bySeverity = { high: 0, medium: 0, low: 0, info: 0 };
  for (const item of findings) {
    const severity = item.severity ?? "info";
    bySeverity[severity] = (bySeverity[severity] ?? 0) + 1;
  }
  return {
    total: findings.length,
    bySeverity,
  };
}

export function buildLegacyConflictReport() {
  const files = SCAN_ROOTS.flatMap((dir) => walkFiles(dir));
  const srcFiles = walkFiles(path.join(ROOT, "src"));

  const formulaGateLegacy = dedupeFindings(
    scanPatternGroup(files, FORMULA_GATE_LEGACY_PATTERNS, {
      allowlist: ALLOWLIST_FORMULA_GATE_PATHS,
    }),
  );

  const premiumFreeCopyMismatch = scanPremiumFreeCopyMismatch(files);

  const genericInputGuide = dedupeFindings(scanPatternGroup(files, GENERIC_GUIDE_PATTERNS));

  const verifyCertificationLegacy = dedupeFindings(
    scanPatternGroup(files, VERIFY_CERT_PATTERNS, {
      allowlist: ALLOWLIST_VERIFY_PATHS,
    }),
  );

  const genericResultPlaceholder = dedupeFindings(
    scanPatternGroup(files, PLACEHOLDER_RESULT_PATTERNS),
  );

  const buildCacheDrift = auditBuildCacheDrift();
  const p9WipIsolation = auditP9WipIsolation();
  const guideCmsIsolation = auditGuideCmsIsolation(srcFiles);
  const hostingProduction = auditHostingProduction();
  const duplicateSlugAlias = auditDuplicateSlugAlias();
  const formulaGateSurfaces = auditFormulaGateSurfaces(srcFiles);

  const blockers = [];

  if (formulaGateSurfaces.riskySurfaces.length > 0) {
    blockers.push("formula_gate_surface_without_runtime_trust_guard");
  }

  const guideCrosswire = guideCmsIsolation.find(
    (item) => item.id === "guide_cms_main_app_crosswire",
  );
  if (guideCrosswire) {
    blockers.push("guide_cms_main_app_crosswire");
  }

  const highSeverityCount =
    formulaGateLegacy.filter((item) => item.severity === "high").length +
    premiumFreeCopyMismatch.filter((item) => item.severity === "high").length +
    duplicateSlugAlias.filter((item) => item.severity === "high").length;

  const report = {
    generatedAt: new Date().toISOString(),
    phase: "P1A-legacy-conflict-cleanup",
    summary: {
      formulaGateLegacy: summarizeCategory(formulaGateLegacy),
      premiumFreeCopyMismatch: summarizeCategory(premiumFreeCopyMismatch),
      genericInputGuide: summarizeCategory(genericInputGuide),
      verifyCertificationLegacy: summarizeCategory(verifyCertificationLegacy),
      buildCacheDrift: summarizeCategory(buildCacheDrift),
      p9WipIsolation: summarizeCategory(p9WipIsolation),
      guideCmsIsolation: summarizeCategory(guideCmsIsolation),
      duplicateSlugAlias: summarizeCategory(duplicateSlugAlias),
      genericResultPlaceholder: summarizeCategory(genericResultPlaceholder),
      highSeverityCount,
      blockers,
    },
    categories: {
      formulaGateLegacy,
      formulaGateSurfaces,
      premiumFreeCopyMismatch,
      genericInputGuide,
      verifyCertificationLegacy,
      buildCacheDrift,
      p9WipIsolation,
      guideCmsIsolation,
      hostingProduction,
      duplicateSlugAlias,
      genericResultPlaceholder,
    },
    safeIsolationPolicy: {
      notDeleted: [
        "tools",
        "catalog entries",
        "routes",
        "formula implementations",
        "P9 WIP payment files",
      ],
      deprecated: [
        "GuidedReferenceGraphic generic fallback path",
        "ReferenceGraphicCard live rendering",
        "legacy verify/certification marketing claims",
        "stale scripts/.cache audit outputs when regenerated",
      ],
      safeIsolated: [
        "apps/guide-frontend",
        "scripts/.cache/*",
        "public/ai-* build drift",
        "P9 WIP functions/billing",
        "Firebase Hosting as secondary deploy",
      ],
      controlPlaneIgnores: [
        "stale scripts/.cache without fresh regeneration",
        "public/ai-* unless freshly exported",
        "legacy verify/certified/QR/hash claims",
        "apps/guide-* CMS content",
        "P9 WIP payment code paths",
        "generic guide fallback outputs",
      ],
      legacyFindingOnly: true,
    },
    recommendations: [
      highSeverityCount > 0
        ? "Review high-severity legacy findings before P1B Control Plane wiring."
        : "No high-severity legacy conflicts detected in static scan.",
      "Regenerate P2.4 and Runtime Trust reports before any payment or Formula Gate decision.",
      "Keep apps/guide-frontend off the main tool import graph.",
    ],
  };

  return report;
}

export function formatLegacyConflictStdout(report) {
  const lines = [
    "=== audit:legacy-conflicts ===",
    `generatedAt: ${report.generatedAt}`,
    `highSeverity: ${report.summary.highSeverityCount}`,
    `blockers: ${report.summary.blockers.length > 0 ? report.summary.blockers.join(", ") : "none"}`,
    "",
    "counts:",
    ` - formulaGateLegacy: ${report.summary.formulaGateLegacy.total}`,
    ` - premiumFreeCopyMismatch: ${report.summary.premiumFreeCopyMismatch.total}`,
    ` - genericInputGuide: ${report.summary.genericInputGuide.total}`,
    ` - verifyCertificationLegacy: ${report.summary.verifyCertificationLegacy.total}`,
    ` - duplicateSlugAlias: ${report.summary.duplicateSlugAlias.total}`,
    ` - p9WipIsolation: ${report.summary.p9WipIsolation.total}`,
    ` - guideCmsIsolation: ${report.summary.guideCmsIsolation.total}`,
    ` - buildCacheDrift: ${report.summary.buildCacheDrift.total}`,
    "",
    `report: ${rel(LEGACY_CONFLICT_REPORT_PATH)}`,
    "audit:legacy-conflicts PASS",
  ];
  return lines.join("\n");
}
