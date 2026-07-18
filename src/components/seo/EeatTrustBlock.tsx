/**
 * SectorCalc — E-E-A-T Trust Block (YMYL-Adjacent Mandatory)
 *
 * Per-tool-page visible DOM block that satisfies Google E-E-A-T
 * requirements for YMYL-adjacent financial tools.
 *
 * Mandate spec: every tool page displays:
 *   - Author avatar + name + title + LinkedIn
 *   - Methodology standard reference
 *   - Data sources with live links
 *   - Last updated date + author + reviewer
 *   - Legal disclaimer
 */

import type React from "react";

export interface EeatTrustBlockProps {
  authorName: string;
  authorTitle: string;
  authorLinkedIn: string;
  authorAvatarUrl?: string;
  methodology: string;
  dataSources: readonly { name: string; url: string }[];
  lastUpdated: string;
  reviewerName?: string;
  disclaimer?: string;
}

export function EeatTrustBlock({
  authorName,
  authorTitle,
  authorLinkedIn,
  authorAvatarUrl,
  methodology,
  dataSources,
  lastUpdated,
  reviewerName,
  disclaimer,
}: EeatTrustBlockProps): React.ReactElement {
  const reviewer = reviewerName ?? authorName;
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const defaultDisclaimer =
    "For informational purposes only. SectorCalc outputs are technical estimates based on stated assumptions, not financial, legal, medical or engineering advice. Consult a licensed CPA or qualified professional for tax, investment and compliance decisions.";

  return (
    <div className="pro-tool-card" style={{ marginTop: "2rem" }}>
      <div className="pro-card-hd" style={{ padding: "1.25rem 1.5rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#1A1915" }}>
          Methodology &amp; Trust
        </h4>
      </div>
      <div style={{ padding: "1rem 1.5rem 1.5rem", fontSize: "0.875rem", lineHeight: 1.6, color: "#3A3835" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          {authorAvatarUrl && (
            <img
              src={authorAvatarUrl}
              alt={authorName}
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              loading="lazy"
            />
          )}
          <div>
            <strong style={{ color: "#1A1915" }}>{authorName}</strong>
            <span style={{ display: "block", fontSize: "0.8rem", color: "#6B6860" }}>{authorTitle}</span>
            <a
              href={authorLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.8rem", color: "#BD5D3A", textDecoration: "none" }}
            >
              LinkedIn Profile →
            </a>
          </div>
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ color: "#1A1915" }}>Methodology: </strong>
          <span>{methodology}</span>
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ color: "#1A1915" }}>Data sources: </strong>
          {dataSources.map((ds, i) => (
            <span key={ds.url}>
              <a href={ds.url} target="_blank" rel="noopener noreferrer" style={{ color: "#BD5D3A", textDecoration: "none" }}>
                {ds.name}
              </a>
              {i < dataSources.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
        <div style={{ marginBottom: "0.75rem", fontSize: "0.8rem", color: "#6B6860" }}>
          <span>Last updated: {formattedDate} — by {authorName}</span>
          {reviewer !== authorName && <span> — reviewed by {reviewer}</span>}
        </div>
        <div style={{ borderTop: "1px solid #D4D0C8", paddingTop: "0.75rem", marginTop: "0.5rem", fontSize: "0.78rem", color: "#8B8678", fontStyle: "italic" }}>
          {disclaimer ?? defaultDisclaimer}
        </div>
      </div>
    </div>
  );
}
