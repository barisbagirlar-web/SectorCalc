"use client";

import { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import type {
  CaseStudyEntry,
  CaseStudySector,
  CaseStudyLossType,
  CaseStudyToolRoute,
} from "@/lib/case-studies/case-study-types";

// Sector list
const SECTOR_OPTIONS: { value: CaseStudySector; label: string }[] = [
  { value: "cnc", label: "CNC / Machining" },
  { value: "construction", label: "Construction / Bid Management" },
  { value: "welding", label: "Welding Workshop" },
  { value: "hvac", label: "HVAC / Climate Control" },
  { value: "plumbing-electrical", label: "Plumbing & Electrical" },
  { value: "sheet-metal", label: "Sheet Metal Processing" },
  { value: "cleaning", label: "Industrial Cleaning" },
  { value: "restaurant", label: "Restaurant / Service" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "energy", label: "Energy Efficiency" },
  { value: "logistics", label: "Logistics / Transportation" },
  { value: "sustainability", label: "Sustainability / CBAM" },
];

// Loss type list
const LOSS_TYPE_OPTIONS: { value: CaseStudyLossType; label: string }[] = [
  { value: "material_scrap", label: "Material Scrap / Waste" },
  { value: "labor_rework", label: "Labor Errors / Rework" },
  { value: "schedule_delay", label: "Time / Site Delay" },
  { value: "route_deadhead", label: "Logistics Deadhead" },
  { value: "food_waste", label: "Food Waste / Spoilage" },
  { value: "return_erosion", label: "Return Cost Margin Erosion" },
  { value: "energy_demand", label: "Peak Energy Demand Penalty" },
  { value: "margin_leak", label: "Cost Leak / Quote Overrun" },
  { value: "carbon_cost", label: "Carbon Tax / Emission Penalty" },
];

// Calculation tool route list
const TOOL_ROUTE_OPTIONS: { value: CaseStudyToolRoute; label: string }[] = [
  { value: "premium-tools", label: "Premium (/premium-tools/...)" },
  { value: "premium-schema", label: "Premium Schema (/tools/premium-schema/...)" },
  { value: "premium", label: "Premium Tools (/premium/...)" },
];

// Empty form template
const INITIAL_FORM_STATE = {
  slug: "",
  sector: "cnc" as CaseStudySector,
  sectorLabel: "CNC / Machining",
  title: "",
  seoTitle: "",
  seoDescription: "",
  whatIsIt: "",
  howIsItCalculated: "",
  whyItMatters: "",
  problem: "",
  inputSummary: [""] as string[],
  calculationResult: "",
  calculationLogic: "",
  academicMethodology: "",
  lossType: "schedule_delay" as CaseStudyLossType,
  lossTypeLabel: "Time / Site Delay",
  suggestedAction: "",
  toolSlug: "",
  toolTitle: "",
  toolRoute: "premium-tools" as CaseStudyToolRoute,
};

// Ready Examples (with Rich Text HTML Tags)
const EXAMPLES = {
  cnc: {
    slug: "cnc-job-shop-field-analysis",
    sector: "cnc" as CaseStudySector,
    sectorLabel: "CNC / Machining",
    title: "CNC Machining Setup and Programming Loss Cost Analysis",
    seoTitle: "CNC Workshop Cost and Quote Calculation Analysis",
    seoDescription: "Impact of spindle time, programming, setup and unplanned downtime on quote costs in CNC workshops and calculation methods.",
    whatIsIt: "An analytical study measuring the impact of <strong>spindle time</strong>, programming, setup, and unplanned downtime on unit part cost and bidding risks in CNC machining.",
    howIsItCalculated: "Based on machine hourly rate; setup time, CAD/CAM programming time, and historical downtime data are incorporated into the base quote price using a deterministic formula. Formula: <br/><strong>Safe Quote Price = [((Setup Time + Programming Time) * Labor Rate) + (Net Machine Time * Machine Hourly Rate) + Material Cost + Tool Wear] / (1 - Target Profit Margin - Scrap Rate)</strong>.",
    whyItMatters: "Ignoring hidden setup times and downtime during the quoting stage directly erodes gross profit margins. This analysis reveals the <strong>true cost base</strong> for each work order, preventing the workshop from bidding at a loss and improving operational efficiency.",
    problem: "A CNC machining workshop only accounted for net cutting (spindle) time and material cost when quoting, excluding setup and CAM programming times as well as downtime risks. This caused jobs that appeared profitable on paper to result in net margin loss in practice.",
    inputSummary: [
      "Machine hourly rate: $92/hr, planned net machine time: 14 hrs, downtime allowance: 2.1 hrs",
      "Material cost: $680, tool wear allowance: $95, scrap rate: 4%",
      "Target profit margin: 20%"
    ],
    calculationResult: "Yapılan analizde, fiili yükler dahil toplam birim maliyetin <strong>2.180 $</strong> olduğu, oysa atölyenin hazırlık paylarını hariç tutarak müşteriye 1.920 $ teklif verdiği saptanmıştır. Bu durum, işletmenin hedef kar marjından <strong>12 puanlık</strong> net bir sapma yaşadığını göstermiştir.",
    calculationLogic: "Doğrudan makine ve malzeme maliyetlerine; kurulum, ayar, CAD/CAM programlama ve geçmiş duruş katsayıları deterministik olarak eklenmiştir. Hedef kar marjını koruyacak minimum güvenli teklif barajı hesaplanmıştır.",
    academicMethodology: "The analysis was performed using a <em>deterministic cost loading model</em>. Setup and downtime coefficients derived from workshop data were simulated on a linear cost equation to formulate the margin deviation.",
    lossType: "schedule_delay" as CaseStudyLossType,
    lossTypeLabel: "Setup, Programming and Downtime Leakage",
    suggestedAction: "If the quoted price falls below the calculated safe price floor, request an <strong>additional quote revision</strong> for setup or programming items before the work order is approved.",
    toolSlug: "cnc-quote-risk-analyzer",
    toolTitle: "CNC Quote Risk Analyzer",
    toolRoute: "premium-tools" as CaseStudyToolRoute,
  },
  construction: {
    slug: "construction-bid-margin-field-analysis",
    sector: "construction" as CaseStudySector,
    sectorLabel: "Construction / Bid Management",
    title: "Site Mobilization and Critical Path Delay Impact on Net Quote Margin",
    seoTitle: "Construction Quote Margin and Critical Path Delay Analysis",
    seoDescription: "Impact of site mobilization, test/inspection cycles, and critical path delays on net profit margin in construction projects.",
    whatIsIt: "An engineering-based risk analysis measuring the erosion of the main bid margin due to <strong>site mobilization</strong>, test/inspection cycles, and critical path delays in construction projects.",
    howIsItCalculated: "Based on the contract value; team size, daily site burn rate, potential critical path delay days, and rework/inspection costs are aggregated to calculate the net margin impact. <br/>Formula: <strong>Actual Net Margin = (Contract Value - Direct Costs - (Delay Days * Daily Site Cost) - Rework Reserve) / Contract Value</strong>.",
    whyItMatters: "Contractors often overlook operational delay risks when bidding. This analysis mathematically demonstrates how critical path delays erode profit through daily site costs, ensuring proper delay reserves are allocated.",
    problem: "A subcontractor prepared a bid for a rough construction tender based on materials and labor, but faced margin compression due to not budgeting for site setup, interim inspection delays, and a potential 12-day slip on the critical path.",
    inputSummary: [
      "Main contract value: $620,000, quoted target profit margin: 18%",
      "Site team: 8 people, daily operational burn rate: $2,850/day, critical path delay risk: 12 days",
      "Rework and re-inspection budget allocation: $18,000"
    ],
    calculationResult: "While the main bid projected a 17.5% profit margin on paper, the actual net margin was calculated to have fallen to the <strong>11% to 13% range</strong> when delay days and rework costs were added.",
    calculationLogic: "After subtracting direct costs from the total contract value, the delay burden (daily operational site cost multiplied by delay days) and inspection reserves were deducted to determine the net margin.",
    academicMethodology: "A deterministic site cost model integrated with project planning and Critical Path Method (CPM) inputs was used. Delay durations were multiplied by overhead coefficients to perform deviation analysis.",
    lossType: "schedule_delay" as CaseStudyLossType,
    lossTypeLabel: "Delay and Mobilization Margin Loss",
    suggestedAction: "Before submitting the bid, add a budget reserve equal to the calculated operational delay and re-mobilization risk, or include delay penalty exemption clauses in the contract.",
    toolSlug: "change-order-impact-analyzer",
    toolTitle: "İş Değişikliği (Change Order) Etki Analizörü",
    toolRoute: "premium-tools" as CaseStudyToolRoute,
  },
};

interface RichTextAreaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

// Rich Text Editor Component
function RichTextArea({ value, onChange, placeholder }: RichTextAreaProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Update contentEditable div when value changes externally (only if not actively editing)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const html = e.clipboardData.getData("text/html");

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      // Clean function: preserve only allowed HTML tags, remove style residues
      const cleanNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue || "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          const childrenHtml = Array.from(el.childNodes).map(cleanNode).join("");

          if (["strong", "b"].includes(tagName)) {
            return `<strong>${childrenHtml}</strong>`;
          }
          if (["em", "i"].includes(tagName)) {
            return `<em>${childrenHtml}</em>`;
          }
          if (tagName === "p") {
            return `<p>${childrenHtml}</p>`;
          }
          if (tagName === "br") {
            return `<br/>`;
          }
          if (tagName === "ul") {
            return `<ul>${childrenHtml}</ul>`;
          }
          if (tagName === "ol") {
            return `<ol>${childrenHtml}</ol>`;
          }
          if (tagName === "li") {
            return `<li>${childrenHtml}</li>`;
          }
          return childrenHtml;
        }
        return "";
      };

      const cleanedHtml = Array.from(doc.body.childNodes).map(cleanNode).join("");
      document.execCommand("insertHTML", false, cleanedHtml);
    } else {
      document.execCommand("insertText", false, text);
    }
  };

  const handleCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-slate/25 rounded overflow-hidden bg-white focus-within:border-copper">
      {/* Toolbar */}
      <div className="flex items-center gap-1 bg-off-white border-b border-slate/15 p-1.5 text-xs select-none">
        <button
          type="button"
          onClick={() => handleCommand("bold")}
          className="rounded p-1 font-bold hover:bg-slate/10 min-w-[24px] text-center"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleCommand("italic")}
          className="rounded p-1 italic hover:bg-slate/10 min-w-[24px] text-center"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleCommand("insertUnorderedList")}
          className="rounded p-1 hover:bg-slate/10 min-w-[24px] text-center"
          title="Unordered List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => handleCommand("insertOrderedList")}
          className="rounded p-1 hover:bg-slate/10 min-w-[24px] text-center"
          title="Ordered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear formatting?")) {
              handleCommand("removeFormat");
            }
          }}
          className="rounded p-1 hover:bg-slate/10 text-muted ml-auto text-xs"
          title="Clear Formatting"
        >
          Clear Formatting
        </button>
      </div>

      {/* contentEditable Div */}
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="p-3 text-sm focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto bg-white text-deep-navy prose prose-sm max-w-none"
      />
    </div>
  );
}

