const fs = require('fs');
const path = require('path');

function evaluateFormula(formulaStr, vars) {
  const eqIdx = formulaStr.indexOf("=");
  if (eqIdx === -1) return { error: "No = sign found in formula" };
  const varName = formulaStr.substring(0, eqIdx).trim();
  let expr = formulaStr.substring(eqIdx + 1).split("//")[0].trim();

  try {
    const func = new Function(...Object.keys(vars), "_normsinv", "_normsdist", "return " + expr + ";");
    return { result: func(...Object.values(vars), () => 0, () => 0), name: varName };
  } catch (err) {
    return { error: err.message, expr };
  }
}

const dir = 'data/pro-tools';
const files = fs.readdirSync(dir).filter(f => f.startsWith('PRO_') && f.endsWith('.json'));

let limit = 0;
for (const file of files) {
  const tool = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const vars = {};
  tool.inputs.forEach(i => { vars[i.id] = 1; });
  
  tool.formulas.forEach(f => {
    const res = evaluateFormula(f, vars);
    if (res.error && limit < 20) {
      console.log(`${tool.tool_id}: ${res.expr} => ${res.error}`);
      limit++;
    }
  });
}
