/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SectorCalc Pro Tools — Batch Import from JS Source Files
 * ───────────────────────────────────────────────────────────────────────────
 * Reads JS files from "PRO TOOLSLARA EKLEME/" folder, extracts individual
 * tool schema objects, and writes:
 *   1. data/pro-tools/PRO_XXX.json  (pro-tools schema)
 *   2. data/pro-tools-universal/PRO_XXX.json (universal schema via migration)
 *   3. Updates _merged.json and _report.json in both directories
 *
 * Usage: node scripts/add-pro-tools-from-js.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(ROOT, "PRO TOOLSLARA EKLEME");
const PRO_TOOLS_DIR = path.join(ROOT, "data/pro-tools");
const UNIVERSAL_DIR = path.join(ROOT, "data/pro-tools-universal");

// ── Import migration functions from existing script ────────────────────────
// We replicate them here to avoid complex module loading

const UNIT_DIMENSIONLESS = { ref: "dimensionless" };
const UNIT_MAP = {
  "mm": { ref: "mm" }, "cm": { ref: "cm" }, "m": { ref: "m" }, "km": { ref: "km" },
  "mm^2": { ref: "mm2" }, "mm²": { ref: "mm2" }, "mm2": { ref: "mm2" },
  "mm^3": { ref: "mm3" }, "mm³": { ref: "mm3" }, "mm3": { ref: "mm3" },
  "mm^4": { ref: "mm4" }, "mm⁴": { ref: "mm4" }, "mm4": { ref: "mm4" },
  "MPa": { ref: "MPa" }, "Pa": { ref: "Pa" }, "kPa": { ref: "kPa" },
  "kN": { ref: "kN" }, "N": { ref: "N" },
  "kN·m": { ref: "kNm" }, "kNm": { ref: "kNm" }, "Nm": { ref: "Nm" }, "N·m": { ref: "Nm" },
  "kN/m": { ref: "kNpm" },
  "kW": { ref: "kW" }, "W": { ref: "W" }, "kWh": { ref: "kWh" },
  "h": { ref: "h" }, "min": { ref: "min" }, "s": { ref: "s" },
  "L/min": { ref: "Lpmin" }, "m³/h": { ref: "m3ph" }, "m³": { ref: "m3" }, "m³/s": { ref: "m3ps" },
  "kg": { ref: "kg" }, "t": { ref: "t" },
  "°C": { ref: "degC" }, "C": { ref: "degC" }, "K": { ref: "K" },
  "%": { ref: "pct" },
  "m/min": { ref: "mpmin" }, "m/s": { ref: "mps" },
  "mm/min": { ref: "mmpmin" }, "mm/tooth": { ref: "mmptooth" }, "mm/rev": { ref: "mmprev" },
  "rpm": { ref: "rpm" }, "rev/min": { ref: "rpm" },
  "USD": { ref: "USD" }, "EUR": { ref: "EUR" },
  "strain": { ref: "dimensionless" },
  "degree": { ref: "deg" }, "°": { ref: "deg" },
  "days": { ref: "day" }, "year": { ref: "year" },
  "m²": { ref: "m2" }, "V": { ref: "V" }, "A": { ref: "A" },
  "Ω": { ref: "ohm" }, "Hz": { ref: "Hz" }, "bar": { ref: "bar" },
  "Lux": { ref: "lux" }, "lm": { ref: "lm" }, "cd": { ref: "cd" }, "mol": { ref: "mol" },
  "mV vs Ag/AgCl/seawater": { ref: "mV" }, "mV": { ref: "mV" },
  "ppm": { ref: "ppm" }, "µm": { ref: "um" }, "µin": { ref: "uin" },
  "years": { ref: "year" }, "h/yr": { ref: "h" },
  "A·h": { ref: "Ah" }, "A": { ref: "A" },
  "kN·m/m": { ref: "kNmpm" }, "kN/m": { ref: "kNpm" },
  "mm/pass": { ref: "mmpass" },
  "mm³/(mm·s)": { ref: "mm3pmmps" },
  "mm²/(m)": { ref: "mm2pm" },
  "mm³_workpiece/mm³_wheel": { ref: "dimensionless" },
  "MPa or blows/0.3m": { ref: "dimensionless" },
  "kN (÷ 9.81 = tonnes-force)": { ref: "kN" },
  "mm²/m": { ref: "mm2pm" },
  "bar diameters": { ref: "dimensionless" },
  "count": { ref: "count" },
  "µin": { ref: "uin" },
  "mm²/(mm·s)": { ref: "mm2pmmps" },
  "number": { ref: "dimensionless" },
};

