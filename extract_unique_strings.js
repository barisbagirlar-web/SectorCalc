const fs = require('fs');

const premiumInputs = JSON.parse(fs.readFileSync('premium_inputs.json', 'utf8'));
const glossary = JSON.parse(fs.readFileSync('src/data/calculator-phrase-glossary.json', 'utf8'));
const labels = JSON.parse(fs.readFileSync('scripts/data/calculator-field-labels-i18n.json', 'utf8'));

const uniqueStrings = new Set();
premiumInputs.forEach(schema => {
  schema.inputs.forEach(input => {
    if (input.label) uniqueStrings.add(input.label.trim());
    if (input.helper) uniqueStrings.add(input.helper.trim());
  });
});

const missingStrings = [];
uniqueStrings.forEach(str => {
  // Check if string exists in glossary.tr or labels.tr
  const inGlossary = glossary.tr && glossary.tr[str];
  const inLabels = labels.tr && labels.tr[str];
  
  if (!inGlossary && !inLabels) {
    missingStrings.push(str);
  }
});

fs.writeFileSync('missing_strings.json', JSON.stringify(missingStrings, null, 2));
console.log(`Total missing strings: ${missingStrings.length}`);
