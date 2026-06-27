/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRO TOOLS → UNIVERSAL SCHEMA (v1) MIGRATION SCRIPT
 * ───────────────────────────────────────────────────────────────────────────
 * Reads every data/pro-tools/PRO_*.json, converts to ToolSchema v1 format,
 * and writes to data/pro-tools-universal/.
 *
 * Usage: node scripts/migrate-pro-tools.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";

const PRO_TOOLS_DIR = "data/pro-tools";
const OUTPUT_DIR = "data/pro-tools-universal";

// ── Shared unit registry (subset — expand as needed) ──────────────
const UNIT_DIMENSIONLESS = { ref: "dimensionless" };
const UNIT_MAP = {
  "mm": { ref: "mm" },
  "cm": { ref: "cm" },
  "m": { ref: "m" },
  "km": { ref: "km" },
  "mm^2": { ref: "mm2" },
  "mm²": { ref: "mm2" },
  "mm2": { ref: "mm2" },
  "mm^3": { ref: "mm3" },
  "mm³": { ref: "mm3" },
  "mm3": { ref: "mm3" },
  "mm^4": { ref: "mm4" },
  "mm⁴": { ref: "mm4" },
  "mm4": { ref: "mm4" },
  "MPa": { ref: "MPa" },
  "Pa": { ref: "Pa" },
  "kPa": { ref: "kPa" },
  "kN": { ref: "kN" },
  "N": { ref: "N" },
  "kN·m": { ref: "kNm" },
  "kNm": { ref: "kNm" },
  "Nm": { ref: "Nm" },
  "N·m": { ref: "Nm" },
  "kN/m": { ref: "kNpm" },
  "kN/m²": { ref: "kNpm2" },
  "kW": { ref: "kW" },
  "W": { ref: "W" },
  "kWh": { ref: "kWh" },
  "h": { ref: "h" },
  "min": { ref: "min" },
  "s": { ref: "s" },
  "L/min": { ref: "Lpmin" },
  "m³/h": { ref: "m3ph" },
  "m³": { ref: "m3" },
  "m³/s": { ref: "m3ps" },
  "kg": { ref: "kg" },
  "t": { ref: "t" },
  "°C": { ref: "degC" },
  "C": { ref: "degC" },
  "K": { ref: "K" },
  "%": { ref: "pct" },
  "m/min": { ref: "mpmin" },
  "m/s": { ref: "mps" },
  "mm/min": { ref: "mmpmin" },
  "mm/tooth": { ref: "mmptooth" },
  "mm/rev": { ref: "mmprev" },
  "rpm": { ref: "rpm" },
  "rev/min": { ref: "rpm" },
  "USD": { ref: "USD" },
  "EUR": { ref: "EUR" },
  "mg/Nm³": { ref: "mgpNm3" },
  "dB(A)": { ref: "dBA" },
  "strain": { ref: "dimensionless" },
  "degree": { ref: "deg" },
  "°": { ref: "deg" },
  "days": { ref: "day" },
  "year": { ref: "year" },
  "m²": { ref: "m2" },
  "V": { ref: "V" },
  "A": { ref: "A" },
  "Ω": { ref: "ohm" },
  "Hz": { ref: "Hz" },
  "bar": { ref: "bar" },
  "Lux": { ref: "lux" },
  "lm": { ref: "lm" },
  "cd": { ref: "cd" },
  "mol": { ref: "mol" },
};

