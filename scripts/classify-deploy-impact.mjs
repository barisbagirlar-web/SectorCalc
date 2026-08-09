#!/usr/bin/env node
/**
 * Fail-closed classifier for production deploy impact.
 *
 * Input: newline-delimited repository paths on stdin.
 * Output: DEPLOY_REQUIRED=true|false and a redacted reason summary.
 *
 * Only paths proven to be non-runtime may suppress a production deployment.
 * Unknown paths always require deployment.
 */
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const paths = Buffer.concat(chunks)
  .toString('utf8')
  .split(/\r?\n/)
  .map((value) => value.trim())
  .filter(Boolean);

const exactNonRuntime = new Set([
  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  'CODEOWNERS',
  'CONTRIBUTING.md',
  'LICENSE',
  'README.md'
]);

const nonRuntimePrefixes = [
  '.github/',
  'docs/',
  'tests/'
];

const nonRuntimeScriptPatterns = [
  /^scripts\/guard-[^/]+\.(?:mjs|cjs|js|ts)$/,
  /^scripts\/verify-[^/]+\.(?:mjs|cjs|js|ts)$/,
  /^scripts\/check-[^/]+\.(?:mjs|cjs|js|ts)$/,
  /^scripts\/classify-deploy-impact\.mjs$/
];

function isProvenNonRuntime(path) {
  if (exactNonRuntime.has(path)) return true;
  if (nonRuntimePrefixes.some((prefix) => path.startsWith(prefix))) return true;
  return nonRuntimeScriptPatterns.some((pattern) => pattern.test(path));
}

if (paths.length === 0) {
  console.log('DEPLOY_REQUIRED=true');
  console.log('DEPLOY_REASON=no-diff-input-fail-closed');
  process.exit(0);
}

const runtimePaths = paths.filter((path) => !isProvenNonRuntime(path));
const deployRequired = runtimePaths.length > 0;

console.log(`DEPLOY_REQUIRED=${deployRequired ? 'true' : 'false'}`);
console.log(
  deployRequired
    ? `DEPLOY_REASON=runtime-or-unknown-paths count=${runtimePaths.length}`
    : `DEPLOY_REASON=proven-non-runtime-only count=${paths.length}`
);
