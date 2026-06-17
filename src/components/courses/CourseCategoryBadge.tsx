import { CourseCategory } from '@/types/course';

const badgeColors: Record<CourseCategory, string> = {
  Core: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  Elective: 'bg-purple-100 text-purple-700 ring-purple-600/20',
  Lab: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  Audit: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

export default function CourseCategoryBadge({
  category,
}: {
  category: CourseCategory;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeColors[category]}`}
    >
      {category}
    </span>
  );
}
