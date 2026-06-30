"use client";

export type CalculatorFilterTab = {
  readonly id: string;
  readonly label: string;
  readonly count: number;
};

type CalculatorFilterBarProps = {
  readonly tabs: readonly CalculatorFilterTab[];
  readonly activeTabId: string;
  readonly onTabChange: (tabId: string) => void;
  readonly ariaLabel: string;
};

export function CalculatorFilterBar({
  tabs,
  activeTabId,
  onTabChange,
  ariaLabel,
}: CalculatorFilterBarProps) {
  return (
    <div
      className="sc-filter-bar mt-2 rounded-2xl border border-slate-200 bg-white/70 p-3 min-w-0 max-w-full"
      data-calculator-filter-bar="true"
    >
      <div className="sc-filter-inner" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`sc-filter-btn${isActive ? " is-active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="sc-filter-label">{tab.label}</span>
              <span className="sc-filter-count">{tab.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
