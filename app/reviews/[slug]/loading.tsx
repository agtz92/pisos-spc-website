/** Review detail skeleton (max-w-2xl, matching ReviewDetailCompact). Heading,
 *  rating, cover, verdict, then pros/cons columns. */
export default function ReviewLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 animate-pulse">
      {/* Heading + rating */}
      <div className="mb-5 space-y-3">
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="h-8 w-4/5 rounded bg-gray-200" />
        <div className="h-6 w-28 rounded bg-gray-200" />
      </div>

      {/* Cover */}
      <div className="mb-6 aspect-video w-full rounded-xl bg-gray-200" />

      {/* Body */}
      <div className="mb-8 space-y-3">
        {[100, 95, 88, 70].map((w, i) => (
          <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Pros / cons */}
      <div className="grid gap-6 sm:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-2 rounded-lg border border-gray-200 p-4">
            <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3 w-5/6 rounded bg-gray-200" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
