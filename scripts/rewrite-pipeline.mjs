/**
 * SectorCalc — 192 Tool Master Rewrite Pipeline (Claude)
 * 
 * Usage:
 *   npm install @anthropic-ai/sdk
 *   node rewrite-pipeline.mjs --input ./pro_hesaplama_araclari_193_.txt --output ./output
 * 
 * Output: ./output/PRO_001.json ... PRO_193.json
 *        ./output/_report.json (success/fail report)
 *        ./output/_merged.json (all tools in one file)
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const CONFIG = {
  model:           "claude-sonnet-4-6",
  max_tokens:      4096,
  delay_ms:        600,       // Rate limit protection (ms)
  retry_max:       3,         // Retry on error
  retry_delay_ms:  2000,
  output_dir:      "./output",
  priority_first:  ["PRO_019", "PRO_043", "PRO_092", "PRO_164", "PRO_100", "PRO_112"],
};

// ─── MASTER REWRITE PROMPT ───────────────────────────────────────────────────
const MASTER_PROMPT = `
You are a senior industrial engineering expert for SectorCalc.
Your task: Upgrade the given calculation tool JSON to industrial authority standard.

CRITICAL: ALL TEXT fields (name, error_msg, message, options, description, tool_name, category) must be in ENGLISH ONLY. No Turkish, no other languages.

TARGET AUDIENCE: Engineers, technicians, CNC operators, facility managers,
quality engineers, welding specialists, mechanics, renovators — field decision-making professionals.
These people pay money. Incorrect calculations are unacceptable. System must warn when values are outside safe range.

OUTPUT RULE: Return ONLY valid JSON. No markdown, no explanation, no \`\`\`json.
First character must be {, last character must be }.

════════════════════════════════════════════════════════════
RULE 1 — INPUT COMPLETION
════════════════════════════════════════════════════════════
PRESERVE existing inputs, ADD missing critical inputs.

Each input object REQUIRED fields:
{
  "id": "snake_case_id",
  "name": "English Label (Symbol)",
  "unit": "SI or industrial unit",
  "type": "number" | "enum",
  "required": true | false,
  "confidence_label": "EXACT" | "STRONG" | "DEFAULT",
  "absolute_min": numeric physical lower limit (required for number),
  "absolute_max": numeric physical upper limit (if exists)
}

For optional inputs add:
  "default": default value

For enum inputs add:
  "options": ["Option1", "Option2", ...]

CATEGORY-BASED REQUIRED ADDITIONAL INPUTS:

CNC/Machining:
  - material_group: enum [P_soft, P_hard, M_aust, M_duplex, K_gg, K_ggg, N_al, N_cu, S_ti, S_ni, H_hrc55]
  - nose_radius_mm: mm (required for Ra calc, absolute_min: 0.01)
  - coolant_type: enum [Dry, Wet/Emulsion, MQL, High Pressure]
  - machine_power_kw: kW (absolute_min: 1)

Welding Engineering:
  - base_material_grade: enum [S235, S275, S355, S420, S460, 304SS, 316SS, P265GH, P355GH]
  - joint_type: enum [Butt, T-Joint, Fillet, Lap]
  - preheat_temp_c: °C (absolute_min: 0, absolute_max: 400)
  - heat_input_kj_mm: kJ/mm (absolute_min: 0.1, absolute_max: 10)

Pressure Vessel/Pipe:
  - design_pressure_bar: bar (absolute_min: 0.1)
  - design_temp_c: °C (absolute_min: -196, absolute_max: 1000)
  - material_grade: enum [P265GH, P355GH, 304L, 316L, A106-B, API5L-X52]
  - corrosion_allowance_mm: mm (absolute_min: 0, default: 3)

HVAC/Thermodynamics:
  - ambient_temp_c: °C (absolute_min: -40, absolute_max: 60, default: 35)
  - altitude_m: m (absolute_min: 0, absolute_max: 4000, default: 0)
  - fluid_type: enum [Water, Air, R410A, R32, R134a, Natural Gas, Steam]

Quality/Metrology:
  - tolerance_range: unit (absolute_min: 0.001)
  - number_of_appraisers: count (absolute_min: 2, absolute_max: 5, default: 3)
  - parts_per_appraiser: count (absolute_min: 5, absolute_max: 30, default: 10)

Fluid Mechanics:
  - fluid_density_kg_m3: kg/m³ (absolute_min: 0.1)
  - fluid_viscosity_cst: cSt (absolute_min: 0.1)
  - pipe_roughness_mm: mm (absolute_min: 0.0001, absolute_max: 5)

Electrical:
  - power_factor: ratio (absolute_min: 0.5, absolute_max: 1.0)
  - ambient_temp_c: °C (absolute_min: -20, absolute_max: 60, default: 30)
  - installation_method: enum [A1, A2, B1, B2, C, E, F, G]

Structural:
  - safety_factor: ratio (absolute_min: 1.0, default: 2.5)
  - load_type: enum [Static, Dynamic, Fatigue, Impact]
  - steel_grade: enum [S235, S275, S355, S420, S460]

Finance/Cost:
  - currency: enum [USD, EUR, TRY, GBP]
  - analysis_period_years: years (absolute_min: 1, absolute_max: 50)
  - inflation_rate_pct: % (absolute_min: 0, absolute_max: 100, default: 5)

════════════════════════════════════════════════════════════
RULE 2 — FORMULA VALIDATION AND ENRICHMENT
════════════════════════════════════════════════════════════
PRESERVE correct formulas.
FIX incorrect formulas (e.g. Ra = fz²/(8×(D/2)) WRONG → Ra = fz²/(8×r_epsilon) CORRECT).
ADD missing formulas.
Write unit and source as comment after each formula:

"VarName = expression   // [unit] | Source: STANDARD"

FORMULA LANGUAGE (supported functions):
  POWER(x, n), SQRT(x), ABS(x), LN(x), LOG10(x), EXP(x)
  SIN(x), COS(x), TAN(x), PI
  NORMSINV(p), NORMSDIST(z)
  MAX(a,b), MIN(a,b), FLOOR(x), CEIL(x)
  Operators: + - * / ( ) && ||

CNC formula template:
  n_rpm = (1000 * vc) / (PI * tool_diameter)   // [RPM]
  Vf = fz * z * n_rpm   // [mm/min]
  Rz = (POWER(fz, 2) / (8 * nose_radius_mm)) * 1000   // [μm] | Source: ISO 3002
  Ra = Rz / k_surface   // k_surface: turning=4.0, milling=4.5, ball-nose=6.0
  Fc = kc_actual * ap * fz   // [N] | Source: Kienzle/ISO 513
  Pc = (Fc * vc) / (60000)   // [kW]
  Tool_Life_T = POWER(C_taylor / vc, 1 / n_taylor)   // [min] | Source: ISO 3685

════════════════════════════════════════════════════════════
RULE 3 — VALIDATION LAYER (MINIMUM 3)
════════════════════════════════════════════════════════════
"engine_rules": {
  "validation": {
    "key_name": {
      "absolute_min": number,         // OR
      "absolute_max": number,         // OR
      "condition": "expr > val",    // computed variable check
      "error_msg": "English error message — explain why it is impossible"
    }
  }
}

Validation examples by category:

CNC:
  ae_diameter_limit: { "condition": "ae > tool_diameter", "error_msg": "Radial width (ae) cannot exceed tool diameter. Geometric impossibility." }
  fz_minimum: { "absolute_min": 0.001, "error_msg": "Feed per tooth cannot be below 0.001 mm. No chip forms, tool rubs." }
  ap_tool_limit: { "condition": "ap > tool_diameter * 0.8", "error_msg": "Axial depth cannot exceed 80% of tool diameter. Breakage risk." }

Pressure Vessel:
  wall_minimum: { "condition": "wall_thickness < (pressure * diameter / (2 * allowable_stress))", "error_msg": "Wall thickness below ASME VIII minimum. Structurally unsafe." }

Welding:
  ce_limit: { "condition": "CE_IIW > 0.45 AND preheat_temp_c < 100", "error_msg": "CE > 0.45 but EN 1011 preheat requirement not met. Cold crack risk critical." }

Quality:
  sample_minimum: { "absolute_min": 25, "error_msg": "Minimum 25 measurements required for statistical reliability." }
  grr_limit: { "condition": "GRR_pct > 30", "error_msg": "GR&R above 30%. Measurement system inadequate, results unreliable (AIAG MSA)." }

════════════════════════════════════════════════════════════
RULE 4 — SMART WARNING SYSTEM (MINIMUM 3, IDEAL 5)
════════════════════════════════════════════════════════════
{
  "condition": "mathematical condition (computed variables accessible)",
  "severity": "CRITICAL" | "WARNING" | "INFO",
  "source": "ISO/IEC/ASME/VDI/Sandvik standard code",
  "message": "English message: PROBLEM + CAUSE + RECOMMENDATION (max 200 chars)"
}

SEVERITY RULES:
- CRITICAL: Physical unsafety, standard violation, equipment damage, structural risk
- WARNING: Suboptimal parameters, economic loss, early failure risk
- INFO: Optimization opportunity, alternative approach, maintenance suggestion

REQUIRED WARNING CATEGORIES (add if applicable for each tool):
1. Physical limit: Computed value exceeds standard maximum
2. Safety factor: SF < minimum → CRITICAL
3. Economic: More than 30% outside optimal value → WARNING
4. Quality: Tolerance/spec violation → CRITICAL
5. Energy: Inefficiency detected → INFO

RULE 5 — SPECIFY REFERENCE STANDARD FOR EACH TOOL
Add the following field to the tool JSON (inside engine_rules):
"standards": ["ISO XXXX", "ASME BYYY", "VDI ZZZZ"]

REFERENCE TABLE (select correct standard by category):
CNC: ISO 513, ISO 3002, ISO 3685, Sandvik C-2920
Welding: AWS D1.1, EN 1011, IIW Doc. IX-2136, ASME BPVC IX
Pressure Vessel: ASME VIII Div.1, EN 13445, PED 2014/68/EU
Pipe: ASME B31.3, EN 13480, ISO 4200
HVAC: ASHRAE 90.1, EN 14511, IEC 60335
Electrical: IEC 60364, IEC 60228, NFPA 70
Structural Steel: AISC 360, EN 1993-1-1 (EC3), ASCE 7
Concrete/Anchor: ACI 318, EN 1992, EN 1504
Quality: ISO 9001, IATF 16949, AIAG MSA 4th Ed., ISO 17025
OHS: OSHA 29 CFR 1910, ISO 45001, EN ISO 13849
Reliability: IEC 61508, MIL-HDBK-217, ISO 13849
Energy: ISO 50001, EN 15900, IEC 60034
ESG/Emissions: GHG Protocol, EU ETS, CBAM EU 2023/956
Finance: IFRS 16, IAS 36, Big Four TCO Framework
Bearing: ISO 281, SKF Application Handbook
Gear: ISO 6336, AGMA 2001, DIN 3990
Spring: DIN 2089, EN 13906

════════════════════════════════════════════════════════════
SCOPE DEFINITION
════════════════════════════════════════════════════════════
Add the following field to the JSON:
"scope": "single_operation" | "multi_operation" | "process_agnostic"
"primary_operation": "milling" | "turning" | "welding" | "hvac" | "structural" | "financial" | etc.

If the tool includes both milling and turning → scope: "multi_operation"
and separate formulas: "formulas_milling": [...], "formulas_turning": [...]

════════════════════════════════════════════════════════════
OUTPUT JSON STRUCTURE
════════════════════════════════════════════════════════════
{
  "tool_id": "PRO_XXX",
  "tool_name": "...",
  "category": "...",
  "scope": "...",
  "primary_operation": "...",
  "inputs": [ ...enriched inputs... ],
  "formulas": [ ...corrected and added formulas... ],
  "engine_rules": {
    "standards": ["..."],
    "validation": { ...minimum 3 rules... },
    "smart_warnings": [ ...minimum 3 warnings... ]
  }
}

INPUT TOOL:
`;

// ─── ARAÇ PARSE ─────────────────────────────────────────────────────────────
function parseTools(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const tools = [];

  // tool_id bazlı split
  const blocks = raw.split(/"tool_id"/).slice(1);

  for (const block of blocks) {
    const idMatch = block.match(/:\s*"(PRO_\d+)"/);
    const nameMatch = block.match(/"tool_name"\s*:\s*"([^"]+)"/);
    const catMatch = block.match(/"category"\s*:\s*"([^"]+)"/);

    if (!idMatch) continue;

    // Her bloğun başından bir sonraki tool_id'ye kadar olan kısmı al
    // JSON reconstruct: tool_id'den itibaren ilk geçerli JSON objesini çıkar
    const fullBlock = '"tool_id"' + block.split('"tool_id"')[0];

    tools.push({
      id: idMatch[1],
      name: nameMatch?.[1] || "?",
      category: catMatch?.[1] || "?",
      rawBlock: fullBlock,
    });
  }

  return tools;
}

// Daha güvenilir parse: tüm dosyayı JSON array olarak oku
function parseToolsFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const tools = [];

  // Her batch array'ini bul
  const batchMatches = [...raw.matchAll(/"pro_batch_\d+[^"]*"\s*:\s*\[/g)];

  if (batchMatches.length === 0) {
    // Direkt array dene
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  // Satır bazlı tool objesi extraction
  const lines = raw.split("\n");
  let depth = 0;
  let inTool = false;
  let toolBuffer = [];
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inTool && line.includes('"tool_id"')) {
      inTool = true;
      toolBuffer = [];
      braceDepth = 0;
    }

    if (inTool) {
      toolBuffer.push(line);
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0 && toolBuffer.length > 1) {
        const jsonStr = toolBuffer.join("\n").trim().replace(/,\s*$/, "");
        try {
          const tool = JSON.parse(jsonStr);
          if (tool.tool_id) tools.push(tool);
        } catch {
          // parse hatası — ham bloğu sakla
          const idMatch = jsonStr.match(/"tool_id"\s*:\s*"(PRO_\d+)"/);
          if (idMatch) {
            tools.push({ tool_id: idMatch[1], _raw: jsonStr, _parseError: true });
          }
        }
        inTool = false;
        toolBuffer = [];
      }
    }
  }

  return tools;
}

// ─── API ÇAĞRISI ─────────────────────────────────────────────────────────────
async function rewriteTool(client, tool, attempt = 1) {
  const toolStr = tool._raw || JSON.stringify(tool, null, 2);
  const prompt = MASTER_PROMPT + "\n" + toolStr;

  try {
    const response = await client.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.max_tokens,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0]?.text?.trim() || "";

    // JSON çıkart
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("JSON bulunamadı");

    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonStr);

    // Kalite gate
    const warnings = parsed.engine_rules?.smart_warnings || [];
    const validations = Object.keys(parsed.engine_rules?.validation || {});
    const inputs = parsed.inputs || [];
    const formulas = parsed.formulas || [];

    const qg = {
      inputs_ok:      inputs.length >= 5,
      formulas_ok:    formulas.length >= 3,
      warnings_ok:    warnings.length >= 3,
      validations_ok: validations.length >= 2,
      standards_ok:   (parsed.engine_rules?.standards || []).length >= 1,
    };
    const passed = Object.values(qg).every(Boolean);

    return {
      data: parsed,
      quality_gate: qg,
      passed,
      usage: response.usage,
    };
  } catch (err) {
    if (attempt < CONFIG.retry_max) {
      await sleep(CONFIG.retry_delay_ms * attempt);
      return rewriteTool(client, tool, attempt + 1);
    }
    throw err;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── ANA PIPELINE ─────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const inputArg = args.find(a => a.startsWith("--input="))?.split("=")[1] || "./pro_hesaplama_araclari_193_.txt";
  const outputArg = args.find(a => a.startsWith("--output="))?.split("=")[1] || CONFIG.output_dir;
  const onlyArg = args.find(a => a.startsWith("--only="))?.split("=")[1]; // örn: --only=PRO_019,PRO_043

  if (!fs.existsSync(inputArg)) {
    console.error(`❌ Dosya bulunamadı: ${inputArg}`);
    process.exit(1);
  }

  fs.mkdirSync(outputArg, { recursive: true });

  console.log("📂 Araçlar parse ediliyor...");
  const tools = parseToolsFromFile(inputArg);
  console.log(`✅ ${tools.length} araç bulundu`);

  // Öncelik sıralaması
  let orderedTools = [
    ...CONFIG.priority_first
      .map(id => tools.find(t => t.tool_id === id))
      .filter(Boolean),
    ...tools.filter(t => !CONFIG.priority_first.includes(t.tool_id)),
  ];

  // --only filtresi
  if (onlyArg) {
    const onlyIds = onlyArg.split(",");
    orderedTools = orderedTools.filter(t => onlyIds.includes(t.tool_id));
    console.log(`🔍 Filtre uygulandı: ${onlyIds.join(", ")}`);
  }

  const client = new Anthropic(); // ANTHROPIC_API_KEY env'den alır

  const report = {
    total: orderedTools.length,
    success: [],
    failed: [],
    skipped: [],
    quality_failed: [],
    token_usage: { input: 0, output: 0 },
    started_at: new Date().toISOString(),
  };

  const mergedTools = [];

  for (let i = 0; i < orderedTools.length; i++) {
    const tool = orderedTools[i];
    const outputPath = path.join(outputArg, `${tool.tool_id}.json`);

    // Zaten işlenmişse atla (--force ile override edilebilir)
    if (fs.existsSync(outputPath) && !args.includes("--force")) {
      console.log(`⏭  ${tool.tool_id} atlandı (mevcut)`);
      report.skipped.push(tool.tool_id);
      const existing = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      mergedTools.push(existing);
      continue;
    }

    const progress = `[${i + 1}/${orderedTools.length}]`;
    console.log(`${progress} ⚙  ${tool.tool_id} — ${tool.tool_name || tool.name || "?"}`);

    try {
      const result = await rewriteTool(client, tool);

      // Dosyaya yaz
      fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), "utf-8");
      mergedTools.push(result.data);

      // İstatistik güncelle
      report.token_usage.input  += result.usage?.input_tokens  || 0;
      report.token_usage.output += result.usage?.output_tokens || 0;

      if (result.passed) {
        report.success.push({
          id: tool.tool_id,
          quality_gate: result.quality_gate,
        });
        console.log(`  ✅ Başarılı | ${JSON.stringify(result.quality_gate)}`);
      } else {
        report.quality_failed.push({
          id: tool.tool_id,
          quality_gate: result.quality_gate,
        });
        console.log(`  ⚠  Kalite gate başarısız | ${JSON.stringify(result.quality_gate)}`);
      }
    } catch (err) {
      console.error(`  ❌ Hata: ${err.message}`);
      report.failed.push({ id: tool.tool_id, error: err.message });
    }

    // Rate limit koruması
    if (i < orderedTools.length - 1) {
      await sleep(CONFIG.delay_ms);
    }
  }

  report.finished_at = new Date().toISOString();

  // Raporu yaz
  const reportPath = path.join(outputArg, "_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

  // Merged dosyayı yaz
  const mergedPath = path.join(outputArg, "_merged.json");
  fs.writeFileSync(mergedPath, JSON.stringify(mergedTools, null, 2), "utf-8");

  // Özet
  console.log("\n" + "═".repeat(50));
  console.log("📊 PIPELINE TAMAMLANDI");
  console.log("═".repeat(50));
  console.log(`✅ Başarılı:         ${report.success.length}`);
  console.log(`⚠  Kalite sorunu:   ${report.quality_failed.length}`);
  console.log(`❌ Hata:            ${report.failed.length}`);
  console.log(`⏭  Atlandı:         ${report.skipped.length}`);
  console.log(`📈 Token (toplam):  ${report.token_usage.input + report.token_usage.output}`);
  console.log(`📁 Çıktı:           ${outputArg}/`);
  console.log(`📋 Rapor:           ${reportPath}`);
  console.log(`📦 Merged:          ${mergedPath}`);

  if (report.failed.length > 0) {
    console.log("\n❌ Hata veren araçlar:");
    report.failed.forEach(f => console.log(`   ${f.id}: ${f.error}`));
  }
  if (report.quality_failed.length > 0) {
    console.log("\n⚠  Kalite gate başarısız araçlar (manuel kontrol önerilir):");
    report.quality_failed.forEach(f => {
      const failed = Object.entries(f.quality_gate)
        .filter(([, v]) => !v).map(([k]) => k).join(", ");
      console.log(`   ${f.id}: ${failed}`);
    });
  }
}

main().catch(err => {
  console.error("Pipeline hatası:", err);
  process.exit(1);
});
