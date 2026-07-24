#!/usr/bin/env python3
"""Inject production-safe SEO meta + Schema Mesh + CVW into public HTML pages.

Rules:
- Do not replace existing title/description/favicon/theme boot scripts.
- Do not add AggregateRating / Review.
- CSP meta allows cdnjs, Google Fonts, and GA4 endpoints used by live tools.
- Canonical host: https://www.sectorcalc.com
- Idempotent via SC-SEO-* markers.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "https://www.sectorcalc.com"
OG_DEFAULT = f"{HOST}/assets/images/og-default-1200x630.jpg"
OG_HOME = f"{HOST}/assets/images/sectorcalc-og-1200x630.jpg"

# CSP must allow existing CDN / fonts / optional GA4 (do not tighten blindly).
CSP_CONTENT = (
    "default-src 'self'; "
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com "
    "https://www.googletagmanager.com https://www.google-analytics.com; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    "font-src 'self' https://fonts.gstatic.com data:; "
    "img-src 'self' data: blob: https:; "
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com "
    "https://region1.google-analytics.com https://www.googletagmanager.com; "
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
)

PERMISSIONS_POLICY = (
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), "
    "magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()"
)

TOOL_META = {
    "sc008-pro": {
        "name": "SC-008 Tolerance Stack-Up",
        "short": "Tolerance Stack-Up",
        "category": "Tolerance & Quality",
        "anchor": "tolerance",
        "sub": "Tolerance Analysis",
        "desc": "Deterministic 1D linear tolerance stack-up with worst-case, RSS, and seeded Monte Carlo. Client-side Decimal.js engine with audit-ready reports.",
        "version": "1.0.0",
    },
    "machining-pro": {
        "name": "SC-020 CNC Feeds & Speeds + Tool Life",
        "short": "Feeds & Speeds",
        "category": "Machining",
        "anchor": "machining",
        "sub": "CNC Machining",
        "desc": "Taylor tool life, chip thinning, Kienzle force, spindle power and torque checks with FS-ENGINE deterministic SI core.",
        "version": "2.1.0",
    },
    "bearing-pro": {
        "name": "SC-021 Bearing Life L10 — ISO 281",
        "short": "Bearing Life L10",
        "category": "Bearings & Shafts",
        "anchor": "bearings",
        "sub": "Rolling Bearings",
        "desc": "ISO 281:2007 basic and modified rating life with aISO, contamination, and viscosity ratio models.",
        "version": "1.0.0",
    },
    "bearing-freq-pro": {
        "name": "SC-024 Bearing Frequencies — BPFO / BPFI",
        "short": "Bearing Frequencies",
        "category": "Bearings & Shafts",
        "anchor": "bearings",
        "sub": "Condition Monitoring",
        "desc": "Bearing defect frequency calculator for BPFO, BPFI, BSF and FTF from geometry and shaft speed.",
        "version": "1.0.0",
    },
    "belt-chain-pro": {
        "name": "SC-025 Belt & Chain Drive Sizing",
        "short": "Belt & Chain Drive",
        "category": "Power Transmission",
        "anchor": "drives",
        "sub": "Drive Design",
        "desc": "V-belt and chain drive sizing with ratio, center distance, and power rating checks.",
        "version": "1.0.0",
    },
    "bend-pro": {
        "name": "SC-030 Sheet Metal Bend & K-Factor",
        "short": "Bend Allowance",
        "category": "Welding & Fabrication",
        "anchor": "fabrication",
        "sub": "Sheet Metal",
        "desc": "Bend allowance and flat-pattern development from K-factor, radius, and thickness.",
        "version": "1.0.0",
    },
    "bolt-pro": {
        "name": "SC-035 Bolt Torque & Preload — VDI 2230",
        "short": "Bolt Torque",
        "category": "Bolted Joints",
        "anchor": "fasteners",
        "sub": "Fastener Assembly",
        "desc": "VDI 2230 assembly torque and preload calculation with scatter band and nut factor.",
        "version": "1.0.0",
    },
    "bolted-joint-pro": {
        "name": "SC-036 Bolted Joint Verification — VDI 2230",
        "short": "Bolted Joint",
        "category": "Bolted Joints",
        "anchor": "fasteners",
        "sub": "Joint Verification",
        "desc": "VDI 2230 bolted-joint verification for preload, embedding, and fatigue safety.",
        "version": "1.0.0",
    },
    "cycle-cost-pro": {
        "name": "SC-023 Cycle Time & Cost per Part",
        "short": "Cycle Cost",
        "category": "Manufacturing Economics",
        "anchor": "costing",
        "sub": "Machining Economics",
        "desc": "Multi-operation cycle build-up with setup amortization and cost per part.",
        "version": "1.0.0",
    },
    "fits-pro": {
        "name": "SC-027 Fits & Clearances — ISO 286",
        "short": "ISO Fits",
        "category": "Tolerance & Quality",
        "anchor": "tolerance",
        "sub": "Limits & Fits",
        "desc": "ISO 286-1 hole/shaft fit calculator with tolerance grades and fundamental deviations.",
        "version": "1.0.0",
    },
    "heat-input-pro": {
        "name": "SC-029 Heat Input & Cooling Rate t8/5",
        "short": "Heat Input",
        "category": "Welding & Fabrication",
        "anchor": "welding",
        "sub": "Welding Thermal",
        "desc": "Welding heat input and t8/5 cooling-rate estimation for procedure control.",
        "version": "1.0.0",
    },
    "hydraulic-pro": {
        "name": "SC-040 Hydraulic Cylinder Sizing",
        "short": "Hydraulic Cylinder",
        "category": "Hydraulics",
        "anchor": "hydraulics",
        "sub": "Fluid Power",
        "desc": "Bore, rod, flow and buckling checks for hydraulic cylinder sizing.",
        "version": "1.0.0",
    },
    "labor-pro": {
        "name": "SC-010 True Labor Cost",
        "short": "Labor Cost",
        "category": "Manufacturing Economics",
        "anchor": "costing",
        "sub": "Labor Burden",
        "desc": "Loaded labor cost from net salary, taxes, benefits, and shop overhead.",
        "version": "1.0.0",
    },
    "machine-rate-pro": {
        "name": "SC-038 Machine Hour Rate",
        "short": "Machine Rate",
        "category": "Manufacturing Economics",
        "anchor": "costing",
        "sub": "Machine Costing",
        "desc": "Machine hour rate from depreciation, occupancy, energy, and utilization.",
        "version": "1.0.0",
    },
    "oee-pro": {
        "name": "SC-037 OEE — Overall Equipment Effectiveness",
        "short": "OEE",
        "category": "Manufacturing Economics",
        "anchor": "costing",
        "sub": "Equipment Effectiveness",
        "desc": "Availability × performance × quality OEE calculator for production cells.",
        "version": "1.0.0",
    },
    "pipe-wall-pro": {
        "name": "SC-034 Pipe Wall Thickness — ASME B31.3",
        "short": "Pipe Wall",
        "category": "Pressure Equipment",
        "anchor": "pressure",
        "sub": "Piping Design",
        "desc": "ASME B31.3 pressure design thickness with mill tolerance and corrosion allowance.",
        "version": "1.0.0",
    },
    "pressure-vessel-pro": {
        "name": "SC-033 Pressure Vessel Shell — ASME VIII",
        "short": "Pressure Vessel",
        "category": "Pressure Equipment",
        "anchor": "pressure",
        "sub": "Vessel Design",
        "desc": "ASME VIII UG-27/UG-32 shell and head sizing with MAWP and hydrotest checks.",
        "version": "1.0.0",
    },
    "punching-pro": {
        "name": "SC-039 Punching Force & Die Clearance",
        "short": "Punching Force",
        "category": "Machining",
        "anchor": "machining",
        "sub": "Sheet Punching",
        "desc": "Punching force, stripping load, and die clearance by material and thickness.",
        "version": "1.0.0",
    },
    "quote-pro": {
        "name": "SC-012 Quote Pricing",
        "short": "Quote Pricing",
        "category": "Manufacturing Economics",
        "anchor": "costing",
        "sub": "Job Quoting",
        "desc": "Material, labor, scrap, and margin into sell price with cost breakdown.",
        "version": "1.0.0",
    },
    "shackle-eyebolt-pro": {
        "name": "SC-032 Shackle & Eye Bolt Check",
        "short": "Shackle & Eye Bolt",
        "category": "Lifting & Rigging",
        "anchor": "lifting",
        "sub": "Lifting Points",
        "desc": "Shackle WLL and DIN 580 eye-bolt direction derating checks.",
        "version": "1.0.0",
    },
    "shaft-pro": {
        "name": "SC-026 Shaft Design — Torsion + Bending",
        "short": "Shaft Design",
        "category": "Bearings & Shafts",
        "anchor": "bearings",
        "sub": "Shaft Sizing",
        "desc": "ASME / DE-Goodman shaft diameter from torsion, bending, and fatigue factors.",
        "version": "1.0.0",
    },
    "sling-pro": {
        "name": "SC-031 Sling Capacity & Angle",
        "short": "Sling Capacity",
        "category": "Lifting & Rigging",
        "anchor": "lifting",
        "sub": "Rigging",
        "desc": "Multi-leg sling tension and WLL checks from load and hitch angle.",
        "version": "1.0.0",
    },
    "surface-finish-pro": {
        "name": "SC-028 Surface Finish Converter",
        "short": "Surface Finish",
        "category": "Tolerance & Quality",
        "anchor": "tolerance",
        "sub": "Surface Texture",
        "desc": "Ra / Rz / Rq / N-grade surface texture conversion for drawings and specs.",
        "version": "1.0.0",
    },
    "tap-thread-pro": {
        "name": "SC-022 Tap & Thread Milling",
        "short": "Tap & Thread",
        "category": "Machining",
        "anchor": "machining",
        "sub": "Thread Machining",
        "desc": "Tap drill, speed, torque, and thread-mill table feed calculator.",
        "version": "1.0.0",
    },
    "weld-pro": {
        "name": "SC-001 Weld Thickness",
        "short": "Weld Thickness",
        "category": "Welding & Fabrication",
        "anchor": "welding",
        "sub": "Weld Sizing",
        "desc": "Fillet weld leg, throat, and utilization against design load and code minimums.",
        "version": "1.0.0",
    },
}

HTML_PAGES = (
    ["index.html", "tools.html", "pro.html", "pricing.html"]
    + sorted(p.name for p in ROOT.glob("*-pro.html"))
)


def schema_global() -> str:
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{HOST}/#organization",
                "name": "SectorCalc",
                "alternateName": ["SectorCalc Engineering Calculators"],
                "url": f"{HOST}/",
                "logo": {
                    "@type": "ImageObject",
                    "@id": f"{HOST}/#logo",
                    "url": f"{HOST}/assets/images/sectorcalc-logo-512x512.png",
                    "width": 512,
                    "height": 512,
                    "caption": "SectorCalc",
                },
                "image": {
                    "@type": "ImageObject",
                    "url": OG_HOME,
                    "width": 1200,
                    "height": 630,
                },
                "description": "Deterministic industrial engineering calculators with visible formulas, ISO-standard audit trails, and full-precision decimal arithmetic. Client-side only.",
                "slogan": "Stop Guessing. Start Defending Your Numbers.",
                "foundingDate": "2024",
                "sameAs": [
                    "https://github.com/barisbagirlar-web/SectorCalc",
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "email": "support@sectorcalc.com",
                    "availableLanguage": ["English"],
                },
                "knowsAbout": [
                    "Tolerance Stack-Up Analysis",
                    "Monte Carlo Simulation",
                    "ISO 286 Tolerancing",
                    "CNC Machining Feeds and Speeds",
                    "Bearing Life Calculation ISO 281",
                    "Welding Engineering",
                    "Manufacturing Cost Estimation",
                ],
            },
            {
                "@type": "Person",
                "@id": f"{HOST}/#person-neela-nataraj",
                "name": "Prof. Dr. Neela Nataraj",
                "givenName": "Neela",
                "familyName": "Nataraj",
                "honorificPrefix": "Prof. Dr.",
                "jobTitle": "Professor of Mathematics",
                "worksFor": {"@id": f"{HOST}/#educational-organization-iitb"},
                "affiliation": {"@id": f"{HOST}/#educational-organization-iitb"},
                "knowsAbout": [
                    "Numerical Analysis",
                    "Finite Element Methods",
                    "Statistical Computing",
                    "Engineering Mathematics",
                    "Monte Carlo Methods",
                ],
                "sameAs": ["https://www.math.iitb.ac.in/"],
            },
            {
                "@type": "EducationalOrganization",
                "@id": f"{HOST}/#educational-organization-iitb",
                "name": "Indian Institute of Technology Bombay",
                "alternateName": ["IIT Bombay", "IITB"],
                "url": "https://www.iitb.ac.in",
                "sameAs": [
                    "https://www.iitb.ac.in",
                    "https://en.wikipedia.org/wiki/IIT_Bombay",
                ],
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Mumbai",
                    "addressRegion": "Maharashtra",
                    "addressCountry": "IN",
                },
                "member": {"@id": f"{HOST}/#person-neela-nataraj"},
            },
            {
                "@type": "WebSite",
                "@id": f"{HOST}/#website",
                "url": f"{HOST}/",
                "name": "SectorCalc",
                "publisher": {"@id": f"{HOST}/#organization"},
                "inLanguage": ["en", "en-US"],
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": f"{HOST}/tools.html?q={{search_term_string}}",
                    },
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    }
    return (
        '<script type="application/ld+json" id="sc-schema-global">\n'
        + json.dumps(data, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def schema_tool(slug: str, meta: dict) -> str:
    url = f"{HOST}/{slug}.html"
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "@id": f"{url}#software",
                "name": meta["name"],
                "applicationCategory": "EngineeringApplication",
                "applicationSubCategory": meta["sub"],
                "operatingSystem": "Any (Client-side Browser)",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": url,
                    "seller": {"@id": f"{HOST}/#organization"},
                },
                "description": meta["desc"],
                "featureList": [
                    "Deterministic engine — same inputs, same result",
                    "Full-precision decimal / SI core arithmetic",
                    "Visible formulas, assumptions, and warnings",
                    "Client-side only — zero calculation upload",
                    "Audit trail / PDF export where provided",
                ],
                "softwareVersion": meta["version"],
                "provider": {"@id": f"{HOST}/#organization"},
                "author": {"@id": f"{HOST}/#organization"},
                    "screenshot": {
                        "@type": "ImageObject",
                        "url": f"{HOST}/assets/images/og-{slug}-1200x630.jpg",
                        "width": 1200,
                        "height": 630,
                    },
                "inLanguage": ["en"],
                "dateModified": "2026-07-24",
                "isPartOf": {"@id": f"{HOST}/#website"},
            },
            {
                "@type": "HowTo",
                "@id": f"{url}#howto",
                "name": f"How to run {meta['short']} on SectorCalc",
                "description": f"Open the calculator, enter inputs with units, then calculate and review the audit trail for {meta['name']}.",
                "totalTime": "PT3M",
                "estimatedCost": {"@type": "MonetaryAmount", "currency": "USD", "value": "0"},
                "tool": [{"@type": "HowToTool", "name": meta["name"]}],
                "step": [
                    {
                        "@type": "HowToStep",
                        "position": 1,
                        "name": "Open the tool",
                        "text": f"Go to {url} and optionally Load Demo Data to inspect a complete working model.",
                        "url": url,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 2,
                        "name": "Enter inputs",
                        "text": "Fill each field using the selectable units. Check reference hints and validation banners before running.",
                        "url": url,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 3,
                        "name": "Calculate and audit",
                        "text": "Run Calculate & Audit / Generate Report. Review formulas, warnings, engine version, and export if needed.",
                        "url": url,
                    },
                ],
                "isPartOf": {"@id": f"{url}#software"},
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{url}#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{HOST}/"},
                    {"@type": "ListItem", "position": 2, "name": "All Calculators", "item": f"{HOST}/tools.html"},
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": meta["category"],
                        "item": f"{HOST}/tools.html#{meta['anchor']}",
                    },
                    {"@type": "ListItem", "position": 4, "name": meta["name"], "item": url},
                ],
            },
        ],
    }
    return (
        f'<script type="application/ld+json" id="sc-schema-tool-{slug}">\n'
        + json.dumps(data, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def schema_pricing() -> str:
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "@id": f"{HOST}/pricing.html#product-credits",
                "name": "SectorCalc Calculation Credits",
                "description": "Planned pay-per-use credits for premium engineering workflows. Core calculators remain runnable client-side. Checkout via Paddle when live.",
                "brand": {"@id": f"{HOST}/#organization"},
                "category": "Engineering Software Credits",
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Starter Pack",
                        "price": "29.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/PreOrder",
                        "url": f"{HOST}/pricing.html#starter",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                    {
                        "@type": "Offer",
                        "name": "Pro Pack",
                        "price": "99.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/PreOrder",
                        "url": f"{HOST}/pricing.html#pro",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                    {
                        "@type": "Offer",
                        "name": "Enterprise Pack",
                        "price": "349.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/PreOrder",
                        "url": f"{HOST}/pricing.html#enterprise",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                ],
                "isPartOf": {"@id": f"{HOST}/#website"},
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{HOST}/pricing.html#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{HOST}/"},
                    {"@type": "ListItem", "position": 2, "name": "Pricing", "item": f"{HOST}/pricing.html"},
                ],
            },
        ],
    }
    return (
        '<script type="application/ld+json" id="sc-schema-pricing">\n'
        + json.dumps(data, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def schema_speakable(path: str, headline: str, description: str, selectors: list[str]) -> str:
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{HOST}/{path}#speakable" if path else f"{HOST}/#speakable",
                "speakable": {"@type": "SpeakableSpecification", "cssSelector": selectors},
                "headline": headline,
                "description": description,
                "url": f"{HOST}/{path}" if path else f"{HOST}/",
                "inLanguage": "en-US",
            }
        ],
    }
    return (
        '<script type="application/ld+json" id="sc-schema-speakable">\n'
        + json.dumps(data, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def og_image_for(page: str) -> str:
    slug_map = {
        "index.html": "home",
        "tools.html": "tools",
        "pro.html": "pro",
        "pricing.html": "pricing",
    }
    slug = slug_map.get(page, page.replace(".html", ""))
    candidate = ROOT / f"public/assets/images/og-{slug}-1200x630.jpg"
    if candidate.exists():
        return f"{HOST}/assets/images/og-{slug}-1200x630.jpg"
    if page == "index.html":
        return OG_HOME
    return OG_DEFAULT


def page_meta_block(page: str, title: str, description: str) -> str:
    page_path = "" if page == "index.html" else page
    og_type = "website"
    og_img = og_image_for(page)

    canonical = f"{HOST}/" if page == "index.html" else f"{HOST}/{page_path}"
    safe_title = html.escape(title, quote=True)
    safe_desc = html.escape((description or title)[:300], quote=True)
    safe_alt = html.escape(title[:120], quote=True)

    return f"""<!--SC-SEO-META-START-->
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="x-default" href="{canonical}">
<link rel="alternate" hreflang="en" href="{canonical}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow">
<meta name="bingbot" content="index, follow">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{safe_title}">
<meta property="og:description" content="{safe_desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:site_name" content="SectorCalc">
<meta property="og:image" content="{og_img}">
<meta property="og:image:secure_url" content="{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="{safe_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{safe_title}">
<meta name="twitter:description" content="{safe_desc}">
<meta name="twitter:image" content="{og_img}">
<meta name="twitter:image:alt" content="{safe_alt}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="author" content="SectorCalc Engineering Team">
<meta name="theme-color" content="#0055A4">
<meta name="format-detection" content="telephone=no">
<!--SC-SEO-META-END-->"""


def extract_title_desc(text: str) -> tuple[str, str]:
    tm = re.search(r"<title>(.*?)</title>", text, re.I | re.S)
    title = re.sub(r"\s+", " ", html.unescape(tm.group(1))).strip() if tm else "SectorCalc"
    dm = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        text,
        re.I | re.S,
    )
    if not dm:
        dm = re.search(
            r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']',
            text,
            re.I | re.S,
        )
    desc = html.unescape(dm.group(1)).strip() if dm else title
    return title, desc


def upsert_block(text: str, start: str, end: str, block: str) -> str:
    if start in text and end in text:
        return re.sub(
            re.escape(start) + r".*?" + re.escape(end),
            block,
            text,
            count=1,
            flags=re.S,
        )
    # Insert before </head>
    if "</head>" not in text.lower():
        raise RuntimeError("No </head>")
    return re.sub(r"</head>", block + "\n</head>", text, count=1, flags=re.I)


def upsert_cvw(text: str) -> str:
    marker = "<!--SC-SEO-CVW-->"
    block = (
        f"{marker}\n"
        '<script src="/assets/js/sc-ga4-id.js"></script>\n'
        '<script src="/assets/js/cvw-monitor.js" defer></script>'
    )
    if marker in text:
        return re.sub(
            re.escape(marker) + r".*?(?=\n</body>|\n<!--|\Z)",
            block + "\n",
            text,
            count=1,
            flags=re.S,
        )
    if 'src="/assets/js/cvw-monitor.js"' in text and "sc-ga4-id.js" not in text:
        return text.replace(
            '<script src="/assets/js/cvw-monitor.js" defer></script>',
            block.replace(marker + "\n", ""),
            1,
        )
    if 'src="/assets/js/cvw-monitor.js"' in text:
        return text
    return re.sub(r"</body>", block + "\n</body>", text, count=1, flags=re.I)


HOST_REDIRECT = """<!--SC-SEO-HOST-->
<script>(function(){try{if(location.hostname==='sectorcalc.com'){location.replace('https://www.sectorcalc.com'+location.pathname+location.search+location.hash);}}catch(e){}})();</script>
<!--SC-SEO-HOST-END-->"""


def security_head_block() -> str:
    """CSP + Permissions-Policy + Dublin Core (English-only; language gate safe)."""
    return f"""<!--SC-SEO-SECURITY-START-->
<meta http-equiv="Content-Security-Policy" content="{CSP_CONTENT}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="{PERMISSIONS_POLICY}">
<link rel="schema.DC" href="http://purl.org/dc/elements/1.1/">
<meta name="DC.title" content="SectorCalc — Deterministic Industrial Engineering Calculators">
<meta name="DC.creator" content="SectorCalc Inc.">
<meta name="DC.subject" content="Engineering Calculators, Tolerance Analysis, Monte Carlo Simulation">
<meta name="DC.description" content="Deterministic industrial calculators with ISO audit trails">
<meta name="DC.publisher" content="SectorCalc Inc.">
<meta name="DC.date" content="2026-07-25">
<meta name="DC.type" content="Text">
<meta name="DC.format" content="text/html">
<meta name="DC.language" content="en">
<meta name="DC.coverage" content="Global">
<meta name="DC.rights" content="2024-2026 SectorCalc Inc.">
<!--SC-SEO-SECURITY-END-->"""


def upsert_security(text: str) -> str:
    start, end = "<!--SC-SEO-SECURITY-START-->", "<!--SC-SEO-SECURITY-END-->"
    block = security_head_block()
    if start in text and end in text:
        return re.sub(
            re.escape(start) + r".*?" + re.escape(end),
            block.strip(),
            text,
            count=1,
            flags=re.S,
        )
    # Place early in <head> (after host redirect if present)
    if "<!--SC-SEO-HOST-END-->" in text:
        return text.replace("<!--SC-SEO-HOST-END-->", "<!--SC-SEO-HOST-END-->\n" + block, 1)
    return re.sub(r"(<head[^>]*>)", r"\1\n" + block, text, count=1, flags=re.I)


def breadcrumb_html(page: str) -> str | None:
    """Visible breadcrumb nav after site header. Homepage returns None."""
    if page == "index.html":
        return None

    def crumb(parts: list[tuple[str, str | None]]) -> str:
        items = []
        for i, (name, href) in enumerate(parts, start=1):
            safe_name = html.escape(name)
            if href and i < len(parts):
                items.append(
                    f'<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">'
                    f'<a itemprop="item" href="{html.escape(href, quote=True)}"><span itemprop="name">{safe_name}</span></a>'
                    f'<meta itemprop="position" content="{i}">'
                    f"</li>"
                )
            else:
                items.append(
                    f'<li aria-current="page" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">'
                    f'<span itemprop="name">{safe_name}</span>'
                    f'<meta itemprop="position" content="{i}">'
                    f"</li>"
                )
        return (
            '<!--SC-SEO-BREADCRUMB-START-->\n'
            '<nav aria-label="Breadcrumb" class="sc-breadcrumb">\n'
            '  <ol itemscope itemtype="https://schema.org/BreadcrumbList">\n'
            + "\n".join(f"    {x}" for x in items)
            + "\n  </ol>\n</nav>\n"
            "<!--SC-SEO-BREADCRUMB-END-->"
        )

    if page == "tools.html":
        return crumb([("Home", f"{HOST}/"), ("All Calculators", None)])
    if page == "pricing.html":
        return crumb([("Home", f"{HOST}/"), ("Pricing", None)])
    if page == "pro.html":
        return crumb([("Home", f"{HOST}/"), ("Pro Tools", None)])

    slug = page.replace(".html", "")
    if page.endswith("-pro.html") and slug in TOOL_META:
        meta = TOOL_META[slug]
        return crumb(
            [
                ("Home", f"{HOST}/"),
                ("All Calculators", f"{HOST}/tools.html"),
                (meta["category"], f"{HOST}/tools.html#{meta['anchor']}"),
                (meta["name"], None),
            ]
        )
    return None


def upsert_breadcrumb(text: str, page: str) -> str:
    start, end = "<!--SC-SEO-BREADCRUMB-START-->", "<!--SC-SEO-BREADCRUMB-END-->"
    block = breadcrumb_html(page)
    if start in text and end in text:
        if block is None:
            return re.sub(re.escape(start) + r".*?" + re.escape(end) + r"\n?", "", text, count=1, flags=re.S)
        return re.sub(
            re.escape(start) + r".*?" + re.escape(end),
            block.strip(),
            text,
            count=1,
            flags=re.S,
        )
    if block is None:
        return text
    if "<!--SC-SITE-NAV-END-->" in text:
        return text.replace("<!--SC-SITE-NAV-END-->", "<!--SC-SITE-NAV-END-->\n" + block, 1)
    # Fallback: after <body>
    return re.sub(r"(<body[^>]*>)", r"\1\n" + block, text, count=1, flags=re.I)


def upsert_host_redirect(text: str) -> str:
    start, end = "<!--SC-SEO-HOST-->", "<!--SC-SEO-HOST-END-->"
    if start in text and end in text:
        return re.sub(
            re.escape(start) + r".*?" + re.escape(end),
            HOST_REDIRECT.strip(),
            text,
            count=1,
            flags=re.S,
        )
    # Place immediately after <head> open so redirect wins early
    return re.sub(r"(<head[^>]*>)", r"\1\n" + HOST_REDIRECT, text, count=1, flags=re.I)


def process(page: str) -> None:
    path = ROOT / page
    text = path.read_text(encoding="utf-8")
    title, desc = extract_title_desc(text)
    # Prefer TOOL_META description for calculator pages
    slug = page.replace(".html", "")
    if slug in TOOL_META:
        desc = TOOL_META[slug]["desc"]
    elif page == "pricing.html":
        desc = "SectorCalc credit packs for premium engineering workflows. Core calculators stay free and client-side. Starter, Pro, and Enterprise packs — no subscription."
    elif page == "index.html":
        desc = "Deterministic industrial engineering calculators — tolerance stack-up, CNC feeds & speeds, bearing life, welding, costing. Client-side, full-precision, audit-ready."
    elif page == "pro.html":
        desc = "SectorCalc Pro calculators for shop-floor engineers: CNC feeds & speeds, bearing life, tolerance stack-up and more — deterministic SI engines with audit trails."
    text = upsert_host_redirect(text)
    text = upsert_security(text)
    text = upsert_block(text, "<!--SC-SEO-META-START-->", "<!--SC-SEO-META-END-->", page_meta_block(page, title, desc))
    text = upsert_breadcrumb(text, page)

    schemas = [schema_global()]
    slug = page.replace(".html", "")
    if page.endswith("-pro.html") and slug in TOOL_META:
        schemas.append(schema_tool(slug, TOOL_META[slug]))
        schemas.append(
            schema_speakable(
                page,
                TOOL_META[slug]["name"],
                TOOL_META[slug]["desc"],
                [".sc-header-title", ".sc-guide-lede", "h1"],
            )
        )
    if page == "pricing.html":
        schemas.append(schema_pricing())
    if page == "index.html":
        schemas.append(
            schema_speakable(
                "",
                "SectorCalc — Deterministic Industrial Decision Calculators",
                desc,
                [".sc-hero-title", ".sc-hero-lead", "h1"],
            )
        )
    if page == "tools.html":
        schemas.append(
            schema_speakable(
                "tools.html",
                "All SectorCalc Calculators",
                desc,
                ["h1", ".tools-lede", ".tool-card"],
            )
        )

    schema_block = "<!--SC-SEO-SCHEMA-START-->\n" + "\n".join(schemas) + "\n<!--SC-SEO-SCHEMA-END-->"
    text = upsert_block(text, "<!--SC-SEO-SCHEMA-START-->", "<!--SC-SEO-SCHEMA-END-->", schema_block)
    text = upsert_cvw(text)
    path.write_text(text, encoding="utf-8")
    print("updated", page)


def main() -> None:
    for page in HTML_PAGES:
        if (ROOT / page).exists():
            process(page)
        else:
            print("skip missing", page)


if __name__ == "__main__":
    main()
