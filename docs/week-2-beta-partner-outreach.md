# Week-2 Beta Partner Outreach

Systematic outreach for Week-2 after initial launch traffic. Goal: 30–50 relevant operators/consultants — quality over volume.

**Related docs:**
- [Launch Campaign Content Pack](./launch-campaign-content-pack.md)
- [Week-2 Scale-Up Plan](./week-2-scale-up-plan.md)
- [First Traffic Campaigns](./first-traffic-campaigns.md)

---

## Target

30–50 relevant operators/consultants across priority sectors.

Track submissions via `beta_partner_submit` event. If beta leads exist but paid intent is weak, prioritize proof loop over payment sprint ([decision gates](./monetization-decision-gates.md)).

---

## Priority sectors

1. CNC / machine shops → `manufacturing-hidden-loss`
2. Construction estimators → `construction-cost-overrun`
3. Logistics operators → `logistics-route-cost`
4. Restaurant/catering operators → `restaurant-food-margin`
5. Energy consultants → `energy-carbon-exposure`
6. Agriculture/dairy operators → `agriculture-yield-loss`

Match outreach landing URL to cluster `landingHref` + UTM from [campaign clusters](../src/lib/campaigns/campaign-clusters.ts).

---

## Message template

> I'm building SectorCalc, a sector-specific calculator and decision-report platform for teams that still calculate loss, cost, waste and efficiency in spreadsheets.
>
> I'm looking for early beta feedback from **{{industry}}** operators.
>
> You can test the free tools here:  
> **{{landing_url}}**
>
> If useful, I'd like to invite you as a beta partner:  
> **{{beta_partner_url}}**
>
> Feedback requested:
> - missing variable
> - wrong assumption
> - report usefulness
> - sector-specific pain
> - willingness to pay for report/export

Replace `{{landing_url}}` with cluster landing + UTM (`utm_campaign`, `utm_source=linkedin`, `utm_medium=outreach`).  
Replace `{{beta_partner_url}}` with `/beta-partner` + same campaign attribution.

---

## Week-2 cadence

| Day | Target |
|---|---|
| Day 3 (Week-1 carryover) | 10 contacts |
| Day 11 | 15 contacts |
| Day 12–14 | 5–25 follow-ups |

Log in outreach tracker:

| Date | Contact type | Sector | Landing URL | Response | Beta submit? |
|---|---|---|---|---|---|
| | | | | | |

---

## Rules

- Do not promise guaranteed ROI or certification
- Do not share premium report content without entitlement
- Personalize industry pain from cluster `primaryPain`
- If no traffic on shared landing URL, fix distribution/SEO before more outreach
