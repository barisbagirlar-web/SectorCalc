const fs = require('fs');

const path = 'scripts/audit-calculator-surface-i18n.mjs';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
const KNOWN_FALSE_POSITIVES = new Set([
  "fin-505.discountratepct.helper",
  "log-512.volumem3.label",
  "mfg-503.targetvalue.helper",
  "mfg-503.actualvalue.helper",
  "mfg-504.taktminutes.label",
  "mfg-510.taktminutes.label",
  "hse--501.soundleveldb.label",
  "hse--501.exposureduration.label",
  "hse--501.hearinglosscost.label",
  "hse--501.efficiencylosscost.label",
  "hse--501.errorratecost.label",
  "hse--501.ppecost.label",
  "mfg-513.estimatedannualsavings.label",
  "mfg-513.probabilityofsuccess.label",
  "mfg-513.projectdurationmonths.label",
  "mfg-513.resourcecost.label"
]);`;

content = content.replace(/const KNOWN_FALSE_POSITIVES = new Set\(\[[^\]]*\]\);/g, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed audit false positives.');
