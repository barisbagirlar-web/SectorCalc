import fs from "node:fs";
import path from "node:path";
import {
  evaluateSchemaTrust,
  type TrustGateResult,
} from "@/lib/generated-tools/trust-gate";

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");

function readSlug(schema: Record<string, unknown>, fileName: string): string {
  const toolName = schema.toolName;
  if (typeof toolName === "string" && toolName.trim()) {
    return toolName.trim();
  }
  return fileName.replace(/-schema\.json$/, "");
}

export function runTrustGate(): TrustGateResult[] {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    return [];
  }

  const dirs = fs.readdirSync(SCHEMAS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  const results: TrustGateResult[] = [];

  for (const dir of dirs) {
    const dirPath = path.join(SCHEMAS_DIR, dir);
    const files = fs.readdirSync(dirPath).filter((file) => file.endsWith("-schema.json"));
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
      const slug = readSlug(schema, file);
      results.push(evaluateSchemaTrust(schema, slug));
    }
  }

  return results;
}

export function getActiveSlugs(): string[] {
  return runTrustGate()
    .filter((result) => result.status === "PASS" || result.status === "WARN")
    .map((result) => result.slug)
    .sort((left, right) => left.localeCompare(right));
}
