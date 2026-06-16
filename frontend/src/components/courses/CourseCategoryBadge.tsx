import { cn } from "@/lib/utils";
import type { CourseCategory } from "@/types";

interface CourseCategoryBadgeProps {
  category: CourseCategory;
}

const categoryStyles: Record<CourseCategory, string> = {
  Core: "bg-blue-100 text-blue-800",
  Elective: "bg-purple-100 text-purple-800",
  Lab: "bg-green-100 text-green-800",
  Audit: "bg-gray-100 text-gray-800",
};

export function CourseCategoryBadge({ category }: CourseCategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryStyles[category]
      )}
    >
      {category}
    </span>
  );
}
