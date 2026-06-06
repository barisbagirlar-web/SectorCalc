import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type {
  FreeRiskLevel,
  FreeToolInputValues,
  FreeToolResult,
} from "@/lib/tools/free-tool-results";

function getNumber(values: FreeToolInputValues, key: string): number {
  const raw = values[key];
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }
  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function buildGenericResult(
  riskLevel: FreeRiskLevel,
  headline: string,
  summary: string,
  missingFactors: string[]
): FreeToolResult {
  return {
    riskLevel,
    headline,
    summary,
    missingFactors,
    ctaLabel: "Unlock the Full Analyzer",
  };
}

const EXTENDED_SECTORS = new Set([
  "welding-fabrication",
  "hvac",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
]);

export function isExtendedFreeSector(sector: string): boolean {
  return EXTENDED_SECTORS.has(sector);
}

export function calculateExtendedFreeResult(
  tool: RevenueTool,
  values: FreeToolInputValues
): FreeToolResult | null {
  if (!EXTENDED_SECTORS.has(tool.sector)) {
    return null;
  }

  if (tool.sector === "welding-fabrication") {
    const laborExposure =
      getNumber(values, "laborHours") + getNumber(values, "fitUpHours");
    if (laborExposure >= 16) {
      return buildGenericResult(
        "HIGH",
        "This fab job may be underpriced.",
        "High labor and fit-up exposure can compress margin before rework is modeled.",
        ["Gas and consumables", "Rework risk", "Minimum safe bid"]
      );
    }
    if (laborExposure >= 8) {
      return buildGenericResult(
        "MEDIUM",
        "Fit-up time may create margin pressure.",
        "Visible labor exposure suggests a full bid check before quoting.",
        ["Rework risk", "Target margin", "Minimum safe bid"]
      );
    }
  }

  if (tool.sector === "hvac") {
    const sqft = getNumber(values, "squareFootage");
    const tonnage = getNumber(values, "tonnage");
    const ruleOfThumb = sqft > 0 ? sqft / 500 : 0;
    if (tonnage > 0 && ruleOfThumb > 0 && tonnage < ruleOfThumb * 0.7) {
      return buildGenericResult(
        "HIGH",
        "Tonnage may be undersized for the area.",
        "Undersizing can lead to callbacks and margin loss on install labor.",
        ["Equipment cost", "Callback risk", "Minimum project price"]
      );
    }
    if (getNumber(values, "laborHours") >= 40) {
      return buildGenericResult(
        "MEDIUM",
        "Labor hours suggest a full margin check.",
        "Large HVAC installs need callback and commissioning cost in the bid.",
        ["Commissioning cost", "Callback risk", "Target margin"]
      );
    }
  }

  if (tool.sector === "electrical-contracting") {
    const laborCost = getNumber(values, "laborHours") * getNumber(values, "laborRate");
    const ratio =
      getNumber(values, "materialCost") > 0
        ? laborCost / getNumber(values, "materialCost")
        : 0;
    if (ratio < 0.4 && getNumber(values, "laborHours") >= 8) {
      return buildGenericResult(
        "HIGH",
        "Labor may be under-scoped for material load.",
        "Panel jobs with heavy material and low labor hours often miss testing time.",
        ["Testing hours", "Inspection risk", "Safe panel bid"]
      );
    }
    if (getNumber(values, "laborHours") >= 16) {
      return buildGenericResult(
        "MEDIUM",
        "Labor exposure needs a bid check.",
        "Visible hours suggest verifying inspection and testing allowance.",
        ["Inspection risk", "Target margin", "Safe panel bid"]
      );
    }
  }

  if (tool.sector === "landscaping-lawn-care") {
    const monthlyLoad =
      getNumber(values, "crewHoursPerVisit") * getNumber(values, "visitsPerMonth");
    if (monthlyLoad >= 40) {
      return buildGenericResult(
        "HIGH",
        "This route may be underpriced.",
        "High monthly crew hours can erode margin before fuel and wear are included.",
        ["Fuel cost", "Equipment wear", "Minimum monthly price"]
      );
    }
    if (monthlyLoad >= 20) {
      return buildGenericResult(
        "MEDIUM",
        "Visit load deserves a contract check.",
        "Visible crew hours suggest testing the monthly bid before signing.",
        ["Supply cost", "Target margin", "Minimum monthly price"]
      );
    }
  }

  if (tool.sector === "auto-repair-shop") {
    const quoted = getNumber(values, "quotedPrice");
    const visibleCost =
      getNumber(values, "repairHours") * 80 + getNumber(values, "partsCost");
    if (quoted > 0 && visibleCost / quoted >= 0.75) {
      return buildGenericResult(
        "HIGH",
        "Quoted price may not cover the job.",
        "Visible labor and parts pressure is high before diagnostic and comeback risk.",
        ["Diagnostic hours", "Comeback risk", "True job profit"]
      );
    }
    if (getNumber(values, "repairHours") >= 6) {
      return buildGenericResult(
        "MEDIUM",
        "Long repair hours need a margin check.",
        "Extended repair time increases comeback and labor exposure.",
        ["Comeback risk", "Parts markup", "True job profit"]
      );
    }
  }

  if (tool.sector === "printing-signage") {
    const designCost = getNumber(values, "designHours") * getNumber(values, "laborRate");
    const ratio =
      getNumber(values, "materialCost") > 0
        ? designCost / getNumber(values, "materialCost")
        : 0;
    if (ratio >= 1.2) {
      return buildGenericResult(
        "HIGH",
        "Design time may erode signage margin.",
        "Heavy design load on print jobs often needs reprint and install buffer.",
        ["Install hours", "Reprint risk", "Minimum safe price"]
      );
    }
    if (getNumber(values, "designHours") >= 4) {
      return buildGenericResult(
        "MEDIUM",
        "Design hours need a bid check.",
        "Visible design exposure suggests verifying install and reprint allowance.",
        ["Ink cost", "Reprint risk", "Minimum safe price"]
      );
    }
  }

  if (tool.sector === "plumbing") {
    const fixtures = getNumber(values, "fixtureCount");
    const hoursPerFixture =
      fixtures > 0 ? getNumber(values, "laborHours") / fixtures : 0;
    if (fixtures >= 4 && hoursPerFixture < 1.5) {
      return buildGenericResult(
        "HIGH",
        "Labor may be under-scoped for fixture count.",
        "Multi-fixture jobs often need material runs and callback buffer.",
        ["Material runs", "Callback risk", "Safe job price"]
      );
    }
    if (getNumber(values, "laborHours") >= 6) {
      return buildGenericResult(
        "MEDIUM",
        "Labor exposure needs a job check.",
        "Visible hours suggest verifying parts and callback allowance.",
        ["Callback risk", "Target margin", "Safe job price"]
      );
    }
  }

  if (tool.sector === "carpentry-millwork") {
    const totalHours =
      getNumber(values, "laborHours") + getNumber(values, "installHours");
    if (totalHours >= 24) {
      return buildGenericResult(
        "HIGH",
        "This millwork job may be underpriced.",
        "Long shop and install hours can compress margin before waste is modeled.",
        ["Finishing cost", "Waste rate", "Minimum millwork bid"]
      );
    }
    if (totalHours >= 12) {
      return buildGenericResult(
        "MEDIUM",
        "Labor and install time need a bid check.",
        "Visible hours suggest verifying waste and finishing allowance.",
        ["Waste rate", "Target margin", "Minimum millwork bid"]
      );
    }
  }

  if (tool.sector === "roofing") {
    const laborCost = getNumber(values, "laborHours") * getNumber(values, "laborRate");
    const ratio =
      getNumber(values, "materialCost") > 0
        ? laborCost / getNumber(values, "materialCost")
        : 0;
    if (ratio < 0.35 && getNumber(values, "laborHours") >= 16) {
      return buildGenericResult(
        "HIGH",
        "Tear-off and delay risk may be missing.",
        "Material-heavy roofing bids often underprice labor, tear-off and dump fees.",
        ["Tear-off cost", "Weather delay risk", "Minimum roofing bid"]
      );
    }
    if (getNumber(values, "laborHours") >= 24) {
      return buildGenericResult(
        "MEDIUM",
        "Long labor hours need a contract check.",
        "Extended crew days increase weather and warranty exposure.",
        ["Dump fees", "Target margin", "Minimum roofing bid"]
      );
    }
  }

  if (tool.sector === "painting") {
    const prepIntensity =
      getNumber(values, "areaSize") > 0
        ? getNumber(values, "prepHours") / getNumber(values, "areaSize") * 100
        : 0;
    if (prepIntensity >= 0.15) {
      return buildGenericResult(
        "HIGH",
        "Prep time may erode painting margin.",
        "Heavy prep relative to area often needs scaffold and touch-up buffer.",
        ["Scaffold cost", "Touch-up risk", "Minimum painting price"]
      );
    }
    if (getNumber(values, "prepHours") >= 8) {
      return buildGenericResult(
        "MEDIUM",
        "Prep hours need a job check.",
        "Visible prep exposure suggests verifying touch-up allowance.",
        ["Touch-up risk", "Target margin", "Minimum painting price"]
      );
    }
  }

  if (tool.sector === "sheet-metal") {
    const setupTime = getNumber(values, "setupTime");
    const quantity = Math.max(1, getNumber(values, "quantity"));
    if (quantity <= 2 && setupTime >= 45) {
      return buildGenericResult(
        "HIGH",
        "Setup-heavy sheet metal may be underpriced.",
        "Low quantity with long setup often destroys margin before scrap is modeled.",
        ["Programming time", "Scrap rate", "Safe sheet metal quote"]
      );
    }
    if (setupTime >= 25) {
      return buildGenericResult(
        "MEDIUM",
        "Setup time may create quote risk.",
        "Visible setup exposure suggests a full quote check before accepting.",
        ["Scrap rate", "Finishing cost", "Safe sheet metal quote"]
      );
    }
  }

  if (tool.sector === "3d-printing-service") {
    const machineCost =
      getNumber(values, "printHours") * getNumber(values, "machineRate");
    const ratio =
      getNumber(values, "materialCost") > 0
        ? machineCost / getNumber(values, "materialCost")
        : 0;
    if (getNumber(values, "printHours") >= 12 && ratio >= 2) {
      return buildGenericResult(
        "HIGH",
        "Long print jobs may be underpriced.",
        "Extended machine time increases fail-rate and post-processing exposure.",
        ["Post-processing", "Fail rate", "Minimum print price"]
      );
    }
    if (getNumber(values, "printHours") >= 6) {
      return buildGenericResult(
        "MEDIUM",
        "Print time needs a margin check.",
        "Visible machine hours suggest verifying fail-rate buffer.",
        ["Fail rate", "Target margin", "Minimum print price"]
      );
    }
  }

  return buildGenericResult(
    "LOW",
    "The quick check does not show severe visible risk.",
    "This result is only a quick estimate. Use the full analyzer before making pricing or bid decisions.",
    tool.freeMissingFactors.slice(0, 4)
  );
}
