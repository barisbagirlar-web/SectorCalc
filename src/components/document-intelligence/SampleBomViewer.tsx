/**
 * Interactive Sample BOM Viewer — Section 101 compliance
 *
 * Client component with tabs for live sample output experience.
 * All data is synthetic and clearly labeled.
 */
"use client";

import { useState } from "react";
import { trackDiEvent } from "@/lib/document-intelligence/observability/analytics-events";

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const BORDER = "rgba(26,25,21,0.10)";
const CLEAN = "#2D8132";
const WARN = "#C45A1A";

interface SampleRow {
  item: number;
  partNumber: string;
  description: string;
  qty: string;
  unit: string;
  sourcePage: number;
  status: "clean" | "review" | "issue";
  flag?: string;
}

const CLEAN_ROWS: SampleRow[] = [
  { item: 1, partNumber: "B-101", description: "Bearing, Ball, SKF 6205", qty: "4", unit: "EA", sourcePage: 34, status: "clean" },
  { item: 2, partNumber: "S-202", description: "Seal, Oil, Viton", qty: "2", unit: "EA", sourcePage: 34, status: "clean" },
  { item: 3, partNumber: "G-303", description: "Gasket Set, Cylinder Head", qty: "1", unit: "SET", sourcePage: 35, status: "clean" },
  { item: 4, partNumber: "F-401", description: "Filter, Hydraulic Return", qty: "2", unit: "EA", sourcePage: 35, status: "clean" },
  { item: 5, partNumber: "V-101", description: "Valve, Solenoid 24V", qty: "1", unit: "EA", sourcePage: 36, status: "clean" },
  { item: 6, partNumber: "P-201", description: "Pump, Gear, 15cc", qty: "1", unit: "EA", sourcePage: 36, status: "clean" },
  { item: 7, partNumber: "C-501", description: "Coupling, Flexible, 25mm", qty: "2", unit: "EA", sourcePage: 37, status: "clean" },
  { item: 8, partNumber: "R-601", description: "Relay, Thermal Overload", qty: "3", unit: "EA", sourcePage: 37, status: "clean" },
];

const REVIEW_ROWS: SampleRow[] = [
  { item: 9, partNumber: "B-101", description: "Bearing, Roller, 6308", qty: "2", unit: "EA", sourcePage: 38, status: "review", flag: "Duplicate / Conflicting description" },
  { item: 10, partNumber: "P-404", description: "Pump, Piston", qty: "", unit: "", sourcePage: 38, status: "review", flag: "Missing quantity" },
  { item: 11, partNumber: "V-101", description: "Valve, Solenoid 24V", qty: "1", unit: "EA", sourcePage: 39, status: "review", flag: "Revision conflict (Rev A / Rev B)" },
  { item: 12, partNumber: "M-001", description: "Motor, 5HP, 1800RPM", qty: "", unit: "EA", sourcePage: 39, status: "review", flag: "Missing part number (raw OCR uncertain)" },
];

const DUPLICATE_ROWS: SampleRow[] = [
  { item: 9, partNumber: "B-101", description: "Bearing, Roller, 6308", qty: "2", unit: "EA", sourcePage: 38, status: "issue", flag: "Exact normalized duplicate" },
  { item: 1, partNumber: "B-101", description: "Bearing, Ball, SKF 6205", qty: "4", unit: "EA", sourcePage: 34, status: "issue", flag: "Conflicting description" },
];

const REVISION_ROWS: SampleRow[] = [
  { item: 11, partNumber: "V-101", description: "Valve, Solenoid 24V", qty: "1", unit: "EA", sourcePage: 39, status: "issue", flag: "Observed: Rev A (p.34), Rev B (p.39)" },
];

const PROCUREMENT_ROWS: SampleRow[] = [
  { item: 1, partNumber: "B-101", description: "Bearing, Ball, SKF 6205", qty: "4", unit: "EA", sourcePage: 34, status: "clean" },
  { item: 2, partNumber: "S-202", description: "Seal, Oil, Viton", qty: "2", unit: "EA", sourcePage: 34, status: "clean" },
  { item: 5, partNumber: "V-101", description: "Valve, Solenoid 24V", qty: "1", unit: "EA", sourcePage: 36, status: "clean" },
];

type TabId = "clean" | "review" | "duplicates" | "revisions" | "procurement" | "erp" | "source";

interface TabDef {
  id: TabId;
  label: string;
}

const TABS: TabDef[] = [
  { id: "clean", label: "Clean BOM" },
  { id: "review", label: "Review Required" },
  { id: "duplicates", label: "Duplicate Parts" },
  { id: "revisions", label: "Revision Conflicts" },
  { id: "procurement", label: "Procurement Ready" },
  { id: "erp", label: "ERP Template" },
  { id: "source", label: "Source Map" },
];

