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

  // 1. Scan generated calculators (generated/*.ts)
  if (fs.existsSync(GENERATED_DIR)) {
    const files = fs.readdirSync(GENERATED_DIR);
    for (const file of files) {
      if (file.endsWith(".ts")) {
        const slug = file.replace(/\.ts$/, "");
        const filePath = path.join(GENERATED_DIR, file);
        const gitDate = getGitCommitDate(filePath);
        datesMap[slug] = gitDate || getFileMtimeIso(filePath);
      }
    }
  }

  // 2. Scan premium schemas (schemas/*.ts)
  if (fs.existsSync(PREMIUM_SCHEMAS_DIR)) {
    const files = fs.readdirSync(PREMIUM_SCHEMAS_DIR);
    for (const file of files) {
      if (file.endsWith(".ts") && file !== "index.ts") {
        const slug = file.replace(/\.ts$/, "");
        const filePath = path.join(PREMIUM_SCHEMAS_DIR, file);
        const gitDate = getGitCommitDate(filePath);
        // Only override if not already scanned or git date is newer
        const resolved = gitDate || getFileMtimeIso(filePath);
        if (!datesMap[slug] || new Date(resolved) > new Date(datesMap[slug])) {
          datesMap[slug] = resolved;
        }
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(datesMap, null, 2), "utf8");
  console.log(`Successfully generated ${OUTPUT_FILE} with ${Object.keys(datesMap).length} entries.`);
}

if (require.main === module) {
  run();
}
