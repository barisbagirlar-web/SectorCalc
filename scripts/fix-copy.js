const fs = require('fs');

const path = 'messages/en.json';
let data = fs.readFileSync(path, 'utf8');
let json = JSON.parse(data);

// Fix Contradictory Scrap Rates
if (json.landingV3 && json.landingV3.calc) {
  json.landingV3.calc.aiTextAbove = "Your {rate}% scrap rate is directly eroding your profit margins. This indicates approximately {monthlyLoss} monthly operational loss.";
  json.landingV3.calc.subtitle = "Quick assessment. See your annual scrap cost and recovery potential instantly.";
  json.landingV3.calc.progressDone = "Result ready";
}

// Fix another instance of subtitle/progress if any
if (json.landingPage && json.landingPage.calc) {
  json.landingPage.calc.subtitle = "Quick assessment. See your annual scrap cost and recovery potential instantly.";
  json.landingPage.calc.progressComplete = "Result ready";
}

// Free vs Pro Differentiation (landingV3)
if (json.landingV3 && json.landingV3.features) {
  json.landingV3.features.forEach(f => {
    if (f.sub === "Business impact analysis") f.sub = "Basic output summary";
    if (f.proSub === "Business explanation of the number") f.proSub = "Actionable financial strategy";
    if (f.proSub === "Best/worst/target comparison") f.proSub = "Interactive scenario planning";
    if (f.sub === "Best/worst/target comparison") f.sub = "Interactive scenario planning";
  });
}
// Free vs Pro Differentiation (pricing)
if (json.pricing && json.pricing.plans) {
  json.pricing.plans.forEach(p => {
    if (p.price === "Credit-based") p.price = "Pay-per-report (No subscriptions)";
    if (p.features) {
      p.features.forEach(f => {
        if (f.sub === "Business impact analysis of your number") f.sub = "Basic output summary";
        if (f.sub === "Best/worst/target comparison") f.sub = "Interactive scenario planning";
      });
    }
  });
}

// Grammar Fixes
if (json.landingV3 && json.landingV3.pain) {
  json.landingV3.pain.cards.forEach(c => {
    if (c.title === "Most manufacturers assume 8%, actual is 14%.") c.title = "Most manufacturers assume 8%, the actual rate is 14%.";
    if (c.body === "Machine hours not calculated according to VDI 2067, ASHRAE, and ISO standards → margins are eaten on every quote.") {
      c.body = "When machine hours are not calculated according to VDI 2067, ASHRAE, and ISO standards → margins are eaten on every quote.";
    }
  });
  if (json.landingV3.pain.h2 === "Not Numbers, Decisions.") {
    json.landingV3.pain.h2 = "Not Just Numbers — Decisions.";
  }
}

// Stats gap
if (json.landingV3 && json.landingV3.stats) {
  json.landingV3.stats.forEach(s => {
    if (s.num === "161") s.num = "552";
  });
}

// Methodology Subtitle
if (json.landingV3 && json.landingV3.methodology) {
  json.landingV3.methodology.subtitle = "All calculations are strictly verified against these global engineering standards to ensure audit-proof accuracy.";
}

// Clear timer strings
if (json.pricing && json.pricing.hero) json.pricing.hero.countdownPrefix = "";
if (json.landingV3 && json.landingV3.final) json.landingV3.final.timerPrefix = "";

fs.writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log("Updated en.json successfully");
