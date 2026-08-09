#!/usr/bin/env node
/**
 * Scan untrusted public text (PR titles/bodies, commit messages, issue text) for
 * production credential patterns without ever echoing the matched value.
 *
 * Usage:
 *   printf '%s' "$TEXT" | node scripts/verify-public-text-secrets.mjs
 *
 * Exit codes:
 *   0 = no secret pattern detected
 *   1 = secret pattern detected
 *   3 = no input received
 */

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString('utf8');

if (!input.trim()) {
  console.error('PUBLIC_TEXT_SECRET_SCAN=NO_INPUT');
  process.exit(3);
}

const detectors = [
  { name: 'paddle-api-key', pattern: /pdl_(?:live|sdbx)_apikey_[^\s"'`]{20,}/i },
  { name: 'paddle-webhook-secret', pattern: /pdl_ntfset_[^\s"'`]{20,}/i },
  { name: 'legacy-webhook-secret', pattern: /whsec_[^\s"'`]{20,}/i },
  { name: 'github-pat', pattern: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'github-token', pattern: /gh[pousr]_[A-Za-z0-9]{20,}/ }
];

const hits = detectors.filter(({ pattern }) => pattern.test(input)).map(({ name }) => name);

if (hits.length) {
  console.error(`PUBLIC_TEXT_SECRET_SCAN=FAIL kinds=${hits.sort().join(',')}`);
  process.exit(1);
}

console.log('PUBLIC_TEXT_SECRET_SCAN=PASS');
process.exit(0);
