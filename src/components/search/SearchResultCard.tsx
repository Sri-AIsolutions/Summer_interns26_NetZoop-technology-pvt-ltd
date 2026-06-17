import { SearchResult } from '@/types/course';
import CourseCategoryBadge from '@/components/courses/CourseCategoryBadge';

export default function SearchResultCard({
  result,
}: {
  result: SearchResult;
}) {
  const rankLabel =
    result.rank === 1
      ? 'Exact match'
      : result.rank === 2
        ? 'Alias match'
        : 'Partial match';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {result.course_name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-600">
              {result.course_code}
            </span>
            <CourseCategoryBadge category={result.category} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>{result.credits} credit{result.credits !== 1 ? 's' : ''}</span>
          <span>Semester {result.semester}</span>
        </div>
        <span className="text-gray-400">{rankLabel}</span>
      </div>
    </div>
  );
}
