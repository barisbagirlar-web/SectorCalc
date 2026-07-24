#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT=process.cwd();
const FORM_CSS=join(ROOT,'public','sc-form-fields.css');
const FORM_CSS_NAME='sc-form-fields.css';
const issues=[];
const proPages=readdirSync(ROOT).filter((f)=>f.endsWith('-pro.html')).sort();
const isIndustrial=(html)=>html.includes('/src/industrial-tool.ts')&&/data-tool-code=["']SC-0\d\d["']/.test(html);

function styleBlocks(html){return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m)=>m[1]);}
function findClipRisks(css,page){const compact=css.replace(/\s+/g,' ');for(const p of [
  [/\.uwrap\s+input\s*\{[^}]*min-width\s*:\s*0\s*[;}]/i,`${page}: .uwrap input uses min-width:0`],
  [/\.sc-input\s*\{[^}]*min-width\s*:\s*0\s*[;}]/i,`${page}: .sc-input uses min-width:0`]
])if(p[0].test(compact))issues.push(p[1]);}

for(const page of proPages){
  const html=readFileSync(join(ROOT,page),'utf8');
  if(isIndustrial(html)){
    if(!html.includes('id="fields"'))issues.push(`${page}: industrial runtime missing #fields mount`);
    if(!html.includes('id="auditEngine"')||!html.includes('id="auditWarnings"'))issues.push(`${page}: industrial runtime missing A1–A5 mounts`);
    if(!html.includes('id="sensitivity"')||!html.includes('id="riskChart"'))issues.push(`${page}: industrial runtime missing chart mounts`);
    continue;
  }
  if(!/<link[^>]+sc-form-fields\.css/i.test(html))issues.push(`${page}: missing <link> to ${FORM_CSS_NAME}`);
  const hasForm=html.includes('class="uwrap"')||html.includes("class='uwrap'")||html.includes('sc-input-wrap')||/type=["']number["']/.test(html);
  if(!hasForm)issues.push(`${page}: no calculator inputs found`);
  if(/type=["']number["']/.test(html)&&/class=["'][^"']*units/.test(html)&&!html.includes('uwrap')&&!html.includes('sc-input-wrap'))issues.push(`${page}: number+unit fields must use .uwrap or .sc-input-wrap`);
  for(const block of styleBlocks(html))findClipRisks(block,page);
}

if(!existsSync(FORM_CSS))issues.push(`public/${FORM_CSS_NAME}: FILE MISSING`);
else{const css=readFileSync(FORM_CSS,'utf8');for(const need of ['.uwrap','min-width:5.75rem','.sc-input-wrap','tabular-nums','-webkit-appearance:none'])if(!css.includes(need))issues.push(`public/${FORM_CSS_NAME}: missing required token ${need}`);}
const runtime=join(ROOT,'src','industrial-tool.css');if(!existsSync(runtime))issues.push('src/industrial-tool.css: FILE MISSING');else{const css=readFileSync(runtime,'utf8');if(!css.includes('.input-row input')||!css.includes('min-width:0'))issues.push('src/industrial-tool.css: missing responsive numeric-field contract');}
const themePath=join(ROOT,'public','sc-theme.css');if(existsSync(themePath)&&!readFileSync(themePath,'utf8').includes(FORM_CSS_NAME))issues.push(`public/sc-theme.css: must @import ${FORM_CSS_NAME}`);
const dist=join(ROOT,'dist');if(existsSync(dist)){if(!existsSync(join(dist,FORM_CSS_NAME)))issues.push(`dist/${FORM_CSS_NAME}: missing after build`);for(const page of proPages){const p=join(dist,page);if(!existsSync(p))continue;const html=readFileSync(p,'utf8');if(!isIndustrial(html)&&!/<link[^>]+sc-form-fields\.css/i.test(html))issues.push(`dist/${page}: missing ${FORM_CSS_NAME}`);}}
if(issues.length){console.error('[FAIL] Form-field layout gate\n'+issues.map((i)=>' - '+i).join('\n'));process.exit(1);}console.log(`[PASS] Form-field layout: ${proPages.length} tools + legacy/runtime contracts OK`);
