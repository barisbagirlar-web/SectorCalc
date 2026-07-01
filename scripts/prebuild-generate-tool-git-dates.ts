import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, "generated");
const PREMIUM_SCHEMAS_DIR = path.join(ROOT, "src/lib/features/premium-schema/schemas");
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
