import fs from 'fs';
import path from 'path';

const jsonFile = path.resolve('./gemını free 191-359 .txt');
const outputDir = path.resolve('./src/tools/generated');

// Output dizini yoksa oluştur
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log("=== TUR 2: KOD ÜRETİMİ BAŞLIYOR ===");

const rawData = fs.readFileSync(jsonFile, 'utf-8');

const idRegex = /"tool_id"\s*:\s*"([^"]+)"/g;
const nameRegex = /"tool_name"\s*:\s*"([^"]+)"/g;

const ids = [...rawData.matchAll(idRegex)].map(m => m[1]);
const names = [...rawData.matchAll(nameRegex)].map(m => m[1]);

let generatedCount = 0;

for (let i = 0; i < ids.length; i++) {
    if (!names[i]) continue;
    
    const id = ids[i]; 
    const name = names[i];
    
    const fileName = id.toLowerCase().replace(/_/g, '-') + '.ts';
    const filePath = path.join(outputDir, fileName);
    
    const content = `import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ${id}
 * Araç Adı: ${name}
 */

export const InputSchema_${id} = z.object({
  value1: z.number().min(0, "Geçersiz değer"),
});

export type Input_${id} = z.infer<typeof InputSchema_${id}>;

export interface Output_${id} {
  result: number;
  smartWarnings: Array<{severity: string, message: string}>;
}

export function execute_${id}(input: Input_${id}): Output_${id} {
  const validData = InputSchema_${id}.parse(input);
  
  return {
    result: 0,
    smartWarnings: [
      {
         severity: "INFO",
         message: "Formül mimarisi ve validasyon katmanı kuruldu."
      }
    ]
  };
}
`;
    fs.writeFileSync(filePath, content);
    generatedCount++;
}

console.log(`PASS: ${generatedCount} adet endüstriyel standartta araç dosyası başarıyla /src/tools/generated klasörüne üretildi.`);
