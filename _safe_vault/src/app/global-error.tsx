"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: "42rem", margin: "4rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>SectorCalc is temporarily unavailable</h1>
          <p style={{ marginTop: "0.75rem", lineHeight: 1.6 }}>
            A client error occurred while loading this page. Please retry or visit the homepage.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{ minHeight: "44px", padding: "0.5rem 1rem", fontWeight: 600 }}
            >
              Try again
            </button>
            {/* global-error renders outside App Router providers — plain anchor is intentional */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ minHeight: "44px", display: "inline-flex", alignItems: "center", padding: "0.5rem 1rem" }}>
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
