#!/usr/bin/env node
/**
 * Best-effort prune of Firebase Hosting preview channels named release-*
 * (except release-candidate). Never throws — deploy seal must continue.
 */
import { spawnSync } from 'node:child_process';

const project = process.env.FIREBASE_PROJECT || 'sectorcalc-prod';
const token = process.env.FIREBASE_TOKEN || '';
if (!token) {
  console.log('[prune] no FIREBASE_TOKEN; skip');
  process.exit(0);
}

function run(args) {
  return spawnSync('npx', ['--yes', 'firebase-tools@14', ...args], {
    encoding: 'utf8',
    env: process.env,
  });
}

try {
  const listed = run(['hosting:channel:list', '--project', project, '--token', token, '--json']);
  const raw = `${listed.stdout || ''}${listed.stderr || ''}`;
  const start = raw.indexOf('{');
  const startArr = raw.indexOf('[');
  const idx = start >= 0 && (startArr < 0 || start < startArr) ? start : startArr;
  if (idx < 0) {
    console.log('[prune] no JSON from channel:list; skip');
    process.exit(0);
  }
  const data = JSON.parse(raw.slice(idx));
  const channels = Array.isArray(data)
    ? data
    : Array.isArray(data.result)
      ? data.result
      : Array.isArray(data.result?.channels)
        ? data.result.channels
        : Array.isArray(data.channels)
          ? data.channels
          : [];

  const ids = [];
  for (const c of channels) {
    const id =
      (c && (c.id || c.channelId || (c.name && String(c.name).split('/').pop()))) || '';
    if (id.startsWith('release-') && id !== 'release-candidate') ids.push(id);
  }

  console.log(`[prune] stale release-* channels: ${ids.length}`);
  for (const id of ids.slice(0, 50)) {
    console.log(`[prune] deleting ${id}`);
    run([
      'hosting:channel:delete',
      id,
      '--project',
      project,
      '--token',
      token,
      '--force',
      '--non-interactive',
    ]);
  }
} catch (err) {
  console.log(`[prune] skipped after error: ${err && err.message ? err.message : err}`);
}

process.exit(0);
