/**
 * SectorCalc - Sektör, Meslek Dalı ve Kategori Taksonomisi
 * Tüm hesaplama araçlarının sınıflandırılması için ana referans.
 */

export interface Sector {
  id: string;
  label: string;
  labelEn: string;
  professions: string[];
  keywords: string[];
  icon?: string;
}

export interface Category {
  id: string;
  label: string;
  labelEn: string;
  keywords: string[];
}

// ============================================================
// 1. SEKTÖRLER (25+)
// ============================================================

export const SECTORS: Sector[] = [
  {
    id: 'otomotiv',
    label: 'Otomotiv & Taşıt',
    labelEn: 'Automotive & Vehicle',
    professions: [
      'Üretim Mühendisi',
      'Kalite Mühendisi',
      'Tedarik Zinciri Uzmanı',
      'Ar-Ge Mühendisi',
      'Bakım Teknisyeni',
      'Proses Mühendisi',
    ],
    keywords: ['oto', 'car', 'vehicle', 'motor', 'tire', 'brake', 'engine', 'automotive', 'truck', 'bus', 'trailer'],
  },
  {
    id: 'havacilik',
    label: 'Havacılık & Savunma',
    labelEn: 'Aerospace & Defense',
    professions: [
      'Tasarım Mühendisi',
      'Bakım Uzmanı',
      'Kalite Mühendisi',
      'Sistem Mühendisi',
      'Ar-Ge Uzmanı',
    ],
    keywords: ['aircraft', 'plane', 'jet', 'turbine', 'wing', 'defense', 'missile', 'radar', 'satellite', 'aviation'],
  },
  {
    id: 'makine',
    label: 'Makine & Ekipman',
    labelEn: 'Machinery & Equipment',
    professions: [
      'CNC Operatörü',
      'Tasarım Mühendisi',
      'Proses Mühendisi',
      'Bakım Uzmanı',
      'Teknik Ressam',
      'Montaj Teknisyeni',
    ],
    keywords: ['cnc', 'machining', 'cutting', 'tool', 'lathe', 'mill', 'drill', 'grinder', 'machine', 'equipment'],
  },
  {
    id: 'metal',
    label: 'Metal & Sac İşleme',
    labelEn: 'Metal & Sheet Processing',
    professions: [
      'Sac Teknisyeni',
      'Kaynak Uzmanı',
      'Metalurji Mühendisi',
      'Kalıp Uzmanı',
      'Yüzey İşlem Uzmanı',
    ],
    keywords: ['metal', 'sheet', 'steel', 'aluminum', 'welding', 'solder', 'casting', 'forging', 'stamping'],
  },
  {
    id: 'plastik',
    label: 'Plastik & Enjeksiyon',
    labelEn: 'Plastic & Injection',
    professions: [
      'Proses Mühendisi',
      'Kalıp Uzmanı',
      'Üretim Mühendisi',
      'Malzeme Uzmanı',
      'Kalite Mühendisi',
    ],
    keywords: ['plastic', 'injection', 'mold', 'polymer', 'extrusion', 'blow', 'thermoform', 'resin'],
  },
  {
    id: 'gida',
    label: 'Gıda & İçecek',
    labelEn: 'Food & Beverage',
    professions: [
      'Üretim Mühendisi',
      'Kalite Uzmanı',
      'Gıda Mühendisi',
      'Ar-Ge Uzmanı',
      'Tedarik Uzmanı',
    ],
    keywords: ['food', 'beverage', 'drink', 'bakery', 'dairy', 'meat', 'fruit', 'vegetable', 'process', 'packaging'],
  },
  {
    id: 'kimya',
    label: 'Kimya & İlaç',
    labelEn: 'Chemistry & Pharmaceuticals',
    professions: [
      'Proses Mühendisi',
      'Ar-Ge Uzmanı',
      'Kalite Uzmanı',
      'Kimyager',
      'Farmasötik Uzmanı',
    ],
    keywords: ['chemical', 'pharma', 'drug', 'medicine', 'reaction', 'synthesis', 'polymer', 'catalyst'],
  },
  {
    id: 'enerji',
    label: 'Enerji & Elektrik',
    labelEn: 'Energy & Electricity',
    professions: [
      'Enerji Mühendisi',
      'Elektrik Mühendisi',
      'Şebeke Uzmanı',
      'Yenilenebilir Enerji Uzmanı',
      'Enerji Yöneticisi',
    ],
    keywords: ['energy', 'electric', 'power', 'kwh', 'solar', 'wind', 'grid', 'transformer', 'motor', 'generator'],
  },
  {
    id: 'insaat',
    label: 'İnşaat & Yapı',
    labelEn: 'Construction & Building',
    professions: [
      'İnşaat Mühendisi',
      'Proje Müdürü',
      'Saha Şefi',
      'Kalite Uzmanı',
      'Mimari Teknisyen',
    ],
    keywords: ['construction', 'building', 'concrete', 'steel', 'beam', 'foundation', 'roof', 'floor', 'site'],
  },
  {
    id: 'lojistik',
    label: 'Lojistik & Depolama',
    labelEn: 'Logistics & Warehousing',
    professions: [
      'Lojistik Uzmanı',
      'Depo Yöneticisi',
      'Tedarik Zinciri Müdürü',
      'Rota Planlayıcısı',
      'İthalat/İhracat Uzmanı',
    ],
    keywords: ['logistics', 'warehouse', 'storage', 'inventory', 'transport', 'shipping', 'delivery', 'route', 'fleet'],
  },
  {
    id: 'perakende',
    label: 'Perakende & Tüketici',
    labelEn: 'Retail & Consumer',
    professions: [
      'Satış Müdürü',
      'Finans Uzmanı',
      'Mağaza Yöneticisi',
      'Kategori Yöneticisi',
      'Müşteri Deneyimi Uzmanı',
    ],
    keywords: ['retail', 'consumer', 'store', 'shop', 'ecommerce', 'customer', 'sales', 'price', 'margin'],
  },
  {
    id: 'tekstil',
    label: 'Tekstil & Konfeksiyon',
    labelEn: 'Textile & Apparel',
    professions: [
      'Üretim Mühendisi',
      'Kalite Uzmanı',
      'Tekstil Mühendisi',
      'Moda Tasarımcısı',
      'Konfeksiyon Uzmanı',
    ],
    keywords: ['textile', 'apparel', 'fabric', 'cloth', 'sewing', 'knitting', 'weaving', 'dye', 'garment'],
  },
  {
    id: 'bilisim',
    label: 'Bilişim & Yazılım',
    labelEn: 'IT & Software',
    professions: [
      'Sistem Mühendisi',
      'Veri Uzmanı',
      'Yazılım Geliştirici',
      'Cloud Uzmanı',
      'Siber Güvenlik Uzmanı',
    ],
    keywords: ['software', 'code', 'cloud', 'database', 'data', 'api', 'cloud', 'security', 'algorithm'],
  },
  {
    id: 'finans',
    label: 'Finans & Sigorta',
    labelEn: 'Finance & Insurance',
    professions: [
      'Finans Müdürü',
      'Muhasebeci',
      'Aktüer',
      'Risk Uzmanı',
      'Yatırım Uzmanı',
    ],
    keywords: ['finance', 'bank', 'insurance', 'actuary', 'risk', 'investment', 'loan', 'credit', 'tax'],
  },
  {
    id: 'saglik',
    label: 'Sağlık & Medikal',
    labelEn: 'Health & Medical',
    professions: [
      'Biyomedikal Mühendisi',
      'Laborant',
      'Klinik Uzman',
      'Tıbbi Cihaz Uzmanı',
      'Hastane Yöneticisi',
    ],
    keywords: ['medical', 'health', 'hospital', 'biomedical', 'device', 'lab', 'diagnostic', 'clinical'],
  },
  {
    id: 'tarim',
    label: 'Tarım & Gıda Üretimi',
    labelEn: 'Agriculture & Food Production',
    professions: [
      'Ziraat Mühendisi',
      'Gıda Uzmanı',
      'Tarım Teknisyeni',
      'Sulama Uzmanı',
      'Bitki Koruma Uzmanı',
    ],
    keywords: ['agriculture', 'farming', 'crop', 'harvest', 'irrigation', 'fertilizer', 'soil', 'plant'],
  },
  {
    id: 'savunma',
    label: 'Savunma & Güvenlik',
    labelEn: 'Defense & Security',
    professions: [
      'Sistem Mühendisi',
      'Güvenlik Uzmanı',
      'Elektronik Uzmanı',
      'Saha Teknisyeni',
      'Kalite Mühendisi',
    ],
    keywords: ['defense', 'security', 'surveillance', 'radar', 'missile', 'armor', 'tactical'],
  },
  {
    id: 'denizcilik',
    label: 'Denizcilik & Gemi',
    labelEn: 'Maritime & Shipbuilding',
    professions: [
      'Gemi Mühendisi',
      'Lojistik Uzmanı',
      'Deniz Ulaştırma Uzmanı',
      'Tersane Teknisyeni',
      'Deniz Emniyet Uzmanı',
    ],
    keywords: ['ship', 'vessel', 'marine', 'port', 'cargo', 'container', 'maritime', 'naval'],
  },
  {
    id: 'madencilik',
    label: 'Madencilik & Doğal Kaynaklar',
    labelEn: 'Mining & Natural Resources',
    professions: [
      'Maden Mühendisi',
      'Jeolog',
      'Saha Uzmanı',
      'Çevre Uzmanı',
      'İş Sağlığı Uzmanı',
    ],
    keywords: ['mine', 'mining', 'ore', 'coal', 'gold', 'silver', 'drill', 'excavation', 'geology'],
  },
  {
    id: 'telekom',
    label: 'Telekomünikasyon',
    labelEn: 'Telecommunications',
    professions: [
      'Ağ Mühendisi',
      'RF Uzmanı',
      'Sistem Mühendisi',
      'Saha Teknisyeni',
      'Veri Uzmanı',
    ],
    keywords: ['telecom', 'network', 'radio', 'frequency', 'fiber', 'cable', '5g', 'wireless', 'router'],
  },
  {
    id: 'yenilenebilir',
    label: 'Yenilenebilir Enerji',
    labelEn: 'Renewable Energy',
    professions: [
      'Enerji Mühendisi',
      'Sürdürülebilirlik Uzmanı',
      'Güneş Enerjisi Uzmanı',
      'Rüzgar Enerjisi Uzmanı',
      'Enerji Yöneticisi',
    ],
    keywords: ['solar', 'wind', 'renewable', 'green', 'sustainable', 'photovoltaic', 'turbine'],
  },
  {
    id: 'otomotiv-tedarik',
    label: 'Otomotiv Tedarik',
    labelEn: 'Automotive Supply Chain',
    professions: [
      'Tedarik Zinciri Yöneticisi',
      'Satınalma Uzmanı',
      'Lojistik Uzmanı',
      'Kalite Mühendisi',
    ],
    keywords: ['supply', 'chain', 'procurement', 'sourcing', 'logistics', 'delivery', 'warehouse'],
  },
  {
    id: 'danismanlik',
    label: 'Danışmanlık',
    labelEn: 'Consulting',
    professions: [
      'Strateji Uzmanı',
      'Finans Danışmanı',
      'Operasyon Danışmanı',
      'Dijital Dönüşüm Uzmanı',
    ],
    keywords: ['consulting', 'strategy', 'advisory', 'analytics', 'transformation', 'change'],
  },
  {
    id: 'kargo',
    label: 'Kargo & Taşımacılık',
    labelEn: 'Cargo & Transportation',
    professions: [
      'Lojistik Uzmanı',
      'Rota Planlayıcısı',
      'Filo Yöneticisi',
      'Güvenlik Uzmanı',
    ],
    keywords: ['cargo', 'transport', 'truck', 'delivery', 'freight', 'courier', 'vehicle'],
  },
  {
    id: 'temizlik',
    label: 'Temizlik & Hijyen',
    labelEn: 'Cleaning & Hygiene',
    professions: [
      'Hijyen Uzmanı',
      'Tesis Yöneticisi',
      'Kalite Uzmanı',
      'Saha Sorumlusu',
    ],
    keywords: ['cleaning', 'hygiene', 'sanitize', 'janitor', 'facility', 'maintenance'],
  },
];

