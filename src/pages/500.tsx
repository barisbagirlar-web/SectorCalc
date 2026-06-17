export default function Custom500() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-premium-velvet">500 — Server error</h1>
        <p className="mt-2 text-sm text-body-charcoal">
          Something went wrong. Please try again in a moment.
        </p>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
