import type { Course } from "@/types";
import { CourseCategoryBadge } from "./CourseCategoryBadge";

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Course Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              L-T-P
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Credits
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {course.code}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {course.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {course.lectureHours}-{course.tutorialHours}-
                {course.practicalHours}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                {course.credits}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <CourseCategoryBadge category={course.category} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
