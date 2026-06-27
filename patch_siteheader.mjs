import fs from 'fs';
const file = '/Users/macair1/projects/SectorCalc-p5a/src/components/layout/SiteHeader.tsx';
let content = fs.readFileSync(file, 'utf8');

const tEn = `    grp_production:'Production', grp_engineering:'Engineering', grp_operations:'Operations',
    ind_manufacturing:'Manufacturing', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Quality & SPC',
    ind_mechanical_hvac:'Mechanical & HVAC', ind_electrical_power:'Electrical & Power', ind_construction:'Construction',
    ind_supply_chain:'Supply Chain', ind_energy_esg:'Energy & ESG', ind_technology_cloud:'Technology & AI',
    tools:'Tools',`;

const tTr = `    grp_production:'Üretim', grp_engineering:'Mühendislik', grp_operations:'Operasyon',
    ind_manufacturing:'İmalat', ind_lean_oee:'Yalın & OEE', ind_quality_spc:'Kalite & İKG',
    ind_mechanical_hvac:'Mekanik & İklimlendirme', ind_electrical_power:'Elektrik & Enerji', ind_construction:'İnşaat',
    ind_supply_chain:'Tedarik Zinciri', ind_energy_esg:'Enerji & ÇYS', ind_technology_cloud:'Teknoloji & Yapay Zeka',
    tools:'Araçlar',`;

const tDe = `    grp_production:'Produktion', grp_engineering:'Ingenieurwesen', grp_operations:'Betrieb',
    ind_manufacturing:'Fertigung', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Qualität & SPC',
    ind_mechanical_hvac:'Mechanik & HLK', ind_electrical_power:'Elektrik & Energie', ind_construction:'Bauwesen',
    ind_supply_chain:'Lieferkette', ind_energy_esg:'Energie & ESG', ind_technology_cloud:'Technologie & KI',
    tools:'Tools',`;

const tFr = `    grp_production:'Production', grp_engineering:'Ingénierie', grp_operations:'Opérations',
    ind_manufacturing:'Fabrication', ind_lean_oee:'Lean & TRS', ind_quality_spc:'Qualité & MSP',
    ind_mechanical_hvac:'Mécanique & CVC', ind_electrical_power:'Électricité & Énergie', ind_construction:'Construction',
    ind_supply_chain:'Chaîne logistique', ind_energy_esg:'Énergie & ESG', ind_technology_cloud:'Technologie & IA',
    tools:'outils',`;

const tEs = `    grp_production:'Producción', grp_engineering:'Ingeniería', grp_operations:'Operaciones',
    ind_manufacturing:'Fabricación', ind_lean_oee:'Lean & OEE', ind_quality_spc:'Calidad y CEP',
    ind_mechanical_hvac:'Mecánica y HVAC', ind_electrical_power:'Eléctrica y Energía', ind_construction:'Construcción',
    ind_supply_chain:'Cadena de Suministro', ind_energy_esg:'Energía y ESG', ind_technology_cloud:'Tecnología e IA',
    tools:'herramientas',`;


content = content.replace(/tools:'Tools',/g, tEn);
content = content.replace(/tools:'Araçlar',/g, tTr);
content = content.replace(/tools:'Tools',/g, tDe);
content = content.replace(/tools:'outils',/g, tFr);
content = content.replace(/tools:'herramientas',/g, tEs);

const newGroups = `const INDUSTRY_GROUPS = [
  { groupKey:'grp_production', items:[
    { slug:'manufacturing', icon:'🏭', key:'ind_manufacturing', count:40 },
    { slug:'lean-oee',      icon:'📊', key:'ind_lean_oee',     count:33 },
    { slug:'quality-spc',   icon:'🎯', key:'ind_quality_spc',  count:14 },
  ]},
  { groupKey:'grp_engineering', items:[
    { slug:'mechanical-hvac',  icon:'⚙️', key:'ind_mechanical_hvac', count:48 },
    { slug:'electrical-power', icon:'⚡', key:'ind_electrical_power', count:16 },
    { slug:'construction',     icon:'🏗️', key:'ind_construction',       count:28 },
  ]},
  { groupKey:'grp_operations', items:[
    { slug:'supply-chain',     icon:'🚚', key:'ind_supply_chain',   count:17 },
    { slug:'energy-esg',       icon:'🌱', key:'ind_energy_esg',    count:16 },
    { slug:'technology-cloud', icon:'☁️', key:'ind_technology_cloud', count:17 },
  ]},
];`;

content = content.replace(/const INDUSTRY_GROUPS = \[[\s\S]*?\];/, newGroups);

content = content.replace(/<h4>\{locale==='tr'\?g\.groupTr:g\.groupEn\}<\/h4>/g, "<h4>{t[g.groupKey]}</h4>");
content = content.replace(/<b>\{it\.en\}<\/b>/g, "<b>{t[it.key]}</b>");

fs.writeFileSync(file, content);
console.log('patched');
