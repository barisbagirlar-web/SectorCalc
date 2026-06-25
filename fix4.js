const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = replacer(content);
    fs.writeFileSync(path, content);
  }
}

replaceFile('src/components/layout/RegionSelector.tsx', c => c.replace(/\{ value: "TR", label: "Turkey \(TRY\)" \},/g, '').replace(/\{ value: "DE", label: "Germany \(EUR\)" \},/g, ''));
replaceFile('src/lib/compliance/compliance-engine.ts', c => c.replace(/region === "TR"/g, 'false').replace(/region === "DE"/g, 'false'));
replaceFile('src/lib/os/core/formulas/expert-calc.test.ts', c => c.replace(/regionCode: "TR"/g, 'regionCode: "EN"'));
replaceFile('src/lib/tools/runtime-readiness.ts', c => c.replace(/locale === "tr"/g, 'false').replace(/locale === 'tr'/g, 'false'));
