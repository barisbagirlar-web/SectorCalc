#!/usr/bin/env bash
set -Eeuo pipefail

say(){ printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }
fail(){ printf '\nERROR: %s\n' "$*" >&2; exit 1; }

ROOT="$(pwd -P)"
DEST="$ROOT/tools/sectorcalc-sentinel-ultimate"
SOURCE_DIR="$ROOT/sectorcalc-sentinel-ultimate"
SOURCE_ZIP="$ROOT/sectorcalc-sentinel-ultimate.zip"
CONFIG="$ROOT/sentinel.config.yaml"
BRIDGE="$ROOT/.sentinel/sectorcalc.bridge.mjs"

[[ -f "$ROOT/package.json" ]] || fail "Run this script from the SectorCalc-p5a repository root (package.json not found)."
[[ -d "$ROOT/src" ]] || fail "Run this script from the SectorCalc-p5a repository root (src/ not found)."

say "Preparing installation directory"
mkdir -p "$ROOT/tools" "$ROOT/.sentinel" "$ROOT/.sentinel/auth" "$ROOT/.sentinel/logs" "$ROOT/.github/workflows"

if [[ -d "$DEST" ]]; then
  say "Sentinel is already at $DEST"
elif [[ -d "$SOURCE_DIR" ]]; then
  say "Moving sectorcalc-sentinel-ultimate into tools/"
  mv "$SOURCE_DIR" "$DEST"
elif [[ -f "$SOURCE_ZIP" ]]; then
  say "Extracting sectorcalc-sentinel-ultimate.zip into tools/"
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  unzip -q "$SOURCE_ZIP" -d "$TMP"
  [[ -d "$TMP/sectorcalc-sentinel-ultimate" ]] || fail "ZIP does not contain sectorcalc-sentinel-ultimate/."
  mv "$TMP/sectorcalc-sentinel-ultimate" "$DEST"
else
  fail "Cannot find sectorcalc-sentinel-ultimate/ or sectorcalc-sentinel-ultimate.zip in $ROOT"
fi

# Never reuse node_modules copied from another machine/container.
rm -rf "$DEST/node_modules"

say "Patching Sentinel for TypeScript repository imports"
node - "$DEST/package.json" <<'NODE'
const fs = require('fs');
const file = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.version = pkg.version || '3.1.0';
pkg.dependencies = {...(pkg.dependencies || {}), tsx: '^4.20.3'};
const modes = ['static','pipeline','browser','canary','deep','release','daemon','bootstrap-oracles'];
pkg.scripts ||= {};
for (const mode of modes) {
  const key = `sentinel:${mode}`;
  pkg.scripts[key] = `node --import tsx src/cli.mjs ${mode}`;
}
pkg.scripts['sentinel:capture-owner'] = 'node --import tsx scripts/capture-auth-state.mjs owner';
pkg.scripts['sentinel:capture-normal'] = 'node --import tsx scripts/capture-auth-state.mjs normal-user';
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
NODE

cat > "$DEST/scripts/capture-auth-state.mjs" <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { chromium } from 'playwright';
import YAML from 'yaml';

const role = process.argv[2];
if (!['owner', 'normal-user'].includes(role)) {
  throw new Error('Usage: capture-auth-state.mjs owner|normal-user');
}
const configPath = path.resolve(process.env.SECTORCALC_SENTINEL_CONFIG || 'sentinel.config.yaml');
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'));
const root = path.resolve(config.repoRoot || '.');
const target = path.resolve(root, role === 'owner' ? config.browser.ownerStorageState : config.browser.normalUserStorageState);
fs.mkdirSync(path.dirname(target), { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(new URL('/pro-tools', config.baseUrl).toString(), { waitUntil: 'domcontentloaded' });
console.log(`\nSign in as the dedicated ${role} account in the opened Chromium window.`);
console.log('Do not paste credentials into the terminal.');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await rl.question('After the account is visibly signed in, press ENTER here: ');
await context.storageState({ path: target, indexedDB: true });
rl.close();
await browser.close();
console.log(`Saved authenticated browser state: ${target}`);
NODE

say "Creating portable repository-root configuration"
if [[ ! -f "$CONFIG" ]]; then
  cp "$DEST/config/sentinel.config.example.yaml" "$CONFIG"
fi
python3 - "$CONFIG" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1])
s=p.read_text()
lines=[]
for line in s.splitlines():
    if line.startswith('repoRoot:'):
        lines.append('repoRoot: .')
    else:
        lines.append(line)
p.write_text('\n'.join(lines)+'\n')
PY

if [[ ! -f "$BRIDGE" ]]; then
  cp "$DEST/integration/sectorcalc.bridge.template.mjs" "$BRIDGE"