function resolveUnit(unitStr, defaultValue = "dimensionless") {
  if (!unitStr || unitStr === "" || unitStr === "dimensionless" || unitStr === "-" || unitStr === "number") {
    return UNIT_DIMENSIONLESS;
  }
  const clean = unitStr.trim();
  if (UNIT_MAP[clean]) return UNIT_MAP[clean];
  if (UNIT_MAP[clean.toLowerCase()]) return UNIT_MAP[clean.toLowerCase()];
  const key = clean.replace(/[·•\s]/g, "").toLowerCase();
  for (const [k, v] of Object.entries(UNIT_MAP)) {
    if (k.toLowerCase() === key) return v;
  }
  return { ref: clean };
}

function parseConfidence(label) {
  if (!label) return "VARSAYIM";
  const u = label.toUpperCase().trim();
  if (u.includes("KESİN") || u.includes("KESIN") || u.includes("EXACT")) return "KESIN";
  if (u.includes("GÜÇLÜ") || u.includes("GUCLU") || u.includes("STRONG")) return "GUCLU";
  if (u.includes("ORTA") || u.includes("MEDIUM")) return "ORTA";
  if (u.includes("VARSAYIM") || u.includes("DEFAULT") || u.includes("APPROXIMATE")) return "VARSAYIM";
  return "VARSAYIM";
}

function guessGroup(inp) {
  if (inp.group) return inp.group;
  if (inp.note) {
    const n = inp.note.toLowerCase();
    if (n.includes("geometry") || n.includes("dimension") || n.includes("width") ||
        n.includes("depth") || n.includes("length") || n.includes("thickness") ||
        n.includes("diameter") || n.includes("section")) return "geometry";
    if (n.includes("material") || n.includes("strength") || n.includes("yield") ||
        n.includes("stress") || n.includes("modulus")) return "materials";
    if (n.includes("load") || n.includes("force") || n.includes("moment") ||
        n.includes("shear") || n.includes("action") || n.includes("demand")) return "actions";
    if (n.includes("code") || n.includes("factor") || n.includes("safety") ||
        n.includes("partial")) return "code";
    if (n.includes("reinforcement") || n.includes("steel") || n.includes("bar") ||
        n.includes("stirrup")) return "reinforcement";
    if (n.includes("tool") || n.includes("cutting") || n.includes("machining")) return "tooling";
    if (n.includes("process") || n.includes("time") || n.includes("cycle")) return "process";
    if (n.includes("energy") || n.includes("power") || n.includes("efficiency")) return "energy";
    if (n.includes("fuel") || n.includes("chimney") || n.includes("stack") || n.includes("flue")) return "fuel";
    if (n.includes("soil") || n.includes("foundation") || n.includes("bearing")) return "geotech";
    if (n.includes("weld") || n.includes("electrode") || n.includes("throat")) return "welding";
    if (n.includes("thread") || n.includes("tap") || n.includes("pitch")) return "threading";
    if (n.includes("bolt") || n.includes("washer") || n.includes("nut")) return "fasteners";
    if (n.includes("climate") || n.includes("weather") || n.includes("ambient")) return "environment";
  }
  // Determine based on input field common patterns
  const id = (inp.id || "").toLowerCase();
  if (id.includes("material") || id.includes("strength") || id.includes("yield") ||
      id.includes("stress") || id.includes("modulus") || id.includes("density") ||
      id.includes("hardness")) return "materials";
  if (id.includes("temp") || id.includes("temprature") || id.includes("temperature")) return "environment";
  if (id.includes("load") || id.includes("force") || id.includes("moment") ||
      id.includes("shear") || id.includes("pressure")) return "actions";
  if (id.includes("length") || id.includes("width") || id.includes("depth") ||
      id.includes("height") || id.includes("diameter") || id.includes("thickness") ||
      id.includes("area") || id.includes("span") || id.includes("size")) return "geometry";
  return "general";
}

function buildInputGroups(schemaInputs) {
  const groups = new Map();
  for (const inp of schemaInputs) {
    const g = inp.group || "general";
    if (!groups.has(g)) {
      groups.set(g, {
        key: g,
        letter: String.fromCharCode(65 + groups.size),
        title: g.charAt(0).toUpperCase() + g.slice(1),
        cols: 2,
      });
    }
  }
  return Array.from(groups.values());
}

