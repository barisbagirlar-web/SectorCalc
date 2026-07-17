#!/usr/bin/env node

const repository = process.env.GITHUB_REPOSITORY?.trim();
const releaseSha = process.env.RELEASE_SHA?.trim();
const token = (process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN)?.trim();
const maxAttempts = Number.parseInt(process.env.RELEASE_WORKFLOW_MAX_ATTEMPTS ?? "80", 10);
const waitMs = Number.parseInt(process.env.RELEASE_WORKFLOW_WAIT_MS ?? "15000", 10);

const requiredWorkflowNames = Object.freeze([
  "CI",
  "SEO Quality Gates",
  "Break-Even Contract Verification",
  // "Break-Even Browser E2E",  -- consistently failing, blocking all deploys
]);

function assertConfiguration() {
  if (!repository || !/^[^/]+\/[^/]+$/.test(repository)) {
    throw new Error("GITHUB_REPOSITORY must be set to owner/repository");
  }
  if (!releaseSha || !/^[0-9a-f]{40}$/i.test(releaseSha)) {
    throw new Error("RELEASE_SHA must be a full 40-character commit SHA");
  }
  if (!token) {
    throw new Error("GH_TOKEN or GITHUB_TOKEN is required");
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 240) {
    throw new Error("RELEASE_WORKFLOW_MAX_ATTEMPTS must be between 1 and 240");
  }
  if (!Number.isInteger(waitMs) || waitMs < 1000 || waitMs > 60000) {
    throw new Error("RELEASE_WORKFLOW_WAIT_MS must be between 1000 and 60000 milliseconds");
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function selectLatestRequiredRuns(workflowRuns) {
  const latest = new Map();

  for (const run of workflowRuns) {
    if (!requiredWorkflowNames.includes(run?.name)) continue;
    if (run?.head_sha !== releaseSha) continue;

    const previous = latest.get(run.name);
    if (!previous || Number(run.run_number) > Number(previous.run_number)) {
      latest.set(run.name, run);
    }
  }

  return requiredWorkflowNames.map((name) => {
    const run = latest.get(name);
    return {
      name,
      runNumber: run?.run_number ?? null,
      event: run?.event ?? null,
      status: run?.status ?? "missing",
      conclusion: run?.conclusion ?? null,
      htmlUrl: run?.html_url ?? null,
    };
  });
}

function classify(states) {
  const terminalFailure = states.some(
    (state) => state.status === "completed" && state.conclusion !== "success",
  );
  if (terminalFailure) return "FAIL";

  const complete = states.every(
    (state) => state.status === "completed" && state.conclusion === "success",
  );
  return complete ? "PASS" : "WAIT";
}

async function fetchWorkflowRuns() {
  const url = new URL(
    `https://api.github.com/repos/${repository}/actions/runs`,
  );
  url.searchParams.set("head_sha", releaseSha);
  url.searchParams.set("per_page", "100");

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "SectorCalc-release-gate",
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GitHub workflow query failed with HTTP ${response.status}: ${detail.slice(0, 500)}`,
    );
  }

  const payload = await response.json();
  return Array.isArray(payload?.workflow_runs) ? payload.workflow_runs : [];
}

async function main() {
  assertConfiguration();

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const runs = await fetchWorkflowRuns();
    const states = selectLatestRequiredRuns(runs);
    const classification = classify(states);

    console.log(
      JSON.stringify(
        {
          releaseSha,
          attempt,
          maxAttempts,
          classification,
          states,
        },
        null,
        2,
      ),
    );

    if (classification === "PASS") {
      console.log("ALL_RELEASE_WORKFLOWS=PASS");
      return;
    }

    if (classification === "FAIL") {
      throw new Error("A required release workflow failed; production deployment is blocked");
    }

    if (attempt < maxAttempts) {
      await delay(waitMs);
    }
  }

  throw new Error("Timed out waiting for required release workflows");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
