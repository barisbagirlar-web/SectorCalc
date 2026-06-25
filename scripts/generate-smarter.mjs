import fs from "fs";
import path from "path";

const txtContent = fs.readFileSync("hesaplama kontrolu.txt", "utf-8");
const lines = txtContent.split("\n");
const toolsDir = path.join(process.cwd(), "data", "pro-tools");
let toolIdCounter = 1;
const allTools = [];

for (const line of lines) {
  if (toolIdCounter > 192) break;
  const match = line.match(/^(\d+)\.\s+([^|]+)\s*\|\s*Girdiler:\s*([^|]+)\s*\|\s*Formül:\s*([^|]+)\s*\|\s*Çıktı:\s*(.+)$/);
  if (match) {
    const [, id, titleStr, inputsStr, formulaStr, outputStr] = match;
    
    // Parse Inputs
    const rawInputs = inputsStr.split(",").map(i => i.trim());
    const inputs = rawInputs.map((ri, idx) => {
      const p = ri.match(/(.+?)\s*\((.*?)\)/);
      const rawName = p ? p[1].trim() : ri;
      const varId = rawName.replace(/[^a-zA-Z0-9_]/g, ''); // Temizle
      return {
        id: varId || `input_${idx}`,
        name: rawName,
        unit: p ? p[2].trim() : "",
        type: "number",
        required: true,
        confidence_label: "KESİN",
        absolute_min: -999999,
        absolute_max: 999999999
      };
    });

    while (inputs.length < 6) {
      inputs.push({
        id: `extra_${inputs.length}`,
        name: `Ek Parametre ${inputs.length}`,
        unit: "-",
        type: "number",
        required: false,
        confidence_label: "VARAYIM",
        absolute_min: 0,
        absolute_max: 999999
      });
    }

    // Parse Formulas
    let formulas = formulaStr.split(";").map(f => {
      let frm = f.trim();
      frm = frm.replace(/\^/g, "**"); // Üslü sayı
      frm = frm.replace(/\bMAX\b/g, "Math.max");
      frm = frm.replace(/\bMIN\b/g, "Math.min");
      frm = frm.replace(/\bEXP\b/g, "Math.exp");
      
      // Eğer denklemde eşittir yoksa, ilk çıktıyı eşitle
      if (!frm.includes("=")) {
        const outMatch = outputStr.split(",")[0].match(/(.+?)\s*\(/);
        const outName = outMatch ? outMatch[1].trim().replace(/[^a-zA-Z0-9_]/g, '') : "Sonuc";
        frm = `${outName} = ${frm}`;
      }
      return frm + " // Formül";
    });

    const toolJson = {
      tool_id: `PRO_${toolIdCounter.toString().padStart(3, "0")}`,
      tool_name: titleStr.trim(),
      category: "Endüstriyel Hesaplama",
      scope: "single_operation",
      primary_operation: "analysis",
      inputs: inputs,
      formulas: formulas,
      engine_rules: {
        standards: ["ISO 9001"],
        validation: {
          min_check: { absolute_min: 0, error_msg: "Geçersiz değer." }
        },
        smart_warnings: []
      }
    };
    allTools.push(toolJson);
    fs.writeFileSync(path.join(toolsDir, toolJson.tool_id + ".json"), JSON.stringify(toolJson, null, 2));
    toolIdCounter++;
  }
}
fs.writeFileSync(path.join(toolsDir, "_merged.json"), JSON.stringify(allTools, null, 2));
console.log(`${allTools.length} araç üretildi.`);
