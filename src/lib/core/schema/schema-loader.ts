import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// TURKISH → ENGLISH DICTIONARY (domain-specific, 300+ tools, 600+ entries)
// ─────────────────────────────────────────────────────────────────────────────
const TURKISH_TO_ENGLISH: Record<string, string> = {
  // ── Sector / Category names ──
  "Çevre ve Sürdürülebilirlik": "Environment and Sustainability",
  "İnşaat ve Altyapı": "Construction and Infrastructure",
  "Üretim ve Endüstri": "Manufacturing and Industry",
  "Enerji ve Güç Sistemleri": "Energy and Power Systems",
  "Finans ve Yatırım": "Finance and Investment",
  "Makine ve Mekanik": "Mechanical Engineering",
  "Elektrik ve Elektronik": "Electrical and Electronics",
  "Lojistik ve Nakliye": "Logistics and Transportation",
  "Tekstil ve Konfeksiyon": "Textile and Apparel",
  "Gıda ve Tarım": "Food and Agriculture",
  "Yazılım ve Bilişim": "Software and IT",
  "Havacılık ve Denizcilik": "Aviation and Maritime",
  "Kimya ve Proses": "Chemical and Process",
  "Sağlık ve Medikal": "Health and Medical",
  "Eğitim ve Araştırma": "Education and Research",
  "Hukuk ve Danışmanlık": "Legal and Consulting",
  "Malzeme Bilimi": "Materials Science",
  "Petrol ve Doğalgaz": "Oil and Gas",
  "Savunma ve Güvenlik": "Defense and Security",
  "Su ve Atık Yönetimi": "Water and Waste Management",
  "Sigorta ve Risk": "Insurance and Risk",
  "Vergi ve Muhasebe": "Tax and Accounting",
  "Çelik Yapı": "Steel Structures",
  "Hidrolik ve Pnömatik": "Hydraulics and Pneumatics",

  // ── Carbon footprint (çevre) ──
  "Karbon Ayak İzi Hesaplama": "Carbon Footprint Calculator",
  "Yakıt Tüketimi": "Fuel Consumption",
  "Yıllık yakıt tüketimi": "Annual Fuel Consumption",
  "Elektrik Tüketimi": "Electricity Consumption",
  "Yıllık elektrik tüketimi": "Annual Electricity Consumption",
  "Tedarik Emisyonu": "Supply Chain Emissions",
  "Satın alınan mal/hizmet kaynaklı emisyon": "Emissions from Purchased Goods/Services",
  "Toplam Karbon Ayak İzi": "Total Carbon Footprint",
  "Karbon emisyonu": "Carbon Emissions",
  "Doğalgaz tüketimi": "Natural Gas Consumption",
  "Yıllık doğalgaz tüketimi": "Annual Natural Gas Consumption",
  "Emisyon Faktörü": "Emission Factor",
  "Sera gazı emisyonu": "Greenhouse Gas Emissions",

  // ── Pressure vessel (ASME) ──
  "İç Basınç": "Internal Pressure",
  "Basınç": "Pressure",
  "İç yarıçap": "Inner Radius",
  "Yarıçap": "Radius",
  "İzin Verilen Stres": "Allowable Stress",
  "Kaynak Verimi": "Joint Efficiency",
  "Korozyon Payı": "Corrosion Allowance",
  "Gövde Kalınlığı": "Shell Thickness",
  "Minimum gövde kalınlığı": "Minimum Shell Thickness",
  "Tasarım basıncı": "Design Pressure",
  "Çap": "Diameter",
  "Et kalınlığı": "Wall Thickness",
  "Cidar kalınlığı": "Wall Thickness",

  // ── Injection molding ──
  "Et Kalınlığı": "Wall Thickness",
  "Termal Difüzyon": "Thermal Diffusivity",
  "Erime Sıcaklığı": "Melt Temperature",
  "Kalıp Sıcaklığı": "Mold Temperature",
  "Soğutma Süresi": "Cooling Time",
  "Plastik soğutma süresi": "Plastic Cooling Time",
  "Kurutma süresi": "Drying Time",
  "Enjeksiyon kalıplama soğutma": "Injection Molding Cooling",
  "Malzeme sıcaklığı": "Material Temperature",
  "Kalıptan çıkarma sıcaklığı": "Ejection Temperature",
  "Levha kalınlığı": "Sheet Thickness",

  // ── Finance ──
  "Net Gelir": "Net Income",
  "Net gelir": "Net Income",
  "Faiz Gideri": "Interest Expense",
  "Faiz gideri": "Interest Expense",
  "Vergi Gideri": "Tax Expense",
  "Vergi gideri": "Tax Expense",
  "Amortisman": "Depreciation",
  "Amortisman Gideri": "Amortization Expense",
  "Toplam Varlık": "Total Assets",
  "Toplam Borç": "Total Liabilities",
  "Net Kâr": "Net Profit",
  "Net kar": "Net Profit",
  "Brüt Kâr": "Gross Profit",
  "Brüt kar": "Gross Profit",
  "Faaliyet Geliri": "Operating Income",
  "Faaliyet gideri": "Operating Expense",
  "Satış Geliri": "Revenue",
  "Satış geliri": "Revenue",
  "Pazar değeri": "Market Value",
  "Defter değeri": "Book Value",
  "Hisse başına kazanç": "Earnings Per Share",
  "Temettü verimi": "Dividend Yield",
  "İskonto oranı": "Discount Rate",
  "Vade": "Maturity",
  "Faiz oranı": "Interest Rate",
  "Yıllık faiz oranı": "Annual Interest Rate",
  "Anapara": "Principal",
  "Yatırım tutarı": "Investment Amount",
  "Başlangıç yatırımı": "Initial Investment",
  "Nakit girişi": "Cash Inflow",
  "Nakit çıkışı": "Cash Outflow",
  "Yıllık getiri": "Annual Return",
  "Toplam Getiri": "Total Return",
  "Birleşik faiz": "Compound Interest",
  "Vergi öncesi kar": "Pre-tax Profit",
  "Net bugünkü değer": "Net Present Value",
  "İç verim oranı": "Internal Rate of Return",
  "Geri ödeme süresi": "Payback Period",
  "Başabaş noktası": "Break-even Point",
  "Kâr marjı": "Profit Margin",
  "Kar marjı": "Profit Margin",
  "Faaliyet marjı": "Operating Margin",

  // ── Manufacturing / OEE / Lean ──
  "Toplam Ekipman Verimliliği": "Overall Equipment Effectiveness",
  "Kullanılabilirlik": "Availability",
  "Performans": "Performance",
  "Kalite Oranı": "Quality Rate",
  "Kalite oranı": "Quality Rate",
  "Planlı üretim süresi": "Planned Production Time",
  "Çalışma süresi": "Operating Time",
  "Operasyon süresi": "Operating Time",
  "Duruş süresi": "Downtime",
  "Arıza süresi": "Breakdown Time",
  "Çevrim süresi": "Cycle Time",
  "İdeal çevrim süresi": "Ideal Cycle Time",
  "Toplam üretim": "Total Production",
  "Sağlam üretim": "Good Production",
  "Hatalı üretim": "Defective Production",
  "Fire oranı": "Scrap Rate",
  "Hız kaybı": "Speed Loss",
  "Kalite kaybı": "Quality Loss",
  "Duruş kaybı": "Downtime Loss",
  "İşlem süresi": "Process Time",
  "Hazırlık süresi": "Setup Time",
  "Üretim hızı": "Production Rate",
  "Saatlik kapasite": "Hourly Capacity",
  "Vardiya süresi": "Shift Duration",
  "İşçi sayısı": "Number of Workers",
  "İşlem sayısı": "Number of Operations",
  "Hata sayısı": "Number of Defects",
  "Toplam parça": "Total Parts",
  "Sağlam parça": "Good Parts",
  "Fire": "Scrap",
  "Fire adedi": "Scrap Quantity",

  // ── Mechanical / Engineering ──
  "Çekme dayanımı": "Tensile Strength",
  "Akma dayanımı": "Yield Strength",
  "Elastisite modülü": "Modulus of Elasticity",
  "Kayma modülü": "Shear Modulus",
  "Poisson oranı": "Poisson's Ratio",
  "Yoğunluk": "Density",
  "Malzeme yoğunluğu": "Material Density",
  "Isıl iletkenlik": "Thermal Conductivity",
  "Özgül ısı": "Specific Heat",
  "Genleşme katsayısı": "Expansion Coefficient",
  "Isıl genleşme": "Thermal Expansion",
  "Viskozite": "Viscosity",
  "Kinematik viskozite": "Kinematic Viscosity",
  "Kesit alanı": "Cross-sectional Area",
  "Kesme kuvveti": "Shear Force",
  "Eğilme momenti": "Bending Moment",
  "Burulma momenti": "Torsional Moment",
  "Tork": "Torque",
  "Eksenel yük": "Axial Load",
  "Radyal yük": "Radial Load",
  "İzin verilen gerilme": "Allowable Stress",
  "Emniyet katsayısı": "Safety Factor",
  "Güvenlik faktörü": "Safety Factor",
  "Yük faktörü": "Load Factor",
  "Kırılma tokluğu": "Fracture Toughness",
  "Sertlik": "Hardness",
  "Yüzey pürüzlülüğü": "Surface Roughness",
  "Tolerans": "Tolerance",
  "Geçme toleransı": "Interference Tolerance",
  "Mil çapı": "Shaft Diameter",
  "Göbek çapı": "Hub Diameter",
  "Yatak ömrü": "Bearing Life",
  "Dişli oranı": "Gear Ratio",
  "Modül": "Module",
  "Diş sayısı": "Number of Teeth",

  // ── Structural / Civil ──
  "Beton dayanımı": "Concrete Strength",
  "Beton basınç dayanımı": "Concrete Compressive Strength",
  "Donatı çeliği": "Reinforcing Steel",
  "Donatı alanı": "Reinforcement Area",
  "Kiriş yüksekliği": "Beam Depth",
  "Kiriş genişliği": "Beam Width",
  "Kolon kesiti": "Column Section",
  "Temel genişliği": "Foundation Width",
  "Zemin taşıma kapasitesi": "Soil Bearing Capacity",
  "Zemin emniyet gerilmesi": "Allowable Soil Bearing Pressure",
  "Sehim": "Deflection",
  "Maksimum sehim": "Maximum Deflection",
  "Kritik yük": "Critical Load",
  "Burkulma boyu": "Buckling Length",
  "Atalet momenti": "Moment of Inertia",
  "Kesit modülü": "Section Modulus",
  "Dönme yarıçapı": "Radius of Gyration",
  "Statik yük": "Static Load",
  "Hareketli yük": "Live Load",
  "Rüzgar yükü": "Wind Load",
  "Deprem yükü": "Seismic Load",
  "Kar yükü": "Snow Load",
  "Güvenlik yükü": "Safety Load",

  // ── HVAC / Fluid ──
  "Hava debisi": "Air Flow Rate",
  "Hacimsel debi": "Volumetric Flow Rate",
  "Kütlesel debi": "Mass Flow Rate",
  "Akış hızı": "Flow Velocity",
  "Akışkan hızı": "Fluid Velocity",
  "Boru çapı": "Pipe Diameter",
  "Boru uzunluğu": "Pipe Length",
  "Boru kalınlığı": "Pipe Thickness",
  "Basınç düşümü": "Pressure Drop",
  "Sürtünme kaybı": "Friction Loss",
  "Sürtünme katsayısı": "Friction Factor",
  "Pompa gücü": "Pump Power",
  "Pompa debisi": "Pump Flow Rate",
  "Pompa basma yüksekliği": "Pump Head",
  "Toplam basma yüksekliği": "Total Head",
  "Isı yükü": "Heat Load",
  "Soğutma yükü": "Cooling Load",
  "Isıtma yükü": "Heating Load",
  "Isı transfer katsayısı": "Heat Transfer Coefficient",
  "Isı akısı": "Heat Flux",
  "Sıcaklık farkı": "Temperature Difference",
  "Giriş sıcaklığı": "Inlet Temperature",
  "Çıkış sıcaklığı": "Outlet Temperature",
  "Ortam sıcaklığı": "Ambient Temperature",
  "Radyatör gücü": "Radiator Power",
  "Petek boyu": "Radiator Length",
  "Isıtma derece-gün": "Heating Degree Days",
  "Soğutma derece-gün": "Cooling Degree Days",

  // ── Electrical / Electronics ──
  "Gerilim": "Voltage",
  "Giriş gerilimi": "Input Voltage",
  "Çıkış gerilimi": "Output Voltage",
  "Akım": "Current",
  "Giriş akımı": "Input Current",
  "Çıkış akımı": "Output Current",
  "Güç": "Power",
  "Aktif güç": "Active Power",
  "Reaktif güç": "Reactive Power",
  "Görünür güç": "Apparent Power",
  "Güç faktörü": "Power Factor",
  "Direnç": "Resistance",
  "Empedans": "Impedance",
  "Endüktans": "Inductance",
  "Kapasitans": "Capacitance",
  "Frekans": "Frequency",
  "Rezonans frekansı": "Resonant Frequency",
  "Dalga boyu": "Wavelength",
  "Sinyal gürültü oranı": "Signal-to-Noise Ratio",
  "Bant genişliği": "Bandwidth",
  "Kazanç": "Gain",
  "Verim": "Efficiency",
  "Motor verimi": "Motor Efficiency",
  "Transformatör verimi": "Transformer Efficiency",
  "Güç tüketimi": "Power Consumption",
  "Enerji tüketimi": "Energy Consumption",
  "Enerji maliyeti": "Energy Cost",
  "Güneş paneli gücü": "Solar Panel Power",
  "Panel sayısı": "Number of Panels",
  "Batarya kapasitesi": "Battery Capacity",
  "Şarj süresi": "Charging Time",
  "Deşarj süresi": "Discharge Time",
  "ADC çözünürlüğü": "ADC Resolution",
  "Örnekleme hızı": "Sampling Rate",
  "Sinyal frekansı": "Signal Frequency",

  // ── Logistics / Transportation ──
  "Nakliye maliyeti": "Shipping Cost",
  "Taşıma maliyeti": "Transportation Cost",
  "Yakıt maliyeti": "Fuel Cost",
  "Mesafe": "Distance",
  "Taşıma mesafesi": "Transport Distance",
  "Yol mesafesi": "Road Distance",
  "Toplam mesafe": "Total Distance",
  "Ağırlık": "Weight",
  "Yük ağırlığı": "Cargo Weight",
  "Toplam ağırlık": "Total Weight",
  "Hacim": "Volume",
  "Yük hacmi": "Cargo Volume",
  "Konteyner sayısı": "Container Count",
  "Araç sayısı": "Vehicle Count",
  "Sefer sayısı": "Trip Count",
  "Teslimat süresi": "Delivery Time",
  "Transit süresi": "Transit Time",
  "Bekleme süresi": "Waiting Time",
  "Yükleme süresi": "Loading Time",
  "Boşaltma süresi": "Unloading Time",
  "Toplam süre": "Total Time",
  "Yakıt tüketim hızı": "Fuel Consumption Rate",
  "Ortalama hız": "Average Speed",

  // ── Textile / Apparel ──
  "Kumaş ağırlığı": "Fabric Weight",
  "Kumaş eni": "Fabric Width",
  "Kumaş boyu": "Fabric Length",
  "Kumaş maliyeti": "Fabric Cost",
  "Kumaş tüketimi": "Fabric Consumption",
  "Dikiş süresi": "Sewing Time",
  "Dikiş makinesi sayısı": "Number of Sewing Machines",
  "Üretim adedi": "Production Quantity",
  "Bant hızı": "Line Speed",
  "İplik tüketimi": "Yarn Consumption",
  "İplik numarası": "Yarn Count",
  "Dokuma hızı": "Weaving Speed",
  "Örme makinesi hızı": "Knitting Machine Speed",
  "Baskı maliyeti": "Printing Cost",
  "Kumaş çekme oranı": "Fabric Shrinkage Rate",
  "Kumaş çekmesi": "Fabric Shrinkage",

  // ── Food / Agriculture ──
  "Toplam alan": "Total Area",
  "Ekim alanı": "Planting Area",
  "Tarla alanı": "Field Area",
  "Sulama alanı": "Irrigation Area",
  "Ürün miktarı": "Crop Yield",
  "Verim miktarı": "Yield Amount",
  "Sulama debisi": "Irrigation Flow Rate",
  "Sulama süresi": "Irrigation Time",
  "Damla sulama": "Drip Irrigation",
  "Tohum miktarı": "Seed Quantity",
  "Ekim sıklığı": "Planting Density",
  "Gübre miktarı": "Fertilizer Quantity",
  "Hasat süresi": "Harvest Time",
  "Pastörizasyon sıcaklığı": "Pasteurization Temperature",
  "Pastörizasyon süresi": "Pasteurization Time",
  "Soğutma sıcaklığı": "Cooling Temperature",
  "Fırın sıcaklığı": "Oven Temperature",
  "Pişirme süresi": "Cooking Time",
  "Fırın kapasitesi": "Oven Capacity",

  // ── Energy / Power ──
  "Rüzgar hızı": "Wind Speed",
  "Türbin gücü": "Turbine Power",
  "Türbin çapı": "Turbine Diameter",
  "Kule yüksekliği": "Tower Height",
  "Güneş ışınımı": "Solar Irradiance",
  "Gölge süresi": "Shade Duration",
  "Gölge boyu": "Shadow Length",
  "Bina yüksekliği": "Building Height",
  "Hidroelektrik güç": "Hydroelectric Power",
  "Su debisi": "Water Flow Rate",
  "Düşü yüksekliği": "Head Height",
  "Jeneratör verimi": "Generator Efficiency",
  "Enerji depolama": "Energy Storage",
  "Birim enerji maliyeti": "Levelized Energy Cost",
  "Yakıt ısıl değeri": "Fuel Calorific Value",
  "CO2 emisyonu": "CO2 Emissions",
  "Sera gazı": "Greenhouse Gas",
  "Sürdürülebilirlik puanı": "Sustainability Score",

  // ── Oil & Gas ──
  "Kuyu derinliği": "Well Depth",
  "Kuyu basıncı": "Well Pressure",
  "Dip basıncı": "Bottom Pressure",
  "Sondaj çamuru yoğunluğu": "Drilling Mud Density",
  "Sondaj hızı": "Drilling Rate",
  "Boru ağırlığı": "Pipe Weight",
  "Tij boyu": "Drill Pipe Length",
  "Tork değeri": "Torque Value",
  "Sondaj basıncı": "Drilling Pressure",
  "Petrol fiyatı": "Oil Price",
  "Gaz fiyatı": "Gas Price",
  "Üretim miktarı": "Production Volume",
  "Rezerv hacmi": "Reserve Volume",
  "Gözeneklilik": "Porosity",
  "Geçirgenlik": "Permeability",
  "Doygunluk": "Saturation",

  // ── Compressor / Pump ──
  "İdeal Güç": "Ideal Power",
  "Sıkıştırma oranı": "Compression Ratio",
  "İzotermal verim": "Isothermal Efficiency",
  "İzentropik verim": "Isentropic Efficiency",
  "Mekanik verim": "Mechanical Efficiency",
  "Motor gücü": "Motor Power",
  "Tahrik verimi": "Drive Efficiency",
  "Debi": "Flow Rate",
  "Emme basıncı": "Suction Pressure",
  "Basma basıncı": "Discharge Pressure",
  "Sıcaklık": "Temperature",

  // ── Maritime ──
  "Gemi boyu": "Ship Length",
  "Gemi eni": "Ship Width",
  "Su çekimi": "Draft",
  "Deplasman": "Displacement",
  "İstifleme faktörü": "Stowage Factor",
  "Yükleme kapasitesi": "Loading Capacity",
  "Manevra hızı": "Maneuvering Speed",
  "Çapa zinciri boyu": "Anchor Chain Length",
  "Bağlama halatı yükü": "Mooring Line Load",
  "Sintine boşaltma süresi": "Bilge Discharge Time",
  "Seyir süresi": "Voyage Duration",
  "Yakıt sarfiyatı": "Fuel Consumption Rate",

  // ── Aviation ──
  "Kalkış ağırlığı": "Takeoff Weight",
  "İniş ağırlığı": "Landing Weight",
  "Kanat açıklığı": "Wingspan",
  "Kanat alanı": "Wing Area",
  "Pist uzunluğu": "Runway Length",
  "İrtifa": "Altitude",
  "Seyir hızı": "Cruise Speed",
  "Tırmanma hızı": "Climb Rate",
  "Menzil": "Range",
  "Yakıt kapasitesi": "Fuel Capacity",
  "Motor itki gücü": "Engine Thrust",

  // ── Chemical / Process ──
  "Reaktör sıcaklığı": "Reactor Temperature",
  "Reaktör basıncı": "Reactor Pressure",
  "Katalizör miktarı": "Catalyst Amount",
  "Reaksiyon hızı": "Reaction Rate",
  "Dönüşüm oranı": "Conversion Rate",
  "Verim oranı": "Yield Rate",
  "Saflık oranı": "Purity Level",
  "Konsantrasyon": "Concentration",
  "pH değeri": "pH Value",
  "Karıştırma hızı": "Stirring Speed",
  "Isıtma hızı": "Heating Rate",
  "Soğutma hızı": "Cooling Rate",
  "Damıtma sıcaklığı": "Distillation Temperature",
  "Kurutma sıcaklığı": "Drying Temperature",
  "Buhar basıncı": "Vapor Pressure",
  "Kaynama noktası": "Boiling Point",
  "Erime noktası": "Melting Point",
  "Donma noktası": "Freezing Point",
  "Molekül ağırlığı": "Molecular Weight",

  // ── Software / IT ──
  "Günlük istek sayısı": "Daily Request Count",
  "API istek sayısı": "API Request Count",
  "Prompt token sayısı": "Prompt Token Count",
  "Tamamlama token sayısı": "Completion Token Count",
  "Önbellek isabet oranı": "Cache Hit Ratio",
  "Prompt fiyatı": "Prompt Price",
  "Tamamlama fiyatı": "Completion Price",
  "Güvenlik tamponu": "Safety Buffer",
  "Aylık büyüme hızı": "Monthly Growth Rate",
  "Maliyet": "Cost",
  "Toplam maliyet": "Total Cost",
  "Birim maliyet": "Unit Cost",
  "İşletim maliyeti": "Operating Cost",
  "Bakım maliyeti": "Maintenance Cost",
  "İşçilik maliyeti": "Labor Cost",
  "Malzeme maliyeti": "Material Cost",
  "Sabit maliyet": "Fixed Cost",
  "Değişken maliyet": "Variable Cost",

  // ── Marketing / Sales ──
  "Tıklama başına maliyet": "Cost Per Click",
  "Gösterim başına maliyet": "Cost Per Mille",
  "Müşteri edinme maliyeti": "Customer Acquisition Cost",
  "Müşteri yaşam boyu değeri": "Customer Lifetime Value",
  "Müşteri kayıp oranı": "Churn Rate",
  "Pazarlama bütçesi": "Marketing Budget",
  "Reklam harcaması": "Ad Spend",
  "Yatırım getirisi": "Return on Investment",
  "Reklam gösterimi": "Ad Impressions",
  "Tıklama sayısı": "Click Count",
  "Potansiyel müşteri": "Lead Count",
  "Satış adedi": "Sales Quantity",
  "Sepet büyüklüğü": "Basket Size",

  // ── Statistics / Data ──
  "Ortalama": "Mean",
  "Medyan": "Median",
  "Mod": "Mode",
  "Standart sapma": "Standard Deviation",
  "Varyans": "Variance",
  "Korelasyon katsayısı": "Correlation Coefficient",
  "Regresyon katsayısı": "Regression Coefficient",
  "Güven aralığı": "Confidence Interval",
  "Örneklem büyüklüğü": "Sample Size",
  "Hata payı": "Margin of Error",
  "Anlamlılık düzeyi": "Significance Level",
  "Serbestlik derecesi": "Degrees of Freedom",
  "Ki-kare değeri": "Chi-Square Value",
  "R-kare": "R-Squared",
  "p-değeri": "p-Value",

  // ── Time / General ──
  "Açıklama": "Description",
  "Birim": "Unit",
  "Değer": "Value",
  "Sonuç": "Result",
  "Hesaplama": "Calculation",
  "Parametre": "Parameter",
  "Giriş": "Input",
  "Çıkış": "Output",
  "Hesaplanan": "Calculated",
  "Toplam": "Total",
  "Net": "Net",
  "Brüt": "Gross",
  "Oran": "Ratio",
  "Minimum": "Minimum",
  "Maksimum": "Maximum",
  "Adet": "Quantity",
  "Miktar": "Amount",
  "Sayı": "Number",
  "Düzey": "Level",
  "Boyut": "Dimension",
  "Uzunluk": "Length",
  "Genişlik": "Width",
  "Yükseklik": "Height",
  "Derinlik": "Depth",
  "Alan": "Area",
  "Kütle": "Mass",
  "Hız": "Speed",
  "İvme": "Acceleration",
  "Kuvvet": "Force",
  "Enerji": "Energy",
  "İş": "Work",

  // ── Health / Medical ──
  "Vücut ağırlığı": "Body Weight",
  "Boy": "Height",
  "Vücut kitle indeksi": "Body Mass Index",
  "Kalp atış hızı": "Heart Rate",
  "Kan basıncı": "Blood Pressure",
  "Sistolik basınç": "Systolic Pressure",
  "Diyastolik basınç": "Diastolic Pressure",
  "İlaç dozu": "Dosage",
  "İlaç konsantrasyonu": "Drug Concentration",
  "Yarılanma süresi": "Half-life",
  "Radyasyon dozu": "Radiation Dose",
  "Maruziyet süresi": "Exposure Time",
  "Radyasyon mesafesi": "Radiation Distance",
  "VO2 maks": "VO2 Max",
  "Koşu mesafesi": "Running Distance",
  "Egzersiz süresi": "Exercise Duration",

  // ── Unit / Converter ──
  "Birim dönüştürücü": "Unit Converter",
  "Uzunluk dönüştürücü": "Length Converter",
  "Ağırlık dönüştürücü": "Weight Converter",
  "Sıcaklık dönüştürücü": "Temperature Converter",
  "Basınç dönüştürücü": "Pressure Converter",
  "Hacim dönüştürücü": "Volume Converter",
  "Alan dönüştürücü": "Area Converter",
  "Hız dönüştürücü": "Speed Converter",
  "Güç dönüştürücü": "Power Converter",
  "Enerji dönüştürücü": "Energy Converter",
  "Yoğunluk dönüştürücü": "Density Converter",
  "Kuvvet dönüştürücü": "Force Converter",
  "Sertlik dönüştürücü": "Hardness Converter",
  "Sıcaklık dönüşümü": "Temperature Conversion",
  "Birimden": "From Unit",
  "Birime": "To Unit",
  "Dönüştürülen değer": "Converted Value",

  // ── Specific tool names and patterns ──
  "Basınçlı Kap": "Pressure Vessel",
  "Halka Gerilmesi": "Hoop Stress",
  "İnce Cidarlı Basınçlı Kap": "Thin-Walled Pressure Vessel",
  "Alın Kaynağı": "Butt Weld",
  "Köşe Kaynağı": "Fillet Weld",
  "Kaynak dikiş kalınlığı": "Weld Throat Thickness",
  "Kaynak boyu": "Weld Length",
  "Kaynak kalınlığı": "Weld Size",
  "Isı girdisi": "Heat Input",
  "Kaynak ısı girdisi": "Weld Heat Input",
  "Vida adımı": "Thread Pitch",
  "Cıvata çapı": "Bolt Diameter",
  "Cıvata boyu": "Bolt Length",
  "Somun boyu": "Nut Height",
  "Cıvata sınıfı": "Bolt Grade",
  "Cıvata ön yükü": "Bolt Preload",
  "Sıkma torku": "Tightening Torque",
  "Sızdırmazlık faktörü": "Sealing Factor",
  "Yay sabiti": "Spring Constant",
  "Yay çapı": "Spring Diameter",
  "Sarım sayısı": "Number of Coils",
  "Yay indeksi": "Spring Index",
  "Tel çapı": "Wire Diameter",
  "Burkulma": "Buckling",
  "Euler burkulma yükü": "Euler Buckling Load",
  "Kayma gerilmesi": "Shear Stress",
  "Normal gerilme": "Normal Stress",
  "Eğilme gerilmesi": "Bending Stress",
  "Burulma gerilmesi": "Torsional Stress",
  "Von Mises gerilmesi": "Von Mises Stress",
  "Asal gerilme": "Principal Stress",
  "Mohr dairesi": "Mohr's Circle",

  // ── Construction / Building ──
  "Bina alanı": "Building Area",
  "Kat alanı": "Floor Area",
  "Duvar alanı": "Wall Area",
  "Çatı alanı": "Roof Area",
  "Pencere alanı": "Window Area",
  "Kapı alanı": "Door Area",
  "Cephe alanı": "Facade Area",
  "Yalıtım kalınlığı": "Insulation Thickness",
  "Yalıtım malzemesi": "Insulation Material",
  "Boya miktarı": "Paint Quantity",
  "Boya kutusu": "Paint Can",
  "Fayans miktarı": "Tile Quantity",
  "Fayans boyutu": "Tile Size",
  "Derz aralığı": "Joint Spacing",
  "Döşeme alanı": "Flooring Area",
  "Kaplama miktarı": "Covering Quantity",
  "Çimento miktarı": "Cement Quantity",
  "Kum miktarı": "Sand Quantity",
  "Çakıl miktarı": "Gravel Quantity",
  "Beton hacmi": "Concrete Volume",
  "Demir miktarı": "Rebar Quantity",
  "Donatı oranı": "Reinforcement Ratio",
  "Kalıp alanı": "Formwork Area",
  "İskele yüksekliği": "Scaffold Height",
  "Hafriyat hacmi": "Excavation Volume",

  // ── Legal / Statute ──
  "Zamanaşımı süresi": "Statute of Limitations",
  "Dava açma süresi": "Filing Period",
  "Tazminat tutarı": "Compensation Amount",
  "Ceza tutarı": "Penalty Amount",
  "Gecikme faizi": "Default Interest",
  "KDV oranı": "VAT Rate",
  "Vergi oranı": "Tax Rate",
  "Stopaj oranı": "Withholding Rate",
  "Damga vergisi": "Stamp Duty",
  "ÖTV oranı": "Special Consumption Tax Rate",
  "Gümrük vergisi": "Customs Duty",
  "İthalat vergisi": "Import Duty",
  "Sermaye kazancı vergisi": "Capital Gains Tax",
  "Kurumlar vergisi": "Corporate Tax",
  "Gelir vergisi": "Income Tax",
  "Muafiyet miktarı": "Exemption Amount",
  "İndirim tutarı": "Deduction Amount",

  // ── Safety / Risk ──
  "Yangın yükü": "Fire Load",
  "Yangın dayanımı": "Fire Resistance",
  "Yangın söndürücü": "Fire Extinguisher",
  "Sprinkler debisi": "Sprinkler Flow Rate",
  "Yangın pompası": "Fire Pump",
  "Kaçış mesafesi": "Escape Distance",
  "Kaçış süresi": "Escape Time",
  "Risk puanı": "Risk Score",
  "Tehlike seviyesi": "Hazard Level",
  "Kaza oranı": "Accident Rate",
  "İş kazası": "Occupational Accident",
  "İSG puanı": "OHS Score",
  "Gürültü seviyesi": "Noise Level",
  "Titreşim seviyesi": "Vibration Level",
  "Toz konsantrasyonu": "Dust Concentration",
  "Kimyasal maruziyet": "Chemical Exposure",

  // ── Education / Research ──
  "Soru sayısı": "Number of Questions",
  "Doğru cevap": "Correct Answer",
  "Yanlış cevap": "Wrong Answer",
  "Madde güçlük indeksi": "Item Difficulty Index",
  "Madde ayırt edicilik indeksi": "Item Discrimination Index",
  "Güvenirlik katsayısı": "Reliability Coefficient",
  "Geçerlik katsayısı": "Validity Coefficient",
  "Standart hata": "Standard Error",
  "Ölçme hatası": "Measurement Error",

  // ── Noise / Acoustics ──
  "Ses basıncı": "Sound Pressure",
  "Ses gücü": "Sound Power",
  "Ses şiddeti": "Sound Intensity",
  "Desibel": "Decibel",
  "Ses hızı": "Speed of Sound",
  "Gürültü engeli": "Noise Barrier",
  "Yankılanma süresi": "Reverberation Time",
  "Fremanaj aralığı": "Frequency Range",
  "Düşük frekans": "Low Frequency",
  "Yüksek frekans": "High Frequency",
};

