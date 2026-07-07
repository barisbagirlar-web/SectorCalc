/**
 * Premium schema tool detail page loading skeleton.
 * Shows analyzer placeholder while schema and premium data resolve.
 */
export default function PremiumSchemaDetailLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading premium analyzer"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "2rem",
          width: "35%",
          background: "#E0DDD4",
          borderRadius: "6px",
          marginBottom: "0.5rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          height: "1rem",
          width: "55%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Authority block skeleton */}
      <div
        style={{
          height: "6rem",
          background: "#F0EEE6",
          borderRadius: "8px",
          border: "1px solid #E0DDD4",
          marginBottom: "2rem",
        }}
        className="skeleton-pulse"
      />

      {/* Form skeleton */}
      <div
        style={{
          background: "#F0EEE6",
          borderRadius: "8px",
          border: "1px solid #E0DDD4",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
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

      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            height: "2.75rem",
            width: "160px",
            background: "#E0DDD4",
            borderRadius: "6px",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "2.75rem",
            width: "120px",
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
