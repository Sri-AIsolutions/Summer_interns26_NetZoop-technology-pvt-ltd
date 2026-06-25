import type { Course } from "@/types";
import { SearchResultCard } from "./SearchResultCard";

interface SearchResultsProps {
  results: Course[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const codePattern = /\b[a-z]{1,3}\d{1,4}[a-z]?\d?\b/i;
  const isCodeSearch = codePattern.test(query.trim());

  let exact: Course[] = [];
  let related: Course[] = [];

  if (isCodeSearch) {
    const qUpper = query.trim().toUpperCase();
    exact = results.filter((c) => c.code === qUpper);
    related = results.filter((c) => c.code !== qUpper);
  } else {
    exact = results;
  }

  const showSplit = isCodeSearch && exact.length > 0 && related.length > 0;

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-500">
        Found <span className="font-semibold text-slate-700">{results.length}</span>{" "}
        {results.length === 1 ? "result" : "results"} for
        &ldquo;<span className="font-medium text-slate-800">{query}</span>&rdquo;
      </p>

      {showSplit ? (
        <>
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-brand-500" />
              <h3 className="text-base font-bold text-slate-800">Exact Matches</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {exact.map((course) => (
                <SearchResultCard key={course.id} course={course} query={query} />
              ))}
            </div>
          </section>
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-slate-300" />
              <h3 className="text-base font-bold text-slate-500">Related Results</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((course) => (
                <SearchResultCard key={course.id} course={course} query={query} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((course) => (
            <SearchResultCard key={course.id} course={course} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}
