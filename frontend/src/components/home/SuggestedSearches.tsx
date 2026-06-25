"use client";

interface SuggestedSearchesProps {
  onSelect: (value: string) => void;
}

const suggestions = [
  "Semester 1 courses",
  "How many credits for CSE?",
  "Core Courses",
  "Data Structures",
];

export function SuggestedSearches({ onSelect }: SuggestedSearchesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/20"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
