/**
 * Maintenance BOM Recovery — New Job (Diagnostic Upload)
 *
 * Route: /document-intelligence/maintenance-bom-recovery/new
 * Client component for PDF upload and free diagnostic.
 */

"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DiagnosticState =
  | "idle"
  | "uploading"
  | "scanning"
  | "eligible"
  | "manual_review"
  | "rejected"
  | "error";

interface DiagnosticResult {
  status: DiagnosticState;
  pageCount: number;
  estimatedRows: number;
  previewRows: Array<{ rowIndex: number; columns: Record<string, string> }>;
  rejectionReasons: string[];
}

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const BORDER = "rgba(26,25,21,0.10)";

export default function NewJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<DiagnosticState>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are accepted.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("File exceeds 50 MB limit.");
      return;
    }

    setFileName(file.name);
    setErrorMessage("");
    setState("uploading");

    try {
      // In production, this uploads to a signed URL / Cloud Storage.
      // For the V1 implementation, we simulate the diagnostic flow.
      setState("scanning");

      // Simulate diagnostic processing
      await new Promise((r) => setTimeout(r, 1500));

      // Simulated result: always eligible for demo
      const diagResult: DiagnosticResult = {
        status: "eligible",
        pageCount: 12,
        estimatedRows: 45,
        previewRows: [
          {
            rowIndex: 1,
            columns: {
              "Part Number": "ABC-123",
              Description: "Bearing, Ball",
              Quantity: "4",
            },
          },
          {
            rowIndex: 2,
            columns: {
              "Part Number": "DEF-456",
              Description: "Seal, Oil",
              Quantity: "2",
            },
          },
        ],
        rejectionReasons: [],
      };

      setResult(diagResult);
      setState("eligible");
    } catch {
      setState("error");
      setErrorMessage("Diagnostic failed. Please try again.");
    }
  }, []);

  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: MUTED }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence" className="hover:underline">Document Intelligence</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence/maintenance-bom-recovery" className="hover:underline">Maintenance BOM Recovery</Link>
          <span className="mx-2">›</span>
          <span>New Job</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">Check My Manual Free</h1>
        <p className="mb-8" style={{ color: MUTED }}>
          Upload a machine manual or spare-parts PDF for a free eligibility
          diagnostic. No credit card required.
        </p>

        {/* Upload Area */}
        {state === "idle" && (
          <div
            className="border-2 border-dashed p-12 text-center cursor-pointer"
            style={{ borderColor: BORDER, background: CARD_BG }}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF file"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
              aria-hidden="true"
            />
            <svg
              className="mx-auto mb-4"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ACCENT}
              strokeWidth="1.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="font-semibold mb-1">Upload a PDF</p>
            <p className="text-sm" style={{ color: MUTED }}>
              PDF up to 50 MB. First 3 pages analyzed for free.
            </p>
          </div>
        )}

        {/* Progress States */}
        {(state === "uploading" || state === "scanning") && (
          <div className="p-8 text-center" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <div className="animate-pulse mb-4">
              <div className="w-12 h-12 mx-auto rounded-full" style={{ background: ACCENT }} />
            </div>
            <p className="font-semibold">
              {state === "uploading" ? "Uploading..." : "Analyzing document..."}
            </p>
            <p className="text-sm mt-2" style={{ color: MUTED }}>
              {state === "uploading"
                ? `Uploading ${fileName}`
                : "Checking page count, structure, and language"}
            </p>
          </div>
        )}

        {/* Eligible Result */}
        {state === "eligible" && result && (
          <div>
            <div
              className="p-6 mb-6 border"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <div className="flex items-center gap-3 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <h2 className="text-xl font-bold">Document Eligible</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span style={{ color: MUTED }}>Pages detected:</span>
                  <span className="ml-2 font-semibold">{result.pageCount}</span>
                </div>
                <div>
                  <span style={{ color: MUTED }}>Estimated BOM rows:</span>
                  <span className="ml-2 font-semibold">{result.estimatedRows}</span>
                </div>
              </div>

              {/* Preview Rows */}
              <h3 className="font-semibold mb-2">Preview (first rows)</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: BORDER }}>
                      <th className="text-left py-2 pr-4 font-medium" style={{ color: MUTED }}>#</th>
                      <th className="text-left py-2 pr-4 font-medium" style={{ color: MUTED }}>Part Number</th>
                      <th className="text-left py-2 pr-4 font-medium" style={{ color: MUTED }}>Description</th>
                      <th className="text-left py-2 font-medium" style={{ color: MUTED }}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.previewRows.map((row) => (
                      <tr key={row.rowIndex} className="border-b" style={{ borderColor: BORDER }}>
                        <td className="py-2 pr-4">{row.rowIndex}</td>
                        <td className="py-2 pr-4">{row.columns["Part Number"]}</td>
                        <td className="py-2 pr-4">{row.columns["Description"]}</td>
                        <td className="py-2">{row.columns["Quantity"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Risks */}
              <div className="p-4 mb-6 text-sm" style={{ background: "#FEF3C7", borderRadius: 0 }}>
                <p className="font-semibold mb-1">Detected Risks</p>
                <ul className="list-disc pl-4 space-y-1" style={{ color: "#92400E" }}>
                  <li>Some rows may have inconsistent formatting</li>
                  <li>Verify extracted data against source document</li>
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="p-6 border" style={{ borderColor: BORDER, background: BG }}>
                <div className="text-2xl font-bold mb-2" style={{ color: ACCENT }}>
                  149 Credits
                </div>
                <p className="text-sm mb-4" style={{ color: MUTED }}>
                  Fixed price for full processing of this document.
                </p>
                <button
                  className="w-full py-3 font-semibold text-white"
                  style={{ background: ACCENT }}
                  type="button"
                  onClick={() => router.push("/pricing")}
                >
                  Process Full Manual — 149 Credits
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejected Result */}
        {state === "rejected" && (
          <div className="p-6 border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <h2 className="text-xl font-bold">Document Not Eligible</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: MUTED }}>
              This document cannot be processed automatically.
            </p>
            <p className="text-sm" style={{ color: MUTED }}>
              Automatic 149-credit processing is unavailable for this file.
            </p>
          </div>
        )}

        {/* Manual Review */}
        {state === "manual_review" && (
          <div className="p-6 border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <div className="flex items-center gap-3 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <h2 className="text-xl font-bold">Manual Review Required</h2>
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              This document requires exception review. Automatic 149-credit
              processing is unavailable for this file.
            </p>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="p-6 border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <p style={{ color: "#EF4444" }}>{errorMessage}</p>
            <button
              className="mt-4 px-6 py-2 font-medium border"
              style={{ borderColor: BORDER }}
              type="button"
              onClick={() => {
                setState("idle");
                setErrorMessage("");
                setResult(null);
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
