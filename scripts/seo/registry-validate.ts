#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { calculators, indexablePages, validateRegistryInvariants } from '../../seo/registry.mjs';

const args = process.argv.slice(2);
const siteIndex = args.indexOf('--site');
const siteId = siteIndex >= 0 ? args[siteIndex + 1] : '';
const dryRun = args.includes('--dry-run');
const configError = (message) => { console.error(`SEO_REGISTRY=CONFIG_ERROR ${message}`); process.exit(4); };
const violation = (message) => { console.error(`SEO_REGISTRY=FAIL ${message}`); process.exit(1); };

if (!siteId) configError('missing --site');
const configPath = path.join(process.cwd(), 'sites', siteId, 'seo.config.json');
if (!fs.existsSync(configPath)) configError(`missing sites/${siteId}/seo.config.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config.site?.siteId !== siteId) configError('siteId mismatch');

const errors = validateRegistryInvariants();
if (errors.length) violation(errors.join(' | '));
console.log(`SEO_REGISTRY=PASS site=${siteId} calculators=${calculators().length} indexable=${indexablePages().length} dryRun=${dryRun}`);
