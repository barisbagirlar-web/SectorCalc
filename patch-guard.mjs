import fs from "fs";
const file = "scripts/guard-root-only.mjs";
let content = fs.readFileSync(file, "utf8");
content = content.replace(
  "const IGNORE_PATTERNS = [",
  "const IGNORE_PATTERNS = [\n  /\\\\.firebase\\//,\n  /\\\\.npm-cache\\//,\n  /_audit_.*\\\\.txt/,\n  /playwright-report\\//,\n  /public\\\\/\\\\.well-known\\//,\n  /functions\\\\/package-lock\\\\.json/,"
);
fs.writeFileSync(file, content);
