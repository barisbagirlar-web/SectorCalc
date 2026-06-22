type CalculatorCardIconProps = {
  readonly accent: "blue" | "orange" | "green";
};

export function CalculatorCardIcon({ accent }: CalculatorCardIconProps) {
  const stroke = accent === "orange" ? "#bd5d3a" : accent === "green" ? "#059669" : "#4a5cf5";

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.75" />
      <path d="M8 7h8M8 11h3M13 11h3M8 15h3M13 15h3" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
