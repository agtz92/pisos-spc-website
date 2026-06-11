/** Article-shaped skeleton for a blog post detail render (max-w-4xl, matching
 *  BlogDetail* components) so the layout doesn't shift when content arrives. */
export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 animate-pulse">
      {/* Eyebrow + title */}
      <div className="mb-6 space-y-4">
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="h-9 w-11/12 rounded bg-gray-200" />
        <div className="h-9 w-2/3 rounded bg-gray-200" />
        {/* Byline */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-3 w-40 rounded bg-gray-200" />
        </div>
      </div>

      {/* Cover image */}
      <div className="mb-8 aspect-video w-full rounded-xl bg-gray-200" />

      {/* Body paragraphs */}
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-gray-200"
            style={{ width: `${[100, 96, 88, 92, 70, 100, 84, 95, 60, 90][i]}%` }}
          />
        ))}
      </div>
    </div>
  );
}
