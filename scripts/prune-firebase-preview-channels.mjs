#!/usr/bin/env node
/**
 * Best-effort prune of Firebase Hosting preview channels named release-*
 * (except release-candidate). Always exits 0 so Deploy seal can continue.
 */
import { spawnSync } from 'node:child_process';

const project = process.env.FIREBASE_PROJECT || 'sectorcalc-prod';
const site = process.env.FIREBASE_SITE || 'sectorcalc-prod';
const token = process.env.FIREBASE_TOKEN || '';

if (!token) {
  console.log('[prune] no FIREBASE_TOKEN; skip');
  process.exit(0);
}

function run(args) {
  return spawnSync('npx', ['--yes', 'firebase-tools@14', ...args], {
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });
}

function collectIds(text) {
  const ids = new Set();
  const re = /\brelease-[a-z0-9][a-z0-9_-]*\b/gi;
  let m;
  while ((m = re.exec(text || ''))) {
    const id = m[0];
    if (id !== 'release-candidate') ids.add(id);
  }
  return [...ids];
}

try {
  const listed = run([
    'hosting:channel:list',
    '--project',
    project,
    '--site',
    site,
    '--token',
    token,
  ]);
  const blob = `${listed.stdout || ''}\n${listed.stderr || ''}`;
  const ids = collectIds(blob);
  console.log(`[prune] candidates from channel:list: ${ids.length}`);
  if (!ids.length) {
    console.log('[prune] list output (truncated):');
    console.log(blob.slice(0, 1200));
  }

  for (const id of ids.slice(0, 60)) {
    console.log(`[prune] deleting ${id}`);
    const del = run([
      'hosting:channel:delete',
      id,
      '--project',
      project,
      '--site',
      site,
      '--token',
      token,
      '--force',
      '--non-interactive',
    ]);
    if (del.status !== 0) {
      console.log(`[prune] delete ${id} status=${del.status}`);
      console.log((del.stderr || del.stdout || '').slice(0, 400));
    } else {
      console.log(`[prune] deleted ${id}`);
    }
  }
} catch (err) {
  console.log(`[prune] skipped after error: ${err && err.message ? err.message : err}`);
}

process.exit(0);
