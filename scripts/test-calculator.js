const fs = require('fs');

function evaluateFormula(formulaStr, vars) {
  const eqIdx = formulaStr.indexOf("=");
  if (eqIdx === -1) return { error: "No = sign found in formula" };
  const varName = formulaStr.substring(0, eqIdx).trim();
  let expr = formulaStr.substring(eqIdx + 1).split("//")[0].trim();

  try {
    const func = new Function(...Object.keys(vars), "_normsinv", "_normsdist", "return " + expr + ";");
    return { result: func(...Object.values(vars), () => 0, () => 0), name: varName };
  } catch (err) {
    return { error: err.message };
  }
}

const tool = JSON.parse(fs.readFileSync('data/pro-tools/PRO_001.json', 'utf8'));
const vars = {
  AylikKira: 1000,
  MulkDegeri: 200000,
  extra_2: 0,
  extra_3: 0,
  extra_4: 0,
  extra_5: 0
};

console.log("=== PRO_001 HESAPLAMA TESTI ===");
tool.formulas.forEach(f => {
  console.log(`Formula: ${f}`);
  const res = evaluateFormula(f, vars);
  if (res.error) console.log(`[X] HATA: ${res.error}`);
  else console.log(`[V] BAŞARILI: ${res.name} = ${res.result}`);
});
