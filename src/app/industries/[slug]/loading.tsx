/**
 * Industry detail page loading skeleton.
 * Shows hero placeholder + related tools skeleton while server resolves industry data.
 */
export default function IndustryDetailLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading industry"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Hero skeleton */}
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
          height: "1.2rem",
          width: "50%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Description block */}
      <div
        style={{
          height: "4rem",
          background: "#F0EEE6",
          borderRadius: "8px",
          border: "1px solid #E0DDD4",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Tool cards */}
      <div
        style={{
          height: "1.2rem",
          width: "30%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "180px",
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
