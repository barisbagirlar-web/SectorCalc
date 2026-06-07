/**
 * Real product UI mockup — calculator + result panel chrome (no AI illustration).
 */
export function ProductScreenMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`sc-pro-product-mockup sc-pro-letterpress ${className}`.trim()}
      aria-hidden
    >
      <div className="sc-pro-product-mockup__chrome">
        <span className="sc-pro-product-mockup__dot" />
        <span className="sc-pro-product-mockup__dot" />
        <span className="sc-pro-product-mockup__dot" />
        <span className="sc-pro-product-mockup__title">SectorCalc · Decision desk</span>
      </div>
      <div className="sc-pro-product-mockup__body">
        <div className="sc-pro-product-mockup__col">
          <p className="sc-pro-eyebrow">Ledger entries</p>
          <div className="sc-pro-product-mockup__field">
            <span>Machine rate</span>
            <span className="sc-pro-product-mockup__unit">$/h</span>
          </div>
          <div className="sc-pro-product-mockup__field sc-pro-product-mockup__field--active">
            <span>Scrap rate</span>
            <span className="sc-pro-product-mockup__value">6.0</span>
          </div>
          <div className="sc-pro-product-mockup__field">
            <span>Planned hours</span>
            <span className="sc-pro-product-mockup__value">8</span>
          </div>
        </div>
        <div className="sc-pro-product-mockup__col sc-pro-product-mockup__col--result">
          <p className="sc-pro-eyebrow">Exposure</p>
          <p className="sc-pro-product-mockup__big">$4,280</p>
          <p className="sc-pro-product-mockup__alert">Threshold alert — tolerance pressure</p>
          <p className="sc-pro-product-mockup__action">Suggested action: Reprice before accepting</p>
          <p className="sc-pro-product-mockup__preview">Report preview · PDF-ready</p>
        </div>
      </div>
    </div>
  );
}
