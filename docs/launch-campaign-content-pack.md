# SectorCalc Launch Campaign Content Pack v1

Ready-to-use messaging for the first 30 days of traffic, beta partner outreach and lead capture.

**Related docs:** [first-traffic-campaigns.md](./first-traffic-campaigns.md) · [gsc-campaign-url-list.md](./gsc-campaign-url-list.md) · [conversion-review-playbook.md](./conversion-review-playbook.md)

**Code source of truth:** `src/lib/campaigns/campaign-clusters.ts`

---

## 1. Campaign Positioning

### Core message

SectorCalc helps teams measure hidden loss in scrap, setup, route cost, energy exposure, OEE, margin leaks and operational waste — without buying a full ERP system.

### Short slogan

**Find the loss area. Measure the exposure. Make the call.**

### Primary CTAs

| Intent | CTA copy | Default destination |
|--------|----------|---------------------|
| Free entry | Start with a free calculator. | Cluster landing or free tool |
| Premium upsell | Unlock the decision report. | Premium analyzer or `/pricing` |
| Beta lead | Apply for beta partner access. | `/beta-partner` |

### What SectorCalc is (and is not)

- **Is:** Sector-specific calculators, hidden-loss diagnostics and export-ready decision reports.
- **Is not:** ERP, accounting software, legal/financial/engineering advice, or a guaranteed savings product.

### Audience

Operators, estimators, shop owners, contractors, fleet dispatchers, restaurant managers, plant leads and SMB finance owners who still run loss and cost math in spreadsheets.

---

## 2. Cluster Messaging

All paths below use the `/en` locale. Replace with `/tr` for Turkish campaigns when copy is localized.

UTM template (see §9): append `?utm_source=…&utm_medium=…&utm_campaign={cluster_id}&utm_content=…`

---

### A. Manufacturing Hidden Loss

**Cluster ID:** `manufacturing-hidden-loss`  
**Audience:** CNC shops, sheet metal, production managers

**Pain:** CNC shops and workshops often lose money through scrap, setup drift, tool wear and low OEE before accounting reports show the damage.

**Landing:** `/en/seo/manufacturing-cost-calculators`

**Free tools:**
- `/en/tools/free/oee-calculator`
- `/en/tools/free/scrap-rate-calculator`
- `/en/tools/free/machine-time-calculator`

**Premium analyzers:**
- `/en/tools/premium-schema/cnc-oee-loss`
- `/en/tools/premium-schema/cnc-tool-wear-cost`
- `/en/tools/premium-schema/sheet-metal-scrap-risk`

**Authority guide:** `/en/guides/what-is-oee-and-how-to-calculate-it`

**Hook:** Your CNC job may be leaking margin before the quote is even accepted.

**CTA:** Calculate the first exposure.

**Tracked landing example:**
```
https://sectorcalc.com/en/seo/manufacturing-cost-calculators?utm_source=linkedin&utm_medium=social&utm_campaign=manufacturing-hidden-loss&utm_content=post-01
```

---

### B. Construction Cost Overrun

**Cluster ID:** `construction-cost-overrun`  
**Audience:** Contractors, estimators, project leads

**Pain:** Construction margin disappears through delay days, subcontractor variance, material drift and weather risk.

**Landing:** `/en/seo/construction-cost-calculators`

**Free tools:**
- `/en/tools/free/concrete-volume-calculator`
- `/en/tools/free/roofing-area-calculator`
- `/en/tools/free/home-renovation-m2-calculator`

**Premium analyzers:**
- `/en/tools/premium-schema/construction-project-overrun`
- `/en/tools/premium-schema/construction-subcontractor-margin-leak`
- *(Related teaser)* `/en/tools/premium-schema/roofing-weather-delay-risk`

**Authority guide:** `/en/guides/how-to-calculate-construction-cost-overrun`

**Hook:** A few delay days can consume the contingency before the project looks “late”.

**CTA:** Measure the overrun risk.

---

### C. Logistics Route Cost

**Cluster ID:** `logistics-route-cost`  
**Audience:** Fleet operators, dispatchers, logistics owners

