import Link from "next/link";
import type { Course } from "@/types";
import { Card } from "@/components/common";
import { CourseMeta } from "@/components/course/CourseMeta";

interface CourseCardMobileProps {
  course: Course;
}

function getProgramId(program: string): string {
  return program.toLowerCase().includes("computer") ? "cse" : "ece";
}

export function CourseCardMobile({ course }: CourseCardMobileProps) {
  return (
    <Link
      href={`/courses/${course.code}?program=${getProgramId(course.program)}`}
      className="block group"
    >
      <Card className="relative space-y-3 overflow-hidden border-t-4 border-t-brand-500 transition-all group-hover:border-brand-400 group-hover:shadow-elevated">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs font-semibold text-brand-600">
              {course.code}
            </p>
            <p className="mt-0.5 text-base font-bold text-slate-900">
              {course.title}
            </p>
          </div>
          <span className="inline-block shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {course.category}
          </span>
        </div>
        <CourseMeta course={course} />
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Semester {course.semester}</span>
          <span className="text-slate-300">|</span>
          <span>{course.department}</span>
        </div>
      </Card>
    </Link>
  );
}
