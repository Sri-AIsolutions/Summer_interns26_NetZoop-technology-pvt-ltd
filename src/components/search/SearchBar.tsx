'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchResult } from '@/types/course';

interface SearchBarProps {
  initialQuery?: string;
  onResults: (results: SearchResult[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onQueryChange: (query: string) => void;
}

export default function SearchBar({
  initialQuery = '',
  onResults,
  onLoading,
  onError,
  onQueryChange,
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        onResults([]);
        onLoading(false);
        onError(null);
        return;
      }

      onLoading(true);
      onError(null);

      try {
        const { searchCourses } = await import('@/services/courseService');
        const results = await searchCourses(q);
        onResults(results);
      } catch (e) {
        onError(
          e instanceof Error ? e.message : 'Search failed'
        );
        onResults([]);
      } finally {
        onLoading(false);
      }
    },
    [onResults, onLoading, onError]
  );

  const debouncedSearch = useCallback(
    (q: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        performSearch(q);
      }, 300);
    },
    [performSearch]
  );

  useEffect(() => {
    if (initialQuery) {
      setValue(initialQuery);
      debouncedSearch(initialQuery);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onQueryChange(newValue);

    if (newValue.length === 0) {
      setShowHint(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      onResults([]);
      onLoading(false);
      onError(null);
      return;
    }

    if (newValue.length < 2) {
      setShowHint(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      onResults([]);
      onLoading(false);
      onError(null);
      return;
    }

    setShowHint(false);
    debouncedSearch(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timerRef.current) clearTimeout(timerRef.current);
      performSearch(value);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleClear = () => {
    setValue('');
    setShowHint(false);
    onQueryChange('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onResults([]);
    onLoading(false);
    onError(null);
    inputRef.current?.focus();
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Search courses"
          placeholder='Search by course name, code, or abbreviation (e.g. "CSE", "B.Tech AI")'
          className="block w-full rounded-xl border border-gray-300 bg-white pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-shadow"
        />

        {value.length > 0 && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {showHint && (
        <p className="mt-1.5 text-xs text-gray-400">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}
