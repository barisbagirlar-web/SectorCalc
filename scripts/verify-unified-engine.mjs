#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT,'dist');
const SHARED = Object.freeze({
  'weld-pro.html':'SC-001','labor-pro.html':'SC-010','quote-pro.html':'SC-012',
  'machining-pro.html':'SC-020','bearing-pro.html':'SC-021','tap-thread-pro.html':'SC-022','cycle-cost-pro.html':'SC-023','bearing-freq-pro.html':'SC-024','belt-chain-pro.html':'SC-025','shaft-pro.html':'SC-026','fits-pro.html':'SC-027','surface-finish-pro.html':'SC-028','heat-input-pro.html':'SC-029','bend-pro.html':'SC-030','sling-pro.html':'SC-031','shackle-eyebolt-pro.html':'SC-032','pressure-vessel-pro.html':'SC-033','pipe-wall-pro.html':'SC-034','bolt-pro.html':'SC-035','bolted-joint-pro.html':'SC-036','oee-pro.html':'SC-037','machine-rate-pro.html':'SC-038','punching-pro.html':'SC-039','hydraulic-pro.html':'SC-040'
});
const ALL_TOOL_FILES = ['sc008-pro.html', ...Object.keys(SHARED)];
const requiredAudit = ['auditEngine','auditInputs','auditFormulas','auditAssumptions','auditWarnings','inputPreview','sensitivity','riskChart'];
const legacyPatterns = [/CORE CALCULATION/i,/function\s+calculate\s*\(/,/const\s+ENGINE\s*=/,/\b(?:BT|PF|HC|BL|TM|CT|BF|BD|FT|SF|HI|SM|SL|SE|PV|PW|BJ|OEE|MH)-ENGINE\b/];
let failures = 0;
function fail(message){failures++;console.error(`[FAIL] ${message}`)}
function pass(message){console.log(`[PASS] ${message}`)}
function text(path){return readFileSync(join(ROOT,path),'utf8')}

if(!existsSync(DIST)) fail('dist/ missing — run production build before architecture guard');

for(const [file,code] of Object.entries(SHARED)){
  const path=join(DIST,file);
  if(!existsSync(path)){fail(`${file} missing from dist`);continue;}
  const html=readFileSync(path,'utf8');
  if(!html.includes(`data-tool-code="${code}"`)) fail(`${file} is not mounted on ${code} unified runtime`);
  for(const id of requiredAudit) if(!html.includes(`id="${id}"`)) fail(`${file} missing #${id}`);
  for(const pattern of legacyPatterns) if(pattern.test(html)) fail(`${file} still ships legacy inline engine pattern ${pattern}`);
  if(!html.includes('A1 · Engine Identity')||!html.includes('A5 · Warnings')) fail(`${file} missing A1–A5 audit surface`);
}
if(failures===0) pass(`${Object.keys(SHARED).length}/24 calculator pages ship the shared production runtime`);

const sc008Path=join(DIST,'sc008-pro.html');
if(!existsSync(sc008Path)) fail('SC-008 missing from dist');
else{
  const sc008=readFileSync(sc008Path,'utf8');
  if(sc008.includes('data-tool-code="SC-008"')) fail('SC-008 must retain its dedicated deterministic Monte Carlo UX');
  else pass('SC-008 remains the dedicated Decimal + seeded Monte Carlo runtime');
}

const suiteDir=join(ROOT,'src','industrial-suite');
if(!existsSync(suiteDir)) fail('src/industrial-suite missing');
else{
  for(const file of readdirSync(suiteDir).filter(x=>x.endsWith('.ts'))){
    if(readFileSync(join(suiteDir,file),'utf8').includes('@ts-nocheck')) fail(`${file} contains @ts-nocheck`);
  }
}

const tools=text('tools.html');
const liveCount=(tools.match(/live\s*:\s*true/g)||[]).length;
const plannedCount=(tools.match(/live\s*:\s*false/g)||[]).length;
if(liveCount!==25) fail(`tools.html expected 25 live entries, found ${liveCount}`); else pass('tools.html = 25 live calculators');
if(plannedCount!==0) fail(`tools.html still contains ${plannedCount} planned entries`); else pass('tools.html = 0 planned calculators');

const canonicalUrls=ALL_TOOL_FILES.map(file=>`https://sectorcalc.com/${file}`);
for(const file of ['public/sitemap.xml','public/llms.txt','public/llm.txt']){
  if(!existsSync(join(ROOT,file))){fail(`${file} missing`);continue;}
  const body=text(file);
  const missing=canonicalUrls.filter(url=>!body.includes(url));
  if(missing.length) fail(`${file} missing canonical URLs: ${missing.join(', ')}`); else pass(`${file} covers all 25 canonical tool URLs`);
}

const coreFiles=['src/industrial-tool.ts','src/industrial-suite/engine.ts','src/industrial-suite/registry.ts'];
for(const file of coreFiles) if(!existsSync(join(ROOT,file))) fail(`${file} missing`);

if(failures){console.error(`\nUNIFIED_ENGINE_GUARD=FAIL failures=${failures}`);process.exit(1)}
console.log('\nUNIFIED_ENGINE_GUARD=PASS shared=24 custom_sc008=1 live=25 planned=0');
