import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: ReactNode;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
