import fs from 'fs';
import path from 'path';

const file = 'scripts/deploy-production.mjs';
let content = fs.readFileSync(file, 'utf8');

// We need to intercept the firebase deploy call
const targetStr = `  console.log("deploy-production: deploying Firebase Hosting + Firestore rules…");
  const deployStatus = run("firebase", [`;

const replacementStr = `  console.log("deploy-production: deploying Firebase Hosting + Firestore rules…");

  // HACK: Hide the massive .next/cache directory so Firebase CLI doesn't copy/zip 3.5GB+ of useless cache.
  // Next.js runtime (Cloud Run) does not need .next/cache.
  let cacheHidden = false;
  const cachePath = join(ROOT, ".next/cache");
  const cacheBackupPath = join(ROOT, ".next-cache-backup");
  try {
    if (existsSync(cachePath)) {
      renameSync(cachePath, cacheBackupPath);
      cacheHidden = true;
      console.log("deploy-production: temporarily hid .next/cache (saves massive upload time).");
    }
  } catch (e) {
    console.error("deploy-production: failed to hide cache", e.message);
  }

  const deployStatus = run("firebase", [`;

content = content.replace(targetStr, replacementStr);

const finallyTarget = `  if (shimInstalled) {
    restoreNextBin();
  }
  releaseDeployLock();`;

const finallyReplacement = `  if (shimInstalled) {
    restoreNextBin();
  }
  if (typeof cacheHidden !== 'undefined' && cacheHidden) {
    try {
      if (existsSync(cacheBackupPath)) {
        renameSync(cacheBackupPath, cachePath);
        console.log("deploy-production: restored .next/cache.");
      }
    } catch (e) {
      console.error("deploy-production: failed to restore cache", e.message);
    }
  }
  releaseDeployLock();`;

content = content.replace(finallyTarget, finallyReplacement);

// We need to make sure renameSync is imported
if (!content.includes('renameSync')) {
  content = content.replace(
    '  readFileSync,\n  symlinkSync,',
    '  readFileSync,\n  renameSync,\n  symlinkSync,'
  );
}

fs.writeFileSync(file, content);
console.log("Patched scripts/deploy-production.mjs");
