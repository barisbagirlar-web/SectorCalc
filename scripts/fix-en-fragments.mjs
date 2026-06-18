/**
 * Fix English fragments in non-English locale files for inputGuide section.
 * Targets only title/summary values. Does NOT modify JSON keys.
 *
 * Usage: node scripts/fix-en-fragments.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, '..', 'messages');

/**
 * Apply replacements to file content. Only replaces within "title"/"summary" values.
 */
function applyReplacements(content, replacements) {
  let result = content;
  for (const [oldStr, newStr] of replacements) {
    const escapedOld = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `("(?:title|summary)"\\s*:\\s*")([^"]*)(${escapedOld})([^"]*)(")`,
      'g'
    );
    result = result.replace(regex, (match, prefix, before, old, after, suffix) => {
      return prefix + before + newStr + after + suffix;
    });
  }
  return result;
}

console.log('=== Fixing remaining English fragments ===\n');

// ===============================================
// tr.json — 1 remaining EN fragment
// ===============================================
const trReplacements = new Map([
  ['Return Rate Profit Erosion Tool girdi rehberi',  'İade Oranı Kâr Aşınma Aracı girdi rehberi'],
  ['Return Rate Profit Erosion Tool için girdi rehberi.', 'İade Oranı Kâr Aşınma Aracı için girdi rehberi.'],
]);

console.log('Processing tr.json...');
let trContent = readFileSync(join(messagesDir, 'tr.json'), 'utf-8');
trContent = applyReplacements(trContent, trReplacements);
writeFileSync(join(messagesDir, 'tr.json'), trContent, 'utf-8');
console.log('  tr.json: Return Rate Profit Erosion Tool → İade Oranı Kâr Aşınma Aracı');

// ===============================================
// de.json — remaining EN fragments
// ===============================================
const deReplacements = new Map([
  // s5GuideOracle titles
  ['Eingabeanleitung Kwh Consumption Check',     'Eingabeanleitung kWh-Verbrauchsprüfung'],
  ['Eingabeanleitung Machine Hour Estimator',    'Eingabeanleitung Maschinenstundenschätzer'],
  ['Eingabeanleitung Median Calculator',          'Eingabeanleitung Median-Rechner'],
  ['Eingabeanleitung Paint Coverage Cost Check', 'Eingabeanleitung Farbdeckungskostenprüfung'],
  // s5GuideOracle summaries
  ['Eingabeanleitung für Kwh Consumption Check.',     'Eingabeanleitung für kWh-Verbrauchsprüfung.'],
  ['Eingabeanleitung für Machine Hour Estimator.',    'Eingabeanleitung für Maschinenstundenschätzer.'],
  ['Eingabeanleitung für Median Calculator.',          'Eingabeanleitung für Median-Rechner.'],
  ['Eingabeanleitung für Paint Coverage Cost Check.', 'Eingabeanleitung für Farbdeckungskostenprüfung.'],
  // p6bFormulaFactory — Calculator → Rechner
  ['Total Cost of Ownership (TCO) Equipment Comparison Calculator', 'TCO-Gerätevergleichsrechner'],
  ['Yamazumi Workload Balancing Loss Calculator',                   'Yamazumi-Arbeitslastausgleich-Verlustrechner'],
  ['Facility Layout & Material Flow Distance Optimization Calculator', 'Anlagenlayout-Materialflussdistanz-Optimierungsrechner'],
]);

console.log('\nProcessing de.json...');
let deContent = readFileSync(join(messagesDir, 'de.json'), 'utf-8');
deContent = applyReplacements(deContent, deReplacements);
writeFileSync(join(messagesDir, 'de.json'), deContent, 'utf-8');
console.log(`  Fixed ${deReplacements.size} English fragments`);

// ===============================================
// fr.json — no remaining inputGuide EN fragments
// ===============================================
console.log('\nProcessing fr.json...');
console.log('  No English fragments in inputGuide section.');

