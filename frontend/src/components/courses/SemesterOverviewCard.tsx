import type { CourseCategory } from "@/types";

interface SemesterOverviewCardProps {
  semester: number;
  totalCredits: number;
  courseCount: number;
  courses: { category: CourseCategory }[];
}

export function SemesterOverviewCard({
  semester,
  totalCredits,
  courseCount,
  courses,
}: SemesterOverviewCardProps) {
  const coreCount = courses.filter((c) => c.category === "Core").length;
  const electiveCount = courses.filter((c) => c.category === "Elective").length;
  const labCount = courses.filter((c) => c.category === "Lab").length;
  const auditCount = courses.filter((c) => c.category === "Audit").length;

  const breakdown = [
    { count: coreCount, label: "Core", color: "bg-brand-500" },
    { count: electiveCount, label: "Elective", color: "bg-purple-500" },
    { count: labCount, label: "Lab", color: "bg-emerald-500" },
    { count: auditCount, label: "Audit", color: "bg-slate-400" },
  ].filter((b) => b.count > 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="pointer-events-none absolute -bottom-6 -right-6 select-none text-[120px] font-black leading-none text-slate-100">
        {semester}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Semester {semester}
        </p>
        <p className="mt-1 text-3xl font-black text-slate-900">
          {totalCredits} credits
        </p>
        <p className="text-sm text-slate-500">
          {courseCount} course{courseCount !== 1 ? "s" : ""}
        </p>
        {breakdown.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {breakdown.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                {b.count} {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
