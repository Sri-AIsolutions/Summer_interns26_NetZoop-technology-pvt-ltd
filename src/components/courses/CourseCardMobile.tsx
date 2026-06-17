import { Course } from '@/types/course';
import Card from '@/components/ui/Card';
import CourseCategoryBadge from './CourseCategoryBadge';

export default function CourseCardMobile({ course }: { course: Course }) {
  return (
    <Card className="space-y-3" role="listitem">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 font-mono">{course.code}</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5">
            {course.name}
          </p>
        </div>
        <CourseCategoryBadge category={course.category} />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">Credits</span>
        <span className="text-sm font-semibold text-gray-900">
          {course.credits}
        </span>
      </div>
    </Card>
  );
}
