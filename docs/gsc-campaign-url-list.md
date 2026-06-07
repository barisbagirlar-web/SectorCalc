# GSC Campaign URL List

Priority URLs for Search Console inspection and campaign QA with UTM tags.

Base UTM template:

```
?utm_source=test&utm_medium=qa&utm_campaign={cluster_id}
```

## Landing pages

1. `/en/seo/manufacturing-cost-calculators?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`
2. `/en/seo/construction-cost-calculators?utm_source=test&utm_medium=qa&utm_campaign=construction-cost-overrun`
3. `/en/seo/logistics-route-calculators?utm_source=test&utm_medium=qa&utm_campaign=logistics-route-cost`
4. `/en/industries/restaurant?utm_source=test&utm_medium=qa&utm_campaign=restaurant-food-margin`
5. `/en/seo/energy-carbon-calculators?utm_source=test&utm_medium=qa&utm_campaign=energy-carbon-exposure`
6. `/en/seo/agriculture-calculators?utm_source=test&utm_medium=qa&utm_campaign=agriculture-yield-loss`
7. `/en/seo/finance-business-calculators?utm_source=test&utm_medium=qa&utm_campaign=business-finance-calculators`
8. `/en/seo/unit-conversion-calculators?utm_source=test&utm_medium=qa&utm_campaign=unit-conversion-traffic`

## Free tool samples

- `/en/tools/free/oee-calculator?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`
- `/en/tools/free/concrete-volume-calculator?utm_source=test&utm_medium=qa&utm_campaign=construction-cost-overrun`
- `/en/tools/free/route-cost-calculator?utm_source=test&utm_medium=qa&utm_campaign=logistics-route-cost`
- `/en/tools/free/food-cost-calculator?utm_source=test&utm_medium=qa&utm_campaign=restaurant-food-margin`
- `/en/tools/free/kwh-cost-calculator?utm_source=test&utm_medium=qa&utm_campaign=energy-carbon-exposure`
- `/en/tools/free/area-converter?utm_source=test&utm_medium=qa&utm_campaign=unit-conversion-traffic`

## Premium analyzer samples

- `/en/tools/premium-schema/cnc-oee-loss?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`
- `/en/tools/premium-schema/construction-project-overrun?utm_source=test&utm_medium=qa&utm_campaign=construction-cost-overrun`
- `/en/tools/premium-schema/logistics-route-loss?utm_source=test&utm_medium=qa&utm_campaign=logistics-route-cost`
- `/en/tools/premium-schema/food-waste-margin-loss?utm_source=test&utm_medium=qa&utm_campaign=restaurant-food-margin`
- `/en/tools/premium-schema/energy-peak-cost?utm_source=test&utm_medium=qa&utm_campaign=energy-carbon-exposure`
- `/en/tools/premium-schema/calibration-drift-risk?utm_source=test&utm_medium=qa&utm_campaign=unit-conversion-traffic`

## Conversion pages

- `/en/pricing?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`
- `/en/beta-partner?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`

## Homepage

- `/en?utm_source=test&utm_medium=qa&utm_campaign=manufacturing-hidden-loss`

## Manual QA checklist

- [ ] UTM params persist on internal CTA navigation (sessionStorage + href)
- [ ] Free → premium CTA keeps campaign context
- [ ] Premium unlock / pricing CTAs fire without console errors
- [ ] Beta partner submit appends attribution block to notes
- [ ] Mobile 390px — no horizontal scroll on pricing / free tool pages
- [ ] Pricing shows Pro $19/mo and Team $49/mo unchanged
