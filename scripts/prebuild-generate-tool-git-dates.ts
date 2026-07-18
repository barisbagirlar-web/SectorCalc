import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, "generated");
const PREMIUM_SCHEMAS_DIR = path.join(ROOT, "src/lib/features/premium-schema/schemas");
// Pro-tier (/tools/pro/<slug>) canonical sources: versioned schema + formula.
// These back the sitemap routes produced by getActiveCategorizedToolSitemapRoutes().
const PRO_V531_SCHEMAS_DIR = path.join(ROOT, "src/sectorcalc/schemas/pro-v531");
const PRO_V531_FORMULAS_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");
const OUTPUT_FILE = path.join(GENERATED_DIR, "tool-git-dates.json");

function getGitCommitDate(filePath: string): string | null {
  try {
    const stdout = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return stdout ? stdout : null;
  } catch {
    return null;
  }
}

function getFileMtimeIso(filePath: string): string {
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/** Latest valid ISO date across a set of source files (git commit date preferred, mtime fallback). */
function resolveLatestSourceIso(filePaths: readonly string[]): string | null {
  let latest: { iso: string; time: number } | null = null;
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const iso = getGitCommitDate(filePath) ?? getFileMtimeIso(filePath);
    const time = new Date(iso).getTime();
    if (Number.isNaN(time)) {
      continue;
    }
    if (!latest || time > latest.time) {
      latest = { iso, time };
    }
  }
  return latest ? latest.iso : null;
}

export function run() {
  console.log("Generating tool-git-dates.json...");
  
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  const datesMap: Record<string, string> = {};
  let missingCount = 0;

  // 1. Scan generated calculators (generated/*.ts)
  if (fs.existsSync(GENERATED_DIR)) {
    const files = fs.readdirSync(GENERATED_DIR);
    for (const file of files) {
      if (file.endsWith(".ts")) {
        const slug = file.replace(/\.ts$/, "");
        const filePath = path.join(GENERATED_DIR, file);
        const gitDate = getGitCommitDate(filePath);
        if (!gitDate) {
          missingCount++;
          console.warn(`[WARN] Git date lookup missed for generated tool: ${slug}`);
        }
        datesMap[slug] = gitDate || getFileMtimeIso(filePath);
      }
    }
  }

  // 2. Scan premium schemas (schemas/*.ts)
  if (fs.existsSync(PREMIUM_SCHEMAS_DIR)) {
    const files = fs.readdirSync(PREMIUM_SCHEMAS_DIR);
    for (const file of files) {
      if (file.endsWith(".ts") && file !== "index.ts") {
        const fileSlug = file.replace(/\.ts$/, "");
        const filePath = path.join(PREMIUM_SCHEMAS_DIR, file);
        const gitDate = getGitCommitDate(filePath);
        if (!gitDate) {
          missingCount++;
          console.warn(`[WARN] Git date lookup missed for premium schema: ${fileSlug}`);
        }
        const resolved = gitDate || getFileMtimeIso(filePath);
        if (!datesMap[fileSlug] || new Date(resolved) > new Date(datesMap[fileSlug])) {
          datesMap[fileSlug] = resolved;
        }

        // Parse file content to discover nested schema IDs (e.g. for multi-schema files)
        try {
          const content = fs.readFileSync(filePath, "utf8");
          const idMatches = [...content.matchAll(/^\s*(?:id|legacyPaidSlug):\s*["']([^"']+)["']/gm)];
          for (const match of idMatches) {
            const schemaId = match[1];
            if (!datesMap[schemaId] || new Date(resolved) > new Date(datesMap[schemaId])) {
              datesMap[schemaId] = resolved;
            }
          }
        } catch (e) {
          console.error(`Failed to parse schema IDs in file: ${filePath}`, e);
        }
      }
    }
  }

  // 2b. Scan pro-tier (/tools/pro/<slug>) versioned sources.
  // Slug lastmod = latest git commit date across its schema + formula file,
  // so the sitemap emits an authentic per-tool signal instead of build/request time.
  if (fs.existsSync(PRO_V531_SCHEMAS_DIR)) {
    const files = fs.readdirSync(PRO_V531_SCHEMAS_DIR);
    for (const file of files) {
      if (!file.endsWith(".schema.json")) {
        continue;
      }
      const slug = file.replace(/\.schema\.json$/, "");
      const trackedPaths = [
        path.join(PRO_V531_SCHEMAS_DIR, file),
        path.join(PRO_V531_FORMULAS_DIR, `${slug}.formula.ts`),
      ];
      const resolved = resolveLatestSourceIso(trackedPaths);
      if (!resolved) {
        missingCount++;
        console.warn(`[WARN] Git date lookup missed for pro tool: ${slug}`);
        continue;
      }
      if (!datesMap[slug] || new Date(resolved) > new Date(datesMap[slug])) {
        datesMap[slug] = resolved;
      }
    }
  }

  // 3. Scan content source files
  const contentSourceFiles: Record<string, string> = {
    guides: "src/lib/content/authority-guides.ts",
    seoLandings: "src/lib/infrastructure/seo/programmatic-seo-pages.ts",
    premiumRegistry: "src/lib/features/premium-schema/schema-registry.ts",
    manifest: "src/lib/infrastructure/seo/sitemap-manifest.ts",
    casestudies: "src/lib/features/case-studies/case-study-registry.ts",
  };

  for (const [key, relativePath] of Object.entries(contentSourceFiles)) {
    const filePath = path.join(ROOT, relativePath);
    const gitDate = getGitCommitDate(filePath);
    datesMap[`source:${key}`] = gitDate || getFileMtimeIso(filePath);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(datesMap, null, 2), "utf8");
  console.log(`Successfully generated ${OUTPUT_FILE} with ${Object.keys(datesMap).length} entries.`);
  if (missingCount > 0) {
    console.warn(`[WARN] Git date lookup missed for ${missingCount} file paths.`);
  }
}

if (require.main === module) {
  run();
}
