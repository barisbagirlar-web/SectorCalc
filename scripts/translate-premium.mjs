import fs from 'fs';
import { Project, SyntaxKind } from 'ts-morph';
import { translate } from '@vitalets/google-translate-api';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths("src/lib/premium-schema/schemas/*.ts");

const TR_KEYWORDS = ['maliyet', 'hesaplayıcı', 'risk', 'süresi', 'oranı', 'gideri', 'zararı', 'tahmini', 'getiri', 'işitme', 've', 'için', 'bir', 'bu', 'kaybı', 'hesabı'];

function isLikelyTurkish(text) {
  const lower = text.toLowerCase();
  if (/[ğüşıöç]/.test(lower)) return true;
  const TR_EXACT = ['maliyet', 'hesaplayıcı', 'risk', 'süresi', 'oranı', 'gideri', 'zararı', 'tahmini', 'getiri', 'işitme', 'lütfen geçerli', 'endüstriyel hesaplama'];
  for (const word of TR_EXACT) {
    if (lower.includes(word)) return true;
  }
  return false;
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function translateString(text) {
  if (!text || text.trim() === '' || !isLikelyTurkish(text)) return text;
  try {
    console.log(`Translating: "${text.substring(0, 30)}..."`);
    const res = await translate(text, { from: 'tr', to: 'en' });
    await delay(1000); // rate limit protection
    return res.text;
  } catch (err) {
    console.error("Translation failed for:", text, err.message);
    return text;
  }
}

async function run() {
  const files = project.getSourceFiles();
  console.log(`Found ${files.length} premium schema files.`);
  
  for (const file of files) {
    let modified = false;
    
    // Find the exported object literal
    const varDecls = file.getVariableDeclarations();
    for (const varDecl of varDecls) {
      const init = varDecl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!init) continue;
      
      // We found the schema object!
      // Translate 'name', 'painStatement'
      for (const propName of ['name', 'painStatement']) {
        const prop = init.getProperty(propName);
        if (prop && prop.isKind(SyntaxKind.PropertyAssignment)) {
          const initStr = prop.getInitializerIfKind(SyntaxKind.StringLiteral);
          if (initStr) {
            const original = initStr.getLiteralValue();
            const translated = await translateString(original);
            if (original !== translated) {
              initStr.replaceWithText(JSON.stringify(translated));
              modified = true;
            }
          }
        }
      }
      
      // Translate inputs
      const inputsProp = init.getProperty('inputs');
      if (inputsProp && inputsProp.isKind(SyntaxKind.PropertyAssignment)) {
        const inputsArr = inputsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (inputsArr) {
          for (const element of inputsArr.getElements()) {
            if (element.isKind(SyntaxKind.ObjectLiteralExpression)) {
              for (const innerPropName of ['label', 'helper', 'expertMeaning']) {
                const prop = element.getProperty(innerPropName);
                if (prop && prop.isKind(SyntaxKind.PropertyAssignment)) {
                  const initStr = prop.getInitializerIfKind(SyntaxKind.StringLiteral);
                  if (initStr) {
                    const original = initStr.getLiteralValue();
                    const translated = await translateString(original);
                    if (original !== translated) {
                      initStr.replaceWithText(JSON.stringify(translated));
                      modified = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // Translate outputs
      const outputsProp = init.getProperty('outputs');
      if (outputsProp && outputsProp.isKind(SyntaxKind.PropertyAssignment)) {
        const outputsArr = outputsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (outputsArr) {
          for (const element of outputsArr.getElements()) {
            if (element.isKind(SyntaxKind.ObjectLiteralExpression)) {
              for (const innerPropName of ['label', 'formatContext', 'warningMessage', 'criticalMessage', 'successMessage', 'expertInterpretation']) {
                const prop = element.getProperty(innerPropName);
                if (prop && prop.isKind(SyntaxKind.PropertyAssignment)) {
                  const initStr = prop.getInitializerIfKind(SyntaxKind.StringLiteral);
                  if (initStr) {
                    const original = initStr.getLiteralValue();
                    const translated = await translateString(original);
                    if (original !== translated) {
                      initStr.replaceWithText(JSON.stringify(translated));
                      modified = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    if (modified) {
      console.log(`Saving translations for ${file.getBaseName()}`);
      file.saveSync();
    }
  }
  
  console.log("Premium schemas translation check complete.");
}

run();
