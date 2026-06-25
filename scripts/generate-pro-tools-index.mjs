import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data", "pro-tools");
const outFilePath = path.join(process.cwd(), "src", "lib", "pro-tools-index.ts");

const files = fs.readdirSync(dataDir).filter(f => f.startsWith("PRO_") && f.endsWith(".json"));

let imports = "";
let exportsList = "";

for (const file of files) {
  const id = file.replace(".json", "");
  imports += `import ${id} from "../../data/pro-tools/${file}";\n`;
  exportsList += `  ${id},\n`;
}

const content = `// OTOMATİK OLUŞTURULDU - MANÜEL DÜZENLEMEYİN
${imports}
export const PRO_TOOLS_DATA: Record<string, any> = {
${exportsList}};
`;

fs.writeFileSync(outFilePath, content);
console.log("src/lib/pro-tools-index.ts oluşturuldu!");