// ─────────────────────────────────────────────────────────────────────────────
// TURKISH CHARACTER DETECTION PATTERN
// ─────────────────────────────────────────────────────────────────────────────
const TURKISH_PATTERN = /[çğıöşüÇĞİÖŞÜ]/;

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect if a string contains Turkish characters.
 */
export function containsTurkish(text: string): boolean {
  return TURKISH_PATTERN.test(text);
}

/**
 * Translate a single Turkish string to English.
 * 1. Looks up dictionary for full-phrase matches
 * 2. For remaining Turkish chars, falls back to ID-based generation
 * 3. Last resort: identity return with warning
 */
export function translateTurkishToEnglish(text: string, fallbackId?: string): string {
  if (!text || !containsTurkish(text)) return text;

  // Step 1: Direct dictionary lookup (sorted by length descending for greedy matching)
  let translated = text;
  const sortedEntries = Object.entries(TURKISH_TO_ENGLISH).sort(
    ([a], [b]) => b.length - a.length,
  );
  for (const [tr, en] of sortedEntries) {
    // Case-insensitive replacement
    const regex = new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(translated)) {
      translated = translated.replace(regex, en);
    }
  }

  // Step 2: If Turkish chars remain, use fallback ID
  if (containsTurkish(translated) && fallbackId) {
    console.warn(
      `[SchemaLoader] Turkish text not in dictionary: "${text}" → using ID: ${fallbackId}`,
    );
    return fallbackId
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // Step 3: Last resort — strip Turkish chars
  if (containsTurkish(translated)) {
    console.warn(
      `[SchemaLoader] Partial Turkish residue after translation: "${text}"`,
    );
    translated = translated
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "G")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "S")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "U");
  }

  return translated;
}

