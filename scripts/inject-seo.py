#!/usr/bin/env python3
"""Inject production-safe SEO meta + Schema Mesh + CVW into public HTML pages.

Rules:
- Do not replace existing title/description/favicon/theme boot scripts.
- Do not add AggregateRating / Review.
- CSP meta allows cdnjs, Google Fonts, and GA4 endpoints used by live tools.
- Canonical host: https://sectorcalc.com (Firebase primary; www 301s to apex)
- Idempotent via SC-SEO-* markers.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "https://sectorcalc.com"
OG_DEFAULT = f"{HOST}/assets/images/og-default-1200x630.jpg"
OG_HOME = f"{HOST}/assets/images/sectorcalc-og-1200x630.jpg"

# CSP must allow existing CDN / fonts / optional GA4 / Paddle checkout (do not tighten blindly).
CSP_CONTENT = (
    "default-src 'self'; "
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdnjs.cloudflare.com "
    "https://www.googletagmanager.com https://www.google-analytics.com https://cdn.paddle.com; "
    "worker-src 'self' blob:; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.paddle.com; "
    "font-src 'self' https://fonts.gstatic.com data:; "
    "img-src 'self' data: blob: https:; "
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com "
    "https://region1.google-analytics.com https://www.googletagmanager.com https://*.paddle.com; "
    "frame-src 'self' https://*.paddle.com; "
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://*.paddle.com; "
    "upgrade-insecure-requests"
)

PERMISSIONS_POLICY = (
    "camera=(), microphone=(), geolocation=(), payment=*, usb=(), "
    "magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()"
)

# TOOL_CANONICAL / TOOL_META are loaded from seo/registry.generated.json (SSOT).
# Generate with: node scripts/export-seo-registry.mjs
_REGISTRY_PATH = ROOT / "seo" / "registry.generated.json"
if not _REGISTRY_PATH.exists():
    raise SystemExit(
        "[FAIL] missing seo/registry.generated.json — run: node scripts/export-seo-registry.mjs"
    )
_REGISTRY = json.loads(_REGISTRY_PATH.read_text(encoding="utf-8"))
TOOL_CANONICAL = dict(_REGISTRY["toolCanonicalBySlug"])
TOOL_META = dict(_REGISTRY["toolMetaBySlug"])

def eeat_claim_allowed() -> bool:
    evidence = ROOT / "seo" / "evidence" / "expert-relationships.json"
    if not evidence.exists():
        return False
    data = json.loads(evidence.read_text(encoding="utf-8"))
    for rel in data.get("relationships") or []:
        if (
            rel.get("publicClaimAllowed") is True
            and rel.get("relationshipVerified") is True
            and rel.get("scopeVerified") is True
        ):
            return True
    return False

if len(TOOL_CANONICAL) != 25 or len(TOOL_META) != 25:
    raise SystemExit(
        f"[FAIL] registry tool map size unexpected: canonical={len(TOOL_CANONICAL)} meta={len(TOOL_META)}"
    )


def tool_url(slug: str) -> str:
    pretty = TOOL_CANONICAL.get(slug)
    if pretty:
        return f"{HOST}/{pretty}"
    return f"{HOST}/{slug}.html"

HTML_PAGES = (
    ["index.html", "tools.html", "pro.html", "pricing.html"]
    + sorted(p.name for p in ROOT.glob("*-pro.html"))
)


def schema_global() -> str:
    graph = [
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
    ]
    if eeat_claim_allowed():
        graph.insert(1, {
                "@type": "Person",
                "@id": f"{HOST}/#person-neela-nataraj",
                "name": "Prof. Dr. Neela Nataraj",
                "givenName": "Neela",
                "familyName": "Nataraj",
                "honorificPrefix": "Prof. Dr.",
                "jobTitle": "Professor of Mathematics",
                "image": f"{HOST}/assets/images/neela-nataraj.jpg",
                "worksFor": {"@id": f"{HOST}/#educational-organization-iitb"},
                "affiliation": {"@id": f"{HOST}/#educational-organization-iitb"},
                "knowsAbout": [
                    "Numerical Analysis",
                    "Finite Element Methods",
                    "Statistical Computing",
                    "Engineering Mathematics",
                    "Monte Carlo Methods",
                ],
                "sameAs": [
                    "https://www.math.iitb.ac.in/",
                    "https://www.math.iitb.ac.in/~neela/",
                ],
            })
        graph.insert(2, {
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
            })
    data = {"@context": "https://schema.org", "@graph": graph}
    return (
        '<script type="application/ld+json" id="sc-schema-global">\n'
        + json.dumps(data, ensure_ascii=False, indent=2)
        + "\n</script>"
    )



def schema_tool(slug: str, meta: dict) -> str:
    url = tool_url(slug)
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


def schema_dataset(slug: str, meta: dict) -> str:
    url = tool_url(slug)
    measured = {
        "sc008-pro": [
            "Tolerance Stack-Up Spread",
            "Predicted Cpk",
            "Predicted PPM",
            "Monte Carlo Seed",
            "Engine Version Hash",
        ],
        "machining-pro": [
            "Spindle Speed",
            "Feed Rate",
            "Tool Life",
            "Cutting Power",
            "Engine Version Hash",
        ],
        "bearing-pro": [
            "L10 Life",
            "Viscosity Ratio",
            "Static Safety Factor",
            "Engine Version Hash",
        ],
        "weld-pro": [
            "Weld Throat",
            "Weld Leg",
            "Utilization",
            "Engine Version Hash",
        ],
        "labor-pro": [
            "True Hourly Cost",
            "Employer Burden",
            "Engine Version Hash",
        ],
        "quote-pro": [
            "Sell Price",
            "Margin",
            "Cost Build-Up",
            "Engine Version Hash",
        ],
    }.get(
        slug,
        [
            "Primary Result",
            "Derived Checks",
            "Warnings",
            "Engine Version Hash",
        ],
    )
    data = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "@id": f"{url}#dataset",
        "name": f"{meta['name']} — Audit Report Dataset",
        "description": (
            "Deterministic calculation audit trail including inputs, formulas, "
            "assumptions, warnings, and engine version. Exported as hash-verified PDF."
        ),
        "creator": {"@id": f"{HOST}/#organization"},
        "publisher": {"@id": f"{HOST}/#organization"},
                "license": f"{HOST}/terms.html",
        "isAccessibleForFree": True,
        "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/pdf",
            "contentUrl": f"{url}?export=pdf",
        },
        "variableMeasured": measured,
        "temporalCoverage": "2024-01-15/2026-07-25",
        "spatialCoverage": {"@type": "Place", "name": "Global"},
        "inLanguage": ["en", "en-US", "en-GB"],
        "datePublished": "2024-01-15",
        "dateModified": "2026-07-25",
        "isPartOf": {"@id": f"{url}#software"},
    }
    return (
        f'<script type="application/ld+json" id="sc-schema-dataset-{slug}">\n'
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
                "description": "One-time credit packs for Professional Analysis sessions. No subscription. Purchased credits do not expire. Checkout via Paddle Merchant of Record.",
                "brand": {"@id": f"{HOST}/#organization"},
                "category": "Engineering Software Credits",
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Starter Pack — 20 credits",
                        "price": "15.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "url": f"{HOST}/pricing.html#STARTER",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                    {
                        "@type": "Offer",
                        "name": "Workshop Pack — 100 credits",
                        "price": "59.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "url": f"{HOST}/pricing.html#WORKSHOP",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                    {
                        "@type": "Offer",
                        "name": "Professional Pack — 300 credits",
                        "price": "149.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "url": f"{HOST}/pricing.html#PROFESSIONAL",
                        "seller": {"@id": f"{HOST}/#organization"},
                    },
                    {
                        "@type": "Offer",
                        "name": "Team Wallet — 1000 credits",
                        "price": "399.00",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "url": f"{HOST}/pricing.html#TEAM_WALLET",
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

    slug = page.replace(".html", "")
    if page == "index.html":
        canonical = f"{HOST}/"
    elif slug in TOOL_CANONICAL:
        canonical = f"{HOST}/{TOOL_CANONICAL[slug]}"
    else:
        canonical = f"{HOST}/{page_path}"
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
        '<script src="/assets/js/sc-funnel-analytics.js" defer></script>\n'
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
<!-- Canonical host is https://sectorcalc.com — Firebase Hosting 301s www → apex. No client reverse-redirect. -->
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
        desc = "SectorCalc one-time credit packs for professional calculation sessions. No subscription. Purchased credits do not expire. Starter, Workshop, Professional, Team Wallet."
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
        schemas.append(schema_dataset(slug, TOOL_META[slug]))
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
