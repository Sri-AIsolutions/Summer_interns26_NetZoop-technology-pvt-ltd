import type { Course } from "@/types";
import { Card } from "@/components/common";
import { CourseMeta } from "@/components/course/CourseMeta";

interface CourseCardMobileProps {
  course: Course;
}

export function CourseCardMobile({ course }: CourseCardMobileProps) {
  return (
    <Card className="space-y-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{course.code}</p>
        <p className="text-sm text-gray-700">{course.title}</p>
      </div>
      <CourseMeta course={course} />
    </Card>
  );
}
