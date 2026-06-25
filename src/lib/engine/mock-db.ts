export const RULE_ENGINE_DB = {
  material_standards: {
    ISO_material_codes: ['S235', 'S355', 'AISI 304', 'AISI 316Ti', 'Inconel 718', 'Alu 6061', 'Alu 7075'],
    hardness_map: {
      'S235': { HB: 120, HRC: 0 },
      'S355': { HB: 160, HRC: 5 },
      'AISI 304': { HB: 200, HRC: 15 },
      'AISI 316Ti': { HB: 220, HRC: 20 },
      'Inconel 718': { HB: 360, HRC: 40 },
      'Alu 6061': { HB: 95, HRC: 0 },
      'Alu 7075': { HB: 150, HRC: 0 }
    }
  },
  cutting_parameters: {
    sandvik_recommendations: {
      'AISI 304': { vc_min: 140, vc_max: 180, f_min: 0.10, f_max: 0.25 },
      'S355': { vc_min: 220, vc_max: 280, f_min: 0.15, f_max: 0.35 },
      'Inconel 718': { vc_min: 30, vc_max: 50, f_min: 0.05, f_max: 0.15 },
      'Alu 6061': { vc_min: 400, vc_max: 800, f_min: 0.20, f_max: 0.50 }
    }
  },
  iso_vdi_reference: {
    VDI_2067_hourly_rates: {
      'CNC Lathe': 45,
      '5-Axis Mill': 85,
      'Press Brake': 55
    },
    ISO_3685_tool_life: {
      'default_taylor_n': 0.25,
      'default_taylor_c': 350
    }
  },
  assumptions: [
    { id: 'workpiece_rigidity', name: 'Workpiece rigidity', value: 'Rigid', source: 'Kullanıcı Varsayımı' },
    { id: 'tool_wear', name: 'Tool wear criterion', value: 'VB = 0.3mm', source: 'ISO 3685' },
    { id: 'taylor_exp', name: 'Taylor exponent (n)', value: '0.25', source: 'Handbook' },
    { id: 'specific_cut_force', name: 'Specific cutting force', value: '2,100 N/mm²', source: 'Machinery\'s' },
    { id: 'machine_eff', name: 'Machine efficiency', value: '0.85', source: 'VDI 2067' }
  ]
};