function resolveUnit(unitStr, defaultValue = "dimensionless") {
  if (!unitStr || unitStr === "" || unitStr === "dimensionless" || unitStr === "-") {
    return UNIT_DIMENSIONLESS;
  }
  const clean = unitStr.trim();
  // Direct lookup
  if (UNIT_MAP[clean]) return UNIT_MAP[clean];
  // Try lowercase
  if (UNIT_MAP[clean.toLowerCase()]) return UNIT_MAP[clean.toLowerCase()];
  // Try removing spaces, extra chars
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

function parseUncertainty(uncStr) {
  if (!uncStr || uncStr === "±0" || uncStr === "±0 ") return undefined;
  const trimmed = uncStr.trim();
  // Match patterns like: "±2 mm Type B" or "±1% Type B" or "±5 MPa Type A"
  const pattern = /^±\s*([\d.]+)(%?)\s*(.*?)(?:Type\s+([AB]))?\s*$/i;
  const match = trimmed.match(pattern);
  if (match) {
    const val = parseFloat(match[1]);
    const isPct = match[2] === "%";
    const type = (match[4] || "B").toUpperCase();
    const source = match[3]?.trim() || undefined;
    return {
      value: isPct ? `${val}%` : val,
      type,
      distribution: "normal",
      source: source || undefined,
    };
  }

  // Fallback: try numeric only
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return { value: num, type: "B", distribution: "normal" };
  return undefined;
}

function parseEnumOptions(inp) {
  if (inp.options && Array.isArray(inp.options)) {
    return inp.options.map(opt => {
      if (typeof opt === "string") return { value: opt, label: opt };
      return { value: opt.value, label: opt.label };
    });
  }
  if (inp.allowed_values && Array.isArray(inp.allowed_values)) {
    return inp.allowed_values.map(v => ({ value: v, label: v }));
  }
  return undefined;
}

// ── Determine group from input metadata ─────────────────────
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
  }
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

function mapInput(schemaInputs, allValues) {
  return schemaInputs.map(inp => {
    const confidence = parseConfidence(inp.confidence_label || inp.confidence);
    const uncertainty = parseUncertainty(inp.uncertainty);
    const group = guessGroup(inp);
    const enumOpts = parseEnumOptions(inp);

    const mapped = {
      id: inp.id,
      symbol: inp.symbol || inp.id,
      label: ((inp.name && !inp.name.startsWith(inp.id)) ? inp.name : inp.id).replace(/[–—]/g, "-"),
      unit: resolveUnit(inp.unit),
      confidence,
      group,
    };

    // Optional numeric constraints
    if (inp.absolute_min !== undefined && inp.absolute_min !== null) mapped.min = inp.absolute_min;
    if (inp.absolute_max !== undefined && inp.absolute_max !== null) mapped.max = inp.absolute_max;
    if (inp.default !== undefined && inp.default !== null) mapped.default = inp.default;
    if (inp.required === false) mapped.optional = true;
    if (inp.hint) mapped.hint = inp.hint;
    if (uncertainty) mapped.uncertainty = uncertainty;
    if (enumOpts) mapped.enum = enumOpts;

    // Conditional visibility
    if (inp.visibleWhen) {
      mapped.appliesTo = [inp.visibleWhen.equals];
    } else if (inp.conditional_on) {
      mapped.appliesTo = [inp.conditional_on.value];
    }

    return mapped;
  });
}

function mapFormulas(formulas, prefix = "F") {
  if (!formulas || !Array.isArray(formulas)) return [];

  return formulas.map((f, i) => {
    const id = f.id || `${prefix}${i + 1}`;
    const output = f.output || `out_${i + 1}`;
    const expression = f.expression || f.rhs || f.raw || "";
    const unit = resolveUnit(f.unit || f.dimensional_check?.split("=")[0]?.trim(), "dimensionless");
    const reference = f.reference || "";
    const display = f.display || (i < 5 ? { resultRow: true } : undefined);

    const entry = {
      id,
      output,
      expression,
      unit,
      reference,
    };

    if (display) entry.display = display;
    return entry;
  });
}

