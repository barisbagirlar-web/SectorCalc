/** Homepage hero — mathematical symbol visual layer (locked). */
export function HeroMathematicalSymbols() {
  return (
    <div className="sc-hero-visuals" aria-hidden="true">
      <div className="sc-symbol-wrapper sc-symbol-plus">
        <svg viewBox="0 0 200 200" className="sc-hero-svg">
          <circle cx="100" cy="100" r="98" className="sc-svg-border" />
          <path d="M100 40 V160 M40 100 H160" className="sc-svg-line" />
        </svg>
      </div>

      <div className="sc-symbol-wrapper sc-symbol-multiply">
        <svg viewBox="0 0 160 160" className="sc-hero-svg">
          <circle cx="80" cy="80" r="78" className="sc-svg-border-dashed" />
          <path d="M40 40 L120 120 M120 40 L40 120" className="sc-svg-line-accent" />
        </svg>
      </div>

      <div className="sc-symbol-wrapper sc-symbol-divide">
        <svg viewBox="0 0 140 140" className="sc-hero-svg">
          <circle cx="70" cy="70" r="68" className="sc-svg-border" />
          <circle cx="70" cy="40" r="6" className="sc-svg-dot-accent" />
          <path d="M30 70 H110" className="sc-svg-line" />
          <circle cx="70" cy="100" r="6" className="sc-svg-dot-accent" />
        </svg>
      </div>

      <div className="sc-symbol-wrapper sc-symbol-minus">
        <svg viewBox="0 0 240 240" className="sc-hero-svg sc-blur">
          <circle cx="120" cy="120" r="118" className="sc-svg-border-light" />
          <path d="M60 120 H180" className="sc-svg-line-light" />
        </svg>
      </div>

      <div className="sc-tech-deco sc-deco-1" />
      <div className="sc-tech-deco sc-deco-2" />
    </div>
  );
}