fi

say "Installing root GitHub Actions workflows"
for wf in "$DEST"/.github/workflows/*.yml; do
  cp "$wf" "$ROOT/.github/workflows/$(basename "$wf")"
done

say "Adding safe ignore rules"
cat >> "$ROOT/.gitignore" <<'EOF_GITIGNORE'

# SectorCalc Sentinel Ultimate runtime evidence and private auth states
.sentinel/auth/
.sentinel/ultimate/
.sentinel/logs/
reports/sectorcalc-sentinel-ultimate/artifacts/
tools/sectorcalc-sentinel-ultimate/node_modules/
EOF_GITIGNORE
# De-duplicate .gitignore while preserving first occurrence.
awk '!seen[$0]++' "$ROOT/.gitignore" > "$ROOT/.gitignore.tmp" && mv "$ROOT/.gitignore.tmp" "$ROOT/.gitignore"

say "Adding root npm commands"
node - "$ROOT/package.json" <<'NODE'
const fs = require('fs');
const file = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.scripts ||= {};
const prefix = 'SECTORCALC_SENTINEL_CONFIG=sentinel.config.yaml node --import tsx tools/sectorcalc-sentinel-ultimate/src/cli.mjs';
for (const mode of ['static','pipeline','browser','canary','deep','release','daemon','bootstrap-oracles']) {
  pkg.scripts[`sentinel:${mode}`] = `${prefix} ${mode}`;
}
pkg.scripts['sentinel:capture-owner'] = 'SECTORCALC_SENTINEL_CONFIG=sentinel.config.yaml node --import tsx tools/sectorcalc-sentinel-ultimate/scripts/capture-auth-state.mjs owner';
pkg.scripts['sentinel:capture-normal'] = 'SECTORCALC_SENTINEL_CONFIG=sentinel.config.yaml node --import tsx tools/sectorcalc-sentinel-ultimate/scripts/capture-auth-state.mjs normal-user';
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
NODE

say "Installing dependencies"
(
  cd "$DEST"

  # The distributed lockfile may have been generated against a private build registry.
  # Such resolved URLs remain pinned even when npm's configured registry changes.
  if [[ -f package-lock.json ]] && grep -q "packages.applied-caas-gateway1.internal.api.openai.org" package-lock.json; then
    say "Removing non-portable private-registry package-lock.json"
    rm -f package-lock.json
  fi

  rm -rf node_modules
  npm install --registry=https://registry.npmjs.org/
  npx playwright install chromium
  npm test
  npm run check
)

say "Checking repository bridge"
if grep -q "IMPLEMENT discoverTools" "$BRIDGE"; then
  cat <<EOF_BLOCKED

INSTALLATION_FILES_READY=YES
DEPENDENCIES_INSTALLED=YES
PLAYWRIGHT_CHROMIUM_INSTALLED=YES
PACKAGE_TESTS=PASS

SENTINEL_START=BLOCKED
REASON=REAL_REPOSITORY_BRIDGE_NOT_IMPLEMENTED
FILE=$BRIDGE

The bridge must import the actual SectorCalc catalog, contracts, adapter, normalizer,
formula registry and report builder. Do not copy formulas into the bridge.
EOF_BLOCKED
  exit 42
fi

say "Running fail-closed static and real-pipeline gates"
cd "$ROOT"
npm run sentinel:static
npm run sentinel:pipeline

if [[ -s "$ROOT/.sentinel/auth/owner.json" ]]; then
  say "Starting continuous Sentinel daemon"
  if [[ -f "$ROOT/.sentinel/ultimate/daemon.pid" ]] && kill -0 "$(cat "$ROOT/.sentinel/ultimate/daemon.pid")" 2>/dev/null; then
    say "Daemon already running with PID $(cat "$ROOT/.sentinel/ultimate/daemon.pid")"
  else
    mkdir -p "$ROOT/.sentinel/ultimate"
    nohup npm run sentinel:daemon > "$ROOT/.sentinel/logs/sentinel-daemon.log" 2>&1 &
    echo $! > "$ROOT/.sentinel/ultimate/daemon.pid"
    say "Daemon started with PID $(cat "$ROOT/.sentinel/ultimate/daemon.pid")"
  fi
else
  cat <<'EOF_AUTH'

STATIC_GATE=PASS
PIPELINE_GATE=PASS
DAEMON_START=WAITING_FOR_OWNER_BROWSER_STATE

Run:
  npm run sentinel:capture-owner
Then rerun this installer or start:
  nohup npm run sentinel:daemon > .sentinel/logs/sentinel-daemon.log 2>&1 &
EOF_AUTH
fi

say "Installation complete"