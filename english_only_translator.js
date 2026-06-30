const fs = require('fs');

const profTranslations = {
  "Seramik Mühendisi": "Ceramic Engineer",
  "Cam Ustası": "Glass Master",
  "Kalite Uzmanı": "Quality Specialist",
  "Fırın Operatörü": "Furnace Operator",
  "Tasarımcı": "Designer",
  "Savunma Mühendisi": "Defense Engineer",
  "Sistem Mühendisi": "Systems Engineer",
  "Proje Yöneticisi": "Project Manager",
  "Test Mühendisi": "Test Engineer",
  "Lojistik Uzmanı": "Logistics Specialist",
  "Veteriner Hekim": "Veterinarian",
  "Hayvan Sağlığı Uzmanı": "Animal Health Specialist",
  "Laborant": "Lab Technician",
  "Çiftlik Danışmanı": "Farm Consultant",
  "Gıda Güvenliği Uzmanı": "Food Safety Specialist",
  "Üretim Mühendisi": "Production Engineer",
  "Kalite Mühendisi": "Quality Engineer",
  "Tedarik Zinciri Uzmanı": "Supply Chain Specialist",
  "Ar-Ge Mühendisi": "R&D Engineer",
  "Bakım Teknisyeni": "Maintenance Technician",
  "Tasarım Mühendisi": "Design Engineer",
  "Bakım Uzmanı": "Maintenance Specialist",
  "Ar-Ge Uzmanı": "R&D Specialist",
  "CNC Operatörü": "CNC Operator",
  "Proses Mühendisi": "Process Engineer",
  "Teknik Ressam": "Draftsman",
  "Sac Teknisyeni": "Sheet Metal Technician",
  "Kaynak Uzmanı": "Welding Specialist",
  "Metalurji Mühendisi": "Metallurgical Engineer",
  "Kalıp Uzmanı": "Mold Specialist",
  "Yüzey İşlem Uzmanı": "Surface Treatment Specialist",
  "Malzeme Uzmanı": "Materials Specialist",
  "Gıda Mühendisi": "Food Engineer",
  "Diyetisyen": "Dietitian",
  "Kimyager": "Chemist",
  "Enerji Mühendisi": "Energy Engineer",
  "Elektrik Mühendisi": "Electrical Engineer",
  "Şebeke Uzmanı": "Grid Specialist",
  "Enerji Yöneticisi": "Energy Manager",
  "İnşaat Mühendisi": "Civil Engineer",
  "Proje Müdürü": "Project Manager",
  "Saha Şefi": "Site Chief",
  "Mimari Teknisyen": "Architectural Technician",
  "Depo Yöneticisi": "Warehouse Manager",
  "Tedarik Zinciri Müdürü": "Supply Chain Manager",
  "Planlama Uzmanı": "Planning Specialist",
  "İthalat/İhracat Uzmanı": "Import/Export Specialist",
  "Satış Müdürü": "Sales Manager",
  "Kategori Yöneticisi": "Category Manager",
  "Mağaza Yöneticisi": "Store Manager",
  "Finans Uzmanı": "Finance Specialist",
  "Müşteri Deneyimi Uzmanı": "Customer Experience Specialist",
  "Tekstil Mühendisi": "Textile Engineer",
  "Moda Tasarımcısı": "Fashion Designer",
  "Konfeksiyon Uzmanı": "Apparel Specialist",
  "Yazılım Geliştirici": "Software Developer",
  "Veri Uzmanı": "Data Specialist",
  "Cloud Uzmanı": "Cloud Specialist",
  "Siber Güvenlik Uzmanı": "Cybersecurity Specialist",
  "Finans Müdürü": "Finance Manager",
  "Muhasebeci": "Accountant",
  "Risk Uzmanı": "Risk Specialist",
  "Yatırım Uzmanı": "Investment Specialist",
  "Aktüer": "Actuary",
  "Biyomedikal Mühendisi": "Biomedical Engineer",
  "Hemşire": "Nurse",
  "Klinik Uzman": "Clinical Specialist",
  "Tıbbi Cihaz Uzmanı": "Medical Device Specialist",
  "Ziraat Mühendisi": "Agricultural Engineer",
  "Gıda Uzmanı": "Food Specialist",
  "Tarım Teknisyeni": "Agriculture Technician",
  "Sulama Uzmanı": "Irrigation Specialist",
  "Bitki Koruma Uzmanı": "Plant Protection Specialist",
  "Gemi Mühendisi": "Marine Engineer",
  "Deniz Ulaştırma Uzmanı": "Maritime Transport Specialist",
  "Tersane Teknisyeni": "Shipyard Technician",
  "Deniz Emniyet Uzmanı": "Maritime Safety Specialist",
  "Maden Mühendisi": "Mining Engineer",
  "Jeolog": "Geologist",
  "Saha Uzmanı": "Field Specialist",
  "Çevre Uzmanı": "Environmental Specialist",
  "İş Sağlığı Uzmanı": "Occupational Health Specialist"
};

