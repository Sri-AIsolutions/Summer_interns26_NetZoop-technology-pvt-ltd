'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResult } from '@/types/course';
import PageContainer from '@/components/ui/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/search/SearchBar';
import SearchResultList from '@/components/search/SearchResultList';
import SearchBarSkeleton from '@/components/search/SearchBarSkeleton';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  const handleResults = useCallback((r: SearchResult[]) => {
    setResults(r);
  }, []);

  const handleLoading = useCallback((l: boolean) => {
    setLoading(l);
  }, []);

  const handleError = useCallback((e: string | null) => {
    setError(e);
  }, []);

  const handleQueryChange = useCallback((q: string) => {
    setCurrentQuery(q);
  }, []);

  return (
    <PageContainer>
      <SectionHeader
        title="Search Courses"
        description="Find courses by name, code, or abbreviation."
      />

      <SearchBar
        initialQuery={initialQuery}
        onResults={handleResults}
        onLoading={handleLoading}
        onError={handleError}
        onQueryChange={handleQueryChange}
      />

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 mb-6"
          role="alert"
        >
          <p className="text-sm font-medium text-red-800">
            Search is temporarily unavailable. Please try again.
          </p>
        </div>
      )}

      {loading && <SearchBarSkeleton />}

      {!loading && !error && currentQuery.length >= 2 && results.length === 0 && (
        <EmptyState
          title={`No courses found for "${currentQuery}"`}
          description="Try a different name, code, or abbreviation."
        />
      )}

      {!loading && !error && results.length > 0 && (
        <SearchResultList results={results} query={currentQuery} />
      )}
    </PageContainer>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<PageContainer><div className="h-96" /></PageContainer>}>
      <SearchPageContent />
    </Suspense>
  );
}
