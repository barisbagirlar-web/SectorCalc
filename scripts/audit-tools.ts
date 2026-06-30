import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

// 1. Initialize ts-morph project
const project = new Project();
const generatedDir = path.join(process.cwd(), "generated");
project.addSourceFilesAtPaths(path.join(generatedDir, "*.ts"));
const sourceFiles = project.getSourceFiles();

console.log(`Found ${sourceFiles.length} source files.`);

let passCount = 0;
let failCount = 0;
const report: string[] = [];

for (const sourceFile of sourceFiles) {
  if (sourceFile.getBaseName() === "index.ts") continue;
  const toolName = sourceFile.getBaseNameWithoutExtension();
  let status = "PASS";
  const findings: string[] = [];

  // Remove leading digits logic for interface names if necessary
  let interfacePrefix = toolName.replace(/-/g, "_");
  if (/^\d/.test(interfacePrefix)) {
    interfacePrefix = "_" + interfacePrefix;
  }
  
  let inputInterface = sourceFile.getInterface(`${interfacePrefix}Input`);
  if (!inputInterface && sourceFile.getInterfaces().length > 0) {
    inputInterface = sourceFile.getInterfaces().find(i => i.getName().endsWith("Input"));
  }

  if (!inputInterface) {
    status = "FAIL";
    findings.push(`ADIM 1 [FAIL]: Input interface bulunamadı.`);
  } else {
    const inputProps = inputInterface.getProperties();
    if (inputProps.length === 0) {
      status = "FAIL";
      findings.push(`ADIM 1 [FAIL]: Input arayüzünde değişken bulunamadı.`);
    } else {
      findings.push(`ADIM 1 [PASS]: ${inputProps.length} adet input tespit edildi.`);
    }
  }

  const evaluateFunc = sourceFile.getFunction("evaluateAllFormulas");
  if (!evaluateFunc) {
    status = "FAIL";
    findings.push(`ADIM 2 [FAIL]: evaluateAllFormulas fonksiyonu bulunamadı.`);
  } else {
    const tryStatements = evaluateFunc.getDescendantsOfKind(SyntaxKind.TryStatement);
    if (tryStatements.length === 0) {
      status = "FAIL";
      findings.push(`ADIM 2 [FAIL]: formül (try-catch) hesaplaması bulunamadı.`);
    } else {
      let missingSafetyCheck = false;
      tryStatements.forEach(stmt => {
        const text = stmt.getText();
        if (text.includes("/") && !text.includes("Math.max") && !text.includes("Math.abs") && !text.includes("|| 1") && !text.includes("?")) {
          missingSafetyCheck = true;
          findings.push(`ADIM 3 [FAIL]: Bölme işlemi (/) var fakat Math.max veya güvenlik kontrolü bulunamadı (Satır: ${stmt.getStartLineNumber()})`);
        }
        if (!text.includes("Number.isNaN") && !text.includes("Number.isFinite")) {
          missingSafetyCheck = true;
          findings.push(`ADIM 3 [FAIL]: Sonuçta isFinite kontrolü eksik (Satır: ${stmt.getStartLineNumber()})`);
        }
      });
      if (missingSafetyCheck) {
        status = "FAIL";
      } else {
        findings.push(`ADIM 2 & 3 [PASS]: Formüller statik olarak doğrulandı.`);
      }
    }
  }

  if (status === "PASS") {
    passCount++;
  } else {
    failCount++;
  }

  report.push(`\n=== TOOL: ${toolName} ===`);
  report.push(`STATUS: ${status}`);
  findings.forEach(f => report.push(` - ${f}`));
}

const summary = `
========================================
AUDIT SUMMARY (TUR 1)
Total Tools: ${sourceFiles.length - 1}
PASS: ${passCount}
FAIL: ${failCount}
========================================
`;
report.unshift(summary);

fs.writeFileSync("scripts/audit-report-tur1.txt", report.join("\n"), "utf-8");
console.log(`Audit complete. PASS: ${passCount}, FAIL: ${failCount}. Report saved to scripts/audit-report-tur1.txt`);
