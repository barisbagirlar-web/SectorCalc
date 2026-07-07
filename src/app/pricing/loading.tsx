/**
 * Pricing page loading skeleton.
 */
export default function PricingLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading pricing"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          height: "2rem",
          width: "25%",
          background: "#E0DDD4",
          borderRadius: "6px",
          marginBottom: "0.75rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          height: "1rem",
          width: "45%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "2.5rem",
        }}
        className="skeleton-pulse"
      />

      {/* Pricing cards skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "350px",
              background: "#F0EEE6",
              borderRadius: "12px",
              border: "1px solid #E0DDD4",
            }}
            className="skeleton-pulse"
          />
        ))}
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
