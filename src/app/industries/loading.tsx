/**
 * Industries page loading skeleton.
 * Shows a card grid skeleton while the server computes taxonomy data.
 * SiteHeader remains persistent from RootShell.
 */
export default function IndustriesLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading industries"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Hero / title skeleton */}
      <div
        style={{
          height: "2rem",
          width: "30%",
          background: "#E0DDD4",
          borderRadius: "6px",
          marginBottom: "0.75rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          height: "1rem",
          width: "50%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "1.5rem",
        }}
        className="skeleton-pulse"
      />

      {/* Filter/search bar skeleton */}
      <div
        style={{
          height: "3rem",
          background: "#F0EEE6",
          borderRadius: "8px",
          border: "1px solid #E0DDD4",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Sector card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "200px",
              background: "#F0EEE6",
              borderRadius: "8px",
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
