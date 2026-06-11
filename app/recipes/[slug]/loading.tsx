/** Recipe detail skeleton (max-w-3xl, matching RecipeDetailStandard). Cover,
 *  meta chips (prep/cook/servings), ingredients list, then steps. */
export default function RecipeLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 animate-pulse">
      {/* Title */}
      <div className="mb-5 space-y-3">
        <div className="h-9 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Meta chips */}
      <div className="mb-6 flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-gray-200" />
        ))}
      </div>

      {/* Cover */}
      <div className="mb-8 aspect-video w-full rounded-xl bg-gray-200" />

      {/* Ingredients */}
      <div className="mb-8 space-y-2">
        <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-3/4 rounded bg-gray-200" />
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <div className="mb-3 h-5 w-28 rounded bg-gray-200" />
        {[100, 92, 88, 95].map((w, i) => (
          <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
