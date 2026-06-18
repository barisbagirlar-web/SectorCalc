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

  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith("-schema.json"));
  const results: TrustGateResult[] = [];

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const slug = readSlug(schema, file);
    results.push(evaluateSchemaTrust(schema, slug));
  }

  return results;
}

export function getActiveSlugs(): string[] {
  return runTrustGate()
    .filter((result) => result.status === "PASS" || result.status === "WARN")
    .map((result) => result.slug)
    .sort((left, right) => left.localeCompare(right));
}