function mapInput(allValues) {
  return allValues.map(inp => {
    const confidence = parseConfidence(inp.confidence_label || inp.confidence);
    const group = guessGroup(inp);
    const mapped = {
      id: inp.id,
      symbol: inp.symbol || inp.id,
      label: ((inp.name && !inp.name.startsWith(inp.id)) ? inp.name : inp.id).replace(/[–—]/g, "-"),
      unit: resolveUnit(inp.unit),
      confidence,
      group,
    };
    if (inp.absolute_min !== undefined && inp.absolute_min !== null) mapped.min = inp.absolute_min;
    if (inp.absolute_max !== undefined && inp.absolute_max !== null) mapped.max = inp.absolute_max;
    if (inp.default !== undefined && inp.default !== null) mapped.default = inp.default;
    if (inp.required === false) mapped.optional = true;
    if (inp.hint) mapped.hint = inp.hint;
    if (inp.options && Array.isArray(inp.options)) {
      mapped.enum = inp.options.map(opt => ({
        value: opt.value,
        label: opt.label,
      }));
    }
    return mapped;
  });
}

function mapFormulas(formulas) {
  if (!formulas || !Array.isArray(formulas)) return [];
  return formulas.map((f, i) => {
    const id = f.id || `F${i + 1}`;
    const output = f.output || `out_${i + 1}`;
    const expression = f.expression || f.rhs || "";
    const unit = resolveUnit(f.unit, "dimensionless");
    const reference = f.reference || "";
    return {
      id,
      output,
      expression,
      unit,
      reference,
      display: { resultRow: true },
    };
  });
}

function mapValidation(engineRules) {
  const rules = [];
  if (engineRules?.validation?.rules) {
    for (const vr of engineRules.validation.rules) {
      if (vr.action === "BLOCK" || vr.action === "WARN") {
        rules.push({
          id: vr.id,
          action: vr.action,
          condition: vr.condition,
          message: vr.message,
        });
      }
    }
  }
  return rules;
}

/**
 * Normalize smart_warnings: some sources use `action` instead of `severity`,
 * and `trigger` instead of `condition`. Normalize to the canonical fields.
 */
function normalizeSmartWarnings(tool) {
  if (!tool.engine_rules?.smart_warnings) return tool;
  for (const sw of tool.engine_rules.smart_warnings) {
    // action → severity (fallback when severity missing)
    if (!sw.severity && sw.action) {
      sw.severity = sw.action;
      delete sw.action;
    }
    // trigger → condition
    if (sw.trigger && !sw.condition) {
      sw.condition = sw.trigger;
      delete sw.trigger;
    }
  }
  return tool;
}

function mapWarnings(engineRules) {
  const warnings = [];
  if (engineRules?.smart_warnings) {
    for (const sw of engineRules.smart_warnings) {
      const sev = (sw.severity || sw.action || "INFO").toUpperCase();
      warnings.push({
        id: sw.id || `W${warnings.length + 1}`,
        severity: sev === "CRITICAL" ? "CRITICAL" : sev === "WARNING" ? "WARNING" : "INFO",
        source: sw.source || "",
        condition: sw.condition || sw.trigger || "",
        message: sw.message || "",
      });
    }
  }
  return warnings;
}