**Pain:** Fuel drift, empty return trips, deadhead distance and idle time turn good-looking routes into margin leaks.

**Landing:** `/en/seo/logistics-route-calculators`

**Free tools:**
- `/en/tools/free/route-cost-calculator`
- `/en/tools/free/fuel-consumption-calculator`
- `/en/tools/free/desi-calculator`

**Premium analyzers:**
- `/en/tools/premium-schema/logistics-route-loss`
- `/en/tools/premium-schema/logistics-fuel-route-drift`

**Authority guide:** `/en/guides/how-to-calculate-route-cost`

**Hook:** The route is not profitable until the empty return is priced.

**CTA:** Check route exposure.

---

### D. Restaurant Food Margin

**Cluster ID:** `restaurant-food-margin`  
**Audience:** Restaurant owners, kitchen managers, F&B operators

**Pain:** Food cost, platform fees, portion drift and waste can erase menu margin.

**Landing:** `/en/industries/restaurant` *(industry hub — no dedicated SEO hub yet)*

**Free tools:**
- `/en/tools/free/food-cost-calculator`
- `/en/tools/free/portion-cost-calculator`
- `/en/tools/free/recipe-cost-check`

**Premium analyzers:**
- `/en/tools/premium-schema/food-waste-margin-loss`
- `/en/tools/premium-schema/restaurant-menu-margin-leak`

**Authority guide:** `/en/guides/how-to-calculate-restaurant-food-cost`

**Hook:** Food waste is not just spoiled inventory. It is lost menu margin.

**CTA:** Calculate food margin pressure.

---

### E. Energy / Carbon Exposure

**Cluster ID:** `energy-carbon-exposure`  
**Audience:** Plant managers, sustainability leads, energy buyers

**Pain:** Peak kWh cost, compressor leaks, fuel emissions and carbon exposure can hide inside average energy costs.

**Landing:** `/en/seo/energy-carbon-calculators`

**Free tools:**
- `/en/tools/free/kwh-cost-calculator`
- `/en/tools/free/carbon-footprint-quick`
- `/en/tools/free/cbam-exposure-quick-check`

**Premium analyzers:**
- `/en/tools/premium-schema/energy-peak-cost`
- `/en/tools/premium-schema/energy-compressor-leak-cost`
- `/en/tools/premium-schema/carbon-footprint-compliance-risk`

**Authority guide:** `/en/guides/how-to-calculate-energy-cost-and-carbon-exposure`

**Hook:** Average kWh cost hides the expensive hours.

**CTA:** Measure energy exposure.

---

### F. Agriculture Yield Loss

**Cluster ID:** `agriculture-yield-loss`  
**Audience:** Farm operators, irrigation managers, dairy owners

**Pain:** Irrigation cost, feed cost, yield gap and input drift can damage season profitability.

**Landing:** `/en/seo/agriculture-calculators`

**Free tools:**
- `/en/tools/free/irrigation-cost-check`
- `/en/tools/free/crop-yield-calculator`
- `/en/tools/free/feed-cost-estimator`

**Premium analyzers:**
- `/en/tools/premium-schema/agriculture-irrigation-yield-loss`
- `/en/tools/premium-schema/dairy-feed-efficiency-loss`

**Authority guide:** *(use agriculture hub + crop/irrigation free tools)*

**Hook:** The season can lose money before harvest if yield drift is not measured.

**CTA:** Check yield exposure.

---

### G. Business / Finance Calculators

**Cluster ID:** `business-finance-calculators`  
**Audience:** SMB owners, finance leads, operators

**Pain:** Many small teams price work without knowing break-even, ROI, cash gap or unit cost.

**Landing:** `/en/seo/finance-business-calculators`

**Free tools:**
- `/en/tools/free/break-even-calculator`
- `/en/tools/free/roi-calculator`
- `/en/tools/free/cash-flow-gap-calculator`
- `/en/tools/free/unit-cost-calculator`

**Premium analyzers:**
- `/en/tools/premium-schema/cloud-api-cost-overrun`
- `/en/tools/premium-schema/legal-interest-fee-calculator-pro`

