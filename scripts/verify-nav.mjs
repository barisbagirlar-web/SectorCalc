#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const ROOT=process.cwd();
const BASE=['index.html','pricing.html','pro.html','tools.html','calculator.html','calculator2.html','calculator3.html','calculator4.html'];
const PRO=readdirSync(ROOT).filter((f)=>f.endsWith('-pro.html')).sort();
const PAGES=[...BASE,...PRO];
const issues=[];
const isIndustrial=(html)=>html.includes('/src/industrial-tool.ts')&&/data-tool-code=["']SC-0\d\d["']/.test(html);
function anchors(html){const ids=new Set();for(const m of html.matchAll(/\bid=["']([^"']+)["']/g))ids.add(m[1]);return ids;}
function targetExists(href){let target=href.split('?')[0].split('#')[0];if(target==='/'||target==='')target='index.html';if(target.startsWith('/'))target=target.slice(1);return !target||existsSync(join(ROOT,target))||existsSync(join(ROOT,'public',target));}
for(const page of PAGES){
  const path=join(ROOT,page);if(!existsSync(path)){issues.push(`${page}: FILE MISSING`);continue;}const html=readFileSync(path,'utf8'),ids=anchors(html),hrefs=[...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((m)=>m[1]);
  for(const href of hrefs){if(href.startsWith('http')||href.startsWith('mailto:')||href.startsWith('javascript:')||href.includes('${'))continue;if(href.startsWith('#')){const id=href.slice(1);if(id&&!ids.has(id))issues.push(`${page}: dead anchor ${href}`);continue;}if(!targetExists(href))issues.push(`${page}: dead link ${href}`);}
  if(page.endsWith('-pro.html')){
    if(!hrefs.includes('/'))issues.push(`${page}: no home link`);if(!hrefs.includes('/pricing.html'))issues.push(`${page}: no pricing link`);if(!hrefs.includes('/tools.html'))issues.push(`${page}: no tools link`);
    if(isIndustrial(html)){
      for(const id of ['fields','verdict','resultTable','sensitivity','riskChart','auditEngine','auditInputs','auditFormulas','auditAssumptions','auditWarnings','themeToggle'])if(!ids.has(id))issues.push(`${page}: industrial runtime missing #${id}`);
      if(!html.includes('/src/industrial-tool.ts'))issues.push(`${page}: missing industrial runtime module`);
    } else {
      if(!html.includes('sc-tool-guide.css'))issues.push(`${page}: missing sc-tool-guide.css`);if(!html.includes('sc-tool-guide.js'))issues.push(`${page}: missing sc-tool-guide.js`);if(!html.includes('id="sc-guide"'))issues.push(`${page}: missing #sc-guide SEO section`);if(!/<link[^>]+sc-form-fields\.css/i.test(html))issues.push(`${page}: missing sc-form-fields.css`);
    }
  }
  if(page==='tools.html'){
    for(const need of ['/','/pricing.html','/machining-pro.html','/bearing-pro.html','/sc008-pro.html','/threading-pro.html','/pressure-vessel-pro.html','/machine-hour-rate-pro.html'])if(!html.includes(need))issues.push(`tools.html: missing required catalog link ${need}`);
    if(!html.includes('sectorcalc-theme'))issues.push('tools.html: missing theme persistence key');
  } else if(!page.startsWith('calculator')&&!isIndustrial(html)){
    if(!html.includes('id="themeToggle"'))issues.push(`${page}: missing #themeToggle`);if(!html.includes('sc-theme.css'))issues.push(`${page}: missing sc-theme.css`);if(!html.includes('sc-theme.js'))issues.push(`${page}: missing sc-theme.js`);if(!html.includes('sectorcalc-theme'))issues.push(`${page}: missing theme boot key`);if(!html.includes('sc-site-nav.css'))issues.push(`${page}: missing sc-site-nav.css`);if(!html.includes('sc-site-nav.js'))issues.push(`${page}: missing sc-site-nav.js`);if(!html.includes('id="siteHeader"'))issues.push(`${page}: missing shared #siteHeader`);if(!/<link[^>]+sc-form-fields\.css/i.test(html))issues.push(`${page}: missing sc-form-fields.css`);
  }
}
const index=readFileSync(join(ROOT,'index.html'),'utf8');for(const [role,href] of [['Engineering','/sc008-pro.html'],['Estimating','/quote-pro.html'],['Costing','/labor-pro.html'],['Fabrication','/weld-pro.html'],['Machining','/machining-pro.html'],['Bearings','/bearing-pro.html'],['Quality','/sc008-pro.html']]){const re=new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"[^>]*>[\\s\\S]{0,400}?${role}`);if(!re.test(index))issues.push(`index.html: role ${role} not wired to ${href}`);}for(const id of ['mobileMenuBtn','mobileNav','main-content'])if(!index.includes(`id="${id}"`))issues.push(`index.html: missing #${id}`);
const discovery=['robots.txt','sitemap.xml','llms.txt','llm.txt'];for(const f of discovery)if(!existsSync(join(ROOT,'public',f)))issues.push(`public/${f}: FILE MISSING`);
if(issues.length){console.error('[FAIL] Navigation audit\n'+issues.map((i)=>' - '+i).join('\n'));process.exit(1);}console.log(`[PASS] Navigation audit: ${PAGES.length} pages + industrial runtime contracts OK`);
const dist=join(ROOT,'dist');if(existsSync(dist)){const missing=PAGES.filter((p)=>!existsSync(join(dist,p)));if(missing.length){console.error('[FAIL] dist missing: '+missing.join(', '));process.exit(1);}const missingDiscovery=discovery.filter((f)=>!existsSync(join(dist,f)));if(missingDiscovery.length){console.error('[FAIL] dist missing discovery files: '+missingDiscovery.join(', '));process.exit(1);}console.log('[PASS] dist contains all audited pages + discovery files');}
