#!/usr/bin/env node
import { spawn } from "node:child_process";

const port = process.env.ROOT_ONLY_SMOKE_PORT || "4321";
const host = "127.0.0.1";
const base = `http://${host}:${port}`;

const rootRoutes = [
  "/",
  "/free-tools",
  "/pro-tools",
  "/industries",
  "/pricing",
  "/calculators/fmea-rpn",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
];

const forbiddenEnRoutes = [
  "/en",
  "/en/",
  "/en/free-tools",
  "/en/pro-tools",
  "/en/industries",
  "/en/pricing",
  "/en/calculators/fmea-rpn",
  "/en/about",
  "/en/login",
  "/en/signup",
  "/en/tools",
  "/en/tools/generated",
  "/en/tools/premium-schema/example",
];

let server;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probe(pathname, redirect = "manual") {
  try {
    const res = await fetch(`${base}${pathname}`, { redirect });
    return { status: res.status, url: res.url };
  } catch (error) {
    return { status: 0, url: "", error: String(error?.message || error) };
  }
}

async function waitForReady() {
  for (let i = 0; i < 45; i += 1) {
    const res = await probe("/", "follow");
    if (res.status === 200) return true;
    await sleep(1000);
  }
  return false;
}

function stopServer() {
  if (server?.pid) {
    server.kill("SIGTERM");
  }
}

process.on("exit", stopServer);
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

console.log("ROOT_ONLY_RUNTIME_SMOKE=START");
console.log("POLICY=PUBLIC_EN_PREFIX_MUST_404_OR_410");
console.log(`LOCAL_BASE=${base}`);

server = spawn("npx", ["next", "start", "-p", port, "-H", host], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

const ready = await waitForReady();

if (!ready) {
  console.log("BLOCKER=LOCAL_SERVER_NOT_READY");
  process.exit(1);
}

console.log("LOCAL_SERVER_READY=YES");

let rootFail = 0;
let enFail = 0;

for (const route of rootRoutes) {
  const res = await probe(route, "follow");
  const finalPath = res.url ? new URL(res.url).pathname : "";

  console.log(`ROOT_ROUTE\tstatus=${res.status}\troute=${route}\tfinal=${res.url}`);

  if (![200, 204].includes(res.status)) {
    rootFail += 1;
  }

  if (finalPath === "/en" || finalPath.startsWith("/en/")) {
    rootFail += 1;
    console.log(`ROOT_ROUTE_BLOCKER=FINAL_URL_HAS_EN_PREFIX:${route}`);
  }
}

for (const route of forbiddenEnRoutes) {
  const initial = await probe(route, "manual");
  const followed = await probe(route, "follow");

  console.log(
    `FORBIDDEN_EN_ROUTE\tinitial=${initial.status}\tfollowed=${followed.status}\troute=${route}\tfinal_url=${followed.url}`,
  );

  if (![404, 410].includes(initial.status)) {
    enFail += 1;
    console.log(`EN_PREFIX_BLOCKER=INITIAL_STATUS_NOT_404_OR_410:${route}:${initial.status}`);
  }

  if (![404, 410].includes(followed.status)) {
    enFail += 1;
    console.log(`EN_PREFIX_BLOCKER=FOLLOWED_STATUS_NOT_404_OR_410:${route}:${followed.status}`);
  }

  const finalPath = followed.url ? new URL(followed.url).pathname : "";

  if (finalPath === "/en" || finalPath.startsWith("/en/")) {
    enFail += 1;
    console.log(`EN_PREFIX_BLOCKER=FINAL_URL_STILL_HAS_EN:${route}`);
  }
}

console.log(`ROOT_ROUTE_FAIL_COUNT=${rootFail}`);
console.log(`EN_PREFIX_HARD_BLOCK_FAIL_COUNT=${enFail}`);

if (rootFail > 0 || enFail > 0) {
  console.log("ROOT_ONLY_RUNTIME_SMOKE_RESULT=FAIL");
  process.exit(1);
}

console.log("ROOT_ONLY_RUNTIME_SMOKE_RESULT=PASS");
