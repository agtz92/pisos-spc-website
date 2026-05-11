export default function ReviewsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />)}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
