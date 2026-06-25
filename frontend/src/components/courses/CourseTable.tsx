import Link from "next/link";
import type { Course } from "@/types";

interface CourseTableProps {
  courses: Course[];
}

function getProgramId(program: string): string {
  return program.toLowerCase().includes("computer") ? "cse" : "ece";
}

export function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Code
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Course Name
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Type
            </th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              L-T-P
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Credits
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {courses.map((course, idx) => (
            <tr
              key={course.id}
              className={`transition-colors hover:bg-brand-50/40 ${idx % 2 === 1 ? "bg-slate-50/40" : ""}`}
            >
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/courses/${course.code}?program=${getProgramId(course.program)}`}
                  className="font-mono text-sm font-bold text-slate-900 hover:text-brand-500 transition-colors"
                >
                  {course.code}
                </Link>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/courses/${course.code}?program=${getProgramId(course.program)}`}
                  className="text-sm text-slate-600 hover:text-brand-500 transition-colors"
                >
                  {course.title}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="inline-block rounded-md bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  {course.category}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-500">
                {course.lectureHours}-{course.tutorialHours}-{course.practicalHours}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                {course.credits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
