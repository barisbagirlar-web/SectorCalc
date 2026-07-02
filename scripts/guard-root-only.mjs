import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const ignoredDirs = new Set([
  ".git",
  ".next", ".npm-cache",
  "node_modules",
  "out",
  "dist",
  "coverage",
  ".turbo",
  ".vercel",
  ".firebase"
]);

const ignoredFiles = new Set([
  "scripts/guard-root-only.mjs", "AGENTS.md", "_audit_ascii.txt", "package-lock.json", "functions/package-lock.json", "public/.well-known/openapi.yaml"
]);

const textExt = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".md", ".mdx", ".txt", ".xml", ".html",
  ".yml", ".yaml", ".css", ".scss"
]);

const rules = [
  ["locale route folder", /(?:^|\/)(\[locale\]|\[lang\]|\[language\])(?:\/|$)/i],
  ["locale path /en", /['"`]\/en(?:\/|['"`?#])/i],
  ["locale path /tr", /['"`]\/tr(?:\/|['"`?#])/i],
  ["next i18n config", /\bi18n\s*:\s*\{/],
  ["locales config", /\blocales\s*:\s*\[/],
  ["defaultLocale config", /\bdefaultLocale\s*:/],
  ["localeDetection config", /\blocaleDetection\s*:/],
  ["next-intl", /\bnext-intl\b/],
  ["i18next", /\bi18next\b|\breact-i18next\b/],
  ["next-translate", /\bnext-translate\b/],
  ["hreflang", /\bhreflang\b/i],
  ["metadata alternates languages", /languages\s*:\s*\{/i],
  ["NEXT_LOCALE", /\bNEXT_LOCALE\b/],
  ["Accept-Language routing", /Accept-Language|accept-language|intl-localematcher|Negotiator/i],
  ["locale rewrite source", /source\s*:\s*['"`]\/(?:en|tr)(?:\/|:|\*)/i],
  ["locale redirect destination", /destination\s*:\s*['"`]\/(?:en|tr)(?:\/|['"`?#])/i],
  ["beforeFiles rewrite block", /beforeFiles\s*:\s*\[[\s\S]*?\/(?:en|tr)/i]
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      files.push(full);
      walk(full, files);
      continue;
    }

    if (entry.isFile()) {
      if (ignoredFiles.has(rel)) continue;
      if (textExt.has(path.extname(full))) files.push(full);
    }
  }

  return files;
}

const violations = [];

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");

  if (/\/(en|tr)(\/|$)/i.test(`/${rel}`)) {
    violations.push({
      file: rel,
      rule: "blocked locale path in file tree",
      match: rel
    });
  }

  if (!fs.statSync(file).isFile()) continue;

  const content = fs.readFileSync(file, "utf8");

  for (const [label, regex] of rules) {
    const match = content.match(regex);
    if (match) {
      violations.push({
        file: rel,
        rule: label,
        match: match[0].replace(/\s+/g, " ").slice(0, 180)
      });
    }
  }
}

if (violations.length) {
  console.error("\nROOT_ONLY_ROUTE_GUARD_FAIL=YES\n");

  for (const v of violations) {
    console.error(`- ${v.file}`);
    console.error(`  rule: ${v.rule}`);
    console.error(`  match: ${v.match}\n`);
  }

  console.error("SectorCalc policy violation: /en, /tr and locale routing are forbidden.\n");
  process.exit(1);
}

console.log("ROOT_ONLY_ROUTE_GUARD_PASS=YES");
