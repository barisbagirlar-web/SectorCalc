"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";

export interface VisualObservation {
  element: string;
  observation: string;
  confidence: "HIGH_CONFIDENCE" | "MEDIUM_CONFIDENCE" | "LOW_CONFIDENCE";
  requires_manual_verification: boolean;
  concern_level: "LOW" | "MEDIUM" | "HIGH";
}

export interface PhotoPreviewResponse {
  ok: boolean;
  mode: "visual_preview";
  credits_consumed: number;
  probable_domain: string;
  probable_issue_type: string;
  observations: VisualObservation[];
  summary: string;
  photo_quality_note: string;
  recommended_next_steps: string[];
  photo_hashes: string[];
  ai_available: boolean;
  disclaimer: string;
  requires_upgrade: boolean;
  locked_features: string[];
}

const LOCKED_FEATURES = [
  "Root Cause Analysis",
  "Cost-at-Risk",
  "NCR/CAPA",
  "PDF Report",
  "Verification Record",
  "Dashboard History",
];

export function CameraOnlyPreview() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [problemNote, setProblemNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhotoPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsCredits, setNeedsCredits] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const valid = files.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    ).slice(0, 8);

    setPhotos(valid);
    setPreviewUrls(valid.map((f) => URL.createObjectURL(f)));
    setResult(null);
    setError(null);
    setNeedsCredits(false);
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(previewUrls[index]);
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
  }

  async function submitPreview() {
    if (photos.length === 0) return;
    setLoading(true);
    setError(null);
    setNeedsCredits(false);

    try {
      const token = await getCurrentUserIdToken();
      if (!token) {
        setError("Please sign in to use AI Photo Diagnosis.");
        setLoading(false);
        return;
      }

      // Convert files to base64 for the API
      const photoPromises = photos.map(
        (f) =>
          new Promise<{ data: string; mime: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ data: reader.result as string, mime: f.type });
            reader.onerror = reject;
            reader.readAsDataURL(f);
          })
      );

      const photoData = await Promise.all(photoPromises);

      const res = await fetch("/api/engineering-diagnostics/photo-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photos: photoData.map((p) => p.data),
          mime_types: photoData.map((p) => p.mime),
          problem_note: problemNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setNeedsCredits(true);
          setError("2 Diagnostic Credits are required for AI Photo Diagnosis.");
        } else if (res.status === 429) {
          setError("Rate limit exceeded. Please wait before trying again.");
        } else if (res.status === 401) {
          setError("Please sign in to use AI Photo Diagnosis.");
        } else {
          setError(data.error || "Visual analysis failed.");
        }
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError("Unable to reach the visual analysis service. Please try again.");
    }
    setLoading(false);
  }

  function concernBadge(level: string): { bg: string; fg: string } {
    switch (level) {
      case "HIGH": return { bg: "#F5D6D6", fg: "#A12323" };
      case "MEDIUM": return { bg: "#FFF8D6", fg: "#8A7A23" };
      default: return { bg: "#D6F5D6", fg: "#238A23" };
    }
  }

  function confidenceLabel(cls: string): string {
    switch (cls) {
      case "HIGH_CONFIDENCE": return "High Confidence";
      case "MEDIUM_CONFIDENCE": return "Medium Confidence";
      default: return "Low Confidence";
    }
  }

  return (
    <div>
      {/* Pricing card */}
      <div
        style={{
          padding: "1.25rem",
          background: "#FFF9F0",
          border: "1px solid #E8D5B5",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.25rem" }}>
              AI Photo Diagnosis
            </div>
            <div style={{ fontSize: "0.85rem", color: "#4A4A48", lineHeight: 1.5 }}>
              Upload photos to receive an AI-assisted visual engineering assessment.
            </div>
          </div>
          <div
            style={{
              padding: "0.4rem 0.75rem",
              background: "#1A1915",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            2 Diagnostic Credits
          </div>
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 0.75rem",
            background: "#F0EEE6",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#6B6B68",
            lineHeight: 1.5,
          }}
        >
          AI Photo Diagnosis requires 2 Diagnostic Credits. Analysis begins only after credits are verified.
        </div>
      </div>

      {/* Optional problem note */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem 1rem",
          background: "#F0EEE6",
          border: "1px solid #D6D4CC",
          borderRadius: "8px",
        }}
      >
        <label
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#1A1915",
            display: "block",
            marginBottom: "0.4rem",
          }}
        >
          Problem Note <span style={{ color: "#6B6B68", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          value={problemNote}
          onChange={(e) => setProblemNote(e.target.value)}
          placeholder="Briefly describe what you are investigating (e.g. unusual vibration on motor bearing, surface rust on structural beam)"
          rows={2}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "0.85rem",
            border: "1px solid #D6D4CC",
            borderRadius: "6px",
            background: "#fff",
            color: "#1A1915",
            boxSizing: "border-box",
            resize: "vertical",
            minHeight: "60px",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Photo upload area */}
      <div
        style={{
          padding: "1.5rem",
          background: "#F0EEE6",
          border: "2px dashed #D6D4CC",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {previewUrls.length === 0 ? (
          <div>
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: "0.75rem",
                color: "#6B6B68",
              }}
            >
              📷
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#4A4A48",
                marginBottom: "1rem",
              }}
            >
              Capture or upload field photos for visual assessment
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "0.8rem 1.5rem",
                background: "#1A1915",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: "48px",
              }}
            >
              Take Photo or Upload
            </button>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6B6B68",
                marginTop: "0.75rem",
              }}
            >
              JPEG, PNG, WebP &middot; Max 8 photos &middot; 8 MB each
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {previewUrls.map((url, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: "6px",
                    overflow: "hidden",
                    aspectRatio: "1",
                    background: "#E8E6DE",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      border: "none",
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#1A1915",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              >
                {photos.length >= 8 ? "Replace Photos" : "Add More Photos"}
              </button>
              <button
                onClick={submitPreview}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  background: loading ? "#D6D4CC" : "#BD5D3A",
                  color: loading ? "#6B6B68" : "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  minHeight: "44px",
                }}
              >
                {loading ? "Analyzing..." : "Start AI Photo Diagnosis (2 Credits)"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: needsCredits ? "#FFF8D6" : "#F5D6D6",
            border: needsCredits ? "1px solid #E8D5B5" : "1px solid #D99A9A",
            borderRadius: "6px",
            color: needsCredits ? "#8A7A23" : "#A12323",
            fontSize: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            {!needsCredits && (
              <button
                onClick={() => setError(null)}
                style={{
                  background: "#A12323",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.7rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  flexShrink: 0,
                  marginLeft: "0.75rem",
                }}
              >
                Dismiss
              </button>
            )}
          </div>
          {needsCredits && (
            <div style={{ marginTop: "0.75rem" }}>
              <Link
                href="/pricing"
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1.25rem",
                  background: "#BD5D3A",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  minHeight: "44px",
                  lineHeight: "44px",
                }}
              >
                Get Diagnostic Credits
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          {/* Credit consumption */}
          {result.credits_consumed > 0 && (
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#F0EEE6",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "#6B6B68",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              2 Diagnostic Credits consumed for this analysis.
            </div>
          )}

          {/* Summary */}
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#FFF9F0",
              border: "1px solid #E8D5B5",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              color: "#4A4A48",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#1A1915" }}>Visual Assessment Summary</strong>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
              {result.summary}
            </p>
            {result.photo_quality_note && (
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.8rem",
                  color: "#6B6B68",
                  fontStyle: "italic",
                }}
              >
                Photo quality: {result.photo_quality_note}
              </p>
            )}
          </div>

          {/* Probable Domain + Issue Type */}
          {(result.probable_domain || result.probable_issue_type) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "#F0EEE6",
                  borderRadius: "6px",
                  border: "1px solid #D6D4CC",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#6B6B68", marginBottom: "0.2rem" }}>
                  Probable Domain
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1A1915" }}>
                  {result.probable_domain === "UNKNOWN" ? "Not determined from photos" : result.probable_domain}
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "#F0EEE6",
                  borderRadius: "6px",
                  border: "1px solid #D6D4CC",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#6B6B68", marginBottom: "0.2rem" }}>
                  Probable Issue Type
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1A1915" }}>
                  {result.probable_issue_type === "UNKNOWN" ? "Not determined from photos" : result.probable_issue_type}
                </div>
              </div>
            </div>
          )}

          {/* Observations */}
          {result.observations.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#1A1915",
                  marginBottom: "0.5rem",
                }}
              >
                Observations
              </div>
              {result.observations.map((obs, i) => {
                const cb = concernBadge(obs.concern_level);
                return (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#F0EEE6",
                      borderRadius: "6px",
                      marginBottom: "0.5rem",
                      borderLeft: `3px solid ${cb.fg}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1A1915" }}>
                        {obs.element}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.4rem",
                          borderRadius: "4px",
                          fontWeight: 600,
                          background: cb.bg,
                          color: cb.fg,
                        }}
                      >
                        {obs.concern_level} Concern
                      </span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#4A4A48", margin: "0.25rem 0" }}>
                      {obs.observation}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        fontSize: "0.75rem",
                        color: "#6B6B68",
                        marginTop: "0.25rem",
                      }}
                    >
                      <span>{confidenceLabel(obs.confidence)}</span>
                      {obs.requires_manual_verification && (
                        <span style={{ color: "#A16A23" }}>Manual verification required</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI availability */}
          {!result.ai_available && (
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#FFF8D6",
                borderRadius: "6px",
                fontSize: "0.8rem",
                color: "#8A7A23",
                marginBottom: "1rem",
              }}
            >
              AI visual analysis is temporarily unavailable. Manual inspection is
              recommended. No credits were consumed.
            </div>
          )}

          {/* Recommended next steps */}
          {result.recommended_next_steps.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#1A1915",
                  marginBottom: "0.4rem",
                }}
              >
                Recommended Next Steps
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.1rem",
                  fontSize: "0.85rem",
                  color: "#4A4A48",
                  lineHeight: 1.8,
                }}
              >
                {result.recommended_next_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Locked premium features */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#1A1915",
                marginBottom: "0.5rem",
              }}
            >
              Unlock with Full Engineering Diagnostic
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {LOCKED_FEATURES.map((f) => (
                <div
                  key={f}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "#F0EEE6",
                    borderRadius: "6px",
                    border: "1px solid #D6D4CC",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8rem",
                    color: "#6B6B68",
                  }}
                >
                  <span>{f}</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.4rem",
                      background: "#E8D5B5",
                      color: "#8A7A23",
                      borderRadius: "3px",
                      fontWeight: 600,
                    }}
                  >
                    Locked
                  </span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
              <Link
                href="/pricing"
                style={{
                  display: "inline-block",
                  padding: "0.6rem 1.5rem",
                  background: "#BD5D3A",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  minHeight: "44px",
                  lineHeight: "44px",
                }}
              >
                Get Diagnostic Credits &mdash; 5 Credits / 3 Diagnostics
              </Link>
            </div>
          </div>

          {/* Photo hashes */}
          {result.photo_hashes.length > 0 && (
            <div
              style={{
                padding: "0.5rem 0.75rem",
                background: "#F5F3ED",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "#6B6B68",
                fontFamily: "monospace",
                marginBottom: "1rem",
              }}
            >
              Photo hashes: {result.photo_hashes.join(", ")}
            </div>
          )}

          {/* Disclaimer */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#FFF9F0",
              border: "1px solid #E8D5B5",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#6B6B68",
              lineHeight: 1.5,
            }}
          >
            {result.disclaimer}
          </div>

          {/* CTA to Full Diagnostic */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              href="/engineering-diagnostics/start"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.8rem 2rem",
                background: "#1A1915",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "48px",
              }}
            >
              Create Full Engineering Diagnostic
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
