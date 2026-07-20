/**
 * Free tool detail page loading skeleton.
 * Height budget mirrors FREE_COMPACT hero + input card to reduce CLS on swap.
 */
export default function FreeToolDetailLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading tool"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        minHeight: "640px",
        boxSizing: "border-box",
      }}
    >
      {/* Hero: title + clamped scope (matches FREE_COMPACT LCP layout) */}
      <div
        style={{
          minHeight: "108px",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "2.5rem",
            width: "55%",
            maxWidth: "420px",
            background: "#E0DDD4",
            marginBottom: "0.75rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "2.9em",
            width: "92%",
            background: "#E0DDD4",
          }}
          className="skeleton-pulse"
        />
      </div>

      {/* Input form skeleton */}
      <div
        style={{
          background: "#F0EEE6",
          border: "1px solid #E0DDD4",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          minHeight: "280px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "1.2rem",
            width: "25%",
            background: "#E0DDD4",
            marginBottom: "1.25rem",
          }}
          className="skeleton-pulse"
        />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "3.5rem",
              background: "#fff",
              border: "1px solid #E0DDD4",
              marginBottom: "0.75rem",
            }}
            className="skeleton-pulse"
          />
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "1rem", minHeight: "48px" }}>
        <div
          style={{
            height: "2.75rem",
            width: "140px",
            background: "#E0DDD4",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "2.75rem",
            width: "100px",
            background: "#E0DDD4",
          }}
          className="skeleton-pulse"
        />
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
