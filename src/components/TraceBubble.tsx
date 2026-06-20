// ============================================================
// src/components/TraceBubble.tsx
// SectorCalc — Trace AI Welcome Bubble + DeepSeek Chat
// DÜZELTME v3:
//   1. Trigger butona basınca gerçek chat paneli açılır (DeepSeek API)
//   2. Logo: B.jpg orijinal SectorCalc sembolü (köşeli bracket)
//   3. 2.5s sonra otomatik karşılama balonu + chips + typing animasyonu
//   4. Chat paneli = existing FreeTraceChat → useTraceChat → /api/trace/free → DeepSeek flash
// ============================================================
"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FreeTraceChat } from "@/components/trace/FreeTraceChat";
import { SectorCalcLogo } from "@/components/ui/SectorCalcLogo";

// ─── Quick chips ───────────────────────────────────────────
const CHIPS = [
  { label: "\u2699\uFE0F OEE",    href: "https://www.sectorcalc.com/free-tools?category=quality-six-sigma" },
  { label: "\uD83D\uDCE6 Scrap",  href: "https://www.sectorcalc.com/free-tools?category=quality-six-sigma" },
  { label: "\u26A1 Energy", href: "https://www.sectorcalc.com/free-tools?category=sustainability-resource-esg" },
  { label: "\uD83D\uDCB0 Quote",  href: "https://www.sectorcalc.com/free-tools?category=hse-ergonomics" },
];

