import type { Course } from "@/types";
import { Card } from "@/components/common";
import { CourseMeta } from "@/components/course/CourseMeta";

interface SearchResultCardProps {
  course: Course;
}

export function SearchResultCard({ course }: SearchResultCardProps) {
  return (
    <Card className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{course.code}</p>
        <p className="text-base font-semibold text-gray-900">
          {course.title}
        </p>
      </div>
      <CourseMeta course={course} />
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
        <span>Semester {course.semester}</span>
        <span>{course.program}</span>
      </div>
    </Card>
  );
}
