const fs = require('fs');

function replaceFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = replacer(content);
    fs.writeFileSync(path, content);
  }
}

replaceFile('src/lib/compliance/compliance-engine.ts', c => {
  return c
    .replace(/if \(false\) \{[\s\S]*?\}/g, '')
    .replace(/if \(false && hasCbam && profile\.cbamEnabled\) \{[\s\S]*?\}/g, '');
});

replaceFile('src/lib/os/core/formulas/expert-calc.test.ts', c => c.replace(/regionCode: "TR"/g, 'regionCode: "EN"'));