**Hook:** Revenue is not the same as margin.

**CTA:** Find the break-even point.

---

### H. Unit Conversion Traffic

**Cluster ID:** `unit-conversion-traffic`  
**Audience:** Engineers, estimators, general calculator users

**Pain:** Professionals need fast, clean unit conversion before making material, area, weight, volume or temperature decisions.

**Landing:** `/en/seo/unit-conversion-calculators`

**Free tools:**
- `/en/tools/free/area-converter`
- `/en/tools/free/length-converter`
- `/en/tools/free/weight-converter`
- `/en/tools/free/volume-converter`
- `/en/tools/free/temperature-converter`

**Premium analyzer:**
- `/en/tools/premium-schema/calibration-drift-risk`

**Authority guide:** `/en/guides/how-to-use-area-converter`

**Hook:** Convert the unit first. Then make the decision.

**CTA:** Open the converter.

---

## 3. LinkedIn Launch Posts

Rules: max 3 hashtags · no emoji spam · no fake claims · no “guaranteed savings” · ~900–1,300 characters each.

Replace `{{…_url}}` with tracked links from §9.

---

### Post 01 — Manufacturing Hidden Loss

**Title:** Your CNC quote may already be leaking money.

**Body:**

A CNC job can look profitable on paper and still lose margin in production.

The missing parts are usually not dramatic. They are small and repeated: setup drift, scrap rate, tool wear, idle machine time, inspection delays.

Most shops calculate the visible cost — material, spindle hours, labor on the quote. SectorCalc helps measure the hidden exposure behind the job: OEE drift, scrap stack and time loss before capacity is committed.

Start with the free OEE, scrap and machine-time calculators. They run in the browser with no sign-up. When the result affects pricing or scheduling, use the premium decision report for threshold checks, hidden drivers and export-ready output.

This is technical decision support — not ERP and not engineering sign-off.

**CTA:** Calculate the first exposure:  
{{manufacturing_landing_url}}

**Hashtags:** #Manufacturing #CNC #OEE

---

### Post 02 — Construction Cost Overrun

**Title:** Contingency disappears before the schedule looks late.

**Body:**

Construction margin rarely fails in one big event. It erodes through quantity drift, subcontractor variance, rework and weather days that never make it into the bid narrative.

By the time the project looks “a little behind,” the contingency may already be spent.

SectorCalc free calculators help sanity-check concrete volume, roofing area and renovation scope before packages are locked. Premium analyzers add overrun exposure, margin leak drivers and a structured decision report when the estimate affects a go/no-go bid.

Use free tools for quick field math. Use premium when the number changes how you price the next job.

**CTA:** Measure the overrun risk:  
{{construction_landing_url}}

**Hashtags:** #Construction #Estimating #ProjectManagement

---

### Post 03 — Logistics Route Cost

**Title:** A profitable route is not profitable until the empty return is priced.

**Body:**

Dispatch boards show loaded miles. Margin leaks live in deadhead, fuel drift, stop time and under-loaded return legs.

A route that wins on paper can lose money when empty repositioning, idle time and tariff variance are ignored.

SectorCalc free route, fuel and volumetric weight calculators give a quick per-trip exposure check. Premium route loss analyzers surface hidden drivers — deadhead, fuel drift and combined operating cost — with threshold interpretation.

Built for operators who still run route economics in spreadsheets, not for fleet ERP replacement.

**CTA:** Check route exposure:  
{{logistics_landing_url}}

**Hashtags:** #Logistics #Fleet #LastMile

---

### Post 04 — Restaurant Food Margin

**Title:** Food waste is menu margin, not just spoiled inventory.

**Body:**

Restaurant P&L can look fine while individual dishes bleed margin through portion drift, platform fees, prep waste and unpriced specials.

Food cost percentage is simple on a recipe card. Actual cost drifts when portions creep, vendors change prices and waste is not tracked by menu item.

