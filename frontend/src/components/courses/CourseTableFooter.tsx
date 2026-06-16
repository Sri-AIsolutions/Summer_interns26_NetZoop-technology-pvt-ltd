interface CourseTableFooterProps {
  totalCredits: number;
  courseCount: number;
}

export function CourseTableFooter({
  totalCredits,
  courseCount,
}: CourseTableFooterProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-4">
      <p className="text-sm text-gray-700">
        <span className="font-medium">{courseCount}</span>{" "}
        {courseCount === 1 ? "course" : "courses"} —{" "}
        <span className="font-medium">{totalCredits}</span> total credits
      </p>
    </div>
  );
}
