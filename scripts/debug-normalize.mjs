import * as fs from "fs";

const text = fs.readFileSync("src/lib/premium-schema/user-premium-formulas.ts", "utf8");
const lines = text.split("\n");
const toolCommentRe = /\/\/\s*─+\s*(.+?)\s+\((\d+)\s+formulas\)\s*─+/;

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/[&\/\\]/g, " ")
    .replace(/[^a-z0-9\sçşğüöı]/g, " ")
    .replace(/ç/g, "c").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    .replace(/\s+/g, " ").trim().replace(/\s+/g, "-");
}

console.log("=== Tool comment headers vs schema file names ===");
for (const line of lines) {
  const m = line.match(toolCommentRe);
  if (m) {
    const normalized = normalize(m[1]);
    // Check if a file with this name exists
    const schemaFile = `src/lib/premium-schema/schemas/${normalized}.ts`;
    const exists = fs.existsSync(schemaFile);
    if (!exists) {
      console.log(`NO FILE: "${m[1]}" → normalized: "${normalized}"`);
    }
  }
}
