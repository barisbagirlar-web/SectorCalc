#!/usr/bin/env node
/** Fail build if case-studies hub drops below exclusive academic density. */
import { readFileSync } from 'node:fs';

const html = readFileSync('public/case-studies/index.html', 'utf8');
const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
const text = main.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ');
const words = (text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) || []).length;
const bytes = Buffer.byteLength(html, 'utf8');
const needFaq = (html.match(/sc-faq-item/g) || []).length;
const needSchema = html.includes('FAQPage') && html.includes('CollectionPage');
const errors = [];
if (words < 2200) errors.push(`word count ${words} < 2200`);
if (bytes < 28000) errors.push(`bytes ${bytes} < 28000`);
if (needFaq < 5) errors.push(`FAQ items ${needFaq} < 5`);
if (!needSchema) errors.push('missing CollectionPage + FAQPage schema');
if (!/Published study count[\s\S]*?<strong>0<\/strong>/i.test(html) && !html.includes('<strong>0</strong>')) {
  errors.push('must keep honest published count visible');
}
if (errors.length) {
  console.error('guard:case-studies-academic FAIL\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`guard:case-studies-academic PASS (${words} words, ${bytes} bytes, ${needFaq} FAQ)`);
