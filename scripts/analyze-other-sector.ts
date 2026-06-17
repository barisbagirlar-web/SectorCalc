#!/usr/bin/env npx tsx
/**
 * Analyze tools assigned to the "Diğer" (diger) sector.
 * Usage: npx tsx scripts/analyze-other-sector.ts
 */
import fs from "node:fs";
import path from "node:path";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");

type SchemaInput = {
  readonly label?: string;
  readonly id?: string;
};

type ToolSchema = {
  readonly toolName?: string;
  readonly title?: string;
  readonly sector?: string;
  readonly sectorId?: string;
  readonly inputs?: readonly SchemaInput[];
};

function fileSlugFromName(fileName: string): string {
  return fileName.replace(/-schema\.json$/i, "");
}

function main(): void {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas directory not found: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter((file) => file.endsWith(".json"));
  const otherTools: { slug: string; name: string; inputs: string[] }[] = [];

  for (const file of files) {
    const schema = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8")) as ToolSchema;
    const sectorId = schema.sectorId ?? "";
    if (sectorId === "diger" || !sectorId) {
      const slug = schema.toolName ?? fileSlugFromName(file);
      const inputs = (schema.inputs ?? []).map((input) => input.label ?? input.id ?? "");
      otherTools.push({
        slug,
        name: slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        inputs,
      });
    }
  }

  console.log(`"Diğer" kategorisinde ${otherTools.length} araç var (toplam ${files.length}).`);
  console.log("\nİlk 50 araç:");
  for (const tool of otherTools.slice(0, 50)) {
    console.log(`  - ${tool.name} (${tool.inputs.slice(0, 3).join(", ")})`);
  }

  const termCounts: Record<string, number> = {};
  const stopWords = new Set(["calculator", "hesaplayici", "schema", "tool", "calc"]);

  for (const tool of otherTools) {
    const slugWords = tool.slug.toLowerCase().split("-");
    for (const word of slugWords) {
      if (word.length > 2 && !stopWords.has(word)) {
        termCounts[word] = (termCounts[word] ?? 0) + 1;
      }
    }
    const nameWords = tool.name.toLowerCase().split(" ");
    for (const word of nameWords) {
      if (word.length > 3 && !stopWords.has(word)) {
        termCounts[word] = (termCounts[word] ?? 0) + 1;
      }
    }
  }

  const sorted = Object.entries(termCounts).sort((a, b) => b[1] - a[1]);
  console.log("\nEn sık geçen terimler (slug + ad):");
  for (const [term, count] of sorted.slice(0, 30)) {
    console.log(`  - ${term}: ${count}`);
  }

  const sectorCounts: Record<string, number> = {};
  for (const file of files) {
    const schema = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8")) as ToolSchema;
    const id = schema.sectorId ?? "none";
    sectorCounts[id] = (sectorCounts[id] ?? 0) + 1;
  }

  console.log("\nTüm sektör dağılımı:");
  for (const [id, count] of Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${count}\t${id}`);
  }
}

main();
