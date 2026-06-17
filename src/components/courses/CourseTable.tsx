import { Course } from '@/types/course';
import CourseCategoryBadge from './CourseCategoryBadge';
import CourseCardMobile from './CourseCardMobile';

export default function CourseTable({ courses, caption }: { courses: Course[]; caption?: string }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            {caption && (
              <caption className="sr-only">
                {caption}
              </caption>
            )}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CourseCategoryBadge category={course.category} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3" role="list" aria-label={caption}>
        {courses.map((course) => (
          <CourseCardMobile key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
