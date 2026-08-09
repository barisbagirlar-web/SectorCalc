#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const siteIndex = args.indexOf('--site');
const daysIndex = args.indexOf('--observed-days');
const siteId = siteIndex >= 0 ? args[siteIndex + 1] : '';
const rawDays = daysIndex >= 0 ? args[daysIndex + 1] : null;
const dryRun = args.includes('--dry-run');
const configError = (message) => { console.error(`SEO_COLDSTART=CONFIG_ERROR ${message}`); process.exit(4); };

if (!siteId) configError('missing --site');
const configPath = path.join(process.cwd(), 'sites', siteId, 'seo.config.json');
if (!fs.existsSync(configPath)) configError(`missing sites/${siteId}/seo.config.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config.site?.siteId !== siteId) configError('siteId mismatch');
const requiredDays = config.measurement?.defaultWindowDays;
if (!Number.isInteger(requiredDays) || requiredDays < 1) configError('invalid measurement.defaultWindowDays');

let observedDays = null;
if (rawDays !== null) {
  observedDays = Number(rawDays);
  if (!Number.isInteger(observedDays) || observedDays < 0) configError('observed-days must be a non-negative integer');
}
const coldStart = observedDays === null || observedDays < requiredDays;
const confidence = coldStart ? 'low' : 'normal';
const source = observedDays === null ? 'no-verified-window-provided' : 'explicit-observed-days';
console.log(`SEO_COLDSTART=PASS site=${siteId} coldStart=${coldStart} confidence=${confidence} requiredDays=${requiredDays} observedDays=${observedDays === null ? 'unknown' : observedDays} source=${source} dryRun=${dryRun}`);
