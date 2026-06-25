import fs from 'fs';

const p = 'src/components/layout/SiteHeader.tsx';
let content = fs.readFileSync(p, 'utf8');

const newIndustryGroups = `const INDUSTRY_GROUPS = [
  { groupKey:'grp_production', items:[
    { slug:'cnc-manufacturing', icon:'🏭', key:'ind_manufacturing', count:40 },
    { slug:'welding-fabrication', icon:'⚡', key:'ind_lean_oee', count:33 },
    { slug:'printing-signage', icon:'🖨️', key:'ind_quality_spc', count:14 },
  ]},
  { groupKey:'grp_engineering', items:[
    { slug:'hvac', icon:'❄️', key:'ind_mechanical_hvac', count:48 },
    { slug:'electrical-contracting', icon:'🔌', key:'ind_electrical_power', count:16 },
    { slug:'construction', icon:'🏗️', key:'ind_construction', count:28 },
  ]},
  { groupKey:'grp_operations', items:[
    { slug:'logistics-transport', icon:'🚚', key:'ind_supply_chain', count:17 },
    { slug:'energy-carbon', icon:'🌱', key:'ind_energy_esg', count:16 },
    { slug:'energy-consumption', icon:'⚡', key:'ind_technology_cloud', count:17 },
  ]},
];`;

content = content.replace(
  /const INDUSTRY_GROUPS = \[\s*\{\s*groupKey:'grp_production'[\s\S]*?\];/m,
  newIndustryGroups
);

fs.writeFileSync(p, content, 'utf8');
console.log('Fixed SiteHeader.tsx');