SectorCalc free food cost, portion and recipe calculators give a fast plate-level check. Premium analyzers connect waste and menu margin to hidden loss drivers when you need a report for pricing or menu decisions.

Not accounting software. A calculator and decision-report layer for operators who need clarity before the next menu cycle.

**CTA:** Calculate food margin pressure:  
{{restaurant_landing_url}}

**Hashtags:** #Restaurant #FoodCost #Hospitality

---

### Post 05 — Energy / Carbon Exposure

**Title:** Average kWh cost hides the expensive hours.

**Body:**

Energy bills show a blended rate. Operations feel peak windows, compressor leaks and demand charges that average math smooths away.

Carbon and compliance pressure adds another layer — emissions tied to the same hours that spike cost.

SectorCalc free kWh, carbon quick-check and CBAM exposure calculators estimate cost and emissions from your inputs. Premium peak-cost and compressor-leak analyzers help decide whether to shift load, fix leaks or renegotiate tariffs.

Technical estimates based on your inputs — not utility consulting or compliance certification.

**CTA:** Measure energy exposure:  
{{energy_landing_url}}

**Hashtags:** #Energy #Sustainability #Operations

---

### Post 06 — Agriculture Yield Loss

**Title:** The season can lose money before harvest.

**Body:**

Farm economics fail quietly: irrigation over-use, feed inefficiency, yield gap versus plan and input cost drift across the season.

Spreadsheets capture purchases. They rarely connect yield variance to margin before it is too late to adjust.

SectorCalc free irrigation, crop yield and feed cost calculators give field-level estimates in the browser. Premium analyzers add hidden loss diagnostics for irrigation yield and dairy feed efficiency when the result affects season planning.

Built for operators who need measurement without a full farm ERP.

**CTA:** Check yield exposure:  
{{agriculture_landing_url}}

**Hashtags:** #Agriculture #Farming #Yield

---

### Post 07 — Business / Finance Calculators

**Title:** Revenue is not the same as margin.

**Body:**

Small teams often price from revenue targets without a clear break-even, unit cost or cash gap view.

Growth can mask negative unit economics until payroll, API bills or interest catch up.

SectorCalc free break-even, ROI, cash-flow gap and unit-cost calculators help sanity-check pricing and runway. Premium analyzers extend into cloud API overrun and structured fee/interest exposure when operational decisions need a report.

Free for quick numbers. Premium when the estimate changes a pricing or investment call.

**CTA:** Find the break-even point:  
{{finance_landing_url}}

**Hashtags:** #SMB #Finance #Pricing

---

### Post 08 — Unit Conversion Traffic

**Title:** Convert the unit first. Then make the decision.

**Body:**

Wrong unit conversion still causes expensive mistakes — area for flooring orders, weight for freight, volume for tank capacity, temperature for process specs.

Professionals need clean conversion before quoting material, logistics or compliance checks.

SectorCalc free area, length, weight, volume and temperature converters run instantly in the browser. When calibration drift affects measurement trust, the premium calibration drift analyzer adds structured loss exposure.

No sign-up for free tools. Decision reports on paid access when measurement error affects margin.

**CTA:** Open the converter:  
{{conversion_landing_url}}

**Hashtags:** #Engineering #Units #Calculators

---

## 4. Reddit / Community Posts

Tone: helpful builder seeking feedback — not ad spam. Adapt subreddit rules before posting.

---

### Community 01 — Manufacturing

**Title:** I built free OEE and scrap calculators for small CNC shops — looking for feedback

**Body:**

Small shops often quote jobs without a clear view of setup drift, scrap and machine-time exposure.

I built a free calculator set for this:  
{{oee_calculator_url}}

It does not replace ERP or engineering review. It is meant as a quick field estimate before quoting or scheduling.

Looking for feedback from CNC operators, shop owners and estimators:

- What variable is missing from a quick OEE/scrap check?
- What would make this useful before you accept similar work?

Hub with related tools: {{manufacturing_landing_url}}

---

### Community 02 — Construction

**Title:** Free concrete and renovation area calculators for bid sanity checks — feedback welcome

**Body:**

