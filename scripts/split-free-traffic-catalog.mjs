import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src/lib/tools");
const FILE = join(SRC, "free-traffic-catalog.ts");
const OUT = join(SRC, "free-traffic-catalog");

const lines = readFileSync(FILE, "utf-8").split("\n");

// === STEP 1: Find sections ===
const typeEnd = lines.findIndex(l => l.includes("export const FREE_TRAFFIC_TOOLS:"));
console.log(`Types: lines 0-${typeEnd - 1}`);

// Find array close: the `];` that terminates FREE_TRAFFIC_TOOLS
let arrayClose = -1;
for (let i = typeEnd; i < lines.length; i++) {
  if (lines[i].trim() === "];") { arrayClose = i; break; }
}
console.log(`Array: lines ${typeEnd}-${arrayClose}`);
console.log(`Helpers: lines ${arrayClose + 1}-${lines.length - 1}`);

// === STEP 2: Parse tools ===
const tools = [];
let braceCount = 0;
let inTool = false;
let toolBuf = [];
let toolCat = null;

for (let i = typeEnd + 1; i < arrayClose; i++) {
  const raw = lines[i];
  const ob = (raw.match(/\{/g) || []).length;
  const cb = (raw.match(/\}/g) || []).length;

  if (!inTool && ob > 0) {
    // Tool starts
    inTool = true;
    braceCount = ob - cb;
    toolBuf = [raw];
    toolCat = null;
    continue;
  }

  if (inTool) {
    toolBuf.push(raw);
    braceCount += ob - cb;

    // Extract category
    if (!toolCat) {
      const m = raw.match(/"category":\s*"([^"]+)"/);
      if (m) toolCat = m[1];
    }

    if (braceCount <= 0) {
      // Tool ends
      if (toolCat) tools.push({ category: toolCat, content: toolBuf.join("\n") });
      inTool = false;
      toolBuf = [];
    }
  }
}

console.log(`\nParsed ${tools.length} tools`);

// === STEP 3: Group by category ===
const groups = {};
for (const t of tools) {
  if (!groups[t.category]) groups[t.category] = [];
  groups[t.category].push(t.content);
}

const cats = Object.keys(groups).sort();
for (const c of cats) console.log(`  ${c}: ${groups[c].length}`);

// === STEP 4: Write output ===
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Types
writeFileSync(join(OUT, "types.ts"), lines.slice(0, typeEnd).join("\n"));

// Helpers
writeFileSync(join(OUT, "helpers.ts"), lines.slice(arrayClose + 1).join("\n"));

// Category files
for (const cat of cats) {
  const cn = cat.toUpperCase().replace(/-/g, "_");
  const catLines = [
    `import type { FreeTrafficTool } from "./types";`,
    ``,
    `export const ${cn}_TOOLS: readonly FreeTrafficTool[] = [`,
    ...groups[cat],
    `];`,
  ];
  writeFileSync(join(OUT, `${cat}.ts`), catLines.join("\n"));
  console.log(`  ✓ ${cat}.ts`);
}

// Barrel index
const il = [
  `export type { FreeTrafficCategory, FreeTrafficInput, FreeTrafficResultType, FreeTrafficTool } from "./types";`,
  ``,
];
for (const cat of cats) {
  const cn = cat.toUpperCase().replace(/-/g, "_");
  il.push(`import { ${cn}_TOOLS } from "./${cat}";`);
}
il.push(``, `export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = [`);
for (const cat of cats) il.push(`  ...${cat.toUpperCase().replace(/-/g, "_")}_TOOLS,`);
il.push(`];`, ``);
for (const cat of cats) il.push(`export { ${cat.toUpperCase().replace(/-/g, "_")}_TOOLS } from "./${cat}";`);
il.push(``);
il.push(`export { getFreeTrafficToolBySlug, listFreeTrafficToolsByCategory, listRelatedTrafficTools, listFreeTrafficSlugs, getFreeTrafficCategoryLabelKey, FEATURED_TRAFFIC_SLUGS, FREE_TRAFFIC_CATEGORIES } from "./helpers";`);
writeFileSync(join(OUT, "index.ts"), il.join("\n"));

// Backwards-compat shim
writeFileSync(FILE, [
  `/**`,
  ` * Backwards-compatibility re-export.`,
  ` * All data moved to src/lib/tools/free-traffic-catalog/ directory.`,
  ` */`,
  `export * from "./free-traffic-catalog/index";`,
  ``,
].join("\n"));

console.log(`\n✓ Done: ${tools.length} tools in ${cats.length} categories`);
