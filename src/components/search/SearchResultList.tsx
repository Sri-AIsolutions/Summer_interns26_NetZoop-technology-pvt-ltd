import { SearchResult } from '@/types/course';
import SearchResultCard from './SearchResultCard';

export default function SearchResultList({
  results,
  query,
}: {
  results: SearchResult[];
  query: string;
}) {
  if (results.length === 0) return null;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing results for &quot;{query}&quot;
      </p>
      <div
        role="list"
        aria-busy="false"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {results.map((result) => (
          <div key={result.course_id} role="listitem">
            <SearchResultCard result={result} />
          </div>
        ))}
      </div>
    </div>
  );
}