// ============================================================
// 2. KATEGORİLER (Hesaplama Türü)
// ============================================================

export const CATEGORIES: Category[] = [
  {
    id: 'cost',
    label: 'Maliyet & Bütçeleme',
    labelEn: 'Cost & Budgeting',
    keywords: ['cost', 'budget', 'price', 'expense', 'profit', 'margin', 'markup', 'break even', 'bom', 'quote'],
  },
  {
    id: 'efficiency',
    label: 'Verimlilik & OEE',
    labelEn: 'Efficiency & OEE',
    keywords: ['oee', 'smed', '5s', 'productivity', 'efficiency', 'utilization', 'downtime', 'cycle time', 'takt'],
  },
  {
    id: 'quality',
    label: 'Kalite & Süreç Kontrol',
    labelEn: 'Quality & Process Control',
    keywords: ['quality', 'spc', 'six sigma', 'cpk', 'ppm', 'control', 'gauge', 'rr', 'measurement', 'audit'],
  },
  {
    id: 'energy',
    label: 'Enerji & Karbon',
    labelEn: 'Energy & Carbon',
    keywords: ['energy', 'power', 'kwh', 'carbon', 'emission', 'fuel', 'electricity', 'gas', 'heat', 'solar', 'wind'],
  },
  {
    id: 'logistics',
    label: 'Lojistik & Rota',
    labelEn: 'Logistics & Route',
    keywords: ['logistics', 'warehouse', 'route', 'delivery', 'transport', 'inventory', 'eoq', 'shipment', 'cargo'],
  },
  {
    id: 'finance',
    label: 'Finans & Yatırım',
    labelEn: 'Finance & Investment',
    keywords: ['npv', 'irr', 'payback', 'investment', 'loan', 'credit', 'tax', 'depreciation', 'amortization', 'roi'],
  },
  {
    id: 'hr',
    label: 'İK & Personel',
    labelEn: 'HR & Personnel',
    keywords: ['employee', 'salary', 'payroll', 'overtime', 'benefit', 'labor', 'workforce', 'turnover', 'competence'],
  },
  {
    id: 'engineering',
    label: 'Teknik & Mühendislik',
    labelEn: 'Technical & Engineering',
    keywords: ['torque', 'stress', 'strain', 'flow', 'heat', 'thermo', 'hydraulic', 'pneumatic', 'mechanical', 'electrical'],
  },
  {
    id: 'safety',
    label: 'İSG & Risk',
    labelEn: 'Safety & Risk',
    keywords: ['risk', 'safety', 'hazard', 'ergonomics', 'noise', 'ppe', 'accident', 'security', 'compliance'],
  },
  {
    id: 'sustainability',
    label: 'Sürdürülebilirlik',
    labelEn: 'Sustainability',
    keywords: ['sustainability', 'recycle', 'waste', 'water', 'green', 'circular', 'reuse', 'emission'],
  },
  {
    id: 'conversion',
    label: 'Dönüşüm & Ölçüm',
    labelEn: 'Conversion & Measurement',
    keywords: ['conversion', 'measure', 'unit', 'scale', 'metric', 'imperial', 'size', 'weight', 'volume', 'speed'],
  },
];

// ============================================================
// 3. YARDIMCI FONKSİYONLAR
// ============================================================

export function getSectorById(id: string): Sector | undefined {
  return SECTORS.find(s => s.id === id);
}

export function getSectorByKeyword(keyword: string): Sector | undefined {
  const lower = keyword.toLowerCase();
  return SECTORS.find(s => s.keywords.some(k => lower.includes(k)));
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getCategoryByKeyword(keyword: string): Category | undefined {
  const lower = keyword.toLowerCase();
  return CATEGORIES.find(c => c.keywords.some(k => lower.includes(k)));
}

export function getAllSectorLabels(): string[] {
  return SECTORS.map(s => s.label);
}

export function getAllCategoryLabels(): string[] {
  return CATEGORIES.map(c => c.label);
}
