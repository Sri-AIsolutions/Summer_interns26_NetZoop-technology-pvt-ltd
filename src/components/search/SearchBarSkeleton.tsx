export default function SearchBarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="status" aria-label="Loading search results">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-14 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
