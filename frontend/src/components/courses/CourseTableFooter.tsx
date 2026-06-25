import type { Course } from "@/types";

interface CourseTableFooterProps {
  totalCredits: number;
  courseCount: number;
  courses?: Course[];
}

export function CourseTableFooter({
  totalCredits,
  courseCount,
  courses,
}: CourseTableFooterProps) {
  const core = courses?.filter((c) => c.category === "Core").length ?? 0;
  const elective = courses?.filter((c) => c.category === "Elective").length ?? 0;
  const lab = courses?.filter((c) => c.category === "Lab").length ?? 0;

  return (
    <div className="rounded-card border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{courseCount}</span>{" "}
          {courseCount === 1 ? "course" : "courses"} &mdash;{" "}
          <span className="font-semibold text-slate-900">{totalCredits}</span>{" "}
          total credits
        </p>
        {courses && courses.length > 0 && (
          <p className="text-xs text-slate-400">
            {core} Core{elective > 0 && ` \u00B7 ${elective} Elective`}
            {lab > 0 && ` \u00B7 ${lab} Lab`}
          </p>
        )}
      </div>
    </div>
  );
}
