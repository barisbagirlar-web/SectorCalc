import { spawn } from "node:child_process";
import net from "node:net";

async function getFreePort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(String(port)));
    });
    server.on("error", reject);
  });
}

const runToEnd = (cmd, args) =>
  new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
    child.on("exit", (code) => resolve(code ?? 1));
  });

const port = process.env.ROOT_ONLY_SMOKE_PORT || await getFreePort();
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
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probe(pathname, redirect = "manual") {
  try {
    const res = await fetch(`${base}${pathname}`, { redirect });
    return { status: res.status, url: res.url, location: res.headers.get("location") };
  } catch (error) {
    return { status: 0, url: "", location: null, error: String(error?.message || error) };
  }
}

async function waitForReady() {
  for (let i = 0; i < 60; i += 1) {
    const res = await probe("/", "follow");
    if (res.status === 200) return true;
    await sleep(1000);
  }

  return false;
}

console.log("ROOT_ONLY_RUNTIME_SMOKE=START");
console.log("POLICY=ROOT_ROUTES_200_AND_PUBLIC_EN_PREFIX_404_OR_410");
console.log(`LOCAL_BASE=${base}`);

if (await runToEnd("npx", ["next", "build"]) !== 0) {
  console.log("BLOCKER=SMOKE_BUILD_FAILED");
  process.exit(1);
}

const server = spawn("npx", ["next", "start", "-p", port, "-H", host], {
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

function stopServer() {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {}
}

process.on("exit", stopServer);
process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});

if (!(await waitForReady())) {
  stopServer();
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

  if (res.status !== 200) rootFail += 1;
  if (finalPath === "/en" || finalPath.startsWith("/en/")) rootFail += 1;
}

for (const route of forbiddenEnRoutes) {
  const initial = await probe(route, "manual");
  const followed = await probe(route, "follow");

  console.log(`FORBIDDEN_EN_ROUTE\tinitial=${initial.status}\tfollowed=${followed.status}\troute=${route}\tlocation=${initial.location || ""}\tfinal=${followed.url}`);

  if (![404, 410].includes(initial.status)) enFail += 1;
  if (![404, 410].includes(followed.status)) enFail += 1;
}

console.log(`ROOT_ROUTE_FAIL_COUNT=${rootFail}`);
console.log(`EN_PREFIX_HARD_BLOCK_FAIL_COUNT=${enFail}`);

stopServer();

if (rootFail > 0 || enFail > 0) {
  console.log("ROOT_ONLY_RUNTIME_SMOKE_RESULT=FAIL");
  process.exit(1);
}

console.log("ROOT_ONLY_RUNTIME_SMOKE_RESULT=PASS");
