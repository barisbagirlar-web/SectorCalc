import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Not Found</title>
      </head>
      <body>
        <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link href="/">Go to Homepage</Link>
        </div>
      </body>
    </html>
  );
}