Estimators often catch quantity errors late. I put together browser-side calculators for concrete volume, roofing area and renovation m² cost as a quick pre-bid check.

Example: {{concrete_calculator_url}}

Not a substitute for takeoff software or professional estimating — just fast math before packages go out.

Contractors and PMs: what input would you always want on a free bid sanity tool?

More tools: {{construction_landing_url}}

---

### Community 03 — Logistics

**Title:** Route cost + fuel calculator for owner-operators — does this match how you price lanes?

**Body:**

Built a simple route cost estimator that includes distance, fuel rate and stop count for small fleet / dispatch workflows.

Try it: {{route_calculator_url}}

Trying to learn whether deadhead and idle time should be a separate input or implied in the route template.

Fleet owners and dispatchers — what breaks first in your spreadsheet model?

Hub: {{logistics_landing_url}}

---

### Community 04 — Restaurant

**Title:** Free food cost % calculator for menu items — looking for kitchen manager feedback

**Body:**

Portion drift and unpriced specials eat margin quietly. I built a free food cost calculator for quick plate-level checks.

Link: {{food_cost_calculator_url}}

Not POS integration — browser-only estimate from your ingredient inputs.

Kitchen managers / owners: do you track ideal vs actual food cost weekly? What would make a free tool worth 2 minutes before a menu change?

Industry page: {{restaurant_landing_url}}

---

### Community 05 — Energy

**Title:** kWh cost + quick carbon estimate tools — feedback from plant / facility folks?

**Body:**

Average kWh on the bill hides peak-hour pain. Built free kWh and quick carbon footprint calculators for rough facility exposure checks.

kWh tool: {{kwh_calculator_url}}

Looking for feedback on whether peak vs average should be split explicitly in a free tier.

Facility and sustainability folks — what assumption do you always challenge first?

Hub: {{energy_landing_url}}

---

### Community 06 — Agriculture

**Title:** Irrigation and crop yield quick calculators — useful for season planning?

**Body:**

Built free irrigation cost and crop yield calculators for rough season math before harvest numbers are final.

Irrigation check: {{irrigation_calculator_url}}

Not agronomy advice — input-based estimates only.

Farm operators: what’s the one variable missing from a 5-minute yield exposure check?

Hub: {{agriculture_landing_url}}

---

### Community 07 — Business / Finance

**Title:** Break-even and cash gap calculators for SMB pricing — what would you add?

**Body:**

Many SMBs price from revenue targets without a clear break-even or cash gap view. Free calculators here:

{{break_even_calculator_url}}

Looking for feedback from operators who still run this in spreadsheets.

What’s the first number you check before changing prices?

Hub: {{finance_landing_url}}

---

### Community 08 — Unit Conversion

**Title:** Area / length / weight converters with no sign-up — engineers, what’s still missing?

**Body:**

Built clean metric/imperial converters for area, length, weight, volume and temperature — browser-only, no account.

Area converter: {{area_converter_url}}

Useful before material orders and logistics quotes. Feedback welcome on unit pairs and precision defaults.

Hub: {{conversion_landing_url}}

---

## 5. Beta Partner Outreach

**Apply URL:** `https://sectorcalc.com/en/beta-partner?utm_source=email&utm_medium=email&utm_campaign=beta-partner&utm_content=outreach-01`

Replace `{{name}}`, `{{sector_or_tool}}`, `{{industry}}` before sending.

---

### Variant A — Operator / Workshop

**Subject:** Beta access for hidden-loss calculators in your sector

**Message:**

Hi {{name}},

I'm building SectorCalc, a sector-specific calculator and decision-report platform for teams that cannot justify a full ERP system but still need to measure loss, cost, waste and efficiency.

I'm looking for early operators to test the calculators in real workflows — quote checks, shift reviews, route pricing, menu costing and similar.

