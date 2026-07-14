// SectorCalc V5.3.1 — Assisted PRO Dossier Request UI
// Rendered for BLOCKED_SOURCE_REQUIRED tools. Shows a call-to-action
// for source-file-based assisted review.
import "server-only";
import { getBarisToolCategory } from "@/sectorcalc/formulas/pro-v531/baris-readiness-data";

interface ProToolAssistedDossierProps {
  toolKey: string;
  toolName: string;
}

export function ProToolAssistedDossier({ toolKey, toolName }: ProToolAssistedDossierProps) {
  const entry = getBarisToolCategory(toolKey);

  if (!entry || entry.category !== "BLOCKED_SOURCE_REQUIRED") {
    return null;
  }

  return (
    <article className="pro-shell" style={{
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#F0EEE6",
      borderRadius: "8px",
    }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <p style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#BD5D3A",
          marginBottom: "0.25rem",
        }}>
          SectorCalc PRO · Assisted Dossier
        </p>
        <h1 style={{
          fontFamily: "'Barlow', serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#1A1915",
          margin: 0,
        }}>
          {toolName}
        </h1>
      </header>

      <div style={{
        background: "#fff",
        borderRadius: "6px",
        padding: "1.5rem",
        marginBottom: "1rem",
      }}>
        <h2 style={{
          fontFamily: "'Barlow', serif",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#1A1915",
          marginTop: 0,
          marginBottom: "0.75rem",
        }}>
          Source data required — assisted review required
        </h2>

        <p style={{
          color: "#4A4A46",
          lineHeight: 1.6,
          marginBottom: "1rem",
        }}>
          This tool is not available as instant execution. It requires
          verified source data, engineering documentation, or regulatory
          inputs. A qualified engineer will perform the review and deliver
          a structured dossier.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <p style={{
            fontWeight: 600,
            color: "#1A1915",
            marginBottom: "0.5rem",
          }}>
            Expected deliverable:
          </p>
          <ul style={{
            color: "#4A4A46",
            lineHeight: 1.6,
            paddingLeft: "1.25rem",
            margin: 0,
          }}>
            <li>Verified calculation and compliance review</li>
            <li>Source standard references with deviation notes</li>
            <li>Signed technical summary suitable for audit</li>
          </ul>
        </div>

        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1.5rem",
        }}>
          <button
            type="button"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#BD5D3A",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Submit source files
          </button>

          <button
            type="button"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#1A1915",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Contact for quote
          </button>
        </div>
      </div>

      <p style={{
        fontSize: "0.8rem",
        color: "#888",
        fontStyle: "italic",
        lineHeight: 1.5,
      }}>
        Technical simulation for engineering decision support. Results are
        not a substitute for professional engineering review, legal advice,
        or regulatory compliance certification. Verify all outputs against
        applicable standards before use.
      </p>
    </article>
  );
}
