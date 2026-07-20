#!/usr/bin/env node
/**
 * RM-LEAN-001 live verification package (G-LIVE)
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.LIVE_VERIFY_SITE || "https://sectorcalc.com";
const HUBS = ["takt-time", "oee", "scrap-rate", "cycle-time", "capacity-utilization"];
const SPOKES = [
  "/lean/muda/oee",
  "/lean/a3/takt-time",
  "/lean/pdca/scrap-rate",
  "/lean/gemba/cycle-time",
  "/lean/muda/capacity-utilization",
  "/lean/pdca/oee",
  "/lean/gemba/takt-time",
  "/lean/a3/scrap-rate",
  "/lean/muda/cycle-time",
  "/lean/pdca/capacity-utilization",
  "/lean/gemba/oee",
  "/lean/a3/cycle-time",
  "/lean/muda/takt-time",
  "/lean/pdca/takt-time",
  "/lean/gemba/scrap-rate",
  "/lean/a3/oee",
  "/lean/muda/scrap-rate",
  "/lean/pdca/cycle-time",
  "/lean/gemba/capacity-utilization",
  "/lean/a3/capacity-utilization",
];

function curlRaw(url, { follow = false, extraHeaders = [] } = {}) {
  const headers = extraHeaders.flatMap((h) => ["-H", h]);
  const args = [
    "curl",
    "-sS",
    "-D",
    "-",
    "-o",
    "/tmp/lean_verify_body.html",
    "-A",
    "Mozilla/5.0",
    "--max-time",
    "30",
    ...headers,
  ];
  if (follow) args.push("-L");
  args.push(url);
  const out = execSync(args.join(" "), { encoding: "utf8", maxBuffer: 8e6 });
  const status = (out.match(/HTTP\/[\d.]+ (\d+)/) || [])[1];
  const loc = (out.match(/^location:\s*(.+)$/im) || [])[1]?.trim();
  const body = readFileSync("/tmp/lean_verify_body.html", "utf8");
  const robots = (body.match(/name="robots"[^>]*content="([^"]+)"/i) || [])[1];
  const canonical = (body.match(/rel="canonical"[^>]*href="([^"]+)"/i) || [])[1];
  const h1 = (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    ?.slice(0, 100);
  return { status: Number(status), loc, robots, canonical, bytes: body.length, h1, body };
}

let fail = 0;
function check(ok, msg) {
  if (!ok) {
    fail += 1;
    console.log("FAIL", msg);
  } else {
    console.log("PASS", msg);
  }
}

console.log("=== G-LIVE hubs ===");
for (const h of HUBS) {
  const r = curlRaw(`${BASE}/calculators/${h}`, { follow: true });
  check(r.status === 200, `/calculators/${h} status=${r.status}`);
  check(/index,\s*follow/i.test(r.robots || ""), `/calculators/${h} robots=${r.robots}`);
  check(
    (r.canonical || "").includes(`/calculators/${h}`),
    `/calculators/${h} canonical=${r.canonical}`,
  );
}

console.log("=== G-LIVE spokes (expect 301) ===");
for (const s of SPOKES) {
  const r = curlRaw(`${BASE}${s}`, { follow: false });
  const metric = s.split("/").pop();
  check(r.status === 301, `${s} status=${r.status}`);
  check(
    Boolean(r.loc && r.loc.includes(`/calculators/${metric}`)),
    `${s} Location=${r.loc}`,
  );
}

console.log("=== G-LIVE /lean methodology hub ===");
const lean = curlRaw(`${BASE}/lean`, { follow: true });
check(lean.status === 200, `/lean status=${lean.status}`);
check(/index,\s*follow/i.test(lean.robots || ""), `/lean robots=${lean.robots}`);
check(/Methodology Hub/i.test(lean.h1 || ""), `/lean h1=${lean.h1}`);
const spokeCards = (
  lean.body.match(
    /href="\/lean\/(pdca|gemba|a3|muda)\/(takt-time|oee|scrap-rate|cycle-time|capacity-utilization)"/g,
  ) || []
).length;
const hubCards = (
  lean.body.match(
    /href="\/calculators\/(takt-time|oee|scrap-rate|cycle-time|capacity-utilization)"/g,
  ) || []
).length;
check(spokeCards === 0, `/lean legacy spoke card links=${spokeCards}`);
check(hubCards >= 5, `/lean canonical hub links=${hubCards}`);
check(lean.body.includes("Canonical Lean Metric"), "/lean has Canonical Lean Metric section");

console.log("=== G-LIVE preview ===");
const previewHeaders = execSync(
  'curl -sS -D - -o /tmp/lean_preview_body.html -A "Mozilla/5.0" --max-time 30 -H "x-fh-requested-host: sectorcalc-bf412.web.app" "https://sectorcalc-bf412.web.app/lean"',
  { encoding: "utf8", maxBuffer: 8e6 },
);
const previewStatus = Number((previewHeaders.match(/HTTP\/[\d.]+ (\d+)/) || [])[1] || 0);
const previewXRobots = (previewHeaders.match(/^x-robots-tag:\s*(.+)$/im) || [])[1]?.trim();
const previewBody = readFileSync("/tmp/lean_preview_body.html", "utf8");
const previewCanonical =
  (previewHeaders.match(/^link:\s*<([^>]+)>;\s*rel="canonical"/im) || [])[1] ||
  (previewBody.match(/rel="canonical"[^>]*href="([^"]+)"/i) || [])[1];
check(previewStatus === 200, `preview /lean status=${previewStatus}`);
check(/noindex/i.test(previewXRobots || ""), `preview X-Robots-Tag=${previewXRobots}`);
check(
  Boolean(previewCanonical && previewCanonical.includes("sectorcalc.com/lean")),
  `preview canonical=${previewCanonical}`,
);

console.log("=== G-LIVE sitemap ===");
const toolsSm = execSync("curl -sS --max-time 45 https://sectorcalc.com/sitemaps/tools.xml", {
  encoding: "utf8",
  maxBuffer: 20e6,
});
const spokeSm = (toolsSm.match(/\/lean\/(pdca|gemba|a3|muda)\//g) || []).length;
check(spokeSm === 0, `sitemap spoke URLs=${spokeSm}`);
for (const h of HUBS) {
  check(toolsSm.includes(`/calculators/${h}`), `sitemap has /calculators/${h}`);
}
check(toolsSm.includes("https://sectorcalc.com/lean"), "sitemap has /lean");

console.log(fail === 0 ? "G-LIVE=PASS" : `G-LIVE=FAIL count=${fail}`);
process.exit(fail === 0 ? 0 : 1);
