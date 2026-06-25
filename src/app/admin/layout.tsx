import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SectorCalc Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-w-0 min-h-screen overflow-x-hidden bg-white font-sans antialiased">
      {children}
    </div>
  );
}
