interface IllustrationProps {
  className?: string;
}

export function HeroPlatformIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 920 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sector decision platform dashboard illustration"
    >
      <rect width="920" height="420" rx="8" fill="#ffffff" />
      <rect x="0" y="0" width="920" height="36" fill="#f5f5f5" />
      <circle cx="24" cy="18" r="6" fill="#de4226" />
      <circle cx="44" cy="18" r="6" fill="#ffa500" />
      <circle cx="64" cy="18" r="6" fill="#7dbb3b" />
      <rect x="200" y="12" width="520" height="12" rx="6" fill="#e4e4e4" />
      <rect x="24" y="52" width="180" height="348" rx="4" fill="#155079" />
      {[72, 100, 128, 156, 184, 212, 240, 268].map((y) => (
        <rect key={y} x="44" y={y} width="120" height="10" rx="2" fill="rgba(255,255,255,0.25)" />
      ))}
      <rect x="220" y="52" width="676" height="80" rx="4" fill="#e7f9ff" />
      <rect x="240" y="72" width="140" height="40" rx="4" fill="#07b6ef" opacity="0.2" />
      <rect x="400" y="72" width="140" height="40" rx="4" fill="#7dbb3b" opacity="0.25" />
      <rect x="560" y="72" width="140" height="40" rx="4" fill="#de4226" opacity="0.2" />
      <text x="250" y="98" fill="#303030" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        MARGIN
      </text>
      <text x="410" y="98" fill="#303030" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        QUOTE
      </text>
      <text x="570" y="98" fill="#303030" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        RISK
      </text>
      <rect x="220" y="148" width="676" height="252" rx="4" fill="#fafafa" stroke="#e4e4e4" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          x={260 + i * 72}
          y={280}
          width="48"
          height={60 + (i % 3) * 28}
          rx="3"
          fill={i % 2 === 0 ? "#07b6ef" : "#155079"}
          opacity="0.85"
        />
      ))}
    </svg>
  );
}

/** MagiClick Magiclick-TrustedBy strip — sector labels on cyan band */
export function TrustedIndustriesStrip({ className = "" }: IllustrationProps) {
  return (
    <svg
      className={`img-responsive margin-auto ${className}`}
      viewBox="0 0 1100 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Industries served"
    >
      <rect width="1100" height="72" fill="#07b6ef" />
      {[
        "Construction",
        "Cleaning",
        "Restaurant",
        "E-commerce",
        "CNC & Manufacturing",
      ].map((label, i) => (
        <text
          key={label}
          x={110 + i * 200}
          y="42"
          fill="#ffffff"
          fontSize="15"
          fontWeight="600"
          fontFamily="Open Sans, sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export function ExtendablePlatformIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      className={`img-responsive margin-auto ${className}`}
      viewBox="0 0 720 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
    >
      <rect width="720" height="280" rx="6" fill="#f8f8f8" stroke="#e4e4e4" />
      <rect x="40" y="40" width="200" height="200" rx="8" fill="#07b6ef" opacity="0.15" />
      <rect x="260" y="40" width="200" height="200" rx="8" fill="#7dbb3b" opacity="0.2" />
      <rect x="480" y="40" width="200" height="200" rx="8" fill="#155079" opacity="0.15" />
      <circle cx="140" cy="120" r="40" fill="#07b6ef" opacity="0.5" />
      <rect x="300" y="90" width="120" height="12" rx="4" fill="#303030" opacity="0.3" />
      <rect x="300" y="115" width="90" height="12" rx="4" fill="#303030" opacity="0.2" />
      <rect x="520" y="100" width="100" height="80" rx="4" fill="#155079" opacity="0.4" />
    </svg>
  );
}

export function PillarEngineIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      width={200}
      height={146}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='146'%3E%3Crect fill='%23f0f0f0' width='200' height='146'/%3E%3Crect x='30' y='30' width='60' height='60' fill='%2307b6ef' opacity='0.6'/%3E%3Crect x='110' y='30' width='60' height='60' fill='%2307b6ef' opacity='0.35'/%3E%3C/svg%3E"
    />
  );
}

export function PillarReportIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      width={200}
      height={146}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='146'%3E%3Crect fill='%23f0f0f0' width='200' height='146'/%3E%3Crect x='55' y='20' width='90' height='110' fill='%23fff' stroke='%2307b6ef' stroke-width='2'/%3E%3C/svg%3E"
    />
  );
}

export function PillarSecurityIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      width={200}
      height={146}
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='146'%3E%3Crect fill='%23f0f0f0' width='200' height='146'/%3E%3Cpath fill='%23009644' opacity='0.7' d='M100 30 L130 45 V75 C130 95 100 110 100 110 C100 110 70 95 70 75 V45 Z'/%3E%3C/svg%3E"
    />
  );
}

export function SplitReportIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320'%3E%3Crect fill='%23fff' x='40' y='40' width='320' height='240'/%3E%3C/svg%3E"
    />
  );
}

export function SplitValidationIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320'%3E%3Ccircle cx='200' cy='140' r='80' fill='none' stroke='%23fff' stroke-width='4'/%3E%3C/svg%3E"
    />
  );
}

export function SplitScenarioIllustration({ className = "" }: IllustrationProps) {
  return (
    <img
      className={className}
      alt=""
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320'%3E%3Crect fill='%23fff' x='60' y='120' width='36' height='80' opacity='0.8'/%3E%3Crect fill='%23fff' x='120' y='100' width='36' height='100' opacity='0.8'/%3E%3C/svg%3E"
    />
  );
}