Beta partners receive premium decision reports in exchange for structured feedback (what inputs matter, what's missing, what would make the report actionable).

Relevant area: {{sector_or_tool}}

You can start with the free calculators here:  
{{landing_url}}

Apply for beta partner access:  
{{beta_partner_url}}

Thanks,  
{{sender_name}}

---

### Variant B — Consultant / Advisor

**Subject:** SectorCalc beta — decision reports for client loss diagnostics

**Message:**

Hi {{name}},

I'm launching SectorCalc — sector calculators plus export-ready decision reports for hidden loss, margin exposure and operational thresholds.

I'm inviting a small group of consultants and advisors who already help clients with pricing, operations or efficiency reviews.

Beta partners get premium report access in exchange for structured feedback on report clarity, assumptions and client readiness — not for public testimonials unless you opt in.

Relevant hub: {{landing_url}}

If this fits a client niche you serve, apply here:  
{{beta_partner_url}}

Best,  
{{sender_name}}

---

### Variant C — Small Business Owner

**Subject:** Quick loss calculators for {{industry}} — beta invite

**Message:**

Hi {{name}},

SectorCalc is a set of free sector calculators plus optional decision reports for when a quick estimate is not enough.

No ERP required. Browser-based tools for break-even, food cost, route cost, energy exposure and similar — with premium reports when you need hidden drivers and export-ready output.

I'm looking for a few {{industry}} owners to test the workflow and tell me what's missing.

Start free: {{landing_url}}  
Beta partner apply (premium reports for feedback): {{beta_partner_url}}

Thanks,  
{{sender_name}}

---

## 6. Email / DM Templates

### Short cold DM (LinkedIn / X / community)

Hi {{name}} — I'm building SectorCalc, sector-specific calculators and decision reports for teams that still calculate loss, cost and efficiency in spreadsheets.

Looking for beta feedback from {{industry}} operators.

Start here: {{landing_url}}

If useful, beta partner invite (premium reports for structured feedback): {{beta_partner_url}}

---

### Follow-up DM (7 days, no reply)

Hi {{name}} — quick follow-up on SectorCalc. Free {{free_tool_name}} if you want a 2-minute sanity check: {{free_tool_url}}

No pressure on beta — feedback on what's missing is equally helpful.

---

### Warm intro (mutual connection)

Hi {{name}} — {{mutual_name}} suggested I reach out. I'm testing SectorCalc with operators in {{industry}}: free calculators for quick exposure checks, premium reports when the number affects a decision.

Relevant start point: {{landing_url}}

---

## 7. Short Social Posts

180–280 characters each. Replace `{{url}}` with cluster-specific tracked link.

1. A profitable CNC quote can still lose margin in setup drift and scrap. Free OEE + scrap calculators on SectorCalc. {{url}}

2. Contingency goes first. Delay days eat margin before the schedule looks late. Measure construction overrun exposure. {{url}}

3. Loaded miles lie. Deadhead and fuel drift decide whether the route actually pays. Check route cost free. {{url}}

4. Food waste is lost menu margin — not just spoiled stock. Calculate food cost pressure in minutes. {{url}}

5. Average kWh hides peak-hour pain. Measure energy and carbon exposure before the bill surprises you. {{url}}

6. Yield drift can cost a season before harvest. Quick irrigation and crop calculators for field estimates. {{url}}

7. Revenue ≠ margin. Find break-even and cash gap before the next price change. {{url}}

8. Wrong m² → wrong order. Convert area units first, then decide. Free area converter. {{url}}

9. Tool wear is a line item until it isn't. CNC shops: check machine time + scrap before accepting repeat work. {{url}}

10. Concrete quantity errors compound across trades. Sanity-check volume before the pour order. {{url}}

11. Stop count matters as much as distance on last-mile routes. Route cost calculator — free. {{url}}

12. Portion creep is silent. Recipe cost check before the next menu print. {{url}}

13. Compressor leaks show up in kWh averages eventually. Peak exposure is the earlier signal. {{url}}

14. Feed efficiency drift hits dairy margin quietly. Free feed cost estimator to start. {{url}}

15. API bills scale faster than revenue. Cloud cost overrun analyzer for SMB tech spend. {{url}}

16. Calibration drift turns small measurement error into big material waste. Convert units, then verify. {{url}}

17. OEE below plan? Capacity loss may be priced as free capacity. Measure first. {{url}}

18. Subcontractor variance erodes bid margin line by line. Construction exposure tools — free tier. {{url}}

19. CBAM and carbon questions start with kWh and fuel math. Quick exposure check — no sign-up. {{url}}

20. Spreadsheet pricing breaks at scale. SectorCalc: free calculators, premium decision reports when it matters. {{url}}

---

## 8. 30-Day Publishing Calendar

### Week 1 — Index, landings, first outreach

| Day | Action |
|-----|--------|
| Mon | GSC URL inspection — all 8 cluster landings ([gsc-campaign-url-list.md](./gsc-campaign-url-list.md)) |
| Tue | Publish LinkedIn Post 01 (Manufacturing) + Post 02 (Construction) |
| Wed | Reddit Community 01 + 03; 5 beta outreach (Variant A) |
| Thu | Share 4 SEO hub links (manufacturing, construction, logistics, energy) with UTM |
| Fri | Share 5 free tool deep links (OEE, concrete, route, food cost, area converter) |
| Sat–Sun | 5 beta outreach (mixed variants); review dev console conversion events |

**Week 1 targets:** 8 landing inspections · 5 free tool shares · 10 beta outreach

---

### Week 2 — Manufacturing, construction, logistics focus

| Day | Action |
|-----|--------|
| Mon | LinkedIn Post 03 (Logistics) + Post 07 (Finance) |
| Tue | Reddit Community 02 + 07; community feedback synthesis doc |
| Wed | 10 outreach emails/DMs (construction + logistics operators) |
| Thu | Premium teaser posts (screenshots only — CNC OEE, route loss, project overrun) |
| Fri | WhatsApp/share logistics cluster to 3 fleet contacts |
| Sat–Sun | Review `free_tool_calculate` vs `free_to_premium_click` ([conversion playbook](./conversion-review-playbook.md)) |

**Week 2 targets:** 20 outreach · 3 premium teasers · 2 Reddit threads

---

### Week 3 — Restaurant, energy, agriculture + beta follow-up

| Day | Action |
|-----|--------|
| Mon | LinkedIn Post 04 (Restaurant) + Post 05 (Energy) |
| Tue | LinkedIn Post 06 (Agriculture) |
| Wed | Reddit Community 04, 05, 06 |
| Thu | Beta partner follow-up to Week 1 non-responders |
| Fri | Email Variant B to 5 consultants/advisors |
| Sat–Sun | Review `beta_partner_submit` and attribution notes quality |

**Week 3 targets:** 15 follow-ups · 3 cluster deep-dives · FAQ updates from inbound questions

---

### Week 4 — Review, optimize, content refresh

| Day | Action |
|-----|--------|
| Mon | Top pages review — analytics by `utm_campaign` |
| Tue | CTA copy review on lowest free→premium cluster |
| Wed | Search Console query review — align posts with emerging queries |
| Thu | LinkedIn Post 08 (Conversion) + 5 short social posts batch |
| Fri | First content update: authority guide link from top landing |
| Sat–Sun | Month-end report: top 5 URLs, beta lead count, next month cluster priority |

**Week 4 targets:** 1 CTA experiment · 1 content update · monthly conversion summary

---

## 9. UTM Link Standard

### Format

```
{base_url}{path}?utm_source={source}&utm_medium={medium}&utm_campaign={cluster_id}&utm_content={content_id}
```

### Rules

| Parameter | Rule | Examples |
|-----------|------|----------|
| `utm_source` | lowercase platform name | `linkedin`, `reddit`, `email`, `google`, `whatsapp` |
| `utm_medium` | lowercase channel type | `social`, `community`, `email`, `search_ads`, `qa` |
| `utm_campaign` | cluster ID from `campaign-clusters.ts` | `manufacturing-hidden-loss` |
| `utm_content` | post or asset ID | `post-01`, `reddit-oee`, `outreach-a` |

### Examples

```
/en/seo/manufacturing-cost-calculators?utm_source=linkedin&utm_medium=social&utm_campaign=manufacturing-hidden-loss&utm_content=post-01

/en/tools/free/oee-calculator?utm_source=reddit&utm_medium=community&utm_campaign=manufacturing-hidden-loss&utm_content=reddit-oee

/en/beta-partner?utm_source=email&utm_medium=email&utm_campaign=beta-partner&utm_content=outreach-a
```

### Placeholder map for copy-paste

| Placeholder | Resolved path |
|-------------|---------------|
| `{{manufacturing_landing_url}}` | `/en/seo/manufacturing-cost-calculators` + UTM |
| `{{construction_landing_url}}` | `/en/seo/construction-cost-calculators` + UTM |
| `{{logistics_landing_url}}` | `/en/seo/logistics-route-calculators` + UTM |
| `{{restaurant_landing_url}}` | `/en/industries/restaurant` + UTM |
| `{{energy_landing_url}}` | `/en/seo/energy-carbon-calculators` + UTM |
| `{{agriculture_landing_url}}` | `/en/seo/agriculture-calculators` + UTM |
| `{{finance_landing_url}}` | `/en/seo/finance-business-calculators` + UTM |
| `{{conversion_landing_url}}` | `/en/seo/unit-conversion-calculators` + UTM |
| `{{beta_partner_url}}` | `/en/beta-partner` + UTM |
| `{{oee_calculator_url}}` | `/en/tools/free/oee-calculator` + UTM |
| `{{free_tool_url}}` | cluster-specific free tool + UTM |

**Code helper:** `buildCampaignUrl(href, clusterId, source, medium)` in `src/lib/campaigns/campaign-clusters.ts`

---

## 10. Measurement Checklist

Review weekly ([conversion-review-playbook.md](./conversion-review-playbook.md)).

### Traffic & engagement

- [ ] Landing page visits by cluster (`utm_campaign`)
- [ ] Free tool opens (`free_tool_open`)
- [ ] Free tool calculate events (`free_tool_calculate`)
- [ ] SEO hub CTA clicks (`seo_landing_cta_click`)

### Conversion intent

- [ ] Free → premium clicks (`free_to_premium_click`)
- [ ] Premium analyzer opens (`premium_analyzer_open`)
- [ ] Premium unlock clicks (`premium_unlock_click`)
- [ ] Pricing views and CTA clicks (`pricing_view`, `pricing_cta_click`)

### Lead capture

- [ ] Beta partner page opens (`beta_partner_open`)
- [ ] Beta partner submits (`beta_partner_submit`)
- [ ] Attribution block present in lead notes (Firestore QA)

### Search & quality

- [ ] Top queries in Google Search Console
- [ ] Index coverage — 8 campaign landings indexed
- [ ] Mobile usability — no horizontal scroll at 390px on top landings
- [ ] Broken UTM links (404 check on shared URLs)

### Privacy

- [ ] No PII in analytics event payloads
- [ ] Beta form PII only in Firestore leads

### Data source note

Production analytics is no-op until GA4/PostHog is wired. Use dev console `trackConversionEvent` logs and manual UTM QA until live dashboard is connected.

---

## Appendix — Quick reference

| Cluster ID | Landing path |
|------------|--------------|
| `manufacturing-hidden-loss` | `/en/seo/manufacturing-cost-calculators` |
| `construction-cost-overrun` | `/en/seo/construction-cost-calculators` |
| `logistics-route-cost` | `/en/seo/logistics-route-calculators` |
| `restaurant-food-margin` | `/en/industries/restaurant` |
| `energy-carbon-exposure` | `/en/seo/energy-carbon-calculators` |
| `agriculture-yield-loss` | `/en/seo/agriculture-calculators` |
| `business-finance-calculators` | `/en/seo/finance-business-calculators` |
| `unit-conversion-traffic` | `/en/seo/unit-conversion-calculators` |

**Do not claim:** guaranteed savings, certified compliance outcomes, fake user counts, or fabricated case studies.

**Do claim:** free browser calculators, transparent assumptions, premium decision reports with hidden-driver diagnostics, beta partner program for structured feedback.