function Table({
  rows,
  showFlag,
}: {
  rows: SampleRow[];
  showFlag?: boolean;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.8rem",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: TEXT, color: "#FFFFFF" }}>
            <th style={{ padding: "0.5rem 0.75rem" }}>Item</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Part Number</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Description</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Qty</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Unit</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Source Page</th>
            {showFlag && <th style={{ padding: "0.5rem 0.75rem" }}>Flag</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.item}-${row.partNumber}`}
              style={{
                borderBottom: `1px solid ${BORDER}`,
                backgroundColor:
                  row.status === "clean"
                    ? CLEAN_ROWS.includes(row)
                      ? "#F5FFF5"
                      : CARD_BG
                    : row.status === "review"
                      ? "#FFF8F0"
                      : "#FFF5F5",
              }}
            >
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.item}</td>
              <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>
                {row.partNumber}
              </td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.description}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.qty || "—"}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.unit || "—"}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.sourcePage}</td>
              {showFlag && (
                <td style={{ padding: "0.5rem 0.75rem", color: WARN, fontSize: "0.75rem" }}>
                  {row.flag || ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceMapTable() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.8rem",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: TEXT, color: "#FFFFFF" }}>
            <th style={{ padding: "0.5rem 0.75rem" }}>Row Ref</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Part Number</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Source Document</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Page</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Table</th>
            <th style={{ padding: "0.5rem 0.75rem" }}>Evidence ID</th>
          </tr>
        </thead>
        <tbody>
          {[
            { ref: "R001", pn: "B-101", doc: "XLT-5000_Manual.pdf", page: 34, tbl: "T7.1", ev: "ev-34-001" },
            { ref: "R002", pn: "S-202", doc: "XLT-5000_Manual.pdf", page: 34, tbl: "T7.1", ev: "ev-34-002" },
            { ref: "R003", pn: "G-303", doc: "XLT-5000_Manual.pdf", page: 35, tbl: "T7.2", ev: "ev-35-001" },
            { ref: "R009", pn: "B-101", doc: "XLT-5000_Manual.pdf", page: 38, tbl: "T7.4", ev: "ev-38-001" },
            { ref: "R010", pn: "P-404", doc: "XLT-5000_Manual.pdf", page: 38, tbl: "T7.4", ev: "ev-38-002" },
          ].map((row) => (
            <tr key={row.ref} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>{row.ref}</td>
              <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>{row.pn}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.doc}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.page}</td>
              <td style={{ padding: "0.5rem 0.75rem" }}>{row.tbl}</td>
              <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", fontSize: "0.7rem" }}>
                {row.ev}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErpTemplate() {
  return (
    <div style={{ padding: "1rem", color: MUTED, fontSize: "0.9rem", lineHeight: 1.6 }}>
      <p style={{ marginBottom: "0.75rem" }}>
        <strong style={{ color: TEXT }}>Generic ERP Import Template</strong> — flat schema for controlled import trials.
      </p>
      <p style={{ marginBottom: "0.75rem" }}>
        Columns: Part Number | Description | Quantity | Unit | Manufacturer | Manufacturer Part Number | Revision | Equipment | Subassembly | Material
      </p>
      <Table rows={CLEAN_ROWS.slice(0, 4)} />
      <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", fontStyle: "italic" }}>
        Prepared against the selected import profile. Final import validation remains the customer&apos;s responsibility.
      </p>
    </div>
  );
}

export default function SampleBomViewer() {
  const [activeTab, setActiveTab] = useState<TabId>("clean");

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    trackDiEvent("sample_output_view", { tab: tabId });
  };

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderBottom: `1px solid ${BORDER}`,
          backgroundColor: BG,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: "0.65rem 1.1rem",
              fontSize: "0.8rem",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? ACCENT : MUTED,
              backgroundColor: activeTab === tab.id ? CARD_BG : "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? `2px solid ${ACCENT}` : "2px solid transparent",
              cursor: "pointer",
              minHeight: 44,
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: MUTED,
            fontStyle: "italic",
            marginBottom: "1rem",
          }}
        >
          Synthetic demonstration data. Not real customer documents.
        </p>

        {activeTab === "clean" && (
          <div>
            <p style={{ color: CLEAN, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              {CLEAN_ROWS.length} rows passing all validators
            </p>
            <Table rows={CLEAN_ROWS} />
          </div>
        )}

        {activeTab === "review" && (
          <div>
            <p style={{ color: WARN, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              {REVIEW_ROWS.length} rows requiring user review
            </p>
            <Table rows={REVIEW_ROWS} showFlag />
          </div>
        )}

        {activeTab === "duplicates" && (
          <div>
            <p style={{ color: WARN, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              {DUPLICATE_ROWS.length} records in duplicate group
            </p>
            <Table rows={DUPLICATE_ROWS} showFlag />
          </div>
        )}

        {activeTab === "revisions" && (
          <div>
            <p style={{ color: WARN, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              {REVISION_ROWS.length} revision conflicts detected
            </p>
            <Table rows={REVISION_ROWS} showFlag />
          </div>
        )}

        {activeTab === "procurement" && (
          <div>
            <p style={{ color: CLEAN, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              {PROCUREMENT_ROWS.length} procurement-ready rows
            </p>
            <Table rows={PROCUREMENT_ROWS} />
          </div>
        )}

        {activeTab === "erp" && <ErpTemplate />}

        {activeTab === "source" && (
          <div>
            <p style={{ color: TEXT, fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Every row linked to source document, page, table, and evidence ID
            </p>
            <SourceMapTable />
          </div>
        )}
      </div>
    </div>
  );
}
