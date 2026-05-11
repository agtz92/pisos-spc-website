export default function BlogLoading() {
  return (
    <div className="animate-pulse">
      {/* Filter nav skeleton */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[80, 96, 72, 64, 88].map((w, i) => (
          <div key={i} className="h-7 rounded-full bg-gray-200" style={{ width: w }} />
        ))}
      </div>

      {/* Featured post skeleton */}
      <div className="mb-10 border border-gray-200 rounded-xl overflow-hidden">
        <div className="aspect-video bg-gray-200 w-full" />
        <div className="p-5 space-y-3">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* More articles label */}
      <div className="h-3 w-28 bg-gray-200 rounded mb-4" />

      {/* Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="aspect-video bg-gray-200 w-full" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-4/5 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
