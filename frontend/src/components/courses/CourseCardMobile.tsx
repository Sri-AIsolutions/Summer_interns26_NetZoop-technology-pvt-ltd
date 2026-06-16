import type { Course } from "@/types";
import { Card } from "@/components/common";
import { CourseCategoryBadge } from "./CourseCategoryBadge";

interface CourseCardMobileProps {
  course: Course;
}

export function CourseCardMobile({ course }: CourseCardMobileProps) {
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{course.code}</p>
          <p className="text-sm text-gray-700">{course.title}</p>
        </div>
        <CourseCategoryBadge category={course.category} />
      </div>
      <p className="text-sm text-gray-500">
        {course.credits} {course.credits === 1 ? "credit" : "credits"}
      </p>
    </Card>
  );
}
