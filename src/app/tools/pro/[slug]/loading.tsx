/**
 * Pro tool detail page loading skeleton.
 * Shows form-like placeholder while schema resolves and form hydrates.
 */
export default function ProToolDetailLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading tool"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Tool header */}
      <div
        style={{
          height: "1.8rem",
          width: "40%",
          background: "#E0DDD4",
          borderRadius: "6px",
          marginBottom: "0.5rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          height: "0.9rem",
          width: "60%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Input form skeleton */}
      <div
        style={{
          background: "#F0EEE6",
          borderRadius: "8px",
          border: "1px solid #E0DDD4",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            height: "1.2rem",
            width: "25%",
            background: "#E0DDD4",
            borderRadius: "4px",
            marginBottom: "1.25rem",
          }}
          className="skeleton-pulse"
        />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "3.5rem",
              background: "#fff",
              borderRadius: "6px",
              border: "1px solid #E0DDD4",
              marginBottom: "0.75rem",
            }}
            className="skeleton-pulse"
          />
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            height: "2.75rem",
            width: "140px",
            background: "#E0DDD4",
            borderRadius: "6px",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "2.75rem",
            width: "100px",
            background: "#E0DDD4",
            borderRadius: "6px",
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