const categoryTranslations = {
  "Otomotiv & Taşıt": "Automotive & Vehicles",
  "Havacılık & Uzay": "Aerospace",
  "Makine & Üretim": "Machinery & Manufacturing",
  "Metalurji & Malzeme": "Metallurgy & Materials",
  "Plastik & Polimer": "Plastics & Polymers",
  "Gıda & Beslenme": "Food & Nutrition",
  "Kimya & Proses": "Chemical & Process",
  "Enerji & Elektrik": "Energy & Electrical",
  "İnşaat & Yapı": "Construction & Building",
  "Lojistik & Tedarik": "Logistics & Supply Chain",
  "Perakende & Satış": "Retail & Sales",
  "Tekstil & Konfeksiyon": "Textile & Apparel",
  "Bilişim & Yazılım": "IT & Software",
  "Finans & Sigorta": "Finance & Insurance",
  "Sağlık & Tıp": "Healthcare & Medical",
  "Tarım & Hayvancılık": "Agriculture & Livestock",
  "Denizcilik & Gemi": "Maritime & Shipping",
  "Maden & Sondaj": "Mining & Drilling",
  "İklimlendirme & HVAC": "HVAC & Refrigeration",
  "Orman & Ahşap": "Forestry & Wood",
  "Seramik & Cam": "Ceramics & Glass",
  "Savunma Sanayi": "Defense Industry",
  "Veteriner & Hayvan Sağlığı": "Veterinary & Animal Health",
  "Diğer": "Other",
  "Makine & Tasarım": "Machinery & Design",
  "İmalat & Üretim": "Manufacturing & Production",
  "Akışkanlar & Termodinamik": "Fluids & Thermodynamics",
  "Yalın Üretim": "Lean Manufacturing",
  "Bakım & Güvenilirlik": "Maintenance & Reliability",
  "İK & Personel": "HR & Personnel",
  "Proje & Yatırım": "Project & Investment",
  "İSG & Risk Yönetimi": "OHS & Risk Management",
  "Gıda & Tarım": "Food & Agriculture",
  "Ölçüm & Dönüşüm": "Measurement & Conversion",
  "İnşaat & Saha": "Construction & Field",
  "Perakende & Gıda": "Retail & Food",
  "Finans & İK": "Finance & HR",
  "Üretim & İmalat": "Manufacturing & Production",
  "İSG & Risk": "OHS & Risk",
  "Kalite, SPC & Altı Sigma": "Quality, SPC & Six Sigma",
  "İşletme": "Business",
  "Makine Mühendisliği": "Mechanical Engineering",
  "Sağlık ve Fitness": "Health & Fitness",
  "İnşaat ve Yapı": "Construction & Building",
  "İleri Fizik ve Kuantum": "Advanced Physics & Quantum",
  "Yangın, Elektrik ve Elektronik": "Fire, Electrical & Electronics",
  "Tarım, Denizcilik ve Sondaj": "Agriculture, Maritime & Drilling",
  "Veri ve İstatistik": "Data & Statistics",
  "Bilişim, Biyomedikal ve Maden": "IT, Biomedical & Mining",
  "İleri Fizik, Kuantum ve Enerji": "Advanced Physics, Quantum & Energy",
  "Tekstil, Gıda ve Plastik": "Textile, Food & Plastics",
  "Mekanik, Otomotiv ve Havacılık": "Mechanical, Automotive & Aerospace",
  "Endüstri Mühendisliği": "Industrial Engineering"
};

function translateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [tr, en] of Object.entries(profTranslations)) {
      content = content.replace(new RegExp(`"${tr}"`, 'g'), `"${en}"`);
    }
    for (const [tr, en] of Object.entries(categoryTranslations)) {
      content = content.replace(new RegExp(`"${tr}"`, 'g'), `"${en}"`);
    }
    
    fs.writeFileSync(filePath, content);
}

const files = [
    'src/lib/features/tools/taxonomy.ts',
    'src/lib/features/tools/category-taxonomy.ts',
    'src/lib/features/tools/schema-catalog-label-keys.ts',
    'src/lib/features/tools/all-tools-data.ts'
];

files.forEach(translateFile);

// Handle i18n
const i18nFiles = [
  'src/data/free-tool-inputs-i18n.generated.json',
  'src/data/generated-tool-titles-i18n.generated.json',
  'src/data/generated-tool-descriptions-i18n.generated.json',
  'src/data/roadmap-free-batch1-i18n.generated.json',
  'src/data/roadmap-free-batch2-i18n.generated.json',
  'src/data/free-tool-catalog-i18n.generated.json',
  'src/data/premium-schema-inputs-i18n.generated.json'
];

i18nFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (data.tr) {
      delete data.tr;
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
});