/**
 * Recursively walk an object and translate all string values containing Turkish.
 */
function translateObject(
  obj: unknown,
  path: string,
  parentId?: string,
): void {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      translateObject(obj[i], `${path}[${i}]`, parentId);
    }
    return;
  }

  const record = obj as Record<string, unknown>;

  // Extract id for fallback
  const id = typeof record.id === "string" ? record.id : undefined;

  // Translate specific fields commonly containing Turkish
  const fieldsToTranslate = [
    "toolName",
    "title",
    "description",
    "label",
    "helper",
    "hint",
    "placeholder",
    "sector",
    "categoryName",
    "subCategory",
    "eyebrow",
    "longDescription",
    "metaDescription",
    "unit",
    "group",
    "subtitle",
  ];

  for (const field of fieldsToTranslate) {
    if (typeof record[field] === "string") {
      const original = record[field] as string;
      const fallback = id ?? parentId;
      const translated = translateTurkishToEnglish(original, fallback);
      if (translated !== original) {
        record[field] = translated;
      }
    }
  }

  // Handle nested translations in arrays
  if (Array.isArray(record.inputs)) {
    for (let i = 0; i < (record.inputs as unknown[]).length; i++) {
      translateObject(
        (record.inputs as unknown[])[i],
        `${path}.inputs[${i}]`,
        (record.inputs as Record<string, unknown>[])[i]?.id as string | undefined,
      );
    }
  }

  if (Array.isArray(record.outputs)) {
    for (let i = 0; i < (record.outputs as unknown[]).length; i++) {
      translateObject(
        (record.outputs as unknown[])[i],
        `${path}.outputs[${i}]`,
        (record.outputs as Record<string, unknown>[])[i]?.id as string | undefined,
      );
    }
  }

  if (Array.isArray(record.formulas)) {
    for (let i = 0; i < (record.formulas as unknown[]).length; i++) {
      translateObject(
        (record.formulas as unknown[])[i],
        `${path}.formulas[${i}]`,
      );
    }
  }

  if (Array.isArray(record.fmea)) {
    for (let i = 0; i < (record.fmea as unknown[]).length; i++) {
      translateObject(
        (record.fmea as unknown[])[i],
        `${path}.fmea[${i}]`,
      );
    }
  }

  if (Array.isArray(record.auditLog)) {
    for (let i = 0; i < (record.auditLog as unknown[]).length; i++) {
      translateObject(
        (record.auditLog as unknown[])[i],
        `${path}.auditLog[${i}]`,
      );
    }
  }
}

