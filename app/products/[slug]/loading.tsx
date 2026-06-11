/** Product detail skeleton — gallery + info two-column (max-w-6xl, matching the
 *  ProductDetail* components). Collapses to a single column on mobile. */
export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-pulse">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-xl bg-gray-200" />
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-16 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-8 w-4/5 rounded bg-gray-200" />
          <div className="h-7 w-32 rounded bg-gray-200" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-11/12 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="h-11 w-44 rounded-full bg-gray-200" />
          {/* Spec table */}
          <div className="space-y-2 pt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-full rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
