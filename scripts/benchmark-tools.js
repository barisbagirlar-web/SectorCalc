/**
 * Benchmarks generated tool calculate functions (cold import + single run).
 * Run: npm run benchmark:tools
 */
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.join(__dirname, "..");
const generatedDir = path.join(ROOT, "generated");
const schemasDir = path.join(ROOT, "generated", "schemas");

const TR_CHAR_MAP = {
  ğ: "g",
  Ğ: "G",
  ü: "u",
  Ü: "U",
  ş: "s",
  Ş: "S",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ç: "c",
  Ç: "C",
};

function normalizeAscii(str) {
  return str.replace(/[ğĞüÜşŞıİöÖçÇ]/g, (char) => TR_CHAR_MAP[char] ?? char);
}

function toSafePascalCase(str) {
  let name = normalizeAscii(str.trim())
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!name) name = "Value";
  if (/^\d/.test(name)) name = `Tool${name}`;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function buildDefaultInput(schema) {
  const input = {};
  for (const field of schema.inputs ?? []) {
    if (field.default !== undefined && field.default !== null) {
      input[field.id] = field.default;
    }
  }
  return input;
}

async function benchmarkTool(slug) {
  const toolPath = path.join(generatedDir, `${slug}.ts`);
  const schemaPath = path.join(schemasDir, `${slug}-schema.json`);

  const importStart = performance.now();
  const mod = await import(pathToFileURL(toolPath).href);
  const importMs = performance.now() - importStart;

  const pascalName = toSafePascalCase(slug);
  const fnName = `calculate${pascalName}`;
  const calculate = mod[fnName];
  if (typeof calculate !== "function") {
    throw new Error(`Missing export ${fnName}`);
  }

  let input = {};
  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    input = buildDefaultInput(schema);
  }

  const calcStart = performance.now();
  calculate(input);
  const calcMs = performance.now() - calcStart;

  return { slug, importMs, calcMs, totalMs: importMs + calcMs };
}

async function main() {
  if (!fs.existsSync(generatedDir)) {
    console.error(`Generated directory not found: ${generatedDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(generatedDir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => f.replace(/\.ts$/, ""));

  console.log(`Benchmarking ${files.length} tools...\n`);

  const results = [];
  for (const slug of files) {
    process.stdout.write(`  ${slug} ... `);
    try {
      const row = await benchmarkTool(slug);
      results.push(row);
      console.log(
        `import ${row.importMs.toFixed(1)}ms | calc ${row.calcMs.toFixed(2)}ms | total ${row.totalMs.toFixed(1)}ms`,
      );
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      results.push({ slug, error: err.message });
    }
  }

  const ok = results.filter((r) => !r.error);
  if (ok.length === 0) {
    console.log("\nNo successful benchmarks.");
    process.exit(1);
  }

  const avgImport = ok.reduce((s, r) => s + r.importMs, 0) / ok.length;
  const avgCalc = ok.reduce((s, r) => s + r.calcMs, 0) / ok.length;
  const slowest = [...ok].sort((a, b) => b.totalMs - a.totalMs).slice(0, 5);

  console.log("\n--- Summary ---");
  console.log(`Passed: ${ok.length}/${files.length}`);
  console.log(`Avg import: ${avgImport.toFixed(1)}ms`);
  console.log(`Avg calc:   ${avgCalc.toFixed(2)}ms`);
  console.log("\nSlowest (import + calc):");
  for (const row of slowest) {
    console.log(`  ${row.slug}: ${row.totalMs.toFixed(1)}ms`);
  }

  if (results.some((r) => r.error)) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
