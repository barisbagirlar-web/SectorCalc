#!/usr/bin/env node
/**
 * Targeted fix: only add TR/DE missing keys from EN
 * Do NOT touch EN at all (it's already clean)
 */
import { readFileSync, writeFileSync } from 'fs';

const data = {};
for (const loc of ['en','tr','de','fr','es','ar']) {
  data[loc] = JSON.parse(readFileSync(`messages/${loc}.json`, 'utf8'));
}

// Add missing keys from source to target recursively
function deepAddMissing(target, source, path='', fixed=[]) {
  if (!source || typeof source !== 'object') return fixed;
  for (const [k, v] of Object.entries(source)) {
    if (k === 'freeToolInputs') continue; // skip freeToolInputs — handled by sync
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
        fixed.push(p);
      }
      deepAddMissing(target[k], v, p, fixed);
    } else {
      if (!(k in target) || target[k] === undefined || target[k] === null) {
        target[k] = v;
        fixed.push(p);
      }
    }
  }
  return fixed;
}

// Fix DE trip-budget + social-security edge cases
const deFti = data.de.freeToolInputs;
if (deFti['trip-budget-calculator']?.accommodationcost && !deFti['trip-budget-calculator'].accommodationcost.helper) {
  deFti['trip-budget-calculator'].accommodationcost.helper = 'Hotels, Hostels, Ferienwohnungen';
  console.log('FIX: DE trip-budget-calculator.accommodationcost.helper');
}
if (deFti['social-security-benefits-calculator']?.fulretirement_age) {
  const f = deFti['social-security-benefits-calculator'].fulretirement_age;
  if (!f.placeholder) f.placeholder = 'Volles Rentenalter eingeben';
  if (!f.helper) f.helper = 'Alter, ab dem die volle Rente ohne Abschläge bezogen werden kann';
  console.log('FIX: DE social-security-benefits-calculator.fulretirement_age placeholder/helper');
}

// Add missing EN keys → TR (excl. freeToolInputs)
console.log('\n--- TR: EN\'den eksik keyler ekleniyor ---');
const trFixed = deepAddMissing(data.tr, data.en);
console.log(`TR: ${trFixed.length} key eklendi`);

// Add missing EN keys → DE (excl. freeToolInputs)
console.log('\n--- DE: EN\'den eksik keyler ekleniyor ---');
const deFixed = deepAddMissing(data.de, data.en);
console.log(`DE: ${deFixed.length} key eklendi`);

// Write all
for (const loc of ['tr', 'de']) {
  writeFileSync(`messages/${loc}.json`, JSON.stringify(data[loc], null, 2) + '\n', 'utf8');
}
console.log('\nYazildi.');
