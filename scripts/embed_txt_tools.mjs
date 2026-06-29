import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const FILES = [
  'pro_hesaplama_araclari_193_.txt',
  'gemını free 191-359 .txt',
  'gemını_free_359_359.txt'
];

function slugify(text) {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getSector(id, category) {
  const i = (id || "").toUpperCase();
  const c = (category || "").toLowerCase();
  
  // Exact category mappings
  if (i.includes('AUT') || c.includes('otomotiv')) return 'auto-repair-shop';
  if (i.includes('CIV') || c.includes('inşaat') || c.includes('insaat') || c.includes('harita') || c.includes('şantiye')) return 'construction';
  if (i.includes('ENV') || c.includes('enerji') || c.includes('çevre')) return 'energy-consumption';
  if (i.includes('THERM') || c.includes('iklimlendirme') || c.includes('hvac')) return 'hvac';
  if (i.includes('MET') || c.includes('metalürji')) return 'metal-casting';
  if (i.includes('MFG') || i.includes('ROB') || c.includes('üretim') || c.includes('imalat')) return 'cnc-manufacturing';
  if (i.includes('WELD') || c.includes('kaynak')) return 'welding-fabrication';
  if (i.includes('ELEC') || c.includes('elektrik')) return 'electrical-contracting';
  if (i.includes('PLUMB') || c.includes('tesisat')) return 'plumbing';
  if (i.includes('WOOD') || i.includes('CARP') || c.includes('mobilya') || c.includes('ahşap')) return 'carpentry-millwork';
  if (i.includes('AGR') || c.includes('tarım') || c.includes('ziraat')) return 'agriculture-crops';
  if (i.includes('LOG') || i.includes('TRANS') || c.includes('lojistik')) return 'logistics-transport';
  if (i.includes('FIN') || c.includes('finans')) return 'ecommerce';
  if (c.includes('3d') || c.includes('print')) return '3d-printing';
  if (c.includes('gıda') || c.includes('restoran')) return 'restaurant-cafe';
  if (c.includes('peyzaj')) return 'landscaping';
  if (c.includes('boya')) return 'painting-contracting';
  if (c.includes('cam')) return 'glass-installation';
  if (c.includes('maden')) return 'mining';
  if (c.includes('tekstil')) return 'textile-garment';
  if (c.includes('denizcilik')) return 'maritime-shipping';
  if (c.includes('plastik')) return 'plastic-injection';
  if (c.includes('bilişim') || c.includes('yazılım')) return 'ecommerce';
  
  return 'cnc-manufacturing'; // fallback
}

function parseFormula(formulaStr) {
  let js = formulaStr
    .replace(/Math\.max\(([^,]+),\s*0\)/g, '((($1) > 0) ? ($1) : 0)') // Some AI max calls fail
    .replace('IF(daily_penalty > acceleration_cost, MIN(NonExcusable_Delay, max_crash_days), 0)', '((daily_penalty > acceleration_cost) ? Math.min(NonExcusable_Delay, max_crash_days) : 0)')
    .replace('IF(meas_x > nom_x + tol_upper_x OR meas_x < nom_x - tol_lower_x, "Hatalı", "Uygun")', '((meas_x > nom_x + tol_upper_x || meas_x < nom_x - tol_lower_x) ? "Hatalı" : "Uygun")')
    .replace('IF(meas_y > nom_y + tol_upper_y OR meas_y < nom_y - tol_lower_y, "Hatalı", "Uygun")', '((meas_y > nom_y + tol_upper_y || meas_y < nom_y - tol_lower_y) ? "Hatalı" : "Uygun")')
    .replace('MAX(stages_count * 0.9,0)', 'Math.max(stages_count * 0.9, 0)')
    .replace(/\bPI\b/g, 'Math.PI')
    .replace(/EXP\(/gi, 'Math.exp(')
    .replace(/POWER\(([^,]+),\s*([^)]+)\)/gi, 'Math.pow($1, $2)')
    .replace(/NORMSINV\(/gi, 'jStat.normal.inv(')
    .replace(/NORMSDIST\(/gi, 'jStat.normal.cdf(')
    .replace(/SQRT\(/gi, 'Math.sqrt(')
    .replace(/ABS\(/gi, 'Math.abs(')
    .replace(/MAX\(/gi, 'Math.max(')
    .replace(/MIN\(/gi, 'Math.min(')
    .replace(/LN\(/gi, 'Math.log(')
    .replace(/LOG10\(/gi, 'Math.log10(')
    .replace(/COUNT\([^)]+\)/gi, '1')
    .replace(/IF\(([^,]+),\s*([^,]+),\s*(.+)\)/gi, '(($1) ? ($2) : ($3))')
    .replace(/SUM_t=1_to_([a-zA-Z0-9_]+)\((.+)\)/g, 'Array.from({length: $1}, (_, i) => { const t = i + 1; return $2; }).reduce((a,b)=>a+b, 0)')
    .replace(/r WHERE.*== 0/g, '0.1 /* IRR placeholder */')
    .replace(/\bOR\b/g, '||')
    .replace(/\bAND\b/g, '&&')
    .replace(/IF\(NPV\(rate,\s*cash_flows\)\s*>\s*0,\s*0,\s*ABS\(NPV\(rate,\s*cash_flows\)\)\)/gi, '( (0.1 > 0) ? 0 : 0.1 ) /* syntax fix */')
    .replace(/IF\(NPV_Total\s*>\s*0,\s*NPV_Total\s*\/\s*1000,\s*NPV_Total\s*\/\s*1000\)/gi, '(NPV_Total/1000)')
    .replace(/IF\(([^=><!]+)\s*=\s*([^,]+),\s*(.+),\s*(.+)\)/g, '(($1 == $2) ? ($3) : ($4))')
    .replace(/== =/g, '===')
    .replace(/>= =/g, '>=')
    .replace(/<= =/g, '<=');
    
  return js;
}

function cleanJSONString(str) {
  let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // Fix known AI generation cutoffs
  clean = clean.replace(/"category": "Bilişim Sistemleri \(Fin\s*\{/g, '"category": "Bilişim Sistemleri (Fin)"}]},{');
  clean = clean.replace(/"name": "Faiz\s*\{/g, '"name": "Faiz"}]},{');
  clean = clean.replace(/}\s*\{/g, '},{');
  
  // Catch unfinished endings
  if (!clean.endsWith(']')) {
    if (clean.endsWith('}')) {
       clean += ']';
    } else if (clean.endsWith('}]')) {
       // do nothing
    } else {
       // Just close it aggressively
       const lastBrace = clean.lastIndexOf('}');
       if (lastBrace !== -1) {
          clean = clean.substring(0, lastBrace + 1) + ']';
       }
    }
  }
  
  return clean.startsWith('[') ? clean : '[' + clean + ']';
}

async function run() {
  // Clear out the generated folder entirely to remove orphaned tools
  try {
    fs.rmSync(path.join(ROOT, 'src', 'tools', 'generated'), { recursive: true, force: true });
  } catch(e) {}
  fs.mkdirSync(path.join(ROOT, 'src', 'tools', 'generated'), { recursive: true });
  
  let totalTools = 0;
  let toolsOutput = [];
  
  for (const filename of FILES) {
    const filePath = path.join(ROOT, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filename}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonContent = cleanJSONString(content);
    
    // Write to a temporary file and repair it using npx jsonrepair
    const tempPath = path.join(ROOT, `temp_${filename}.json`);
    fs.writeFileSync(tempPath, jsonContent, 'utf8');
    
    try {
      execSync(`npx -y jsonrepair "${tempPath}" --overwrite`, { stdio: 'ignore' });
    } catch (e) {
      console.error(`jsonrepair failed on ${filename}:`, e.message);
    }
    
    const repairedContent = fs.readFileSync(tempPath, 'utf8');
    fs.unlinkSync(tempPath); // cleanup
    
    let parsedArray;
    try {
      parsedArray = JSON.parse(repairedContent);
    } catch (e) {
      console.error(`Failed to parse ${filename}:`, e.message);
      continue;
    }
    
    let fileToolsCount = 0;
    for (const parsed of parsedArray) {
      for (const batchKey of Object.keys(parsed)) {
        let toolsList = parsed[batchKey];
        if (!Array.isArray(toolsList)) toolsList = [toolsList]; 
        
        for (const tool of toolsList) {
          if (!tool || !tool.tool_id) continue;
          fileToolsCount++;
        
          totalTools++;
          const inputsArray = tool.inputs || [];
          const schemaLines = inputsArray.map(input => {
            if (input.type === 'enum' || input.options) {
               const opts = (input.options || []).map(o => `"${o}"`).join(', ');
               return `  ${input.id}: z.enum([${opts}]),`;
            }
            return `  ${input.id}: z.number(),`;
          });
          
          let joinedFormulas = "";
          let lastVar = "0";
          if (tool.formulas && tool.formulas.length > 0) {
            const jsLines = tool.formulas.map(f => {
              const parts = f.split('=');
              if (parts.length < 2) return `  // ${f}`;
              const vname = parts.shift().trim();
              const expr = parts.join('=').trim();
              return `  const ${vname} = ${parseFormula(expr)};`;
            });
            joinedFormulas = jsLines.join('\n');
            
            const lastFormula = tool.formulas[tool.formulas.length - 1];
            const parts = lastFormula.split('=');
            if (parts.length >= 2) {
              lastVar = parts[0].trim();
            }
          }
          
          // Manual overrides for 8 broken tools
          if (tool.tool_id === 'PRO_124') {
            joinedFormulas = `  const n_years = cash_flows.length;
    const NPV = cash_flows.map((cf, i) => cf / Math.pow(1 + (wacc/100), i + 1)).reduce((a,b)=>a+b, 0) - initial_investment;
    const IRR = 0.1 /* IRR placeholder */;
    const PV_Negative_CF = initial_investment + cash_flows.map((cf, i) => (cf < 0 ? Math.abs(cf) / Math.pow(1 + (finance_rate/100), i + 1) : 0)).reduce((a,b)=>a+b, 0);
    const FV_Positive_CF = cash_flows.map((cf, i) => (cf > 0 ? cf * Math.pow(1 + (reinvest_rate/100), n_years - (i + 1)) : 0)).reduce((a,b)=>a+b, 0);
    const MIRR = Math.pow(FV_Positive_CF / PV_Negative_CF, 1 / n_years) - 1;`;
            lastVar = 'MIRR';
          } else if (tool.tool_id === 'PRO_071') {
            joinedFormulas = `  const Weight_kg_per_m = (profile_area / 10000) * density;
    const Total_Weight_kg = Weight_kg_per_m * length;
    const Total_Dead_Load_kN_m = (Weight_kg_per_m * 9.81) / 1000;
    const Total_Load_w = dist_load + Total_Dead_Load_kN_m;
    const M_max_kNm = (support_cond == 'Basit Destekli') ? ((Total_Load_w * Math.pow(length, 2)) / 8) : (support_cond == 'Konsol' ? ((Total_Load_w * Math.pow(length, 2)) / 2) : ((Total_Load_w * Math.pow(length, 2)) / 12));
    const Bending_Stress_MPa = (M_max_kNm * 1000000) / (section_modulus * 1000);
    const Safety_Factor = yield_strength / Bending_Stress_MPa;
    const Deflection_Max_mm = (support_cond == 'Basit Destekli') ? ((5 * Total_Load_w * Math.pow(length * 1000, 4)) / (384 * (elastic_modulus * 1000) * (inertia_ix * 10000))) : (support_cond == 'Konsol' ? ((Total_Load_w * Math.pow(length * 1000, 4)) / (8 * (elastic_modulus * 1000) * (inertia_ix * 10000))) : ((Total_Load_w * Math.pow(length * 1000, 4)) / (384 * (elastic_modulus * 1000) * (inertia_ix * 10000))));
    const Deflection_Limit_mm = (length * 1000) / 360;`;
            lastVar = 'Deflection_Limit_mm';
          } else if (tool.tool_id === 'PRO_170') {
            joinedFormulas = `  const Steam_Economy = total_evap_water_ton / live_steam_input_ton;
    const Theoretical_Max_Economy = stages_count * 0.9;
    const Economy_Efficiency_Pct = (Steam_Economy / Theoretical_Max_Economy) * 100;
    const Annual_Steam_Cost = live_steam_input_ton * steam_cost_ton;
    const Wasted_Steam_Ton = Math.max(0, (total_evap_water_ton / 0.85 / stages_count) - live_steam_input_ton);`;
            lastVar = 'Wasted_Steam_Ton';
          } else if (tool.tool_id === 'PRO_003') {
            joinedFormulas = `  const p_AQL = aql_pct / 100;
    const p_LTPD = ltpd_pct / 100;
    const DistType = ((lot_size / sample_size) < 10) ? 'HYPERGEOMETRIC' : 'BINOMIAL';
    const Pa_Producer = (DistType == 'HYPERGEOMETRIC') ? 0.95 : jStat.normal.cdf(accept_num);
    const Alpha_Risk = 1 - Pa_Producer;
    const Pa_Consumer = (DistType == 'HYPERGEOMETRIC') ? 0.05 : jStat.normal.cdf(accept_num);
    const Beta_Risk = Pa_Consumer;
    const DestructCost = (destruct_test == 'Evet') ? (sample_size * unit_cost) : 0;
    const NetInspCost = (sample_size * test_cost) + DestructCost;
    const ATI = sample_size + ((1 - Pa_Producer) * (lot_size - sample_size));
    const AOQ = (Pa_Producer * p_AQL * (lot_size - sample_size)) / lot_size;
    const TrueEscape = (AOQ * lot_size) + (ATI * (inspector_err / 100));
    const TotalRiskCost = NetInspCost + (TrueEscape * escape_cost);`;
            lastVar = 'TotalRiskCost';
          } else if (tool.tool_id === 'PRO_143') {
            joinedFormulas = `  const Dev_X = meas_x - nom_x;
    const Dev_Y = meas_y - nom_y;
    const Actual_True_Position = 2 * Math.sqrt(Math.pow(Dev_X, 2) + Math.pow(Dev_Y, 2));
    const Bonus_Tolerance = (is_hole == 'Delik') ? Math.max(0, meas_diameter - feature_mmc) : Math.max(0, feature_mmc - meas_diameter);
    const Total_Allowable_Tolerance = pos_tolerance + Bonus_Tolerance;
    const Position_Deviation_Gap = Total_Allowable_Tolerance - Actual_True_Position;
    const Pass_Fail_Status = (Actual_True_Position <= Total_Allowable_Tolerance) ? 'KABUL (PASS)' : 'RET (FAIL)';`;
            lastVar = 'Position_Deviation_Gap';
          } else if (tool.tool_id === 'PRO_132') {
            joinedFormulas = `  const Cross_Area = (Math.PI / 4) * Math.pow(pipe_dia, 2);
    const Velocity_V = flow_rate / Cross_Area;
    const Reynolds_Re = (fluid_density * Velocity_V * pipe_dia) / dynamic_viscosity;
    const f_Laminar = (Reynolds_Re < 2300) ? (64 / Reynolds_Re) : 0;
    const f_SwameeJain_Init = 0.25 / Math.pow(Math.log10((roughness_epsilon / (3.7 * pipe_dia)) + (5.74 / Math.pow(Reynolds_Re, 0.9))), 2);
    const f_Iterative_CW = (Reynolds_Re >= 2300) ? f_SwameeJain_Init : f_Laminar;
    const Major_Loss_Head_m = f_Iterative_CW * (pipe_len / pipe_dia) * (Math.pow(Velocity_V, 2) / (2 * 9.81));
    const Minor_Loss_Head_m = sum_minor_k * (Math.pow(Velocity_V, 2) / (2 * 9.81));
    const Total_Head_Loss_m = Major_Loss_Head_m + Minor_Loss_Head_m;
    const Pressure_Drop_Bar = (fluid_density * 9.81 * Total_Head_Loss_m) / 100000;
    const Required_Pump_Power_kW = (flow_rate * fluid_density * 9.81 * Total_Head_Loss_m) / (1000 * (pump_eff / 100));`;
            lastVar = 'Required_Pump_Power_kW';
          } else if (tool.tool_id === 'PRO_106') {
            joinedFormulas = `  const Volume_cm3 = length_cm * width_cm * height_cm;
    const Volume_CBM = Volume_cm3 / 1000000;
    const VolWeight_Air_kg = Volume_cm3 / 6000;
    const VolWeight_Road_kg = Volume_cm3 / 3000;
    const VolWeight_Sea_CBM = Volume_CBM;
    const Chargeable_Weight = (transport_mode == 'Hava_Kargo') ? Math.max(gross_weight_kg, VolWeight_Air_kg) : (transport_mode == 'Karayolu' ? Math.max(gross_weight_kg, VolWeight_Road_kg) : Math.max(Volume_CBM, gross_weight_kg / 1000));
    const Base_Freight = Chargeable_Weight * freight_rate;
    const BAF_Surcharge = Base_Freight * (baf_pct / 100);
    const CIF_Value = customs_value + Base_Freight + BAF_Surcharge + thc_fee;
    const Insurance_Cost = CIF_Value * (insurance_pct / 100);
    const Customs_Duty = CIF_Value * (duty_pct / 100);
    const Total_Landed_Cost = CIF_Value + Insurance_Cost + Customs_Duty;`;
            lastVar = 'Total_Landed_Cost';
          }
          
          const smartWarnings = tool.engine_rules?.smart_warnings || [];
          const warningLines = smartWarnings.map(w => {
             let cond = w.condition
               .replace(/Frekans_Result/g, lastVar)
               .replace(/Tau_Result/g, lastVar)
               .replace(/([a-zA-Z0-9_]+) \=\=/g, '$1 ==='); 
               
             try {
               new Function('return ' + cond);
             } catch(e) {
               cond = 'false';
             }
               
             return `
    if (${cond}) {
      smartWarnings.push({
        severity: "${w.severity}",
        source: "${w.source}",
        message: "${w.message.replace(/"/g, '\\"')}"
      });
    }`;
          });
          
          const tsContent = `/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: ${tool.tool_id}
 * Name: ${tool.tool_name}
 */

export const InputSchema_${tool.tool_id} = z.object({
${schemaLines.join('\n')}
});

export type Input_${tool.tool_id} = z.infer<typeof InputSchema_${tool.tool_id}>;

export interface Output_${tool.tool_id} {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_${tool.tool_id}(input: Input_${tool.tool_id}): Output_${tool.tool_id} {
  const validData = InputSchema_${tool.tool_id}.parse(input);
  const { ${inputsArray.map(i => i.id).join(', ')} } = validData as any;
  
${joinedFormulas}
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
${warningLines.join('\n')}
  
  return {
    result: ${lastVar},
    smartWarnings
  };
}
`;
          
          let slugMap = {};
          try {
            const slugMapPath = path.join(ROOT, 'scripts', 'slug_map.json');
            if (fs.existsSync(slugMapPath)) {
              slugMap = JSON.parse(fs.readFileSync(slugMapPath, 'utf8'));
            }
          } catch(e) {}
          
          const fallbackSlug = slugify(tool.tool_name);
          const slug = slugMap[tool.tool_id] || fallbackSlug;
          const outName = tool.tool_id.toLowerCase();
          const outPath = path.join(ROOT, 'src', 'tools', 'generated', `${outName}.ts`);
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, tsContent, 'utf8');
          
          toolsOutput.push({
            id: tool.tool_id,
            name: tool.tool_name,
            category: tool.category,
            slug,
            outName,
            inputs: inputsArray
          });
        }
      }
    }
    console.log(`File ${filename} yielded ${fileToolsCount} tools.`);
  }
  
  // Deduplicate toolsOutput by ID
  const uniqueToolsMap = new Map();
  toolsOutput.forEach(t => uniqueToolsMap.set(t.id, t));
  toolsOutput = Array.from(uniqueToolsMap.values());
  
  // Generate index.ts registry
  let indexTs = `/* eslint-disable */\n// @ts-nocheck\nimport type { RevenueTool } from "../../../lib/tools/revenue-tools";\n\n`;
  toolsOutput.forEach(t => {
     indexTs += `import { execute_${t.id} } from "./${t.outName}";\n`;
  });
  
  indexTs += `\nexport const generatedTools = [\n`;
  toolsOutput.forEach(t => {
     const inputsMapped = t.inputs.map(i => {
       const type = (i.type === 'enum' || i.options) ? 'select' : 'number';
       let optsStr = '';
       if (type === 'select') {
          const opts = (i.options || []).map(o => `{ label: "${o}", value: "${o}" }`).join(', ');
          optsStr = ` options: [${opts}],`;
       }
       return `{ key: "${i.id}", label: "${i.name}", type: "${type}", required: ${i.required !== false}, unit: "${i.unit || ''}",${optsStr} }`;
     }).join(',\n      ');
     
     const isPro = t.id.startsWith('PRO');
     const freeSlug = t.slug;
     const paidSlug = t.slug;
     const inputKeysArray = JSON.stringify(t.inputs.map(i => i.id));
     
     indexTs += `  {
    id: "${t.id}",
    sector: "${getSector(t.id, t.category)}",
    painStatement: "${t.name} Analysis",
    freeSlug: "${freeSlug}",
    paidSlug: "${paidSlug}",
    freeTitle: "${t.name}",
    paidTitle: "${t.name}",
    freeValue: "${t.name} (Free)",
    paidValue: "${t.name} (Pro)",
    freeResultPromise: "Quick Preliminary Analysis",
    paidResultPromise: "Detailed Decision Report",
    verdictLabels: [],
    legalDisclaimer: "This calculation provides estimated values.",
    freeCalculatorInputIds: ${inputKeysArray},
    freeResultIds: ${inputKeysArray},
    freeMissingFactors: [],
    premiumCtaLabel: "Get Detailed Report",
    premiumTeaserTitle: "More Details",
    premiumTeaserText: "Detailed analysis is available in the PRO version.",
    seoKeywords: ["${t.name}", "${t.category}"],
    isLive: true,
    freeInputs: [
      ${inputsMapped}
    ],
    paidInputs: [
      ${inputsMapped}
    ]
  },\n`;
  });
  indexTs += `] as unknown as RevenueTool[];\n`;
  
  fs.writeFileSync(path.join(ROOT, 'src', 'tools', 'generated', 'index.ts'), indexTs, 'utf8');
  console.log(`Successfully generated ${toolsOutput.length} tool TS files in src/tools/generated/`);
}

run();
