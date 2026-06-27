import fs from 'fs';
import path from 'path';

const generatedDir = path.join(process.cwd(), 'src', 'tools', 'generated');
const reportPath = path.join(process.cwd(), 'audit_report.txt');

function scanTools() {
  const files = fs.readdirSync(generatedDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  let report = `# SECTORCALC TUR 1 DENETİM RAPORU\n\n`;
  let passCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(generatedDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const toolId = file.replace('.ts', '').toUpperCase();

    // Adım 1: Input Varlığı
    const schemaMatch = content.match(/export const InputSchema_[A-Z0-9_]+ = z\.object\(\{([\s\S]*?)\}\);/);
    const hasInputs = schemaMatch && schemaMatch[1].trim().length > 0;

    // Adım 2 & 3: Formül ve İz
    const executeMatch = content.match(/export function execute_[A-Z0-9_]+\([^)]+\):[^\{]+\{([\s\S]*?)\}/);
    const execBody = executeMatch ? executeMatch[1] : '';
    
    const hasResultZero = execBody.includes('result: 0,');
    const hasResultFormula = execBody.match(/result:\s*[^0,]+/) || execBody.match(/const\s+result\s*=/);

    let status = 'PASS';
    let finding = [];

    if (!hasInputs) {
      status = 'FAIL';
      finding.push('Input şeması eksik veya boş.');
    }
    
    if (hasResultZero && !hasResultFormula) {
      status = 'FAIL';
      finding.push('Formül tamamen eksik (result: 0).');
    } else if (!hasResultFormula) {
      status = 'FAIL';
      finding.push('Calculation trace / Formula not found.');
    }

    if (status === 'PASS') {
      passCount++;
    } else {
      failCount++;
      report += `TUR 1 — ADIM 2: [FAIL]\n`;
      report += `BULGU: ${toolId} - ${finding.join(' ')}\n`;
      report += `DOSYA/SATIR: src/tools/generated/${file}\n`;
      report += `İŞLEM: YOK — onay bekleniyor\n\n`;
    }
  }

  report += `\nÖZET: ${passCount} PASS, ${failCount} FAIL.\n`;
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`Tarama tamamlandı. Rapor kaydedildi: ${reportPath}`);
}

scanTools();
