export default function CourseTableSkeleton() {
  const rows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Code', 'Course Name', 'Credits', 'Category'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4].map((j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="sm:hidden space-y-3">
        {rows.map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 space-y-3"
          >
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-6 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
