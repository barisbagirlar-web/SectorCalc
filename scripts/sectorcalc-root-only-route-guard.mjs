import fs from "node:fs";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

if (fs.existsSync("middleware.ts")) {
  fail("FORBIDDEN_ROOT_MIDDLEWARE_TS_EXISTS");
}

if (fs.existsSync("middleware.js")) {
  const diff = spawnSync("git", ["diff", "--quiet", "--", "middleware.js"], { stdio: "ignore" });
  if (diff.status !== 0) {
    fail("ROOT_MIDDLEWARE_JS_MUST_BE_UNMODIFIED_BECAUSE_REPO_GUARD_BLOCKS_TRACKED_DELETION");
  }
}

if (!fs.existsSync("src/middleware.ts")) {
  fail("MISSING_SRC_MIDDLEWARE");
}

const cfg = read("next.config.ts");
const sf = ts.createSourceFile("next.config.ts", cfg, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

let rewritesCount = 0;

function visit(node) {
  if (
    (ts.isMethodDeclaration(node) || ts.isPropertyAssignment(node)) &&
    node.name &&
    ts.isIdentifier(node.name) &&
    node.name.text === "rewrites" &&
    node.parent &&
    ts.isObjectLiteralExpression(node.parent)
  ) {
    rewritesCount += 1;
  }

  ts.forEachChild(node, visit);
}

visit(sf);

if (rewritesCount !== 1) fail(`NEXT_CONFIG_REWRITES_COUNT_NOT_ONE:${rewritesCount}`);
if (!/skipTrailingSlashRedirect\s*:\s*true/.test(cfg)) fail("NEXT_CONFIG_MISSING_SKIP_TRAILING_SLASH_REDIRECT");
if (!cfg.includes("SECTORCALC_ROOT_ONLY_REWRITE_POLICY")) fail("NEXT_CONFIG_MISSING_ROOT_ONLY_REWRITE_POLICY");
if (/{\s*source:\s*["']\/["']\s*,\s*destination:\s*["']\/en["']\s*}/.test(cfg)) fail("NEXT_CONFIG_FORBIDDEN_ROOT_HOMEPAGE_REWRITE");

for (const [source, destination, label] of [
  ['source: "/free-tools"', 'destination: "/en/free-tools"', "FREE_TOOLS"],
  ['source: "/pro-tools"', 'destination: "/en/pro-tools"', "PRO_TOOLS"],
  ['source: "/industries"', 'destination: "/en/industries"', "INDUSTRIES"],
  ['source: "/pricing"', 'destination: "/en/pricing"', "PRICING"],
  ['source: "/calculators/:path*"', 'destination: "/en/calculators/:path*"', "CALCULATORS"],
  ['source: "/tools/:path*"', 'destination: "/en/tools/:path*"', "TOOLS"],
]) {
  if (!cfg.includes(source) || !cfg.includes(destination)) {
    fail(`NEXT_CONFIG_MISSING_${label}_MAPPING`);
  }
}

const mw = read("src/middleware.ts");

if (!/pathname\s*===\s*["']\/en["']/.test(mw)) fail("SRC_MIDDLEWARE_MISSING_EXACT_EN_BLOCK");
if (!/pathname\.startsWith\(["']\/en\/["']\)/.test(mw)) fail("SRC_MIDDLEWARE_MISSING_EN_CHILD_BLOCK");
if (!/status:\s*(404|410)/.test(mw)) fail("SRC_MIDDLEWARE_EN_BLOCK_NOT_404_OR_410");
if (/NextResponse\.rewrite\(/.test(mw) && /\/en/.test(mw)) fail("SRC_MIDDLEWARE_FORBIDDEN_ROOT_TO_EN_REWRITE");
if (!mw.includes("detectRegionFromRequest")) fail("SRC_MIDDLEWARE_REGION_LOGIC_NOT_PRESERVED");
if (!mw.includes("SW_KILL_CODE")) fail("SRC_MIDDLEWARE_SW_KILL_NOT_PRESERVED");

console.log("ROOT_ONLY_POLICY=ROOT_DOMAIN_ENGLISH_ONLY");
console.log("PUBLIC_EN_PREFIX_ALLOWED=FALSE");
console.log("PUBLIC_EN_PREFIX_REDIRECT_ALLOWED=FALSE");
console.log("PUBLIC_EN_PREFIX_REQUIRED_STATUS=404_OR_410");
console.log("ROOT_MIDDLEWARE_JS_STATUS=RESTORED_AND_UNMODIFIED_FOR_REPO_GUARD_COMPAT");
console.log(`ROOT_ONLY_FAILURE_COUNT=${failures.length}`);

for (const failure of failures) console.log(`ROOT_ONLY_FAILURE=${failure}`);

if (failures.length > 0) process.exit(1);

console.log("ROOT_ONLY_ROUTE_GUARD_PASS=YES");
