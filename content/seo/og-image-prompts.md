# SectorCalc — OG image production prompts v2026.07.25
# Target: 1200×630px JPEG, ISO 3864 palette, dark navy (#0A1628), technical / premium
# Output path: /assets/images/og-{slug}-1200x630.jpg
#
# Status: production already ships per-page OG JPEGs under public/assets/images/.
# Use these prompts when regenerating covers in Midjourney / DALL-E / similar.

## 1. sc008-pro — Tolerance Stack-Up
Ultra-clean technical illustration of a 1D tolerance stack-up analysis. Dark navy background (#0A1628). Center: precision engineering drawing showing three stacked metal parts with plus/minus tolerance annotations. Right side: small Monte Carlo histogram chart in ISO blue (#0055A4). Bottom: SC-008 label. ISO 3864 safety colors. No text clutter. 1200x630px, crisp edges.

## 2. machining-pro — Feeds & Speeds
Technical CNC machining visualization. Dark background (#0A1628). Center: carbide end mill cutting into steel with visible chip formation. Left: Taylor tool life equation. Right: spindle speed gauge in ISO orange (#E87722). SC-020 label bottom. Industrial, precise, no stock-photo look. 1200x630px.

## 3. bearing-pro — Bearing Life
ISO 281 bearing life calculation visualization. Dark background. Center: cross-section of a deep-groove ball bearing with load arrows. Left: L10 life formula. Right: viscosity ratio indicator. SC-021 label. Technical blueprint style with modern UI elements. 1200x630px.

## 4. weld-pro — Weld Sizing
AWS D1.1 fillet weld technical diagram. Dark background. Center: T-joint fillet weld cross-section showing leg length and throat. Left: weld symbol per EN ISO 2553. Right: utilization gauge. SC-001 label. Welding engineering precision. 1200x630px.

## 5. pricing — Credits
Clean pricing visualization. Dark background (#0A1628). Center: three credit pack cards floating with subtle depth. ISO blue (#0055A4) primary, ISO orange (#E87722) accent. No Subscription badge. Premium SaaS aesthetic. 1200x630px.

## 6. tools — Calculator Catalog
Grid of engineering calculator icons. Dark background. Six calculator thumbnails in a 2×3 grid: tolerance, machining, bearing, weld, costing, lifting. Each with ISO icon and label. Clean, organized, technical. 1200x630px.

## 7. Default / homepage fallback
SectorCalc brand hero. Dark navy background (#0A1628). Center: 4-tile brand mark large and crisp. Below: Deterministic Industrial Calculators. Tagline: Stop Guessing. Start Defending Your Numbers. ISO blue and orange accent lines. Premium engineering software aesthetic. 1200x630px.

## Production rules
- Format: JPEG, 1200×630px, under 8MB
- Filename: og-{slug}-1200x630.jpg
- Path: /assets/images/og-{slug}-1200x630.jpg
- Slugs: home, tools, pricing, pro, sc008-pro, machining-pro, bearing-pro, bearing-freq-pro, belt-chain-pro, bend-pro, bolt-pro, bolted-joint-pro, cycle-cost-pro, fits-pro, heat-input-pro, hydraulic-pro, labor-pro, machine-rate-pro, oee-pro, pipe-wall-pro, pressure-vessel-pro, punching-pro, quote-pro, shackle-eyebolt-pro, shaft-pro, sling-pro, surface-finish-pro, tap-thread-pro, weld-pro
- After regenerating an image, keep the existing og:image meta path (already wired by inject-seo.py)
- Validate share cards with Facebook Sharing Debugger / Twitter Card Validator / Rich Results Test
