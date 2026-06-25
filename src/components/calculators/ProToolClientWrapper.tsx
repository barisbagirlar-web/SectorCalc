"use client";

import { useState } from "react";
import UniversalCalculator from "./UniversalCalculator";
import { usePremiumToolAccess } from "@/lib/billing/use-premium-tool-access";
import Link from "next/link";

interface ProToolClientWrapperProps {
  tool: any;
  locale: string;
}

export default function ProToolClientWrapper({ tool, locale }: ProToolClientWrapperProps) {
  const {
    canAccessAnalyzer,
    needsCreditLoad,
    requiresCreditConsume,
    creditPending,
    consumeCreditForRun,
    startCreditPackCheckout,
    creditBalance,
    hasCredits,
  } = usePremiumToolAccess(tool.tool_id);

  const [message, setMessage] = useState<string | null>(null);

  const handleCalculate = async () => {
    setMessage(null);
    if (!canAccessAnalyzer && needsCreditLoad) {
      setMessage("You need to load credits to run this calculation.");
      return false;
    }
    if (requiresCreditConsume) {
      setMessage("Consuming credit for calculation...");
      const res = await consumeCreditForRun(tool.tool_id);
      if (!res.ok) {
        setMessage("Could not deduct credit. Please load more credits or subscribe.");
        return false;
      }
      setMessage(null);
    }
    return true;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Credit Status / Banner */}
      {!canAccessAnalyzer && needsCreditLoad ? (
        <div style={{
          background: "#FFFBEB",
          border: "1px solid #F59E0B",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#D97706",
            margin: 0,
          }}>
            CREDITS REQUIRED
          </p>
          <h3 style={{
            fontFamily: "Georgia, serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#1A1915",
            margin: 0,
          }}>
            Load credits to run this professional calculator
          </h3>
          <p style={{
            fontSize: 13,
            color: "rgba(26,25,21,0.7)",
            margin: 0,
            lineHeight: 1.5,
          }}>
            Each full premium calculation uses 1 credit. SectorCalc Pro subscribers can run calculations without credits.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
            <button
              disabled={creditPending}
              onClick={() => {
                void startCreditPackCheckout({
                  toolSlug: tool.tool_id,
                  returnPath: `/pro-tools/${tool.tool_id}`,
                  locale,
                  creditPackSize: 5,
                }).catch(() => undefined);
              }}
              style={{
                background: "#BD5D3A",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {creditPending ? "Processing..." : "Load 5 credits — $4.99"}
            </button>
            <Link
              href="/pricing"
              style={{
                background: "transparent",
                color: "#1A1915",
                border: "1px solid rgba(26,25,21,0.3)",
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              View Pro Plans
            </Link>
          </div>
        </div>
      ) : requiresCreditConsume ? (
        <div style={{
          background: "#FAF9F5",
          border: "1px solid rgba(26,25,21,0.12)",
          padding: "12px 16px",
          fontSize: 13,
          color: "rgba(26,25,21,0.7)",
        }}>
          Credits Balance: <strong>{creditBalance}</strong> — 1 credit will be deducted per premium run.
        </div>
      ) : null}

      {message && (
        <div style={{
          background: "#EFF6FF",
          borderLeft: "3px solid #3B82F6",
          padding: "12px 16px",
          fontSize: 13,
          color: "#1E40AF",
        }}>
          {message}
        </div>
      )}

      {/* Main Calculator */}
      <UniversalCalculator
        tool={tool}
        locale={locale}
        onCalculate={handleCalculate}
      />
    </div>
  );
}
