/**
 * ISO 513 material database - reference-grade mid-band constants.
 * Calibrate against tooling-supplier datasheets for contract work.
 */
export interface MaterialRecord {
  id: string;
  isoGroup: string;
  name: string;
  /** Specific cutting force at 1 mm undeformed chip (N/mm²). */
  kc1: string;
  /** Kienzle exponent (dimensionless). */
  mc: string;
  /** Taylor C (Vc for T=1 min), m/min. */
  taylorC: string;
  /** Taylor n exponent. */
  taylorN: string;
  /** Reference cutting speed mid-band, m/min. */
  refVc: string;
  /** Young's modulus for deflection, MPa (= N/mm²). */
  E: string;
  /** Typical nose-radius hint, mm. */
  refNoseRadius: string;
  notes: string;
}

export const MATERIALS: Record<string, MaterialRecord> = {
  P1: {
    id: 'P1', isoGroup: 'P', name: 'Low-carbon steel (C < 0.25%)',
    kc1: '1800', mc: '0.25', taylorC: '280', taylorN: '0.25',
    refVc: '180', E: '210000', refNoseRadius: '0.8',
    notes: 'ISO 513 P - free-cutting / mild steel mid-band.'
  },
  P2: {
    id: 'P2', isoGroup: 'P', name: 'Medium-carbon steel (C 0.25-0.55%)',
    kc1: '2100', mc: '0.25', taylorC: '240', taylorN: '0.25',
    refVc: '150', E: '210000', refNoseRadius: '0.8',
    notes: 'ISO 513 P - structural / quenched-tempered mid-band.'
  },
  P3: {
    id: 'P3', isoGroup: 'P', name: 'Alloy steel (Cr-Mo / Ni-Cr)',
    kc1: '2500', mc: '0.26', taylorC: '200', taylorN: '0.25',
    refVc: '120', E: '210000', refNoseRadius: '0.8',
    notes: 'ISO 513 P - alloyed construction steels.'
  },
  M1: {
    id: 'M1', isoGroup: 'M', name: 'Austenitic stainless (304 / 316)',
    kc1: '2400', mc: '0.21', taylorC: '160', taylorN: '0.28',
    refVc: '100', E: '193000', refNoseRadius: '0.8',
    notes: 'ISO 513 M - work-hardening stainless.'
  },
  M2: {
    id: 'M2', isoGroup: 'M', name: 'Martensitic stainless (410 / 420)',
    kc1: '2300', mc: '0.22', taylorC: '150', taylorN: '0.27',
    refVc: '90', E: '200000', refNoseRadius: '0.8',
    notes: 'ISO 513 M - hardenable stainless.'
  },
  K1: {
    id: 'K1', isoGroup: 'K', name: 'Gray cast iron (GG / GJL)',
    kc1: '1300', mc: '0.28', taylorC: '220', taylorN: '0.25',
    refVc: '140', E: '110000', refNoseRadius: '0.8',
    notes: 'ISO 513 K - flake graphite iron.'
  },
  K2: {
    id: 'K2', isoGroup: 'K', name: 'Ductile cast iron (GGG / GJS)',
    kc1: '1600', mc: '0.26', taylorC: '180', taylorN: '0.25',
    refVc: '110', E: '160000', refNoseRadius: '0.8',
    notes: 'ISO 513 K - nodular / ductile iron.'
  },
  N1: {
    id: 'N1', isoGroup: 'N', name: 'Aluminum wrought (6xxx)',
    kc1: '700', mc: '0.25', taylorC: '900', taylorN: '0.30',
    refVc: '600', E: '70000', refNoseRadius: '0.4',
    notes: 'ISO 513 N - wrought aluminum mid-band.'
  },
  N2: {
    id: 'N2', isoGroup: 'N', name: 'Aluminum cast (Al-Si)',
    kc1: '800', mc: '0.25', taylorC: '700', taylorN: '0.30',
    refVc: '450', E: '72000', refNoseRadius: '0.4',
    notes: 'ISO 513 N - cast aluminum mid-band.'
  },
  N3: {
    id: 'N3', isoGroup: 'N', name: 'Copper / brass',
    kc1: '900', mc: '0.25', taylorC: '350', taylorN: '0.28',
    refVc: '220', E: '110000', refNoseRadius: '0.4',
    notes: 'ISO 513 N - copper alloys mid-band.'
  },
  S1: {
    id: 'S1', isoGroup: 'S', name: 'Titanium (Ti-6Al-4V)',
    kc1: '1800', mc: '0.23', taylorC: '80', taylorN: '0.22',
    refVc: '50', E: '114000', refNoseRadius: '0.8',
    notes: 'ISO 513 S - alpha-beta titanium.'
  },
  S2: {
    id: 'S2', isoGroup: 'S', name: 'Nickel superalloy (Inconel 718)',
    kc1: '2900', mc: '0.22', taylorC: '55', taylorN: '0.20',
    refVc: '35', E: '200000', refNoseRadius: '0.8',
    notes: 'ISO 513 S - Ni-base heat-resistant alloys.'
  },
  H1: {
    id: 'H1', isoGroup: 'H', name: 'Hardened steel 45-50 HRC',
    kc1: '3200', mc: '0.25', taylorC: '90', taylorN: '0.22',
    refVc: '60', E: '210000', refNoseRadius: '0.4',
    notes: 'ISO 513 H - hardened tool / die steels mid-band.'
  },
  H2: {
    id: 'H2', isoGroup: 'H', name: 'Hardened steel 50-60 HRC',
    kc1: '3800', mc: '0.25', taylorC: '60', taylorN: '0.20',
    refVc: '40', E: '210000', refNoseRadius: '0.4',
    notes: 'ISO 513 H - hard machining mid-band.'
  }
};

export const MATERIAL_IDS = Object.keys(MATERIALS);

/** Coolant correction on Taylor life (multiply T). */
export const COOLANT_FACTORS: Record<string, string> = {
  dry: '0.85',
  flood: '1.00',
  mist: '0.95',
  mql: '1.05',
  high_pressure: '1.15'
};

/** Interruption correction on Taylor life (multiply T). */
export const INTERRUPTION_FACTORS: Record<string, string> = {
  continuous: '1.00',
  light: '0.90',
  medium: '0.75',
  heavy: '0.55'
};
