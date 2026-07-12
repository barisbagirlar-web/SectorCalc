# SECTORCALC SENTINEL ULTIMATE — INSTALL, WIRE, RELEASE-WALL AND START MANDATE

Work inside the existing local repository named `SectorCalc-p5a`.
The folder `sectorcalc-sentinel-ultimate` has already been placed somewhere inside that repository.

## Objective

Install it at the canonical location, connect it to the real SectorCalc runtime, make it fail-closed, run the first audits, and start the continuous daemon.

Do not return a plan-only response. Execute the work.
Do not report PASS from package installation alone.
Do not copy production formulas into Sentinel.
Do not create fake contracts or mock runtime results.

## 1. Safety preflight

1. Confirm the terminal is at the `SectorCalc-p5a` Git root.
2. Record:
   - current branch
   - current commit
   - working-tree status
3. Do not delete or overwrite unrelated local changes.
4. Create an installation branch and rollback tag.
5. Locate exactly one source folder named `sectorcalc-sentinel-ultimate`.

## 2. Canonical placement

The only allowed installed location is:

`tools/sectorcalc-sentinel-ultimate`

If the package is at repository root, move it there with Git-aware file operations.
Do not leave a duplicate package at root.
Do not commit `node_modules`.

Run the supplied installer from the Git root:

```bash
bash install-sectorcalc-sentinel-ultimate.sh
```

If the installer is not already present, copy it from the user-provided artifact into the repository root first.

An exit code of 42 is expected until the real repository bridge is implemented. It is not an installation failure.

## 3. TypeScript integration requirement

SectorCalc runtime files are TypeScript. Sentinel must run with the `tsx` loader.
Confirm:

- `tsx` is installed in `tools/sectorcalc-sentinel-ultimate`
- Sentinel CLI commands use `node --import tsx`
- GitHub workflows also invoke Sentinel with `node --import tsx`, or use root npm scripts that do so

Do not import TypeScript using plain Node.js without a loader.

## 4. Implement the real repository bridge

Implement:

`.sentinel/sectorcalc.bridge.mjs`

The bridge must import and execute the real repository modules. It must not duplicate formulas or invent key mappings.

Required methods:

### `discoverTools()`

Read the actual PRO catalog/manifest/registry used by `/pro-tools`.
Return exactly the 20 live self-service PRO tools:

```js
[{ slug, title, route: `/tools/pro/${slug}` }]
```

No hardcoded shadow catalog is allowed unless it is generated directly from the production manifest and parity-checked.

### `getToolContract(slug)`

Resolve the actual deterministic PRO definition and return:

- slug
- title
- toolKey
- creditCost
- formula file
- real form fields
- formFieldId
- schemaInputId
- normalizedId
- required flag
- control type
- unit family
- label
- actual formula input keys
- actual formula output keys
- expected output keys
- three actual presets
- tool-specific report markers

Field and output information must come from current source contracts and schemas, not regex guesses when direct exports exist.

### `executePipeline(...)`

Execute this exact real chain:

```text
preset
→ form state
→ registered production adapter
→ raw_inputs and selected_units
→ required-input validation
→ production normalizeInputs
→ normalized formula inputs
→ production formula registry
→ server formula
→ output-contract validation
→ tool-specific report builder
```

Return evidence for every intermediate layer.

The bridge must not call only `calculate()` with already-normalized test data.
It must prove nonzero form values survive adapter and normalization.

### `readCreditBalance({ identity })`

Use the real audited server-side credit ledger in read-only mode.
Do not scrape the UI.
Do not expose service-account credentials.
This method is mandatory for release mode.

### `getBuildInfo()`

Return the current Git commit, build ID when available, and environment.

## 5. Resolve real source layout

Inspect the repository and update `sentinel.config.yaml` so these directories point to the actual current paths:

- schemaDir
- formulaDir
- contractDir
- adapterDir
- insightDir
- presetDir
- goldenDir

Do not preserve example paths if the repository differs.
Keep:

```yaml
repoRoot: .
```

This is required so local and GitHub Actions executions use the same portable config.

## 6. Stable browser hooks

Inspect the shared PRO V2 form and report components. Add only nonvisual data attributes when missing:

```html
<form data-pro-v2-form="<slug>">
<div data-pro-runtime-ready="true"></div>
<button data-sentinel-preset="<preset-id>">
<button data-testid="pro-calculate">
<section data-pro-v2-report data-tool-slug="<slug>">
<button data-testid="export-pdf">
<button data-testid="copy-summary">
```

Do not change design, visible copy, formula logic, Free tools, pricing, auth semantics, credits, or PDF layout while adding hooks.

## 7. Root command integration

Confirm the root `package.json` contains working commands:

