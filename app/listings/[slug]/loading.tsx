/** Real-estate listing detail skeleton (max-w-5xl, matching ListingDetail*).
 *  Hero image, key facts row, then description + amenities. */
export default function ListingLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-pulse">
      {/* Title + price */}
      <div className="mb-6 space-y-3">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/2 rounded bg-gray-200" />
        <div className="h-7 w-40 rounded bg-gray-200" />
      </div>

      {/* Hero image */}
      <div className="mb-6 aspect-video w-full rounded-xl bg-gray-200" />

      {/* Key facts */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 rounded-lg border border-gray-200 p-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-5 w-10 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-3">
        {[100, 94, 88, 96, 70].map((w, i) => (
          <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
