// SectorCalc V5.3.1 — Secret-Safe Check Script
// Scans source files for obvious secret patterns.
// Must fail on: API keys, private keys, Firebase service account, .env content, bearer tokens, password literals.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const SAFE_DIRS = [
  "src",
  "public",
];

const IGNORED_DIRS = new Set([
  ".git", ".next", "node_modules", "out", "dist", "coverage",
  ".turbo", ".vercel", ".firebase", ".cursor",
  "scratch", "docs", "tests/golden",
]);

const IGNORED_EXTS = new Set([
  ".ico", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
  ".woff", ".woff2", ".ttf", ".eot",
  ".mp4", ".webm", ".ogg",
]);

// Known false-positive patterns — matched content that is safe
const ALLOWLIST_PATTERNS = [
  // Error code string literals, not real API keys
  /MISSING_API_KEY|missing_api_key/,
  // TypeScript type imports (not actual values)
  /\btype\s+ServiceAccount\b/,
  /import\s+type\s+\{[^}]*ServiceAccount[^}]*\}/,
  // Firebase client config property key (not a value)
  /\bapiKey\s*:\s*(?:process\.env\.NEXT_PUBLIC_FIREBASE_API_KEY|FIREBASE_CONFIG_FALLBACK\.apiKey)/,
  // Test fixture secrets used to test redaction (not real credentials)
  /sk_live_abc|sk_test_xyz|super-secret-value|stripe-value|mail-key/,
  // Keyword list arrays (not actual values)
  /"service_account"\s*[,.\]]/,
  /"private_key"\s*[,.\]]/,
  // Taxonomy category labels (not passwords)
  /password\s*:\s*"(?:bilisim|sifre|parola|şifre|informatics)"/i,
  // i18n message key (not a real password/api key)
  /(?:\w+\.)?MISSING_API_KEY\b/,
  // Test fixture with redacted password
  /password\s*:\s*"(?:redacted|placeholder|PASSWORD_TO_BE_REPLACED)"/i,
  // Regex pattern literal containing PRIVATE KEY (used for redaction detection, not a real key)
  /\/-----BEGIN PRIVATE KEY-----/,
  // Environment variable name reference (not actual value)
  /FIREBASE_SERVICE_ACCOUNT_JSON/,
  // Test fixture object with apiKey property (not a real credential)
  /\{[\s\S]*?apiKey\s*:\s*["']secret\d*["']/,
  // Firebase config apiKey using environment variable (not inline value)
  /apiKey\s*:\s*(?:resolvePublicEnv|process\.env)/,
];

// Regex patterns for secrets
const SECRET_PATTERNS = [
  { name: "Private Key PEM", pattern: /BEGIN\s+(RSA|EC|DSA|PRIVATE)\s+KEY/i },
  { name: "API Key assignment", pattern: /['"]?(?:api_key|apikey|api-key)['"]?\s*[:=]\s*['"][^'"]+['"]/i },
  { name: "Secret assignment", pattern: /['"]?(?:secret|SECRET)['"]?\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/ },
  { name: "Bearer token literal", pattern: /['"]Bearer\s+[A-Za-z0-9_\-\.]+['"]/ },
  { name: "Firebase service account", pattern: /firebase-adminsdk|service_account|private_key_id/i },
  { name: "Password literal", pattern: /password\s*[:=]\s*['"][^'"]+['"]/i },
  { name: "Stripe secret key", pattern: /sk_live_[A-Za-z0-9]+/ },
  { name: ".env content commit", pattern: /(?:NEXT_PUBLIC_)?(?:OPENAI|ANTHROPIC|STRIPE|FIREBASE|GOOGLE)_[A-Z_]+=.+/ },
  { name: "Bearer token", pattern: /['"`]Bearer\s+[A-Za-z0-9\-_\.]{20,}['"`]/ },
  { name: "Private key variable", pattern: /private_key(?:_id)?\s*[:=]\s*['"]/i },
];

let totalFiles = 0;
let issuesFound = 0;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!IGNORED_EXTS.has(ext)) {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  return files;
}

console.log(`\n🔒 SectorCalc Secret-Safe Check`);
console.log(`   Scanning source directories: ${SAFE_DIRS.join(", ")}\n`);

for (const dir of SAFE_DIRS) {
  const dirPath = path.join(ROOT, dir);
  if (fs.existsSync(dirPath)) {
    const files = walk(dirPath, []);
    for (const file of files) {
      totalFiles++;
      const content = fs.readFileSync(file, "utf-8");
      for (const { name, pattern } of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          // Check allowlist — skip known false positives
          const relPath = path.relative(ROOT, file);
          const isAllowed = ALLOWLIST_PATTERNS.some((allow) => allow.test(content));
          if (isAllowed) {
            continue;
          }
          console.log(`  ⚠  [${name}] → ${relPath}`);
          issuesFound++;
        }
      }
    }
  }
}

console.log(`\n   Scanned ${totalFiles} files.`);

if (issuesFound > 0) {
  console.log(`   ❌ ${issuesFound} potential secret(s) found.\n`);
  process.exit(1);
} else {
  console.log(`   ✅ No secrets detected.\n`);
}