- sentinel:static
- sentinel:pipeline
- sentinel:browser
- sentinel:canary
- sentinel:deep
- sentinel:release
- sentinel:daemon
- sentinel:bootstrap-oracles
- sentinel:capture-owner
- sentinel:capture-normal

All commands must load `sentinel.config.yaml` from the repository root.

## 8. Authentication states

Create browser states interactively; never put passwords in code or terminal history.

Run:

```bash
npm run sentinel:capture-owner
```

The user will sign in to the opened Chromium window as `barisbagirlar@gmail.com` and press Enter in the terminal.

For release credit testing, run separately:

```bash
npm run sentinel:capture-normal
```

Use a dedicated normal test user with a controlled known credit balance.

Files under `.sentinel/auth/` must remain gitignored and must never be committed.

## 9. First execution sequence

Run in this order:

```bash
npm run sentinel:static
npm run sentinel:pipeline
npm run sentinel:bootstrap-oracles
npm run sentinel:browser
npm run sentinel:deep
```

`bootstrap-oracles` only creates skeletons. It must not generate expected values from production formulas.
Release remains blocked until all 20 independent oracle files are manually verified.

Do not weaken fail-closed policies to force a green result.

## 10. Start the living inspector on macOS

The development machine is macOS. Do not use the bundled systemd service locally.
Create a LaunchAgent:

`~/Library/LaunchAgents/com.sectorcalc.sentinel-ultimate.plist`

It must:

- use the absolute Node executable returned by `which node`
- execute `node --import tsx tools/sectorcalc-sentinel-ultimate/src/cli.mjs daemon`
- set the working directory to the absolute `SectorCalc-p5a` root
- set `SECTORCALC_SENTINEL_CONFIG` to the absolute `sentinel.config.yaml`
- write stdout/stderr to `.sentinel/logs/`
- use `RunAtLoad=true`
- use `KeepAlive=true`
- restart after failures without spawning duplicates

Load it with modern `launchctl bootstrap`/`kickstart` commands.
Do not use `sudo` for the user LaunchAgent.

Verify:

- exactly one daemon PID
- log file is updating
- first deep audit executed
- subsequent canary schedule is active

## 11. GitHub Actions

Install the four Sentinel workflows at root:

`.github/workflows/`

Confirm all workflow commands use the TypeScript loader.

Required repository secrets:

- `SENTINEL_OWNER_STORAGE_STATE`
- `SENTINEL_NORMAL_STORAGE_STATE`
- `SENTINEL_REPORT_HMAC_KEY`

Do not print secret values.
If secrets are not yet configured, leave workflows fail-closed and report the exact missing secret names.

## 12. Production deployment wall

Integrate `npm run sentinel:release` into the start of the existing authoritative deployment script:

`scripts/deploy-production.mjs`

Requirements:

- Sentinel release runs before any production mutation
- nonzero Sentinel exit aborts deployment
- deployment cannot continue after P0/P1 or missing evidence
- avoid recursive build/deploy calls
- preserve the existing Firebase SSR deployment method
- do not use raw `firebase deploy --only hosting`

Add a guard proving the authoritative deployment script invokes the Sentinel release wall.

## 13. Required first-report truthfulness

The first run is expected to expose missing independent oracles or browser evidence. Do not call this an installation failure.

Allowed state after installation:

- `INSTALLED_AND_RUNNING_FAIL_CLOSED`
- `INSTALLED_BRIDGE_BLOCKED`
- `INSTALLED_AUTH_STATE_PENDING`

Do not report `FULLY_VERIFIED` unless all 20 tools pass the real browser Calculate path and all independent oracle requirements.

## 14. Final evidence

Return only actual evidence:

```text
SOURCE_LOCATION =
INSTALLED_LOCATION =
INSTALL_COMMIT =
ROLLBACK_TAG =

NODE_VERSION =
SENTINEL_VERSION =
DEPENDENCY_INSTALL =
PACKAGE_TESTS =
SYNTAX_CHECK =

BRIDGE_IMPLEMENTED =
DISCOVERED_TOOLS =
CONTRACTS_RESOLVED =
PIPELINES_EXECUTED =
STATIC_STATUS =
PIPELINE_STATUS =
BROWSER_STATUS =
DEEP_STATUS =

OWNER_STATE_PRESENT =
NORMAL_USER_STATE_PRESENT =
DAEMON_PID =
LAUNCHD_STATUS =
LOG_PATH =
LATEST_REPORT =

DEPLOY_WALL_INSTALLED =
GITHUB_WORKFLOWS_INSTALLED =
MISSING_GITHUB_SECRETS =

BLOCKING_FINDINGS =
FINAL_STATUS =
```
