"use client";

import { SectorCalcLogo } from "@/components/ui/SectorCalcLogo";

interface PopupHeaderProps {
  onClose: () => void;
}

/**
 * Popup header with SectorCalc logo + brand text + close button.
 * Used in floating popup/dialog contexts (e.g. trace bubble).
 */
export function PopupHeader({ onClose }: PopupHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-kil-surface"
      data-testid="popup-header"
    >
      <div className="flex items-center gap-3">
        <SectorCalcLogo width={40} height={40} />
        <span className="text-lg font-semibold text-[#1A1915] tracking-tight">
          SectorCalc
        </span>
      </div>
      <button
        onClick={onClose}
        className="bg-none border-none text-2xl cursor-pointer text-gray-400 p-1 leading-none transition-colors hover:text-[#1A1915]"
        aria-label="Close popup"
        type="button"
      >
        ×
      </button>
    </div>
  );
}
