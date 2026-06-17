export default function CourseTableFooter({
  totalCredits,
  courseCount,
}: {
  totalCredits: number;
  courseCount: number;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
      <span className="text-sm text-gray-600">
        {courseCount} course{courseCount !== 1 ? 's' : ''}
      </span>
      <span className="text-sm font-semibold text-gray-900">
        Total Credits: {totalCredits}
      </span>
    </div>
  );
}
