const fs = require('fs');

const TRANSLATIONS = {
  en: {
    hero: {
      eyebrow: "Loss Discovery Engine · {toolCount} Engineering Calculations",
      headline: "Stop the Numbers from Discovering Your Losses",
      headlineEm: "Before You Do.",
      subtitle: "Most businesses track revenue. Few digitize operational losses. SectorCalc shows you what you're losing before you even know which calculation to make.",
      qualifierLabel: "Which losses are you facing? →",
      sector: "Sector",
      sectors: {
        cnc: "Manufacturing / CNC",
        food: "Food & Packaging",
        energy: "Energy",
        construction: "Construction",
        logistics: "Logistics"
      },
      challenge: "Main Challenge",
      challenges: {
        scrap: "Scrap & Waste",
        energy: "Energy Cost",
        capacity: "Capacity Loss",
        oee: "OEE / Efficiency",
        pricing: "Pricing Error"
      },
      size: "Size",
      sizes: ["11–50 Employees", "51–250 Employees", "250+ Employees", "1–10 Employees"],
      detectedAreas: "Detected opportunity areas",
      areaCount: "{count} Areas",
      showCalculations: "Show Related Calculations →",
      micro: "No credit card · No Excel · Results in 60 seconds"
    },
    oppMap: {
      scrap: ["Scrap Cost", "Material Yield", "Quality Loss", "Pricing Margin"],
      energy: ["Specific Consumption", "Energy Intensity", "CO₂ Cost", "Tariff Optimization"],
      capacity: ["OEE Impact", "Bottleneck Analysis", "Capacity Cost", "Setup Time"],
      oee: ["Downtime €", "Speed Loss €", "Quality Reject €", "Total OEE Impact"],
      pricing: ["Machine Hour", "Labor Cost", "Overhead Rate", "Quotation Margin"]
    },
    pain: {
      ticker: "While you're reading this page, operational losses continue to accumulate in manufacturing plants across Europe due to miscalculated scrap rates.",
      tickerHighlight: "miscalculated scrap rates",
      label: "Where's the Problem?",
      h2Line1: "Businesses Aren't Losing Money",
      h2Line2: "Where They Think They Are.",
      cards: [
        {
          label: "Scrap & Waste",
          title: "Most manufacturers assume 8%, actual is 14%.",
          body: "This 6-point difference creates an annual gap of €40,000–80,000 in a mid-sized plant. And it doesn't show up on the P&L.",
          link: "See scrap calculations →",
          href: "/tools/manufacturing"
        },
        {
          label: "Machine Efficiency",
          title: "OEE looks like 70%. The real cost impact is uncalculated.",
          body: "Optimization decisions cannot be made without converting downtime, speed loss, and quality rejects into €.",
          link: "See OEE tools →",
          href: "/tools/oee"
        },
        {
          label: "Pricing Error",
          title: "Few calculate machine hour costs correctly when quoting.",
          body: "Machine hours not calculated according to VDI 2067, ASHRAE, and ISO standards → margins are eaten on every quote.",
          link: "Calculate machine hour →",
          href: "/tools/machine-hour-rate"
        },
        {
          label: "Energy Cost",
          title: "Energy bills are paid, specific consumption is ignored.",
          body: "Without knowing the energy cost per product and per process step, sustainability claims remain mere intentions.",
          link: "See energy tools →",
          href: "/tools/energy"
        }
      ]
    },
    calc: {
      label: "Calculate Now",
      h2: "See Your Own Loss.",
      subhead: "3 inputs. 60 seconds. See your annual scrap cost and recovery potential instantly.",
      headerTitle: "Scrap Cost Analysis — Quick Assessment",
      badge: "LIVE",
      progress: "Progress: {pct}% — {remaining} steps left",
      progressDone: "Progress: 100% — Calculation complete",
      inpProd: "Monthly Production (kg/pcs)",
      inpScrap: "Actual Scrap Rate (%)",
      inpCost: "Unit Cost (€)",
      resLoss: "Annual Loss",
      resRec: "Recovery Pot.",
      resRoi: "ROI (Pro)",
      aiHeader: "AI Insight · Pro Feature",
      aiTextAbove: "Your scrap rate of {rate}% is above the manufacturing average of 6–8%. This deviation alone indicates a monthly operational loss of ≈{monthlyLoss}.",
      aiTextBelow: "Your scrap rate of {rate}% is within the manufacturing average of 6–8%.",
      above: "above",
      below: "within",
      aiBlur: "To reduce the scrap rate by 2% in facilities of similar scale, the three most critical intervention points are: (1) Process parameter optimization — especially mold temperature tolerances. (2) Operator error analysis — per-shift calibration procedure. (3) Material acceptance criteria — incoming quality control thresholds.",
      aiGateBtn: "Unlock with Pro →",
      btnFullReport: "Get Full Analysis & PDF Report →",
      microText: "Just want the result?",
      microLink: "Free tools are here →"
    },
    social: {
      labelMethod: "Methodology",
      labelResults: "Real Results",
      h2: "Not Numbers, Decisions.",
      cases: [
        {
          sector: "CNC Shop · Germany",
          problem: "Machine hour costs were miscalculated in quotes. Margins were eaten on every work order.",
          result: "+8.4%",
          resultLabel: "margin improvement"
        },
        {
          sector: "Food Manufacturer · Turkey",
          problem: "Raw material waste rate was invisible. The magnitude of annual loss was unknown.",
          result: "€67,000",
          resultLabel: "annual recovery"
        },
        {
          sector: "Packaging Plant · Poland",
          problem: "Downtime and speed loss were tracked separately. Total OEE impact wasn't visible in currency.",
          result: "+11%",
          resultLabel: "availability increase"
        }
      ],
      quote: "\"We used to do these calculations manually in Excel. The error rate was high, it was a waste of time. After using SectorCalc, our quotation process accelerated by 40% and our prices started reflecting actual costs.\"",
      quoteAuthor: "— Production Manager, Mid-Sized CNC Business, Turkey"
    },
    compare: {
      label: "Why Pro?",
      h2: "Go Beyond the Number.",
      subhead: "Free tools give you the number. Pro tells you what the number means and what you need to do.",
      free: {
        tier: "Free",
        desc: "Get the number. Start the decision process.",
        btn: "Start Free"
      },
      pro: {
        tier: "Pro",
        badge: "Most Popular",
        desc: "Make a decision. Stop the losses. Write ROI.",
        btn: "Start Stopping My Loss →"
      },
      rows: [
        { text: "{count}+ calculation tools", sub: "All sectors, base formulas", proSub: "All sectors, ISO/VDI formulas", free: true, pro: true },
        { text: "Instant result", sub: "Input value, get value", proSub: "Input value, get value", free: true, pro: true },
        { text: "AI Insight & Recommendation", sub: "Business impact analysis", proSub: "Business explanation of the number", free: false, pro: true },
        { text: "Scenario Analysis", sub: "What if I reduce the rate by 2%?", proSub: "Best/worst/target comparison", free: false, pro: true },
        { text: "Industry Benchmark", sub: "Compare with competitors", proSub: "Compare with competitors", free: false, pro: true },
        { text: "PDF Report", sub: "Signed, referenced", proSub: "Signed, referenced, shareable", free: false, pro: true }
      ]
    },
    method: {
      stats: [
        { num: "{count}+", label: "ISO/ASME/VDI referenced calculation tools" },
        { num: "18", label: "Industry sectors covered" },
        { num: "161", label: "Verified premium formulas with safety bounds" }
      ],
      label: "Methodology Infrastructure",
      h2: "Built on Recognized Standards.",
      badges: [
        { name: "ISO", sub: "International Standards" },
        { name: "VDI 2067", sub: "Machine Hour Cost" },
        { name: "ASHRAE", sub: "Energy & HVAC" },
        { name: "ASME", sub: "Mechanical Eng." },
        { name: "IEC", sub: "Electrical & Electronics" },
        { name: "EN 13306", sub: "Maintenance Terms" },
        { name: "Lean", sub: "Process Improvement" },
        { name: "Six Sigma", sub: "Quality Methodology" }
      ]
    },
    final: {
      timerPrefix: "⏱ This month's price guarantee ends in:",
      h2Line1: "Start with One Calculation.",
      h2Line2: "Leave with Better Decisions.",
      p: "The number of engineers who apply VDI 2067 correctly is limited. Platform access is credit-based — no subscription, no commitment. Today's analysis might show a different picture tomorrow.",
      cta: "Stop My Loss →",
      secBtn: "Check free tools first",
      note: "Secure checkout · Paddle Billing · No subscriptions"
    }
  },
};

// Map DE, FR, ES, AR identically to EN for now, as we just want the app to build properly and English is the baseline for COM
['de', 'fr', 'es', 'ar'].forEach(loc => TRANSLATIONS[loc] = TRANSLATIONS.en);

for (const locale of Object.keys(TRANSLATIONS)) {
  const realPath = `messages/${locale}.json`;
  if (fs.existsSync(realPath)) {
    const realData = JSON.parse(fs.readFileSync(realPath, 'utf8'));
    realData.landingV3 = TRANSLATIONS[locale];
    fs.writeFileSync(realPath, JSON.stringify(realData, null, 2) + '\n');
    console.log(`Merged landingV3 for ${locale}`);
  }
}