function mapLegacyFormulas(formulasArray) {
  // Legacy formulas can be array of strings
  if (!formulasArray || !Array.isArray(formulasArray)) return [];
  const rawStr = formulasArray.join("\n");
  if (!rawStr.trim()) return [];

  // Split by newlines, parse each line
  const lines = rawStr.split("\n").filter(l => l.trim());
  return lines.map((line, i) => {
    // Pattern: "output = expression  // [unit] description reference; assumptions; edge_cases"
    const eqMatch = line.match(/^(\w+)\s*=\s*(.+?)(?:\s*\/\/.*)?$/);
    if (eqMatch) {
      const [, output, rest] = eqMatch;
      const expr = rest.trim();
      // Extract unit from comment
      const unitMatch = line.match(/\/\/\s*\[([^\]]+)\]/);
      const unit = unitMatch ? resolveUnit(unitMatch[1]) : UNIT_DIMENSIONLESS;
      const refMatch = line.match(/Reference:\s*([^;]+)/i);
      const reference = refMatch ? refMatch[1].trim() : "";

      return {
        id: `F${i + 1}`,
        output,
        expression: expr,
        unit,
        reference,
        display: i < 8 ? { resultRow: true } : undefined,
      };
    }
    return {
      id: `F${i + 1}`,
      output: `out_${i + 1}`,
      expression: line,
      unit: UNIT_DIMENSIONLESS,
      reference: "",
    };
  });
}

function mapValidation(engineRules, formulas) {
  const rules = [];

  // From engine_rules.validation.rules (array format — PRO_116, PRO_117)
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

  // From engine_rules.validation (object format — old PRO tools)
  if (engineRules?.validation && !Array.isArray(engineRules.validation)) {
    for (const [key, vr] of Object.entries(engineRules.validation)) {
      const cast = vr;
      if (cast.action && cast.condition && cast.error_msg) {
        rules.push({
          id: key,
          action: cast.action,
          condition: cast.condition,
          message: cast.error_msg,
        });
      }
    }
  }

  return rules;
}

function mapWarnings(engineRules) {
  const warnings = [];
  if (engineRules?.smart_warnings) {
    for (const sw of engineRules.smart_warnings) {
      warnings.push({
        id: sw.id || `W${warnings.length + 1}`,
        severity: (sw.severity || sw.action || "INFO") === "CRITICAL" ? "CRITICAL" : (sw.severity || sw.action || "INFO") === "WARNING" ? "WARNING" : "INFO",
        source: sw.source || "",
        condition: sw.condition || sw.trigger || "",
        message: sw.message || "",
      });
    }
  }
  return warnings;
}

function mapDecision(engineRules) {
  const ucThreshold = engineRules?.uc_threshold || { pass_max: 0.9, warn_max: 1.0, fail_min: 1.0 };

  return {
    governingOutput: "UC",
    thresholds: { pass: ucThreshold.pass_max ?? 0.9, fail: ucThreshold.fail_min ?? 1.0 },
    verdictText: {
      pass: "PASS — Capacity Satisfied",
      warn: "PASS — High Utilization: Peer Review Required",
      fail: "FAIL — Insufficient Capacity",
    },
  };
}

function mapGum() {
  return {
    measurand: "UC",
    method: "numeric",
    coverageFactor: 2,
  };
}

function mapFMEA(oldFmea) {
  if (!oldFmea) {
    return {
      mandatoryWhen: "UC > 0.9",
      modes: [],
    };
  }

  const modes = (Array.isArray(oldFmea) ? oldFmea : [])
    .map(item => {
      let whenExpr = undefined;
      if (item.condition) {
        const cond = item.condition.trim();
        if (cond === "ALWAYS") {
          whenExpr = undefined; // always shown
        } else {
          // Extract boolean expression from pattern: "expr ? 'LIKELY' : 'MODERATE'"
          const ternaryMatch = cond.match(/^(.+?)\s*\?\s*'(?:LIKELY|UNLIKELY|MODERATE|HIGH|LOW)'/);
          whenExpr = ternaryMatch ? ternaryMatch[1].trim() : cond;
        }
      }
      return {
        mode: item.failureMode || item.mode || "Unknown failure mode",
        effect: item.effect || item.description || "",
        sev: item.severity === "HIGH" ? 8 : item.severity === "MEDIUM" ? 5 : 3,
        occ: item.occurrence || item.likelihood || 3,
        det: item.detection || 4,
        mitigation: item.control_measure || item.mitigation || "",
        when: whenExpr,
      };
    });

  return {
    mandatoryWhen: "UC > 0.90",
    modes,
    rpnBands: { high: 200, med: 100 },
  };
}