/**
 * Load a JSON schema file and auto-translate all Turkish content to English.
 */
export function loadSchemaWithTranslation<T = Record<string, unknown>>(
  schemaPath: string,
): T {
  const absolutePath = path.join(process.cwd(), schemaPath);
  const rawContent = fs.readFileSync(absolutePath, "utf8");
  const schema = JSON.parse(rawContent);

  // Translate the entire schema object in-place
  translateObject(schema, schemaPath);

  return schema as T;
}

/**
 * Load all JSON schemas from a directory, auto-translating each.
 */
export function loadAllSchemasWithTranslation(
  dirPath: string,
): Record<string, unknown> {
  const absoluteDir = path.join(process.cwd(), dirPath);
  const files = fs.readdirSync(absoluteDir).filter((f) => f.endsWith(".json"));

  const schemas: Record<string, unknown> = {};
  for (const file of files) {
    const schemaId = file.replace(".json", "");
    const schemaPath = path.join(dirPath, file);
    schemas[schemaId] = loadSchemaWithTranslation(schemaPath);
  }

  return schemas;
}

/**
 * Generate the dictionary entry for a Turkish string (helper for build-time validation).
 */
export function getTurkishToEnglishDictionary(): Record<string, string> {
  return { ...TURKISH_TO_ENGLISH };
}
