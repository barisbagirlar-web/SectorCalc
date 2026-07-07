/**
 * Root loading — wraps content area during initial page load.
 * SiteHeader and EnterpriseFooter are persistent in RootShell (root layout),
 * so this only replaces the inner <main> content area.
 * During client-side navigation, route-specific loading.tsx takes over.
 */
export default function RootLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page">
      {/* Thin top progress indicator */}
      <div
        className="route-loading-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 9999,
          background: "linear-gradient(90deg, #BD5D3A 0%, #E8A87C 50%, #BD5D3A 100%)",
          animation: "loadingShimmer 1.5s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Content skeleton */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "2rem auto",
          padding: "2rem 1.5rem",
        }}
      >
        {/* Hero skeleton */}
        <div
          style={{
            height: "2.5rem",
            width: "40%",
            background: "#E0DDD4",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "1.2rem",
            width: "60%",
            background: "#E0DDD4",
            borderRadius: "4px",
            marginBottom: "2.5rem",
          }}
          className="skeleton-pulse"
        />

        {/* Card grid skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
      </div>

      <style>{`
        @keyframes loadingShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 2s ease-in-out infinite;
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