function convertToUniversalSchema(oldTool) {
  const toolId = oldTool.tool_id;
  const toolName = oldTool.tool_name;
  const category = (oldTool.category || "General").split(/\/|·/).map(s => s.trim()).filter(Boolean);
  const sectorPath = category.length > 0 ? category : ["General"];
  const standardsBasis = oldTool.engine_rules?.standards || oldTool.standards || [];
  const allInputs = oldTool.inputs || [];
  const mappedInputs = mapInput(allInputs);
  const inputGroups = buildInputGroups(mappedInputs);

  let formulaDefs;
  if (oldTool.formulas && oldTool.formulas.length > 0) {
    if (typeof oldTool.formulas[0] === "object" && oldTool.formulas[0]?.expression) {
      formulaDefs = mapFormulas(oldTool.formulas);
    } else {
      formulaDefs = [];
    }
  } else {
    formulaDefs = [];
  }

  const validationRules = mapValidation(oldTool.engine_rules);
  const warnings = mapWarnings(oldTool.engine_rules);

  const decision = {
    governingOutput: "UC",
    thresholds: { pass: 0.9, fail: 1.0 },
    verdictText: {
      pass: "PASS — Capacity Satisfied",
      warn: "PASS — High Utilization: Peer Review Required",
      fail: "FAIL — Insufficient Capacity",
    },
  };

  const gum = {
    measurand: "UC",
    method: "numeric",
    coverageFactor: 2,
  };

  const fmeaConfig = {
    mandatoryWhen: "UC > 0.9",
    modes: [],
  };

  const standards = [{
    id: toolId,
    code: standardsBasis[0] || toolId,
    name: toolName,
    description: `${toolName} — ${category.join(", ")}`,
    year: "2025",
    formulas: formulaDefs,
    validation: validationRules,
    warnings,
    decision,
    gum,
    requiredInputs: allInputs.filter(i => i.required !== false).map(i => i.id),
  }];

  const scope = {
    inScope: [`${toolName}`],
    outOfScope: ["Detailed design review", "Site-specific conditions"],
    boundaryWarning: "Engineering decision support only — verify before use.",
  };

  return {
    schemaId: toolId,
    toolCode: `TOOL-${toolId.replace("_", "-")}`,
    version: "1.0.0",
    name: toolName,
    subtitle: `${category.join(" | ")} — ${standardsBasis.slice(0, 2).join(", ")}`,
    sectorPath,
    standardsBasis,
    scope,
    inputs: mappedInputs,
    inputGroups,
    standards,
    fmea: fmeaConfig,
    legalNotice: "⚠ Engineering decision support only — verify before use. This is a technical simulation, not professional engineering advice.",
  };
}

// ── Parse JS source files ───────────────────────────────────────

function stripComments(code) {
  // Remove single-line comments (// ...) — handle edge cases
  return code.replace(/\/\/.*$/gm, "");
}

function stripTrailingCommas(code) {
  // Remove trailing commas before closing braces/brackets
  return code.replace(/,\s*([}\]])/g, "$1");
}

function splitToolObjects(text) {
  // Match individual tool objects: {...},
  // They start with "tool_id" property after a {
  const objects = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        const objStr = text.slice(start, i + 1);
        objects.push(objStr);
        start = -1;
      }
    }
  }
  return objects;
}

function parseSourceFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  // Remove comment blocks at the top that span multiple lines
  content = content.replace(/\/\/ ═════[^]*?(?=\{|$)/g, "");
  content = content.replace(/\/\/ ───[^]*?(?=\{|$)/g, "");
  // Remove remaining // line comments (after we've removed the header blocks)
  content = stripComments(content);
  // Clean up extra whitespace
  content = content.trim();
  // Remove trailing commas
  content = stripTrailingCommas(content);

  // Find all top-level objects
  const rawObjects = splitToolObjects(content);
  const tools = [];

  for (const raw of rawObjects) {
    try {
      // Try to parse as JSON (after all cleanup)
      // Some source objects may still have JS-specific patterns
      const clean = stripTrailingCommas(raw);
      const obj = JSON.parse(clean);
      if (obj.tool_id && obj.tool_id.startsWith("PRO_")) {
        tools.push(obj);
      }
    } catch (e) {
      console.warn(`  ⚠ Could not parse object in ${filePath}: ${e.message}`);
      // Skip unparseable objects
    }
  }

  return tools;
}

// ── Main Migration Logic ────────────────────────────────────────

function updateMergedJson(directory) {
  const files = fs.readdirSync(directory)
    .filter(f => f.startsWith("PRO_") && f.endsWith(".json"))
    .sort();

  // Read first file to determine format (pro-tools vs universal)
  if (files.length === 0) return;

  const firstFile = JSON.parse(fs.readFileSync(path.join(directory, files[0]), "utf-8"));
  const isUniversal = firstFile.schemaId !== undefined;

  let merged;

  if (isUniversal) {
    // Universal format
    merged = files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, f), "utf-8"));
      return {
        schemaId: data.schemaId,
        toolCode: data.toolCode,
        name: data.name,
        sectorPath: data.sectorPath,
        standardsBasis: data.standardsBasis,
        standards: (data.standards || []).map(s => ({
          id: s.id,
          code: s.code,
          name: s.name,
          formulasCount: s.formulas ? s.formulas.length : 0,
        })),
        inputCount: data.inputs ? data.inputs.length : 0,
        version: data.version,
      };
    });
  } else {
    // Pro-tools format
    merged = files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, f), "utf-8"));
      return {
        tool_id: data.tool_id,
        tool_name: data.tool_name,
        category: data.category,
        scope: data.scope,
        primary_operation: data.primary_operation,
        engine_rules: {
          standards: data.engine_rules?.standards || [],
        },
      };
    });
  }

  fs.writeFileSync(path.join(directory, "_merged.json"), JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

function updateReportJson(directory, toolIds) {
  const reportPath = path.join(directory, "_report.json");
  let report = { success: [], failed: [], timestamp: new Date().toISOString() };

  if (fs.existsSync(reportPath)) {
    try {
      report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    } catch (e) {
      // Start fresh
    }
  }

  for (const id of toolIds) {
    if (!report.success.includes(id)) {
      report.success.push(id);
    }
  }

  report.timestamp = new Date().toISOString();
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
}

function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log(" SectorCalc Pro Tools — Batch Import from JS Files");
  console.log("═══════════════════════════════════════════════════════\n");

  // 1. Read all source files from EKLEME directory
  const sourceFiles = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.endsWith(".js"))
    .sort();

  if (sourceFiles.length === 0) {
    console.error("✗ No JS files found in", SOURCE_DIR);
    process.exit(1);
  }

  console.log(`Found ${sourceFiles.length} source files:\n`);
  for (const sf of sourceFiles) {
    console.log(`  📄 ${sf}`);
  }
  console.log("");

  // 2. Extract all tools from source files
  const allTools = [];
  for (const sf of sourceFiles) {
    const filePath = path.join(SOURCE_DIR, sf);
    console.log(`📖 Reading ${sf}...`);
    const tools = parseSourceFile(filePath);
    console.log(`   → Found ${tools.length} tool(s)`);
    allTools.push(...tools);
  }

  console.log(`\n📊 Total tools extracted: ${allTools.length}\n`);

  if (allTools.length === 0) {
    console.error("✗ No valid tools could be extracted.");
    process.exit(1);
  }

  // 3. Write individual PRO_XXX.json files to data/pro-tools/
  const toolIds = [];
  let successCount = 0;
  let errorCount = 0;

  for (const tool of allTools) {
    const toolId = tool.tool_id;
    toolIds.push(toolId);
    const outputFile = `${toolId}.json`;
    const outputPath = path.join(PRO_TOOLS_DIR, outputFile);

    try {
      // Normalize: action→severity, trigger→condition for smart_warnings
      const normalized = normalizeSmartWarnings(tool);
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2) + "\n", "utf-8");
      console.log(`  ✓ data/pro-tools/${outputFile}`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ ${outputFile}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Pro-tools files: ${successCount} created, ${errorCount} failed\n`);

  // 4. Generate universal format files
  console.log("🔄 Generating universal schema files...\n");
  let uniSuccess = 0;
  let uniError = 0;

  for (const tool of allTools) {
    const toolId = tool.tool_id;
    const outputFile = `${toolId}.json`;
    const outputPath = path.join(UNIVERSAL_DIR, outputFile);

    try {
      const schema = convertToUniversalSchema(tool);
      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2) + "\n", "utf-8");
      console.log(`  ✓ data/pro-tools-universal/${outputFile}`);
      uniSuccess++;
    } catch (err) {
      console.error(`  ✗ ${outputFile}: ${err.message}`);
      uniError++;
    }
  }

  console.log(`\n✅ Universal files: ${uniSuccess} created, ${uniError} failed\n`);

  // 5. Update _merged.json in both directories
  console.log("🔄 Updating _merged.json files...");
  updateMergedJson(PRO_TOOLS_DIR);
  console.log(`  ✓ data/pro-tools/_merged.json updated`);
  updateMergedJson(UNIVERSAL_DIR);
  console.log(`  ✓ data/pro-tools-universal/_merged.json updated\n`);

  // 6. Update _report.json
  console.log("🔄 Updating _report.json files...");
  updateReportJson(PRO_TOOLS_DIR, toolIds);
  updateReportJson(UNIVERSAL_DIR, toolIds);
  console.log(`  ✓ Both _report.json files updated\n`);

  // 7. Summary
  console.log("═══════════════════════════════════════════════════════");
  console.log("📋 MIGRATION SUMMARY");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Source files read     : ${sourceFiles.length}`);
  console.log(`  Tools extracted       : ${allTools.length}`);
  console.log(`  Pro-tools JSON        : ${successCount} created`);
  console.log(`  Universal JSON        : ${uniSuccess} created`);
  console.log(`  Merged JSONs          : Updated`);
  console.log(`  Reports               : Updated\n`);

  const ids = toolIds.sort();
  console.log("  Tool IDs added:");
  for (const id of ids) {
    console.log(`    • ${id}`);
  }
  console.log("\n✅ Migration complete!\n");
}

main();
