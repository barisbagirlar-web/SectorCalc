#!/usr/bin/env node
/**
 * Reports preview static-params helper coverage across generateStaticParams routes.
 * Output: scripts/.cache/vercel-preview-static-params-report.json
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const helperPath = join(repoRoot, "src/lib/build/preview-static-params.ts");
const outputPath = join(repoRoot, "scripts/.cache/vercel-preview-static-params-report.json");

const ROUTE_FAMILIES = [
  {
    route: "/[locale]/tools/free/[slug]",
    file: "src/app/[locale]/tools/free/[slug]/page.tsx",
    family: "free-tools",
  },
  {
    route: "/[locale]/tools/premium/[slug]",
    file: "src/app/[locale]/tools/premium/[slug]/page.tsx",
    family: "premium-tools",
  },
  {
    route: "/[locale]/tools/premium-schema/[slug]",
    file: "src/app/[locale]/tools/premium-schema/[slug]/page.tsx",
    family: "premium-schema",
  },
  {
    route: "/[locale]/tools/premium-schema/[slug]/print",
    file: "src/app/[locale]/tools/premium-schema/[slug]/print/page.tsx",
    family: "premium-schema-print",
  },
  {
    route: "/[locale]/seo/[slug]",
    file: "src/app/[locale]/seo/[slug]/page.tsx",
    family: "seo",
  },
  {
    route: "/[locale]/industries/[slug]",
    file: "src/app/[locale]/industries/[slug]/page.tsx",
    family: "industries",
  },
  {
    route: "/[locale]/audit/[sectorKey]",
    file: "src/app/[locale]/audit/[sectorKey]/page.tsx",
    family: "audit",
  },
  {
    route: "/[locale]/case-studies/[slug]",
    file: "src/app/[locale]/case-studies/[slug]/page.tsx",
    family: "case-studies",
  },
  {
    route: "/[locale]/guides/[slug]",
    file: "src/app/[locale]/guides/[slug]/page.tsx",
    family: "guides",
  },
];

function listGenerateStaticParamsFiles() {
  try {
    const output = execSync(
      'find src app -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "generateStaticParams" 2>/dev/null || true',
      { cwd: repoRoot, encoding: "utf8" },
    );
    return output.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function readHelperMeta() {
  const source = readFileSync(helperPath, "utf8");
  const problemSlugMatch = source.match(
    /export const PROBLEM_SLUG = "([^"]+)"/,
  );
  const familyBlocks = [...source.matchAll(/"([^"]+)":\s*\[([^\]]*)\]/g)];
  const families = {};
  for (const block of familyBlocks) {
    const key = block[1];
    if (
      [
        "free-tools",
        "premium-tools",
        "premium-schema",
        "premium-schema-print",
        "seo",
        "industries",
        "audit",
        "case-studies",
        "guides",
        "generic",
      ].includes(key)
    ) {
      const slugs = block[2]
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      families[key] = slugs;
    }
  }
  return {
    problemSlug: problemSlugMatch?.[1] ?? null,
    keepLocales: ["tr", "en"],
    families,
  };
}

const gspFiles = listGenerateStaticParamsFiles();
const wrappedFiles = [];

for (const entry of ROUTE_FAMILIES) {
  const absolute = join(repoRoot, entry.file);
  let wrapped = false;
  try {
    const content = readFileSync(absolute, "utf8");
    wrapped = content.includes("limitStaticParamsForPreview");
  } catch {
    wrapped = false;
  }
  wrappedFiles.push({
    ...entry,
    wrapped,
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  previewModeActive:
    process.env.SECTORCALC_FORCE_FULL_STATIC !== "1" &&
    (process.env.SECTORCALC_FAST_PREVIEW_STATIC === "1" ||
      process.env.VERCEL_ENV === "preview"),
  env: {
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
    SECTORCALC_FAST_PREVIEW_STATIC:
      process.env.SECTORCALC_FAST_PREVIEW_STATIC ?? null,
    SECTORCALC_FORCE_FULL_STATIC:
      process.env.SECTORCALC_FORCE_FULL_STATIC ?? null,
  },
  helper: readHelperMeta(),
  inventory: {
    generateStaticParamsFileCount: gspFiles.length,
    generateStaticParamsFiles: gspFiles,
    wrappedRouteCount: wrappedFiles.filter((item) => item.wrapped).length,
    targetRouteCount: ROUTE_FAMILIES.length,
  },
  routeFamilies: wrappedFiles,
  notes: [
    "Preview mode limits build-time static params; production and local default builds remain full.",
    "Compare Next build output 'Generating static pages (N/N)' before/after preview simulation.",
    "Problem slug must remain in premium-tools keep list for revenue-gate smoke paths.",
  ],
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`vercel-preview-static-params-report: wrote ${outputPath}`);
console.log(
  `wrapped ${report.inventory.wrappedRouteCount}/${report.inventory.targetRouteCount} target route families`,
);
