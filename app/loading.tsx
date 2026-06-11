/**
 * Root-level loading fallback. Acts as the catch-all Suspense skeleton for any
 * route without a closer ``loading.tsx`` — home, ``[rootSlug]``, ``lp``, ``u``
 * and ``categories``. Section list/detail routes define their own. Shown only
 * on an uncached (on-demand) render, e.g. first visit or after a tag is
 * invalidated, which is exactly when the backend round-trip is slow.
 */
export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-pulse">
      {/* Hero block */}
      <div className="mb-10 space-y-4">
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="h-10 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-10 w-40 rounded-full bg-gray-200" />
      </div>

      {/* Content grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="aspect-video w-full bg-gray-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-4/5 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