// ── MAIN CONVERTER ─────────────────────────────────────────────
function convertToUniversalSchema(oldTool) {
  const toolId = oldTool.tool_id;
  const toolName = oldTool.tool_name;
  const category = (oldTool.category || "General").split(/\/|·/).map(s => s.trim()).filter(Boolean);
  
  // Sector path from category
  const sectorPath = category.length > 0 ? category : ["General"];
  
  // Standards basis
  const standardsBasis = oldTool.engine_rules?.standards || oldTool.standards || [];

  // Map inputs to new format
  const allInputs = oldTool.inputs || [];
  const mappedInputs = mapInput(allInputs);

  // Build input groups
  const inputGroups = buildInputGroups(mappedInputs);

  // Map formulas — try structured first, then legacy strings
  let formulaDefs;
  if (oldTool.formulas && oldTool.formulas.length > 0) {
    if (typeof oldTool.formulas[0] === "object" && oldTool.formulas[0]?.expression) {
      formulaDefs = mapFormulas(oldTool.formulas);
    } else if (typeof oldTool.formulas[0] === "string") {
      formulaDefs = mapLegacyFormulas(oldTool.formulas);
    } else {
      // Mixed: try to use structured, fallback string
      const first = oldTool.formulas[0];
      if (first && first.output) {
        formulaDefs = mapFormulas(oldTool.formulas);
      } else {
        formulaDefs = mapLegacyFormulas(oldTool.formulas);
      }
    }
  } else {
    formulaDefs = [];
  }

  // Map validation
  const validationRules = mapValidation(oldTool.engine_rules, formulaDefs);

  // Map warnings
  const warnings = mapWarnings(oldTool.engine_rules);

  // Decision
  const decision = mapDecision(oldTool.engine_rules);

  // GUM
  const gum = mapGum();

  // FMEA
  const fmeaConfig = mapFMEA(oldTool.engine_rules?.fmea || oldTool.fmea);

  // Build standard variant(s)
  const standards = [{
    id: toolId,
    code: standardsBasis[0] || toolId,
    name: toolName,
    description: `${toolName} — ${category.join(", ")}`,
    year: "2025",
    formulas: formulaDefs,
    validation: validationRules,
    warnings: warnings,
    decision,
    gum,
    requiredInputs: allInputs.filter(i => i.required !== false).map(i => i.id),
  }];

  // Scope
  const scope = {
    inScope: [`${toolName}`],
    outOfScope: ["Detailed design review", "Site-specific conditions"],
    boundaryWarning: "Engineering decision support only — verify before use.",
  };

  return {
    schemaId: toolId,
    toolCode: `TOOL-${toolId.replace("_", "-")}`,
    version: oldTool.metadata?.version || "1.0.0",
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

// ── RUN MIGRATION ──────────────────────────────────────────────
function main() {
  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all PRO_*.json files from source directory
  const files = fs.readdirSync(PRO_TOOLS_DIR)
    .filter(f => f.startsWith("PRO_") && f.endsWith(".json"))
    .sort();

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(PRO_TOOLS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const oldTool = JSON.parse(raw);

      const schema = convertToUniversalSchema(oldTool);

      // Write the output
      const outputPath = path.join(OUTPUT_DIR, file); // same filename
      fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2), "utf-8");

      console.log(`✓ ${file} → ${outputPath}`);
      successCount++;
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
      errorCount++;
    }
  }

  // Generate _merged.json
  const mergedFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith("PRO_") && f.endsWith(".json"))
    .sort();

  const merged = mergedFiles.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), "utf-8"));
    return {
      schemaId: data.schemaId,
      toolCode: data.toolCode,
      name: data.name,
      sectorPath: data.sectorPath,
      standardsBasis: data.standardsBasis,
      standards: data.standards.map(s => ({ id: s.id, code: s.code, name: s.name, formulasCount: s.formulas.length })),
      inputCount: data.inputs.length,
      version: data.version,
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, "_merged.json"), JSON.stringify(merged, null, 2), "utf-8");
  console.log(`\n📊 _merged.json written (${merged.length} tools)`);
  console.log(`\n✅ Migration complete: ${successCount} succeeded, ${errorCount} failed`);
}

main();
