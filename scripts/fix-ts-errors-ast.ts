import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();
project.addSourceFilesAtPaths([
  'src/lib/i18n/locale-glossary.ts',
  'src/lib/locale-center/locale-config.ts',
  'src/lib/locale-center/unit-currency-center.ts',
  'src/lib/regional/regions.ts',
  'src/lib/units/locale-unit-defaults.ts',
  'src/lib/seo/global-seo-config.ts',
  'src/lib/i18n/seven-muda-rev5-labels.ts',
  'src/lib/premium-schema/premium-report-export.ts',
  'src/lib/tools/runtime-readiness.ts'
]);

for (const sourceFile of project.getSourceFiles()) {
  const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
  for (const obj of objectLiterals) {
    for (const propName of ['tr', 'de', 'fr', 'es', 'ar']) {
      const prop = obj.getProperty(propName);
      if (prop) {
        prop.remove();
      }
    }
  }
}

project.saveSync();
console.log("AST transformation complete.");
