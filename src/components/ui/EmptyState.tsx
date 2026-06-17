interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters or selecting a different semester.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-base font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 max-w-sm text-center">
        {description}
      </p>
    </div>
  );
}
