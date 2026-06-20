"use client";

import { SectorCalcLogo } from "@/components/ui/SectorCalcLogo";

interface ChatbotHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Chatbot header with SectorCalc logo + title + online status + toggle button.
 * Uses gradient background designed for the trace chatbot panel.
 */
export function ChatbotHeader({ isOpen, onToggle }: ChatbotHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2.5">
        <SectorCalcLogo width={32} height={32} inverted />
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold m-0 text-white">
            SectorCalc Assistant
          </h3>
          <span className="text-xs opacity-90 flex items-center gap-1 text-white">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
              style={{ animation: "sc-pulse 2s infinite" }}
            />
            Online
          </span>
        </div>
      </div>
      <button
        className="bg-white/20 border-none text-white w-7 h-7 rounded-md cursor-pointer text-lg flex items-center justify-center transition-colors hover:bg-white/30"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        type="button"
      >
        {isOpen ? "−" : "+"}
      </button>
      <style jsx>{`
        @keyframes sc-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
