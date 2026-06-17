export function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-3 h-4 w-20 rounded bg-gray-200" />
          <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
          <div className="flex gap-6">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