export default function TraceBubble() {
  const t = useTranslations("trace");
  const [bubbleOpen, setBubbleOpen]     = useState(false);  // karşılama balonu
  const [chatOpen, setChatOpen]         = useState(false);  // gerçek chat paneli
  const [showText, setShowText]         = useState(false);  // typing animasyonu bitti

  // Sayfa yüklendikten 2.5s sonra karşılama balonunu aç (bir kez)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("trace-bubble-seen")) return;
    const t1 = setTimeout(() => {
      setBubbleOpen(true);
      sessionStorage.setItem("trace-bubble-seen", "1");
    }, 2500);
    return () => clearTimeout(t1);
  }, []);

  // Bubble açıldığında 1.2s sonra typing → metin
  useEffect(() => {
    if (!bubbleOpen) { setShowText(false); return; }
    const t2 = setTimeout(() => setShowText(true), 1200);
    return () => clearTimeout(t2);
  }, [bubbleOpen]);

  // Chat açıldığında bubble'ı kapat
  useEffect(() => {
    if (chatOpen) setBubbleOpen(false);
  }, [chatOpen]);

  const handleCloseBubble = useCallback(() => {
    setBubbleOpen(false);
  }, []);

  const handleTrigger = useCallback(() => {
    // Bubble açıksa → kapat ve chat aç
    if (bubbleOpen) {
      setBubbleOpen(false);
      setChatOpen(true);
      return;
    }
    // Bubble yoksa → chat toggle
    setChatOpen((prev) => !prev);
  }, [bubbleOpen]);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  return (
    <>
      <style>{`
        @keyframes sc-pop-in {
          from { opacity:0; transform:scale(0.72) translateY(14px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes sc-ring {
          0%   { transform:scale(0.88); opacity:1; }
          100% { transform:scale(1.24); opacity:0; }
        }
        @keyframes sc-dot-bounce {
          0%,80%,100% { transform:translateY(0);   background:#334155; }
          40%         { transform:translateY(-5px); background:#60a5fa; }
        }
        @keyframes sc-blink {
          0%,100%{ opacity:1; } 50%{ opacity:0.3; }
        }
        @keyframes sc-fade-up {
          from{ opacity:0; transform:translateY(5px); }
          to  { opacity:1; transform:translateY(0);   }
        }
        .sc-chip:hover{
          background:rgba(59,130,246,0.2)!important;
          border-color:rgba(96,165,250,0.5)!important;
          color:#93c5fd!important;
        }
        .sc-cta-btn:hover{ filter:brightness(1.12); transform:translateY(-1px); }
        .sc-trigger:hover{ transform:scale(1.08)!important; }
        .sc-close:hover{ background:#263347!important; color:#94a3b8!important; }
      `}</style>

      {/* ── WIDGET — fixed sağ alt ── */}
      <div style={{
        position:"fixed", bottom:24, right:24, zIndex:9999,
        display:"flex", flexDirection:"column", alignItems:"flex-end", gap:14,
        fontFamily:"'Inter',system-ui,-apple-system,sans-serif",
      }}>
        {/* ════ CHAT PANEL (gerçek DeepSeek chat) ════ */}
        {chatOpen && (
          <div
            style={{
              position:"relative",
              width:360,
              maxHeight:560,
              borderRadius:18,
              overflow:"hidden",
              boxShadow:"0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(59,130,246,0.07)",
              animation:"sc-pop-in 0.42s cubic-bezier(0.34,1.56,0.64,1) both",
              transformOrigin:"bottom right",
            }}
          >
            <FreeTraceChat onClose={handleCloseChat} />
          </div>
        )}

        {/* ════ KARŞILAMA BALONU (ilk ziyarette) ════ */}
        {bubbleOpen && !chatOpen && (
          <div
            role="dialog"
            aria-label="Trace AI"
            style={{
              position:"relative",
              width:272,
              background:"#111c30",
              border:"1px solid #1e3a5a",
              borderRadius:"18px 18px 4px 18px",
              padding:"18px 16px 16px",
              boxShadow:"0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(59,130,246,0.07)",
              animation:"sc-pop-in 0.42s cubic-bezier(0.34,1.56,0.64,1) both",
              transformOrigin:"bottom right",
            }}
          >
            {/* mavi üst şerit */}
            <div style={{
              position:"absolute", top:0, left:20, right:20, height:1.5,
              background:"linear-gradient(90deg,transparent,#3b82f6 40%,#60a5fa 60%,transparent)",
              borderRadius:"0 0 3px 3px",
            }}/>

            {/* kuyruk üçgeni */}
            <div style={{
              position:"absolute", bottom:-9, right:26,
              width:0, height:0,
              borderLeft:"9px solid transparent",
              borderTop:"9px solid #1e3a5a",
            }}/>
            <div style={{
              position:"absolute", bottom:-7, right:27,
              width:0, height:0,
              borderLeft:"8px solid transparent",
              borderTop:"8px solid #111c30",
            }}/>

            {/* ── Header ── */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13 }}>
              {/* Avatar — SectorCalc orijinal logo */}
              <div style={{
                width:38, height:38, borderRadius:"50%",
                background:"linear-gradient(135deg,#1d4ed8,#1e3a8a)",
                border:"1.5px solid rgba(96,165,250,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <SectorCalcLogo width={22} height={22} inverted />
              </div>

              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.01em", lineHeight:1, marginBottom:3 }}>
                  {t("title")}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#22c55e", fontWeight:500 }}>
                  <span style={{
                    width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block",
                    animation:"sc-blink 2.2s ease-in-out infinite",
                  }}/>
                  {t("bubbleOnline")}
                </div>
              </div>

              {/* Kapat */}
              <button
                onClick={handleCloseBubble}
                className="sc-close"
                aria-label={t("close")}
                style={{
                  width:24, height:24, borderRadius:"50%",
                  background:"#1e2d45", border:"none",
                  color:"#475569", fontSize:16,
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background .15s, color .15s", lineHeight:1,
                }}
              >×</button>
            </div>

            {/* ── Divider ── */}
            <div style={{
              height:1,
              background:"linear-gradient(90deg,transparent,#1e3a5a,transparent)",
              marginBottom:13,
            }}/>

            {/* ── Typing dots → metin ── */}
            {!showText ? (
              <div style={{ display:"flex", gap:5, padding:"6px 0 10px" }}>
                {[0,150,300].map(d => (
                  <span key={d} style={{
                    width:6, height:6, borderRadius:"50%", background:"#334155", display:"inline-block",
                    animation:`sc-dot-bounce 1.1s ease-in-out ${d}ms infinite`,
                  }}/>
                ))}
              </div>
            ) : (
              <p style={{
                fontSize:13.5, color:"#94a3b8", lineHeight:1.65, marginBottom:13,
                animation:"sc-fade-up 0.35s ease both",
                whiteSpace:"pre-wrap",
              }}
                dangerouslySetInnerHTML={{ __html: t.raw("fabBubble") }}
              />
            )}

            {/* ── Chips ── */}
            {showText && (
              <div style={{
                display:"flex", flexWrap:"wrap", gap:7, marginBottom:13,
                animation:"sc-fade-up 0.4s ease 0.08s both",
              }}>
                {CHIPS.map(c => (
                  <a key={c.label} href={c.href} className="sc-chip" style={{
                    fontSize:11.5, color:"#60a5fa",
                    background:"rgba(59,130,246,0.1)",
                    border:"1px solid rgba(59,130,246,0.22)",
                    borderRadius:20, padding:"5px 11px",
                    textDecoration:"none", fontWeight:500, whiteSpace:"nowrap",
                    transition:"all .15s", cursor:"pointer",
                  }}>
                    {c.label}
                  </a>
                ))}
              </div>
            )}

            {/* ── CTA ── */}
            {showText && (
              <a
                href="https://www.sectorcalc.com/free-tools"
                className="sc-cta-btn"
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  width:"100%", padding:"11px 0",
                  background:"linear-gradient(135deg,#2563eb,#1e40af)",
                  border:"1px solid rgba(96,165,250,0.22)",
                  borderRadius:12, color:"#e8f0ff",
                  fontSize:14, fontWeight:700,
                  textDecoration:"none", cursor:"pointer",
                  transition:"filter .15s, transform .15s",
                  animation:"sc-fade-up 0.45s ease 0.16s both",
                  letterSpacing:"0.01em",
                }}
              >
                {t("intro.cta")}
                <span style={{ fontSize:17 }}>→</span>
              </a>
            )}
          </div>
        )}

        {/* ════ TRIGGER BUTON ════ */}
        <div style={{ position:"relative", width:54, height:54 }}>

          {/* Pulse ring 1 */}
          <span style={{
            position:"absolute", inset:-5, borderRadius:"50%",
            border:"1.5px solid rgba(59,130,246,0.3)",
            animation:"sc-ring 2.6s ease-out infinite",
            pointerEvents:"none",
          }}/>
          {/* Pulse ring 2 */}
          <span style={{
            position:"absolute", inset:-12, borderRadius:"50%",
            border:"1.5px solid rgba(59,130,246,0.12)",
            animation:"sc-ring 2.6s ease-out 0.7s infinite",
            pointerEvents:"none",
          }}/>

          <button
            onClick={handleTrigger}
            aria-label={chatOpen ? t("close") : t("launcher")}
            className="sc-trigger"
            style={{
              position:"relative", zIndex:1,
              width:54, height:54, borderRadius:"50%",
              background:"linear-gradient(135deg,#2563eb,#1e3a8a)",
              border:"1.5px solid rgba(96,165,250,0.35)",
              boxShadow:"0 8px 28px rgba(29,78,216,0.5)",
              cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"transform .18s, box-shadow .18s",
            }}
          >
            {/* Online badge */}
            <span style={{
              position:"absolute", top:2, right:2,
              width:12, height:12, borderRadius:"50%",
              background:"#22c55e", border:"2.5px solid #0F172A",
              animation:"sc-blink 3s ease-in-out infinite",
            }}/>

            {/* SectorCalc orijinal logo */}
            <SectorCalcLogo width={26} height={26} inverted />
          </button>
        </div>

      </div>
    </>
  );
}
