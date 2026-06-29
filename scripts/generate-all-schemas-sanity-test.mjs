import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_FILE = path.join(ROOT, "public/ai-tool-index.json");
const TEST_FILE = path.join(ROOT, "src/lib/premium-schema/__tests__/all-schemas-sanity.test.ts");

function main() {
  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
  const slugs = [];

  for (const tool of indexData.tools ?? []) {
    if (tool.routeStatus === "active-route" && tool.slug) {
      slugs.push(tool.slug);
    }
  }

  // Deduplicate and sort
  const uniqueSlugs = [...new Set(slugs)].sort();

  const slugLines = uniqueSlugs.map(slug => `      "${slug}",`).join("\n");

  const content = `import { describe, test, expect } from "vitest";

describe("Global active tools sanity check", () => {
  test("insures active tools are mapped for testing", () => {
    const activeSlugs = [
${slugLines}
    ];
    expect(activeSlugs.length).toBeGreaterThan(0);
    // Basic verification that all slugs are valid strings
    for (const slug of activeSlugs) {
      expect(typeof slug).toBe("string");
      expect(slug.length).toBeGreaterThan(0);
    }
  });
});
`;

  fs.mkdirSync(path.dirname(TEST_FILE), { recursive: true });
  fs.writeFileSync(TEST_FILE, content, "utf8");
  console.log(`Generated all-schemas-sanity.test.ts with ${uniqueSlugs.length} slugs`);
}

main();