export function CaseStudiesEditorClient() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "code">("edit");
  const [previewSubTab, setPreviewSubTab] = useState<"card" | "qa">("card");
  const [copiedType, setCopiedType] = useState<"ts" | "json" | null>(null);

  // Auto-update label when sector changes
  const handleSectorChange = (sector: CaseStudySector) => {
    const matched = SECTOR_OPTIONS.find((s) => s.value === sector);
    setForm((prev) => ({
      ...prev,
      sector,
      sectorLabel: matched ? matched.label : prev.sectorLabel,
    }));
  };

  // Auto-update label when loss type changes
  const handleLossTypeChange = (lossType: CaseStudyLossType) => {
    const matched = LOSS_TYPE_OPTIONS.find((l) => l.value === lossType);
    setForm((prev) => ({
      ...prev,
      lossType,
      lossTypeLabel: matched ? matched.label : prev.lossTypeLabel,
    }));
  };

  // Auto-slugify from title
  const handleSlugify = () => {
    if (!form.title) return;
    const clean = form.title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    const slugSuffix = clean.endsWith("-field-analysis") ? "" : "-field-analysis";
    setForm((prev) => ({
      ...prev,
      slug: `${clean}${slugSuffix}`,
    }));
  };

  // Dynamic inputSummary operations
  const handleInputSummaryChange = (index: number, value: string) => {
    const updated = [...form.inputSummary];
    updated[index] = value;
    setForm((prev) => ({ ...prev, inputSummary: updated }));
  };

  const addInputSummaryLine = () => {
    setForm((prev) => ({ ...prev, inputSummary: [...prev.inputSummary, ""] }));
  };

  const removeInputSummaryLine = (index: number) => {
    if (form.inputSummary.length <= 1) {
      setForm((prev) => ({ ...prev, inputSummary: [""] }));
      return;
    }
    const updated = form.inputSummary.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, inputSummary: updated }));
  };

  // Load example template
  const loadExample = (type: "cnc" | "construction") => {
    setForm(EXAMPLES[type]);
    setActiveTab("edit");
  };

  // Temizleme
  const resetForm = () => {
    if (confirm("Clear all form inputs? This cannot be undone.")) {
      setForm(INITIAL_FORM_STATE);
    }
  };

  // TypeScript Object Output Generator
  const generateTypeScriptCode = (): string => {
    const inputsStr = form.inputSummary
      .filter((line) => line.trim() !== "")
      .map((line) => `      "${line.replace(/"/g, '\\"')}"`)
      .join(",\n");

    return `{
    slug: "${form.slug || "cnc-job-shop-field-analysis"}",
    sector: "${form.sector}",
    sectorLabel: "${form.sectorLabel}",
    title: "${form.title.replace(/"/g, '\\"') || "Title"}",
    seoTitle: "${form.seoTitle.replace(/"/g, '\\"') || "SEO Title"}",
    seoDescription: "${form.seoDescription.replace(/"/g, '\\"') || "SEO Description"}",
    whatIsIt: "${form.whatIsIt.replace(/"/g, '\\"')}",
    howIsItCalculated: "${form.howIsItCalculated.replace(/"/g, '\\"')}",
    whyItMatters: "${form.whyItMatters.replace(/"/g, '\\"')}",
    problem: "${form.problem.replace(/"/g, '\\"')}",
    inputSummary: [
${inputsStr}
    ],
    calculationResult: "${form.calculationResult.replace(/"/g, '\\"')}",
    calculationLogic: "${form.calculationLogic.replace(/"/g, '\\"')}",
    academicMethodology: "${form.academicMethodology.replace(/"/g, '\\"')}",
    lossType: "${form.lossType}",
    lossTypeLabel: "${form.lossTypeLabel}",
    suggestedAction: "${form.suggestedAction.replace(/"/g, '\\"')}",
    toolSlug: "${form.toolSlug}",
    toolTitle: "${form.toolTitle}",
    toolRoute: "${form.toolRoute}"
  }`;
  };

  // JSON Output Generator
  const generateJsonCode = (): string => {
    const obj = {
      slug: form.slug,
      sector: form.sector,
      sectorLabel: form.sectorLabel,
      title: form.title,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      whatIsIt: form.whatIsIt,
      howIsItCalculated: form.howIsItCalculated,
      whyItMatters: form.whyItMatters,
      problem: form.problem,
      inputSummary: form.inputSummary.filter((line) => line.trim() !== ""),
      calculationResult: form.calculationResult,
      calculationLogic: form.calculationLogic,
      academicMethodology: form.academicMethodology,
      lossType: form.lossType,
      lossTypeLabel: form.lossTypeLabel,
      suggestedAction: form.suggestedAction,
      toolSlug: form.toolSlug,
      toolTitle: form.toolTitle,
      toolRoute: form.toolRoute,
    };
    return JSON.stringify(obj, null, 2);
  };

  const copyToClipboard = (type: "ts" | "json") => {
    const text = type === "ts" ? generateTypeScriptCode() : generateJsonCode();
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-slate/15 bg-white p-8">
        <p className="text-sm font-medium text-muted font-mono">Verifying session info...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <AdminAuthBar />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Auth Bar */}
      <AdminAuthBar />

      {/* Editor Main Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sol Panel: Kontroller ve Form */}
        <div className="space-y-6 lg:col-span-7">
          {/* Quick Templates & Tabs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate/15 bg-white p-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "edit"
                    ? "bg-copper text-white"
                    : "bg-off-white text-deep-navy border border-slate/15 hover:bg-slate/10"
                }`}
              >
                1. Content Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "preview"
                    ? "bg-copper text-white"
                    : "bg-off-white text-deep-navy border border-slate/15 hover:bg-slate/10"
                }`}
              >
                2. Live Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "code"
                    ? "bg-copper text-white"
                    : "bg-off-white text-deep-navy border border-slate/15 hover:bg-slate/10"
                }`}
              >
                3. Code Output
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted uppercase">Load Template:</span>
              <button
                type="button"
                onClick={() => loadExample("cnc")}
                className="rounded border border-slate/15 bg-white px-2 py-1 text-[11px] font-medium text-copper hover:bg-off-white"
              >
                CNC
              </button>
              <button
                type="button"
                onClick={() => loadExample("construction")}
                className="rounded border border-slate/15 bg-white px-2 py-1 text-[11px] font-medium text-copper hover:bg-off-white"
              >
                Construction
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-amber/35 bg-white px-2 py-1 text-[11px] font-medium text-amber hover:bg-amber/5"
              >
                Temizle
              </button>
            </div>
          </div>

          {/* Form Fields (Edit Tab) */}
          {activeTab === "edit" && (
            <div className="rounded-lg border border-slate/15 bg-white p-5 sm:p-6 space-y-6">
              <div className="border-b border-slate/15 pb-4">
                <h3 className="text-base font-bold text-deep-navy">Basic Definitions</h3>
                <p className="text-xs text-muted">Sector mappings and identity info for the case study.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Case Study Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g. CNC Machining Setup..."
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider">
                      Document Slug ID
                    </label>
                    <button
                      type="button"
                      onClick={handleSlugify}
                      disabled={!form.title}
                      className="text-[10px] font-semibold text-copper hover:underline disabled:opacity-55"
                    >
                      Generate from Title
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="E.g.: cnc-job-shop-field-analysis"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm font-mono focus:border-copper focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Sector (Sector Key)
                  </label>
                  <select
                    value={form.sector}
                    onChange={(e) => handleSectorChange(e.target.value as CaseStudySector)}
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  >
                    {SECTOR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Sector Label (Displayed)
                  </label>
                  <input
                    type="text"
                    value={form.sectorLabel}
                    onChange={(e) => setForm((prev) => ({ ...prev, sectorLabel: e.target.value }))}
                    placeholder="Örn: CNC / Machining"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Loss Type (Loss Type)
                  </label>
                  <select
                    value={form.lossType}
                    onChange={(e) => handleLossTypeChange(e.target.value as CaseStudyLossType)}
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  >
                    {LOSS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Loss Type Label (Displayed)
                  </label>
                  <input
                    type="text"
                    value={form.lossTypeLabel}
                    onChange={(e) => setForm((prev) => ({ ...prev, lossTypeLabel: e.target.value }))}
                    placeholder="E.g. Setup and Downtime Leakage"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-b border-slate/15 pb-2 pt-4">
                <h3 className="text-base font-bold text-deep-navy">SEO Meta Verileri</h3>
                <p className="text-xs text-muted">Meta tag inputs that improve search engine visibility.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    SEO Title (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="E.g. CNC Machining Cost Analysis"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    SEO Description (Meta Description)
                  </label>
                  <textarea
                    rows={2}
                    value={form.seoDescription}
                    onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="A 140-160 character description summarizing the case study to improve search engine click-through rate."
                    className="w-full rounded border border-slate/25 p-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-b border-slate/15 pb-2 pt-4">
                <h3 className="text-base font-bold text-deep-navy">Featured Snippet Q&A Block</h3>
                <p className="text-xs text-muted">Q&A fields targeting Google &quot;Position Zero&quot; (Featured Snippet) rankings. Select text you want to bold and press <strong>B</strong>, or copy directly from Word-like editors.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    1. Nedir? (whatIsIt)
                  </label>
                  <RichTextArea
                    value={form.whatIsIt}
                    onChange={(val) => setForm((prev) => ({ ...prev, whatIsIt: val }))}
                    placeholder="CNC machining spindle time, programming, setup..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    2. How Is It Calculated? (howIsItCalculated)
                  </label>
                  <RichTextArea
                    value={form.howIsItCalculated}
                    onChange={(val) => setForm((prev) => ({ ...prev, howIsItCalculated: val }))}
                    placeholder="Based on machine hourly rate; setup time, CAD/CAM programming time..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    3. Why It Matters / Benefits (whyItMatters)
                  </label>
                  <RichTextArea
                    value={form.whyItMatters}
                    onChange={(val) => setForm((prev) => ({ ...prev, whyItMatters: val }))}
                    placeholder="Hidden setup times and downtime ignored during quoting..."
                  />
                </div>
              </div>

              <div className="border-b border-slate/15 pb-2 pt-4">
                <h3 className="text-base font-bold text-deep-navy">Field Scenario & Calculation Logic</h3>
                <p className="text-xs text-muted">Real-world background and mathematical modeling details of the case.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Problem Definition (problem)
                  </label>
                  <RichTextArea
                    value={form.problem}
                    onChange={(val) => setForm((prev) => ({ ...prev, problem: val }))}
                    placeholder="A CNC workshop, when quoting, only included net spindle time and material cost..."
                  />
                </div>

                {/* Dynamic inputSummary Area */}
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Field Inputs Summary (inputSummary)
                  </label>
                  <div className="space-y-2">
                    {form.inputSummary.map((line, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => handleInputSummaryChange(idx, e.target.value)}
                          placeholder={`Input line ${idx + 1}`}
                          className="flex-1 min-h-[36px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeInputSummaryLine(idx)}
                          className="text-xs font-bold text-amber hover:text-red px-2 py-1"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInputSummaryLine}
                      className="text-xs font-semibold text-copper hover:underline mt-1"
                    >
                      + Yeni Saha Girdisi Ekle
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Hesaplama Sonucu (calculationResult)
                  </label>
                  <RichTextArea
                    value={form.calculationResult}
                    onChange={(val) => setForm((prev) => ({ ...prev, calculationResult: val }))}
                    placeholder="The analysis found total unit cost including actual overhead is $2,180..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Hesaplama Formülü & Mantığı (calculationLogic)
                  </label>
                  <RichTextArea
                    value={form.calculationLogic}
                    onChange={(val) => setForm((prev) => ({ ...prev, calculationLogic: val }))}
                    placeholder="Direct machine and material costs; setup, adjustment, CAD/CAM programming..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Akademik / Mühendislik Metodolojisi (academicMethodology)
                  </label>
                  <RichTextArea
                    value={form.academicMethodology}
                    onChange={(val) => setForm((prev) => ({ ...prev, academicMethodology: val }))}
                    placeholder="The analysis was performed using a deterministic cost loading model..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Suggested Action (suggestedAction)
                  </label>
                  <RichTextArea
                    value={form.suggestedAction}
                    onChange={(val) => setForm((prev) => ({ ...prev, suggestedAction: val }))}
                    placeholder="If the quote is below the calculated safe price floor, request a revision..."
                  />
                </div>
              </div>

              <div className="border-b border-slate/15 pb-2 pt-4">
                <h3 className="text-base font-bold text-deep-navy">Related Calculation Tool</h3>
                <p className="text-xs text-muted">The SectorCalc calculator this case study links to.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Tool Title (toolTitle)
                  </label>
                  <input
                    type="text"
                    value={form.toolTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, toolTitle: e.target.value }))}
                    placeholder="E.g. CNC Quote Risk Analyzer"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Tool Route Slug (toolSlug)
                  </label>
                  <input
                    type="text"
                    value={form.toolSlug}
                    onChange={(e) => setForm((prev) => ({ ...prev, toolSlug: e.target.value }))}
                    placeholder="E.g. cnc-quote-risk-analyzer"
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm font-mono focus:border-copper focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-navy uppercase tracking-wider mb-1">
                    Route Group (toolRoute)
                  </label>
                  <select
                    value={form.toolRoute}
                    onChange={(e) => setForm((prev) => ({ ...prev, toolRoute: e.target.value as CaseStudyToolRoute }))}
                    className="w-full min-h-[40px] rounded border border-slate/25 px-3 text-sm focus:border-copper focus:outline-none"
                  >
                    {TOOL_ROUTE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Live Preview (Preview Tab) */}
          {activeTab === "preview" && (
            <div className="space-y-6">
              {/* Preview Subtabs */}
              <div className="flex gap-2 border-b border-slate/15 pb-2">
                <button
                  type="button"
                  onClick={() => setPreviewSubTab("card")}
                  className={`border-b-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    previewSubTab === "card"
                      ? "border-copper text-copper"
                      : "border-transparent text-muted hover:text-deep-navy"
                  }`}
                >
                  Card View (Directory View)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSubTab("qa")}
                  className={`border-b-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    previewSubTab === "qa"
                      ? "border-copper text-copper"
                      : "border-transparent text-muted hover:text-deep-navy"
                  }`}
                >
                  Q&A Report View
                </button>
              </div>

              {previewSubTab === "card" ? (
                <div className="rounded-lg border border-slate/15 bg-off-white p-6 flex justify-center">
                  {/* CaseStudyCard.tsx simülasyonu */}
                  <div className="w-full max-w-md border border-slate/20 bg-white p-5 rounded shadow-sm transition-all hover:border-copper/40">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-copper">
                        {form.sectorLabel || "SEKTÖR ETİKETİ"}
                      </p>
                      <span className="inline-block rounded bg-copper/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-copper font-mono">
                        {form.lossTypeLabel || "Loss Type"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-base font-semibold text-deep-navy sm:text-lg">
                      {form.title || "Case Study Title"}
                    </h2>
                    <p 
                      className="mt-2 line-clamp-3 text-sm text-slate"
                      dangerouslySetInnerHTML={{ __html: form.problem || "The field problem the company experienced will be listed here..." }}
                    />
                    <div className="mt-4 flex items-center justify-between border-t border-slate/15 pt-3">
                      <span className="text-[10px] text-muted font-mono">
                        ID: {form.slug.replace(/-field-analysis$/, "") || "slug-id"}
                      </span>
                      <span className="text-xs font-medium text-copper">Detaylar →</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="case-studies-container rounded-lg border border-slate/15 overflow-hidden">
                  {/* CaseStudiesClientContent.tsx içindeki .study CSS simülasyonu */}
                  <div className="study" style={{ background: "#FAF9F5", border: "1px solid #DBD8CC", color: "#1A1915" }}>
                    <div className="study-head" style={{ padding: "20px 22px 0", display: "flex", justifyContent: "between", gap: "16px" }}>
                      <div>
                        <span style={{ fontSize: "10px", fontFamily: "monospace", textTransform: "uppercase", color: "#BD5D3A", letterSpacing: "1px" }}>
                          {form.sectorLabel || "CNC / Machining"}
                        </span>
                        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "normal", marginTop: "4px" }}>
                          {form.title || "Title field"}
                        </h3>
                      </div>
                      <div className="docid" style={{ fontFamily: "monospace", fontSize: "10px", color: "#7A776B", border: "1px solid #DBD8CC", padding: "5px 8px", alignSelf: "start" }}>
                        ID: {form.slug.replace(/-field-analysis$/, "") || "doc-id"}
                      </div>
                    </div>

                    <div className="study-body" style={{ padding: "16px 22px 22px" }}>
                      {/* Q&A 1 */}
                      <div className="def" style={{ margin: "14px 0" }}>
                        <div className="q" style={{ fontFamily: "monospace", fontSize: "11px", color: "#BD5D3A", textTransform: "uppercase", fontWeight: "bold" }}>
                          Tanm — Nedir?
                        </div>
                        <p 
                          style={{ fontSize: "14px", color: "#3A382F", marginTop: "4px" }}
                          dangerouslySetInnerHTML={{ __html: form.whatIsIt || "Açıklama girilmedi." }}
                        />
                      </div>

                      {/* Q&A 2 */}
                      <div className="def" style={{ margin: "14px 0" }}>
                        <div className="q" style={{ fontFamily: "monospace", fontSize: "11px", color: "#BD5D3A", textTransform: "uppercase", fontWeight: "bold" }}>
                          Calculation Formula
                        </div>
                        <p 
                          style={{ fontSize: "14px", color: "#3A382F", marginTop: "4px" }}
                          dangerouslySetInnerHTML={{ __html: form.howIsItCalculated || "No description entered." }}
                        />
                      </div>

                      {/* Q&A 3 */}
                      <div className="def" style={{ margin: "14px 0" }}>
                        <div className="q" style={{ fontFamily: "monospace", fontSize: "11px", color: "#BD5D3A", textTransform: "uppercase", fontWeight: "bold" }}>
                          Why It Matters / Benefits
                        </div>
                        <p 
                          style={{ fontSize: "14px", color: "#3A382F", marginTop: "4px" }}
                          dangerouslySetInnerHTML={{ __html: form.whyItMatters || "No description entered." }}
                        />
                      </div>

                      {/* Problem box */}
                      <div className="def" style={{ margin: "14px 0", borderTop: "1px solid #E8E5DA", paddingTop: "14px" }}>
                        <div className="q" style={{ fontFamily: "monospace", fontSize: "11px", color: "#7A776B", textTransform: "uppercase" }}>
                          Saha Senaryosu / Problem
                        </div>
                        <p 
                          style={{ fontSize: "14px", color: "#3A382F", marginTop: "4px" }}
                          dangerouslySetInnerHTML={{ __html: form.problem || "Açıklama..." }}
                        />
                      </div>

                      {/* Finding Box */}
                      <div className="finding-box" style={{ display: "flex", gap: "16px", background: "#1A1915", color: "#F0EEE6", padding: "15px 18px", margin: "16px 0" }}>
                        <div className="fl" style={{ fontFamily: "monospace", fontSize: "10px", color: "#9a978c", textTransform: "uppercase" }}>BULGU & ETKİ:</div>
                        <div 
                          className="fv" 
                          style={{ fontFamily: "monospace", fontSize: "14px", color: "#BD5D3A", fontWeight: "bold" }}
                          dangerouslySetInnerHTML={{ __html: form.calculationResult || "Analiz sonucu..." }}
                        />
                      </div>

                      {/* Formula */}
                      <div className="formula" style={{ margin: "14px 0" }}>
                        <div className="q" style={{ fontFamily: "monospace", fontSize: "11px", color: "#7A776B", textTransform: "uppercase" }}>Formülasyon Yükü</div>
                        <code 
                          style={{ display: "block", fontFamily: "monospace", fontSize: "12px", background: "#F0EEE6", border: "1px solid #DBD8CC", padding: "12px", whiteSpace: "pre-wrap", marginTop: "4px", color: "#3A382F" }}
                          dangerouslySetInnerHTML={{ __html: form.calculationLogic || "Hesaplama mantığı..." }}
                        />
                      </div>

                      {/* Action Links */}
                      <div className="study-links" style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                        <span className="primary" style={{ background: "#BD5D3A", color: "#fff", padding: "10px 14px", fontSize: "13px", fontWeight: "bold" }}>
                          {form.toolTitle || "Hesaplama Aracı"}
                        </span>
                        <span className="ghost" style={{ border: "1px solid #1A1915", color: "#1A1915", padding: "10px 14px", fontSize: "13px", fontWeight: "bold" }}>
                          Detaylı Raporu İncele →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kod Çıktısı (Code Tab) */}
          {activeTab === "code" && (
            <div className="space-y-6">
              {/* TypeScript Kodu */}
              <div className="rounded-lg border border-slate/15 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                    TypeScript Array Objesi (`src/lib/case-studies/data/tr.ts` için)
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("ts")}
                    className="rounded bg-copper px-3 py-1.5 text-xs font-semibold text-white hover:bg-copper-deep transition-colors"
                  >
                    {copiedType === "ts" ? "Kopyalandı!" : "Kodu Kopyala"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded border border-slate/20 bg-off-white p-4 text-xs font-mono text-deep-navy max-h-[300px]">
                  <code>{generateTypeScriptCode()}</code>
                </pre>
              </div>

              {/* JSON Kodu */}
              <div className="rounded-lg border border-slate/15 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-deep-navy uppercase tracking-wider">
                    JSON Formatlı Çıktı
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("json")}
                    className="rounded bg-copper px-3 py-1.5 text-xs font-semibold text-white hover:bg-copper-deep transition-colors"
                  >
                    {copiedType === "json" ? "Kopyalandı!" : "JSON Kopyala"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded border border-slate/20 bg-off-white p-4 text-xs font-mono text-deep-navy max-h-[300px]">
                  <code>{generateJsonCode()}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sağ Panel: Yardımcı Kılavuz & Hızlı Önizleme */}
        <div className="space-y-6 lg:col-span-5">
          {/* Quick Guide Card */}
          <div className="rounded-lg border border-slate/15 bg-white p-5 space-y-4">
            <h3 className="text-sm font-bold text-deep-navy uppercase tracking-wider border-b border-slate/15 pb-2">
              Featured Snippet Kılavuzu
            </h3>
            
            <ul className="space-y-3 text-xs text-slate list-disc list-inside">
              <li>
                <strong className="text-deep-navy">&quot;Nedir&quot; Alanı:</strong> Doğrudan terimin ne olduğunu açıklayan bir cümleyle başlayın. Örn: <span className="italic">&ldquo;... ölçen analitik bir çalışmadır.&rdquo;</span>
              </li>
              <li>
                <strong className="text-deep-navy">&quot;Nasıl Hesaplanır&quot; Alanı:</strong> Hesaba giren ana parametreleri listeleyin ve formülü açıkça belirtin. Örn: <span className="italic">&ldquo;Formül: Güvenli Teklif Fiyatı = ...&rdquo;</span>
              </li>
              <li>
                <strong className="text-deep-navy">Dinamik Girdiler (inputSummary):</strong> Önizlemede görünecek örnek girdiler. Maksimum 3-4 adet kısa ve rakam içeren girdi yeterlidir.
              </li>
              <li>
                <strong className="text-deep-navy">Çıktıyı Kullanma:</strong> Hazırladığınız vaka çalışmasını kopyaladıktan sonra <code className="font-mono bg-off-white px-1 py-0.5 rounded text-copper">src/lib/case-studies/data/tr.ts</code> dosyası içindeki array&apos;e ekleyip commit edebilirsiniz.
              </li>
            </ul>
          </div>

          {/* Mini Live Preview (Her zaman görünür olan hızlı kart) */}
          <div className="rounded-lg border border-slate/15 bg-white p-5 space-y-3">
            <h3 className="text-sm font-bold text-deep-navy uppercase tracking-wider border-b border-slate/15 pb-2">
              Anlık Kart Görünümü
            </h3>
            
            <div className="border border-slate/20 bg-white p-4 rounded shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-copper">
                  {form.sectorLabel || "SEKTÖR"}
                </p>
                <span className="inline-block rounded bg-copper/10 px-2 py-0.5 text-[9px] font-medium tracking-wide text-copper font-mono">
                  {form.lossTypeLabel || "Kayıp Türü"}
                </span>
              </div>
              <h2 className="mt-2 text-sm font-semibold text-deep-navy">
                {form.title || "Vaka Çalışması Başlığı"}
              </h2>
              <p 
                className="mt-1 line-clamp-2 text-xs text-slate"
                dangerouslySetInnerHTML={{ __html: form.problem || "Senaryo problemi..." }}
              />
              <div className="mt-3 flex items-center justify-between border-t border-slate/15 pt-2">
                <span className="text-[9px] text-muted font-mono">
                  ID: {form.slug.replace(/-field-analysis$/, "") || "id"}
                </span>
                <span className="text-xs font-semibold text-copper">Detaylar →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
