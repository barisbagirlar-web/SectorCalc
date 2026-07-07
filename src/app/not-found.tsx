import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: "1.5rem" }}>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: "44px",
          padding: "10px 24px",
          background: "#bd5d3a",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
