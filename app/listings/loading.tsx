export default function ListingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex gap-3">
        {[1,2].map(i => <div key={i} className="h-9 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />)}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
