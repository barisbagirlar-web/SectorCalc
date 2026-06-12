#!/usr/bin/env python3
"""Generate scripts/data/homepage-positioning-i18n.json for homepage positioning rebuild."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent / "data" / "homepage-positioning-i18n.json"


def tool_items(en: dict[str, str]) -> dict[str, dict[str, str]]:
    return {k: {"title": v} for k, v in en.items()}


CRITICAL_EN = {
    "productionManufacturing": {
        "title": "Production & manufacturing",
        "items": {
            "shopRate": "Machine Hour Rate Calculator",
            "oee": "OEE Calculator",
            "cuttingSpeed": "Cutting Speed Calculator",
            "sheetScrap": "Sheet Metal Scrap Risk Calculator",
        },
    },
    "workshopQuote": {
        "title": "Workshop & quoting",
        "items": {
            "quoteMargin": "Quote Price & Profit Margin Calculator",
            "breakEven": "Break-Even Calculator",
            "repairQuote": "Auto Repair Parts & Labor Quote Calculator",
            "productMargin": "Product Margin Calculator",
        },
    },
    "technicalEngineering": {
        "title": "Technical & engineering",
        "items": {
            "boltTorque": "Bolt Tightening Torque Calculator",
            "weldedConnection": "Welded & Bolted Connection Calculator",
            "toleranceStack": "Tolerance Stack-up Calculator",
            "cylinderForce": "Hydraulic & Pneumatic Cylinder Force Calculator",
        },
    },
    "constructionField": {
        "title": "Construction & field",
        "items": {
            "concreteVolume": "Concrete Volume Calculator",
            "squareMeter": "Square Meter Calculator",
            "paintCoverage": "Paint Coverage Calculator",
            "roofingArea": "Roofing Area Calculator",
        },
    },
    "energyCarbon": {
        "title": "Energy & carbon",
        "items": {
            "compressorLeak": "Compressor Leak Cost Calculator",
            "kwhCost": "kWh Cost Calculator",
            "ledSavings": "Energy Savings Package Calculator",
            "cbamCarbon": "CBAM Unit Product Carbon Footprint Calculator",
        },
    },
    "financeHr": {
        "title": "Finance & HR",
        "items": {
            "vat": "VAT Calculator",
            "loanPayment": "Loan Payment Calculator",
            "employeeCost": "Employee Total Cost Calculator",
            "inventoryEoq": "Inventory Carrying Cost & EOQ Calculator",
        },
    },
}

CRITICAL_TR = {
    "productionManufacturing": {
        "title": "Üretim ve imalat",
        "items": {
            "shopRate": "Makine Saat Ücreti Hesaplayıcı",
            "oee": "OEE Hesaplayıcı",
            "cuttingSpeed": "Kesme Hızı Hesaplayıcı",
            "sheetScrap": "Sac Metal Fire Riski Hesaplayıcısı",
        },
    },
    "workshopQuote": {
        "title": "Atölye ve teklif",
        "items": {
            "quoteMargin": "Fiyat Teklif Sihirbazı",
            "breakEven": "Başabaş Hesaplayıcı",
            "repairQuote": "Tamirhane Parça ve İşçilik Teklif Hesaplayıcı",
            "productMargin": "Ürün Marjı Hesaplayıcı",
        },
    },
    "technicalEngineering": {
        "title": "Teknik ve mühendislik",
        "items": {
            "boltTorque": "Civata Sıkma Torku Hesaplayıcı",
            "weldedConnection": "Kaynaklı ve Bulonlu Bağlantı Hesaplayıcı",
            "toleranceStack": "Tolerans Yığılma Hesaplayıcı",
            "cylinderForce": "Hidrolik ve Pnömatik Silindir Kuvvet Hesaplayıcı",
        },
    },
    "constructionField": {
        "title": "İnşaat ve saha",
        "items": {
            "concreteVolume": "Beton Hacim Hesaplayıcı",
            "squareMeter": "Metrekare Hesaplayıcı",
            "paintCoverage": "Boya Kapsama Hesaplayıcı",
            "roofingArea": "Çatı Alanı Hesaplayıcı",
        },
    },
    "energyCarbon": {
        "title": "Enerji ve karbon",
        "items": {
            "compressorLeak": "Kompresör Kaçağı Maliyet Hesaplayıcı",
            "kwhCost": "kWh Maliyet Hesaplayıcı",
            "ledSavings": "Enerji Tasarruf Hesaplayıcı",
            "cbamCarbon": "SKDM Birim Ürün Karbon Ayak İzi Hesaplayıcı",
        },
    },
    "financeHr": {
        "title": "Finans ve İK",
        "items": {
            "vat": "KDV Hesaplayıcı",
            "loanPayment": "Kredi Taksit Hesaplayıcı",
            "employeeCost": "Personel Tam Maliyet Hesaplayıcı",
            "inventoryEoq": "Stok Taşıma Maliyeti ve EOQ Hesaplayıcı",
        },
    },
}

CRITICAL_DE = {
    "productionManufacturing": {
        "title": "Produktion & Fertigung",
        "items": {
            "shopRate": "Maschinenstundensatz-Rechner",
            "oee": "OEE-Rechner",
            "cuttingSpeed": "Schnittgeschwindigkeits-Rechner",
            "sheetScrap": "Blech-Ausschussrisiko-Rechner",
        },
    },
    "workshopQuote": {
        "title": "Werkstatt & Angebot",
        "items": {
            "quoteMargin": "Angebotspreis- und Gewinnmargen-Rechner",
            "breakEven": "Break-even-Rechner",
            "repairQuote": "Kfz-Reparatur-Teile- und Arbeitsangebots-Rechner",
            "productMargin": "Produktmargen-Rechner",
        },
    },
    "technicalEngineering": {
        "title": "Technik & Engineering",
        "items": {
            "boltTorque": "Schraubenanzugsdrehmoment-Rechner",
            "weldedConnection": "Geschweißte und geschraubte Verbindungs-Rechner",
            "toleranceStack": "Toleranzstapel-Rechner",
            "cylinderForce": "Hydraulik- und Pneumatikzylinder-Kraft-Rechner",
        },
    },
    "constructionField": {
        "title": "Bau & Baustelle",
        "items": {
            "concreteVolume": "Betonvolumen-Rechner",
            "squareMeter": "Quadratmeter-Rechner",
            "paintCoverage": "Lackdeckungs-Rechner",
            "roofingArea": "Dachflächen-Rechner",
        },
    },
    "energyCarbon": {
        "title": "Energie & Kohlenstoff",
        "items": {
            "compressorLeak": "Kompressor-Leckkosten-Rechner",
            "kwhCost": "kWh-Kosten-Rechner",
            "ledSavings": "Energieeinsparpaket-Rechner",
            "cbamCarbon": "CBAM-Produkteinheits-CO₂-Fußabdruck-Rechner",
        },
    },
    "financeHr": {
        "title": "Finanzen & Personal",
        "items": {
            "vat": "MwSt-Rechner",
            "loanPayment": "Kreditraten-Rechner",
            "employeeCost": "Gesamtpersonalkosten-Rechner",
            "inventoryEoq": "Lagerhaltungskosten- und EOQ-Rechner",
        },
    },
}

CRITICAL_FR = {
    "productionManufacturing": {
        "title": "Production & fabrication",
        "items": {
            "shopRate": "Calculateur de taux horaire machine",
            "oee": "Calculateur TRS (OEE)",
            "cuttingSpeed": "Calculateur de vitesse de coupe",
            "sheetScrap": "Calculateur de risque de rebut en tôlerie",
        },
    },
    "workshopQuote": {
        "title": "Atelier & devis",
        "items": {
            "quoteMargin": "Calculateur de prix de devis et marge bénéficiaire",
            "breakEven": "Calculateur de seuil de rentabilité",
            "repairQuote": "Calculateur de devis pièces et main-d'œuvre auto",
            "productMargin": "Calculateur de marge produit",
        },
    },
    "technicalEngineering": {
        "title": "Technique & ingénierie",
        "items": {
            "boltTorque": "Calculateur de couple de serrage boulon",
            "weldedConnection": "Calculateur de connexions soudées et boulonnées",
            "toleranceStack": "Calculateur d'empilement de tolérances",
            "cylinderForce": "Calculateur de force cylindre hydraulique et pneumatique",
        },
    },
    "constructionField": {
        "title": "Construction & chantier",
        "items": {
            "concreteVolume": "Calculateur de volume de béton",
            "squareMeter": "Calculateur de mètres carrés",
            "paintCoverage": "Calculateur de couverture peinture",
            "roofingArea": "Calculateur de surface de toiture",
        },
    },
    "energyCarbon": {
        "title": "Énergie & carbone",
        "items": {
            "compressorLeak": "Calculateur de coût de fuite compresseur",
            "kwhCost": "Calculateur de coût kWh",
            "ledSavings": "Calculateur de package d'économies d'énergie",
            "cbamCarbon": "Calculateur empreinte carbone unitaire produit CBAM",
        },
    },
    "financeHr": {
        "title": "Finance & RH",
        "items": {
            "vat": "Calculateur de TVA",
            "loanPayment": "Calculateur de mensualité de prêt",
            "employeeCost": "Calculateur de coût total employé",
            "inventoryEoq": "Calculateur coût de détention stock et EOQ",
        },
    },
}

CRITICAL_ES = {
    "productionManufacturing": {
        "title": "Producción y fabricación",
        "items": {
            "shopRate": "Calculadora de tarifa horaria de máquina",
            "oee": "Calculadora OEE",
            "cuttingSpeed": "Calculadora de velocidad de corte",
            "sheetScrap": "Calculadora de riesgo de desperdicio en chapa metálica",
        },
    },
    "workshopQuote": {
        "title": "Taller y cotización",
        "items": {
            "quoteMargin": "Calculadora de precio de cotización y margen de beneficio",
            "breakEven": "Calculadora de punto de equilibrio",
            "repairQuote": "Calculadora de cotización de piezas y mano de obra auto",
            "productMargin": "Calculadora de margen de producto",
        },
    },
    "technicalEngineering": {
        "title": "Técnica e ingeniería",
        "items": {
            "boltTorque": "Calculadora de torque de apriete de pernos",
            "weldedConnection": "Calculadora de conexiones soldadas y atornilladas",
            "toleranceStack": "Calculadora de acumulación de tolerancias",
            "cylinderForce": "Calculadora de fuerza de cilindro hidráulico y neumático",
        },
    },
    "constructionField": {
        "title": "Construcción y obra",
        "items": {
            "concreteVolume": "Calculadora de volumen de hormigón",
            "squareMeter": "Calculadora de metros cuadrados",
            "paintCoverage": "Calculadora de cobertura de pintura",
            "roofingArea": "Calculadora de área de cubierta",
        },
    },
    "energyCarbon": {
        "title": "Energía y carbono",
        "items": {
            "compressorLeak": "Calculadora de costo de fuga de compresor",
            "kwhCost": "Calculadora de costo kWh",
            "ledSavings": "Calculadora de paquete de ahorro energético",
            "cbamCarbon": "Calculadora de huella de carbono unitaria de producto CBAM",
        },
    },
    "financeHr": {
        "title": "Finanzas y RR. HH.",
        "items": {
            "vat": "Calculadora de IVA",
            "loanPayment": "Calculadora de cuota de préstamo",
            "employeeCost": "Calculadora de costo total del empleado",
            "inventoryEoq": "Calculadora de costo de mantenimiento de inventario y EOQ",
        },
    },
}

CRITICAL_AR = {
    "productionManufacturing": {
        "title": "الإنتاج والتصنيع",
        "items": {
            "shopRate": "حاسبة سعر الساعة للآلة",
            "oee": "حاسبة كفاءة المعدات الشاملة",
            "cuttingSpeed": "حاسبة سرعة القطع",
            "sheetScrap": "حاسبة مخاطر هدر الصفائح المعدنية",
        },
    },
    "workshopQuote": {
        "title": "الورشة والتسعير",
        "items": {
            "quoteMargin": "حاسبة سعر العرض وهامش الربح",
            "breakEven": "حاسبة نقطة التعادل",
            "repairQuote": "حاسبة عرض أسعار قطع الغيار والعمالة في إصلاح السيارات",
            "productMargin": "حاسبة هامش المنتج",
        },
    },
    "technicalEngineering": {
        "title": "التقنية والهندسة",
        "items": {
            "boltTorque": "حاسبة عزم شد البراغي",
            "weldedConnection": "حاسبة الوصلات الملحومة والمثبتة بالبراغي",
            "toleranceStack": "حاسبة تراكم التسامحات",
            "cylinderForce": "حاسبة قوة الأسطوانة الهيدروليكية والهوائية",
        },
    },
    "constructionField": {
        "title": "البناء والموقع",
        "items": {
            "concreteVolume": "حاسبة حجم الخرسانة",
            "squareMeter": "حاسبة المتر المربع",
            "paintCoverage": "حاسبة تغطية الدهان",
            "roofingArea": "حاسبة مساحة السقف",
        },
    },
    "energyCarbon": {
        "title": "الطاقة والكربون",
        "items": {
            "compressorLeak": "حاسبة تكلفة تسرب الضاغط",
            "kwhCost": "حاسبة تكلفة الكيلوواط ساعة",
            "ledSavings": "حاسبة حزمة توفير الطاقة",
            "cbamCarbon": "حاسبة بصمة الكربون لكل وحدة منتج وفق آلية CBAM",
        },
    },
    "financeHr": {
        "title": "المالية والموارد البشرية",
        "items": {
            "vat": "حاسبة ضريبة القيمة المضافة",
            "loanPayment": "حاسبة قسط القرض",
            "employeeCost": "حاسبة التكلفة الإجمالية للموظف",
            "inventoryEoq": "حاسبة تكلفة حمل المخزون والكمية الاقتصادية للطلب",
        },
    },
}


def build_critical(groups: dict[str, dict[str, Any]], badge: str, title: str, subtitle: str) -> dict[str, Any]:
    out_groups: dict[str, Any] = {}
    for gid, group in groups.items():
        out_groups[gid] = {
            "title": group["title"],
            "items": tool_items(group["items"]),
        }
    return {
        "title": title,
        "subtitle": subtitle,
        "badgeSoon": badge,
        "groups": out_groups,
    }


def leaf_count(obj: Any, prefix: str = "") -> int:
    if isinstance(obj, dict):
        return sum(leaf_count(v, f"{prefix}.{k}" if prefix else k) for k, v in obj.items())
    return 1


LOCALES: dict[str, dict[str, Any]] = {
    "en": {
        "searchPlaceholder": "Which industry, cost or technical calculation do you need?",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — Free & premium industry calculators",
                "description": "Industry calculators for cost, scrap, margin, energy, construction and operations — free checks and premium decision summaries in one platform.",
            },
            "hero": {
                "highlight": "INDUSTRY CALCULATOR PLATFORM",
                "headline": "From production to industry — see your business-critical calculations in one place",
                "subtitle": "SectorCalc brings industry-specific calculators for production, workshops, field teams, logistics, energy and finance into one focused platform.",
                "supporting": "WITHOUT ERP COMPLEXITY — BUILT FOR SMALL AND MID-SIZE TEAMS",
                "ctaPrimary": "Free Calculators",
                "ctaSecondary": "Premium Calculators",
                "panelTitle": "What teams calculate first",
                "panelItems": {
                    "production": "Machine rate, OEE and scrap",
                    "industrial": "Quote margin and break-even",
                    "technical": "Torque, tolerance and cylinder force",
                    "construction": "Concrete, area and paint quantity",
                    "logistics": "Route cost and freight margin",
                    "energy": "kWh cost, leaks and carbon exposure",
                    "finance": "VAT, loans and payroll burden",
                    "scrapMargin": "Sheet scrap and margin leak",
                },
            },
            "coverage": {
                "title": "Industry calculators across your operation",
                "subtitle": "Browse by sector, calculation type or the decision you need to make — not by scattered spreadsheets.",
                "items": {
                    "production": {
                        "title": "Production & manufacturing",
                        "description": "Machine hour rate, OEE, cutting speed, scrap risk and shop-floor efficiency checks.",
                    },
                    "industrial": {
                        "title": "Industrial workshops",
                        "description": "Quote margin, break-even, repair quotes and product margin before you send the price.",
                    },
                    "technical": {
                        "title": "Technical & engineering",
                        "description": "Bolt torque, welded connections, tolerance stack-up and cylinder force for field-ready numbers.",
                    },
                    "construction": {
                        "title": "Construction & field",
                        "description": "Concrete volume, square meters, paint coverage and roofing area for project quantities.",
                    },
                    "logistics": {
                        "title": "Logistics & transport",
                        "description": "Route cost, fuel drift, deadhead exposure and delivery margin visibility.",
                    },
                    "energy": {
                        "title": "Energy & carbon",
                        "description": "kWh cost, compressor leaks, savings packages and CBAM carbon footprint checks.",
                    },
                    "finance": {
                        "title": "Finance & business",
                        "description": "VAT, loan payments, employee total cost and inventory carrying cost with EOQ.",
                    },
                    "foodRetail": {
                        "title": "Food & retail",
                        "description": "Menu margin, waste drift, inventory turnover and portion cost variance.",
                    },
                },
            },
            "differentiation": {
                "title": "Find the right industry calculator faster",
                "subtitle": "SectorCalc is organized for how operators actually search — by sector, by calculation type and by the decision on the table.",
                "columns": {
                    "bySector": {
                        "title": "By industry",
                        "text": "Open calculators aligned to manufacturing, construction, logistics, energy, food service and more.",
                    },
                    "byType": {
                        "title": "By calculation type",
                        "text": "Jump straight to cost, scrap, margin, energy, routing or measurement tools instead of rebuilding formulas.",
                    },
                    "byDecision": {
                        "title": "By decision moment",
                        "text": "Start with a free check, then open premium calculators when the quote, job or purchase needs a fuller summary.",
                    },
                },
            },
            "losses": {
                "title": "What uncalculated numbers hide",
                "items": {
                    "monetary": {
                        "title": "Money & margin",
                        "text": "Pricing gaps, quote drift and payroll burden that never show up in the first spreadsheet row.",
                    },
                    "material": {
                        "title": "Material & scrap",
                        "text": "Scrap drift, waste you cannot see and inventory loss between purchase and production.",
                    },
                    "time": {
                        "title": "Time & throughput",
                        "text": "Setup overruns, downtime cost and throughput loss that erode margin after the estimate looks fine.",
                    },
                    "energy": {
                        "title": "Energy & carbon",
                        "text": "Peak cost exposure, compressor leaks and carbon footprint pressure on export and compliance.",
                    },
                },
            },
            "freePremium": {
                "title": "Basic calculations are free. Fuller decision summaries are premium.",
                "freeTitle": "Free Calculators",
                "freeText": "Run fast sector checks in the browser with core inputs and visible risk signals.",
                "freeItems": {
                    "basic": "Core formulas and quick numbers",
                    "fast": "Results in seconds, no account required",
                    "category": "Browse by industry and calculation type",
                    "noSignup": "Explore without sign-up",
                },
                "freeCta": "Open free calculators",
                "premiumTitle": "Premium Calculators",
                "premiumText": "Add deeper inputs, scenario comparison and export-ready decision summaries when stakes rise.",
                "premiumItems": {
                    "inputs": "More inputs and professional defaults",
                    "scenario": "Scenario comparison before you commit",
                    "summary": "Decision summary with drivers and action",
                    "export": "PDF and CSV export when available",
                },
                "premiumCta": "Browse premium calculators",
            },
            "criticalTools": build_critical(
                CRITICAL_EN,
                "Coming soon",
                "Critical calculators teams open first",
                "High-intent industry calculators across production, quoting, engineering, construction, energy and finance.",
            ),
            "audiences": {
                "title": "Built for operators who need numbers before ERP",
                "items": {
                    "production": {
                        "title": "Production managers",
                        "text": "Check machine rate, OEE and scrap before accepting repeat jobs or repricing a line.",
                    },
                    "industrial": {
                        "title": "Workshop owners",
                        "text": "Quote margin, break-even and repair labor before the customer pushes on price.",
                    },
                    "engineering": {
                        "title": "Engineers & maintenance",
                        "text": "Torque, tolerance stack-up and cylinder force without opening a separate engineering notebook.",
                    },
                    "construction": {
                        "title": "Construction & trades",
                        "text": "Concrete, area, paint and roofing quantities before materials are ordered or the crew mobilizes.",
                    },
                    "logistics": {
                        "title": "Logistics teams",
                        "text": "Route and freight math when deadhead and fuel drift are eating the delivery margin.",
                    },
                    "finance": {
                        "title": "Finance & HR",
                        "text": "VAT, loan payment, employee total cost and inventory carrying cost for pricing and hiring calls.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "Why industry calculators instead of scattered Excel files?",
                "items": {
                    "formula": {
                        "title": "Formulas stay consistent",
                        "text": "Stop rebuilding the same margin, scrap and energy math across notebooks, chats and one-off tabs.",
                    },
                    "sector": {
                        "title": "Sector context is built in",
                        "text": "Inputs and labels match manufacturing, construction, logistics and energy work — not generic cells.",
                    },
                    "decision": {
                        "title": "Free checks upgrade to decision summaries",
                        "text": "Start with a quick number, then open premium calculators when the quote, job or purchase needs a fuller output.",
                    },
                },
                "closing": "SectorCalc keeps industry calculators visible, comparable and repeatable — without ERP rollout.",
            },
            "finalCta": {
                "title": "Open the industry calculator you need",
                "subtitle": "Start free, then move to premium calculators when the decision needs more inputs and a clearer summary.",
                "ctaPrimary": "Free Calculators",
                "ctaSecondary": "Premium Calculators",
            },
        },
    },
    "tr": {
        "searchPlaceholder": "Hangi sektör, maliyet veya teknik hesabı yapmak istiyorsunuz?",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — Ücretsiz ve premium sektör hesap makineleri",
                "description": "Maliyet, fire, marj, enerji, inşaat ve operasyon için sektöre özel hesap makineleri — ücretsiz kontroller ve premium karar özetleri tek platformda.",
            },
            "hero": {
                "highlight": "SEKTÖREL HESAP MAKİNESİ PLATFORMU",
                "headline": "Üretimden sanayiye, işletmenizin kritik hesaplarını tek yerde görün",
                "subtitle": "SectorCalc; üretim, atölye, saha, lojistik, enerji ve finans için sektöre özel hesap makinelerini tek platformda toplar.",
                "supporting": "ERP KARMAŞASI OLMADAN — KOBİ VE SAHA EKİPLERİ İÇİN",
                "ctaPrimary": "Ücretsiz Hesaplayıcılar",
                "ctaSecondary": "Premium Hesaplayıcılar",
                "panelTitle": "Ekipler önce bunları hesaplar",
                "panelItems": {
                    "production": "Makine saat ücreti, OEE ve fire",
                    "industrial": "Teklif marjı ve başabaş",
                    "technical": "Tork, tolerans ve silindir kuvveti",
                    "construction": "Beton, alan ve boya miktarı",
                    "logistics": "Rota maliyeti ve navlun marjı",
                    "energy": "kWh maliyeti, kaçak ve karbon maruziyeti",
                    "finance": "KDV, kredi ve bordro yükü",
                    "scrapMargin": "Sac fire ve marj kaçağı",
                },
            },
            "coverage": {
                "title": "Operasyonunuz boyunca sektörel hesap makineleri",
                "subtitle": "Dağınık tablolar yerine sektöre, hesap türüne veya vermeniz gereken karara göre gezinin.",
                "items": {
                    "production": {
                        "title": "Üretim ve imalat",
                        "description": "Makine saat ücreti, OEE, kesme hızı, fire riski ve atölye verimi kontrolleri.",
                    },
                    "industrial": {
                        "title": "Endüstriyel atölyeler",
                        "description": "Teklif marjı, başabaş, tamir teklifi ve ürün marjı — fiyat göndermeden önce.",
                    },
                    "technical": {
                        "title": "Teknik ve mühendislik",
                        "description": "Civata torku, kaynaklı bağlantı, tolerans yığılması ve silindir kuvveti için saha sayıları.",
                    },
                    "construction": {
                        "title": "İnşaat ve saha",
                        "description": "Beton hacmi, metrekare, boya kapsamı ve çatı alanı için proje miktarları.",
                    },
                    "logistics": {
                        "title": "Lojistik ve taşıma",
                        "description": "Rota maliyeti, yakıt sapması, boş dönüş maruziyeti ve teslimat marjı görünürlüğü.",
                    },
                    "energy": {
                        "title": "Enerji ve karbon",
                        "description": "kWh maliyeti, kompresör kaçakları, tasarruf paketleri ve SKDM karbon ayak izi kontrolleri.",
                    },
                    "finance": {
                        "title": "Finans ve işletme",
                        "description": "KDV, kredi taksiti, personel tam maliyeti ve EOQ ile stok taşıma maliyeti.",
                    },
                    "foodRetail": {
                        "title": "Gıda ve perakende",
                        "description": "Menü marjı, fire sapması, stok devir hızı ve porsiyon maliyet farkı.",
                    },
                },
            },
            "differentiation": {
                "title": "Doğru sektörel hesap makinesine daha hızlı ulaşın",
                "subtitle": "SectorCalc; operatörlerin gerçekten aradığı şekilde düzenlenir — sektöre, hesap türüne ve masadaki karara göre.",
                "columns": {
                    "bySector": {
                        "title": "Sektöre göre",
                        "text": "Üretim, inşaat, lojistik, enerji, gıda hizmeti ve daha fazlasına uygun hesap makinelerini açın.",
                    },
                    "byType": {
                        "title": "Hesap türüne göre",
                        "text": "Formülü yeniden kurmak yerine maliyet, fire, marj, enerji, rota veya ölçüm araçlarına doğrudan gidin.",
                    },
                    "byDecision": {
                        "title": "Karar anına göre",
                        "text": "Ücretsiz kontrolle başlayın; teklif, iş veya alım daha kritikleşince premium hesap makinelerini açın.",
                    },
                },
            },
            "losses": {
                "title": "Hesaplanmayan rakamların gizlediği kayıp",
                "items": {
                    "monetary": {
                        "title": "Para ve marj",
                        "text": "Fiyat boşlukları, teklif sapması ve bordro yükü — çoğu zaman ilk tablo satırında görünmez.",
                    },
                    "material": {
                        "title": "Malzeme ve fire",
                        "text": "Fire sapması, görünmeyen israf ve satın alma ile üretim arasındaki stok kaybı.",
                    },
                    "time": {
                        "title": "Zaman ve verim",
                        "text": "Setup aşımı, duruş maliyeti ve verim kaybı — tahmin iyi göründükten sonra marjı eritir.",
                    },
                    "energy": {
                        "title": "Enerji ve karbon",
                        "text": "Tepe yük maliyeti, kompresör kaçakları ve ihracat ile uyum baskısı altındaki karbon yükü.",
                    },
                },
            },
            "freePremium": {
                "title": "Temel hesaplamalar ücretsiz. Daha dolu karar özetleri premium.",
                "freeTitle": "Ücretsiz Hesaplayıcılar",
                "freeText": "Tarayıcıda temel girdiler ve görünür risk sinyalleriyle hızlı sektör kontrolleri yapın.",
                "freeItems": {
                    "basic": "Temel formüller ve hızlı sayılar",
                    "fast": "Saniyeler içinde sonuç, hesap gerekmez",
                    "category": "Sektör ve hesap türüne göre gezin",
                    "noSignup": "Kayıt olmadan keşfedin",
                },
                "freeCta": "Ücretsiz hesaplayıcıları aç",
                "premiumTitle": "Premium Hesaplayıcılar",
                "premiumText": "Karar kritikleşince daha fazla girdi, senaryo karşılaştırması ve dışa aktarılabilir karar özetleri ekleyin.",
                "premiumItems": {
                    "inputs": "Daha fazla girdi ve profesyonel varsayılanlar",
                    "scenario": "Taahhüt öncesi senaryo karşılaştırması",
                    "summary": "Sürücüler ve eylem içeren karar özeti",
                    "export": "Uygun olduğunda PDF ve CSV dışa aktarma",
                },
                "premiumCta": "Premium hesaplayıcıları incele",
            },
            "criticalTools": build_critical(
                CRITICAL_TR,
                "Yakında",
                "Ekiplerin önce açtığı kritik hesap makineleri",
                "Üretim, teklif, mühendislik, inşaat, enerji ve finans için yüksek niyetli sektörel hesap makineleri.",
            ),
            "audiences": {
                "title": "ERP öncesi sayıya ihtiyaç duyan ekipler için",
                "items": {
                    "production": {
                        "title": "Üretim yöneticileri",
                        "text": "Tekrarlayan işi kabul etmeden veya hattı yeniden fiyatlandırmadan önce makine ücreti, OEE ve fireyi kontrol edin.",
                    },
                    "industrial": {
                        "title": "Atölye sahipleri",
                        "text": "Müşteri fiyata bastırmadan önce teklif marjı, başabaş ve tamir işçiliğini hesaplayın.",
                    },
                    "engineering": {
                        "title": "Mühendisler ve bakım",
                        "text": "Ayrı bir mühendislik defteri açmadan tork, tolerans yığılması ve silindir kuvveti.",
                    },
                    "construction": {
                        "title": "İnşaat ve zanaat",
                        "text": "Malzeme siparişi veya ekip sahaya çıkmadan önce beton, alan, boya ve çatı miktarları.",
                    },
                    "logistics": {
                        "title": "Lojistik ekipleri",
                        "text": "Boş dönüş ve yakıt sapması teslimat marjını erittiğinde rota ve navlun hesabı.",
                    },
                    "finance": {
                        "title": "Finans ve İK",
                        "text": "Fiyatlandırma ve işe alım kararları için KDV, kredi taksiti, personel tam maliyeti ve stok taşıma maliyeti.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "Neden dağınık Excel dosyaları yerine sektörel hesap makineleri?",
                "items": {
                    "formula": {
                        "title": "Formüller tutarlı kalır",
                        "text": "Aynı marj, fire ve enerji hesabını defter, sohbet ve tek seferlik sekmeler arasında yeniden kurmayı bırakın.",
                    },
                    "sector": {
                        "title": "Sektör bağlamı hazırdır",
                        "text": "Girdiler ve etiketler üretim, inşaat, lojistik ve enerji işine uygun — genel hücrelere değil.",
                    },
                    "decision": {
                        "title": "Ücretsiz kontrolden karar özetine geçiş",
                        "text": "Hızlı bir sayıyla başlayın; teklif, iş veya alım daha fazla çıktı gerektirdiğinde premium hesap makinelerini açın.",
                    },
                },
                "closing": "SectorCalc sektörel hesap makinelerini ERP kurulumu olmadan görünür, karşılaştırılabilir ve tekrar edilebilir tutar.",
            },
            "finalCta": {
                "title": "İhtiyacınız olan sektörel hesap makinesini açın",
                "subtitle": "Ücretsiz başlayın; karar daha fazla girdi ve net özet gerektirdiğinde premium hesap makinelerine geçin.",
                "ctaPrimary": "Ücretsiz Hesaplayıcılar",
                "ctaSecondary": "Premium Hesaplayıcılar",
            },
        },
    },
    "de": {
        "searchPlaceholder": "Welche Branche, Kosten- oder Technikberechnung benötigen Sie?",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — Kostenlose und Premium-Branchenrechner",
                "description": "Branchenrechner für Kosten, Ausschuss, Marge, Energie, Bau und Betrieb — kostenlose Checks und Premium-Entscheidungszusammenfassungen auf einer Plattform.",
            },
            "hero": {
                "highlight": "BRANCHENRECHNER-PLATTFORM",
                "headline": "Von der Produktion bis zur Industrie — kritische Betriebsrechnungen an einem Ort",
                "subtitle": "SectorCalc bündelt branchenspezifische Rechner für Produktion, Werkstatt, Baustelle, Logistik, Energie und Finanzen auf einer fokussierten Plattform.",
                "supporting": "OHNE ERP-KOMPLEXITÄT — FÜR KMU UND FELDTEAMS",
                "ctaPrimary": "Kostenlose Rechner",
                "ctaSecondary": "Premium-Rechner",
                "panelTitle": "Was Teams zuerst berechnen",
                "panelItems": {
                    "production": "Maschinenstundensatz, OEE und Ausschuss",
                    "industrial": "Angebotsmarge und Break-even",
                    "technical": "Drehmoment, Toleranz und Zylinderkraft",
                    "construction": "Beton, Fläche und Lackmenge",
                    "logistics": "Routenkosten und Frachtmarge",
                    "energy": "kWh-Kosten, Lecks und CO₂-Exposition",
                    "finance": "MwSt., Kredit und Personalkosten",
                    "scrapMargin": "Blechausschuss und Margenleck",
                },
            },
            "coverage": {
                "title": "Branchenrechner für Ihren Betrieb",
                "subtitle": "Stöbern Sie nach Branche, Berechnungstyp oder Entscheidung — nicht nach verstreuten Tabellen.",
                "items": {
                    "production": {
                        "title": "Produktion & Fertigung",
                        "description": "Maschinenstundensatz, OEE, Schnittgeschwindigkeit, Ausschussrisiko und Shopfloor-Effizienz.",
                    },
                    "industrial": {
                        "title": "Industrielle Werkstätten",
                        "description": "Angebotsmarge, Break-even, Reparaturangebot und Produktmarge vor dem Preisversand.",
                    },
                    "technical": {
                        "title": "Technik & Engineering",
                        "description": "Schraubendrehmoment, Schweißverbindungen, Toleranzstapel und Zylinderkraft für belastbare Zahlen.",
                    },
                    "construction": {
                        "title": "Bau & Baustelle",
                        "description": "Betonvolumen, Quadratmeter, Lackdeckung und Dachfläche für Projektmengen.",
                    },
                    "logistics": {
                        "title": "Logistik & Transport",
                        "description": "Routenkosten, Kraftstoffabweichung, Leerfahrt und Liefermargen-Sichtbarkeit.",
                    },
                    "energy": {
                        "title": "Energie & Kohlenstoff",
                        "description": "kWh-Kosten, Kompressorlecks, Einsparpakete und CBAM-CO₂-Fußabdruck.",
                    },
                    "finance": {
                        "title": "Finanzen & Betrieb",
                        "description": "MwSt., Kreditrate, Gesamtpersonalkosten und Lagerhaltungskosten mit EOQ.",
                    },
                    "foodRetail": {
                        "title": "Lebensmittel & Handel",
                        "description": "Menümarge, Abfallabweichung, Lagerumschlag und Portionskostenvarianz.",
                    },
                },
            },
            "differentiation": {
                "title": "Schneller zum richtigen Branchenrechner",
                "subtitle": "SectorCalc ist so organisiert, wie Betriebe wirklich suchen — nach Branche, Berechnungstyp und Entscheidungsmoment.",
                "columns": {
                    "bySector": {
                        "title": "Nach Branche",
                        "text": "Rechner für Fertigung, Bau, Logistik, Energie, Gastronomie und mehr öffnen.",
                    },
                    "byType": {
                        "title": "Nach Berechnungstyp",
                        "text": "Direkt zu Kosten-, Ausschuss-, Margen-, Energie-, Routen- oder Messrechnern statt Formeln neu zu bauen.",
                    },
                    "byDecision": {
                        "title": "Nach Entscheidungsmoment",
                        "text": "Mit einem kostenlosen Check starten, Premium-Rechner öffnen, wenn Angebot, Auftrag oder Einkauf mehr Tiefe braucht.",
                    },
                },
            },
            "losses": {
                "title": "Was unberechnete Zahlen verbergen",
                "items": {
                    "monetary": {
                        "title": "Geld & Marge",
                        "text": "Preislücken, Angebotsabweichung und Personalkosten, die in der ersten Tabellenzeile fehlen.",
                    },
                    "material": {
                        "title": "Material & Ausschuss",
                        "text": "Ausschussdrift, unsichtbarer Abfall und Bestandsverlust zwischen Einkauf und Produktion.",
                    },
                    "time": {
                        "title": "Zeit & Durchsatz",
                        "text": "Rüstüberläufe, Stillstandskosten und Durchsatzverlust nach einem guten Erstkalkül.",
                    },
                    "energy": {
                        "title": "Energie & Kohlenstoff",
                        "text": "Spitzenlastexposition, Kompressorlecks und CO₂-Druck bei Export und Compliance.",
                    },
                },
            },
            "freePremium": {
                "title": "Grundrechnungen sind kostenlos. Vollere Entscheidungszusammenfassungen sind Premium.",
                "freeTitle": "Kostenlose Rechner",
                "freeText": "Schnelle Branchenchecks im Browser mit Kerninputs und sichtbaren Risikosignalen.",
                "freeItems": {
                    "basic": "Kernformeln und schnelle Zahlen",
                    "fast": "Ergebnisse in Sekunden, kein Konto nötig",
                    "category": "Nach Branche und Berechnungstyp browsen",
                    "noSignup": "Ohne Anmeldung erkunden",
                },
                "freeCta": "Kostenlose Rechner öffnen",
                "premiumTitle": "Premium-Rechner",
                "premiumText": "Mehr Inputs, Szenariovergleich und exportfertige Entscheidungszusammenfassungen, wenn der Einsatz steigt.",
                "premiumItems": {
                    "inputs": "Mehr Inputs und professionelle Defaults",
                    "scenario": "Szenariovergleich vor der Festlegung",
                    "summary": "Entscheidungszusammenfassung mit Treibern und Maßnahme",
                    "export": "PDF- und CSV-Export, wenn verfügbar",
                },
                "premiumCta": "Premium-Rechner ansehen",
            },
            "criticalTools": build_critical(
                CRITICAL_DE,
                "Demnächst",
                "Kritische Rechner, die Teams zuerst öffnen",
                "Branchenrechner mit hoher Absicht für Produktion, Angebot, Technik, Bau, Energie und Finanzen.",
            ),
            "audiences": {
                "title": "Für Betriebe, die Zahlen vor ERP brauchen",
                "items": {
                    "production": {
                        "title": "Produktionsleiter",
                        "text": "Maschinenstundensatz, OEE und Ausschuss prüfen, bevor Wiederholaufträge angenommen werden.",
                    },
                    "industrial": {
                        "title": "Werkstattinhaber",
                        "text": "Angebotsmarge, Break-even und Reparaturarbeit vor dem Preisdruck des Kunden.",
                    },
                    "engineering": {
                        "title": "Ingenieure & Instandhaltung",
                        "text": "Drehmoment, Toleranzstapel und Zylinderkraft ohne separates Engineering-Notizbuch.",
                    },
                    "construction": {
                        "title": "Bau & Handwerk",
                        "text": "Beton-, Flächen-, Lack- und Dachmengen vor Materialbestellung oder Crew-Mobilisierung.",
                    },
                    "logistics": {
                        "title": "Logistikteams",
                        "text": "Routen- und Frachtrechnung, wenn Leerfahrt und Kraftstoff die Liefermarge fressen.",
                    },
                    "finance": {
                        "title": "Finanzen & Personal",
                        "text": "MwSt., Kreditrate, Gesamtpersonalkosten und Lagerhaltungskosten für Preis- und Einstellungsentscheidungen.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "Warum Branchenrechner statt verstreuter Excel-Dateien?",
                "items": {
                    "formula": {
                        "title": "Formeln bleiben konsistent",
                        "text": "Stoppen Sie, dieselbe Margen-, Ausschuss- und Energierechnung in Notizen und Einzeltabs neu zu bauen.",
                    },
                    "sector": {
                        "title": "Branchenkontext ist eingebaut",
                        "text": "Inputs und Labels passen zu Fertigung, Bau, Logistik und Energie — nicht zu generischen Zellen.",
                    },
                    "decision": {
                        "title": "Vom kostenlosen Check zur Entscheidungszusammenfassung",
                        "text": "Mit einer schnellen Zahl starten, Premium-Rechner öffnen, wenn Angebot, Auftrag oder Einkauf mehr Output braucht.",
                    },
                },
                "closing": "SectorCalc hält Branchenrechner sichtbar, vergleichbar und wiederholbar — ohne ERP-Rollout.",
            },
            "finalCta": {
                "title": "Öffnen Sie den Branchenrechner, den Sie brauchen",
                "subtitle": "Kostenlos starten, zu Premium-Rechnern wechseln, wenn die Entscheidung mehr Inputs und eine klarere Zusammenfassung braucht.",
                "ctaPrimary": "Kostenlose Rechner",
                "ctaSecondary": "Premium-Rechner",
            },
        },
    },
    "fr": {
        "searchPlaceholder": "Quel secteur, coût ou calcul technique recherchez-vous ?",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — Calculateurs sectoriels gratuits et premium",
                "description": "Calculateurs pour coûts, rebut, marge, énergie, construction et opérations — contrôles gratuits et résumés de décision premium sur une plateforme.",
            },
            "hero": {
                "highlight": "PLATEFORME DE CALCULATEURS SECTORIELS",
                "headline": "De la production à l'industrie — voyez vos calculs critiques au même endroit",
                "subtitle": "SectorCalc regroupe des calculateurs sectoriels pour production, atelier, chantier, logistique, énergie et finance sur une plateforme ciblée.",
                "supporting": "SANS COMPLEXITÉ ERP — POUR PME ET ÉQUIPES TERRAIN",
                "ctaPrimary": "Calculateurs gratuits",
                "ctaSecondary": "Calculateurs premium",
                "panelTitle": "Ce que les équipes calculent en premier",
                "panelItems": {
                    "production": "Taux machine, TRS et rebut",
                    "industrial": "Marge devis et seuil de rentabilité",
                    "technical": "Couple, tolérance et force cylindre",
                    "construction": "Béton, surface et quantité peinture",
                    "logistics": "Coût route et marge fret",
                    "energy": "Coût kWh, fuites et exposition carbone",
                    "finance": "TVA, crédit et charge paie",
                    "scrapMargin": "Rebut tôle et fuite de marge",
                },
            },
            "coverage": {
                "title": "Calculateurs sectoriels sur toute votre activité",
                "subtitle": "Parcourez par secteur, type de calcul ou décision à prendre — pas par fichiers Excel éparpillés.",
                "items": {
                    "production": {
                        "title": "Production & fabrication",
                        "description": "Taux horaire machine, TRS, vitesse de coupe, risque rebut et efficacité atelier.",
                    },
                    "industrial": {
                        "title": "Ateliers industriels",
                        "description": "Marge devis, seuil de rentabilité, devis réparation et marge produit avant l'envoi du prix.",
                    },
                    "technical": {
                        "title": "Technique & ingénierie",
                        "description": "Couple de serrage, connexions soudées, empilement de tolérances et force cylindre pour des chiffres terrain.",
                    },
                    "construction": {
                        "title": "Construction & chantier",
                        "description": "Volume béton, mètres carrés, couverture peinture et surface toiture pour les quantités projet.",
                    },
                    "logistics": {
                        "title": "Logistique & transport",
                        "description": "Coût route, dérive carburant, trajets à vide et visibilité marge livraison.",
                    },
                    "energy": {
                        "title": "Énergie & carbone",
                        "description": "Coût kWh, fuites compresseur, packages d'économies et empreinte carbone CBAM.",
                    },
                    "finance": {
                        "title": "Finance & entreprise",
                        "description": "TVA, mensualité crédit, coût total employé et coût de détention stock avec EOQ.",
                    },
                    "foodRetail": {
                        "title": "Alimentation & retail",
                        "description": "Marge menu, dérive gaspillage, rotation stocks et variance coût portion.",
                    },
                },
            },
            "differentiation": {
                "title": "Trouvez plus vite le bon calculateur sectoriel",
                "subtitle": "SectorCalc est organisé comme les opérateurs cherchent — par secteur, type de calcul et moment de décision.",
                "columns": {
                    "bySector": {
                        "title": "Par secteur",
                        "text": "Ouvrez des calculateurs alignés sur fabrication, construction, logistique, énergie, restauration et plus.",
                    },
                    "byType": {
                        "title": "Par type de calcul",
                        "text": "Accédez directement aux outils coût, rebut, marge, énergie, route ou mesure au lieu de reconstruire des formules.",
                    },
                    "byDecision": {
                        "title": "Par moment de décision",
                        "text": "Commencez par un contrôle gratuit, ouvrez les calculateurs premium quand le devis, le chantier ou l'achat exige plus de profondeur.",
                    },
                },
            },
            "losses": {
                "title": "Ce que les chiffres non calculés cachent",
                "items": {
                    "monetary": {
                        "title": "Argent & marge",
                        "text": "Écarts de prix, dérive devis et charge paie absents de la première ligne du tableur.",
                    },
                    "material": {
                        "title": "Matériau & rebut",
                        "text": "Dérive rebut, déchets invisibles et perte stock entre achat et production.",
                    },
                    "time": {
                        "title": "Temps & débit",
                        "text": "Dépassements préparation, coût d'arrêt et perte de débit après un devis rassurant.",
                    },
                    "energy": {
                        "title": "Énergie & carbone",
                        "text": "Exposition pic de demande, fuites compresseur et pression carbone export et conformité.",
                    },
                },
            },
            "freePremium": {
                "title": "Les calculs de base sont gratuits. Les résumés de décision complets sont premium.",
                "freeTitle": "Calculateurs gratuits",
                "freeText": "Contrôles sectoriels rapides dans le navigateur avec entrées essentielles et signaux de risque visibles.",
                "freeItems": {
                    "basic": "Formules essentielles et chiffres rapides",
                    "fast": "Résultats en secondes, sans compte",
                    "category": "Parcourir par secteur et type de calcul",
                    "noSignup": "Explorer sans inscription",
                },
                "freeCta": "Ouvrir les calculateurs gratuits",
                "premiumTitle": "Calculateurs premium",
                "premiumText": "Ajoutez plus d'entrées, comparaison de scénarios et résumés exportables quand l'enjeu monte.",
                "premiumItems": {
                    "inputs": "Plus d'entrées et valeurs par défaut pro",
                    "scenario": "Comparaison de scénarios avant engagement",
                    "summary": "Résumé de décision avec leviers et action",
                    "export": "Export PDF et CSV quand disponible",
                },
                "premiumCta": "Voir les calculateurs premium",
            },
            "criticalTools": build_critical(
                CRITICAL_FR,
                "Bientôt",
                "Calculateurs critiques ouverts en premier",
                "Calculateurs sectoriels à forte intention pour production, devis, ingénierie, construction, énergie et finance.",
            ),
            "audiences": {
                "title": "Pour les équipes qui ont besoin de chiffres avant l'ERP",
                "items": {
                    "production": {
                        "title": "Responsables production",
                        "text": "Vérifier taux machine, TRS et rebut avant d'accepter des jobs répétitifs ou de repricer une ligne.",
                    },
                    "industrial": {
                        "title": "Propriétaires d'atelier",
                        "text": "Marge devis, seuil de rentabilité et main-d'œuvre réparation avant la pression prix client.",
                    },
                    "engineering": {
                        "title": "Ingénieurs & maintenance",
                        "text": "Couple, empilement tolérances et force cylindre sans carnet d'ingénierie séparé.",
                    },
                    "construction": {
                        "title": "Construction & métiers",
                        "text": "Quantités béton, surface, peinture et toiture avant commande matériaux ou mobilisation équipe.",
                    },
                    "logistics": {
                        "title": "Équipes logistique",
                        "text": "Calcul route et fret quand trajets à vide et carburant grignotent la marge livraison.",
                    },
                    "finance": {
                        "title": "Finance & RH",
                        "text": "TVA, mensualité crédit, coût total employé et coût détention stock pour prix et recrutement.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "Pourquoi des calculateurs sectoriels plutôt que des Excel éparpillés ?",
                "items": {
                    "formula": {
                        "title": "Formules cohérentes",
                        "text": "Arrêtez de reconstruire la même marge, rebut et énergie entre notes, chats et onglets isolés.",
                    },
                    "sector": {
                        "title": "Contexte sectoriel intégré",
                        "text": "Entrées et libellés adaptés à fabrication, construction, logistique et énergie — pas des cellules génériques.",
                    },
                    "decision": {
                        "title": "Du contrôle gratuit au résumé de décision",
                        "text": "Commencez par un chiffre rapide, ouvrez les calculateurs premium quand devis, chantier ou achat exige plus de sortie.",
                    },
                },
                "closing": "SectorCalc rend les calculateurs sectoriels visibles, comparables et reproductibles — sans déploiement ERP.",
            },
            "finalCta": {
                "title": "Ouvrez le calculateur sectoriel dont vous avez besoin",
                "subtitle": "Commencez gratuitement, passez aux calculateurs premium quand la décision demande plus d'entrées et un résumé plus clair.",
                "ctaPrimary": "Calculateurs gratuits",
                "ctaSecondary": "Calculateurs premium",
            },
        },
    },
    "es": {
        "searchPlaceholder": "¿Qué sector, costo o cálculo técnico necesita?",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — Calculadoras sectoriales gratuitas y premium",
                "description": "Calculadoras para costos, desperdicio, margen, energía, construcción y operaciones — controles gratuitos y resúmenes de decisión premium en una plataforma.",
            },
            "hero": {
                "highlight": "PLATAFORMA DE CALCULADORAS SECTORIALES",
                "headline": "De la producción a la industria — vea sus cálculos críticos en un solo lugar",
                "subtitle": "SectorCalc reúne calculadoras sectoriales para producción, taller, obra, logística, energía y finanzas en una plataforma enfocada.",
                "supporting": "SIN COMPLEJIDAD ERP — PARA PYMES Y EQUIPOS DE CAMPO",
                "ctaPrimary": "Calculadoras gratuitas",
                "ctaSecondary": "Calculadoras premium",
                "panelTitle": "Lo que los equipos calculan primero",
                "panelItems": {
                    "production": "Tarifa máquina, OEE y desperdicio",
                    "industrial": "Margen de cotización y punto de equilibrio",
                    "technical": "Torque, tolerancia y fuerza de cilindro",
                    "construction": "Hormigón, área y cantidad de pintura",
                    "logistics": "Costo de ruta y margen de flete",
                    "energy": "Costo kWh, fugas y exposición al carbono",
                    "finance": "IVA, préstamo y carga de nómina",
                    "scrapMargin": "Desperdicio de chapa y fuga de margen",
                },
            },
            "coverage": {
                "title": "Calculadoras sectoriales en toda su operación",
                "subtitle": "Explore por sector, tipo de cálculo o decisión pendiente — no por hojas de cálculo dispersas.",
                "items": {
                    "production": {
                        "title": "Producción y fabricación",
                        "description": "Tarifa horaria de máquina, OEE, velocidad de corte, riesgo de desperdicio y eficiencia de planta.",
                    },
                    "industrial": {
                        "title": "Talleres industriales",
                        "description": "Margen de cotización, punto de equilibrio, cotización de reparación y margen de producto antes de enviar el precio.",
                    },
                    "technical": {
                        "title": "Técnica e ingeniería",
                        "description": "Torque de apriete, conexiones soldadas, acumulación de tolerancias y fuerza de cilindro para números de campo.",
                    },
                    "construction": {
                        "title": "Construcción y obra",
                        "description": "Volumen de hormigón, metros cuadrados, cobertura de pintura y área de cubierta para cantidades de proyecto.",
                    },
                    "logistics": {
                        "title": "Logística y transporte",
                        "description": "Costo de ruta, deriva de combustible, viajes en vacío y visibilidad del margen de entrega.",
                    },
                    "energy": {
                        "title": "Energía y carbono",
                        "description": "Costo kWh, fugas de compresor, paquetes de ahorro y huella de carbono CBAM.",
                    },
                    "finance": {
                        "title": "Finanzas y negocio",
                        "description": "IVA, cuota de préstamo, costo total del empleado y costo de mantenimiento de inventario con EOQ.",
                    },
                    "foodRetail": {
                        "title": "Alimentación y retail",
                        "description": "Margen de menú, deriva de desperdicio, rotación de inventario y variación de costo por porción.",
                    },
                },
            },
            "differentiation": {
                "title": "Encuentre más rápido la calculadora sectorial correcta",
                "subtitle": "SectorCalc está organizado como buscan los operadores — por sector, tipo de cálculo y momento de decisión.",
                "columns": {
                    "bySector": {
                        "title": "Por sector",
                        "text": "Abra calculadoras alineadas con fabricación, construcción, logística, energía, restauración y más.",
                    },
                    "byType": {
                        "title": "Por tipo de cálculo",
                        "text": "Vaya directo a herramientas de costo, desperdicio, margen, energía, ruta o medición en lugar de reconstruir fórmulas.",
                    },
                    "byDecision": {
                        "title": "Por momento de decisión",
                        "text": "Empiece con un control gratuito y abra calculadoras premium cuando la cotización, el trabajo o la compra exija más profundidad.",
                    },
                },
            },
            "losses": {
                "title": "Lo que ocultan los números no calculados",
                "items": {
                    "monetary": {
                        "title": "Dinero y margen",
                        "text": "Brechas de precio, deriva de cotización y carga de nómina que no aparecen en la primera fila de la hoja.",
                    },
                    "material": {
                        "title": "Material y desperdicio",
                        "text": "Deriva de desperdicio, merma invisible y pérdida de inventario entre compra y producción.",
                    },
                    "time": {
                        "title": "Tiempo y rendimiento",
                        "text": "Excesos de preparación, costo de parada y pérdida de rendimiento después de un presupuesto optimista.",
                    },
                    "energy": {
                        "title": "Energía y carbono",
                        "text": "Exposición a picos de demanda, fugas de compresor y presión de huella de carbono en exportación y cumplimiento.",
                    },
                },
            },
            "freePremium": {
                "title": "Los cálculos básicos son gratuitos. Los resúmenes de decisión completos son premium.",
                "freeTitle": "Calculadoras gratuitas",
                "freeText": "Controles sectoriales rápidos en el navegador con entradas esenciales y señales de riesgo visibles.",
                "freeItems": {
                    "basic": "Fórmulas esenciales y números rápidos",
                    "fast": "Resultados en segundos, sin cuenta",
                    "category": "Explorar por sector y tipo de cálculo",
                    "noSignup": "Explorar sin registro",
                },
                "freeCta": "Abrir calculadoras gratuitas",
                "premiumTitle": "Calculadoras premium",
                "premiumText": "Añada más entradas, comparación de escenarios y resúmenes exportables cuando aumente el riesgo.",
                "premiumItems": {
                    "inputs": "Más entradas y valores predeterminados profesionales",
                    "scenario": "Comparación de escenarios antes de comprometerse",
                    "summary": "Resumen de decisión con impulsores y acción",
                    "export": "Exportación PDF y CSV cuando esté disponible",
                },
                "premiumCta": "Ver calculadoras premium",
            },
            "criticalTools": build_critical(
                CRITICAL_ES,
                "Próximamente",
                "Calculadoras críticas que los equipos abren primero",
                "Calculadoras sectoriales de alta intención para producción, cotización, ingeniería, construcción, energía y finanzas.",
            ),
            "audiences": {
                "title": "Para equipos que necesitan números antes del ERP",
                "items": {
                    "production": {
                        "title": "Responsables de producción",
                        "text": "Revise tarifa de máquina, OEE y desperdicio antes de aceptar trabajos repetidos o repricing de línea.",
                    },
                    "industrial": {
                        "title": "Dueños de taller",
                        "text": "Margen de cotización, punto de equilibrio y mano de obra de reparación antes de la presión de precio del cliente.",
                    },
                    "engineering": {
                        "title": "Ingenieros y mantenimiento",
                        "text": "Torque, acumulación de tolerancias y fuerza de cilindro sin un cuaderno de ingeniería aparte.",
                    },
                    "construction": {
                        "title": "Construcción y oficios",
                        "text": "Cantidades de hormigón, área, pintura y cubierta antes de pedir materiales o movilizar la cuadrilla.",
                    },
                    "logistics": {
                        "title": "Equipos de logística",
                        "text": "Cálculo de ruta y flete cuando viajes en vacío y combustible comen el margen de entrega.",
                    },
                    "finance": {
                        "title": "Finanzas y RR. HH.",
                        "text": "IVA, cuota de préstamo, costo total del empleado y costo de mantenimiento de inventario para precios y contratación.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "¿Por qué calculadoras sectoriales en lugar de Excel dispersos?",
                "items": {
                    "formula": {
                        "title": "Fórmulas consistentes",
                        "text": "Deje de reconstruir la misma matemática de margen, desperdicio y energía entre notas, chats y pestañas sueltas.",
                    },
                    "sector": {
                        "title": "Contexto sectorial integrado",
                        "text": "Entradas y etiquetas adaptadas a fabricación, construcción, logística y energía — no celdas genéricas.",
                    },
                    "decision": {
                        "title": "Del control gratuito al resumen de decisión",
                        "text": "Empiece con un número rápido y abra calculadoras premium cuando la cotización, el trabajo o la compra necesite más salida.",
                    },
                },
                "closing": "SectorCalc mantiene las calculadoras sectoriales visibles, comparables y repetibles — sin despliegue ERP.",
            },
            "finalCta": {
                "title": "Abra la calculadora sectorial que necesita",
                "subtitle": "Empiece gratis y pase a calculadoras premium cuando la decisión requiera más entradas y un resumen más claro.",
                "ctaPrimary": "Calculadoras gratuitas",
                "ctaSecondary": "Calculadoras premium",
            },
        },
    },
    "ar": {
        "searchPlaceholder": "أي قطاع أو تكلفة أو حساب تقني تحتاجه؟",
        "homepageHybrid": {
            "meta": {
                "title": "SectorCalc — حاسبات قطاعية مجانية ومميزة",
                "description": "حاسبات للتكاليف والهدر والهامش والطاقة والبناء والعمليات — فحوصات مجانية وملخصات قرار مميزة في منصة واحدة.",
            },
            "hero": {
                "highlight": "منصة الحاسبات القطاعية",
                "headline": "من الإنتاج إلى الصناعة — اعرض حساباتك الحرجة في مكان واحد",
                "subtitle": "يجمع SectorCalc حاسبات قطاعية للإنتاج والورشة والموقع والخدمات اللوجستية والطاقة والمالية في منصة مركّزة.",
                "supporting": "بدون تعقيد ERP — للفرق الصغيرة والمتوسطة وفرق الميدان",
                "ctaPrimary": "حاسبات مجانية",
                "ctaSecondary": "حاسبات مميزة",
                "panelTitle": "ما يحسبه الفريق أولاً",
                "panelItems": {
                    "production": "سعر ساعة الآلة وOEE والهدر",
                    "industrial": "هامش العرض ونقطة التعادل",
                    "technical": "عزم الدوران والتسامح وقوة الأسطوانة",
                    "construction": "الخرسانة والمساحة وكمية الدهان",
                    "logistics": "تكلفة المسار وهامش الشحن",
                    "energy": "تكلفة kWh والتسريبات والتعرض للكربون",
                    "finance": "ضريبة القيمة المضافة والقرض وعبء الرواتب",
                    "scrapMargin": "هدر الصفائح وتسرب الهامش",
                },
            },
            "coverage": {
                "title": "حاسبات قطاعية عبر عملياتك",
                "subtitle": "تصفّح حسب القطاع أو نوع الحساب أو القرار المطلوب — لا حسب جداول متفرقة.",
                "items": {
                    "production": {
                        "title": "الإنتاج والتصنيع",
                        "description": "سعر ساعة الآلة وOEE وسرعة القطع ومخاطر الهدر وكفاءة خط الإنتاج.",
                    },
                    "industrial": {
                        "title": "الورش الصناعية",
                        "description": "هامش العرض ونقطة التعادل وعرض الإصلاح وهامش المنتج قبل إرسال السعر.",
                    },
                    "technical": {
                        "title": "التقنية والهندسة",
                        "description": "عزم شد البراغي والوصلات الملحومة وتراكم التسامحات وقوة الأسطوانة لأرقام ميدانية.",
                    },
                    "construction": {
                        "title": "البناء والموقع",
                        "description": "حجم الخرسانة والمتر المربع وتغطية الدهان ومساحة السقف لكميات المشروع.",
                    },
                    "logistics": {
                        "title": "الخدمات اللوجستية والنقل",
                        "description": "تكلفة المسار وانحراف الوقود والرحلات الفارغة ووضوح هامش التسليم.",
                    },
                    "energy": {
                        "title": "الطاقة والكربون",
                        "description": "تكلفة kWh وتسريبات الضاغط وحزم التوفير وبصمة الكربون وفق CBAM.",
                    },
                    "finance": {
                        "title": "المالية والأعمال",
                        "description": "ضريبة القيمة المضافة وقسط القرض والتكلفة الإجمالية للموظف وتكلفة حمل المخزون مع EOQ.",
                    },
                    "foodRetail": {
                        "title": "الأغذية والتجزئة",
                        "description": "هامش القائمة وانحراف الهدر ودوران المخزون وتباين تكلفة الحصة.",
                    },
                },
            },
            "differentiation": {
                "title": "اعثر أسرع على الحاسبة القطاعية المناسبة",
                "subtitle": "ينظم SectorCalc البحث كما يبحث المشغّلون — حسب القطاع ونوع الحساب ولحظة القرار.",
                "columns": {
                    "bySector": {
                        "title": "حسب القطاع",
                        "text": "افتح حاسبات تناسب التصنيع والبناء والخدمات اللوجستية والطاقة والمطاعم والمزيد.",
                    },
                    "byType": {
                        "title": "حسب نوع الحساب",
                        "text": "انتقل مباشرة إلى أدوات التكلفة والهدر والهامش والطاقة والمسار أو القياس بدل إعادة بناء الصيغ.",
                    },
                    "byDecision": {
                        "title": "حسب لحظة القرار",
                        "text": "ابدأ بفحص مجاني ثم افتح الحاسبات المميزة عندما يحتاج العرض أو العمل أو الشراء إلى مزيد من العمق.",
                    },
                },
            },
            "losses": {
                "title": "ما تخفيه الأرقام غير المحسوبة",
                "items": {
                    "monetary": {
                        "title": "المال والهامش",
                        "text": "فجوات التسعير وانحراف العرض وعبء الرواتب التي لا تظهر في الصف الأول من الجدول.",
                    },
                    "material": {
                        "title": "المواد والهدر",
                        "text": "انحراف الهدر والفاقد غير المرئي وفقدان المخزون بين الشراء والإنتاج.",
                    },
                    "time": {
                        "title": "الوقت والإنتاجية",
                        "text": "تجاوز الإعداد وتكلفة التوقف وفقدان الإنتاجية بعد تقدير يبدو جيداً.",
                    },
                    "energy": {
                        "title": "الطاقة والكربون",
                        "text": "تعرض ذروة الطلب وتسريبات الضاغط وضغط البصمة الكربونية في التصدير والامتثال.",
                    },
                },
            },
            "freePremium": {
                "title": "الحسابات الأساسية مجانية. ملخصات القرار الأكمل مميزة.",
                "freeTitle": "حاسبات مجانية",
                "freeText": "فحوصات قطاعية سريعة في المتصفح بمدخلات أساسية وإشارات مخاطر واضحة.",
                "freeItems": {
                    "basic": "صيغ أساسية وأرقام سريعة",
                    "fast": "نتائج خلال ثوانٍ دون حساب",
                    "category": "تصفح حسب القطاع ونوع الحساب",
                    "noSignup": "استكشف دون تسجيل",
                },
                "freeCta": "افتح الحاسبات المجانية",
                "premiumTitle": "حاسبات مميزة",
                "premiumText": "أضف مدخلات أعمق ومقارنة سيناريوهات وملخصات قرار قابلة للتصدير عندما يرتفع المخاطر.",
                "premiumItems": {
                    "inputs": "مدخلات أكثر وقيم افتراضية احترافية",
                    "scenario": "مقارنة السيناريوهات قبل الالتزام",
                    "summary": "ملخص قرار مع محركات وإجراء مقترح",
                    "export": "تصدير PDF وCSV عند التوفر",
                },
                "premiumCta": "استعرض الحاسبات المميزة",
            },
            "criticalTools": build_critical(
                CRITICAL_AR,
                "قريباً",
                "الحاسبات الحرجة التي يفتحها الفريق أولاً",
                "حاسبات قطاعية عالية النية للإنتاج والتسعير والهندسة والبناء والطاقة والمالية.",
            ),
            "audiences": {
                "title": "للفرق التي تحتاج أرقاماً قبل ERP",
                "items": {
                    "production": {
                        "title": "مديرو الإنتاج",
                        "text": "راجع سعر الآلة وOEE والهدر قبل قبول أعمال متكررة أو إعادة تسعير الخط.",
                    },
                    "industrial": {
                        "title": "أصحاب الورش",
                        "text": "هامش العرض ونقطة التعادل وعمالة الإصلاح قبل ضغط العميل على السعر.",
                    },
                    "engineering": {
                        "title": "المهندسون والصيانة",
                        "text": "عزم الدوران وتراكم التسامحات وقوة الأسطوانة دون دفتر هندسة منفصل.",
                    },
                    "construction": {
                        "title": "البناء والحرف",
                        "text": "كميات الخرسانة والمساحة والدهان والسقف قبل طلب المواد أو تحريك الطاقم.",
                    },
                    "logistics": {
                        "title": "فرق الخدمات اللوجستية",
                        "text": "حساب المسار والشحن عندما تلتهم الرحلات الفارغة والوقود هامش التسليم.",
                    },
                    "finance": {
                        "title": "المالية والموارد البشرية",
                        "text": "ضريبة القيمة المضافة وقسط القرض والتكلفة الإجمالية للموظف وتكلفة حمل المخزون للتسعير والتوظيف.",
                    },
                },
            },
            "whyNotExcel": {
                "title": "لماذا حاسبات قطاعية بدلاً من ملفات Excel متفرقة؟",
                "items": {
                    "formula": {
                        "title": "صيغ متسقة",
                        "text": "توقف عن إعادة بناء نفس حساب الهامش والهدر والطاقة بين الملاحظات والمحادثات والأوراق المنفصلة.",
                    },
                    "sector": {
                        "title": "سياق قطاعي مدمج",
                        "text": "مدخلات وتسميات تناسب التصنيع والبناء والخدمات اللوجستية والطاقة — لا خلايا عامة.",
                    },
                    "decision": {
                        "title": "من الفحص المجاني إلى ملخص القرار",
                        "text": "ابدأ برقم سريع ثم افتح الحاسبات المميزة عندما يحتاج العرض أو العمل أو الشراء إلى مخرجات أوسع.",
                    },
                },
                "closing": "يحافظ SectorCalc على الحاسبات القطاعية مرئية وقابلة للمقارنة والتكرار — دون نشر ERP.",
            },
            "finalCta": {
                "title": "افتح الحاسبة القطاعية التي تحتاجها",
                "subtitle": "ابدأ مجاناً ثم انتقل إلى الحاسبات المميزة عندما يتطلب القرار مدخلات أكثر وملخصاً أوضح.",
                "ctaPrimary": "حاسبات مجانية",
                "ctaSecondary": "حاسبات مميزة",
            },
        },
    },
}

FORBIDDEN = [
    "analyzer",
    "analysis",
    "analyze",
    "analiz",
    "analizi",
    "sihirbaz",
    "günlük pratik",
    "ev seyahat bahşiş",
    "genel hesap makinesi sitesi",
    "iso 27001",
    "sla",
    "yatırımcı demosu",
    "endüstriyel karar motoru",
    "işletim sistemi",
    "dünyada ilk",
    "dünyada tek",
    "sector calculator",
]


def main() -> None:
    blob = json.dumps(LOCALES, ensure_ascii=False, indent=2) + "\n"
    lowered = blob.lower()
    hits = [term for term in FORBIDDEN if term in lowered]
    if hits:
        raise SystemExit(f"Forbidden terms found: {hits}")

    OUT.write_text(blob, encoding="utf-8")
    size = OUT.stat().st_size
    per_locale = {loc: leaf_count(block["homepageHybrid"]) + 1 for loc, block in LOCALES.items()}
    total = sum(per_locale.values())
    print(f"Wrote {OUT}")
    print(f"File size: {size:,} bytes")
    print(f"Leaf keys per locale (homepageHybrid + searchPlaceholder): {per_locale}")
    print(f"Total leaf keys (all locales): {total}")


if __name__ == "__main__":
    main()