// ===============================================
// es.json — remaining EN fragments in s5GuideOracle
// ===============================================
const esReplacements = new Map([
  // s5GuideOracle titles
  ['Guía de entrada para Kwh Consumption Check',         'Guía de entrada para Verificación de Consumo de kWh'],
  ['Guía de entrada para Machine Hour Estimator',        'Guía de entrada para Estimador de Horas Máquina'],
  ['Guía de entrada para Median Calculator',              'Guía de entrada para Calculadora de Mediana'],
  ['Guía de entrada de Paint Coverage Cost Check',       'Guía de entrada para Verificación de Costo de Cobertura de Pintura'],
  ['Guía de entrada de Percentage Calculator',           'Guía de entrada para Calculadora de Porcentaje'],
  ['Guía de entrada de Percentage Increase Calculator',  'Guía de entrada para Calculadora de Aumento Porcentual'],
  ['Guía de entrada de Plaster Calculator',              'Guía de entrada para Calculadora de Yeso'],
  ['Guía de entrada de Plumbing Fixture Cost Check',     'Guía de entrada para Verificación de Costo de Accesorios de Plomería'],
  ['Guía de entrada de Probability Calculator',          'Guía de entrada para Calculadora de Probabilidad'],
  ['Guía de entrada de Product Margin Calculator',       'Guía de entrada para Calculadora de Margen de Producto'],
  ['Guía de entrada de Project Cost Calculator',         'Guía de entrada para Calculadora de Costo de Proyecto'],
  ['Guía de entrada de Project Cost Estimator',          'Guía de entrada para Estimador de Costo de Proyecto'],
  ['Guía de entrada de Proportion Calculator',           'Guía de entrada para Calculadora de Proporción'],
  ['Guía de entrada de Ratio Calculator',                'Guía de entrada para Calculadora de Razón'],
  ['Guía de entrada de Rebar Weight Calculator',         'Guía de entrada para Calculadora de Peso de Varilla'],
  ['Guía de entrada de Recipe Cost Check',               'Guía de entrada para Verificación de Costo de Receta'],
  ['Guía de entrada de Repair Time Vs Price Check',      'Guía de entrada para Verificación de Tiempo de Reparación vs Precio'],
  ['Guía de entrada de Return Rate Profit Erosion Tool', 'Guía de entrada para Herramienta de Erosión de Ganancia por Tasa de Devolución'],
  // s5GuideOracle summaries
  ['Guía de entrada para Kwh Consumption Check.',        'Guía de entrada para Verificación de Consumo de kWh.'],
  ['Guía de entrada para Machine Hour Estimator.',       'Guía de entrada para Estimador de Horas Máquina.'],
  ['Guía de entrada para Median Calculator.',             'Guía de entrada para Calculadora de Mediana.'],
  ['Guía de entrada para Paint Coverage Cost Check.',    'Guía de entrada para Verificación de Costo de Cobertura de Pintura.'],
  ['Guía de entrada para Percentage Calculator.',        'Guía de entrada para Calculadora de Porcentaje.'],
  ['Guía de entrada para Percentage Increase Calculator.', 'Guía de entrada para Calculadora de Aumento Porcentual.'],
  ['Guía de entrada para Plaster Calculator.',           'Guía de entrada para Calculadora de Yeso.'],
  ['Guía de entrada para Plumbing Fixture Cost Check.',  'Guía de entrada para Verificación de Costo de Accesorios de Plomería.'],
  ['Guía de entrada para Probability Calculator.',       'Guía de entrada para Calculadora de Probabilidad.'],
  ['Guía de entrada para Product Margin Calculator.',    'Guía de entrada para Calculadora de Margen de Producto.'],
  ['Guía de entrada para Project Cost Calculator.',      'Guía de entrada para Calculadora de Costo de Proyecto.'],
  ['Guía de entrada para Project Cost Estimator.',       'Guía de entrada para Estimador de Costo de Proyecto.'],
  ['Guía de entrada para Proportion Calculator.',        'Guía de entrada para Calculadora de Proporción.'],
  ['Guía de entrada para Ratio Calculator.',             'Guía de entrada para Calculadora de Razón.'],
  ['Guía de entrada para Rebar Weight Calculator.',      'Guía de entrada para Calculadora de Peso de Varilla.'],
  ['Guía de entrada para Recipe Cost Check.',            'Guía de entrada para Verificación de Costo de Receta.'],
  ['Guía de entrada para Repair Time Vs Price Check.',   'Guía de entrada para Verificación de Tiempo de Reparación vs Precio.'],
  ['Guía de entrada para Return Rate Profit Erosion Tool.', 'Guía de entrada para Herramienta de Erosión de Ganancia por Tasa de Devolución.'],
]);

console.log('\nProcessing es.json...');
let esContent = readFileSync(join(messagesDir, 'es.json'), 'utf-8');
esContent = applyReplacements(esContent, esReplacements);
writeFileSync(join(messagesDir, 'es.json'), esContent, 'utf-8');
console.log(`  Fixed ${esReplacements.size} English fragments`);

console.log('\n=== All fixes applied! ===\n');
